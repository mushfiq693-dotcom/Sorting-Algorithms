export interface DocsArticle {
  slug: string;
  level: number;
  levelTitle: string;
  order: number;
  title: string;
  subtitle: string;
  estimatedReadTime: string;
  category: "Fundamentals" | "Simple Algorithms" | "Divide and Conquer" | "Advanced Analysis" | "Decision Guide";
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
  }
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
  }
];
