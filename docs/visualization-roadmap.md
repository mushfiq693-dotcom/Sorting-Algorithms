# AlgoHub Visualization Roadmap & Progress Tracker

> **Core Philosophy:** "Don't just learn Algorithms. See them. Break them. Fix them. Master them."

This roadmap tracks the long-term sequence of production-quality Data Structure and Algorithm visualization modules built for AlgoHub.

---

## 📌 Master Implementation Status

### Previously Completed Topics (Protected Reference)
- [x] **Time Complexity** (`/algorithms/time-complexity`)
- [x] **Space Complexity** (`/algorithms/space-complexity`)
- [x] **Bubble Sort** (`/algorithms/bubble`)
- [x] **Selection Sort** (`/algorithms/selection`)
- [x] **Insertion Sort** (`/algorithms/insertion`)
- [x] **Merge Sort** (`/algorithms/merge`)
- [x] **Quick Sort** (`/algorithms/quick`)
- [x] **Linear Search** (`/algorithms/linear-search`)
- [x] **Binary Search** (`/algorithms/binary-search`)
- [x] **Stack** (`/algorithms/stack`)
- [x] **Queue** (`/algorithms/queue`)
- [x] **Linked List** (`/algorithms/linked-list`)

---

## 🚀 Phase 1 — Core Data Structures

| # | Topic | Status | Route / ID | Key Capabilities |
|---|-------|--------|------------|------------------|
| 01 | **Array (Static & Dynamic)** | ✅ *Completed* | `/algorithms/array` | Contiguous memory mapping, $O(1)$ random access arithmetic, shifting on insert/delete, geometric doubling ($2\times$) amortized analysis, spatial cache locality |
| 02 | **String** | ✅ *Completed* | `/algorithms/string` | Character arrays, ASCII/UTF-8 byte mapping, immutability vs mutability, two-pointer reversal, palindrome validation, sliding window pattern |
| 03 | **Deque (Double-Ended Queue)** | ✅ *Completed* | `/algorithms/deque` | Circular buffer & doubly-linked deque, front/rear push & pop in $O(1)$, monotonic sliding window maximum, palindrome dual-end verification |
| 04 | **Hash Table** | ✅ *Completed* | `/algorithms/hash-table` | Hash functions, bucket arrays, separate chaining, open addressing (linear probing), dynamic capacity doubling, Two Sum $O(n)$ map |
| 05 | **Binary Tree** | ✅ *Completed* | `/algorithms/binary-tree` | Node structure, parent-child relations, depth/height, full/complete/perfect/balanced invariants, DFS (Pre/In/Post) & BFS traversals, LeetCode 226 Invert |
| 06 | **Binary Search Tree** | ✅ *Completed* | `/algorithms/bst` | Subtree trichotomy invariant (Left < Root < Right), O(log n) search, dynamic insertion, 3-case deletion with in-order successor swap, in-order monotonic sort proof, degenerate skew hazard |
| 07 | **AVL Tree** | ✅ *Completed* | `/algorithms/avl-tree` | Balance factor, LL/RR/LR/RL rotations, self-balancing |
| 08 | **Heap (Min/Max)** | ✅ *Completed* | `/algorithms/heap` | Pointerless 1D array mapping, Sift-Up ($O(\log n)$), Sift-Down ($O(\log n)$), linear Bottom-Up Heapify ($O(n)$ summation proof), index arithmetic calculator |
| 09 | **Priority Queue** | 🟡 *Next Eligible* | `/algorithms/priority-queue` | Priority extraction, task scheduling semantics, Dijkstra / A* frontier modeling |
| 10 | **Union-Find / Disjoint Set** | ⚪ *Queued* | `/algorithms/union-find` | Disjoint set forests, union by rank, path compression |

---

