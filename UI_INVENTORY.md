# AlgoHub — Full UI / Design Inventory Extraction

> **Document Type:** Design System Audit & UI Token Inventory  
> **Repository:** AlgoHub (`sorting-visualizer`)  
> **Status:** Production / Active Beta  
> **Scope:** Complete codebase inspection across all components, pages, styles, animations, layout primitives, and design tokens.

---

## 1. DESIGN TOKENS (SOURCE OF TRUTH)

### 1.1 CSS Custom Properties & Tailwind Token Bridge
The design system operates on a dual-layer token model: CSS Custom Properties defined in `src/app/globals.css` (lines 6–85) mapped dynamically to Tailwind utility classes via `tailwind.config.ts` (lines 12–55).

#### 1.1.1 Theme Surface & Semantic Colors
| Token Name | Tailwind Class | Light Mode Value (HSL / Hex) | Dark Mode Value (HSL / Hex) | Source Definition |
| :--- | :--- | :--- | :--- | :--- |
| `--background` | `bg-background` | `hsl(210, 40%, 98%)` (`#f8fafc`) | `hsl(222, 47%, 6%)` (`#080c14`) | `globals.css:7,47` |
| `--foreground` | `text-foreground` | `hsl(222, 47%, 11%)` (`#0f172a`) | `hsl(210, 40%, 98%)` (`#f8fafc`) | `globals.css:8,48` |
| `--card` | `bg-card` | `hsl(0, 0%, 100%)` (`#ffffff`) | `hsl(222, 47%, 10%)` (`#0e1523`) | `globals.css:10,50` |
| `--card-foreground` | `text-card-foreground` | `hsl(222, 47%, 11%)` (`#0f172a`) | `hsl(210, 40%, 98%)` (`#f8fafc`) | `globals.css:11,51` |
| `--popover` | `bg-popover` | `hsl(0, 0%, 100%)` (`#ffffff`) | `hsl(222, 47%, 10%)` (`#0e1523`) | `globals.css:13,53` |
| `--popover-foreground` | `text-popover-foreground` | `hsl(222, 47%, 11%)` (`#0f172a`) | `hsl(210, 40%, 98%)` (`#f8fafc`) | `globals.css:14,54` |
| `--primary` | `bg-primary`, `text-primary` | `hsl(221, 83%, 53%)` (`#2563eb`) | `hsl(199, 89%, 48%)` (`#38bdf8`) | `globals.css:16,56` |
| `--primary-foreground`| `text-primary-foreground` | `hsl(210, 40%, 98%)` (`#f8fafc`) | `hsl(222, 47%, 6%)` (`#080c14`) | `globals.css:17,57` |
| `--secondary` | `bg-secondary` | `hsl(210, 40%, 96%)` (`#f1f5f9`) | `hsl(222, 47%, 13%)` (`#121b2c`) | `globals.css:19,59` |
| `--secondary-foreground`| `text-secondary-foreground`| `hsl(222, 47%, 11%)` (`#0f172a`) | `hsl(210, 40%, 98%)` (`#f8fafc`) | `globals.css:20,60` |
| `--muted` | `bg-muted` | `hsl(210, 40%, 94%)` (`#e2e8f0`) | `hsl(222, 47%, 12%)` (`#101827`) | `globals.css:22,62` |
| `--muted-foreground` | `text-muted-foreground` | `hsl(215, 16%, 47%)` (`#64748b`) | `hsl(215, 20%, 65%)` (`#94a3b8`) | `globals.css:23,63` |
| `--accent` | `bg-accent` | `hsl(210, 40%, 92%)` (`#cbd5e1`) | `hsl(222, 47%, 15%)` (`#152033`) | `globals.css:25,65` |
| `--accent-foreground` | `text-accent-foreground` | `hsl(222, 47%, 11%)` (`#0f172a`) | `hsl(210, 40%, 98%)` (`#f8fafc`) | `globals.css:26,66` |
| `--destructive` | `bg-destructive` | `hsl(0, 84%, 60%)` (`#ef4444`) | `hsl(0, 84%, 60%)` (`#ef4444`) | `globals.css:28,68` |
| `--destructive-foreground`| `text-destructive-foreground`| `hsl(210, 40%, 98%)` (`#f8fafc`) | `hsl(210, 40%, 98%)` (`#f8fafc`) | `globals.css:29,69` |
| `--border` | `border-border` | `hsl(214, 32%, 91%)` (`#e2e8f0`) | `hsl(217, 33%, 17%)` (`#1e293b`) | `globals.css:31,71` |
| `--input` | `border-input` | `hsl(214, 32%, 91%)` (`#e2e8f0`) | `hsl(217, 33%, 17%)` (`#1e293b`) | `globals.css:32,72` |
| `--ring` | `ring-ring` | `hsl(221, 83%, 53%)` (`#2563eb`) | `hsl(199, 89%, 48%)` (`#38bdf8`) | `globals.css:33,73` |

