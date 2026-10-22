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
| 09 | **Priority Queue** | ✅ *Completed* | `/algorithms/priority-queue` | Priority extraction, task scheduling semantics, Dijkstra / A* frontier modeling, Decrease-Key |
| 10 | **Union-Find / Disjoint Set** | ✅ *Completed* | `/algorithms/union-find` | Disjoint set forests, 1D array memory strip (`parent[]` & `rank[]`), Union by Rank/Size, Path Compression, Cycle Detection & Kruskal MST, inverse Ackermann $\alpha(n) \le 4$ proof |

---

## 🚀 Phase 2 — Problem-Solving Techniques

| # | Topic | Status | Route / ID | Key Capabilities |
|---|-------|--------|------------|------------------|
| 11 | **Two Pointers** | ✅ *Completed* | `/algorithms/two-pointers` | Converging opposite-ends (Two Sum II, Palindrome), Container With Most Water (water tank simulation), fast/slow reader-writer in-place duplicate removal, Floyd cycle detection |
| 12 | **Sliding Window** | ✅ *Completed* | `/algorithms/sliding-window` | Fixed-size window running sum ($K$-slide), dynamic-size window with character frequencies, at-most-k condition shrinkage, monotonic deque max |
| 13 | **Prefix Sum & Difference Arrays** | ✅ *Completed* | `/algorithms/prefix-sum` | 1D prefix sum queries in $O(1)$, 2D matrix prefix sum (inclusion-exclusion), difference array range updates in $O(1)$, Subarray Sum = K hash map |
| 14 | **Binary Search Patterns** | 🟡 *Next Eligible* | `/algorithms/binary-search-patterns` | Lower/Upper Bound, Search in Rotated Array, Search On Answer (Koko Eating Bananas, Capacity to Ship) |


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
- `PriorityQueueEngine` (`src/algorithms/priority-queue.ts`): Pure step generator engine for priority queues with Min-Priority & Max-Priority modes, Sift-Up on Enqueue, Sift-Down on Dequeue, Change-Priority (Decrease-Key / Increase-Key), 4 domain presets (OS Process Scheduler, Hospital ER Triage, Dijkstra Frontier, Network QoS), and 2D SVG tree coordinates.
- `PriorityQueueVisualizer` (`src/components/visualizer/PriorityQueueVisualizer.tsx`): 7:5 Studio visualizer with Tree SVG + 1D Array strip + CPU Dispatch Runway with history shelf, interactive Enqueue, Dequeue, Peek, Change Priority controls, inline transport playback, speed slider, and synchronized C++ `PriorityQueue<Task>` CodeViewer.
- `PriorityQueueDiagram` (`src/components/diagrams/PriorityQueueDiagram.tsx`): Comprehensive blueprint infographic with 4 interactive tabs (ADT vs Implementations, OS Process Scheduler Blueprint, Dijkstra Shortest Path Frontier, Change Priority/Decrease-Key).
- `UnionFindEngine` (`src/algorithms/union-find.ts`): Pure step generator engine for Disjoint Set Union (DSU) supporting Make-Set, Find with Path Compression, Union by Rank and Union by Size, Connected queries, Cycle Detection in graphs, 4 domain presets (Singletons, Network Hubs, Redundant Cycle, Degenerate Chain), and 2D SVG tree coordinates.
- `UnionFindVisualizer` (`src/components/visualizer/UnionFindVisualizer.tsx`): 7:5 Studio visualizer featuring interactive SVG forest canvas, 1D memory strip (`parent[]`, `rank[]`), component clusters shelf, cycle alert telemetry, optimization toggles, and operation hub.
- `UnionFindDiagram` (`src/components/diagrams/UnionFindDiagram.tsx`): Blueprint architecture diagram with 4 interactive tabs (Forest & 1D Array Mapping, Path Compression, Union by Rank/Size, Cycle Detection & Kruskal MST).
- `TwoPointersEngine` (`src/algorithms/two-pointers.ts`): State-machine engine supporting 4 two-pointer patterns (Opposite Converging Sorted Two Sum, Container With Most Water, Fast & Slow Reader-Writer deduplication, Palindrome Inward Scan) with snapshot generation and domain presets.
- `TwoPointersVisualizer` (`src/components/visualizer/TwoPointersVisualizer.tsx`): 7:5 Studio visualizer with array cell track, animated `L`/`R` and `Slow`/`Fast` pointers, SVG water tank area simulation, target sum evaluation HUD, pattern switcher, target controls, and mathematical invariants card (strictly NO static C++ code box).
- `TwoPointersDiagram` (`src/components/diagrams/TwoPointersDiagram.tsx`): Blueprint architecture diagram with 4 interactive tabs (Opposite Converging, Container Water, Fast & Slow, Floyd Cycle Detection).
- `SlidingWindowEngine` (`src/algorithms/sliding-window.ts`): State-machine engine supporting 4 sliding window patterns (Fixed-Size $K$-Slide, Dynamic Window Sum $\ge S$, Longest Unique Substring with auxiliary frequency hash, At-Most-$K$ Condition with 0-flip allowance) with snapshot generation, step telemetry, and domain presets.
- `SlidingWindowVisualizer` (`src/components/visualizer/SlidingWindowVisualizer.tsx`): 7:5 Studio visualizer featuring interactive array/string track with animated `[L` and `R]` bracket overlays, live telemetry HUD (window sum, size, condition validity, max found), pattern switcher, interactive parameter sliders ($K$, $S$, flips), domain presets, and mathematical invariants card (strictly NO static C++ code box).
- `SlidingWindowDiagram` (`src/components/diagrams/SlidingWindowDiagram.tsx`): Blueprint architecture diagram with 4 interactive tabs (Fixed-Size Window $K$-Slide, Dynamic Expand & Shrink, Frequency Hash Window, Monotonic Deque Window).
- `PrefixSumEngine` (`src/algorithms/prefix-sum.ts`): State-machine engine supporting 4 technique modes (1D Range Sum Query, 2D Matrix Inclusion-Exclusion, Difference Array Range Updates, and Subarray Sum Equals K with running prefix frequency hash map) with step telemetry and domain presets.
- `PrefixSumVisualizer` (`src/components/visualizer/PrefixSumVisualizer.tsx`): 7:5 Studio visualizer featuring interactive 1D/2D memory tracks, synchronized prefix arrays, inclusion-exclusion breakdown HUD, difference boundary markers, running prefix frequency hash board, parameter sliders (L, R, r1, c1, r2, c2, target K), and mathematical invariants card (strictly NO static C++ code box).
- `PrefixSumDiagram` (`src/components/diagrams/PrefixSumDiagram.tsx`): Blueprint architecture diagram with 4 interactive tabs (1D Prefix Sum Construction, 2D Matrix Inclusion-Exclusion, Difference Array O(1) Updates, Subarray Sum = K Hash Map).

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

