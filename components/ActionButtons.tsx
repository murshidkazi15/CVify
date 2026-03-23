"use client";

import React from 'react';

interface ActionButtonsProps {
    onGenerate: () => void;
    disabled: boolean;
    isLoading?: boolean;
}

export default function ActionButtons({ onGenerate, disabled, isLoading }: ActionButtonsProps) {
    return (
        <button
            onClick={onGenerate}
            disabled={disabled}
            className={`w-full py-5 px-6 rounded-2xl font-bold text-xl text-white
                 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 
                 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500
                 shadow-[0_0_20px_rgba(79,70,229,0.5)] hover:shadow-[0_0_30px_rgba(79,70,229,0.8)]
                 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed 
                 transition-all duration-300 transform 
                 ${!disabled ? 'hover:-translate-y-1 active:translate-y-0' : ''}`}
        >
            {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                </div>
            ) : (
                "Generate CV Bullet"
            )}
        </button>
    );
}
