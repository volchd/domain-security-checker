export interface DmarcRecord {
  domain: string;
  rawRecord: string;
  parsedData: {
    version: string;
    policy: string;
    subdomainPolicy?: string;
    reportEmails?: string[];
    forensicEmails?: string[];
    failureOptions?: string[];
    percentage?: number;
  };
  retrievedAt: string;
}

export interface DmarcScoreItem {
  name: string;
  description: string;
  score: number;
  maxScore: number;
  passed: boolean;
  details: string;
}

export interface DmarcScore {
  totalScore: number;
  maxPossibleScore: number;
  percentage: number;
  scoreItems: DmarcScoreItem[];
}

export interface DmarcReport {
  record: DmarcRecord;
  score: DmarcScore;
  requestId: string;
  responseTime: number;
  timestamp: string;
} 