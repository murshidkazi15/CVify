import { NextResponse } from 'next/server';
import { generateCVVersions } from '@/lib/gemini';
import { generateSmartFallback } from '@/lib/smartFallback';
import { getRateLimit } from '@/lib/rateLimit';

export async function POST(request: Request) {
    try {
        // Detect IP safely
        const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';

        // Evaluate constraints via tracking
        const { isCooldown, canUseGemini, incrementGemini } = getRateLimit(ip);

        if (isCooldown) {
            return NextResponse.json({
                error: "Please wait a few seconds before generating again.",
                cooldown: true
            }, { status: 429 });
        }

        const body = await request.json();
        const { text } = body;

        if (!text || typeof text !== 'string') {
            return NextResponse.json({ error: 'Valid text is required' }, { status: 400 });
        }

        if (canUseGemini) {
            try {
                const { professional, honest, source } = await generateCVVersions(text);
                if (source === 'ai') {
                    incrementGemini();
                }
                return NextResponse.json({ professional, honest, source });
            } catch (geminiError) {
                // Automatically default gracefully if API breaks externally
                console.error("Gemini failed during primary execution: ", geminiError);
                return NextResponse.json(generateSmartFallback(text));
            }
        } else {
            // Intentionally bypassed due to quota maxout this 24hr block
            return NextResponse.json(generateSmartFallback(text));
        }
    } catch (error) {
        console.error("Critical API route error (Never crash):", error);
        return NextResponse.json({
            professional: "Executed assigned responsibilities efficiently.",
            honest: "Completed the required tasks.",
            source: "smart-fallback"
        });
    }
}
