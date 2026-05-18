import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Bot,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  CircleDot,
  Clock3,
  Database,
  Download,
  FileText,
  Globe2,
  Image as ImageIcon,
  Link as LinkIcon,
  Loader2,
  Network,
  Paperclip,
  Send,
  Share2,
  ShieldCheck,
  UserRound,
  Zap,
  CheckCircle2,
  XCircle,
  X,
  Info
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { Sidebar } from './components/Sidebar';
import { ViewType } from '@/types';
import { cn } from '@/lib/utils';

type AgentStatus = 'completed' | 'searching' | 'analyzing' | 'queued' | 'reviewing';

const recentAnalyses = [
  { title: 'Sosyal medya dolandırıcılık iddiası', status: 'Analiz sürüyor', score: 68, tag: 'Scam' },
  { title: 'Manipüle görsel doğrulaması', status: 'Rapor hazır', score: 82, tag: 'Media' },
  { title: 'Akademik intihal taraması', status: 'Belirsiz', score: 54, tag: 'Academic' },
];

const reportHistory = [
  {
    id: 'donation-scam',
    title: 'Bağış kampanyası doğrulaması',
    status: 'Riskli / Belirsiz',
    score: 68,
    date: '06.05.2026',
    summary: 'Bağış kampanyası iddiası incelenmiş; alan adının yeni kayıtlı olduğu, ödeme yönlendirmesi içerdiği ve görselin farklı bir bağlamda kullanıldığı tespit edilmiştir.',
    academicNote: 'Akademik ajan tarafından yapılan taramalarda bağış kampanyası iddiasını doğrudan destekleyen hakemli yayın bulunmamaktadır. Scam kampanyalarına ilişkin siber güvenlik literatürü referans alınmıştır.',
    socialNote: 'Sosyal medyada kampanyanın koordineli bot ağları üzerinden yayıldığı gözlemlenmiştir. Alan adı kayıt tarihi ve ödeme yönlendirme linkleri dolandırıcılık sinyali vermektedir.',
    finalNote: 'EXIF verisi ve alan adı tescil kayıtları incelenmiş; kampanyanın şüpheli/riskli olduğu teyit edilmiştir. Sistemin tavsiyesi bu iddiayı "doğrulanmamış / riskli" olarak kabul etmek yönündedir.',
    evidenceFilter: (r: string[]) => r[1] === 'OSINT' || r[1] === 'Community',
    finalDecision: { risk: 'Yüksek Risk', verified: 'Doğrulanamadı', falsePositive: 'Risk Teyit Edildi' },
  },
  {
    id: 'image-context',
    title: 'Manipüle görsel doğrulaması',
    status: 'Kısmen doğrulandı',
    score: 82,
    date: '05.05.2026',
    summary: 'Sosyal medyada yayılan görselin farklı bir olaya ait olduğu ters görsel arama ve EXIF analizi ile ortaya konulmuştur. Görsel bağlamı kasıtlı olarak değiştirilmiştir.',
    academicNote: 'Görsel manipülasyon tespiti alanında yapılmış akademik çalışmalar referans alınmış; EXIF metadata analizine ilişkin metodoloji literatürdeki standartlarla uyumlu bulunmuştur.',
    socialNote: 'Görsel Twitter ve Instagram\'da günümüzden çok önce yayınlanmış farklı bir olaya aittir. Ters görsel arama sonuçları örtüşmekte; bu da kasıtlı bağlam manipülasyonunu göstermektedir.',
    finalNote: 'Görsel EXIF verisi silinmiş ancak ters arama üzerinden orijinal kaynağa ulaşılmıştır. İddia kısmen doğrulanmış olmakla birlikte manipülasyon amaçlı bağlam değişikliği tespit edilmiştir.',
    evidenceFilter: (r: string[]) => r[1] === 'Media' || r[1] === 'Tech press',
    finalDecision: { risk: 'Orta Risk', verified: 'Kısmen Doğrulandı', falsePositive: 'Manipülasyon Teyit Edildi' },
  },
  {
    id: 'academic-plagiarism',
    title: 'Akademik intihal taraması',
    status: 'Belirsiz',
    score: 54,
    date: '04.05.2026',
    summary: 'Ünlü akademisyenin intihal yaptığına dair iddianın incelenmesinde benzerlik oranı eşiği anlamında kesin bir sonuca ulaşılamamıştır. İddia belirsiz kalmıştır.',
    academicNote: 'Semantic Scholar ve CrossRef API üzerinden yapılan taramanın sonuçlarında kaynak yayınlarla yüksek benzerlik oranı tespit edilmiş ancak atıf eksikliği kesin intihal sınırının altında kalmıştır.',
    socialNote: 'Akademik çevrelerden Twitter\'da itirazlar gelmiş; tartışmalar hala sürmektedir. Topluluk sinyali ölçümlenmiş fakat yeterli konsensüs oluşmamıştır.',
    finalNote: 'Mevcut OSINT ve akademik veriler kesin bir karar için yetersizdir. Sistemin tavsiyesi konuyu "belirsiz" olarak işaretleyip uzman hakem incelemesine yönlendirmektir.',
    evidenceFilter: (r: string[]) => r[1] === 'Community' || r[1] === 'Tech press',
    finalDecision: { risk: 'Belirsiz', verified: 'Kesin Doğrulama Yapılamadı', falsePositive: 'Uzman İncelemesi Gerekiyor' },
  },
];


const agentFlow: { name: string; status: AgentStatus; text: string; tool: string; progress: number }[] = [
  {
    name: 'Supervisor',
    status: 'completed',
    text: 'İlk iddia sınıflandırıldı, görevler uzman hatlara dağıtıldı.',
    tool: 'route_claim',
    progress: 100,
  },
  {
    name: 'Identity Agent',
    status: 'searching',
    text: 'İlişkili sosyal profiller, kullanıcı adları ve e-posta pivotları aranıyor.',
    tool: 'sherlock + cross_reference',
    progress: 62,
  },
  {
    name: 'Media Agent',
    status: 'analyzing',
    text: 'Kaynak URL üzerinde ters görsel arama ve EXIF kontrolü yürütülüyor.',
    tool: 'reverse_image_search',
    progress: 48,
  },
  {
    name: 'Academic Agent',
    status: 'queued',
    text: 'Kurumsal kaynak ve akademik referans eşleşmesi için beklemede.',
    tool: 'semantic_scholar',
    progress: 12,
  },
  {
    name: 'Strategy Agent',
    status: 'reviewing',
    text: 'Toplanan kanıtlar çelişki, güven ve false-positive açısından inceleniyor.',
    tool: 'plan_review_synthesis',
    progress: 72,
  },
];

