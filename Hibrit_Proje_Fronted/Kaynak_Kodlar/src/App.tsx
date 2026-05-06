import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Bot,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Clock3,
  Database,
  FileText,
  Globe2,
  Network,
  Send,
  ShieldCheck,
  UserRound,
  Zap
} from 'lucide-react';
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
  },
  {
    id: 'image-context',
    title: 'Manipüle görsel doğrulaması',
    status: 'Kısmen doğrulandı',
    score: 82,
    date: '05.05.2026',
  },
  {
    id: 'academic-plagiarism',
    title: 'Akademik intihal taraması',
    status: 'Belirsiz',
    score: 54,
    date: '04.05.2026',
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
  { id: 'claim', label: 'Claim', icon: AlertTriangle, className: 'left-[44%] top-[42%] bg-rose-200 text-rose-950 border-rose-300' },
  { id: 'source', label: 'Source A', icon: FileText, className: 'left-[18%] top-[26%] bg-emerald-200 text-emerald-950 border-emerald-300' },
  { id: 'person', label: 'Person', icon: UserRound, className: 'left-[66%] top-[22%] bg-blue-200 text-blue-950 border-blue-300' },
  { id: 'platform', label: 'SocialNet', icon: Globe2, className: 'left-[60%] top-[66%] bg-slate-200 text-slate-950 border-slate-300' },
  { id: 'evidence', label: 'Evidence', icon: CircleDot, className: 'left-[25%] top-[70%] bg-amber-200 text-amber-950 border-amber-300' },
];

const statusStyles: Record<AgentStatus, string> = {
  completed: 'text-[#22C55E] bg-[#22C55E]/10',
  searching: 'text-[#60A5FA] bg-[#2563EB]/15',
  analyzing: 'text-[#22D3EE] bg-[#22D3EE]/10',
  queued: 'text-slate-400 bg-slate-400/10',
  reviewing: 'text-[#F59E0B] bg-[#F59E0B]/10',
};

