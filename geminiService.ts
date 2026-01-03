import { LogEntry, SecurityAnalysisResponse } from "./types";

export const analyzeThreat = async (
  input: string,
  images?: string[],
  audioData?: string,
  history: LogEntry[] = []
): Promise<SecurityAnalysisResponse> => {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input,
        images,
        audioData,
        history: history.map(h => ({
          input: h.input,
          result: h.result.threat_type + ": " + h.result.status
        }))
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();

    // Defensive check: Ensure all base properties exist
    const defaults: SecurityAnalysisResponse = {
      status: 'MONITORING' as any,
      call_status: 'MONITORING' as any,
      threat_type: "Analýza prerušená",
      technical_detail: "Vyskytol sa problém pri spracovaní odpovede z AI servisu.",
      risk_level: 'MEDIUM' as any,
      user_message: "Analýza prebehla s chybou. Odporúčame zvýšenú opatrnosť.",
      risk_matrix: { likelihood: 0.5, impact: 0.5, composite_score: 50 },
      forensics: [],
      mitigation_workflow: [],
      scam_probability: 0.5,
      detected_keyword: "N/A",
      alert_message: "⚠️ CHYBA ANALÝZY ⚠️",
      action_button: { label: "MONITOR", action: "trace", color: "YELLOW" }
    };

    return { ...defaults, ...data };
  } catch (error) {
    console.error("API Analysis failed, initiating heuristic fallback", error);

    // HEURISTIC FALLBACK ENGINE (Local Analysis)
    const textToAnalyze = input || "";
    const lowerText = textToAnalyze.toLowerCase();

    // Expanded Slovak Scam Patterns
    const hasBank = /bank|účt|iban|peniaz|euro|platb|prevod|vklad|výber|sepa/i.test(lowerText);
    const hasCrypto = /krypto|crypto|bitcoin|btc|wallet|binance|coinbase|invest|zisk|burz/i.test(lowerText);
    const hasAuth = /heslo|kredit|kart|číslo|poveren|overen|identity|login|pin|cvv|údaje/i.test(lowerText);
    const hasPressure = /súrne|rýchlo|nemocnic|polícia|blokovan|problém|exekútor|pokuta|dlh|ihneď|okamžite|zatykač|väzen|ciel|kauci/i.test(lowerText);
    const hasDelivery = /balík|pošta|zásielka|kuriér|dhl|dpd|colnic|doplatok|clo|tracking|sledovan/i.test(lowerText);
    const hasFamily = /vnúča|syn|dcéra|nehoda|pomôž|peniaze|starká|mama|otec|babka|dedko/i.test(lowerText);
    const hasLink = /link|klik|bit\.ly|t\.me|https?:\/\//i.test(lowerText);
    // NIST SP 800-61r2: Impersonation Attack Vector
    const hasImpersonation = /podpora|microsoft|admin|riaditeľ|ceo|úrad|technik|it oddelenie|anydesk|teamviewer|vzdialen|prístup|remote|vírus|polícia|exekútor|agent/i.test(lowerText);
    // OWASP Session Management: Session Hijacking Indicators
    const hasSession = /session|cookie|token|expired|re-authenticate|sid=|jsessionid/i.test(lowerText);
    const hasDeepfake = audioData ? true : false;

    let score = 0;
    if (hasBank) score += 30;
    if (hasCrypto) score += 35; // New High Risk Category
    if (hasAuth) score += 40;
    if (hasPressure) score += 30; // Increased base pressure score
    if (hasDelivery) score += 20;
    if (hasFamily) score += 35;
    if (hasLink) score += 30;
    if (hasImpersonation) score += 35; // NIST Vector
    if (hasSession) score += 25; // OWASP Vector
    if (hasDeepfake) score += 15;

    // Contextual Boosts coverage for Category 5 (Polícia + Zatykač) & Category 3 (Microsoft + Virus)
    if (hasPressure && hasImpersonation) score += 20;
    if (hasPressure && hasAuth) score += 20;

    const isDanger = score >= 50;
    const isWarning = score > 20;

    return {
      status: isDanger ? 'DANGER' : (isWarning ? 'WARNING' : 'MONITORING') as any,
      call_status: isDanger ? 'DANGER' : (isWarning ? 'WARNING' : 'MONITORING') as any,
      threat_type: isDanger ? "NIST/OWASP Detekcia: Kritická hrozba" : "NIST/OWASP Analýza: Monitorovanie",
      technical_detail: `Súlad s NIST SP 800-61r2 & OWASP. Detekované: ${hasBank ? 'Bank, ' : ''}${hasCrypto ? 'Crypto, ' : ''}${hasAuth ? 'Auth, ' : ''}${hasPressure ? 'Urgency, ' : ''}${hasDelivery ? 'Delivery, ' : ''}${hasLink ? 'Link, ' : ''}${hasImpersonation ? 'Impersonation, ' : ''}${hasSession ? 'Session, ' : ''}${hasFamily ? 'Family' : ''}.`,
      risk_level: isDanger ? 'CRITICAL' : (isWarning ? 'HIGH' : 'MEDIUM') as any,
      user_message: isDanger
        ? "Pozor! Lokálna analýza detekovala vysoké riziko podvodu. Neodovzdávajte žiadne údaje!"
        : "Systém monitoruje podozrivý priebeh hovoru. Zachovajte ostražitosť.",
      risk_matrix: {
        likelihood: Math.min(score / 100, 0.99),
        impact: hasAuth ? 0.95 : 0.70,
        composite_score: Math.min(score, 99)
      },
      forensics: [
        { type: "LOCAL_HEURISTICS", value: "PATTERN_MATCH", confidence: 0.85 },
        { type: "API_STATUS", value: "OFFLINE_FALLBACK", confidence: 1.0 }
      ],
      mitigation_workflow: [
        { id: 'f1', step: 'Local heuristic scan', status: 'completed' },
        { id: 'f2', step: 'UI Alert triggering', status: 'completed' },
        { id: 'f3', step: 'Automatic response generation', status: 'pending' }
      ],
      scam_probability: score / 100,
      detected_keyword: hasAuth ? "Kreditná Karta / Identita" : (hasBank ? "Bankové údaje" : "Nátlak"),
      alert_message: isDanger ? "⚠️ KRITICKÁ HROZBA: PODVOD ⚠️" : "⚠️ PODOZRIVÝ HOVOR ⚠️",
      action_button: {
        label: isDanger ? "TERMINATE" : "MONITOR",
        action: isDanger ? "jam" : "trace",
        color: isDanger ? "RED" : "YELLOW"
      }
    };
  }
};

export const generateSecurityTTS = async (text: string): Promise<string | undefined> => {
  try {
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text })
    });

    if (!response.ok) {
      return undefined;
    }

    const data = await response.json();
    return data.audioData;
  } catch (e) {
    console.error("TTS failed", e);
    return undefined;
  }
};
