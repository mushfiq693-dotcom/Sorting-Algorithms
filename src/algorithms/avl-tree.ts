/**
 * AVL Tree (Adelson-Velsky and Landis) Engine & Interactive Step Generator
 *
 * Implements strict self-balancing binary search tree invariants:
 * - Height: 1 + max(height(left), height(right))
 * - Balance Factor: height(left) - height(right) ∈ {-1, 0, 1}
 * - 4 Rotations: Right (LL), Left (RR), Left-Right (LR), Right-Left (RL)
 * - Self-balancing insertion and deletion with step-by-step ancestry rebalancing.
 */

export interface AvlNode {
  id: number;
  val: number;
  left: number | null;
  right: number | null;
  parent: number | null;
  height: number;
  bf: number; // Balance Factor = height(left) - height(right)
}

export interface AvlMetrics {
  nodeCount: number;
  height: number;
  maxBf: number;
  isBalanced: boolean;
  rotationsCount: number;
  lastRotation: "LL" | "RR" | "LR" | "RL" | "None";
  theoreticalMaxHeight: number;
}

export type AvlOperationType =
  | "idle"
  | "search-compare"
  | "search-found"
  | "search-not-found"
  | "insert-traverse"
  | "insert-attach"
  | "balance-check"
  | "rotate-ll"
  | "rotate-rr"
  | "rotate-lr-step1"
  | "rotate-lr-step2"
  | "rotate-rl-step1"
  | "rotate-rl-step2"
  | "delete-locate"
  | "delete-case1"
  | "delete-case2"
  | "delete-case3-successor"
  | "delete-finish"
  | "inorder-visit";

export interface AvlStep {
  type: AvlOperationType;
  nodes: Record<number, AvlNode>;
  rootId: number | null;
  activeNodeId: number | null;
  candidateNodeId?: number | null; // Successor or bypassed child
  pivotNodeId?: number | null; // Center of rotation
  unbalancedNodeId?: number | null; // Node with |BF| > 1
  visitedIds: number[];
  pathIds: number[];
  sortedArray: number[];
  rotationBanner?: {
    type: "LL" | "RR" | "LR" | "RL";
    title: string;
    description: string;
  };
  comparison?: {
    target: number;
    current: number;
    decision: "left" | "right" | "match" | "none";
  };
  description: string;
  codeLine: number;
  metrics: AvlMetrics;
}

export class AvlEngine {
  private nodes: Record<number, AvlNode> = {};
  private rootId: number | null = null;
  private nextId: number = 1;
  private totalRotations: number = 0;
  private lastRotationType: "LL" | "RR" | "LR" | "RL" | "None" = "None";

  constructor() {
    this.loadPreset("balanced");
  }

  // Deep clone tree state
  private cloneNodes(): Record<number, AvlNode> {
    const copy: Record<number, AvlNode> = {};
    for (const [idStr, node] of Object.entries(this.nodes)) {
      copy[Number(idStr)] = { ...node };
    }
    return copy;
  }

  public getNodes(): Record<number, AvlNode> {
    return this.cloneNodes();
  }

  public getRootId(): number | null {
    return this.rootId;
  }

  private getNodeHeight(nodes: Record<number, AvlNode>, id: number | null): number {
    if (id === null || !nodes[id]) return 0;
    return nodes[id].height;
  }

  private updateNodeMetrics(nodes: Record<number, AvlNode>, id: number): void {
    const node: AvlNode = nodes[id];
    const leftH = this.getNodeHeight(nodes, node.left);
    const rightH = this.getNodeHeight(nodes, node.right);
    node.height = 1 + Math.max(leftH, rightH);
    node.bf = leftH - rightH;
  }