#### 1.1.2 Canonical Visualizer Accents (Defined in CSS `:root`)
| Token Name | Light Mode Value | Dark Mode Value | Semantic Role | Source Definition |
| :--- | :--- | :--- | :--- | :--- |
| `--algo-cyan` | `#0284c7` (Sky 600) | `#38bdf8` (Sky 400) | Default bars, primary links, branding | `globals.css:38,78` |
| `--algo-amber` | `#d97706` (Amber 600) | `#fbbf24` (Amber 400) | Comparing state, execution step highlight | `globals.css:39,79` |
| `--algo-rose` | `#e11d48` (Rose 600) | `#f43f5e` (Rose 500) | Swapping state, bug hunt errors, worst-case | `globals.css:40,80` |
| `--algo-emerald` | `#059669` (Emerald 600) | `#10b981` (Emerald 500) | Sorted state, best-case, successful tests | `globals.css:41,81` |
| `--algo-purple` | `#9333ea` (Purple 600) | `#a855f7` (Purple 500) | Pivot element, recursion call stack | `globals.css:42,82` |
| `--algo-pink` | `#db2777` (Pink 600) | `#ec4899` (Pink 500) | String matching, auxiliary markers | `globals.css:43,83` |

---

### 1.2 Typography Tokens
Declared in `src/app/layout.tsx` (lines 5–15) via `next/font/google` and exposed through Tailwind `tailwind.config.ts` (lines 52–55).

| Token Variable | Font Family | Weights Loaded | Fallbacks | Source Definition |
| :--- | :--- | :--- | :--- | :--- |
| `--font-sans` (`font-sans`) | **Outfit** | 300, 400, 500, 600, 700, 800, 900 | `system-ui`, `sans-serif` | `layout.tsx:5-9`, `tailwind.config.ts:53` |
| `--font-mono` (`font-mono`) | **JetBrains Mono** | 400, 500, 600, 700, 800 | `monospace` | `layout.tsx:11-15`, `tailwind.config.ts:54` |

#### Typography Scale Used in Code
- `text-[9px]` (0.5625rem / 9px): Sub-bar indices, micro labels
- `text-[10px]` (0.625rem / 10px): Badges, telemetry counters, code block details
- `text-[11px]` (0.6875rem / 11px): Meta badges, timestamps, table subtitles
- `text-xs` (0.75rem / 12px): Standard button labels, tabs, form inputs, secondary info
- `text-sm` (0.875rem / 14px): Body copy, table content, card descriptions
- `text-base` (1rem / 16px): Primary article paragraphs, section headers
- `text-lg` (1.125rem / 18px): Subsection headers, card titles
- `text-xl` (1.25rem / 20px): Modal titles, feature headings
- `text-2xl` (1.5rem / 24px): Page headers, stat display values
- `text-3xl` / `text-4xl` (1.875rem–2.25rem): Lesson titles, dashboard hero headers
- `text-6xl` / `text-7xl` (3.75rem–4.5rem): Landing page hero headline (`Make Algorithms Make Sense`)

---

### 1.3 Border Radius Scale
Mapped from `--radius` in `src/app/globals.css:35,75` (`0.875rem` / `14px`) to Tailwind utilities in `tailwind.config.ts:47-51`:

| Token Name | Tailwind Class | Actual Computed Value | Primary Usage Context |
| :--- | :--- | :--- | :--- |
| `--radius-sm` | `rounded-sm` | `calc(0.875rem - 4px)` = `10px` | Small tags, inner micro badges |
| `--radius-md` | `rounded-md` | `calc(0.875rem - 2px)` = `12px` | Visualizer array bar caps, inputs |
| `--radius-lg` | `rounded-lg` | `0.875rem` = `14px` | Standard controls, nested cards |
| `rounded-xl` | `rounded-xl` (Tailwind) | `0.75rem` = `12px` | Primary button radius, dropdown items, tabs |
| `rounded-2xl` | `rounded-2xl` (Tailwind) | `1.0rem` = `16px` | Cards, modals, containers, visualizer frames |
| `rounded-3xl` | `rounded-3xl` (Tailwind) | `1.5rem` = `24px` | Hero showcase boxes, Stack/Queue canvas |
| `rounded-full`| `rounded-full` (Tailwind)| `9999px` | Badges, status pills, avatar initials |

---

### 1.4 Elevation, Glassmorphism & Shadow Tokens
Defined in `src/app/globals.css` (lines 123–145) and inline Tailwind arbitrary utilities:

| Token / Class | Exact CSS Definition | Purpose |
| :--- | :--- | :--- |
| `.dev-surface` (Light) | `background: hsl(var(--card) / 0.8); border: 1px solid hsl(var(--border)); box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05); backdrop-filter: blur(12px);` | Glass surface base (Light) |
| `.dark .dev-surface` | `background: hsl(var(--card) / 0.7); border: 1px solid hsl(var(--border) / 0.8); box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);` | Glass surface base (Dark) |
| `.dev-surface-hover:hover` | `border-color: rgba(56, 189, 248, 0.4); box-shadow: 0 12px 36px -8px rgba(56, 189, 248, 0.15); transform: translateY(-1px);` | Interactive card hover lift |
| `shadow-cyan-500/20` | `box-shadow: 0 10px 15px -3px rgba(6, 182, 212, 0.2), 0 4px 6px -4px rgba(6, 182, 212, 0.2)` | Primary CTA buttons |
| `shadow-[0_0_12px_rgba(56,189,248,0.15)]` | `box-shadow: 0 0 12px rgba(56, 189, 248, 0.15)` | Default visualizer array bar glow |
| `shadow-[0_0_20px_rgba(244,63,94,0.6)]` | `box-shadow: 0 0 20px rgba(244, 63, 94, 0.6)` | Swapping array bar active glow |
| `shadow-[0_0_16px_rgba(251,191,36,0.5)]` | `box-shadow: 0 0 16px rgba(251, 191, 36, 0.5)` | Comparing array bar active glow |
| `shadow-[0_0_14px_rgba(16,185,129,0.35)]` | `box-shadow: 0 0 14px rgba(16, 185, 129, 0.35)` | Sorted array bar settled glow |
| `shadow-[0_0_20px_rgba(168,85,247,0.5)]` | `box-shadow: 0 0 20px rgba(168, 85, 247, 0.5)` | Pivot array bar highlight glow |

