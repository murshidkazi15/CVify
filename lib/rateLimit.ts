export interface RateData {
    lastRequest: number;
    dailyGeminiCount: number;
    resetDate: string;
}

const ipCache = new Map<string, RateData>();

export function getRateLimit(ip: string) {
    const now = Date.now();
    const today = new Date().toISOString().split('T')[0];

    if (!ipCache.has(ip)) {
        ipCache.set(ip, {
            lastRequest: 0,
            dailyGeminiCount: 0,
            resetDate: today,
        });
    }

    const data = ipCache.get(ip)!;

    // Reset daily counts automatically every 24 hours
    if (data.resetDate !== today) {
        data.dailyGeminiCount = 0;
        data.resetDate = today;
    }

    const timeSinceLast = now - data.lastRequest;
    const isCooldown = timeSinceLast < 6000;

    if (!isCooldown) {
        // Only update last request tracking if we are allowing the request through
        data.lastRequest = now;
    }

    return {
        isCooldown,
        canUseGemini: data.dailyGeminiCount < 8,
        incrementGemini: () => {
            data.dailyGeminiCount++;
        }
    };
}
