import React from 'react';
import { MessageSquare, Plus, Clock, Trash2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { ViewType, ChatSession } from '@/src/types';

interface ChatHistoryProps {
  view: ViewType;
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({ 
  view, 
  sessions, 
  activeSessionId, 
  onSelectSession, 
  onNewChat,
  onDeleteSession
}) => {
  const getThemeStyles = () => {
    switch (view) {
      case 'detail':
        return {
          container: "bg-elite-bg/50",
          item: "text-gray-400 hover:text-elite-accent hover:bg-white/5",
          active: "text-elite-accent bg-elite-accent/5 border-l-2 border-elite-accent",
          button: "bg-elite-accent/10 text-elite-accent hover:bg-elite-accent/20"
        };
      case 'summary':
        return {
          container: "bg-gray-50",
          item: "text-gray-600 hover:text-light-secondary hover:bg-white",
          active: "text-light-secondary bg-white shadow-sm font-bold",
          button: "bg-light-accent text-white hover:bg-light-accent/90"
        };
      case 'osint':
        return {
          container: "bg-black/20",
          item: "text-gray-400 hover:text-modular-accent hover:bg-black/20",
          active: "text-modular-accent bg-black/30",
          button: "bg-modular-accent text-white hover:bg-modular-accent/90"
        };
    }
  };

  const styles = getThemeStyles();

  return (
    <div className={cn("flex flex-col h-full overflow-hidden", styles.container)}>
      <div className="p-3 flex items-center justify-between shrink-0">
        <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-50">Soruşturma Arşivi</h3>
        <button 
          onClick={onNewChat}
          className={cn("p-1 rounded-md transition-colors", styles.button)}
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-1.5 pb-2 space-y-0.5 custom-scrollbar">
        {sessions.length === 0 ? (
          <div className="p-4 text-center opacity-30 text-[10px] italic">
            Henüz geçmiş yok
          </div>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className={cn(
                "group relative flex items-center gap-2 p-2 rounded-lg transition-all cursor-pointer",
                styles.item,
                activeSessionId === session.id && styles.active
              )}
              onClick={() => onSelectSession(session.id)}
            >
              <MessageSquare className="w-3.5 h-3.5 shrink-0 opacity-50" />
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-[11px] font-medium truncate leading-tight">{session.title}</span>
                <span className="text-[9px] opacity-40 flex items-center gap-1">
                  <Clock className="w-2 h-2" />
                  {session.lastUpdated}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSession(session.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-red-500 transition-all"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
