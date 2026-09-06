/**
 * AlgoHub Singly Linked List Engine
 *
 * Implements pure, stateful pointer operations with granular step snapshots:
 * - Insert at Head (O(1)) - Granular: Allocate -> newNode.next = head -> head = newNode
 * - Insert at Tail (O(n)) - Granular: Allocate -> Sequential Traversal -> tail.next = newNode
 * - Delete by Value (O(n)) - Granular: Traversal -> Match Highlight -> Pointer Bypass -> Deallocate
 * - Search by Value (O(n)) - Granular: Node-by-Node Inspection -> Found / Not Found Report
 *
 * Features persistent heap memory addresses (0xXXXX) that remain consistent
 * across all visualizer views and animation frames.
 */

export interface LinkedListNode {
  id: string;
  val: number;
  address: string; // Persistent 4-hex address e.g. "0x02A1"
  nextId: string | null;
}

export interface LinkedListState {
  nodes: Record<string, LinkedListNode>;
  headId: string | null;
  count: number;
}

export type OperationType = "insert-head" | "insert-tail" | "insert-position" | "delete" | "search" | "init" | "reset" | "clear";

export interface LinkedListStep {
  state: LinkedListState;
  stagedNode: LinkedListNode | null; // Node currently being allocated/staged before integration
  activeNodeId: string | null; // Current node being traversed or inspected
  targetNodeId: string | null; // Node matching search, targeted for deletion, or target of new link
  predecessorNodeId: string | null; // Previous node in traversal/deletion
  modifiedPointer: "head" | "next" | "staged.next" | null; // Which pointer is changing
  pointerSourceAddress: string | null;
  pointerTargetAddress: string | null;
  bypassedNodeId: string | null; // Target node visually bypassed during pointer splicing
  description: string;
  subStepLabel: string; // e.g. "Step 1/3: Allocate newNode"
  codeSnippetKey: "insertAtHead" | "insertAtTail" | "insertAtPosition" | "deleteValue" | "search";
  codeLine: number | null; // 1-indexed line number in the active C++ function
  status: "idle" | "allocating" | "traversing" | "linking" | "updating-head" | "found" | "not-found" | "inserted" | "deleted";
  stats?: {
    nodesChecked: number;
    found: boolean;
    position?: number;
    actualComplexity: string;
    worstCaseComplexity: string;
  };
}

// Session-level pool of used memory addresses.
// A node's address is assigned upon creation and remains persistent for its lifetime.
// Freed addresses are NOT reused in the same session to reflect true pedagogical realism.
const usedAddresses = new Set<string>();

// Pre-seed known clean addresses for default initial nodes to match teaching diagrams
const INITIAL_ADDRESSES = ["0x02A1", "0x01C4", "0x02F8", "0x03E2"];

export function generateUniqueAddress(): string {
  let addr: string;
  let attempts = 0;
  do {
    const hex = Math.floor(0x1000 + Math.random() * 0xefff)
      .toString(16)
      .toUpperCase();
    addr = `0x${hex}`;
    attempts++;
  } while (usedAddresses.has(addr) && attempts < 1000);

  usedAddresses.add(addr);
  return addr;
}

let nextNodeCounter = 1;
export function generateNodeId(): string {
  return `node_${Date.now()}_${nextNodeCounter++}`;
}

export function createInitialList(values: number[] = [14, 28, 42, 60]): LinkedListState {
  const nodes: Record<string, LinkedListNode> = {};
  let headId: string | null = null;
  let prevId: string | null = null;

  for (let i = 0; i < values.length; i++) {
    const id = `node_init_${i + 1}`;
    // Use initial address if available, otherwise generate fresh
    let address = INITIAL_ADDRESSES[i];
    if (!address || usedAddresses.has(address)) {
      address = generateUniqueAddress();
    } else {
      usedAddresses.add(address);
    }

    nodes[id] = { id, val: values[i], address, nextId: null };
    if (i === 0) {
      headId = id;
    } else if (prevId) {
      nodes[prevId].nextId = id;
    }
    prevId = id;
  }

  return { nodes, headId, count: values.length };
}

/**
 * Returns ordered array of node objects starting from head
 */
export function getOrderedNodes(state: LinkedListState): LinkedListNode[] {
  const result: LinkedListNode[] = [];
  const visited = new Set<string>();
  let currId = state.headId;

  while (currId && !visited.has(currId) && state.nodes[currId]) {
    visited.add(currId);
    const node = state.nodes[currId];
    result.push(node);
    currId = node.nextId;
  }

  return result;
}

/**
 * C++ Reference snippets for each operation
 */
