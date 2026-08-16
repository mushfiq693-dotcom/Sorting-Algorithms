"use client";

import React, { useState } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  StepForward,
  Shuffle,
  Sliders,
  Sparkles,
  Gauge,
  Check,
} from "lucide-react";
import { parseCustomArray } from "@/lib/utils";

interface VisualizerControlsProps {
  isPlaying: boolean;
  isFinished: boolean;
  isPaused: boolean;
  canStep: boolean;
  speed: number;
  arraySize: number;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStep: () => void;
  onReset: () => void;
  onGenerateRandom: () => void;
  onCustomArraySubmit: (arr: number[]) => void;
  onSpeedChange: (speed: number) => void;
  onArraySizeChange: (size: number) => void;
}

export function VisualizerControls({
  isPlaying,
  isFinished,
  isPaused,
  canStep,
  speed,
  arraySize,
  onStart,
  onPause,
  onResume,
  onStep,
  onReset,
  onGenerateRandom,
  onCustomArraySubmit,
  onSpeedChange,
  onArraySizeChange,
}: VisualizerControlsProps) {
  const [customInput, setCustomInput] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = parseCustomArray(customInput);
    if (!result.success) {
      setInputError(result.error);
      return;
    }
    setInputError(null);
    onCustomArraySubmit(result.data);
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/[0.08] bg-[#0b101d]/90 p-4 sm:p-5 backdrop-blur-xl shadow-2xl">
      {/* Primary Action Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          {!isPlaying && !isPaused && (
            <button
              id="start-button"
              onClick={onStart}
              disabled={isFinished}
              aria-label="Start sorting execution"
              className={`btn-compare-hover inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold shadow-lg focus-visible:outline-none transition-all active:scale-95 ${
                isFinished
                  ? "bg-slate-800/80 text-slate-500 cursor-not-allowed opacity-50 border border-slate-700/50"
                  : "bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 text-slate-950 font-extrabold hover:shadow-cyan-500/25 shadow-md shadow-cyan-500/20"
              }`}
            >
              <Play className="h-4 w-4 fill-current" />
              <span>Start Sort</span>
            </button>
          )}

          {isPlaying && (
            <button
              id="pause-button"
              onClick={onPause}
              aria-label="Pause sorting execution"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 px-4 py-2.5 text-xs sm:text-sm font-bold hover:bg-amber-500/30 transition-all active:scale-95 shadow-lg shadow-amber-500/10"
            >
              <Pause className="h-4 w-4" />
              <span>Pause</span>
            </button>
          )}

          {isPaused && (
            <button
              id="resume-button"
              onClick={onResume}
              aria-label="Resume sorting execution"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 text-slate-950 px-4 py-2.5 text-xs sm:text-sm font-extrabold hover:bg-emerald-400 transition-all active:scale-95 shadow-lg shadow-emerald-500/25"
            >
              <Play className="h-4 w-4 fill-current" />
              <span>Resume</span>
            </button>
          )}

          <button
            id="step-button"
            onClick={onStep}
            disabled={!canStep || isPlaying}
            aria-label="Execute one single step forward"
            title="Execute one step forward"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700/60 bg-slate-800/70 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-200 hover:bg-slate-700/80 hover:text-cyan-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
          >
            <StepForward className="h-4 w-4" />
            <span>Step</span>
          </button>

          <button
            id="reset-button"
            onClick={onReset}
            aria-label="Reset array to initial state"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700/60 bg-slate-800/70 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-200 hover:bg-slate-700/80 hover:text-cyan-300 transition-all active:scale-95"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </button>
        </div>

        <button
          id="random-button"
          onClick={onGenerateRandom}
          disabled={isPlaying}
          aria-label="Generate random array"
          className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 shadow-sm"
        >
          <Shuffle className="h-4 w-4 text-cyan-400" />
          <span>Random Array</span>
        </button>
      </div>

      {/* Sliders Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
        {/* Speed Slider */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
            <label htmlFor="speed-slider" className="flex items-center gap-1.5 text-slate-200 font-semibold">
              <Gauge className="h-3.5 w-3.5 text-cyan-400" />
              <span>Delay (Speed)</span>
            </label>
            <span className="font-mono text-cyan-400 font-bold">{speed}ms</span>
          </div>
          <input
            id="speed-slider"
            type="range"
            min="20"
            max="800"
            step="20"
            value={speed}
            aria-label="Adjust execution delay in milliseconds"
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-cyan-400 transition-colors"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>Fast (20ms)</span>
            <span>Normal</span>
            <span>Slow (800ms)</span>
          </div>
        </div>

        {/* Array Size Slider */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
            <label htmlFor="size-slider" className="flex items-center gap-1.5 text-slate-200 font-semibold">
              <Sliders className="h-3.5 w-3.5 text-blue-400" />
              <span>Array Size</span>
            </label>
            <span className="font-mono text-blue-400 font-bold">{arraySize} bars</span>
          </div>
          <input
            id="size-slider"
            type="range"
            min="5"
            max="50"
            step="1"
            value={arraySize}
            disabled={isPlaying}
            aria-label="Adjust array bar count"
            onChange={(e) => onArraySizeChange(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>5 bars</span>
            <span>25 bars</span>
            <span>50 bars</span>
          </div>
        </div>
      </div>

      {/* Custom Array Input Form */}
      <form onSubmit={handleCustomSubmit} className="pt-2 border-t border-slate-800">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="custom-array-input" className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Custom Array Input</span>
            <span className="text-[11px] font-normal text-slate-500">(comma-separated numbers 1–500)</span>
          </label>
          <div className="flex gap-2">
            <input
              id="custom-array-input"
              type="text"
              placeholder="e.g. 45, 12, 89, 34, 7, 60"
              value={customInput}
              disabled={isPlaying}
              aria-label="Enter comma-separated numbers for custom array"
              onChange={(e) => {
                setCustomInput(e.target.value);
                if (inputError) setInputError(null);
              }}
              className="flex-1 rounded-xl border border-slate-700/80 bg-[#070b14] px-3.5 py-2 text-xs sm:text-sm text-cyan-100 placeholder:text-slate-600 focus:border-cyan-400 font-mono transition-colors"
            />
            <button
              id="apply-custom-array-btn"
              type="submit"
              disabled={isPlaying || !customInput.trim()}
              aria-label="Apply custom array"
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs sm:text-sm font-bold text-slate-200 hover:bg-slate-700 hover:text-cyan-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap active:scale-95"
            >
              Apply Array
            </button>
          </div>
          {inputError && (
            <p className="text-xs text-rose-400 font-mono mt-0.5" role="alert">
              {inputError}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