## 🛠 Reusable Infrastructure Created
- `ArrayEngine` (`src/algorithms/array.ts`): State engine for static fixed-capacity arrays and dynamic geometric-doubling vectors with step-by-step element shifting and memory reallocation.
- `ArrayVisualizer` (`src/components/visualizer/ArrayVisualizer.tsx`): High-fidelity interactive array laboratory with hex physical RAM address inspection, real-time offset formula calculator, and dynamic reallocation buffer animation.
- `ArrayContiguousMemoryDiagram` (`src/components/diagrams/ArrayContiguousMemoryDiagram.tsx`): Signature infographic illustrating contiguous memory strip, $O(1)$ address derivation, cache line spatial locality, and shifting cost tradeoffs.
- `StringEngine` (`src/algorithms/string.ts`): Pure step generator engine for character arrays, ASCII byte mapping, two-pointer inward reversal, palindrome verification, sliding window substring intervals, and immutable buffer duplication.
- `StringVisualizer` (`src/components/visualizer/StringVisualizer.tsx`): Studio visualizer implementing 7/5 workspace with 1-byte RAM character strip, null terminator slot, live ASCII byte inspector, mutable vs immutable model switch, and synchronized C++ code viewer.
- `StringMemoryDiagram` (`src/components/diagrams/StringMemoryDiagram.tsx`): Signature infographic illustrating 1-byte contiguous RAM mapping, ASCII encoding, two-pointer inward scans, sliding window interval, and the immutability $O(n^2)$ loop penalty.
- `DequeEngine` (`src/algorithms/deque.ts`): Pure step generator engine for double-ended queues supporting circular buffer wrap-around, doubly-linked node chains, monotonic sliding window maximum, and symmetric palindrome testing.
- `DequeVisualizer` (`src/components/visualizer/DequeVisualizer.tsx`): Studio visualizer implementing signature 7/5 workspace with circular memory ring, bidirectional pointers, monotonic candidate window chamber, and synchronized C++ code viewer.
- `DequeDiagram` (`src/components/diagrams/DequeDiagram.tsx`): Signature architectural infographic illustrating circular buffer modulo wrap formulas and doubly-linked node chain topology.
- `AvlEngine` (`src/algorithms/avl-tree.ts`): State-machine engine supporting strict height balancing, balance factor tracking, 4 canonical pointer rotations (LL, RR, LR, RL), and recursive rebalancing steps.
- `AvlTreeVisualizer` (`src/components/visualizer/AvlTreeVisualizer.tsx`): Studio visualizer featuring dynamic SVG coordinate projections, real-time balance factor badges, rotation banner overlays, synchronized C++ CodeViewer, and interactive presets.
- `AvlTreeDiagram` (`src/components/diagrams/AvlTreeDiagram.tsx`): Signature blueprint diagram illustrating balance factor invariants, the 4 rotation cases, and comparison against naive BST height bounds.
- `HeapEngine` (`src/algorithms/heap.ts`): State-machine engine supporting Min-Heap and Max-Heap invariants, Sift-Up, Sift-Down, linear $O(n)$ Bottom-Up Heapify, presets, and 2D coordinate projections.
- `HeapVisualizer` (`src/components/visualizer/HeapVisualizer.tsx`): Studio visualizer featuring dual synchronized stages (Tree SVG + 1D Array strip), live parent/child index calculator, Min/Max toggle, and synchronized C++ `BinaryHeap` CodeViewer.
- `HeapDiagram` (`src/components/diagrams/HeapDiagram.tsx`): Blueprint infographic illustrating pointerless array-to-tree index arithmetic, Sift-Up, Sift-Down percolations, and the mathematical $O(n)$ Heapify summation proof.

---

## 🔍 Quality Gate Checklist for Topic 01 (Array)
- [x] Algorithm/data-structure logic is correct (Static bounds, Dynamic geometric resizing, shifts)
- [x] Visualization accurately represents internal state (Indices, Hex Addresses, Size vs Capacity, Shift Steps)
- [x] Main interactions work (Access, Insert, Append, Delete, Pop, Update, Search, Randomize, Clear)
- [x] Input handling works (Index bounds, Value validation, Mode switching)
- [x] Reset works
- [x] Step/playback works (Play, Pause, Step Forward, Step Back, Speed Slider)
- [x] Educational explanation is correct (Contiguous memory, Amortized doubling, Spatial locality)
- [x] Complexity information is correct (O(1) Access/Update, O(n) Middle Insert/Delete, O(1) Amortized Append)
- [x] UI matches AlgoHub design language (Dark theme, sleek cyan/blue/amber accents, clean typography)
- [x] Responsive layout works (Touch scrolling on mobile and tablet)
- [x] Accessibility is acceptable (Reduced motion support, clear button labels)
- [x] No TypeScript errors (`npx tsc --noEmit` passed)
- [x] Build succeeds (`npm run build` passed with 24/24 static/dynamic routes generated)
- [x] No obvious runtime errors
- [x] No memory leaks or broken animation loops
- [x] No unnecessary dependency added
- [x] Existing visualizations still work (Protected reference check passed)
- [x] Navigation integration works (Navbar dropdown, learning path, mastery dashboard, docs)