export const OPERATION_CODE_SNIPPETS = {
  insertAtHead: `void insertAtHead(int val) {
    Node* newNode = new Node(val);
    newNode->next = head;
    head = newNode;
}`,
  insertAtTail: `void insertAtTail(int val) {
    Node* newNode = new Node(val);
    if (!head) { head = newNode; return; }
    Node* curr = head;
    while (curr->next) curr = curr->next;
    curr->next = newNode;
}`,
  insertAtPosition: `void insertAtPosition(Node*& head, int value, int position) {
    if (position < 0) return;
    if (position == 0) {
        Node* newNode = new Node(value);
        newNode->next = head;
        head = newNode;
        return;
    }
    Node* predecessor = head;
    for (int i = 0; i < position - 1; i++) {
        if (predecessor == nullptr) return;
        predecessor = predecessor->next;
    }
    if (predecessor == nullptr) return;
    Node* newNode = new Node(value);
    newNode->next = predecessor->next;
    predecessor->next = newNode;
}`,
  deleteValue: `bool deleteValue(int val) {
    if (!head) return false;
    if (head->val == val) {
        Node* temp = head; head = head->next;
        delete temp; return true;
    }
    Node* curr = head;
    while (curr->next && curr->next->val != val) {
        curr = curr->next;
    }
    if (!curr->next) return false;
    Node* temp = curr->next;
    curr->next = curr->next->next;
    delete temp; return true;
}`,
  search: `bool search(int val) {
    Node* curr = head;
    while (curr) {
        if (curr->val == val) return true;
        curr = curr->next;
    }
    return false;
}`,
};

export interface OperationComplexityInfo {
  name: string;
  timeComplexity: string;
  spaceComplexity: string;
  whyExplanation: string;
}

export const OPERATION_COMPLEXITY_INFO: Record<OperationType, OperationComplexityInfo> = {
  "insert-head": {
    name: "Insert at Head",
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    whyExplanation:
      "Only the HEAD pointer and the newNode->next pointer need to be updated. Zero existing elements shift in memory.",
  },
  "insert-tail": {
    name: "Insert at Tail",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    whyExplanation:
      "Without a direct tail pointer, the list must be traversed sequentially from HEAD across all n nodes to locate the end.",
  },
  "insert-position": {
    name: "Insert at Position",
    timeComplexity: "O(n) worst-case",
    spaceComplexity: "O(1)",
    whyExplanation:
      "Traverses sequentially from HEAD to locate the predecessor node at (position - 1) in O(position) time, followed by strictly O(1) two-pointer rewiring (newNode->next then predecessor->next). If position=0, no traversal is needed: strictly O(1).",
  },
  "delete": {
    name: "Delete by Value",
    timeComplexity: "O(n) worst-case",
    spaceComplexity: "O(1)",
    whyExplanation:
      "Sequential traversal is needed to locate the target node and its predecessor (O(n)). Once located, pointer splicing (prev->next = curr->next) takes strictly O(1).",
  },
  "search": {
    name: "Search by Value",
    timeComplexity: "O(n) worst-case",
    spaceComplexity: "O(1)",
    whyExplanation:
      "Linked lists do not support random index access (arr[i]). Each node must be inspected one-by-one by dereferencing next pointers.",
  },
  "init": {
    name: "Linked List Initialized",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    whyExplanation: "Allocated initial chain of heap nodes linked sequentially via forward next pointers.",
  },
  "reset": {
    name: "Reset to Default",
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    whyExplanation: "Re-established the canonical 4-node benchmark list.",
  },
  "clear": {
    name: "Clear All Nodes",
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    whyExplanation: "HEAD set to nullptr. Memory freed.",
  },
};

/**
 * Inserts a value at head: O(1) Time
 * Granular Steps:
 * 1. Allocate newNode(val) with next = NULL
 * 2. Set newNode->next = head
 * 3. Set head = newNode
 */
export function insertAtHead(
  state: LinkedListState,
  val: number
): { newState: LinkedListState; steps: LinkedListStep[] } {
  const newId = generateNodeId();
  const address = generateUniqueAddress();
  const currentHeadNode = state.headId ? state.nodes[state.headId] : null;

  const stagedNode: LinkedListNode = {
    id: newId,
    val,
    address,
    nextId: null,
  };

  const finalNode: LinkedListNode = {
    ...stagedNode,
    nextId: state.headId,
  };

  const finalNodes = {
    ...state.nodes,
    [newId]: finalNode,
  };

  const finalState: LinkedListState = {
    nodes: finalNodes,
    headId: newId,
    count: state.count + 1,
  };

  const steps: LinkedListStep[] = [
    // Step 1: Allocate newNode
    {
      state: { ...state },
      stagedNode: { ...stagedNode },
      activeNodeId: newId,
      targetNodeId: null,
      predecessorNodeId: null,
      modifiedPointer: null,
      pointerSourceAddress: null,
      pointerTargetAddress: null,
      bypassedNodeId: null,
      description: `Step 1/3: Allocated new heap node containing value ${val} at memory address ${address}. Initialized next = nullptr.`,
      subStepLabel: `Step 1/3: Node* newNode = new Node(${val});`,
      codeSnippetKey: "insertAtHead",
      codeLine: 2,
      status: "allocating",
    },
    // Step 2: newNode->next = head
    {
      state: { ...state },
      stagedNode: { ...stagedNode, nextId: state.headId },
      activeNodeId: newId,
      targetNodeId: state.headId,
      predecessorNodeId: null,
      modifiedPointer: "staged.next",
      pointerSourceAddress: address,
      pointerTargetAddress: currentHeadNode ? currentHeadNode.address : "NULL",
      bypassedNodeId: null,
      description: `Step 2/3: Assigned newNode->next = HEAD (${currentHeadNode ? currentHeadNode.address : "nullptr"}). New node is now pointed toward the existing chain.`,
      subStepLabel: `Step 2/3: newNode->next = head;`,
      codeSnippetKey: "insertAtHead",
      codeLine: 3,
      status: "linking",
    },
    // Step 3: head = newNode
    {
      state: finalState,
      stagedNode: null,
      activeNodeId: newId,
      targetNodeId: newId,
      predecessorNodeId: null,
      modifiedPointer: "head",
      pointerSourceAddress: "HEAD",
      pointerTargetAddress: address,
      bypassedNodeId: null,
      description: `Step 3/3: Updated HEAD pointer to point to newNode (${address}). Prepend complete in strictly O(1) time without shifting any elements!`,
      subStepLabel: `Step 3/3: head = newNode; [Complete ✓]`,
      codeSnippetKey: "insertAtHead",
      codeLine: 4,
      status: "inserted",
    },
  ];

  return { newState: finalState, steps };
}

