import React from "react";

interface OrnateDividerProps {
  glyph?: string;
  className?: string;
}

/**
 * OrnateDivider Component
 * 
 * Elegant gradient line fading from transparent to wood grain with polished brass
 * center and a classical Unicode glyph (✶, ❧, ✤, ❦).
 */
export function OrnateDivider({
  glyph = "✶",
  className = "",
}: OrnateDividerProps) {
  return (
    <div
      role="separator"
      aria-hidden="true"
      className={`relative my-8 sm:my-12 flex items-center justify-center ${className}`}
    >
      {/* Gradient Line */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#4A3F35] via-50%-[#C9A962] to-transparent" />

      {/* Centered Classical Glyph */}
      <span className="absolute bg-[#1C1714] px-4 font-display text-xs text-[#C9A962] select-none tracking-widest">
        {glyph}
      </span>
    </div>
  );
}