  public calculateMetrics(nodes: Record<number, AvlNode> = this.nodes, rootId: number | null = this.rootId): AvlMetrics {
    const nodeCount = Object.keys(nodes).length;
    let height = 0;
    let maxBf = 0;
    let isBalanced = true;

    if (rootId !== null && nodes[rootId]) {
      height = nodes[rootId].height;
    }

    for (const node of Object.values(nodes)) {
      const absBf = Math.abs(node.bf);
      if (absBf > maxBf) maxBf = absBf;
      if (absBf > 1) isBalanced = false;
    }

    // Theoretical maximum height for AVL tree of n nodes: ~ 1.44 * log2(n + 2) - 0.328
    const theoreticalMaxHeight = nodeCount > 0 ? Math.ceil(1.44 * Math.log2(nodeCount + 2)) : 0;

    return {
      nodeCount,
      height,
      maxBf,
      isBalanced,
      rotationsCount: this.totalRotations,
      lastRotation: this.lastRotationType,
      theoreticalMaxHeight,
    };
  }

  public getInOrderArray(nodes: Record<number, AvlNode> = this.nodes, rootId: number | null = this.rootId): number[] {
    const result: number[] = [];
    const traverse = (id: number | null) => {
      if (id === null || !nodes[id]) return;
      traverse(nodes[id].left);
      result.push(nodes[id].val);
      traverse(nodes[id].right);
    };
    traverse(rootId);
    return result;
  }

  public getInitialStep(description: string = "AVL Tree initialized. All nodes satisfy |BF| ≤ 1."): AvlStep {
    return {
      type: "idle",
      nodes: this.cloneNodes(),
      rootId: this.rootId,
      activeNodeId: this.rootId,
      visitedIds: [],
      pathIds: [],
      sortedArray: this.getInOrderArray(),
      description,
      codeLine: 1,
      metrics: this.calculateMetrics(),
    };
  }

  // ==========================================
  // ROTATION PRIMITIVES
  // ==========================================

  // Right Rotation (LL Case): Node y becomes right child of x
  private rotateRight(nodes: Record<number, AvlNode>, yId: number): number {
    const y: AvlNode = nodes[yId];
    const xId = y.left;
    if (xId === null) return yId;
    const x: AvlNode = nodes[xId];
    const t2Id = x.right;

    // Perform rotation
    x.right = yId;
    y.left = t2Id;

    // Fix parents
    x.parent = y.parent;
    y.parent = xId;
    if (t2Id !== null && nodes[t2Id]) {
      nodes[t2Id].parent = yId;
    }

    // Fix parent pointer of original root y
    if (x.parent !== null && nodes[x.parent]) {
      if (nodes[x.parent].left === yId) {
        nodes[x.parent].left = xId;
      } else {
        nodes[x.parent].right = xId;
      }
    }

    // Update heights and balance factors bottom-up
    this.updateNodeMetrics(nodes, yId);
    this.updateNodeMetrics(nodes, xId);

    return xId; // New root of this subtree
  }

  // Left Rotation (RR Case): Node x becomes left child of y
  private rotateLeft(nodes: Record<number, AvlNode>, xId: number): number {
    const x: AvlNode = nodes[xId];
    const yId = x.right;
    if (yId === null) return xId;
    const y: AvlNode = nodes[yId];
    const t2Id = y.left;

    // Perform rotation
    y.left = xId;
    x.right = t2Id;

    // Fix parents
    y.parent = x.parent;
    x.parent = yId;
    if (t2Id !== null && nodes[t2Id]) {
      nodes[t2Id].parent = xId;
    }

    // Fix parent pointer of original root x
    if (y.parent !== null && nodes[y.parent]) {
      if (nodes[y.parent].left === xId) {
        nodes[y.parent].left = yId;
      } else {
        nodes[y.parent].right = yId;
      }
    }

    // Update heights and balance factors bottom-up
    this.updateNodeMetrics(nodes, xId);
    this.updateNodeMetrics(nodes, yId);

    return yId; // New root of this subtree
  }

