"use client";

import React, { useState } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  StepForward,
  Shuffle,
  Gauge,
  Sliders,
  Sparkles,
  ChevronDown,
} from "lucide-react";

interface VisualizerControlsProps {
  isPlaying: boolean;
  isPaused: boolean;
  isFinished: boolean;
  canStep: boolean;
  speed: number;
  arraySize: number;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStep: () => void;
  onReset: () => void;
  onGenerateRandom: () => void;
  onSpeedChange: (speed: number) => void;
  onArraySizeChange: (size: number) => void;
  onCustomArraySubmit: (array: number[]) => void;
}

export function VisualizerControls({
  isPlaying,
  isPaused,
  isFinished,
  canStep,
  speed,
  arraySize,
  onStart,
  onPause,
  onResume,
  onStep,
  onReset,
  onGenerateRandom,
  onSpeedChange,
  onArraySizeChange,
  onCustomArraySubmit,
}: VisualizerControlsProps) {
  const [customInput, setCustomInput] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);
  const [showCustomDrawer, setShowCustomDrawer] = useState(false);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    const parts = customInput.split(",").map((s) => s.trim());
    const nums: number[] = [];

    for (const p of parts) {
      const n = Number(p);
      if (isNaN(n) || !Number.isInteger(n) || n < 1 || n > 500) {
        setInputError("Please enter valid integers between 1 and 500.");
        return;
      }
      nums.push(n);
    }

    if (nums.length < 3 || nums.length > 50) {
      setInputError("Array must contain between 3 and 50 elements.");
      return;
    }

    setInputError(null);
    onCustomArraySubmit(nums);
  };

  return (
    <div className="flex flex-col gap-2.5 rounded bg-[#251E19] border border-[#4A3F35] p-3 sm:p-3.5 backdrop-blur-xl shadow-2xl corner-flourish">
      {/* Action Buttons & Sliders Row */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Left: Execution Controls */}
        <div className="flex items-center gap-1.5">
          {!isPlaying && !isPaused && (
            <button
              id="start-button"
              onClick={onStart}
              disabled={isFinished}
              aria-label="Start sorting execution"
              className={`btn-brass inline-flex items-center gap-1.5 rounded px-3.5 py-1.5 text-xs font-display uppercase tracking-wider font-bold shadow-brass focus-visible:outline-none transition-all active:scale-95 cursor-pointer ${
                isFinished
                  ? "bg-[#1C1714] text-[#9C8B7A] cursor-not-allowed opacity-50 border border-[#4A3F35]"
                  : ""
              }`}
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Start</span>
            </button>
          )}

          {isPlaying && (
            <button
              id="pause-button"
              onClick={onPause}
              aria-label="Pause sorting execution"
              className="inline-flex items-center gap-1.5 rounded bg-[#8B2635] text-[#E8DFD4] border border-[#A62D3F]/50 px-3.5 py-1.5 text-xs font-display uppercase tracking-wider font-bold hover:bg-[#A62D3F] transition-all active:scale-95 shadow-crimson cursor-pointer"
            >
              <Pause className="h-3.5 w-3.5" />
              <span>Pause</span>
            </button>
          )}

          {isPaused && (
            <button
              id="resume-button"
              onClick={onResume}
              aria-label="Resume sorting execution"
              className="inline-flex items-center gap-1.5 rounded bg-emerald-600 text-[#E8DFD4] border border-emerald-500/50 px-3.5 py-1.5 text-xs font-display uppercase tracking-wider font-bold hover:bg-emerald-500 transition-all active:scale-95 shadow-md cursor-pointer"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Resume</span>
            </button>
          )}

          <button
            id="step-button"
            onClick={onStep}
            disabled={!canStep || isPlaying}
            aria-label="Execute one single step forward"
            title="Step forward"
            className="inline-flex items-center gap-1 rounded border border-[#4A3F35] bg-[#1C1714] px-2.5 py-1.5 text-xs font-display uppercase tracking-wider font-semibold text-[#E8DFD4] hover:bg-[#251E19] hover:text-[#C9A962] hover:border-[#C9A962]/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 cursor-pointer"
          >
            <StepForward className="h-3.5 w-3.5 text-[#C9A962]" />
            <span>Step</span>
          </button>

          <button
            id="reset-button"
            onClick={onReset}
            aria-label="Reset array to initial state"
            className="inline-flex items-center gap-1 rounded border border-[#4A3F35] bg-[#1C1714] px-2.5 py-1.5 text-xs font-display uppercase tracking-wider font-semibold text-[#E8DFD4] hover:bg-[#251E19] hover:text-[#C9A962] hover:border-[#C9A962]/50 transition-all active:scale-95 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5 text-[#C9A962]" />
            <span>Reset</span>
          </button>

          <button
            id="random-button"
            onClick={onGenerateRandom}
            disabled={isPlaying}
            aria-label="Generate random array"
            className="inline-flex items-center gap-1 rounded border border-[#C9A962]/30 bg-[#1C1714] px-2.5 py-1.5 text-xs font-display uppercase tracking-wider font-semibold text-[#C9A962] hover:bg-[#251E19] hover:border-[#C9A962] transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 cursor-pointer"
          >
            <Shuffle className="h-3.5 w-3.5 text-[#C9A962]" />
            <span className="hidden sm:inline">Random</span>
          </button>
        </div>

        {/* Right: Custom Array Toggle Button */}
        <button
          type="button"
          onClick={() => setShowCustomDrawer(!showCustomDrawer)}
          className="inline-flex items-center gap-1.5 text-[11px] font-display uppercase tracking-wider px-2.5 py-1.5 rounded border border-[#4A3F35] bg-[#1C1714] hover:bg-[#251E19] text-[#9C8B7A] hover:text-[#C9A962] transition-colors cursor-pointer"
        >
          <Sparkles className="h-3 w-3 text-[#C9A962]" />
          <span>Custom Input</span>
          <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${showCustomDrawer ? "rotate-180 text-[#C9A962]" : ""}`} />
        </button>
      </div>

      {/* Sliders Row (Instrument Panel) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#4A3F35]">
        {/* Speed Slider */}
        <div className="flex items-center gap-2.5">
          <label htmlFor="speed-slider" className="flex items-center gap-1 text-[11px] font-display uppercase tracking-wider text-[#9C8B7A] shrink-0 w-24">
            <Gauge className="h-3 w-3 text-[#C9A962]" />
            <span>Delay:</span>
            <strong className="text-[#C9A962] font-mono font-bold">{speed}ms</strong>
          </label>
          <input
            id="speed-slider"
            type="range"
            min="20"
            max="800"
            step="20"
            value={speed}
            aria-label="Adjust execution delay in milliseconds"
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="h-1.5 flex-1 cursor-pointer appearance-none rounded bg-[#1C1714] accent-[#C9A962] transition-colors"
          />
        </div>

        {/* Array Size Slider */}
        <div className="flex items-center gap-2.5">
          <label htmlFor="size-slider" className="flex items-center gap-1 text-[11px] font-display uppercase tracking-wider text-[#9C8B7A] shrink-0 w-24">
            <Sliders className="h-3 w-3 text-[#D4B872]" />
            <span>Size:</span>
            <strong className="text-[#D4B872] font-mono font-bold">{arraySize}</strong>
          </label>
          <input
            id="size-slider"
            type="range"
            min="5"
            max="40"
            step="1"
            value={arraySize}
            disabled={isPlaying}
            aria-label="Adjust array bar count"
            onChange={(e) => onArraySizeChange(Number(e.target.value))}
            className="h-1.5 flex-1 cursor-pointer appearance-none rounded bg-[#1C1714] accent-[#D4B872] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          />
        </div>
      </div>

      {/* Collapsible Custom Array Drawer */}
      {showCustomDrawer && (
        <form onSubmit={handleCustomSubmit} className="pt-2 border-t border-[#4A3F35] animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="flex gap-2">
            <input
              id="custom-array-input"
              type="text"
              placeholder="e.g. 45, 12, 89, 34, 7, 60"
              value={customInput}
              disabled={isPlaying}
              aria-label="Enter comma-separated numbers"
              onChange={(e) => {
                setCustomInput(e.target.value);
                if (inputError) setInputError(null);
              }}
              className="flex-1 rounded border border-[#4A3F35] bg-[#1C1714] px-3 py-1.5 text-xs text-[#E8DFD4] placeholder:text-[#9C8B7A]/60 focus:border-[#C9A962] font-mono transition-colors"
            />
            <button
              id="apply-custom-array-btn"
              type="submit"
              disabled={isPlaying || !customInput.trim()}
              className="btn-brass rounded px-4 py-1.5 text-xs font-display uppercase tracking-wider font-bold shadow-brass transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer active:scale-95"
            >
              Apply
            </button>
          </div>
          {inputError && (
            <p className="text-[11px] text-rose-500 font-mono mt-1" role="alert">
              {inputError}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
