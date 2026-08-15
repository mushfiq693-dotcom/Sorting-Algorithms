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
    <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/60 p-4 sm:p-5 backdrop-blur-md shadow-xl">
      {/* Primary Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          {!isPlaying && !isPaused && (
            <button
              id="start-button"
              onClick={onStart}
              disabled={isFinished}
              aria-label="Start sorting execution"
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 transition-all ${
                isFinished
                  ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                  : "bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500 hover:shadow-cyan-500/25 active:scale-95"
              }`}
            >
              <Play className="h-4 w-4 fill-current" />
              Start Sort
            </button>
          )}

          {isPlaying && (
            <button
              id="pause-button"
              onClick={onPause}
              aria-label="Pause sorting execution"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 px-4 py-2.5 text-sm font-semibold hover:bg-amber-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 transition-all active:scale-95 shadow-lg shadow-amber-500/10"
            >
              <Pause className="h-4 w-4" />
              Pause
            </button>
          )}

          {isPaused && (
            <button
              id="resume-button"
              onClick={onResume}
              aria-label="Resume sorting execution"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 text-white px-4 py-2.5 text-sm font-semibold hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 transition-all active:scale-95 shadow-lg shadow-emerald-500/25"
            >
              <Play className="h-4 w-4 fill-current" />
              Resume
            </button>
          )}

          <button
            id="step-button"
            onClick={onStep}
            disabled={!canStep || isPlaying}
            aria-label="Execute one single step forward"
            title="Execute one step forward"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-secondary/80 px-3.5 py-2.5 text-sm font-medium text-foreground hover:bg-secondary hover:border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
          >
            <StepForward className="h-4 w-4" />
            Step
          </button>

          <button
            id="reset-button"
            onClick={onReset}
            aria-label="Reset array to initial state"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-secondary/80 px-3.5 py-2.5 text-sm font-medium text-foreground hover:bg-secondary hover:border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 transition-all active:scale-95"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>

        <button
          id="random-button"
          onClick={onGenerateRandom}
          disabled={isPlaying}
          aria-label="Generate random array"
          className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-accent/60 px-3.5 py-2.5 text-sm font-medium text-accent-foreground hover:bg-accent hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
        >
          <Shuffle className="h-4 w-4 text-cyan-400" />
          Random Array
        </button>
      </div>

      {/* Sliders Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/40">
        {/* Speed Slider */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
            <label htmlFor="speed-slider" className="flex items-center gap-1.5 text-foreground/90">
              <Gauge className="h-3.5 w-3.5 text-cyan-400" /> Speed (Delay)
            </label>
            <span className="font-mono text-cyan-400">{speed}ms</span>
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
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-secondary accent-cyan-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 transition-colors"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground/60">
            <span>Fast (20ms)</span>
            <span>Normal</span>
            <span>Slow (800ms)</span>
          </div>
        </div>

        {/* Array Size Slider */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
            <label htmlFor="size-slider" className="flex items-center gap-1.5 text-foreground/90">
              <Sliders className="h-3.5 w-3.5 text-blue-400" /> Array Size
            </label>
            <span className="font-mono text-blue-400">{arraySize} bars</span>
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
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-secondary accent-blue-500 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 transition-colors"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground/60">
            <span>5 bars</span>
            <span>25 bars</span>
            <span>50 bars</span>
          </div>
        </div>
      </div>

      {/* Custom Array Input Form */}
      <form onSubmit={handleCustomSubmit} className="pt-2 border-t border-border/40">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="custom-array-input" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Custom Array (comma-separated, e.g. 45, 12, 89, 34, 7)
          </label>
          <div className="flex gap-2">
            <input
              id="custom-array-input"
              type="text"
              placeholder="e.g. 24, 8, 42, 16, 50, 4"
              value={customInput}
              disabled={isPlaying}
              aria-label="Enter comma-separated numbers for custom array"
              onChange={(e) => {
                setCustomInput(e.target.value);
                if (inputError) setInputError(null);
              }}
              className="flex-1 rounded-xl border border-border/80 bg-background/80 px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:opacity-40 font-mono"
            />
            <button
              id="apply-custom-array-btn"
              type="submit"
              disabled={isPlaying || !customInput.trim()}
              aria-label="Apply custom array"
              className="rounded-xl bg-secondary px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary/80 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
            >
              Apply
            </button>
          </div>
          {inputError && (
            <p className="text-xs text-rose-400 font-medium mt-0.5" role="alert">
              {inputError}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