  // ==========================================
  // SEARCH GENERATOR
  // ==========================================
  public generateSearchSteps(target: number): AvlStep[] {
    const steps: AvlStep[] = [];
    const nodes = this.cloneNodes();
    let rootId = this.rootId;
    const pathIds: number[] = [];
    const visitedIds: number[] = [];

    if (rootId === null) {
      steps.push({
        type: "search-not-found",
        nodes: this.cloneNodes(),
        rootId: null,
        activeNodeId: null,
        visitedIds: [],
        pathIds: [],
        sortedArray: [],
        description: `Tree is empty. Target ${target} cannot be found.`,
        codeLine: 2,
        metrics: this.calculateMetrics(nodes, null),
      });
      return steps;
    }

    let currId: number | null = rootId;
    while (currId !== null && nodes[currId]) {
      const curr: AvlNode = nodes[currId];
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
          description: `Target ${target} found at Node ${currId} with O(log n) efficiency! (Height: ${curr.height}, BF: ${curr.bf})`,
          codeLine: 3,
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
          description: `Target ${target} < Node ${curr.val}. Discarding entire right subtree; branching left.`,
          codeLine: 4,
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
          description: `Target ${target} > Node ${curr.val}. Discarding entire left subtree; branching right.`,
          codeLine: 5,
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
      description: `Target ${target} not found in the AVL Tree. Reached null leaf boundary in logarithmic time.`,
      codeLine: 6,
      metrics: this.calculateMetrics(nodes, rootId),
    });

