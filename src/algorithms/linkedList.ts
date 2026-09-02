/**
 * AlgoHub Singly Linked List Engine
 *
 * Implements pure, stateful pointer operations:
 * - Insert at Head (O(1))
 * - Insert at Tail (O(n) without tail pointer)
 * - Delete by Value (O(n) traversal + pointer splicing)
 * - Search by Value (O(n) sequential pointer traversal)
 */

export interface LinkedListNode {
  id: string;
  val: number;
  nextId: string | null;
}

export interface LinkedListState {
  nodes: Record<string, LinkedListNode>;
  headId: string | null;
  count: number;
}

export interface LinkedListStep {
  state: LinkedListState;
  activeNodeId: string | null;
  targetNodeId: string | null;
  predecessorNodeId: string | null;
  description: string;
  status: "idle" | "traversing" | "found" | "not-found" | "inserted" | "deleted";
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
    nodes[id] = { id, val: values[i], nextId: null };
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
 * Inserts a value at head: O(1) Time
 */
export function insertAtHead(
  state: LinkedListState,
  val: number
): { newState: LinkedListState; steps: LinkedListStep[] } {
  const newId = generateNodeId();
  const newNode: LinkedListNode = {
    id: newId,
    val,
    nextId: state.headId,
  };

  const newNodes = { ...state.nodes, [newId]: newNode };
  const newState: LinkedListState = {
    nodes: newNodes,
    headId: newId,
    count: state.count + 1,
  };

  const steps: LinkedListStep[] = [
    {
      state: { ...state },
      activeNodeId: null,
      targetNodeId: null,
      predecessorNodeId: null,
      description: `Allocated new node containing value ${val}. Preparing to point newNode->next to current head.`,
      status: "idle",
    },
    {
      state: newState,
      activeNodeId: newId,
      targetNodeId: newId,
      predecessorNodeId: null,
      description: `Prepend complete! Updated HEAD to point to newNode(${val}). Previous elements remained in place with zero shifting O(1).`,
      status: "inserted",
    },
  ];

  return { newState, steps };
}

/**
 * Inserts a value at tail: O(n) Time
 */
export function insertAtTail(
  state: LinkedListState,
  val: number
): { newState: LinkedListState; steps: LinkedListStep[] } {
  const newId = generateNodeId();
  const newNode: LinkedListNode = { id: newId, val, nextId: null };

  if (!state.headId) {
    const newState: LinkedListState = {
      nodes: { [newId]: newNode },
      headId: newId,
      count: 1,
    };
    return {
      newState,
      steps: [
        {
          state: newState,
          activeNodeId: newId,
          targetNodeId: newId,
          predecessorNodeId: null,
          description: `List was empty. Inserted ${val} as new HEAD node.`,
          status: "inserted",
        },
      ],
    };
  }

  const steps: LinkedListStep[] = [];
  let currId: string | null = state.headId;

  // Trace traversal to tail
  while (currId) {
    const currNode: LinkedListNode | undefined = state.nodes[currId];
    if (!currNode) break;

    steps.push({
      state,
      activeNodeId: currId,
      targetNodeId: null,
      predecessorNodeId: null,
      description: currNode.nextId
        ? `Inspecting node(${currNode.val}). Not the tail because next != nullptr. Traversing forward...`
        : `Reached tail node(${currNode.val}) with next == nullptr. Linking new node here.`,
      status: "traversing",
    });
    if (!currNode.nextId) break;
    currId = currNode.nextId;
  }

  const lastId = currId!;
  const newNodes = {
    ...state.nodes,
    [lastId]: { ...state.nodes[lastId], nextId: newId },
    [newId]: newNode,
  };

  const newState: LinkedListState = {
    nodes: newNodes,
    headId: state.headId,
    count: state.count + 1,
  };

  steps.push({
    state: newState,
    activeNodeId: newId,
    targetNodeId: newId,
    predecessorNodeId: lastId,
    description: `Linked tail node(${state.nodes[lastId].val})->next to newNode(${val}). Tail insertion complete in O(n) time.`,
    status: "inserted",
  });

  return { newState, steps };
}

/**
 * Deletes first node with value: O(n) Time
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
          activeNodeId: null,
          targetNodeId: null,
          predecessorNodeId: null,
          description: "Cannot delete from empty linked list (Underflow).",
          status: "not-found",
        },
      ],
      success: false,
    };
  }

  const steps: LinkedListStep[] = [];

  // Special Case: Head deletion O(1)
  if (state.nodes[state.headId]?.val === val) {
    const deletedId = state.headId;
    const nextHeadId = state.nodes[deletedId].nextId;

    const newNodes = { ...state.nodes };
    delete newNodes[deletedId];

    const newState: LinkedListState = {
      nodes: newNodes,
      headId: nextHeadId,
      count: Math.max(0, state.count - 1),
    };

    steps.push({
      state,
      activeNodeId: deletedId,
      targetNodeId: deletedId,
      predecessorNodeId: null,
      description: `Target value ${val} matches HEAD node. Advancing HEAD pointer to next node (${nextHeadId ? newNodes[nextHeadId]?.val : "NULL"}).`,
      status: "found",
    });

    steps.push({
      state: newState,
      activeNodeId: null,
      targetNodeId: null,
      predecessorNodeId: null,
      description: `Deleted node(${val}). Deallocated memory. Head updated in O(1) time.`,
      status: "deleted",
    });

    return { newState, steps, success: true };
  }

  // Traversal to find target and predecessor
  let prevId: string = state.headId;
  let currId: string | null = state.nodes[state.headId]?.nextId || null;

  steps.push({
    state,
    activeNodeId: prevId,
    targetNodeId: null,
    predecessorNodeId: null,
    description: `Head value (${state.nodes[prevId].val}) does not match ${val}. Scanning forward through next pointers...`,
    status: "traversing",
  });

  while (currId && state.nodes[currId]?.val !== val) {
    steps.push({
      state,
      activeNodeId: currId,
      targetNodeId: null,
      predecessorNodeId: prevId,
      description: `Examining node(${state.nodes[currId].val}). Value != ${val}. Moving to next pointer.`,
      status: "traversing",
    });
    prevId = currId;
    currId = state.nodes[currId].nextId;
  }

  if (!currId) {
    steps.push({
      state,
      activeNodeId: null,
      targetNodeId: null,
      predecessorNodeId: prevId,
      description: `Reached end of list (nullptr). Value ${val} not found in linked list.`,
      status: "not-found",
    });
    return { newState: state, steps, success: false };
  }

  // Found match at currId
  const deletedId = currId;
  const successorId = state.nodes[deletedId].nextId;

  steps.push({
    state,
    activeNodeId: deletedId,
    targetNodeId: deletedId,
    predecessorNodeId: prevId,
    description: `Found match at node(${val})! Rewiring predecessor node(${state.nodes[prevId].val})->next to skip target and point to successor (${successorId ? state.nodes[successorId]?.val : "NULL"}).`,
    status: "found",
  });

  const newNodes = {
    ...state.nodes,
    [prevId]: { ...state.nodes[prevId], nextId: successorId },
  };
  delete newNodes[deletedId];

  const newState: LinkedListState = {
    nodes: newNodes,
    headId: state.headId,
    count: Math.max(0, state.count - 1),
  };

  steps.push({
    state: newState,
    activeNodeId: null,
    targetNodeId: null,
    predecessorNodeId: prevId,
    description: `Pointer spliced! Node(${val}) cleanly removed without moving any other elements in memory.`,
    status: "deleted",
  });

  return { newState, steps, success: true };
}

/**
 * Searches for a value: O(n) Time Traversal Steps
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
          activeNodeId: null,
          targetNodeId: null,
          predecessorNodeId: null,
          description: "Cannot search in an empty linked list.",
          status: "not-found",
        },
      ],
      found: false,
    };
  }

  const steps: LinkedListStep[] = [];
  let currId: string | null = state.headId;
  let hopIndex = 0;

  while (currId) {
    const node: LinkedListNode | undefined = state.nodes[currId];
    if (!node) break;

    if (node.val === target) {
      steps.push({
        state,
        activeNodeId: currId,
        targetNodeId: currId,
        predecessorNodeId: null,
        description: `Target ${target} found at node #${hopIndex + 1}! Traversal terminated after ${hopIndex + 1} pointer hop(s).`,
        status: "found",
      });
      return { steps, found: true };
    }

    steps.push({
      state,
      activeNodeId: currId,
      targetNodeId: null,
      predecessorNodeId: null,
      description: `Hop #${hopIndex + 1}: Value ${node.val} != target ${target}. Following next pointer to 0x${currId.slice(-4)}...`,
      status: "traversing",
    });

    currId = node.nextId;
    hopIndex++;
  }

  steps.push({
    state,
    activeNodeId: null,
    targetNodeId: null,
    predecessorNodeId: null,
    description: `Reached nullptr after inspecting all ${hopIndex} nodes. Target ${target} is not in the linked list.`,
    status: "not-found",
  });

  return { steps, found: false };
}
