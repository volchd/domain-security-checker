export interface SpfRecord {
  domain: string;
  spfRecord: string;
  type: 'initial' | 'redirect' | 'include';
}

export interface ValidationResult {
  isValid: boolean;
  errors?: string[];
}

export interface ValidationResults {
  hasSpfRecord: ValidationResult;
  syntaxValidation: ValidationResult;
  oneInitialSpfRecord: ValidationResult;
  maxTenSpfRecords: ValidationResult;
  deprecatedMechanisms: ValidationResult;
  unsafeAllMechanism: ValidationResult;
  firstAllQualifier: {
    qualifier: string;
  };
}

export interface SpfScoreItem {
  name: string;
  description: string;
  score: number;
  maxScore: number;
  passed: boolean;
  details: string;
}

export interface SpfScoringResults {
  totalScore: number;
  maxPossibleScore: number;
  percentage: number;
  grade: string;
  scoreItems: SpfScoreItem[];
}

export interface SpfReport {
  domain: string;
  spfRecords: SpfRecord[];
  validationResults: ValidationResults;
  scoringResults: SpfScoringResults;
  requestId: string;
  responseTime: number;
  timestamp: string;
} 