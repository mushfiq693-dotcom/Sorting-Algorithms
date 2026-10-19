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
* **No Text Analogy Boxes**: Text analogies (`💡 Analogy: ...`) are **completely removed from the UI** across all current and future topics. In the roadmap (`/learn`), the vacant space is elevated with a dedicated topic-specific micro-animation preview (`RoadmapTopicAnimation.tsx`).

#### 📐 Permanent Pedagogical Tier Framework (Beginner-First Ordering Standard)
All existing and future topics in AlgoHub strictly follow this 8-tier pedagogical hierarchy to guarantee zero cognitive friction for newcomers:
1. **Tier 1: Foundations & Contiguous Memory** (Order `1`..): Array (Static & Dynamic), Vector, Matrix.
2. **Tier 2: Elementary Linear Searching** (Order `2`..): Linear Search (zero preconditions, single scan).
3. **Tier 3: Asymptotic Complexity Analysis** (Order `3`..): Time Complexity, Space Complexity ($O(1)$, $O(n)$, $O(n^2)$ fundamentals).
4. **Tier 4: Sub-Linear / Divide Searching** (Order `5`..): Binary Search, Jump Search (logarithmic scaling, sorted data precondition).
5. **Tier 5: Elementary Abstract Data Structures** (Order `6`..): Stack (LIFO), Queue (FIFO), Deque.
6. **Tier 6: Non-Contiguous Pointer-Linked Structures** (Order `8`..): Singly Linked List, Doubly Linked List, Circular Linked List.
7. **Tier 7: Elementary Quadratic Sorting** (Order `9`..): Bubble Sort (adjacent swaps), Selection Sort (find minimum), Insertion Sort (cards in hand).
8. **Tier 8: Advanced Divide-and-Conquer Sorting** (Order `12`..): Merge Sort (stable $O(n \log n)$), Quick Sort (pivot partitioning), Heap Sort.
9. **Tier 9+: Hierarchical & Non-Linear Structures (Future Expansion)**: Binary Trees, BST, AVL Trees, Graphs, Hash Tables, Dynamic Programming.

---

## 3. Visualizer & Engine Standards

### 3.1 Engine Design (`src/algorithms/<topic>.ts`)
* **Decoupled Logic**: The algorithm or data structure logic runs independently of React render loops.
* **State Snapshots (`Step`)**: Each operation generates a sequence of immutable state frames.
* **Step Metadata**:
  * `description`: Plain-English explanation of what this micro-step achieves.
  * `codeLine`: Active line index corresponding to the code panel.
  * `highlights`: Indices, pointers, or nodes currently under inspection, mutation, or shift.

### 3.2 Signature Visualizer Studio Standard (`src/components/visualizer/<Topic>Visualizer.tsx`)
All topic visualizers in AlgoHub strictly implement the **Signature 2-Column Studio Grid Layout** (`max-w-7xl mx-auto flex flex-col gap-4` containing `grid grid-cols-1 lg:grid-cols-12 gap-4 items-start`):

#### 1. Left Column — Visual Stage & Telemetry (`lg:col-span-7 flex flex-col gap-3`)
* **Interactive Canvas / Visual Chamber**: Topic-specific visual animation stage (bars, nodes, memory blocks, stack well, circular queue, etc.).
* **Execution Telemetry Box**:
  * Header with pulsing cyan live indicator (`animate-ping`), uppercase `EXECUTION TELEMETRY`, and metric status badges (Comp, Swaps, Steps, Size, Mode).
  * Dynamic single-line explanation box with pulsing dot or status icon.
* **Studio Control Bar**:
  * Operation action buttons / tabs (Start, Pause, Step, Reset, Random, Custom Input, Push/Pop, Enqueue/Dequeue).
  * Smooth delay/speed and size range sliders with precise labels.

> 🚫 **Strict Visualizer Prohibitions (Zero Clutter Policy)**:
> 1. **No Color Legend Rows**: Chip rows labeled `Legend: ■ Default ■ Comparing...` are **strictly prohibited** across all visualizers. Visual states are intuitive through direct element colors and telemetry descriptions.
> 2. **No Buffer Footprint / Capacity Strips**: Strips such as `Valid (0..4) Free Capacity Buffer Footprint: 32 Bytes` or similar are **strictly excluded**.
> 3. **No Live Big-O Bounds Cards / Widgets**: The `LIVE BIG-O BOUNDS • N = ...` card and its 4-pill metric grid are **strictly eliminated from the visualizer stage**. Asymptotic complexity analysis is already fully articulated in **Step 4: Why It's Fast/Slow**. Keeping the visualizer free of complexity widgets grants maximum vertical focus to the animation canvas and controls.