---

## 2. COLOR USAGE MAP (TOKEN VS. INLINE / HARDCODED)

Below is the complete map of where colors bypass CSS semantic tokens and use inline arbitrary hex codes, custom RGB gradients, or non-tokenized palette overrides.

### 2.1 Hardcoded Hex & Background Color Map
| Hardcoded Color | File Location | Line Numbers | Intended Purpose / Component Role | Migration Recommendation |
| :--- | :--- | :--- | :--- | :--- |
| `#050811` | `src/app/layout.tsx` | Line 90 | Root body dark background (`dark:bg-[#050811]`) | Map to `--background` in `.dark` |
| `#070b12` | `src/app/notifications/page.tsx` | Lines 146, 156 | Deep navy background for Notifications page | Replace with `bg-background` |
| `#0a0f1d` | `src/components/docs/FormattedMarkdown.tsx` | Line 198 | Code block background container (`bg-[#0a0f1d]`) | Tokenize as `--code-background` |
| `#060305` | `src/app/admin/moderation/page.tsx`<br>`src/app/global-error.tsx` | Lines 325, 353<br>Line 25 | Dark Rose/Wine admin & error page background | Tokenize or unify with `--background` |
| `#0c0409` | `src/app/admin/moderation/page.tsx` | Lines 355, 540, 642, 647, 756, 764, 815, 823 | Dark Wine admin header, cards, table backgrounds | Replace with `bg-card` / `--admin-card` |
| `#12070e` | `src/app/admin/moderation/page.tsx` | Lines 393, 404, 415, 426, 437 | Stat summary widget cards background | Map to `bg-secondary` |
| `#14080e` | `src/app/admin/moderation/page.tsx`<br>`src/app/not-found.tsx`<br>`src/app/global-error.tsx` | Lines 381, 844<br>Line 59<br>Line 68 | Dark Wine buttons & inputs in error/admin flows | Replace with `bg-secondary` |
| `#0e0509` | `src/app/admin/moderation/page.tsx`<br>`src/app/not-found.tsx`<br>`src/app/global-error.tsx`<br>`src/components/auth/AuthButton.tsx` | Lines 517, 530<br>Line 14<br>Line 29<br>Line 133 | Auth dropdown modal & error modal background | Replace with `bg-card` |
| `#12070d` | `src/components/auth/AuthButton.tsx` | Line 122 | Logged-in user avatar trigger button background | Replace with `bg-card` / `bg-secondary` |
| `#060204` | `src/app/admin/moderation/page.tsx`<br>`src/app/not-found.tsx`<br>`src/app/global-error.tsx` | Lines 680, 796, 856, 863<br>Line 37<br>Line 48 | Nested error code / details boxes | Tokenize as `--code-background` |
| `#1a0712` | `src/app/admin/moderation/page.tsx` | Line 360 | Admin badge container background | Map to `bg-rose-500/15` |
| `#1f0c16` | `src/app/not-found.tsx`<br>`src/app/global-error.tsx` | Line 59<br>Line 68 | Hover state on error CTA buttons | Map to `hover:bg-rose-500/20` |
| `#06b6d4` | `src/components/visualizer/SpaceComplexityVisualizer.tsx` | Line 491 | Active memory cell border highlight | Map to `var(--algo-cyan)` |
| `rgba(100, 116, 139, 0.2)` | `src/components/visualizer/SpaceComplexityVisualizer.tsx` | Line 491 | Inactive memory cell border | Map to `hsl(var(--border))` |

### 2.2 Inline Arbitrary Gradients & Color Classes
- **Primary CTA Gradient:** `bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600` (used across Landing, Learn, Auth, Navbar).
- **Secondary CTA Gradient:** `bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400` (used in Visualizer start button).
- **Auth Join Beta Gradient:** `bg-gradient-to-r from-red-600 via-rose-600 to-amber-600` (used in AuthButton & Login).
- **Comparing Bar Gradient:** `from-amber-400 to-yellow-500` with shadow `shadow-[0_0_16px_rgba(251,191,36,0.5)]`.
- **Swapping Bar Gradient:** `from-rose-500 via-red-500 to-amber-500` with shadow `shadow-[0_0_20px_rgba(244,63,94,0.6)]`.
- **Sorted Bar Gradient:** `from-emerald-400 to-teal-500` with shadow `shadow-[0_0_14px_rgba(16,185,129,0.35)]`.
- **Pivot Bar Gradient:** `from-purple-500 via-violet-500 to-indigo-600` with shadow `shadow-[0_0_20px_rgba(168,85,247,0.5)]`.
- **Overwriting Bar Gradient:** `from-amber-500 via-orange-500 to-rose-500` with shadow `shadow-[0_0_16px_rgba(249,115,22,0.5)]`.

