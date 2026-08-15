# ⚡ Sorting Algorithm Visualizer

An interactive, educational web application designed to help developers and students intuitively understand how sorting algorithms work internally with real-time operational step visualization, synchronized C++ code line tracking, and complexity analysis.

---

## 🚀 Key Features

- **Real Algorithm Execution Engine**: 0% faked animations. Pure TypeScript algorithm functions record authentic operational steps (`compare`, `swap`, `overwrite`, `pivot`, `range`, `merge`).
- **5 Supported Sorting Algorithms**:
  1. **Bubble Sort** (with early break optimization)
  2. **Selection Sort** (minimum scanning & single swap per pass)
  3. **Insertion Sort** (playing cards key extraction & shifting)
  4. **Merge Sort** (divide & conquer subarray division & merging)
  5. **Quick Sort** (Lomuto partitioning with pivot selection & range scoping)
- **Synchronized C++17 Code Viewer**: Real-time line-by-line highlight tracking active execution step.
- **Dynamic Playback Controls**: Start, Pause, Resume, Single Step Forward, Reset, Speed Slider (20ms–800ms), Array Size Slider (5–50), and Custom Array input with validation.
- **Side-by-Side Comparison Matrix**: Comprehensive matrix comparing Time, Space, Stability, In-Place, and Adaptive properties at `/compare`.
- **Modern Dark UI**: Built with Next.js 15 App Router, React 19, Tailwind CSS, Framer Motion, and Lucide React.
- **Accessibility & A11y**: Full keyboard navigation support, visible focus rings, ARIA labels, and `prefers-reduced-motion` compliance.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Library**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Motion & Animations**: Framer Motion
- **Icons**: Lucide React
- **Celebrations**: Canvas Confetti

---

## 🏁 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run Algorithm Test Suite
```bash
npm run test:algorithms
```

### 4. Build for Production
```bash
npm run build
```
