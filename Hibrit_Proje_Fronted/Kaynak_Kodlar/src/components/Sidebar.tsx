import React from 'react';
import {
  Radar,
  LayoutDashboard,
  FileText,
  Network,
  MessageSquareText,
  Settings,
  Activity,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ViewType } from '@/types';

interface SidebarProps {
  view: ViewType;
  onViewChange: (view: ViewType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ view, onViewChange }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Sistem Paneli', id: 'dashboard' as ViewType },
    { icon: MessageSquareText, label: 'Analiz Alanı', id: 'analysis_workspace' as ViewType },
    { icon: Network, label: 'Bilgi Grafı', id: 'neo4j_graph' as ViewType },
    { icon: FileText, label: 'Rapor', id: 'report' as ViewType },
  ];

  const getThemeStyles = () => {
    return {
      container: "bg-[#08111F] border-r border-[#1E293B] text-slate-100",
      item: "text-slate-400 hover:text-white hover:bg-[#0F1B2E]",
      active: "text-white bg-[#2563EB] font-bold shadow-lg shadow-blue-950/30",
      label: "font-sans text-[11px] tracking-tight uppercase font-semibold"
    };
  };

  const styles = getThemeStyles();

  return (
    <div className={cn("relative flex h-dvh flex-col transition-all duration-300 shrink-0", isCollapsed ? "w-[76px]" : "w-[260px]", styles.container)}>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 z-20 flex h-7 w-7 items-center justify-center rounded-full border border-[#1E293B] bg-[#08111F] text-slate-300 shadow-lg hover:text-white"
        title={isCollapsed ? 'Menüyü aç' : 'Menüyü kapat'}
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      <div className={cn("p-5 flex items-center gap-3", isCollapsed && "justify-center px-3")}>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#2563EB] text-white shadow-sm">
          <Radar className="w-5 h-5" />
        </div>
        <div className={cn(isCollapsed && "hidden")}>
          <span className="block font-display font-bold tracking-tight text-lg text-white">VERIFY OPS</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#22D3EE]">OSINT Mission Control</span>
        </div>
      </div>

      <nav className="px-2 space-y-0.5 mb-2 flex-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-lg transition-all group text-left",
              isCollapsed && "justify-center",
              styles.item,
              view === item.id && styles.active
            )}
            title={item.label}
          >
            <item.icon className="w-4 h-4 shrink-0" />
            <span className={cn(styles.label, isCollapsed && "hidden")}>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-slate-800 space-y-3">
        <div className={cn("rounded-lg border border-[#1E293B] bg-[#0F1B2E] p-3", isCollapsed && "hidden")}>
          <div className="flex items-center gap-2 text-[#22C55E]">
            <Activity className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Servisler Aktif</span>
          </div>
          <p className="mt-2 text-[11px] leading-5 text-slate-400">Neo4j, Search Chain ve Strategy pipeline demo modunda hazır.</p>
        </div>
        <div className={cn("pt-2 text-center", isCollapsed && "hidden")}>
          <span className="text-[9px] text-slate-600 font-mono">MVP Prototype</span>
        </div>
      </div>
    </div>
  );
};
