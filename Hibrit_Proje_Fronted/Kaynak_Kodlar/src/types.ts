export type ViewType =
  | 'dashboard'
  | 'analysis_workspace'
  | 'neo4j_graph'
  | 'report';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  kind?: 'analysis_response' | 'report';
}

export interface ToolDetail {
  toolName: string;
  toolCallId?: string;
  output: string;
}

export interface TelemetrySummary {
  calls?: number;
  costUsd?: number;
  [key: string]: unknown;
}

export interface GraphNode {
  id: string;
  label?: string;
  caption?: string;
  [key: string]: unknown;
}

export interface GraphEdge {
  from?: string;
  to?: string;
  source?: string;
  target?: string;
  label?: string;
  caption?: string;
  [key: string]: unknown;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface HealthStatus {
  status?: string;
  version?: string;
  uptime?: string;
  neo4j?: string;
  sessionId?: string;
  toolCount?: number;
  [key: string]: unknown;
}

export interface HistoryResponse {
  messages?: ChatMessage[];
  [key: string]: unknown;
}

export type SseEvent =
  | {
      type: 'init';
      sessionId?: string;
      processing?: boolean;
      messageCount?: number;
      telemetry?: TelemetrySummary;
      replayEvents?: SseEvent[];
    }
  | { type: 'user_message'; content?: string; ts?: string }
  | { type: 'status'; processing?: boolean }
  | { type: 'progress'; msg?: string; ts?: string }
  | { type: 'detail'; toolName?: string; toolCallId?: string; output?: string }
  | { type: 'telemetry'; msg?: string; ts?: string; telemetry?: TelemetrySummary; summary?: TelemetrySummary }
  | { type: 'response'; content?: string }
  | { type: 'error'; message?: string }
  | { type: 'reset'; sessionId?: string }
  | { type: 'session_graph_dirty' };
