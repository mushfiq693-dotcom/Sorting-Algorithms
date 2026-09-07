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
    <div ref={modalRef} className="fixed bottom-20 right-3 sm:right-5 z-50 font-sans select-none">
      {/* Floating Popup Card */}
      {isOpen && (
        <div className="absolute bottom-14 right-0 w-[calc(100vw-2rem)] sm:w-80 max-w-[320px] rounded-2xl border border-primary/30 bg-card/95 backdrop-blur-2xl p-4 sm:p-5 shadow-2xl text-foreground corner-flourish animate-in fade-in zoom-in-95 duration-200">
          {/* Close Button Top-Right */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-3.5 right-3.5 p-1.5 rounded-lg bg-secondary/80 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors z-10 cursor-pointer"
            aria-label="Close developer card"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Hero Profile Photo & Identity */}
          <div className="flex flex-col items-center text-center pb-4 border-b border-border/80">
            <div className="h-16 w-16 sm:h-18 sm:w-18 rounded-full overflow-hidden border-2 border-primary/70 ring-4 ring-primary/15 shadow-brass bg-background mb-3">
              <img
                src="/developer.jpg"
                alt={dev.name}
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="flex items-center justify-center gap-1.5">
              <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground tracking-tight">
                {dev.name}
              </h3>
              <Sparkles className="h-4 w-4 text-primary fill-primary/30 shrink-0" />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
              <span className="text-xs font-sans font-medium text-muted-foreground">
                {dev.role}
              </span>
              <span className="text-border">•</span>
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/30 text-[10px] font-mono font-bold text-primary shadow-xs">
                Creator & Architect
              </span>
            </div>

            {/* Bio Description */}
            <p className="text-xs text-muted-foreground mt-2.5 px-1 leading-relaxed font-sans font-normal">
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
              className="flex items-center justify-between p-2.5 rounded-xl border border-border bg-secondary/30 hover:bg-secondary/70 hover:border-primary/50 transition-all text-xs font-sans font-semibold text-foreground group"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Globe className="h-3.5 w-3.5" />
                </div>
                <span>Portfolio Website</span>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>

            {/* GitHub Profile */}
            <a
              href={dev.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl border border-border bg-secondary/30 hover:bg-secondary/70 hover:border-primary/50 transition-all text-xs font-sans font-semibold text-foreground group"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </div>
                <span>GitHub Profile</span>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>

            {/* LinkedIn Profile */}
            <a
              href={dev.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl border border-border bg-secondary/30 hover:bg-secondary/70 hover:border-primary/50 transition-all text-xs font-sans font-semibold text-foreground group"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 0 0 1.65-1.65A1.65 1.65 0 0 0 6.46 5.46a1.65 1.65 0 0 0-1.65 1.65c0 .92.74 1.65 1.65 1.65m1.39 9.74v-8.37H5.07v8.37h2.78z"/>
                  </svg>
                </div>
                <span>LinkedIn Profile</span>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
          </div>

          {/* Footer Signature */}
          <div className="mt-4 pt-3 border-t border-border/80 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
            <span className="flex items-center gap-1 text-primary">
              <Code2 className="h-3 w-3" />
              <span>Developer Signature</span>
            </span>
            <span>AlgoHub Global Platform</span>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button with Brass Ring */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-12 w-12 rounded-full bg-card border-2 border-primary/60 ring-2 ring-primary/20 shadow-brass hover:shadow-brass-lg flex items-center justify-center overflow-hidden hover:scale-105 hover:border-primary active:scale-95 transition-all cursor-pointer group"
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