/**
 * Inserts a value at tail: O(n) Time
 * Granular Steps:
 * 1. Allocate newNode(val)
 * 2..k. Sequential traversal from HEAD to find node with next == nullptr
 * k+1. Link tail->next = newNode
 */
export function insertAtTail(
  state: LinkedListState,
  val: number
): { newState: LinkedListState; steps: LinkedListStep[] } {
  const newId = generateNodeId();
  const address = generateUniqueAddress();

  const stagedNode: LinkedListNode = {
    id: newId,
    val,
    address,
    nextId: null,
  };

  // If list is currently empty
  if (!state.headId) {
    const finalState: LinkedListState = {
      nodes: { [newId]: stagedNode },
      headId: newId,
      count: 1,
    };
    return {
      newState: finalState,
      steps: [
        {
          state,
          stagedNode: { ...stagedNode },
          activeNodeId: newId,
          targetNodeId: null,
          predecessorNodeId: null,
          modifiedPointer: null,
          pointerSourceAddress: null,
          pointerTargetAddress: null,
          bypassedNodeId: null,
          description: `Step 1/2: Allocated new node(${val}) at ${address}. List was empty.`,
          subStepLabel: `Step 1/2: Node* newNode = new Node(${val});`,
          codeSnippetKey: "insertAtTail",
          codeLine: 2,
          status: "allocating",
        },
        {
          state: finalState,
          stagedNode: null,
          activeNodeId: newId,
          targetNodeId: newId,
          predecessorNodeId: null,
          modifiedPointer: "head",
          pointerSourceAddress: "HEAD",
          pointerTargetAddress: address,
          bypassedNodeId: null,
          description: `Step 2/2: Assigned HEAD = newNode (${address}). Tail insertion complete!`,
          subStepLabel: `Step 2/2: head = newNode; [Complete ✓]`,
          codeSnippetKey: "insertAtTail",
          codeLine: 3,
          status: "inserted",
        },
      ],
    };
  }

  const steps: LinkedListStep[] = [];

  // Step 1: Allocate newNode
  steps.push({
    state: { ...state },
    stagedNode: { ...stagedNode },
    activeNodeId: newId,
    targetNodeId: null,
    predecessorNodeId: null,
    modifiedPointer: null,
    pointerSourceAddress: null,
    pointerTargetAddress: null,
    bypassedNodeId: null,
    description: `Step 1: Allocated new node containing value ${val} at address ${address}. Next: traverse from HEAD to find the tail node.`,
    subStepLabel: `Step 1: Node* newNode = new Node(${val});`,
    codeSnippetKey: "insertAtTail",
    codeLine: 2,
    status: "allocating",
  });

  // Step 2: Initialize curr = head
  let currId: string | null = state.headId;
  let hop = 1;

  steps.push({
    state: { ...state },
    stagedNode: { ...stagedNode },
    activeNodeId: currId,
    targetNodeId: null,
    predecessorNodeId: null,
    modifiedPointer: null,
    pointerSourceAddress: null,
    pointerTargetAddress: null,
    bypassedNodeId: null,
    description: `Step 2: Started traversal at HEAD (${state.nodes[currId].address}). Initialized curr pointer.`,
    subStepLabel: `Step 2: Node* curr = head;`,
    codeSnippetKey: "insertAtTail",
    codeLine: 4,
    status: "traversing",
  });

  // Traversal loop to find tail
  while (currId) {
    const currNode: LinkedListNode = state.nodes[currId];
    if (!currNode.nextId) {
      // Found tail!
      steps.push({
        state: { ...state },
        stagedNode: { ...stagedNode },
        activeNodeId: currId,
        targetNodeId: null,
        predecessorNodeId: null,
        modifiedPointer: null,
        pointerSourceAddress: null,
        pointerTargetAddress: null,
        bypassedNodeId: null,
        description: `Inspecting Node #${hop} (${currNode.address}): next == nullptr. Found the tail node! Ready to link.`,
        subStepLabel: `Tail Found: curr->next == nullptr at Node #${hop}`,
        codeSnippetKey: "insertAtTail",
        codeLine: 5,
        status: "traversing",
      });
      break;
    }

    // Advance forward
    steps.push({
      state: { ...state },
      stagedNode: { ...stagedNode },
      activeNodeId: currId,
      targetNodeId: currNode.nextId,
      predecessorNodeId: null,
      modifiedPointer: null,
      pointerSourceAddress: null,
      pointerTargetAddress: null,
      bypassedNodeId: null,
      description: `Inspecting Node #${hop} (${currNode.address}): next points to ${state.nodes[currNode.nextId]?.address}. Traversing forward...`,
      subStepLabel: `Traversing: curr = curr->next; (Hop #${hop})`,
      codeSnippetKey: "insertAtTail",
      codeLine: 5,
      status: "traversing",
    });

    currId = currNode.nextId;
    hop++;
  }

  const tailId = currId!;
  const tailNode = state.nodes[tailId];

  const finalNodes = {
    ...state.nodes,
    [tailId]: { ...tailNode, nextId: newId },
    [newId]: stagedNode,
  };

  const finalState: LinkedListState = {
    nodes: finalNodes,
    headId: state.headId,
    count: state.count + 1,
  };

  // Final Step: Link tail->next = newNode
  steps.push({
    state: finalState,
    stagedNode: null,
    activeNodeId: tailId,
    targetNodeId: newId,
    predecessorNodeId: tailId,
    modifiedPointer: "next",
    pointerSourceAddress: tailNode.address,
    pointerTargetAddress: address,
    bypassedNodeId: null,
    description: `Linked tail node (${tailNode.address})->next to newNode (${address}). Tail insertion complete after ${hop} pointer hops in O(n) time!`,
    subStepLabel: `curr->next = newNode; [Complete ✓]`,
    codeSnippetKey: "insertAtTail",
    codeLine: 6,
    status: "inserted",
  });

  return { newState: finalState, steps };
}