---

## 3. COMPONENT INVENTORY

### 3.1 Core UI Primitives

#### Primary & Variant Buttons
- **Files:** Embedded across `src/components/`, `src/app/`
- **Variants:**
  1. *Gradient Action Button (Primary CTA):* `rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-bold text-xs sm:text-sm px-6 py-3 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.03] active:scale-[0.98] transition-all`
  2. *Secondary Studio Control Button:* `rounded-xl border border-border bg-secondary/80 px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary hover:text-cyan-500 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed`
  3. *Ghost / Subtle Nav Button:* `rounded-xl border border-border bg-secondary/80 text-foreground px-3 py-1.5 text-xs font-semibold hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-secondary transition-all active:scale-95`
  4. *Destructive / Danger Button:* `rounded-xl border border-red-500/30 bg-red-500/10 text-red-500 hover:bg-red-500/20 px-3.5 py-1.5 text-xs font-bold transition-all active:scale-95`
  5. *Success / Resume Button:* `rounded-xl bg-emerald-500 text-slate-950 px-3.5 py-1.5 text-xs font-extrabold hover:bg-emerald-400 active:scale-95 shadow-sm`
- **States:** Hover, Focus-visible (`ring-2 ring-cyan-500/80 ring-offset-2`), Active (`scale-95`), Disabled (`opacity-40 cursor-not-allowed`).

#### Inputs & Forms
- **Files:** `src/app/auth/login/page.tsx`, `src/components/feedback/FeedbackModal.tsx`, `src/components/visualizer/VisualizerControls.tsx`
- **Visual Treatment:** `w-full rounded-xl border border-border bg-secondary/60 text-foreground px-3.5 py-2.5 text-xs font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all`
- **States:** Focus (`ring-2 ring-cyan-500/50 border-cyan-500`), Error (`border-red-500/60 ring-2 ring-red-500/30`), Disabled (`opacity-50`).

#### Cards & Surface Containers
- **Files:** `src/components/algorithms/ComplexityCard.tsx`, `src/components/landing/ValueProposition.tsx`
- **Visual Treatment:** `rounded-2xl border border-border bg-card p-5 sm:p-6 backdrop-blur-xl shadow-sm dark:shadow-xl transition-all`
- **Hover Treatment (`dev-surface-hover`):** `hover:border-cyan-500/40 hover:shadow-cyan-500/10 hover:-translate-y-0.5`

#### Badges & Status Pills
- **Visual Types:**
  - *Cyan Feature Pill:* `rounded-full border border-cyan-500/35 bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 px-3.5 py-1 text-xs font-mono font-bold`
  - *Emerald Verified Pill:* `rounded-md border border-emerald-500/30 bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 px-2 py-0.5 text-[10px] font-mono font-semibold`
  - *Amber Warning Pill:* `rounded-md border border-amber-500/30 bg-amber-500/15 text-amber-600 dark:text-amber-300 px-2 py-0.5 text-[10px] font-mono font-semibold`
  - *Purple Role Badge:* `rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.5 text-[10px] font-mono font-bold`

#### Modals & Dialogs
- **Files:** `src/components/feedback/FeedbackModal.tsx`, `src/components/feedback/BugReportModal.tsx`, `src/components/glossary/GlossaryModal.tsx`
- **Backdrop:** `fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md animate-in fade-in`
- **Dialog Surface:** `relative w-full max-w-lg rounded-3xl border border-border bg-card/95 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl animate-in zoom-in-95`
- **Close Button:** Top-right `p-1.5 rounded-xl border border-border bg-secondary text-muted-foreground hover:text-foreground`

#### Tooltips & Dropdowns
- **Files:** `src/app/page.tsx` (Navbar Dropdowns), `src/components/auth/AuthButton.tsx`, `src/components/algorithms/AlgorithmSelector.tsx`
- **Visual Treatment:** `absolute left-0/right-0 mt-2 rounded-2xl border border-border bg-card/95 p-2 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 z-50`

---

### 3.2 Navigation Components

#### Top Navigation Bar
- **File:** `src/app/page.tsx`, `src/app/learn/page.tsx`, `src/app/algorithms/[algorithm]/page.tsx`
- **Height & Sticky Layer:** `h-16 sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl`
- **Container Width:** `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between`
- **Desktop Links Group:** 3–4 primary grouped buttons (Learn Dropdown, Practice Dropdown, My Progress Dashboard, Course Material)
- **Mobile Menu Drawer:** `lg:hidden border-b border-border bg-card/95 p-4 space-y-3 backdrop-blur-xl animate-in slide-in-from-top-2`

#### Algorithm Selector / Category Switcher
- **File:** `src/components/algorithms/AlgorithmSelector.tsx`
- **Visual Treatment:** Collapsible categorized groups (Sorting, Data Structures, Complexity) with order numbers (`01`, `02`) and average time complexity badges (`O(n log n)`, `O(1)`).

