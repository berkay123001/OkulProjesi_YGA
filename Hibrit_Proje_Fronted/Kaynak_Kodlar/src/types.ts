export type ViewType =
  | 'dashboard'
  | 'new_analysis'
  | 'analysis_workspace'
  | 'neo4j_graph'
  | 'report'
  | 'summary'
  | 'detail'
  | 'osint'
  | 'graph'
  | 'agent_chat';

export interface AnalysisResult {
  id: string;
  type: 'visual' | 'semantic';
  score: number;
  label: string;
  description: string;
  timestamp: string;
}

export interface PipelineStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  agent?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  agentName?: string;
  agentRole?: string;
  agentIcon?: string;
  status?: string;
  statusType?: 'info' | 'success' | 'warning' | 'error';
  pipeline?: PipelineStep[];
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  lastUpdated: string;
}
