"use client";

import React, { useState } from "react";
import { Copy, Check, Code2, Terminal } from "lucide-react";

interface CodeViewerProps {
  code: string;
  activeLineNumber: number | null;
  algorithmName: string;
}

export function CodeViewer({ code, activeLineNumber, algorithmName }: CodeViewerProps) {
  const [copied, setCopied] = useState(false);

  const lines = code.split("\n");

  const handleCopy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div className="flex flex-col h-full rounded-2xl border border-border/60 bg-[#0d1117] backdrop-blur-md shadow-2xl overflow-hidden">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-border/60 bg-card/80 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 mr-2">
            <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <Code2 className="h-4 w-4 text-cyan-400" />
          <span className="text-xs font-semibold font-mono text-foreground/90">
            {algorithmName}.cpp
          </span>
        </div>

        <button
          onClick={handleCopy}
          aria-label="Copy C++ code"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-secondary/80 px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-all active:scale-95"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body with Line Highlight */}
      <div className="flex-1 overflow-x-auto p-3 sm:p-4 text-xs sm:text-sm font-mono leading-relaxed select-text">
        <div className="min-w-max">
          {lines.map((line, idx) => {
            const lineNum = idx + 1;
            const isActive = activeLineNumber === lineNum;

            return (
              <div
                key={lineNum}
                className={`flex items-center rounded-md px-2 py-0.5 transition-all duration-150 ${
                  isActive
                    ? "bg-cyan-500/20 text-cyan-200 border-l-4 border-cyan-400 shadow-lg shadow-cyan-500/10 font-bold"
                    : "text-slate-300 hover:bg-white/[0.02]"
                }`}
              >
                {/* Line Number */}
                <span
                  className={`w-8 shrink-0 select-none text-right pr-4 text-xs ${
                    isActive ? "text-cyan-400 font-bold" : "text-muted-foreground/40"
                  }`}
                >
                  {lineNum}
                </span>

                {/* Code Text */}
                <span className="whitespace-pre">{line || " "}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between border-t border-border/40 bg-card/40 px-4 py-2 text-[11px] text-muted-foreground font-mono">
        <span className="flex items-center gap-1.5">
          <Terminal className="h-3 w-3 text-cyan-400" /> C++17 Standard
        </span>
        {activeLineNumber ? (
          <span className="text-cyan-400 font-semibold animate-pulse">
            Executing Line {activeLineNumber}
          </span>
        ) : (
          <span>Idle</span>
        )}
      </div>
    </div>
  );
}