export default function App() {
  const [view, setView] = useState<ViewType>('dashboard');
  const [query, setQuery] = useState('Sosyal medyada yayılan bu bağış kampanyası gerçek mi? URL ve görsel birlikte incelensin.');
  const [selectedReportId, setSelectedReportId] = useState(reportHistory[0].id);

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-[#EEF6FF] text-slate-950">
      <Sidebar view={view} onViewChange={setView} />

      <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <Header view={view} />
        <section className="min-h-0 flex-1 overflow-hidden">
          {view === 'dashboard' && <Dashboard onViewChange={setView} />}
          {view === 'analysis_workspace' && (
            <AnalysisWorkspace query={query} setQuery={setQuery} onViewChange={setView} />
          )}
          {view === 'neo4j_graph' && (
            <Neo4jGraph
              selectedReportId={selectedReportId}
              onSelectReport={setSelectedReportId}
              onViewChange={setView}
            />
          )}
          {view === 'report' && (
            <Report
              selectedReportId={selectedReportId}
              onSelectReport={setSelectedReportId}
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
    neo4j_graph: 'Neo4j Graph',
    report: 'Rapor',
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#1E293B] bg-[#08111F] px-6 text-white">
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

function Dashboard({ onViewChange }: { onViewChange: (view: ViewType) => void }) {
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

      <div className="mt-6">
        <div className="rounded-lg border border-[#B7D7FF] bg-white/95 shadow-sm shadow-blue-950/5">
          <div className="flex items-center justify-between border-b border-[#D7E7FA] p-5">
            <h2 className="font-display text-lg font-bold">Son Analizler</h2>
            <button onClick={() => onViewChange('analysis_workspace')} className="rounded-lg bg-[#2563EB] px-4 py-2 text-xs font-bold text-white hover:bg-blue-700">
              Analiz Alanına Git
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {recentAnalyses.map((item) => (
              <button
                key={item.title}
                onClick={() => onViewChange('analysis_workspace')}
                className="grid w-full grid-cols-[1fr_120px_90px] items-center gap-4 p-5 text-left hover:bg-slate-50"
              >
                <div>
                  <div className="font-semibold text-[#08111F]">{item.title}</div>
                  <div className="mt-1 text-xs text-slate-500">{item.status}</div>
                </div>
                <span className="rounded-md bg-[#E7F8FF] px-2 py-1 text-center text-xs font-bold text-[#0F1B2E]">{item.tag}</span>
                <span className="text-right text-lg font-bold text-[#2563EB]">{item.score}%</span>
              </button>
            ))}
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

  return (
    <div className="flex h-full min-h-0 overflow-hidden">
      <section className="evidence-page-shell flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="border-b border-[#D7E7FA] bg-white/95 p-4">
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
          />
        </div>

        <div className="shrink-0 border-t border-[#D7E7FA] bg-white/95 p-4">
          <div className="flex items-end gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
            <textarea
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="min-h-11 max-h-28 min-w-0 flex-1 resize-none bg-transparent py-2 text-sm outline-none"
              placeholder="Yeni analiz başlat veya devam sorusu sor..."
            />
            <button className="rounded-md bg-[#2563EB] p-2 text-white hover:bg-blue-700">
              <Send className="h-4 w-4" />
            </button>
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
  onViewChange,
}: {
  selectedReportId: string;
  onSelectReport: (id: string) => void;
  onViewChange: (view: ViewType) => void;
}) {
  const selectedReport = reportHistory.find((report) => report.id === selectedReportId) ?? reportHistory[0];

  return (
    <div className="grid h-full grid-cols-[280px_1fr_340px] overflow-hidden bg-[#08111F] text-white">
      <ReportListPanel
        title="Geçmiş Raporlar"
        selectedReportId={selectedReport.id}
        onSelectReport={onSelectReport}
      />
      <section className="evidence-dotted-canvas relative overflow-hidden text-[#08111F]">
        <div className="absolute left-6 top-6 z-10 flex gap-2">
          <button onClick={() => onViewChange('analysis_workspace')} className="flex items-center gap-2 rounded-lg border border-[#B7D7FF] bg-white/90 px-3 py-2 text-xs font-bold text-[#08111F] shadow-sm">
            <ArrowLeft className="h-4 w-4" />
            Analize Dön
          </button>
          <button onClick={() => onViewChange('report')} className="rounded-lg bg-[#2563EB] px-3 py-2 text-xs font-bold text-white shadow-sm">
            Raporu Gör
          </button>
        </div>
        <svg className="absolute inset-0 h-full w-full opacity-90">
          <line x1="47%" y1="45%" x2="22%" y2="29%" stroke="#22D3EE" strokeWidth="2" />
          <line x1="49%" y1="46%" x2="68%" y2="25%" stroke="#22D3EE" strokeWidth="2" />
          <line x1="49%" y1="49%" x2="62%" y2="68%" stroke="#EF4444" strokeWidth="2" />
          <line x1="44%" y1="49%" x2="29%" y2="72%" stroke="#F59E0B" strokeWidth="2" strokeDasharray="6 6" />
        </svg>
        {graphNodes.map((node) => (
          <div key={node.id} className={cn('absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2', node.className.split(' ').slice(0, 2))}>
            <div className={cn('flex h-16 w-16 items-center justify-center rounded-full border-2 shadow-2xl', node.className)}>
              <node.icon className="h-7 w-7" />
            </div>
            <span className="rounded bg-white/95 px-2 py-1 font-mono text-xs font-bold text-[#08111F] shadow-sm">{node.label}</span>
          </div>
        ))}
      </section>

      <aside className="border-l border-[#1E293B] bg-[#0F1B2E] p-6">
        <div className="flex items-center gap-2">
          <Network className="h-5 w-5 text-[#22D3EE]" />
          <h2 className="font-display text-lg font-bold">Neo4j Detay Paneli</h2>
        </div>
        <div className="mt-6 space-y-4">
          <GraphDetail label="Seçili düğüm" value="Claim: bağış kampanyası gerçek mi?" />
          <GraphDetail label="Seçili rapor" value={selectedReport.title} />
          <GraphDetail label="Güven skoru" value={`${selectedReport.score / 100}`} />
          <GraphDetail label="Destekleyen kenar" value="2 SUPPORTS" />
          <GraphDetail label="Çelişen kenar" value="1 CONTRADICTS" />
        </div>
        <div className="mt-6">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Filtreler</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {['Claim', 'Source', 'Person', 'Evidence', 'Risk'].map((filter) => (
              <button key={filter} className="rounded-md border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:border-blue-400 hover:text-blue-300">
                {filter}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

function Report({
  selectedReportId,
  onSelectReport,
  onViewChange,
}: {
  selectedReportId: string;
  onSelectReport: (id: string) => void;
  onViewChange: (view: ViewType) => void;
}) {
  const selectedReport = reportHistory.find((report) => report.id === selectedReportId) ?? reportHistory[0];

  return (
    <div className="grid h-full grid-cols-[300px_1fr] overflow-hidden">
      <ReportListPanel
        title="Geçmiş Analiz Raporları"
        selectedReportId={selectedReport.id}
        onSelectReport={onSelectReport}
        light
      />
      <div className="evidence-page-shell overflow-auto p-6">
      <div className="mx-auto max-w-5xl rounded-lg border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Final Çıktı</div>
            <h2 className="mt-1 font-display text-2xl font-bold">{selectedReport.title}</h2>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onViewChange('analysis_workspace')} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold">
              Analize Dön
            </button>
            <button className="rounded-lg bg-[#2563EB] px-3 py-2 text-xs font-bold text-white hover:bg-blue-700">
              PDF / Markdown Export
            </button>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_260px] gap-6 p-6">
          <section>
            <div className="rounded-lg border border-[#F59E0B]/30 bg-[#F59E0B]/10 p-4">
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <AlertTriangle className="h-5 w-5" />
                Nihai karar: {selectedReport.status}
              </div>
              <p className="mt-2 text-sm leading-6 text-amber-900">
                Kampanya hakkında destekleyici kaynaklar bulunsa da alan adı yaşı, görsel bağlamı ve topluluk itirazları nedeniyle tam doğrulama yapılamadı.
              </p>
            </div>

            <h3 className="mt-6 font-display text-lg font-bold">Kanıt Özeti</h3>
            <div className="mt-3 overflow-hidden rounded-lg border border-slate-200">
              {evidenceRows.map(([evidence, source, status, score]) => (
                <div key={evidence} className="grid grid-cols-[1fr_120px_120px_70px] items-center gap-3 border-b border-slate-100 p-3 last:border-b-0">
                  <div className="text-sm text-slate-700">{evidence}</div>
                  <div className="text-xs font-bold text-slate-500">{source}</div>
                  <div className="text-xs font-bold text-blue-600">{status}</div>
                  <div className="text-right text-sm font-bold">{score}</div>
                </div>
              ))}
            </div>

            <h3 className="mt-6 font-display text-lg font-bold">Sınırlılıklar</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Bazı sosyal medya kaynakları login wall arkasında kaldığı için topluluk sinyali sınırlı okunmuştur. Görsel metadata sosyal platform yüklemesinde temizlenmiş olabilir.
            </p>
          </section>

          <aside className="space-y-4">
            <Metric label="Güven skoru" value={`${selectedReport.score}%`} />
            <Metric label="Rapor tarihi" value={selectedReport.date} />
            <Metric label="Kanıt sayısı" value="9" />
            <Metric label="Çelişki" value="2" />
            <Metric label="Tool çağrısı" value="17" />
          </aside>
        </div>
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

function ChatBubble({ role, text }: { role: 'user' | 'assistant'; text: string }) {
  return (
    <div className={cn('mb-4 flex', role === 'user' ? 'justify-end' : 'justify-start')}>
      <div className={cn('max-w-[78%] rounded-lg p-4 text-sm leading-6 shadow-sm', role === 'user' ? 'bg-[#2563EB] text-white' : 'border border-slate-200 bg-white text-slate-700')}>
        {text}
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
