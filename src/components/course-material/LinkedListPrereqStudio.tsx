"use client";

import React, { useState } from "react";
import {
  Code2,
  Play,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Database,
  Cpu,
  Layers,
  HelpCircle,
  BookOpen,
  Zap,
  CheckSquare,
  Square,
  ChevronRight,
  Flame,
  Info,
} from "lucide-react";

export function LinkedListPrereqStudio() {
  const [lang, setLang] = useState<"bn" | "en">("bn");
  const [activeTab, setActiveTab] = useState<"pointer" | "address" | "dma" | "struct" | "checklist">("pointer");

  // Tab 1: Pointer State
  const [pointerVarVal, setPointerVarVal] = useState<number>(10);

  // Tab 2: Memory Address State
  const [selectedVar, setSelectedVar] = useState<"a" | "b">("a");
  const [varAVal] = useState<number>(100);
  const [varBVal] = useState<number>(200);

  // Tab 3: Dynamic Memory State
  const [isAllocated, setIsAllocated] = useState<boolean>(true);
  const [dynamicVal, setDynamicVal] = useState<number>(50);

  // Tab 4: Struct & 3-Node Manual Chain State
  const [nodeStep, setNodeStep] = useState<number>(3); // 1: created, 2: values, 3: connected

  // Checklist State
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    pointer: true,
    address: true,
    dma: false,
    struct: false,
  });

  const toggleCheck = (id: string) => {
    setChecklist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const checkedCount = Object.values(checklist).filter(Boolean).length;
  const isReady = checkedCount === 4;

  return (
    <div className="rounded-3xl border border-cyan-500/30 bg-card/95 shadow-2xl overflow-hidden backdrop-blur-md">
      {/* Studio Header Bar */}
      <div className="bg-gradient-to-r from-cyan-950/60 via-slate-900 to-indigo-950/60 p-5 sm:p-6 border-b border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              {lang === "bn" ? "🚀 লিঙ্কড লিস্টের পূর্বশর্ত গাইড" : "🚀 Linked List Prerequisites"}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Foundation
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-foreground tracking-tight">
            {lang === "bn"
              ? "Before You Start: পয়েন্টার, মেমোরি অ্যাড্রেস, ডাইনামিক মেমোরি ও স্ট্রাক্ট"
              : "Before You Start: Pointer, Memory Address, Dynamic Memory & Struct"}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {lang === "bn"
              ? "লিঙ্কড লিস্ট শুরু করার পূর্বে ৪টি অপরিহার্য বেসিক কনসেপ্টের ইন্টারঅ্যাক্টিভ ভিজ্যুয়ালাইজার"
              : "Interactive visualizer for the 4 core concepts before learning Linked Lists"}
          </p>
        </div>

        {/* Language Switch */}
        <div className="flex items-center gap-2 bg-secondary/80 p-1 rounded-xl border border-border self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setLang("bn")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              lang === "bn"
                ? "bg-amber-500 text-slate-950 shadow-md scale-105"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            🇧🇩 বাংলা
          </button>
          <button
            type="button"
            onClick={() => setLang("en")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              lang === "en"
                ? "bg-cyan-500 text-slate-950 shadow-md scale-105"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            🇺🇸 English
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center overflow-x-auto gap-2 p-3 bg-secondary/40 border-b border-border/60 scrollbar-thin">
        {[
          { id: "pointer", label: lang === "bn" ? "১. Pointer (পয়েন্টার)" : "1. Pointer", icon: Zap },
          { id: "address", label: lang === "bn" ? "২. Memory Address (অ্যাড্রেস)" : "2. Memory Address", icon: Cpu },
          { id: "dma", label: lang === "bn" ? "৩. Dynamic Memory (new/delete)" : "3. Dynamic Memory", icon: Database },
          { id: "struct", label: lang === "bn" ? "৪. Struct & Node Design" : "4. Struct & Node", icon: Layers },
          { id: "checklist", label: lang === "bn" ? "✅ Readiness Checklist" : "✅ Ready Checklist", icon: CheckSquare },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground border border-transparent"
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${isActive ? "text-cyan-400" : ""}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Area */}
      <div className="p-5 sm:p-7">
        {/* ================================================================= */}
        {/* TAB 1: POINTER */}
        {/* ================================================================= */}
        {activeTab === "pointer" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Concept Summary Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-cyan-500/[0.04] border border-cyan-500/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase">
                  <Zap className="h-4 w-4" />
                  <span>{lang === "bn" ? "পয়েন্টার কী ও কেন?" : "What is a Pointer?"}</span>
                </div>
                <p className="text-xs text-foreground/80 leading-relaxed">
                  {lang === "bn"
                    ? "পয়েন্টার হলো একটি বিশেষ ভ্যারিয়েবল যা কোনো সাধারণ সংখ্যা নয়, বরং অন্য একটি ভ্যারিয়েবলের মেমোরি ঠিকানা (Memory Address) জমা রাখে।"
                    : "A pointer is a special variable that stores the memory address of another variable rather than holding a direct value."}
                </p>
                <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono">
                  <span className="px-2 py-1 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    <code>&x</code> : Address-of (ঠিকানা নেওয়া)
                  </span>
                  <span className="px-2 py-1 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    <code>*ptr</code> : Dereference (ভেতরের মান)
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-500/[0.04] border border-indigo-500/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-400 uppercase">
                  <Sparkles className="h-4 w-4" />
                  <span>{lang === "bn" ? "লিঙ্কড লিস্টে কেন দরকার?" : "Connection to Linked List"}</span>
                </div>
                <p className="text-xs text-foreground/80 leading-relaxed">
                  {lang === "bn"
                    ? "লিঙ্কড লিস্টের প্রতিটি নোড মেমোরির আলাদা জায়গায় থাকে। প্রতিটি নোডের ভেতর next নামের পয়েন্টার দিয়ে পরবর্তী নোডের ঠিকানা ধরে রাখা হয়।"
                    : "Linked list nodes are scattered in memory. A pointer `next` inside each node stores the address of the subsequent node to link them."}
                </p>
              </div>
            </div>

            {/* Interactive Visualizer */}
            <div className="p-5 rounded-2xl border border-border/80 bg-secondary/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-muted-foreground uppercase">
                  {lang === "bn" ? "ইন্টারঅ্যাক্টিভ পয়েন্টার ল্যাব" : "Interactive Pointer Lab"}
                </span>
                <span className="text-[11px] font-mono text-cyan-400">
                  int x = {pointerVarVal}; int* ptr = &x;
                </span>
              </div>

              {/* Memory Simulation Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center justify-center">
                {/* Variable Box */}
                <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/20 space-y-2 relative">
                  <span className="absolute top-2 right-3 text-[10px] font-mono text-emerald-400">
                    Address: <code>0x7FFE1000</code>
                  </span>
                  <div className="text-xs font-mono font-bold text-emerald-300">Variable: x</div>
                  <div className="h-14 flex items-center justify-center rounded-lg bg-card border border-emerald-500/30 text-2xl font-mono font-black text-emerald-400">
                    {pointerVarVal}
                  </div>
                  <div className="text-[10px] text-muted-foreground font-mono text-center">
                    Direct Value in Stack Memory
                  </div>
                </div>

                {/* Pointer Box */}
                <div className="p-4 rounded-xl border border-cyan-500/40 bg-cyan-950/20 space-y-2 relative">
                  <span className="absolute top-2 right-3 text-[10px] font-mono text-cyan-400">
                    Address: <code>0x7FFE2000</code>
                  </span>
                  <div className="text-xs font-mono font-bold text-cyan-300">Pointer: ptr (int*)</div>
                  <div className="h-14 flex items-center justify-center rounded-lg bg-card border border-cyan-500/30 text-sm font-mono font-bold text-cyan-400">
                    👉 0x7FFE1000 (&x)
                  </div>
                  <div className="text-[10px] text-muted-foreground font-mono text-center">
                    Dereference <code>*ptr</code> returns: <strong className="text-emerald-400">{pointerVarVal}</strong>
                  </div>
                </div>
              </div>

              {/* Interactive Controls */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPointerVarVal((v) => v + 5)}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-mono font-bold text-xs hover:bg-cyan-400 transition-all active:scale-95 shadow-md shadow-cyan-500/20"
                >
                  {lang === "bn" ? "পয়েন্টার দিয়ে মান বাড়ান (*ptr += 5)" : "Modify via Pointer (*ptr += 5)"}
                </button>
                <button
                  type="button"
                  onClick={() => setPointerVarVal((v) => Math.max(0, v - 5))}
                  className="px-3.5 py-1.5 rounded-xl bg-secondary text-foreground font-mono font-bold text-xs hover:bg-secondary/80 border border-border transition-all active:scale-95"
                >
                  {lang === "bn" ? "মান কমান (*ptr -= 5)" : "Decrease (*ptr -= 5)"}
                </button>
                <button
                  type="button"
                  onClick={() => setPointerVarVal(10)}
                  className="px-3 py-1.5 rounded-xl bg-secondary text-muted-foreground text-xs font-mono hover:text-foreground transition-all"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Easy & Medium Code Examples */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Easy Example */}
              <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase">
                    {lang === "bn" ? "সহজ উদাহরণ: মান পরিবর্তন" : "Easy Example: Value Access"}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                    Easy
                  </span>
                </div>
                <pre className="p-3 rounded-xl bg-slate-950 text-slate-200 text-xs font-mono overflow-x-auto leading-relaxed">
{`int x = 10;
int* ptr = &x; // ptr holds address of x

*ptr = 25; // x becomes 25!
cout << x; // Output: 25`}
                </pre>
                <p className="text-[11px] text-muted-foreground">
                  {lang === "bn"
                    ? "👉 `*ptr = 25` লেখার সাথে সাথে মেমোরিতে x এর মূল মান ১০ থেকে পরিবর্তিত হয়ে ২৫ হয়ে যায়।"
                    : "👉 Modifying `*ptr = 25` directly alters x in memory without referencing x directly."}
                </p>
              </div>

              {/* Medium Example */}
              <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                    {lang === "bn" ? "মাঝারি উদাহরণ: দুটি মান Swap" : "Medium Example: Swap via Pointers"}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400">
                    Medium
                  </span>
                </div>
                <pre className="p-3 rounded-xl bg-slate-950 text-slate-200 text-xs font-mono overflow-x-auto leading-relaxed">
{`void swap(int* a, int* b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}
// Call: swap(&x, &y);`}
                </pre>
                <p className="text-[11px] text-muted-foreground">
                  {lang === "bn"
                    ? "👉 মেমোরি অ্যাড্রেস পাঠিয়ে সরাসরি আসল ভ্যারিয়েবলের অবস্থান থেকে মান অদলবদল করা হয়।"
                    : "👉 Passing memory addresses allows modifying the original caller variables directly."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: MEMORY ADDRESS */}
        {/* ================================================================= */}
        {activeTab === "address" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-cyan-500/[0.04] border border-cyan-500/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase">
                  <Cpu className="h-4 w-4" />
                  <span>{lang === "bn" ? "Memory Address কী?" : "What is Memory Address?"}</span>
                </div>
                <p className="text-xs text-foreground/80 leading-relaxed">
                  {lang === "bn"
                    ? "কম্পিউটারের র‍্যাম (RAM) হলো কোটি কোটি ছোট ছোট মেমোরি ঘরের মতো। প্রতিটি ঘরের একটি ইউনিক হেক্সাডেসিমাল ঠিকানা থাকে (যেমন 0x1000 বা 0x1004)।"
                    : "RAM is composed of millions of sequential memory byte cells. Each byte cell has a unique hexadecimal address like 0x1000."}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-500/[0.04] border border-indigo-500/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-400 uppercase">
                  <Sparkles className="h-4 w-4" />
                  <span>{lang === "bn" ? "কেন ঠিকানা জানা জরুরি?" : "Why Address Matters?"}</span>
                </div>
                <p className="text-xs text-foreground/80 leading-relaxed">
                  {lang === "bn"
                    ? "লিঙ্কড লিস্টে উপাদানগুলো ক্রমানুসারে পাশাপাশি থাকে না। তাই প্রতিটি নোড ঠিক কোথায় আছে তা জানার একমাত্র উপায় তার মেমোরি অ্যাড্রেস।"
                    : "In linked lists, elements are non-contiguous. Storing exact memory addresses is the only way to traverse from node to node."}
                </p>
              </div>
            </div>

            {/* Interactive Memory Inspector */}
            <div className="p-5 rounded-2xl border border-border/80 bg-secondary/30 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold text-muted-foreground uppercase">
                  {lang === "bn" ? "ইন্টারঅ্যাক্টিভ মেমোরি ইন্সপেক্টর" : "Interactive Memory Inspector"}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-mono">Point pointer to:</span>
                  <button
                    type="button"
                    onClick={() => setSelectedVar("a")}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      selectedVar === "a"
                        ? "bg-cyan-500 text-slate-950 shadow-sm"
                        : "bg-secondary text-foreground hover:bg-secondary/80 border border-border"
                    }`}
                  >
                    Variable A (&a)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedVar("b")}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      selectedVar === "b"
                        ? "bg-cyan-500 text-slate-950 shadow-sm"
                        : "bg-secondary text-foreground hover:bg-secondary/80 border border-border"
                    }`}
                  >
                    Variable B (&b)
                  </button>
                </div>
              </div>

              {/* Memory Grid Visualization */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Cell A */}
                <div
                  className={`p-4 rounded-xl border transition-all ${
                    selectedVar === "a"
                      ? "border-cyan-500 bg-cyan-950/40 ring-2 ring-cyan-500/30 scale-102"
                      : "border-border/60 bg-card"
                  }`}
                >
                  <div className="flex justify-between text-[11px] font-mono text-muted-foreground mb-1">
                    <span>Var <code>a</code> (int)</span>
                    <span className="text-cyan-400 font-bold">0x1000</span>
                  </div>
                  <div className="text-xl font-mono font-black text-foreground">{varAVal}</div>
                  {selectedVar === "a" && (
                    <div className="mt-2 text-[10px] font-mono text-cyan-400 flex items-center gap-1 font-bold">
                      <ArrowRight className="h-3 w-3" /> Targeted by pointer
                    </div>
                  )}
                </div>

                {/* Cell B */}
                <div
                  className={`p-4 rounded-xl border transition-all ${
                    selectedVar === "b"
                      ? "border-cyan-500 bg-cyan-950/40 ring-2 ring-cyan-500/30 scale-102"
                      : "border-border/60 bg-card"
                  }`}
                >
                  <div className="flex justify-between text-[11px] font-mono text-muted-foreground mb-1">
                    <span>Var <code>b</code> (int)</span>
                    <span className="text-cyan-400 font-bold">0x1004</span>
                  </div>
                  <div className="text-xl font-mono font-black text-foreground">{varBVal}</div>
                  {selectedVar === "b" && (
                    <div className="mt-2 text-[10px] font-mono text-cyan-400 flex items-center gap-1 font-bold">
                      <ArrowRight className="h-3 w-3" /> Targeted by pointer
                    </div>
                  )}
                </div>

                {/* Pointer Inspect */}
                <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-950/20">
                  <div className="text-[11px] font-mono text-amber-300 font-bold mb-1">
                    Pointer <code>ptr</code>
                  </div>
                  <div className="text-sm font-mono font-bold text-amber-400">
                    Stores: {selectedVar === "a" ? "0x1000" : "0x1004"}
                  </div>
                  <div className="text-xs font-mono text-foreground mt-1">
                    <code>*ptr</code> = {selectedVar === "a" ? varAVal : varBVal}
                  </div>
                </div>
              </div>
            </div>

            {/* Code Breakdown */}
            <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                {lang === "bn" ? "লাইন-বাই-লাইন কোড বিশ্লেষণ" : "Line-by-Line Code Breakdown"}
              </span>
              <pre className="p-3 rounded-xl bg-slate-950 text-slate-200 text-xs font-mono overflow-x-auto leading-relaxed">
{`int a = 100, b = 200;
int* ptr = &a; // ptr point করছে 0x1000 ঠিকানায় (*ptr = 100)

ptr = &b;      // ptr এর মান বদলে হলো 0x1004 (*ptr = 200)`}
              </pre>
              <p className="text-xs text-muted-foreground">
                {lang === "bn"
                  ? "পয়েন্টারকে এক ভ্যারিয়েবল থেকে অন্য ভ্যারিয়েবলে রিডাইরেক্ট করতে কেবল তার সংরক্ষিত মেমোরি অ্যাড্রেস পরিবর্তন করতে হয় — এটিই লিঙ্কড লিস্টের ট্রাভার্সালের মূল ভিত্তি!"
                  : "Redirecting a pointer simply involves reassigning the stored memory address — this is the foundational mechanism of linked list traversal!"}
              </p>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: DYNAMIC MEMORY ALLOCATION */}
        {/* ================================================================= */}
        {activeTab === "dma" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-cyan-500/[0.04] border border-cyan-500/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase">
                  <Database className="h-4 w-4" />
                  <span>{lang === "bn" ? "Dynamic Memory কী?" : "What is Dynamic Memory?"}</span>
                </div>
                <p className="text-xs text-foreground/80 leading-relaxed">
                  {lang === "bn"
                    ? "সাধারণ ভ্যারিয়েবল স্ট্যাক (Stack) এ তৈরি হয় এবং ফাংশন শেষ হলে মুছে যায়। কিন্তু new দিয়ে হিপ (Heap) মেমোরিতে রান-টাইমে ইচ্ছামতো নতুন জায়গা নেওয়া যায় এবং delete না করা পর্যন্ত তা অক্ষত থাকে।"
                    : "Static variables live on the Stack and die when scope ends. Heap memory created via `new` persists at runtime until explicitly freed via `delete`."}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-500/[0.04] border border-indigo-500/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-400 uppercase">
                  <Sparkles className="h-4 w-4" />
                  <span>{lang === "bn" ? "new এবং delete" : "new & delete"}</span>
                </div>
                <p className="text-xs text-foreground/80 leading-relaxed">
                  {lang === "bn"
                    ? "• `new Node()`: হিপে নতুন নোডের মেমোরি বরাদ্দ করে তার ঠিকানা দেয়।\n• `delete ptr`: কাজ শেষে মেমোরি খালি করে Memory Leak রোধ করে।"
                    : "• `new Node()`: Dynamically allocates memory on Heap.\n• `delete ptr`: Releases allocated memory to prevent memory leaks."}
                </p>
              </div>
            </div>

            {/* Interactive Heap Simulator */}
            <div className="p-5 rounded-2xl border border-border/80 bg-secondary/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-muted-foreground uppercase">
                  {lang === "bn" ? "ইন্টারঅ্যাক্টিভ হিপ মেমোরি সিমুলেটর" : "Interactive Heap Memory Simulator"}
                </span>
                <span className="text-[11px] font-mono text-cyan-400">
                  {isAllocated ? "Heap Block Active (0x3000)" : "Heap Clean / Freed"}
                </span>
              </div>

              {/* Visual Box */}
              <div className="p-6 rounded-2xl border border-cyan-500/30 bg-card flex flex-col items-center justify-center text-center min-h-[140px] space-y-2">
                {isAllocated ? (
                  <div className="animate-in zoom-in-95 duration-200 space-y-1">
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      Heap Address: 0x3000
                    </span>
                    <div className="text-3xl font-mono font-black text-cyan-400">{dynamicVal}</div>
                    <p className="text-xs text-muted-foreground font-mono">
                      Pointer <code>p</code> points to Heap object with value {dynamicVal}
                    </p>
                  </div>
                ) : (
                  <div className="animate-in fade-in duration-200 text-muted-foreground space-y-1">
                    <span className="text-2xl">🗑️</span>
                    <div className="text-xs font-mono font-bold">Memory Deleted (`delete p; p = nullptr;`)</div>
                    <p className="text-[11px]">No memory leak! Heap cell returned to OS pool.</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAllocated(true);
                    setDynamicVal((v) => (v === 50 ? 99 : 50));
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-mono font-bold text-xs hover:opacity-90 transition-all active:scale-95 shadow-md shadow-emerald-500/20"
                >
                  {isAllocated ? "Allocate Another (new int)" : "Allocate on Heap (`p = new int(50)`)"}
                </button>
                {isAllocated && (
                  <button
                    type="button"
                    onClick={() => setIsAllocated(false)}
                    className="px-4 py-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 font-mono font-bold text-xs hover:bg-rose-500/30 transition-all active:scale-95"
                  >
                    Free Memory (`delete p`)
                  </button>
                )}
              </div>
            </div>

            {/* Code Examples */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase">
                  {lang === "bn" ? "সহজ ডাইনামিক ইনটিজার" : "Easy: Dynamic Integer"}
                </span>
                <pre className="p-3 rounded-xl bg-slate-950 text-slate-200 text-xs font-mono overflow-x-auto leading-relaxed">
{`int* p = new int(50); // হিপে ৫০ স্টোর
cout << *p;            // Output: 50

delete p;              // মেমোরি খালি করা
p = nullptr;`}
                </pre>
              </div>

              <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                  {lang === "bn" ? "মাঝারি: ডাইনামিক স্ট্রাক্ট অবজেক্ট" : "Medium: Dynamic Struct Object"}
                </span>
                <pre className="p-3 rounded-xl bg-slate-950 text-slate-200 text-xs font-mono overflow-x-auto leading-relaxed">
{`struct Node { int data; };

Node* n = new Node{100};
cout << n->data; // Output: 100

delete n;
n = nullptr;`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 4: STRUCT & NODE DESIGN */}
        {/* ================================================================= */}
        {activeTab === "struct" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-cyan-500/[0.04] border border-cyan-500/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase">
                  <Layers className="h-4 w-4" />
                  <span>{lang === "bn" ? "Struct কী?" : "What is a Struct?"}</span>
                </div>
                <p className="text-xs text-foreground/80 leading-relaxed">
                  {lang === "bn"
                    ? "স্ট্রাক্ট (struct) হলো একাধিক ভিন্ন ধরনের ডেটা (যেমন int, string, pointer) কে একটিমাত্র একক প্যাকেটে গুচ্ছবদ্ধ করার উপায়।"
                    : "A struct is a user-defined type that packages multiple related data variables into a single cohesive structure."}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-500/[0.04] border border-indigo-500/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-400 uppercase">
                  <Sparkles className="h-4 w-4" />
                  <span>{lang === "bn" ? "Node এর ভেতরে Node* next কেন?" : "Why Node* next?"}</span>
                </div>
                <p className="text-xs text-foreground/80 leading-relaxed">
                  {lang === "bn"
                    ? "একে বলে Self-Referential Struct। কারণ প্রতিটি নোড তার নিজের ধরনেরই পরবর্তী নোডের ঠিকানা ধরে রাখে এবং চেইন তৈরি করে।"
                    : "This self-referential pointer holds the memory address of the subsequent Node to form a chain."}
                </p>
              </div>
            </div>

            {/* Interactive 3-Node Chain Builder */}
            <div className="p-5 rounded-2xl border border-border/80 bg-secondary/30 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold text-muted-foreground uppercase">
                  {lang === "bn" ? "ইন্টারঅ্যাক্টিভ ৩-নোড চেইন সংযোগ" : "Interactive 3-Node Chain Simulator"}
                </span>
                <div className="flex items-center gap-1.5 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => setNodeStep(1)}
                    className={`px-2.5 py-1 rounded-lg ${
                      nodeStep === 1 ? "bg-cyan-500 text-slate-950 font-bold" : "bg-secondary text-foreground"
                    }`}
                  >
                    Step 1: Nodes
                  </button>
                  <button
                    type="button"
                    onClick={() => setNodeStep(2)}
                    className={`px-2.5 py-1 rounded-lg ${
                      nodeStep === 2 ? "bg-cyan-500 text-slate-950 font-bold" : "bg-secondary text-foreground"
                    }`}
                  >
                    Step 2: Values
                  </button>
                  <button
                    type="button"
                    onClick={() => setNodeStep(3)}
                    className={`px-2.5 py-1 rounded-lg ${
                      nodeStep === 3 ? "bg-cyan-500 text-slate-950 font-bold" : "bg-secondary text-foreground"
                    }`}
                  >
                    Step 3: Connect
                  </button>
                </div>
              </div>

              {/* Visual Connected Nodes */}
              <div className="flex flex-wrap items-center justify-center gap-3 py-4">
                {/* Node 1 */}
                <div className="flex items-center gap-2">
                  <div className="p-3 rounded-2xl border-2 border-cyan-500/50 bg-card shadow-lg flex flex-col items-center min-w-[100px]">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold">Node 1 (0x1000)</span>
                    <div className="my-1.5 px-3 py-1 rounded bg-secondary text-sm font-mono font-black text-foreground">
                      data: {nodeStep >= 2 ? "10" : "?"}
                    </div>
                    <div className="text-[10px] font-mono text-amber-400">
                      next: {nodeStep >= 3 ? "0x2000" : "nullptr"}
                    </div>
                  </div>
                  {nodeStep >= 3 && <ArrowRight className="h-5 w-5 text-cyan-400 animate-pulse" />}
                </div>

                {/* Node 2 */}
                <div className="flex items-center gap-2">
                  <div className="p-3 rounded-2xl border-2 border-cyan-500/50 bg-card shadow-lg flex flex-col items-center min-w-[100px]">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold">Node 2 (0x2000)</span>
                    <div className="my-1.5 px-3 py-1 rounded bg-secondary text-sm font-mono font-black text-foreground">
                      data: {nodeStep >= 2 ? "20" : "?"}
                    </div>
                    <div className="text-[10px] font-mono text-amber-400">
                      next: {nodeStep >= 3 ? "0x3000" : "nullptr"}
                    </div>
                  </div>
                  {nodeStep >= 3 && <ArrowRight className="h-5 w-5 text-cyan-400 animate-pulse" />}
                </div>

                {/* Node 3 */}
                <div className="flex items-center gap-2">
                  <div className="p-3 rounded-2xl border-2 border-cyan-500/50 bg-card shadow-lg flex flex-col items-center min-w-[100px]">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold">Node 3 (0x3000)</span>
                    <div className="my-1.5 px-3 py-1 rounded bg-secondary text-sm font-mono font-black text-foreground">
                      data: {nodeStep >= 2 ? "30" : "?"}
                    </div>
                    <div className="text-[10px] font-mono text-rose-400 font-bold">
                      next: nullptr (NULL)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Complete C++ Code */}
            <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                {lang === "bn" ? "৩টি নোড ম্যানুয়ালি কানেক্ট করার পূর্ণাঙ্গ কোড" : "Full 3-Node Manual Connection Code"}
              </span>
              <pre className="p-3 rounded-xl bg-slate-950 text-slate-200 text-xs font-mono overflow-x-auto leading-relaxed">
{`struct Node {
    int data;
    Node* next;
};

int main() {
    Node a, b, c;
    a.data = 10; b.data = 20; c.data = 30;

    a.next = &b; // Node 1 -> Node 2
    b.next = &c; // Node 2 -> Node 3
    c.next = nullptr; // Terminate with NULL
}`}
              </pre>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 5: READINESS CHECKLIST */}
        {/* ================================================================= */}
        {activeTab === "checklist" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header Badge */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-indigo-950/40 to-purple-950/40 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="text-base sm:text-lg font-black text-foreground">
                  {lang === "bn" ? "🎯 আপনি কি লিঙ্কড লিস্টের জন্য প্রস্তুত?" : "🎯 Are you ready for Linked List?"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {lang === "bn"
                    ? "নিচের ৪টি পয়েন্ট বুঝে থাকলে টিক দিন এবং আপনার প্রস্তুতি যাচাই করুন!"
                    : "Check off the 4 prerequisite concepts to evaluate your readiness!"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs font-mono text-muted-foreground">Score</div>
                  <div className="text-xl font-mono font-black text-cyan-400">{checkedCount} / 4</div>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-mono font-black">
                  {Math.round((checkedCount / 4) * 100)}%
                </div>
              </div>
            </div>

            {/* Checklist Items */}
            <div className="space-y-3">
              {[
                {
                  id: "pointer",
                  title: lang === "bn" ? "১. Pointer কনসেপ্ট পরিষ্কার" : "1. Pointer Fundamentals",
                  desc:
                    lang === "bn"
                      ? "আমি বুঝি যে পয়েন্টার হলো মেমোরি অ্যাড্রেস ধারণকারী ভ্যারিয়েবল এবং `*ptr` দিয়ে মূল মান পাওয়া যায়।"
                      : "I understand that a pointer stores a memory address and `*ptr` dereferences the value.",
                },
                {
                  id: "address",
                  title: lang === "bn" ? "২. Memory Address ও র‍্যামের অবস্থান" : "2. Memory Address in RAM",
                  desc:
                    lang === "bn"
                      ? "আমি বুঝি যে মেমোরির প্রতিটি ঘরের একটি ঠিকানা থাকে এবং `&` দিয়ে ঠিকানা বের করা হয়।"
                      : "I understand each memory cell has a unique address retrieved via the address-of operator `&`.",
                },
                {
                  id: "dma",
                  title: lang === "bn" ? "৩. Dynamic Memory (new & delete)" : "3. Dynamic Memory Allocation",
                  desc:
                    lang === "bn"
                      ? "আমি বুঝি যে `new` দিয়ে হিপে রান-টাইমে মেমোরি নেওয়া হয় এবং `delete` দিয়ে মুক্ত করা হয়।"
                      : "I understand that `new` dynamically allocates on the Heap and `delete` frees it.",
                },
                {
                  id: "struct",
                  title: lang === "bn" ? "৪. Struct ও Node* next লিংক" : "4. Struct & Self-Referential Pointer",
                  desc:
                    lang === "bn"
                      ? "আমি বুঝি যে `struct Node` এর ভেতর `data` এবং পরের নোডকে পয়েন্ট করতে `Node* next` থাকে।"
                      : "I understand `struct Node` packages `data` and a self-referential `Node* next` pointer.",
                },
              ].map((item) => {
                const isChecked = checklist[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all select-none flex items-start gap-3.5 ${
                      isChecked
                        ? "bg-cyan-500/[0.07] border-cyan-500/50 shadow-md shadow-cyan-500/5"
                        : "bg-card hover:bg-secondary/40 border-border"
                    }`}
                  >
                    <button
                      type="button"
                      className={`mt-0.5 h-5 w-5 rounded-lg flex items-center justify-center shrink-0 border transition-all ${
                        isChecked
                          ? "bg-cyan-500 border-cyan-400 text-slate-950"
                          : "border-muted-foreground/50 bg-secondary"
                      }`}
                    >
                      {isChecked && <CheckCircle2 className="h-4 w-4" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-bold ${isChecked ? "text-cyan-300" : "text-foreground"}`}>
                        {item.title}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Readiness Banner */}
            {isReady ? (
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center gap-3 text-emerald-300 animate-in zoom-in-95 duration-200">
                <Sparkles className="h-6 w-6 text-emerald-400 shrink-0" />
                <div className="text-xs">
                  <strong className="text-sm font-bold block text-emerald-200">
                    {lang === "bn" ? "🎉 অভিনন্দন! আপনি ১০০% প্রস্তুত!" : "🎉 Congratulations! You are 100% Ready!"}
                  </strong>
                  {lang === "bn"
                    ? "আপনার ৪টি মৌলিক ভিত্তি পুরোপুরি ক্লিয়ার। আপনি এখন লিঙ্কড লিস্টের নোড তৈরি, ট্রাভার্সাল ও অ্যালগরিদম শেখা শুরু করতে পারেন!"
                    : "Your prerequisite foundation is complete. You can now dive directly into Chapter 5 Linked Lists!"}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-secondary/60 border border-border flex items-center justify-between gap-3 text-xs text-muted-foreground">
                <span>
                  {lang === "bn"
                    ? "সবগুলো বক্সে টিক দিন এবং আপনার পূর্বশর্ত সম্পন্ন করুন।"
                    : "Check all 4 boxes to complete your prerequisite foundation."}
                </span>
                <button
                  type="button"
                  onClick={() => setChecklist({ pointer: true, address: true, dma: true, struct: true })}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold hover:bg-cyan-500/30 transition-all"
                >
                  {lang === "bn" ? "সবগুলো সম্পন্ন মার্ক করুন" : "Mark All Complete"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
