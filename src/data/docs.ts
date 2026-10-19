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
    title: "Bubble Sort: Adjacent Comparisons",
    subtitle: "The simplest comparison sorting mechanism: swapping adjacent out-of-order neighbors.",
    estimatedReadTime: "7 min",
    category: "Simple Algorithms",
    content: `
### Core Conceptual Model

Bubble Sort is the most intuitive sorting algorithm. It makes multiple passes through an array, comparing adjacent pairs of items:

1. Look at \`arr[j]\` and \`arr[j + 1]\`.
2. If \`arr[j] > arr[j + 1]\`, swap them.
3. Advance to the next adjacent pair.
4. After pass $i$, the largest remaining unsorted element has "bubbled up" to index $n - 1 - i$.

\`\`\`cpp
void bubbleSort(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                std::swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break; // Optimized early exit
    }
}
\`\`\`

---

### Key Properties

- **Best Case Time**: $O(n)$ with the \`swapped\` flag on an already-sorted array.
- **Worst Case Time**: $O(n^2)$ when the array is in reverse order.
- **Space**: $O(1)$ auxiliary memory (strictly In-Place).
- **Stability**: **Stable** because identical elements ($arr[j] == arr[j+1]$) never trigger a swap.
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
    title: "Selection Sort: Finding the Minimum",
    subtitle: "Partitioning the list into sorted and unsorted portions with minimal swaps.",
    estimatedReadTime: "7 min",
    category: "Simple Algorithms",
    content: `
### Core Conceptual Model

Selection Sort splits the array into two distinct partitions:
- A **sorted subarray** on the left (initially empty).
- An **unsorted subarray** on the right (initially the entire array).