---

## 🔍 Quality Gate Checklist for Topic 09 (Priority Queue)
- [x] Algorithm/data-structure logic is correct (Min-Priority & Max-Priority heap invariants, task priority model with key/payload, Sift-Up enqueue percolation, Sift-Down dequeue percolation, Change-Priority / Decrease-Key rebalancing, CPU dispatch runway history)
- [x] Visualization accurately represents internal state (Triple synchronized representations: 2D Tree SVG + 1D Priority Array strip + CPU Dispatch Runway with live active task slot and execution log shelf)
- [x] Main interactions work (Enqueue Task with custom ID/priority, Dequeue Highest Priority Task, Peek Extreme, Change Priority / Decrease-Key on existing task, Min/Max Priority toggle, Presets: OS Process Scheduler, Hospital ER Triage, Dijkstra Frontier, Network QoS)
- [x] Input handling works (Task label input, priority numeric value validation, preset selection, task ID selector for change priority)
- [x] Reset works (Restores initial state or active domain preset)
- [x] Step/playback works (Play, Pause, Step Next, Step Prev, Reset, Step Progress Indicator, Speed Delay Slider)
- [x] Educational explanation is correct (Priority Queue ADT vs Binary Heap concrete implementation, Fibonacci Heap theoretical Decrease-Key $O(1)$ amortized comparison, Dijkstra frontier $O((V+E)\log V)$ speedup, OS process preemption)
- [x] Complexity information is correct (Peek: $O(1)$, Enqueue: $O(\log n)$, Dequeue: $O(\log n)$, Change Priority / Decrease-Key: $O(\log n)$ with hash index or $O(n)$ search, Space: $O(n)$)
- [x] UI matches AlgoHub design language (Studio 7:5 split layout, Tree SVG + 1D strip + Dispatch Runway, no live big-O cards, no duplicate legend bars, synchronized C++ `PriorityQueue<Task>` CodeViewer)
- [x] Responsive layout works (Mobile horizontal scroll and desktop grid layout)
- [x] Accessibility is acceptable (Aria labels, distinct color-coded priority badges, reduced motion considerations)
- [x] No TypeScript errors (`npx tsc --noEmit` verified)
- [x] Build succeeds (`npm run build` verified with full route generation)
- [x] Navigation integration works (Navbar dropdown under HEAP STRUCTURES order 16, learning path order 16, topic category hub Heaps category with 2 visualizations, 5-step master learning path with Bengali accordion default collapsed, Quiz, Bug Hunt, LeetCode Problem Solving)
 
