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
    <div className="flex flex-col h-full rounded bg-[#14100D] border border-[#4A3F35] shadow-2xl overflow-hidden corner-flourish">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-[#4A3F35] bg-[#1C1714] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 mr-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#8B2635] inline-block" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#C9A962] inline-block" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#059669] inline-block" />
          </div>
          <Code2 className="h-4 w-4 text-[#C9A962]" />
          <span className="text-xs font-mono font-bold text-[#E8DFD4]">
            {algorithmName}.cpp
          </span>
        </div>

        <button
          onClick={handleCopy}
          aria-label="Copy C++ code"
          className="inline-flex items-center gap-1.5 rounded border border-[#4A3F35] bg-[#251E19] px-2.5 py-1 text-xs font-display uppercase tracking-wider font-semibold text-[#E8DFD4] hover:text-[#C9A962] hover:border-[#C9A962] transition-all active:scale-95 cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-bold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 text-[#C9A962]" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body with Synchronized Brass Line Highlight */}
      <div className="flex-1 overflow-x-auto p-3 sm:p-4 text-xs sm:text-sm font-mono leading-relaxed select-text bg-[#14100D]">
        <div className="min-w-max">
          {lines.map((line, idx) => {
            const lineNum = idx + 1;
            const isActive = activeLineNumber === lineNum;

            return (
              <div
                key={lineNum}
                className={`flex items-center px-2 py-0.5 transition-all duration-150 ${
                  isActive
                    ? "bg-[#C9A962]/15 text-[#E8DFD4] border-l-4 border-[#C9A962] shadow-sm font-bold"
                    : "text-[#E8DFD4]/80 hover:bg-[#251E19]/50"
                }`}
              >
                {/* Line Number */}
                <span
                  className={`w-8 shrink-0 select-none text-right pr-4 text-xs font-mono ${
                    isActive ? "text-[#C9A962] font-bold" : "text-[#9C8B7A]/50"
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
      <div className="flex items-center justify-between border-t border-[#4A3F35] bg-[#1C1714] px-4 py-2 text-[11px] text-[#9C8B7A] font-mono">
        <span className="flex items-center gap-1.5 font-mono text-[11px]">
          <Terminal className="h-3 w-3 text-[#C9A962]" /> C++17 Reference Source
        </span>
      </div>
    </div>
  );
}
