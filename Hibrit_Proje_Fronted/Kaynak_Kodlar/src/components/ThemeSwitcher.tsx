import React from 'react';
import { LayoutDashboard, ZoomIn, Database } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { ViewType } from '@/src/types';

interface ThemeSwitcherProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ currentView, onViewChange }) => {
  const views: { id: ViewType; icon: any; label: string }[] = [
    { id: 'summary', icon: LayoutDashboard, label: 'GENEL GÖRÜNÜM' },
    { id: 'detail', icon: ZoomIn, label: 'DERİN ANALİZ' },
    { id: 'osint', icon: Database, label: 'OSINT KATMANI' },
  ];

  return (
    <div className={cn(
      "flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10"
    )}>
      {views.map((v) => (
        <button
          key={v.id}
          onClick={() => onViewChange(v.id)}
          className={cn(
            "flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
            currentView === v.id 
              ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          )}
        >
          <v.icon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{v.label}</span>
        </button>
      ))}
    </div>
  );
};
