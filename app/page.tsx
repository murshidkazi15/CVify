"use client";

import { useState, useRef } from "react";
import InputBox from "@/components/InputBox";
import ActionButtons from "@/components/ActionButtons";
import OutputCard from "@/components/OutputCard";

const SUGGESTIONS = [
  "Carried a group project",
  "Ran an Instagram page",
  "Helped a friend study",
  "Organized an event",
  "Answered emails"
];

export default function Home() {
  const [input, setInput] = useState("");
  const [outputs, setOutputs] = useState<{ professional: string; honest: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedBoth, setCopiedBoth] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const resultsRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!input.trim() || isLoading) return;
    setIsLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: input })
      });

      const data = await response.json();

      if (response.ok) {
        setOutputs({ professional: data.professional, honest: data.honest });
        setCopiedBoth(false);
        // Smooth scroll to results
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      } else {
        if (data.cooldown || data.error) {
          setErrorMsg(data.error || "Please wait before generating again.");
        } else {
          setErrorMsg("An unexpected error occurred.");
        }
      }
    } catch (error) {
      console.error('Network Error:', error);
      setErrorMsg("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyBoth = async () => {
    if (!outputs) return;
    const combinedText = `I tried this CV tool:\n\nInput:\n"${input}"\n\nProfessional:\n${outputs.professional}\n\nHonest:\n${outputs.honest}\n\nLink:\nhttps://cvify-nine.vercel.app`;

    await navigator.clipboard.writeText(combinedText);
    setCopiedBoth(true);
    setTimeout(() => setCopiedBoth(false), 2000);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-between p-6 sm:p-12 bg-black text-white selection:bg-zinc-800 selection:text-white font-sans">
      <div className="w-full max-w-3xl flex flex-col items-center gap-12 pt-10 pb-10">

        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent drop-shadow-sm">
            CVify
          </h1>
          <p className="text-zinc-400 text-xl font-medium max-w-xl mx-auto leading-relaxed">
            Turn your casual talk into resume-ready bullet points instantly.
          </p>
        </div>

        {/* Main Interactive App Container */}
        <div className="w-full bg-zinc-950 p-6 sm:p-10 rounded-[2.5rem] border border-zinc-900 shadow-2xl flex flex-col gap-10 relative overflow-hidden backdrop-blur-3xl">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-zinc-800/20 blur-[100px] -z-10 rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-zinc-800/10 blur-[100px] -z-10 rounded-full pointer-events-none" />

          <div className="flex flex-col gap-5 w-full">
            <InputBox value={input} onChange={setInput} />

            <div className="flex flex-col gap-2 w-full">
              <span className="text-sm font-semibold text-zinc-500 uppercase tracking-wide pl-1">Try these:</span>
              <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide snap-x w-full">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="whitespace-nowrap snap-start px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-full text-sm font-medium text-zinc-300 transition-colors hover:text-white flex-shrink-0"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <ActionButtons onGenerate={handleGenerate} disabled={!input.trim() || isLoading} isLoading={isLoading} />

          {errorMsg && (
            <div className="text-red-400 text-sm font-medium text-center bg-red-950/30 py-3 px-4 rounded-xl border border-red-900/50 animate-in fade-in duration-300 w-full mb-[-1rem]">
              {errorMsg}
            </div>
          )}

          {outputs && (
            <div ref={resultsRef} className="flex flex-col gap-8 w-full mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500 scroll-mt-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-1 gap-4">
                <h3 className="text-xl font-semibold text-zinc-300">Generated Results</h3>
                <button
                  onClick={handleCopyBoth}
                  className="px-6 py-3 bg-blue-600/10 border border-blue-500/30 hover:bg-blue-600/20 active:bg-blue-600/30 text-blue-200 rounded-xl font-semibold transition-all duration-200 transform hover:-translate-y-0.5 shadow-md flex items-center justify-center min-w-[200px]"
                >
                  {copiedBoth ? (
                    <span className="flex items-center gap-2 text-blue-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      Copied!
                    </span>
                  ) : "Copy as LinkedIn Post"}
                </button>
              </div>

              <OutputCard
                type="professional"
                title="Professional"
                output={outputs.professional}
                onRegenerate={handleGenerate}
              />
              <OutputCard
                type="honest"
                title="Honest"
                output={outputs.honest}
                onRegenerate={handleGenerate}
              />
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full text-center py-6 mt-10">
        <p className="text-sm text-zinc-400">
          Feedback / Contact:{" "}
          <a
            href="mailto:murshidkazi2025@gmail.com"
            className="text-zinc-300 hover:text-white hover:underline transition-colors"
          >
            murshidkazi2025@gmail.com
          </a>
        </p>
      </footer>
    </main>
  );
}
