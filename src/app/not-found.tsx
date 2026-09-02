import React from "react";
import Link from "next/link";
import { Compass, Home, Search, Terminal } from "lucide-react";

/**
 * Custom 404 Not Found Page for AlgoHub
 */
export default function NotFound() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 antialiased bg-[#1C1714] text-[#E8DFD4] font-body">
      <div className="max-w-md w-full rounded bg-[#251E19] border border-[#4A3F35] p-6 sm:p-8 backdrop-blur-2xl shadow-2xl text-center space-y-6 corner-flourish">
        {/* Algorithmic Monospace Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#8B2635]/50 bg-[#8B2635]/15 text-[#E8DFD4] font-mono text-xs font-semibold">
          <Terminal className="h-3.5 w-3.5 text-[#C9A962]" aria-hidden="true" />
          <span>404 // ELEMENT_NOT_FOUND</span>
        </div>

        {/* Visual Icon Illustration */}
        <div className="mx-auto h-16 w-16 rounded bg-[#1C1714] border border-[#4A3F35] flex items-center justify-center text-[#C9A962] shadow-inner">
          <Search className="h-8 w-8" aria-hidden="true" />
        </div>

        {/* Header & Supporting Copy */}
        <div className="space-y-2.5">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[#E8DFD4]">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-[#9C8B7A] leading-relaxed font-body max-w-sm mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or may have been moved.
          </p>
        </div>

        {/* Algorithmic Code Hint */}
        <div className="p-3 rounded bg-[#14100D] border border-[#4A3F35] font-mono text-[11px] text-[#9C8B7A] text-left space-y-1">
          <div className="text-[#9C8B7A]/60">// Binary search in AlgoHub routes:</div>
          <div>
            <span className="text-[#8B2635]">const</span> status = routes.find(r =&gt; r.path === url);
          </div>
          <div className="text-[#C9A962]">&gt; return null; // [Index: -1]</div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {/* Primary Action: Back to AlgoHub */}
          <Link
            href="/"
            className="btn-brass w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded px-5 py-2.5 text-xs sm:text-sm font-display uppercase tracking-wider font-bold shadow-brass active:scale-95 transition-all"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            <span>Back to AlgoHub</span>
          </Link>

          {/* Secondary Action: Explore Learning Path */}
          <Link
            href="/learn"
            className="btn-secondary-brass w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded px-5 py-2.5 text-xs sm:text-sm font-display uppercase tracking-wider font-bold active:scale-95 transition-all"
          >
            <Compass className="h-4 w-4" aria-hidden="true" />
            <span>Explore Learning Path</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
