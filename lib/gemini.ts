import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateCVVersions(text: string) {
    const prompt = `You are an elite resume strategist writing for top-tier candidates and a brutally honest translator.
Create EXTREME contrast between the two CV bullet point versions.

User input: "${text}"

Return ONLY valid JSON in this exact format:
{
  "professional": "...",
  "honest": "..."
}

Rules for Professional (Elite High-Impact Mode):
- Goal: Make the candidate sound exceptionally capable, strategic, and high-performing — even if the original task is simple.
- Use advanced, industry-relevant terminology where appropriate.
- Use strong, varied action verbs (avoid repetition).
- Add structured complexity to the sentence (layered phrasing) and include implied impact (efficiency, performance, reliability, outcomes).
- Expand simple actions into higher-level contributions (strategy, coordination, optimization, execution).
- Keep it to ONE sentence. Maintain credibility — do NOT fabricate unrealistic claims (no fake numbers or impossible scale).
- Vary sentence structure and vocabulary across generations.
- Style: Sophisticated, polished, slightly dense. Reads like top-tier consulting / investment banking / technical operations CV.
- Avoid generic filler like "results-driven" or "dynamic environment". Avoid repeating words like "leveraged", "optimized", "spearheaded" too frequently. Prefer context-specific wording over generic corporate buzzwords.
- Structure Guideline: [Advanced Action Verb] + [Expanded interpretation of task] + [how/with what] + [strategic or operational impact]

Examples for Professional:
* "helped my friend with homework" -> "Provided structured academic support by deconstructing complex concepts and reinforcing problem-solving approaches to improve comprehension."
* "ran instagram page" -> "Oversaw social media operations, developing and executing content strategies to enhance audience engagement and platform growth."
* "technical operations internship" -> "Supported core technical operations by contributing to infrastructure oversight and assisting in maintaining system stability and performance continuity."
* "answered emails" -> "Managed inbound communications, ensuring timely and accurate responses to support operational coordination and stakeholder alignment."

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
