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
  Info,
  Database,
  Layers,
  ShieldCheck,
  Server,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ViewType } from '@/types';

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

const toolInventory = [
  { category: 'Kimlik', agent: 'IdentityAgent', count: 10, tools: 'run_sherlock, run_maigret, run_github_osint, check_email_registrations, check_breaches, search_person, verify_profiles' },
  { category: 'Medya', agent: 'MediaAgent', count: 5, tools: 'extract_metadata, reverse_image_search, compare_images_phash, fact_check_to_graph, auto_visual_intel' },
  { category: 'Akademik', agent: 'AcademicAgent', count: 3, tools: 'search_academic_papers, search_researcher_papers, check_plagiarism' },
  { category: 'Graf', agent: 'Supervisor', count: 7, tools: 'query_graph, list_graph_nodes, graph_stats, mark_false_positive, remove_false_positive, unexplored_pivots' },
  { category: 'Arama', agent: 'Paylaşımlı', count: 4, tools: 'search_web, search_web_multi, web_fetch, scrape_profile' },
  { category: 'Rapor', agent: 'Supervisor', count: 3, tools: 'generate_report, verify_claim, search_person' },
  { category: 'Obsidian', agent: 'Supervisor', count: 7, tools: 'obsidian_write, obsidian_append, obsidian_read, obsidian_daily, obsidian_list, obsidian_search, obsidian_write_profile' },
  { category: 'Güvenlik', agent: 'Supervisor', count: 6, tools: 'save_finding, batch_save_findings, save_ioc, link_entities, add_custom_node, add_custom_relationship' },
  { category: 'Analiz', agent: 'Paylaşımlı', count: 4, tools: 'cross_reference, parse_gpg_key, wayback_search, analyze_gpx' }
];

const confidenceScores = [
  { level: 'verified', color: 'bg-green-50 text-green-600 border-green-200', examples: 'GitHub API, GPG anahtarı, Doğrulanmış e-posta' },
  { level: 'high', color: 'bg-blue-50 text-blue-600 border-blue-200', examples: 'Commit e-postası, Holehe, HIBP kayıtları' },
  { level: 'medium', color: 'bg-orange-50 text-orange-600 border-orange-200', examples: 'Sherlock, Wayback, EXIF metadata, Platform tarama' },
  { level: 'low', color: 'bg-red-50 text-red-600 border-red-200', examples: 'Bilinmeyen kaynak, Kullanıcı tarafından eklenen' }
];

const searchLayers = [
  { level: 'Katman 1', name: 'SearXNG', type: 'Birincil', desc: '100+ arama motoru, API kota sınırı yok' },
  { level: 'Katman 2', name: 'Brave Search', type: 'İkincil', desc: 'Bağımsız web indeksi, Otomatik kısıtlama' },
  { level: 'Katman 3', name: 'Google CSE', type: 'Üçüncül', desc: 'Büyük indeks, hedeflenmiş site: araması' },
  { level: 'Katman 4', name: 'Tavily', type: 'Son Çare', desc: 'AI optimize edilmiş arama, İçerik özetleme' }
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

        <div className="flex-1 flex gap-5 overflow-hidden min-h-0">
          {/* Sol Panel: Araç Envanteri Tablosu */}
          <div className={cn("flex-[2] rounded-xl overflow-hidden flex flex-col", styles.card)}>
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold uppercase tracking-widest text-gray-700">Tablo II: Araç Envanteri ve Ajan Dağılımı</span>
              </div>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">Toplam 47 Araç</span>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="bg-white border-b border-gray-100 sticky top-0 z-10">
                  <tr className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    <th className="p-4 font-medium w-1/6">Kategori</th>
                    <th className="p-4 font-medium w-1/6">Sorumlu Ajan</th>
                    <th className="p-4 font-medium w-[10%] text-center">Adet</th>
                    <th className="p-4 font-medium w-auto">Araç Örnekleri</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {toolInventory.map((item, idx) => (
                    <tr key={idx} className="hover:bg-blue-50/30 transition-colors group text-xs">
                      <td className="p-4 font-bold text-gray-700">{item.category}</td>
                      <td className="p-4 font-medium text-blue-600">{item.agent}</td>
                      <td className="p-4 font-medium text-gray-500 text-center">
                        <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold">
                          {item.count}
                        </div>
                      </td>
                      <td className="p-4 font-mono text-[10px] text-gray-500 leading-relaxed group-hover:text-gray-800 transition-colors">
                        {item.tools}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sağ Panel: 4 Katmanlı Arama ve Güven Skorları */}
          <div className="flex-[1] flex flex-col gap-5 overflow-hidden">
            {/* Güven Skorları */}
            <div className={cn("flex-1 rounded-xl overflow-hidden flex flex-col", styles.card)}>
               <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-2 shrink-0">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold uppercase tracking-widest text-gray-700">Tablo III: Güven Skorları</span>
              </div>
              <div className="p-4 flex flex-col gap-3 overflow-y-auto custom-scrollbar">
                {confidenceScores.map((score, idx) => (
                  <div key={idx} className="flex flex-col gap-2 p-3 rounded-xl border border-gray-100 hover:border-blue-100 transition-colors bg-white">
                    <div className="flex items-center justify-between">
                      <span className={cn("px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border", score.color)}>
                        {score.level}
                      </span>
                    </div>
                    <p className="text-[11px] font-medium text-gray-600 leading-relaxed">
                      {score.examples}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Arama Zinciri */}
            <div className={cn("flex-1 rounded-xl overflow-hidden flex flex-col", styles.card)}>
              <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-2 shrink-0">
                <Layers className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold uppercase tracking-widest text-gray-700">4 Katmanlı Arama Zinciri</span>
              </div>
              <div className="p-4 flex flex-col gap-0 overflow-y-auto custom-scrollbar relative">
                <div className="absolute left-[27px] top-6 bottom-6 w-px bg-blue-100"></div>
                {searchLayers.map((layer, idx) => (
                  <div key={idx} className="flex items-start gap-4 relative z-10 group pt-2 pb-2">
                    <div className="w-6 h-6 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                      <span className="text-[10px] font-bold text-blue-600">{idx + 1}</span>
                    </div>
                    <div className="flex-1 bg-white p-2.5 rounded-lg border border-gray-100 shadow-sm group-hover:border-blue-200 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-gray-800">{layer.name}</span>
                        <span className="text-[9px] font-bold uppercase text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{layer.type}</span>
                      </div>
                      <p className="text-[10px] text-gray-500 font-medium leading-tight">{layer.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
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
