import { SecurityAnalysisResponse, ThreatStatus, RiskLevel } from '../../../types';

export const safeThreatResponse: SecurityAnalysisResponse = {
    status: ThreatStatus.SAFE,
    call_status: ThreatStatus.SAFE,
    threat_type: 'Žiadna hrozba',
    technical_detail: 'Vstup neobsahuje podozrivé vzory',
    risk_level: RiskLevel.INFO,
    user_message: 'Vstup sa javí ako bezpečný.',
    action_button: {
        label: 'OK',
        action: 'dismiss',
        color: 'GREEN'
    },
    risk_matrix: {
        likelihood: 0.1,
        impact: 0.1,
        composite_score: 10
    },
    forensics: [],
    mitigation_workflow: []
};

export const warningThreatResponse: SecurityAnalysisResponse = {
    status: ThreatStatus.WARNING,
    call_status: ThreatStatus.WARNING,
    threat_type: 'Podozrivá aktivita',
    technical_detail: 'Detekované potenciálne phishingové vzory',
    risk_level: RiskLevel.HIGH,
    user_message: 'Zachovajte ostražitosť pri tomto obsahu.',
    action_button: {
        label: 'MONITOR',
        action: 'trace',
        color: 'YELLOW'
    },
    risk_matrix: {
        likelihood: 0.5,
        impact: 0.6,
        composite_score: 55
    },
    forensics: [
        { type: 'PATTERN', value: 'SUSPICIOUS_LINK', confidence: 0.7 }
    ],
    mitigation_workflow: [
        { id: 'm1', step: 'Monitorovať aktivitu', status: 'pending' }
    ],
    scam_probability: 0.55,
    detected_keyword: 'Podozrivý odkaz'
};

export const dangerThreatResponse: SecurityAnalysisResponse = {
    status: ThreatStatus.DANGER,
    call_status: ThreatStatus.DANGER,
    threat_type: 'NIST/OWASP Detekcia: Kritická hrozba',
    technical_detail: 'Detekované: Bank, Auth, Urgency.',
    risk_level: RiskLevel.CRITICAL,
    user_message: 'Pozor! Vysoké riziko podvodu. Neodovzdávajte žiadne údaje!',
    action_button: {
        label: 'TERMINATE',
        action: 'jam',
        color: 'RED'
    },
    risk_matrix: {
        likelihood: 0.95,
        impact: 0.95,
        composite_score: 95
    },
    forensics: [
        { type: 'LOCAL_HEURISTICS', value: 'PATTERN_MATCH', confidence: 0.85 },
        { type: 'BANK_FRAUD', value: 'IBAN_REQUEST', confidence: 0.9 }
    ],
    mitigation_workflow: [
        { id: 'f1', step: 'Local heuristic scan', status: 'completed' },
        { id: 'f2', step: 'UI Alert triggering', status: 'completed' },
        { id: 'f3', step: 'Connection termination', status: 'pending' }
    ],
    scam_probability: 0.95,
    detected_keyword: 'Kreditná Karta / Identita',
    alert_message: '⚠️ KRITICKÁ HROZBA: PODVOD ⚠️'
};
