/**
 * Binary Search Tree (BST) Engine & Interactive Step Generator
 *
 * Implements strict BST invariant verification (left < node < right),
 * step-by-step logarithmic searching, leaf-insertion with path traversal,
 * 3-case node deletion (Leaf, Single Child, Two Children with In-Order Successor swap),
 * In-Order sorted validation, Min/Max scans, and balanced vs skewed tree presets.
 */

export interface BstNode {
  id: number;
  val: number;
  left: number | null;
  right: number | null;
  parent: number | null;
}

export interface BstMetrics {
  nodeCount: number;
  height: number;
  minVal: number | null;
  maxVal: number | null;
  isBstValid: boolean;
  isDegenerate: boolean; // Linear chain / linked list danger: height === nodeCount - 1
  optimalHeight: number; // Math.floor(Math.log2(nodeCount))
}

export type BstOperationType =
  | "idle"
  | "search-compare"
  | "search-found"
  | "search-not-found"
  | "insert-traverse"
  | "insert-attach"
  | "delete-locate"
  | "delete-case1-leaf"
  | "delete-case2-single-child"
  | "delete-case3-find-successor"
  | "delete-case3-swap"
  | "delete-finish"
  | "inorder-visit"
  | "min-max-step"
  | "validate-step";

export interface BstStep {
  type: BstOperationType;
  nodes: Record<number, BstNode>;
  rootId: number | null;
  activeNodeId: number | null;
  candidateNodeId?: number | null; // e.g. successor in delete
  visitedIds: number[];
  pathIds: number[]; // Decision trail from root
  sortedArray: number[]; // Resulting in-order list
  comparison?: {
    target: number;
    current: number;
    decision: "left" | "right" | "match" | "none";
  };
  range?: {
    min: number;
    max: number;
  };
  description: string;
  codeLine: number;
  metrics: BstMetrics;
}

export class BstEngine {
  private nodes: Record<number, BstNode> = {};
  private rootId: number | null = null;
  private nextId: number = 1;

  constructor() {
    this.loadPreset("balanced");
  }

  // Deep clone tree state
  private cloneNodes(): Record<number, BstNode> {
    const copy: Record<number, BstNode> = {};
    for (const [idStr, node] of Object.entries(this.nodes)) {
      copy[Number(idStr)] = { ...node };
    }
    return copy;
  }

  public getNodes(): Record<number, BstNode> {
    return this.cloneNodes();
  }

  public getRootId(): number | null {
    return this.rootId;
  }

  // Calculate comprehensive BST invariants & metrics
  public calculateMetrics(
    nodes: Record<number, BstNode> = this.nodes,
    rootId: number | null = this.rootId
  ): BstMetrics {
    if (rootId === null || !nodes[rootId]) {
      return {
        nodeCount: 0,
        height: 0,
        minVal: null,
        maxVal: null,
        isBstValid: true,
        isDegenerate: false,
        optimalHeight: 0,
      };
    }

    let nodeCount = 0;
    let minVal = Infinity;
    let maxVal = -Infinity;

    const computeHeight = (id: number | null): number => {
      if (id === null || !nodes[id]) return -1;
      const node = nodes[id];
      nodeCount++;
      minVal = Math.min(minVal, node.val);
      maxVal = Math.max(maxVal, node.val);
      const lh = computeHeight(node.left);
      const rh = computeHeight(node.right);
      return 1 + Math.max(lh, rh);
    };

    const treeHeight = computeHeight(rootId);

    // Verify strict BST invariant: left < node < right for all subtrees
    const isBst = (id: number | null, low: number, high: number): boolean => {
      if (id === null || !nodes[id]) return true;
      const node = nodes[id];
      if (node.val <= low || node.val >= high) return false;
      return isBst(node.left, low, node.val) && isBst(node.right, node.val, high);
    };

    const isBstValid = isBst(rootId, -Infinity, Infinity);
    const optimalHeight = nodeCount > 0 ? Math.floor(Math.log2(nodeCount)) : 0;
    const isDegenerate = nodeCount >= 3 && treeHeight === nodeCount - 1;

    return {
      nodeCount,
      height: Math.max(0, treeHeight),
      minVal: minVal === Infinity ? null : minVal,
      maxVal: maxVal === -Infinity ? null : maxVal,
      isBstValid,
      isDegenerate,
      optimalHeight,
    };
  }