---
 
## 🔍 Quality Gate Checklist for Topic 10 (Union-Find / Disjoint Set)
- [x] Algorithm/data-structure logic is correct (Make-Set, Find with recursive/iterative path compression, Union by Rank and Union by Size, Connected query, Cycle detection)
- [x] Visualization accurately represents internal state (Interactive 2D SVG forest canvas with tree links, 1D contiguous memory strip showing `parent[]` and `rank[]`, connected components summary shelf, cycle alert telemetry)
- [x] Main interactions work (Union(x, y), Find(x), Connected(x, y), Reset, Optimization mode toggles: Path Compression ON/OFF, Union Strategy: Rank vs Size vs Naive, Presets: Clean Singletons, Network Hubs, Redundant Cycle, Degenerate Chain)
- [x] Input handling works (Valid node IDs 0 to n-1, custom union pair validation, preset selector)
- [x] Reset works (Restores initial state or active domain preset)
- [x] Educational explanation is correct (Disjoint set forest ADT, 1D array parent pointer representation, Union by Rank height bound $\le \lfloor\log_2 n\rfloor$, Path Compression flattening, combined inverse Ackermann $O(\alpha(n)) \le 4$ amortized time, Kruskal's MST cycle prevention)
- [x] Complexity information is correct (Find: $O(\alpha(n))$ amortized, Union: $O(\alpha(n))$ amortized, Connected: $O(\alpha(n))$ amortized, Space: $O(n)$)
- [x] UI matches AlgoHub design language (Studio 7:5 split layout, no Live Big-O cards, no duplicate legend bars, right column focused on interactive operations and mathematical invariants)
- [x] Responsive layout works (Mobile horizontal scroll and desktop grid layout)
- [x] Accessibility is acceptable (Aria labels, distinct color-coded node badges, clear telemetry)
- [x] No TypeScript errors (`npx tsc --noEmit` verified)
- [x] Build succeeds (`npm run build` verified with full route generation)
- [x] Navigation integration works (Navbar dropdown under DATA STRUCTURES order 17, learning path order 17, topic category hub Data Structures category with 8 visualizations, 5-step master learning path with Bengali accordion default collapsed, Quiz, Bug Hunt, LeetCode Problem Solving)

---

## 🔍 Quality Gate Checklist for Topic 11 (Two Pointers)
- [x] Algorithm/technique logic is correct (Opposite Converging Sorted Two Sum, Container With Most Water, Fast & Slow Reader-Writer deduplication, Palindrome Inward Scan)
- [x] Visualization accurately represents internal state (Interactive array cell track, animated `L`/`R` and `Slow`/`Fast` pointers, SVG water tank area simulation with max capacity record, target sum comparison HUD with `currentSum vs targetSum` telemetry)
- [x] Main interactions work (Pattern selector, step-by-step playback, play/pause/reset, speed slider, target sum input adjustment)
- [x] Input handling works (Domain presets, target sum input clamping, valid indices bounds)
- [x] Reset works (Restores initial state or active pattern preset)
- [x] Educational explanation is correct (Monotonicity pruning proof, Container area bottleneck invariant $\min(h_L, h_R) \times (R - L)$, Reader-Writer in-place partition array invariant $0 \dots \text{slow}$, Floyd cycle relative velocity closure $(2 - 1) = 1$)
- [x] Complexity information is correct (Time: $O(n)$ single-pass linear scans, Space: $O(1)$ auxiliary constant space)
- [x] UI matches AlgoHub design language (Studio 7:5 split layout, no Live Big-O cards, no duplicate legend bars, right column focused on interactive controls and mathematical invariants with strictly NO static C++ code box)
- [x] Responsive layout works (Mobile horizontal scrolling, desktop responsive 7:5 grid layout)
- [x] Accessibility is acceptable (Aria labels, distinct pointer badge colors, clear operational logs)
- [x] No TypeScript errors (`npx tsc --noEmit` verified)
- [x] Build succeeds (`npm run build` verified with full route generation)
- [x] Navigation integration works (Navbar dropdown under PROBLEM-SOLVING TECHNIQUES order 23, learning path order 23, topic category hub Techniques category with 1 visualization and comparison table, 5-step master learning path with Bengali accordion default collapsed, Quiz, Bug Hunt, LeetCode Problem Solving strictly with ZERO `keyConcept`)

---

## 🔍 Quality Gate Checklist for Topic 12 (Sliding Window)
- [x] Algorithm/technique logic is correct (Fixed-Size $K$-Slide, Dynamic Window Sum $\ge S$, Longest Unique Substring with auxiliary frequency hash, At-Most-$K$ Condition with 0-flip allowance)
- [x] Visualization accurately represents internal state (Interactive array/string track with animated `[L` and `R]` bracket overlays, live telemetry HUD with window sum, size, condition validity, max found, parameter sliders)
- [x] Main interactions work (Pattern selector, step-by-step playback, play/pause/reset, speed slider, $K$ slider, target sum $S$ slider, max flips slider, domain presets)
- [x] Input handling works (Domain presets, parameter sliders with dynamic bounds, valid indices bounds)
- [x] Reset works (Restores initial state or active pattern preset)
- [x] Educational explanation is correct (Fixed-size recurrence $W_{i} = W_{i-1} + a[R] - a[L-1]$, dynamic monotonicity condition $\sum \ge S$, reader-writer frequency hash table, monotonic deque extreme maintenance, amortized $2n$ steps proof)
- [x] Complexity information is correct (Time: $O(n)$ amortized single-pass linear scans, Space: $O(1)$ to $O(k)$ auxiliary space)
- [x] UI matches AlgoHub design language (Studio 7:5 split layout, no Live Big-O cards, no duplicate legend bars, right column focused on interactive controls and mathematical invariants with strictly NO static C++ code box)
- [x] Responsive layout works (Mobile horizontal scrolling, desktop responsive 7:5 grid layout)
- [x] Accessibility is acceptable (Aria labels, distinct window bracket colors, clear operational logs)
- [x] No TypeScript errors (`npx tsc --noEmit` verified)
- [x] Build succeeds (`npm run build` verified with full route generation)
- [x] Navigation integration works (Navbar dropdown under PROBLEM-SOLVING TECHNIQUES order 24, learning path order 24, topic category hub Techniques category with 2 visualizations and comparison table, 5-step master learning path with Bengali accordion default collapsed with zero `*` characters, Quiz with 5 MCQs, Bug Hunt, LeetCode Problem Solving with 5 problems strictly with ZERO `keyConcept`)

---

## 🔍 Quality Gate Checklist for Topic 13 (Prefix Sum & Difference Arrays)
- [x] Algorithm/technique logic is correct (1D Range Sum Query, 2D Matrix Inclusion-Exclusion, Difference Array Range Updates, Subarray Sum Equals K with prefix frequency hash map)
- [x] Visualization accurately represents internal state (Interactive 1D/2D memory tracks, synchronized prefix arrays, inclusion-exclusion breakdown HUD, difference boundary markers, running prefix frequency hash board, parameter sliders)
- [x] Main interactions work (Pattern selector, step-by-step playback, play/pause/reset, speed slider, 1D L/R sliders, 2D r1/c1/r2/c2 sliders, target K slider, domain presets)
- [x] Input handling works (Domain presets, parameter sliders with dynamic bounds, valid indices bounds)
- [x] Reset works (Restores initial state or active pattern preset)
- [x] Educational explanation is correct (1-based indexing invariant P[0]=0, 2D Inclusion-Exclusion formula 4-term cancellation, Difference array duality and boundary markers, Subarray Sum = K algebraic equation P[j-1] = P[i] - K)
- [x] Complexity information is correct (Precompute: O(N) linear time, Range Query: O(1) instant subtraction, Range Update: O(1) boundary write, Difference Reconstruction: O(N) sweep)
- [x] UI matches AlgoHub design language (Studio 7:5 split layout, no Live Big-O cards, no duplicate legend bars, right column focused on interactive controls and mathematical invariants with strictly NO static C++ code box)
- [x] Responsive layout works (Mobile horizontal scrolling, desktop responsive 7:5 grid layout)
- [x] Accessibility is acceptable (Aria labels, distinct boundary marker badges, clear operational logs)
- [x] No TypeScript errors (`npx tsc --noEmit` verified)
- [x] Build succeeds (`npm run build` verified with full route generation)
- [x] Navigation integration works (Navbar dropdown under PROBLEM-SOLVING TECHNIQUES order 25, learning path order 25, topic category hub Techniques category with 3 visualizations and comparison table, 5-step master learning path with Bengali accordion default collapsed with zero `*` characters, Quiz with 5 MCQs, Bug Hunt, LeetCode Problem Solving with 5 problems strictly with ZERO `keyConcept`)
