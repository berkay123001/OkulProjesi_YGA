import React from 'react';
import { 
  ShieldCheck, 
  Search, 
  Archive, 
  BarChart3, 
  Settings, 
  LogOut,
  ChevronRight,
  Plus,
  HelpCircle,
  Moon,
  Sun
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { ViewType } from '@/src/types';

interface SidebarProps {
  view: ViewType;
}

export const Sidebar: React.FC<SidebarProps> = ({ view }) => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const menuItems = [
    { icon: ShieldCheck, label: 'Güvenlik Özeti', id: 'summary' },
    { icon: Search, label: 'Yeni Analiz', id: 'analysis' },
    { icon: BarChart3, label: 'İstatistikler', id: 'stats' },
  ];

  const getThemeStyles = () => {
    return {
      container: "w-full bg-white border-r border-gray-100",
      item: "text-gray-500 hover:text-blue-600 hover:bg-blue-50/50",
      active: "text-blue-600 bg-blue-50 font-bold border-r-2 border-blue-600",
      label: "font-sans text-[11px] tracking-tight uppercase font-medium"
    };
  };

  const styles = getThemeStyles();

  return (
    <div className={cn("flex flex-col transition-all duration-300 shrink-0", styles.container)}>
      <div className="p-4 flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-blue-600 text-white shadow-sm">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <span className="font-bold tracking-tighter text-lg text-blue-900">
          CG<span className="text-blue-600">AI</span>
        </span>
      </div>

      <div className="px-4 mb-6">
        <button className="w-full py-3 rounded-xl flex items-center justify-center gap-2 transition-all bg-blue-600 text-white font-bold shadow-md shadow-blue-200 active:scale-95">
          <Plus className="w-4 h-4" />
          <span className="text-xs uppercase tracking-widest">Yeni Analiz Başlat</span>
        </button>
      </div>

      <nav className="px-2 space-y-0.5 mb-2 flex-1">
        {menuItems.map((item, idx) => (
          <button
            key={item.id}
            className={cn(
              "w-full flex items-center gap-2.5 p-2 rounded-lg transition-all group",
              styles.item,
              idx === 0 && styles.active
            )}
          >
            <item.icon className="w-4 h-4 shrink-0" />
            <span className={styles.label}>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="px-2 py-4 border-t border-gray-100 space-y-1">
        {/* Theme Toggle */}
        <div className="px-2 py-2 mb-2">
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2">
              {isDarkMode ? <Moon className="w-3.5 h-3.5 text-gray-400" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                {isDarkMode ? 'Karanlık' : 'Aydınlık'}
              </span>
            </div>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="w-8 h-4 bg-gray-200 rounded-full relative transition-colors"
            >
              <div className={cn(
                "absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all shadow-sm",
                isDarkMode ? "left-4.5" : "left-0.5"
              )} />
            </button>
          </div>
        </div>

        <button className={cn("w-full flex items-center gap-2.5 p-2 rounded-lg transition-all", styles.item)}>
          <HelpCircle className="w-4 h-4 shrink-0" />
          <span className={styles.label}>Yardım & Dokümantasyon</span>
        </button>
        <button className={cn("w-full flex items-center gap-2.5 p-2 rounded-lg transition-all", styles.item)}>
          <Settings className="w-4 h-4 shrink-0" />
          <span className={styles.label}>Ayarlar</span>
        </button>
        <button className="w-full flex items-center gap-2.5 p-2 rounded-lg transition-all text-red-500 hover:bg-red-50">
          <LogOut className="w-4 h-4 shrink-0" />
          <span className={styles.label}>Çıkış Yap</span>
        </button>
        
        <div className="pt-4 text-center">
          <span className="text-[9px] text-gray-400 font-mono opacity-60">v2.4.1 Stable | Build: 2026</span>
        </div>
      </div>
    </div>
  );
};