#### Footer
- **File:** `src/app/page.tsx`, `src/app/learn/page.tsx`
- **Visual Treatment:** `border-t border-border/50 bg-background/90 py-10 text-xs text-muted-foreground` with university restricted beta pill (`GSTU CSE Beta`).

---

### 3.3 Visualizer-Specific Components

#### Array Bars Canvas (`src/components/visualizer/ArrayBars.tsx`)
- **Container:** `relative flex h-48 sm:h-56 w-full items-end justify-center gap-1 sm:gap-1.5 rounded-2xl border border-border bg-card p-3 sm:p-4 shadow-sm backdrop-blur-xl overflow-hidden`
- **Background Grid:** Precision linear gradient SVG dot grid (`bg-[size:1.5rem_1.5rem]`).
- **Individual Bars:** Width capped at `max-w-[48px]`, height dynamically scaled `8%` to `86%`. Rounded top caps (`rounded-t-lg`), glass highlight ribbon (`h-1.5 bg-white/40`).
- **Bar States:**
  - *Default:* `from-cyan-500 to-blue-600`
  - *Comparing:* `from-amber-400 to-yellow-500` with ring `ring-2 ring-amber-400/80`
  - *Swapping:* `from-rose-500 via-red-500 to-amber-500` with ring `ring-2 ring-rose-400/80`
  - *Sorted:* `from-emerald-400 to-teal-500` with border `border-emerald-300/70`
  - *Pivot:* `from-purple-500 via-violet-500 to-indigo-600` with bounce badge `bg-purple-500 text-white`
  - *Overwriting:* `from-amber-500 via-orange-500 to-rose-500` with bounce badge `bg-orange-500 text-white`
  - *Merge Split:* Left merge (`from-sky-400 to-blue-500`), Right merge (`from-fuchsia-400 to-purple-600`)

#### Code Viewer (`src/components/code/CodeViewer.tsx`)
- **Surface:** `flex flex-col h-full rounded-2xl border border-border bg-card backdrop-blur-xl shadow-sm overflow-hidden`
- **Window Controls:** 3 macOS-style dots (`bg-rose-500/80`, `bg-amber-500/80`, `bg-emerald-500/80`).
- **Active Line Highlight:** `bg-cyan-500/20 text-cyan-800 dark:text-cyan-100 border-l-4 border-cyan-500 shadow-sm font-bold`.
- **Copy Action:** Top-right `Copy / Copied!` toggle with green feedback.

#### Visualizer Control Bar (`src/components/visualizer/VisualizerControls.tsx`)
- **Container:** `flex flex-col gap-2.5 rounded-2xl border border-border bg-card p-3 sm:p-3.5 backdrop-blur-xl shadow-sm`
- **Buttons Included:** Start, Pause, Resume, Step, Reset, Random, Custom Input Drawer toggle.
- **Sliders:** Native range sliders styled with `accent-cyan-500`.

#### Operation Indicator & Telemetry (`src/components/visualizer/OperationIndicator.tsx`)
- **Pulsing Radar Dot:** `animate-ping h-2.5 w-2.5 bg-cyan-400` / `bg-emerald-400`.
- **Counters:** Comparisons badge (`bg-amber-500/10 text-amber-600`), Swaps badge (`bg-rose-500/10 text-rose-600`), Step progress badge (`bg-cyan-500/10 text-cyan-600`).
- **Live Text Box:** `rounded-xl border border-border/80 bg-secondary/60 px-3 py-1.5 font-mono text-xs`.

---

### 3.4 Data Structure Visualizers

#### Stack Visualizer (`src/components/visualizer/StackVisualizer.tsx`)
- **LIFO Well Container:** `w-64 border-x-4 border-b-4 border-cyan-500/40 rounded-b-2xl p-2 bg-secondary/30 flex flex-col gap-1.5 min-h-[300px] justify-end`.
- **Animated Stack Item:** Framer Motion spring layout (`stiffness: 350, damping: 25`).
- **Top Item Highlight:** `bg-cyan-500/15 border-cyan-500/50 text-cyan-600 dark:text-cyan-300` with `← TOP` arrow indicator.
- **Linked-List View Mode:** Dynamic chain connected via `ArrowDown` SVG icons and pointer addresses (`data: X`, `next: 0xPtr`).

#### Queue Visualizer (`src/components/visualizer/QueueVisualizer.tsx`)
- **FIFO Horizontal Tunnel Container:** `border-y-4 border-blue-500/40 rounded-xl p-3 bg-secondary/30 flex items-center justify-start gap-2 overflow-x-auto`.
- **Front & Rear Indicators:** Green `FRONT (Dequeue ←)` badge on left, Cyan `REAR (Enqueue →)` badge on right.
- **Circular Mode:** Visualizes index wrapping using `(rear + 1) % capacity`.

---

### 3.5 Dashboard & Analytics

#### Student Progress Dashboard (`src/app/dashboard/page.tsx`)
- **Score Progress Meter:** Circular SVG progress meter with weighted scoring calculation.
- **Per-Topic Grid Cards:** `ORDERED_TOPICS` cards with breakdowns of Quiz, Bug-Hunt, Docs Completion, and Predict Score.
- **Activity History Feed:** Chronological table displaying up to 15 recent attempts with timeago formatting and grade badges.