  // Generate initial idle step
  public getInitialStep(description = "Binary Search Tree initialized"): BstStep {
    return {
      type: "idle",
      nodes: this.cloneNodes(),
      rootId: this.rootId,
      activeNodeId: null,
      visitedIds: [],
      pathIds: [],
      sortedArray: this.getInOrderArray(),
      description,
      codeLine: 1,
      metrics: this.calculateMetrics(),
    };
  }

  // Return sorted elements via In-Order Traversal
  public getInOrderArray(
    nodes: Record<number, BstNode> = this.nodes,
    rootId: number | null = this.rootId
  ): number[] {
    const res: number[] = [];
    const traverse = (id: number | null) => {
      if (id === null || !nodes[id]) return;
      traverse(nodes[id].left);
      res.push(nodes[id].val);
      traverse(nodes[id].right);
    };
    traverse(rootId);
    return res;
  }

  // Search generator: O(h) logarithmic decision path
  public generateSearchSteps(target: number): BstStep[] {
    const steps: BstStep[] = [];
    const nodes = this.cloneNodes();
    const rootId = this.rootId;
    const pathIds: number[] = [];
    const visitedIds: number[] = [];

    steps.push({
      type: "idle",
      nodes: this.cloneNodes(),
      rootId,
      activeNodeId: rootId,
      visitedIds: [],
      pathIds: [],
      sortedArray: this.getInOrderArray(nodes, rootId),
      description: `Starting BST search for target ${target} at root node`,
      codeLine: 2,
      metrics: this.calculateMetrics(nodes, rootId),
    });

    let currId: number | null = rootId;

    while (currId !== null && nodes[currId]) {
      const curr = nodes[currId];
      pathIds.push(currId);
      visitedIds.push(currId);

      if (curr.val === target) {
        steps.push({
          type: "search-found",
          nodes: this.cloneNodes(),
          rootId,
          activeNodeId: currId,
          visitedIds: [...visitedIds],
          pathIds: [...pathIds],
          sortedArray: this.getInOrderArray(nodes, rootId),
          comparison: { target, current: curr.val, decision: "match" },
          description: `Target ${target} matches node ${curr.val}! Search succeeded in O(log n) comparisons.`,
          codeLine: 5,
          metrics: this.calculateMetrics(nodes, rootId),
        });
        return steps;
      }

      if (target < curr.val) {
        steps.push({
          type: "search-compare",
          nodes: this.cloneNodes(),
          rootId,
          activeNodeId: currId,
          visitedIds: [...visitedIds],
          pathIds: [...pathIds],
          sortedArray: this.getInOrderArray(nodes, rootId),
          comparison: { target, current: curr.val, decision: "left" },
          description: `${target} < ${curr.val} → BST Invariant dictates searching Left subtree`,
          codeLine: 7,
          metrics: this.calculateMetrics(nodes, rootId),
        });
        currId = curr.left;
      } else {
        steps.push({
          type: "search-compare",
          nodes: this.cloneNodes(),
          rootId,
          activeNodeId: currId,
          visitedIds: [...visitedIds],
          pathIds: [...pathIds],
          sortedArray: this.getInOrderArray(nodes, rootId),
          comparison: { target, current: curr.val, decision: "right" },
          description: `${target} > ${curr.val} → BST Invariant dictates searching Right subtree`,
          codeLine: 9,
          metrics: this.calculateMetrics(nodes, rootId),
        });
        currId = curr.right;
      }
    }

    steps.push({
      type: "search-not-found",
      nodes: this.cloneNodes(),
      rootId,
      activeNodeId: null,
      visitedIds: [...visitedIds],
      pathIds: [...pathIds],
      sortedArray: this.getInOrderArray(nodes, rootId),
      description: `Reached null branch. Target ${target} does not exist in this Binary Search Tree.`,
      codeLine: 12,
      metrics: this.calculateMetrics(nodes, rootId),
    });

    return steps;
  }

