/**
 * Binary Tree Engine & Interactive Step Generator
 *
 * Implements complete tree representation, metrics (height, leaf count,
 * full/complete/perfect/balanced invariants), BFS level-order insertion,
 * BST insertion option, leaf pruning, and DFS (Pre/In/Post) + BFS (Level-Order)
 * traversal step generators with call stack and queue states.
 */

export interface TreeNode {
  id: number;
  val: number;
  left: number | null;
  right: number | null;
  parent: number | null;
}

export type TreeTraversalType = "in-order" | "pre-order" | "post-order" | "level-order";

export interface TreeMetrics {
  nodeCount: number;
  height: number; // Maximum depth (edges from root to deepest leaf, 0 for 1 node, 0 for empty)
  leafCount: number;
  internalCount: number;
  isFull: boolean;
  isComplete: boolean;
  isPerfect: boolean;
  isBalanced: boolean;
}

export interface TreeStep {
  type:
    | "idle"
    | "insert"
    | "delete"
    | "search"
    | "traverse-visit"
    | "traverse-step"
    | "invert-swap"
    | "found"
    | "not-found"
    | "clear";
  nodes: Record<number, TreeNode>;
  rootId: number | null;
  activeNodeId: number | null;
  visitedIds: number[];
  traversalOrder: number[]; // values of nodes processed so far
  callStack?: string[];
  queueState?: number[]; // node IDs currently in BFS queue
  description: string;
  codeLine: number;
  metrics: TreeMetrics;
}

export class BinaryTreeEngine {
  private nodes: Record<number, TreeNode> = {};
  private rootId: number | null = null;
  private nextId: number = 1;

  constructor() {
    this.loadPreset("balanced");
  }

  // Clone current tree state
  private cloneNodes(): Record<number, TreeNode> {
    const copy: Record<number, TreeNode> = {};
    for (const [idStr, node] of Object.entries(this.nodes)) {
      copy[Number(idStr)] = { ...node };
    }
    return copy;
  }

  public getNodes(): Record<number, TreeNode> {
    return this.cloneNodes();
  }

  public getRootId(): number | null {
    return this.rootId;
  }

  // Calculate comprehensive tree invariants & metrics
  public calculateMetrics(
    nodes: Record<number, TreeNode> = this.nodes,
    rootId: number | null = this.rootId
  ): TreeMetrics {
    if (rootId === null || !nodes[rootId]) {
      return {
        nodeCount: 0,
        height: 0,
        leafCount: 0,
        internalCount: 0,
        isFull: true,
        isComplete: true,
        isPerfect: true,
        isBalanced: true,
      };
    }

    let nodeCount = 0;
    let leafCount = 0;
    let isFull = true;

    // Helper: calculate height and check full/leaf properties
    const getNodeHeight = (id: number | null): number => {
      if (id === null || !nodes[id]) return -1;
      const node = nodes[id];
      nodeCount++;

      const isLeaf = node.left === null && node.right === null;
      if (isLeaf) leafCount++;

      const hasOneChild =
        (node.left !== null && node.right === null) ||
        (node.left === null && node.right !== null);
      if (hasOneChild) isFull = false;

      const leftH = getNodeHeight(node.left);
      const rightH = getNodeHeight(node.right);
      return 1 + Math.max(leftH, rightH);
    };

    const treeHeight = getNodeHeight(rootId);
    const internalCount = nodeCount - leafCount;

    // Helper: check balanced invariant (|hL - hR| <= 1 for all nodes)
    const checkBalanced = (id: number | null): { balanced: boolean; height: number } => {
      if (id === null || !nodes[id]) return { balanced: true, height: -1 };
      const left = checkBalanced(nodes[id].left);
      const right = checkBalanced(nodes[id].right);
      const balanced =
        left.balanced &&
        right.balanced &&
        Math.abs(left.height - right.height) <= 1;
      return { balanced, height: 1 + Math.max(left.height, right.height) };
    };
    const isBalanced = checkBalanced(rootId).balanced;

    // Helper: check complete invariant using BFS
    let isComplete = true;
    let seenNull = false;
    const bfsQ: (number | null)[] = [rootId];
    while (bfsQ.length > 0) {
      const curr = bfsQ.shift()!;
      if (curr === null) {
        seenNull = true;
      } else {
        if (seenNull) {
          isComplete = false;
          break;
        }
        bfsQ.push(nodes[curr].left);
        bfsQ.push(nodes[curr].right);
      }
    }

    // Perfect binary tree formula: N == 2^(height + 1) - 1
    const isPerfect = isFull && nodeCount === Math.pow(2, treeHeight + 1) - 1;

    return {
      nodeCount,
      height: Math.max(0, treeHeight),
      leafCount,
      internalCount,
      isFull,
      isComplete,
      isPerfect,
      isBalanced,
    };
  }