#### Mentor Portal (`src/app/mentor/page.tsx`)
- **Student Roster Table:** `rounded-2xl border border-border bg-card/95 overflow-hidden` with student IDs, departments, overall scores, and active topics.
- **Stuck Student Detection:** Filter flag highlighting students with low progress on active topics.
- **Broadcast Notice Modal:** Form for sending notifications to all students or specific cohorts.

#### Admin Moderation Console (`src/app/admin/moderation/page.tsx`)
- **Theme Palette:** Distinct dark wine / rose styling (`bg-[#060305]`, `border-rose-950/70`, `text-rose-300`).
- **Pending Beta Approvals Table:** Approve / Reject / Suspend user controls.
- **Feedback & Bug Report Feed:** Filterable issue list with status toggles.

---

### 3.6 Content & Practice Pages

#### Docs & Theory Articles (`src/components/docs/DocsPageContent.tsx`, `FormattedMarkdown.tsx`)
- **Markdown Renderer:** Custom AST parser in `FormattedMarkdown.tsx` supporting LaTeX math (`formatMathString`), code blocks (`<pre><code>`), syntax copying, and tables.
- **Bangla Note Accordion (`src/components/docs/BanglaNote.tsx`):** `rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 sm:p-5 text-emerald-800 dark:text-emerald-200` with dual English/Bangla topic summaries.
- **Lesson Completion Bar:** Sticky breadcrumbs with `Mark as Completed` button synchronizing to cloud progress.

#### Course Material & Problem Bank (`src/app/course-material/page.tsx`)
- **Filters:** Custom dropdowns for Chapters (Chapter 2, Chapter 3), Content Type (Problems, Topics), and Difficulty (Easy, Medium, Hard).
- **Interactive Simulation Labs:** Dynamically imported mini visualizers embedded directly inside textbook problems:
  - `MaxElementComplexityVisualizer.tsx`
  - `LoopComplexityVisualizer.tsx`
  - `StringOperationsVisualizer.tsx`
- **Solution Reveal Drawer:** Expandable solution toggle with syntax-highlighted C++ code.

#### Practice Suite: Bug Hunt, Quiz, Predict Next, Problem Solving
- **Bug Hunt (`src/components/challenge/BugHunt.tsx`):** Interactive code line selector, inline error correction input, penalty scoring (-10 pts per failed attempt), and live preview array.
- **Quiz (`src/components/practice/Quiz.tsx`):** Multi-choice question card with instant green/red feedback, explanation box, and confetti trigger upon 100% score.
- **Predict Next (`src/components/practice/PredictNext.tsx`):** Step-by-step prediction challenge asking user to anticipate next algorithm operation before it occurs.

---

### 3.7 Landing Page Specific Components

#### Hero Section (`src/app/page.tsx`, `src/components/landing/HeroAnimation.tsx`)
- **Full-Viewport Height:** `min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center`
- **Background Ambient Glow:** `absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[400px] bg-gradient-to-tr from-cyan-500/15 via-blue-600/10 to-purple-600/10 blur-[130px] pointer-events-none`
- **Hero Badge:** `rounded-full border border-cyan-500/35 bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 font-mono text-xs sm:text-sm font-bold`
- **Headline:** `Make Algorithms Make Sense.` with gradient text `bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent`.
- **4-Stage Slogan:** `See them. Break them. Fix them. Master them.` with color-coded words (Cyan, Rose, Amber, Emerald).
- **Live Miniature Visualizer:** `HeroAnimation.tsx` executing an infinite loop bubble sort with mini bars.

#### 4-Stage Learning Journey (`src/components/landing/LearningJourney.tsx`)
- **Card 01 (Learn):** Cyan theme (`border-cyan-500/30 bg-cyan-500/5`), Book icon, theory preview.
- **Card 02 (Visualize):** Blue theme (`border-blue-500/30 bg-blue-500/5`), Layers icon, array bars animation.
- **Card 03 (Debug):** Purple theme (`border-purple-500/30 bg-purple-500/5`), Terminal icon, live variable inspector.
- **Card 04 (Practice):** Rose theme (`border-rose-500/30 bg-rose-500/5`), Bug icon, bug-hunt sandbox.

---

### 3.8 Authentication Pages

#### Login / Registration (`src/app/auth/login/page.tsx`)
- **Form Card:** `max-w-md w-full rounded-3xl border border-border bg-card/90 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl`
- **1-Click Recruiter Demo Access Banner:** Cyan fast-track banner allowing one-click guest evaluation (`demo@algohub.dev`).
- **Tabs:** Switcher between `Sign In` and `Join Beta (Register)` with email domain validator.

#### Status Pages (`pending`, `rejected`, `suspended`, `reset-password`)
- **Pending (`src/app/auth/pending/page.tsx`):** Amber theme (`border-amber-500/30 bg-amber-500/10`), clock icon, status check poll.
- **Rejected (`src/app/auth/rejected/page.tsx`):** Red theme (`border-red-500/30 bg-red-500/10`), alert icon.
- **Suspended (`src/app/auth/suspended/page.tsx`):** Rose theme (`border-rose-500/30 bg-rose-500/10`), moderation appeal link.
- **Password Reset (`src/app/auth/reset-password/page.tsx`):** New password form with password strength indicator.

