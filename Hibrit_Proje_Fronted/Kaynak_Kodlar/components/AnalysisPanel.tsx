import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  RadialBarChart,
  RadialBar
} from 'recharts';
import { 
  Image as ImageIcon, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Activity,
  Maximize2,
  Search,
  Shield,
  Cpu,
  Globe,
  Wallet,
  History as HistoryIcon,
  ExternalLink,
  Download,
  Info
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { ViewType } from '@/src/types';

interface AnalysisPanelProps {
  view: ViewType;
}

const areaData = [
  { name: '00:00', value: 400 },
  { name: '04:00', value: 300 },
  { name: '08:00', value: 600 },
  { name: '12:00', value: 800 },
  { name: '16:00', value: 500 },
  { name: '20:00', value: 900 },
  { name: '23:59', value: 700 },
];

const osintData = [
  { id: 1, wallet: '0x742d...44e', type: 'Transfer', platform: 'X', risk: 'Yüksek', location: 'Kuzey Kore' },
  { id: 2, wallet: '0x123a...bc2', type: 'Mint', platform: 'Instagram', risk: 'Düşük', location: 'Almanya' },
  { id: 3, wallet: '0x998f...11a', type: 'Swap', platform: 'X', risk: 'Orta', location: 'Rusya' },
  { id: 4, wallet: '0x442c...99d', type: 'Transfer', platform: 'X', risk: 'Kritik', location: 'Bilinmiyor' },
  { id: 5, wallet: '0xbc12...ff3', type: 'Withdraw', platform: 'Instagram', risk: 'Düşük', location: 'ABD' },
];

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ view }) => {
  const getThemeStyles = () => {
    return {
      card: "bg-white border border-gray-100 shadow-sm",
      title: "text-gray-900 font-sans font-bold",
      text: "text-gray-500",
      accent: "#2563EB",
      warn: "#DC2626"
    };
  };

  const styles = getThemeStyles();

  if (view === 'summary') {
    return (
      <div className="p-5 space-y-5 h-full overflow-hidden flex flex-col bg-white">
        <h2 className={cn("text-xl font-bold shrink-0", styles.title)}>Sistem Özeti</h2>
        <div className="grid grid-cols-3 gap-5 shrink-0">
          <div className={cn("p-5 rounded-xl", styles.card)}>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold opacity-70 uppercase tracking-wider">Genel Risk Skoru</span>
            </div>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold text-blue-600">92/100</div>
              <div className="flex gap-1 items-end h-6 pb-1">
                <div className="w-1 bg-blue-600/20 h-[40%] rounded-full" />
                <div className="w-1 bg-blue-600/20 h-[60%] rounded-full" />
                <div className="w-1 bg-blue-600/20 h-[30%] rounded-full" />
                <div className="w-1 bg-blue-600/20 h-[90%] rounded-full" />
              </div>
            </div>
            <div className="text-[10px] opacity-50 mt-1 font-medium">Sistem Güvenli</div>
          </div>
          <div className={cn("p-5 rounded-xl", styles.card)}>
            <div className="flex items-center gap-3 mb-2">
              <Cpu className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold opacity-70 uppercase tracking-wider">Sistem Durumu</span>
            </div>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold text-blue-600">AKTİF</div>
              <div className="px-2 py-0.5 rounded bg-blue-50 border border-blue-100 mb-1">
                <span className="text-[8px] font-bold text-blue-600 uppercase">STABLE</span>
              </div>
            </div>
            <div className="text-[10px] opacity-50 mt-1 font-medium">Tüm modüller çalışıyor</div>
          </div>
          <div className={cn("p-5 rounded-xl", styles.card)}>
            <div className="flex items-center gap-3 mb-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold opacity-70 uppercase tracking-wider">Son Analiz</span>
            </div>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold text-blue-600">#IMG-402</div>
              <div className="h-1 w-10 bg-blue-100 rounded-full mb-1.5 overflow-hidden">
                <div className="h-full bg-blue-600/40 w-[75%]" />
              </div>
            </div>
            <div className="text-[10px] opacity-50 mt-1 font-medium">2 dakika önce tamamlandı</div>
          </div>
        </div>
        <div className={cn("flex-1 p-8 rounded-2xl flex flex-col items-center justify-center text-center", styles.card)}>
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-5">
            <CheckCircle2 className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold mb-3">Son Analiz Özeti</h3>
          <p className="max-w-lg text-base opacity-80 leading-relaxed text-gray-600">
            Yapılan son görsel analizde herhangi bir manipülasyon tespit edilmedi. Sistem anormallik taraması %100 başarıyla tamamlandı.
          </p>
        </div>
      </div>
    );
  }

  if (view === 'osint') {
    return (
      <div className="p-5 space-y-5 h-full overflow-hidden flex flex-col bg-white">
        <div className="flex items-center justify-between shrink-0">
          <h2 className={cn("text-xl font-bold", styles.title)}>OSINT Teknik Veri Katmanı</h2>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5 items-end h-4">
                <div className="w-1 bg-blue-600/20 h-[20%] rounded-full" />
                <div className="w-1 bg-blue-600/20 h-[50%] rounded-full" />
                <div className="w-1 bg-blue-600/20 h-[80%] rounded-full" />
              </div>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Ağ Trafiği: Stabil</span>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all active:scale-95 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50">
                <Download className="w-4 h-4" />
                VERİ DIŞA AKTAR (PDF/CSV)
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden min-h-0">
          {/* Expanded Table Area */}
          <div className={cn("flex-1 rounded-xl overflow-hidden flex flex-col", styles.card)}>
            <div className="p-4 bg-gray-50 border-b border-gray-100 grid grid-cols-6 text-[10px] font-bold uppercase tracking-widest text-gray-500">
              <span>Cüzdan Adresi</span>
              <span>İşlem Tipi</span>
              <span>Zaman Damgası</span>
              <span>Platform</span>
              <span>Risk Skoru</span>
              <span>Kaynak IP</span>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {osintData.map((row) => (
                <div key={row.id} className="p-4 border-b border-gray-50 grid grid-cols-6 text-xs items-center hover:bg-blue-50/30 transition-colors group">
                  <span className="font-mono text-blue-600 font-medium">{row.wallet}</span>
                  <span className="font-medium text-gray-700">{row.type}</span>
                  <span className="text-gray-500">07.04.2026 20:00</span>
                  <span className="flex items-center gap-2 text-gray-600">
                    <Globe className="w-4 h-4 opacity-50" />
                    {row.platform}
                  </span>
                  <span>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      row.risk === 'Kritik' ? "bg-red-50 text-red-600 border border-red-100" :
                      row.risk === 'Yüksek' ? "bg-orange-50 text-orange-600 border border-orange-100" :
                      row.risk === 'Orta' ? "bg-gray-50 text-gray-600 border border-gray-200" :
                      "bg-green-50 text-green-600 border border-green-100"
                    )}>
                      {row.risk}
                    </span>
                  </span>
                  <span className="opacity-70 font-medium text-gray-500">{row.location}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // DETAIL VIEW (Simplified White)
  return (
    <div className="p-5 space-y-5 h-full overflow-hidden flex flex-col bg-white">
      <div className="flex items-center justify-between shrink-0">
        <h2 className={cn("text-xl font-bold tracking-tight", styles.title)}>DERİN ANALİZ MODU</h2>
        <div className="flex gap-2">
          <button className="p-2 rounded-xl bg-white border border-gray-200 text-gray-400">
            <Activity className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-5 overflow-hidden min-h-0">
        {/* Left: Functional Info Cards */}
        <div className="w-[35%] flex flex-col gap-5 overflow-hidden">
          <div className={cn("p-5 rounded-xl flex flex-col gap-4 overflow-hidden", styles.card)}>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Görsel Analiz Özeti</h3>
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Manipülasyon Skoru</div>
                <div className="text-2xl font-bold text-blue-600">%12 <span className="text-xs font-medium text-gray-400 ml-1">(Düşük Risk)</span></div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Metadata Bütünlüğü</div>
                <div className="text-2xl font-bold text-blue-600">%95 <span className="text-xs font-medium text-gray-400 ml-1">(Güvenli)</span></div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Derinlik Analizi</div>
                <div className="text-2xl font-bold text-blue-600">%92 <span className="text-xs font-medium text-gray-400 ml-1">(Güvenli)</span></div>
              </div>
            </div>

            <div className="mt-auto p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">AI Karar Notu:</span>
              <p className="text-xs font-medium text-gray-700 mt-2 leading-relaxed">
                "Görüntüde piksellenme fark edildi, ancak bu sıkıştırma kaynaklı olabilir. Manipülasyon izi saptanmadı."
              </p>
            </div>
          </div>

          <div className={cn("p-5 rounded-xl flex flex-col gap-4 overflow-hidden", styles.card)}>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Anlamsal Analiz</h3>
              <Info className="w-4 h-4 text-blue-600" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-center">
                <div className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">Panik</div>
                <div className="text-lg font-bold text-red-600">%80</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-center">
                <div className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">Güven</div>
                <div className="text-lg font-bold text-green-600">%20</div>
              </div>
            </div>

            <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-center">
              <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest">Duygu Kararı: Yüksek Panik</span>
            </div>

            <div className="mt-auto p-4 bg-gray-50 border border-gray-100 rounded-xl">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">AI Karar Notu:</span>
              <p className="text-xs font-medium text-gray-600 mt-2 leading-relaxed">
                "Metin içeriğinde agresif bir ton artışı gözlemlendi. Dezenformasyon riski orta seviyede."
              </p>
            </div>
          </div>
        </div>

        {/* Center: Image Preview */}
        <div className={cn("flex-1 rounded-xl overflow-hidden relative group", styles.card)}>
          <div className="absolute inset-0 flex items-center justify-center p-10 bg-gray-50/50">
            <img 
              src="https://picsum.photos/seed/cyber/1200/900" 
              alt="Analiz Edilen Görsel" 
              className="max-w-full max-h-full object-contain rounded-xl shadow-xl transition-transform duration-500 group-hover:scale-[1.01]"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute top-4 left-4 p-2.5 bg-white/80 backdrop-blur-md rounded-lg border border-gray-200 flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-gray-700">CANLI ANALİZ ÖNİZLEMESİ</span>
          </div>
        </div>
      </div>
    </div>
  );
};
