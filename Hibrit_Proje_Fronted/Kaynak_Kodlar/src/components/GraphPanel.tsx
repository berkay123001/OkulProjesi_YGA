import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Database, ZoomIn, ZoomOut, RefreshCw, Filter, Info, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Tip Tanımları ────────────────────────────────────────────────────────────
interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  type: string;
  confidence?: 'verified' | 'high' | 'medium' | 'low';
}

interface GraphEdge {
  source: string;
  target: string;
  relation: string;
  confidence: 'verified' | 'high' | 'medium' | 'low';
  tool: string;
}

// ─── Mock Veri (Makale Tablo III ve Şekil 1'e göre) ─────────────────────────
const MOCK_NODES: GraphNode[] = [
  { id: 'p1', label: 'berkay.hasret', type: 'Person', confidence: 'verified' },
  { id: 'u1', label: '@bhasret_dev', type: 'Username', confidence: 'high' },
  { id: 'u2', label: '@bhasret', type: 'Username', confidence: 'medium' },
  { id: 'e1', label: 'b.hasret@firat.edu.tr', type: 'Email', confidence: 'verified' },
  { id: 'e2', label: 'bhasret@gmail.com', type: 'Email', confidence: 'high' },
  { id: 'pf1', label: 'GitHub/bhasret', type: 'Profile', confidence: 'verified' },
  { id: 'pf2', label: 'LinkedIn', type: 'Profile', confidence: 'medium' },
  { id: 'pl1', label: 'Twitter/X', type: 'Platform', confidence: 'high' },
  { id: 'pl2', label: 'GitHub', type: 'Platform', confidence: 'verified' },
  { id: 'l1', label: 'Elazığ, TR', type: 'Location', confidence: 'medium' },
  { id: 'o1', label: 'Fırat Üniversitesi', type: 'Organization', confidence: 'verified' },
  { id: 'pa1', label: 'OSINT Paper 2025', type: 'Paper', confidence: 'high' },
  { id: 'b1', label: 'HaveIBeenPwned', type: 'Breach', confidence: 'high' },
  { id: 'src1', label: 'GitHub API', type: 'Source', confidence: 'verified' },
  { id: 'src2', label: 'Sherlock', type: 'Source', confidence: 'medium' },
  { id: 'src3', label: 'Holehe', type: 'Source', confidence: 'high' },
];

const MOCK_EDGES: GraphEdge[] = [
  { source: 'p1', target: 'u1', relation: 'HAS_USERNAME', confidence: 'verified', tool: 'sherlock' },
  { source: 'p1', target: 'u2', relation: 'HAS_USERNAME', confidence: 'medium', tool: 'maigret' },
  { source: 'p1', target: 'e1', relation: 'USES_EMAIL', confidence: 'verified', tool: 'github_api' },
  { source: 'p1', target: 'e2', relation: 'USES_EMAIL', confidence: 'high', tool: 'holehe' },
  { source: 'p1', target: 'o1', relation: 'WORKS_AT', confidence: 'verified', tool: 'github_api' },
  { source: 'p1', target: 'l1', relation: 'LOCATED_IN', confidence: 'medium', tool: 'search_web' },
  { source: 'u1', target: 'pf1', relation: 'HAS_PROFILE', confidence: 'verified', tool: 'github_api' },
  { source: 'u2', target: 'pl1', relation: 'ON_PLATFORM', confidence: 'medium', tool: 'sherlock' },
  { source: 'pf1', target: 'pl2', relation: 'ON_PLATFORM', confidence: 'verified', tool: 'github_api' },
  { source: 'pf2', target: 'pl2', relation: 'ON_PLATFORM', confidence: 'medium', tool: 'maigret' },
  { source: 'e2', target: 'b1', relation: 'LEAKED_IN', confidence: 'high', tool: 'hibp' },
  { source: 'p1', target: 'pa1', relation: 'AUTHORED_BY', confidence: 'high', tool: 'academic_agent' },
  { source: 'src1', target: 'e1', relation: 'ANALYZED', confidence: 'verified', tool: 'github_api' },
  { source: 'src2', target: 'u1', relation: 'ANALYZED', confidence: 'medium', tool: 'sherlock' },
  { source: 'src3', target: 'e2', relation: 'ANALYZED', confidence: 'high', tool: 'holehe' },
];

// ─── Renk Paleti ──────────────────────────────────────────────────────────────
const NODE_COLORS: Record<string, string> = {
  Person: '#2563EB',
  Username: '#7C3AED',
  Email: '#0891B2',
  Profile: '#059669',
  Platform: '#D97706',
  Location: '#DC2626',
  Organization: '#1D4ED8',
  Paper: '#9333EA',
  Breach: '#B91C1C',
  Source: '#374151',
};

const CONFIDENCE_COLORS: Record<string, string> = {
  verified: '#16A34A',
  high: '#2563EB',
  medium: '#D97706',
  low: '#DC2626',
};

const CONFIDENCE_DASH: Record<string, string> = {
  verified: 'none',
  high: 'none',
  medium: '5,4',
  low: '2,4',
};