#### 2. Right Column — Synchronized Code & Invariant Inspector (`lg:col-span-5 flex flex-col gap-3 lg:sticky lg:top-20`)
* **Synchronized C++ `CodeViewer`**:
  * macOS window controls (`🔴 🟡 🟢`), `</> <Topic>.cpp` title, copy button, line numbers, and active step line highlighting.
  * Monospaced footer status `>_ C++17 Reference Source`.
* **State / Memory Inspector & Invariant Card**:
  * Mathematical invariant guarantee card (e.g., Memory Address Formula, LIFO/FIFO Principle, Logarithmic Elimination Invariant).
  * Compact live register / memory table (Hex addresses, slot allocation states, cache spatial locality).

---

## 4. Topic Walkthrough Flow (Standard 5-Step Architecture)

To maximize engagement, retain focus within the app, and eliminate visual clutter, all topic pages feature a focused **5-step progression** (both for existing and all future topics):

```
Step 1: The Idea           -> Curiosity Spark ("The Big Question • Why This Matters" with generous question spacing),
                              3 Badges (Superpower, Tradeoff, Mental Model),
                              Plain English Explanation, Bengali Accordion ("বাংলায় বুঝি")
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
> 4. **Minimalistic The Idea**: Step 1 focuses on high-impact intuition (Hook with generous question spacing, 3 Badges, Plain English, and Bengali Note). The redundant "In-Depth Theoretical Deep Dive" gateway banner, principle bullet grids, and analogy blocks are excluded to maintain extreme clarity and eliminate duplicate CTAs.
> 5. **Practice Tab Integrity**: The Practice tab (`Step 5`) is dedicated solely to 3 core interactive learning modalities: **1. Knowledge Quiz**, **2. Bug-Hunt**, and **3. Problem Solving**. Live Debugger and Predict Next have been **completely eliminated** across all topics for a streamlined, focused practice workflow.
> 6. **Clean Studio Visualizer Layout (Zero Clutter)**: All topic visualizers must follow the signature 7/5 studio workspace standard (Visual stage, telemetry explanation box, and studio controls in the left 7 cols; sticky C++ CodeViewer and memory/invariant inspector in the right 5 cols). **Color legend rows, buffer capacity strips, and Live Big-O Bounds cards are strictly prohibited** across all existing and upcoming visualizers.

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

### 🔄 [2026-10-11] Visualizer De-Cluttering & Elimination of Redundant Elements
* **Removed from ALL Visualizers (Existing & Upcoming)**:
  * **Color Legend Bars**: Completely removed all `Legend: ...` chip rows across `ArrayVisualizer`, `SortingVisualizer` (`OperationIndicator`), `LinearSearchVisualizer`, `BinarySearchVisualizer`, `StackVisualizer`, `QueueVisualizer`, `LinkedListVisualizer`, `TimeComplexityVisualizer`, and `SpaceComplexityVisualizer`.
  * **Buffer Capacity & Memory Footprint Strips**: Removed `Buffer Footprint` strips and non-contiguous memory invariant bars.
  * **Live Big-O Bounds Cards**: Completely eliminated the `LIVE BIG-O BOUNDS • N = ...` card and 4-pill metric grid from all visualizer components. Asymptotic bounds belong exclusively in **Step 4: Why It's Fast/Slow**.
* **Visualizer Studio Integrity**: Retained a clean, high-impact workspace: Visual Canvas + Dynamic Telemetry + Controls (Left 7 cols) & Synchronized C++ CodeViewer + Invariant Inspector (Right 5 cols).

### 🔄 [2026-10-11] Signature Studio Visualizer & In-Depth Section Layout Standardization
* **Unified Signature 2-Column Studio Layout Across All Topics**:
  * Standardized all visualizers (`ArrayVisualizer`, `SortingVisualizer`, `LinearSearchVisualizer`, `BinarySearchVisualizer`, `StackVisualizer`, `QueueVisualizer`, `LinkedListVisualizer`, `TimeComplexityVisualizer`, `SpaceComplexityVisualizer`) to the AlgoHub signature pattern:
    * **Left Column (7 cols)**: Visual Canvas, Execution Telemetry, studio control bar with sliders & operations.
    * **Right Column (5 cols, sticky)**: Synchronized C++ `CodeViewer` (`🔴 🟡 🟢`), line tracker, `>_ C++17 Reference Source`, followed by live memory/register table or invariant guarantee card.
* **In-Depth Theory Section (Step 2) Reordered**:
  * Reordered Step 2 so that **Comprehensive Docs & Theory** (`FormattedMarkdown`) appears first.
  * Placed **The Full Picture Architectural Diagram** (`AlgorithmDiagram`) at the bottom of the section.
  * **Removed C++ Code from Diagrams**: Stripped C++ CodeViewer block from `AlgorithmDiagram.tsx`, keeping it as a focused visual infographic.
* **Streamlined The Idea Section (Step 1)**:
  * Removed redundant takeaways and duplicate analogy cards, keeping high-engagement spark hook, 3 superpower/tradeoff/mental-model badges, and Bengali explanation accordion.
* **Practice Tab Integrity (Step 5)**:
  * Removed `Live Debugger` and `Predict Next` tabs across all topics.
  * Standardized the practice suite strictly on the 3 core essentials: **1. Knowledge Quiz**, **2. Bug-Hunt**, and **3. Problem Solving**.

### 🔄 [2026-10-11] 2-Step Hierarchical Visualizer Explorer & Category Isolation Standard
* **New Unified Component**: `src/components/explore/TopicCategoryHub.tsx`.
* **Visual Standards (Matching User Signature Design)**:
  * Hero Subtitle: *"Watch algorithms come to life. Press play, slow it down, or step through one operation at a time - then learn the code with free interactive lessons."*
  * **Strictly Existing 4 Main Categories (No Placeholder Fillers)**:
    1. **Sorting**: Indigo/Blue squircle icon (`BarChart3`), 5 visualizations.
    2. **Data Structures**: Forest/Emerald squircle icon (`Network`), 4 visualizations.
    3. **Searching**: Rust/Orange squircle icon (`Search`), 2 visualizations.
    4. **Core Concepts / Complexity**: Violet/Purple squircle icon (`Layers`), 2 visualizations.
  * **Main Category Cards**: Clean tiles without description paragraphs. Each card features a prominent glowing themed icon container, bold title, visualization count badge, and a smooth `Explore Topics →` hover indicator.
* **Explore Visualizer Route (`/visualizer`) 2-Step Hierarchy**:
  * **Step 1 (Main Landing `/visualizer`)**: Shows **ONLY the 4 Main Category Cards**. Zero topic lists, zero canvas, zero clutter!
  * **Step 2 (Dedicated Category Interface `/visualizer?category=[cat]`)**:
    * **Category Isolation Policy**: When viewing a selected category (e.g. `Sorting`), the interface displays **ONLY that category's sub-topics**. All switcher tabs and mentions of other main categories (`Data Structures`, `Searching`, `Core Concepts`) are **completely removed** to maintain absolute focus.
    * **Outer Box Removed**: The heavy enclosing wrapper box/border around the category interface has been removed. The header, cards, and comparison table now sit directly on the page layout with clean breathing room.
    * **Sub-Topic Card Standard (Full-Box CTA)**:
      * **Badges Removed**: `#01` order number and `Start Here` / difficulty tags have been **completely removed** from all sub-topic cards for an ultra-clean, modern aesthetic.
      * **Punchy Single-Line Description**: Concise descriptions matching user specifications (e.g. "Watch insertion sort build a sorted section one element at a time.").
      * **Topic-Relevant Modern Icons**: Each sub-topic features an attractive, topic-relevant modern icon in a themed squircle (`ArrowLeftRight`, `Target`, `SlidersHorizontal`, `GitMerge`, `Zap`, `LayoutGrid`, `Layers`, `ListStart`, `Link2`, `ScanLine`, `Focus`, `Timer`, `Cpu`).
      * **No Time/Space Pills in Cards**: Removed `Time` & `Space` badge pills from individual cards. Complexity metrics are consolidated cleanly in the dedicated comparison table below.
      * **Full-Box CTA (No Separate Launch Button)**: The separate `Launch Visualizer` button is removed. The entire card itself is a clickable CTA (`<Link href="...">`) with smooth hover interactions (`ChevronRight` indicator, border highlight, squircle micro-scale). Clicking anywhere on the card launches that topic's visualizer.
    * **Dedicated Category Comparison Tables Across All Categories**:
      * Directly below the sub-topic cards with generous visual breathing room (`mt-16 sm:mt-20 lg:mt-24`), each category features a dedicated, responsive comparison table:
        * **Sorting**: *Sorting comparison* (Algorithm, Best, Average, Worst, Space, Stability).
        * **Data Structures**: *Data structures comparison* (Data Structure, Access, Search, Insertion, Deletion, Space).
        * **Searching**: *Searching comparison* (Algorithm, Best, Average, Worst, Space, Pre-sorted Required).
        * **Core Concepts**: *Core complexity comparison* (Order, Classification, Growth Rate, Examples).
      * Clicking any topic name in these tables navigates directly to its interactive studio.
  * **Step 3 (Specific Visualizer Studio `/visualizer?algo=[id]`)**:
    * Launches the focused signature studio with algorithm title, telemetry, visual stage, and synchronized C++ CodeViewer.
    * **Dynamic Header Action Bar**:
      * **`← Back to [Category]` CTA**: Dedicated sleek back CTA dynamically linking back to its category interface (e.g. `Back to Sorting` → `/visualizer?category=sorting`, `Back to Data Structures` → `/visualizer?category=data-structure`, `Back to Searching` → `/visualizer?category=searching`, `Back to Core Concepts` → `/visualizer?category=complexity`).
      * **`In-Depth Lesson →` CTA**: Signature brass CTA leading to the comprehensive educational curriculum (`/algorithms/[algo]`).
    * Generic/redundant clutter buttons (`All Categories`, `Back to Topics` dropdown), navbar dropdowns, and header pill badges (`AlgoHub Interactive Studio`, `Interactive Execution Stage`) are permanently eliminated in favor of an ultra-clean, focused workspace.
    * **Compact Scrollable C++ Code Box Standard**:
      * The C++ CodeViewer box across all topics is height-constrained (`h-[270px] sm:h-[290px] lg:h-[310px]` when companion cards exist, or `h-[370px] sm:h-[400px] lg:h-[430px]` for standalone sorting) so the entire visualizer studio fits within a single screen fold on standard desktop viewports without requiring page scrolling.
      * Inside `CodeViewer`, the code body is fully scrollable vertically and horizontally (`min-h-0 overflow-y-auto overflow-x-auto`) with custom wood-grain scrollbars.
      * The active execution line automatically scrolls smoothly into view during visualization step/playback.