  // Insert generator: locates valid leaf position and inserts new node
  public generateInsertSteps(val: number): BstStep[] {
    const steps: BstStep[] = [];
    const nodes = this.cloneNodes();
    let rootId = this.rootId;
    const pathIds: number[] = [];
    const visitedIds: number[] = [];

    // Empty tree case
    if (rootId === null) {
      const newId = this.nextId++;
      nodes[newId] = { id: newId, val, left: null, right: null, parent: null };
      rootId = newId;
      this.nodes = nodes;
      this.rootId = rootId;

      steps.push({
        type: "insert-attach",
        nodes: this.cloneNodes(),
        rootId,
        activeNodeId: newId,
        visitedIds: [newId],
        pathIds: [newId],
        sortedArray: [val],
        description: `Tree is empty. Inserted ${val} as root node.`,
        codeLine: 3,
        metrics: this.calculateMetrics(nodes, rootId),
      });
      return steps;
    }

    let currId: number | null = rootId;
    let parentId: number | null = null;
    let insertDirection: "left" | "right" = "left";

    while (currId !== null && nodes[currId]) {
      const curr: BstNode = nodes[currId];
      pathIds.push(currId);
      visitedIds.push(currId);
      parentId = currId;

      if (val === curr.val) {
        steps.push({
          type: "idle",
          nodes: this.cloneNodes(),
          rootId,
          activeNodeId: currId,
          visitedIds: [...visitedIds],
          pathIds: [...pathIds],
          sortedArray: this.getInOrderArray(nodes, rootId),
          description: `Value ${val} already exists in BST! Duplicate keys rejected.`,
          codeLine: 4,
          metrics: this.calculateMetrics(nodes, rootId),
        });
        return steps;
      }

      if (val < curr.val) {
        steps.push({
          type: "insert-traverse",
          nodes: this.cloneNodes(),
          rootId,
          activeNodeId: currId,
          visitedIds: [...visitedIds],
          pathIds: [...pathIds],
          sortedArray: this.getInOrderArray(nodes, rootId),
          comparison: { target: val, current: curr.val, decision: "left" },
          description: `${val} < ${curr.val} → Traversing Left to find insertion position`,
          codeLine: 6,
          metrics: this.calculateMetrics(nodes, rootId),
        });
        currId = curr.left;
        insertDirection = "left";
      } else {
        steps.push({
          type: "insert-traverse",
          nodes: this.cloneNodes(),
          rootId,
          activeNodeId: currId,
          visitedIds: [...visitedIds],
          pathIds: [...pathIds],
          sortedArray: this.getInOrderArray(nodes, rootId),
          comparison: { target: val, current: curr.val, decision: "right" },
          description: `${val} > ${curr.val} → Traversing Right to find insertion position`,
          codeLine: 8,
          metrics: this.calculateMetrics(nodes, rootId),
        });
        currId = curr.right;
        insertDirection = "right";
      }
    }

    // Attach new node
    const newId = this.nextId++;
    nodes[newId] = { id: newId, val, left: null, right: null, parent: parentId };
    if (parentId !== null && nodes[parentId]) {
      if (insertDirection === "left") {
        nodes[parentId].left = newId;
      } else {
        nodes[parentId].right = newId;
      }
    }

    this.nodes = nodes;
    this.rootId = rootId;

    steps.push({
      type: "insert-attach",
      nodes: this.cloneNodes(),
      rootId,
      activeNodeId: newId,
      visitedIds: [...visitedIds, newId],
      pathIds: [...pathIds, newId],
      sortedArray: this.getInOrderArray(nodes, rootId),
      description: `Attached new node (${val}) as ${insertDirection} child of node ${nodes[parentId!].val}. BST property preserved!`,
      codeLine: 11,
      metrics: this.calculateMetrics(nodes, rootId),
    });

    return steps;
  }

