"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Layers,
  ChevronRight,
  Eye,
  Sliders,
  Flame,
  ShieldCheck,
  Code2,
  RefreshCw,
  Crown,
  ArrowRight,
  Database,
  Link as LinkIcon,
  AlertTriangle,
  FileCode2,
  Info,
  Cpu,
  Boxes,
  Terminal,
  Activity,
  Check,
  Hash,
  Share2,
  BookOpen,
  Lightbulb,
  Languages,
  Compass,
} from "lucide-react";

// Node in our simulated Heap
export interface ListNodeModel {
  id: string;
  address: string;
  data: number;
  nextAddress: string | null;
  index: number;
}

export interface SimStep {
  stepIndex: number;
  totalSteps: number;
  codeLine: number;
  highlightLines: number[];
  phase: "init" | "input" | "alloc" | "populate" | "branch" | "link" | "advance" | "traverse_init" | "traverse_check" | "traverse_print" | "traverse_advance" | "complete";
  title: string;
  titleBn: string;
  codeSnippet: string;
  head: string | null;
  temp: string | null;
  newNode: string | null;
  currentLoopI: number | null;
  currentValue: number | null;
  heapNodes: ListNodeModel[];
  activeNodeId: string | null;
  animatingPointer: { from: string; to: string } | null;
  outputStream: string;
  whatHappening: string;
  whatHappeningBn: string;
  whyHappening: string;
  whyHappeningBn: string;
  rememberTip: string;
  rememberTipBn: string;
  quizQuestion?: {
    id: string;
    question: string;
    questionBn: string;
    options: string[];
    optionsBn: string[];
    correctIndex: number;
    explanation: string;
    explanationBn: string;
  };
}

const CPP_SOURCE_CODE = [
  { line: 1, text: "#include <iostream>", commentBn: "ইনপুট/আউটপুট লাইব্রেরি" },
  { line: 2, text: "using namespace std;", commentBn: "স্ট্যান্ডার্ড নেমস্পেস" },
  { line: 3, text: "", commentBn: "" },
  { line: 4, text: "struct Node {", commentBn: "নোডের ব্লুপ্রিন্ট/স্ট্রাকচার তৈরি" },
  { line: 5, text: "    int data;", commentBn: "১ম অংশ: মান/ডেটা রাখার ভেরিয়েবল" },
  { line: 6, text: "    Node* next;", commentBn: "২য় অংশ: পরের নোডের অ্যাড্রেস/পয়েন্টার" },
  { line: 7, text: "};", commentBn: "" },
  { line: 8, text: "", commentBn: "" },
  { line: 9, text: "int main() {", commentBn: "মূল প্রোগ্রাম শুরু" },
  { line: 10, text: "    Node* head = nullptr;", commentBn: "হেড পয়েন্টার শুরুতে খালি (NULL)" },
  { line: 11, text: "    Node* temp = nullptr;", commentBn: "সহকারী ট্রাভার্সাল পয়েন্টার শুরুতে খালি" },
  { line: 12, text: "", commentBn: "" },
  { line: 13, text: "    // Create 5 nodes", commentBn: "৫টি নোড তৈরির লুপ" },
  { line: 14, text: "    for (int i = 0; i < 5; i++) {", commentBn: "লুপ i = ০ থেকে ৪ পর্যন্ত চলবে" },
  { line: 15, text: "        int value;", commentBn: "ইনপুট নেওয়ার জন্য ভেরিয়েবল" },
  { line: 16, text: "        cin >> value;", commentBn: "ইউজারের কাছ থেকে মান গ্রহণ" },
  { line: 17, text: "", commentBn: "" },
  { line: 18, text: "        Node* newNode = new Node();", commentBn: "হিপ মেমরিতে নতুন নোড এলোকেট" },
  { line: 19, text: "", commentBn: "" },
  { line: 20, text: "        newNode->data = value;", commentBn: "নোডের data তে মান বসানো" },
  { line: 21, text: "        newNode->next = nullptr;", commentBn: "নোডের next শুরুতে nullptr রাখা" },
  { line: 22, text: "", commentBn: "" },
  { line: 23, text: "        // First node", commentBn: "তালিকার ১ম নোড কি না চেক" },
  { line: 24, text: "        if (head == nullptr) {", commentBn: "লিস্ট খালি থাকলে ১ম নোড বানাই" },
  { line: 25, text: "            head = newNode;", commentBn: "head এখন নতুন নোডকে নির্দেশ করে" },
  { line: 26, text: "            temp = newNode;", commentBn: "temp ও নতুন নোডকে নির্দেশ করে" },
  { line: 27, text: "        }", commentBn: "" },
  { line: 28, text: "        // Other nodes", commentBn: "২য়, ৩য়, ৪র্থ, ৫ম নোডের ক্ষেত্রে" },
  { line: 29, text: "        else {", commentBn: "লিস্টে আগে থেকেই নোড থাকলে" },
  { line: 30, text: "            temp->next = newNode;", commentBn: "আগের নোডের সাথে নতুন নোড লিংক" },
  { line: 31, text: "            temp = newNode;", commentBn: "temp কে সামনে এগিয়ে নতুন নোডে আনা" },
  { line: 32, text: "        }", commentBn: "" },
  { line: 33, text: "    }", commentBn: "লুপ সমাপ্ত" },
  { line: 34, text: "", commentBn: "" },
  { line: 35, text: "    // Print Linked List", commentBn: "প্রিন্টিং বা ট্রাভার্সাল শুরু" },
  { line: 36, text: "    temp = head;", commentBn: "temp কে শুরুতে (head এ) ফিরিয়ে আনা" },
  { line: 37, text: "", commentBn: "" },
  { line: 38, text: "    while (temp != nullptr) {", commentBn: "যতক্ষণ না শেষ নোড (NULL) এ পৌঁছায়" },
  { line: 39, text: "        cout << temp->data << \" -> \";", commentBn: "বর্তমান নোডের data প্রিন্ট" },
  { line: 40, text: "        temp = temp->next;", commentBn: "temp কে পরের নোডে এগিয়ে নেওয়া" },
  { line: 41, text: "    }", commentBn: "" },
  { line: 42, text: "", commentBn: "" },
  { line: 43, text: "    cout << \"NULL\" << endl;", commentBn: "শেষে NULL প্রিন্ট করা" },
  { line: 44, text: "", commentBn: "" },
  { line: 45, text: "    return 0;", commentBn: "প্রোগ্রাম সফলভাবে সমাপ্ত" },
  { line: 46, text: "}", commentBn: "" },
];

const PRESET_EXAMPLES = [
  { name: "Default (10, 20, 30, 40, 50)", values: [10, 20, 30, 40, 50] },
  { name: "Powers of Two (2, 4, 8, 16, 32)", values: [2, 4, 8, 16, 32] },
  { name: "Multiples of 100 (100, 200, 300, 400, 500)", values: [100, 200, 300, 400, 500] },
  { name: "Random Array", values: [15, 28, 42, 67, 91] },
];

const HEX_ADDRESSES = ["0x1000", "0x2000", "0x3000", "0x4000", "0x5000", "0x6000"];

