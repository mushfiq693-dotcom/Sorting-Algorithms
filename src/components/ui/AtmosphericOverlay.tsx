import React from "react";

/**
 * AtmosphericOverlay Component
 * 
 * Provides the scholarly library atmosphere through:
 * 1. An ultra-subtle fixed paper grain noise filter (3% opacity, blend overlay)
 * 2. A radial vignette effect that darkens the viewport perimeter, mimicking warm reading-lamp illumination.
 */
export function AtmosphericOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
    >
      {/* 1. Subtle Paper Grain / Aged Texture Filter */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.035] mix-blend-overlay">
        <filter id="academia-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#academia-noise)" />
      </svg>

      {/* 2. Library Vignette Overlay (Darkening the edges) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_55%,rgba(28,23,20,0.55)_100%)]" />
    </div>
  );
}
