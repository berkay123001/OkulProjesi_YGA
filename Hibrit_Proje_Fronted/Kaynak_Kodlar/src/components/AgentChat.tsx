import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, Search, Link as LinkIcon, ShieldCheck, CheckCircle2, AlertTriangle, FileText, GitBranch, ArrowRight, Check, Circle, Activity } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { ViewType, Message, ChatSession, PipelineStep } from '@/types';

interface AgentChatProps {
  view: ViewType;
  activeSession: ChatSession | null;
  onUpdateMessages: (sessionId: string, messages: Message[], title?: string) => void;
}

export const AgentChat: React.FC<AgentChatProps> = ({ view, activeSession, onUpdateMessages }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isFullPage = view === 'agent_chat';
  const allMessages = activeSession?.messages || [];
  const messages = view === 'summary' ? allMessages.slice(-1) : allMessages;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const getAgentInfo = (content: string) => {
    if (content.toLowerCase().includes('kimlik') || content.toLowerCase().includes('sherlock')) {
      return { name: 'IdentityAgent', role: 'Kimlik Uzmanı (MiniMax-M2.5)', icon: Search, status: 'Doğrulandı', statusType: 'success' as const };
    }
    if (content.toLowerCase().includes('görsel') || content.toLowerCase().includes('medya') || content.toLowerCase().includes('resim')) {
      return { name: 'MediaAgent', role: 'Medya Uzmanı (MiniMax-M2.5)', icon: Search, status: 'Analiz Edildi', statusType: 'success' as const };
    }
    if (content.toLowerCase().includes('akademik') || content.toLowerCase().includes('makale')) {
      return { name: 'AcademicAgent', role: 'Akademik Uzman (MiniMax-M2.5)', icon: FileText, status: 'Taraması Bitti', statusType: 'success' as const };
    }
    return { name: 'Supervisor', role: 'Koordinatör (Qwen3.6-Plus)', icon: Bot, status: 'Sentezleniyor...', statusType: 'info' as const };
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
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResponses = [
        "Supervisor ajan isteği aldı ve **IdentityAgent**'a devretti. Sherlock ve Holehe araçlarıyla yapılan tarama sonucunda kullanıcıya ait 3 platform profili bulundu. Strateji ajanı sonuçları doğruladı.",
        "Medya ajanı görseli `reverse_image_search` aracıyla taradı. Planlama aşamasında belirtilen manipülasyon riskleri incelendi ve orijinal görselle %98 eşleşme sağlandı.",
        "Akademik ajan `search_academic_papers` aracıyla son 5 yılı taradı. İlgili yazarın 12 makalesi tespit edildi ve intihal kontrolünden geçirildi."
      ];
      
      const responseText = mockResponses[Math.floor(Math.random() * mockResponses.length)] + "\n\n*(Sistem Notu: Çoklu-ajan boru hattı simülasyonu)*";
      const agentInfo = getAgentInfo(responseText);

      // Create a mock pipeline for visualization
      const mockPipeline: PipelineStep[] = [
        { id: '1', label: 'Planla', status: 'completed', agent: 'DeepSeek-V3.2' },
        { id: '2', label: 'Görev Devri', status: 'completed', agent: 'Supervisor → ' + agentInfo.name },
        { id: '3', label: 'Araç Çalıştırma', status: 'completed', agent: agentInfo.name },
        { id: '4', label: 'İncele', status: 'completed', agent: 'DeepSeek-V3.2' },
        { id: '5', label: 'Sentezle', status: 'active', agent: 'Supervisor' }
      ];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agentName: agentInfo.name,
        agentRole: agentInfo.role,
        status: agentInfo.status,
        statusType: agentInfo.statusType,
        pipeline: mockPipeline
      };

      onUpdateMessages(activeSession.id, [...updatedMessages, assistantMessage]);
    } catch (error) {
      console.error("Agent Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getThemeStyles = () => {
    return {
      container: isFullPage ? "bg-gray-50/50" : "bg-white border-l border-gray-100",
      header: "text-gray-900 font-sans border-b border-gray-100 bg-white",
      userBubble: "bg-blue-600 text-white shadow-sm",
      botBubble: "bg-white border border-gray-100 text-gray-800 shadow-sm",
      input: "bg-white border border-gray-200 text-gray-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 shadow-sm",
      button: "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200"
    };
  };

  const styles = getThemeStyles();

  const renderStatusBadge = (status?: string, type?: string) => {
    if (!status) return null;
    return (
      <div className={cn(
        "flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider",
        type === 'success' ? "bg-green-50 text-green-600 border border-green-100" :
        type === 'warning' ? "bg-orange-50 text-orange-600 border border-orange-100" :
        "bg-blue-50 text-blue-600 border border-blue-100"
      )}>
        {type === 'info' && <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />}
        {status}
      </div>
    );
  };

  const renderPipelineTimeline = (pipeline?: PipelineStep[]) => {
    if (!pipeline || pipeline.length === 0) return null;
    
    return (
      <div className="mt-4 pt-4 border-t border-gray-100 bg-gray-50/50 -mx-4 -mb-4 p-4 rounded-b-2xl">
        <div className="flex items-center gap-1.5 mb-4">
          <GitBranch className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">İşlem Boru Hattı (Pipeline)</span>
        </div>
        <div className={cn(
          "flex items-start justify-between relative",
          isFullPage ? "gap-2" : "flex-col gap-4 pl-2"
        )}>
          {isFullPage && (
            <div className="absolute top-[11px] left-8 right-8 h-0.5 bg-blue-100 -z-10" />
          )}
          
          {pipeline.map((step, idx) => {
            const isCompleted = step.status === 'completed';
            const isActive = step.status === 'active';
            
            return (
              <div key={step.id} className={cn(
                "flex relative z-10 group",
                isFullPage ? "flex-col items-center text-center w-full" : "flex-row items-center gap-4 w-full"
              )}>
                {!isFullPage && idx !== pipeline.length - 1 && (
                  <div className="absolute left-2.5 top-6 bottom-[-16px] w-0.5 bg-blue-100 -z-10" />
                )}
                
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all border-2",
                  isCompleted ? "bg-blue-600 border-blue-600 text-white" : 
                  isActive ? "bg-white border-blue-600 text-blue-600 shadow-md shadow-blue-200" : "bg-white border-gray-200 text-gray-300",
                  "group-hover:scale-110"
                )}>
                  {isCompleted ? <Check className="w-3 h-3" /> : 
                   isActive ? <Activity className="w-3 h-3 animate-pulse" /> : <Circle className="w-2 h-2" />}
                </div>
                
                <div className={cn(
                  "flex flex-col bg-white p-2 rounded-lg border border-gray-100 shadow-sm min-w-[120px]",
                  isFullPage ? "mt-3 items-center" : "items-start"
                )}>
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-wider",
                    isActive || isCompleted ? "text-gray-800" : "text-gray-400"
                  )}>{step.label}</span>
                  {step.agent && (
                    <span className="text-[9px] font-bold text-blue-600 mt-0.5 whitespace-nowrap bg-blue-50 px-1.5 py-0.5 rounded">
                      {step.agent}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={cn("flex flex-col h-full w-full relative", styles.container)}>
      <div className={cn("p-4 flex items-center justify-between z-10 shrink-0", styles.header)}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
            <Bot className={cn("w-5 h-5 text-blue-600")} />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-wide">
              {isFullPage ? "Çoklu-Ajan İşlem Merkezi" : "Ajan İşlem Akışı"}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Supervisor & Alt-Ajan Ağı Aktif</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden flex justify-center">
        <div ref={scrollRef} className={cn(
          "absolute inset-0 overflow-y-auto p-4 space-y-6 custom-scrollbar",
          isFullPage ? "max-w-4xl mx-auto px-8" : ""
        )}>
          {view === 'summary' && allMessages.length > 1 && (
            <div className="text-center mb-4">
              <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
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
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex flex-col",
                    isFullPage ? "max-w-[90%]" : "max-w-[95%]",
                    msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                  )}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-2 px-1">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100 shadow-sm">
                        <AgentIcon className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-900">{msg.agentName || agentInfo?.name}</span>
                          {renderStatusBadge(msg.status || agentInfo?.status, msg.statusType || agentInfo?.statusType)}
                        </div>
                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{msg.agentRole || agentInfo?.role}</span>
                      </div>
                    </div>
                  )}

                  <div className={cn(
                    "p-4 rounded-2xl text-sm relative group",
                    msg.role === 'user' ? styles.userBubble : styles.botBubble,
                    msg.role === 'user' ? "rounded-tr-sm" : "rounded-tl-sm"
                  )}>
                    <div className="markdown-body text-[13px] leading-relaxed">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                    
                    {/* Render the pipeline timeline if exists and it's an assistant message */}
                    {msg.role === 'assistant' && renderPipelineTimeline(msg.pipeline)}

                    <div className={cn(
                      "text-[9px] mt-2 text-right font-bold tracking-widest uppercase",
                      msg.role === 'user' ? "text-blue-200" : "text-gray-400"
                    )}>
                      {msg.timestamp}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {isLoading && (
            <div className="flex items-center gap-3 text-[11px] font-bold text-gray-500 uppercase tracking-widest px-2 py-4">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span className="animate-pulse">Supervisor ajan görevlendiriyor ve planlıyor...</span>
            </div>
          )}
        </div>
      </div>

      <div className={cn("p-4 border-t border-gray-100 shrink-0 flex justify-center", isFullPage ? "bg-white" : "bg-gray-50/50")}>
        <div className={cn("relative w-full", isFullPage ? "max-w-4xl" : "")}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Sorgu girin veya yeni analiz başlatın..."
            className={cn(
              "w-full pl-4 pr-12 py-3.5 rounded-xl text-sm outline-none transition-all",
              styles.input
            )}
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-lg transition-colors",
              styles.button,
              isLoading && "opacity-50 cursor-not-allowed"
            )}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