* **Roadmap Route (`/learn`) Behavior**:
  * Uses the 4 Main Category Cards as dynamic filters for the learning roadmap.
  * Clicking an active category card toggles it off back to "all topics" smoothly.

### 🔄 [2026-10-12] Beginner-First Learning Path & Roadmap Standardization
* **Hero UI Redesigned for Beginner Empathy**:
  * Added prominent glowing pill badge: `🌱 Beginner-First Structured Roadmap • Start From Scratch`.
  * Ultra-clean typography and focused introduction without redundant chip clutter.
* **Clutter Elimination**:
  * **Removed Subtitle Paragraph**: Permanently removed *"Watch algorithms come to life. Press play, slow it down..."* from `/learn`.
  * **Removed Duplicate Pill Buttons**: Removed duplicate category pills (`All Topics (13)`, `Sorting (5)`, etc.) below the category cards.
* **100% Beginner-First Topic Sequence**:
  * Sorted all 13 topics in strict pedagogical progression from day-one memory layouts to divide-and-conquer sorting:
    `Array (01)` → `Linear Search (02)` → `Time Complexity (03)` → `Space Complexity (04)` → `Binary Search (05)` → `Stack (06)` → `Queue (07)` → `Linked List (08)` → `Bubble Sort (09)` → `Selection Sort (10)` → `Insertion Sort (11)` → `Merge Sort (12)` → `Quick Sort (13)`.
  * Synchronized across `LEARNING_PATH`, `ALL_TOPICS`, and `TopicNavbarDropdown`.

