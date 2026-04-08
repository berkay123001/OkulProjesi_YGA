import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { AnalysisPanel } from './components/AnalysisPanel';
import { AgentChat } from './components/AgentChat';
import { ChatHistory } from './components/ChatHistory';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { ViewType, ChatSession, Message } from './types';
import { cn } from './lib/utils';
import { Bell } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<ViewType>('summary');
  
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('cyberguard_chats');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    const saved = localStorage.getItem('cyberguard_active_chat');
    return saved || '';
  });

  useEffect(() => {
    localStorage.setItem('cyberguard_chats', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('cyberguard_active_chat', activeSessionId);
  }, [activeSessionId]);

  const startNewChat = () => {
    const newId = Date.now().toString();
    const newSession: ChatSession = {
      id: newId,
      title: 'Yeni Analiz Sorgusu',
      messages: [
        {
          id: '1',
          role: 'assistant',
          content: 'Merhaba, ben Siber Güvenlik Analiz Asistanı. Size nasıl yardımcı olabilirim?',
          timestamp: new Date().toLocaleTimeString(),
        }
      ],
      lastUpdated: new Date().toLocaleTimeString(),
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newId);
  };

  useEffect(() => {
    if (sessions.length === 0) {
      startNewChat();
    } else if (!activeSessionId) {
      setActiveSessionId(sessions[0].id);
    }
  }, []);

  const deleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    if (activeSessionId === id) {
      const remaining = sessions.filter(s => s.id !== id);
      if (remaining.length > 0) {
        setActiveSessionId(remaining[0].id);
      } else {
        startNewChat();
      }
    }
  };

  const updateSessionMessages = (sessionId: string, messages: Message[], title?: string) => {
    setSessions(prev => prev.map(s => {
      if (s.id === sessionId) {
        return {
          ...s,
          title: title || s.title,
          messages,
          lastUpdated: new Date().toLocaleTimeString(),
        };
      }
      return s;
    }));
  };

  const getThemeStyles = () => {
    return "bg-white text-gray-900 font-sans";
  };

  return (
    <div className={cn("flex h-screen w-full overflow-hidden transition-colors duration-500", getThemeStyles())}>
      {/* LEFT COLUMN: Sidebar */}
      <div className="w-[18%] flex flex-col border-r border-gray-100 h-full overflow-hidden shrink-0">
        <Sidebar view={view} />
      </div>

      {/* MAIN AREA */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-white">
        {/* Header */}
        <header className="h-14 px-6 flex items-center justify-between shrink-0 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-4">
            <ThemeSwitcher currentView={view} onViewChange={setView} />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 rounded-full hover:bg-gray-50 transition-colors group">
              <Bell className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full" />
            </button>

            <div className="flex items-center gap-4 border-l border-gray-100 pl-6">
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-900">Dilan Çiçek</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                </div>
                <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">Çevrimiçi</span>
              </div>
              <div className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-200 bg-gray-50">
                <span className="text-xs font-bold text-gray-400">DÇ</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Analysis Panel (Center) */}
          <div className="flex-1 overflow-hidden h-full border-r border-gray-100">
            <AnalysisPanel view={view} />
          </div>

          {/* Agent Chat (Right) */}
          <div className="w-[300px] overflow-hidden h-full shrink-0">
            <AgentChat 
              view={view} 
              activeSession={sessions.find(s => s.id === activeSessionId) || null}
              onUpdateMessages={updateSessionMessages}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