In each iteration $i$:
1. Scan the unsorted partition $[i \\dots n-1]$ to locate the index of the absolute minimum element (\`minIdx\`).
2. Perform exactly **one single swap** between \`arr[i]\` and \`arr[minIdx]\`.
3. The boundary of the sorted partition expands to index $i$.

\`\`\`cpp
void selectionSort(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx != i) {
            std::swap(arr[i], arr[minIdx]);
        }
    }
}
\`\`\`

---

### Why Is It Unstable?

Because Selection Sort swaps across long distances, it can jump an element over an identical duplicate:
- Initial array: \`[4a, 4b, 2]\`
- Round 1: Minimum is \`2\` at index 2. Swaps with \`4a\` at index 0.
- Result: \`[2, 4b, 4a]\` $\\rightarrow$ \`4b\` is now before \`4a\`, breaking stability!
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
    title: "Insertion Sort: Hand-Sorting Playing Cards",
    subtitle: "Extracting keys and shifting sorted elements rightwards.",
    estimatedReadTime: "8 min",
    category: "Simple Algorithms",
    content: `
### The Card-Player's Algorithm

Insertion Sort models how people naturally sort playing cards held in their hand:
1. Start with the card at index 1 as the current \`key\`.
2. Compare the \`key\` backwards against already-sorted cards on the left.
3. **Shift** cards that are strictly greater than \`key\` one slot to the right.
4. Insert the \`key\` into the empty opening.

\`\`\`cpp
void insertionSort(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j]; // Rightward shift
            j--;
        }
        arr[j + 1] = key; // Insert into slot
    }
}
\`\`\`

---

### Why Production Engines Love Insertion Sort

Insertion Sort is **adaptive**: on nearly-sorted data with $k$ inversions, it runs in $O(n + k)$ time. Furthermore, because its inner loop has no function call overhead and exhibits great CPU cache locality, engines like **V8** and **Python's Timsort** switch to Insertion Sort whenever subarray sizes drop below ~16 elements!
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
    title: "Merge Sort: Guaranteed O(n log n)",
    subtitle: "Splitting arrays into halves and zipping sorted subarrays back together.",
    estimatedReadTime: "9 min",
    category: "Divide and Conquer",
    content: `
### Divide and Conquer Paradigm

Merge Sort operates in three phases:
1. **Divide**: Calculate midpoint \`mid = left + (right - left) / 2\` and divide the array into two equal halves.
2. **Conquer**: Recursively sort the left half and the right half until subarrays contain only 1 element (base case).
3. **Combine (Merge)**: Zip the two sorted subarrays together into a single sorted range in linear $O(n)$ time.

\`\`\`cpp
void merge(std::vector<int>& arr, int left, int mid, int right) {
    std::vector<int> temp;
    int i = left;
    int j = mid + 1;
    
    // Compare top cards from each half
    while (i <= mid && j <= right) {
        if (arr[i] <= arr[j]) { // '<=' ensures stability
            temp.push_back(arr[i++]);
        } else {
            temp.push_back(arr[j++]);
        }
    }
    while (i <= mid) temp.push_back(arr[i++]);
    while (j <= right) temp.push_back(arr[j++]);
    
    // Copy back into original array
    for (int k = left; k <= right; k++) {
        arr[k] = temp[k - left];
    }
}

void mergeSort(std::vector<int>& arr, int left, int right) {
    if (left >= right) return; // Base Case
    int mid = left + (right - left) / 2;
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
}
\`\`\`
    `,
    banglaNote: {
      topic: "Divide and Conquer (ভাগ করো ও জয় করো)",
      englishContext: "Divide and conquer divides a problem into subproblems, solves each recursively, and combines the results.",
      // [REVIEW DRAFT] Bengali translation for user review
      banglaText: `
**মার্জ সর্ট ও ডিভাইড-অ্যান্ড-কনকার:**

মার্জ সর্টের মূল দর্শন খুব সহজ: **"ভাগ করো, জয় করো, একত্রিত করো।"**

1. **ভাগ করো (Divide):** একটি বড় অ্যারেকে মাঝ বরাবর দুই টুকরো করে কেটে ফেলুন।
2. **জয় করো (Conquer):** টুকরো দুটোকে আলাদাভাবে সর্ট করুন।
3. **একত্রিত করো (Merge):** দুটো সর্ট করা টুকরোর প্রথম উপাদান তুলনা করে ছোটটিকে তুলে এনে নতুন সারিতে সাজান।

💡 **বাস্তব উদাহরণ:** পরীক্ষার খাতা সাজানো। দুজন পরীক্ষক ১০০টি করে খাতা রোল অনুযায়ী সাজিয়ে নিলেন। এবার প্রধান পরীক্ষক দুজনের খাতার ওপরের রোল দেখে খুব সহজে ২০০টি খাতা একবারে সাজিয়ে ফেলতে পারেন!
      `
    },
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
    title: "Quick Sort: In-Place Partitioning",
    subtitle: "Choosing a pivot element and dividing numbers into smaller and larger regions without extra array allocations.",
    estimatedReadTime: "10 min",
    category: "Divide and Conquer",
    content: `
### Partitioning: The Engine of Quick Sort

Unlike Merge Sort which does all its heavy work *after* recursion (during merging), Quick Sort does all its heavy work *before* recursion (during partitioning):

1. **Pick a Pivot**: Choose an element (e.g. \`arr[high]\` in Lomuto partitioning).
2. **Partition**: Rearrange the array in-place so all numbers strictly smaller than the pivot move to the left, and all numbers greater move to the right.
3. **Permanent Seat**: The pivot is placed into index \`pIdx\`. It will **never move again**!
4. **Recursion**: Recursively call \`quickSort\` on $[low \\dots pIdx - 1]$ and $[pIdx + 1 \\dots high]$.

\`\`\`cpp
int partition(std::vector<int>& arr, int low, int high) {
    int pivot = arr[high]; // Lomuto Pivot
    int i = low - 1;       // Smaller region boundary
    
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            std::swap(arr[i], arr[j]);
        }
    }
    std::swap(arr[i + 1], arr[high]); // Place pivot in permanent slot
    return i + 1;
}

void quickSort(std::vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}
\`\`\`
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
      topic: "Array ও Memory Contiguity (সহজ বাংলায় ধারণা)",
      englishContext: "An array stores items consecutively in RAM, so calculating any index's address takes a single calculation step O(1). But inserting in the middle forces all subsequent items to shift O(n).",
      banglaText: `অ্যারে (Array) হলো মেমরির একনাগাড়ে পাশাপাশি সাজানো বক্সের মতো। 

যেহেতু প্রতিটি আইটেম সমান সাইজের (যেমন ৪ বাইট পূর্ণসংখ্যা), তাই কম্পিউটার কোনো লুপ ছাড়াই সরাসরি ফর্মুলা দিয়ে যেকোনো ইনডেক্স খুঁজে পায়: 
**Address = BaseAddress + (Index × 4)**। 

কিন্তু এর একটা অসুবিধা আছে — যদি আপনি ৩য় পজিশনে নতুন একটা সংখ্যা ঢোকাতে চান, তবে বাকি সব সংখ্যাকে এক ঘর করে ডানপাশে সরাতে (Shift) হয়, যাতে O(n) সময় লাগে। আর C++ vector যখন পূর্ণ হয়ে যায়, তখন সে মেমরিতে দ্বিগুণ (2x) সাইজের নতুন জায়গা নিয়ে সব কপি করে, যাকে Amortized O(1) বলা হয়।`
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

---

### Complete Production C++ Dynamic Array Implementation

\`\`\`cpp
#include <iostream>
#include <stdexcept>

template <typename T>
class Vector {
private:
    T* data;
    size_t length;
    size_t cap;

    void resize(size_t newCap) {
        T* next = new T[newCap];
        for (size_t i = 0; i < length; i++) {
            next[i] = std::move(data[i]);
        }
        delete[] data;
        data = next;
        cap = newCap;
    }

public:
    Vector(size_t initialCap = 4) : data(new T[initialCap]), length(0), cap(initialCap) {}

    ~Vector() { delete[] data; }

    // O(1) Random Access
    T& operator[](size_t index) {
        if (index >= length) throw std::out_of_range("Index out of bounds");
        return data[index];
    }

    // O(1) Amortized Append
    void push_back(const T& val) {
        if (length == cap) resize(cap * 2);
        data[length++] = val;
    }

    // O(n) Insertion with Right Shifting
    void insert(size_t index, const T& val) {
        if (index > length) throw std::out_of_range("Index out of bounds");
        if (length == cap) resize(cap * 2);
        for (size_t i = length; i > index; i--) {
            data[i] = std::move(data[i - 1]);
        }
        data[index] = val;
        length++;
    }

    // O(n) Deletion with Left Shifting
    void erase(size_t index) {
        if (index >= length) throw std::out_of_range("Index out of bounds");
        for (size_t i = index; i < length - 1; i++) {
            data[i] = std::move(data[i + 1]);
        }
        length--;
    }

    size_t size() const { return length; }
    size_t capacity() const { return cap; }
    bool empty() const { return length == 0; }
};
\`\`\`
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
      topic: "String ও মেমোরি ইমিউটেবিলিটি (সহজ বাংলায় ধারণা)",
      englishContext: "A string is an array of characters. In C++, strings can be modified in-place in O(1) time. But in Java, Python, and JavaScript, strings are immutable—every change duplicates all characters into a new memory block in O(n) time!",
      banglaText: `স্ট্রিং (String) মূলত মেমরিতে পাশাপাশি রাখা ক্যারেক্টার বা অক্ষরের একটা অ্যারে। প্রতিটি ASCII অক্ষর ঠিক ১ বাইট মেমোরি দখল করে, তাই কম্পিউটার ফর্মুলা দিয়ে সাথে সাথে O(1) সময়ে যেকোনো অক্ষর খুঁজে পায়। 

তবে ইন্টারভিউতে সবচেয়ে গুরুত্বপূর্ণ বিষয় হলো **Mutability বনাম Immutability**। C++ এ স্ট্রিং হলো Mutable — অর্থাৎ আপনি চাইলে সরাসরি যেকোনো অক্ষর পরিবর্তন করতে পারেন। কিন্তু JavaScript, Python বা Java-তে স্ট্রিং হলো Immutable (অপরিবর্তনশীল)! সেখানে আপনি যখনই লুপের ভেতরে \`str += 'x'\` লিখবেন, কম্পিউটার প্রতিবার পুরো স্ট্রিংটিকে মেমরিতে নতুন জায়গায় কপি করে, যার ফলে আপনার কোডের স্পিড নেমে যায় O(n²) এ! এজন্য বড় টেক্সট জোড়া দেওয়ার সময় StringBuilder বা অ্যারে জয়েন করতে হয়।`
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

---

### Complete Production C++ String Operations Suite

\`\`\`cpp
#include <iostream>
#include <string>
#include <vector>
#include <algorithm>

class StringMastery {
public:
    // 1. In-place two-pointer reversal: O(n) Time, O(1) Space
    static void reverseString(std::string& s) {
        int left = 0, right = static_cast<int>(s.size()) - 1;
        while (left < right) {
            std::swap(s[left++], s[right--]);
        }
    }

    // 2. Palindrome verification with symmetric scan: O(n) Time, O(1) Space
    static bool isPalindrome(const std::string& s) {
        int left = 0, right = static_cast<int>(s.size()) - 1;
        while (left < right) {
            if (std::tolower(s[left++]) != std::tolower(s[right--])) {
                return false; // Early exit on first mismatch
            }
        }
        return true;
    }

    // 3. Sliding window: Longest substring without repeating characters: O(n)
    static int lengthOfLongestSubstring(const std::string& s) {
        std::vector<int> lastIndex(256, -1);
        int maxLen = 0, left = 0;

        for (int right = 0; right < static_cast<int>(s.size()); right++) {
            unsigned char c = s[right];
            if (lastIndex[c] >= left) {
                left = lastIndex[c] + 1; // Contract window past previous duplicate
            }
            lastIndex[c] = right;
            maxLen = std::max(maxLen, right - left + 1);
        }
        return maxLen;
    }
};
\`\`\`
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

### C++ Implementations: Array vs. Linked List

There are two canonical ways to build a Stack in C++:

#### 1. Fixed-Size Array Stack (Fast & Cache-Friendly)
\`\`\`cpp
class ArrayStack {
private:
    static const int MAX_SIZE = 1000;
    int arr[MAX_SIZE];
    int topIndex;

public:
    ArrayStack() : topIndex(-1) {}

    bool push(int val) {
        if (topIndex >= MAX_SIZE - 1) return false; // Stack Overflow
        arr[++topIndex] = val;
        return true;
    }

    bool pop() {
        if (isEmpty()) return false; // Stack Underflow
        topIndex--;
        return true;
    }

    int peek() const {
        if (isEmpty()) throw runtime_error("Stack Underflow: Empty Stack");
        return arr[topIndex];
    }

    bool isEmpty() const { return topIndex == -1; }
    int size() const { return topIndex + 1; }
};
\`\`\`

#### 2. Dynamic Linked-List Stack (Unbounded Memory)
\`\`\`cpp
struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

class LinkedListStack {
private:
    Node* head;
public:
    LinkedListStack() : head(nullptr) {}

    void push(int val) {
        Node* newNode = new Node(val);
        newNode->next = head;
        head = newNode;
    }

    bool pop() {
        if (!head) return false;
        Node* temp = head;
        head = head->next;
        delete temp;
        return true;
    }

    int top() const {
        if (!head) throw runtime_error("Stack is empty");
        return head->data;
    }

    bool isEmpty() const { return head == nullptr; }
};
\`\`\`

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
      topic: "স্ট্যাক (Stack) ও LIFO মেকানিজম",
      englishContext: "Understanding LIFO, Call Stacks, and O(1) Push/Pop operations",
      banglaText: `
স্ট্যাক হচ্ছে এমন একটি ডাটা স্ট্রাকচার যা **LIFO (Last-In, First-Out)** নিয়ম মেনে চলে। অর্থাৎ যে উপাদানটি সবার শেষে স্ট্যাকে রাখা হবে, সেটিকে সবার প্রথমে বের করা হবে।

**বাস্তব উদাহরণ:**
একটি রেস্টুরেন্টের প্লেটের স্তূপ কল্পনা করুন। নতুন প্লেট ধুয়ে সবসময় স্তূপের একদম উপরে (Top) রাখা হয়। আবার কোনো কাস্টমার প্লেট নেওয়ার সময়ও একদম উপরের প্লেটটাই আগে নেয়। 

**কেন স্ট্যাক গুরুত্বপূর্ণ?**
১. **রিকিউরশন (Recursion):** আমরা যখন Merge Sort বা Quick Sort এর মতো রিকার্সিভ অ্যালগরিদম চালাই, কম্পিউটার ইন্টারনালি একটি **Call Stack** মেইনটেইন করে। ফাংশন শেষ হলে স্ট্যাক থেকে ফ্রেম বের হয়ে যায়।
২. **Undo ফিচার:** টেক্সট এডিটরে আপনি যা টাইপ করেন তা স্ট্যাকে জমা হয়। Ctrl+Z চাপলে লাস্ট কাজটি পপ হয়ে পূর্বাবস্থায় ফিরে আসে।
৩. **সব অপারেশনের সময় $O(1)$:** Push, Pop, Peek সবগুলো অপারেশন কনস্ট্যান্ট টাইম $O(1)$-এ সম্পন্ন হয়।
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

### C++ Implementations

#### 1. Circular Array-Based Queue
\`\`\`cpp
class CircularQueue {
private:
    int* arr;
    int frontIdx, rearIdx, count, capacity;
public:
    CircularQueue(int cap = 100) : capacity(cap), frontIdx(0), rearIdx(-1), count(0) {
        arr = new int[capacity];
    }
    ~CircularQueue() { delete[] arr; }

    bool enqueue(int val) {
        if (isFull()) return false; // Queue Overflow
        rearIdx = (rearIdx + 1) % capacity;
        arr[rearIdx] = val;
        count++;
        return true;
    }

    bool dequeue() {
        if (isEmpty()) return false; // Queue Underflow
        frontIdx = (frontIdx + 1) % capacity;
        count--;
        return true;
    }

    int front() const {
        if (isEmpty()) throw runtime_error("Queue is empty");
        return arr[frontIdx];
    }

    bool isEmpty() const { return count == 0; }
    bool isFull() const { return count == capacity; }
    int size() const { return count; }
};
\`\`\`

#### 2. Dynamic Linked-List Queue
\`\`\`cpp
struct QNode {
    int data;
    QNode* next;
    QNode(int val) : data(val), next(nullptr) {}
};

class LinkedListQueue {
private:
    QNode *head, *tail;
    int count;
public:
    LinkedListQueue() : head(nullptr), tail(nullptr), count(0) {}

    void enqueue(int val) {
        QNode* newNode = new QNode(val);
        if (!tail) {
            head = tail = newNode;
        } else {
            tail->next = newNode;
            tail = newNode;
        }
        count++;
    }

    bool dequeue() {
        if (!head) return false;
        QNode* temp = head;
        head = head->next;
        if (!head) tail = nullptr;
        delete temp;
        count--;
        return true;
    }

    int front() const {
        if (!head) throw runtime_error("Empty Queue");
        return head->data;
    }

    bool isEmpty() const { return head == nullptr; }
};
\`\`\`

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
      topic: "কিউ (Queue) ও FIFO মেকানিজম",
      englishContext: "Understanding FIFO, Circular Buffers, and O(1) Enqueue/Dequeue",
      banglaText: `
কিউ (Queue) হচ্ছে এমন একটি ডাটা স্ট্রাকচার যা **FIFO (First-In, First-Out)** নীতিতে চলে। অর্থাৎ যে ডাটাটি সবার প্রথমে প্রবেশ করবে, সেটিকে সবার প্রথমে প্রসেস বা রিমুভ করা হবে।

**বাস্তব উদাহরণ:**
একটি টিকিট কাউন্টারের লাইন কল্পনা করুন। যে ব্যক্তি লাইনে প্রথমে দাঁড়ায়, সে সবার আগে টিকিট পেয়ে বেরিয়ে যায়। নতুন লোক আসলে লাইনের পেছনে (Rear) যুক্ত হয়।

**সার্কুলার কিউ (Circular Queue) কেন প্রয়োজন?**
সাধারণ অ্যারেতে সামনের আইটেম মুছে ফেললে পেছনের সব উপাদান ১ ঘর করে সরাতে $O(n)$ সময় নষ্ট হয়। কিন্তু মডুলো $(\\text{rear} + 1) \\% \\text{capacity}$ ব্যবহার করে সার্কুলার কিউ বানালে কোনো উপাদান না সরিয়েই $O(1)$ কনস্ট্যান্ট টাইমে কিউ অপারেশন চালানো যায়।
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

#### Production C++ Circular Deque Implementation
\`\`\`cpp
class CircularDeque {
private:
    vector<int> buffer;
    int capacity, front, rear, count;
public:
    CircularDeque(int cap) : capacity(cap), buffer(cap), front(0), rear(0), count(0) {}

    bool isFull() const { return count == capacity; }
    bool isEmpty() const { return count == 0; }

    void pushFront(int val) {
        if (isFull()) throw overflow_error("Deque full");
        if (isEmpty()) { front = rear = 0; }
        else { front = (front - 1 + capacity) % capacity; }
        buffer[front] = val;
        count++;
    }

    void pushBack(int val) {
        if (isFull()) throw overflow_error("Deque full");
        if (isEmpty()) { front = rear = 0; }
        else { rear = (rear + 1) % capacity; }
        buffer[rear] = val;
        count++;
    }

    int popFront() {
        if (isEmpty()) throw underflow_error("Deque empty");
        int val = buffer[front];
        front = (front + 1) % capacity;
        count--;
        return val;
    }

    int popBack() {
        if (isEmpty()) throw underflow_error("Deque empty");
        int val = buffer[rear];
        rear = (rear - 1 + capacity) % capacity;
        count--;
        return val;
    }
};
\`\`\`

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
      topic: "ডেক (Double-Ended Queue) ও মনোটনিক ইনভ্যারিয়েন্ট",
      englishContext: "Why Deque is the versatile king of linear data structures",
      banglaText: `
১. **ডেক (Deque) কী?**
   ডেক হলো এমন একটি কিউ যেখানে সামনের (Front) ও পেছনের (Rear) উভয় দিক থেকেই $O(1)$ সময়ে উপাদান ঢোকানো (Push) এবং বের (Pop) করা যায়। এটি একই সাথে স্ট্যাক (LIFO) এবং সাধারণ কিউ (FIFO)-এর সব সুবিধা প্রদান করে।

২. **সার্কুলার ডেক ও নেগেটিভ মডুলো ট্রিক:**
   সি++ বা জাভাতে \`(-1) % N\` করলে রেজাল্ট \`-1\` আসে, যা ভুল ইনডেক্স তৈরি করে। তাই ডেক-এর শুরুতে নতুন আইটেম ঢোকাতে \`front = (front - 1 + capacity) % capacity\` ফর্মুলা ব্যবহার করে বৃত্তাকারে ইনডেক্স ঘোরাতে হয়।

৩. **স্লাইডিং উইন্ডো ম্যাক্সিমাম (Monotonic Deque):**
   ইন্টারভিউয়ের অন্যতম জনপ্রিয় প্রশ্ন! প্রতিটি উইন্ডোর সর্বোচ্চ সংখ্যা বের করতে সাধারণ নিয়মে $O(n \\times k)$ সময় লাগলেও, মনোটনিক ডেক দিয়ে মাত্র **$O(n)$ লিনিয়ার সময়ে** সব উইন্ডো সমাধান করা যায়। কারণ প্রতিটি উপাদান ডেকে সর্বোচ্চ একবার ঢোকে আর একবার বের হয়।
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

### Production C++ Implementation (Separate Chaining)

\`\`\`cpp
#include <iostream>
#include <vector>
#include <list>
#include <utility>
using namespace std;

class HashTable {
private:
    int capacity;
    int count;
    vector<list<pair<int, string>>> table;

    int hash(int key) const {
        return abs(key) % capacity;
    }

    void rehash() {
        int oldCap = capacity;
        capacity *= 2;
        vector<list<pair<int, string>>> oldTable = move(table);
        table.assign(capacity, list<pair<int, string>>());
        count = 0;
        for (const auto& bucket : oldTable) {
            for (const auto& [k, v] : bucket) {
                insert(k, v);
            }
        }
    }

public:
    HashTable(int cap = 8) : capacity(cap), count(0), table(cap) {}

    // O(1) Average Insertion
    void insert(int key, const string& value) {
        if ((float)(count + 1) / capacity > 0.75) rehash();
        int idx = hash(key);
        for (auto& [k, v] : table[idx]) {
            if (k == key) { v = value; return; } // Key exists: update value
        }
        table[idx].emplace_back(key, value);
        count++;
    }

    // O(1) Average Search
    bool search(int key, string& outVal) const {
        int idx = hash(key);
        for (const auto& [k, v] : table[idx]) {
            if (k == key) { outVal = v; return true; }
        }
        return false;
    }

    // O(1) Average Deletion
    bool erase(int key) {
        int idx = hash(key);
        auto& bucket = table[idx];
        for (auto it = bucket.begin(); it != bucket.end(); ++it) {
            if (it->first == key) {
                bucket.erase(it);
                count--;
                return true;
            }
        }
        return false;
    }

    float getLoadFactor() const { return (float)count / capacity; }
};
\`\`\`

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
      topic: "হ্যাশ টেবিল (Hash Table), কলিশন ও কনস্ট্যান্ট টাইম ও(১) ম্যাজিক",
      englishContext: "How Hash Tables achieve instant O(1) lookups and handle collisions",
      banglaText: `
১. **হ্যাশ টেবিল (Hash Table) কী?**
   সাধারণ অ্যারেতে ইনডেক্স সরাসরি জানা থাকলে যেমন $O(1)$ সময়ে মেমরি থেকে ডাটা পড়া যায়, হ্যাশ টেবিল যেকোনো কি (Key) যেমন নাম বা বড় কোনো আইডিকে একটি গাণিতিক হ্যাশ ফাংশন \`h(key) = key % capacity\` দিয়ে সরাসরি অ্যারে ইনডেক্সে রূপান্তর করে। ফলে কোটি কোটি ডাটার মাঝেও যেকোনো উপাদান খুঁজতে গড়পড়তা মাত্র **$O(1)$ কনস্ট্যান্ট সময়** লাগে!

২. **কলিশন (Collision) কেন ঘটে এবং সমাধান কী?**
   পিজিয়নহোল নীতি (Pigeonhole Principle) অনুযায়ী অসীম সংখ্যক সম্ভাব্য কি (Keys)-কে সীমিত সাইজের অ্যারেতে ম্যাপ করলে একাধিক কি একই ইনডেক্সে গিয়ে পড়বেই। একে কলিশন বলে।
   * **সেপারেট চেইনিং (Separate Chaining):** প্রতিটি স্লটে একটি করে লিংকড লিস্ট থাকে। কলিশন হলে নতুন উপাদানটি সেই স্লটের লিস্টে যুক্ত হয়।
   * **ওপেন অ্যাড্রেসিং / লিনিয়ার প্রোবিং (Linear Probing):** কোনো স্লট দখল থাকলে পরের খালি স্লট \`(index + 1) % capacity\` খুঁজে সেখানে বসানো হয়।

৩. **টুম্বস্টোন (Tombstone - DEL) কেন জরুরি?**
   লিনিয়ার প্রোবিংয়ে কোনো উপাদান মুছে ফেললে স্লটটি ফাঁকা (Null) রাখা যায় না। কারণ পরবর্তীতে খোঁজার সময় ফাঁকা স্লট দেখেই অ্যালগরিদম ভাববে ডাটা নেই! তাই সেখানে একটি "কবরফলক" (Tombstone) বসানো হয়, যাতে সার্চিং থেমে না গিয়ে সামনে এগিয়ে যায়।

৪. **লোড ফ্যাক্টর (Load Factor) ও রিহ্যাশিং:**
   টেবিল যখন ৭৫% পূর্ণ হয়ে যায় (Load Factor $\\alpha > 0.75$), তখন কলিশন খুব বেড়ে যায়। তাই টেবিলের সাইজ দ্বিগুণ করে সবগুলো ডাটাকে নতুন টেবিলে নতুন ইনডেক্সে স্থানান্তর (Rehash) করা হয়।
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

---

### Production C++ Implementation

\`\`\`cpp
#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
using namespace std;

// 1. Dynamic TreeNode Structure
struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class BinaryTree {
public:
    TreeNode* root;

    BinaryTree() : root(nullptr) {}

    // 2. Pre-Order Traversal (Root -> Left -> Right) - O(n) Time, O(h) Auxiliary Space
    void preOrder(TreeNode* node, vector<int>& out) {
        if (!node) return;
        out.push_back(node->val);   // 1. Root
        preOrder(node->left, out);  // 2. Left
        preOrder(node->right, out); // 3. Right
    }

    // 3. In-Order Traversal (Left -> Root -> Right) - O(n) Time, O(h) Auxiliary Space
    void inOrder(TreeNode* node, vector<int>& out) {
        if (!node) return;
        inOrder(node->left, out);   // 1. Left
        out.push_back(node->val);   // 2. Root
        inOrder(node->right, out);  // 3. Right
    }

    // 4. Post-Order Traversal (Left -> Right -> Root) - O(n) Time, O(h) Auxiliary Space
    void postOrder(TreeNode* node, vector<int>& out) {
        if (!node) return;
        postOrder(node->left, out);  // 1. Left
        postOrder(node->right, out); // 2. Right
        out.push_back(node->val);    // 3. Root
    }

    // 5. Level-Order Traversal (BFS Queue) - O(n) Time, O(w) Auxiliary Space
    vector<int> levelOrder() {
        vector<int> out;
        if (!root) return out;
        queue<TreeNode*> q;
        q.push(root);
        while (!q.empty()) {
            TreeNode* curr = q.front();
            q.pop();
            out.push_back(curr->val);
            if (curr->left) q.push(curr->left);
            if (curr->right) q.push(curr->right);
        }
        return out;
    }

    // 6. Height / Maximum Depth - O(n) Time
    int maxDepth(TreeNode* node) {
        if (!node) return 0;
        return 1 + max(maxDepth(node->left), maxDepth(node->right));
    }
};
\`\`\`
    `,
    banglaNote: {
      topic: "বাইনারি ট্রি ও ট্রাভার্সাল সহজ বাংলায়",
      englishContext: "Hierarchical branching, tree classifications & DFS/BFS traversals",
      banglaText: `
### বাইনারি ট্রি (Binary Tree) সহজ বাংলায়:

১. **উল্টোমুখী গাছ (Inverted Tree):**
   প্রকৃতির গাছ নিচ থেকে উপরে বাড়ে, কিন্তু কম্পিউটার সায়েন্সে গাছ শুরু হয় আকাশ থেকে! একদম উপরের নোডটিকে বলা হয় **রুট (Root)**। রুট থেকে শাখা-প্রশাখা নিচের দিকে বিস্তৃত হয় এবং প্রতিটি নোডের সর্বোচ্চ **২টি সন্তান (Left ও Right)** থাকতে পারে।

২. **ডেপথ (Depth) বনাম হাইট (Height):**
   * **ডেপথ (গভীরতা):** রুট থেকে নিচের দিকে নামার দূরত্ব। রুটের ডেপথ হলো $0$।
   * **হাইট (উচ্চতা):** কোনো নোড থেকে নিচের পাতার (Leaf) দিকে সবচেয়ে দীর্ঘ পথের দূরত্ব। পাতার হাইট হলো $0$।

৩. **ট্রাভার্সাল (Traversal) মনে রাখার জাদুকরী টেকনিক:**
   * **Pre-order (আগে রুট):** রুট $\\to$ বাম $\\to$ ডান (Root আগে প্রসেস হবে)
   * **In-order (মাঝে রুট):** বাম $\\to$ রুট $\\to$ ডান (BST তে এটি ছোট থেকে বড় সাজানো মান দেয়)
   * **Post-order (শেষে রুট):** বাম $\\to$ ডান $\\to$ রুট (নিচের বাচ্চাদের আগে শেষ করে পরে রুট ডিলিট বা হিসেব করা হয়)
   * **Level-order (ধাপে ধাপে):** কিউ (Queue) দিয়ে ওপর থেকে নিচে প্রতি তলা ধরে ধরে পরিদর্শন।

৪. **কমপ্লিট ট্রি বনাম পারফেক্ট ট্রি:**
   * **পারফেক্ট ট্রি:** সব পাতার গভীরতা এক এবং সব নোডের ২টি করে সন্তান থাকে (ত্রিকোণ পিরামিডের মতো নিরেট)।
   * **কমপ্লিট ট্রি:** শেষ তলা বাদে বাকি সব তলা পূর্ণ থাকে এবং শেষ তলার নোডগুলো কোনো ফাঁকা জায়গা না রেখে বাম ঘেঁষে বসে (বাইনারি হিপের ভিত্তি)।
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
      topic: "লিঙ্কড লিস্ট ও পয়েন্টার কনসেপ্ট",
      englishContext: "Singly Linked List memory architecture & O(1) insertion",
      banglaText: `
### লিঙ্কড লিস্ট (Linked List) সহজ বাংলায়:

১. **মেমোরিতে ছড়িয়ে থাকা ট্রেনের বগি:**
   অ্যারে হলো একই লাইনে পরপর সাজানো বক্সের মতো। কিন্তু লিঙ্কড লিস্টের নোডগুলো মেমোরির যেকোনো জায়গায় ছড়িয়ে থাকতে পারে। প্রতিটি নোডের ভেতর পরবর্তী নোডের মেমোরি অ্যাড্রেস বা **পয়েন্টার (\`next\`)** লেখা থাকে।

২. **শুরুতে উপাদান যোগ করার ম্যাজিক ($O(1)$):**
   অ্যারের শুরুতে একটি সংখ্যা ঢুকাতে গেলে পেছনের সবাইকে ১ ঘর করে ডানে সরাতে হয় ($O(n)$)। কিন্তু লিঙ্কড লিস্টে নতুন নোড বানিয়ে শুধু পয়েন্টারটি বদলে দিলেই কাজ শেষ ($O(1)$)! কোনো সংখ্যা সরাতে হয় না।

৩. **সীমাবদ্ধতা (Tradeoff):**
   অ্যারেতে সরাসরি \`arr[5]\` লিখে এক মুহূর্তে ৫ম সংখ্যায় যাওয়া যায় ($O(1)$)। কিন্তু লিঙ্কড লিস্টে ৫ম সংখ্যায় যেতে হলে মাথা (\`head\`) থেকে শুরু করে ৪ বার পয়েন্টার দিয়ে লাফিয়ে লাফিয়ে এগোতে হয় ($O(n)$)।
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

## 1. C++ Reference Implementation

\`\`\`cpp
int linearSearch(const vector<int>& arr, int target) {
    for (int i = 0; i < (int)arr.size(); i++) {
        if (arr[i] == target) {
            return i; // Early termination: Target located at index i
        }
    }
    return -1; // Exhausted array: Target does not exist in collection
}
\`\`\`

---

## 2. Mathematical Complexity Derivation

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
      topic: "লিনিয়ার সার্চ (Linear Search)",
      englishContext: "Sequential search across unsorted collections",
      banglaText: `
### লিনিয়ার সার্চের মূল কথা:

১. **ধাপে ধাপে খোঁজা:**
   একটি সারির প্রথম থেকে শেষ পর্যন্ত একটি একটি করে চেক করা। যে মুহূর্তে টার্গেট মিলে যায়, তখনই কাজ শেষ।

২. **কখন এটি সেরা?**
   - টার্গেট যদি একদম শুরুতে থাকে, তবে মাত্র ১টি কদমেই উত্তর পাওয়া যায় ($O(1)$ Best Case)।
   - ডাটা যদি সাজানো (Sorted) না থাকে, তবে আগে সাজাতে সময় নষ্ট না করে সরাসরি লিনিয়ার সার্চ চালানোই সবচেয়ে বুদ্ধিমানের কাজ।

৩. **খারাপ দিক:**
   টার্গেট যদি একদম শেষে থাকে বা তালিকায় না-ই থাকে, তবে সবগুলো উপাদান দেখতে হয় ($O(n)$ Worst Case)।
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

## 1. C++ Implementations: Iterative vs Recursive

### Iterative Version — $O(1)$ Auxiliary Space (Production Standard)
\`\`\`cpp
int binarySearchIterative(const vector<int>& arr, int target) {
    int low = 0, high = (int)arr.size() - 1;
    while (low <= high) {
        // Prevents signed 32-bit integer overflow when (low + high) > 2^31 - 1
        int mid = low + (high - low) / 2;

        if (arr[mid] == target) {
            return mid; // Target found
        } else if (arr[mid] < target) {
            low = mid + 1;  // Discard left half
        } else {
            high = mid - 1; // Discard right half
        }
    }
    return -1; // Target not found
}
\`\`\`

### Recursive Version — $O(\\log n)$ Call Stack Space
\`\`\`cpp
int binarySearchRecursive(const vector<int>& arr, int low, int high, int target) {
    if (low > high) return -1; // Base case: search interval empty

    int mid = low + (high - low) / 2;
    if (arr[mid] == target) return mid;
    else if (arr[mid] < target) {
        return binarySearchRecursive(arr, mid + 1, high, target);
    } else {
        return binarySearchRecursive(arr, low, mid - 1, target);
    }
}
\`\`\`

---

## 2. Deriving the $O(\\log n)$ Bound (Connection to Merge Sort)

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
      topic: "বাইনারি সার্চের মূল রহস্য",
      englishContext: "Logarithmic interval reduction on sorted data",
      banglaText: `
### বাইনারি সার্চ (Binary Search) সহজ বাংলায়:

১. **অভিধান বা ডিকশনারির নিয়ম:**
   ডিকশনারিতে কোনো শব্দ খুঁজতে আমরা কিন্তু ১ম পৃষ্ঠা থেকে ১টি ১টি করে পাতা উল্টাই না। আমরা ঠিক মাঝখানে বই খুলি। যদি আমাদের শব্দ পেছনের দিকে থাকে, তবে পুরো প্রথমার্ধ এক নিমেষে বাদ দিয়ে বাকি অর্ধেকের মাঝে খুঁজি।

২. **পূর্বশর্ত (Precondition):**
   ডাটা অবশ্যই **সাজানো (Sorted)** থাকতে হবে! এলোমেলো ডাটার ওপর বাইনারি সার্চ কাজ করে না।

৩. **লগারিদমিক গতির কামাল:**
   ১০ লাখ উপাদানের ভেতর থেকে যেকোনো সংখ্যা খুঁজতে লিনিয়ার সার্চের লাগতে পারে ১০ লাখ কদম। কিন্তু বাইনারি সার্চ মাত্র **২০টি কদমে** সমাধান নিশ্চিত করে!
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