---

## 4. ANIMATION INVENTORY

| Animation / Transition | Trigger | Mechanism / Library | Animated Properties | Duration & Easing | Location / Component |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Array Bar Value Transition** | State change (step / play) | Pure CSS transitions | `height`, `transform`, `background-color`, `border-color`, `box-shadow` | `150ms ease` | `src/components/visualizer/ArrayBars.tsx` |
| **Active Bar Scale Pop** | Swap / Compare active | CSS transform | `scale(1.05)` on swap, `scale(1.02)` on compare | `150ms ease` | `src/components/visualizer/ArrayBars.tsx` |
| **Hero Continuous Sort Loop** | Component mount / idle | React state + async loop | Array bar heights, active indices, sorted indices | Step delays `80ms–95ms` | `src/components/landing/HeroAnimation.tsx` |
| **Stack Push Spring** | Push operation | Framer Motion `<motion.div>` | `opacity: 0 -> 1`, `y: -40 -> 0`, `scale: 0.8 -> 1` | `type: "spring", stiffness: 350, damping: 25` | `src/components/visualizer/StackVisualizer.tsx` |
| **Stack Pop Exit** | Pop operation | Framer Motion `<AnimatePresence>` | `opacity: 1 -> 0`, `x: 0 -> 80`, `scale: 1 -> 0.8` | `type: "spring", stiffness: 350, damping: 25` | `src/components/visualizer/StackVisualizer.tsx` |
| **Queue Enqueue / Dequeue** | Enqueue / Dequeue | Framer Motion `<motion.div>` | `opacity`, `x: 40 -> 0` (enqueue), `x: 0 -> -40` (dequeue) | `type: "spring", stiffness: 300, damping: 25` | `src/components/visualizer/QueueVisualizer.tsx` |
| **Sorted Celebration Confetti** | Visualizer finish / 100% Quiz | `canvas-confetti` JS library | Particle coordinates, spread angle, gravity, decay | `particleCount: 80–100, spread: 70–80` | `SortingVisualizer.tsx`, `Quiz.tsx`, `BugHunt.tsx` |
| **Button Compare Shimmer Pulse** | Hover | CSS `@keyframes comparePulse` | `box-shadow: 0 0 0 6px rgba(251,191,36,0)` | `1.2s infinite ease-in-out` | `globals.css:148-158`, `VisualizerControls.tsx` |
| **Sorted Settle Wave** | Settle completion | CSS `@keyframes sortedWave` | `background-position: 0% 50% -> 100% 50%` | `2s ease infinite` | `globals.css:175-191` |
| **Telemetry Radar Pulse** | Live execution | CSS `animate-ping` | `transform: scale(2)`, `opacity: 0.75 -> 0` | `1s cubic-bezier(0, 0, 0.2, 1) infinite` | `src/components/visualizer/OperationIndicator.tsx` |
| **Dropdown Slide In** | Dropdown toggle | Tailwind `animate-in` | `opacity: 0 -> 1`, `translateY: -8px -> 0px` | `150ms ease-out` | `src/app/page.tsx`, `src/components/auth/AuthButton.tsx` |
| **Reduced Motion Override** | OS Preference | CSS Media Query `@media (prefers-reduced-motion)` | All durations forced to `0.01ms !important` | Instant | `globals.css:201-210`, `useReducedMotion.ts` |

---

## 5. LAYOUT PATTERNS & GRID SYSTEMS

### 5.1 Responsive Breakpoint Strategy
AlgoHub uses standard Tailwind breakpoints with customized padding and grid column structures:
- **Mobile (`< 640px` / default):** Single column layouts (`grid-cols-1`), compact navbar with hamburger slide-out, hidden text labels on buttons, stacked metrics cards.
- **Tablet (`sm: 640px`):** 2-column grids (`sm:grid-cols-2`), expanded button labels, full typography scale.
- **Desktop (`lg: 1024px`):** Multi-column studio workspaces (`lg:grid-cols-12` split: 7 cols visualizer, 5 cols code viewer; 8 cols stack canvas, 4 cols memory table), sticky sidebar navigation.
- **Wide Desktop (`max-w-7xl` / `1280px`):** Centered max-width boundaries on Landing, Learn, Visualizer, Dashboard.

### 5.2 Main Page Layout Structures
1. **Studio / Workspace Layout (`/algorithms/[algorithm]`, `/visualizer`):**
   - Header: Sticky Breadcrumbs + Quick Topic Dropdown + Theme Toggle.
   - Stepper Navigation: 6-tab horizontal stepper (`The Idea`, `Watch It Work`, `The Full Picture`, `Read the Code`, `Why It's Fast/Slow`, `Try It`).
   - Split Stage: 7-column interactive canvas (Array bars, controls, telemetry, live bounds) + 5-column sticky C++ code viewer and complexity card.
2. **Reading / Documentation Layout (`/docs`, `/docs/[...slug]`):**
   - Centered container (`max-w-4xl mx-auto`), collapsible sidebar drawer on desktop, breadcrumb header, Markdown body with embedded diagrams and Bangla note boxes.