// ─── Bileşen ──────────────────────────────────────────────────────────────────
export const GraphPanel: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [zoom, setZoom] = useState(1);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  const nodeTypes = ['all', ...Array.from(new Set(MOCK_NODES.map(n => n.type)))];

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth || 900;
    const height = svgRef.current.clientHeight || 600;

    // ─── Filtre ───────────────────────────────────────────────
    const filteredNodes = filterType === 'all'
      ? MOCK_NODES
      : MOCK_NODES.filter(n => n.type === filterType);
    const filteredIds = new Set(filteredNodes.map(n => n.id));
    const filteredEdges = MOCK_EDGES.filter(
      e => filteredIds.has(e.source as string) && filteredIds.has(e.target as string)
    );

    // ─── Zoom/Pan ─────────────────────────────────────────────
    const g = svg.append('g');
    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
        setZoom(Math.round(event.transform.k * 100) / 100);
      });
    svg.call(zoomBehavior);
    zoomRef.current = zoomBehavior;

    // ─── Ok uçları (arrowhead) ────────────────────────────────
    const defs = svg.append('defs');
    (['verified', 'high', 'medium', 'low'] as const).forEach(conf => {
      defs.append('marker')
        .attr('id', `arrow-${conf}`)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 22)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', CONFIDENCE_COLORS[conf]);
    });

    // ─── Force Simulation ─────────────────────────────────────
    const simulation = d3.forceSimulation<GraphNode>(filteredNodes)
      .force('link', d3.forceLink<GraphNode, GraphEdge>(filteredEdges)
        .id(d => d.id)
        .distance(100)
      )
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide(38));

    // ─── Kenarlar ─────────────────────────────────────────────
    const link = g.append('g')
      .selectAll<SVGLineElement, GraphEdge>('line')
      .data(filteredEdges)
      .enter()
      .append('line')
      .attr('stroke', d => CONFIDENCE_COLORS[d.confidence])
      .attr('stroke-opacity', 0.7)
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', d => CONFIDENCE_DASH[d.confidence])
      .attr('marker-end', d => `url(#arrow-${d.confidence})`);

    // Kenar etiketleri
    const linkLabel = g.append('g')
      .selectAll<SVGTextElement, GraphEdge>('text')
      .data(filteredEdges)
      .enter()
      .append('text')
      .attr('font-size', 8)
      .attr('fill', '#9CA3AF')
      .attr('text-anchor', 'middle')
      .text(d => d.relation);

    // ─── Düğümler ─────────────────────────────────────────────
    const node = g.append('g')
      .selectAll<SVGGElement, GraphNode>('g')
      .data(filteredNodes)
      .enter()
      .append('g')
      .attr('cursor', 'pointer')
      .on('click', (_event, d) => setSelectedNode(d))
      .call(
        d3.drag<SVGGElement, GraphNode>()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x; d.fy = d.y;
          })
          .on('drag', (event, d) => { d.fx = event.x; d.fy = event.y; })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null; d.fy = null;
          })
      );

    // Çember arka plan (glow)
    node.append('circle')
      .attr('r', 20)
      .attr('fill', d => (NODE_COLORS[d.type] || '#6B7280') + '22')
      .attr('stroke', d => NODE_COLORS[d.type] || '#6B7280')
      .attr('stroke-width', 1.5);

    // Güven skoru halkası
    node.append('circle')
      .attr('r', 23)
      .attr('fill', 'none')
      .attr('stroke', d => CONFIDENCE_COLORS[d.confidence ?? 'low'])
      .attr('stroke-width', 2.5)
      .attr('stroke-dasharray', d => CONFIDENCE_DASH[d.confidence ?? 'low'])
      .attr('opacity', 0.7);

    // Tip baş harfi
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-size', 10)
      .attr('font-weight', 'bold')
      .attr('fill', d => NODE_COLORS[d.type] || '#6B7280')
      .text(d => d.type[0]);

    // Etiket
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', 32)
      .attr('font-size', 9)
      .attr('fill', '#374151')
      .attr('font-weight', '600')
      .text(d => d.label.length > 16 ? d.label.substring(0, 14) + '…' : d.label);

    // ─── Simülasyon tick ──────────────────────────────────────
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as GraphNode).x ?? 0)
        .attr('y1', d => (d.source as GraphNode).y ?? 0)
        .attr('x2', d => (d.target as GraphNode).x ?? 0)
        .attr('y2', d => (d.target as GraphNode).y ?? 0);

      linkLabel
        .attr('x', d => (((d.source as GraphNode).x ?? 0) + ((d.target as GraphNode).x ?? 0)) / 2)
        .attr('y', d => (((d.source as GraphNode).y ?? 0) + ((d.target as GraphNode).y ?? 0)) / 2);

      node.attr('transform', d => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });

    return () => { simulation.stop(); };
  }, [filterType]);

  const handleZoomIn = () => {
    if (!svgRef.current || !zoomRef.current) return;
    d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, 1.3);
  };

  const handleZoomOut = () => {
    if (!svgRef.current || !zoomRef.current) return;
    d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, 0.7);
  };

  const handleReset = () => {
    if (!svgRef.current || !zoomRef.current) return;
    d3.select(svgRef.current).transition().duration(400).call(
      zoomRef.current.transform, d3.zoomIdentity
    );
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Header */}
      <div className="shrink-0 px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100">
            <Database className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">Neo4j Graf Görselleştirmesi</h2>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">D3.js · Force-Directed · Kaynak-Farklı Güven Skorları</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={filterType}
              onChange={e => { setFilterType(e.target.value); setSelectedNode(null); }}
              className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-700 font-medium focus:outline-none focus:border-blue-400"
            >
              {nodeTypes.map(t => <option key={t} value={t}>{t === 'all' ? 'Tüm Düğümler' : t}</option>)}
            </select>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1 border border-gray-100">
            <button onClick={handleZoomOut} className="p-1.5 rounded-lg hover:bg-white hover:shadow-sm transition-all text-gray-500">
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-bold text-gray-500 w-10 text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={handleZoomIn} className="p-1.5 rounded-lg hover:bg-white hover:shadow-sm transition-all text-gray-500">
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button onClick={handleReset} className="p-1.5 rounded-lg hover:bg-white hover:shadow-sm transition-all text-gray-500">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Graph Canvas */}
        <div className="flex-1 relative bg-gray-50/40 overflow-hidden">
          <svg ref={svgRef} className="w-full h-full" />

          {/* Güven Skoru Açıklaması */}
          <div className="absolute bottom-4 left-4 bg-white rounded-xl border border-gray-100 shadow-sm p-3 flex flex-col gap-2">
            <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1">
              <Shield className="w-3 h-3" /> Güven Skoru (Kenar)
            </span>
            {(['verified', 'high', 'medium', 'low'] as const).map(c => (
              <div key={c} className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div
                    className="w-8 h-0.5"
                    style={{
                      backgroundColor: CONFIDENCE_COLORS[c],
                      borderTop: c === 'medium' ? `2px dashed ${CONFIDENCE_COLORS[c]}` :
                        c === 'low' ? `2px dotted ${CONFIDENCE_COLORS[c]}` : undefined
                    }}
                  />
                </div>
                <span className="text-[10px] font-bold capitalize" style={{ color: CONFIDENCE_COLORS[c] }}>{c}</span>
              </div>
            ))}
          </div>

          {/* Düğüm Tipi Renk Açıklaması */}
          <div className="absolute bottom-4 right-4 bg-white rounded-xl border border-gray-100 shadow-sm p-3 flex flex-col gap-1.5 max-h-48 overflow-y-auto">
            <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Düğüm Tipleri</span>
            {Object.entries(NODE_COLORS).map(([type, color]) => (
              <div key={type} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                <span className="text-[10px] font-medium text-gray-600">{type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sağ: Seçili Düğüm Detay Paneli */}
        <div className="w-64 shrink-0 border-l border-gray-100 flex flex-col bg-white overflow-y-auto">
          <div className="p-4 border-b border-gray-100 flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-700">Düğüm Detayı</span>
          </div>

          {selectedNode ? (
            <div className="p-4 flex flex-col gap-4">
              {/* Tip Badge */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center border"
                  style={{ backgroundColor: (NODE_COLORS[selectedNode.type] || '#6B7280') + '15', borderColor: (NODE_COLORS[selectedNode.type] || '#6B7280') + '40' }}>
                  <span className="text-sm font-bold" style={{ color: NODE_COLORS[selectedNode.type] || '#6B7280' }}>
                    {selectedNode.type[0]}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">{selectedNode.label}</p>
                  <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">{selectedNode.type}</p>
                </div>
              </div>

              {/* Güven Skoru */}
              <div className="p-3 rounded-xl border border-gray-100 bg-gray-50">
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">Güven Seviyesi</p>
                <span
                  className="text-xs font-bold uppercase px-2 py-1 rounded-lg border"
                  style={{
                    color: CONFIDENCE_COLORS[selectedNode.confidence ?? 'low'],
                    backgroundColor: CONFIDENCE_COLORS[selectedNode.confidence ?? 'low'] + '15',
                    borderColor: CONFIDENCE_COLORS[selectedNode.confidence ?? 'low'] + '40'
                  }}
                >
                  {selectedNode.confidence}
                </span>
              </div>

              {/* İlişkiler */}
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2">İlgili Kenarlar</p>
                <div className="flex flex-col gap-1.5">
                  {MOCK_EDGES
                    .filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
                    .map((e, i) => (
                      <div key={i} className="p-2 rounded-lg border border-gray-100 bg-gray-50">
                        <p className="text-[10px] font-bold text-blue-600">{e.relation}</p>
                        <p className="text-[9px] text-gray-500 mt-0.5">Araç: <span className="font-medium">{e.tool}</span></p>
                        <p className="text-[9px]" style={{ color: CONFIDENCE_COLORS[e.confidence] }}>
                          {e.confidence}
                        </p>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center opacity-50">
              <Database className="w-10 h-10 text-gray-300 mb-3" />
              <p className="text-xs font-medium text-gray-400">Bir düğüme tıklayarak<br />detaylarını görüntüleyin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
