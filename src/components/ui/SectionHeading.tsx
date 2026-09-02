import React from "react";

interface SectionHeadingProps {
  volume?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
}

/**
 * SectionHeading Component
 * 
 * Formal scholarly header featuring:
 * - Roman numeral volume marker (e.g. "VOLUME II · ILLUMINATION") in Cinzel
 * - Cormorant Garamond title
 * - Optional Crimson Pro description
 */
export function SectionHeading({
  volume,
  title,
  subtitle,
  align = "center",
  className = "",
}: SectionHeadingProps) {
  const isCenter = align === "center";

  return (
    <div
      className={`space-y-3 mb-8 sm:mb-12 ${
        isCenter ? "text-center mx-auto max-w-3xl" : "text-left"
      } ${className}`}
    >
      {volume && (
        <div className="inline-flex items-center gap-2">
          <span className="h-[1px] w-6 bg-[#C9A962]/50" aria-hidden="true" />
          <span className="font-display text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#C9A962]">
            {volume}
          </span>
          <span className="h-[1px] w-6 bg-[#C9A962]/50" aria-hidden="true" />
        </div>
      )}

      <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[#E8DFD4] leading-[1.15]">
        {title}
      </h2>

      {subtitle && (
        <p className="font-body text-base sm:text-lg text-[#9C8B7A] leading-relaxed max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
