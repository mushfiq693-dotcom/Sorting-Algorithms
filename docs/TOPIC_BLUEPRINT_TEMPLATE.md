# 📘 AlgoHub Topic Blueprint & Implementation Standard

> **Core Reference**: Derived from the completed and validated **Array** topic (`/algorithms/array`).  
> **Purpose**: This living document tracks all custom modifications, UI/UX polish, educational standards, and structural patterns applied to the **Array** section. Every future topic (Phase 1 to Phase 9) will follow this exact standard.

---

## 📑 Table of Contents
1. [Topic Architecture & File Registry](#1-topic-architecture--file-registry)
2. [Data Layer Standards](#2-data-layer-standards)
3. [Visualizer & Engine Standards](#3-visualizer--engine-standards)
4. [Diagrams & Visual Infographics](#4-diagrams--visual-infographics)
5. [Educational & Assessment Ecosystem](#5-educational--assessment-ecosystem)
6. [Array Section Modifications & Changelog](#6-array-section-modifications--changelog)
7. [Step-by-Step Implementation Recipe for New Topics](#7-step-by-step-implementation-recipe-for-new-topics)

---

## 1. Topic Architecture & File Registry

Each topic in AlgoHub integrates into the application across 11 key touchpoints:

| Category | File Path | Role & Responsibilities |
| :--- | :--- | :--- |
| **Type Definitions** | `src/types/sorting.ts` | Register topic ID (`AlgorithmId`), visualizer state types, and operation models. |
| **Topic Metadata** | `src/data/algorithms.ts` | Title, category, complexity ($O$), summary, multi-language code snippets, and line explanations. |
| **Documentation** | `src/data/docs.ts` | Deep-dive guide: intuition, visual analogies, memory layouts, operations, and trade-offs. |
| **Mastery Quizzes** | `src/data/quizzes.ts` | 5 conceptual & code-tracing multiple-choice questions with detailed explanations. |
| **Bug Hunt** | `src/data/bugHunt.ts` | 2 practical debugging scenarios with buggy code, clues, and corrected solutions. |
| **Problem Solving** | `src/data/problemSolving.ts` | Real-world / LeetCode-style interview problems mapped to this topic. |
| **Learning Path** | `src/data/learningPath.ts` | Course node placement, prerequisites, and progression unlocks. |
| **Algorithm Engine** | `src/algorithms/<topic>.ts` | Pure step generator engine recording discrete animation frames & execution logs. |
| **Visualizer Component** | `src/components/visualizer/<Topic>Visualizer.tsx` | Main interactive canvas, play/pause/step controls, custom inputs, state monitors. |
| **Diagram Component** | `src/components/diagrams/<Topic>Diagram.tsx` | Static/interactive architectural infographic (memory strip, pointer relations, etc.). |
| **Page Route & Nav** | `src/app/algorithms/[algorithm]/page.tsx`<br>`src/components/navigation/TopicNavbarDropdown.tsx` | Dynamic route mapping, tab switches, and global navbar inclusion. |

---

## 2. Data Layer Standards

### 2.1 Algorithm Definition (`src/data/algorithms.ts`)
* **ID & Slug**: lowercase-kebab-case (e.g., `array`, `string`, `hash-table`).
* **Category**: One of `fundamentals`, `sorting`, `searching`, `data-structures`, `trees`, `graphs`, `advanced`.
* **Complexity Matrix**:
  * Time: Best, Average, Worst with concise conditions.
  * Space: Auxiliary memory usage.
* **Multi-Language Implementations**:
  * Clean, idiomatic snippets for **TypeScript**, **Python**, **Java**, and **C++**.
  * **Line-by-line explanation mappings** for interactive code tracing.

### 2.2 Learning Path & The Idea Engagement Hooks (`src/data/learningPath.ts`)
Every topic must populate these high-engagement fields inside its `LearningStep`:
* `hook`: **The Mind-Catcher / Spark** — a single punchy question or observation that instantly hooks the learner's curiosity from the first line.
* `superpower`: What makes this data structure or algorithm uniquely formidable.
* `tradeoff`: The fundamental engineering bottleneck or cost.
* `mentalModel`: A vivid cognitive anchor (e.g., "Locker Hallway", "Stack of Trays").
* `keyPrinciples`: 3–4 bullet points formatted with bold leading tags for instant readability.

---

## 3. Visualizer & Engine Standards

### 3.1 Engine Design (`src/algorithms/<topic>.ts`)
* **Decoupled Logic**: The algorithm or data structure logic runs independently of React render loops.
* **State Snapshots (`Step`)**: Each operation generates a sequence of immutable state frames.
* **Step Metadata**:
  * `description`: Plain-English explanation of what this micro-step achieves.
  * `codeLine`: Active line index corresponding to the code panel.
  * `highlights`: Indices, pointers, or nodes currently under inspection, mutation, or shift.

### 3.2 Visualizer UI/UX (`src/components/visualizer/<Topic>Visualizer.tsx`)
* **Design Language**: Consistent AlgoHub dark aesthetic (slate/zinc dark surfaces, crisp cyan/amber/emerald highlights).
* **Control Bar**:
  * Step Backward, Play / Pause, Step Forward, Reset, Speed Slider.
  * Input Form with strict validation (e.g., bounds checking, capacity limits).
* **Real-time Metrics**:
  * Operation counter, comparison / shift counter, current memory state, address calculators.

---

## 4. Topic Walkthrough Flow (Standard 5-Step Architecture)

To maximize engagement, retain focus within the app, and eliminate visual clutter, all topic pages feature a focused **5-step progression** (both for existing and all future topics):

```
Step 1: The Idea           -> Curiosity Spark ("The Big Question • Why This Matters"),
                              3 Badges (Superpower, Tradeoff, Mental Model),
                              Plain English Explanation, Bengali Accordion ("বাংলায় বুঝি"),
                              Direct In-App Gateway to In-Depth Theory
Step 2: In-Depth Theory    -> In-Depth Docs & Mathematical Theory FIRST,
                              Signature Architectural Infographic Diagram at the BOTTOM
                              (Zero C++ code bloat in diagrams)
Step 3: Watch It Work      -> Interactive laboratory & step-by-step state visualizer
Step 4: Why It's Fast/Slow -> Asymptotic complexity grid & operations matrix
                              (Cleaned of redundant description boxes)
Step 5: Try It (Practice)  -> Live debugger, predict-next, 5 quizzes, bug hunt, and interview problems
```

> ⚠️ **Global Rules**:  
> 1. **No External Docs Redirects**: All "Full Docs & Theory" external link buttons (`/docs/...`) are **strictly eliminated**. Advanced theory is integrated seamlessly right in **Step 2: In-Depth Theory** directly after **The Idea**.
> 2. **Theory First, Diagram Below**: In **Step 2**, the comprehensive documentation and theoretical analysis must appear **first**, and the Full Picture architectural diagram must sit cleanly at the **bottom**.
> 3. **No C++ Code in Diagrams**: The signature diagrams (`AlgorithmDiagram`) must remain strictly visual infographics (memory strips, tree divisions, timelines). All C++ code blocks and duplicate captions are completely omitted from the diagram component.
> 4. **Minimalistic The Idea**: Step 1 focuses on high-impact intuition (Hook, 3 Badges, Plain English, and Bengali Note). Redundant principle bullet grids and analogy blocks are excluded to maintain extreme clarity.
> 5. **Practice Tab Integrity**: The Practice tab (`Step 5`) is dedicated solely to interactive problem solving (Debugger, Predict, Quizzes, Bug-Hunt, LeetCode Challenges). No complexity charts or duplicate stats blocks may be placed in this tab.

---

## 5. Educational & Assessment Ecosystem

Every topic must provide a complete 360° mastery suite:
1. **Curiosity Hook & Mental Models**: Captures attention within 5 seconds of opening the topic.
2. **Embedded In-Depth Guide**: Rich Markdown explanations with memory diagrams, edge cases, and mathematical foundations (`src/data/docs.ts`).
3. **Interactive Visualizer**: Dynamic step-by-step experimentation with real-time state inspections.
4. **Complexity Analysis**: Big-O growth curves and operation tables.
5. **Quizzes**: 5 high-yield questions testing edge cases, complexities, and code tracing (`src/data/quizzes.ts`).
6. **Bug Hunt**: 2 real-world bug scenarios (off-by-one, overflow, bounds violations) with actionable debugging (`src/data/bugHunt.ts`).
7. **Interview Problems**: Easy, Medium, and Hard challenges with solutions and complexity breakdowns (`src/data/problemSolving.ts`).

---

## 6. Array Section Modifications & Changelog

### 🔄 [2026-10-11] Visual Streamlining & In-Depth Section Layout Standardization
* **Removed Visual Clutter**:
  * Removed `KEY TAKEAWAYS & RULES TO REMEMBER` and `REAL-WORLD ANALOGY` from Step 1 (`The Idea`) across all topics.
  * Removed the redundant `(i)` description summary box from `ComplexityCard.tsx`.
* **In-Depth Theory Section (Step 2) Reordered**:
  * Reordered Step 2 so that **Comprehensive Docs & Theory** (`FormattedMarkdown`) appears first.
  * Placed **The Full Picture Architectural Diagram** (`AlgorithmDiagram`) at the bottom of the section.
  * **Removed C++ Code from Diagrams**: Stripped the C++ CodeViewer block and formula caption from `AlgorithmDiagram.tsx`, leaving it as a pure, focused visual infographic.
* **Array Practice Tab**:
  * Confirmed zero complexity artifacts or duplicate growth curves in Step 5.

---

## 7. Step-by-Step Implementation Recipe for New Topics

When implementing subsequent topics from the roadmap (e.g., `String`, `Deque`, `Hash Table`), follow these verified steps in order:

1. **Register Type & IDs**: Add topic slug to `AlgorithmId` in `src/types/sorting.ts`.
2. **Implement Core Engine**: Create `src/algorithms/<topic>.ts` producing state snapshots.
3. **Build Interactive Visualizer**: Create `src/components/visualizer/<Topic>Visualizer.tsx` reusing control primitives.
4. **Populate Metadata**: Add metadata, multi-language snippets, complexity matrix, and summaries in `src/data/algorithms.ts`.
5. **Populate Learning Path with Hook**:
   * Add entry in `src/data/learningPath.ts` with `hook`, `superpower`, `tradeoff`, `mentalModel`, and `keyPrinciples`.
6. **Populate Educational Content**:
   * Add deep-dive documentation in `src/data/docs.ts`.
   * Add 5 quizzes in `src/data/quizzes.ts`.
   * Add 2 bug hunts in `src/data/bugHunt.ts`.
   * Add interview problems in `src/data/problemSolving.ts`.
7. **Wire Navigation**:
   * Add route mapping in `src/app/algorithms/[algorithm]/page.tsx` adhering to the **5-Step Flow** (`The Idea` → `In-Depth Theory` → `Watch It Work` → `Why It's Fast/Slow` → `Try It (Practice)`).
   * Update `src/components/navigation/TopicNavbarDropdown.tsx`.
8. **Run Verification & Quality Gate**:
   * `npx tsc --noEmit` (0 TypeScript errors)
   * `curl` check routes to ensure 200 OK.
   * Verify mobile and desktop viewports.