  // Delete generator: 3 cases (Leaf, 1 Child, 2 Children with In-Order Successor)
  public generateDeleteSteps(val: number): BstStep[] {
    const steps: BstStep[] = [];
    const nodes = this.cloneNodes();
    let rootId = this.rootId;
    const pathIds: number[] = [];
    const visitedIds: number[] = [];

    if (rootId === null) {
      steps.push({
        type: "idle",
        nodes: this.cloneNodes(),
        rootId: null,
        activeNodeId: null,
        visitedIds: [],
        pathIds: [],
        sortedArray: [],
        description: "Cannot delete from an empty tree.",
        codeLine: 1,
        metrics: this.calculateMetrics(nodes, null),
      });
      return steps;
    }

    // Phase 1: Locate node to delete
    let currId: number | null = rootId;
    while (currId !== null && nodes[currId]) {
      const curr: BstNode = nodes[currId];
      pathIds.push(currId);
      visitedIds.push(currId);

      if (curr.val === val) {
        break;
      } else if (val < curr.val) {
        steps.push({
          type: "delete-locate",
          nodes: this.cloneNodes(),
          rootId,
          activeNodeId: currId,
          visitedIds: [...visitedIds],
          pathIds: [...pathIds],
          sortedArray: this.getInOrderArray(nodes, rootId),
          description: `Locating ${val}: ${val} < ${curr.val} → traversing left`,
          codeLine: 4,
          metrics: this.calculateMetrics(nodes, rootId),
        });
        currId = curr.left;
      } else {
        steps.push({
          type: "delete-locate",
          nodes: this.cloneNodes(),
          rootId,
          activeNodeId: currId,
          visitedIds: [...visitedIds],
          pathIds: [...pathIds],
          sortedArray: this.getInOrderArray(nodes, rootId),
          description: `Locating ${val}: ${val} > ${curr.val} → traversing right`,
          codeLine: 6,
          metrics: this.calculateMetrics(nodes, rootId),
        });
        currId = curr.right;
      }
    }

    if (currId === null || !nodes[currId]) {
      steps.push({
        type: "idle",
        nodes: this.cloneNodes(),
        rootId,
        activeNodeId: null,
        visitedIds: [...visitedIds],
        pathIds: [...pathIds],
        sortedArray: this.getInOrderArray(nodes, rootId),
        description: `Node with value ${val} not found in BST. Nothing to delete.`,
        codeLine: 8,
        metrics: this.calculateMetrics(nodes, rootId),
      });
      return steps;
    }

    const targetNode = nodes[currId];

    // Case 1: Leaf node (0 children)
    if (targetNode.left === null && targetNode.right === null) {
      steps.push({
        type: "delete-case1-leaf",
        nodes: this.cloneNodes(),
        rootId,
        activeNodeId: currId,
        visitedIds: [...visitedIds],
        pathIds: [...pathIds],
        sortedArray: this.getInOrderArray(nodes, rootId),
        description: `Case 1: Node ${val} is a Leaf (0 children). Directly unlinking pointer.`,
        codeLine: 10,
        metrics: this.calculateMetrics(nodes, rootId),
      });

      if (targetNode.parent !== null && nodes[targetNode.parent]) {
        const p = nodes[targetNode.parent];
        if (p.left === currId) p.left = null;
        if (p.right === currId) p.right = null;
      } else {
        rootId = null;
      }
      delete nodes[currId];

      this.nodes = nodes;
      this.rootId = rootId;

      steps.push({
        type: "delete-finish",
        nodes: this.cloneNodes(),
        rootId,
        activeNodeId: null,
        visitedIds: [],
        pathIds: [],
        sortedArray: this.getInOrderArray(nodes, rootId),
        description: `Successfully removed leaf node ${val}.`,
        codeLine: 12,
        metrics: this.calculateMetrics(nodes, rootId),
      });
      return steps;
    }

    // Case 2: Exactly 1 child
    if (targetNode.left === null || targetNode.right === null) {
      const childId = targetNode.left !== null ? targetNode.left : targetNode.right!;
      const child = nodes[childId];

      steps.push({
        type: "delete-case2-single-child",
        nodes: this.cloneNodes(),
        rootId,
        activeNodeId: currId,
        candidateNodeId: childId,
        visitedIds: [...visitedIds],
        pathIds: [...pathIds],
        sortedArray: this.getInOrderArray(nodes, rootId),
        description: `Case 2: Node ${val} has exactly 1 child (${child.val}). Splicing child directly to parent.`,
        codeLine: 14,
        metrics: this.calculateMetrics(nodes, rootId),
      });

      if (targetNode.parent !== null && nodes[targetNode.parent]) {
        const p = nodes[targetNode.parent];
        if (p.left === currId) p.left = childId;
        if (p.right === currId) p.right = childId;
        child.parent = p.id;
      } else {
        rootId = childId;
        child.parent = null;
      }
      delete nodes[currId];

      this.nodes = nodes;
      this.rootId = rootId;

      steps.push({
        type: "delete-finish",
        nodes: this.cloneNodes(),
        rootId,
        activeNodeId: childId,
        visitedIds: [],
        pathIds: [],
        sortedArray: this.getInOrderArray(nodes, rootId),
        description: `Successfully spliced child ${child.val} to replace deleted node ${val}.`,
        codeLine: 16,
        metrics: this.calculateMetrics(nodes, rootId),
      });
      return steps;
    }

    // Case 3: Node has 2 children → Find In-Order Successor (smallest node in right subtree)
    steps.push({
      type: "delete-case3-find-successor",
      nodes: this.cloneNodes(),
      rootId,
      activeNodeId: currId,
      visitedIds: [...visitedIds],
      pathIds: [...pathIds],
      sortedArray: this.getInOrderArray(nodes, rootId),
      description: `Case 3: Node ${val} has 2 children! Scanning right subtree for In-Order Successor (smallest key in right subtree).`,
      codeLine: 18,
      metrics: this.calculateMetrics(nodes, rootId),
    });

    let succId = targetNode.right!;
    while (nodes[succId].left !== null) {
      succId = nodes[succId].left!;
    }
    const succ = nodes[succId];

    steps.push({
      type: "delete-case3-find-successor",
      nodes: this.cloneNodes(),
      rootId,
      activeNodeId: currId,
      candidateNodeId: succId,
      visitedIds: [...visitedIds, succId],
      pathIds: [...pathIds],
      sortedArray: this.getInOrderArray(nodes, rootId),
      description: `In-Order Successor identified: node with value ${succ.val}. It is guaranteed to have at most 1 right child!`,
      codeLine: 20,
      metrics: this.calculateMetrics(nodes, rootId),
    });

    // Swap value of successor into target node
    const originalTargetVal = targetNode.val;
    targetNode.val = succ.val;

    steps.push({
      type: "delete-case3-swap",
      nodes: this.cloneNodes(),
      rootId,
      activeNodeId: currId,
      candidateNodeId: succId,
      visitedIds: [...visitedIds],
      pathIds: [...pathIds],
      sortedArray: this.getInOrderArray(nodes, rootId),
      description: `Copied successor value ${succ.val} into target node slot (overwriting ${originalTargetVal}). Now removing original successor.`,
      codeLine: 22,
      metrics: this.calculateMetrics(nodes, rootId),
    });

    // Unlink successor (it has 0 or 1 right child)
    const succParent = nodes[succ.parent!];
    const succRightChild = succ.right;

    if (succParent.left === succId) {
      succParent.left = succRightChild;
    } else {
      succParent.right = succRightChild;
    }
    if (succRightChild !== null && nodes[succRightChild]) {
      nodes[succRightChild].parent = succParent.id;
    }
    delete nodes[succId];

    this.nodes = nodes;
    this.rootId = rootId;

    steps.push({
      type: "delete-finish",
      nodes: this.cloneNodes(),
      rootId,
      activeNodeId: currId,
      visitedIds: [],
      pathIds: [],
      sortedArray: this.getInOrderArray(nodes, rootId),
      description: `Case 3 Deletion complete! Node ${originalTargetVal} replaced by successor ${targetNode.val}. BST ordering strictly preserved.`,
      codeLine: 25,
      metrics: this.calculateMetrics(nodes, rootId),
    });

    return steps;
  }