export function SinglyLinkedListStudio() {
  const [inputValues, setInputValues] = useState<number[]>([10, 20, 30, 40, 50]);
  const [tempInputs, setTempInputs] = useState<string[]>(["10", "20", "30", "40", "50"]);
  const [activeTab, setActiveTab] = useState<"visualizer" | "bangla_guide" | "memory" | "theory">("visualizer");
  const [lang, setLang] = useState<"bn" | "en">("bn"); // Default to Bangla for beginner clarity

  // Playback control state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);

  // User Quiz Answer Tracking
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number | null>>({});

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Synchronize inputs when preset is chosen
  const handleSelectPreset = (values: number[]) => {
    setInputValues(values);
    setTempInputs(values.map((v) => v.toString()));
    setCurrentStepIdx(0);
    setIsPlaying(false);
  };

  const handleApplyCustomInputs = () => {
    const parsed = tempInputs.map((str, idx) => {
      const num = parseInt(str.trim(), 10);
      return isNaN(num) ? (idx + 1) * 10 : num;
    });
    setInputValues(parsed);
    setCurrentStepIdx(0);
    setIsPlaying(false);
  };

  // Generate All Deterministic Simulation Steps with Dual English & Rich Bangla Explanations
  const simulationSteps = useMemo<SimStep[]>(() => {
    const steps: SimStep[] = [];
    const values = inputValues;
    const n = 5;

    let head: string | null = null;
    let temp: string | null = null;
    let newNode: string | null = null;
    let heapNodes: ListNodeModel[] = [];
    let outputStream = "";

    // -------------------------------------------------------------
    // STEP 0: Program Initialization
    // -------------------------------------------------------------
    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      codeLine: 10,
      highlightLines: [10, 11],
      phase: "init",
      title: "Step 1 — Program Starts & Pointer Initialization",
      titleBn: "ধাপ ১ — প্রোগ্রাম শুরু এবং পয়েন্টার ইনিশিয়ালাইজেশন (NULL)",
      codeSnippet: "Node* head = nullptr;\nNode* temp = nullptr;",
      head: null,
      temp: null,
      newNode: null,
      currentLoopI: null,
      currentValue: null,
      heapNodes: [],
      activeNodeId: null,
      animatingPointer: null,
      outputStream: "",
      whatHappening: "Initially, the linked list is empty. Both pointer variables 'head' and 'temp' are created on the Stack and initialized to nullptr.",
      whatHappeningBn: "শুরুতে আমাদের লিংকড লিস্টটি সম্পূর্ণ খালি। স্ট্যাক মেমরিতে দুটি পয়েন্টার 'head' এবং 'temp' তৈরি হলো এবং তাদের মান nullptr (খালি) রাখা হলো।",
      whyHappening: "Pointers must be initialized to nullptr to prevent them from becoming wild/dangling pointers with random garbage memory addresses.",
      whyHappeningBn: "পয়েন্টারে শুরুতে nullptr না দিলে তারা মেমরির আবর্জনা (garbage address) নির্দেশ করবে, যা প্রোগ্রামকে ক্র্যাশ করাতে পারে।",
      rememberTip: "'nullptr' represents memory address 0x0 — indicating that the pointer is currently not pointing to any valid Node in memory.",
      rememberTipBn: "nullptr মানে অ্যাড্রেস 0x0 — এর মানে পয়েন্টারটি বর্তমানে মেমরির কোনো নোডকে নির্দেশ করছে না।",
      quizQuestion: {
        id: "q_head_init",
        question: "Why do we initialize 'head' and 'temp' to nullptr at the start?",
        questionBn: "শুরুতে 'head' এবং 'temp' কে কেন nullptr দিয়ে শুরু করা হয়?",
        options: [
          "Because a linked list starts empty and holds no valid addresses yet",
          "Because nullptr allocates a 0-value node automatically",
          "Because C++ requires all variables to be negative numbers",
          "Because it reserves 5 memory slots in heap storage immediately",
        ],
        optionsBn: [
          "কারণ শুরুতে লিস্টটি সম্পূর্ণ খালি থাকে এবং এর কোনো নোড বা মেমরি ঠিকানা থাকে না",
          "কারণ nullptr নিজে থেকেই শূন্য মানের একটি নোড তৈরি করে দেয়",
          "কারণ C++ এ সকল ভ্যারিয়েবল ঋণাত্মক হতে হয়",
          "কারণ এটি হিপ মেমরিতে ৫টি স্লট আগে থেকেই দখল করে রাখে",
        ],
        correctIndex: 0,
        explanation: "Setting pointers to nullptr safely indicates an empty list and avoids garbage memory pointers.",
        explanationBn: "পয়েন্টারে nullptr দেওয়া মানে লিস্টটি এখন খালি এবং এতে কোনো গারবেজ ভ্যালু নেই।",
      },
    });

    // -------------------------------------------------------------
    // LOOP: Create 5 Nodes
    // -------------------------------------------------------------
    for (let i = 0; i < n; i++) {
      const val = values[i];
      const nodeAddr = HEX_ADDRESSES[i] || `0x${(i + 1) * 1000}`;
      const nodeId = `node_${i + 1}`;

      // Loop Step A: Read Input
      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        codeLine: 16,
        highlightLines: [14, 15, 16],
        phase: "input",
        title: `Node ${i + 1}/5: Reading Input Value (i = ${i})`,
        titleBn: `নোড ${i + 1}/৫: ইনপুট গ্রহণ (value = ${val}, i = ${i})`,
        codeSnippet: `int value;\ncin >> value; // user inputs: ${val}`,
        head,
        temp,
        newNode,
        currentLoopI: i,
        currentValue: val,
        heapNodes: [...heapNodes],
        activeNodeId: null,
        animatingPointer: null,
        outputStream,
        whatHappening: `Loop iteration i = ${i}: User provides integer input value = ${val}.`,
        whatHappeningBn: `লুপের ধাপ i = ${i}: ইউজার কীবোর্ড থেকে ইনপুট দিলেন value = ${val}।`,
        whyHappening: "The program reads data from standard input before allocating node memory to store this value.",
        whyHappeningBn: "মেমরিতে নোড বানানোর আগে ইউজারের কাছ থেকে সংখ্যাটি গ্রহণ করে ভ্যারিয়েবলে রাখা হচ্ছে।",
        rememberTip: "A Singly Linked List dynamically allocates memory node-by-node as inputs arrive at runtime.",
        rememberTipBn: "লিংকড লিস্টে অ্যারের মতো আগে থেকে ফিক্সড সাইজ লাগে না; যখন ইনপুট আসে ঠিক তখনই নোড তৈরি হয়।",
      });

      // Loop Step B: Dynamic Allocation `new Node()`
      newNode = nodeAddr;
      const uninitNode: ListNodeModel = {
        id: nodeId,
        address: nodeAddr,
        data: val,
        nextAddress: null,
        index: i + 1,
      };

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        codeLine: 18,
        highlightLines: [18],
        phase: "alloc",
        title: `Node ${i + 1}/5: Dynamic Node Memory Allocation`,
        titleBn: `নোড ${i + 1}/৫: হিপ মেমরিতে নতুন নোড তৈরি (new Node())`,
        codeSnippet: "Node* newNode = new Node();",
        head,
        temp,
        newNode: nodeAddr,
        currentLoopI: i,
        currentValue: val,
        heapNodes: [...heapNodes, uninitNode],
        activeNodeId: nodeId,
        animatingPointer: null,
        outputStream,
        whatHappening: `The C++ operator 'new Node()' allocates dynamic memory on the HEAP at address ${nodeAddr} and stores its address in the 'newNode' pointer.`,
        whatHappeningBn: `C++ এর 'new Node()' কমান্ডটি হিপ (Heap) মেমরিতে ${nodeAddr} ঠিকানায় একটি নতুন নোডের জায়গা বরাদ্দ করল এবং তার ঠিকানা 'newNode' পয়েন্টারে জমা রাখল।`,
        whyHappening: "Dynamic allocation allows the linked list to grow arbitrarily in heap memory without requiring a predefined fixed size.",
        whyHappeningBn: "ডায়নামিক মেমরির সুবিধা হলো প্রোগ্রাম চলার সময় প্রয়োজনমতো যেকোনো জায়গায় মেমরি বাড়ানো যায়।",
        rememberTip: "Unlike arrays which require contiguous memory, linked list nodes can reside anywhere in heap storage.",
        rememberTipBn: "অ্যারে মেমরিতে পাশাপাশি থাকতে বাধ্য, কিন্তু লিংকড লিস্টের নোডগুলো মেমরির যেকোনো ছড়ানো-ছিটানো ঠিকানায় থাকতে পারে।",
        quizQuestion: i === 0 ? {
          id: "q_new_operator",
          question: "What does the C++ expression 'new Node()' actually do?",
          questionBn: "C++ এর 'new Node()' কোডটি আসলে কী কাজ করে?",
          options: [
            "Dynamically creates a new Node struct in Heap memory and returns its address",
            "Creates an array of 5 integers in the stack",
            "Frees existing memory in the system",
            "Prints the node address to the console screen",
          ],
          optionsBn: [
            "হিপ মেমরিতে ডায়নামিকালি একটি নতুন নোড তৈরি করে তার মেমরি অ্যাড্রেস রিটার্ন করে",
            "স্ট্যাক মেমরিতে ৫ সাইজের একটি অ্যারে তৈরি করে",
            "কম্পিউটার মেমরি খালি/ডিলিট করে",
            "স্ক্রিনে মেমরির ঠিকানা প্রিন্ট করে",
          ],
          correctIndex: 0,
          explanation: "'new' allocates memory in the Heap at runtime and returns a pointer to the newly created object.",
          explanationBn: "'new' রানটাইমে হিপ মেমরিতে অবজেক্ট বানায় এবং তার পয়েন্টার দেয়।",
        } : undefined,
      });

      // Loop Step C: Assign data and next pointer
      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        codeLine: 20,
        highlightLines: [20, 21],
        phase: "populate",
        title: `Node ${i + 1}/5: Assign Data & Terminate Next with nullptr`,
        titleBn: `নোড ${i + 1}/৫: ডেটা অ্যাসাইন এবং Next কে nullptr করা`,
        codeSnippet: `newNode->data = ${val};\nnewNode->next = nullptr;`,
        head,
        temp,
        newNode: nodeAddr,
        currentLoopI: i,
        currentValue: val,
        heapNodes: [...heapNodes, uninitNode],
        activeNodeId: nodeId,
        animatingPointer: null,
        outputStream,
        whatHappening: `Populating fields: newNode->data = ${val} and newNode->next = nullptr. The node contains [ ${val} | nullptr ].`,
        whatHappeningBn: `নোডের ভেতরে ডেটা বসানো হচ্ছে: newNode->data = ${val} এবং newNode->next = nullptr। নোডটি এখন দেখতে: [ ${val} | NULL ]।`,
        whyHappening: "Every newly instantiated node must have its data initialized and its next pointer safely set to nullptr until connected.",
        whyHappeningBn: "নতুন নোডে ভ্যালু বসাতে হয় এবং এর পরের নোড এখনো ঠিক হয়নি বলে 'next' কে সাময়িকভাবে nullptr রাখা হয়।",
        rememberTip: "A node has two fundamental parts: [ data | next ]. 'data' holds the payload value, and 'next' holds the address of the next node.",
        rememberTipBn: "একটি নোডের দুটি অংশ: [ data | next ]। 'data' তে আসল মান থাকে, আর 'next' এ পরের নোডের ঠিকানা থাকে।",
      });

      // Loop Step D: First Node Condition vs Other Nodes
      if (i === 0) {
        // First Node Branch (head == nullptr)
        steps.push({
          stepIndex: 0,
          totalSteps: 0,
          codeLine: 24,
          highlightLines: [24],
          phase: "branch",
          title: "Node 1/5: Checking First Node Condition (head == nullptr)",
          titleBn: "নোড ১/৫: প্রথম নোড শর্ত চেক (head == nullptr সত্য)",
          codeSnippet: "if (head == nullptr) // Evaluates to TRUE",
          head,
          temp,
          newNode: nodeAddr,
          currentLoopI: i,
          currentValue: val,
          heapNodes: [...heapNodes, uninitNode],
          activeNodeId: nodeId,
          animatingPointer: null,
          outputStream,
          whatHappening: "Checking 'head == nullptr': Result is TRUE because this is the very first node in our list.",
          whatHappeningBn: "চেক করা হচ্ছে 'head == nullptr' কি না: ফলাফল হলো TRUE, কারণ এটি আমাদের লিস্টের সর্বপ্রথম নোড।",
          whyHappening: "The very first node must be anchored by the 'head' pointer so the program can access the entire chain later.",
          whyHappeningBn: "লিস্টের প্রথম নোডটির সন্ধান ধরে রাখার জন্য 'head' পয়েন্টারকে এই নোডের সাথে যুক্ত করতে হবে।",
          rememberTip: "'head' is the permanent reference to the start of the list. If you lose 'head', you lose the entire list!",
          rememberTipBn: "'head' হলো ট্রেনের ইঞ্জিনের মতো—এটা হারালে পুরো ট্রেনের অস্তিত্ব হারিয়ে যাবে!",
        });

        // Set head & temp to newNode
        head = nodeAddr;
        temp = nodeAddr;
        heapNodes = [uninitNode];

        steps.push({
          stepIndex: 0,
          totalSteps: 0,
          codeLine: 25,
          highlightLines: [25, 26],
          phase: "link",
          title: "Node 1/5: Connecting Head & Temp to First Node",
          titleBn: "নোড ১/৫: head এবং temp কে ১ম নোডে পয়েন্ট করানো",
          codeSnippet: `head = newNode; // head = ${nodeAddr}\ntemp = newNode; // temp = ${nodeAddr}`,
          head: nodeAddr,
          temp: nodeAddr,
          newNode: nodeAddr,
          currentLoopI: i,
          currentValue: val,
          heapNodes: [...heapNodes],
          activeNodeId: nodeId,
          animatingPointer: null,
          outputStream,
          whatHappening: `Both 'head' and 'temp' now point to Node 1 at address ${nodeAddr}. The linked list now has its head node!`,
          whatHappeningBn: `'head' এবং 'temp' উভয় পয়েন্টারই এখন Node 1 (${nodeAddr}) কে নির্দেশ করছে। আমাদের লিস্টের ভিত্তিপ্রস্তর তৈরি হলো!`,
          whyHappening: "'head' remembers where the list begins, while 'temp' will be used to move and attach subsequent nodes.",
          whyHappeningBn: "'head' লিস্টের শুরু মনে রাখবে, আর 'temp' সামনের নোডগুলোকে জোড়া লাগাতে সাহায্য করবে।",
          rememberTip: "Both head and temp store the exact same hexadecimal address (0x1000) pointing to Node 1.",
          rememberTipBn: "head এবং temp উভয়ই একই অ্যাড্রেস (0x1000) ধরে রেখেছে।",
          quizQuestion: {
            id: "q_head_pointer",
            question: "Why does 'head' point to the first node?",
            questionBn: "কেন 'head' পয়েন্টারটি প্রথম নোডকে পয়েন্ট করে থাকে?",
            options: [
              "Because 'head' stores the memory address of the first node so we can traverse the list",
              "Because 'head' stores the first node's data value (10)",
              "Because 'head' is the last node in memory",
              "Because head must always be nullptr in C++",
            ],
            optionsBn: [
              "কারণ head প্রথম নোডের অ্যাড্রেস মনে রাখে যাতে যেকোনো সময় পুরো লিস্ট ট্রাভার্স করা যায়",
              "কারণ head প্রথম নোডের ভেতরের ডেটা (১০) ধরে রাখে",
              "কারণ head মেমরির শেষ নোড",
              "কারণ C++ এ head কে আজীবন nullptr থাকতে হয়",
            ],
            correctIndex: 0,
            explanation: "'head' is a pointer that holds the starting address of the linked list chain.",
            explanationBn: "head হলো একটি পয়েন্টার যা সম্পূর্ণ লিস্টের প্রারম্ভিক মেমরি ঠিকানা সংরক্ষণ করে।",
          },
        });
      } else {
        // Other Nodes Branch (head != nullptr)
        steps.push({
          stepIndex: 0,
          totalSteps: 0,
          codeLine: 29,
          highlightLines: [24, 29],
          phase: "branch",
          title: `Node ${i + 1}/5: Checking Condition (head == nullptr is FALSE)`,
          titleBn: `নোড ${i + 1}/৫: শর্ত চেক (head == nullptr মিথ্যা, else ব্লকে গমন)`,
          codeSnippet: "if (head == nullptr) // FALSE -> execute 'else' block",
          head,
          temp,
          newNode: nodeAddr,
          currentLoopI: i,
          currentValue: val,
          heapNodes: [...heapNodes, uninitNode],
          activeNodeId: nodeId,
          animatingPointer: null,
          outputStream,
          whatHappening: `Checking 'head == nullptr': FALSE (head already points to ${head}). The program executes the 'else' branch.`,
          whatHappeningBn: `'head == nullptr' চেক করা হলো: এটি FALSE (কারণ head অলরেডি ${head} এ পয়েন্ট করছে)। তাই প্রোগ্রাম 'else' অংশে গেল।`,
          whyHappening: "Because the list is not empty, we need to link this new node to the end of the existing chain.",
          whyHappeningBn: "যেহেতু লিস্টে আগে থেকেই নোড আছে, তাই এই নতুন নোডটিকে আগের নোডের লেজে যুক্ত করতে হবে।",
          rememberTip: "The 'temp' pointer is currently pointing to the last node of the list, making it easy to attach the new node in O(1) time.",
          rememberTipBn: "'temp' পয়েন্টারটি আগের শেষ নোডের মাথায় দাঁড়িয়ে আছে, তাই O(1) সময়ে নতুন নোড যুক্ত করা সম্ভব।",
        });

        // Link previous node: temp->next = newNode
        const prevNodeIndex = i - 1;
        const prevAddr = heapNodes[prevNodeIndex].address;
        const updatedHeapNodes = heapNodes.map((n, idx) => {
          if (idx === prevNodeIndex) {
            return { ...n, nextAddress: nodeAddr };
          }
          return n;
        });
        updatedHeapNodes.push(uninitNode);
        heapNodes = updatedHeapNodes;

        steps.push({
          stepIndex: 0,
          totalSteps: 0,
          codeLine: 30,
          highlightLines: [30],
          phase: "link",
          title: `Node ${i + 1}/5: Connecting Pointer (temp->next = newNode)`,
          titleBn: `নোড ${i + 1}/৫: পয়েন্টার কানেকশন (temp->next = newNode)`,
          codeSnippet: `temp->next = newNode; // ${prevAddr}->next points to ${nodeAddr}`,
          head,
          temp: prevAddr,
          newNode: nodeAddr,
          currentLoopI: i,
          currentValue: val,
          heapNodes: [...heapNodes],
          activeNodeId: nodeId,
          animatingPointer: { from: prevAddr, to: nodeAddr },
          outputStream,
          whatHappening: `Executing 'temp->next = newNode': The 'next' pointer of Node ${i} (${prevAddr}) is updated to store address ${nodeAddr} (Node ${i + 1}).`,
          whatHappeningBn: `ম্যাজিক লাইন 'temp->next = newNode': আগের নোডের (${prevAddr}) 'next' ঘরে নতুন নোডের ঠিকানা (${nodeAddr}) লিখে দেওয়া হলো। দুটি নোড সংযুক্ত হলো!`,
          whyHappening: "This pointer assignment creates the physical link between Node ${i} and Node ${i + 1} in memory!",
          whyHappeningBn: "এই লাইনের মাধ্যমেই মেমরিতে নোড দুটির মধ্যে সংযোগ বা তিরের মতো শিকল তৈরি হলো।",
          rememberTip: "'temp->next' stores the memory address of the next node. This is how nodes are linked together.",
          rememberTipBn: "'temp->next' পরের নোডের মেমরি অ্যাড্রেস জমা রাখে। এভাবেই দুটি নোড পরস্পরের সাথে যুক্ত থাকে।",
          quizQuestion: i === 1 ? {
            id: "q_temp_next",
            question: "What does the line 'temp->next = newNode;' accomplish?",
            questionBn: "'temp->next = newNode;' কোড লাইনটি আসলে কী পরিবর্তন করে?",
            options: [
              "It stores the address of the new node inside the previous node's next pointer",
              "It deletes the previous node from memory",
              "It changes the head of the linked list to newNode",
              "It swaps the data values between both nodes",
            ],
            optionsBn: [
              "এটি আগের নোডের next ঘরে নতুন নোডের ঠিকানা বসিয়ে তাদের মাঝে লিংক তৈরি করে",
              "এটি আগের নোডকে মেমরি থেকে মুছে ফেলে",
              "এটি হেড পয়েন্টারকে পরিবর্তন করে নতুন নোড বানিয়ে দেয়",
              "এটি দুই নোডের ভেতরের ডেটা অদলবদল করে",
            ],
            correctIndex: 0,
            explanation: "'temp->next = newNode' assigns the memory address of the new node to the previous node's next field.",
            explanationBn: "এই অ্যাসাইনমেন্টের ফলে আগের নোডটি এখন নতুন নোডকে চেনে এবং পয়েন্ট করে।",
          } : undefined,
        });

        // Advance temp: temp = newNode
        temp = nodeAddr;

        steps.push({
          stepIndex: 0,
          totalSteps: 0,
          codeLine: 31,
          highlightLines: [31],
          phase: "advance",
          title: `Node ${i + 1}/5: Moving Temp Pointer Forward (temp = newNode)`,
          titleBn: `নোড ${i + 1}/৫: temp পয়েন্টারকে সামনে এগিয়ে নেওয়া (temp = newNode)`,
          codeSnippet: `temp = newNode; // temp now points to ${nodeAddr}`,
          head,
          temp: nodeAddr,
          newNode: nodeAddr,
          currentLoopI: i,
          currentValue: val,
          heapNodes: [...heapNodes],
          activeNodeId: nodeId,
          animatingPointer: null,
          outputStream,
          whatHappening: `Executing 'temp = newNode': The 'temp' pointer advances forward from ${prevAddr} to ${nodeAddr}.`,
          whatHappeningBn: `'temp = newNode' এক্সিকিউট হলো: 'temp' পয়েন্টারটি পেছনের নোড (${prevAddr}) থেকে হেঁটে এসে নতুন নোডে (${nodeAddr}) দাঁড়াল।`,
          whyHappening: "By moving 'temp' to the new tail node, we prepare 'temp' for the next iteration to attach the next incoming node.",
          whyHappeningBn: "'temp' কে নতুন শেষ নোডে নিয়ে এলে পরের লুপে এসে পরবর্তী নোডটি জোড়া লাগানো সহজ হবে।",
          rememberTip: "'temp' acts as a trailing pointer that always stays at the current end of the list during creation.",
          rememberTipBn: "'temp' সবসময় বর্তমান লিস্টের শেষ নোডটিকে ধরে রাখে।",
        });
      }
    }

    // -------------------------------------------------------------
    // TRAVERSAL & PRINTING PHASE
    // -------------------------------------------------------------
    // Reset temp to head
    temp = head;

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      codeLine: 36,
      highlightLines: [36],
      phase: "traverse_init",
      title: "Traversal Phase: Resetting Temp Pointer (temp = head)",
      titleBn: "ট্রাভার্সাল শুরু: temp কে শুরুতে ফিরিয়ে আনা (temp = head)",
      codeSnippet: `// Print Linked List\ntemp = head; // temp = ${head}`,
      head,
      temp: head,
      newNode: null,
      currentLoopI: null,
      currentValue: null,
      heapNodes: [...heapNodes],
      activeNodeId: heapNodes[0]?.id || null,
      animatingPointer: null,
      outputStream: "",
      whatHappening: "Creation completed! Now we begin traversal to display the linked list. We reset 'temp = head' to point to Node 1.",
      whatHappeningBn: "সবগুলো নোড তৈরি শেষ! এবার লিস্ট প্রিন্ট করার জন্য 'temp = head' করে পয়েন্টারটিকে আবার একদম শুরুতে (Node 1) নিয়ে আসা হলো।",
      whyHappening: "We use 'temp' to traverse so that we do not modify or lose the original 'head' pointer.",
      whyHappeningBn: "আমরা 'head' পয়েন্টারকে নড়াই না, কারণ head সরে গেলে প্রথম নোডের ঠিকানা হারিয়ে যাবে। তাই 'temp' কে দিয়ে হাঁটাই।",
      rememberTip: "NEVER move 'head' for traversal unless you intend to destroy or shorten the list! Always use a temporary pointer like 'temp'.",
      rememberTipBn: "ভুল করেও ট্রাভার্সালে 'head' পয়েন্টার পরিবর্তন করবেন না! সবসময় 'temp' ব্যবহার করবেন।",
    });

    // Traverse each of the 5 nodes
    for (let j = 0; j < heapNodes.length; j++) {
      const curr = heapNodes[j];
      const nextAddr = curr.nextAddress;

      // Traversal Check
      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        codeLine: 38,
        highlightLines: [38],
        phase: "traverse_check",
        title: `Traversal Step ${j + 1}/5: While Condition (temp != nullptr)`,
        titleBn: `ট্রাভার্সাল ধাপ ${j + 1}/৫: লুপ কন্ডিশন চেক (temp != nullptr সত্য)`,
        codeSnippet: `while (temp != nullptr) // temp = ${curr.address} (TRUE)`,
        head,
        temp: curr.address,
        newNode: null,
        currentLoopI: null,
        currentValue: null,
        heapNodes: [...heapNodes],
        activeNodeId: curr.id,
        animatingPointer: null,
        outputStream,
        whatHappening: `Checking 'temp != nullptr': TRUE (temp = ${curr.address}). We have not reached the end of the list.`,
        whatHappeningBn: `'temp != nullptr' চেক: সত্য (কারণ temp এখন ${curr.address} এ আছে)। এখনো লিস্ট শেষ হয়নি।`,
        whyHappening: "The while loop continues running as long as 'temp' holds a valid node address.",
        whyHappeningBn: "যতক্ষণ temp এ কোনো নোডের ঠিকানা থাকবে, ততক্ষণ লুপটি চলবে।",
        rememberTip: "When temp reaches nullptr, we know we have visited every node in the linked list.",
        rememberTipBn: "temp যখন nullptr হবে, তখনই বোঝা যাবে সম্পূর্ণ লিস্ট শেষ হয়েছে।",
      });

      // Traversal Print
      outputStream += `${curr.data} -> `;

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        codeLine: 39,
        highlightLines: [39],
        phase: "traverse_print",
        title: `Traversal Step ${j + 1}/5: Printing Current Node Value (${curr.data})`,
        titleBn: `ট্রাভার্সাল ধাপ ${j + 1}/৫: বর্তমান নোডের ডেটা প্রিন্ট (${curr.data} ->)`,
        codeSnippet: `cout << temp->data << " -> "; // Output: "${outputStream}"`,
        head,
        temp: curr.address,
        newNode: null,
        currentLoopI: null,
        currentValue: null,
        heapNodes: [...heapNodes],
        activeNodeId: curr.id,
        animatingPointer: null,
        outputStream,
        whatHappening: `Accessing data field 'temp->data' (${curr.data}) and printing it to the console output stream.`,
        whatHappeningBn: `'temp->data' ডিরিফারেন্স করে বর্তমান নোডের মান (${curr.data}) কনসোলে প্রিন্ট করা হলো।`,
        whyHappening: "Using arrow operator 'temp->data' dereferences the pointer 'temp' and retrieves the integer value.",
        whyHappeningBn: "তীর চিহ্ন 'temp->data' দিয়ে মেমরি ঠিকানায় ঢুকে ভেতরের ডেটাটি তুলে আনা হয়।",
        rememberTip: "temp->data is shorthand syntax in C++ for (*temp).data.",
        rememberTipBn: "C++ এ 'temp->data' মানে হলো '(*temp).data'।",
      });

      // Traversal Advance: temp = temp->next
      temp = nextAddr;

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        codeLine: 40,
        highlightLines: [40],
        phase: "traverse_advance",
        title: `Traversal Step ${j + 1}/5: Advancing Pointer (temp = temp->next)`,
        titleBn: `ট্রাভার্সাল ধাপ ${j + 1}/৫: পয়েন্টারকে পরের নোডে এগিয়ে নেওয়া (temp = temp->next)`,
        codeSnippet: `temp = temp->next; // temp = ${nextAddr ?? "nullptr"}`,
        head,
        temp: nextAddr,
        newNode: null,
        currentLoopI: null,
        currentValue: null,
        heapNodes: [...heapNodes],
        activeNodeId: j + 1 < heapNodes.length ? heapNodes[j + 1].id : null,
        animatingPointer: null,
        outputStream,
        whatHappening: `Executing 'temp = temp->next': 'temp' is assigned address ${nextAddr ?? "nullptr"} (moving to the next node).`,
        whatHappeningBn: `'temp = temp->next' করা হলো: বর্তমান নোডের next ঘরে লেখা পরের ঠিকানাটি (${nextAddr ?? "nullptr"}) temp এ নেওয়া হলো এবং temp এক কদম এগিয়ে গেল।`,
        whyHappening: "Reading 'temp->next' allows the pointer to step forward along the singly linked chain.",
        whyHappeningBn: "এভাবেই লিংক ধরে ধরে পয়েন্টার সামনে এগিয়ে পুরো লিস্ট ঘুরে আসে।",
        rememberTip: "Traversal in a singly linked list is strictly one-way (unidirectional) from head toward nullptr.",
        rememberTipBn: "সিংগলি লিংকড লিস্টে শুধু এক দিকেই (সামনে) যাওয়া যায়, পেছনে ফেরার উপায় নেই।",
      });
    }

    // Traversal Terminate
    outputStream += "NULL";

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      codeLine: 43,
      highlightLines: [38, 43],
      phase: "complete",
      title: "Traversal Complete: Reached NULL Terminating Marker",
      titleBn: "ট্রাভার্সাল সম্পন্ন: NULL এ পৌঁছে আউটপুট সমাপ্ত",
      codeSnippet: `cout << "NULL" << endl;\nreturn 0;`,
      head,
      temp: null,
      newNode: null,
      currentLoopI: null,
      currentValue: null,
      heapNodes: [...heapNodes],
      activeNodeId: null,
      animatingPointer: null,
      outputStream,
      whatHappening: `temp == nullptr: While loop terminates! The program prints "NULL" and exits with return 0.`,
      whatHappeningBn: `temp == nullptr হলো: লুপটি শেষ হলো! স্ক্রিনে "NULL" প্রিন্ট হয়ে প্রোগ্রাম সফলভাবে রিটার্ন করল।`,
      whyHappening: "The entire linked list has been successfully created, populated, connected, and traversed in O(n) linear time.",
      whyHappeningBn: "অত্যন্ত দক্ষ O(n) সময়ে পুরো লিংকড লিস্টটি তৈরি এবং ডিসপ্লে করা সমাপ্ত হয়েছে।",
      rememberTip: "Congratulations! You have witnessed the complete lifecycle of a C++ Singly Linked List from memory allocation to traversal.",
      rememberTipBn: "অভিনন্দন! আপনি সি++ এ সিংগলি লিংকড লিস্টের মেমরি তৈরি থেকে শুরু করে ট্রাভার্সালের পুরো সাইকেলটি সফলভাবে দেখেছেন।",
    });

    // Assign indexed step counts
    return steps.map((s, idx) => ({
      ...s,
      stepIndex: idx,
      totalSteps: steps.length - 1,
    }));
  }, [inputValues]);

  const currentStep = simulationSteps[Math.min(currentStepIdx, simulationSteps.length - 1)] || simulationSteps[0];

  // Auto-play timer effect
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = 1700 / playbackSpeed;
      timerRef.current = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev >= simulationSteps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, simulationSteps.length]);

  const handleRestart = () => {
    setCurrentStepIdx(0);
    setIsPlaying(false);
  };

  const handleNextStep = () => {
    if (currentStepIdx < simulationSteps.length - 1) {
      setCurrentStepIdx((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx((prev) => prev - 1);
    }
  };

  const handleAnswerQuiz = (questionId: string, optionIndex: number) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const progressPercent = Math.round((currentStepIdx / Math.max(1, simulationSteps.length - 1)) * 100);

  return (
    <div className="rounded-2xl border border-primary/40 bg-card/95 backdrop-blur-xl p-4 sm:p-6 shadow-2xl text-foreground font-sans space-y-5 corner-flourish">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER: TITLE, BADGES, AND LANGUAGE TOGGLE */}
      {/* ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-border/70 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="p-1.5 rounded-lg bg-primary/15 text-primary border border-primary/30">
              <Share2 className="h-4 w-4" />
            </div>
            <h3 className="font-heading text-lg sm:text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <span>Singly Linked List Interactive Studio</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 font-bold">
                C++ Dynamic Memory Engine
              </span>
            </h3>
          </div>
          <p className="text-xs text-muted-foreground font-sans">
            {lang === "bn"
              ? "সহজ বাংলায় সি++ নোড স্ট্রাকচার, পয়েন্টার কানেকশন এবং মেমরির পরিবর্তন সরাসরি দেখুন।"
              : "Visualizing Node Structs ([data | next]), Pointer Connections (head, temp, newNode), and Heap Memory."}
          </p>
        </div>

        {/* Global Controls & Language Switcher */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {/* Language Toggle */}
          <div className="flex items-center rounded-xl border border-border bg-secondary/60 p-0.5 text-xs font-mono">
            <button
              onClick={() => setLang("bn")}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${lang === "bn"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
                }`}
              title="বাংলা ভাষায় ব্যাখ্যা"
            >
              <span>🇧🇩 বাংলা</span>
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${lang === "en"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
                }`}
              title="English Explanations"
            >
              <span>🇺🇸 EN</span>
            </button>
          </div>

          {/* Play/Pause Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={currentStep.phase === "complete" && currentStepIdx === simulationSteps.length - 1}
            className="btn-brass px-3.5 py-1.5 rounded-xl text-xs font-bold text-primary-foreground flex items-center gap-1.5 shadow-brass hover:scale-[1.02] active:scale-95 transition-all cursor-pointer disabled:opacity-40"
          >
            {isPlaying ? (
              <>
                <Pause className="h-3.5 w-3.5 fill-current" />
                <span>{lang === "bn" ? "পজ" : "Pause"}</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>{lang === "bn" ? "অটো প্লে" : "Auto Play"}</span>
              </>
            )}
          </button>

          {/* Stepping controls */}
          <div className="flex items-center rounded-xl border border-border bg-secondary/60 p-0.5">
            <button
              onClick={handlePrevStep}
              disabled={currentStepIdx === 0}
              className="p-1.5 rounded-lg hover:bg-secondary text-foreground transition-colors disabled:opacity-30 cursor-pointer"
              title={lang === "bn" ? "আগের ধাপ" : "Previous Step"}
            >
              <SkipBack className="h-3.5 w-3.5" />
            </button>
            <div className="px-2 text-[11px] font-mono font-bold text-muted-foreground border-x border-border/50">
              {currentStepIdx} / {simulationSteps.length - 1}
            </div>
            <button
              onClick={handleNextStep}
              disabled={currentStepIdx === simulationSteps.length - 1}
              className="p-1.5 rounded-lg hover:bg-secondary text-foreground transition-colors disabled:opacity-30 cursor-pointer"
              title={lang === "bn" ? "পরের ধাপ" : "Next Step"}
            >
              <SkipForward className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Reset Button */}
          <button
            onClick={handleRestart}
            className="p-2 rounded-xl border border-border bg-secondary hover:bg-secondary/80 text-foreground transition-colors cursor-pointer"
            title={lang === "bn" ? "রিসেট করুন" : "Restart Simulation"}
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          {/* Speed Selector */}
          <div className="flex items-center rounded-xl border border-border bg-secondary/60 p-0.5 text-[11px] font-mono">
            {[0.5, 1, 2].map((spd) => (
              <button
                key={spd}
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${playbackSpeed === spd
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. VALUE CUSTOMIZER & PRESET SCENARIO BAR */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 rounded-xl border border-border bg-secondary/30">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono font-semibold text-muted-foreground flex items-center gap-1">
            <Sliders className="h-3.5 w-3.5 text-primary" />
            {lang === "bn" ? "৫টি ইনপুট মান:" : "5 Input Values:"}
          </span>
          <div className="flex items-center gap-1.5">
            {tempInputs.map((val, idx) => (
              <input
                key={idx}
                type="number"
                value={val}
                onChange={(e) => {
                  const updated = [...tempInputs];
                  updated[idx] = e.target.value;
                  setTempInputs(updated);
                }}
                className="w-12 sm:w-14 px-1.5 py-1 text-center font-mono text-xs font-bold rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            ))}
            <button
              onClick={handleApplyCustomInputs}
              className="px-3 py-1 rounded-lg bg-primary/20 border border-primary/40 text-primary text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer shadow-xs"
            >
              {lang === "bn" ? "লিস্ট তৈরি করুন" : "Create List"}
            </button>
          </div>
        </div>

        {/* Quick Example Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-mono text-muted-foreground">{lang === "bn" ? "প্রিসেট:" : "Presets:"}</span>
          {PRESET_EXAMPLES.map((ex, i) => (
            <button
              key={i}
              onClick={() => handleSelectPreset(ex.values)}
              className="px-2 py-0.5 rounded text-[10px] font-mono font-medium border border-border/80 bg-card hover:border-primary/40 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
            >
              {ex.name.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. STEP PROGRESS & ACTION COMMENTARY BANNER */}
      {/* ========================================================================= */}
      <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl border bg-secondary/50 border-border/80 text-xs">
        <div className="flex items-center gap-2.5">
          {currentStep.phase === "complete" ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
          ) : (
            <Activity className="h-4 w-4 text-primary shrink-0 animate-pulse" />
          )}
          <div className="font-sans text-foreground leading-snug">
            <span className="font-mono font-bold text-primary mr-2 uppercase text-[11px]">
              {lang === "bn" ? currentStep.titleBn : currentStep.title}
            </span>
            <span className="text-muted-foreground block sm:inline mt-0.5 sm:mt-0">
              {lang === "bn" ? currentStep.whatHappeningBn : currentStep.whatHappening}
            </span>
          </div>
        </div>

        {/* Mini progress bar */}
        <div className="hidden sm:flex items-center gap-2 font-mono text-[10px] text-muted-foreground shrink-0">
          <span>{progressPercent}%</span>
          <div className="w-16 h-1.5 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary via-cyan-400 to-emerald-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. MAIN DUAL-PANE WORKBENCH */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* ===================================================================== */}
        {/* LEFT PANE (5 Cols): C++ CODE TRACER & POINTER REGISTERS */}
        {/* ===================================================================== */}
        <div className="lg:col-span-5 space-y-3.5 flex flex-col justify-between">
          {/* C++ Code Window */}
          <div className="rounded-xl border border-[#4A3F35] bg-[#14100D] overflow-hidden shadow-xl flex flex-col h-[380px]">
            <div className="flex items-center justify-between px-3.5 py-2 border-b border-[#4A3F35] bg-[#1C1714] text-xs font-mono">
              <span className="flex items-center gap-1.5 text-primary font-bold">
                <FileCode2 className="h-3.5 w-3.5 text-primary" />
                <span>main.cpp ({lang === "bn" ? "সি++ কোড এক্সিকিউশন" : "C++ Execution Tracer"})</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold">
                Line #{currentStep.codeLine}
              </span>
            </div>

            <div className="p-2 overflow-y-auto space-y-0.5 font-mono text-xs flex-1 scrollbar-thin">
              {CPP_SOURCE_CODE.map((lineObj) => {
                const isCurrent = lineObj.line === currentStep.codeLine;
                const isHighlighted = currentStep.highlightLines.includes(lineObj.line);

                return (
                  <div
                    key={lineObj.line}
                    className={`flex flex-col px-2 py-1 rounded transition-all font-mono text-[11px] ${isCurrent
                        ? "bg-primary/25 border-l-4 border-primary text-white font-bold shadow-brass-sm"
                        : isHighlighted
                          ? "bg-white/5 text-amber-200"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                  >
                    <div className="flex items-start">
                      <span className="w-6 text-slate-600 text-right mr-3 select-none text-[10px]">
                        {lineObj.line}
                      </span>
                      <span className="whitespace-pre flex-1">{lineObj.text}</span>
                      {isCurrent && (
                        <span className="shrink-0 px-1 py-0.2 rounded bg-emerald-500 text-white text-[8px] font-extrabold uppercase animate-pulse ml-1">
                          Active
                        </span>
                      )}
                    </div>
                    {/* Inline Bangla Explanation for Active Line */}
                    {isCurrent && lineObj.commentBn && (
                      <div className="pl-9 pt-0.5 text-[10px] text-amber-300 font-sans font-medium">
                        👉 {lineObj.commentBn}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Pointer & Variable Registers */}
          <div className="rounded-xl border border-border bg-card/80 p-3 shadow-sm space-y-2">
            <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
              <span className="text-xs font-mono font-bold text-foreground flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5 text-primary" />
                {lang === "bn" ? "স্ট্যাক ভ্যারিয়েবল ও পয়েন্টার:" : "Stack Variables & Pointers:"}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">{lang === "bn" ? "লাইভ মেমরি স্টেট" : "Memory State"}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2 font-mono text-xs">
              {/* head pointer */}
              <div className="p-2 rounded-lg border border-border bg-secondary/30 flex items-center justify-between">
                <span className="text-muted-foreground text-[11px]">head:</span>
                <span
                  className={`px-2 py-0.5 rounded border font-bold text-xs ${currentStep.head !== null
                      ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                      : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                    }`}
                >
                  {currentStep.head ?? "nullptr (0x0)"}
                </span>
              </div>

              {/* temp pointer */}
              <div className="p-2 rounded-lg border border-border bg-secondary/30 flex items-center justify-between">
                <span className="text-muted-foreground text-[11px]">temp:</span>
                <span
                  className={`px-2 py-0.5 rounded border font-bold text-xs ${currentStep.temp !== null
                      ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-400"
                      : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                    }`}
                >
                  {currentStep.temp ?? "nullptr (0x0)"}
                </span>
              </div>

              {/* newNode pointer */}
              <div className="p-2 rounded-lg border border-border bg-secondary/30 flex items-center justify-between">
                <span className="text-muted-foreground text-[11px]">newNode:</span>
                <span
                  className={`px-2 py-0.5 rounded border font-bold text-xs ${currentStep.newNode !== null
                      ? "bg-amber-500/20 border-amber-500/40 text-amber-300 animate-pulse"
                      : "bg-secondary text-muted-foreground border-border"
                    }`}
                >
                  {currentStep.newNode ?? "nullptr"}
                </span>
              </div>

              {/* loop i & value */}
              <div className="p-2 rounded-lg border border-border bg-secondary/30 flex items-center justify-between">
                <span className="text-muted-foreground text-[11px]">value / i:</span>
                <span className="px-2 py-0.5 rounded bg-primary/15 border border-primary/30 text-primary font-bold text-xs">
                  {currentStep.currentValue !== null ? `val: ${currentStep.currentValue}` : "—"} (i:{" "}
                  {currentStep.currentLoopI !== null ? currentStep.currentLoopI : "—"})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* RIGHT PANE (7 Cols): VISUAL LINKED LIST GRAPH & MEMORY VIEW */}
        {/* ===================================================================== */}
        <div className="lg:col-span-7 space-y-3.5">
          {/* View Mode Tabs (Visual Graph vs Bangla Beginner Guide vs Stack/Heap vs Theory) */}
          <div className="flex items-center justify-between border-b border-border/70 pb-2">
            <div className="flex items-center gap-1.5 font-mono text-xs flex-wrap">
              <button
                onClick={() => setActiveTab("visualizer")}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${activeTab === "visualizer"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground bg-secondary/40"
                  }`}
              >
                🔗 {lang === "bn" ? "ভিজ্যুয়াল গ্রাফ" : "Visual Graph"}
              </button>
              <button
                onClick={() => setActiveTab("bangla_guide")}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${activeTab === "bangla_guide"
                    ? "bg-amber-500 text-black shadow-xs font-extrabold"
                    : "text-amber-400 hover:text-amber-300 bg-amber-500/10 border border-amber-500/30"
                  }`}
              >
                🇧🇩 সহজ বাংলা গাইড
              </button>
              <button
                onClick={() => setActiveTab("memory")}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${activeTab === "memory"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground bg-secondary/40"
                  }`}
              >
                💾 {lang === "bn" ? "মেমরি ভিউ" : "Memory View"}
              </button>
              <button
                onClick={() => setActiveTab("theory")}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${activeTab === "theory"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground bg-secondary/40"
                  }`}
              >
                📖 {lang === "bn" ? "কমপ্লেক্সিটি" : "Complexity"}
              </button>
            </div>
          </div>

          {/* TAB 1: VISUAL LINKED LIST GRAPH */}
          {activeTab === "visualizer" && (
            <div className="space-y-3">
              {/* Visual Nodes Canvas */}
              <div className="rounded-xl border border-border bg-card/80 p-4 shadow-sm min-h-[200px] flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <span className="text-xs font-mono font-bold text-foreground flex items-center gap-1.5">
                    <Boxes className="h-3.5 w-3.5 text-primary" />
                    {lang === "bn" ? "লিংকড লিস্টের লাইভ ভিজ্যুয়ালাইজেশন:" : "Interactive Linked List Structure:"}
                  </span>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" /> Head
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-cyan-400 inline-block" /> Temp
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-amber-400 inline-block" /> NewNode
                    </span>
                  </div>
                </div>

                {/* Nodes Display Area with Animated Connectors */}
                <div className="overflow-x-auto py-4 scrollbar-thin">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-[540px]">
                    {/* Head Indicator Badge */}
                    <div className="flex flex-col items-center shrink-0">
                      <div className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono text-[11px] font-bold shadow-xs">
                        head
                      </div>
                      <div className="text-emerald-400 text-xs font-bold">↓</div>
                    </div>

                    {currentStep.heapNodes.length === 0 ? (
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 font-mono text-xs font-bold">
                          {lang === "bn" ? "NULL (লিস্টটি বর্তমানে খালি)" : "NULL (List is currently empty)"}
                        </span>
                      </div>
                    ) : (
                      currentStep.heapNodes.map((node, idx) => {
                        const isHead = currentStep.head === node.address;
                        const isTemp = currentStep.temp === node.address;
                        const isNewNode = currentStep.newNode === node.address;
                        const isActive = currentStep.activeNodeId === node.id;

                        return (
                          <React.Fragment key={node.id}>
                            {/* Visual Node Container [ data | next ] */}
                            <div className="flex flex-col items-center shrink-0 relative">
                              {/* Top Pointer Tags (head, temp, newNode) */}
                              <div className="h-5 flex items-center gap-1 mb-1">
                                {isTemp && (
                                  <span className="px-1.5 py-0.2 rounded bg-cyan-500 text-black text-[9px] font-mono font-bold animate-bounce shadow-xs">
                                    temp ↓
                                  </span>
                                )}
                                {isNewNode && (
                                  <span className="px-1.5 py-0.2 rounded bg-amber-500 text-black text-[9px] font-mono font-bold animate-pulse shadow-xs">
                                    newNode ↓
                                  </span>
                                )}
                              </div>

                              {/* The Double Compartment Node Card */}
                              <div
                                className={`flex rounded-xl border font-mono transition-all duration-300 shadow-md ${isActive
                                    ? "ring-2 ring-primary border-primary bg-primary/20 scale-105"
                                    : isTemp
                                      ? "ring-1 ring-cyan-400 border-cyan-400 bg-cyan-500/10"
                                      : "border-[#4A3F35] bg-[#14100D]"
                                  }`}
                              >
                                {/* Left Compartment: Data Field */}
                                <div className="px-3 py-2 border-r border-[#4A3F35] flex flex-col items-center justify-center min-w-[50px]">
                                  <span className="text-[9px] text-muted-foreground uppercase font-semibold">
                                    data
                                  </span>
                                  <span className="text-sm font-bold text-white mt-0.5">
                                    {node.data}
                                  </span>
                                </div>

                                {/* Right Compartment: Next Pointer Field */}
                                <div className="px-3 py-2 flex flex-col items-center justify-center min-w-[65px] bg-[#1C1714] rounded-r-xl">
                                  <span className="text-[9px] text-cyan-400 uppercase font-semibold">
                                    next
                                  </span>
                                  <div className="flex items-center gap-1 mt-0.5">
                                    <span className="h-2 w-2 rounded-full bg-cyan-400 inline-block" />
                                    <span className="text-[10px] text-slate-300 font-bold">
                                      {node.nextAddress ? node.nextAddress : "NULL"}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Bottom Memory Address Badge */}
                              <span className="text-[9px] font-mono text-slate-500 mt-1">
                                {node.address}
                              </span>
                            </div>

                            {/* Pointer Connecting Arrow */}
                            {idx < currentStep.heapNodes.length - 1 ? (
                              <div className="flex items-center px-1 text-primary shrink-0 animate-in fade-in">
                                <span className="h-[2px] w-4 bg-primary inline-block" />
                                <ArrowRight className="h-3.5 w-3.5 -ml-1 text-primary" />
                              </div>
                            ) : (
                              <div className="flex items-center px-1 text-muted-foreground shrink-0">
                                <span className="h-[2px] w-4 bg-border inline-block" />
                                <ArrowRight className="h-3.5 w-3.5 -ml-1 text-muted-foreground" />
                                <span className="px-2 py-1 rounded bg-rose-500/15 border border-rose-500/30 text-rose-400 font-mono text-xs font-bold ml-1">
                                  NULL
                                </span>
                              </div>
                            )}
                          </React.Fragment>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Console Output Stream Terminal */}
              <div className="rounded-xl border border-[#4A3F35] bg-[#14100D] p-3 shadow-inner">
                <div className="flex items-center justify-between border-b border-[#4A3F35]/70 pb-1.5 mb-2 font-mono text-xs">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Terminal className="h-3 w-3 text-emerald-400" />
                    {lang === "bn" ? "কনসোল আউটপুট (cout):" : "Standard Output Stream (cout):"}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold">Live Stream</span>
                </div>
                <div className="font-mono text-xs text-emerald-400 bg-black/50 p-2.5 rounded-lg border border-emerald-500/20 min-h-[36px] flex items-center">
                  <span>
                    &gt; {currentStep.outputStream || (lang === "bn" ? "প্রিন্ট আউটের অপেক্ষায়..." : "Awaiting print execution...")}
                  </span>
                  {currentStep.phase.startsWith("traverse") && (
                    <span className="inline-block w-2 h-3.5 bg-emerald-400 ml-1 animate-pulse" />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 🇧🇩 সহজ বাংলা গাইড (LINE-BY-LINE BEGINNER GUIDE) */}
          {activeTab === "bangla_guide" && (
            <div className="rounded-xl border border-amber-500/40 bg-[#17120E] p-4 space-y-4 shadow-xl text-xs font-sans text-foreground leading-relaxed max-h-[420px] overflow-y-auto scrollbar-thin">
              <div className="flex items-center gap-2 border-b border-amber-500/30 pb-2.5">
                <Compass className="h-4 w-4 text-amber-400" />
                <h4 className="font-heading text-sm font-bold text-amber-300">
                  সহজ বাংলায় সিংগলি লিংকড লিস্টের লাইন-বাই-লাইন পোস্টমর্টেম ও ব্যাখ্যা
                </h4>
              </div>

              {/* Point 1: Node Struct */}
              <div className="p-3 rounded-xl border border-border bg-card/60 space-y-1.5">
                <span className="font-bold text-amber-400 font-mono text-[11px] flex items-center gap-1">
                  <Boxes className="h-3.5 w-3.5 text-amber-400" />
                  ১. Node কী এবং কেন struct Node তৈরি করা হলো? (লাইন ৪-৭)
                </span>
                <p className="text-muted-foreground text-[11px]">
                  একটি নোড হলো একটি <strong>দুটি কুঠুরির বাক্স</strong>। সাধারণ <code className="text-primary font-mono">int</code> ভ্যারিয়েবল শুধু একটি সংখ্যা মনে রাখতে পারে। কিন্তু লিংকড লিস্টে একটি নোডকে তার <strong>নিজের সংখ্যা (data)</strong> এবং <strong>পরের নোডের ঠিকানা (next pointer)</strong> দুটোই মনে রাখতে হয়। এজন্য <code className="text-cyan-400 font-mono">struct Node</code> বানানো হয়েছে।
                </p>
              </div>

              {/* Point 2: head & temp */}
              <div className="p-3 rounded-xl border border-border bg-card/60 space-y-1.5">
                <span className="font-bold text-emerald-400 font-mono text-[11px] flex items-center gap-1">
                  <Cpu className="h-3.5 w-3.5 text-emerald-400" />
                  ২. head এবং temp পয়েন্টার কেন দরকার? (লাইন ১০-১১)
                </span>
                <p className="text-muted-foreground text-[11px]">
                  • <strong>head (ইঞ্জিন):</strong> এটি লিংকড লিস্টের একদম প্রথম নোডটির মেমরি অ্যাড্রেস ধরে রাখে। <em>head হারিয়ে গেলে পুরো লিস্টটাই মেমরিতে হারিয়ে যাবে!</em><br />
                  • <strong>temp (সহকারী কুলি):</strong> নতুন বগি জোড়া লাগানোর জন্য এবং লিস্ট প্রিন্ট করার জন্য আমরা <code className="text-cyan-400 font-mono">temp</code> কে সামনে-পেছনে হাঁটাই, যাতে <code className="text-emerald-400 font-mono">head</code> কখনো নিজের জায়গা না হারায়।
                </p>
              </div>

              {/* Point 3: new Node() */}
              <div className="p-3 rounded-xl border border-border bg-card/60 space-y-1.5">
                <span className="font-bold text-cyan-400 font-mono text-[11px] flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5 text-cyan-400" />
                  ৩. new Node() কী করে? (লাইন ১৮)
                </span>
                <p className="text-muted-foreground text-[11px]">
                  <code className="text-cyan-400 font-mono">new Node()</code> কম্পিউটারের হিপ (Heap) মেমরিতে একটি ব্র্যান্ড নিউ নোডের জায়গা বরাদ্দ করে এবং তার মেমরি ঠিকানা (যেমন <code>0x1000</code>) ফেরত দেয়। সেই ঠিকানাটি আমরা <code className="text-amber-400 font-mono">newNode</code> পয়েন্টারে রেখে দিই।
                </p>
              </div>

              {/* Point 4: if (head == nullptr) */}
              <div className="p-3 rounded-xl border border-border bg-card/60 space-y-1.5">
                <span className="font-bold text-pink-400 font-mono text-[11px] flex items-center gap-1">
                  <Layers className="h-3.5 w-3.5 text-pink-400" />
                  ৪. if (head == nullptr) কেন লাগে? (লাইন ২৪-২৬)
                </span>
                <p className="text-muted-foreground text-[11px]">
                  লিস্ট যখন একদম খালি থাকে, তখন এই প্রথম নোডটিই আমাদের লিস্টের প্রধান বা <code className="text-emerald-400 font-mono">head</code>। তাই <code className="text-emerald-400 font-mono">head = newNode; temp = newNode;</code> করে head ও temp দুটোকেই এই প্রথম নোডে দাঁড় করিয়ে দেওয়া হয়।
                </p>
              </div>

              {/* Point 5: temp->next = newNode vs temp = newNode */}
              <div className="p-3 rounded-xl border border-border bg-card/60 space-y-1.5">
                <span className="font-bold text-amber-300 font-mono text-[11px] flex items-center gap-1">
                  <LinkIcon className="h-3.5 w-3.5 text-amber-300" />
                  ৫. সবচেয়ে গুরুত্বপূর্ণ দুটি লাইন: temp-&gt;next = newNode এবং temp = newNode (লাইন ৩০-৩১)
                </span>
                <p className="text-muted-foreground text-[11px]">
                  বিগিনাররা এই দুই লাইনে সবচেয়ে বেশি কনফিউজড হয়! সহজ কথায়:<br />
                  • <strong><code>temp-&gt;next = newNode;</code></strong> $\rightarrow$ আগের নোডের হাতের সাথে নতুন নোডের হাত জোড়া লাগিয়ে দেওয়া (পয়েন্টার কানেকশন তৈরি)।<br />
                  • <strong><code>temp = newNode;</code></strong> $\rightarrow$ <code className="text-cyan-400 font-mono">temp</code> নিজে হেঁটে এসে নতুন নোডের উপর দাঁড়াল, যাতে পরের বার আবার নতুন নোড আসলে তাকে জোড়া লাগানো যায়।
                </p>
              </div>

              {/* Point 6: Traversal */}
              <div className="p-3 rounded-xl border border-border bg-card/60 space-y-1.5">
                <span className="font-bold text-emerald-300 font-mono text-[11px] flex items-center gap-1">
                  <Terminal className="h-3.5 w-3.5 text-emerald-300" />
                  ৬. temp = head এবং while (temp != nullptr) ট্রাভার্সাল (লাইন ৩৬-৪১)
                </span>
                <p className="text-muted-foreground text-[11px]">
                  সব নোড জোড়া লাগানো শেষ হলে, প্রিন্ট করার জন্য আমরা <code className="text-cyan-400 font-mono">temp = head</code> দিয়ে আবার একদম শুরুতে আসি। এরপর লুপ চালিয়ে <code className="text-primary font-mono">temp-&gt;data</code> প্রিন্ট করি এবং <code className="text-cyan-400 font-mono">temp = temp-&gt;next</code> দিয়ে এক কদম করে সামনে হেঁটে যাই যতক্ষণ না <code className="text-rose-400 font-mono">nullptr</code> পাওয়া যায়!
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: STACK & HEAP MEMORY VIEW */}
          {activeTab === "memory" && (
            <div className="rounded-xl border border-border bg-card/80 p-4 space-y-4 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* STACK FRAME */}
                <div className="space-y-2 rounded-xl border border-border/80 bg-secondary/30 p-3">
                  <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
                    <span className="text-xs font-mono font-bold text-foreground flex items-center gap-1">
                      <Cpu className="h-3.5 w-3.5 text-primary" />
                      STACK (main frame):
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">{lang === "bn" ? "লোকাল ভ্যারিয়েবল" : "Fixed Pointers"}</span>
                  </div>

                  <div className="space-y-1.5 font-mono text-xs">
                    <div className="flex items-center justify-between p-1.5 rounded bg-card border border-border/60">
                      <span className="text-muted-foreground">head:</span>
                      <span className="text-emerald-400 font-bold">
                        {currentStep.head ?? "nullptr (0x0)"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-1.5 rounded bg-card border border-border/60">
                      <span className="text-muted-foreground">temp:</span>
                      <span className="text-cyan-400 font-bold">
                        {currentStep.temp ?? "nullptr (0x0)"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-1.5 rounded bg-card border border-border/60">
                      <span className="text-muted-foreground">newNode:</span>
                      <span className="text-amber-300 font-bold">
                        {currentStep.newNode ?? "nullptr (0x0)"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-1.5 rounded bg-card border border-border/60">
                      <span className="text-muted-foreground">value:</span>
                      <span className="text-primary font-bold">
                        {currentStep.currentValue !== null ? currentStep.currentValue : "—"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* HEAP MEMORY POOL */}
                <div className="space-y-2 rounded-xl border border-border/80 bg-secondary/30 p-3">
                  <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
                    <span className="text-xs font-mono font-bold text-foreground flex items-center gap-1">
                      <Database className="h-3.5 w-3.5 text-cyan-400" />
                      HEAP (Dynamic Storage):
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {currentStep.heapNodes.length} Allocated Nodes
                    </span>
                  </div>

                  <div className="space-y-1.5 font-mono text-xs max-h-[160px] overflow-y-auto scrollbar-thin">
                    {currentStep.heapNodes.length === 0 ? (
                      <span className="text-xs text-muted-foreground italic">No heap memory allocated yet.</span>
                    ) : (
                      currentStep.heapNodes.map((n) => (
                        <div
                          key={n.id}
                          className="p-1.5 rounded bg-card border border-border/60 flex items-center justify-between text-[11px]"
                        >
                          <span className="text-cyan-400 font-bold">{n.address}:</span>
                          <span className="text-slate-300">
                            struct Node &#123; data: <b>{n.data}</b>, next:{" "}
                            <b>{n.nextAddress ?? "nullptr"}</b> &#125;
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PEDAGOGICAL THEORY & COMPLEXITY */}
          {activeTab === "theory" && (
            <div className="rounded-xl border border-border bg-card/80 p-4 space-y-3 shadow-sm text-xs leading-relaxed">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-sans">
                <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-1.5">
                  <span className="font-bold text-emerald-400 font-mono flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    {lang === "bn" ? "লিস্ট তৈরির কমপ্লেক্সিটি:" : "Creation Complexity:"}
                  </span>
                  <p className="text-muted-foreground">
                    <strong>Time: O(n)</strong> — {lang === "bn" ? "প্রতিটি নোড new Node() দিয়ে তৈরি এবং temp পয়েন্টারের মাধ্যমে O(1) কনস্ট্যান্ট টাইমে লেজে জোড়া লাগানো হয়।" : "Each of the 5 nodes is allocated with new Node() and appended in O(1) constant time at the tail pointed by temp."}
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Space: O(n)</strong> — {lang === "bn" ? "হিপ মেমরিতে মোট n সংখ্যক নোড তৈরি হয়।" : "Exactly n Node structs are allocated on the Heap."}
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-cyan-500/30 bg-cyan-500/5 space-y-1.5">
                  <span className="font-bold text-cyan-400 font-mono flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-cyan-500" />
                    {lang === "bn" ? "ট্রাভার্সাল কমপ্লেক্সিটি:" : "Traversal Complexity:"}
                  </span>
                  <p className="text-muted-foreground">
                    <strong>Time: O(n)</strong> — {lang === "bn" ? "পয়েন্টার head থেকে শুরু করে NULL পর্যন্ত প্রতিটি নোড একবার করে ভিজিট করে।" : "The pointer visits each node exactly once from head to NULL."}
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Auxiliary Space: O(1)</strong> — {lang === "bn" ? "অতিরিক্ত শুধু একটি পয়েন্টার ভ্যারিয়েবল (temp) ব্যবহার করা হয়।" : "Uses only a single pointer variable temp."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Educational Step Callout ("What?", "Why?", "Remember") */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-sans">
            <div className="p-2.5 rounded-xl border border-border bg-card/60 space-y-1">
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                <Info className="h-3 w-3" />
                {lang === "bn" ? "কী ঘটছে?" : "What is happening?"}
              </span>
              <p className="text-muted-foreground text-[11px] leading-snug">
                {lang === "bn" ? currentStep.whatHappeningBn : currentStep.whatHappening}
              </p>
            </div>

            <div className="p-2.5 rounded-xl border border-border bg-card/60 space-y-1">
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Lightbulb className="h-3 w-3" />
                {lang === "bn" ? "কেন করা হলো?" : "Why is this done?"}
              </span>
              <p className="text-muted-foreground text-[11px] leading-snug">
                {lang === "bn" ? currentStep.whyHappeningBn : currentStep.whyHappening}
              </p>
            </div>

            <div className="p-2.5 rounded-xl border border-border bg-card/60 space-y-1">
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                {lang === "bn" ? "মনে রাখবেন" : "Remember"}
              </span>
              <p className="text-muted-foreground text-[11px] leading-snug">
                {lang === "bn" ? currentStep.rememberTipBn : currentStep.rememberTip}
              </p>
            </div>
          </div>

          {/* Interactive Checkpoint Quiz Card (if active step has a quiz question) */}
          {currentStep.quizQuestion && (
            <div className="rounded-xl border border-primary/40 bg-primary/5 p-3.5 space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center justify-between border-b border-primary/20 pb-1.5">
                <span className="text-xs font-mono font-bold text-primary flex items-center gap-1.5">
                  <HelpCircle className="h-3.5 w-3.5 text-primary" />
                  {lang === "bn" ? "সহজ কুইজ ও কনসেপ্ট চেক:" : "Quick Concept Check:"}
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">{lang === "bn" ? "অনুশীলন" : "Interactive Practice"}</span>
              </div>

              <p className="text-xs font-semibold text-foreground">
                {lang === "bn" ? currentStep.quizQuestion.questionBn : currentStep.quizQuestion.question}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs font-sans">
                {(lang === "bn" ? currentStep.quizQuestion.optionsBn : currentStep.quizQuestion.options).map((opt, oIdx) => {
                  const qId = currentStep.quizQuestion!.id;
                  const selected = quizAnswers[qId] === oIdx;
                  const isCorrect = oIdx === currentStep.quizQuestion!.correctIndex;
                  const isAnswered = quizAnswers[qId] !== undefined && quizAnswers[qId] !== null;

                  let optClass = "bg-card border-border hover:bg-secondary/70 text-foreground";
                  if (isAnswered) {
                    if (selected && isCorrect) {
                      optClass = "bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold";
                    } else if (selected && !isCorrect) {
                      optClass = "bg-rose-500/20 border-rose-500 text-rose-400 font-bold";
                    } else if (isCorrect) {
                      optClass = "bg-emerald-500/10 border-emerald-500/40 text-emerald-400";
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleAnswerQuiz(qId, oIdx)}
                      className={`p-2 rounded-lg border text-left transition-all cursor-pointer text-[11px] leading-snug ${optClass}`}
                    >
                      <span className="font-mono font-bold mr-1.5">
                        {String.fromCharCode(65 + oIdx)}.
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {quizAnswers[currentStep.quizQuestion.id] !== undefined && (
                <p className="text-[11px] font-sans text-muted-foreground pt-1 border-t border-primary/10">
                  {lang === "bn" ? currentStep.quizQuestion.explanationBn : currentStep.quizQuestion.explanation}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. SUCCESS SUMMARY FOOTER */}
      {/* ========================================================================= */}
      {currentStep.phase === "complete" && (
        <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              {lang === "bn" ? "লিংকড লিস্ট সফলভাবে তৈরি ও ট্রাভার্সাল সমাপ্ত!" : "LINKED LIST CREATED & TRAVERSED SUCCESSFULLY!"}
            </span>
            <p className="text-xs text-muted-foreground">
              {lang === "bn" ? "আউটপুট রেজাল্ট:" : "Result:"} <code className="text-emerald-400 font-mono font-bold">{currentStep.outputStream}</code>
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">
              ✓ 5 Nodes Linked
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-primary/20 border border-primary/40 text-primary font-bold">
              ✓ O(n) Traversal Complete
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
