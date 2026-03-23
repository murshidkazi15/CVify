"use client";

import React, { useState } from 'react';

interface OutputCardProps {
    title: string;
    output: string;
    onRegenerate: () => void;
    type: 'professional' | 'honest';
}

export default function OutputCard({ title, output, onRegenerate, type }: OutputCardProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(output);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    if (!output) return null;

    const isPro = type === 'professional';

    // Theme logic
    const titleColor = isPro ? 'text-blue-400' : 'text-orange-400';
    const textColor = isPro ? 'text-blue-50' : 'text-orange-50';
    const glowBorderClass = isPro
        ? 'hover:border-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]'
        : 'hover:border-orange-500 hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]';

    return (
        <div className={`p-8 bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-3xl flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 transition-all ${glowBorderClass}`}>
            <div className={`${titleColor} text-sm font-bold uppercase tracking-wider`}>{title}</div>
            <p className={`text-3xl ${textColor} font-medium leading-relaxed`}>
                {output}
            </p>
            <div className="flex gap-4 pt-4 border-t border-zinc-800">
                <button
                    onClick={handleCopy}
                    className="flex-1 py-3 px-4 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02]"
                >
                    {copied ? 'Copied!' : 'Copy to Clipboard'}
                </button>
                <button
                    onClick={onRegenerate}
                    className="flex-1 py-3 px-4 bg-transparent border border-zinc-700 hover:bg-zinc-800 active:bg-zinc-900 text-zinc-300 hover:text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02]"
                >
                    Regenerate
                </button>
            </div>
        </div>
    );
}
