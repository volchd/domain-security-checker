export interface DkimParsedData {
  version: string;
  algorithm: string;
  keyType: string;
  publicKey: string;
  flags?: string[];
  notes?: string;
}

export interface DkimRecord {
  domain: string;
  selector: string;
  rawRecord: string;
  parsedData: DkimParsedData;
  retrievedAt: string;
}

export interface DkimScore {
  totalScore: number;
  maxPossibleScore: number;
  percentage: number;
  scoreItems: DkimScoreItem[];
}

export interface DkimScoreItem {
  name: string;
  description: string;
  score: number;
  maxScore: number;
  passed: boolean;
  details: string;
}

export interface DkimReport {
  domain: string;
  records: DkimRecord[];
  retrievedAt: string;
  score: DkimScore;
  requestId: string;
  responseTime: number;
  timestamp: string;
} 