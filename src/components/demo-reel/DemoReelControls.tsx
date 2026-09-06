"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Maximize2,
  Minimize2,
} from "lucide-react";

interface DemoReelControlsProps {
  currentScene: number;
  totalScenes: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onPrevScene: () => void;
  onNextScene: () => void;
  onRestart: () => void;
  elapsedSeconds: number;
  totalDurationSeconds: number;
}

export function DemoReelControls({
  currentScene,
  totalScenes,
  isPlaying,
  onTogglePlay,
  onPrevScene,
  onNextScene,
  onRestart,
  elapsedSeconds,
  totalDurationSeconds,
}: DemoReelControlsProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetHideTimer = () => {
    setIsVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 2800);
  };

  useEffect(() => {
    const handleMouseMove = () => resetHideTimer();
    const handleTouchStart = () => resetHideTimer();

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchstart", handleTouchStart);

    resetHideTimer();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchstart", handleTouchStart);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const progressPercent = Math.min(
    100,
    Math.max(0, (elapsedSeconds / totalDurationSeconds) * 100)
  );

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 pointer-events-auto ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-3 pointer-events-none"
      }`}
    >
      <div className="flex flex-col items-center gap-1.5 px-4 py-2.5 rounded-2xl border border-[#B08422]/40 bg-[#14100D]/95 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.7)] text-[#E8DFD4]">
        {/* Progress Bar */}
        <div className="w-56 sm:w-64 h-1 rounded-full bg-[#3D332B] overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#B08422] to-[#D4B872] transition-all duration-200"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Controls Row */}
        <div className="flex items-center gap-3 text-xs font-mono">
          {/* Scene Counter */}
          <span className="text-[11px] font-bold text-[#C9A962] tracking-wider px-2 py-0.5 rounded bg-[#251E19] border border-[#4A3F35]">
            0{currentScene} / 0{totalScenes}
          </span>

          {/* Previous Scene Button */}
          <button
            onClick={onPrevScene}
            disabled={currentScene <= 1}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-[#251E19] disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Previous Scene (Left Arrow)"
          >
            <SkipBack className="h-3.5 w-3.5" />
          </button>

          {/* Play/Pause Button */}
          <button
            onClick={onTogglePlay}
            className="p-2 rounded-xl bg-gradient-to-r from-[#B08422] to-[#C9A962] text-[#1C1714] font-bold shadow-md hover:brightness-110 active:scale-95 transition-all"
            title={isPlaying ? "Pause (Space)" : "Play (Space)"}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4 fill-current" />
            ) : (
              <Play className="h-4 w-4 fill-current" />
            )}
          </button>

          {/* Next Scene Button */}
          <button
            onClick={onNextScene}
            disabled={currentScene >= totalScenes}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-[#251E19] disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Next Scene (Right Arrow)"
          >
            <SkipForward className="h-3.5 w-3.5" />
          </button>

          {/* Restart Button */}
          <button
            onClick={onRestart}
            className="p-1.5 rounded-lg text-slate-300 hover:text-[#C9A962] hover:bg-[#251E19] transition-colors"
            title="Restart Reel (R)"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          {/* Time indicator */}
          <span className="text-[10px] text-muted-foreground">
            {formatTime(elapsedSeconds)} / {formatTime(totalDurationSeconds)}
          </span>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-[#251E19] transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