const evidenceRows = [
  ['Kaynak A iddiayı aynı tarih/saat bağlamıyla doğruluyor', 'Tech press', 'SUPPORTS', '0.82'],
  ['Reddit tartışmasında iddiaya karşı iki güçlü itiraz var', 'Community', 'CONTRADICTS', '0.61'],
  ['Görsel EXIF verisi sosyal medya yüklemesinde silinmiş', 'Media', 'INCONCLUSIVE', '0.45'],
  ['Alan adı yeni kayıtlı ve ödeme yönlendirmesi içeriyor', 'OSINT', 'RISK', '0.78'],
];

const graphNodes = [
  { id: 'claim', label: 'Ana İddia', icon: AlertTriangle, colorClass: 'bg-rose-500 border-rose-600 text-white', x: 0, y: 0, type: 'Ana İddia', source: 'Kullanıcı Sorgusu', url: '-' },
  { id: 'source', label: 'Kaynak A', icon: FileText, colorClass: 'bg-purple-500 border-purple-600 text-white', x: -220, y: -150, type: 'Akademik Makale', source: 'Semantic Scholar', url: 'https://doi.org/10...' },
  { id: 'person', label: 'Aktör', icon: UserRound, colorClass: 'bg-emerald-500 border-emerald-600 text-white', x: 250, y: -100, type: 'Kişi / Aktör', source: 'LinkedIn Profile', url: 'https://linkedin.com/in/...' },
  { id: 'platform', label: 'Sosyal Medya', icon: Globe2, colorClass: 'bg-[#0EA5E9] border-sky-600 text-white', x: 180, y: 200, type: 'Sosyal Medya', source: 'Twitter Post', url: 'https://x.com/...' },
  { id: 'evidence', label: 'Kanıt', icon: CircleDot, colorClass: 'bg-slate-500 border-slate-600 text-white', x: -180, y: 180, type: 'Kanıt Dosyası', source: 'EXIF Metadata', url: '-' },
];

const graphEdges = [
  { source: 'source', target: 'claim', label: 'DESTEKLİYOR' },
  { source: 'platform', target: 'claim', label: 'YAYINLADI' },
  { source: 'person', target: 'platform', label: 'SAHİBİ' },
  { source: 'evidence', target: 'claim', label: 'ÇELİŞİYOR' },
];

const statusStyles: Record<AgentStatus, string> = {
  completed: 'text-[#22C55E] bg-[#22C55E]/10',
  searching: 'text-[#60A5FA] bg-[#2563EB]/15',
  analyzing: 'text-[#22D3EE] bg-[#22D3EE]/10',
  queued: 'text-slate-400 bg-slate-400/10',
  reviewing: 'text-[#F59E0B] bg-[#F59E0B]/10',
};

