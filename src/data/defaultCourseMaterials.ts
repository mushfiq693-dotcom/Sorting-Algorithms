import { CourseMaterial } from "@/types/courseMaterial";

export const DEFAULT_COURSE_MATERIALS: CourseMaterial[] = [
  // =========================================================================
  // CHAPTER 2: COMPLEXITY ANALYSIS
  // =========================================================================

  // --- Topic: Chapter 2 ---
  {
    id: "cm-topic-ch2",
    title: "Chapter 2: Algorithms, Complexity & Step-Counting Theory",
    book_reference: "Lipschutz & Seymour, Data Structures, Revised 4th Ed., Chapter 2: Design and Analysis of Algorithms",
    topic_tag: "Complexity Analysis",
    content_type: "topic",
    difficulty: "medium",
    assigned_date: null,
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    problem_statement: null,
    explanation_or_solution: `### Chapter 2: Complexity of Algorithms & Step Counting Theory

The complexity of an algorithm $M$ is the function $f(n)$ which gives the running time and/or storage space required by the algorithm in terms of the size $n$ of the input data.

---

### 1. Key Complexity Metrics:
* **Worst-Case Complexity $W(n)$:** The maximum number of basic steps taken on any input of size $n$.
* **Best-Case Complexity $B(n)$:** The minimum number of steps taken on any input of size $n$.
* **Average-Case Complexity $A(n)$:** The expected number of steps assuming a uniform probability distribution over all $n!$ input permutations:
  $$A(n) = \\sum_{I} P(I) \\cdot \\text{Steps}(I)$$

---

### 2. Harmonic Numbers & Logarithmic Behavior:
When tracking frequency of pointer updates (such as finding the maximum element in a random array), the expected number of assignments satisfies the harmonic sum:
$$H_n = 1 + \\frac{1}{2} + \\frac{1}{3} + \\dots + \\frac{1}{n} = \\ln n + \\gamma + O\\left(\\frac{1}{n}\\right)$$
where $\\gamma \\approx 0.5772$ (Euler-Mascheroni constant).

---

### 3. Nested Loop Rules of Step Counting:
* **Linear stepping:** Loops with $i = 0 \\dots n-1$ run $n$ times.
* **Dependent inner loops:** A loop $k = i \\dots n-1$ runs $(n - i)$ times. Summing gives $\\frac{n(n+1)}{2} = O(n^2)$.
* **Logarithmic stepping:** Loops multiplying $j = j \\times b$ terminate in $\\lfloor \\log_b n \\rfloor + 1 = O(\\log n)$ steps.`,
  },

  // --- Problem 2.6 ---
  {
    id: "cm-problem-2-6",
    title: "Problem 2.6: Finding Maximum Element — Update Complexity C(n)",
    book_reference: "Lipschutz & Seymour, Data Structures, Revised 4th Ed., Chapter 2: Algorithms, Complexity (Exercise 2.6)",
    topic_tag: "Complexity Analysis",
    content_type: "problem",
    difficulty: "medium",
    assigned_date: null,
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    problem_statement: `Consider Algorithm 2.3 (using standard 0-based array indexing), which finds the location \`LOC\` and value \`MAX\` of the largest element in an array \`DATA\` of size $n$ (\`DATA[0 ... n-1]\`). Consider the complexity function $C(n)$, which measures the number of times \`LOC\` and \`MAX\` are updated in Step 3. (The total comparisons is $n - 1$, independent of element order.)

**(a)** Describe and find $C(n)$ for the worst case.  
**(b)** Describe and find $C(n)$ for the best case.  
**(c)** Find $C(n)$ for the average case when $n = 3$, assuming all arrangements of the elements in \`DATA\` are equally likely.`,
    explanation_or_solution: `### Overview of Algorithm 2.3 (0-Based Indexing)
Algorithm 2.3 finds the maximum element and its index in an array \`DATA[0 ... n-1]\`:
1. **Initialize:** Set $K := 0$, \`LOC\` $:= 0$, and \`MAX\` $:= \\text{DATA}[0]$.
2. **Loop:** Repeat Steps 3 and 4 while $K < n$:
3. **Compare & Update:** If $\\text{DATA}[K] > \\text{MAX}$, then set \`LOC\` $:= K$ and \`MAX\` $:= \\text{DATA}[K]$.
4. **Increment:** Set $K := K + 1$.
5. **Output:** Output \`LOC\` and \`MAX\`.

---

### (a) Worst-Case Analysis
* **Condition / Description:** Occurs when array elements are in **strictly ascending order**:
  $$\\text{DATA}[0] < \\text{DATA}[1] < \\dots < \\text{DATA}[n-1]$$
* **Trace:** Condition $\\text{DATA}[K] > \\text{MAX}$ is satisfied on every iteration from $K = 1$ to $n - 1$.
* **Calculation:** $$C(n) = n - 1$$

---

### (b) Best-Case Analysis
* **Condition / Description:** Occurs when the **maximum element is at index 0** (e.g. sorted descending).
* **Trace:** $\\text{DATA}[K] > \\text{MAX}$ is never satisfied for any $K \\ge 1$.
* **Calculation:** $$C(n) = 0$$

---

### (c) Average-Case Analysis for $n = 3$
Assuming elements are $\\{1, 2, 3\\}$, all $3! = 6$ permutations:
| Permutation DATA | Initial (K=0) | K=1 Check | K=2 Check | Total Updates C(3) |
| :--- | :--- | :--- | :--- | :---: |
| $(1, 2, 3)$ | MAX=1, LOC=0 | $2 > 1 \\implies$ Update | $3 > 2 \\implies$ Update | **2** |
| $(1, 3, 2)$ | MAX=1, LOC=0 | $3 > 1 \\implies$ Update | $2 < 3 \\implies$ No update | **1** |
| $(2, 1, 3)$ | MAX=2, LOC=0 | $1 < 2 \\implies$ No update | $3 > 2 \\implies$ Update | **1** |
| $(2, 3, 1)$ | MAX=2, LOC=0 | $3 > 2 \\implies$ Update | $1 < 3 \\implies$ No update | **1** |
| $(3, 1, 2)$ | MAX=3, LOC=0 | $1 < 3 \\implies$ No update | $2 < 3 \\implies$ No update | **0** |
| $(3, 2, 1)$ | MAX=3, LOC=0 | $2 < 3 \\implies$ No update | $1 < 3 \\implies$ No update | **0** |

* **Average Case $C(3)$:**
  $$C(3) = \\frac{2 + 1 + 1 + 1 + 0 + 0}{6} = \\frac{5}{6} \\approx 0.833$$

---

### General Harmonic Formula:
$$E[C(n)] = \\sum_{k=2}^{n} \\frac{1}{k} = H_n - 1$$

---

### Complete C++ Implementation for Problem 2.6:
\`\`\`cpp
#include <iostream>
#include <vector>
#include <numeric>
#include <algorithm>

// Algorithm 2.3: Finding Maximum Element and counting updates C(n)
struct MaxResult {
    int loc;
    int maxVal;
    int updateCount;
};

MaxResult findMaxWithCount(const std::vector<int>& data) {
    if (data.empty()) return {-1, -1, 0};

    int maxVal = data[0];
    int loc = 0;
    int updateCount = 0;

    for (int k = 1; k < static_cast<int>(data.size()); ++k) {
        if (data[k] > maxVal) {
            maxVal = data[k];
            loc = k;
            updateCount++; // Step 3 update
        }
    }
    return {loc, maxVal, updateCount};
}

int main() {
    // 1. Test Worst Case: Strictly ascending array
    std::vector<int> worstArr = {10, 20, 30, 40, 50}; // n = 5
    MaxResult worstRes = findMaxWithCount(worstArr);
    std::cout << "[Worst Case] Updates: " << worstRes.updateCount 
              << " (Expected n-1 = " << (worstArr.size() - 1) << ")\n";

    // 2. Test Best Case: Max element at index 0
    std::vector<int> bestArr = {50, 40, 30, 20, 10}; // n = 5
    MaxResult bestRes = findMaxWithCount(bestArr);
    std::cout << "[Best Case]  Updates: " << bestRes.updateCount 
              << " (Expected 0)\n";

    // 3. Test Average Case for n = 3: All 3! = 6 permutations
    std::vector<int> perm = {1, 2, 3};
    int totalUpdates = 0;
    int totalPerms = 0;

    std::cout << "\n[Average Case Permutations for n = 3]:\n";
    do {
        MaxResult res = findMaxWithCount(perm);
        std::cout << "  Permutation (" << perm[0] << ", " << perm[1] << ", " << perm[2] 
                  << ") -> Updates = " << res.updateCount << "\n";
        totalUpdates += res.updateCount;
        totalPerms++;
    } while (std::next_permutation(perm.begin(), perm.end()));

    double avgUpdates = static_cast<double>(totalUpdates) / totalPerms;
    std::cout << "Average Updates E[C(3)] = " << totalUpdates << "/" << totalPerms 
              << " = " << avgUpdates << " (Exact 5/6 = " << 5.0 / 6.0 << ")\n";

    return 0;
}
\`\`\``,
  },

  // --- Problem 2.7 ---
  {
    id: "cm-problem-2-7",
    title: "Problem 2.7: Nested Loops & Logarithmic Stepping — Complexity C(n)",
    book_reference: "Lipschutz & Seymour, Data Structures, Revised 4th Ed., Chapter 2: Algorithms, Complexity (Exercise 2.7)",
    topic_tag: "Complexity Analysis",
    content_type: "problem",
    difficulty: "medium",
    assigned_date: null,
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    problem_statement: `Suppose Module A requires $M$ units of time to be executed, where $M$ is a constant. Find the complexity $C(n)$ of each algorithm, where $n$ is the size of the input data and $b$ is a positive integer greater than 1.

**(a) Algorithm P2.7A (0-Based Loop Indices):**
\`\`\`text
1. Repeat for I = 0 to N - 1:
2.   Repeat for J = 0 to N - 1:
3.     Repeat for K = I to N - 1:
4.       Module A.
       [End of Step 3 loop.]
     [End of Step 2 loop.]
   [End of Step 1 loop.]
5. Exit.
\`\`\`

**(b) Algorithm P2.7B:**
\`\`\`text
1. Set J := 1.
2. Repeat Steps 3 and 4 while J <= N:
3.   Module A.
4.   Set J := B * J.
   [End of Step 2 loop.]
5. Exit.
\`\`\``,
    explanation_or_solution: `### (a) Algorithm P2.7A Cubic Complexity Proof
* For each $I \\in \\{0, \\dots, N-1\\}$, $J$ runs $N$ times, and $K$ runs $(N - I)$ times:
  $$\\text{Total Executions} = \\sum_{I=0}^{N-1} N(N - I) = N \\sum_{I=0}^{N-1} (N - I) = N \\cdot \\frac{N(N+1)}{2} = \\frac{N^3 + N^2}{2}$$
* **Time Complexity:** $$C(n) = \\frac{M}{2}(n^3 + n^2) = O(n^3)$$

---

### (b) Algorithm P2.7B Logarithmic Stepping Proof
* Values taken by $J$: $1, B, B^2, \\dots, B^{k-1} \\le N < B^k$.
* Solving gives $k = \\lfloor \\log_B N \\rfloor + 1$.
* **Time Complexity:** $$C(n) = M(\\lfloor \\log_b n \\rfloor + 1) = O(\\log n)$$

---

### Complete C++ Implementation for Problem 2.7:
\`\`\`cpp
#include <iostream>
#include <cmath>

// Algorithm P2.7A: 3-Loop Nested Cubic Complexity
long long runAlgorithmP27A(int N, long long& theoreticalCount) {
    long long count = 0;
    for (int I = 0; I < N; ++I) {
        for (int J = 0; J < N; ++J) {
            for (int K = I; K < N; ++K) {
                count++; // Module A execution
            }
        }
    }
    // Theoretical formula: (N^3 + N^2) / 2
    theoreticalCount = (1LL * N * N * (N + 1)) / 2;
    return count;
}

// Algorithm P2.7B: Geometric Progression Logarithmic Stepping
long long runAlgorithmP27B(int N, int B, long long& theoreticalCount) {
    long long count = 0;
    long long J = 1;
    while (J <= N) {
        count++; // Module A execution
        J = B * J;
    }
    // Theoretical formula: floor(log_B(N)) + 1
    theoreticalCount = static_cast<long long>(std::floor(std::log(N) / std::log(B))) + 1;
    return count;
}

int main() {
    int N = 10;
    int B = 2;
    long long theoreticalA = 0, theoreticalB = 0;

    // Test Algorithm P2.7A
    long long actualA = runAlgorithmP27A(N, theoreticalA);
    std::cout << "[Algorithm P2.7A for N = " << N << "]:\n"
              << "  Actual Module A Executions     = " << actualA << "\n"
              << "  Theoretical ((N^3 + N^2) / 2)  = " << theoreticalA << "\n"
              << "  Matches Formula: " << (actualA == theoreticalA ? "YES (O(N^3))" : "NO") << "\n\n";

    // Test Algorithm P2.7B
    long long actualB = runAlgorithmP27B(N, B, theoreticalB);
    std::cout << "[Algorithm P2.7B for N = " << N << ", B = " << B << "]:\n"
              << "  Actual Module A Executions     = " << actualB << "\n"
              << "  Theoretical (floor(log_B N)+1) = " << theoreticalB << "\n"
              << "  Matches Formula: " << (actualB == theoreticalB ? "YES (O(log N))" : "NO") << "\n";

    return 0;
}
\`\`\``,
  },

  // =========================================================================
  // CHAPTER 3: STRING PROCESSING
  // =========================================================================

  // --- Topic: Section 3.5 ---
  {
    id: "cm-topic-3-5",
    title: "Section 3.5: Fundamental String Primitives (Substring, Indexing, Concat, Length)",
    book_reference: "Lipschutz & Seymour, Data Structures, Revised 4th Ed., Chapter 3: String Processing (Section 3.5)",
    topic_tag: "String Processing",
    content_type: "topic",
    difficulty: "easy",
    assigned_date: null,
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    problem_statement: null,
    explanation_or_solution: `### Section 3.5: String Primitives Overview

Unlike numerical arrays where individual elements $\\text{DATA}[K]$ are accessed, strings operate on groups of consecutive characters called **substrings**.

---

### 1. Substrings: \`SUBSTRING(S, K, L)\`
* $S$: source string, $K$: 0-based starting index, $L$: length of substring.
* Example: \`SUBSTRING('TO BE OR NOT TO BE', 3, 7)\` = \`'BE OR N'\`.

---

### 2. Indexing (Pattern Matching): \`INDEX(T, P)\`
* Returns the 0-based starting index of pattern $P$ inside text $T$, or \`-1\` if absent.
* Example with $T = \\text{'HIS FATHER IS THE PROFESSOR'}$:
  * \`INDEX(T, 'FATHER')\` = 4
  * \`INDEX(T, 'THE')\` = 6
  * \`INDEX(T, ' THE ')\` = 13
  * \`INDEX(T, 'THEN')\` = -1

---

### 3. Concatenation & Length:
* $S_1 // S_2$: Concatenates $S_1$ and $S_2$.
* \`LENGTH(S)\`: Returns character count. \`LENGTH('') = 0\`.`,
  },

  // --- Problem 3.5 ---
  {
    id: "cm-problem-3-5",
    title: "Problem 3.5: Fundamental String Operations & Evaluations (Section 3.5)",
    book_reference: "Lipschutz & Seymour, Data Structures, Revised 4th Ed., Chapter 3: String Processing (Section 3.5)",
    topic_tag: "String Processing",
    content_type: "problem",
    difficulty: "easy",
    assigned_date: null,
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    problem_statement: `Consider the fundamental string operations \`SUBSTRING\`, \`INDEX\`, \`CONCAT\` ($//$), and \`LENGTH\`. Evaluate each of the following expressions using standard 0-based indexing:

**(a) Substring Operations:**  
(i) \`SUBSTRING('TO BE OR NOT TO BE', 3, 7)\`  
(ii) \`SUBSTRING('THE END', 3, 4)\`  

**(b) Indexing (Pattern Matching):** Let text $T = \\text{'HIS FATHER IS THE PROFESSOR'}$. Evaluate:  
(i) \`INDEX(T, 'FATHER')\`  
(ii) \`INDEX(T, 'THE')\`  
(iii) \`INDEX(T, ' THE ')\`  
(iv) \`INDEX(T, 'THEN')\`  

**(c) Concatenation & Length:** Let $S_1 = \\text{'MARK'}$ and $S_2 = \\text{'TWAIN'}$. Evaluate:  
(i) $S_1 // S_2$  
(ii) $S_1 // \\text{' '} // S_2$  
(iii) \`LENGTH('COMPUTER')\` and \`LENGTH('')\``,
    explanation_or_solution: `### (a) Substring Solutions:
1. \`SUBSTRING('TO BE OR NOT TO BE', 3, 7)\` = **\`'BE OR N'\`** (starts at index 3: $'B'$).
2. \`SUBSTRING('THE END', 3, 4)\` = **\`' END'\`** (starts at index 3: space $' '$).

---

### (b) Indexing Solutions ($T = \\text{'HIS FATHER IS THE PROFESSOR'}$):
1. \`INDEX(T, 'FATHER')\` = **4**
2. \`INDEX(T, 'THE')\` = **6** (inside $'FA\\mathbf{THE}R'$)
3. \`INDEX(T, ' THE ')\` = **13** (standalone word)
4. \`INDEX(T, 'THEN')\` = **-1** (not present)

---

### (c) Concatenation & Length Solutions:
1. $S_1 // S_2$ = **\`'MARKTWAIN'\`**
2. $S_1 // \\text{' '} // S_2$ = **\`'MARK TWAIN'\`**
3. \`LENGTH('COMPUTER')\` = **8**, \`LENGTH('')\` = **0**.

---

### Complete C++ Implementation for Problem 3.5:
\`\`\`cpp
#include <iostream>
#include <string>

// 1. Primitive Substring: SUBSTRING(S, K, L)
std::string Substring(const std::string& S, int K, int L) {
    if (K < 0 || K >= static_cast<int>(S.length()) || L <= 0) return "";
    return S.substr(K, L);
}

// 2. Primitive Indexing: INDEX(T, P) returning 0-based index or -1
int Index(const std::string& T, const std::string& P) {
    if (P.empty()) return 0;
    size_t pos = T.find(P);
    return (pos == std::string::npos) ? -1 : static_cast<int>(pos);
}

// 3. Length & Trim
int Length(const std::string& S) {
    return static_cast<int>(S.length());
}

std::string Trim(const std::string& S) {
    size_t end = S.find_last_not_of(" \t\n\r");
    return (end == std::string::npos) ? "" : S.substr(0, end + 1);
}

int main() {
    std::cout << "=== Problem 3.5 C++ Verification ===\n\n";

    // (a) Substring Operations
    std::string textA = "TO BE OR NOT TO BE";
    std::string textEnd = "THE END";
    std::cout << "(a)(i)  SUBSTRING('TO BE OR NOT TO BE', 3, 7) = '" 
              << Substring(textA, 3, 7) << "'\n";
    std::cout << "(a)(ii) SUBSTRING('THE END', 3, 4)           = '" 
              << Substring(textEnd, 3, 4) << "'\n\n";

    // (b) Indexing (Pattern Matching)
    std::string T = "HIS FATHER IS THE PROFESSOR";
    std::cout << "(b)(i)   INDEX(T, 'FATHER') = " << Index(T, "FATHER") << "\n";
    std::cout << "(b)(ii)  INDEX(T, 'THE')    = " << Index(T, "THE") << "\n";
    std::cout << "(b)(iii) INDEX(T, ' THE ')  = " << Index(T, " THE ") << "\n";
    std::cout << "(b)(iv)  INDEX(T, 'THEN')   = " << Index(T, "THEN") << "\n\n";

    // (c) Concatenation & Length
    std::string S1 = "MARK";
    std::string S2 = "TWAIN";
    std::cout << "(c)(i)   S1 // S2        = '" << (S1 + S2) << "'\n";
    std::cout << "(c)(ii)  S1 // ' ' // S2 = '" << (S1 + " " + S2) << "'\n";
    std::cout << "(c)(iii) LENGTH('COMPUTER') = " << Length("COMPUTER") << "\n";
    std::cout << "        LENGTH('')         = " << Length("") << "\n";
    std::cout << "        TRIM('ERIK   ')    = '" << Trim("ERIK   ") << "'\n";

    return 0;
}
\`\`\``,
  },

  // --- Topic: Section 3.6 ---
  {
    id: "cm-topic-3-6",
    title: "Section 3.6: Word Processing, Composite Operations & Cascading Collapse",
    book_reference: "Lipschutz & Seymour, Data Structures, Revised 4th Ed., Chapter 3: String Processing (Section 3.6)",
    topic_tag: "String Processing",
    content_type: "topic",
    difficulty: "medium",
    assigned_date: null,
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    problem_statement: null,
    explanation_or_solution: `### Section 3.6: Word Processing & Composite Operations

Word processing systems implement composite string manipulation operations using primitive building blocks.

---

### 1. Primitive Decompositions (0-Based):
* **Insertion:**
  $$\\text{INSERT}(T, K, S) = \\text{SUBSTRING}(T, 0, K) // S // \\text{SUBSTRING}(T, K, \\text{LENGTH}(T) - K)$$
* **Deletion:**
  $$\\text{DELETE}(T, K, L) = \\text{SUBSTRING}(T, 0, K) // \\text{SUBSTRING}(T, K + L, \\text{LENGTH}(T) - K - L)$$
* **Replacement:** \`REPLACE(T, P1, P2)\` locates $K = \\text{INDEX}(T, P_1)$, calls \`DELETE(T, K, LENGTH(P1))\`, and \`INSERT(T, K, P2)\`.

---

### 2. The Cascading Collapse Phenomenon:
When deleting all occurrences of a pattern $P$ iteratively (Algorithm 3.1), deleting an inner match causes outer characters to collide. This can form **new occurrences of $P$**, causing the loop to run more times than the initial count of $P$!`,
  },

  // --- Problem 3.6 ---
  {
    id: "cm-problem-3-6",
    title: "Problem 3.6: Word Processing Operations — Insertion, Deletion & Replacement",
    book_reference: "Lipschutz & Seymour, Data Structures, Revised 4th Ed., Chapter 3: String Processing (Section 3.6)",
    topic_tag: "String Processing",
    content_type: "problem",
    difficulty: "medium",
    assigned_date: null,
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    problem_statement: `Word processing composite operations (\`INSERT\`, \`DELETE\`, \`REPLACE\`) are implemented using primitive string operations (\`SUBSTRING\`, \`INDEX\`, \`CONCAT\`).

**(a) Primitive Decompositions:** Write the mathematical formulas for \`INSERT(T, K, S)\` and \`DELETE(T, K, L)\` in terms of \`SUBSTRING\` and Concatenation ($//$) for 0-based indexing.  
**(b) Insertion Evaluations:**  
(i) \`INSERT('ABCDEFG', 2, 'XYZ')\`  
(ii) \`INSERT('ABCDEFG', 5, 'XYZ')\`  
**(c) Deletion Evaluations:**  
(i) \`DELETE('ABCDEFG', 3, 2)\`  
(ii) \`DELETE('ABCDEFG', 1, 4)\`  
(iii) \`DELETE('ABCDEFG', -1, 2)\` (Zero case)  
**(d) Replacement Execution:**  
(i) State the 3-step sequence to execute \`REPLACE(T, P1, P2)\` using \`INDEX\`, \`DELETE\`, and \`INSERT\`.  
(ii) Evaluate \`REPLACE('XABYABZ', 'AB', 'C')\` and \`REPLACE('XABYABZ', 'BA', 'C')\`.`,
    explanation_or_solution: `### (a) Primitive Decomposition Formulas (0-Based Indexing)
1. **Insertion:**
   $$\\text{INSERT}(T, K, S) = \\text{SUBSTRING}(T, 0, K) // S // \\text{SUBSTRING}(T, K, \\text{LENGTH}(T) - K)$$
2. **Deletion:**
   $$\\text{DELETE}(T, K, L) = \\text{SUBSTRING}(T, 0, K) // \\text{SUBSTRING}(T, K + L, \\text{LENGTH}(T) - K - L)$$

---

### (b) Insertion Evaluations:
1. \`INSERT('ABCDEFG', 2, 'XYZ')\` = **\`'ABXYZCDEFG'\`**
2. \`INSERT('ABCDEFG', 5, 'XYZ')\` = **\`'ABCDEXYZFG'\`**

---

### (c) Deletion Evaluations:
1. \`DELETE('ABCDEFG', 3, 2)\` = **\`'ABCFG'\`** (removes $'DE'$)
2. \`DELETE('ABCDEFG', 1, 4)\` = **\`'AFG'\`** (removes $'BCDE'$)
3. \`DELETE('ABCDEFG', -1, 2)\` = **\`'ABCDEFG'\`** (Zero Case)

---

### (d) Replacement Evaluations:
1. \`REPLACE('XABYABZ', 'AB', 'C')\` = **\`'XCYABZ'\`**
2. \`REPLACE('XABYABZ', 'BA', 'C')\` = **\`'XABYABZ'\`** (no $'BA'$ present).

---

### Complete C++ Implementation for Problem 3.6:
\`\`\`cpp
#include <iostream>
#include <string>

// Primitive Helpers
int Index(const std::string& T, const std::string& P) {
    size_t pos = T.find(P);
    return (pos == std::string::npos) ? -1 : static_cast<int>(pos);
}

// 1. Primitive Decomposition for INSERT(T, K, S)
std::string customInsert(const std::string& T, int K, const std::string& S) {
    if (K < 0) K = 0;
    if (K > static_cast<int>(T.length())) K = static_cast<int>(T.length());
    
    std::string prefix = T.substr(0, K);
    std::string suffix = T.substr(K);
    return prefix + S + suffix;
}

// 2. Primitive Decomposition for DELETE(T, K, L) with Zero Case check
std::string customDelete(const std::string& T, int K, int L) {
    // Zero Case: If K == -1 or out of bounds, return T unchanged
    if (K < 0 || K >= static_cast<int>(T.length()) || L <= 0) {
        return T;
    }
    std::string prefix = T.substr(0, K);
    std::string suffix = (K + L < static_cast<int>(T.length())) ? T.substr(K + L) : "";
    return prefix + suffix;
}

// 3. Composite REPLACE(T, P1, P2) using Index, Delete, and Insert
std::string customReplace(std::string T, const std::string& P1, const std::string& P2) {
    int K = Index(T, P1);
    if (K != -1) {
        T = customDelete(T, K, static_cast<int>(P1.length()));
        T = customInsert(T, K, P2);
    }
    return T;
}

int main() {
    std::cout << "=== Problem 3.6 C++ Verification ===\n\n";

    // (b) Insertion Evaluations
    std::string base = "ABCDEFG";
    std::cout << "(b)(i)  INSERT('ABCDEFG', 2, 'XYZ') = '" 
              << customInsert(base, 2, "XYZ") << "'\n";
    std::cout << "(b)(ii) INSERT('ABCDEFG', 5, 'XYZ') = '" 
              << customInsert(base, 5, "XYZ") << "'\n\n";

    // (c) Deletion Evaluations
    std::cout << "(c)(i)   DELETE('ABCDEFG', 3, 2)  = '" 
              << customDelete(base, 3, 2) << "'\n";
    std::cout << "(c)(ii)  DELETE('ABCDEFG', 1, 4)  = '" 
              << customDelete(base, 1, 4) << "'\n";
    std::cout << "(c)(iii) DELETE('ABCDEFG', -1, 2) = '" 
              << customDelete(base, -1, 2) << "' (Zero Case)\n\n";

    // (d) Replacement Evaluations
    std::string textRep = "XABYABZ";
    std::cout << "(d)(i)  REPLACE('XABYABZ', 'AB', 'C') = '" 
              << customReplace(textRep, "AB", "C") << "'\n";
    std::cout << "(d)(ii) REPLACE('XABYABZ', 'BA', 'C') = '" 
              << customReplace(textRep, "BA", "C") << "'\n";

    return 0;
}
\`\`\``,
  },

  // --- Problem 3.1 (Algorithm 3.1) ---
  {
    id: "cm-problem-3-1",
    title: "Problem 3.1 (Algorithm 3.1): Delete Every Occurrence of Pattern P in Text T",
    book_reference: "Lipschutz & Seymour, Data Structures, Revised 4th Ed., Chapter 3: String Processing (Algorithm 3.1)",
    topic_tag: "String Processing",
    content_type: "problem",
    difficulty: "medium",
    assigned_date: null,
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    problem_statement: `Let $T$ be a text stored in memory and let $P$ be a pattern string. Design and analyze an algorithm using primitive string operations (\`INDEX\`, \`DELETE\`, \`LENGTH\`) that deletes every occurrence of pattern $P$ from text $T$.

**(a)** Write the formal step-by-step algorithm using standard 0-based indexing.  
**(b)** Trace the execution of the algorithm for $T = \\text{'XABYABZ'}$ and $P = \\text{'AB'}$.  
**(c)** Trace the algorithm for $T = \\text{'XAABBBY'}$ and $P = \\text{'AB'}$. Explain why the loop executes **3 times** even though pattern $P$ appears only once in the initial text $T$ (**Cascading Collapse**).`,
    explanation_or_solution: `### (a) Algorithm 3.1 Pseudocode (0-Based Standard)
\`\`\`text
Algorithm 3.1: Delete Every Occurrence of P in T
1. [Find initial index.] Set K := INDEX(T, P).
2. Repeat while K != -1:
   (a) [Delete P.] Set T := DELETE(T, K, LENGTH(P)).
   (b) [Update index.] Set K := INDEX(T, P).
   [End of loop.]
3. Write: T.
4. Exit.
\`\`\`

---

### (b) Trace for $T = \\text{'XABYABZ'}, P = \\text{'AB'}$:
* Step 1: $K = 1 \\implies T = \\text{'XYABZ'}$
* Step 2: $K = 2 \\implies T = \\text{'XYZ'}$
* Result: **\`'XYZ'\`** (2 iterations).

---

### (c) Cascading Collapse Trace ($T = \\text{'XAABBBY'}, P = \\text{'AB'}$):
* Iteration 1: Deleting initial $'AB'$ at index 2 $\\implies T = \\text{'XAABBY'}$. New $'AB'$ formed at index 1!
* Iteration 2: Deleting newly formed $'AB'$ $\\implies T = \\text{'XABY'}$. Another $'AB'$ formed!
* Iteration 3: Deleting third $'AB'$ $\\implies T = \\text{'XY'}$.
* Result: **\`'XY'\`** (3 iterations).

---

### Complete C++ Implementation for Problem 3.1 (Algorithm 3.1):
\`\`\`cpp
#include <iostream>
#include <string>

// Custom Primitive Delete for Algorithm 3.1
std::string customDelete(const std::string& T, int K, int L) {
    if (K < 0 || K >= static_cast<int>(T.length()) || L <= 0) return T;
    return T.substr(0, K) + T.substr(K + L);
}

// Algorithm 3.1: Delete Every Occurrence of P in Text T with Step Logging
std::string deleteAllOccurrences(std::string T, const std::string& P) {
    if (P.empty()) return T;

    int K = static_cast<int>(T.find(P));
    int iteration = 0;

    std::cout << "Starting Algorithm 3.1 with T = '" << T << "', P = '" << P << "'\n";

    while (K != -1) {
        iteration++;
        T = customDelete(T, K, static_cast<int>(P.length()));
        std::cout << "  Iteration " << iteration << ": Deleted '" << P 
                  << "' at index " << K << " -> Current T = '" << T << "'\n";
        
        size_t nextPos = T.find(P);
        K = (nextPos == std::string::npos) ? -1 : static_cast<int>(nextPos);
    }

    std::cout << "  Finished: Total Iterations = " << iteration 
              << ", Final Result = '" << T << "'\n\n";
    return T;
}

int main() {
    // (b) Trace Example 3.7(a)
    std::cout << "=== Test 1: Example 3.7(a) ===\n";
    deleteAllOccurrences("XABYABZ", "AB");

    // (c) Cascading Collapse Example 3.7(b)
    std::cout << "=== Test 2: Example 3.7(b) (Cascading Collapse) ===\n";
    deleteAllOccurrences("XAABBBY", "AB");

    return 0;
}
\`\`\``,
  },

  // --- Problem 3.2 (Algorithm 3.2) ---
  {
    id: "cm-problem-3-2",
    title: "Problem 3.2 (Algorithm 3.2): Replace Every Occurrence of Pattern P by Q",
    book_reference: "Lipschutz & Seymour, Data Structures, Revised 4th Ed., Chapter 3: String Processing (Algorithm 3.2)",
    topic_tag: "String Processing",
    content_type: "problem",
    difficulty: "medium",
    assigned_date: null,
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    problem_statement: `A text $T$ and patterns $P$ and $Q$ are in memory. Design an algorithm that replaces every occurrence of pattern $P$ in text $T$ by pattern $Q$.

**(a)** Write the formal step-by-step algorithm using primitive operations (\`INDEX\`, \`REPLACE\`).  
**(b)** Trace the algorithm for $T = \\text{'XABYABZ'}, P = \\text{'AB'}, Q = \\text{'C'}$.  
**(c)** Write a working C++ implementation for global pattern replacement.`,
    explanation_or_solution: `### (a) Algorithm 3.2 Pseudocode (0-Based Standard)
\`\`\`text
Algorithm 3.2: Replace Every Occurrence of P by Q
1. [Find index of P.] Set K := INDEX(T, P).
2. Repeat while K != -1:
   (a) [Replace P by Q.] Set T := REPLACE(T, P, Q).
   (b) [Update index.] Set K := INDEX(T, P).
   [End of loop.]
3. Write: T.
4. Exit.
\`\`\`

---

### (b) Trace for $T = \\text{'XABYABZ'}, P = \\text{'AB'}, Q = \\text{'C'}$:
* Iteration 1: $K = 1 \\implies T = \\text{'XCYABZ'}, K = 4$.
* Iteration 2: $K = 4 \\implies T = \\text{'XCYCZ'}, K = -1$.
* Result: **\`'XCYCZ'\`**.

---

### Complete C++ Implementation for Problem 3.2 (Algorithm 3.2):
\`\`\`cpp
#include <iostream>
#include <string>

// Primitive Replace
std::string customReplace(std::string T, int K, int lenP, const std::string& Q) {
    return T.substr(0, K) + Q + T.substr(K + lenP);
}

// Algorithm 3.2: Replace Every Occurrence of P by Q in T
std::string replaceAllOccurrences(std::string T, const std::string& P, const std::string& Q) {
    if (P.empty()) return T;

    size_t pos = T.find(P);
    int K = (pos == std::string::npos) ? -1 : static_cast<int>(pos);
    int iteration = 0;

    std::cout << "Starting Algorithm 3.2 with T = '" << T << "', P = '" << P 
              << "', Q = '" << Q << "'\n";

    while (K != -1) {
        iteration++;
        T = customReplace(T, K, static_cast<int>(P.length()), Q);
        std::cout << "  Iteration " << iteration << ": Replaced at index " << K 
                  << " -> Current T = '" << T << "'\n";
        
        // Find next occurrence (advance after replacement if needed)
        size_t nextPos = T.find(P, K + Q.length());
        K = (nextPos == std::string::npos) ? -1 : static_cast<int>(nextPos);
    }

    std::cout << "  Finished: Total Iterations = " << iteration 
              << ", Final Result = '" << T << "'\n\n";
    return T;
}

int main() {
    std::cout << "=== Algorithm 3.2 Global Replace Demo ===\n";
    std::string text = "XABYABZ";
    std::string result = replaceAllOccurrences(text, "AB", "C");
    std::cout << "Final Replaced String: '" << result << "' (Expected 'XCYCZ')\n";

    return 0;
}
\`\`\``,
  },

  // =========================================================================
  // CHAPTER 4: LINEAR ARRAYS
  // =========================================================================

  // --- Topic 4.4: Traversing Linear Arrays ---
  {
    id: "cm-topic-4-4",
    title: "Section 4.4: Traversing Linear Arrays & Visiting Operations",
    book_reference: "Lipschutz & Seymour, Data Structures, Revised 4th Ed., Chapter 4: Linear Arrays (Section 4.4)",
    topic_tag: "Linear Arrays",
    content_type: "topic",
    difficulty: "easy",
    assigned_date: null,
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    problem_statement: null,
    explanation_or_solution: `### Section 4.4: Traversing Linear Arrays

A **Linear Array** (denoted $LA$) is a list of a finite number $n$ of homogeneous data elements stored in contiguous computer memory cells, such that:
1. The elements of the array are referenced respectively by an index set consisting of $n$ consecutive integers.
2. The elements of the array are stored respectively in successive memory cells.

---

### 1. The Traversal Concept
Let $A$ be a collection of data elements stored in the memory of the computer. Suppose we want to:
* Print the contents of each element of $A$, or
* Count the number of elements of $A$ with a given property, or
* Update each element of $A$ by applying a mathematical function.

This operation is accomplished by **traversing** $A$ — that is, by accessing and processing (frequently called **visiting**) each element of $A$ **exactly once**.

---

### 2. Linear vs Non-Linear Traversal Mechanics
* **Linear Structures:** The simplicity of array traversal stems from the fact that a linear array has an inherent sequential ordering in computer hardware memory. Consecutive elements reside at addresses separated by a fixed stride $w$ (word size):
  $$\\text{LOC}(LA[K]) = \\text{Base}(LA) + w \\cdot (K - \\text{LB})$$
  Because adjacent logical elements map to adjacent physical memory words, linear structures (linear arrays and linked lists) can be traversed sequentially with trivial loop counters or pointer chasing.
* **Non-Linear Structures:** On the other hand, the traversal of non-linear structures (such as trees and graphs) is considerably more complicated, requiring auxiliary stack or queue structures (e.g. DFS, BFS) or recursion to manage backtracking.

---

### 3. Array Bounds & Length Formula
* **Lower Bound ($LB$):** The index of the first element in the array.
* **Upper Bound ($UB$):** The index of the last element in the array.
* **Length / Size ($N$):**
  $$N = \\text{Length} = UB - LB + 1$$

---

### 4. C++ Implementation — Generic Linear Array Traversal
\`\`\`cpp
#include <iostream>
#include <vector>
#include <functional>

// Generic Traversal passing a visitor function (PROCESS)
template <typename T>
void TraverseArray(const std::vector<T>& LA, int LB, int UB, std::function<void(int, const T&)> process) {
    for (int K = LB; K <= UB; ++K) {
        process(K, LA[K]); // Visit element LA[K]
    }
}

int main() {
    std::vector<int> scores = {85, 92, 78, 64, 99, 88};
    int LB = 0;
    int UB = scores.size() - 1;

    std::cout << "--- Linear Array Traversal Demonstration ---\\n";
    TraverseArray<int>(scores, LB, UB, [](int index, const int& val) {
        std::cout << "Element at index [" << index << "] = " << val << "\\n";
    });

    return 0;
}
\`\`\``,
  },

  // --- Algorithm 4.1: Traversing a Linear Array ---
  {
    id: "cm-algo-4-1",
    title: "Algorithm 4.1 & 4.1': Traversing a Linear Array",
    book_reference: "Lipschutz & Seymour, Data Structures, Revised 4th Ed., Chapter 4: Linear Arrays (Algorithm 4.1)",
    topic_tag: "Linear Arrays",
    content_type: "algorithm",
    difficulty: "easy",
    assigned_date: null,
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    problem_statement: null,
    explanation_or_solution: `### Algorithm 4.1: Traversing a Linear Array

Here $LA$ is a linear array with lower bound $LB$ and upper bound $UB$. This algorithm traverses $LA$ applying an operation \`PROCESS\` to each element of $LA$.

---

### Formal Specification (While-Loop Formulation)
\`\`\`text
Algorithm 4.1: (Traversing a Linear Array)
1. [Initialize counter.] Set K := LB.
2. Repeat Steps 3 and 4 while K <= UB:
3.   [Visit element.] Apply PROCESS to LA[K].
4.   [Increase counter.] Set K := K + 1.
   [End of Step 2 loop.]
5. Exit.
\`\`\`

---

### Alternative Specification (Repeat-For Formulation)
\`\`\`text
Algorithm 4.1': (Traversing a Linear Array Using Repeat-For Loop)
1. Repeat for K = LB to UB:
     Apply PROCESS to LA[K].
   [End of loop.]
2. Exit.
\`\`\`

---

### Critical Cautionary Principle (Initialization)
> **Caution:** The operation \`PROCESS\` in the traversal algorithm may use certain variables which **must be initialized before \`PROCESS\` is applied to any of the elements in the array**. Accordingly, the traversal algorithm may need to be preceded by such an initialization step (e.g., setting a counter \`NUM := 0\` or an accumulator \`SUM := 0\`).

---

### Mathematical Complexity Analysis
* **Time Complexity:** The loop runs from $K = LB$ up to $K = UB$. The number of basic operations is exactly:
  $$T(N) = UB - LB + 1 = N = O(N)$$
  If the \`PROCESS\` subroutine takes $O(1)$ time, the entire traversal runs in strictly linear $O(N)$ time.
* **Space Complexity:** Traversal operates in-place using a single counter variable $K$. Auxiliary memory is $S(N) = O(1)$.

---

### Working C++ Verification
\`\`\`cpp
#include <iostream>
#include <vector>

void Algorithm4_1_While(const std::vector<int>& LA, int LB, int UB) {
    std::cout << "[Algorithm 4.1 (While-Loop)]: \\n";
    int K = LB; // Step 1: Initialize counter
    while (K <= UB) { // Step 2: Repeat Steps 3 & 4 while K <= UB
        std::cout << "  Visiting LA[" << K << "] = " << LA[K] << "\\n"; // Step 3
        K = K + 1; // Step 4: Increase counter
    }
    std::cout << "  Exit.\\n"; // Step 5
}

void Algorithm4_1_For(const std::vector<int>& LA, int LB, int UB) {
    std::cout << "[Algorithm 4.1' (Repeat-For)]: \\n";
    for (int K = LB; K <= UB; ++K) { // Step 1: Repeat for K = LB to UB
        std::cout << "  Visiting LA[" << K << "] = " << LA[K] << "\\n";
    }
    std::cout << "  Exit.\\n"; // Step 2
}

int main() {
    std::vector<int> LA = {10, 20, 30, 40, 50};
    Algorithm4_1_While(LA, 0, 4);
    Algorithm4_1_For(LA, 0, 4);
    return 0;
}
\`\`\``,
  },

  // --- Problem 4.4: Automobile Sales Analysis ---
  {
    id: "cm-problem-4-4",
    title: "Example 4.4: Automobile Sales Analysis via Array Traversal",
    book_reference: "Lipschutz & Seymour, Data Structures, Revised 4th Ed., Chapter 4: Linear Arrays (Example 4.4)",
    topic_tag: "Linear Arrays",
    content_type: "problem",
    difficulty: "easy",
    assigned_date: null,
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    problem_statement: `Consider the array \`AUTO\` in Example 4.1(b), which records the number of automobiles sold each year from 1932 through 1984. Each of the following modules, which carry out the given operation, involves traversing \`AUTO\`.

**(a)** Find the number \`NUM\` of years during which more than 300 automobiles were sold.  
**(b)** Print each year and the number of automobiles sold in that year.  
**(c)** State the critical requirement regarding variable initialization in module (a) before traversal begins, and explain why it is not required in module (b).`,
    explanation_or_solution: `### Detailed Worked Solution for Example 4.4

#### Module (a) Specification & Step-by-Step Execution
To count how many years experienced automobile sales exceeding 300:
\`\`\`text
Module (a): Count Years with Sales > 300
1. [Initialization step.] Set NUM := 0.
2. Repeat for K = 1932 to 1984:
     If AUTO[K] > 300, then:
       Set NUM := NUM + 1.
     [End of If structure.]
   [End of loop.]
3. Return.
\`\`\`

---

#### Module (b) Specification & Step-by-Step Execution
To output a tabulated report of years and sales volume:
\`\`\`text
Module (b): Print Sales by Year
1. Repeat for K = 1932 to 1984:
     Write: K, AUTO[K].
   [End of loop.]
2. Return.
\`\`\`

---

#### Part (c) Mathematical & System Analysis of Initialization
* **Why Module (a) requires initialization (\`NUM := 0\`):**  
  The variable \`NUM\` acts as an **accumulator / frequency counter**. In computer architecture and memory allocation, freshly declared memory cells contain indeterminate residual bit patterns (garbage values). The operation \`NUM := NUM + 1\` reads the existing value of \`NUM\`, adds 1, and stores the result back. If \`NUM\` is not explicitly cleared to zero prior to the loop, the final total will be offset by the random residual data.
* **Why Module (b) does NOT require initialization:**  
  Module (b) performs no accumulation. The loop counter \`K\` is explicitly initialized by the loop construct itself (\`K = 1932\`), and \`AUTO[K]\` is accessed as a read-only lookup. No secondary variable maintains state across iterations.

---

### Array Metrics
* **Lower Bound ($LB$):** $1932$
* **Upper Bound ($UB$):** $1984$
* **Total Years ($N$):**
  $$N = UB - LB + 1 = 1984 - 1932 + 1 = 53 \\text{ elements}$$

---

### Complete C++ Verification Program
\`\`\`cpp
#include <iostream>
#include <vector>
#include <map>

int main() {
    // Simulate AUTO array for years 1932 through 1984 (53 elements)
    std::map<int, int> AUTO;
    for (int yr = 1932; yr <= 1984; ++yr) {
        // Sample deterministic sales data
        AUTO[yr] = 250 + ((yr * 37) % 200); 
    }

    // --- Module (a): Count years where sales > 300 ---
    int NUM = 0; // Step 1: Mandatory initialization
    for (int K = 1932; K <= 1984; ++K) { // Step 2: Repeat for K = 1932 to 1984
        if (AUTO[K] > 300) {
            NUM = NUM + 1;
        }
    }
    std::cout << "Module (a) Result: Total years with sales > 300 = " << NUM << "\\n\\n";

    // --- Module (b): Print each year and sales count ---
    std::cout << "Module (b) Output (First 5 years sample):\\n";
    for (int K = 1932; K <= 1936; ++K) {
        std::cout << "  Year " << K << ": " << AUTO[K] << " automobiles\\n";
    }

    return 0;
}
\`\`\``,
  },

  // --- Topic 4.5: Inserting and Deleting ---
  {
    id: "cm-topic-4-5",
    title: "Section 4.5: Insertion and Deletion Mechanics in Linear Arrays",
    book_reference: "Lipschutz & Seymour, Data Structures, Revised 4th Ed., Chapter 4: Linear Arrays (Section 4.5)",
    topic_tag: "Linear Arrays",
    content_type: "topic",
    difficulty: "medium",
    assigned_date: null,
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    problem_statement: null,
    explanation_or_solution: `### Section 4.5: Inserting and Deleting in Linear Arrays

Let $A$ be a collection of data elements in the memory of the computer.
* **\"Inserting\"** refers to the operation of adding another element to the collection $A$.
* **\"Deleting\"** refers to the operation of removing one of the elements from $A$.

When $A$ is a **linear array**, these operations behave fundamentally differently depending on whether they occur at the **end** of the array or in the **middle** of the array.

---

### 1. Operations at the End of an Array ($O(1)$)
* **Inserting at the end:** Can be easily done provided the memory space allocated for the array is large enough to accommodate the additional element. We simply assign the value to slot $N+1$ and increment $N := N + 1$.
* **Deleting at the end:** Presents no difficulties; we simply decrement $N := N - 1$. The slot is logically excluded without moving any other data.

---

### 2. Operations in the Middle of an Array ($O(N)$ Shifting)
* **Inserting in the middle (at index $K$):**  
  Suppose we need to insert an element at index $K$. In order to make room for the new element, every element from index $K$ up to $N$ must be moved **downward** (to higher subscript locations $J+1 := J$). On average, half of the elements must be moved to accommodate the new element and preserve the relative order.
* **Deleting in the middle (at index $K$):**  
  Deleting an element somewhere in the middle of the array requires that each subsequent element from index $K+1$ up to $N$ be moved **upward** one location (to lower subscript locations $J := J+1$) in order to \"fill up\" the vacancy and preserve continuity.

---

### 3. Downward Shifting Reverse Order Invariant
> **Critical Rule:** When shifting elements downward to make room for an insertion, elements **must be moved in reverse order** — that is, first $LA[N]$, then $LA[N-1]$, ..., and last $LA[K]$. Moving in forward order would copy $LA[K]$ into $LA[K+1]$, and then that copy would be copied into $LA[K+2]$, wiping out the entire subsequent list!

---

### 4. Average Number of Data Movements
Let $N$ be the number of elements in the array:
* **Average Insertion Shifts:** Assuming each insertion position $K \\in [1, N+1]$ is equally likely:
  $$\\text{Avg Shifts} = \\frac{1}{N+1} \\sum_{K=1}^{N+1} (N - K + 1) = \\frac{N}{2}$$
* **Average Deletion Shifts:** Assuming each deletion position $K \\in [1, N]$ is equally likely:
  $$\\text{Avg Shifts} = \\frac{1}{N} \\sum_{K=1}^{N} (N - K) = \\frac{N - 1}{2}$$

---

### 5. Architectural Trade-off: Arrays vs Linked Lists
> **Textbook Remark:** If many deletions and insertions are to be made in a collection of data elements, a linear array may **not** be the most efficient data structure because $O(N)$ data movement is required per modification. In such scenarios, **linked lists** or dynamic trees are vastly superior, requiring only $O(1)$ pointer adjustments once the node position is identified.`,
  },

  // --- Problem 4.6: Tracing Element Shifting in Name Array ---
  {
    id: "cm-problem-4-6",
    title: "Example 4.5 & 4.6: Tracing Element Shifting in an Alphabetical Name Array",
    book_reference: "Lipschutz & Seymour, Data Structures, Revised 4th Ed., Chapter 4: Linear Arrays (Examples 4.5 & 4.6)",
    topic_tag: "Linear Arrays",
    content_type: "problem",
    difficulty: "medium",
    assigned_date: null,
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    problem_statement: `**(a) Example 4.5 (Array Capacity & End Insertion):**  
Suppose \`TEST\` has been declared to be a 5-element array (\`TEST[1 ... 5]\`), but data have been recorded only for \`TEST[1]\`, \`TEST[2]\`, and \`TEST[3]\`.
1. Show the specific assignment statements to add score $X$ to the list, and subsequently score $Y$.
2. Explain what occurs if an attempt is made to insert another score $Z$ after $Y$.

**(b) Example 4.6 (Step-by-Step Shifting Trace of Figure 4.4):**  
Suppose \`NAME\` is an 8-element linear array (\`NAME[1 ... 8]\`), and five names are currently stored in alphabetical order (Fig. 4.4a):
\`NAME[1] = "Brown"\`, \`NAME[2] = "Davis"\`, \`NAME[3] = "Johnson"\`, \`NAME[4] = "Smith"\`, \`NAME[5] = "Wagner"\`.  
The array must remain sorted alphabetically after every modification. Trace the exact array states and element shifts for the following sequential operations:
1. **Operation 1:** Insert name **\`"Ford"\`** into \`NAME\`.
2. **Operation 2:** Next, insert name **\`"Taylor"\`** into \`NAME\`.
3. **Operation 3:** Last, delete name **\`"Davis"\`** from \`NAME\`.
4. State the total number of element moves performed across all three operations, and discuss why this demonstrates the inefficiency of linear arrays for dynamic lists.`,
    explanation_or_solution: `### Detailed Worked Solution for Examples 4.5 & 4.6

#### (a) Example 4.5 Solution:
1. **Assignments:**
   * To add $X$ to the list: \`TEST[4] := X\`
   * To add $Y$ to the list: \`TEST[5] := Y\`
2. **Capacity Boundary (Overflow):**  
   Now all 5 allocated cells (\`TEST[1]\` through \`TEST[5]\`) are occupied ($N = 5 = \\text{Capacity}$). An attempt to insert $Z$ triggers an **Array Overflow condition**. In static memory allocation, arrays cannot expand past their declared upper bound without reallocating a new, larger memory block and copying all prior elements.

---

#### (b) Example 4.6 Step-by-Step Trace (Figure 4.4):

##### Initial State (Fig. 4.4a): $N = 5$
| Index | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **NAME** | \`Brown\` | \`Davis\` | \`Johnson\` | \`Smith\` | \`Wagner\` | *(empty)* | *(empty)* | *(empty)* |

---

##### Operation 1: Insert \"Ford\" (Fig. 4.4b)
* Alphabetical order dictates: $\\text{\"Davis\"} < \\mathbf{\\text{\"Ford\"}} < \\text{\"Johnson\"}$. Therefore, $\\text{\"Ford\"}$ must be placed at index $K = 3$.
* Elements from index $3$ through $5$ must be moved **downward** one slot in reverse order:
  1. \`NAME[6] := NAME[5]\` (moves \`"Wagner"\` to slot 6)
  2. \`NAME[5] := NAME[4]\` (moves \`"Smith"\` to slot 5)
  3. \`NAME[4] := NAME[3]\` (moves \`"Johnson"\` to slot 4)
* Insert the new element: \`NAME[3] := "Ford"\`.
* Update size: $N := N + 1 = 6$.
* **Data Movements:** **3 moves**.

| Index | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **NAME** | \`Brown\` | \`Davis\` | **\`Ford\`** | \`Johnson\` | \`Smith\` | \`Wagner\` | *(empty)* | *(empty)* |

---

##### Operation 2: Insert \"Taylor\" (Fig. 4.4c)
* Alphabetical order dictates: $\\text{\"Smith\"} < \\mathbf{\\text{\"Taylor\"}} < \\text{\"Wagner\"}$. Therefore, $\\text{\"Taylor\"}$ must be placed at index $K = 6$.
* Elements from index $6$ through $6$ must be moved **downward** one slot:
  1. \`NAME[7] := NAME[6]\` (moves \`"Wagner"\` to slot 7)
* Insert the new element: \`NAME[6] := "Taylor"\`.
* Update size: $N := N + 1 = 7$.
* **Data Movements:** **1 move**.

| Index | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **NAME** | \`Brown\` | \`Davis\` | \`Ford\` | \`Johnson\` | \`Smith\` | **\`Taylor\`** | \`Wagner\` | *(empty)* |

---

##### Operation 3: Delete \"Davis\" (Fig. 4.4d)
* \`"Davis"\` is located at index $K = 2$.
* To close the vacancy, all subsequent elements from index $3$ up to $7$ must be moved **upward** one slot in forward order:
  1. \`NAME[2] := NAME[3]\` (moves \`"Ford"\` to slot 2)
  2. \`NAME[3] := NAME[4]\` (moves \`"Johnson"\` to slot 3)
  3. \`NAME[4] := NAME[5]\` (moves \`"Smith"\` to slot 4)
  4. \`NAME[5] := NAME[6]\` (moves \`"Taylor"\` to slot 5)
  5. \`NAME[6] := NAME[7]\` (moves \`"Wagner"\` to slot 6)
* Update size: $N := N - 1 = 6$.
* **Data Movements:** **5 moves**.

| Index | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **NAME** | \`Brown\` | **\`Ford\`** | \`Johnson\` | \`Smith\` | \`Taylor\` | \`Wagner\` | *(empty)* | *(empty)* |

---

##### Total Cost Analysis:
$$\\text{Total Shifts} = 3 + 1 + 5 = \\mathbf{9} \\text{ element movements}$$
If thousands of names were stored in the array, each insertion or deletion would require shifting thousands of items, making array-based dynamic lists computationally expensive.

---

### Complete C++ Program Simulating Fig. 4.4 Trace
\`\`\`cpp
#include <iostream>
#include <vector>
#include <string>

void PrintArray(const std::vector<std::string>& A, int N, const std::string& stepLabel) {
    std::cout << stepLabel << " (N = " << N << "):\\n  [";
    for (int i = 0; i < N; ++i) {
        std::cout << "\"" << A[i] << "\"" << (i + 1 < N ? ", " : "");
    }
    std::cout << "]\\n\\n";
}

int main() {
    std::vector<std::string> NAME(8);
    NAME[0] = "Brown";
    NAME[1] = "Davis";
    NAME[2] = "Johnson";
    NAME[3] = "Smith";
    NAME[4] = "Wagner";
    int N = 5;

    PrintArray(NAME, N, "Fig 4.4(a): Initial 5 names");

    // 1. Insert "Ford" at index 2 (1-based: 3)
    int K1 = 2;
    for (int J = N - 1; J >= K1; --J) {
        NAME[J + 1] = NAME[J];
    }
    NAME[K1] = "Ford";
    N++;
    PrintArray(NAME, N, "Fig 4.4(b): After inserting 'Ford' (3 shifts)");

    // 2. Insert "Taylor" at index 5 (1-based: 6)
    int K2 = 5;
    for (int J = N - 1; J >= K2; --J) {
        NAME[J + 1] = NAME[J];
    }
    NAME[K2] = "Taylor";
    N++;
    PrintArray(NAME, N, "Fig 4.4(c): After inserting 'Taylor' (1 shift)");

    // 3. Delete "Davis" at index 1 (1-based: 2)
    int K3 = 1;
    for (int J = K3; J < N - 1; ++J) {
        NAME[J] = NAME[J + 1];
    }
    N--;
    PrintArray(NAME, N, "Fig 4.4(d): After deleting 'Davis' (5 shifts)");

    return 0;
}
\`\`\``,
  },

  // --- Algorithm 4.2: Inserting into a Linear Array ---
  {
    id: "cm-algo-4-2",
    title: "Algorithm 4.2: Inserting into a Linear Array (INSERT)",
    book_reference: "Lipschutz & Seymour, Data Structures, Revised 4th Ed., Chapter 4: Linear Arrays (Algorithm 4.2)",
    topic_tag: "Linear Arrays",
    content_type: "algorithm",
    difficulty: "medium",
    assigned_date: null,
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    problem_statement: null,
    explanation_or_solution: `### Algorithm 4.2: Inserting into a Linear Array

\`INSERT(LA, N, K, ITEM)\`  
Here $LA$ is a linear array with $N$ elements and $K$ is a positive integer such that $K \\le N$. This algorithm inserts an element \`ITEM\` into the $K^{\\text{th}}$ position in $LA$.

---

### Formal Algorithm Specification
\`\`\`text
Algorithm 4.2: INSERT(LA, N, K, ITEM)
1. [Initialize counter.] Set J := N.
2. Repeat Steps 3 and 4 while J >= K:
3.   [Move Jth element downward.] Set LA[J + 1] := LA[J].
4.   [Decrease counter.] Set J := J - 1.
   [End of Step 2 loop.]
5. [Insert element.] Set LA[K] := ITEM.
6. [Reset N.] Set N := N + 1.
7. Exit.
\`\`\`

---

### Mathematical Invariants & Step Explanation
1. **Loop Initialization ($J := N$):** The index pointer $J$ begins at the current tail element $N$.
2. **Reverse Order Traversal ($J \\ge K$):** Shifting proceeds in reverse order ($J = N, N-1, \\dots, K$). Each element $LA[J]$ is copied into its adjacent higher neighbor $LA[J+1]$.
3. **Vacancy Creation:** After the loop terminates, cell $LA[K]$ contains a duplicate copy of $LA[K+1]$, but its old value has safely moved to $LA[K+1]$. Step 5 overwrites $LA[K]$ with \`ITEM\`.
4. **Size Increment ($N := N + 1$):** Accounts for the newly populated slot.

---

### Boundary Cases & Complexity Analysis
* **Worst Case ($K = 1$):** Inserting at the very front requires shifting all $N$ elements downward:
  $$W(N) = N \\text{ movements} = O(N)$$
* **Best Case ($K = N + 1$):** Appending to the end requires 0 loop iterations ($J < K$ initially):
  $$B(N) = 0 \\text{ movements} = O(1)$$
* **Average Case:** Assuming uniform insertion distribution:
  $$A(N) = \\frac{1}{N+1} \\sum_{K=1}^{N+1} (N - K + 1) = \\frac{N}{2} = O(N)$$
* **Auxiliary Space:** $O(1)$ extra space.

---

### Complete C++ Implementation
\`\`\`cpp
#include <iostream>
#include <vector>

// Algorithm 4.2 implementation (0-based indexing adaptation)
bool InsertIntoLinearArray(std::vector<int>& LA, int& N, int MAX_CAPACITY, int K, int ITEM) {
    // Boundary check for overflow
    if (N >= MAX_CAPACITY) {
        std::cerr << "Error: Array Overflow! Cannot insert into full array.\\n";
        return false;
    }
    if (K < 0 || K > N) {
        std::cerr << "Error: Invalid index K = " << K << " for array of size " << N << "\\n";
        return false;
    }

    // Step 1 & 2: Shift downward in reverse order
    int J = N - 1;
    while (J >= K) {
        LA[J + 1] = LA[J]; // Step 3: Move Jth element downward
        J = J - 1;         // Step 4: Decrease counter
    }

    // Step 5: Insert element
    LA[K] = ITEM;

    // Step 6: Reset N
    N = N + 1;

    return true; // Step 7: Exit
}

int main() {
    std::vector<int> LA(10);
    LA[0] = 11; LA[1] = 22; LA[2] = 33; LA[3] = 44; LA[4] = 55;
    int N = 5;

    std::cout << "Original array (N=5): ";
    for (int i = 0; i < N; ++i) std::cout << LA[i] << " ";
    std::cout << "\\n";

    // Insert 99 at index 2
    InsertIntoLinearArray(LA, N, 10, 2, 99);

    std::cout << "After inserting 99 at index 2 (N=" << N << "): ";
    for (int i = 0; i < N; ++i) std::cout << LA[i] << " ";
    std::cout << "\\n";

    return 0;
}
\`\`\``,
  },

  // --- Algorithm 4.3: Deleting from a Linear Array ---
  {
    id: "cm-algo-4-3",
    title: "Algorithm 4.3: Deleting from a Linear Array (DELETE)",
    book_reference: "Lipschutz & Seymour, Data Structures, Revised 4th Ed., Chapter 4: Linear Arrays (Algorithm 4.3)",
    topic_tag: "Linear Arrays",
    content_type: "algorithm",
    difficulty: "medium",
    assigned_date: null,
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    problem_statement: null,
    explanation_or_solution: `### Algorithm 4.3: Deleting from a Linear Array

\`DELETE(LA, N, K, ITEM)\`  
Here $LA$ is a linear array with $N$ elements and $K$ is a positive integer such that $K \\le N$. This algorithm deletes the $K^{\\text{th}}$ element from $LA$ and assigns it to the variable \`ITEM\`.

---

### Formal Algorithm Specification
\`\`\`text
Algorithm 4.3: DELETE(LA, N, K, ITEM)
1. Set ITEM := LA[K].
2. Repeat for J = K to N - 1:
     [Move J + 1st element upward.] Set LA[J] := LA[J + 1].
   [End of loop.]
3. [Reset the number N of elements in LA.] Set N := N - 1.
4. Exit.
\`\`\`

---

### Mathematical Invariants & Step Explanation
1. **Value Preservation (\`ITEM := LA[K]\`):** Saves the target value before it is overwritten by subsequent elements.
2. **Forward Order Traversal ($J = K \\dots N-1$):** Shifting proceeds forward. Element $LA[J+1]$ is shifted **upward** into position $LA[J]$, closing the hole left by the removed item.
3. **Size Decrement ($N := N - 1$):** Reduces the logical size. The old value at $LA[N]$ is logically dropped.

---

### Boundary Cases & Complexity Analysis
* **Worst Case ($K = 1$):** Deleting the very first element requires shifting all remaining $N - 1$ elements upward:
  $$W(N) = N - 1 \\text{ movements} = O(N)$$
* **Best Case ($K = N$):** Deleting the last element requires 0 loop iterations:
  $$B(N) = 0 \\text{ movements} = O(1)$$
* **Average Case:** Assuming uniform deletion distribution across all $N$ positions:
  $$A(N) = \\frac{1}{N} \\sum_{K=1}^{N} (N - K) = \\frac{N - 1}{2} = O(N)$$
* **Auxiliary Space:** $O(1)$ extra space.

---

### Complete C++ Implementation
\`\`\`cpp
#include <iostream>
#include <vector>

// Algorithm 4.3 implementation (0-based indexing adaptation)
bool DeleteFromLinearArray(std::vector<int>& LA, int& N, int K, int& ITEM) {
    // Boundary check for underflow
    if (N <= 0) {
        std::cerr << "Error: Array Underflow! Cannot delete from empty array.\\n";
        return false;
    }
    if (K < 0 || K >= N) {
        std::cerr << "Error: Invalid index K = " << K << " for array of size " << N << "\\n";
        return false;
    }

    // Step 1: Save element
    ITEM = LA[K];

    // Step 2: Shift upward in forward order
    for (int J = K; J < N - 1; ++J) {
        LA[J] = LA[J + 1]; // Move J+1st element upward
    }

    // Step 3: Decrement N
    N = N - 1;

    return true; // Step 4: Exit
}

int main() {
    std::vector<int> LA = {10, 20, 30, 40, 50};
    int N = 5;
    int deletedItem = 0;

    std::cout << "Original array: ";
    for (int i = 0; i < N; ++i) std::cout << LA[i] << " ";
    std::cout << "\\n";

    // Delete element at index 1 (value 20)
    DeleteFromLinearArray(LA, N, 1, deletedItem);

    std::cout << "Deleted Item: " << deletedItem << "\\n";
    std::cout << "Array after deletion (N=" << N << "): ";
    for (int i = 0; i < N; ++i) std::cout << LA[i] << " ";
    std::cout << "\\n";

    return 0;
}
\`\`\``,
  },
];