3. **Curriculum / Roadmap Layout (`/learn`):**
   - Centered container (`max-w-5xl mx-auto`), header mastery bar, filter pills, vertical timeline line (`before:w-0.5 before:bg-border`) with connected step cards.
4. **Dashboard Layout (`/dashboard`, `/mentor`):**
   - Summary stat cards grid (3–4 columns), analytics chart canvas, responsive data tables with horizontal scroll wrap on mobile.

---

## 6. INCONSISTENCIES TO FLAG (FOR DESIGN SYSTEM MIGRATION)

During this audit, the following specific design inconsistencies, color clashes, and legacy variations were identified across the codebase:

### 6.1 Theme & Color Palette Discrepancies
1. **Admin Console & Error Pages Use an Unconnected Dark Wine/Rose Palette:**
   - While the rest of the application uses standard Slate/Navy dark tokens (`--background: 222 47% 6%`), the Admin Moderation console (`src/app/admin/moderation/page.tsx`), 404 page (`src/app/not-found.tsx`), and Global Error page (`src/app/global-error.tsx`) use hardcoded dark rose backgrounds (`bg-[#060305]`, `bg-[#0c0409]`, `border-rose-950/70`, `bg-[#12070e]`).
   - *Impact:* The admin area and error pages feel like an entirely separate application rather than sharing the AlgoHub design tokens.

2. **Three Different Deep Navy Backgrounds in Dark Mode:**
   - Root Layout: `dark:bg-[#050811]`
   - Notifications Page: `bg-[#070b12]`
   - Code Block Container: `bg-[#0a0f1d]`
   - CSS Token `--background`: `hsl(222, 47%, 6%)` (which is `#080c14`)
   - *Impact:* Subtle background color banding when moving between notifications, standard pages, and code viewers.

3. **Inconsistent Primary Accent Tokens (Sky vs. Cyan):**
   - In `globals.css:56`, `--primary` is defined as Sky Cyan `199 89% 48%` (`#38bdf8`), but many components directly hardcode Tailwind `cyan-500` (`#06b6d4`), `blue-600` (`#2563eb`), or `indigo-600` (`#4f46e5`).

### 6.2 Button Styling & Radius Inconsistencies
1. **Mismatched CTA Gradients:**
   - Landing Page Primary CTA: `bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600`
   - Visualizer Controls Start Button: `bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400`
   - Auth Join Beta Button: `bg-gradient-to-r from-red-600 via-rose-600 to-amber-600`
   - *Impact:* 3 distinct multi-color gradient formulas used for primary action buttons.

2. **Mixed Border Radius Conventions:**
   - Buttons mix `rounded-xl` (12px), `rounded-2xl` (16px), and `rounded-lg` (14px).
   - Cards mix `rounded-2xl` (16px) and `rounded-3xl` (24px) without clear hierarchy rules.

### 6.3 Typography & Code Highlighting Inconsistencies
1. **Code Highlighting Approach:**
   - `src/components/code/CodeViewer.tsx` uses custom line splitting with manual active-line styling.
   - `src/components/docs/FormattedMarkdown.tsx` uses custom regex tokenizer without Prism classes.
   - `src/components/challenge/BugHunt.tsx` uses its own separate interactive line list with custom click handlers.
   - *Impact:* Syntax styling and line numbers look slightly different between the visualizer debugger, the documentation, and the bug-hunt challenge.

2. **Font Size Inconsistency in Badges:**
   - Badges alternate between `text-[9px]`, `text-[10px]`, `text-[11px]`, and `text-xs` across different components for the same metadata roles.

---

## 7. META-SUMMARY & PRIORITY MIGRATION RECOMMENDATIONS

### Total Components Documented
- **Total Reusable Components Audited:** 44 components (across `src/components/`)
- **Total Application Pages Audited:** 17 routes (across `src/app/`)
- **Total Diagrams & Visualizers Audited:** 14 interactive engines & SVG diagrams

### Top 4 High-Impact Areas for Future Redesign Migration

1. **Unify Admin, Auth, and Error Pages with Core Surface Tokens:**
   - Replace the hardcoded `#060305` / `#0c0409` wine palette in Admin and Error pages with the central `hsl(var(--background))` and `hsl(var(--card))` tokens. Use semantic variant flags (e.g., `data-surface="admin"`) if a distinct badge accent is desired.

2. **Standardize Button Primitives into a Unified `<Button />` Component:**
   - Consolidate the 5+ ad-hoc button gradient styles into a single reusable component with explicit variants: `variant="gradient-primary"`, `variant="studio"`, `variant="ghost"`, `variant="destructive"`, `variant="success"`.

3. **Consolidate Code Viewer & Syntax Highlighting:**
   - Create a unified syntax-highlighting primitive that powers `CodeViewer`, `FormattedMarkdown` code blocks, and `BugHunt` code inspection so token colors, line numbers, and copy actions are 100% consistent across the platform.

4. **Eliminate Hardcoded Hex Backgrounds:**
   - Replace `#050811`, `#070b12`, `#0a0f1d`, and `#12070d` with CSS variables `--background`, `--card`, and `--code-surface` in `globals.css` so theme changes propagate instantly without hunting down inline hex values.
