"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Scene1Hero } from "@/components/demo-reel/Scene1Hero";
import { Scene2Visualizer } from "@/components/demo-reel/Scene2Visualizer";
import { Scene3LinkedList } from "@/components/demo-reel/Scene3LinkedList";
import { Scene4Dashboard } from "@/components/demo-reel/Scene4Dashboard";
import { Scene5Mentor } from "@/components/demo-reel/Scene5Mentor";
import { Scene6Closing } from "@/components/demo-reel/Scene6Closing";
import { DemoReelControls } from "@/components/demo-reel/DemoReelControls";

/**
 * AlgoHub 9:16 Auto-Playing Marketing Demo Reel
 * 
 * Note: /demo-reel is intentionally designed as an automated screen-recording tool
 * for social media marketing reels (Instagram Reels, YouTube Shorts, TikTok).
 * Its scripted animations bypass prefers-reduced-motion by design to guarantee
 * deterministic recording output across environments.
 */

// Scene Durations in Seconds
const SCENE_DURATIONS = [
  5,  // Scene 1: Hero / Opening (~5s)
  12, // Scene 2: Sorting Visualizer (~12s)
  10, // Scene 3: Linked List Studio (~10s)
  7,  // Scene 4: Student Dashboard (~7s)
  6,  // Scene 5: Mentor Analytics (~6s)
  6,  // Scene 6: Closing Card (~6s)
];

const TOTAL_SCENES = SCENE_DURATIONS.length;
const TOTAL_DURATION_SECONDS = SCENE_DURATIONS.reduce((acc, curr) => acc + curr, 0);

export default function DemoReelPage() {
  const [currentScene, setCurrentScene] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const sceneTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Compute elapsed time at the start of a given scene
  const getSceneStartTime = useCallback((sceneIndex: number): number => {
    let sum = 0;
    for (let i = 0; i < sceneIndex - 1; i++) {
      sum += SCENE_DURATIONS[i];
    }
    return sum;
  }, []);

  // Progress ticker for UI progress bar
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => {
        if (prev >= TOTAL_DURATION_SECONDS) {
          return TOTAL_DURATION_SECONDS;
        }
        return prev + 0.1;
      });
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  // Automated Scene Advance Orchestrator
  useEffect(() => {
    if (!isPlaying) {
      if (sceneTimerRef.current) clearTimeout(sceneTimerRef.current);
      return;
    }

    const currentDurationMs = SCENE_DURATIONS[currentScene - 1] * 1000;

    sceneTimerRef.current = setTimeout(() => {
      if (currentScene < TOTAL_SCENES) {
        setCurrentScene((prev) => prev + 1);
      } else {
        // Stop at final scene
        setIsPlaying(false);
      }
    }, currentDurationMs);

    return () => {
      if (sceneTimerRef.current) clearTimeout(sceneTimerRef.current);
    };
  }, [currentScene, isPlaying]);

  // Control Handlers
  const handleTogglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const handlePrevScene = useCallback(() => {
    if (currentScene > 1) {
      const targetScene = currentScene - 1;
      setCurrentScene(targetScene);
      setElapsedSeconds(getSceneStartTime(targetScene));
      setIsPlaying(true);
    }
  }, [currentScene, getSceneStartTime]);

  const handleNextScene = useCallback(() => {
    if (currentScene < TOTAL_SCENES) {
      const targetScene = currentScene + 1;
      setCurrentScene(targetScene);
      setElapsedSeconds(getSceneStartTime(targetScene));
      setIsPlaying(true);
    }
  }, [currentScene, getSceneStartTime]);

  const handleRestart = useCallback(() => {
    setCurrentScene(1);
    setElapsedSeconds(0);
    setIsPlaying(true);
  }, []);

  // Keyboard Shortcuts (Space: Play/Pause, Left/Right: Prev/Next, R: Restart)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        handlePrevScene();
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        handleNextScene();
      } else if (e.key.toLowerCase() === "r") {
        e.preventDefault();
        handleRestart();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleTogglePlay, handlePrevScene, handleNextScene, handleRestart]);

  return (
    <div className="min-h-screen w-full bg-[#0A0706] flex items-center justify-center relative overflow-hidden font-sans">
      {/* Precision Ambient Atmosphere for Screen Recording */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(176,132,34,0.08)_0%,rgba(10,7,6,1)_70%)] pointer-events-none" />

      {/* 9:16 Vertical Screen-Recording Canvas Container */}
      <div className="relative w-full h-screen sm:h-[94vh] sm:max-h-[920px] max-w-[440px] sm:aspect-[9/16] bg-[#1C1714] sm:rounded-[36px] sm:border-4 sm:border-[#4A3F35]/80 shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col">
        {/* Dynamic Safe Area & Scene Content */}
        <div className="relative w-full h-full flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScene}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full absolute inset-0"
            >
              {currentScene === 1 && <Scene1Hero />}
              {currentScene === 2 && <Scene2Visualizer />}
              {currentScene === 3 && <Scene3LinkedList />}
              {currentScene === 4 && <Scene4Dashboard />}
              {currentScene === 5 && <Scene5Mentor />}
              {currentScene === 6 && <Scene6Closing />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Minimal Safe-Zone Indicators on Desktop Preview */}
        <div className="hidden sm:block absolute top-2 left-1/2 -translate-x-1/2 w-20 h-3 rounded-full bg-[#251E19]/80 border border-[#4A3F35]/40 pointer-events-none" />
      </div>

      {/* Minimal Auto-Hiding Playback Controller */}
      <DemoReelControls
        currentScene={currentScene}
        totalScenes={TOTAL_SCENES}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onPrevScene={handlePrevScene}
        onNextScene={handleNextScene}
        onRestart={handleRestart}
        elapsedSeconds={elapsedSeconds}
        totalDurationSeconds={TOTAL_DURATION_SECONDS}
      />
    </div>
  );
}