  // Current idle step
  public getIdleStep(desc: string = "Binary tree ready."): TreeStep {
    return {
      type: "idle",
      nodes: this.cloneNodes(),
      rootId: this.rootId,
      activeNodeId: null,
      visitedIds: [],
      traversalOrder: [],
      description: desc,
      codeLine: 1,
      metrics: this.calculateMetrics(),
    };
  }

  // Reset or clear tree
  public clear(): TreeStep {
    this.nodes = {};
    this.rootId = null;
    this.nextId = 1;
    return this.getIdleStep("Cleared binary tree. Root is now nullptr.");
  }

  // Load Presets
  public loadPreset(type: "balanced" | "complete" | "left-skewed" | "right-skewed" | "bst"): TreeStep {
    this.nodes = {};
    this.nextId = 1;

    if (type === "balanced") {
      // 7-Node Perfect/Balanced Tree: 1 (2, 3) (4, 5, 6, 7)
      const values = [1, 2, 3, 4, 5, 6, 7];
      this.buildFromLevelOrderArray(values);
      return this.getIdleStep("Loaded 7-Node Balanced Binary Tree.");
    } else if (type === "complete") {
      // 6-Node Complete Binary Tree
      const values = [10, 20, 30, 40, 50, 60];
      this.buildFromLevelOrderArray(values);
      return this.getIdleStep("Loaded 6-Node Complete Binary Tree.");
    } else if (type === "left-skewed") {
      // Degenerate left chain: 50 -> 40 -> 30 -> 20
      const values = [50, 40, 30, 20];
      let prevId: number | null = null;
      for (const val of values) {
        const id = this.nextId++;
        this.nodes[id] = { id, val, left: null, right: null, parent: prevId };
        if (prevId === null) {
          this.rootId = id;
        } else {
          this.nodes[prevId].left = id;
        }
        prevId = id;
      }
      return this.getIdleStep("Loaded Degenerate Left-Skewed Tree (equivalent to Linked List).");
    } else if (type === "right-skewed") {
      // Degenerate right chain: 10 -> 20 -> 30 -> 40
      const values = [10, 20, 30, 40];
      let prevId: number | null = null;
      for (const val of values) {
        const id = this.nextId++;
        this.nodes[id] = { id, val, left: null, right: null, parent: prevId };
        if (prevId === null) {
          this.rootId = id;
        } else {
          this.nodes[prevId].right = id;
        }
        prevId = id;
      }
      return this.getIdleStep("Loaded Degenerate Right-Skewed Tree.");
    } else {
      // BST sample: 4, 2, 6, 1, 3, 5, 7
      const values = [4, 2, 6, 1, 3, 5, 7];
      this.buildFromLevelOrderArray(values);
      return this.getIdleStep("Loaded Binary Search Tree layout.");
    }
  }

  // Populate from level-order numbers
  private buildFromLevelOrderArray(arr: number[]) {
    if (arr.length === 0) {
      this.rootId = null;
      return;
    }
    const createdNodes: TreeNode[] = arr.map((val) => {
      const id = this.nextId++;
      return { id, val, left: null, right: null, parent: null };
    });

    for (let i = 0; i < createdNodes.length; i++) {
      const leftIdx = 2 * i + 1;
      const rightIdx = 2 * i + 2;
      if (leftIdx < createdNodes.length) {
        createdNodes[i].left = createdNodes[leftIdx].id;
        createdNodes[leftIdx].parent = createdNodes[i].id;
      }
      if (rightIdx < createdNodes.length) {
        createdNodes[i].right = createdNodes[rightIdx].id;
        createdNodes[rightIdx].parent = createdNodes[i].id;
      }
    }

    this.nodes = {};
    for (const n of createdNodes) {
      this.nodes[n.id] = n;
    }
    this.rootId = createdNodes[0].id;
  }

  // Randomize tree (5 to 7 values)
  public randomize(): TreeStep {
    const count = 5 + Math.floor(Math.random() * 3);
    const pool = Array.from({ length: 50 }, (_, i) => i + 1).sort(() => Math.random() - 0.5);
    const chosen = pool.slice(0, count);
    this.nodes = {};
    this.nextId = 1;
    this.buildFromLevelOrderArray(chosen);
    return this.getIdleStep(`Generated random tree with ${count} nodes.`);
  }