### 🔄 [2026-10-14] Step 1 UX Polish: The Big Question Spacing & Gateway Banner Elimination
* **"The Big Question • Why This Matters" Spacing**:
  * Increased vertical spacing between the uppercase eyebrow label and the curiosity question text (`space-y-2.5 sm:space-y-3` with `pt-0.5`).
  * Adjusted question typography to `leading-relaxed` for enhanced readability across multi-line curiosity hooks.
* **Elimination of Redundant "In-Depth Theoretical Deep Dive" Gateway**:
  * Permanently removed the duplicate middle banner (`In-Depth Theoretical Deep Dive` / `Explore In-Depth Theory (Step 2) →`) from Step 1 across all topics.
  * Standardized single forward navigation through the dedicated footer CTA button (`Next: In-Depth Theory →`).

---

## 7. Step-by-Step Implementation Recipe for New Topics

When implementing subsequent topics from the roadmap (e.g., `String`, `Deque`, `Hash Table`), follow these verified steps in order:

1. **Register Type & IDs**: Add topic slug to `AlgorithmId` in `src/types/sorting.ts`.
2. **Implement Core Engine**: Create `src/algorithms/<topic>.ts` producing state snapshots.
3. **Build Interactive Visualizer**: Create `src/components/visualizer/<Topic>Visualizer.tsx` reusing control primitives.
4. **Populate Metadata**: Add metadata, multi-language snippets, complexity matrix, and summaries in `src/data/algorithms.ts`.
5. **Populate Learning Path in Correct Pedagogical Tier**:
   * Determine the topic's Pedagogical Tier (1 through 9+ as defined in Section 2.2).
   * Insert into `src/data/learningPath.ts` at the appropriate tier location with `order`, `hook`, `superpower`, `tradeoff`, `mentalModel`, and `keyPrinciples`.
   * Re-index subsequent `order` numbers to keep the beginner sequence unbroken.
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