export default function App() {
  const [view, setView] = useState<ViewType>('analysis_workspace');
  const [query, setQuery] = useState('Sosyal medyada yayılan bu bağış kampanyası gerçek mi? URL ve görsel birlikte incelensin.');
  const [selectedReportId, setSelectedReportId] = useState(reportHistory[0].id);
  const [isGraphOpen, setIsGraphOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-[#EEF6FF] text-slate-950 print:h-auto print:overflow-visible print:bg-white print:block">
      <div className="print:hidden">
        <Sidebar view={view} onViewChange={setView} />
      </div>

      <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden print:overflow-visible print:h-auto print:block">
        {view !== 'analysis_workspace' && <Header view={view} />}
        <section className="min-h-0 flex-1 overflow-hidden print:overflow-visible print:h-auto print:block">
          {view === 'dashboard' && (
            <Dashboard
              onViewChange={setView}
              onSelectReport={(id) => {
                setSelectedReportId(id);
                setIsReportOpen(true);
                setView('report');
              }}
            />
          )}
          {view === 'analysis_workspace' && (
            <AnalysisWorkspace query={query} setQuery={setQuery} onViewChange={setView} />
          )}
          {view === 'neo4j_graph' && (
            <Neo4jGraph
              selectedReportId={selectedReportId}
              onSelectReport={setSelectedReportId}
              isGraphOpen={isGraphOpen}
              onOpenGraph={() => setIsGraphOpen(true)}
              onCloseGraph={() => setIsGraphOpen(false)}
              onViewChange={setView}
            />
          )}
          {view === 'report' && (
            <Report
              selectedReportId={selectedReportId}
              onSelectReport={setSelectedReportId}
              isReportOpen={isReportOpen}
              onOpenReport={() => setIsReportOpen(true)}
              onCloseReport={() => setIsReportOpen(false)}
              onViewChange={setView}
            />
          )}
        </section>
      </main>
    </div>
  );
}

function Header({ view }: { view: ViewType }) {
  const titles: Record<string, string> = {
    dashboard: 'Dashboard',
    analysis_workspace: 'Analiz Alanı',
    neo4j_graph: 'Bilgi Grafı',
    report: 'Rapor',
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#1E293B] bg-[#08111F] px-6 text-white print:hidden">
      <div>
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-500">
          <span>Verification Ops</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-[#2563EB]">{titles[view] ?? 'Dashboard'}</span>
        </div>
        <h1 className="mt-1 font-display text-xl font-bold tracking-tight text-white">{titles[view] ?? 'Dashboard'}</h1>
      </div>
    </header>
  );
}

const recentAnalysesTable = [
  { title: 'Seçim süreci ile ilgili manipüle edilmiş video iddiası', agent: 'Medya Ajanı', score: 92, status: 'Doğru', reportId: 'image-context' },
  { title: 'Ünlü akademisyenin intihal yaptığına dair tweet', agent: 'Akademik Ajan', score: 45, status: 'Şüpheli', reportId: 'academic-plagiarism' },
  { title: 'Şirket CEO\'su hakkında sızdırılan sahte ses kaydı', agent: 'Kimlik Ajanı', score: 15, status: 'Yanlış', reportId: 'donation-scam' },
];

const agentScannedData = [
  { name: 'Makale (Akademik)', count: 450 },
  { name: 'Post (Medya)', count: 1200 },
  { name: 'Profil (Kimlik)', count: 320 },
  { name: 'Rapor (Strateji)', count: 85 },
];

function getStatusBadge(status: string) {
  if (status === 'Doğru') return <span className="rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-600 border border-emerald-200">Doğru</span>;
  if (status === 'Yanlış') return <span className="rounded-md bg-rose-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-rose-600 border border-rose-200">Yanlış</span>;
  return <span className="rounded-md bg-amber-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-600 border border-amber-200">Şüpheli</span>;
}

function Dashboard({
  onViewChange,
  onSelectReport,
}: {
  onViewChange: (view: ViewType) => void;
  onSelectReport: (reportId: string) => void;
}) {
  const stats = [
    ['Toplam analiz', '24', Activity],
    ['Devam eden', '3', Clock3],
    ['Ortalama güven', '74%', ShieldCheck],
    ['Graph düğümü', '186', Database],
  ];

  return (
    <div className="evidence-page-shell h-full overflow-auto p-6">
      <div className="grid grid-cols-4 gap-4">
        {stats.map(([label, value, Icon]) => (
          <div key={label as string} className="rounded-lg border border-[#B7D7FF] bg-white/90 p-5 shadow-sm shadow-blue-950/5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{label as string}</span>
              <Icon className="h-5 w-5 text-[#2563EB]" />
            </div>
            <div className="mt-4 text-3xl font-bold tracking-tight">{value as string}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-[1fr_2fr] gap-6">
        <div className="rounded-lg border border-[#B7D7FF] bg-white/95 p-5 shadow-sm shadow-blue-950/5 flex flex-col">
          <div className="mb-4 flex items-center justify-between border-b border-[#D7E7FA] pb-4">
            <h2 className="font-display text-lg font-bold">Taranan Kaynaklar</h2>
          </div>
          <div className="h-64 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agentScannedData} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                <XAxis type="number" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="count" fill="#2563EB" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border border-[#B7D7FF] bg-white/95 shadow-sm shadow-blue-950/5 flex flex-col">
          <div className="flex items-center justify-between border-b border-[#D7E7FA] p-5">
            <h2 className="font-display text-lg font-bold">Son Analiz Edilen Haberler</h2>
            <button onClick={() => onViewChange('analysis_workspace')} className="rounded-lg bg-[#2563EB] px-4 py-2 text-xs font-bold text-white hover:bg-blue-700">
              Analiz Alanına Git
            </button>
          </div>
          <div className="flex-1 overflow-auto p-5">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold uppercase tracking-widest text-slate-400">
                  <th className="pb-3 font-medium">Haber Başlığı</th>
                  <th className="pb-3 font-medium">Tetikleyen Ajan</th>
                  <th className="pb-3 font-medium text-center">Skor</th>
                  <th className="pb-3 font-medium text-right">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentAnalysesTable.map((row, idx) => (
                  <tr
                    key={idx}
                    onClick={() => onSelectReport(row.reportId)}
                    className="cursor-pointer hover:bg-blue-50/60 active:bg-blue-100/70 transition-colors group"
                  >
                    <td className="py-4 font-semibold text-slate-900 group-hover:text-[#2563EB] transition-colors">
                      <span className="flex items-center gap-2">
                        {row.title}
                        <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 text-[#2563EB] transition-opacity" />
                      </span>
                    </td>
                    <td className="py-4 text-slate-500 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Bot className="w-4 h-4 text-[#2563EB]" />
                        {row.agent}
                      </span>
                    </td>
                    <td className="py-4 text-center font-bold text-[#2563EB]">{row.score}%</td>
                    <td className="py-4 text-right">{getStatusBadge(row.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalysisWorkspace({
  query,
  setQuery,
  onViewChange,
}: {
  query: string;
  setQuery: (value: string) => void;
  onViewChange: (view: ViewType) => void;
}) {
  const [agentPanelCollapsed, setAgentPanelCollapsed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [thoughtStep, setThoughtStep] = useState(0);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkInput, setLinkInput] = useState('');
  const [attachments, setAttachments] = useState<{ name: string; type: 'file' | 'image' | 'link' }[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const imageInputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (!query.trim() || isProcessing) return;
    setIsProcessing(true);
    setThoughtStep(1);
    setAgentPanelCollapsed(false);
    
    setTimeout(() => setThoughtStep(2), 1500);
    setTimeout(() => setThoughtStep(3), 3000);
    setTimeout(() => setThoughtStep(4), 4500);
    setTimeout(() => {
      setIsProcessing(false);
      setThoughtStep(0);
      setQuery('');
      setAttachments([]);
    }, 6000);
  };

  const handleAddLink = () => {
    if (!linkInput.trim()) return;
    const url = linkInput.trim().startsWith('http') ? linkInput.trim() : 'https://' + linkInput.trim();
    setAttachments(prev => [...prev, { name: url, type: 'link' }]);
    setQuery(query ? query + '\n' + url : url);
    setLinkInput('');
    setShowLinkModal(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setAttachments(prev => [...prev, ...files.map(f => ({ name: f.name, type: 'file' as const }))]);
    const fileNames = '[Dosya: ' + files.map(f => f.name).join(', ') + ']';
    setQuery(query ? query + '\n' + fileNames : fileNames);
    e.target.value = '';
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setAttachments(prev => [...prev, ...files.map(f => ({ name: f.name, type: 'image' as const }))]);
    const fileNames = '[Görsel: ' + files.map(f => f.name).join(', ') + ']';
    setQuery(query ? query + '\n' + fileNames : fileNames);
    e.target.value = '';
  };

  return (
    <div className="flex h-full min-h-0 overflow-hidden">
      <section className="evidence-page-shell flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="shrink-0 border-b border-[#1E293B] bg-[#08111F] px-6 py-3 text-white">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-500">
            <span>Verification Ops</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#2563EB]">Analiz Alanı</span>
          </div>
          <h1 className="mt-1 font-display text-xl font-bold tracking-tight text-white">Analiz Alanı</h1>
        </div>

        <div className="shrink-0 border-b border-[#D7E7FA] bg-white/95 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Canlı Analiz</div>
              <h2 className="mt-1 font-display text-lg font-bold">Bağış kampanyası doğrulaması</h2>
              <p className="mt-1 text-xs text-slate-500">Chat üzerinden yeni analiz başlat, devam sorusu sor ve bulguları takip et.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => onViewChange('neo4j_graph')} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold hover:border-[#2563EB] hover:text-[#2563EB]">
                Grafı Gör
              </button>
              <button onClick={() => onViewChange('report')} className="rounded-lg bg-[#08111F] px-3 py-2 text-xs font-bold text-white hover:bg-[#2563EB]">
                Rapor Oluştur
              </button>
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-auto p-5">
          <ChatBubble role="user" text={query} />
          <ChatBubble
            role="assistant"
            text="Analiz başlatıldı. Sorgu karma doğrulama olarak sınıflandırıldı: iddia doğrulama, medya kontrolü ve olası scam sinyalleri birlikte inceleniyor."
            badges={['Supervisor Onaylı']}
          />
          <div className="my-5 rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-950">
              <Zap className="h-4 w-4 text-[#2563EB]" />
              Ara Bulgu Özeti
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <Metric label="Güven skoru" value="68%" />
              <Metric label="Çelişki" value="2" />
              <Metric label="Kanıt" value="9" />
            </div>
          </div>
          <ChatBubble
            role="assistant"
            text="İlk bulgular kampanya alan adının yeni kayıtlı olduğunu ve görselin farklı bir bağlamda daha önce kullanılmış olabileceğini gösteriyor. Strategy Agent bu iki sinyali false-positive riski açısından inceliyor."
            badges={['Medya Analizi', 'Strateji Uyarısı']}
          />
          
          {isProcessing && (
            <div className="mb-4 max-w-[78%] rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <Loader2 className="h-4 w-4 animate-spin text-[#2563EB]" />
                Agent Thought Chain
              </div>
              <div className="space-y-3">
                <div className={cn("flex items-center gap-3 text-sm", thoughtStep >= 1 ? "text-emerald-600 font-medium" : "text-slate-400")}>
                  <div className={cn("h-2 w-2 rounded-full", thoughtStep >= 1 ? "bg-emerald-500" : "bg-slate-300")} />
                  <span>⚙️ Supervisor: Sorgu analiz ediliyor ve görev planı çıkarılıyor...</span>
                </div>
                <div className={cn("flex items-center gap-3 text-sm", thoughtStep >= 2 ? "text-emerald-600 font-medium" : "text-slate-400")}>
                  <div className={cn("h-2 w-2 rounded-full", thoughtStep >= 2 ? "bg-emerald-500" : "bg-slate-300")} />
                  <span>🔍 Akademik Ajan: Bilimsel veritabanları ve makaleler taranıyor...</span>
                </div>
                <div className={cn("flex items-center gap-3 text-sm", thoughtStep >= 3 ? "text-emerald-600 font-medium" : "text-slate-400")}>
                  <div className={cn("h-2 w-2 rounded-full", thoughtStep >= 3 ? "bg-emerald-500" : "bg-slate-300")} />
                  <span>🌐 Medya Ajanı: Sosyal medya kanalları ve dijital izler inceleniyor...</span>
                </div>
                <div className={cn("flex items-center gap-3 text-sm", thoughtStep >= 4 ? "text-emerald-600 font-medium" : "text-slate-400")}>
                  <div className={cn("h-2 w-2 rounded-full", thoughtStep >= 4 ? "bg-emerald-500" : "bg-slate-300")} />
                  <span>👤 Kimlik Ajanı: Hedef profiller ve OSINT kayıtları sorgulanıyor...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-[#D7E7FA] bg-white p-6">
          <div className="mx-auto max-w-4xl flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 shadow-sm focus-within:border-[#2563EB] focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
            <textarea
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="min-h-14 max-h-40 min-w-0 flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-slate-400"
              placeholder="Yeni analiz başlat veya analiz edilecek link/dosya içeriğini girin..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
            {/* Attachment chips */}
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 px-1 pt-1 pb-1">
                {attachments.map((att, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 shadow-sm">
                    {att.type === 'link' && <LinkIcon className="h-3 w-3 text-[#2563EB]" />}
                    {att.type === 'file' && <Paperclip className="h-3 w-3 text-[#10B981]" />}
                    {att.type === 'image' && <ImageIcon className="h-3 w-3 text-[#8B5CF6]" />}
                    <span className="max-w-[160px] truncate">{att.name}</span>
                    <button onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))} className="ml-0.5 text-slate-400 hover:text-rose-500">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Link modal */}
            {showLinkModal && (
              <div className="rounded-lg border border-[#2563EB]/30 bg-blue-50 p-3 flex items-center gap-2">
                <LinkIcon className="h-4 w-4 shrink-0 text-[#2563EB]" />
                <input
                  autoFocus
                  value={linkInput}
                  onChange={e => setLinkInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleAddLink(); if (e.key === 'Escape') setShowLinkModal(false); }}
                  placeholder="https://example.com — URL girin ve Enter'a basın"
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400 text-slate-800"
                />
                <button onClick={handleAddLink} className="rounded-md bg-[#2563EB] px-3 py-1 text-xs font-bold text-white hover:bg-blue-700">Ekle</button>
                <button onClick={() => setShowLinkModal(false)} className="text-slate-400 hover:text-slate-700"><X className="h-4 w-4" /></button>
              </div>
            )}

            {/* Hidden file inputs */}
            <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.txt,.csv,.xlsx" multiple className="hidden" onChange={handleFileChange} />
            <input ref={imageInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />

            <div className="flex items-center justify-between border-t border-slate-200/60 pt-2">
              <div className="flex items-center gap-1">
                <button onClick={() => { setShowLinkModal(v => !v); setLinkInput(''); }} className="flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors" title="URL Linki Ekle">
                  <LinkIcon className="h-4 w-4 text-[#2563EB]" />
                  Link Ekle
                </button>
                <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors" title="Doküman / PDF Yükle">
                  <Paperclip className="h-4 w-4 text-[#10B981]" />
                  Dosya Yükle
                </button>
                <button onClick={() => imageInputRef.current?.click()} className="flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors" title="Görsel / Fotoğraf Yükle">
                  <ImageIcon className="h-4 w-4 text-[#8B5CF6]" />
                  Görsel Yükle
                </button>
              </div>
              <button 
                onClick={handleSubmit}
                disabled={isProcessing || !query.trim()}
                className="flex items-center gap-2 rounded-md bg-[#08111F] px-5 py-2 text-sm font-bold text-white shadow-sm hover:bg-[#2563EB] disabled:opacity-50 transition-all"
              >
                <span>Analizi Başlat</span>
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Toggle button: fixed so it always aligns with sidebar toggle (top-6) */}
      <button
        onClick={() => setAgentPanelCollapsed(!agentPanelCollapsed)}
        style={{ right: agentPanelCollapsed ? '6px' : '344px' }}
        className="fixed top-6 z-30 flex h-7 w-7 items-center justify-center rounded-full border border-[#1E293B] bg-[#08111F] text-slate-300 shadow-lg hover:text-white transition-all duration-300"
        title={agentPanelCollapsed ? 'Agent Runtime aç' : 'Agent Runtime kapat'}
      >
        {agentPanelCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
      <div className="flex shrink-0">
        <AgentFlowPanel isCollapsed={agentPanelCollapsed} />
      </div>
    </div>
  );
}

function AgentFlowPanel({ isCollapsed }: { isCollapsed: boolean }) {
  return (
    <aside className={cn(
      "flex shrink-0 flex-col border-l border-[#1E293B] bg-[#08111F] text-white transition-all duration-300 overflow-hidden",
      isCollapsed ? "w-0 border-l-0" : "w-[340px]"
    )}>
      <div className={cn("h-full w-[340px] overflow-auto p-5 transition-opacity duration-300", isCollapsed ? "invisible opacity-0" : "opacity-100")}>
        <div className="mb-5">
          <div className="text-xs font-bold uppercase tracking-widest text-[#22D3EE]">Agent Runtime</div>
          <h3 className="mt-1 font-display text-lg font-bold">Arka Plan Akışı</h3>
        </div>
      <div className="relative space-y-4 before:absolute before:left-4 before:top-2 before:h-[calc(100%-20px)] before:w-px before:bg-[#1E293B]">
        {agentFlow.map((agent) => (
          <div key={agent.name} className="relative flex gap-4">
            <div className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#22D3EE]/30 bg-[#0F1B2E] text-[#22D3EE]">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex-1 rounded-lg border border-[#1E293B] bg-[#0F1B2E] p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-bold uppercase tracking-wide">{agent.name}</div>
                <span className={cn('rounded px-2 py-1 text-[9px] font-bold uppercase', statusStyles[agent.status])}>{agent.status}</span>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-300">{agent.text}</p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#1E293B]">
                <div className="h-full rounded-full bg-[#22D3EE]" style={{ width: `${agent.progress}%` }} />
              </div>
              <div className="mt-3 rounded-md bg-[#08111F] px-2 py-1.5 font-mono text-[10px] text-slate-400">&gt; Tool: {agent.tool}</div>
            </div>
          </div>
        ))}
      </div>
      </div>
    </aside>
  );
}

function Neo4jGraph({
  selectedReportId,
  onSelectReport,
  isGraphOpen,
  onOpenGraph,
  onCloseGraph,
  onViewChange,
}: {
  selectedReportId: string;
  onSelectReport: (id: string) => void;
  isGraphOpen: boolean;
  onOpenGraph: () => void;
  onCloseGraph: () => void;
  onViewChange: (view: ViewType) => void;
}) {
  const selectedReport = reportHistory.find((report) => report.id === selectedReportId) ?? reportHistory[0];
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const selectedNode = graphNodes.find(n => n.id === selectedNodeId);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomSensitivity = 0.001;
    setZoom(prev => Math.min(Math.max(0.3, prev - e.deltaY * zoomSensitivity), 3));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  if (!isGraphOpen) {
    return (
      <div className="evidence-page-shell h-full overflow-auto p-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Bilgi Grafı</div>
            <h2 className="mt-1 font-display text-2xl font-bold text-[#08111F]">Geçmiş Raporlar</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Bir rapora tıklandığında o analize ait dinamik bilgi grafı ayrı bir ekranda açılır. Farenizle grafı yakınlaştırıp uzaklaştırabilir, düğümlere tıklayarak detayları görebilirsiniz.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {reportHistory.map((report) => (
              <button
                key={report.id}
                onClick={() => {
                  onSelectReport(report.id);
                  onOpenGraph();
                }}
                className="rounded-lg border border-[#B7D7FF] bg-white/95 p-5 text-left shadow-sm shadow-blue-950/5 transition hover:-translate-y-0.5 hover:border-[#2563EB] hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-lg font-bold text-[#08111F]">{report.title}</div>
                    <div className="mt-2 text-sm text-slate-500">{report.status}</div>
                  </div>
                  <div className="rounded-lg bg-[#E7F8FF] px-3 py-2 text-lg font-bold text-[#2563EB]">{report.score}%</div>
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{report.date}</span>
                  <span className="text-xs font-bold text-[#2563EB]">Grafı Aç</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid h-full grid-cols-1 relative overflow-hidden bg-[#08111F] text-white">
      <section 
        className="evidence-dotted-canvas relative overflow-hidden text-slate-200 cursor-grab active:cursor-grabbing w-full h-full"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="absolute left-6 top-6 z-10 flex gap-2">
          <button onClick={onCloseGraph} className="flex items-center gap-2 rounded-lg border border-[#B7D7FF] bg-white/90 px-3 py-2 text-xs font-bold text-[#08111F] shadow-sm hover:bg-white transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Raporlara Dön
          </button>
          <button onClick={() => onViewChange('report')} className="rounded-lg bg-[#2563EB] px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-600 transition-colors">
            Raporu Gör
          </button>
        </div>
        
        <div className={cn("absolute right-6 top-6 z-10 flex gap-2 transition-opacity duration-300", selectedNodeId ? "opacity-0 pointer-events-none hidden" : "opacity-100")}>
          <div className="rounded-lg border border-[#1E293B] bg-[#0F1B2E]/90 px-3 py-2 text-[10px] font-bold text-slate-400 shadow-sm backdrop-blur-sm flex items-center gap-2">
            <Info className="h-4 w-4 text-[#2563EB]" />
            Yakınlaşmak için tekerleği, kaydırmak için farenizi sürükleyin
          </div>
        </div>

        <div 
          className="absolute left-1/2 top-1/2 w-0 h-0 transition-transform duration-75 ease-out"
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
        >
          <svg className="absolute overflow-visible -left-[1000px] -top-[1000px] w-[2000px] h-[2000px] pointer-events-none">
            {graphEdges.map((edge, i) => {
              const sourceNode = graphNodes.find(n => n.id === edge.source);
              const targetNode = graphNodes.find(n => n.id === edge.target);
              if (!sourceNode || !targetNode) return null;
              
              const startX = 1000 + sourceNode.x;
              const startY = 1000 + sourceNode.y;
              const endX = 1000 + targetNode.x;
              const endY = 1000 + targetNode.y;
              const midX = (startX + endX) / 2;
              const midY = (startY + endY) / 2;

              let color = '#22D3EE';
              if (edge.label === 'ÇELİŞİYOR') color = '#EF4444';
              if (edge.label === 'DESTEKLİYOR') color = '#10B981';

              return (
                <g key={i}>
                  <line 
                    x1={startX} y1={startY} 
                    x2={endX} y2={endY} 
                    stroke={color} strokeWidth="2" strokeOpacity="0.4"
                    strokeDasharray={edge.label === 'ÇELİŞİYOR' ? '6 6' : 'none'}
                  />
                  <rect 
                    x={midX - 45} y={midY - 10} 
                    width="90" height="20" 
                    rx="4" fill="#08111F" stroke={color} strokeWidth="1"
                  />
                  <text 
                    x={midX} y={midY + 4} 
                    fontSize="9" fontWeight="bold" fill={color} 
                    textAnchor="middle" className="font-mono uppercase tracking-widest"
                  >
                    {edge.label}
                  </text>
                </g>
              );
            })}
          </svg>
          
          {graphNodes.map((node) => (
            <div 
              key={node.id} 
              className={cn(
                'absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 cursor-pointer group transition-all duration-300',
                selectedNodeId === node.id ? 'scale-110 z-20' : 'hover:scale-105 z-10'
              )}
              style={{ left: node.x, top: node.y }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedNodeId(node.id);
              }}
            >
              <div className={cn(
                'flex h-16 w-16 items-center justify-center rounded-full border-4 shadow-2xl transition-all duration-300', 
                node.colorClass,
                selectedNodeId === node.id ? 'ring-4 ring-blue-400/50 shadow-blue-500/50' : 'group-hover:shadow-lg'
              )}>
                <node.icon className="h-7 w-7" />
              </div>
              <span className={cn(
                "rounded-md px-3 py-1.5 font-mono text-xs font-bold shadow-sm transition-colors",
                selectedNodeId === node.id ? "bg-[#2563EB] text-white" : "bg-slate-800 text-slate-200 border border-slate-700 group-hover:border-slate-500"
              )}>
                {node.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Inspector Panel */}
      <aside className={cn(
        "absolute right-0 top-0 h-full w-[300px] border-l border-[#1E293B] bg-[#08111F]/95 backdrop-blur-md p-5 transition-transform duration-300 shadow-2xl flex flex-col z-50",
        selectedNodeId ? "translate-x-0" : "translate-x-full"
      )}>
        {selectedNode && (
          <>
            <div className="flex items-start justify-between mb-6 pb-4 border-b border-[#1E293B]">
              <div className="flex items-center gap-3">
                <div className={cn("p-1.5 rounded-md text-white border border-[#1E293B]", selectedNode.colorClass.split(' ')[0])}>
                  <selectedNode.icon className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="font-sans text-sm font-bold text-white leading-tight">{selectedNode.label}</h2>
                  <div className="text-[9px] font-bold uppercase tracking-widest text-[#22D3EE] mt-1">{selectedNode.type}</div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedNodeId(null)}
                className="text-slate-500 hover:text-white transition-colors"
                title="Paneli Kapat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="space-y-4 flex-1 overflow-auto pr-1">
              <GraphDetail label="Kaynak" value={selectedNode.source} />
              <GraphDetail label="URL / Bağlantı" value={selectedNode.url} />
              
              <div className="rounded-md border border-[#1E293B] bg-[#0F1B2E] p-3">
                <div className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-2">İlişkiler</div>
                <div className="space-y-1.5">
                  {graphEdges.filter(e => e.source === selectedNode.id || e.target === selectedNode.id).map((edge, i) => {
                    const isSource = edge.source === selectedNode.id;
                    const otherNodeId = isSource ? edge.target : edge.source;
                    const otherNode = graphNodes.find(n => n.id === otherNodeId);
                    return (
                      <div key={i} className="flex items-center justify-between bg-[#08111F] p-1.5 rounded border border-[#1E293B] text-[10px]">
                        <span className="text-slate-400 font-bold">{edge.label}</span>
                        <span className="text-[#2563EB] font-mono">{otherNode?.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

function AccordionItem({ title, icon: Icon, children, defaultOpen = false }: any) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden mb-4 bg-white shadow-sm hover:shadow-md transition-shadow print:shadow-none print:border-none print:mb-8">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-7 py-5 hover:bg-slate-50/80 transition-colors text-left print:px-0 print:border-b print:border-slate-300 print:mb-4"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-50 border border-blue-100 print:bg-transparent print:border-none">
            <Icon className="h-4 w-4 text-[#2563EB] print:text-slate-800" />
          </div>
          <span className="font-semibold text-[16px] text-slate-800 tracking-tight print:text-xl print:text-black">{title}</span>
        </div>
        <div className="print:hidden">
          {isOpen ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
        </div>
      </button>
      <div className={cn(
        "px-8 pb-8 pt-4 border-t border-slate-100 bg-white print:block print:border-none print:px-0 print:py-0",
        isOpen ? "block" : "hidden"
      )}>
        <div className="text-[14.5px] leading-relaxed text-slate-700 tracking-wide print:text-black [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-slate-800 [&_h2]:mb-2 [&_h2]:mt-4 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-slate-700 [&_h3]:mb-1.5 [&_h3]:mt-3">
          {children}
        </div>
      </div>
    </div>
  );
}

function Report({
  selectedReportId,
  onSelectReport,
  isReportOpen,
  onOpenReport,
  onCloseReport,
  onViewChange,
}: {
  selectedReportId: string;
  onSelectReport: (id: string) => void;
  isReportOpen: boolean;
  onOpenReport: () => void;
  onCloseReport: () => void;
  onViewChange: (view: ViewType) => void;
}) {
  const selectedReport = reportHistory.find((report) => report.id === selectedReportId) ?? reportHistory[0];
  const [isCopied, setIsCopied] = useState(false);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: selectedReport.title,
          text: 'Bu siber istihbarat raporunu inceleyin:',
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch (error) {
      console.error('Paylaşım hatası:', error);
    }
  };

  if (!isReportOpen) {
    return (
      <div className="evidence-page-shell h-full overflow-auto p-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Rapor</div>
            <h2 className="mt-1 font-display text-2xl font-bold text-[#08111F]">Geçmiş Analiz Raporları</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Bir rapora tıklandığında detaylı İstihbarat Özet Raporu ayrı bir ekranda açılır.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {reportHistory.map((report) => (
              <button
                key={report.id}
                onClick={() => {
                  onSelectReport(report.id);
                  onOpenReport();
                }}
                className="rounded-lg border border-[#B7D7FF] bg-white/95 p-5 text-left shadow-sm shadow-blue-950/5 transition hover:-translate-y-0.5 hover:border-[#2563EB] hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-lg font-bold text-[#08111F]">{report.title}</div>
                    <div className="mt-2 text-sm text-slate-500">{report.status}</div>
                  </div>
                  <div className="rounded-lg bg-[#E7F8FF] px-3 py-2 text-lg font-bold text-[#2563EB]">{report.score}%</div>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Tarih</div>
                    <div className="mt-1 text-xs font-semibold text-slate-600">{report.date}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Kanıt</div>
                    <div className="mt-1 text-xs font-semibold text-slate-600">14 kayıt</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Çelişki</div>
                    <div className="mt-1 text-xs font-semibold text-slate-600">3 sinyal</div>
                  </div>
                </div>
                <div className="mt-5 text-xs font-bold text-[#2563EB]">Raporu Aç</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden print:overflow-visible print:h-auto">
      <div className="evidence-page-shell h-full overflow-auto p-6 print:overflow-visible print:h-auto print:p-0">
        <div className="mx-auto max-w-5xl">
          {/* Header Area */}
          <div className="flex items-center justify-between mb-8 print:mb-4 print:block">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2 print:hidden">
                <button onClick={onCloseReport} className="hover:text-[#2563EB] transition-colors"><ArrowLeft className="h-4 w-4" /></button>
                İstihbarat Özet Raporu
              </div>
              <h2 className="mt-2 font-display text-3xl font-bold text-[#08111F] print:mt-0">{selectedReport.title}</h2>
            </div>
            <div className="flex gap-2 print:hidden">
              <button 
                onClick={handleShare}
                className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
              >
                {isCopied ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <Share2 className="h-4 w-4" />}
                {isCopied ? 'Kopyalandı' : 'Paylaş'}
              </button>
              <button 
                onClick={() => window.print()}
                className="flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
              >
                <Download className="h-4 w-4" /> PDF Olarak İndir
              </button>
            </div>
          </div>

          {/* Top Metric Widgets */}
          <div className="grid grid-cols-3 gap-4 mb-5">
            <div className="rounded-lg border border-slate-200 bg-white px-5 py-3.5 shadow-sm flex items-center justify-between">
              <div>
                <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Güvenilirlik Skoru</div>
                <div className="mt-1 text-2xl font-display font-bold text-slate-900">{selectedReport.score}%</div>
              </div>
              <Activity className="h-6 w-6 text-slate-400" />
            </div>
            
            <div className="rounded-lg border border-slate-200 bg-white px-5 py-3.5 shadow-sm flex items-center justify-between">
              <div>
                <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Taranan Kaynak</div>
                <div className="mt-1 text-2xl font-display font-bold text-slate-900">14</div>
              </div>
              <Database className="h-6 w-6 text-slate-400" />
            </div>

            <div className="rounded-lg border border-slate-200 bg-white px-5 py-3.5 shadow-sm flex items-center justify-between">
              <div>
                <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Çelişen Kaynak</div>
                <div className="mt-1 text-2xl font-display font-bold text-slate-900">3</div>
              </div>
              <AlertTriangle className="h-6 w-6 text-slate-400" />
            </div>
          </div>

          {/* Nihai Karar — Compact Alert Bar */}
          <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-orange-200 bg-orange-50 px-5 py-3 shadow-sm">
            <div className="flex items-center gap-2 shrink-0">
              <ShieldCheck className="h-4 w-4 text-orange-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-orange-600">Nihai Karar</span>
            </div>
            <span className="h-4 w-px bg-orange-200 shrink-0 hidden sm:block" />
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-bold uppercase tracking-widest text-orange-400">Risk:</span>
              <span className="text-xs font-semibold text-orange-900">{selectedReport.finalDecision.risk}</span>
            </div>
            <span className="text-orange-200 hidden sm:block">•</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-bold uppercase tracking-widest text-orange-400">Doğrulama:</span>
              <span className="text-xs font-semibold text-orange-900">{selectedReport.finalDecision.verified}</span>
            </div>
            <span className="text-orange-200 hidden sm:block">•</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-bold uppercase tracking-widest text-orange-400">Filtre:</span>
              <span className="text-xs font-semibold text-orange-900">{selectedReport.finalDecision.falsePositive}</span>
            </div>
          </div>

          {/* Rapor Metadata Satırı */}
          <div className="mb-6 mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-md border border-slate-100 bg-slate-50 px-5 py-3 text-[11px] font-medium tracking-wide text-slate-400 print:bg-transparent print:border-none print:px-0">
            <span>Rapor Kodu: <span className="font-semibold text-slate-500">#OSINT-2026-A94</span></span>
            <span className="text-slate-300">•</span>
            <span>Analiz Tarihi: <span className="font-semibold text-slate-500">{selectedReport.date}</span></span>
            <span className="text-slate-300">•</span>
            <span>Doğrulama Modeli: <span className="font-semibold text-slate-500">Hybrid Graph-RAG pipeline</span></span>
          </div>

          {/* Accordion Sections */}
          <AccordionItem title="Yönetici Özeti (Supervisor Synthesis)" icon={Activity} defaultOpen>
            <p className="text-sm leading-7 text-slate-800">
              {selectedReport.summary}
              {' '}İstihbarat skoru <strong className="text-slate-900">{selectedReport.score}%</strong> olarak hesaplanmış ve <strong className="text-slate-900">"{selectedReport.status}"</strong> risk durumu atanmıştır.
            </p>
          </AccordionItem>

          <AccordionItem title="Akademik İnceleme Bulguları" icon={FileText}>
            <p className="text-sm leading-7 text-slate-800 mb-5">
              {selectedReport.academicNote}
            </p>
            <div className="overflow-hidden rounded-xl border border-slate-200">
              {evidenceRows.filter(selectedReport.evidenceFilter).map(([evidence, source, status, score], idx) => (
                <div key={idx} className="grid grid-cols-[1fr_120px_120px_70px] items-center gap-4 border-b border-slate-200 p-4 last:border-b-0 bg-white hover:bg-slate-50 transition-colors">
                  <div className="text-sm font-medium text-slate-800">{evidence}</div>
                  <div className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded inline-block text-center">{source}</div>
                  <div className="text-xs font-bold text-[#2563EB] bg-blue-50 px-2 py-1 rounded inline-block text-center">{status}</div>
                  <div className="text-right text-sm font-bold text-slate-900">{score}</div>
                </div>
              ))}
            </div>
          </AccordionItem>

          <AccordionItem title="Sosyal Medya ve Kronolojik Yayılım" icon={Globe2}>
            <p className="text-sm leading-7 text-slate-800">
              {selectedReport.socialNote}
            </p>
          </AccordionItem>

          <AccordionItem title="Nihai Karar ve Yanlış Pozitif Analizi" icon={ShieldCheck}>
            <div className="flex items-start gap-5">
              <CheckCircle2 className="h-6 w-6 text-[#2563EB] mt-1 shrink-0" />
              <p className="text-sm leading-7 text-slate-800">
                {selectedReport.finalNote}
              </p>
            </div>
          </AccordionItem>

        </div>
      </div>
    </div>
  );
}

function ReportListPanel({
  title,
  selectedReportId,
  onSelectReport,
  light = false,
}: {
  title: string;
  selectedReportId: string;
  onSelectReport: (id: string) => void;
  light?: boolean;
}) {
  return (
    <aside className={cn('overflow-auto border-r p-4', light ? 'border-slate-200 bg-white text-slate-950' : 'border-slate-800 bg-slate-900 text-white')}>
      <div className={cn('mb-4 text-xs font-bold uppercase tracking-widest', light ? 'text-slate-400' : 'text-blue-300')}>{title}</div>
      <div className="space-y-2">
        {reportHistory.map((report) => (
          <button
            key={report.id}
            onClick={() => onSelectReport(report.id)}
            className={cn(
              'w-full rounded-lg border p-3 text-left transition',
              light
                ? 'border-slate-200 hover:border-[#2563EB] hover:bg-blue-50'
                : 'border-[#1E293B] bg-[#08111F] hover:border-[#22D3EE]',
              selectedReportId === report.id && (light ? 'border-[#2563EB] bg-blue-50' : 'border-[#22D3EE] bg-[#22D3EE]/10')
            )}
          >
            <div className="text-sm font-bold">{report.title}</div>
            <div className={cn('mt-2 flex items-center justify-between text-xs', light ? 'text-slate-500' : 'text-slate-400')}>
              <span>{report.status}</span>
              <span className="font-bold text-[#2563EB]">{report.score}%</span>
            </div>
            <div className={cn('mt-2 text-[11px]', light ? 'text-slate-400' : 'text-slate-500')}>{report.date}</div>
          </button>
        ))}
      </div>
    </aside>
  );
}

function ChatBubble({ role, text, badges }: { role: 'user' | 'assistant'; text: string; badges?: string[] }) {
  return (
    <div className={cn('mb-6 flex w-full', role === 'user' ? 'justify-end' : 'justify-start')}>
      <div className={cn('flex max-w-[85%] gap-4', role === 'user' ? 'flex-row-reverse' : 'flex-row')}>
        <div className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border shadow-sm mt-1",
          role === 'user' 
            ? "bg-[#2563EB] text-white border-blue-600" 
            : "bg-[#08111F] text-[#22D3EE] border-[#1E293B]"
        )}>
          {role === 'user' ? <UserRound className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </div>
        <div className={cn(
          'rounded-xl p-4 text-sm leading-6 shadow-sm border', 
          role === 'user' 
            ? 'bg-blue-50/50 text-slate-800 border-blue-100' 
            : 'bg-white text-slate-700 border-slate-200'
        )}>
          <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {role === 'user' ? 'Siz' : 'OSINT Core System'}
          </div>
          {badges && badges.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {badges.map((badge, idx) => (
                <span key={idx} className="rounded-md bg-blue-50/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-600 border border-blue-200 shadow-sm">
                  {badge}
                </span>
              ))}
            </div>
          )}
          <div className="text-slate-800">{text}</div>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-bold uppercase tracking-widest text-slate-400">{label}</div>
      <div className="mt-2 text-2xl font-bold text-slate-950">{value}</div>
    </div>
  );
}

function GraphDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#1E293B] bg-[#08111F] p-4">
      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</div>
      <div className="mt-2 text-sm font-semibold text-slate-100">{value}</div>
    </div>
  );
}