  // ==========================================
  // LEVEL-ORDER INSERTION (Breadth-First Search)
  // ==========================================
  public generateInsertSteps(val: number): TreeStep[] {
    const steps: TreeStep[] = [];
    const currentNodes = this.cloneNodes();
    let root = this.rootId;

    if (root === null) {
      const newId = this.nextId++;
      this.nodes[newId] = { id: newId, val, left: null, right: null, parent: null };
      this.rootId = newId;

      steps.push({
        type: "insert",
        nodes: this.cloneNodes(),
        rootId: newId,
        activeNodeId: newId,
        visitedIds: [newId],
        traversalOrder: [val],
        description: `Tree was empty. Created new root node with value ${val}.`,
        codeLine: 24, // root = new TreeNode(val);
        metrics: this.calculateMetrics(),
      });
      return steps;
    }

    // BFS Queue to find first node with available child
    const q: number[] = [root];
    const visited: number[] = [];
    let inserted = false;

    steps.push({
      type: "insert",
      nodes: this.cloneNodes(),
      rootId: this.rootId,
      activeNodeId: root,
      visitedIds: [],
      traversalOrder: [],
      queueState: [...q],
      description: `Starting Level-Order search from root (Node ${this.nodes[root].val}) to find first available child slot.`,
      codeLine: 28, // queue<TreeNode*> q; q.push(root);
      metrics: this.calculateMetrics(),
    });

    while (q.length > 0 && !inserted) {
      const currId = q.shift()!;
      visited.push(currId);
      const curr = this.nodes[currId];

      steps.push({
        type: "traverse-step",
        nodes: this.cloneNodes(),
        rootId: this.rootId,
        activeNodeId: currId,
        visitedIds: [...visited],
        traversalOrder: [],
        queueState: [...q],
        description: `Inspecting Node ${curr.val} for empty child slots.`,
        codeLine: 31, // TreeNode* curr = q.front(); q.pop();
        metrics: this.calculateMetrics(),
      });

      // Check left
      if (curr.left === null) {
        const newId = this.nextId++;
        this.nodes[newId] = { id: newId, val, left: null, right: null, parent: currId };
        this.nodes[currId].left = newId;
        inserted = true;

        steps.push({
          type: "insert",
          nodes: this.cloneNodes(),
          rootId: this.rootId,
          activeNodeId: newId,
          visitedIds: [...visited, newId],
          traversalOrder: [val],
          queueState: [...q],
          description: `Found empty left child on Node ${curr.val}. Inserted new Node ${val}.`,
          codeLine: 34, // curr->left = new TreeNode(val); return;
          metrics: this.calculateMetrics(),
        });
        break;
      } else {
        q.push(curr.left);
      }

      // Check right
      if (curr.right === null) {
        const newId = this.nextId++;
        this.nodes[newId] = { id: newId, val, left: null, right: null, parent: currId };
        this.nodes[currId].right = newId;
        inserted = true;

        steps.push({
          type: "insert",
          nodes: this.cloneNodes(),
          rootId: this.rootId,
          activeNodeId: newId,
          visitedIds: [...visited, newId],
          traversalOrder: [val],
          queueState: [...q],
          description: `Found empty right child on Node ${curr.val}. Inserted new Node ${val}.`,
          codeLine: 41, // curr->right = new TreeNode(val); return;
          metrics: this.calculateMetrics(),
        });
        break;
      } else {
        q.push(curr.right);
      }
    }

    return steps;
  }

