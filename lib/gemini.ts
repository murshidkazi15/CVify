import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateCVVersions(text: string) {
    const prompt = `You are an expert resume writer, recruiter, and brutally honest translator.
Create EXTREME contrast between the two CV bullet point versions.

User input: "${text}"

Return ONLY valid JSON in this exact format:
{
  "professional": "...",
  "honest": "..."
}

Rules for Professional:
- natural and context-aware
- varied in wording (avoid repetitive corporate buzzwords)
- specific to the type of task described
- clear and concise
- professional but not exaggerated
- IMPORTANT 1: DO NOT overuse the same verbs like "spearheaded", "leveraged", "optimized", "facilitated"
- IMPORTANT 2: Choose verbs and phrasing based on context (teaching -> explained, guided; teamwork -> collaborated, contributed; operations -> handled, managed; technical -> built, improved; communication -> responded, clarified).
- IMPORTANT 3: Avoid generic filler like "driving results", "enhancing performance", "dynamic environment".
- IMPORTANT 4: Keep it to ONE clean sentence (12–18 words).
- IMPORTANT 5: Make it sound like a REAL resume bullet written by a human. Vary sentence structure.

Examples for Professional:
* "helped my friend with homework" -> "Guided a peer through academic material, helping clarify concepts and improve understanding."
* "ran instagram page" -> "Managed an Instagram account, creating content and maintaining consistent audience engagement."
* "organized an event" -> "Coordinated event logistics, ensuring smooth execution and clear communication across participants."

Rules for Honest (Brutal Mode):
- Tone: Extremely honest, blunt, savage, funny, realistic.
- No corporate language, no fluff, no fake professionalism.
- EXACTLY 1 sentence.
- Length: 8-12 words maximum.
- Must be short, punchy, and sharp (e.g., "Did most of it because they had no clue.").

Do NOT include markdown. Do NOT include extra text outside the JSON.
`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json'
        }
    });

    const outputText = response.text || '';
    if (!outputText) throw new Error("Empty response from Gemini API");

    try {
        const parsed = JSON.parse(outputText);
        if (parsed.professional && parsed.honest) {
            return {
                professional: parsed.professional,
                honest: parsed.honest,
                source: "ai"
            };
        }
    } catch (parseError) {
        // Regex extraction fallback for weird completions
        const match = outputText.match(/\{[\s\S]*\}/);
        if (match) {
            const regexParsed = JSON.parse(match[0]);
            if (regexParsed.professional && regexParsed.honest) {
                return {
                    professional: regexParsed.professional,
                    honest: regexParsed.honest,
                    source: "ai"
                };
            }
        }
    }

    throw new Error("Invalid format returned by Gemini");
}