/**
 * Inserts a value at a specific 0-indexed position: O(n) Time (O(1) if position == 0)
 *
 * Demonstrates the fundamental DUAL-POINTER rewiring:
 * Step 1: Sequential traversal to find predecessor node (position - 1)
 * Step 2: Allocate newNode(val)
 * Step 3: newNode->next = predecessor->next (FIRST pointer assignment - prevents orphaning the list)
 * Step 4: predecessor->next = newNode (SECOND pointer assignment - splices newNode into chain)
 */
export function insertAtPosition(
  state: LinkedListState,
  val: number,
  position: number
): { newState: LinkedListState; steps: LinkedListStep[]; success: boolean; error?: string } {
  // Validation: Negative position
  if (position < 0) {
    return {
      newState: state,
      steps: [
        {
          state,
          stagedNode: null,
          activeNodeId: null,
          targetNodeId: null,
          predecessorNodeId: null,
          modifiedPointer: null,
          pointerSourceAddress: null,
          pointerTargetAddress: null,
          bypassedNodeId: null,
          description: `Position ${position} is invalid. Negative positions are not supported.`,
          subStepLabel: `if (position < 0) return; [Invalid]`,
          codeSnippetKey: "insertAtPosition",
          codeLine: 2,
          status: "not-found",
        },
      ],
      success: false,
      error: `Position ${position} is invalid. Position cannot be negative.`,
    };
  }

  // Validation: Out of range position
  if (position > state.count) {
    return {
      newState: state,
      steps: [
        {
          state,
          stagedNode: null,
          activeNodeId: null,
          targetNodeId: null,
          predecessorNodeId: null,
          modifiedPointer: null,
          pointerSourceAddress: null,
          pointerTargetAddress: null,
          bypassedNodeId: null,
          description: `Position ${position} is out of range — this list only has ${state.count} node(s) (valid positions: 0 to ${state.count}).`,
          subStepLabel: `if (predecessor == nullptr) return; [Out of range]`,
          codeSnippetKey: "insertAtPosition",
          codeLine: 14,
          status: "not-found",
        },
      ],
      success: false,
      error: `Position ${position} is out of range — this list only has ${state.count} node(s) (valid positions: 0 to ${state.count}).`,
    };
  }

  // Position 0 Shortcut: Strictly O(1) Prepend
  if (position === 0) {
    const newId = generateNodeId();
    const address = generateUniqueAddress();
    const currentHeadNode = state.headId ? state.nodes[state.headId] : null;

    const stagedNode: LinkedListNode = {
      id: newId,
      val,
      address,
      nextId: null,
    };

    const finalNode: LinkedListNode = {
      ...stagedNode,
      nextId: state.headId,
    };

    const finalState: LinkedListState = {
      nodes: { ...state.nodes, [newId]: finalNode },
      headId: newId,
      count: state.count + 1,
    };

    const steps: LinkedListStep[] = [
      {
        state: { ...state },
        stagedNode: { ...stagedNode },
        activeNodeId: newId,
        targetNodeId: null,
        predecessorNodeId: null,
        modifiedPointer: null,
        pointerSourceAddress: null,
        pointerTargetAddress: null,
        bypassedNodeId: null,
        description: `Position 0: Allocated new heap node(${val}) at ${address}. Prepending to HEAD.`,
        subStepLabel: `Node* newNode = new Node(${val});`,
        codeSnippetKey: "insertAtPosition",
        codeLine: 4,
        status: "allocating",
        stats: {
          nodesChecked: 0,
          found: true,
          position: 0,
          actualComplexity: "O(1)",
          worstCaseComplexity: "O(1) [Position 0 shortcut]",
        },
      },
      {
        state: { ...state },
        stagedNode: { ...stagedNode, nextId: state.headId },
        activeNodeId: newId,
        targetNodeId: state.headId,
        predecessorNodeId: null,
        modifiedPointer: "staged.next",
        pointerSourceAddress: address,
        pointerTargetAddress: currentHeadNode ? currentHeadNode.address : "NULL",
        bypassedNodeId: null,
        description: `Position 0: Assigned newNode->next = HEAD (${currentHeadNode ? currentHeadNode.address : "nullptr"}).`,
        subStepLabel: `newNode->next = head;`,
        codeSnippetKey: "insertAtPosition",
        codeLine: 5,
        status: "linking",
        stats: {
          nodesChecked: 0,
          found: true,
          position: 0,
          actualComplexity: "O(1)",
          worstCaseComplexity: "O(1) [Position 0 shortcut]",
        },
      },
      {
        state: finalState,
        stagedNode: null,
        activeNodeId: newId,
        targetNodeId: newId,
        predecessorNodeId: null,
        modifiedPointer: "head",
        pointerSourceAddress: "HEAD",
        pointerTargetAddress: address,
        bypassedNodeId: null,
        description: `Position 0: Updated HEAD pointer to point to newNode (${address}). Insertion complete in strictly O(1) time without traversal!`,
        subStepLabel: `head = newNode; [Complete ✓]`,
        codeSnippetKey: "insertAtPosition",
        codeLine: 6,
        status: "inserted",
        stats: {
          nodesChecked: 0,
          found: true,
          position: 0,
          actualComplexity: "O(1)",
          worstCaseComplexity: "O(1) [Position 0 shortcut]",
        },
      },
    ];

    return { newState: finalState, steps, success: true };
  }

  // Position > 0: General Traversal + Dual Pointer Rewiring
  const steps: LinkedListStep[] = [];
  let predId: string = state.headId!;

  // Step 1: Start at HEAD
  steps.push({
    state: { ...state },
    stagedNode: null,
    activeNodeId: predId,
    targetNodeId: null,
    predecessorNodeId: null,
    modifiedPointer: null,
    pointerSourceAddress: null,
    pointerTargetAddress: null,
    bypassedNodeId: null,
    description: `Initiated traversal at HEAD (${state.nodes[predId].address}) to find predecessor node at index ${position - 1}.`,
    subStepLabel: `Node* predecessor = head; (Target position: ${position})`,
    codeSnippetKey: "insertAtPosition",
    codeLine: 9,
    status: "traversing",
  });

  // Step 1 cont: Loop through nodes until reaching position - 1
  for (let i = 0; i < position - 1; i++) {
    const nextPredId: string | null = state.nodes[predId].nextId;
    if (!nextPredId) break;
    predId = nextPredId;
    const predNode = state.nodes[predId];

    steps.push({
      state: { ...state },
      stagedNode: null,
      activeNodeId: predId,
      targetNodeId: null,
      predecessorNodeId: null,
      modifiedPointer: null,
      pointerSourceAddress: null,
      pointerTargetAddress: null,
      bypassedNodeId: null,
      description: `Traversing: Inspected node #${i + 2} (${predNode.address}, val: ${predNode.val}). Advancing predecessor pointer forward...`,
      subStepLabel: `for loop: predecessor = predecessor->next; (Hop #${i + 1})`,
      codeSnippetKey: "insertAtPosition",
      codeLine: 12,
      status: "traversing",
    });
  }

  const predecessor: LinkedListNode = state.nodes[predId];
  const successorId: string | null = predecessor.nextId;
  const successorNode: LinkedListNode | null = successorId ? state.nodes[successorId] : null;

  // Predecessor located
  steps.push({
    state: { ...state },
    stagedNode: null,
    activeNodeId: predId,
    targetNodeId: successorId,
    predecessorNodeId: predId,
    modifiedPointer: null,
    pointerSourceAddress: null,
    pointerTargetAddress: null,
    bypassedNodeId: null,
    description: `Reached predecessor node #${position} (${predecessor.address}, val: ${predecessor.val}). Insertion point is between this node and ${successorNode ? `${successorNode.address} (val: ${successorNode.val})` : "nullptr"}.`,
    subStepLabel: `Predecessor located at position ${position - 1}`,
    codeSnippetKey: "insertAtPosition",
    codeLine: 10,
    status: "traversing",
  });

  // Step 2: Allocate new node
  const newId = generateNodeId();
  const address = generateUniqueAddress();

  const stagedNode: LinkedListNode = {
    id: newId,
    val,
    address,
    nextId: null,
  };

  steps.push({
    state: { ...state },
    stagedNode: { ...stagedNode },
    activeNodeId: newId,
    targetNodeId: null,
    predecessorNodeId: predId,
    modifiedPointer: null,
    pointerSourceAddress: null,
    pointerTargetAddress: null,
    bypassedNodeId: null,
    description: `Allocated new heap node containing value ${val} at memory address ${address} (next = nullptr). Both predecessor and newNode are ready for two-pointer rewiring.`,
    subStepLabel: `Node* newNode = new Node(${val});`,
    codeSnippetKey: "insertAtPosition",
    codeLine: 15,
    status: "allocating",
  });

  // Step 3: Set newNode->next = predecessor->next (FIRST HALF of dual-pointer change)
  steps.push({
    state: { ...state },
    stagedNode: { ...stagedNode, nextId: successorId },
    activeNodeId: newId,
    targetNodeId: successorId,
    predecessorNodeId: predId,
    modifiedPointer: "staged.next",
    pointerSourceAddress: address,
    pointerTargetAddress: successorNode ? successorNode.address : "NULL",
    bypassedNodeId: null,
    description: `Pointer 1 of 2: Set newNode->next = predecessor->next (${successorNode ? successorNode.address : "nullptr"}). IMPORTANT: Linking newNode to successor first ensures we do not lose reference to the rest of the list!`,
    subStepLabel: `newNode->next = predecessor->next; (Pointer 1/2)`,
    codeSnippetKey: "insertAtPosition",
    codeLine: 16,
    status: "linking",
  });

  // Step 4: Set predecessor->next = newNode (SECOND HALF of dual-pointer change)
  const finalNodes = {
    ...state.nodes,
    [predId]: { ...predecessor, nextId: newId },
    [newId]: { ...stagedNode, nextId: successorId },
  };

  const finalState: LinkedListState = {
    nodes: finalNodes,
    headId: state.headId,
    count: state.count + 1,
  };

  steps.push({
    state: finalState,
    stagedNode: null,
    activeNodeId: predId,
    targetNodeId: newId,
    predecessorNodeId: predId,
    modifiedPointer: "next",
    pointerSourceAddress: predecessor.address,
    pointerTargetAddress: address,
    bypassedNodeId: null,
    description: `Pointer 2 of 2: Redirected predecessor(${predecessor.val} at ${predecessor.address})->next to newNode (${address}). Dual-pointer insertion at position ${position} complete!`,
    subStepLabel: `predecessor->next = newNode; [Complete ✓]`,
    codeSnippetKey: "insertAtPosition",
    codeLine: 17,
    status: "inserted",
    stats: {
      nodesChecked: position,
      found: true,
      position,
      actualComplexity: `O(${position}) [Traversed ${position} node(s)]`,
      worstCaseComplexity: "O(n) worst-case",
    },
  });

  return { newState: finalState, steps, success: true };
}

