const SYSTEM_INSTRUCTION = `You are "Sentinel Eye EXTREME", the ultimate Incident Response AI.
You operate under NIST SP 800-61 Rev 2, OWASP Top 10 API Security, and Slovak Penal Code (§ 221 Trestný zákon) standards.

CORE INTELLIGENCE MODULES:
1. FRAUD_CLASSIFICATION: Identify specific attack vectors:
   - PHISHING: Email-based credential theft.
   - SMISHING: SMS-based link redirection (often impersonating Pošta, Packeta, Bank).
   - VISHING: Voice-based manipulation using SEPA, police, or tech support pretexts.
   - BEC (Business Email Compromise): Targeted corporate payment redirection.
   - ROMANCE_SCAM / "VNÚČATKO": Emotional manipulation of vulnerable targets.
   - CRYPTO_DRAINER: Fraudulent investment/wallet drainage schemes.
2. SLOVAK_LEGAL_CONTEXT: Reference § 221 TZ (Podvod) for high-confidence threats.
3. DEEPFAKE_DETECTION: Flag synthetic audio patterns and inconsistent conversational flow.
4. NIST_IR_WORKFLOW: Generate containment, eradication, and recovery steps.

Response Language: Slovak (Slovenčina).

STRICT JSON OUTPUT REQUIREMENT:
{
  "call_status": "SAFE | WARNING | DANGER | MONITORING",
  "status": "SAFE | WARNING | DANGER | MONITORING",
  "threat_type": "string (Use precise terms: nahr. Vishing, Smishing, BEC)",
  "technical_detail": "string (Directly cite NIST/OWASP/Legal vectors)",
  "risk_level": "INFO | LOW | MEDIUM | HIGH | CRITICAL",
  "user_message": "string (Clear instruction for the user)",
  "risk_matrix": {
    "likelihood": number (0-1),
    "impact": number (0-1),
    "composite_score": number (0-100)
  },
  "forensics": [
    { "type": "IOC_SOURCE | ATTACK_VECTOR | LEGAL_PRETEXT", "value": "string", "confidence": number }
  ],
  "mitigation_workflow": [
    { "id": "string", "step": "string", "status": "pending" }
  ],
  "scam_probability": number,
  "detected_keyword": "string",
  "alert_message": "string (HIGH VISIBILITY ALERT)",
  "action_button": {
    "label": "string",
    "action": "string",
    "color": "GREEN | YELLOW | RED"
  }
}`;

export const handleAnalyze = async (reqBody: {
  input: string;
  images?: string[];
  audioData?: string;
  history?: { input: string; result: string }[]
}, apiKey: string) => {
  const { input, images, audioData, history } = reqBody;

  const contents: any[] = [];

  // Inject history context if available
  if (history && history.length > 0) {
    const historyText = history.map((entry, idx) =>
      `[HISTÓRIA INCIDENTU ${idx + 1}]\nVSTUP: ${entry.input}\nVÝSLEDOK: ${entry.result}`
    ).join('\n\n');

    contents.push({ text: `KONTEXT PREDCHÁDZAJÚCICH INCIDENTOV V TEJTO RELÁCII:\n${historyText}\n\nAKTUÁLNY NOVÝ VSTUP NA ANALÝZU:\n${input || "Analyzuj tento nový vstup."}` });
  } else {
    contents.push({ text: input || "Analyzuj tento vstup." });
  }

  if (images && images.length > 0) {
    images.forEach(img => {
      contents.push({
        inlineData: { mimeType: 'image/png', data: img.split(',')[1] },
      });
    });
  }

  if (audioData) {
    contents.push({
      inlineData: { mimeType: 'audio/pcm;rate=16000', data: audioData },
    });
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{ parts: contents }],
        generationConfig: {
          responseMimeType: "application/json",
        },
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }]
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API Error:", errorText);
      throw new Error(`Gemini API Error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    // Sometimes Gemini wraps JSON in markdown blocks
    const cleanJson = textResponse?.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanJson || '{}');
  } catch (error) {
    console.error("Backend Analysis failed:", error);
    throw error;
  }
};