---

## 🔍 Quality Gate Checklist for Topic 02 (String)
- [x] Algorithm/data-structure logic is correct (Two-pointer reversal, Palindrome check, Sliding window, Substring search, In-place vs Immutable duplication)
- [x] Visualization accurately represents internal state (1-byte RAM addresses, ASCII integer & hex values, null terminator `\0`, L/R pointer overlays, sliding window brackets)
- [x] Main interactions work (Reverse, Palindrome, Sliding Window, Pattern Search, Mutate, Mode Switch, String Presets)
- [x] Input handling works (Needle input, Mutate index/char bounds, custom text loading)
- [x] Reset works
- [x] Step/playback works (Play, Pause, Step Forward, Step Back, Speed Slider)
- [x] Educational explanation is correct (1-byte contiguous indexing, ASCII/UTF-8 mapping, Immutability O(n) reallocation trap)
- [x] Complexity information is correct (O(1) access/mutable update, O(n) two-pointer & sliding window, O(n+m) immutable copy)
- [x] UI matches AlgoHub design language (Studio 2-column layout, zero color legend bars, zero Live Big-O cards)
- [x] Responsive layout works (Mobile horizontal scroll and tablet flex layouts)
- [x] Accessibility is acceptable (Reduced motion support, clear buttons)
- [x] No TypeScript errors
- [x] Existing visualizations still work (Protected reference check passed)
- [x] Navigation integration works (Navbar dropdown with 5 data structures, learn roadmap at Tier 1 order 2, topic category hub, in-depth theory 5-step flow)

---

## 🔍 Quality Gate Checklist for Topic 03 (Deque)
- [x] Algorithm/data-structure logic is correct (O(1) pushFront, pushBack, popFront, popBack, circular buffer modulo wrap, doubly-linked chain, monotonic window max, palindrome check)
- [x] Visualization accurately represents internal state (Circular slots with F and R pointers, wrap-around index calculation, doubly-linked node prev/next indicators, window bracket)
- [x] Main interactions work (Push/Pop/Peek Front and Rear, Randomize, Clear, Sliding Window Max, Palindrome Verify)
- [x] Input handling works (Numeric inputs, window size k selector, palindrome word input)
- [x] Reset works
- [x] Step/playback works (Play, Pause, Step Forward, Step Back, Speed Slider)
- [x] Educational explanation is correct (Modulo arithmetic `(front - 1 + capacity) % capacity`, Monotonic Decreasing Deque invariant, Work-Stealing scheduler)
- [x] Complexity information is correct (O(1) boundary operations, O(n) linear scan, O(n) sliding window maximum)
- [x] UI matches AlgoHub design language (Studio 2-column layout, zero color legend bars, zero Live Big-O cards)
- [x] Responsive layout works (Mobile horizontal scroll and tablet flex layouts)
- [x] Accessibility is acceptable (Reduced motion support, clear buttons)
- [x] No TypeScript errors (`npx tsc --noEmit` passed with 0 errors)
- [x] Build succeeds (`npm run build` passed with 23/23 static routes generated)
- [x] Existing visualizations still work (Protected reference check passed)
- [x] Navigation integration works (Navbar dropdown with 6 data structures, learn roadmap Tier 5 order 9, topic category hub with 6 visualizations, in-depth theory 5-step flow)

---