/**
 * Deletes first occurrence of a value: O(n) Time
 * Granular Steps:
 * 1. If head->val == val:
 *    - Highlight head
 *    - Update head = head->next
 *    - Deallocate memory
 * 2. Otherwise:
 *    - Sequential traversal with prev and curr pointers
 *    - Found match: highlight target
 *    - Pointer redirection: prev->next = curr->next (animate bypass arrow)
 *    - Deallocate target node from heap
 */
export function deleteValue(
  state: LinkedListState,
  val: number
): { newState: LinkedListState; steps: LinkedListStep[]; success: boolean } {
  if (!state.headId) {
    return {
      newState: state,
      steps: [
        {
          state,
          stagedNode: null,
          activeNodeId: null,
          targetNodeId: null,
          predecessorNodeId: null,
          modifiedPointer: null,
          pointerSourceAddress: null,
          pointerTargetAddress: null,
          bypassedNodeId: null,
          description: "Cannot delete from an empty linked list (Underflow condition: HEAD == nullptr).",
          subStepLabel: "if (!head) return false;",
          codeSnippetKey: "deleteValue",
          codeLine: 2,
          status: "not-found",
        },
      ],
      success: false,
    };
  }

  const steps: LinkedListStep[] = [];
  const headNode = state.nodes[state.headId];

  // Case 1: Head Node deletion O(1)
  if (headNode.val === val) {
    const deletedId = state.headId;
    const nextHeadId = headNode.nextId;
    const nextHeadNode = nextHeadId ? state.nodes[nextHeadId] : null;

    const remainingNodes = { ...state.nodes };
    delete remainingNodes[deletedId];

    const finalState: LinkedListState = {
      nodes: remainingNodes,
      headId: nextHeadId,
      count: Math.max(0, state.count - 1),
    };

    // Step 1: Match at head
    steps.push({
      state,
      stagedNode: null,
      activeNodeId: deletedId,
      targetNodeId: deletedId,
      predecessorNodeId: null,
      modifiedPointer: null,
      pointerSourceAddress: null,
      pointerTargetAddress: null,
      bypassedNodeId: null,
      description: `Step 1/3: Target value ${val} matches HEAD node (${headNode.address}). Stored in temp pointer.`,
      subStepLabel: `Step 1/3: Node* temp = head; (Target Found)`,
      codeSnippetKey: "deleteValue",
      codeLine: 3,
      status: "found",
    });

    // Step 2: Advance head pointer: head = head->next
    steps.push({
      state,
      stagedNode: null,
      activeNodeId: deletedId,
      targetNodeId: nextHeadId,
      predecessorNodeId: null,
      modifiedPointer: "head",
      pointerSourceAddress: "HEAD",
      pointerTargetAddress: nextHeadNode ? nextHeadNode.address : "NULL",
      bypassedNodeId: deletedId,
      description: `Step 2/3: Advancing HEAD pointer to head->next (${nextHeadNode ? nextHeadNode.address : "nullptr"}).`,
      subStepLabel: `Step 2/3: head = head->next;`,
      codeSnippetKey: "deleteValue",
      codeLine: 4,
      status: "updating-head",
    });

    // Step 3: Deallocate temp
    steps.push({
      state: finalState,
      stagedNode: null,
      activeNodeId: null,
      targetNodeId: null,
      predecessorNodeId: null,
      modifiedPointer: null,
      pointerSourceAddress: null,
      pointerTargetAddress: null,
      bypassedNodeId: null,
      description: `Step 3/3: Deallocated memory at ${headNode.address} (delete temp). Head deletion complete in O(1) time!`,
      subStepLabel: `Step 3/3: delete temp; return true; [Complete ✓]`,
      codeSnippetKey: "deleteValue",
      codeLine: 5,
      status: "deleted",
    });

    return { newState: finalState, steps, success: true };
  }

  // Case 2: Traversal to locate predecessor and target node
  let prevId: string = state.headId;
  let currId: string | null = headNode.nextId;
  let hop = 1;

  steps.push({
    state,
    stagedNode: null,
    activeNodeId: prevId,
    targetNodeId: null,
    predecessorNodeId: null,
    modifiedPointer: null,
    pointerSourceAddress: null,
    pointerTargetAddress: null,
    bypassedNodeId: null,
    description: `Head value (${headNode.val}) != target ${val}. Initialized curr = head->next to scan forward.`,
    subStepLabel: `Node* curr = head; while (curr->next)`,
    codeSnippetKey: "deleteValue",
    codeLine: 7,
    status: "traversing",
  });

  while (currId && state.nodes[currId].val !== val) {
    const currNode = state.nodes[currId];
    steps.push({
      state,
      stagedNode: null,
      activeNodeId: currId,
      targetNodeId: null,
      predecessorNodeId: prevId,
      modifiedPointer: null,
      pointerSourceAddress: null,
      pointerTargetAddress: null,
      bypassedNodeId: null,
      description: `Inspecting Node #${hop + 1} (${currNode.address}): value ${currNode.val} != ${val}. Moving curr forward...`,
      subStepLabel: `Traversing: curr = curr->next;`,
      codeSnippetKey: "deleteValue",
      codeLine: 9,
      status: "traversing",
    });

    prevId = currId;
    currId = currNode.nextId;
    hop++;
  }

  // If reached end of list and value not found
  if (!currId) {
    steps.push({
      state,
      stagedNode: null,
      activeNodeId: null,
      targetNodeId: null,
      predecessorNodeId: prevId,
      modifiedPointer: null,
      pointerSourceAddress: null,
      pointerTargetAddress: null,
      bypassedNodeId: null,
      description: `Reached end of list (nullptr) after inspecting all ${hop} nodes. Value ${val} not found in linked list.`,
      subStepLabel: `if (!curr->next) return false; [Not Found]`,
      codeSnippetKey: "deleteValue",
      codeLine: 11,
      status: "not-found",
    });
    return { newState: state, steps, success: false };
  }

  // Found match at currId!
  const targetNode = state.nodes[currId];
  const prevNode = state.nodes[prevId];
  const successorId = targetNode.nextId;
  const successorNode = successorId ? state.nodes[successorId] : null;

  // Step A: Target found
  steps.push({
    state,
    stagedNode: null,
    activeNodeId: currId,
    targetNodeId: currId,
    predecessorNodeId: prevId,
    modifiedPointer: null,
    pointerSourceAddress: null,
    pointerTargetAddress: null,
    bypassedNodeId: null,
    description: `Match Found! Node #${hop + 1} (${targetNode.address}) has value ${val}. Stored target in temp pointer.`,
    subStepLabel: `Node* temp = curr->next; (Match Found)`,
    codeSnippetKey: "deleteValue",
    codeLine: 12,
    status: "found",
  });

  // Step B: Rewire predecessor's next pointer around target node (Pointer Splice)
  const splicedNodes = {
    ...state.nodes,
    [prevId]: { ...prevNode, nextId: successorId },
  };

  const splicedState: LinkedListState = {
    nodes: splicedNodes,
    headId: state.headId,
    count: state.count,
  };

  steps.push({
    state: splicedState,
    stagedNode: null,
    activeNodeId: prevId,
    targetNodeId: successorId,
    predecessorNodeId: prevId,
    modifiedPointer: "next",
    pointerSourceAddress: prevNode.address,
    pointerTargetAddress: successorNode ? successorNode.address : "NULL",
    bypassedNodeId: currId,
    description: `Pointer Redirection: Splicing predecessor node(${prevNode.val} at ${prevNode.address})->next directly to ${successorNode ? `${successorNode.val} (${successorNode.address})` : "nullptr"}, bypassing target node(${val})!`,
    subStepLabel: `curr->next = curr->next->next; [Pointer Spliced]`,
    codeSnippetKey: "deleteValue",
    codeLine: 13,
    status: "linking",
  });

  // Step C: Deallocate target memory
  const finalNodes = { ...splicedNodes };
  delete finalNodes[currId];

  const finalState: LinkedListState = {
    nodes: finalNodes,
    headId: state.headId,
    count: Math.max(0, state.count - 1),
  };

  steps.push({
    state: finalState,
    stagedNode: null,
    activeNodeId: null,
    targetNodeId: null,
    predecessorNodeId: prevId,
    modifiedPointer: null,
    pointerSourceAddress: null,
    pointerTargetAddress: null,
    bypassedNodeId: null,
    description: `Deallocated target node(${val} at ${targetNode.address}) from heap memory (delete temp). List reconnected seamlessly in O(n) total time!`,
    subStepLabel: `delete temp; return true; [Complete ✓]`,
    codeSnippetKey: "deleteValue",
    codeLine: 14,
    status: "deleted",
  });

  return { newState: finalState, steps, success: true };
}