    return steps;
  }

  // ==========================================
  // INSERTION WITH ANCESTRY REBALANCING
  // ==========================================
  public generateInsertSteps(val: number): AvlStep[] {
    const steps: AvlStep[] = [];
    const nodes = this.cloneNodes();
    let rootId = this.rootId;
    const pathIds: number[] = [];
    const visitedIds: number[] = [];

    // Empty tree case
    if (rootId === null) {
      const newId = this.nextId++;
      nodes[newId] = { id: newId, val, left: null, right: null, parent: null, height: 1, bf: 0 };
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
        description: `Tree is empty. Inserted ${val} as root node (Height: 1, BF: 0).`,
        codeLine: 2,
        metrics: this.calculateMetrics(nodes, rootId),
      });
      return steps;
    }

    // Step 1: Standard BST search traversal down to leaf insertion point
    let currId: number | null = rootId;
    let parentId: number | null = null;
    let insertDirection: "left" | "right" = "left";

    while (currId !== null && nodes[currId]) {
      const curr: AvlNode = nodes[currId];
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
          description: `Key ${val} already exists in the AVL Tree! Duplicate insertion rejected to preserve strict ordering.`,
          codeLine: 3,
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
          description: `${val} < ${curr.val}: Branching leftward to find open insertion leaf.`,
          codeLine: 4,
          metrics: this.calculateMetrics(nodes, rootId),
        });
        insertDirection = "left";
        currId = curr.left;
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
          description: `${val} > ${curr.val}: Branching rightward to find open insertion leaf.`,
          codeLine: 5,
          metrics: this.calculateMetrics(nodes, rootId),
        });
        insertDirection = "right";
        currId = curr.right;
      }
    }

    // Step 2: Allocate and attach new node
    const newId = this.nextId++;
    nodes[newId] = {
      id: newId,
      val,
      left: null,
      right: null,
      parent: parentId,
      height: 1,
      bf: 0,
    };

    if (parentId !== null && nodes[parentId]) {
      if (insertDirection === "left") {
        nodes[parentId].left = newId;
      } else {
        nodes[parentId].right = newId;
      }
    }

    pathIds.push(newId);
    visitedIds.push(newId);

    steps.push({
      type: "insert-attach",
      nodes: { ...nodes },
      rootId,
      activeNodeId: newId,
      visitedIds: [...visitedIds],
      pathIds: [...pathIds],
      sortedArray: this.getInOrderArray(nodes, rootId),
      description: `Attached new node [${val}] as ${insertDirection} child of Node [${nodes[parentId!].val}]. Beginning upward balance verification.`,
      codeLine: 6,
      metrics: this.calculateMetrics(nodes, rootId),
    });

    // Step 3: Upward traversal: recalculate heights and trigger rotations if |BF| > 1
    let ancestorId: number | null = parentId;

    while (ancestorId !== null && nodes[ancestorId]) {
      this.updateNodeMetrics(nodes, ancestorId);
      const ancestor: AvlNode = nodes[ancestorId];

      steps.push({
        type: "balance-check",
        nodes: { ...nodes },
        rootId,
        activeNodeId: ancestorId,
        visitedIds: [...visitedIds],
        pathIds: [...pathIds],
        sortedArray: this.getInOrderArray(nodes, rootId),
        description: `Inspecting Node [${ancestor.val}]: Height=${ancestor.height}, Balance Factor=${ancestor.bf}.`,
        codeLine: 7,
        metrics: this.calculateMetrics(nodes, rootId),
      });

      // Check balance invariant
      if (ancestor.bf > 1 || ancestor.bf < -1) {
        // Unbalanced! Determine rotation category
        const isLeftHeavy = ancestor.bf > 1;

        if (isLeftHeavy) {
          const leftChildId = ancestor.left!;
          const leftChild: AvlNode = nodes[leftChildId];

          if (val < leftChild.val) {
            // Case 1: LL (Left-Left) -> Single Right Rotation
            this.totalRotations++;
            this.lastRotationType = "LL";

            steps.push({
              type: "rotate-ll",
              nodes: { ...nodes },
              rootId,
              activeNodeId: ancestorId,
              pivotNodeId: leftChildId,
              unbalancedNodeId: ancestorId,
              visitedIds: [...visitedIds],
              pathIds: [...pathIds],
              sortedArray: this.getInOrderArray(nodes, rootId),
              rotationBanner: {
                type: "LL",
                title: "LL Case • Single Right Rotation Required",
                description: `Node [${ancestor.val}] is Left-Heavy (BF = +${ancestor.bf}) and new key ${val} was inserted into left child's left subtree. Executing Right Rotation around pivot [${leftChild.val}].`,
              },
              description: `Unbalanced! Executing Right Rotation on Node [${ancestor.val}] with left pivot [${leftChild.val}].`,
              codeLine: 8,
              metrics: this.calculateMetrics(nodes, rootId),
            });

            const newSubtreeRootId = this.rotateRight(nodes, ancestorId);
            if (ancestorId === rootId) {
              rootId = newSubtreeRootId;
            }
          } else {
            // Case 3: LR (Left-Right) -> Double Rotation: Left on child, then Right on parent
            this.totalRotations += 2;
            this.lastRotationType = "LR";

            const grandchildId = leftChild.right!;

            steps.push({
              type: "rotate-lr-step1",
              nodes: { ...nodes },
              rootId,
              activeNodeId: leftChildId,
              pivotNodeId: grandchildId,
              unbalancedNodeId: ancestorId,
              visitedIds: [...visitedIds],
              pathIds: [...pathIds],
              sortedArray: this.getInOrderArray(nodes, rootId),
              rotationBanner: {
                type: "LR",
                title: "LR Case • Left-Right Double Rotation (Step 1/2)",
                description: `Node [${ancestor.val}] is Left-Heavy (BF = +${ancestor.bf}) and new key ${val} was inserted into left child's right subtree. Step 1: Rotate left child [${leftChild.val}] LEFT around [${nodes[grandchildId].val}].`,
              },
              description: `LR Double Rotation Step 1: Left rotation on left child [${leftChild.val}].`,
              codeLine: 9,
              metrics: this.calculateMetrics(nodes, rootId),
            });

            this.rotateLeft(nodes, leftChildId);

            steps.push({
              type: "rotate-lr-step2",
              nodes: { ...nodes },
              rootId,
              activeNodeId: ancestorId,
              pivotNodeId: grandchildId,
              unbalancedNodeId: ancestorId,
              visitedIds: [...visitedIds],
              pathIds: [...pathIds],
              sortedArray: this.getInOrderArray(nodes, rootId),
              rotationBanner: {
                type: "LR",
                title: "LR Case • Left-Right Double Rotation (Step 2/2)",
                description: `Step 2: Rotate parent Node [${ancestor.val}] RIGHT around new pivot [${nodes[grandchildId].val}].`,
              },
              description: `LR Double Rotation Step 2: Right rotation on Node [${ancestor.val}].`,
              codeLine: 10,
              metrics: this.calculateMetrics(nodes, rootId),
            });

            const newSubtreeRootId = this.rotateRight(nodes, ancestorId);
            if (ancestorId === rootId) {
              rootId = newSubtreeRootId;
            }
          }
        } else {
          // Right-Heavy
          const rightChildId = ancestor.right!;
          const rightChild: AvlNode = nodes[rightChildId];

          if (val > rightChild.val) {
            // Case 2: RR (Right-Right) -> Single Left Rotation
            this.totalRotations++;
            this.lastRotationType = "RR";

            steps.push({
              type: "rotate-rr",
              nodes: { ...nodes },
              rootId,
              activeNodeId: ancestorId,
              pivotNodeId: rightChildId,
              unbalancedNodeId: ancestorId,
              visitedIds: [...visitedIds],
              pathIds: [...pathIds],
              sortedArray: this.getInOrderArray(nodes, rootId),
              rotationBanner: {
                type: "RR",
                title: "RR Case • Single Left Rotation Required",
                description: `Node [${ancestor.val}] is Right-Heavy (BF = ${ancestor.bf}) and new key ${val} was inserted into right child's right subtree. Executing Left Rotation around pivot [${rightChild.val}].`,
              },
              description: `Unbalanced! Executing Left Rotation on Node [${ancestor.val}] with right pivot [${rightChild.val}].`,
              codeLine: 11,
              metrics: this.calculateMetrics(nodes, rootId),
            });

            const newSubtreeRootId = this.rotateLeft(nodes, ancestorId);
            if (ancestorId === rootId) {
              rootId = newSubtreeRootId;
            }
          } else {
            // Case 4: RL (Right-Left) -> Double Rotation: Right on child, then Left on parent
            this.totalRotations += 2;
            this.lastRotationType = "RL";

            const grandchildId = rightChild.left!;

            steps.push({
              type: "rotate-rl-step1",
              nodes: { ...nodes },
              rootId,
              activeNodeId: rightChildId,
              pivotNodeId: grandchildId,
              unbalancedNodeId: ancestorId,
              visitedIds: [...visitedIds],
              pathIds: [...pathIds],
              sortedArray: this.getInOrderArray(nodes, rootId),
              rotationBanner: {
                type: "RL",
                title: "RL Case • Right-Left Double Rotation (Step 1/2)",
                description: `Node [${ancestor.val}] is Right-Heavy (BF = ${ancestor.bf}) and new key ${val} was inserted into right child's left subtree. Step 1: Rotate right child [${rightChild.val}] RIGHT around [${nodes[grandchildId].val}].`,
              },
              description: `RL Double Rotation Step 1: Right rotation on right child [${rightChild.val}].`,
              codeLine: 12,
              metrics: this.calculateMetrics(nodes, rootId),
            });

            this.rotateRight(nodes, rightChildId);

            steps.push({
              type: "rotate-rl-step2",
              nodes: { ...nodes },
              rootId,
              activeNodeId: ancestorId,
              pivotNodeId: grandchildId,
              unbalancedNodeId: ancestorId,
              visitedIds: [...visitedIds],
              pathIds: [...pathIds],
              sortedArray: this.getInOrderArray(nodes, rootId),
              rotationBanner: {
                type: "RL",
                title: "RL Case • Right-Left Double Rotation (Step 2/2)",
                description: `Step 2: Rotate parent Node [${ancestor.val}] LEFT around new pivot [${nodes[grandchildId].val}].`,
              },
              description: `RL Double Rotation Step 2: Left rotation on Node [${ancestor.val}].`,
              codeLine: 13,
              metrics: this.calculateMetrics(nodes, rootId),
            });

            const newSubtreeRootId = this.rotateLeft(nodes, ancestorId);
            if (ancestorId === rootId) {
              rootId = newSubtreeRootId;
            }
          }
        }

        // In AVL insertion, a single rotation restores balance to the entire tree!
        break;
      }

      ancestorId = ancestor.parent;
    }

    // Persist finalized tree state
    this.nodes = nodes;
    this.rootId = rootId;

    steps.push({
      type: "idle",
      nodes: this.cloneNodes(),
      rootId: this.rootId,
      activeNodeId: newId,
      visitedIds: [...visitedIds],
      pathIds: [...pathIds],
      sortedArray: this.getInOrderArray(nodes, rootId),
      description: `Insertion of ${val} complete! AVL Invariant verified: all nodes satisfy |BF| ≤ 1.`,
      codeLine: 14,
      metrics: this.calculateMetrics(nodes, rootId),
    });

    return steps;
  }

  // ==========================================
  // DELETION WITH RECURSIVE REBALANCING
  // ==========================================
  public generateDeleteSteps(val: number): AvlStep[] {
    const steps: AvlStep[] = [];
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
      const curr: AvlNode = nodes[currId];
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
          description: `Searching node to delete: ${val} < ${curr.val}, branching left.`,
          codeLine: 2,
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
          description: `Searching node to delete: ${val} > ${curr.val}, branching right.`,
          codeLine: 2,
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
        description: `Key ${val} not found in the AVL Tree. Deletion aborted.`,
        codeLine: 3,
        metrics: this.calculateMetrics(nodes, rootId),
      });
      return steps;
    }

    const targetNode: AvlNode = nodes[currId];
    let startRebalanceId: number | null = targetNode.parent;

    // Phase 2: Topological Deletion (3 Cases)
    if (targetNode.left === null && targetNode.right === null) {
      // Case 1: Leaf node (0 children)
      steps.push({
        type: "delete-case1",
        nodes: this.cloneNodes(),
        rootId,
        activeNodeId: currId,
        visitedIds: [...visitedIds],
        pathIds: [...pathIds],
        sortedArray: this.getInOrderArray(nodes, rootId),
        description: `Case 1: Node [${targetNode.val}] is a leaf (0 children). Severing parent pointer directly.`,
        codeLine: 4,
        metrics: this.calculateMetrics(nodes, rootId),
      });

      if (targetNode.parent !== null && nodes[targetNode.parent]) {
        if (nodes[targetNode.parent].left === currId) {
          nodes[targetNode.parent].left = null;
        } else {
          nodes[targetNode.parent].right = null;
        }
      } else {
        rootId = null;
      }
      delete nodes[currId];
    } else if (targetNode.left === null || targetNode.right === null) {
      // Case 2: One child
      const childId = targetNode.left !== null ? targetNode.left : targetNode.right!;
      const child: AvlNode = nodes[childId];

      steps.push({
        type: "delete-case2",
        nodes: this.cloneNodes(),
        rootId,
        activeNodeId: currId,
        candidateNodeId: childId,
        visitedIds: [...visitedIds],
        pathIds: [...pathIds],
        sortedArray: this.getInOrderArray(nodes, rootId),
        description: `Case 2: Node [${targetNode.val}] has 1 child [${child.val}]. Bypassing parent link directly to child.`,
        codeLine: 5,
        metrics: this.calculateMetrics(nodes, rootId),
      });

      child.parent = targetNode.parent;
      if (targetNode.parent !== null && nodes[targetNode.parent]) {
        if (nodes[targetNode.parent].left === currId) {
          nodes[targetNode.parent].left = childId;
        } else {
          nodes[targetNode.parent].right = childId;
        }
      } else {
        rootId = childId;
      }
      delete nodes[currId];
    } else {
      // Case 3: Two children -> In-Order Successor (min of right subtree)
      let successorId = targetNode.right!;
      while (nodes[successorId] && nodes[successorId].left !== null) {
        successorId = nodes[successorId].left!;
      }
      const successor: AvlNode = nodes[successorId];

      steps.push({
        type: "delete-case3-successor",
        nodes: this.cloneNodes(),
        rootId,
        activeNodeId: currId,
        candidateNodeId: successorId,
        visitedIds: [...visitedIds],
        pathIds: [...pathIds],
        sortedArray: this.getInOrderArray(nodes, rootId),
        description: `Case 3: Node [${targetNode.val}] has 2 children. Found In-Order Successor [${successor.val}]. Swapping values and deleting successor.`,
        codeLine: 6,
        metrics: this.calculateMetrics(nodes, rootId),
      });

      targetNode.val = successor.val;
      startRebalanceId = successor.parent;

      // Delete successor from right subtree (successor has at most 1 right child)
      const succRight = successor.right;
      if (successor.parent !== null && nodes[successor.parent]) {
        if (nodes[successor.parent].left === successorId) {
          nodes[successor.parent].left = succRight;
        } else {
          nodes[successor.parent].right = succRight;
        }
      }
      if (succRight !== null && nodes[succRight]) {
        nodes[succRight].parent = successor.parent;
      }
      delete nodes[successorId];
    }

    // Phase 3: Upward Deletion Rebalancing
    // Unlike insertion, deletion can cause multiple balance factor violations cascading up to the root!
    let ancestorId: number | null = startRebalanceId;
    while (ancestorId !== null && nodes[ancestorId]) {
      this.updateNodeMetrics(nodes, ancestorId);
      const ancestor: AvlNode = nodes[ancestorId];

      if (ancestor.bf > 1 || ancestor.bf < -1) {
        const isLeftHeavy = ancestor.bf > 1;

        if (isLeftHeavy) {
          const leftChildId = ancestor.left!;
          const leftChild: AvlNode = nodes[leftChildId];

          if (leftChild.bf >= 0) {
            // LL Rotation
            this.totalRotations++;
            this.lastRotationType = "LL";
            const newRoot = this.rotateRight(nodes, ancestorId);
            if (ancestorId === rootId) rootId = newRoot;
            ancestorId = newRoot;
          } else {
            // LR Rotation
            this.totalRotations += 2;
            this.lastRotationType = "LR";
            this.rotateLeft(nodes, leftChildId);
            const newRoot = this.rotateRight(nodes, ancestorId);
            if (ancestorId === rootId) rootId = newRoot;
            ancestorId = newRoot;
          }
        } else {
          const rightChildId = ancestor.right!;
          const rightChild: AvlNode = nodes[rightChildId];

          if (rightChild.bf <= 0) {
            // RR Rotation
            this.totalRotations++;
            this.lastRotationType = "RR";
            const newRoot = this.rotateLeft(nodes, ancestorId);
            if (ancestorId === rootId) rootId = newRoot;
            ancestorId = newRoot;
          } else {
            // RL Rotation
            this.totalRotations += 2;
            this.lastRotationType = "RL";
            this.rotateRight(nodes, rightChildId);
            const newRoot = this.rotateLeft(nodes, ancestorId);
            if (ancestorId === rootId) rootId = newRoot;
            ancestorId = newRoot;
          }
        }
      }

      ancestorId = nodes[ancestorId]?.parent ?? null;
    }

    this.nodes = nodes;
    this.rootId = rootId;

    steps.push({
      type: "delete-finish",
      nodes: this.cloneNodes(),
      rootId: this.rootId,
      activeNodeId: null,
      visitedIds: [...visitedIds],
      pathIds: [...pathIds],
      sortedArray: this.getInOrderArray(nodes, rootId),
      description: `Deletion of ${val} complete and tree rebalanced! All nodes satisfy |BF| ≤ 1.`,
      codeLine: 7,
      metrics: this.calculateMetrics(nodes, rootId),
    });

    return steps;
  }

  // ==========================================
  // IN-ORDER SORT GENERATOR
  // ==========================================
  public generateInOrderSteps(): AvlStep[] {
    const steps: AvlStep[] = [];
    const nodes = this.cloneNodes();
    const rootId = this.rootId;
    const visitedIds: number[] = [];
    const runningSorted: number[] = [];

    const traverse = (currId: number | null) => {
      if (currId === null || !nodes[currId]) return;
      const curr: AvlNode = nodes[currId];

      traverse(curr.left);

      visitedIds.push(currId);
      runningSorted.push(curr.val);

      steps.push({
        type: "inorder-visit",
        nodes: this.cloneNodes(),
        rootId,
        activeNodeId: currId,
        visitedIds: [...visitedIds],
        pathIds: [...visitedIds],
        sortedArray: [...runningSorted],
        description: `Visited Node [${curr.val}] (Height: ${curr.height}, BF: ${curr.bf}). Monotonic sorted array: [${runningSorted.join(", ")}].`,
        codeLine: 15,
        metrics: this.calculateMetrics(nodes, rootId),
      });

      traverse(curr.right);
    };

    traverse(rootId);
    return steps;
  }

  // ==========================================
  // PRESETS
  // ==========================================
  public loadPreset(type: "balanced" | "trigger-ll" | "trigger-rr" | "trigger-lr" | "trigger-rl" | "skew-test"): void {
    this.nodes = {};
    this.rootId = null;
    this.nextId = 1;
    this.totalRotations = 0;
    this.lastRotationType = "None";

    let keys: number[] = [];
    switch (type) {
      case "balanced":
        keys = [50, 25, 75, 15, 35, 65, 85];
        break;
      case "trigger-ll":
        keys = [50, 40, 30]; // Triggers single Right rotation
        break;
      case "trigger-rr":
        keys = [30, 40, 50]; // Triggers single Left rotation
        break;
      case "trigger-lr":
        keys = [50, 30, 40]; // Triggers Left-Right double rotation
        break;
      case "trigger-rl":
        keys = [30, 50, 40]; // Triggers Right-Left double rotation
        break;
      case "skew-test":
        keys = [10, 20, 30, 40, 50, 60, 70]; // In naive BST, this skews h=7; in AVL stays h=3!
        break;
    }

    for (const key of keys) {
      this.insertDirect(key);
    }
  }

  // Direct internal insert without animation step logging
  private insertDirect(val: number): void {
    if (this.rootId === null) {
      const newId = this.nextId++;
      this.nodes[newId] = { id: newId, val, left: null, right: null, parent: null, height: 1, bf: 0 };
      this.rootId = newId;
      return;
    }

    let currId: number | null = this.rootId;
    let parentId: number | null = null;
    let isLeft = false;

    while (currId !== null && this.nodes[currId]) {
      parentId = currId;
      const curr: AvlNode = this.nodes[currId];
      if (val === curr.val) return;
      if (val < curr.val) {
        currId = curr.left;
        isLeft = true;
      } else {
        currId = curr.right;
        isLeft = false;
      }
    }

    const newId = this.nextId++;
    this.nodes[newId] = { id: newId, val, left: null, right: null, parent: parentId, height: 1, bf: 0 };
    if (parentId !== null && this.nodes[parentId]) {
      if (isLeft) this.nodes[parentId].left = newId;
      else this.nodes[parentId].right = newId;
    }

    // Rebalance upward
    let ancestorId: number | null = parentId;
    while (ancestorId !== null && this.nodes[ancestorId]) {
      this.updateNodeMetrics(this.nodes, ancestorId);
      const ancestor: AvlNode = this.nodes[ancestorId];

      if (ancestor.bf > 1) {
        const leftId = ancestor.left!;
        if (val < this.nodes[leftId].val) {
          this.totalRotations++;
          const newRoot = this.rotateRight(this.nodes, ancestorId);
          if (ancestorId === this.rootId) this.rootId = newRoot;
        } else {
          this.totalRotations += 2;
          this.rotateLeft(this.nodes, leftId);
          const newRoot = this.rotateRight(this.nodes, ancestorId);
          if (ancestorId === this.rootId) this.rootId = newRoot;
        }
        break;
      } else if (ancestor.bf < -1) {
        const rightId = ancestor.right!;
        if (val > this.nodes[rightId].val) {
          this.totalRotations++;
          const newRoot = this.rotateLeft(this.nodes, ancestorId);
          if (ancestorId === this.rootId) this.rootId = newRoot;
        } else {
          this.totalRotations += 2;
          this.rotateRight(this.nodes, rightId);
          const newRoot = this.rotateLeft(this.nodes, ancestorId);
          if (ancestorId === this.rootId) this.rootId = newRoot;
        }
        break;
      }

      ancestorId = ancestor.parent;
    }
  }
}
