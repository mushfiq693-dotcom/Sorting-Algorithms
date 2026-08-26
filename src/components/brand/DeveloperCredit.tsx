"use client";

import React, { useState, useEffect, useRef } from "react";
import { LINKS } from "@/config/links";
import {
  Sparkles,
  X,
  ExternalLink,
  Globe,
  Code2,
} from "lucide-react";

export function DeveloperCredit() {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const dev = LINKS.DEVELOPER;

  return (
    <div ref={modalRef} className="fixed bottom-20 right-5 z-50 font-sans select-none">
      {/* Floating Popup Card */}
      {isOpen && (
        <div className="absolute bottom-14 right-0 w-80 sm:w-92 max-w-[calc(100vw-2.5rem)] rounded-3xl border border-white/[0.12] bg-[#0c101d]/95 backdrop-blur-2xl p-5 sm:p-6 shadow-2xl shadow-black/80 animate-in fade-in zoom-in-95 duration-200">
          {/* Close Button Top-Right */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors z-10 cursor-pointer"
            aria-label="Close developer card"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Hero Profile Photo & Identity */}
          <div className="flex flex-col items-center text-center pb-4 border-b border-white/[0.08]">
            <div className="h-16 w-16 sm:h-18 sm:w-18 rounded-full overflow-hidden border-2 border-cyan-500/30 ring-2 ring-white/10 shadow-xl shadow-black/80 bg-[#070b14] mb-2.5">
              <img
                src="/developer.jpg"
                alt={dev.name}
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="flex items-center justify-center gap-1.5">
              <h3 className="font-bold text-base text-white">{dev.name}</h3>
              <Sparkles className="h-3.5 w-3.5 text-cyan-400 fill-cyan-400" />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
              <span className="text-xs font-semibold text-cyan-400">{dev.role}</span>
              <span className="text-slate-600">•</span>
              <span className="px-2 py-0.5 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-[10px] font-mono font-bold text-cyan-300">
                Creator & Architect
              </span>
            </div>

            {/* Bio Description */}
            <p className="text-xs text-slate-300 mt-2.5 px-2 leading-relaxed font-sans">
              {dev.bio}
            </p>
          </div>

          {/* Social & Portfolio Links */}
          <div className="mt-4 space-y-2">
            {/* Portfolio Link */}
            <a
              href={dev.portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] hover:border-cyan-500/40 transition-all text-xs font-semibold text-slate-200 hover:text-white group"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <Globe className="h-4 w-4" />
                </div>
                <span>Portfolio Website</span>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-cyan-300 transition-colors" />
            </a>

            {/* GitHub Profile */}
            <a
              href={dev.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] hover:border-cyan-500/40 transition-all text-xs font-semibold text-slate-200 hover:text-white group"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </div>
                <span>GitHub Profile</span>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-cyan-300 transition-colors" />
            </a>

            {/* LinkedIn Profile */}
            <a
              href={dev.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] hover:border-blue-500/40 transition-all text-xs font-semibold text-slate-200 hover:text-white group"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1 rounded-lg bg-blue-500/10 text-blue-400">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 0 0 1.65-1.65A1.65 1.65 0 0 0 6.46 5.46a1.65 1.65 0 0 0-1.65 1.65c0 .92.74 1.65 1.65 1.65m1.39 9.74v-8.37H5.07v8.37h2.78z"/>
                  </svg>
                </div>
                <span>LinkedIn Profile</span>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-300 transition-colors" />
            </a>
          </div>

          {/* Footer Signature */}
          <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span className="flex items-center gap-1">
              <Code2 className="h-3 w-3 text-cyan-500" />
              <span>Developer Signature</span>
            </span>
            <span>GSTU CSE Sync</span>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button (Clean, Border-free from yellow ring) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-12 w-12 rounded-full bg-[#0c101a] border border-white/20 shadow-2xl shadow-black/60 flex items-center justify-center overflow-hidden hover:scale-105 hover:border-cyan-500/60 active:scale-95 transition-all cursor-pointer group"
        aria-label="Open developer credit card"
        title={`Developer Credit (${dev.name})`}
      >
        <img
          src="/developer.jpg"
          alt={dev.name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform"
        />
      </button>
    </div>
  );
}