/**
 * Searches for a value: O(n) Time Traversal Steps
 * Visually steps through nodes one-by-one.
 * Reports BOTH:
 * - Actual number of nodes checked in this run (O(k))
 * - General worst-case complexity class (O(n))
 */
export function searchList(
  state: LinkedListState,
  target: number
): { steps: LinkedListStep[]; found: boolean } {
  if (!state.headId) {
    return {
      steps: [
        {
          state,
          stagedNode: null,
          activeNodeId: null,
          targetNodeId: null,
          predecessorNodeId: null,
          modifiedPointer: null,
          pointerSourceAddress: null,
          pointerTargetAddress: null,
          bypassedNodeId: null,
          description: "Cannot search in an empty linked list (HEAD == nullptr).",
          subStepLabel: "if (!head) return false;",
          codeSnippetKey: "search",
          codeLine: 2,
          status: "not-found",
          stats: {
            nodesChecked: 0,
            found: false,
            actualComplexity: "O(0)",
            worstCaseComplexity: "O(n)",
          },
        },
      ],
      found: false,
    };
  }

  const steps: LinkedListStep[] = [];
  let currId: string | null = state.headId;
  let hop = 1;
  const totalCount = state.count;

  while (currId) {
    const node: LinkedListNode | undefined = state.nodes[currId];
    if (!node) break;

    // Inspect current node
    if (node.val === target) {
      steps.push({
        state,
        stagedNode: null,
        activeNodeId: currId,
        targetNodeId: currId,
        predecessorNodeId: null,
        modifiedPointer: null,
        pointerSourceAddress: null,
        pointerTargetAddress: null,
        bypassedNodeId: null,
        description: `Node #${hop} (${node.address}): Value ${node.val} == target ${target} ✓ FOUND! Traversal terminated after ${hop} node(s).`,
        subStepLabel: `Checking Node #${hop}: ${node.val} == ${target} [✓ FOUND]`,
        codeSnippetKey: "search",
        codeLine: 4,
        status: "found",
        stats: {
          nodesChecked: hop,
          found: true,
          position: hop,
          actualComplexity: `O(${hop})`,
          worstCaseComplexity: "O(n)",
        },
      });
      return { steps, found: true };
    }

    // Did not match
    steps.push({
      state,
      stagedNode: null,
      activeNodeId: currId,
      targetNodeId: null,
      predecessorNodeId: null,
      modifiedPointer: null,
      pointerSourceAddress: null,
      pointerTargetAddress: null,
      bypassedNodeId: null,
      description: `Checking Node #${hop} (${node.address}): Value ${node.val} != ${target} (✕ Not Found). Following next pointer to ${node.nextId ? state.nodes[node.nextId]?.address : "nullptr"}...`,
      subStepLabel: `Checking Node #${hop}: ${node.val} != ${target} [✕]`,
      codeSnippetKey: "search",
      codeLine: 5,
      status: "traversing",
    });

    currId = node.nextId;
    hop++;
  }

  // Reached end without finding
  steps.push({
    state,
    stagedNode: null,
    activeNodeId: null,
    targetNodeId: null,
    predecessorNodeId: null,
    modifiedPointer: null,
    pointerSourceAddress: null,
    pointerTargetAddress: null,
    bypassedNodeId: null,
    description: `Reached nullptr after inspecting all ${totalCount} nodes. Target value ${target} is not present in the linked list.`,
    subStepLabel: `Value ${target} Not Found [All ${totalCount} nodes visited]`,
    codeSnippetKey: "search",
    codeLine: 7,
    status: "not-found",
    stats: {
      nodesChecked: totalCount,
      found: false,
      actualComplexity: `O(${totalCount})`,
      worstCaseComplexity: "O(n)",
    },
  });

  return { steps, found: false };
}