  // ==========================================
  // TRAVERSAL STEP GENERATORS
  // ==========================================
  public generateTraversalSteps(type: TreeTraversalType): TreeStep[] {
    const steps: TreeStep[] = [];
    if (this.rootId === null) {
      steps.push(this.getIdleStep("Tree is empty, nothing to traverse."));
      return steps;
    }

    const nodes = this.cloneNodes();
    const rootId = this.rootId;
    const visitedIds: number[] = [];
    const traversalOrder: number[] = [];

    if (type === "pre-order") {
      // NLR: Root -> Left -> Right
      const dfsPre = (id: number | null, depth: number) => {
        if (id === null || !nodes[id]) return;
        const node = nodes[id];
        const callFrame = `preOrder(node: ${node.val}, depth: ${depth})`;

        // Step: Visit Node (Root)
        visitedIds.push(id);
        traversalOrder.push(node.val);
        steps.push({
          type: "traverse-visit",
          nodes,
          rootId,
          activeNodeId: id,
          visitedIds: [...visitedIds],
          traversalOrder: [...traversalOrder],
          callStack: [callFrame],
          description: `Pre-Order NLR: Visit Root Node ${node.val} first.`,
          codeLine: 50, // res.push_back(node->val);
          metrics: this.calculateMetrics(nodes, rootId),
        });

        // Recurse Left
        if (node.left !== null) {
          steps.push({
            type: "traverse-step",
            nodes,
            rootId,
            activeNodeId: node.left,
            visitedIds: [...visitedIds],
            traversalOrder: [...traversalOrder],
            callStack: [callFrame, `preOrder(left: ${nodes[node.left].val})`],
            description: `Pre-Order: Recursing into Left child (Node ${nodes[node.left].val}).`,
            codeLine: 51, // preOrder(node->left, res);
            metrics: this.calculateMetrics(nodes, rootId),
          });
          dfsPre(node.left, depth + 1);
        }

        // Recurse Right
        if (node.right !== null) {
          steps.push({
            type: "traverse-step",
            nodes,
            rootId,
            activeNodeId: node.right,
            visitedIds: [...visitedIds],
            traversalOrder: [...traversalOrder],
            callStack: [callFrame, `preOrder(right: ${nodes[node.right].val})`],
            description: `Pre-Order: Recursing into Right child (Node ${nodes[node.right].val}).`,
            codeLine: 52, // preOrder(node->right, res);
            metrics: this.calculateMetrics(nodes, rootId),
          });
          dfsPre(node.right, depth + 1);
        }
      };

      dfsPre(rootId, 0);
    } else if (type === "in-order") {
      // LNR: Left -> Root -> Right
      const dfsIn = (id: number | null, depth: number) => {
        if (id === null || !nodes[id]) return;
        const node = nodes[id];
        const callFrame = `inOrder(node: ${node.val}, depth: ${depth})`;

        // Recurse Left
        if (node.left !== null) {
          steps.push({
            type: "traverse-step",
            nodes,
            rootId,
            activeNodeId: node.left,
            visitedIds: [...visitedIds],
            traversalOrder: [...traversalOrder],
            callStack: [callFrame, `inOrder(left: ${nodes[node.left].val})`],
            description: `In-Order: Recursing down into Left child (Node ${nodes[node.left].val}).`,
            codeLine: 57, // inOrder(node->left, res);
            metrics: this.calculateMetrics(nodes, rootId),
          });
          dfsIn(node.left, depth + 1);
        }

        // Visit Root
        visitedIds.push(id);
        traversalOrder.push(node.val);
        steps.push({
          type: "traverse-visit",
          nodes,
          rootId,
          activeNodeId: id,
          visitedIds: [...visitedIds],
          traversalOrder: [...traversalOrder],
          callStack: [callFrame],
          description: `In-Order LNR: Process Root Node ${node.val} (Left subtree completed).`,
          codeLine: 58, // res.push_back(node->val);
          metrics: this.calculateMetrics(nodes, rootId),
        });

        // Recurse Right
        if (node.right !== null) {
          steps.push({
            type: "traverse-step",
            nodes,
            rootId,
            activeNodeId: node.right,
            visitedIds: [...visitedIds],
            traversalOrder: [...traversalOrder],
            callStack: [callFrame, `inOrder(right: ${nodes[node.right].val})`],
            description: `In-Order: Recursing into Right child (Node ${nodes[node.right].val}).`,
            codeLine: 59, // inOrder(node->right, res);
            metrics: this.calculateMetrics(nodes, rootId),
          });
          dfsIn(node.right, depth + 1);
        }
      };

      dfsIn(rootId, 0);
    } else if (type === "post-order") {
      // LRN: Left -> Right -> Root
      const dfsPost = (id: number | null, depth: number) => {
        if (id === null || !nodes[id]) return;
        const node = nodes[id];
        const callFrame = `postOrder(node: ${node.val}, depth: ${depth})`;

        // Recurse Left
        if (node.left !== null) {
          steps.push({
            type: "traverse-step",
            nodes,
            rootId,
            activeNodeId: node.left,
            visitedIds: [...visitedIds],
            traversalOrder: [...traversalOrder],
            callStack: [callFrame, `postOrder(left: ${nodes[node.left].val})`],
            description: `Post-Order: Recursing into Left child (Node ${nodes[node.left].val}).`,
            codeLine: 64, // postOrder(node->left, res);
            metrics: this.calculateMetrics(nodes, rootId),
          });
          dfsPost(node.left, depth + 1);
        }

        // Recurse Right
        if (node.right !== null) {
          steps.push({
            type: "traverse-step",
            nodes,
            rootId,
            activeNodeId: node.right,
            visitedIds: [...visitedIds],
            traversalOrder: [...traversalOrder],
            callStack: [callFrame, `postOrder(right: ${nodes[node.right].val})`],
            description: `Post-Order: Recursing into Right child (Node ${nodes[node.right].val}).`,
            codeLine: 65, // postOrder(node->right, res);
            metrics: this.calculateMetrics(nodes, rootId),
          });
          dfsPost(node.right, depth + 1);
        }

        // Visit Root
        visitedIds.push(id);
        traversalOrder.push(node.val);
        steps.push({
          type: "traverse-visit",
          nodes,
          rootId,
          activeNodeId: id,
          visitedIds: [...visitedIds],
          traversalOrder: [...traversalOrder],
          callStack: [callFrame],
          description: `Post-Order LRN: Process Root Node ${node.val} after both children finished.`,
          codeLine: 66, // res.push_back(node->val);
          metrics: this.calculateMetrics(nodes, rootId),
        });
      };

      dfsPost(rootId, 0);
    } else {
      // Level-Order Traversal (BFS Queue)
      const q: number[] = [rootId];

      steps.push({
        type: "traverse-step",
        nodes,
        rootId,
        activeNodeId: rootId,
        visitedIds: [],
        traversalOrder: [],
        queueState: [...q],
        description: `Enqueued root Node ${nodes[rootId].val} into FIFO queue.`,
        codeLine: 73, // queue<TreeNode*> q; q.push(root);
        metrics: this.calculateMetrics(nodes, rootId),
      });

      while (q.length > 0) {
        const currId = q.shift()!;
        const curr = nodes[currId];
        visitedIds.push(currId);
        traversalOrder.push(curr.val);

        if (curr.left !== null) q.push(curr.left);
        if (curr.right !== null) q.push(curr.right);

        steps.push({
          type: "traverse-visit",
          nodes,
          rootId,
          activeNodeId: currId,
          visitedIds: [...visitedIds],
          traversalOrder: [...traversalOrder],
          queueState: [...q],
          description: `Dequeued & Visited Node ${curr.val}. Enqueued available children.`,
          codeLine: 77, // res.push_back(curr->val);
          metrics: this.calculateMetrics(nodes, rootId),
        });
      }
    }

    // Final completion step
    steps.push({
      type: "idle",
      nodes,
      rootId,
      activeNodeId: null,
      visitedIds: [...visitedIds],
      traversalOrder: [...traversalOrder],
      description: `Completed ${type.toUpperCase()} traversal. Total nodes visited: ${traversalOrder.length}. Result: [${traversalOrder.join(", ")}].`,
      codeLine: 82,
      metrics: this.calculateMetrics(nodes, rootId),
    });

    return steps;
  }

