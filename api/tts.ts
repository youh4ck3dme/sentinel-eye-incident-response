
import { GoogleGenAI, Modality } from "@google/genai";

const TTS_INSTRUCTION = `You are a robotic, authoritative security system interrupting a scam call.
Generate a short, strict warning to be played to a fraudster.
Context: Fraud detected. Terminating connection.
Language: English (as it is universally understood in global scam scenarios) or Slovak depending on context.`;

export const handleTTS = async (reqBody: { text: string }, apiKey: string) => {
    const { text } = reqBody;
    if (!apiKey) {
        throw new Error("No API Key");
    }

    const ai = new GoogleGenAI({ apiKey });

    try {
        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: [{ parts: [{ text: `Say with extreme authority: ${text}` }] }],
            config: {
                systemInstruction: TTS_INSTRUCTION,
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Charon' } },
                },
            },
        });
        return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    } catch (error) {
        console.error("Backend TTS failed", error);
        throw error;
    }
};
