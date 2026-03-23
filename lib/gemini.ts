import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateCVVersions(text: string) {
    const prompt = `You are generating CV bullet points from casual user input.
Create EXTREME contrast between the two versions.

User input: "${text}"

Return ONLY valid JSON in this exact format:
{
  "professional": "...",
  "honest": "..."
}

Rules for Professional (Elite Corporate Mode):
- Tone: Highly polished, corporate, impressive, exaggerated, top-tier consultant style.
- Use strong business vocabulary (e.g., spearheaded, orchestrated, leveraged, optimized, facilitated, drove outcomes).
- Rewrite the sentence completely; make small achievements sound major.
- EXACTLY 1 sentence.
- Length: 14-20 words maximum.
- Grammatically perfect and high-impact.

Rules for Honest (Brutal Mode):
- Tone: Extremely honest, blunt, savage, funny, realistic.
- No corporate language, no fluff, no fake professionalism.
- EXACTLY 1 sentence.
- Length: 8-12 words maximum.
- Must be short, punchy, and sharp (e.g., "Did most of it because they had no clue.").
- Do NOT include markdown. Do NOT include extra text outside the JSON.
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
