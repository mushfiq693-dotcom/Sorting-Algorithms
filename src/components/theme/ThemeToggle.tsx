"use client";

import React, { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const savedTheme = localStorage.getItem("algohub_theme") as "dark" | "light" | null;
      if (savedTheme) {
        setTheme(savedTheme);
        if (savedTheme === "light") {
          document.documentElement.classList.remove("dark");
        } else {
          document.documentElement.classList.add("dark");
        }
      } else {
        // Default to dark mode for rich AlgoHub aesthetics
        document.documentElement.classList.add("dark");
        setTheme("dark");
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    try {
      localStorage.setItem("algohub_theme", nextTheme);
      if (nextTheme === "light") {
        document.documentElement.classList.remove("dark");
      } else {
        document.documentElement.classList.add("dark");
      }
    } catch {
      // ignore
    }
  };

  if (!mounted) {
    return (
      <div className="h-9 w-9 rounded-xl border border-border/80 bg-secondary/80 flex items-center justify-center text-muted-foreground opacity-50" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="h-9 w-9 rounded-xl border border-border/80 bg-secondary/80 flex items-center justify-center text-foreground hover:bg-secondary hover:text-amber-400 dark:hover:text-cyan-400 transition-all active:scale-95 shadow-sm"
      aria-label={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
      title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-amber-400 hover:rotate-45 transition-transform duration-300" />
      ) : (
        <Moon className="h-4 w-4 text-cyan-600 dark:text-cyan-400 hover:-rotate-12 transition-transform duration-300" />
      )}
    </button>
  );
}