## 🔍 Quality Gate Checklist for Topic 07 (AVL Tree)
- [x] Algorithm/data-structure logic is correct (Balance Factor $BF = h_L - h_R \in \{-1, 0, 1\}$, 4 canonical rotations LL, RR, LR, RL, self-balancing insert, 3-case deletion with cascading rebalancing, in-order sorted scan)
- [x] Visualization accurately represents internal state (Tree SVG topology with in-order non-overlapping coordinates, color-coded node BF badges, rotation pivot badges, unbalanced alert nodes, synchronized C++ code lines)
- [x] Main interactions work (Insert, Delete, Search, In-Order traversal, Random node generation, Presets: Balanced 7 nodes, Trigger LL, Trigger RR, Trigger LR, Trigger RL, Monotonic sorted sequence)
- [x] Input handling works (Numeric key input, bounded random generator, preset selection)
- [x] Reset works (Restores selected preset or baseline tree)
- [x] Step/playback works (Play, Pause, Step Forward, Step Back, Reset, Step Indicator, Delay slider)
- [x] Educational explanation is correct (Fibonacci tree height bound $h < 1.44 \log_2 n$, $O(1)$ single vs double rotation mechanics, single rotation on insert vs cascading $O(\log n)$ rotations on deletion)
- [x] Complexity information is correct (Guaranteed $O(\log n)$ search/insert/delete across all cases, $O(1)$ rotation runtime, $O(n)$ space)
- [x] UI matches AlgoHub design language (Studio 2-column layout with 7-column tree canvas and 5-column sticky C++ CodeViewer + telemetry)
- [x] Responsive layout works (Mobile horizontal scroll and tablet flex layouts)
- [x] Accessibility is acceptable (Aria labels, reduced motion support, clear button controls)
- [x] No TypeScript errors (`npx tsc --noEmit` passed with 0 errors)
- [x] Build succeeds (`npm run build` succeeds)
- [x] Navigation integration works (Navbar dropdown under TREE STRUCTURES, learn roadmap Tier 6.8 order 14, topic category hub, 5-step learning workflow with Bangla theory)

---

## 🔍 Quality Gate Checklist for Topic 08 (Binary Heap)
- [x] Algorithm/data-structure logic is correct (Min-Heap & Max-Heap invariants, pointerless 0-indexed arithmetic, Sift-Up percolation, Sift-Down percolation, linear $O(n)$ Bottom-Up Heapify, Extract-Min/Max root replacement)
- [x] Visualization accurately represents internal state (Dual synchronized stages: 2D Complete Binary Tree SVG + 1D Array strip, highlighted comparison pairs, swap arcs, active percolating node, live Parent/Left/Right formula calculator)
- [x] Main interactions work (Insert element with Sift-Up, Extract Root with leaf swap & Sift-Down, Linear Heapify, Min-Heap / Max-Heap mode toggle, Peek root, Clear, Presets: Classic Min-Heap, Classic Max-Heap, Unsorted Random Array, Nearly Sorted)
- [x] Input handling works (Numeric value input with validation, bounds check, preset selector)
- [x] Reset works (Restores initial state or active preset)
- [x] Step/playback works (Play, Pause, Step Next, Step Prev, Reset, Step Progress Indicator, Speed Delay Slider)
- [x] Educational explanation is correct (Complete tree property, pointerless array mapping, Sift-Up $O(\log n)$ insertion, Sift-Down $O(\log n)$ extraction, linear $O(n)$ Heapify summation proof $\sum_{h=0}^{\lfloor\log_2 n\rfloor} \frac{n}{2^{h+1}} \cdot h = O(n)$)
- [x] Complexity information is correct (Peek: $O(1)$, Insert: $O(\log n)$, Extract-Root: $O(\log n)$, Build Heap: $O(n)$, Search: $O(n)$, Space: $O(n)$ in-place)
- [x] UI matches AlgoHub design language (Studio 7:5 split layout, Tree SVG + Array Strip, live formula telemetry, synchronized C++ `BinaryHeap` CodeViewer)
- [x] Responsive layout works (Mobile horizontal scroll and desktop grid layout)
- [x] Accessibility is acceptable (Aria labels, distinct visual highlight colors, reduced motion considerations)
- [x] No TypeScript errors (`npx tsc --noEmit` verified)
- [x] Build succeeds (`npm run build` verified with full route generation)
- [x] Navigation integration works (Navbar dropdown under Trees with order 15, learning path order 15, topic category hub, 5-step learning workflow with Bengali pedagogical breakdown, Quiz, Bug Hunt, LeetCode Problem Solving)



