"use client";

import React from 'react';

interface InputBoxProps {
    value: string;
    onChange: (val: string) => void;
}

export default function InputBox({ value, onChange }: InputBoxProps) {
    return (
        <div className="w-full flex flex-col gap-2">
            <label htmlFor="cv-input" className="text-sm font-medium text-zinc-400">
                Enter a casual sentence
            </label>
            <textarea
                id="cv-input"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="e.g. carried a group project, ran instagram page, helped a friend study..."
                autoFocus
                className="w-full h-36 p-5 bg-zinc-900 border border-zinc-800 rounded-2xl focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 focus:outline-none resize-none text-xl placeholder-zinc-600 transition-all text-zinc-200"
            />
        </div>
    );
}