  // In-Order Traversal generator: Demonstrates sorted property
  public generateInOrderSteps(): BstStep[] {
    const steps: BstStep[] = [];
    const nodes = this.cloneNodes();
    const rootId = this.rootId;
    const visitedIds: number[] = [];
    const sortedArray: number[] = [];

    steps.push({
      type: "idle",
      nodes: this.cloneNodes(),
      rootId,
      activeNodeId: rootId,
      visitedIds: [],
      pathIds: [],
      sortedArray: [],
      description: "Starting In-Order Traversal (Left → Root → Right). Proving BST outputs sorted values!",
      codeLine: 1,
      metrics: this.calculateMetrics(nodes, rootId),
    });

    const traverse = (id: number | null) => {
      if (id === null || !nodes[id]) return;
      traverse(nodes[id].left);

      visitedIds.push(id);
      sortedArray.push(nodes[id].val);

      steps.push({
        type: "inorder-visit",
        nodes: this.cloneNodes(),
        rootId,
        activeNodeId: id,
        visitedIds: [...visitedIds],
        pathIds: [id],
        sortedArray: [...sortedArray],
        description: `Visited node (${nodes[id].val}). Accumulated sorted sequence: [${sortedArray.join(", ")}]`,
        codeLine: 4,
        metrics: this.calculateMetrics(nodes, rootId),
      });

      traverse(nodes[id].right);
    };

    traverse(rootId);

    steps.push({
      type: "idle",
      nodes: this.cloneNodes(),
      rootId,
      activeNodeId: null,
      visitedIds: [...visitedIds],
      pathIds: [],
      sortedArray: [...sortedArray],
      description: `In-Order Traversal complete! Sorted array: [${sortedArray.join(", ")}]. BST invariant verified.`,
      codeLine: 6,
      metrics: this.calculateMetrics(nodes, rootId),
    });

    return steps;
  }

