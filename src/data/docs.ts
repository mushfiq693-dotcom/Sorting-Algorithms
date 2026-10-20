export interface DocsArticle {
  slug: string;
  level: number;
  levelTitle: string;
  order: number;
  title: string;
  subtitle: string;
  estimatedReadTime: string;
  category: "Fundamentals" | "Simple Algorithms" | "Divide and Conquer" | "Advanced Analysis" | "Decision Guide" | "Data Structures" | "Complexity" | "Searching";
  content: string; // Markdown / prose structure
  banglaNote?: {
    topic: string;
    englishContext: string;
    banglaText: string;
  };
  quizTopicId?: string;
  visualizerLink?: {
    label: string;
    algorithmId: string;
    path: string;
  };
}

export interface DocsLevel {
  level: number;
  title: string;
  description: string;
  articles: DocsArticle[];
}

export const DOCS_ARTICLES: DocsArticle[] = [
  // ==========================================
  // LEVEL 0: BEFORE YOU START
  // ==========================================
  {
    slug: "what-is-sorting",
    level: 0,
    levelTitle: "Level 0: Before You Start",
    order: 1,
    title: "Formal Definition of Sorting",
    subtitle: "Understanding input sequences, permutations, and mathematical ordering relations.",
    estimatedReadTime: "5 min",
    category: "Fundamentals",
    content: `
### What Is Sorting Formally?

In computer science, **sorting** is the algorithmic process of arranging a sequence of elements in a specific systematic order according to a predefined comparison relation.

Formally, given a sequence of $n$ elements:

$$\\langle a_1, a_2, a_3, \\dots, a_n \\rangle$$

a sorting algorithm produces a **permutation** $\\langle a'_1, a'_2, a'_3, \\dots, a'_n \\rangle$ such that:

$$a'_1 \\le a'_2 \\le a'_3 \\le \\dots \\le a'_n$$

where $\\le$ represents a **total ordering relation**.

---

### What Is a Total Ordering Relation?

For an ordering relation $\\le$ to be valid for sorting, it must satisfy four core mathematical properties for all elements $x, y, z$ in the domain:

1. **Reflexivity**: $x \\le x$ is always true (any element is less than or equal to itself).
2. **Antisymmetry**: If $x \\le y$ and $y \\le x$, then $x = y$ (two elements with equal rank are equivalent under the relation).
3. **Transitivity**: If $x \\le y$ and $y \\le z$, then $x \\le z$ (ordering propagates reliably).
4. **Totality (Comparability)**: For any pair $(x, y)$, either $x \\le y$ or $y \\le x$ (any two elements can always be compared).

If any of these properties are violated (e.g. non-transitive "rock-paper-scissors" relations or non-comparable values like IEEE-754 \`NaN\`), standard sorting algorithms will produce undefined or incorrect behavior.

---

### Why Does Sorting Matter?

Sorting is not just an academic exercise; it is the fundamental backbone of computing:
- **Fast Search**: Transforming an unsorted sequence into a sorted one reduces search time from $O(n)$ linear search to $O(\\log n)$ binary search.
- **Deduplication & Grouping**: Adjacent elements in a sorted list are identical if they share the same key, enabling $O(n)$ linear passes for unique filtering.
- **Database Indexing**: B-Trees, LSM-Trees, and relational databases require sorted data structures to support range queries (\`WHERE age BETWEEN 20 AND 30\`).
    `,
  },
  {
    slug: "comparisons-and-swaps",
    level: 0,
    levelTitle: "Level 0: Before You Start",
    order: 2,
    title: "Comparisons and Swaps",
    subtitle: "Why we measure algorithm cost through comparisons and memory movement rather than raw execution seconds.",
    estimatedReadTime: "6 min",
    category: "Fundamentals",
    content: `
### The Primary Currency of Sorting Algorithms

When evaluating sorting algorithms, we do not benchmark purely in wall-clock milliseconds because execution time varies wildly across CPU architectures, compiler optimizations, and background processes. 

Instead, theoretical computer science measures the cost in terms of **elementary operations**:

1. **Comparisons**: An operation comparing two values ($A < B$ or $A > B$).
2. **Swaps / Data Moves**: Writing and exchanging positions of elements in memory.

---

### Comparisons: The Decision Primitive

Every comparison-based sorting algorithm makes decisions by querying an oracle: *"Is element $x$ smaller than element $y$?"*

\`\`\`cpp
// An elementary comparison operation
if (arr[j] > arr[j + 1]) {
    // Branch taken based on comparison result
}
\`\`\`

Because each comparison yields at most 1 bit of information (true or false), any comparison sort must construct a **decision tree**. To distinguish between all $n!$ possible permutations of an array of length $n$, the decision tree must have height at least $\\lceil \\log_2(n!) \\rceil \\approx n \\log_2 n$. This is why no comparison-based sort can beat $\\Omega(n \\log n)$ in the general case!

---

### Swaps & Memory Writes: The Cache Penalty

Moving data in RAM is physically expensive:
- A comparison only reads data into CPU registers.
- A **swap** performs two memory read-and-write cycles:

\`\`\`cpp
// A standard swap operation
int temp = arr[i];
arr[i] = arr[j];
arr[j] = temp;
\`\`\`

Algorithms like **Selection Sort** minimize swaps ($O(n)$ swaps total), making them useful when writes to memory (like Flash EEPROM) are heavily penalized, whereas **Bubble Sort** can perform up to $O(n^2)$ swaps.
    `,
  },
  {
    slug: "big-o-for-beginners",
    level: 0,
    levelTitle: "Level 0: Before You Start",
    order: 3,
    title: "Reading Big-O for Absolute Beginners",
    subtitle: "Demystifying asymptotic notation without requiring advanced mathematics.",
    estimatedReadTime: "8 min",
    category: "Fundamentals",
    content: `
### What Is Big-O Notation Really?

Imagine you have a phone book with $n$ names. 
- If you check names one by one from page 1, you check at most $n$ names. If $n = 100$, it takes 100 steps. If $n = 1,000,000$, it takes 1,000,000 steps. That is **$O(n)$** (Linear Time).
- If you open the book in the middle and halve the remaining pages each time, you check at most $\\approx 20$ times even for $1,000,000$ names! That is **$O(\\log n)$** (Logarithmic Time).
- If you compare every single name with every other name, you make $n \\times n = n^2$ comparisons. For $1,000,000$ names, that is $1,000,000,000,000$ operations! That is **$O(n^2)$** (Quadratic Time).

**Big-O ($O$) describes how the execution work scales as the input size $n$ grows toward infinity.**

---

### The Complexity Ladder

| Notation | Name | Practical Meaning | Time for $n = 10,000$ |
| :--- | :--- | :--- | :--- |
| **$O(1)$** | Constant | Instantaneous, independent of size | ~1 operation |
| **$O(\\log n)$** | Logarithmic | Halving the problem repeatedly | ~14 operations |
| **$O(n)$** | Linear | Single pass through the data | 10,000 operations |
| **$O(n \\log n)$** | Linearithmic | The gold standard for comparison sorts | ~140,000 operations |
| **$O(n^2)$** | Quadratic | Nested loops over the data | 100,000,000 operations |

---

### Two Golden Rules of Big-O:

1. **Drop Constant Factors**: $5n + 100$ becomes $O(n)$. We care about the rate of growth, not minor multipliers.
2. **Keep the Dominant Term**: If an algorithm takes $n^2 + 100n$ steps, as $n$ reaches 100,000, $n^2$ is 10,000,000,000 while $100n$ is only 10,000,000. Thus, we write **$O(n^2)$**.
    `,
    banglaNote: {
      topic: "Big-O Notation",
      englishContext: "Big-O represents asymptotic growth rate as input size n grows.",
      // [REVIEW DRAFT] Bengali translation for user review
      banglaText: `
**বিগ-ও (Big-O) সহজ কথায় কী?**

মনে করুন, আপনার কাছে $n$ টি সংখ্যার একটি লিস্ট আছে। ডেটা সাইজ $n$ যত বড় হবে, আপনার অ্যালগরিদমের কাজের পরিমাণ কত দ্রুত বাড়বে — সেটাই হলো Big-O Notation।

- **$O(1)$ (কনস্ট্যান্ট):** ডেটা ১০ টা হোক আর ১০ লাখ হোক, সময় সবসময় একই লাগবে। (যেমন: অ্যারের প্রথম উপাদান পড়া)।
- **$O(n)$ (লিনিয়ার):** প্রতিটি সংখ্যা ১ বার করে দেখা। ১০ টা সংখ্যার জন্য ১০ বার, ১০ লাখ সংখ্যার জন্য ১০ লাখ বার।
- **$O(n \\log n)$ (লগ-লিনিয়ার):** মার্জ সর্টের মতো স্মার্ট অ্যালগরিদম। ১০ লাখ সংখ্যার জন্য মাত্র প্রায় ২০ লাখ স্টেপ!
- **$O(n^2)$ (কোয়াড্রাটিক):** দুটি নেস্টেড লুপ (লুপের ভেতর লুপ)। ১০ লাখ সংখ্যার জন্য ১ ট্রিলিয়ন স্টেপ লেগে যাবে, যা কম্পিউটারকে হ্যাং করে দিতে পারে।

👉 **মূল কথা:** Big-O দিয়ে আমরা সেকেন্ড মাপি না, বরং ইনপুট বাড়লে কাজের গতি কেমন বদলাবে তা পরিমাপ করি।
      `
    }
  },
  {
    slug: "reading-cpp-syntax",
    level: 0,
    levelTitle: "Level 0: Before You Start",
    order: 4,
    title: "How to Read the C++ on This Site",
    subtitle: "A quick cheat-sheet for JavaScript, Python, or beginner programmers.",
    estimatedReadTime: "6 min",
    category: "Fundamentals",
    content: `
### A Gentle Guide to Our C++17 Reference Code

All algorithms on this site provide verified C++17 implementations because C++ allows direct, transparent control over array memory without hidden runtime allocations.

If you come from Python, JavaScript, or Java, here is everything you need to know:

---

### 1. \`std::vector<int>& arr\` (Dynamic Arrays & References)

\`\`\`cpp
void bubbleSort(std::vector<int>& arr) { ... }
\`\`\`

- **\`std::vector<int>\`**: A resizable array containing integers (equivalent to \`number[]\` in TypeScript or \`list[int]\` in Python).
- **The \`&\` (Pass by Reference)**: In C++, omitting \`&\` creates a whole copy of the array. The ampersand \`&\` means we pass the *original array in-place*, allowing our function to mutate it directly.

---

### 2. \`std::swap(a, b)\`

\`\`\`cpp
std::swap(arr[j], arr[j + 1]);
\`\`\`

Under the hood, this exchanges the values of two memory slots using an internal move:

\`\`\`cpp
int temp = arr[j];
arr[j] = arr[j + 1];
arr[j + 1] = temp;
\`\`\`

---

### 3. Common Loop Patterns

\`\`\`cpp
// Iterates i from 0 up to n - 1
for (int i = 0; i < n; i++) {
    // 0-indexed array access
    int current = arr[i];
}
\`\`\`
    `
  },

  // ==========================================
  // LEVEL 1: THE SIMPLE ALGORITHMS
  // ==========================================
  {
    slug: "bubble-sort",
    level: 1,
    levelTitle: "Level 1: The Simple Algorithms",
    order: 1,
    title: "Bubble Sort: Adjacent Comparisons & Inversion Resolution",
    subtitle: "The foundational comparison sort: bubbling maximal keys rightward, loop invariant mechanics, and adaptive early termination.",
    estimatedReadTime: "10 min",
    category: "Simple Algorithms",
    banglaNote: {
      topic: "বাবল সর্ট ও পাশাপাশি উপাদানের অদলবদল (Bubble Sort Deep Dive)",
      englishContext: "Bubble Sort repeatedly swaps adjacent out-of-order elements, allowing larger values to 'bubble up' to the right while resolving inversions.",
      banglaText: `
### 💡 সহজ উপমা: পানির গ্লাসে সোডার বুদবুদ
পানির গ্লাসে সোডা ঢাললে যেমন হালকা বুদবুদগুলো ভেসে ওপরের দিকে ওঠে আর ভারী উপাদান নিচে জমা হয়, বাবল সর্টেও ঠিক তেমনি বড় সংখ্যাগুলো প্রতি পাসে ভেসে ভেসে অ্যারের ডান প্রান্তে চলে যায়। 

### 🔍 ধাপে ধাপে কার্যপদ্ধতি (Step-by-Step Mechanics):
১. **পাশাপাশি জোড়া তুলনা:** অ্যারের শুরু থেকে শুরু করে প্রতি জোড়া সংলগ্ন উপাদান (\`arr[j]\` এবং \`arr[j + 1]\`) তুলনা করা হয়।
২. **অদলবদল (Swap):** বামের সংখ্যাটি যদি ডানেরটির চেয়ে বড় হয় (\`arr[j] > arr[j + 1]\`), তবে তাদের জায়গা অদলবদল করা হয়।
৩. **প্রথম পাসের ফল:** প্রথমবার পুরো অ্যারে ঘুরে আসার পর নিশ্চিতভাবে পুরো অ্যারের সবচেয়ে বড় সংখ্যাটি একদম শেষ ইনডেক্স ($n-1$) এ গিয়ে স্থায়ীভাবে বসে।
৪. **পরবর্তী পাসগুলো:** দ্বিতীয় পাসে ২য় বৃহত্তম সংখ্যাটি শেষ ঘরের ঠিক আগের ঘরে যায়। এভাবে $n-1$ টি পাসে সম্পূর্ণ অ্যারে ক্রমানুসারে সাজানো হয়ে যায়।

### 🧠 লুপ ইনভ্যারিয়েন্ট ও অপ্টিমাইজেশন (Early Exit Magic):
- **ভেতরের লুপে \`n - i - 1\` কেন?** কারণ প্রতিটি পাস $i$ শেষ হওয়ার পর পেছনের $i$ টি উপাদান ইতোমধ্যেই তাদের চূড়ান্ত সঠিক জায়গায় বসে গেছে। তাই প্রতি পাসে ১ ঘর করে চেকিং কমিয়ে দেওয়া হয়।
- **ফ্ল্যাগ ভ্যারিয়েবল (\`swapped\`):** সাধারণ বাবল সর্ট সবক্ষেত্রেই $O(n^2)$ সময় নেয়। কিন্তু আমরা যদি একটি বুলিয়ান ফ্ল্যাগ রাখি (\`bool swapped = false\`), এবং পুরো একটি পাসে কোনো সোয়াপ না ঘটে, তার মানে অ্যারে আগে থেকেই সাজানো! তখন লুপ সাথে সাথে ব্রেক করে $O(n)$ সময়ে অ্যালগরিদম শেষ করা যায়।

### ⏱️ টাইম ও স্পেস কমপ্লেক্সিটি গভীরভাবে বুঝুন:
- **Best Case ($O(n)$):** অ্যারে আগে থেকেই সাজানো থাকলে মাত্র $n-1$ বার তুলনা করে অ্যালগরিদম সফলভাবে শেষ হয়।
- **Worst Case ($O(n^2)$):** অ্যারে সম্পূর্ণ উল্টো ক্রমে সাজানো থাকলে মোট তুলনা ও সোয়াপের সংখ্যা $\\frac{n(n-1)}{2}$।
- **Space Complexity ($O(1)$ Auxiliary):** এটি সম্পূর্ণ ইন-প্লেস (In-Place), অর্থাৎ কোনো বাড়তি মেমোরি অ্যারে লাগে না।
- **স্ট্যাবিলিটি (Stability):** বাবল সর্ট সম্পূর্ণ স্ট্যাবল। সমান মানের দুটি উপাদান (\`arr[j] == arr[j+1]\`) থাকলে তাদের কখনো সোয়াপ করা হয় না, ফলে আদি ক্রম অক্ষুণ্ণ থাকে।

### ⚠️ বাস্তব জীবনে ব্যবহারের সতর্কতা:
বাস্তব প্রজেক্টে বাবল সর্ট খুব কম ব্যবহৃত হয়, কারণ এতে ঘন ঘন মেমোরি রাইট (Memory Writes/Swaps) ঘটে যা আধুনিক সিপিইউ ক্যাশ লাইনের পারফরম্যান্স মারাত্মকভাবে কমিয়ে দেয়। তবে এটি ইনভার্সন সংখ্যা বুঝতে এবং শিক্ষামূলক অ্যালগরিদমিক চিন্তার ভিত্তি গড়তে অতুলনীয়।
      `,
    },
    content: `
### Core Conceptual Model & Physics Analogy

Bubble Sort is the most visually intuitive comparison-based sorting algorithm. It operates on the physical principle of density stratification: just as carbonated gas bubbles rise to the liquid surface while dense particulate sinks, larger numerical keys systematically "bubble up" to higher index positions through adjacent pairwise comparisons.

Unlike partitioning or divide-and-conquer algorithms, Bubble Sort is strictly localized: **the algorithm never compares elements separated by a distance greater than 1**. Every step evaluates an adjacent pair $(arr[j], arr[j + 1])$ and resolves local out-of-order inversions.

---

### Mathematical Loop Invariants

A formal proof of Bubble Sort's correctness rests upon two complementary invariants:

1. **Outer Loop Invariant:** At the completion of outer pass $i$ (where $0 \\le i < n - 1$), the suffix subarray $arr[n - 1 - i \\dots n - 1]$ contains the $(i + 1)$ largest elements from the entire input in strictly sorted, non-decreasing order. These suffix elements are in their permanent, globally correct positions and need never be inspected again.
2. **Inner Loop Invariant:** During inner iteration $j$, the element currently at $arr[j]$ is the maximum value encountered in the prefix $arr[0 \\dots j]$. If $arr[j] > arr[j + 1]$, swapping them ensures the moving maximum advances to index $j + 1$.

---

### Step-by-Step Execution Trace

Consider the unsorted array \`[5, 1, 4, 2, 8]\` of size $n = 5$:

* **Pass 0 ($i = 0$):**
  - Compare \`5\` & \`1\` $\\to$ Swap: \`[1, 5, 4, 2, 8]\`
  - Compare \`5\` & \`4\` $\\to$ Swap: \`[1, 4, 5, 2, 8]\`
  - Compare \`5\` & \`2\` $\\to$ Swap: \`[1, 4, 2, 5, 8]\`
  - Compare \`5\` & \`8\` $\\to$ No swap: \`[1, 4, 2, 5, 8]\`
  - *Result:* Largest element \`8\` is permanently anchored at index 4.
* **Pass 1 ($i = 1$):**
  - Compare \`1\` & \`4\` $\\to$ No swap
  - Compare \`4\` & \`2\` $\\to$ Swap: \`[1, 2, 4, 5, 8]\`
  - Compare \`4\` & \`5\` $\\to$ No swap
  - *Result:* Second largest element \`5\` is permanently anchored at index 3.
* **Pass 2 ($i = 2$):**
  - Inner scan verifies \`1 < 2\` and \`2 < 4\`. Zero swaps occur! The \`swapped\` flag remains \`false\`, and the algorithm terminates immediately.

---

### Detailed Complexity & Mechanical Analysis

| Metric | Complexity | Derivation & Rationale |
| :--- | :--- | :--- |
| **Best-Case Time** | $\\Omega(n)$ | Array is already sorted; inner loop executes $n - 1$ comparisons, \`swapped\` remains false, exits in 1 pass. |
| **Worst-Case Time** | $O(n^2)$ | Reverse-sorted array; requires $\\sum_{k=1}^{n-1} k = \\frac{n(n-1)}{2}$ comparisons and $\\frac{n(n-1)}{2}$ swaps. |
| **Average-Case Time**| $\\Theta(n^2)$ | Random permutation contains $\\frac{n(n-1)}{4}$ inversions on average; requires $\\Theta(n^2)$ comparisons. |
| **Auxiliary Space** | $O(1)$ | Strictly in-place. Requires only two scalar iteration indices and one boolean flag. |
| **Stability** | **Stable** | Identical elements ($arr[j] == arr[j+1]$) fail the strict \`>\` test; their relative order is strictly preserved. |

---

### Why Bubble Sort Is Rare in Production

While conceptually pristine, Bubble Sort is rarely used in high-performance computing engines due to hardware caching penalties:
1. **High Memory Bus Traffic:** Every swap requires reading from and writing to two RAM/cache locations ($3$ bus operations per inversion). Insertion Sort, by comparison, shifts elements with a single write per inversion.
2. **Branch Misprediction:** The inner condition \`if (arr[j] > arr[j + 1])\` flips unpredictably on scrambled data, causing frequent CPU pipeline flushes.
    `,
    quizTopicId: "bubble",
    visualizerLink: {
      label: "Open Bubble Sort in Interactive Visualizer",
      algorithmId: "bubble",
      path: "/algorithms/bubble"
    }
  },
  {
    slug: "selection-sort",
    level: 1,
    levelTitle: "Level 1: The Simple Algorithms",
    order: 2,
    title: "Selection Sort: Global Extrema & Minimal Memory Writes",
    subtitle: "Partitioning the list into sorted and unsorted portions with at most n - 1 total swaps throughout execution.",
    estimatedReadTime: "10 min",
    category: "Simple Algorithms",
    banglaNote: {
      topic: "সিলেকশন সর্ট ও সর্বনিম্ন মান নির্বাচন (Selection Sort Deep Dive)",
      englishContext: "Selection Sort divides the array into sorted and unsorted regions, repeatedly finding the minimum element from the unsorted section and placing it at the front.",
      banglaText: `
### 💡 সহজ উপমা: শ্রেণিকক্ষে উচ্চতা অনুযায়ী দাঁড় করানো
একজন শিক্ষক ক্লাসের সব শিক্ষার্থীর মধ্য থেকে সবচেয়ে খাটো ছাত্রকে খুঁজে এনে লাইনের ১ম স্থানে দাঁড় করালেন। এরপর বাকিদের ভেতর থেকে সবচেয়ে খাটো জনকে খুঁজে এনে ২য় স্থানে দাঁড় করালেন। এভাবেই সিলেকশন সর্ট প্রতিটি ধাপে অসাজানো অংশের সর্বনিম্ন মানটি খুঁজে নিয়ে আসে।

### 🔍 ধাপে ধাপে কার্যপদ্ধতি (How It Works):
১. **দুই ভাগে বিভাজন:** অ্যারেটিকে দুটি কাল্পনিক অংশে ভাগ করা হয় — বামপাশে ক্রমবর্ধিষ্ণু সাজানো অংশ, আর ডানপাশে বাকি অসাজানো অংশ। শুরুতে সাজানো অংশ খালি থাকে।
২. **সর্বনিম্ন ইনডেক্স অনুসন্ধান (\`minIdx\`):** প্রতি ধাপে অসাজানো অংশের ($i$ থেকে $n-1$) প্রতিটি সংখ্যা স্ক্যান করে সবচেয়ে ছোট সংখ্যার ইনডেক্স \`minIdx\` খুঁজে বের করা হয়।
৩. **নির্দিষ্ট একটি সোয়াপ (Single Swap):** সর্বনিম্ন মান পাওয়ার পর অসাজানো অংশের প্রথম উপাদানের (\`arr[i]\`) সাথে \`arr[minIdx]\`-এর মাত্র **১টি সোয়াপ** করা হয়।
৪. **সীমানা বৃদ্ধি:** সাজানো অংশের পরিধি ১ ঘর বেড়ে যায়। এভাবে প্রতি পাসে মাত্র ১টি সোয়াপের মাধ্যমে সম্পূর্ণ অ্যারে সর্ট হয়।

### ⚡ সর্বনিম্ন মেমোরি রাইটের সুপারপাওয়ার (At Most $n-1$ Writes):
- বাবল সর্টে প্রতি পাসে প্রচুর সোয়াপ হতে পারে। কিন্তু সিলেকশন সর্ট পুরো জীবনে সর্বোচ্চ $n-1$ বার সোয়াপ (Memory Write) করে!
- **কোথায় লাভজনক?** ফ্ল্যাশ মেমোরি (Flash Memory) বা EEPROM চিপে যেখানে মেমোরিতে নতুন ডেটা লেখা ব্যয়বহুল বা ক্ষতিকর (Hardware Wear-leveling), সেখানে সিলেকশন সর্ট অত্যন্ত কার্যকর।

### ⏱️ টাইম ও স্পেস কমপ্লেক্সিটি:
- **Best, Average, Worst Case সবক্ষেত্রেই $O(n^2)$:** কারণ অ্যারে আগে থেকে সাজানো থাকলেও প্রতিবার সর্বনিম্ন সংখ্যা খুঁজতে তাকে ডানপাশের সব উপাদান পরীক্ষা করতেই হয়।
- **Space Complexity ($O(1)$ In-Place):** কোনো অতিরিক্ত অ্যারে তৈরি করা হয় না।

### ⚠️ কেন এটি আনস্ট্যাবল (Unstable)?
সিলেকশন সর্ট দূরবর্তী উপাদানগুলোর মধ্যে জাম্প করে সোয়াপ করে। এর ফলে একই মানের দুটি উপাদান থাকলে তাদের মূল আপেক্ষিক ক্রম ভেঙে যেতে পারে। 
*উদাহরণ:* \`[4a, 4b, 2]\` সর্ট করার সময় ১ম ধাপে \`2\` এর সাথে \`4a\` সোয়াপ হয়ে যায়, ফলে অ্যারে হয় \`[2, 4b, 4a]\` — দেখুন \`4b\` আগে এসে পড়েছে, যা স্ট্যাবিলিটি নষ্ট করে!
      `,
    },
    content: `
### Core Conceptual Model & The Two-Partition State

Selection Sort operates on a structural invariant: partitioning the linear array into two explicit regions:
1. **Sorted Prefix Subarray** $[0 \\dots i - 1]$: Fully ordered elements that are already strictly $\\le$ every element in the remaining collection.
2. **Unsorted Suffix Subarray** $[i \\dots n - 1]$: Raw candidate elements awaiting organization.

At each iteration $i$, the algorithm scans the entire unsorted partition, extracts the index of the absolute minimum element (\`minIdx\`), and performs **at most one single swap** between $arr[i]$ and $arr[minIdx]$. 

\`\`\`
Iteration i = 0:
[ 5 | 2   8   1   4 ]   --> Scan suffix for min (val = 1 at idx 3)
  ^           ^
 Swap arr[0] with arr[3]:
[ 1 | 2   8   5   4 ]   --> Sorted boundary advances to index 0!
\`\`\`

---

### The Minimal-Write Superpower

The single defining advantage of Selection Sort over all other $O(n^2)$ algorithms is its **bounded write operations**:
* Bubble Sort may execute up to $\\frac{n(n-1)}{2} \\approx O(n^2)$ swaps.
* Insertion Sort performs up to $O(n^2)$ memory writes during rightward element shifts.
* **Selection Sort executes at most $n - 1$ swaps across its entire execution!**

In hardware architectures where memory writes are computationally costly, power-hungry, or cause physical hardware degradation (e.g., EEPROM write fatigue, Flash memory blocks with limited write-erase cycles), Selection Sort's $O(n)$ write count is an essential algorithmic tool.

---

### In-Depth Stability Analysis (Why It Destroys Stability)

Selection Sort is inherently **Unstable**. Because the minimum element from the unsorted suffix is swapped over long distances across the array, it can jump over duplicate keys with identical values, inverting their original chronological order.

**Concrete Counterexample:**
* Consider input array: \`[(4, "red"), (4, "blue"), (2, "green")]\`
* Round 0 ($i = 0$): Scanning from index 0 to 2 locates global minimum \`(2, "green")\` at index 2.
* Swap $arr[0]$ with $arr[2]$:
  \`[(2, "green"), (4, "blue"), (4, "red")]\`
* **Notice:** \`(4, "blue")\` has jumped ahead of \`(4, "red")\`! Their relative original ordering was destroyed.

---

### Detailed Complexity Breakdown

| Metric | Complexity | Derivation & Theoretical Justification |
| :--- | :--- | :--- |
| **Best-Case Time** | $\\Omega(n^2)$ | Even if already sorted, the algorithm must exhaustively scan all $n - 1 - i$ suffix items to confirm no smaller item exists. |
| **Worst-Case Time** | $O(n^2)$ | Reverse-sorted array; performs exactly $\\frac{n(n-1)}{2}$ comparisons and $n - 1$ swaps. |
| **Average-Case Time**| $\\Theta(n^2)$ | Performs identical number of comparisons regardless of initial array permutation. |
| **Auxiliary Space** | $O(1)$ | Strictly in-place. Requires only index tracker variables (\`minIdx\`, \`i\`, \`j\`). |
| **Total Memory Writes** | $O(n)$ | Strictly bounded by $3(n - 1)$ scalar assignments; optimal for write-constrained hardware. |
| **Stability** | **Unstable** | Long-distance boundary swaps leapfrog identical elements. |
    `,
    quizTopicId: "selection",
    visualizerLink: {
      label: "Open Selection Sort in Interactive Visualizer",
      algorithmId: "selection",
      path: "/algorithms/selection"
    }
  },
  {
    slug: "insertion-sort",
    level: 1,
    levelTitle: "Level 1: The Simple Algorithms",
    order: 3,
    title: "Insertion Sort: Hand-Sorting, Shifting & Adaptive Execution",
    subtitle: "The card-player's algorithm: extracting keys, shifting elements rightward, and why modern runtimes switch to it for small subarrays.",
    estimatedReadTime: "11 min",
    category: "Simple Algorithms",
    banglaNote: {
      topic: "ইনসার্শন সর্ট ও তাসের মতো সাজানো (Insertion Sort Deep Dive)",
      englishContext: "Insertion Sort builds the final sorted array one item at a time by shifting larger elements rightwards and inserting each key into its correct position.",
      banglaText: `
### 💡 সহজ উপমা: হাতের তাস গোছানো
আমরা যখন তাস খেলি, তখন এক হাত দিয়ে নতুন একটা তাস তুলে নিই এবং হাতের ভেতর থাকা আগের সাজানো তাসগুলোর সাথে তুলনা করে ঠিক যে জায়গায় বসালে ক্রম ঠিক থাকবে, সেখানে নতুন তাসটি গুঁজে (Insert) দিই।

### 🔍 ধাপে ধাপে কার্যপদ্ধতি (How It Works):
১. **প্রথম উপাদান স্বয়ংক্রিয়ভাবে সাজানো:** ১টি উপাদান থাকলে তা এমনিতেই সাজানো থাকে। তাই লুপ শুরু হয় ইনডেক্স ১ থেকে।
২. **কী (Key) সংরক্ষণ:** ইনডেক্স $i$-এর মানটি একটি অস্থায়ী ভ্যারিয়েবল \`key\`-তে তুলে রাখা হয়।
৩. **ডানে চাপানো (Rightward Shift):** বামপাশের সাজানো অংশের যে সংখ্যাগুলো \`key\`-এর চেয়ে বড়, তাদের এক ঘর করে ডানপাশে চাপিয়ে (Shift) দেওয়া হয়।
৪. **সঠিক স্থানে স্থাপন:** যেখানেই \`key\`-এর চেয়ে ছোট বা সমান সংখ্যা পাওয়া যায়, ঠিক তার পরের খালি জায়গায় \`key\` বসিয়ে দেওয়া হয়।

### 🚀 কেন বাস্তব ইঞ্জিনে ইনসার্শন সর্ট ব্যবহার করা হয়?
- পাইথনের ডিফল্ট সর্টিং অ্যালগরিদম **Timsort** এবং গুগল ক্রোমের জাভাস্ক্রিপ্ট ইঞ্জিন **V8** উভয়েই ছোট অ্যারেতে ($n \\le 16$ বা $32$) কুইক সর্টের বদলে ইনসার্শন সর্ট চালায়!
- **কারণ:** এতে কোনো ফাংশন কলের বাড়তি খরচ নেই, মেমোরি ক্যাশ লোকালিটি চমৎকার, এবং প্রায় সাজানো ডাটায় এটি চোখের পলকে $O(n)$ সময়ে শেষ হয়।

### ⏱️ টাইম ও স্পেস কমপ্লেক্সিটি:
- **Best Case ($O(n)$):** যদি ডাটা আগে থেকেই সাজানো থাকে, তবে ভেতরের \`while\` লুপ মাত্র ১ বার চেক করেই থেমে যায়।
- **Worst Case ($O(n^2)$):** যদি সম্পূর্ণ উল্টো ক্রমে সাজানো থাকে, তবে প্রতিটি উপাদানের জন্য পুরো বামপাশ ডানে সরাতে হয়।
- **Space Complexity ($O(1)$ In-Place):** কোনো বাড়তি মেমোরি বরাদ্দ করতে হয় না।
- **স্ট্যাবিলিটি (Stable):** সমান মানের সংখ্যা এলে শিফটিং বন্ধ হয়ে যায় (\`arr[j] > key\`), ফলে আদি ক্রম ১০০% অক্ষুণ্ণ থাকে।

### ⚠️ ইন্টারভিউ টিপস ও সাধারণ ভুল:
অনেক শিক্ষার্থী সোয়াপ (\`swap\`) দিয়ে ইনসার্শন সর্ট লেখার চেষ্টা করে। সোয়াপে ৩টি মেমোরি অ্যাসাইনমেন্ট লাগে, যেখানে একমুখী শিফটে মাত্র ১টি অ্যাসাইনমেন্ট লাগে। তাই সোয়াপের বদলে সবসময় শিফট ব্যবহার করাই স্ট্যান্ডার্ড।
      `,
    },
    content: `
### The Card-Player's Mental Model & Shift Mechanics

Insertion Sort mirrors the natural human heuristic for ordering playing cards held in a hand. You inspect the hand from left to right: at any moment, the cards in your left hand are sorted, while cards on the table are unsorted. You pluck the next card from the table (the **Key**) and scan backwards through your hand, sliding larger cards to the right to clear a slot before dropping the key into place.

A common implementation blunder is using full pairwise \`std::swap\` calls inside the backwards loop. A swap requires $3$ assignments ($tmp = a; a = b; b = tmp$). In contrast, standard Insertion Sort performs **one-way rightward shifts** ($arr[j+1] = arr[j]$), executing only $1$ assignment per inversion plus $2$ boundary writes for the key.

\`\`\`
Array: [ 2, 5, 8 | 4 ]  --> key = 4
Compare with 8: 8 > 4   --> Shift 8 right: [ 2, 5, _, 8 ]
Compare with 5: 5 > 4   --> Shift 5 right: [ 2, _, 5, 8 ]
Compare with 2: 2 <= 4  --> Stop shift!
Insert key into slot 1  --> [ 2, 4, 5, 8 ]
\`\`\`

---

### Loop Invariant & Adaptivity

* **Formal Invariant:** At the start of iteration $i$, subarray $arr[0 \\dots i - 1]$ consists of the original elements from that range in fully sorted order.
* **The Adaptivity Theorem:** Let $I(A)$ represent the total number of inversions in the array (pairs $(i, j)$ such that $i < j$ but $arr[i] > arr[j]$). The running time of Insertion Sort is bounded by:
  $$T(n) = \\Theta(n + I(A))$$
  When an array is nearly sorted ($I(A) = O(n)$), Insertion Sort executes in blazing $O(n)$ linear time, beating even Quick Sort and Merge Sort!

---

### Why Production Engines Love Insertion Sort (Hybrid Systems)

Modern language standard libraries rarely use pure Quick Sort or pure Merge Sort. Instead, they deploy **Hybrid Sorting Architectures**:
* **C++ \`std::sort\` (Introsort):** Uses Quick Sort, falls back to Heap Sort if recursion exceeds $2 \\log n$, and switches to **Insertion Sort** whenever partition size drops below $16$ elements.
* **Python & Java \`Arrays.sort\` (Timsort):** Splits data into natural monotonic runs and uses **Insertion Sort (Binary Insertion Sort)** to sort tiny partitions.
* **V8 JavaScript Engine:** Runs Insertion Sort on small arrays to avoid recursion stack frames and exploit CPU L1 data cache locality.

---

### Detailed Complexity & Mechanical Analysis

| Metric | Complexity | Derivation & Justification |
| :--- | :--- | :--- |
| **Best-Case Time** | $\\Omega(n)$ | Array is already sorted; inner while condition \`arr[j] > key\` fails immediately for each $i$. Total comparisons: $n - 1$. |
| **Worst-Case Time** | $O(n^2)$ | Reverse-sorted array; key must shift past every element on its left. Comparisons & shifts: $\\frac{n(n-1)}{2}$. |
| **Average-Case Time**| $\\Theta(n^2)$ | On random permutations, each element shifts past half of the sorted prefix on average ($\\approx \\frac{n^2}{4}$ shifts). |
| **Auxiliary Space** | $O(1)$ | Strictly in-place. Requires only one scalar \`key\` cache and iteration index \`j\`. |
| **Stability** | **Stable** | The test \`arr[j] > key\` is strictly greater than; shifting terminates when an equal key is encountered, preserving relative order. |
    `,
    quizTopicId: "insertion",
    visualizerLink: {
      label: "Open Insertion Sort in Interactive Visualizer",
      algorithmId: "insertion",
      path: "/algorithms/insertion"
    }
  },

  // ==========================================
  // LEVEL 2: DIVIDE AND CONQUER
  // ==========================================
  {
    slug: "what-is-recursion",
    level: 2,
    levelTitle: "Level 2: Divide & Conquer",
    order: 1,
    title: "What Is Recursion?",
    subtitle: "Understanding base cases, call stacks, and self-referential problem decomposition before sorting.",
    estimatedReadTime: "8 min",
    category: "Divide and Conquer",
    content: `
### What Is Recursion?

Recursion is a programming technique where a function solves a complex problem by **calling itself on smaller sub-instances** of the exact same problem, until it reaches a trivial stopping point called the **base case**.

---

### The Two Non-Negotiable Rules of Recursion:

1. **The Base Case**: A simple condition where the function returns immediately without making another recursive call. Without a base case, recursion runs infinitely until the program crashes with a *Stack Overflow*.
2. **The Recursive Step**: Making a call to itself with arguments that move strictly *closer* to the base case.

---

### A Simple Non-Sorting Example: Countdown

\`\`\`cpp
void countdown(int n) {
    // 1. Base Case
    if (n <= 0) {
        std::cout << "Blast off!\n";
        return;
    }
    // 2. Work
    std::cout << n << "...\n";
    // 3. Recursive Step (n decreases toward 0)
    countdown(n - 1);
}
\`\`\`

---

### The Call Stack: How the CPU Tracks Frames

Every time a function calls itself, the CPU pushes a new **Stack Frame** (Activation Record) containing local variables and the return address onto the call stack. When a base case is hit, the stack begins **unwinding**, returning control backwards up the chain.
    `,
    banglaNote: {
      topic: "Recursion (রিকার্সন)",
      englishContext: "Recursion is a technique where a function calls itself on smaller inputs until hitting a base case.",
      // [REVIEW DRAFT] Bengali translation for user review
      banglaText: `
**রিকার্সন (Recursion) বাংলায় সহজভাবে:**

রিকার্সন মানে হলো **একটি বড় কাজকে নিজেরই ছোট ভার্সনে ভাগ করে সমাধান করা**। 

💡 **বাস্তব উদাহরণ: রাশিয়ান পুতুল (Russian Matryoshka Doll)**
আপনার সামনে একটি বড় পুতুল আছে। আপনি সেটা খুললেন, ভেতরে আরেকটা ছোট পুতুল পেলেন। সেটাও খুললেন, আরও ছোট পুতুল পেলেন। এভাবে খুলতে খুলতে যখন এমন একটি পুতুল পাবেন যার ভেতরে আর কিছু নেই — সেটাই হলো **Base Case**!

⚙️ **কোডিংয়ে দুটি জরুরি শর্ত:**
1. **Base Case (থামার শর্ত):** ফাংশনটি কখন কাজ বন্ধ করবে? (যেমন: অ্যারেতে যখন মাত্র ১টি সংখ্যা বাকি থাকে, তখন নতুন করে সর্ট করার দরকার নেই)।
2. **Recursive Step:** প্রতিবার ইনপুট সাইজ কমিয়ে নিজেকে আবার কল করা।

👉 Base Case না দিলে প্রোগ্রাম আজীবন চলতে থাকবে এবং মেমোরি শেষ হয়ে **Stack Overflow** ক্র্যাশ করবে!
      `
    }
  },
  {
    slug: "merge-sort",
    level: 2,
    levelTitle: "Level 2: Divide & Conquer",
    order: 2,
    title: "Merge Sort: Guaranteed O(n log n) & Stable Merging",
    subtitle: "Splitting arrays into halves, recursive call-tree decomposition, two-pointer linear merging, and external disk-based sorting.",
    estimatedReadTime: "12 min",
    category: "Divide and Conquer",
    banglaNote: {
      topic: "মার্জ সর্ট ও ডিভাইড অ্যান্ড কনকার আর্কিটেকচার (Merge Sort Deep Dive)",
      englishContext: "Merge Sort divides the array into halves, sorts them recursively, and combines the two sorted halves using a two-pointer linear merge step.",
      banglaText: `
### 💡 সহজ উপমা: পরীক্ষার খাতা একত্রীকরণ ও সুশৃঙ্খল টিমওয়ার্ক
ধরা যাক একটি পরীক্ষার ২০০টি খাতা এলোমেলোভাবে পড়ে আছে। প্রধান পরীক্ষক কাজ সহজ করার জন্য ১০০টি ১০০টি করে খাতা দুজন শিক্ষকের মাঝে ভাগ করে দিলেন। শিক্ষকরা আবার ৫০টি ৫০টি করে ভাগ করে নিজেরা আগে ছোট ভাগগুলো সাজিয়ে নিলেন। সবশেষে প্রধান পরীক্ষক দুজনের সাজানো খাতার স্তূপ সামনে নিয়ে প্রতিবার ওপরের দুটি খাতার রোল নম্বর তুলনা করে ছোটটিকে তুলে নিয়ে এক নিমেষে ২০০টি খাতা সম্পূর্ণ সাজিয়ে ফেললেন!

### 🔍 ৩টি মূল স্তম্ভ ও ধাপে ধাপে কার্যপদ্ধতি:
১. **Divide (ভাগ করো):** অ্যারের ঠিক মাঝখানের ইনডেক্স \`mid = left + (right - left) / 2\` বের করে অ্যারেকে সমান দুই টুকরোয় বিভক্ত করা হয় ($O(1)$ সময়)।
২. **Conquer (জয় করো):** রিকার্শনের মাধ্যমে বাম এবং ডান দুই অংশকে আলাদাভাবে সর্ট করা হয়। যতক্ষণ না টুকরোটিতে মাত্র ১টি সংখ্যা অবশিষ্ট থাকে, ততক্ষণ ভাগ করা চলতে থাকে (Base Case: ১টি উপাদান স্বয়ংক্রিয়ভাবে সাজানো থাকে)।
৩. **Combine / Merge (একত্রিত করো):** টু-পয়েন্টার (Two-Pointer) টেকনিক দিয়ে সাজানো দুই ভাগের উপাদান তুলনা করে ছোটটিকে একটি টেম্পোরারি বাফারে তুলে আনা হয় ($O(n)$ সময়)। সবশেষে মূল অ্যারেতে কপি করে দেওয়া হয়।

### ⏱️ গ্যারান্টিযুক্ত $O(n \log n)$ স্পিড:
- **কেন সবসময় $O(n \log n)$?** ইনপুট যেমনই থাকুক (সম্পূর্ণ এলোমেলো, সাজানো, বা উল্টো সাজানো), প্রতিবার ঠিক অর্ধেক করে ভাগ করার কারণে রিকার্শন ট্রির মোট গভীরতা বা উচ্চতা সবসময় $\\log_2 n$ হয়। আর প্রতিটি লেভেলে সব নোড মার্জ করতে মোট কাজ হয় $O(n)$। সুতরাং মোট সময় = $O(n \\log n)$।
- **Space Complexity ($O(n)$ Auxiliary):** মার্জ করার সময় উপাদানগুলো অস্থায়ীভাবে রাখার জন্য মূল অ্যারের সমান আকারের একটি বাড়তি মেমোরি বাফার লাগে। তাই এটি ইন-প্লেস নয়।
- **স্ট্যাবিলিটি (Stable):** মার্জ করার শর্তে \`arr[i] <= arr[j]\` ব্যবহারের ফলে সমান মানের দুটি সংখ্যার মধ্যে বামপাশের সংখ্যাটিই সবসময় আগে বাফারে স্থান পায়, ফলে আদি ক্রম ১০০% অক্ষুণ্ণ থাকে।

### 🌐 বাস্তব জীবনে কোথায় ব্যবহৃত হয়?
১. **লিঙ্কড লিস্ট সর্টিং:** লিঙ্কড লিস্টে কোনো বাড়তি মেমোরি অ্যারে তৈরি না করেই শুধুমাত্র নোডগুলোর পয়েন্টার রিবাইন্ড করে $O(1)$ বাড়তি স্পেসেই মার্জ সর্ট চালানো যায়!
২. **এক্সটার্নাল সর্টিং (External Sort):** যখন ডেটাসেটের সাইজ এত বড় হয় (যেমন ১০০ গিগাবাইট বা ১০ টেরাবাইট) যে তা কম্পিউটারের র‍্যামে ধরে না, তখন হার্ডডিস্কে চাঙ্ক আকারে রেখে মার্জ সর্ট চালানো হয় (ডাটাবেজ ইঞ্জিন ও বিগ-ডাটা পাইপলাইন)।
      `,
    },
    content: `
### Theoretical Framework: Divide and Conquer Paradigm

Merge Sort is the canonical exemplar of the **Divide and Conquer** algorithmic paradigm. Rather than repeatedly performing localized swaps across the entire array, Merge Sort structurally decomposes an intractable problem of size $n$ into two independent subproblems of size $n/2$, solves them recursively, and synthesizes the final sorted output through a deterministic linear **Merge** operation.

The algorithm proceeds through three invariant phases:
1. **Divide:** Compute the arithmetic midpoint:
   $$mid = low + \\left\\lfloor \\frac{high - low}{2} \\right\\rfloor$$
   Bisect the continuous range $[low \\dots high]$ into two disjoint intervals: $[low \\dots mid]$ and $[mid + 1 \\dots high]$.
2. **Conquer:** Recursively invoke \`mergeSort\` on both sub-intervals until reaching the base case: a subarray containing $\\le 1$ element, which is vacuously sorted.
3. **Combine (Merge):** Interleave the two independently sorted contiguous sequences into a unified non-decreasing sequence in linear time $\\Theta(n)$.

---

### Mathematical Proof of $O(n \\log n)$ via Master Theorem

The recurrence relation governing Merge Sort's execution time is:
$$T(n) = 2T\\left(\\frac{n}{2}\\right) + \\Theta(n)$$
where:
* $2T(n/2)$ models the dual recursive subproblem invocations.
* $\\Theta(n)$ represents the linear merging phase.

Applying the Master Theorem ($a = 2, b = 2, f(n) = \\Theta(n)$):
$$\\log_b a = \\log_2 2 = 1 \\implies f(n) = \\Theta(n^1) = \\Theta(n^{\\log_b a})$$
This satisfies **Case 2** of the Master Theorem, proving conclusively that:
$$T(n) = \\Theta(n \\log n)$$
Because the division is purely structural (bisection regardless of element values), Merge Sort runs in **strictly $\\Theta(n \\log n)$ time in the Best, Average, AND Worst cases**!

\`\`\`
Recursion Tree Level:
Level 0:                 [       n       ]            --> Total Work = c * n
                        /                 \\
Level 1:         [  n/2  ]               [  n/2  ]     --> Total Work = c * n
                 /       \\               /       \\
Level 2:     [ n/4 ]   [ n/4 ]       [ n/4 ]   [ n/4 ] --> Total Work = c * n
...
Tree Height = log2(n) levels
Total Running Time = c * n * log2(n) = Theta(n log n)
\`\`\`

---

### Two-Pointer Linear Merge Mechanics & Stability Proof

The merging phase maintains three index pointers:
* $i = low$ traversing the sorted left subarray $[low \\dots mid]$.
* $j = mid + 1$ traversing the sorted right subarray $[mid + 1 \\dots high]$.
* $k$ populating the auxiliary staging buffer \`temp\`.

**The Stability Criterion:**
To preserve algorithmic stability, whenever $arr[i] == arr[j]$, the algorithm MUST prioritize the element from the left subarray:
\`\`\`cpp
if (arr[i] <= arr[j]) { // '<=' GUARANTEES STABILITY
    temp.push_back(arr[i++]);
} else {
    temp.push_back(arr[j++]);
}
\`\`\`
If a strict \`<\` were used instead, an equal element from the right half would be copied first, inverting the original order of identical keys and breaking stability.

---

### Detailed Complexity & Engineering Trade-Offs

| Metric | Complexity | Theoretical Justification |
| :--- | :--- | :--- |
| **Best-Case Time** | $\\Theta(n \\log n)$ | Array is always bisected into equal halves; merging always inspects $\\Theta(n)$ items. |
| **Worst-Case Time** | $\\Theta(n \\log n)$ | Guaranteed upper bound; zero pathological input cases exist. |
| **Average-Case Time**| $\\Theta(n \\log n)$ | Identical recursion topology regardless of input permutation. |
| **Auxiliary Space** | $O(n)$ | Requires a secondary linear buffer of size $n$ to merge elements. |
| **Stability** | **Stable** | Left-half preference (\`<=\`) preserves original chronological ordering. |

---

### Industrial Application: External Merge Sort

When datasets exceed physical RAM (e.g., sorting 500 GB of log files on a machine with 16 GB RAM), Merge Sort is the industry-standard algorithm:
1. Stream 10 GB chunks of raw data into RAM, sort each chunk using in-memory Quick Sort, and write sorted "runs" back to disk.
2. Perform a multi-way external merge pass, streaming sorted runs through a Min-Heap priority queue directly to the final output file.
    `,
    quizTopicId: "merge",
    visualizerLink: {
      label: "Open Merge Sort in Interactive Visualizer",
      algorithmId: "merge",
      path: "/algorithms/merge"
    }
  },
  {
    slug: "quick-sort",
    level: 2,
    levelTitle: "Level 2: Divide & Conquer",
    order: 3,
    title: "Quick Sort: In-Place Partitioning & Pivot Architectures",
    subtitle: "Divide and conquer via Lomuto & Hoare partitioning schemes, pivot selection strategies, and avoiding catastrophic O(n²) degradation.",
    estimatedReadTime: "12 min",
    category: "Divide and Conquer",
    banglaNote: {
      topic: "কুইক সর্ট ও ইন-প্লেস পার্টিশনিং (Quick Sort Deep Dive)",
      englishContext: "Quick Sort selects a pivot element, partitions the array around it so smaller values move left and larger values move right, then recurses on both partitions.",
      banglaText: `
### 💡 সহজ উপমা: ক্লাসের একজনকে মধ্যমণি (Pivot) বানিয়ে দুই দল করা
ধরা যাক একটি ক্লাসের শিক্ষার্থীদের উচ্চতা অনুযায়ী সাজাতে হবে। শিক্ষক ক্লাসের যেকোনো একজনকে মধ্যমণি বা **পিভট (Pivot)** হিসেবে মঞ্চের মাঝে দাঁড় করালেন। এরপর বাকি সবাইকে বললেন — "তোমাদের মধ্যে যারা এই পিভটের চেয়ে খাটো তারা সবাই বামে চলে যাও, আর যারা লম্বা তারা ডানে চলে যাও।" পিভট ছাত্রটি কিন্তু ঠিক তার চূড়ান্ত সঠিক অবস্থানে বসে গেল! এবার বামপাশের খাটো দল এবং ডানপাশের লম্বা দলের ওপর শিক্ষক একইভাবে পিভট বেছে পুনরাবৃত্তি করলেন।

### 🔍 পার্টিশনিং যেভাবে কাজ করে (Lomuto Partitioning):
১. **পিভট নির্বাচন:** সাধারণত অ্যারের শেষ উপাদানটিকে (\`arr[high]\`) পিভট হিসেবে বেছে নেওয়া হয়।
২. **ছোট দলের সীমানা (\`i\`):** একটি পয়েন্টার $i$ রাখা হয় যা পিভটের চেয়ে ছোট উপাদানের শেষ সীমানা চিহ্নিত করে (শুরুতে \`low - 1\`)।
৩. **স্ক্যানিং (\`j\`):** অন্য একটি পয়েন্টার $j$ দিয়ে \`low\` থেকে \`high - 1\` পর্যন্ত প্রতিটি উপাদান পরীক্ষা করা হয়। যদি \`arr[j] < pivot\` হয়, তবে $i$ এক ঘর বাড়িয়ে \`arr[i]\` এবং \`arr[j]\`-এর মাঝে সোয়াপ করা হয়।
৪. **পিভটের চূড়ান্ত আসন:** স্ক্যান শেষ হলে পিভটটিকে $i + 1$ ইনডেক্সের সাথে সোয়াপ করা হয়। পিভট তার স্থায়ী আসনে বসে যায় এবং জীবনে আর কখনো স্থান পরিবর্তন করবে না!

### ⚠️ কুইক সর্টের মারাত্মক ফাঁদ ($O(n^2)$ Worst Case):
- যদি অ্যারে আগে থেকেই সাজানো থাকে বা সম্পূর্ণ উল্টো সাজানো থাকে, আর আপনি সবসময় শেষ উপাদানকে পিভট ধরেন, তবে গাছটির একপাশে কোনো উপাদান থাকে না ($0$ এবং $n - 1$ বিভাজন)।
- এতে রিকার্শন ট্রির গভীরতা $\\log n$ না হয়ে সোজা $n$ হয়ে যায়, যার ফলে মোট সময় দাঁড়ায় $O(n^2)$ এবং রিকার্শন স্ট্যাক মেমোরি শেষ হয়ে **Stack Overflow** ক্র্যাশ করতে পারে!
- **বাস্তব সমাধান:** আধুনিক সফটওয়্যারে সবসময় **Randomized Pivot** (লটারির মতো র‍্যান্ডম উপাদান বেছে নেওয়া) অথবা **Median-of-Three** (প্রথম, মাঝের ও শেষের ৩টি মানের মধ্যক) ব্যবহার করা হয়।

### ⏱️ টাইম ও স্পেস কমপ্লেক্সিটি:
- **Average Case ($O(n \\log n)$):** গড়ে এটি মার্জ সর্টের চেয়েও প্রায় ২ থেকে ৩ গুণ দ্রুত কাজ করে, কারণ এতে কোনো অতিরিক্ত মেমোরি অ্যারে তৈরি করতে হয় না এবং সিপিইউ এল১ ক্যাশের ব্যবহার অতুলনীয়।
- **Worst Case ($O(n^2)$):** অসতর্ক পিভট নির্বাচনে বা আনব্যালেন্সড পার্টিশনে।
- **Space Complexity ($O(\\log n)$ Auxiliary):** ইন-প্লেস সর্টিং, কোনো বাড়তি অ্যারে লাগে না, শুধু কল স্ট্যাকের জন্য $\\log n$ জায়গা লাগে।
- **স্ট্যাবিলিটি (Unstable):** দূরবর্তী উপাদানগুলোর মধ্যে সোয়াপ করার কারণে সমান মানের সংখ্যার আদি ক্রম নষ্ট হতে পারে।
      `,
    },
    content: `
### Partitioning: The Mechanical Engine of Quick Sort

Unlike Merge Sort which performs its computational heavy-lifting *after* recursive descent (during the linear merge phase), Quick Sort executes all algorithmic work *before* recursion during **Partitioning**:

1. **Pivot Selection:** An element $P$ is selected from the array range $[low \\dots high]$ according to a defined heuristic (last element, random index, or median-of-three).
2. **Partitioning:** The array is rearranged in-place such that all elements strictly smaller than $P$ are grouped to its left, and all elements greater than or equal to $P$ are grouped to its right.
3. **The Permanent Seat Invariant:** At the conclusion of partitioning, the pivot $P$ is placed into its final, globally sorted index $pIdx$. **The pivot will never move again for the remainder of execution.**
4. **Independent Sub-Recursion:** The algorithm recurses independently on the left partition $[low \\dots pIdx - 1]$ and right partition $[pIdx + 1 \\dots high]$.

---

### Lomuto Partitioning Scheme: Step-by-Step Mechanics

Lomuto's algorithm uses two moving pointers traversing in the same direction:
* Pointer $i$ tracks the boundary of elements verified to be $< pivot$ (initialized to $low - 1$).
* Pointer $j$ scans every candidate element from $low$ up to $high - 1$.

\`\`\`
Pivot = arr[high] = 4
Array: [ 2   8   7   1   3   5   6 | 4 ]
         ^                       ^
         j                      pivot

When arr[j] < pivot:
  1. Increment boundary: ++i
  2. Swap arr[i] with arr[j]
  
Final Step: Swap arr[i + 1] with arr[high] (pivot).
Result: [ 2   1   3 | 4 | 7   8   5   6 ]
          < 4       pivot      >= 4
\`\`\`

---

### The Catastrophic Worst-Case Degradation ($O(n^2)$)

When the pivot consistently bisects the array into maximally unbalanced partitions of size $0$ and $n - 1$ (e.g., sorting an already-sorted array with a naive last-element pivot):
$$T(n) = T(n - 1) + T(0) + \\Theta(n) = T(n - 1) + \\Theta(n)$$
Expanding this arithmetic summation yields:
$$T(n) = \\sum_{k=1}^n k = \\frac{n(n + 1)}{2} \\in \\Theta(n^2)$$
Furthermore, the recursion call stack depth explodes from $O(\\log n)$ to $O(n)$, causing fatal **Stack Overflow** runtime crashes on large datasets!

### Industrial Solutions to Worst-Case Degradation:
1. **Randomized Quick Sort:** Pick a uniform random index $r \\in [low, high]$ and swap $arr[r]$ with $arr[high]$ before partitioning. This guarantees an expected $\\Theta(n \\log n)$ time regardless of input permutation.
2. **Median-of-Three:** Sample $\{arr[low], arr[mid], arr[high]\}$ and use their median as the pivot.
3. **Introsort (C++ \`std::sort\`):** Tracks recursion depth. If depth exceeds $2 \\lfloor \\log_2 n \\rfloor$, it immediately switches execution to **Heap Sort**, guaranteeing $O(n \\log n)$ worst-case safety!

---

### Detailed Complexity & Mechanical Analysis

| Metric | Complexity | Theoretical Justification |
| :--- | :--- | :--- |
| **Best-Case Time** | $\\Theta(n \\log n)$ | Pivot perfectly bisects array into two equal halves at every level. |
| **Average-Case Time**| $\\Theta(n \\log n)$ | Expected performance over random permutations; cache-efficient linear partitioning. |
| **Worst-Case Time** | $O(n^2)$ | Pathological pivots yield $0$ vs $n-1$ partition splits; recursion tree degrades into linear chain. |
| **Auxiliary Space** | $O(\\log n)$ avg / $O(n)$ worst | Strictly in-place data rearrangement; memory consumed solely by recursive call stack frames. |
| **Stability** | **Unstable** | Long-distance partition swaps across the pivot boundary disrupt chronological order of duplicate keys. |
    `,
    quizTopicId: "quick",
    visualizerLink: {
      label: "Open Quick Sort in Interactive Visualizer",
      algorithmId: "quick",
      path: "/algorithms/quick"
    }
  },

  // ==========================================
  // LEVEL 3: ADVANCED ANALYSIS
  // ==========================================
  {
    slug: "proof-on2-bubble-insertion",
    level: 3,
    levelTitle: "Level 3: Advanced Analysis",
    order: 1,
    title: "Formal Proof: Why Bubble and Insertion Are O(n²)",
    subtitle: "Summing arithmetic series and exact operation counting for quadratic algorithms.",
    estimatedReadTime: "8 min",
    category: "Advanced Analysis",
    content: `
### Mathematical Derivation of Comparison Bounds

Let us formally prove why Bubble Sort, Selection Sort, and Insertion Sort have worst-case time complexities of $\\Theta(n^2)$.

---

### The Summation of Comparisons

In an array of length $n$:
- Outer iteration $0$: makes $n - 1$ comparisons.
- Outer iteration $1$: makes $n - 2$ comparisons.
- $\\dots$
- Outer iteration $n - 2$: makes $1$ comparison.

The total number of comparisons $C(n)$ is an arithmetic progression:

$$C(n) = \\sum_{i=1}^{n-1} i = 1 + 2 + 3 + \\dots + (n-1)$$

Using Gauss's summation formula $S = \\frac{k(k+1)}{2}$ where $k = n - 1$:

$$C(n) = \\frac{(n-1)(n)}{2} = \\frac{1}{2}n^2 - \\frac{1}{2}n$$

---

### Asymptotic Rigor

Under asymptotic notation definitions, we choose constants $c_1 = \\frac{1}{4}$, $c_2 = \\frac{1}{2}$, and $n_0 = 2$:

$$c_1 n^2 \\le \\frac{1}{2}n^2 - \\frac{1}{2}n \\le c_2 n^2 \\quad \\forall n \\ge n_0$$

Hence, $C(n) = \\Theta(n^2)$. $\\blacksquare$
    `,
    banglaNote: {
      topic: "O(n²) Proof (গাণিতিক প্রমাণ)",
      englishContext: "Summing the arithmetic series 1 + 2 + ... + (n-1) yields n(n-1)/2 = O(n²).",
      // [REVIEW DRAFT] Bengali translation for user review
      banglaText: `
**কেন বাবল ও ইনসার্শন সর্ট $O(n^2)$ সময় নেয়?**

আমরা যখন নেস্টেড লুপ চালাই, তখন প্রথম ধাপে তুলনা করতে হয় $(n-1)$ বার, দ্বিতীয় ধাপে $(n-2)$ বার, এভাবে শেষ পর্যন্ত ১ বার।

মোট তুলনার যোগফল:
$$1 + 2 + 3 + \\dots + (n-1) = \\frac{n(n-1)}{2} = \\frac{n^2 - n}{2}$$

এখানে $n^2$-এর বৃদ্ধির হারের কাছে $-n$ বা $\\frac{1}{2}$ ধ্রুবকগুলো নগণ্য। তাই আমরা বলি এটি **$O(n^2)$**।
      `
    },
    quizTopicId: "advanced-analysis"
  },
  {
    slug: "why-merge-is-always-nlogn",
    level: 3,
    levelTitle: "Level 3: Advanced Analysis",
    order: 2,
    title: "Why Merge Sort Is Guaranteed O(n log n)",
    subtitle: "Deriving recurrence relations using the recursion tree method and Master Theorem.",
    estimatedReadTime: "9 min",
    category: "Advanced Analysis",
    content: `
### The Recursion Tree Analysis

Merge Sort splits an array of size $n$ into 2 subproblems of size $n/2$, and requires $c \\cdot n$ work to merge them:

$$T(n) = 2T\\left(\\frac{n}{2}\\right) + cn$$

---

### Visualizing the Tree Levels

- **Level 0 (Root)**: 1 problem of size $n$ $\\rightarrow$ Work = $cn$
- **Level 1**: 2 subproblems of size $n/2$ $\\rightarrow$ Work = $2 \\cdot c(n/2) = cn$
- **Level 2**: 4 subproblems of size $n/4$ $\\rightarrow$ Work = $4 \\cdot c(n/4) = cn$
- $\\dots$
- **Level $k$**: $2^k$ subproblems of size $n/2^k$ $\\rightarrow$ Work = $2^k \\cdot c(n/2^k) = cn$

The tree reaches single-element base cases when $n/2^k = 1 \\implies k = \\log_2 n$.

---

### Total Work Calculation

$$\\text{Total Work} = \\sum_{k=0}^{\\log_2 n} (\\text{Work at Level } k) = (cn) \\times (\\log_2 n + 1) = O(n \\log n)$$

Because the physical division into halves is determined solely by indices ($mid = left + (right-left)/2$), **the input data order can never distort the tree shape**. Best, Average, and Worst cases are all strictly $\\Theta(n \\log n)$!
    `,
    banglaNote: {
      topic: "Merge Sort O(n log n) Guarantee",
      englishContext: "Merge sort's recursion tree always has log n levels with n work per level, guaranteeing O(n log n).",
      // [REVIEW DRAFT] Bengali translation for user review
      banglaText: `
**মার্জ সর্টের সময় কেন সবসময় $O(n \\log n)$ থাকে?**

কুইক সর্টের মতো মার্জ সর্ট কখনোই ইনপুটের ওপর নির্ভর করে না। 

🌳 **গাছের মতো ভাবুন:**
- একটি অ্যারেকে অর্ধেক করতে করতে শেষ পর্যন্ত মোট ধাপ লাগে $\\log_2 n$ টি লেভেল।
- প্রতিটি লেভেলে সব সংখ্যা মিলিয়ে মার্জ করতে মোট কাজ হয় $n$ টি।
- সুতরাং, মোট সময় = $(\\text{লেভেল সংখ্যা}) \\times (\\text{প্রতি লেভেলের কাজ}) = n \\times \\log_2 n$।

ইনপুটের সংখ্যাগুলো উল্টো থাকুক বা সোজা থাকুক, মার্জ সর্ট সবসময় ঠিক মাঝখান দিয়েই অ্যারে কাটে — তাই এর পারফরম্যান্স সবসময় গ্যারান্টিড $O(n \\log n)$!
      `
    },
    quizTopicId: "advanced-analysis"
  },
  {
    slug: "why-quicksort-degrades",
    level: 3,
    levelTitle: "Level 3: Advanced Analysis",
    order: 3,
    title: "Why Quick Sort Degrades to O(n²)",
    subtitle: "A step-by-step trace of worst-case partition collapses on pre-sorted arrays.",
    estimatedReadTime: "10 min",
    category: "Advanced Analysis",
    content: `
### The Pathology of Lomuto Partitioning on Sorted Inputs

Consider running Lomuto Quick Sort (picking the last element as pivot) on an **already-sorted array**:

$$\\text{arr} = [1, 2, 3, 4, 5]$$

---

### Step-by-Step Degradation Trace:

1. **Call 1 (\`low=0, high=4\`)**:
   - Pivot is \`arr[4] = 5\`.
   - Every element \`[1, 2, 3, 4]\` is $< 5$.
   - Left partition has size **4**, right partition has size **0**.
2. **Call 2 (\`low=0, high=3\`)**:
   - Pivot is \`arr[3] = 4\`.
   - Left partition has size **3**, right partition has size **0**.
3. **Call 3 (\`low=0, high=2\`)**:
   - Pivot is \`arr[2] = 3\`.
   - Left partition has size **2**, right partition has size **0**.

Instead of a balanced binary tree of depth $\\log n$, the recursion tree collapses into a **linked list of depth $n$**!

$$T(n) = T(n-1) + T(0) + O(n) = \\sum_{k=1}^n k = O(n^2)$$

---

### Production Fixes:

- **Randomized Pivot**: Pick a random index between $low$ and $high$ and swap it into $high$ before partitioning.
- **Median-of-Three**: Inspect \`arr[low]\`, \`arr[mid]\`, and \`arr[high]\`, taking the median value as the pivot.
    `,
    banglaNote: {
      topic: "Quick Sort Worst Case Degradation",
      englishContext: "When the pivot is always the maximum or minimum, recursion tree height becomes n, yielding O(n²).",
      // [REVIEW DRAFT] Bengali translation for user review
      banglaText: `
**কুইক সর্ট কেন খারাপ অবস্থায় $O(n^2)$ হয়ে যায়?**

সাধারণ কুইক সর্টে আমরা সবসময় শেষের উপাদানটিকে **Pivot** ধরি। 

এখন যদি অ্যারেটি আগেই সাজানো থাকে (যেমন: $[1, 2, 3, 4, 5]$):
- Pivot হবে $5$। বাকি ৪টি সংখ্যাই পিভটের বাঁপাশে চলে যাবে, ডানপাশে কিছুই থাকবে না!
- পরের ধাপে Pivot হবে $4$, বাঁপাশে ৩টি সংখ্যা।
- এর ফলে বাইনারি ট্রির উচ্চতা $\\log n$ না হয়ে সোজা $n$ হয়ে যায়।

👉 **সমাধান:** কোডিং ইন্টারভিউতে বা রিয়েল লাইফে আমরা তিনটি সংখ্যার মধ্যবর্তী মান (Median-of-Three) বা র‍্যান্ডম সংখ্যাকে Pivot নির্বাচন করি যাতে কখনো এমন খারাপ অবস্থা তৈরি না হয়।
      `
    },
    quizTopicId: "advanced-analysis"
  },
  {
    slug: "stability-analysis",
    level: 3,
    levelTitle: "Level 3: Advanced Analysis",
    order: 4,
    title: "Stability Formally Defined",
    subtitle: "Proof sketches of which algorithms preserve relative ordering of equal keys and why it matters in engineering.",
    estimatedReadTime: "8 min",
    category: "Advanced Analysis",
    content: `
### What Is Stability?

A sorting algorithm is **stable** if whenever two elements have equal comparison keys, their relative order in the sorted output matches their relative order in the original input sequence:

$$\\text{If } key(A) = key(B) \\text{ and } idx(A) < idx(B) \\implies idx_{sorted}(A) < idx_{sorted}(B)$$

---

### Why Stability Matters: Multi-Key Sorting

Suppose you have a spreadsheet of employees already sorted alphabetically by Name:

1. \`{ Name: "Alice", Department: "Sales" }\`
2. \`{ Name: "Bob", Department: "Engineering" }\`
3. \`{ Name: "Charlie", Department: "Sales" }\`

If you sort by **Department** using a **stable sort**, Alice remains before Charlie within the Sales group. An unstable sort might scramble them into Charlie, Alice!

---

### Algorithm Stability Scorecard:

| Algorithm | Stable? | Reason in the Code |
| :--- | :--- | :--- |
| **Bubble Sort** | **YES** | Only swaps when \`arr[j] > arr[j + 1]\` (strict inequality). |
| **Insertion Sort** | **YES** | \`while (j >= 0 && arr[j] > key)\` halts when \`arr[j] == key\`. |
| **Merge Sort** | **YES** | Merging prefers left subarray on equality (\`arr[i] <= arr[j]\`). |
| **Selection Sort** | **NO** | Swaps long distances over intervening duplicates. |
| **Quick Sort** | **NO** | Partition swaps elements across the pivot over wide distances. |
    `,
    banglaNote: {
      topic: "Stability (স্টেবিলিটি)",
      englishContext: "Stability guarantees that identical keys retain their relative order after sorting.",
      // [REVIEW DRAFT] Bengali translation for user review
      banglaText: `
**সর্টিংয়ে স্টেবিলিটি (Stability) বলতে কী বোঝায়?**

ধরে নিন ক্লাসের রোল নম্বর অনুযায়ী দুজন শিক্ষার্থীর একই নম্বর রয়েছে:
- রাকিব (রোল ৫)
- সাকিব (রোল ৫)

সর্ট করার পর যদি **রাকিব সবসময় সাকিবের আগেই থাকে** (যেহেতু সে শুরুতে আগে ছিল), তবে সেই অ্যালগরিদমটি **Stable**।

👉 **কেন জরুরি?** 
ডাটাবেজে আপনি প্রথমে নাম দিয়ে সর্ট করলেন, এরপর বয়স দিয়ে সর্ট করলেন। অ্যালগরিদম স্টেবল হলে একই বয়সের মানুষদের নামের ক্রম আগের মতোই ঠিক থাকবে, ওলটপালট হবে না।
      `
    },
    quizTopicId: "advanced-analysis"
  },
  {
    slug: "in-place-and-space-complexity",
    level: 3,
    levelTitle: "Level 3: Advanced Analysis",
    order: 5,
    title: "In-Place Sorting & Auxiliary Space",
    subtitle: "Distinguishing between memory buffers, pointer allocations, and recursion stack frames.",
    estimatedReadTime: "7 min",
    category: "Advanced Analysis",
    content: `
### What Qualifies as "In-Place"?

An algorithm is considered **In-Place** if it transforms the input sequence without allocating additional memory proportional to the input size $n$. Formally:

$$\\text{Auxiliary Space} = O(1) \\quad \\text{or at most } O(\\log n) \\text{ for stack frames.}$$

---

### Why Can't Merge Sort Easily Be In-Place?

When merging two contiguous sorted subarrays $[0 \\dots mid]$ and $[mid + 1 \\dots right]$ inside the same array, copying an element from the right half into the left half would overwrite and destroy an unread element in the left half!

To prevent data corruption, standard Merge Sort allocates a temporary buffer of size $O(n)$ to stage elements before copying back.

---

### Auxiliary Space vs Stack Space

- **Bubble, Selection, Insertion**: $O(1)$ auxiliary space, $0$ stack frames.
- **Quick Sort**: $O(1)$ auxiliary array memory, but requires $O(\\log n)$ call stack frames on average.
- **Merge Sort**: $O(n)$ auxiliary array buffers + $O(\\log n)$ stack frames.
    `,
    banglaNote: {
      topic: "In-Place & Space Complexity",
      englishContext: "In-place means modifying the array directly without allocating O(n) extra RAM buffers.",
      // [REVIEW DRAFT] Bengali translation for user review
      banglaText: `
**ইন-প্লেস (In-Place) সর্টিং কী?**

যে অ্যালগরিদম কাজ করার জন্য আলাদা কোনো বড় মেমোরি ধার না নিয়ে মূল অ্যারের ভেতরেই উপাদানগুলোর জায়গা অদলবদল করে সাজিয়ে ফেলে, তাকে **In-Place** অ্যালগরিদম বলে।

- **ইনসার্শন/বাবল সর্ট:** ইন-প্লেস ($O(1)$ মেমোরি)।
- **কুইক সর্ট:** ইন-প্লেস, তবে রিকার্সনের কল স্ট্যাকের জন্য সামান্য $O(\\log n)$ ফ্রেম লাগে।
- **মার্জ সর্ট:** ইন-প্লেস নয়! দুটো ভাগ জোড়া লাগানোর সময় যাতে ডেটা মুছে না যায়, তাই আলাদা একটি $O(n)$ সাইজের ফাঁকা অ্যারে তৈরি করতে হয়।
      `
    },
    quizTopicId: "advanced-analysis"
  },
  {
    slug: "hybrid-sorting-intro",
    level: 3,
    levelTitle: "Level 3: Advanced Analysis",
    order: 6,
    title: "Production Hybrids: Timsort & Introsort",
    subtitle: "How real-world standard libraries combine the strengths of multiple sorting algorithms.",
    estimatedReadTime: "6 min",
    category: "Advanced Analysis",
    content: `
### How Modern Languages Actually Sort

In real software engineering, standard libraries rarely use pure theoretical algorithms in isolation. Instead, they engineer **hybrid sorting algorithms** that exploit the strengths of multiple algorithms:

---

### 1. Timsort (Python \`list.sort()\` & Java \`Arrays.sort()\`)
- **Invented by**: Tim Peters in 2002 for Python.
- **Strategy**: Combines **Merge Sort** and **Insertion Sort**.
- **How it works**: Scans for natural already-sorted "runs" in the data. Extends short runs using Insertion Sort, and merges them using an optimized Merge Sort.
- **Guarantees**: $O(n)$ on sorted data, $O(n \\log n)$ worst case, **100% Stable**.

---

### 2. Introsort (C++ \`std::sort\`)
- **Invented by**: David Musser in 1997.
- **Strategy**: Begins with fast **Quick Sort**. If recursion stack depth exceeds $2 \\log n$ (detecting worst-case degradation), it seamlessly switches to **Heap Sort** to guarantee $O(n \\log n)$. For small partitions ($n < 16$), it finishes with **Insertion Sort**.
    `
  },

  // ==========================================
  // LEVEL 4: CHOOSING THE RIGHT ALGORITHM
  // ==========================================
  {
    slug: "decision-guide",
    level: 4,
    levelTitle: "Level 4: Choosing the Right Algorithm",
    order: 1,
    title: "The Ultimate Sorting Decision Guide",
    subtitle: "A practical engineering framework for choosing the right sorting algorithm given constraints.",
    estimatedReadTime: "8 min",
    category: "Decision Guide",
    content: `
### Practical Algorithm Selection Flowchart

When designing a system, use this decision framework to select the optimal sorting strategy:

\`\`\`
                     Is n <= 16 or nearly sorted?
                            /            \\
                         YES              NO
                         /                  \\
                 [Insertion Sort]    Is extra memory O(n) strictly prohibited?
                                            /                  \\
                                         YES                    NO
                                         /                        \\
                             Is stability required?        Is stability required?
                                /             \\               /            \\
                             YES               NO          YES              NO
                             /                   \\         /                  \\
                        [Merge Sort]        [Quick Sort] [Merge Sort]    [Quick / Introsort]
                      (with custom mem)
\`\`\`

---

### Detailed Recommendation Scenarios:

1. **Small Datasets ($n \\le 30$) or Real-Time Streaming UI**:
   - **Winner**: **Insertion Sort**.
   - **Reason**: Zero recursion overhead, lowest CPU constant factor, cache friendly.

2. **Large Datasets with Guaranteed Latency (Embedded Systems, Finance)**:
   - **Winner**: **Merge Sort**.
   - **Reason**: Guaranteed $O(n \\log n)$ wall-clock runtime without worst-case quadratic tail risks.

3. **General Purpose In-Memory Performance**:
   - **Winner**: **Quick Sort** (or hybrid Introsort).
   - **Reason**: In-place partitioning has tight CPU inner loops and minimal memory moves.

4. **Multi-Column Spreadsheet or Complex Object Sorting**:
   - **Winner**: **Merge Sort** (or Timsort).
   - **Reason**: Preserves prior column sort orders through strict stability.
    `,
    quizTopicId: "advanced-analysis"
  },
  // ==========================================
  // LEVEL 5: FUNDAMENTAL DATA STRUCTURES
  // ==========================================
  {
    slug: "array-data-structure",
    level: 5,
    levelTitle: "Level 5: Fundamental Data Structures",
    order: 1,
    title: "Array: Contiguous Memory & Dynamic Vectors",
    subtitle: "Understanding contiguous RAM allocation, O(1) random access arithmetic, element shifting costs, and amortized geometric doubling.",
    estimatedReadTime: "9 min",
    category: "Data Structures",
    banglaNote: {
      topic: "অ্যারে, মেমোরি কনটিগুইটি ও ডায়নামিক ভেক্টর (Array Deep Dive)",
      englishContext: "An array stores items consecutively in physical RAM, enabling instantaneous O(1) random access arithmetic, but requiring O(n) element shifting for middle insertions.",
      banglaText: `
### 💡 সহজ উপমা: ট্রেনের পরপর সাজানো কামরা বা ডিমের খাঁচি
একটি ডিমের খাঁচি কল্পনা করুন যেখানে প্রতিটি ডিম রাখার জন্য সমান মাপের খোপ পরপর তৈরি করা আছে। আপনাকে যদি বলা হয় "৪ নম্বর ডিমটি তুলে আনুন", আপনাকে কিন্তু ১, ২, ৩ নম্বর ডিম গুণে দেখতে হয় না — চোখের পলকে সরাসরি ৪ নম্বর খোপে হাত দেওয়া যায়। অ্যারেও ঠিক তেমনি মেমোরির একনাগাড়ে পাশাপাশি থাকা খোপের সমষ্টি।

### ⚙️ হার্ডওয়্যার অ্যাড্রেস গণনার ম্যাজিক ($O(1)$ Random Access):
অ্যারেতে প্রতিটি উপাদান (যেমন ৪ বাইটের ইন্টিজার) মেমোরিতে গায়ে গায়ে লেগে থাকে। কম্পিউটার কোনো লুপ না চালিয়ে একটি সাধারণ গাণিতিক ফর্মুলায় সরাসরি র‍্যামের ফিজিক্যাল অ্যাড্রেস বের করে ফেলে:
$$\\text{Address} = \\text{BaseAddress} + (\\text{Index} \\times \\text{sizeof}(T))$$
যেমন: বেস অ্যাড্রেস \`1000\` হলে, ৩য় ইনডেক্সের ঠিকানা হবে: $1000 + (3 \\times 4) = 1012$। এই কারণেই অ্যারেতে ইনডেক্সিং করতে **সর্বদা মাত্র ১টি ক্লক সাইকেল বা $O(1)$ সময়** লাগে।

### 🔄 উপাদান যোগ ও মোছার যন্ত্রণা ($O(n)$ Element Shifting):
- **মাঝখানে নতুন সংখ্যা ঢোকানো:** সিনেমা হলের পূর্ণ একটি সারিতে ৩ নম্বর সিটে নতুন কাউকে বসাতে চাইলে ৩ নম্বর থেকে শুরু করে পেছনের সবাইকে ১ সিট করে ডানে সরে যেতে হয়। একইভাবে অ্যারের মাঝখানে ইনসার্ট করতে $O(n)$ উপাদান ডানে সরাতে হয় (Shift Right)।
- **মাঝখান থেকে ডিলিট:** মুছে ফেলার পর তৈরি হওয়া ফাঁকা জায়গা পূরণ করতে পেছনের সবাইকে ১ ঘর করে বামে টেনে আনতে হয় ($O(n)$ Shift Left)।

### 📈 ডায়নামিক ভেক্টর ও জ্যামিতিক দ্বিগুণকরণ (Amortized $O(1)$ Geometric Doubling):
- সি++ \`std::vector\` বা পাইথনের \`list\`-এর নির্দিষ্ট কোনো স্থায়ী সাইজ থাকে না।
- যখন ভেক্টরের ধারণক্ষমতা (Capacity) পূর্ণ হয়ে যায়, তখন কম্পিউটার বর্তমান মেমোরি ব্লকের দ্বিগুণ ($2 \\times$) আকারের একটি সম্পূর্ণ নতুন মেমোরি ব্লক বরাদ্দ করে এবং পুরনো সব উপাদান সেখানে কপি করে নিয়ে যায়।
- যদিও এই কপি করতে একবারে $O(n)$ সময় লাগে, কিন্তু এই ঘটনাটি খুব কম ঘটে। গাণিতিকভাবে প্রমাণ করা যায় যে প্রতি পুশের গড় খরচ মাত্র **$O(1)$ Amortized**!

### ⏱️ টাইম ও স্পেস কমপ্লেক্সিটি সামারি:
| অপারেশন | টাইম কমপ্লেক্সিটি | কারণ ও মেমোরি বিহেভিয়ার |
| :--- | :--- | :--- |
| **Random Access \`arr[i]\`** | $O(1)$ | সরাসরি হার্ডওয়্যার অ্যাড্রেস ক্যালকুলেশন |
| **Update \`arr[i] = x\`** | $O(1)$ | নির্দিষ্ট মেমোরি স্লটে সরাসরি ডেটা রাইট |
| **Tail Append (\`push_back\`)** | $O(1)$ Amortized | খালি থাকলে ১ পদক্ষেপে বসে, পূর্ণ হলে দ্বিগুণ মেমোরিতে কপি |
| **Middle/Head Insert** | $O(n)$ | পেছনের সব উপাদানকে ১ ঘর করে ডানে সরাতে হয় |
| **Middle/Head Delete** | $O(n)$ | পেছনের সব উপাদানকে ১ ঘর করে বামে টানতে হয় |
| **Search (Unsorted)** | $O(n)$ | লিনিয়ার স্ক্যান করে প্রতি উপাদান চেক করতে হয় |

### ⚠️ ইন্টারভিউ ট্র্যাপ ও সাধারণ ভুল:
১. **আউট অফ বাউন্ডস (Buffer Overflow):** অ্যারের সাইজ $n$ হলে বৈধ ইনডেক্স $0$ থেকে $n-1$। অসাবধানতাবশত \`arr[n]\` এক্সেস করলে **Segmentation Fault** বা অপ্রত্যাশিত গার্বেজ ভ্যালু তৈরি হয়।
২. **সিপিইউ ক্যাশ লোকালিটি:** লিঙ্কড লিস্টের তুলনায় অ্যারে হাজার গুণ দ্রুত চলে কারণ এর উপাদানগুলো র‍্যামে পাশাপাশি থাকায় সিপিইউ এক টানে পুরো ক্যাশ লাইন (Cache Line - 64 Bytes) প্রসেসরে নিয়ে আসে।
      `,
    },
    visualizerLink: {
      label: "Open Interactive Array Studio",
      algorithmId: "array",
      path: "/visualizer?algo=array"
    },
    quizTopicId: "array",
    content: `
### What Is an Array?

An **Array** is a collection of elements stored at **contiguous physical memory locations**. Each element occupies a fixed number of bytes, and items are referenced sequentially by a zero-based integer index $i \\in [0, n - 1]$.

Because elements reside back-to-back with zero gaps in physical RAM, finding the memory address of any element does **not** require scanning through preceding items. Instead, the CPU computes the target hardware address in a single clock cycle using basic offset arithmetic:

$$\\text{Address}(arr[i]) = \\text{BaseAddress} + (i \\times \\text{sizeof}(T))$$

---

### Core Operations & Complexity Breakdown

| Operation | Time Complexity | Auxiliary Space | Why This Complexity? |
| :--- | :--- | :--- | :--- |
| **Random Access** $arr[i]$ | $O(1)$ Constant | $O(1)$ | Direct hardware arithmetic calculation: $\\text{Base} + i \\times 4\\text{B}$. |
| **In-Place Update** $arr[i] = v$ | $O(1)$ Constant | $O(1)$ | Direct write to computed physical memory slot. |
| **Tail Append (Push Back)** | $O(1)$ Amortized | $O(1)$ | Inserts at $arr[\\text{size}]$; doubles buffer capacity when full. |
| **Tail Pop (Pop Back)** | $O(1)$ Constant | $O(1)$ | Decrements size pointer with zero element movement. |
| **Head/Middle Insert** | $O(n)$ Linear | $O(1)$ | Must shift all elements from index to $\\text{size}-1$ one slot right. |
| **Head/Middle Delete** | $O(n)$ Linear | $O(1)$ | Must shift all elements from index $+ 1$ to $\\text{size}-1$ one slot left. |
| **Linear Search** | $O(n)$ Linear | $O(1)$ | Must sequentially examine up to $n$ slots in unsorted data. |

---

### Why Dynamic Arrays Double Capacity (Amortized Analysis)

When a dynamic array (such as \`std::vector\` in C++ or \`ArrayList\` in Java) exceeds its current allocated capacity, it cannot simply expand in place because adjacent RAM addresses may already be claimed by other variables.

Instead, the runtime performs **Geometric Resizing**:
1. Allocates a new contiguous memory block of **$2\\times$ the capacity**.
2. Copies all $n$ existing elements from the old buffer to the new buffer.
3. Deallocates the old buffer from heap memory.
4. Appends the new incoming element.

#### The Mathematical Proof of Amortized $O(1)$
If we expand by $+1$ each time, copying costs $1 + 2 + 3 + \\dots + n = \\frac{n(n+1)}{2} = O(n^2)$ total work across $n$ insertions ($O(n)$ per push).

However, with $2\\times$ geometric doubling, reallocations occur only at powers of two ($1, 2, 4, 8, 16, \\dots$). Over $n$ push operations, the total number of copied items is:

$$\\sum_{k=0}^{\\log_2 n} 2^k = 1 + 2 + 4 + 8 + \\dots + n < 2n$$

Dividing the total copying work ($2n$) by the number of insertions ($n$) gives:

$$\\text{Amortized Cost per Push} = \\frac{2n}{n} = O(1)$$

---

### Hardware Cache Lines & Spatial Locality

Modern CPUs do not fetch single bytes from RAM; they fetch memory in **64-byte Cache Lines**.

- For an array of 32-bit (4-byte) integers, fetching $arr[0]$ automatically pulls $arr[0]$ through $arr[15]$ directly into the **L1 Data Cache**.
- Subsequent reads to $arr[1..15]$ result in instantaneous **L1 Cache Hits** (1-2 CPU cycles) instead of slow RAM reads (100-200 cycles).
- Linked Lists, by contrast, allocate nodes discontinuously across the heap, causing frequent **Cache Misses** and pointer stalls.

    `
  },
  {
    slug: "string-data-structure",
    level: 5,
    levelTitle: "Level 5: Fundamental Data Structures",
    order: 2,
    title: "String: Contiguous Characters, Byte Encodings & The Immutability Trap",
    subtitle: "Understanding 1-byte character arrays, ASCII vs UTF-8, in-place two-pointer scans, sliding window substrings, and why immutable string concatenation in loops triggers catastrophic O(n²) bottlenecks.",
    estimatedReadTime: "10 min",
    category: "Data Structures",
    banglaNote: {
      topic: "স্ট্রিং, মেমোরি এনকোডিং ও ইমিউটেবিলিটি ট্র্যাপ (String Deep Dive)",
      englishContext: "A string is a contiguous array of character bytes. In C++, strings are mutable in-place O(1), but in Python, JS, and Java, strings are immutable—loop concatenation copies entire strings in O(n²).",
      banglaText: `
### 💡 সহজ উপমা: সুতোয় গাঁথা পুঁতির মালা
একটি সুতোয় নির্দিষ্ট ক্রমে একটার পর একটা বিভিন্ন রঙের পুঁতি গেঁথে মালা বানানোর কথা ভাবুন। আপনি যদি মালার ৫ম পুঁতিটি দেখতে চান, এক মুহূর্তে সরাসরি ৫ম পুঁতিতে চোখ রাখা যায়। কিন্তু সুতোর মাঝখান থেকে কোনো পুঁতি সরাতে গেলে বা নতুন পুঁতি ঢোকাতে গেলে পুরো মালাটিকে আবার নতুন করে সাজাতে হয়। স্ট্রিং হলো মেমরিতে ঠিক তেমনিভাবে সাজানো অক্ষরের (Characters) মালা।

### ⚙️ মেমোরি আর্কিটেকচার ও ১-বাইট এনকোডিং:
- প্রতিটি মানক ASCII অক্ষর কম্পিউটারের র‍্যামে ঠিক **১ বাইট (৮ বিট)** জায়গা দখল করে।
- ফলে অ্যারের মতো স্ট্রিংয়েও যেকোনো ইনডেক্স খুঁজে পেতে সরাসরি ফর্মুলা কাজ করে: 
  $$\\text{Address}(str[i]) = \\text{BaseAddress} + (i \\times 1\\text{ Byte})$$
- এজন্য যেকোনো অক্ষরের মান পড়া (\`str[i]\`) সর্বদা $O(1)$ কনস্ট্যান্ট টাইম।

### ⚠️ ইন্টারভিউয়ের মারাত্মক ফাঁদ: Mutability বনাম Immutability
সবচেয়ে বেশি শিক্ষার্থী ইন্টারভিউতে যে ভুলটি করে তা হলো স্ট্রিং এর মেমোরি মিউটেবিলিটি না বোঝা:
১. **C++ (Mutable):** সি++ এ \`std::string\` হলো পরিবর্তনযোগ্য। আপনি চাইলে \`str[0] = 'Z'\` লিখে একই মেমোরি স্লটে $O(1)$ সময়ে অক্ষর বদলে ফেলতে পারেন।
২. **Python, JavaScript & Java (Immutable):** এই ভাষাগুলোতে স্ট্রিং তৈরি হওয়ার পর তার ভেতরের মেমোরি আর কখনো পরিবর্তন করা যায় না!
   - আপনি যখনই লুপের ভেতরে \`str = str + ch\` বা \`str += ch\` লেখেন, কম্পিউটার আগের স্ট্রিংয়ে নতুন অক্ষর যোগ করে না; বরং মেমোরিতে নতুন জায়গা বরাদ্দ করে পুরনো সব অক্ষর কপি করে আনে!
   - ফলে একটি $n$ সাইজের লুপের ভেতরে স্ট্রিং যোগ করতে $1 + 2 + 3 + \\dots + n = O(n^2)$ সময় নষ্ট হয় এবং কোড মারাত্মক স্লো হয়ে যায়!
   - **সঠিক টেকনিক:** জাভাতে \`StringBuilder\`, পাইথনে \`"".join(list)\`, আর জাভাস্ক্রিপ্টে একটি অ্যারেতে \`push()\` করে লুপ শেষে \`join("")\` করা।

### 🔍 স্ট্রিংয়ের প্রধান দুটি অ্যালগরিদমিক টেকনিক:
১. **টু-পয়েন্টার (Two Pointers):** স্ট্রিং রিভার্স করা বা প্যালিনড্রোম (Palindrome) চেক করার সময় দুটি পয়েন্টার বাম ও ডান থেকে শুরু করে মাঝের দিকে এগিয়ে আসে। এতে অতিরিক্ত কোনো মেমোরি ছাড়াই ($O(1)$ Auxiliary Space) মাত্র $O(n)$ সময়ে সমাধান পাওয়া যায়।
২. **স্লাইডিং উইন্ডো (Sliding Window):** কোনো স্ট্রিংয়ের ভেতরে সবচেয়ে বড় সাবস্ট্রিং (যেমন: কোনো ডুপ্লিকেট অক্ষর ছাড়া দীর্ঘতম অংশ) খোঁজার জন্য একটি চলমান উইন্ডো ডানে বাড়ানো ও বামে সংকুচিত করা হয়।
      `,
    },
    visualizerLink: {
      label: "Open Interactive String Studio",
      algorithmId: "string",
      path: "/visualizer?algo=string"
    },
    quizTopicId: "string",
    content: `
### What Is a String Formally?

In computer science, a **String** is a finite sequence of symbols chosen from an alphabet $\\Sigma$. At the hardware architecture level, a string is stored as a **contiguous array of bytes in physical memory**.

Because character codes in standard ASCII occupy exactly **1 Byte (8 bits)**, the CPU computes the memory address of the $i$-th character instantaneously:

$$\\text{Address}(str[i]) = \\text{BaseAddress} + (i \\times 1\\text{ Byte})$$

This single-instruction memory mapping gives strings the same $O(1)$ random-access property and L1 cache spatial locality as numerical arrays.

---

### Memory Anatomy: C-Style Strings vs Modern String Objects

How computers track the end of a string varies fundamentally across programming systems:

#### 1. Null-Terminated C Strings (\`char*\`)
- In C, a string has no explicit length field. Instead, it terminates with a sentinel **null character** \`'\\0'\` (byte value \`0x00\`).
- Calculating the length via \`strlen()\` requires walking every single byte until encountering \`'\\0'\`, which costs **$O(n)$ time**.
- **Buffer Overflow Hazard**: If the terminating null byte is accidentally overwritten or omitted, string operations continue reading arbitrary memory past the buffer boundary.

#### 2. Modern Standard Strings (C++ \`std::string\`, Rust \`String\`)
Modern systems use a three-word struct header:
- **Pointer**: Points to the contiguous heap buffer containing the character bytes.
- **Size / Length**: Stores the active character count, making \`.length()\` a strict **$O(1)$ operation**.
- **Capacity**: Stores the allocated buffer boundary to support geometric doubling appends.
- **Small String Optimization (SSO)**: For strings under 15–23 bytes, modern C++ runtimes store the characters directly inside the stack struct itself, avoiding expensive heap allocations entirely!

---

### Core Operations & Complexity Breakdown

| Operation | Time Complexity | Auxiliary Space | Architectural Mechanism |
| :--- | :--- | :--- | :--- |
| **Random Read** $str[i]$ | $O(1)$ Constant | $O(1)$ | Direct hardware 1-byte offset arithmetic. |
| **In-Place Update (Mutable)** | $O(1)$ Constant | $O(1)$ | Direct RAM write at $\\text{Base} + i$ in C++ \`std::string\`. |
| **Two-Pointer Reversal** | $O(n)$ Linear | $O(1)$ | In-place swaps between symmetric ends ($n/2$ swaps). |
| **Palindrome Verification** | $O(n)$ Linear | $O(1)$ | Inward two-pointer comparison with early exit on mismatch. |
| **Sliding Window Substring** | $O(n)$ Linear | $O(\\min(n, |\\Sigma|))$ | Single-pass interval expansion and contraction. |
| **Naive Substring Search** | $O((n - m + 1) \\times m)$ | $O(1)$ | Character-by-character alignment check. |
| **Immutable Concatenation** | $O(n + m)$ Linear | $O(n + m)$ | Allocates new buffer and copies every single byte. |

---

### The Immutability Trap & The $O(n^2)$ Concatenation Disaster

One of the most frequent performance bugs in production systems stems from misunderstandings of **String Immutability**.

In languages like **Java, Python, and JavaScript**, strings are strictly immutable: once created, the underlying byte buffer can **never** be modified in place.

#### What Happens During \`str += c\`?
When you write:
\`\`\`javascript
let str = "";
for (let i = 0; i < n; i++) {
    str += "a";
}
\`\`\`
1. In iteration 1, an array of size 1 is allocated and \`'a'\` is written.
2. In iteration 2, an array of size 2 is allocated, 1 byte is copied, and \`'a'\` is written.
3. In iteration $k$, an array of size $k$ is allocated, $k - 1$ bytes are copied, and the new char is added.

The total number of copied characters across $n$ loop iterations is:

$$\\sum_{k=1}^n k = 1 + 2 + 3 + \\dots + n = \\frac{n(n + 1)}{2} = O(n^2)$$

For $n = 100{,}000$, an operation that should take **10 milliseconds** takes **over 45 seconds** and allocates gigabytes of garbage-collected heap memory!

#### The Fix:
- **Java**: Use \`StringBuilder\` (internally a mutable dynamic char array with amortized $O(1)$ append).
- **Python**: Append characters or tokens to a list and call \`"".join(list)\` in $O(n)$ time.
- **C++**: Use \`std::string::push_back()\` or \`+=\` directly (mutable geometric doubling).

---

### Signature Algorithmic Paradigms

#### 1. Two-Pointer Inward Scan (Reversals & Palindromes)
Because strings reside contiguously in memory, two pointers initialized at opposite ends can march inward symmetrically:
\`\`\`cpp
void reverse(string& s) {
    int l = 0, r = s.size() - 1;
    while (l < r) swap(s[l++], s[r--]);
}
\`\`\`
This achieves $O(n)$ time with strict $O(1)$ auxiliary space and peak CPU cache locality.

#### 2. The Sliding Window Paradigm
Instead of checking all $O(n^2)$ substrings, the **Sliding Window** maintains a dynamic slice $[L \\dots R]$:
- The **Right pointer ($R$)** expands the window by consuming the next character.
- The **Left pointer ($L$)** contracts the window whenever duplicate characters or constraints are violated.
- Because both $L$ and $R$ increment monotonically from $0$ to $n$, each character is visited at most twice, delivering a guaranteed **$O(n)$ linear runtime**.

    `
  },
  {
    slug: "stack-data-structure",
    level: 5,
    levelTitle: "Level 5: Fundamental Data Structures",
    order: 3,
    title: "Stack: LIFO Mechanism & Applications",
    subtitle: "Understanding Last-In First-Out mechanics, array vs linked-list implementations, call stacks, and expression parsing.",
    estimatedReadTime: "8 min",
    category: "Data Structures",
    content: `
### What Is a Stack?

A **Stack** is a linear data structure that adheres to the **LIFO (Last-In, First-Out)** principle. This means that the last element added to the stack is always the very first element to be removed.

Imagine a spring-loaded stack of trays in a cafeteria:
- When clean trays are washed, they are placed on the **top** of the pile.
- When a customer grabs a tray, they take it from the **top** of the pile.
- The tray at the very bottom was the first one placed, but it will be the last one taken.

---

### Core Stack Operations & Complexity

All primary stack operations target exclusively the element located at index $\\text{top}$. Because no shifting or traversal across the collection is necessary, each operation executes in strictly **$O(1)$ constant time**:

| Operation | Time Complexity | Space Complexity | Description |
| :--- | :--- | :--- | :--- |
| $\\text{push}(x)$ | $O(1)$ | $O(1)$ | Inserts item $x$ onto the top of the stack. |
| $\\text{pop}()$ | $O(1)$ | $O(1)$ | Removes and discards the top element. |
| $\\text{top}()$ / $\\text{peek}()$ | $O(1)$ | $O(1)$ | Returns the top element without removal. |
| $\\text{empty}()$ | $O(1)$ | $O(1)$ | Checks whether the stack contains 0 items. |
| $\\text{size}()$ | $O(1)$ | $O(1)$ | Returns the current count of elements. |

---

### Key Architectural Tradeoffs

- **Array-Based**:
  - **Pros**: Contiguous memory layout guarantees maximum CPU L1/L2 cache line utilization; zero per-node pointer memory overhead.
  - **Cons**: Fixed capacity limit unless dynamic resizing ($O(n)$ amortized resize) is introduced.
- **Linked-List-Based**:
  - **Pros**: Dynamic sizing without fixed capacity limits; never overflows as long as heap RAM is available.
  - **Cons**: Extra $8\\text{ bytes}$ pointer overhead per node on 64-bit systems; dynamic \`new\`/\`delete\` heap allocation latency.

---

### Real-World Applications & The Recursion Connection

1. **Function Call Stacks & Recursion**:
   - Every time your program calls a function (such as in **Merge Sort** or **Quick Sort**), the operating system pushes a **Stack Frame** (containing local variables, arguments, and return address) onto the Call Stack.
   - When the function returns, its frame is popped. This is why unbounded recursion causes a **Stack Overflow** error.
2. **Undo / Redo Buffers**:
   - Text editors push each typed operation onto an Undo stack. Pressing Ctrl+Z pops the most recent action to revert it.
3. **Syntax Validation & Balanced Parentheses**:
   - Compilers scan source code by pushing opening brackets \`(\`, \`[\`, \`{\` onto a stack and matching them with corresponding closing brackets.
    `,
    banglaNote: {
      topic: "স্ট্যাক, LIFO মেকানিজম ও কল স্ট্যাক আর্কিটেকচার (Stack Deep Dive)",
      englishContext: "A stack enforces Last-In First-Out (LIFO) discipline where all operations occur strictly at the top in O(1) constant time, powering function recursion and undo engines.",
      banglaText: `
### 💡 সহজ উপমা: রেস্টুরেন্টের প্লেটের স্তূপ বা কয়েনের টিউব
একটি রেস্টুরেন্টের প্লেটের স্তূপ বা ক্যাফেটেরিয়ার ট্রে ট্রলি কল্পনা করুন। ধোয়া পরিষ্কার প্লেটগুলো সবসময় স্তূপের একদম উপরে (Top) রাখা হয়। আবার কোনো কাস্টমার যখন প্লেট নেন, তিনি মাঝখান বা নিচ থেকে না টেনে সবার উপরের প্লেটটিই সবার আগে তুলে নেন। অর্থাৎ যেটি **সবার শেষে রাখা হয়েছিল, সেটিই সবার প্রথমে বের হলো** — একেই বলে **LIFO (Last-In, First-Out)**।

### ⚙️ অভ্যন্তরীণ মেকানিক্স ও কেন প্রতিটি অপারেশন $O(1)$?
স্ট্যাকে মাঝখানের উপাদান দেখার বা নাড়াচাড়া করার কোনো অনুমতি নেই। শুধুমাত্র একটি মাত্র ইনডেক্স বা পয়েন্টার \`topIndex\` মেইনটেইন করা হয়:
- **Push ($O(1)$):** \`++topIndex\` করে নতুন উপাদানটি বসিয়ে দেওয়া হয়। কোনো উপাদান শিফট করতে হয় না।
- **Pop ($O(1)$):** \`--topIndex\` করে টপ পয়েন্টার এক ঘর নিচে নামিয়ে দিলেই উপাদানটি লজিক্যালি মুছে যায়।
- **Top / Peek ($O(1)$):** সরাসরি \`arr[topIndex]\` রিটার্ন করে বর্তমান শীর্ষ মানটি দেখা যায়।

### 🧱 অ্যারে বনাম লিঙ্কড লিস্ট ভিত্তিক স্ট্যাক:
১. **Array-Based Stack:** মেমরিতে উপাদানগুলো পাশাপাশি থাকায় সিপিইউ L1/L2 ক্যাশ পারফরম্যান্স অত্যন্ত দ্রুত। তবে সাইজ ফিক্সড না রাখলে ডায়নামিক রিলিজের প্রয়োজন হয়।
২. **Linked-List-Based Stack:** প্রতিটি নোড হিপ মেমরিতে তৈরি হওয়ায় সাইজের কোনো সীমাবদ্ধতা নেই (যতক্ষণ র‍্যাম ফাঁকা আছে)। তবে প্রতি নোডে অতিরিক্ত ৮ বাইটের পয়েন্টার খরচ হয়।

### 💻 রিকার্শন ও অপারেটিং সিস্টেমের কল স্ট্যাক (Call Stack Connection):
- যখনই আপনি কোনো কোডে রিকার্সিভ ফাংশন (যেমন Merge Sort, Quick Sort, DFS) চালান, অপারেটিং সিস্টেম মেমরির **Call Stack**-এ ফাংশনের লোকাল ভ্যারিয়েবল ও রিটার্ন অ্যাড্রেস পুশ করে রাখে।
- ফাংশন শেষ হলে ফ্রেমটি পপ হয়ে যায়।
- আপনি যদি ভুল করে কোনো রিকার্শনে থামার শর্ত (Base Case) না দেন, তবে স্ট্যাকের মেমোরি সীমা অতিক্রম করে প্রোগ্রামটি **Stack Overflow** এররে ক্র্যাশ করবে!

### ⚠️ ইন্টারভিউ ট্র্যাপ ও ডিফেন্সিভ কোডিং:
১. **Stack Underflow:** স্ট্যাক খালি থাকা অবস্থায় (\`topIndex == -1\`) যদি কেউ \`pop()\` বা \`top()\` কল করে, তবে প্রোগ্রাম যাতে গার্বেজ মান না পড়ে বা ক্র্যাশ না করে সেজন্য সর্বদা \`empty()\` চেক করতে হবে।
২. **মনোটনিক স্ট্যাক (Monotonic Stack):** LeetCode-এর জটিল ইন্টারভিউ প্রশ্ন যেমন "Next Greater Element" বা "Daily Temperatures" সমাধান করতে বিশেষ ধরনের স্ট্যাক ব্যবহৃত হয় যাতে মানগুলো ছোট থেকে বড় বা বড় থেকে ছোট ক্রমানুসারে সাজানো থাকে।
      `,
    },
    quizTopicId: "stack",
    visualizerLink: {
      label: "Stack Visualizer",
      algorithmId: "stack",
      path: "/algorithms/stack",
    },
  },
  {
    slug: "queue-data-structure",
    level: 5,
    levelTitle: "Level 5: Fundamental Data Structures",
    order: 2,
    title: "Queue: FIFO Mechanism & Circular Buffers",
    subtitle: "First-In First-Out container, circular array modulo wrapping, BFS graph search, and task scheduling.",
    estimatedReadTime: "8 min",
    category: "Data Structures",
    content: `
### What Is a Queue?

A **Queue** is a linear data structure that adheres strictly to the **FIFO (First-In, First-Out)** principle. The element that enters the queue first will always be the first one to be processed and removed.

Think of a ticket counter line at a movie theater:
- New customers join at the **rear** (back) of the line.
- The person currently at the **front** of the line gets served first and exits.
- No one can skip the line or exit from the middle.

---

### Core Queue Operations & Complexity

| Operation | Time Complexity | Space Complexity | Description |
| :--- | :--- | :--- | :--- |
| $\\text{enqueue}(x)$ | $O(1)$ | $O(1)$ | Appends item $x$ to the rear of the queue. |
| $\\text{dequeue}()$ | $O(1)$ | $O(1)$ | Removes and returns the item from the front. |
| $\\text{front}()$ / $\\text{peek}()$ | $O(1)$ | $O(1)$ | Returns the front item without removing it. |
| $\\text{empty}()$ | $O(1)$ | $O(1)$ | Checks whether the queue contains 0 items. |
| $\\text{size}()$ | $O(1)$ | $O(1)$ | Returns the current count of elements. |

---

### The Array Shift Problem & The Circular Buffer Solution

In a simple array implementation:
- If we remove an element from index \`0\`, we would need to shift all $n-1$ remaining elements one position to the left, which costs $O(n)$ time.
- Alternatively, if we just advance a \`front\` pointer without shifting, the array quickly wastes all available space at the front.

**The Solution: Circular Queue (Ring Buffer)**
Using the modulo operator ($\\%$), the rear and front pointers wrap around to index \`0\` when they reach the end of the array:

$$\\text{rear} = (\\text{rear} + 1) \\pmod{\\text{capacity}}$$
$$\\text{front} = (\\text{front} + 1) \\pmod{\\text{capacity}}$$

---

### Real-World Applications

1. **CPU & OS Task Scheduling**:
   - Round-robin schedulers place ready processes into a FIFO run-queue.
2. **Breadth-First Search (BFS)**:
   - Level-order traversal on binary trees and shortest-path exploration in unweighted graphs depend fundamentally on a queue.
3. **Asynchronous Message Buffers**:
   - Message brokers (like RabbitMQ, Kafka) and printer spools process jobs in exact arrival order.
    `,
    banglaNote: {
      topic: "কিউ, FIFO মেকানিজম ও সার্কুলার রিং বাফার (Queue Deep Dive)",
      englishContext: "A queue operates on First-In First-Out (FIFO) ordering where items enter at the rear and exit from the front, solved in O(1) via modular circular array arithmetic.",
      banglaText: `
### 💡 সহজ উপমা: রেলওয়ে স্টেশনের টিকিট কাউন্টার
একটি টিকিট কাউন্টারের লাইনের কথা ভাবুন। যিনি লাইনে সবার প্রথমে এসে দাঁড়িয়েছেন, টিকিট কাউন্টার খোলার পর তিনিই সবার আগে টিকিট পেয়ে লাইন থেকে বেরিয়ে যান। আর নতুন কোনো যাত্রী এলে তাকে লাইনের একদম পেছনে (Rear) গিয়ে দাঁড়াতে হয়। অর্থাৎ **যে আগে এসেছে, সে আগেই সেবা পাবে** — এটাই হলো **FIFO (First-In, First-Out)** নীতি।

### ⚙️ সাধারণ অ্যারের সীমাবদ্ধতা বনাম সার্কুলার কিউ (Circular Ring Buffer):
সাধারণ অ্যারে দিয়ে কিউ বানাতে গেলে দুটি মারাত্মক সমস্যা দেখা দেয়:
১. **$O(n)$ এলিমেন্ট শিফটিং:** সামনের উপাদান বের করার পর যদি পেছনের সবাইকে ১ ঘর করে সামনে টেনে আনা হয়, তবে প্রতি Dequeue-তে $O(n)$ সময় নষ্ট হয়।
২. **মেমোরি অপচয় (Drifting Pointers):** উপাদান না সরিয়ে শুধু \`front\` পয়েন্টার ডানে বাড়াতে থাকলে অ্যারের পেছনের অংশ শেষ হয়ে যাবে কিন্তু সামনের মেমোরি খালি পড়ে থেকে চিরতরে নষ্ট হবে (False Overflow)।

### 🔄 মডুলার অ্যারিথমেটিকের ম্যাজিক সমাধান:
এই সমস্যার সেরা সমাধান হলো মেমোরিকে একটি বৃত্তাকার রিং (Circular Buffer) হিসেবে চিন্তা করা। মডুলো ($\\%$) অপারেটর ব্যবহার করে পয়েন্টার ঘোরানো হয়:
- **Enqueue ($O(1)$):** \`rear = (rear + 1) % capacity\` — রিয়ার পয়েন্টার ঘুরে আবার শুরুতে চলে আসে।
- **Dequeue ($O(1)$):** \`front = (front + 1) % capacity\` — কোনো ডেটা না সরিয়েই সামনের খালি জায়গা আবার ব্যবহারের উপযোগী হয়।
- ফলে কোনো মেমোরি অপচয় ছাড়াই প্রতিটি কিউ অপারেশন কঠোরভাবে **$O(1)$ কনস্ট্যান্ট টাইমে** সম্পন্ন হয়।

### 🌐 বাস্তব জীবনে ও অ্যালগরিদমে কিউয়ের ভূমিকা:
১. **ব্রেডথ-ফার্স্ট সার্চ (BFS):** বাইনারি ট্রির Level-Order ট্রাভার্সাল (প্রতি তলা ধরে ধরে ভিজিট করা) এবং আনওয়েটেড গ্রাফে সবচেয়ে ছোট পথ (Shortest Path) বের করতে কিউ ডাটা স্ট্রাকচার ছাড়া বিকল্প নেই।
২. **অপারেটিং সিস্টেম প্রসেস শিডিউলিং:** একাধিক প্রোগ্রাম যখন একসাথে সিপিইউর জন্য অপেক্ষা করে, তখন ওএস রাউন্ড-রবিন (Round-Robin) পদ্ধতিতে কিউ মেনে একে একে সবাইকে সময় দেয়।
৩. **মেসেজ বাফার ও প্রিন্টার স্পুলার:** Apache Kafka বা প্রিন্টারে যখন একসাথে একাধিক ফাইল পাঠানো হয়, তখন সেগুলো কিউতে জমা হয় এবং ক্রমানুসারে প্রিন্ট হয়।
      `,
    },
    quizTopicId: "queue",
    visualizerLink: {
      label: "Queue Visualizer",
      algorithmId: "queue",
      path: "/algorithms/queue",
    },
  },
  {
    slug: "deque-data-structure",
    level: 5,
    levelTitle: "Level 5: Fundamental Data Structures",
    order: 3,
    title: "Deque: Double-Ended Queue & Monotonic Invariants",
    subtitle: "Bidirectional O(1) push and pop, circular modular wrap-around, doubly-linked topology, and sliding window maximum.",
    estimatedReadTime: "10 min",
    category: "Data Structures",
    content: `
### What Is a Deque?

A **Deque** (short for **Double-Ended Queue**, universally pronounced *"deck"*) is a generalized linear data structure that permits instantaneous, constant-time $O(1)$ insertions and removals at **both endpoints**:
1. **Front (Head)**: $\\text{pushFront}(x)$ and $\\text{popFront}()$
2. **Rear (Back / Tail)**: $\\text{pushBack}(x)$ and $\\text{popBack}()$

Unlike a standard Stack (which restricts operations strictly to the Top) or a standard Queue (which restricts entry to the Rear and exit to the Front), a Deque **subsumes both paradigms**. You can use a Deque as a LIFO Stack, a FIFO Queue, or an unrestricted bidirectional sequence container.

---

### Core Deque Operations & Complexity Guarantee

| Operation | Time Complexity | Space Complexity | Description |
| :--- | :--- | :--- | :--- |
| $\\text{pushFront}(x)$ | $O(1)$ | $O(1)$ | Inserts item $x$ at the front boundary. |
| $\\text{pushBack}(x)$ | $O(1)$ | $O(1)$ | Appends item $x$ at the rear boundary. |
| $\\text{popFront}()$ | $O(1)$ | $O(1)$ | Removes and returns the item currently at the front. |
| $\\text{popBack}()$ | $O(1)$ | $O(1)$ | Removes and returns the item currently at the rear. |
| $\\text{peekFront}()$ | $O(1)$ | $O(1)$ | Reads the front item non-destructively. |
| $\\text{peekBack}()$ | $O(1)$ | $O(1)$ | Reads the rear item non-destructively. |
| $\\text{empty}()$ | $O(1)$ | $O(1)$ | Returns \`true\` if the deque contains zero elements. |
| $\\text{size}()$ | $O(1)$ | $O(1)$ | Returns the current total count of active elements. |
| $\\text{search}(x)$ | $O(n)$ | $O(1)$ | Scans elements sequentially from front to rear. |

---

### Implementation Architecture 1: Circular Array & Modulo Arithmetic

In a fixed-size or dynamic array buffer of capacity $N$:
* **Push Front (Moving Backward)**: Decrementing the \`front\` pointer can produce a negative index if \`front == 0\`. In languages like C++, Java, and JavaScript, \`(-1) % N\` evaluates to \`-1\` rather than $N-1$! To safely wrap around, we add $N$ before the modulo:
  $$\\text{front} = (\\text{front} - 1 + N) \\pmod{N}$$
* **Push Back (Moving Forward)**: Advancing the \`rear\` pointer wraps around using standard forward modulo:
  $$\\text{rear} = (\\text{rear} + 1) \\pmod{N}$$
* **Pop Front**: Advances front forward:
  $$\\text{front} = (\\text{front} + 1) \\pmod{N}$$
* **Pop Back**: Retracts rear backward:
  $$\\text{rear} = (\\text{rear} - 1 + N) \\pmod{N}$$

---

### Implementation Architecture 2: Doubly-Linked Node Chain

When maximum capacity is unknown and dynamic resizing copies ($O(N)$ geometric doubling) must be avoided, a **Doubly-Linked List** provides strict worst-case $O(1)$ operations:
* Each node holds \`value\`, \`Node* prev\`, and \`Node* next\`.
* Sentinel (or direct) \`head\` and \`tail\` pointers manage boundary operations.
* **Trade-off**: Requires $2 \\times$ pointer overhead per element (8 bytes for \`prev\`, 8 bytes for \`next\` on 64-bit architectures), plus CPU cache penalties due to heap memory fragmentation.

---

### Advanced Paradigm: Monotonic Deque & Sliding Window Maximum

The crowning algorithmic superpower of the Deque is solving the **Sliding Window Maximum** problem in optimal linear time $O(n)$:

> **Problem**: Given an array of $n$ numbers and a sliding window of size $k$, find the maximum value in every window as it slides from left to right.  
> A naive scan takes $O(k)$ per window $\\rightarrow O(n \\times k)$ total time. With a Monotonic Deque, we solve it in **$O(n)$ total time**!

#### The Monotonic Decreasing Invariant
We maintain a deque of array **indices** whose corresponding values are strictly decreasing from front to back:
$$\\text{arr}[\\text{dq}[0]] > \\text{arr}[\\text{dq}[1]] > \\text{arr}[\\text{dq}[2]] > \\dots$$

1. **Evict Out-of-Bounds**: Pop from **Front** if $\\text{dq.front}() \\le i - k$.
2. **Preserve Monotonicity**: While incoming element $\\text{arr}[i] \\ge \\text{arr}[\\text{dq.back}()]$, pop from **Back**. Smaller elements can *never* become the window maximum because the incoming element is both larger and will survive longer in the window!
3. **Push New Element**: Push index $i$ to **Back**.
4. **Read Maximum**: The current window's maximum is always $\\text{arr}[\\text{dq.front}()]$ in $O(1)$ time!

Since every index is pushed to the deque at most once and popped at most once, the amortized cost across all $n$ elements is strictly **$O(n)$**.

---

### Real-World Systems Engineering: Work-Stealing Schedulers

In modern high-concurrency runtimes (e.g., the **Go runtime scheduler**, **Java's ForkJoinPool**, and Rust's **Tokio** thread pool):
* Each worker CPU thread owns its own private **Deque** of pending tasks (goroutines / tasks).
* The owning thread acts as a **LIFO Stack** at the **Front/Top**: pushing and popping its own tasks with ultra-high cache locality.
* When a worker thread runs out of work, it becomes a **"Thief"**: it visits another busy worker's deque and **steals work from the Rear/Bottom (FIFO)** in $O(1)$ time!
* Because the owner works at the Front and thieves steal from the Rear, lock contention is minimized to near zero.
    `,
    banglaNote: {
      topic: "ডেক, উভমুখী ইনসার্শন ও মনোটনিক ডেক মেকানিক্স (Deque Deep Dive)",
      englishContext: "A Deque (Double-Ended Queue) permits instantaneous O(1) insertions and removals at both endpoints, powering monotonic sliding windows and lock-free work-stealing thread schedulers.",
      banglaText: `
### 💡 সহজ উপমা: দুই মুখ খোলা সুরঙ্গ বা উভয়মুখী ট্রেন
একটি দুই মুখ খোলা সুরঙ্গের (Tunnel) কথা ভাবুন। সাধারণ কিউতে একদিকে গাড়ি ঢোকে আর অন্যদিকে বের হয়। কিন্তু ডেক (Deque - Double-Ended Queue) হলো এমন এক বিশেষ সুরঙ্গ যার দুই মুখ দিয়েই গাড়ি ঢুকতেও পারে আবার বেরও হতে পারে! অর্থাৎ এটি একই সাথে স্ট্যাক (LIFO) এবং কিউ (FIFO)-এর সব সুবিধা একক কাঠামোতে প্রদান করে।

### ⚙️ উভমুখী $O(1)$ অপারেশন মেকানিক্স:
ডেকে যেকোনো প্রান্তেই ডেটা ঢোকানো বা বের করা সরাসরি $O(1)$ সময়ে সম্পন্ন হয়:
- **সামনে অপারেশন:** \`push_front(x)\` এবং \`pop_front()\` — $O(1)$
- **পেছনে অপারেশন:** \`push_back(x)\` এবং \`pop_back()\` — $O(1)$
- **উভয় প্রান্তে অ্যাক্সেস:** \`front()\` এবং \`back()\` — $O(1)$

### 🔄 সার্কুলার ডেক ও নেগেটিভ মডুলো ট্রিক:
অ্যারে দিয়ে ডেক বাস্তবায়ন করার সময় \`front\` পয়েন্টার বামে সরাতে গেলে ইনডেক্স $0$-এর নিচে নেমে নেগেটিভ হয়ে যেতে পারে। 
- সি++ বা জাভাতে \`(-1) % capacity\` করলে নেগেটিভ সংখ্যা আসে, যা অবৈধ ইনডেক্স।
- **জাদুকরী সমাধান:** \`front = (front - 1 + capacity) % capacity\` ফর্মুলা ব্যবহার করলে নেগেটিভ ইনডেক্স এড়িয়ে বৃত্তাকারে শেষ প্রান্তে পৌঁছে যাওয়া যায়।

### 🚀 ইন্টারভিউয়ের সেরা সুপারপাওয়ার: মনোটনিক ডেক (Monotonic Deque):
- **Sliding Window Maximum:** $n$ আকারের অ্যারেতে $k$ সাইজের প্রতিটি সাব-অ্যারের সর্বোচ্চ সংখ্যা বের করতে সাধারণ নিয়মে সময় লাগে $O(n \\times k)$।
- কিন্তু একটি **Monotonic Decreasing Deque** (যেখানে উপাদানগুলো সবসময় বড় থেকে ছোট ক্রমানুসারে থাকে) ব্যবহার করলে প্রতিটি উপাদান সর্বোচ্চ একবার ডেকে ঢোকে এবং একবার বের হয়। ফলে সম্পূর্ণ সমস্যাটি মাত্র **$O(n)$ লিনিয়ার সময়ে** সমাধান হয়ে যায়!

### 🌐 আধুনিক সিস্টেমে ওয়ার্ক-স্টিল শিডিউলার (Work-Stealing Schedulers):
- আধুনিক মাল্টিথ্রেডেড রানটাইম (যেমন Go রুটিন শিডিউলার, Rust-এর Tokio, এবং Java-র ForkJoinPool) প্রতিটি সিপিইউ কোরের জন্য একটি করে ডেক মেইনটেইন করে।
- কোরটি নিজের কাজ ডেকের সামনে (Front) থেকে স্ট্যাক আকারে অতি দ্রুত চালায়।
- কোনো কোরের কাজ শেষ হয়ে অলস বসে থাকলে সে অন্য ব্যস্ত কোরের ডেকের পেছন (Rear) থেকে কিউ আকারে কাজ **"চুরি" (Work-Steal)** করে নিয়ে আসে! এর ফলে থ্রেড লকিংয়ের ঝামেলা শূন্যে নেমে আসে।
      `,
    },
    quizTopicId: "deque",
    visualizerLink: {
      label: "Deque Studio",
      algorithmId: "deque",
      path: "/algorithms/deque",
    },
  },
  {
    slug: "hash-table-data-structure",
    level: 5,
    levelTitle: "Level 5: Fundamental Data Structures",
    order: 4,
    title: "Hash Table: Direct Addressing, Collisions & Constant-Time Magic",
    subtitle: "Hash functions, collision resolution via Separate Chaining & Linear Probing, load factor management, and amortized O(1) performance.",
    estimatedReadTime: "12 min",
    category: "Data Structures",
    content: `
### What Is a Hash Table?

A **Hash Table** (or **Hash Map**) is an associative data structure designed to solve the single most fundamental computer science problem: **retrieving an arbitrary piece of data in instantaneous, constant $O(1)$ time**.

In a standard contiguous array, reading index $k$ takes $O(1)$ time because the CPU computes the hardware memory address directly:
$$\\text{Address} = \\text{Base Address} + (k \\times \\text{Element Size})$$

However, standard arrays require dense, sequential, integer keys ($0, 1, 2, \\dots$). If your keys are arbitrary non-sequential integers (like customer IDs \`987654321\`) or strings (like usernames \`"alice"\`, \`"mushfiq"\`), an ordinary array cannot address them directly. 

A Hash Table bridges this gap using a **Hash Function** $h(k)$ that deterministically converts an arbitrary key $k$ into a compact integer index within the bounds of a backing array of size $M$:
$$h(k) = \\text{hash}(k) \\pmod M$$

---

### Complexity Guarantees & Operations Matrix

| Operation | Average Case | Worst Case (Severe Clumping) | Space Complexity | Description |
| :--- | :--- | :--- | :--- | :--- |
| $\\text{insert}(k, v)$ | $O(1)$ | $O(n)$ | $O(1)$ | Hashes key, resolves collision, and stores $(k, v)$ pair. |
| $\\text{search}(k)$ | $O(1)$ | $O(n)$ | $O(1)$ | Computes $h(k)$, jumps to slot, and returns value $v$. |
| $\\text{delete}(k)$ | $O(1)$ | $O(n)$ | $O(1)$ | Unlinks node or writes a Tombstone marker in $O(1)$ avg. |
| $\\text{rehash}()$ | $O(n)$ | $O(n)$ | $O(n)$ | Doubles capacity $M \\to 2M$ and re-inserts all keys when $\\alpha > 0.75$. |

---

### The Hash Function & The Inevitability of Collisions

A robust hash function must fulfill three properties:
1. **Determinism**: The same key $k$ must *always* yield the exact same integer hash value.
2. **Uniform Distribution**: Keys must be evenly scattered across all $M$ buckets to prevent localized clusters.
3. **Efficiency**: Must compute in strictly $O(1)$ time (or $O(L)$ for a string of length $L$).

#### The Pigeonhole Principle & Collisions
No matter how brilliant your hash function is, collisions are mathematically inevitable. If your key domain contains $|U| = 2^{64}$ possible 64-bit integers, but your hash table buffer has capacity $M = 8$, the **Pigeonhole Principle** dictates that at least two distinct keys must map to the same bucket index:
$$h(k_1) = h(k_2) \\quad \\text{where } k_1 \\neq k_2$$

When two distinct keys produce identical slot indices, a **Collision** occurs. How an engine resolves collisions determines its performance, cache behavior, and memory footprint.

---

### Collision Strategy 1: Separate Chaining (Buckets)

In **Separate Chaining**, each slot in the table array is not a single item, but the head of a linked list (or balanced BST) called a **Bucket**:
* When inserting $(k_1, v_1)$, if bucket $h(k_1)$ is empty, a single-element list is created.
* When inserting $(k_2, v_2)$ where $h(k_2) = h(k_1)$, the new node is simply appended or prepended to the linked list at that bucket.
* **Lookup**: Hash $k$, jump to bucket index $h(k)$ in $O(1)$, and traverse the linked chain comparing keys ($O(1)$ expected time if chains are short).

#### Trade-offs:
* **Advantages**: Gracefully handles load factors $\\alpha > 1.0$ without running out of slots; simple deletion logic (standard node pointer splicing).
* **Disadvantages**: Incurs pointer memory overhead (8 bytes per node on 64-bit architectures) and CPU cache misses due to fragmented heap node allocations.

---

### Collision Strategy 2: Open Addressing & Linear Probing

In **Open Addressing**, all key-value entries are stored directly within the flat backing array—no auxiliary pointers or heap nodes are allocated! Every element occupies a single array cell.

When slot $h(k)$ is already occupied by a different key, the algorithm **probes** adjacent slots sequentially until an empty slot is discovered.

Under **Linear Probing**, probe sequences follow:
$$h_i(k) = (h(k) + i) \\pmod M \\quad \\text{for } i = 0, 1, 2, \\dots, M-1$$

#### The Critical "Tombstone (DEL)" Problem
In linear probing, deleting a key requires extreme care!
* Suppose key $A$ maps to index 2, key $B$ also maps to index 2 (collides and probes to index 3), and key $C$ maps to index 2 (probes to index 4).
* If you delete key $B$ by simply wiping index 3 back to \`EMPTY\` (null), a subsequent search for key $C$ will hash to index 2, see slot 2 is occupied by $A$, check slot 3, find it is **EMPTY**, and **terminate early**, falsely concluding that key $C$ is not in the table!
* **Solution**: You must mark deleted slots with a special sentinel value called a **Tombstone (\`DEL\`)**.
  * During a **Search**: The probe sequence must *continue past* \`DEL\` markers.
  * During an **Insertion**: The probe sequence can reuse a \`DEL\` slot to store the new incoming key!

---

### Load Factor ($\\alpha$) and Dynamic Rehashing

The **Load Factor** $\\alpha$ measures the saturation level of the table:
$$\\alpha = \\frac{N}{M} = \\frac{\\text{Total Active Elements}}{\\text{Total Bucket Capacity}}$$

* As $\\alpha \\to 1.0$ in Open Addressing, collisions escalate exponentially into massive contiguous blocks called **Primary Clusters**. Search times degrade from $O(1)$ to disastrous $O(n)$ linear scans.
* When $\\alpha$ crosses the standard threshold (typically $\\alpha > 0.70$ or $0.75$):
  1. Allocate a brand new backing array with **double the capacity** ($2M$).
  2. Iterate through every element in the old table.
  3. Re-calculate the new hash index $h_{\\text{new}}(k) = k \\pmod{2M}$ and insert it into the new table.
* Because resizing doubles capacity geometrically, the expensive $O(n)$ rehashing cost is spread over $n$ individual insertions, guaranteeing an **amortized $O(1)$** cost per insertion!

---

### Algorithmic Superpower: The Two Sum Pattern

The hallmark problem demonstrating Hash Table dominance is **Two Sum** (LeetCode #1):
> Given an array of $n$ numbers and a target sum $T$, find two indices such that $\\text{nums}[i] + \\text{nums}[j] = T$.

* **Naive Nested Loops**: Comparing every possible pair takes $O(n^2)$ time.
* **Hash Table Optimization**: For each number $x = \\text{nums}[i]$, compute its required complement:
  $$\\text{complement} = T - x$$
* Query the hash table: *"Have we already seen this complement earlier?"*
  * If **YES**: Found matching pair in instantaneous $O(1)$ time!
  * If **NO**: Insert $x \\to i$ into the hash table and continue.
* **Total Time**: Strictly **$O(n)$ linear time** in a single pass!
    `,
    banglaNote: {
      topic: "হ্যাশ টেবিল, হ্যাশ ফাংশন, কলিশন ও লিনিয়ার প্রোবিং (Hash Table Deep Dive)",
      englishContext: "A hash table transforms arbitrary keys into array indices using mathematical hash functions, delivering instant average O(1) lookups while handling collisions via chaining or open addressing.",
      banglaText: `
### 💡 সহজ উপমা: হোটেলের চাবির বোর্ড বা পোস্ট অফিসের চিঠি খোপ
একটি ৫-তারকা হোটেলের রিসেপশনের কথা ভাবুন। সেখানে শত শত রুমের চাবি রাখার জন্য একটি কাঠের বোর্ড আছে যেখানে প্রতি রুম নম্বরের জন্য একটি করে নির্দিষ্ট খোপ বরাদ্দ। আপনি যদি বলেন "রুম ৩০৫ এর চাবি দিন", রিসেপশনিস্ট কিন্তু ১ম খোপ থেকে শুরু করে ৩০০টি খোপ খুঁজে দেখেন না; সরাসরি ৩০৫ নম্বর খোপে হাত দিয়েই চাবি বের করে দেন ($O(1)$ সময়)। হ্যাশ টেবিলও ঠিক তেমনি একটি জাদুকরী গাণিতিক বোর্ড!

### ⚙️ হ্যাশ ফাংশন কীভাবে $O(1)$ কনস্ট্যান্ট সময় এনে দেয়?
সাধারণ অ্যারেতে ইনডেক্সিং করার জন্য $0, 1, 2$ পূর্ণসংখ্যার প্রয়োজন হয়। কিন্তু বাস্তবে আমাদের কি (Key) হতে পারে কারো নাম (যেমন \`"rahim"\`), ইমেইল, বা ১২ সংখ্যার ফোন নম্বর। 
- **হ্যাশ ফাংশন (\`hash(key)\`):** একটি গাণিতিক সমীকরণ যা যেকোনো টেক্সট বা বড় সংখ্যাকে একটি নির্দিষ্ট রেঞ্জের ইনডেক্সে রূপান্তর করে:
  $$\\text{Index} = \\text{hash}(key) \\% \\text{capacity}$$
- ফলে কোটি কোটি ডেটার মধ্যেও মেমোরি অ্যাড্রেস বের করতে কোনো লুপ চালাতে হয় না, সরাসরি $O(1)$ সময়ে ডেটা খুঁজে পাওয়া যায়।

### 💥 কলিশন (Collision) কেন ঘটে?
গণিতের **পিজিয়নহোল নীতি (Pigeonhole Principle)** অনুযায়ী: আপনার কাছে যদি ১০টি খোপ থাকে আর ১১টি পায়রা থাকে, তবে অন্তত একটি খোপে ২টি পায়রাকে বসতেই হবে! 
- যেহেতু সম্ভাব্য কি (Key)-এর সংখ্যা অসীম কিন্তু হ্যাশ টেবিলের মেমোরি সীমিত, তাই দুটি ভিন্ন কি একই ইনডেক্সে ম্যাপ হবেই। একে বলে **Collision**।

### 🛠️ কলিশন সমাধানের দুটি প্রধান অস্ত্র:
১. **সেপারেট চেইনিং (Separate Chaining):** হ্যাশ টেবিলের প্রতিটি স্লটে একটি করে ছোট লিঙ্কড লিস্ট রাখা হয়। একই ইনডেক্সে একাধিক ডাটা এলে লিঙ্কড লিস্টের নোড আকারে যুক্ত হয়। (Java HashMap এটি ব্যবহার করে)।
২. **ওপেন অ্যাড্রেসিং / লিনিয়ার প্রোবিং (Linear Probing):** কোনো ইনডেক্স আগে থেকেই দখল থাকলে পরের খালি স্লট \`(index + 1) % capacity\` খুঁজে সেখানে ডেটা রাখা হয়। কোনো অতিরিক্ত লিঙ্কড লিস্টের প্রয়োজন হয় না।

### 🪦 টুম্বস্টোন (Tombstone - DEL Marker) কেন অপরিহার্য?
লিনিয়ার প্রোবিংয়ে কোনো উপাদান মুছে ফেললে স্লটটি ফাঁকা (Null) রাখা যাবে না!
- **কারণ:** পরবর্তীতে অন্য কোনো উপাদান খুঁজতে গিয়ে কম্পিউটার যদি ফাঁকা স্লট পায়, সে ভাববে ডাটাটি টেবিলেই নেই এবং সার্চ বন্ধ করে দেবে!
- **সমাধান:** মুছে ফেলা স্লটে একটি "কবরফলক" বা টুম্বস্টোন (\`DEL\` মার্কার) বসিয়ে দেওয়া হয়। সার্চিং করার সময় এই স্লট টপকে সামনে যাওয়া যায়, আবার নতুন ডেটা ঢোকানোর সময় এই স্লটে লিখে ফেলা যায়।

### ⚖️ লোড ফ্যাক্টর ($\alpha$) ও ডায়নামিক রিহ্যাশিং:
- **Load Factor:** $\\alpha = \\frac{\\text{Total Elements (n)}}{\\text{Table Size (m)}}$
- যখন টেবিলটি ৭০%-৭৫% পূর্ণ হয়ে যায় ($\\alpha > 0.75$), তখন কলিশন খুব বেড়ে যায়।
- তখন স্বয়ংক্রিয়ভাবে টেবিলের সাইজ দ্বিগুণ ($2 \\times$) করা হয় এবং সব উপাদানকে পুনরায় নতুন হ্যাশ ইনডেক্সে সাজানো হয় (Rehashing)।

### 🚀 বিখ্যাত উদাহরণ: Two-Sum প্রবলেম
একটি অ্যারে থেকে দুটি সংখ্যার যোগফল $T$ মেলাতে সাধারণ নেস্টেড লুপে $O(n^2)$ সময় লাগে। কিন্তু একটি হ্যাশ টেবিল সাথে রেখে প্রতি সংখ্যার জন্য $T - x$ টেবিলে আছে কি না চেক করলে মাত্র **$O(n)$ লিনিয়ার সময়ে** সম্পূর্ণ সমাধান করা সম্ভব!
      `,
    },
    quizTopicId: "hash-table",
    visualizerLink: {
      label: "Hash Table Studio",
      algorithmId: "hash-table",
      path: "/algorithms/hash-table",
    },
  },
  {
    slug: "binary-tree-fundamentals",
    level: 5,
    levelTitle: "Level 5: Fundamental Data Structures",
    order: 5,
    title: "Binary Tree: Hierarchical Branching, Anatomy & Traversals",
    subtitle: "Master recursive node relationships, Root/Leaf/Height/Depth formulas, Complete vs Full vs Perfect trees, DFS (Pre/In/Post) and BFS Level-Order.",
    estimatedReadTime: "14 min",
    category: "Data Structures",
    content: `
### What Is a Binary Tree?

A **Binary Tree** is a fundamental non-linear, hierarchical data structure composed of discrete elements called **Nodes**. Unlike linear data structures (arrays, linked lists, stacks, and queues) where elements follow an unbroken 1D sequence, a binary tree branches dynamically: **every node contains at most two children**, conventionally termed the **Left Child** and the **Right Child**.

Trees model natural hierarchical relationships such as file systems on your hard drive, HTML DOM structures in a web browser, Abstract Syntax Trees (AST) inside compilers, and decision trees in machine learning.

\`\`\`
          [ 1 ]          <-- Root (Depth 0, Level 0)
         /     \\
      [ 2 ]   [ 3 ]      <-- Level 1
      /   \\   /   \\
    [4]  [5] [6]  [7]    <-- Level 2 (Leaves)
\`\`\`

---

### Core Anatomy & Terminology

Understanding binary trees requires precise mathematical definitions of its structural components:

1. **Root Node:** The topmost node with no incoming edges (zero parent). Every non-empty tree has exactly one root.
2. **Edge:** A directed pointer link from a parent node to its child. A tree with $n$ nodes contains exactly $n - 1$ edges.
3. **Leaf Node (External Node):** A terminating node with **zero children** (\`left == nullptr && right == nullptr\`).
4. **Internal Node:** Any node that has at least one child (non-leaf).
5. **Depth of a Node:** The number of edges on the path from the **Root** downward to the node. The root always has $\\text{Depth} = 0$.
6. **Height of a Node:** The number of edges on the **longest downward path** from that node to a descendant leaf. A leaf has $\\text{Height} = 0$.
7. **Height of the Tree:** The height of the Root node, which equals the maximum depth among all nodes in the tree.
8. **Subtree:** Any node together with all its descendants forms a valid binary tree on its own. This recursive substructure is why virtually all tree algorithms are implemented recursively.

---

### Mathematical Properties of Binary Trees

Binary trees possess elegant combinatorial invariants:

* **Maximum Nodes at Level $L$:** At level $L$ (where root is level 0), there can be at most:
  $$\\text{Max Nodes}(L) = 2^L$$
* **Maximum Total Nodes for Height $h$:** Summing over all levels $0 \\le L \\le h$:
  $$N_{\\max} = \\sum_{L=0}^h 2^L = 2^{h+1} - 1$$
* **Minimum Height for $n$ Nodes:** When a tree is packed completely full:
  $$h_{\\min} = \\lceil \\log_2(n + 1) \\rceil - 1 \\in \\Theta(\\log n)$$
* **Maximum Height for $n$ Nodes:** When each node has only one child (skewed / degenerate tree):
  $$h_{\\max} = n - 1 \\in \\Theta(n)$$

---

### Classifications of Binary Trees

| Tree Type | Formal Structural Definition | Practical Engineering Significance |
| :--- | :--- | :--- |
| **Full (Proper) Tree** | Every node has either **0 or 2 children** (no node has exactly 1 child). | Used in Huffman Coding trees for data compression. |
| **Complete Tree** | All levels $0$ to $h-1$ are 100% filled, and all leaf nodes on the last level are packed **as far left as possible** without gaps. | Backing structure for **Binary Heaps** and Priority Queues stored in 1D arrays without pointer overhead. |
| **Perfect Tree** | All internal nodes have 2 children and **all leaves reside at the exact same depth**. | Maximum node density: total nodes $N = 2^{h+1} - 1$. |
| **Balanced Tree** | For every node, $|\\text{height}(\\text{left}) - \\text{height}(\\text{right})| \\le 1$. | Guarantees $O(\\log n)$ worst-case search and insert times in AVL and Red-Black Trees. |
| **Degenerate (Skewed)**| Every internal node has exactly one child. | Degenerates into a Singly Linked List with slow $O(n)$ access times. |

---

### Tree Traversal Strategies

To process, search, or display data in a tree, we must visit every node systematically. Traversal strategies are split into **Depth-First Search (DFS)** and **Breadth-First Search (BFS)**:

#### 1. Depth-First Traversals (DFS) — Stack / Recursion
* **Pre-Order Traversal (Root $\\to$ Left $\\to$ Right / NLR):**
  Visits the current root node first, then recursively descends into the left subtree, then the right subtree. Used to serialize/clone a tree and evaluate prefix mathematical expressions.
* **In-Order Traversal (Left $\\to$ Root $\\to$ Right / LNR):**
  Recursively descends to the leftmost leaf first, visits the root, then descends right. In a **Binary Search Tree (BST)**, in-order traversal yields node keys in strictly sorted, non-decreasing order!
* **Post-Order Traversal (Left $\\to$ Right $\\to$ Root / LRN):**
  Processes both child subtrees before visiting the parent. Essential for **bottom-up algorithms**: deleting a tree safely, calculating directory folder disk space, or evaluating post-fix expressions.

#### 2. Breadth-First Traversal (BFS) — Queue
* **Level-Order Traversal:**
  Visits nodes tier by tier from top to bottom, left to right. Requires a **FIFO Queue** to buffer child pointers before advancing to subsequent depth levels.

    `,
    banglaNote: {
      topic: "বাইনারি ট্রি, হায়ারার্কিক্যাল নোড ও ট্রাভার্সাল মেকানিক্স (Binary Tree Deep Dive)",
      englishContext: "A binary tree is a non-linear hierarchical data structure where each node branches to at most two children, explored recursively via DFS (Pre/In/Post) or iteratively via BFS Level-Order.",
      banglaText: `
### 💡 সহজ উপমা: বংশলতিকা (Family Tree) বা হার্ডডিস্কের ফোল্ডার স্ট্রাকচার
কম্পিউটার হার্ডড্রাইভে ফোল্ডারের কথা ভাবুন। \`C:\` ড্রাইভের ভেতরে বিভিন্ন ফোল্ডার, তার ভেতরে আবার সাব-ফোল্ডার ও ফাইল। অথবা একটি বংশলতিকার কথা ভাবুন যেখানে পিতা-মাতার মাধ্যমে সন্তান-সন্ততি বংশবিস্তার করে। লিনিয়ার ডাটা স্ট্রাকচারের (অ্যারে, লিঙ্কড লিস্ট) মতো এটি সোজা লাইনে থাকে না; এটি শাখা-প্রশাখায় ছড়িয়ে পড়ে।

### 🌲 উল্টোমুখী গাছ (Inverted Tree Architecture):
প্রকৃতির গাছ নিচ থেকে মাটি ফুঁড়ে ওপরের দিকে ওঠে, কিন্তু কম্পিউটার সায়েন্সের গাছ শুরু হয় আকাশ থেকে নিচের দিকে!
১. **রুট নোড (Root):** গাছের একদম শীর্ষবিন্দু যার কোনো অভিভাবক বা প্যারেন্ট নেই।
২. **এজ (Edge):** দুটি নোডের মধ্যকার সংযোগকারী তীরচিহ্ন। $n$ টি নোড থাকলে গাছে ঠিক $n - 1$ টি এজ থাকে।
৩. **লিফ নোড (Leaf Node):** একদম নিচের নোডগুলো যাদের কোনো সন্তান বা চাইল্ড নেই (\`left == nullptr && right == nullptr\`)।
৪. **বাইনারি নিয়ম:** প্রতিটি নোডের সর্বোচ্চ **২টি চাইল্ড** থাকতে পারে — একটি বাম সন্তান (Left Child) এবং একটি ডান সন্তান (Right Child)।

### 📏 ডেপথ (Depth) বনাম হাইট (Height)-এর সূক্ষ্ম তফাত:
ইন্টারভিউতে সবচেয়ে বেশি গুলিয়ে ফেলা দুটি টার্ম:
- **ডেপথ (Depth):** রুট থেকে নিচের দিকে কোনো নোডে পৌঁছাতে কয়টি এজ পার হতে হয়। রুটের নিজস্ব $\\text{Depth} = 0$।
- **হাইট (Height):** কোনো নোড থেকে নিচের পাতার (Leaf) দিকে সবচেয়ে দীর্ঘ পথের এজের সংখ্যা। যেকোনো পাতার $\\text{Height} = 0$।
- **ট্রি-এর হাইট:** রুট নোডের হাইটই হলো পুরো ট্রির হাইট।

### 🔄 ট্রাভার্সাল (Traversal) মনে রাখার জাদুকরী টেকনিক:
ট্রি-এর প্রতিটি নোড পরিদর্শনের জন্য মূলত দুটি পদ্ধতি আছে:
#### ১. ডেপথ-ফার্স্ট সার্চ (DFS - রিকার্শন / স্ট্যাক):
- **Pre-Order (Node $\\to$ Left $\\to$ Right):** রুট আগে প্রসেস হয়। ট্রি ক্লোন করা বা এক্সপ্রেশন ট্রি সাজাতে ব্যবহৃত হয়।
- **In-Order (Left $\\to$ Node $\\to$ Right):** রুট মাঝে থাকে। বাইনারি সার্চ ট্রিতে (BST) ইন-অর্ডার ট্রাভার্সাল সবসময় ছোট থেকে বড় ক্রমানুসারে সাজানো মান দেয়!
- **Post-Order (Left $\\to$ Right $\\to$ Node):** রুট শেষে প্রসেস হয়। মেমোরি থেকে ট্রি ডিলিট করতে বা সাবট্রি-র সাইজ বের করতে আগে সন্তানদের শেষ করে পরে রুট ডিলিট করতে হয়।
#### ২. ব্রেডথ-ফার্স্ট সার্চ (BFS / Level-Order - কিউ):
- কিউ (Queue) ডাটা স্ট্রাকচার ব্যবহার করে ওপরের তলা থেকে শুরু করে ধাপে ধাপে প্রতি তলার সব নোড বাম থেকে ডানে প্রিন্ট করা।

### 🏰 ট্রি-এর গুরুত্বপূর্ণ ক্লাসিফিকেশন:
১. **Full Binary Tree:** প্রতি নোডের হয় $0$ অথবা $2$ টি চাইল্ড থাকে (কখনোই ১টি চাইল্ড থাকে না)।
২. **Complete Binary Tree:** শেষ লেভেল বাদে সব লেভেল পূর্ণ থাকে, আর শেষ লেভেলের নোডগুলো কোনো ফাঁকা জায়গা না রেখে যতটা সম্ভব বাম ঘেঁষে বসে (এটি **Binary Heap** বা প্রায়োরিটি কিউয়ের মূল ভিত্তি)।
৩. **Perfect Binary Tree:** সব নোডের ২টি সন্তান থাকে এবং সব পাতা একই গভীরতায় থাকে (পিরামিডের মতো নিরেট)। $h$ হাইটের পারফেক্ট ট্রিতে মোট নোড থাকে $2^{h+1} - 1$।
৪. **Balanced Binary Tree:** প্রতিটি নোডের বাম ও ডান সাবট্রির উচ্চতার ব্যবধান সর্বোচ্চ $1$ ($|h_L - h_R| \\le 1$)। এর ফলে সার্চিং সময় নিশ্চিতভাবে $O(\\log n)$ থাকে (AVL ও Red-Black Tree)।

### ⚠️ ডিজেনারেট ট্রি (Skewed Tree Trap):
যদি প্রতিটি নোডের কেবল একটি করে চাইল্ড থাকে (যেমন শুধু ডানদিকে শাখা বাড়ল), তবে গাছটি একটি সরল লিঙ্কড লিস্টে পরিণত হয়! তখন সার্চিং স্পিড $\\log n$ থেকে ধসে পড়ে মারাত্মক ধীরগতির $O(n)$-এ নেমে আসে।
      `,
    },
    quizTopicId: "binary-tree",
    visualizerLink: {
      label: "Binary Tree Studio",
      algorithmId: "binary-tree",
      path: "/algorithms/binary-tree",
    },
  },
  {
    slug: "bst-fundamentals",
    level: 5,
    levelTitle: "Level 5: Fundamental Data Structures",
    order: 6,
    title: "Binary Search Tree (BST): The Ordered Invariant & 3-Case Deletion",
    subtitle: "Master the trichotomy invariant (Left < Root < Right), O(log n) search/insertion, three cases of node deletion with in-order successors, and degenerate skew hazards.",
    estimatedReadTime: "16 min",
    category: "Data Structures",
    content: `
### What Is a Binary Search Tree (BST)?

A **Binary Search Tree (BST)** is an ordered, node-based binary tree data structure designed specifically to unify the fast $O(\\log n)$ search efficiency of a sorted array with the dynamic pointer-linking flexibility of a linked list.

In a standard Binary Tree, values may be arranged arbitrarily. In contrast, every node in a Binary Search Tree must obey the **Strict Subtree Trichotomy Invariant**:

For every node $X$ in the tree:
1. Every key in the **Left Subtree** of $X$ is strictly smaller than $X$'s key:
   $$\\forall u \\in \\text{LeftSubtree}(X): \\quad \\text{key}(u) < \\text{key}(X)$$
2. Every key in the **Right Subtree** of $X$ is strictly greater than $X$'s key:
   $$\\forall v \\in \\text{RightSubtree}(X): \\quad \\text{key}(v) > \\text{key}(X)$$
3. Both the Left and Right subtrees must themselves be valid Binary Search Trees.

\`\`\`
              [ 50 ]
             /      \\
          [ 30 ]    [ 70 ]
         /    \\    /    \\
       [20]  [40] [60]  [80]
\`\`\`

> **Crucial Insight:** The BST invariant is **global, not merely local**! It is not enough for a node to be greater than its immediate left child; it must be strictly greater than **every single descendant** in its entire left subtree. For instance, if node 50 has a left child 30, and 30 has a right child 55, this violates the BST invariant because 55 exceeds the root 50.

---

### Core Operations & Algorithmic Mechanics

#### 1. Search Operation — $O(h)$ Time
To search for a target key $K$ starting at root $R$:
* If $R$ is null, the target is not present (return false).
* If $K == \\text{key}(R)$, the target is found (return true).
* If $K < \\text{key}(R)$, recursively search the **Left Subtree**. The entire right subtree is pruned from consideration!
* If $K > \\text{key}(R)$, recursively search the **Right Subtree**. The entire left subtree is pruned from consideration!

Because every decision branches either left or right, search follows a single root-to-leaf path. On a balanced tree of height $h = \\lfloor \\log_2 n \\rfloor$, search takes only $O(\\log n)$ comparisons.

#### 2. Insertion Operation — $O(h)$ Time
Insertion preserves the BST invariant by locating the unique empty child slot (null pointer) where the new key belongs:
1. Compare the new value with the current node.
2. If smaller, descend into the left child; if larger, descend right.
3. Upon encountering a \`nullptr\`, allocate a new \`BSTNode\` and link it to the parent.
4. If the value already exists, standard BSTs ignore duplicates or increment a frequency counter.

#### 3. Deletion (The 3 Topological Cases) — $O(h)$ Time
Deleting a node from a BST is mathematically more intricate than insertion because the ordering invariant must remain unbroken after removal. Deletion partitions into **3 distinct cases based on node degree**:

* **Case 1: Node has 0 Children (Leaf Node)**
  The target has no descendants (\`left == nullptr && right == nullptr\`). Simply sever the parent pointer to this node and deallocate memory.
* **Case 2: Node has Exactly 1 Child (Degree 1)**
  The target has either a left child or a right child, but not both. Splice the node out of the hierarchy by directly pointing the target's parent to the target's sole child (bypassing the target).
* **Case 3: Node has Exactly 2 Children (Degree 2)**
  The target has both left and right subtrees. We cannot simply bypass the node because the parent pointer cannot link to two children simultaneously.
  * **Solution:** Replace the target's value with its **In-Order Successor** (the smallest key in the right subtree) or its **In-Order Predecessor** (the largest key in the left subtree).
  * The in-order successor is guaranteed to have **at most 1 child** (since it is the leftmost node in the right subtree and therefore has no left child!).
  * Copy the successor's key into the target node, then recursively delete the successor from the right subtree (which falls safely into Case 1 or Case 2).

---

### The In-Order Traversal Sorting Guarantee

A fundamental theorem of Binary Search Trees states that:

$$\\text{In-Order Traversal } (\\text{Left} \\to \\text{Root} \\to \\text{Right}) \\text{ on any valid BST produces a strictly increasing sequence.}$$

#### Proof Sketch by Structural Induction:
- **Base Case:** An empty tree or a single root node trivially satisfies sorted order.
- **Inductive Step:** By definition of the BST invariant:
  $$\\text{all keys in LeftSubtree} < \\text{key}(Root) < \\text{all keys in RightSubtree}$$
  By induction, the in-order traversal of the Left Subtree produces a sorted sequence $L$. Then the Root is visited. Then the in-order traversal of the Right Subtree produces a sorted sequence $R$. Since every element of $L < \\text{key}(Root) < \\text{every element of } R$, the concatenated output $\\langle L, \\text{Root}, R \\rangle$ is strictly sorted in ascending order. $\\blacksquare$

---

### Balanced Topology vs. Degenerate Skew Hazard

The primary vulnerability of an unaugmented Binary Search Tree is its susceptibility to **pathological inputs**:

| Scenario | Insertion Order | Resulting Height $h$ | Search Time | Visual Topology |
| :--- | :--- | :--- | :--- | :--- |
| **Optimal (Balanced)** | Random or median-first (e.g., 50, 25, 75, 12, 37) | $h = \\lfloor \\log_2 n \\rfloor$ | $O(\\log n)$ | Symmetrical branching pyramid |
| **Pathological (Degenerate)** | Pre-sorted ascending (e.g., 10, 20, 30, 40, 50) | $h = n - 1$ | $O(n)$ | Linear Single-Chain Linked List |

When inserting already-sorted keys into a naive BST, every new node is attached as the right child of the previous leaf. The tree collapses into an ordinary linked list, completely destroying logarithmic lookup and degrading operations to linear $O(n)$ scans.

This fatal flaw motivated computer scientists to invent **Self-Balancing Binary Search Trees** (such as **AVL Trees** and **Red-Black Trees**), which automatically perform tree rotations upon insertions and deletions to guarantee $h = O(\\log n)$ under all input distributions.

---

### Asymptotic Complexity Summary

| Operation | Best Case | Average Case | Worst Case (Degenerate) | Auxiliary Space |
| :--- | :--- | :--- | :--- | :--- |
| **Search** | $O(1)$ | $O(\\log n)$ | $O(n)$ | $O(h)$ call stack |
| **Insertion** | $O(1)$ | $O(\\log n)$ | $O(n)$ | $O(h)$ call stack |
| **Deletion** | $O(1)$ | $O(\\log n)$ | $O(n)$ | $O(h)$ call stack |
| **Find Min / Max**| $O(1)$ | $O(\\log n)$ | $O(n)$ | $O(1)$ iterative |
| **In-Order Traversal**| $O(n)$ | $O(n)$ | $O(n)$ | $O(h)$ call stack |
| **Total Memory** | $\\Theta(n)$ | $\\Theta(n)$ | $\\Theta(n)$ | $3 \\times \\text{pointers} + \\text{value}$ |
`,
    banglaNote: {
      topic: "বাইনারি সার্চ ট্রি (BST), ট্রাইকোটমি অর্ডার ও ৩-কেস ডিলিশন মেকানিক্স (BST Deep Dive)",
      englishContext: "A Binary Search Tree (BST) enforces the strict ordering invariant (Left < Root < Right) across all subtrees, providing O(log n) search, insert, and delete with sorted in-order traversal.",
      banglaText: `
### 💡 সহজ উপমা: সংখ্যা অনুমানের খেলা (Higher or Lower Game)
ছোটবেলায় আমরা একটা খেলা খেলতাম — বন্ধু মনে মনে ১ থেকে ১০০-এর মধ্যে একটি সংখ্যা ধরে রাখত। আমরা বলতাম ৫০। সে বলত "না, আরো বড়!"। তখন আমরা মুহূর্তেই ১ থেকে ৫০ বাদ দিয়ে দিতাম এবং পরবর্তী অনুমান করতাম ৭৫। 

বাইনারি সার্চ ট্রি (BST) হলো এই সংখ্যা অনুমানের খেলার একটি চিরস্থায়ী, ডাইনামিক রূপ! প্রতিটি নোডে গিয়ে সিদ্ধান্ত নেওয়া হয়: "আমি কি বামে যাব নাকি ডানে যাব?"। প্রতিটি পদক্ষেপে বাকি থাকা ট্রির অর্ধেক অংশ সম্পূর্ণ বাতিল হয়ে যায়।

---

### ⚖️ গ্লোবাল ট্রাইকোটমি ইনভেরিয়েন্ট (Subtree Invariant Rule):
একটি সাধারণ বাইনারি ট্রির সাথে BST-র প্রধান পার্থক্য হলো এর কঠোর গাণিতিক নিয়ম:
যেকোনো নোড $X$-এর জন্য:
১. তার **সম্পূর্ণ বাম সাবট্রির** প্রতিটি নোডের মান $X$-এর চেয়ে **ছোট** হতে হবে ($< X$)।
২. তার **সম্পূর্ণ ডান সাবট্রির** প্রতিটি নোডের মান $X$-এর চেয়ে **বড়** হতে হবে ($> X$)।

> ⚠️ **ইন্টারভিউ সতর্কতা:** অনেকে ভুল মনে করে যে কেবল সরাসরি বাম সন্তান ছোট এবং সরাসরি ডান সন্তান বড় হলেই BST হয়। এটি একদম ভুল! যদি ৫০-এর বাম চাইল্ড ৩০ হয়, আর ৩০-এর ডান চাইল্ড ৫৫ হয় — তবে লোকালি ৩০ < ৫৫ সঠিক মনে হলেও, রুটের সাপেক্ষে বাম সাবট্রিতে ৫০-এর চেয়ে বড় ৫৫ ঢুকে পড়েছে! এটি BST-র নিয়ম ভঙ্গ করে।

---

### 🎯 ডিলিশনের ৩টি কেস ও ইন-অর্ডার সাকসেসর ট্রিক:
BST থেকে কোনো নোড ডিলিট করা সবচেয়ে মজার ও বুদ্ধিবৃত্তিক অ্যালগরিদম। নোডের কয়টি সন্তান আছে তার ওপর ভিত্তি করে ৩টি কেস তৈরি হয়:

#### ১. কেস ১: পাতা নোড (Leaf Node — ০টি সন্তান)
কোনো ঝামেলা নেই! নোডের কোনো বংশধর নেই। কেবল তার প্যারেন্টের সংশ্লিষ্ট পয়েন্টার \`nullptr\` করে মেমোরি ফ্রি করে দিলেই কাজ শেষ।

#### ২. কেস ২: একটি সন্তান (Degree 1 — ১টি চাইল্ড)
নোডের মাত্র একটি সন্তান আছে (হয় বামে অথবা ডানে)। নোডটিকে মাঝখান থেকে সরিয়ে তার প্যারেন্টের সাথে সরাসরি নাতি/নাতনিকে (সন্তানকে) যুক্ত করে দেওয়া হয় (বাইপাস লিংক)।

#### ৩. কেস ৩: দুটি সন্তান (Degree 2 — ২টি চাইল্ড)
এটি ইন্টারভিউয়ারদের সবচেয়ে প্রিয় প্রশ্ন! নোডের দুটি সাবট্রিই বিদ্যমান। প্যারেন্ট পয়েন্টার একা দুটি চাইল্ডকে ধরে রাখতে পারে না।
- **সমাধান:** আমরা নোডটির ফিজিক্যাল স্ট্রাকচার ডিলিট না করে তার ভেতরের মান পরিবর্তন করি। 
- কাকে বসাব? তার **In-Order Successor** (ডান সাবট্রির সবচেয়ে ছোট মান) অথবা **In-Order Predecessor** (বাম সাবট্রির সবচেয়ে বড় মান)।
- **ম্যাজিক ট্রিক:** ডান সাবট্রির সবচেয়ে ছোট নোডটির কিন্তু **কখনোই বাম সন্তান থাকতে পারে না**! (কারণ বাম সন্তান থাকলে সেই হতো সবচেয়ে ছোট)। তাই সাকসেসর নোডটি নিজে সর্বদা কেস ১ অথবা কেস ২-এর মধ্যে পড়ে। ফলে তাকে সহজেই ডিলিট করা যায়!

---

### 📈 ইন-অর্ডার ট্রাভার্সালের জাদুকরী গ্যারান্টি:
যেকোনো বৈধ BST-তে যদি আপনি **In-Order Traversal** (বাম সাবট্রি $\\to$ বর্তমান নোড $\\to$ ডান সাবট্রি) চালান, তবে আউটপুট সর্বদা **ছোট থেকে বড় ক্রমানুসারে নিখুঁতভাবে সাজানো (Sorted Ascending Order)** আসবে!
যেমন: ট্রিতে যদি এলোমেলোভাবে ৫০, ৩০, ৭০, ২০, ৪০, ৬০, ৮০ ইনসার্ট করা থাকে, ইন-অর্ডার ট্রাভার্সাল দিলে সাথে সাথে আউটপুট পাবেন: \`[20, 30, 40, 50, 60, 70, 80]\`।

---

### ⚠️ ডিজেনারেট ট্রির বিপদ (The Sorted Insertion Hazard):
একটি সর্টেড অ্যারের ওপর বাইনারি সার্চ অত্যন্ত দ্রুত কাজ করলেও নতুন উপাদান যোগ করতে $O(n)$ মেমোরি শিফট লাগে। BST-তে নতুন উপাদান যোগ করতে কোনো মেমোরি শিফটিং লাগে না, শুধু নতুন পয়েন্টার জুড়তে হয়।

কিন্তু একটি মারাত্মক বিপদ আছে! আপনি যদি আগে থেকেই সাজানো সংখ্যা যেমন: \`10, 20, 30, 40, 50\` একের পর এক সাধারণ BST-তে ইনসার্ট করেন, তবে প্রতিটি সংখ্যা আগেরটির ডান সন্তান হিসেবে বসে যাবে। ফলে কোনো বাম শাখা তৈরি হবে না! গাছটি বাঁকা হয়ে একটি সিঙ্গলি লিঙ্কড লিস্টে পরিণত হবে!
তখন গাছের উচ্চতা $h = n$ হয়ে যায়, এবং সার্চিং স্পিড $\\log n$ থেকে ধসে পড়ে মারাত্মক ধীরগতির $O(n)$-এ রূপ নেয়। এই সংকট সমাধানের জন্যই পরবর্তীতে উদ্ভাবন করা হয়েছে সেলফ-ব্যালান্সিং ট্রি (যেমন **AVL Tree** এবং **Red-Black Tree**)।
      `,
    },
    quizTopicId: "bst",
    visualizerLink: {
      label: "Binary Search Tree Studio",
      algorithmId: "bst",
      path: "/algorithms/bst",
    },
  },
  {
    slug: "avl-tree-fundamentals",
    level: 5,
    levelTitle: "Level 5: Hierarchical Tree Architectures",
    order: 3,
    title: "AVL Tree: Strictly Self-Balancing Binary Search Trees",
    subtitle: "Mathematical proof of logarithmic height bounds, the Balance Factor invariant, localized O(1) single/double rotations (LL, RR, LR, RL), and cascading deletion mechanics.",
    estimatedReadTime: "18 min",
    category: "Data Structures",
    content: `
### Chapter 1: The Problem of Degenerate Trees and the AVL Breakthrough

In a naive Binary Search Tree (BST), the shape of the tree is entirely at the mercy of the input sequence. If $n$ elements arrive in monotonic ascending order (e.g., $10, 20, 30, 40, 50$), every node attaches as a solitary right child. The tree structure degenerates into a linear linked list of height $h = n - 1$, and search, insertion, and deletion catastrophically collapse from logarithmic $O(\\log n)$ down to linear $O(n)$.

In 1962, two Soviet mathematicians, **Georgy Adelson-Velsky** and **Evgenii Landis**, published a seminal paper introducing the world's very first self-balancing binary search tree, named the **AVL Tree** in their honor.

#### The Core AVL Innovation:
An AVL Tree is an augmented binary search tree where every node maintains an explicit height invariant:
$$\\text{For every node } X, \\quad |\\text{height}(X.\\text{left}) - \\text{height}(X.\\text{right})| \\le 1$$

Whenever an insertion or deletion threatens to break this invariant, the tree detects the imbalance during recursive backtracking and performs localized $O(1)$ pointer rearrangements called **Tree Rotations** to instantly restore balance.

---

### Chapter 2: The Balance Factor (BF) Invariant

To enforce self-balancing efficiently, every AVL node tracks its own subtree height. By convention:
- An empty subtree (null pointer) has height $h = 0$ (or $-1$ in 0-indexed definitions; in AlgoHub we define $h(\\text{null}) = 0$).
- A leaf node has height $h = 1$.
- Any internal node has height:
  $$h(X) = 1 + \\max(h(X.\\text{left}), h(X.\\text{right}))$$

The **Balance Factor** of a node $X$, denoted $BF(X)$, is defined as:
$$BF(X) = h(X.\\text{left}) - h(X.\\text{right})$$

#### The Invariant States:
| Balance Factor $BF(X)$ | Subtree State | Interpretation |
| :--- | :--- | :--- |
| **$+1$** | Left-Heavy | Left subtree is taller by exactly 1 level. Perfectly legal. |
| **$0$** | Symmetrical | Left and right subtrees have equal height. Perfectly balanced. |
| **$-1$** | Right-Heavy | Right subtree is taller by exactly 1 level. Perfectly legal. |
| **$+2$** | Critical Left Violation | Left subtree is 2 levels taller. **Must trigger rotation.** |
| **$-2$** | Critical Right Violation | Right subtree is 2 levels taller. **Must trigger rotation.** |

---

### Chapter 3: Mathematical Proof of the Maximum Height Bound

Why does the simple constraint $|BF| \\le 1$ guarantee that an AVL tree with $n$ nodes will never degenerate into $O(n)$?

Let $N(h)$ represent the **minimum number of nodes** required to construct an AVL tree of height $h$.
- For $h = 0$: $N(0) = 0$ (empty tree)
- For $h = 1$: $N(1) = 1$ (single root node)
- For $h = 2$: $N(2) = 2$ (root with 1 child)

To construct an AVL tree of height $h$ with the absolute fewest possible nodes, one subtree must have height $h - 1$ and the other subtree must have height $h - 2$ (differing by exactly 1):
$$N(h) = 1 + N(h - 1) + N(h - 2)$$

Notice the striking resemblance to the **Fibonacci recurrence** ($F_k = F_{k-1} + F_{k-2}$)!
By mathematical induction, we can prove:
$$N(h) = F_{h+2} - 1$$

Recall that the $k$-th Fibonacci number grows exponentially according to Binet's formula with the Golden Ratio $\\phi = \\frac{1 + \\sqrt{5}}{2} \\approx 1.618$:
$$F_k \\approx \\frac{\\phi^k}{\\sqrt{5}}$$

Therefore:
$$n \\ge N(h) \\approx \\frac{\\phi^{h+2}}{\\sqrt{5}} - 1$$
$$\\phi^{h+2} \\le \\sqrt{5}(n + 1)$$
$$(h + 2) \\log_2(\\phi) \\le \\log_2(\\sqrt{5}(n + 1))$$
$$h < \\frac{\\log_2(n + 1)}{\\log_2(\\phi)} \\approx \\frac{1}{\\log_2(1.618)} \\log_2(n + 1) \\approx 1.4404 \\log_2(n + 1)$$

$$\\mathbf{h_{\\text{max}} < 1.4404 \\log_2(n + 2) = O(\\log n)}$$

**Theorem Conclusion:** Even in the most pathological, minimally-packed worst case imaginable, an AVL tree of 1,000,000 nodes will have a maximum height of at most:
$$h \\le 1.44 \\times \\log_2(10^6) \\approx 1.44 \\times 20 \\approx 28 \\text{ levels}$$
Search operations will never require more than 28 pointer dereferences!

---

### Chapter 4: The Four Fundamental Tree Rotations

When an insertion or deletion causes a node $Z$ to have $BF(Z) = +2$ or $BF(Z) = -2$, we inspect the balance factor of $Z$'s taller child $Y$ to identify which of the **4 canonical rotation cases** applies:

#### Case 1: Left-Left (LL) — Single Right Rotation
- **Condition:** $BF(Z) = +2$ and $BF(Z.\\text{left}) \\ge 0$.
- **Cause:** Insertion occurred in the left subtree of the left child.
- **Remedy:** Rotate $Z$ to the right. $Y$ (left child) becomes the new subtree root; $Z$ becomes $Y$'s right child. $Y$'s original right subtree ($T_2$) is transferred to become $Z$'s new left child.
- **Time Complexity:** $O(1)$ constant time (3 pointer reassignments, 2 height recalculations).

#### Case 2: Right-Right (RR) — Single Left Rotation
- **Condition:** $BF(Z) = -2$ and $BF(Z.\\text{right}) \\le 0$.
- **Cause:** Insertion occurred in the right subtree of the right child.
- **Remedy:** Rotate $Z$ to the left. $Y$ (right child) becomes the new subtree root; $Z$ becomes $Y$'s left child. $Y$'s original left subtree ($T_2$) is transferred to become $Z$'s new right child.
- **Time Complexity:** $O(1)$ constant time.

#### Case 3: Left-Right (LR) — Double Rotation
- **Condition:** $BF(Z) = +2$ and $BF(Z.\\text{left}) < 0$.
- **Cause:** The left subtree is taller overall, but its inner right branch is heavy (zig-zag configuration). A single right rotation would simply flip the zig-zag to the other side without fixing height!
- **Remedy:** Two atomic steps:
  1. Perform a **Left Rotation** on $Z$'s left child ($Y$). This converts the zig-zag into a straight left-left line.
  2. Perform a **Right Rotation** on $Z$. Balance is fully restored.
- **Time Complexity:** $O(1)$ constant time.

#### Case 4: Right-Left (RL) — Double Rotation
- **Condition:** $BF(Z) = -2$ and $BF(Z.\\text{right}) > 0$.
- **Cause:** The right subtree is taller overall, but its inner left branch is heavy (zag-zig configuration).
- **Remedy:** Two atomic steps:
  1. Perform a **Right Rotation** on $Z$'s right child ($Y$). This converts the zag-zig into a straight right-right line.
  2. Perform a **Left Rotation** on $Z$. Balance is fully restored.
- **Time Complexity:** $O(1)$ constant time.

---

### Chapter 5: Insertion vs. Deletion Rebalancing

A critical architectural distinction exists between AVL insertions and deletions:

#### 1. The Insertion Rebalance Invariant:
When a new key is inserted into an AVL tree, it increases the height of at most one leaf-to-root branch by 1. As the recursive call backtracks towards the root:
- We encounter the **lowest unbalanced node** $Z$ ($|BF| = 2$).
- We execute exactly **one single or double rotation** at $Z$.
- This rotation reduces the height of $Z$'s subtree back to what it was before the insertion!
- Therefore, no ancestor above $Z$ experiences a height change.
- **Rule:** AVL insertion requires **at most 1 rotation** to restore global balance across the entire tree!

#### 2. The Deletion Rebalance Hazard (Cascading Rotations):
When a key is deleted, a subtree's height may decrease by 1. 
- Restoring balance at node $Z$ may decrease the overall height of $Z$'s subtree.
- This height reduction can propagate upwards, causing $Z$'s parent to become unbalanced ($|BF| = 2$).
- In the worst case, rotations must cascade all the way up to the root node.
- **Rule:** AVL deletion may require up to $O(\\log n)$ rotations during recursive backtracking.

---

### Chapter 6: Architectural Comparison: AVL vs. Red-Black vs. Naive BST

| Metric / Feature | Naive BST | AVL Tree | Red-Black Tree |
| :--- | :--- | :--- | :--- |
| **Balance Strictness** | None (Unbalanced) | Strict ($|BF| \\le 1$) | Relaxed ($h \\le 2 \\log_2(n+1)$) |
| **Max Height Bound** | $n - 1$ | $\\approx 1.44 \\log_2 n$ | $\\approx 2.0 \\log_2 n$ |
| **Search Performance** | $O(n)$ worst-case | **Fastest** (flattest tree) | Slightly slower (taller tree) |
| **Insertion Rotations** | $0$ | $\\le 1$ rotation | $\\le 2$ rotations |
| **Deletion Rotations** | $0$ | $\\le O(\\log n)$ rotations | $\\le 3$ rotations |
| **Per-Node Metadata** | None | 1 integer (Height or $BF$) | 1 bit (Color: Red/Black) |
| **Ideal Production Use** | Prototyping / Teaching | **Lookup-intensive** systems | **Write-heavy** maps (\`std::map\`) |
`,
    banglaNote: {
      topic: "এভিএল ট্রি (AVL Tree), ব্যালান্স ফ্যাক্টর ও ৪-ঘূর্ণন মেকানিক্স (AVL Tree Deep Dive)",
      englishContext: "An AVL Tree strictly bounds height to 1.44 log₂(n) via Balance Factor tracking and four localized O(1) rotations (LL, RR, LR, RL), eliminating worst-case skew forever.",
      banglaText: `
### 💡 সহজ উপমা: অ্যাক্রোব্যাট ও ব্যালান্সিং স্কেল (The Self-Balancing Scale)
একটি সাধারণ বাইনারি সার্চ ট্রিতে যদি ছোট থেকে বড় সংখ্যা ক্রমানুসারে ইনসার্ট করতে থাকেন (যেমন: ১০, ২০, ৩০, ৪০, ৫০), তবে প্রতিবার নতুন সংখ্যাটি শুধু ডান সন্তান হিসেবে যুক্ত হতে থাকে। ফলে গাছটি বেঁকে গিয়ে একটি সাধারণ সিঙ্গলি লিঙ্কড লিস্টের মতো লম্বা হয়ে যায়! তখন এর সার্চিং স্পিড $\\log n$ থেকে ধসে পড়ে মারাত্মক ধীরগতির $O(n)$-এ পরিণত হয়।

১৯৬২ সালে দুই গণিতবিদ **Georgy Adelson-Velsky** এবং **Evgenii Landis** এমন একটি কাঠামোর উদ্ভাবন করেন যা কখনোই বাঁকা হতে পারে না!
ভাবুন একজন দড়ির ওপর হাঁটা অ্যাক্রোব্যাটের কথা — তার হাতে একটি লম্বা ভারসাম্য রক্ষার লাঠি থাকে। শরীরের ওজন সামান্য বামে বা ডানে ঝুঁকলেই সে সাথে সাথে লাঠি ঘুরিয়ে নিজেকে সোজা করে নেয়।

এভিএল ট্রি ঠিক এই কাজটিই করে! প্রতিটি ইনসারশন বা ডিলিশনের পর সে স্বয়ংক্রিয়ভাবে গাছটির উচ্চতা পরিমাপ করে এবং কোনো দিক বেশি ভারী হয়ে গেলে সাথে সাথে **O(1) সময়ের লোকাল রোটেশন (ঘূর্ণন)** চালিয়ে ভারসাম্য ফিরিয়ে আনে।

---

### ⚖️ ব্যালান্স ফ্যাক্টর (Balance Factor - BF) কী?
প্রতিটি নোডের একটি নিজস্ব ব্যালান্স ফ্যাক্টর থাকে:
$$\\text{Balance Factor (BF)} = \\text{বাম সাবট্রির উচ্চতা} - \\text{ডান সাবট্রির উচ্চতা}$$

একটি এভিএল ট্রিতে প্রতিটি নোডের ব্যালান্স ফ্যাক্টর অবশ্যই নিচের ৩টির যেকোনো একটি হতে হবে:
- **$+1$**: বাম দিক ১ ধাপ লম্বা (Left-Heavy কিন্তু সম্পূর্ণ বৈধ)।
- **$0$**: বাম ও ডান সাবট্রি সমান সমান (Perfect Balance)।
- **$-1$**: ডান দিক ১ ধাপ লম্বা (Right-Heavy কিন্তু সম্পূর্ণ বৈধ)।

যদি কোনো অপারেশনের পর কোনো নোডের BF হয়ে যায় **$+2$** অথবা **$-2$**, তবে সাথে সাথে অ্যালার্ম বেজে ওঠে এবং গাছটি তাৎক্ষণিক রোটেশন চালিয়ে ভারসাম্য ঠিক করে নেয়!

---

### 🔄 ৪টি ক্লাসিক রোটেশন (The 4 Canonical Rotations)

ভারসাম্যহীনতা কোন দিকে তৈরি হয়েছে তার ওপর নির্ভর করে ৪ ধরনের রোটেশন সম্পন্ন হয়:

#### ১. Left-Left (LL) কেস ➔ Single Right Rotation:
- **কখন হয়:** কোনো নোডের $BF = +2$ এবং তার বাম সন্তানের $BF \\ge 0$। অর্থাৎ বাম দিকের বাইরের শাখায় নতুন নোড ঢুকেছে।
- **সমাধান:** ভারাক্রান্ত নোডটিকে ডান দিকে এক পাক ঘুরিয়ে দিন (Right Rotation)। বাম সন্তান ওপরে উঠে নতুন রুট হয়, আর আগের রুটটি তার ডান সন্তান হিসেবে নিচে নেমে আসে।

#### ২. Right-Right (RR) কেস ➔ Single Left Rotation:
- **কখন হয়:** কোনো নোডের $BF = -2$ এবং তার ডান সন্তানের $BF \\le 0$। অর্থাৎ ডান দিকের বাইরের শাখায় নতুন নোড ঢুকেছে।
- **সমাধান:** নোডটিকে বাম দিকে এক পাক ঘুরিয়ে দিন (Left Rotation)। ডান সন্তান ওপরে ওঠে এবং আগের রুটটি তার বাম সন্তান হয়ে যায়।

#### ৩. Left-Right (LR) কেস ➔ Double Rotation (Left then Right):
- **কখন হয়:** কোনো নোডের $BF = +2$ কিন্তু তার বাম সন্তানের $BF < 0$। এটি একটি জিগ-জ্যাগ (Zig-Zag) বা ভেতরের দিকের মোচড়। সরাসরি Right Rotation দিলে জিগ-জ্যাগটি শুধু অন্যদিকে উল্টে যাবে, উচ্চতা কমবে না!
- **সমাধান:** 
  - ধাপ ১: প্রথমে বাম সন্তানকে বামে ঘুরিয়ে (Left Rotate) জিগ-জ্যাগ সোজা করে LL লাইনে পরিণত করা হয়।
  - ধাপ ২: এরপর মূল নোডটিকে ডানে ঘুরিয়ে (Right Rotate) নিখুঁত ভারসাম্য ফিরিয়ে আনা হয়।

#### ৪. Right-Left (RL) কেস ➔ Double Rotation (Right then Left):
- **কখন হয়:** কোনো নোডের $BF = -2$ কিন্তু তার ডান সন্তানের $BF > 0$ (জ্যাগ-জিগ বাঁক)।
- **সমাধান:** 
  - ধাপ ১: প্রথমে ডান সন্তানকে ডানে ঘুরিয়ে (Right Rotate) RR লাইনে সোজা করা হয়।
  - ধাপ ২: এরপর মূল নোডটিকে বামে ঘুরিয়ে (Left Rotate) ভারসাম্য আনা হয়।

---

### 🎯 ইনসারশন বনাম ডিলিশন: রোটেশনের গুরুত্বপূর্ণ পার্থক্য!
ইন্টারভিউতে এটি অত্যন্ত প্রচলিত একটি ট্রিক প্রশ্ন:
- **ইনসারশন (Insertion):** নতুন নোড যোগ করার ফলে ট্রির উচ্চতা সর্বোচ্চ ১ বাড়তে পারে। রিকার্শনের ব্যাকট্র্যাকিংয়ে প্রথম যে নোডে ভারসাম্য নষ্ট হয়, সেখানে **কেবলমাত্র ১টি রোটেশন (সিঙ্গেল বা ডাবল)** দিলেই সেই সাবট্রির উচ্চতা আগের মতো হয়ে যায়! ফলে তার উপরের কোনো পূর্বপুরুষের (Ancestors) ভারসাম্য আর নষ্ট হয় না। তাই ইনসারশনে সর্বোচ্চ **১টি রোটেশনেই কাজ শেষ**।
- **ডিলিশন (Deletion):** কোনো নোড ডিলিট করলে একটি সাবট্রি ছোট হয়ে যেতে পারে। ফলে সেই নোডে রোটেশন দিয়ে ব্যালান্স ঠিক করার পর দেখা যেতে পারে পুরো সাবট্রিটির উচ্চতা ১ কমে গেছে! এই কমে যাওয়া উচ্চতা তার প্যারেন্টকেও ভারসাম্যহীন ($|BF| = 2$) করে দিতে পারে। এভাবে রুট পর্যন্ত **ক্যাসকেডিং রোটেশন** ঘটতে পারে (সর্বোচ্চ $O(\\log n)$ বার রোটেশন)।

---

### 🚀 কখন AVL Tree ব্যবহার করবেন?
- **Read-Heavy সিস্টেমে সেরা:** যেহেতু AVL ট্রির উচ্চতা কঠোরভাবে $\\le 1.44 \\log_2 n$ সীমার মধ্যে রাখা হয়, তাই যেকোনো সার্চিং বা লুকআপ অপারেশনে এটি রেড-ব্ল্যাক ট্রির চেয়েও বেশি দ্রুত।
- যদি আপনার সিস্টেমে ঘন ঘন সার্চ করতে হয় কিন্তু তুলনামূলকভাবে ইনসার্ট/ডিলিট কম হয় (যেমন: ডিকশনারি লুকআপ, ইন-মেমোরি ক্যাশ ইনডেক্সিং), তবে AVL Tree হলো অবিসংবাদিত চ্যাম্পিয়ন!
      `,
    },
    quizTopicId: "avl-tree",
    visualizerLink: {
      label: "AVL Tree Studio",
      algorithmId: "avl-tree",
      path: "/algorithms/avl-tree",
    },
  },
  {
    slug: "heap-fundamentals",
    level: 5,
    levelTitle: "Level 5: Hierarchical Tree Architectures",
    order: 4,
    title: "Binary Heap: Complete Trees, Array Indexing, and Linear O(n) Heapify",
    subtitle: "Master pointerless binary tree representation in contiguous RAM, O(1) peek access, Sift-Up/Sift-Down invariants, mathematical proof of linear O(n) Build-Heap, and priority queue applications.",
    estimatedReadTime: "18 min",
    category: "Data Structures",
    content: `
### Chapter 1: The Priority Problem — Why Not a Sorted Array or BST?

In countless real-world computer systems, algorithms do not need all $n$ items sorted from smallest to largest at every given moment. Instead, they require a **Priority Queue**:
1. Repeatedly inspect the single most critical element (e.g., the minimum cost edge in Prim's/Dijkstra's algorithm, the highest priority process in an OS scheduler).
2. Insert newly arriving elements dynamically.
3. Extract the extreme element and efficiently rebalance.

#### The Fundamental Trade-off of Naive Approaches:
| Data Structure | Peek Min/Max | Insert New Element | Extract Min/Max | Memory / Pointers |
| :--- | :--- | :--- | :--- | :--- |
| **Unsorted Array** | $O(n)$ (Linear scan) | $O(1)$ (Append at end) | $O(n)$ (Find min and shift) | Contiguous (Zero pointers) |
| **Sorted Array** | $O(1)$ (Inspect head/tail) | $O(n)$ (Shift elements) | $O(1)$ or $O(n)$ | Contiguous (Zero pointers) |
| **Linked List** | $O(n)$ or $O(1)$ | $O(1)$ or $O(n)$ | $O(1)$ or $O(n)$ | Pointer overhead ($8$ bytes/node) |
| **Self-Balancing BST** | $O(\\log n)$ | $O(\\log n)$ | $O(\\log n)$ | $24+$ bytes pointer overhead |
| **Binary Heap** | **$O(1)$** | **$O(\\log n)$** | **$O(\\log n)$** | **Contiguous (Zero pointers!)** |

A **Binary Heap** strikes the optimal sweet spot: it does not pay the heavy penalty of maintaining total order among all nodes. It maintains only a **partial order** (parent dominates children), giving instant $O(1)$ extreme element access and blazing $O(\\log n)$ updates—all inside a raw, flat array!

---

### Chapter 2: The Complete Binary Tree Invariant & Zero-Pointer Math

A **Complete Binary Tree** is a binary tree in which every level, except possibly the last, is completely filled, and all nodes in the last level are as far left as possible.

Because there are no gaps or missing branches, a complete binary tree can be mapped directly into a 1D contiguous array using **Level-Order (Breadth-First)** sequence:
- Root is at index \`0\`.
- Root's children are at indices \`1\` and \`2\`.
- Level 2 nodes are at indices \`3, 4, 5, 6\`.

#### The Fundamental Pointerless Index Formulas (0-Indexed):
For any node at array index $i$:
$$\\text{Parent}(i) = \\left\\lfloor \\frac{i - 1}{2} \\right\\rfloor$$
$$\\text{LeftChild}(i) = 2i + 1$$
$$\\text{RightChild}(i) = 2i + 2$$

#### Boundary Conditions:
- If $2i + 1 \\ge n$, the node has **no left child** (it is a leaf node).
- If $2i + 2 \\ge n$, the node has **no right child**.
- The first leaf node in an array of size $n$ begins at index $\\lfloor n / 2 \\rfloor$.
- All non-leaf internal nodes reside in the index range $[0, \\lfloor n / 2 \\rfloor - 1]$.

> [!NOTE]
> **Zero Pointer Overhead & L1 Cache Locality:**
> Standard pointer-based trees store left, right, and parent memory addresses ($24$ bytes of metadata per node). A Binary Heap stores pure integer keys contiguously in cache lines. Navigating from parent to child requires zero memory dereferencing, enabling blistering hardware prefetching speeds.

---

### Chapter 3: Min-Heap vs Max-Heap Ordering Invariants

1. **Min-Heap Property:**
   For every node $i$ other than the root:
   $$\\text{Array}[\\text{Parent}(i)] \\le \\text{Array}[i]$$
   The smallest element is guaranteed to reside at the root index \`0\`.

2. **Max-Heap Property:**
   For every node $i$ other than the root:
   $$\\text{Array}[\\text{Parent}(i)] \\ge \\text{Array}[i]$$
   The largest element is guaranteed to reside at the root index \`0\`.

*Crucial Note:* There is **no relative ordering** between the left sibling and right sibling! In a Min-Heap, the left child could be larger than the right child or vice versa. The invariant only restricts the vertical parent-child relationship.

---

### Chapter 4: Sift-Up & Sift-Down Mechanics

#### 1. Insertion (Sift-Up / Bubble-Up) — $O(\\log n)$:
1. Append the new element $x$ to the end of the array at index $n$. This preserves the complete binary tree structure with zero empty slots.
2. Compare $x$ with its parent at $p = \\lfloor (curr - 1) / 2 \\rfloor$.
3. If $x$ violates the heap property (e.g., $x < \\text{arr}[p]$ in a Min-Heap), swap them.
4. Set $curr = p$ and repeat until $curr = 0$ (root reached) or the parent is already $\\le x$.
5. Height is bounded by $\\lfloor \\log_2 n \\rfloor$, so at most $\\log_2 n$ swaps occur.

#### 2. Extract Root (Sift-Down / Bubble-Down) — $O(\\log n)$:
1. Cache the root value $\\text{arr}[0]$ to return.
2. Move the very last element $\\text{arr}[n - 1]$ into index \`0\` and pop the last slot.
3. Compare the new root with its children ($2i + 1$ and $2i + 2$).
4. Find the **smallest child** (in a Min-Heap) or **largest child** (in a Max-Heap).
5. If the chosen child violates the heap property with the current node, swap them.
6. Recurse downward until the node is smaller than both children or becomes a leaf.

---

### Chapter 5: The Mathematical Triumph of Linear $O(n)$ Heapify

If you insert $n$ elements into an empty heap one by one, each insertion costs up to $O(\\log n)$, yielding a total time of $O(n \\log n)$.

However, Robert W. Floyd invented **Bottom-Up Heapify (Build-Heap)**: start from the last non-leaf node $\\lfloor n / 2 \\rfloor - 1$ down to the root \`0\`, and call \`siftDown()\` on each node!

#### The Surprising Mathematical Proof of $O(n)$:
In a complete binary tree of height $H = \\lfloor \\log_2 n \\rfloor$:
- Level $0$ (Leaves): $\\approx n / 2$ nodes. Their height is $0$. Sift-down work = $0$.
- Level $1$: $\\approx n / 4$ nodes. Their height is $1$. Sift-down work $\\le 1$.
- Level $2$: $\\approx n / 8$ nodes. Their height is $2$. Sift-down work $\\le 2$.
- Root level: Exactly $1$ node. Its height is $H$. Sift-down work $\\le H$.

Summing the total work across all levels:
$$\\text{Total Work} = \\sum_{h=0}^{\\lfloor \\log_2 n \\rfloor} \\frac{n}{2^{h+1}} \\cdot h = \\frac{n}{2} \\sum_{h=0}^{\\infty} \\frac{h}{2^h}$$

The infinite series $\\sum_{h=0}^{\\infty} \\frac{h}{2^h}$ converges exactly to $2$:
$$\\sum_{h=0}^{\\infty} \\frac{h}{2^h} = \\frac{1}{2} + \\frac{2}{4} + \\frac{3}{8} + \\frac{4}{16} + \\cdots = 2$$

Therefore:
$$\\text{Total Operations} \\le \\frac{n}{2} \\cdot 2 = n = O(n)$$

> [!TIP]
> **Why is Build-Heap linear?**
> The vast majority of nodes in a binary tree live at the bottom (half are leaves, three-quarters are in the bottom two levels). In bottom-up heapify, the huge number of bottom nodes do almost zero work ($h=0$ or $1$), while only the solitary root node traverses the full height $\\log n$.
      `,
    banglaNote: {
      topic: "বাইনারি হিপ (Binary Heap), ১-ডি অ্যারে ম্যাপিং এবং লিনিয়ার O(n) হিপিফাই (Binary Heap Deep Dive)",
      englishContext: "Binary Heap maps a complete binary tree into a contiguous 1D array without pointers. Parent-child relationships are derived in O(1) using index arithmetic, giving O(1) extreme element lookup and O(log n) insertions and extractions.",
      banglaText: `
### 💡 সহজ উপমা: টুর্নামেন্ট ব্র্যাকেট ও অফিসের পিরামিড কাঠামো (The Tournament Hierarchy)
একটি সাধারণ ডাটা স্ট্রাকচারে যদি আপনি ১,০০,০০০ উপাদান রাখেন এবং প্রতি মুহূর্তে জানতে চান "সবচেয়ে ছোট (বা সবচেয়ে বড়) উপাদান কোনটি?", তবে পুরো লিস্টটি প্রতিবার সর্ট করা মারাত্মক অপচয় ($O(n \\log n)$)।

ভাবুন একটি নকআউট ফুটবল টুর্নামেন্টের কথা — আপনি যদি জানতে চান চ্যাম্পিয়ন কে, তবে ১৬ দলের ১৬ জনকেই ১ থেকে ১৬ পর্যন্ত র‍্যাঙ্ক করতে হয় না! কেবল প্রতি ধাপে বিজয়ীদের ওপরে তুলে ফাইনালে চ্যাম্পিয়ন নির্বাচন করলেই চলে।

**বাইনারি হিপ (Binary Heap)** ঠিক এই নীতিতেই কাজ করে:
- **Min-Heap:** প্রতিটি অভিভাবক (Parent) তার সন্তানদের (Children) চেয়ে ছোট বা সমান হয়। ফলে ট্রির সর্বশীর্ষে (রুট-এ) সবসময় থাকে **গ্লোবাল মিনিমাম**!
- **Max-Heap:** প্রতিটি অভিভাবক তার সন্তানদের চেয়ে বড় বা সমান হয়। রুটে সবসময় থাকে **গ্লোবাল ম্যাক্সিমাম**!

---

### 🪄 কোনো পয়েন্টার ছাড়া সাধারণ অ্যারেতে গাছ বানানোর জাদু!
একটি সাধারণ বাইনারি ট্রিতে প্রতিটি নোডের জন্য \`left\` এবং \`right\` পয়েন্টার রাখতে প্রচুর মেমোরি নষ্ট হয়। কিন্তু বাইনারি হিপ একটি **Complete Binary Tree** হওয়ায় একে একটি সাধারণ ১-ডি ফ্ল্যাট অ্যারেতে (Contiguous Memory) রাখা যায়!

কোনো নোডের ইনডেক্স যদি $i$ হয়, তবে জাদুকরী সূত্ৰ:
- **প্যারেন্ট (Parent):** $\\lfloor (i - 1) / 2 \\rfloor$
- **বাম সন্তান (Left Child):** $2i + 1$
- **ডান সন্তান (Right Child):** $2i + 2$

যেমন: রুট থাকে ইনডেক্স \`0\`-এ। তার বাম সন্তান ইনডেক্স $2(0)+1 = 1$, আর ডান সন্তান $2(0)+2 = 2$। কোনো পয়েন্টার ছাড়া শুধু যোগ-গুণ করেই নিমেষে সন্তানের কাছে পৌঁছানো যায়!

---

### 🔄 কোর অপারেশনের সহজ মেকানিক্স:

#### ১. বাবল-আপ বা শিফট-আপ (Sift-Up on Insert):
- নতুন কোনো মান হিপে যোগ করতে হলে তাকে অ্যারের একদম শেষে ($n$ নম্বর ইনডেক্সে) বসানো হয়।
- এরপর সে তার প্যারেন্টের সাথে লড়াই করে। যদি সে প্যারেন্টের চেয়ে ছোট হয় (Min-Heap-এ), তবে দুজনের স্থান অদলবদল (Swap) হয়।
- এভাবে সে বংশপরম্পরা বেয়ে ওপরে উঠতে থাকে যতক্ষণ না তার উপযুক্ত স্থানে পৌঁছায়। সর্বোচ্চ গাছের উচ্চতা $\\log_2 n$ বার সোয়াপ করতে হয়। সময় লাগে $O(\\log n)$।

#### ২. বাবল-ডাউন বা শিফট-ডাউন (Sift-Down on Extract):
- রুট থেকে সবচেয়ে ছোট মানটি বের করে নেওয়া হয়।
- কিন্তু রুট তো ফাঁকা রাখা যাবে না! তখন অ্যারের একদম শেষের এলিমেন্টটিকে টেনে এনে রুটে বসিয়ে দেওয়া হয়।
- এবার সে তো অনেক বড় মান, তাই সে নিচে নামতে শুরু করে। সে তার দুই সন্তানের মধ্যে **সবচেয়ে ছোটটির** সাথে তুলনা করে নিচে নামে।
- এভাবে ধাপে ধাপে নেমে সে তার যোগ্য জায়গায় বসে। এতেও সময় লাগে সর্বোচ্চ $O(\\log n)$।

---

### ⚡ কেন সাধারণ ইনসারশনে O(n log n) লাগে, কিন্তু Heapify করলে মাত্র O(n)?
এটি ইন্টারভিউয়ের অন্যতম সেরা প্রশ্ন:
- যদি আপনি একটা একটা করে $n$ টি উপাদান ইনসার্ট করেন, তবে মোট সময় লাগে $n \\times O(\\log n) = O(n \\log n)$।
- কিন্তু আপনি যদি একটি অগোছালো অ্যারের শেষ নন-লিফ নোড ($\lfloor n/2 \rfloor - 1$) থেকে শুরু করে নিচ থেকে ওপরের দিকে (Bottom-Up) \`siftDown\` চালাতে থাকেন, তবে সময় লাগে মাত্র **$O(n)$**!

**কারণটা খুব চমকপ্রদ:**
একটি গাছের প্রায় অর্ধেক নোডই থাকে একদম নিচের তলায় (পাতায়)। পাতাদের উচ্চতা $0$, তাই তাদের জন্য কোনো কাজই করতে হয় না! আর ওপরের তলায় যেখানে কাজের পরিমাণ বেশি (উচ্চতা বেশি), সেখানে নোড থাকে খুব কম (যেমন রুটে মাত্র ১টি নোড)। ফলে গাণিতিক ধারার যোগফল লিনিয়ার $O(n)$-এ নেমে আসে।

---

### 🚀 বাস্তব জীবনে বাইনারি হিপের ব্যবহার:
১. **Priority Queue (প্রায়োরিটি কিউ):** সিপียু শিডিউলিং বা প্রিন্টার জবে সবচেয়ে গুরুত্বপূর্ণ টাস্ক আগে এক্সিকিউট করতে।
২. **Dijkstra & Prim's Algorithm:** গ্রাফে শর্টেস্ট পাথ বা মিনিমাম স্প্যানিং ট্রি বের করতে।
৩. **Top-K Frequent Elements / Kth Largest:** কোটি কোটি ডাটার মধ্যে সেরা ১০টি বা ৫০টি সংখ্যা মুহূর্তের মধ্যে বের করতে।
      `,
    },
    quizTopicId: "heap",
    visualizerLink: {
      label: "Binary Heap Studio",
      algorithmId: "heap",
      path: "/algorithms/heap",
    },
  },
  {
    slug: "priority-queue-fundamentals",
    level: 5,
    levelTitle: "Level 5: Hierarchical Tree Architectures",
    order: 5,
    title: "Priority Queue: ADT Semantics, Heap-Backed Implementation, and Greedy Graph Scheduling",
    subtitle: "Master the Priority Queue abstract data structure, Max-PQ vs Min-PQ invariants, OS task scheduling, Dijkstra shortest path frontier exploration, Decrease-Key operations, and LeetCode patterns.",
    estimatedReadTime: "18 min",
    category: "Data Structures",
    content: `
### Chapter 1: The Scheduling Dilemma — Why Standard FIFO Queues Fall Short

In a standard First-In, First-Out (FIFO) queue, the sole determinant of execution order is **time of arrival**. The element that entered first is guaranteed to be serviced first.

While this fairness model is ideal for line printers and customer service queues, modern computer systems and algorithmic optimization problems require a radically different paradigm:

1. **Operating System Thread Scheduling:** If a system triggers a critical hardware interrupt or audio buffer underflow while 10,000 background file-indexing threads are queued, the OS kernel must not wait. The critical task must jump directly to the head of the dispatch line.
2. **Hospital Emergency Room Triage:** A patient arriving with sudden cardiac arrest cannot wait behind ten patients with minor skin scratches simply because they arrived ten minutes earlier. Severity supersedes arrival time.
3. **Greedy Graph Algorithms (Dijkstra / Prim / A*):** When finding the shortest path across a road network of 1,000,000 intersections, the algorithm must always explore the unsettled vertex with the **minimum tentative distance** next, regardless of when it was discovered.

These scenarios demand an **Abstract Data Type (ADT)** called the **Priority Queue**.

---

### Chapter 2: The Priority Queue ADT Specification

A **Priority Queue** is a collection of elements where each element has an associated **priority key**. It supports three fundamental primitive operations:

1. \`push(item, priority)\` (or \`enqueue\`): Inserts a new element with a designated priority value.
2. \`pop()\` (or \`dequeue\`): Removes and returns the element with the highest priority (or lowest value in a Min-Priority Queue).
3. \`peek()\` (or \`top\`): Returns the current top-priority element without removing it.

#### Max-Priority vs Min-Priority Queues:
- **Max-Priority Queue:** Dispatches elements in descending order of priority (higher number = greater urgency). Standard default in C++ (\`std::priority_queue<int>\`).
- **Min-Priority Queue:** Dispatches elements in ascending order of priority (lower number = earlier or cheaper). Crucial for Dijkstra's algorithm, Huffman coding, and event-driven simulation timestamps (\`std::priority_queue<int, vector<int>, greater<int>>\`).

---

### Chapter 3: Concrete Implementations Compared

| Implementation Backing | Peek Top | Push (Enqueue) | Pop (Dequeue) | Memory & Locality |
| :--- | :--- | :--- | :--- | :--- |
| **Unsorted Dynamic Array** | $O(n)$ | $O(1)$ | $O(n)$ | Contiguous, zero pointers |
| **Sorted Array** | $O(1)$ | $O(n)$ shifts | $O(1)$ (pop back) | Contiguous, heavy shift penalty |
| **Balanced BST (e.g. std::set)** | $O(\\log n)$ | $O(\\log n)$ | $O(\\log n)$ | $24+$ bytes pointer overhead per node |
| **Binary Heap (Optimal Default)** | **$O(1)$** | **$O(\\log n)$** | **$O(\\log n)$** | **Contiguous 1D RAM, zero pointers** |
| **Fibonacci Heap (Theoretical)** | $O(1)$ | $O(1)$ amortized | $O(\\log n)$ | Complex node pointers, high constant factor |

#### Why Binary Heap is the Universal Industry Choice:
A Binary Heap maps directly into a 1D contiguous array with index arithmetic:
$$\\text{Parent}(i) = \\left\\lfloor \\frac{i - 1}{2} \\right\\rfloor, \\quad \\text{Left}(i) = 2i + 1, \\quad \\text{Right}(i) = 2i + 2$$
This ensures:
- Zero dynamic memory allocation overhead per node.
- Complete tree shape invariant prevents degenerating into a linked list.
- Hardware CPU cache prefetching lines deliver real-world speeds 3–5x faster than pointer-based trees.

---

### Chapter 4: Real-Time OS Process Scheduling Blueprint

In operating systems like Linux and Windows, every runnable thread is assigned a static or dynamic priority score:
- **Ring 0 Kernel Panic / Hardware IRQs:** Highest priority (preempts user applications immediately).
- **Audio / Video Compositor:** Interactive real-time threads (prevents audio glitches and dropped frames).
- **Foreground GUI Thread:** Normal priority (ensures responsive mouse and keyboard input).
- **Background Workers:** Low priority (disk indexers, virus scanners, garbage collectors).

When the CPU scheduler dispatches the next thread to a hardware core:
1. It calls \`pq.pop()\` to extract the highest priority ready thread in $O(\\log n)$.
2. If a thread exhausts its time slice without completing, its priority may decay (aging) and it is re-enqueued with \`pq.push()\`.
3. If an urgent event occurs (e.g., packet received on network card), a thread's priority is elevated, triggering an immediate preemption check.

---

### Chapter 5: Greedy Exploration Engine — Dijkstra's Algorithm

Dijkstra's Single-Source Shortest Path algorithm on a directed graph $G = (V, E)$ demonstrates the indispensable power of a Min-Priority Queue:

\`\`\`cpp
vector<int> dijkstra(int source, int n, const vector<vector<pair<int, int>>>& adj) {
    vector<int> dist(n, INT_MAX);
    // Min-Priority Queue storing {tentative_distance, vertex_id}
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;

    dist[source] = 0;
    pq.push({0, source});

    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();

        // Stale entry guard (if we already found a shorter path to u)
        if (d > dist[u]) continue;

        for (auto [v, weight] : adj[u]) {
            if (dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                pq.push({dist[v], v}); // Edge relaxation
            }
        }
    }
    return dist;
}
\`\`\`

#### Complexity Analysis:
- Without a priority queue (linear array scan for minimum distance): Time is $O(V^2)$.
- With a binary heap priority queue:
  - Each vertex extracted once: $V \\times O(\\log V)$.
  - Each edge relaxed at most once: $E \\times O(\\log V)$.
  - **Total Runtime:** $O((V + E) \\log V)$, reducing execution on a road network with $V = 10^5, E = 3 \\times 10^5$ from hours to under $20$ milliseconds!

---

### Chapter 6: The Decrease-Key & Change-Priority Challenge

In many theoretical graph algorithms (Dijkstra, Prim), we want to modify the priority of a node already inside the queue:
- **Decrease-Key:** Lowering tentative distance in Min-PQ.
- **Increase-Key:** Raising priority in Max-PQ.

#### Why standard \`std::priority_queue\` lacks \`decreaseKey\`:
A standard heap array does not provide an $O(1)$ reverse lookup from an element's ID to its current index in the array. Finding the task takes $O(n)$ linear scan unless supplemented with an **Index Position Map** (a hash table or array mapping \`item_id -> heap_index\`).

With an indexed priority queue:
1. Lookup current heap slot in $O(1)$ via \`posMap[id]\`.
2. Update priority value in-place.
3. If priority increased in Max-PQ: run **Sift-Up** in $O(\\log n)$.
4. If priority decreased in Max-PQ: run **Sift-Down** in $O(\\log n)$.
5. Total modification time: strictly $O(\\log n)$!

---

### Chapter 7: Essential LeetCode Patterns

1. **Top-K Frequent Elements (LC 347) / Kth Largest (LC 215):**
   - Maintain a Min-Heap of size $k$.
   - For every new element, push it in. If size exceeds $k$, pop the minimum.
   - Remaining $k$ elements are guaranteed to be the $k$ largest elements! Runtime: $O(n \\log k)$ instead of $O(n \\log n)$.
2. **Merge K Sorted Lists (LC 23):**
   - Push the head node of each of the $k$ lists into a Min-PQ.
   - Repeatedly pop the smallest node, append to output list, and push its \`next\` pointer. Runtime: $O(N \\log k)$.
3. **Task Scheduler (LC 621):**
   - Use a Max-PQ of task frequencies to greedily execute the most frequent available task first.
4. **Find Median from Data Stream (LC 295):**
   - Two Heaps Pattern: a Max-Heap for the smaller half and a Min-Heap for the larger half. Instant $O(1)$ median access and $O(\\log n)$ insertions.
`,
    banglaNote: {
      topic: "Priority Queue (প্রায়োরিটি কিউ) সহজ বাংলায় ব্যাখ্যা",
      englishContext:
        "A Priority Queue is an abstract data structure where every element possesses a priority key, and extraction always yields the extreme priority element in O(log n) time via an underlying Binary Heap.",
      banglaText: `
### 📌 প্রায়োরিটি কিউ (Priority Queue) আসলে কী?

সাধারণ লাইনে (FIFO Queue) যে আগে আসে সে আগে সেবা পায়—যেমন বাসের টিকিট কাউন্টারে লাইন। 

কিন্তু বাস্তব জীবনে এমন অনেক পরিস্থিতি আছে যেখানে **আসার সময় নয়, কাজের গুরুত্ব (Priority)** সবচেয়ে বেশি ম্যাটার করে। 

#### 🏥 একটি বাস্তব উদাহরণ: হাসপাতালের ইমার্জেন্সি রুম
ধরুন হাসপাতালে এক ব্যক্তি সাধারণ পা মচকে বিকেল ৫টায় আসলেন। কিন্তু ৫টা ২০ মিনিটে হঠাৎ একজন হার্ট অ্যাটাকের রোগী আসলেন। ডাক্তার কি বলবেন—"না, পা মচকানো রোগী আগে এসেছেন, তাকে আগে দেখব"? কক্ষনো না! হার্ট অ্যাটাক রোগীর প্রায়োরিটি সর্বোচ্চ, তাই তাকে সাথে সাথে আগে অপারেশন থিয়েটারে নেওয়া হবে।

এটাই হলো **Priority Queue**-এর মূল ধারণা: প্রতিটি আইটেমের সাথে একটি গুরুত্বের মান (Priority Key) থাকে, এবং কিউ থেকে সবসময় **সর্বোচ্চ (বা সর্বনিম্ন) প্রায়োরিটির আইটেমটি আগে বের হয়**।

---

### ⚙️ কীভাবে প্রায়োরিটি কিউ কাজ করে? (বাইনারি হিপের জাদু)

প্রায়োরিটি কিউকে সবচেয়ে কার্যকরভাবে তৈরি করা হয় **Binary Heap** ডাটা স্ট্রাকচার দিয়ে:
১. **পয়েন্টার ছাড়া মেমরি:** কোনো ডায়নামিক পয়েন্টার ছাড়া সাধারণ ১ডি অ্যারের ভেতর এটি থাকে।
২. **Peek O(1):** সবচেয়ে গুরুত্বপূর্ণ আইটেমটি সবসময় ট্রির রুট বা অ্যারের প্রথম ঘরে (ইনডেক্স ০) বসে থাকে। তাই শীর্ষ উপাদানটি দেখতে মাত্র O(1) সময় লাগে।
৩. **Push (Enqueue) O(log n):** নতুন টাস্ক আসলে অ্যারের শেষে বসিয়ে **Sift-Up (উপরে তোলা)** প্রক্রিয়ায় তার উপযুক্ত অবস্থানে পৌঁছে দেওয়া হয়।
৪. **Pop (Dequeue) O(log n):** রুট আইটেম বের করে শেষ পাতার উপাদানটিকে রুটে বসানো হয় এবং **Sift-Down (নিচে নামানো)** করে নিয়ম ঠিক রাখা হয়।

---

### 💡 কেন সাধারণ অ্যারে বা শর্টেড অ্যারে ব্যবহার করব না?

| ডাটা স্ট্রাকচার | নতুন আইটেম ঢোকাতে (Push) | শীর্ষ আইটেম বের করতে (Pop) | শীর্ষ আইটেম দেখতে (Peek) |
| :--- | :--- | :--- | :--- |
| **অগোছালো অ্যারে (Unsorted Array)** | O(1) খুব দ্রুত | O(n) পুরো অ্যারে খুঁজে বের করতে হয় | O(n) |
| **সাজানো অ্যারে (Sorted Array)** | O(n) ঘর ফাঁকা করতে শিফট করতে হয় | O(1) শেষ থেকে কেটে ফেলা যায় | O(1) |
| **বাইনারি হিপ (Priority Queue)** | **O(log n)** সুষম | **O(log n)** সুষম | **O(1) তাত্ক্ষণিক** |

হিপ উভয় অপারেশনের মধ্যে চমৎকার ভারসাম্য (Balance) বজায় রাখে।

---

### 🚀 বাস্তব জীবনে প্রায়োরিটি কিউ কোথায় কাজে লাগে?
১. **অপারেটিং সিস্টেম (OS CPU Scheduler):** ইউজার যখন কীবোর্ডে টাইপ করেন, সেই সিগন্যাল ব্যাকগ্রাউন্ড ডাউনলোডের চেয়ে বেশি প্রায়োরিটি পায়।
২. **Dijkstra's Algorithm:** গুগল ম্যাপে সবচেয়ে কম দূরত্বের পথ খুঁজতে যে নোডের দূরত্ব সবচেয়ে কম তাকে সবার আগে এক্সপ্লোর করা হয়।
৩. **ইন্টারনেট রাউটার (Quality of Service):** জুম ভিডিও কল ও ভয়েস কলের প্যাকেটকে সাধারণ ফাইল ডাউনলোডের আগে ইন্টারনেটে পাঠানো হয় যাতে কথা কেটে না যায়।
৪. **Top-K Elements:** কোটি কোটি ডাটা থেকে শীর্ষ ১০টি বা ১০০টি সংখ্যা বের করতে।
      `,
    },
    quizTopicId: "priority-queue",
    visualizerLink: {
      label: "Priority Queue Studio",
      algorithmId: "priority-queue",
      path: "/algorithms/priority-queue",
    },
  },
  {
    slug: "time-complexity",
    level: 6,
    levelTitle: "Level 6: Algorithmic Complexity Analysis",
    order: 1,
    title: "Time Complexity & Asymptotic Analysis Masterclass",
    subtitle: "Comprehensive theoretical foundations, mathematical definitions, loop analysis patterns, and practical CPU execution budgets.",
    estimatedReadTime: "15 min",
    category: "Complexity",
    content: `
### Chapter 1: The Core Philosophy of Time Complexity

When evaluating the efficiency of a software algorithm, measuring execution time in wall-clock seconds (or milliseconds) is fundamentally flawed and deceptive. 

#### Why Wall-Clock Time Is Inadequate:
1. **Hardware Variability**: An algorithm running on an Intel Core i9 processor will execute faster than the same algorithm on an embedded ARM microcontroller.
2. **System Background Load**: Operating system context-switching, active background processes, and CPU throttling distort empirical measurements.
3. **Compiler Optimizations**: Aggressive compiler flags (such as \`-O3\` loop vectorization) alter instruction sequences.

To establish an objective, machine-independent measure of algorithmic efficiency, computer science relies on the **Random Access Machine (RAM) Model of Computation**. Under this model:
- We measure execution cost by counting the **number of primitive computational operations** (arithmetic operations, variable assignments, comparisons, pointer dereferences).
- We study how this operational count scales as the input size $n$ approaches infinity ($n \\to \\infty$).

---

### Chapter 2: The Asymptotic Notation Trinity ($O, \\Omega, \\Theta$)

Asymptotic notation provides a formal mathematical vocabulary to describe the growth rate of functions without being distracted by machine constants or low-order noise.

\`\`\`
  Upper Bound:  f(n) ≤ c · g(n)  ==>  f(n) = O(g(n))       [Worst-Case Guarantee]
  Tight Bound:  c₁·g(n) ≤ f(n) ≤ c₂·g(n) ==> f(n) = Θ(g(n)) [Exact Bound]
  Lower Bound:  f(n) ≥ c · g(n)  ==>  f(n) = Ω(g(n))       [Best-Case Floor]
\`\`\`

#### 1. Big-O ($O$) — Asymptotic Upper Bound
Formal mathematical definition:
$$f(n) = O(g(n)) \\iff \\exists c > 0, n_0 > 0 \\text{ such that } \\forall n \\ge n_0, \\quad 0 \\le f(n) \\le c \\cdot g(n)$$
- **Engineering Meaning**: Big-O establishes an unbreakable **worst-case upper ceiling**. The algorithm will never perform more operations than proportional to $g(n)$ for sufficiently large inputs.

#### 2. Big-Omega ($\\Omega$) — Asymptotic Lower Bound
Formal mathematical definition:
$$f(n) = \\Omega(g(n)) \\iff \\exists c > 0, n_0 > 0 \\text{ such that } \\forall n \\ge n_0, \\quad 0 \\le c \\cdot g(n) \\le f(n)$$
- **Engineering Meaning**: Big-Omega establishes the **best-case baseline floor**. The algorithm will require at least proportional to $g(n)$ operations.

#### 3. Big-Theta ($\\Theta$) — Asymptotically Tight Bound
Formal mathematical definition:
$$f(n) = \\Theta(g(n)) \\iff f(n) = O(g(n)) \\quad \\text{and} \\quad f(n) = \\Omega(g(n))$$
- **Engineering Meaning**: The algorithm's growth is sandwiched tightly within constant multipliers of $g(n)$ in all scenarios.

> **Critical Interview Distinction:**
> Do not confuse **Best / Average / Worst Case** (which describe input arrangements) with **$\\Omega / \\Theta / O$** (which describe mathematical bounds). For example, Quick Sort's worst-case time complexity is $\\Theta(n^2)$, while its best-case is $\\Theta(n \\log n)$.

---

### Chapter 3: The Complete Big-O Growth Spectrum

Below is the complete spectrum of algorithmic complexity classes, ordered from fastest to slowest:

$$O(1) < O(\\log n) < O(\\sqrt{n}) < O(n) < O(n \\log n) < O(n^2) < O(n^3) < O(2^n) < O(n!)$$

| Complexity Class | Canonical Name | Typical Real-World Examples | Scale at $n = 10^6$ | Practical CPU Runtime |
| :--- | :--- | :--- | :--- | :--- |
| **$O(1)$** | Constant | Hash map lookup, stack push/pop, array indexing \`arr[i]\` | 1 operation | ~1 nanosecond (Instantaneous) |
| **$O(\\log n)$** | Logarithmic | Binary search, balanced BST lookup, Euclidean GCD | ~20 operations | ~20 nanoseconds (Instantaneous) |
| **$O(\\sqrt{n})$** | Square Root | Primality testing, Mo's algorithm block decomposition | 1,000 operations | ~1 microsecond |
| **$O(n)$** | Linear | Linear array scan, Kadane's algorithm, Counting Sort | $10^6$ operations | ~1 millisecond |
| **$O(n \\log n)$** | Linearithmic | Merge Sort, Quick Sort (avg), Heap Sort | $\\approx 2 \\times 10^7$ ops | ~20 milliseconds |
| **$O(n^2)$** | Quadratic | Nested loops, Bubble Sort, Selection Sort, Insertion Sort | $10^{12}$ operations | ~15 - 20 minutes |
| **$O(n^3)$** | Cubic | Naive Matrix Multiplication, Floyd-Warshall shortest path | $10^{18}$ operations | ~31.7 years |
| **$O(2^n)$** | Exponential | Naive recursive Fibonacci, generating all subsets | $2^{1000000}$ | Heat death of universe |
| **$O(n!)$** | Factorial | Traveling Salesperson (brute force), all permutations | Undefined | Intractable |

---

### Chapter 4: Code Dissection — 6 Systematic Loop Analysis Patterns

When reading or analyzing source code, apply these 6 structural patterns:

#### Pattern 1: Single Linear Iteration $\\implies O(n)$
\`\`\`cpp
// Loop runs exactly n times
for (int i = 0; i < n; i++) {
    sum += arr[i]; // O(1) body
}
\`\`\`

#### Pattern 2: Multiplicative / Halving Scaling $\\implies O(\\log n)$
\`\`\`cpp
// i doubles every iteration: 1, 2, 4, 8, ..., 2^k >= n ==> k = ceil(log2 n)
for (int i = 1; i < n; i *= 2) {
    cout << i << "\n";
}
\`\`\`

#### Pattern 3: Nested Independent Loops $\\implies O(n \\cdot m)$
\`\`\`cpp
// Outer loop runs n times; inner loop runs m times independently
for (int i = 0; i < n; i++) {
    for (int j = 0; j < m; j++) {
        matrix[i][j] = 0;
    }
}
\`\`\`

#### Pattern 4: Dependent Nested Loops (Arithmetic Series) $\\implies O(n^2)$
\`\`\`cpp
// Inner loop runs 1 + 2 + 3 + ... + n times
// Sum = n(n + 1) / 2 = 0.5 n^2 + 0.5 n = O(n^2)
for (int i = 0; i < n; i++) {
    for (int j = 0; j <= i; j++) {
        total++;
    }
}
\`\`\`

#### Pattern 5: Two-Pointer / Sliding Window Amortized Scan $\\implies O(n)$
\`\`\`cpp
// Although nested, left and right pointers each move at most n times total
int left = 0;
for (int right = 0; right < n; right++) {
    currentSum += arr[right];
    while (currentSum > target && left <= right) {
        currentSum -= arr[left++]; // Left pointer only increments forward
    }
}
\`\`\`

#### Pattern 6: Divide & Conquer Recurrence (Master Theorem)
For recurrences of the form $T(n) = a T(n/b) + O(n^d)$:
- If $a = b^d \\implies T(n) = O(n^d \\log n)$ *(Example: Merge Sort with $a=2, b=2, d=1 \\implies T(n) = O(n \\log n)$)*
- If $a < b^d \\implies T(n) = O(n^d)$
- If $a > b^d \\implies T(n) = O(n^{\\log_b a})$

---

### Chapter 5: The $10^8$ Operations Rule in Real-World Systems

In modern competitive programming (LeetCode, Codeforces) and backend API microservices, a standard modern CPU executes roughly **$10^8$ basic instructions per second** (100 million operations/sec).

Use this reference table to immediately deduce the expected time complexity from the input constraints ($N$):

| Constraint Value ($N$) | Required Time Complexity | Feasible Algorithmic Approach |
| :--- | :--- | :--- |
| $N \\le 10$ | $O(N!)$ or $O(N^2 \\cdot 2^N)$ | Brute Force Permutations, Traveling Salesperson DP |
| $N \\le 20$ | $O(2^N)$ | Bitmask DP, Subset Recursion |
| $N \\le 500$ | $O(N^3)$ | Floyd-Warshall, 3D Dynamic Programming |
| $N \\le 5,000$ | $O(N^2)$ | Bubble/Insertion Sort, All-pairs nested scanning |
| $N \\le 10^5 - 10^6$ | $O(N \\log N)$ or $O(N)$ | Merge Sort, Quick Sort, Segment Trees, Hash Maps |
| $N \\le 10^9$ | $O(\\sqrt{N})$ or $O(\\log N)$ or $O(1)$ | Primality testing, Binary Search, Math & GCD |
    `,
    banglaNote: {
      topic: "Time Complexity ও বিগ-ও অ্যানালাইসিস (গভীর ও সহজ ব্যাখ্যা)",
      englishContext: "Deep intuitive understanding of Time Complexity, Big-O, loop patterns, and CPU execution limits",
      banglaText: `
### ১. টাইম কমপ্লেক্সিটি আসলে কী?
টাইম কমপ্লেক্সিটি মানে কম্পিউটার ঘড়ির কাঁটা দেখে সেকেন্ড বা মিলি-সেকেন্ড মাপা নয়। কারণ একই সি++ কোড আপনার কোর-আই৯ ল্যাপটপে ০.১ সেকেন্ডে চললেও একটি দুর্বল সার্ভার বা পুরাতন ফোনে ৫ সেকেন্ড লাগতে পারে। 

তাই অ্যালগরিদম বিশেষজ্ঞদের কাছে মূল প্রশ্ন হলো: **ইনপুট সাইজ $n$ (যেমন ১০ থেকে ১০,০০,০০০) বাড়ালে কম্পিউটারের কাজের মোট সংখ্যা (Operations) কী হারে বাড়ে?**

---

### ২. বাস্তব জীবনের ৪টি দারুণ অ্যানালজি:
1. **$O(1)$ — কনস্ট্যান্ট টাইম (Constant):**
   - একটি পাতিলে ১টি ডিম সেদ্ধ করতে যে ১০ মিনিট লাগে, একই পাতিলে একসাথে ১০টি ডিম সেদ্ধ করলেও সেই ১০ মিনিটই লাগে। ইনপুট বাড়লেও সময় বাড়ে না। (উদাহরণ: \`arr[5]\` ইন্ডেক্স রিড করা)।
2. **$O(\\log n)$ — লগারিদমিক টাইম (Logarithmic):**
   - একটি ১০ লক্ষ নামের মোটা ডিকশনারি থেকে একটি নাম খোঁজা। আপনি যদি প্রতিবার বইটি ঠিক মাঝামাঝি খুলে অর্ধেক অংশ বাদ দিয়ে দেন, তবে মাত্র ২০ বার পাতা উল্টালেই কাঙ্ক্ষিত নাম পেয়ে যাবেন ($2^{20} > 10^6$)!
3. **$O(n)$ — লিনিয়ার টাইম (Linear):**
   - ১টি আলু ছুলে পরিষ্কার করতে ১ মিনিট লাগলে, ১০০টি আলুর বস্তা পরিষ্কার করতে ১০০ মিনিট লাগবে।
4. **$O(n^2)$ — কোয়াড্রেটিক টাইম (Quadratic):**
   - একটি বিয়ের অনুষ্ঠানে উপস্থিত প্রত্যেক অতিথির সাথে অন্য প্রত্যেক অতিথির হ্যান্ডশেক করানো। অতিথি ১০০ জন হলে হ্যান্ডশেক হবে $\\approx 5,000$ টি, কিন্তু অতিথি দ্বিগুণ (২০০ জন) হলে হ্যান্ডশেক ৪ গুণ বেড়ে $\\approx 20,000$ হয়ে যাবে!

---

### ৩. গাণিতিক সংকেতত্রয়ী (Notations):
- **Big-O ($O$):** কাজের সর্বোচ্চ সীমানা (Upper Bound)। গ্যারান্টি দেয় যে খারাপ পরিস্থিতিতেও কাজের পরিমাণ এর চেয়ে বেশি হবে না।
- **Big-Omega ($\\Omega$):** কাজের সর্বনিম্ন সীমানা (Lower Bound / Best-Case)।
- **Big-Theta ($\\Theta$):** একদম নিখুঁত সীমানা (Tight Bound), যেখানে আপার এবং লোয়ার বাউন্ড সমান।

---

### ৪. বিগ-ও হিসাব করার ২টি গোল্ডেন রুল:
1. **ধ্রুবক (Constants) বাদ দিন:** $7n^2 + 100n + 50000$ থাকলে ধ্রুবক গুণক $7$ এবং ধ্রুবক সংখ্যা $50000$ বাদ যাবে।
2. **সর্বোচ্চ প্রভাবশালী টার্মটি রাখুন (Dominant Term):** $n$ যখন কোটি ছোঁবে, তখন $n^2$ এর সামনে $100n$ কিছুই নয়। তাই এটি হবে $O(n^2)$।

---

### ৫. কম্পিটিটিভ প্রোগ্রামিংয়ে ১ সেকেন্ডের $10^8$ রুল:
অনলাইন জাজে (যেমন LeetCode, Codeforces) ১ সেকেন্ডে প্রায় $10^8$ (১০ কোটি) অপারেশন চালানো যায়।
- ইনপুট $N \\le 10^5$ হলে কখনো $O(N^2)$ কোড লিখবেন না (তাতে $10^{10}$ অপারেশন লেগে TLE খাবে); সবসময় $O(N \\log N)$ বা $O(N)$ সমাধান খুঁজুন।
      `,
    },
    quizTopicId: "time-complexity",
    visualizerLink: {
      label: "Time Complexity Visualizer",
      algorithmId: "time-complexity",
      path: "/algorithms/time-complexity",
    },
  },
  {
    slug: "space-complexity",
    level: 6,
    levelTitle: "Level 6: Algorithmic Complexity Analysis",
    order: 2,
    title: "Space Complexity & Memory Hierarchy Masterclass",
    subtitle: "In-depth analysis of input vs auxiliary space, stack vs heap allocations, recursive activation records, and memory optimization.",
    estimatedReadTime: "15 min",
    category: "Complexity",
    content: `
### Chapter 1: Total Space vs Auxiliary Space — The Crucial Equation

When analyzing the memory consumption of an algorithm, we formulate the total memory consumption as:

$$\\text{Total Space Complexity} = \\text{Input Space} + \\text{Auxiliary Space}$$

#### Definitions:
1. **Input Space**: The memory required to hold the original input data structures passed to the algorithm (for example, an input vector of $n$ numbers takes $O(n)$ input space).
2. **Auxiliary Space**: The **extra temporary working memory** allocated by the algorithm itself to compute the solution (temporary variables, auxiliary vectors, dynamically allocated heap nodes, recursive call stack frames).

> **Why Technical Interviews Focus Strictly on Auxiliary Space:**
> Since the input data is provided by the caller, the algorithm cannot reduce the input space without changing the problem definition. Therefore, an algorithm's memory efficiency is measured exclusively by its **Auxiliary Space**.

\`\`\`cpp
// Example A: O(n) Input Space, strictly O(1) Auxiliary Space
void printMax(const vector<int>& arr) {
    int maxVal = arr[0]; // O(1) scalar variable
    for (int x : arr) maxVal = max(maxVal, x);
    cout << maxVal;
}

// Example B: O(n) Input Space, O(n) Auxiliary Space
vector<int> duplicateArray(const vector<int>& arr) {
    vector<int> copyArr = arr; // O(n) auxiliary heap allocation!
    return copyArr;
}
\`\`\`

---

### Chapter 2: Program Memory Anatomy (Stack vs Heap vs Data)

To master space complexity, an engineer must understand how the operating system manages application memory:

\`\`\`
+-------------------------------------------------------+
|  STACK MEMORY (Fast, Local Variables, Call Frames)    |  <-- Grows Downward
|  - Fast allocation, size limited (typically 1MB - 8MB)|
+-------------------------------------------------------+
|                         ▼                             |
|                  FREE MEMORY                          |
|                         ▲                             |
+-------------------------------------------------------+
|  HEAP MEMORY (Dynamic 'new', 'malloc', std::vector)   |  <-- Grows Upward
|  - Large capacity, dynamic resizing, pointers        |
+-------------------------------------------------------+
|  DATA & BSS SEGMENT (Global & Static Variables)       |
+-------------------------------------------------------+
|  TEXT / CODE SEGMENT (Compiled Binary Instructions)   |
+-------------------------------------------------------+
\`\`\`

1. **Stack Memory (Call Stack)**:
   - Stores function parameters, local scalar variables, and return instruction pointers.
   - Extremely fast (pointer bump allocation).
   - Finite and rigid size (usually 1 MB to 8 MB). Exceeding this boundary triggers the fatal **Stack Overflow** crash.
2. **Heap Memory (Dynamic Store)**:
   - Stores dynamically sized structures (\`std::vector\`, \`new Node()\`, \`std::map\`).
   - Managed manually or through smart pointers in C++, garbage-collected in Java/JavaScript/Python.
   - Exceeding physical RAM and swap space triggers **Out Of Memory (OOM)** error.

---

### Chapter 3: The Hidden Memory Cost — Recursive Call Stack Frames

Every time a function invokes itself recursively, the CPU allocates a new **Activation Record (Stack Frame)** containing:
1. Formal parameters of the function.
2. Local variable declarations.
3. The return memory address where execution resumes after completion.

#### Linear Recursion Depth $\\implies O(n)$ Auxiliary Stack Space
\`\`\`cpp
// Depth of recursion is n. At n = 100000, 100000 stack frames reside in RAM simultaneously.
int linearFactorial(int n) {
    if (n <= 1) return 1;
    return n * linearFactorial(n - 1); // Holds n frames simultaneously -> O(n) Space
}
\`\`\`

#### Divide & Conquer Recursion Depth $\\implies O(\\log n)$ Auxiliary Stack Space
\`\`\`cpp
// The recursion tree has height ceil(log2 n).
// Only ONE root-to-leaf branch is active on the stack at any given millisecond!
void divideAndConquer(int low, int high) {
    if (low >= high) return;
    int mid = low + (high - low) / 2;
    divideAndConquer(low, mid);     // Active branch depth <= log2(n)
    divideAndConquer(mid + 1, high);
}
\`\`\`

---

### Chapter 4: In-Place vs Out-of-Place Algorithmic Categorization

#### Formal Definition of In-Place:
An algorithm is classified as **In-Place** if its auxiliary memory usage is strictly **$O(1)$** (using only a fixed number of scalar pointers and counters), ignoring at most $O(\\log n)$ recursive call stack depth.

| Algorithm | Input Space | Auxiliary Array Memory | Call Stack Space | Total Auxiliary Space | Classification |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Bubble Sort** | $O(n)$ | $O(1)$ | $0$ | **$O(1)$** | In-Place |
| **Selection Sort** | $O(n)$ | $O(1)$ | $0$ | **$O(1)$** | In-Place |
| **Insertion Sort** | $O(n)$ | $O(1)$ | $0$ | **$O(1)$** | In-Place |
| **Quick Sort** | $O(n)$ | $O(1)$ | $O(\\log n)$ avg | **$O(\\log n)$** | In-Place |
| **Heap Sort** | $O(n)$ | $O(1)$ | $0$ | **$O(1)$** | In-Place |
| **Merge Sort** | $O(n)$ | $O(n)$ buffer | $O(\\log n)$ | **$O(n)$** | Out-of-Place |
| **Counting Sort** | $O(n)$ | $O(k)$ count array | $0$ | **$O(k)$** | Out-of-Place |

---

### Chapter 5: 4 Critical Memory Traps & Leaks in Modern Code

#### Trap 1: Accidental Pass-by-Value in Recursion (Memory Explosion)
\`\`\`cpp
// DISASTER: Passing vector by value deep-copies all n elements at EVERY recursion level!
// Space Complexity blows up from O(log n) to O(n^2)!
void buggyRecursion(vector<int> arr, int l, int r) { ... }

// CORRECT: Pass by reference avoids memory duplication. Auxiliary Space stays O(log n).
void optimalRecursion(const vector<int>& arr, int l, int r) { ... }
\`\`\`

#### Trap 2: Jagged 2D Vector Overhead in C++
A \`vector<vector<int>> matrix(n, vector<int>(m))\` creates $n$ distinct heap allocations, each with a 24-byte vector header, wrecking CPU L1/L2 cache locality.
- **Optimization**: Flatten into a 1D vector: \`vector<int> matrix(n * m)\` and access element $(i, j)$ via \`matrix[i * m + j]\`.

#### Trap 3: String Concatenation Inside Loops
Repeatedly appending to immutable strings (or copying strings) creates intermediary allocations:
\`\`\`cpp
// In languages with immutable strings, this copies the entire prefix repeatedly -> O(n^2) space!
string s = "";
for (int i = 0; i < n; i++) s += to_string(i);
\`\`\`

#### Trap 4: Online Judge Memory Limit Exceeded (MLE)
Standard competitive programming platforms provide **256 MB of RAM**.
- A 32-bit integer (\`int\`) takes **4 bytes**.
- $256 \\text{ MB} = 256 \\times 1024 \\times 1024 \\approx 2.68 \\times 10^8 \\text{ bytes} \\approx 6.7 \\times 10^7 \\text{ integers}$.
- Attempting to allocate an array of size $> 6 \\times 10^7$ integers will trigger an immediate **Memory Limit Exceeded (MLE)** verdict.
    `,
    banglaNote: {
      topic: "Space Complexity ও মেমরি অপ্টিমাইজেশন (গভীর ও সহজ ব্যাখ্যা)",
      englishContext: "Deep intuitive understanding of Auxiliary Space, Call Stack Frames, Heap Buffers, and Memory Optimization",
      banglaText: `
### ১. স্পেস কমপ্লেক্সিটি আসলে কী?
একটি প্রোগ্রাম চালাতে গিয়ে কম্পিউটারের র‍্যাম (RAM) এ কতটুকু অতিরিক্ত জায়গা খরচ হয় — সেটাই স্পেস কমপ্লেক্সিটি।

কম্পিউটার সায়েন্সে মোট মেমরিকে দুটি ভাগে ভাগ করা হয়:
$$\\text{Total Space} = \\text{Input Space} + \\text{Auxiliary Space}$$

- **ইনপুট স্পেস (Input Space):** আপনাকে যে ডেটা প্রসেস করতে দেওয়া হয়েছে (যেমন $n$ সাইজের একটি অ্যারে যা $O(n)$ মেমরি দখল করে)।
- **অক্সিলিয়ারি স্পেস (Auxiliary Space):** সমস্যাটি সমাধান করার জন্য আপনার অ্যালগরিদম নিজে থেকে যে অতিরিক্ত মেমরি তৈরি করে (যেমন: নতুন বাফার অ্যারে, রিকার্সিভ কল স্ট্যাক, ভ্যারিয়েবল)।
👉 **মনে রাখবেন:** ইন্টারভিউতে বা কোডিং টেস্টে যখন "Space Complexity" জানতে চাওয়া হয়, তখন মূলত **Auxiliary Space** জানতে চাওয়া হয়।

---

### ২. বাস্তব জীবনের দারুণ অ্যানালজি:
- **ইনপুট স্পেস:** আপনি ভ্রমণের জন্য যে স্যুটকেসে জামাকাপড় নিলেন ($O(n)$)। এটি আপনাকে বহন করতেই হবে।
- **অক্সিলিয়ারি স্পেস:** গন্তব্যে পৌঁছে কাপড় ইস্ত্রি বা গোছানোর জন্য ঘরে অতিরিক্ত যে টেবিল বা বাস্কেট ব্যবহার করলেন। একজন দক্ষ পরিব্রাজক অতিরিক্ত টেবিল বা বাস্কেট ছাড়াই স্যুটকেসের ভেতরেই কাপড় গুছিয়ে নিতে পারেন ($O(1)$ Auxiliary Space)।

---

### ৩. কল স্ট্যাক ও স্ট্যাক ওভারফ্লো (Stack Overflow):
যখন কোনো ফাংশন রিকার্সিভলি নিজেকে কল করে, প্রতিবার র‍্যামের কল স্ট্যাকে একটি করে **Activation Record (Stack Frame)** তৈরি হয়।
- **লিনিয়ার রিকার্শনে ($O(n)$ Space):** ফাংশনটি $n$ বার কল হলে স্ট্যাকে একবারে $n$ টি ফ্রেম জমে থাকে। ইনপুট অনেক বড় হলে স্ট্যাকের মেমরি (সাধারণত ১ থেকে ৮ মেগাবাইট) পূর্ণ হয়ে প্রোগ্রাম ক্র্যাশ করে, যাকে **Stack Overflow** বা **Runtime Error** বলে।
- **ডিভাইড অ্যান্ড কনকারে ($O(\\log n)$ Space):** মার্জ সর্ট বা কুইক সর্টে প্রতি মুহূর্তে শুধুমাত্র ১টি ব্রাঞ্চ সক্রিয় থাকে, তাই সর্বোচ্চ $\\approx \\log_2 n$ টি ফ্রেম স্ট্যাকে থাকে।

---

### ৪. ইন-প্লেস (In-Place) অ্যালগরিদম কেন জরুরি?
যে অ্যালগরিদম কোনো বড় সহায়ক মেমরি না বানিয়ে মূল অ্যারের ভেতরেই উপাদানগুলোর অবস্থান সোয়াপ করে কাজ সম্পন্ন করে ($O(1)$ অক্সিলিয়ারি মেমরি), তাকে **In-Place** অ্যালগরিদম বলে (যেমন: Bubble Sort, Selection Sort, Insertion Sort, Heap Sort)।

---

### ৫. মেমরি বাঁচানোর ৩টি গোল্ডেন রুলস:
1. **রিকার্শনে ভেক্টর বাই-ভ্যালু নয়, বাই-রেফারেন্স পাস করুন:** \`void func(vector<int> arr)\` লিখলে প্রতি ধাপে সম্পূর্ণ অ্যারে কপি হয়ে $O(n^2)$ মেমরি অপচয় ঘটে। সবসময় \`const vector<int>& arr\` ব্যবহার করুন।
2. **2D ভেক্টরের বদলে 1D ফ্ল্যাট বাফার ব্যবহার করুন:** \`vector<vector<int>>\` এর চেয়ে \`vector<int> grid(n * m)\` ক্যাশ মেমরিতে অনেক দ্রুত কাজ করে।
3. **ডাইনামিক প্রোগ্রামিংয়ে স্পেস অপ্টিমাইজেশন:** ডিপি টেবিলে যদি শুধু আগের ১ বা ২টি মান প্রয়োজন হয়, তবে পুরো $O(n)$ বা $O(n^2)$ টেবিল না রেখে মাত্র ২টি ভ্যারিয়েবল ব্যবহার করে মেমরিকে $O(1)$ এ নামিয়ে আনা যায়।
      `,
    },
    quizTopicId: "space-complexity",
    visualizerLink: {
      label: "Space Complexity Visualizer",
      algorithmId: "space-complexity",
      path: "/algorithms/space-complexity",
    },
  },
  {
    slug: "linked-list-fundamentals",
    level: 5,
    levelTitle: "Level 5: Fundamental Data Structures",
    order: 3,
    title: "Singly Linked List: Nodes, Pointers & Memory Architecture",
    subtitle: "Deep dive into dynamic node allocation, pointer rewiring, O(1) head insertion vs O(n) array element shifting.",
    estimatedReadTime: "12 min",
    category: "Data Structures",
    content: `
# Singly Linked List: Nodes, Pointers & Memory Architecture

A **Linked List** is a fundamental linear data structure composed of discrete, dynamically allocated structures called **Nodes**. Unlike arrays, which occupy a single contiguous block of physical RAM, linked list nodes can reside anywhere in the heap. They maintain sequential order solely through pointer references stored inside each node.

---

## 1. Anatomy of a Node

In C++, a singly linked list node typically packages two distinct components:
1. **Data payload (\`val\`):** The value stored in this element.
2. **Next pointer (\`next\`):** A memory pointer referencing the successor node, or \`nullptr\` if it is the terminal node.

\`\`\`cpp
struct Node {
    int val;
    Node* next;
    Node(int x) : val(x), next(nullptr) {}
};
\`\`\`

---

## 2. Head Prepending: Why Linked Lists Beat Arrays at Insertion

Consider prepending an element at the very front (index 0) of a collection:

### Array Prepend — $O(n)$ Costly Shift
To insert an element at \`arr[0]\` in a standard vector, every existing element from index 0 to $n-1$ must be shifted one position to the right to make room:
\`\`\`cpp
for (int j = n; j > 0; j--) {
    arr[j] = arr[j - 1]; // Moves all n elements in memory!
}
arr[0] = newElement;
\`\`\`
If the array contains 1,000,000 elements, inserting at the front moves 1,000,000 memory words!

### Linked List Prepend — Strictly $O(1)$ Time
In a linked list, prepending requires only **two pointer assignments**, completely independent of the size of the list:
\`\`\`cpp
void insertAtHead(int val) {
    Node* newNode = new Node(val);
    newNode->next = head; // Point new node to current first node
    head = newNode;       // Advance head to point to new node
}
\`\`\`
Whether the list contains 5 nodes or 5,000,000 nodes, inserting at the head always takes the exact same two CPU instructions ($O(1)$).

---

## 3. The Tradeoff: Random Access vs Sequential Hopping

| Feature | Dynamic Array / Vector | Singly Linked List |
| :--- | :--- | :--- |
| **Access by Index (\`arr[i]\`)** | **$O(1)$** (Direct pointer arithmetic: \`base + i * size\`) | **$O(i) \\rightarrow O(n)$** (Must hop $i$ pointer steps) |
| **Insert at Head** | **$O(n)$** (Must shift all $n$ items right) | **$O(1)$** (Rewire 2 pointers) |
| **Insert at Tail** | **$O(1)$ amortized** | **$O(n)$** without tail ptr / **$O(1)$** with tail ptr |
| **Delete by Value** | **$O(n)$** (Search + shift) | **$O(n)$** (Search + splice, zero shifts) |
| **Memory Overhead** | Compact (zero per-element pointer overhead) | Extra 8 bytes per node for \`next\` pointer |
| **Cache Locality** | **Excellent** (Contiguous cache prefetching) | **Poor** (Nodes scattered across heap) |

---

## 4. Deleting by Value: Pointer Splicing

Deleting an element in a linked list does NOT move any remaining elements. Instead, you find the predecessor node (\`prev\`) and splice its pointer around the target node:

\`\`\`cpp
bool deleteValue(int target) {
    if (!head) return false;
    if (head->val == target) {
        Node* temp = head;
        head = head->next;
        delete temp;
        return true;
    }
    Node* curr = head;
    while (curr->next && curr->next->val != target) {
        curr = curr->next;
    }
    if (!curr->next) return false; // Target not found
    Node* temp = curr->next;
    curr->next = curr->next->next; // Splice around target
    delete temp;                   // Deallocate memory
    return true;
}
\`\`\`
    `,
    banglaNote: {
      topic: "লিঙ্কড লিস্ট, পয়েন্টার আর্কিটেকচার ও নোড স্প্লাইসিং (Linked List Deep Dive)",
      englishContext: "A linked list stores elements across non-contiguous heap memory linked by next-pointers, enabling O(1) head prepending while trading off O(1) random indexing.",
      banglaText: `
### 💡 সহজ উপমা: ট্রেজার হান্ট (Treasure Hunt) বা গুপ্তধনের ক্লু
একটি গুপ্তধন খোঁজার খেলার কথা ভাবুন। ১ম ক্লুটিতে লেখা থাকে "২য় ক্লুটি অমুক গাছের নিচে পাবে।" আপনি সেই গাছের নিচে গিয়ে ২য় ক্লু পেলেন, যাতে ৩য় ক্লুর ঠিকানা লেখা আছে। আপনি কিন্তু ১ম ক্লু না দেখে সরাসরি ৫ম ক্লুর কাছে যেতে পারবেন না; আপনাকে একের পর এক ঠিকানা অনুসরণ করে সামনে এগোতে হবে। লিঙ্কড লিস্টের নোডগুলো ঠিক তেমনি মেমোরির যেকোনো জায়গায় ছড়িয়ে থাকে এবং প্রতিটি নোড তার পরবর্তী নোডের মেমোরি অ্যাড্রেস বা **পয়েন্টার (\`next\`)** নিজের পেটে ধারণ করে রাখে।

### ⚙️ নোডের মেমোরি গঠন (Node Anatomy):
সি++ এ প্রতিটি নোডে দুটি জিনিস প্যাক করা থাকে:
১. **ডেটা (\`val\`):** যে সংখ্যা বা তথ্য নোডে সংরক্ষিত আছে।
২. **পয়েন্টার (\`next\`):** পরবর্তী নোডের ৮ বাইটের মেমোরি অ্যাড্রেস (শেষ নোডের ক্ষেত্রে এটি \`nullptr\`)।

### 🚀 শুরুতে উপাদান যোগ করার ম্যাজিক ($O(1)$ Head Insertion):
- অ্যারেতে শুরুতে নতুন সংখ্যা ঢুকাতে গেলে পেছনের ১০ লাখ উপাদানকে ১ ঘর করে ডানে সরাতে $O(n)$ সময় নষ্ট হয়।
- কিন্তু লিঙ্কড লিস্টে তালিকা যত বড়ই হোক না কেন, নতুন একটি নোড বানিয়ে শুধু দুটি পয়েন্টার অ্যাসাইন করলেই কাজ শেষ:
  \`\`\`cpp
  newNode->next = head; // নতুন নোড আগের ১ম নোডকে নির্দেশ করবে
  head = newNode;       // হেড এখন নতুন নোডকে নির্দেশ করবে
  \`\`\`
- এটি সম্পন্ন করতে তালিকার আকারের ওপর কোনো নির্ভরতা নেই, তাই এটি সর্বদা **$O(1)$ সময়** নেয়।

### 🔄 নোড মুছে ফেলা ও পয়েন্টার স্প্লাইসিং (Pointer Splicing):
মাঝখান থেকে কোনো নোড মুছে ফেলার জন্য কোনো উপাদান নড়াচড়া করতে হয় না। টার্গেট নোডের আগের নোডের (\`prev\`) পয়েন্টারটি টার্গেটের পরবর্তী নোডের (\`curr->next\`) সাথে বাইপাস করে জুড়ে দিলেই টার্গেট নোড বিচ্ছিন্ন হয়ে যায়:
\`prev->next = curr->next; delete curr;\`

### ⚖️ অ্যারে বনাম লিঙ্কড লিস্টের গভীর তুলনা:
| বৈশিষ্ট্য | ডায়নামিক অ্যারে (Vector) | একক লিঙ্কড লিস্ট (Singly Linked List) |
| :--- | :--- | :--- |
| **ইনডেক্সিং \`arr[i]\`** | $O(1)$ (সরাসরি ফর্মুলা) | $O(n)$ (শুরু থেকে $i$ বার লাফাতে হয়) |
| **শুরুতে ইনসার্ট** | $O(n)$ (সবাইকে ডানে সরাতে হয়) | $O(1)$ (শুধু ২টি পয়েন্টার বদল) |
| **মাঝের নোড ডিলিট** | $O(n)$ (বামে শিফট করতে হয়) | $O(n)$ সার্চ + $O(1)$ স্প্লাইস |
| **মেমোরি ওভারহেড** | শূন্য পয়েন্টার অপচয় | প্রতি নোডে অতিরিক্ত ৮ বাইট পয়েন্টার |
| **সিপিইউ ক্যাশ** | চমৎকার (Contiguous RAM) | দুর্বল (হিপ মেমরিতে ছড়িয়ে থাকে) |

### ⚠️ ইন্টারভিউ ট্র্যাপ ও সাধারণ ভুল:
১. **নাল পয়েন্টার ক্র্যাশ (Null Pointer Dereference):** \`curr->next\` চেক করার আগে \`curr != nullptr\` নিশ্চিত না করলে প্রোগ্রাম সাথে সাথে Segmentation Fault দিয়ে ক্র্যাশ করবে।
২. **মেমোরি লিক (Memory Leak):** পয়েন্টার রিবাইন্ড করার আগে নোডটি \`delete\` না করলে মেমরিতে গার্বেজ ডেটা আটকে থাকে।
৩. **ফ্লয়েডের কচ্ছপ-খরগোশ অ্যালগরিদম (Floyd's Cycle Finding):** লিঙ্কড লিস্টে কোনো সাইকেল বা লুপ আছে কি না তা একটি স্লো পয়েন্টার (১ ধাপ) ও একটি ফাস্ট পয়েন্টার (২ ধাপ) দিয়ে মাত্র $O(n)$ সময় ও $O(1)$ স্পেসে শনাক্ত করা যায়।
      `,
    },
    quizTopicId: "linked-list",
    visualizerLink: {
      label: "Linked List Studio",
      algorithmId: "linked-list",
      path: "/algorithms/linked-list",
    },
  },
  {
    slug: "linear-search",
    level: 7,
    levelTitle: "Level 7: Searching Algorithms",
    order: 1,
    title: "Linear Search: Sequential Scanning & Complexity Bounds",
    subtitle: "Sequential inspection, early exit optimizations, worst vs best case derivation, and when unsorted data makes it optimal.",
    estimatedReadTime: "8 min",
    category: "Searching",
    content: `
# Linear Search: Sequential Scanning & Complexity Bounds

**Linear Search** (also called **Sequential Search**) is the simplest search algorithm in computer science. It traverses an array or collection element by element from beginning to end, comparing each item with the target value until a match is found or the collection is exhausted.

---

## Mathematical Complexity Derivation

### Best Case: $O(1)$ Comparisons
If the target happens to be the very first element in the array (\`arr[0] == target\`), the loop body executes exactly once and immediately returns. Time complexity is strictly $O(1)$.

### Worst Case: $O(n)$ Comparisons
Occurs when:
1. The target is located in the very last slot (\`arr[n-1]\`), requiring $n$ comparisons.
2. The target is absent from the array, requiring $n$ unsuccessful checks before returning \`-1\`.
Thus, worst-case complexity is $W(n) = n \\implies O(n)$.

### Average Case: $\\frac{n+1}{2} \\rightarrow O(n)$ Comparisons
Assuming the target is present and equally likely to appear in any of the $n$ positions:
$$A(n) = \\frac{1}{n} \\sum_{i=1}^{n} i = \\frac{1}{n} \\cdot \\frac{n(n+1)}{2} = \\frac{n+1}{2} = O(n)$$

---

## 3. Engineering Decisions: When to Use Linear Search

Beginners often assume Linear Search should never be used because Binary Search is $O(\\log n)$. However, Linear Search is superior in several real-world situations:
1. **Unsorted Data:** Sorting an unsorted array takes $O(n \\log n)$ time. If you only plan to perform 1 or 2 lookups, sorting first is vastly slower than simply running a single $O(n)$ linear scan!
2. **Small Arrays ($n < 30$):** CPU cache lines fetch contiguous memory chunks. For small collections, a simple linear loop executes entirely in L1 cache with zero branching mispredictions, beating complex search algorithms.
3. **Linked Lists:** Since linked lists do not support $O(1)$ random indexing, Binary Search cannot be performed on them efficiently. Linear Search is the native search method for linked lists.
    `,
    banglaNote: {
      topic: "লিনিয়ার সার্চ, ক্রমান্বয়ে অনুসন্ধান ও অপ্টিমাইজেশন (Linear Search Deep Dive)",
      englishContext: "Linear Search sequentially scans each item from index 0 to n - 1, running in O(1) best case and O(n) worst case, outperforming Binary Search when data is unsorted or small.",
      banglaText: `
### 💡 সহজ উপমা: এলোমেলো ড্রয়ারে চাবি খোঁজা
একটি ড্রয়ারে এলোমেলোভাবে অনেকগুলো চাবি রাখা আছে। চাবিগুলো কোনো ক্রমানুসারে সাজানো নেই। আপনি কীভাবে নির্দিষ্ট চাবিটি খুঁজবেন? আপনাকে ড্রয়ারের একপাশ থেকে শুরু করে প্রতিটি চাবি হাতে নিয়ে একে একে দেখতে হবে যতক্ষণ না কাঙ্ক্ষিত চাবিটি মিলছে। এটিই হলো **Linear Search** বা ক্রমান্বয়ে অনুসন্ধান।

### 🔍 ধাপে ধাপে কার্যপদ্ধতি (How It Works):
১. **শুরু থেকে স্ক্যান:** ইনডেক্স $0$ থেকে শুরু করে লুপ চালিয়ে প্রতিটি উপাদান পরীক্ষা করা হয়।
২. **টার্গেট ম্যাচ (Early Exit):** যে মুহূর্তে \`arr[i] == target\` শর্ত সত্য হয়, তখনই কারেন্ট ইনডেক্স $i$ রিটার্ন করে অ্যালগরিদম সাথে সাথে কাজ শেষ করে ($O(1)$ Best Case)।
৩. **তালিকা শেষ (-1 Not Found):** পুরো অ্যারের $n$ টি উপাদান দেখা শেষ হয়ে গেলেও যদি টার্গেট না মেলে, তবে বুঝবেন উপাদানটি তালিকায় নেই এবং \`-1\` রিটার্ন করা হয়।

### ⚡ কখন লিনিয়ার সার্চ বাইনারি সার্চের চেয়েও বুদ্ধিমানের কাজ?
নতুন প্রোগ্রামাররা মনে করে বাইনারি সার্চ যেহেতু $O(\\log n)$, তাই লিনিয়ার সার্চ কখনোই ব্যবহার করা উচিত নয়। কিন্তু বাস্তব সফটওয়্যার ইঞ্জিনিয়ারিংয়ে ৩টি ক্ষেত্রে লিনিয়ার সার্চই সেরা:
১. **অসাজানো ডেটা (Unsorted Data):** অসাজানো অ্যারেকে আগে সর্ট করতে সময় লাগে $O(n \\log n)$। যদি আপনার মাত্র ১ বা ২ বার সার্চ করার প্রয়োজন হয়, তবে আগে পুরো অ্যারে সর্ট করার পেছনে সময় নষ্ট না করে সরাসরি একটি সাধারণ $O(n)$ লিনিয়ার স্ক্যান করাই বহুগুণ দ্রুত!
২. **ছোট অ্যারে ($n \\le 30$):** আধুনিক সিপিইউ-এর L1 ক্যাশ লাইন (Cache Line) পুরো ছোট অ্যারেকে এক নিমেষে প্রসেসরের ভেতরে নিয়ে আসে। ফলে কোনো ব্রাঞ্চ মিসপ্রেডিকশন ছাড়াই লিনিয়ার লুপ আলোর গতিতে চলে।
৩. **লিঙ্কড লিস্ট (Linked List):** লিঙ্কড লিস্টে মাঝের উপাদানে লাফ দিয়ে পৌঁছানোর কোনো উপায় নেই ($O(1)$ র্যান্ডম এক্সেস নেই)। তাই লিঙ্কড লিস্টে বাইনারি সার্চ চালানো অসম্ভব; সেখানে লিনিয়ার সার্চই একমাত্র ভরসা।

### ⏱️ টাইম ও স্পেস কমপ্লেক্সিটি:
- **Best-Case Time ($O(1)$):** টার্গেট যদি কাকতালীয়ভাবে অ্যারের একদম ১ম ঘরে (\`arr[0]\`) থাকে।
- **Worst-Case Time ($O(n)$):** টার্গেট যদি একদম শেষ ঘরে থাকে অথবা পুরো তালিকায় না থাকে।
- **Average-Case Time ($\\Theta(n)$):** গড়ে প্রায় $\\frac{n}{2}$ টি উপাদান পরীক্ষা করতে হয়।
- **Auxiliary Space ($O(1)$):** কোনো অতিরিক্ত মেমোরি লাগে না, ইন-প্লেস চলে।
      `,
    },
    quizTopicId: "linear-search",
    visualizerLink: {
      label: "Linear Search Studio",
      algorithmId: "linear-search",
      path: "/algorithms/linear-search",
    },
  },
  {
    slug: "binary-search",
    level: 7,
    levelTitle: "Level 7: Searching Algorithms",
    order: 2,
    title: "Binary Search: Logarithmic Halving & Precondition Proofs",
    subtitle: "Divide-and-conquer interval halving, proof of O(log n) convergence connecting back to Merge Sort, iterative vs recursive call stack space, and 32-bit overflow avoidance.",
    estimatedReadTime: "14 min",
    category: "Searching",
    content: `
# Binary Search: Logarithmic Halving & Precondition Proofs

**Binary Search** is one of the most powerful algorithms in computer science. By taking advantage of **sorted data**, it repeatedly divides the search space in half, locating any element in an array of $n$ items in at most $\\lceil \\log_2 n \\rceil$ steps.

> ⚠️ **CRITICAL PRECONDITION:**
> Binary Search **ONLY** works if the collection is sorted in monotonic order (e.g. non-decreasing order). Running Binary Search on an unsorted array produces undefined or wrong results!

---

## Deriving the $O(\log n)$ Bound (Connection to Merge Sort)

In Phase 8, we proved that Merge Sort splits an array in half repeatedly until singletons remain, creating a tree of depth $\\log_2 n$.

Binary Search operates on the exact same mathematical principle:
1. Initially, the interval has length $n$.
2. After 1 comparison, the interval length becomes $\\frac{n}{2}$.
3. After 2 comparisons, the interval length becomes $\\frac{n}{4} = \\frac{n}{2^2}$.
4. After $k$ comparisons, the interval length becomes $\\frac{n}{2^k}$.

The algorithm must terminate when the interval is reduced to a single element ($1$ candidate):
$$\\frac{n}{2^k} = 1 \\implies 2^k = n \\implies k = \\log_2 n$$

Therefore, in the worst case, Binary Search performs at most $\\lceil \\log_2 n \\rceil$ comparisons.
- For $n = 1,000$, it takes at most **10** comparisons.
- For $n = 1,000,000$, it takes at most **20** comparisons.
- For $n = 1,000,000,000$, it takes at most **30** comparisons!

---

## 3. The 32-Bit Overflow Bug Explained

Many standard textbooks incorrectly write:
\`\`\`cpp
int mid = (low + high) / 2; // DANGEROUS BUG!
\`\`\`
If \`low\` and \`high\` are both around $1.5 \\times 10^9$ (valid in a large 2-billion element array), \`low + high\` equals $3 \\times 10^9$, which exceeds the maximum value of a 32-bit signed integer ($2,147,483,647$). The integer wraps around into negative territory, producing a negative index and crashing the program with a segmentation fault!

The mathematically equivalent formula:
\`\`\`cpp
int mid = low + (high - low) / 2; // SAFE
\`\`\`
will NEVER overflow because \`high - low\` is always strictly less than or equal to \`high\`.
    `,
    banglaNote: {
      topic: "বাইনারি সার্চ, ইন্টারভাল বিভাজন ও ওভারফ্লো প্রতিরোধ (Binary Search Deep Dive)",
      englishContext: "Binary Search repeatedly halves the candidate search space on sorted collections, delivering guaranteed O(log n) convergence while avoiding 32-bit integer overflow.",
      banglaText: `
### 💡 সহজ উপমা: ডিকশনারিতে শব্দ খোঁজা ও "Higher / Lower" অনুমান খেলা
ধরা যাক একজন বন্ধু আপনাকে ১ থেকে ১০০-এর মধ্যে একটি গোপন সংখ্যা ভাবতে বলল এবং প্রতি অনুমানে সে কেবল বলবে "তোমার সংখ্যাটি আমার সংখ্যার চেয়ে বড়" নাকি "ছোট"।
- আপনি যদি বুদ্ধিমান হন, আপনি শুরুতেই বলবেন **৫০**।
- বন্ধু যদি বলে "গোপন সংখ্যাটি ৫০-এর চেয়ে বড়", তবে মাত্র ১টি প্রশ্নেই আপনি ১ থেকে ৫০ পর্যন্ত অর্ধেক পৃথিবী এক নিমেষে বাদ দিয়ে দিলেন!
- এরপর আপনি বলবেন ৭৫, তারপর ৮৭... এভাবে মাত্র ৭টি প্রশ্নে ১০০টি সংখ্যার মধ্য থেকে সঠিক সংখ্যাটি নিশ্চিতভাবে বের করে ফেলা যায়।
ডিকশনারিতে শব্দ খোঁজার সময় আমরা ঠিক এই পদ্ধতিই ব্যবহার করি; একেই বলে **Binary Search**।

### ⚠️ অপরিহার্য পূর্বশর্ত (Strict Precondition):
বাইনারি সার্চের একমাত্র এবং সবচেয়ে গুরুত্বপূর্ণ শর্ত হলো: **ডাটা অবশ্যই ছোট থেকে বড় ক্রমানুসারে সাজানো (Sorted) থাকতে হবে!** 
এলোমেলো বা অসাজানো ডাটায় বাইনারি সার্চ চালালে এটি সম্পূর্ণ ভুল উত্তর দেবে।

### 🔍 ধাপে ধাপে অ্যালগরিদম যেভাবে কাজ করে:
১. **সীমানা নির্ধারণ:** দুটি পয়েন্টার রাখা হয় — \`low = 0\` এবং \`high = n - 1\`।
২. **মাঝের উপাদান গণনা (\`mid\`):** সীমানার ঠিক মধ্যবিন্দু বের করা হয়।
৩. **তিনটি সম্ভাবনা:**
   - \`arr[mid] == target\`: কাঙ্ক্ষিত সংখ্যাটি মিলে গেছে! সাথে সাথে ইনডেক্স \`mid\` রিটার্ন করুন ($O(1)$ Best Case)।
   - \`arr[mid] < target\`: এর মানে টার্গেটটি ডানপাশের অংশে আছে। তাই বামের অর্ধেক পুরোটাই বাদ দিয়ে \`low = mid + 1\` করা হয়।
   - \`arr[mid] > target\`: এর মানে টার্গেটটি বামপাশের অংশে আছে। তাই ডানের অর্ধেক পুরোটাই বাদ দিয়ে \`high = mid - 1\` করা হয়।
৪. **লুপ সমাপ্তি:** \`low > high\` হয়ে গেলে বুঝতে হবে সংখ্যাটি তালিকায় নেই এবং \`-1\` রিটার্ন করা হয়।

### 💥 বিখ্যাত ঐতিহাসিক বাগ: ৩২-বিট ইন্টিজার ওভারফ্লো (Integer Overflow):
গুগলের গবেষকরাও একসময় এই সাধারণ ভুলটি করেছিলেন:
\`\`\`cpp
int mid = (low + high) / 2; // মারাত্মক ভুল!
\`\`\`
যদি \`low\` এবং \`high\` উভয়ের মান ১০০ কোটির বেশি হয় (যা বড় ২ বিলিয়ন সাইজের অ্যারেতে খুবই স্বাভাবিক), তবে তাদের যোগফল \`low + high\` দাঁড়ায় ২০০ কোটির ওপরে, যা ৩২-বিট সাইনড ইন্টিজারের সর্বোচ্চ সীমা ($2,147,483,647$) ছাড়িয়ে যায়। ফলে সংখ্যাটি নেগেটিভ হয়ে যায় এবং প্রোগ্রামটি **Segmentation Fault** দিয়ে ক্র্যাশ করে!
- **নিরাপদ গাণিতিক সূত্র:**
  \`\`\`cpp
  int mid = low + (high - low) / 2; // ১০০% নিরাপদ
  \`\`\`
  এখানে কখনো ওভারফ্লো ঘটার কোনো সুযোগ নেই।

### ⏱️ লগারিদমিক গতির বিস্ময় ($O(\\log n)$):
- $1,000$ টি সংখ্যায় খুঁজতে সময় লাগে সর্বোচ্চ **১০টি** তুলনা।
- $10,00,000$ (১০ লাখ) সংখ্যায় খুঁজতে সময় লাগে সর্বোচ্চ **২০টি** তুলনা।
- $100,00,00,000$ (১০০ কোটি) সংখ্যায় খুঁজতে সময় লাগে সর্বোচ্চ **৩০টি** তুলনা!
- **Space Complexity:** ইটারেটিভ ভার্সনে কোনো অতিরিক্ত মেমোরি লাগে না ($O(1)$ ইন-প্লেস)। রিকার্সিভ ভার্সনে কল স্ট্যাকের জন্য $O(\\log n)$ মেমোরি লাগে।
      `,
    },
    quizTopicId: "binary-search",
    visualizerLink: {
      label: "Binary Search Studio",
      algorithmId: "binary-search",
      path: "/algorithms/binary-search",
    },
  },
];

