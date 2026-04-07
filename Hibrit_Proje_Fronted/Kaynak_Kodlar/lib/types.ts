export type ViewType = 'summary' | 'detail' | 'osint';

export interface AnalysisResult {
  id: string;
  type: 'visual' | 'semantic';
  score: number;
  label: string;
  description: string;
  timestamp: string;
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
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  lastUpdated: string;
}
