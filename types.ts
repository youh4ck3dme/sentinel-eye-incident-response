
export enum RiskLevel {
  INFO = 'INFO',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum ThreatStatus {
  SAFE = 'SAFE',
  WARNING = 'WARNING',
  DANGER = 'DANGER',
  MONITORING = 'MONITORING'
}

export interface ActionButton {
  label: string;
  action: string;
  color: string;
}

export interface RiskMatrix {
  likelihood: number; // 0-1
  impact: number; // 0-1
  composite_score: number; // 0-100
}

export interface ForensicIndicator {
  type: string;
  value: string;
  confidence: number;
}

export interface MitigationStep {
  id: string;
  step: string;
  status: 'pending' | 'active' | 'completed';
}

export interface SecurityAnalysisResponse {
  status: ThreatStatus;
  call_status: ThreatStatus; // Aligned with user request
  threat_type: string;
  technical_detail: string;
  risk_level: RiskLevel;
  user_message: string;
  action_button: ActionButton;

  // 1000% Expansion Fields
  risk_matrix: RiskMatrix;
  forensics: ForensicIndicator[];
  mitigation_workflow: MitigationStep[];

  // Call-specific fields
  scam_probability?: number;
  detected_keyword?: string;
  alert_message?: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  input: string;
  result: SecurityAnalysisResponse;
  images?: string[];
  audio?: string;
  ttsAudio?: string;
  telemetry_pulse?: number[]; // For live graphing
}