export const DOCS_LEVELS: DocsLevel[] = [
  {
    level: 0,
    title: "Level 0: Before You Start",
    description: "Foundational concepts: formal sorting definitions, Big-O for beginners, and C++ reading guide.",
    articles: DOCS_ARTICLES.filter((a) => a.level === 0)
  },
  {
    level: 1,
    title: "Level 1: The Simple Algorithms",
    description: "Iterative $O(n^2)$ sorting engines: Bubble Sort, Selection Sort, and Insertion Sort.",
    articles: DOCS_ARTICLES.filter((a) => a.level === 1)
  },
  {
    level: 2,
    title: "Level 2: Divide and Conquer",
    description: "Recursive problem solving: What is recursion?, Merge Sort, and Quick Sort.",
    articles: DOCS_ARTICLES.filter((a) => a.level === 2)
  },
  {
    level: 3,
    title: "Level 3: Advanced Analysis",
    description: "Formal proofs, recurrence tree derivations, stability proofs, and production hybrid algorithms.",
    articles: DOCS_ARTICLES.filter((a) => a.level === 3)
  },
  {
    level: 4,
    title: "Level 4: Choosing the Right Algorithm",
    description: "Engineering decision framework, trade-off matrices, and real-world selection guides.",
    articles: DOCS_ARTICLES.filter((a) => a.level === 4)
  },
  {
    level: 5,
    title: "Level 5: Fundamental Data Structures",
    description: "Core containers: Stack (LIFO), Queue (FIFO, circular buffers), Linked List (dynamic nodes), Hash Table (O(1) direct addressing), and Binary Tree (hierarchical branching & traversals).",
    articles: DOCS_ARTICLES.filter((a) => a.level === 5)
  },
  {
    level: 6,
    title: "Level 6: Algorithmic Complexity Analysis",
    description: "Deep dive into Time Complexity growth rates, Space Complexity auxiliary memory, and call stack overhead.",
    articles: DOCS_ARTICLES.filter((a) => a.level === 6)
  },
  {
    level: 7,
    title: "Level 7: Searching Algorithms",
    description: "Locating targets efficiently: Linear Search (O(n) on unsorted data) and Binary Search (O(log n) logarithmic halving on sorted data).",
    articles: DOCS_ARTICLES.filter((a) => a.level === 7)
  }
];
