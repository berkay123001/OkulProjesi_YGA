import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, History, X, Bot, Search, Link as LinkIcon, ShieldCheck, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { ViewType, Message, ChatSession } from '@/src/types';

interface AgentChatProps {
  view: ViewType;
  activeSession: ChatSession | null;
  onUpdateMessages: (sessionId: string, messages: Message[], title?: string) => void;
}

export const AgentChat: React.FC<AgentChatProps> = ({ view, activeSession, onUpdateMessages }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });
  const allMessages = activeSession?.messages || [];
  
  // Summary view: show only the last message
  const messages = view === 'summary' ? allMessages.slice(-1) : allMessages;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const getAgentInfo = (content: string) => {
    if (content.toLowerCase().includes('görsel') || content.toLowerCase().includes('manipülasyon')) {
      return { name: 'Görsel Analiz Uzmanı', role: 'Analist', icon: Search, status: 'Veri Doğrulandı ✅', statusType: 'success' as const };
    }
    if (content.toLowerCase().includes('blockchain') || content.toLowerCase().includes('cüzdan')) {
      return { name: 'Blockchain Gözlemcisi', role: 'Gözlemci', icon: LinkIcon, status: 'Risk Saptandı ⚠️', statusType: 'warning' as const };
    }
    return { name: 'Sistem Ajanı', role: 'Koordinatör', icon: Bot, status: 'Analiz Ediliyor...', statusType: 'info' as const };
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading || !activeSession) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const isFirstMessage = allMessages.length <= 1;
    const newTitle = isFirstMessage ? (input.length > 30 ? input.substring(0, 30) + '...' : input) : undefined;
    
    const updatedMessages = [...allMessages, userMessage];
    onUpdateMessages(activeSession.id, updatedMessages, newTitle);

    setInput('');
    setIsLoading(true);

    try {
      const historyContents = allMessages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));
      
      historyContents.push({
        role: 'user',
        parts: [{ text: input }]
      });

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: historyContents,
        config: {
          systemInstruction: "Sen bir siber güvenlik uzmanı asistanısın. Kullanıcının analiz taleplerini profesyonel ve teknik bir dille yanıtla. Türkçe konuş.",
        },
      });

      const agentInfo = getAgentInfo(response.text || '');
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text || 'Üzgünüm, bir hata oluştu.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agentName: agentInfo.name,
        agentRole: agentInfo.role,
        status: agentInfo.status,
        statusType: agentInfo.statusType,
      };

      onUpdateMessages(activeSession.id, [...updatedMessages, assistantMessage]);
    } catch (error) {
      console.error("Gemini Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getThemeStyles = () => {
    return {
      container: "bg-white border-l border-gray-100",
      header: "text-gray-900 font-sans border-b border-gray-100",
      userBubble: "bg-blue-600 text-white shadow-sm shadow-blue-100",
      botBubble: "bg-slate-50 border border-gray-100 text-gray-700",
      input: "bg-gray-50 border-gray-100 text-gray-900 focus:border-blue-600 focus:bg-white",
      button: "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200"
    };
  };

  const styles = getThemeStyles();

  const renderStatusBadge = (status?: string, type?: string) => {
    if (!status) return null;
    return (
      <div className={cn(
        "flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-tighter",
        type === 'success' ? "bg-green-50 text-green-600 border border-green-100" :
        type === 'warning' ? "bg-orange-50 text-orange-600 border border-orange-100" :
        "bg-blue-50 text-blue-600 border border-blue-100"
      )}>
        {type === 'info' && <div className="w-1 h-1 rounded-full bg-blue-600 animate-pulse" />}
        {status}
      </div>
    );
  };

  return (
    <div className={cn("flex flex-col h-full w-full relative", styles.container)}>
      <div className={cn("p-3 flex items-center justify-between z-10 shrink-0", styles.header)}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
            <Loader2 className={cn("w-4 h-4 text-blue-600", isLoading && "animate-spin")} />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Ajan İşlem Akışı
            </h3>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[9px] font-bold text-green-600 uppercase tracking-tighter">● Canlı Veri Akışı Aktif</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden">
        <div ref={scrollRef} className="absolute inset-0 overflow-y-auto p-3 space-y-5 custom-scrollbar">
          {view === 'summary' && allMessages.length > 1 && (
            <div className="text-center mb-2">
              <span className="text-[9px] opacity-30 bg-black/10 px-2 py-0.5 rounded-full">
                Önceki {allMessages.length - 1} mesaj gizlendi
              </span>
            </div>
          )}
          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              const agentInfo = msg.role === 'assistant' ? getAgentInfo(msg.content) : null;
              const AgentIcon = agentInfo?.icon || Bot;

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex flex-col max-w-[95%]",
                    msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                  )}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-1.5 px-1">
                      <div className="w-5 h-5 rounded-md bg-gray-100 flex items-center justify-center">
                        <AgentIcon className="w-3 h-3 text-gray-500" />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-gray-900">{msg.agentName || agentInfo?.name}</span>
                          {renderStatusBadge(msg.status || agentInfo?.status, msg.statusType || agentInfo?.statusType)}
                        </div>
                        <span className="text-[8px] text-gray-400 font-medium uppercase tracking-widest">{msg.agentRole || agentInfo?.role}</span>
                      </div>
                    </div>
                  )}

                  <div className={cn(
                    "p-3 rounded-2xl text-xs relative group",
                    msg.role === 'user' ? styles.userBubble : styles.botBubble
                  )}>
                    <div className="markdown-body">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                    <div className={cn(
                      "text-[8px] mt-1.5 text-right opacity-40 font-medium",
                      msg.role === 'user' ? "text-white" : "text-gray-500"
                    )}>
                      {msg.timestamp}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {isLoading && (
            <div className="flex items-center gap-2 text-[10px] opacity-40 px-2">
              <Loader2 className="w-2.5 h-2.5 animate-spin" />
              <span>Analiz ediliyor...</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-3 border-t border-gray-100 shrink-0">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Sorgu girin..."
            className={cn(
              "w-full pl-3 pr-10 py-2.5 rounded-xl text-xs outline-none transition-all",
              styles.input
            )}
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className={cn(
              "absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors",
              styles.button
            )}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
