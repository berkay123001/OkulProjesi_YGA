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
  History as HistoryIcon,
  ExternalLink,
  Download,
  Info,
  UserCheck,
  Link2
} from 'lucide-react';
import { cn } from '@/lib/utils'; // DÜZELTME: @/src yerine @/lib
import { ViewType } from '@/types'; // DÜZELTME: @/src yerine @/

interface AnalysisPanelProps {
  view: ViewType;
}

const osintData = [
  { id: 1, source: 'twitter.com/haber_x', type: 'Bot Paylaşımı', platform: 'X', risk: 'Yüksek', score: '%88' },
  { id: 2, source: 'facebook.com/user_44', type: 'Manipüle Görsel', platform: 'Facebook', risk: 'Düşük', score: '%12' },
  { id: 3, source: 't.me/news_channel', type: 'Yanıltıcı İçerik', platform: 'Telegram', risk: 'Orta', score: '%45' },
  { id: 4, source: 'instagram.com/viral_post', type: 'Deepfake Video', platform: 'Instagram', risk: 'Kritik', score: '%96' },
  { id: 5, source: 'x.com/isimsiz_hesap', type: 'Şüpheli Link', platform: 'X', risk: 'Düşük', score: '%08' },
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
              <span className="text-xs font-bold opacity-70 uppercase tracking-wider">Genel Güvenlik Skoru</span>
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
            <div className="text-[10px] opacity-50 mt-1 font-medium">Doğrulama Sistemi Aktif</div>
          </div>
          <div className={cn("p-5 rounded-xl", styles.card)}>
            <div className="flex items-center gap-3 mb-2">
              <Cpu className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold opacity-70 uppercase tracking-wider">AI Motor Durumu</span>
            </div>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold text-blue-600">AKTİF</div>
              <div className="px-2 py-0.5 rounded bg-blue-50 border border-blue-100 mb-1">
                <span className="text-[8px] font-bold text-blue-600 uppercase">STABLE</span>
              </div>
            </div>
            <div className="text-[10px] opacity-50 mt-1 font-medium">Hibrit Analiz Devrede</div>
          </div>
          <div className={cn("p-5 rounded-xl", styles.card)}>
            <div className="flex items-center gap-3 mb-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold opacity-70 uppercase tracking-wider">Son Tarama</span>
            </div>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold text-blue-600">#TRM-202</div>
              <div className="h-1 w-10 bg-blue-100 rounded-full mb-1.5 overflow-hidden">
                <div className="h-full bg-blue-600/40 w-[75%]" />
              </div>
            </div>
            <div className="text-[10px] opacity-50 mt-1 font-medium">Analiz başarıyla tamamlandı</div>
          </div>
        </div>
        <div className={cn("flex-1 p-8 rounded-2xl flex flex-col items-center justify-center text-center", styles.card)}>
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-5">
            <CheckCircle2 className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold mb-3">Hibrit Doğrulama Sonucu</h3>
          <p className="max-w-lg text-base opacity-80 leading-relaxed text-gray-600">
            Yapılan son derin analizde herhangi bir dezenformasyon veya manipülasyon izine rastlanmadı. Kaynak güvenilirliği doğrulanmıştır.
          </p>
        </div>
      </div>
    );
  }

  if (view === 'osint') {
    return (
      <div className="p-5 space-y-5 h-full overflow-hidden flex flex-col bg-white">
        <div className="flex items-center justify-between shrink-0">
          <h2 className={cn("text-xl font-bold", styles.title)}>OSINT Kaynak Takibi</h2>
          <div className="flex items-center gap-6">
            <div className="flex gap-3">
              <button className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all active:scale-95 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50">
                <Download className="w-4 h-4" />
                RAPORU İNDİR
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden min-h-0">
          <div className={cn("flex-1 rounded-xl overflow-hidden flex flex-col", styles.card)}>
            <div className="p-4 bg-gray-50 border-b border-gray-100 grid grid-cols-5 text-[10px] font-bold uppercase tracking-widest text-gray-500">
              <span>Kaynak Bilgisi</span>
              <span>Bulgu Tipi</span>
              <span>Platform</span>
              <span>Risk Seviyesi</span>
              <span>Analiz Skoru</span>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {osintData.map((row) => (
                <div key={row.id} className="p-4 border-b border-gray-50 grid grid-cols-5 text-xs items-center hover:bg-blue-50/30 transition-colors group">
                  <span className="font-mono text-blue-600 font-medium flex items-center gap-2">
                    <Link2 className="w-3 h-3 opacity-40" />
                    {row.source}
                  </span>
                  <span className="font-medium text-gray-700">{row.type}</span>
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
                  <span className="opacity-70 font-bold text-gray-900">{row.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 space-y-5 h-full overflow-hidden flex flex-col bg-white">
      <div className="flex items-center justify-between shrink-0">
        <h2 className={cn("text-xl font-bold tracking-tight", styles.title)}>DERİN ANALİZ VE DOĞRULAMA</h2>
      </div>

      <div className="flex-1 flex gap-5 overflow-hidden min-h-0">
        <div className="w-[35%] flex flex-col gap-5 overflow-hidden">
          <div className={cn("p-5 rounded-xl flex flex-col gap-4 overflow-hidden", styles.card)}>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Analiz Parametreleri</h3>
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Manipülasyon İhtimali</div>
                <div className="text-2xl font-bold text-blue-600">%12 <span className="text-xs font-medium text-gray-400 ml-1">(Düşük)</span></div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Veri Bütünlüğü</div>
                <div className="text-2xl font-bold text-blue-600">%95 <span className="text-xs font-medium text-gray-400 ml-1">(Güvenli)</span></div>
              </div>
            </div>

            <div className="mt-auto p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Sistem Notu:</span>
              <p className="text-xs font-medium text-gray-700 mt-2 leading-relaxed">
                "İncelenen içerikte dezenformasyon tekniklerine rastlanmadı. Kaynak güvenilirliği yüksek."
              </p>
            </div>
          </div>
        </div>

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
            <span className="text-[10px] font-bold tracking-widest uppercase text-gray-700">CANLI DOĞRULAMA MODU</span>
          </div>
        </div>
      </div>
    </div>
  );
};