  // Min / Max scan generator
  public generateMinMaxSteps(type: "min" | "max"): BstStep[] {
    const steps: BstStep[] = [];
    const nodes = this.cloneNodes();
    const rootId = this.rootId;
    const visitedIds: number[] = [];
    const pathIds: number[] = [];

    if (rootId === null) {
      steps.push(this.getInitialStep("Tree is empty."));
      return steps;
    }

    let currId: number | null = rootId;
    const dir = type === "min" ? "left" : "right";

    while (currId !== null && nodes[currId]) {
      const curr: BstNode = nodes[currId];
      pathIds.push(currId);
      visitedIds.push(currId);

      const nextId: number | null = type === "min" ? curr.left : curr.right;

      if (nextId === null) {
        steps.push({
          type: "min-max-step",
          nodes: this.cloneNodes(),
          rootId,
          activeNodeId: currId,
          visitedIds: [...visitedIds],
          pathIds: [...pathIds],
          sortedArray: this.getInOrderArray(nodes, rootId),
          description: `Found global ${type.toUpperCase()}: ${curr.val} (no further ${dir} child exists).`,
          codeLine: 5,
          metrics: this.calculateMetrics(nodes, rootId),
        });
        return steps;
      } else {
        steps.push({
          type: "min-max-step",
          nodes: this.cloneNodes(),
          rootId,
          activeNodeId: currId,
          visitedIds: [...visitedIds],
          pathIds: [...pathIds],
          sortedArray: this.getInOrderArray(nodes, rootId),
          description: `Scanning ${dir} to find ${type.toUpperCase()}: at node ${curr.val}`,
          codeLine: 3,
          metrics: this.calculateMetrics(nodes, rootId),
        });
        currId = nextId;
      }
    }

    return steps;
  }

  // Load predefined presets
  public loadPreset(preset: "balanced" | "unbalanced" | "random" | "two-sum"): void {
    this.nodes = {};
    this.rootId = null;
    this.nextId = 1;

    let values: number[] = [];

    switch (preset) {
      case "balanced":
        values = [50, 25, 75, 12, 37, 62, 87];
        break;
      case "unbalanced":
        // Pathological ascending insertion creates linear degenerate chain O(n)
        values = [10, 20, 30, 40, 50, 60];
        break;
      case "two-sum":
        values = [40, 20, 60, 10, 30, 50, 70, 5, 15, 25];
        break;
      case "random":
      default:
        values = [45, 18, 68, 7, 32, 54, 89, 24, 60];
        break;
    }

    for (const v of values) {
      this.insertSimple(v);
    }
  }

  private insertSimple(val: number): void {
    const newId = this.nextId++;
    if (this.rootId === null) {
      this.nodes[newId] = { id: newId, val, left: null, right: null, parent: null };
      this.rootId = newId;
      return;
    }

    let currId: number | null = this.rootId;
    let parentId: number | null = null;
    let isLeft = false;

    while (currId !== null) {
      parentId = currId;
      const curr: BstNode = this.nodes[currId];
      if (val === curr.val) return; // Ignore duplicates
      if (val < curr.val) {
        currId = curr.left;
        isLeft = true;
      } else {
        currId = curr.right;
        isLeft = false;
      }
    }

    this.nodes[newId] = { id: newId, val, left: null, right: null, parent: parentId };
    if (parentId !== null) {
      if (isLeft) {
        this.nodes[parentId].left = newId;
      } else {
        this.nodes[parentId].right = newId;
      }
    }
  }
}