  // ==========================================
  // SEARCH STEP GENERATOR
  // ==========================================
  public generateSearchSteps(target: number): TreeStep[] {
    const steps: TreeStep[] = [];
    if (this.rootId === null) {
      steps.push(this.getIdleStep("Tree is empty, search target not found."));
      return steps;
    }

    const nodes = this.cloneNodes();
    const rootId = this.rootId;
    const visitedIds: number[] = [];
    const q: number[] = [rootId];
    let found = false;

    while (q.length > 0) {
      const currId = q.shift()!;
      visitedIds.push(currId);
      const curr = nodes[currId];

      if (curr.val === target) {
        found = true;
        steps.push({
          type: "found",
          nodes,
          rootId,
          activeNodeId: currId,
          visitedIds: [...visitedIds],
          traversalOrder: [curr.val],
          description: `FOUND TARGET! Node ${curr.val} matches query target ${target}.`,
          codeLine: 77,
          metrics: this.calculateMetrics(nodes, rootId),
        });
        break;
      }

      steps.push({
        type: "search",
        nodes,
        rootId,
        activeNodeId: currId,
        visitedIds: [...visitedIds],
        traversalOrder: [],
        description: `Inspecting Node ${curr.val} != ${target}. Continuing search...`,
        codeLine: 76,
        metrics: this.calculateMetrics(nodes, rootId),
      });

      if (curr.left !== null) q.push(curr.left);
      if (curr.right !== null) q.push(curr.right);
    }

    if (!found) {
      steps.push({
        type: "not-found",
        nodes,
        rootId,
        activeNodeId: null,
        visitedIds: [...visitedIds],
        traversalOrder: [],
        description: `Target ${target} was not found in the binary tree after inspecting ${visitedIds.length} nodes.`,
        codeLine: 82,
        metrics: this.calculateMetrics(nodes, rootId),
      });
    }

    return steps;
  }

