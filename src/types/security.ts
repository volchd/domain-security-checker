export interface ScoreItem {
  name: string;
  description: string;
  score: number;
  maxScore: number;
  passed: boolean;
  details: string;
}

export interface SecurityScore {
  totalScore: number;
  maxPossibleScore: number;
  percentage: number;
  scoreItems: ScoreItem[];
}

export interface SecurityScores {
  spf: SecurityScore;
  dkim: SecurityScore;
  dmarc: SecurityScore;
}

export interface SecurityReport {
  domain: string;
  scores: SecurityScores;
  totalScore: number;
  maxPossibleScore: number;
  percentage: number;
  requestId: string;
  responseTime: number;
  timestamp: string;
}

export type SecurityProtocol = 'spf' | 'dkim' | 'dmarc'; 