  // ==========================================
  // INVERT BINARY TREE (LeetCode 226)
  // ==========================================
  public generateInvertSteps(): TreeStep[] {
    const steps: TreeStep[] = [];
    if (this.rootId === null) {
      steps.push(this.getIdleStep("Tree is empty, nothing to invert."));
      return steps;
    }

    const workingNodes = this.cloneNodes();
    const rootId = this.rootId;
    const visitedIds: number[] = [];

    const dfsInvert = (id: number | null) => {
      if (id === null || !workingNodes[id]) return;
      const node = workingNodes[id];
      visitedIds.push(id);

      // Swap children
      const temp = node.left;
      node.left = node.right;
      node.right = temp;

      steps.push({
        type: "invert-swap",
        nodes: JSON.parse(JSON.stringify(workingNodes)),
        rootId,
        activeNodeId: id,
        visitedIds: [...visitedIds],
        traversalOrder: [],
        description: `Inverted Node ${node.val}: Swapped Left child (${temp ? workingNodes[temp]?.val : "null"}) with Right child (${node.left ? workingNodes[node.left]?.val : "null"}).`,
        codeLine: 65,
        metrics: this.calculateMetrics(workingNodes, rootId),
      });

      dfsInvert(node.left);
      dfsInvert(node.right);
    };

    dfsInvert(rootId);
    this.nodes = workingNodes;

    steps.push({
      type: "idle",
      nodes: this.cloneNodes(),
      rootId,
      activeNodeId: null,
      visitedIds: [...visitedIds],
      traversalOrder: [],
      description: "Successfully inverted the entire binary tree (mirrored left and right subtrees)!",
      codeLine: 67,
      metrics: this.calculateMetrics(workingNodes, rootId),
    });

    return steps;
  }

  // ==========================================
  // PRUNE LEAF / DELETE NODE
  // ==========================================
  public generateDeleteLeafSteps(): TreeStep[] {
    const steps: TreeStep[] = [];
    if (this.rootId === null) {
      steps.push(this.getIdleStep("Tree is empty, no leaf to remove."));
      return steps;
    }

    // Find deepest leaf via BFS
    const q: number[] = [this.rootId];
    let deepestLeafId = this.rootId;
    while (q.length > 0) {
      const currId = q.shift()!;
      const curr = this.nodes[currId];
      if (curr.left === null && curr.right === null) {
        deepestLeafId = currId;
      }
      if (curr.left !== null) q.push(curr.left);
      if (curr.right !== null) q.push(curr.right);
    }

    const leaf = this.nodes[deepestLeafId];
    if (deepestLeafId === this.rootId) {
      this.clear();
      steps.push({
        type: "delete",
        nodes: {},
        rootId: null,
        activeNodeId: null,
        visitedIds: [],
        traversalOrder: [],
        description: `Removed root leaf node ${leaf.val}. Tree is now empty.`,
        codeLine: 24,
        metrics: this.calculateMetrics({}, null),
      });
      return steps;
    }

    // Unlink from parent
    const parentId = leaf.parent;
    if (parentId !== null && this.nodes[parentId]) {
      if (this.nodes[parentId].left === deepestLeafId) {
        this.nodes[parentId].left = null;
      } else if (this.nodes[parentId].right === deepestLeafId) {
        this.nodes[parentId].right = null;
      }
    }
    delete this.nodes[deepestLeafId];

    steps.push({
      type: "delete",
      nodes: this.cloneNodes(),
      rootId: this.rootId,
      activeNodeId: parentId,
      visitedIds: [],
      traversalOrder: [],
      description: `Pruned deepest leaf Node ${leaf.val} from parent Node ${parentId ? this.nodes[parentId]?.val : ""}.`,
      codeLine: 41,
      metrics: this.calculateMetrics(),
    });

    return steps;
  }
}
