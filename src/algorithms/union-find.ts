/**
 * Union-Find (Disjoint Set Union - DSU) Pure State Engine
 * Supports:
 * - Make-Set, Find with Path Compression, Union by Rank and Union by Size
 * - Connected query, Cycle Detection in graphs, Component tracking
 * - Step-by-step playback operations for interactive studio visualizer
 * - 2D SVG tree / forest coordinate layout for clean node rendering
 */

export interface UFNodeCoord {
  id: number;
  label: string;
  x: number;
  y: number;
  depth: number;
  isRoot: boolean;
  rootId: number;
  color: string;
}

export interface UFEdge {
  from: number;
  to: number;
  isCompressed?: boolean;
}

export type UFOperationType =
  | "init"
  | "find-step"
  | "find-compress"
  | "find-complete"
  | "union-check"
  | "union-same"
  | "union-merge"
  | "union-complete"
  | "connected-check"
  | "connected-result"
  | "reset";

export interface UFStep {
  type: UFOperationType;
  description: string;
  parent: number[];
  rank: number[];
  size: number[];
  activeNodes: number[];
  comparedRoots: [number, number] | null;
  compressedNodes: number[];
  cycleDetected: boolean;
  componentsCount: number;
  highlightedEdge: [number, number] | null;
  explanation: string;
}

export interface UFPreset {
  id: string;
  name: string;
  description: string;
  nodeCount: number;
  initialUnions: [number, number][];
}

export const UF_PALETTE = [
  "#3b82f6", // Blue (Root 0)
  "#10b981", // Emerald (Root 1)
  "#8b5cf6", // Purple (Root 2)
  "#f59e0b", // Amber (Root 3)
  "#ec4899", // Pink (Root 4)
  "#06b6d4", // Cyan (Root 5)
  "#f97316", // Orange (Root 6)
  "#14b8a6", // Teal (Root 7)
  "#a855f7", // Violet (Root 8)
  "#e11d48", // Rose (Root 9)
];

export const UF_PRESET_SINGLETONS: UFPreset = {
  id: "singletons",
  name: "8 Disjoint Singletons",
  description: "8 independent sets {0} through {7}. Ready for arbitrary union operations.",
  nodeCount: 8,
  initialUnions: [],
};

export const UF_PRESET_NETWORK: UFPreset = {
  id: "network",
  name: "Local Area Network Clusters",
  description: "3 connected subnets: Cluster A {0, 1, 2}, Cluster B {3, 4}, Cluster C {5, 6, 7}.",
  nodeCount: 8,
  initialUnions: [
    [0, 1],
    [1, 2],
    [3, 4],
    [5, 6],
    [6, 7],
  ],
};

export const UF_PRESET_CYCLE_DETECTION: UFPreset = {
  id: "cycle",
  name: "Graph Cycle Detection (MST)",
  description: "Chain of edges (0-1), (1-2), (2-3). Attempting union(3, 0) detects an existing path and flags a redundant cycle edge!",
  nodeCount: 6,
  initialUnions: [
    [0, 1],
    [1, 2],
    [2, 3],
    [4, 5],
  ],
};

export const UF_PRESET_DEGENERATE_CHAIN: UFPreset = {
  id: "chain",
  name: "Worst-Case Skew vs Path Compression",
  description: "A tall degenerate chain 5 -> 4 -> 3 -> 2 -> 1 -> 0 of height 6. Calling find(5) with Path Compression instantly collapses the entire tree to height 1!",
  nodeCount: 6,
  initialUnions: [], // Will be custom built with naive parents
};

export class UnionFindEngine {
  private n: number;
  private parent: number[];
  private rank: number[];
  private size: number[];
  private enablePathCompression: boolean;
  private unionStrategy: "rank" | "size" | "naive";

  constructor(
    n: number = 8,
    enablePathCompression: boolean = true,
    unionStrategy: "rank" | "size" | "naive" = "rank"
  ) {
    this.n = n;
    this.enablePathCompression = enablePathCompression;
    this.unionStrategy = unionStrategy;
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = Array(n).fill(0);
    this.size = Array(n).fill(1);
  }

  public reset(n: number = this.n): UFStep {
    this.n = n;
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = Array(n).fill(0);
    this.size = Array(n).fill(1);

    return {
      type: "reset",
      description: `Reset Union-Find with ${n} disjoint singletons.`,
      parent: [...this.parent],
      rank: [...this.rank],
      size: [...this.size],
      activeNodes: [],
      comparedRoots: null,
      compressedNodes: [],
      cycleDetected: false,
      componentsCount: n,
      highlightedEdge: null,
      explanation: `Each element 0..${n - 1} initialized in its own distinct set with parent[i] = i and rank 0.`,
    };
  }

  public setOptimizations(pathCompression: boolean, strategy: "rank" | "size" | "naive") {
    this.enablePathCompression = pathCompression;
    this.unionStrategy = strategy;
  }

  public getParent(): number[] {
    return [...this.parent];
  }

  public getRank(): number[] {
    return [...this.rank];
  }

  public getSize(): number[] {
    return [...this.size];
  }

  public getNodeCount(): number {
    return this.n;
  }

  public getComponentCount(): number {
    let count = 0;
    for (let i = 0; i < this.n; i++) {
      if (this.parent[i] === i) count++;
    }
    return count;
  }

  public getComponents(): Map<number, number[]> {
    const map = new Map<number, number[]>();
    for (let i = 0; i < this.n; i++) {
      const root = this.findRootSync(i);
      if (!map.has(root)) map.set(root, []);
      map.get(root)!.push(i);
    }
    return map;
  }

  private findRootSync(i: number): number {
    let curr = i;
    while (this.parent[curr] !== curr) {
      curr = this.parent[curr];
    }
    return curr;
  }

  /**
   * Generates animation steps for a find(x) operation
   */
  public generateFindSteps(x: number): UFStep[] {
    const steps: UFStep[] = [];
    if (x < 0 || x >= this.n) return steps;

    const path: number[] = [];
    let curr = x;

    steps.push({
      type: "find-step",
      description: `find(${x}): Starting traversal at node ${x}`,
      parent: [...this.parent],
      rank: [...this.rank],
      size: [...this.size],
      activeNodes: [curr],
      comparedRoots: null,
      compressedNodes: [],
      cycleDetected: false,
      componentsCount: this.getComponentCount(),
      highlightedEdge: null,
      explanation: `Looking up the set representative for element ${x}. Inspecting parent[${x}] = ${this.parent[x]}.`,
    });

    while (this.parent[curr] !== curr) {
      path.push(curr);
      const nextParent = this.parent[curr];

      steps.push({
        type: "find-step",
        description: `Traversing upward: node ${curr} points to parent ${nextParent}`,
        parent: [...this.parent],
        rank: [...this.rank],
        size: [...this.size],
        activeNodes: [curr, nextParent],
        comparedRoots: null,
        compressedNodes: [],
        cycleDetected: false,
        componentsCount: this.getComponentCount(),
        highlightedEdge: [curr, nextParent],
        explanation: `Node ${curr} is not a root because parent[${curr}] = ${nextParent} != ${curr}. Following parent pointer up the tree.`,
      });

      curr = nextParent;
    }

    const root = curr;

    steps.push({
      type: "find-step",
      description: `Found set root representative: node ${root} (parent[${root}] == ${root})`,
      parent: [...this.parent],
      rank: [...this.rank],
      size: [...this.size],
      activeNodes: [root],
      comparedRoots: null,
      compressedNodes: [],
      cycleDetected: false,
      componentsCount: this.getComponentCount(),
      highlightedEdge: null,
      explanation: `Reached root node ${root} since parent[${root}] = ${root}. The representative for element ${x} is ${root}.`,
    });

    // Path compression
    if (this.enablePathCompression && path.length > 0) {
      const compressed: number[] = [];
      for (const node of path) {
        if (this.parent[node] !== root) {
          this.parent[node] = root;
          compressed.push(node);

          steps.push({
            type: "find-compress",
            description: `Path Compression: Re-linking parent[${node}] directly to root ${root}`,
            parent: [...this.parent],
            rank: [...this.rank],
            size: [...this.size],
            activeNodes: [node, root],
            comparedRoots: null,
            compressedNodes: [...compressed],
            cycleDetected: false,
            componentsCount: this.getComponentCount(),
            highlightedEdge: [node, root],
            explanation: `Flattening tree: node ${node} was deep in the chain; now it connects directly to root ${root} in O(1). Subsequent queries will take instant O(1) time!`,
          });
        }
      }
    }

    steps.push({
      type: "find-complete",
      description: `find(${x}) completed. Root is ${root}.`,
      parent: [...this.parent],
      rank: [...this.rank],
      size: [...this.size],
      activeNodes: [root],
      comparedRoots: null,
      compressedNodes: [],
      cycleDetected: false,
      componentsCount: this.getComponentCount(),
      highlightedEdge: null,
      explanation: `Query complete: find(${x}) = ${root}. Amortized cost with path compression: nearly O(1) via Inverse Ackermann α(n).`,
    });

    return steps;
  }

  /**
   * Generates animation steps for a union(x, y) operation
   */
  public generateUnionSteps(x: number, y: number): UFStep[] {
    const steps: UFStep[] = [];
    if (x < 0 || x >= this.n || y < 0 || y >= this.n) return steps;

    steps.push({
      type: "union-check",
      description: `union(${x}, ${y}): Resolving set representatives for both elements`,
      parent: [...this.parent],
      rank: [...this.rank],
      size: [...this.size],
      activeNodes: [x, y],
      comparedRoots: null,
      compressedNodes: [],
      cycleDetected: false,
      componentsCount: this.getComponentCount(),
      highlightedEdge: [x, y],
      explanation: `Checking whether elements ${x} and ${y} already belong to the same connected component.`,
    });

    const rootX = this.findRootSync(x);
    const rootY = this.findRootSync(y);

    // Apply path compression during step generation if enabled
    if (this.enablePathCompression) {
      let p = x;
      while (this.parent[p] !== rootX) {
        const next = this.parent[p];
        this.parent[p] = rootX;
        p = next;
      }
      p = y;
      while (this.parent[p] !== rootY) {
        const next = this.parent[p];
        this.parent[p] = rootY;
        p = next;
      }
    }

    steps.push({
      type: "union-check",
      description: `find(${x}) = ${rootX}, find(${y}) = ${rootY}`,
      parent: [...this.parent],
      rank: [...this.rank],
      size: [...this.size],
      activeNodes: [rootX, rootY],
      comparedRoots: [rootX, rootY],
      compressedNodes: [],
      cycleDetected: rootX === rootY,
      componentsCount: this.getComponentCount(),
      highlightedEdge: rootX !== rootY ? [rootX, rootY] : null,
      explanation:
        rootX === rootY
          ? `Roots match (${rootX} == ${rootY})! Both nodes are ALREADY in the same connected component. Adding an edge (${x}, ${y}) forms a CYCLE!`
          : `Different roots (${rootX} != ${rootY}). The two components are disjoint and can be safely merged.`,
    });

    if (rootX === rootY) {
      steps.push({
        type: "union-same",
        description: `Redundant Edge / Cycle Detected: ${x} and ${y} already share root ${rootX}`,
        parent: [...this.parent],
        rank: [...this.rank],
        size: [...this.size],
        activeNodes: [rootX],
        comparedRoots: [rootX, rootY],
        compressedNodes: [],
        cycleDetected: true,
        componentsCount: this.getComponentCount(),
        highlightedEdge: [x, y],
        explanation: `In Kruskal's MST algorithm, this edge would be rejected to avoid creating a cycle. Total components remain ${this.getComponentCount()}.`,
      });
      return steps;
    }

    // Merge components based on union strategy
    let survivingRoot: number;
    let attachedRoot: number;

    if (this.unionStrategy === "rank") {
      if (this.rank[rootX] < this.rank[rootY]) {
        survivingRoot = rootY;
        attachedRoot = rootX;
        this.parent[rootX] = rootY;
        this.size[rootY] += this.size[rootX];
      } else if (this.rank[rootX] > this.rank[rootY]) {
        survivingRoot = rootX;
        attachedRoot = rootY;
        this.parent[rootY] = rootX;
        this.size[rootX] += this.size[rootY];
      } else {
        // Equal rank: attach Y under X, increment rank of X
        survivingRoot = rootX;
        attachedRoot = rootY;
        this.parent[rootY] = rootX;
        this.size[rootX] += this.size[rootY];
        this.rank[rootX] += 1;
      }
    } else if (this.unionStrategy === "size") {
      if (this.size[rootX] < this.size[rootY]) {
        survivingRoot = rootY;
        attachedRoot = rootX;
        this.parent[rootX] = rootY;
        this.size[rootY] += this.size[rootX];
      } else {
        survivingRoot = rootX;
        attachedRoot = rootY;
        this.parent[rootY] = rootX;
        this.size[rootX] += this.size[rootY];
      }
    } else {
      // Naive: attach X under Y arbitrarily
      survivingRoot = rootY;
      attachedRoot = rootX;
      this.parent[rootX] = rootY;
      this.size[rootY] += this.size[rootX];
    }

    steps.push({
      type: "union-merge",
      description: `Union: Attached root ${attachedRoot} -> parent ${survivingRoot}`,
      parent: [...this.parent],
      rank: [...this.rank],
      size: [...this.size],
      activeNodes: [survivingRoot, attachedRoot],
      comparedRoots: [rootX, rootY],
      compressedNodes: [],
      cycleDetected: false,
      componentsCount: this.getComponentCount(),
      highlightedEdge: [attachedRoot, survivingRoot],
      explanation: `Set ${attachedRoot} merged into Set ${survivingRoot}. New root is ${survivingRoot} with rank ${this.rank[survivingRoot]} and size ${this.size[survivingRoot]}. Components count decreased to ${this.getComponentCount()}.`,
    });

    steps.push({
      type: "union-complete",
      description: `union(${x}, ${y}) complete. Elements are now connected.`,
      parent: [...this.parent],
      rank: [...this.rank],
      size: [...this.size],
      activeNodes: [survivingRoot],
      comparedRoots: null,
      compressedNodes: [],
      cycleDetected: false,
      componentsCount: this.getComponentCount(),
      highlightedEdge: null,
      explanation: `Sets successfully united! All elements in component {${survivingRoot}} now share the same representative. Total disjoint sets: ${this.getComponentCount()}.`,
    });

    return steps;
  }

  /**
   * Generates animation steps for connected(x, y) query
   */
  public generateConnectedSteps(x: number, y: number): UFStep[] {
    const steps: UFStep[] = [];
    if (x < 0 || x >= this.n || y < 0 || y >= this.n) return steps;

    const rootX = this.findRootSync(x);
    const rootY = this.findRootSync(y);
    const isConnected = rootX === rootY;

    steps.push({
      type: "connected-check",
      description: `connected(${x}, ${y}): Checking if elements share the same root`,
      parent: [...this.parent],
      rank: [...this.rank],
      size: [...this.size],
      activeNodes: [x, y],
      comparedRoots: [rootX, rootY],
      compressedNodes: [],
      cycleDetected: isConnected,
      componentsCount: this.getComponentCount(),
      highlightedEdge: [x, y],
      explanation: `find(${x}) = ${rootX}, find(${y}) = ${rootY}. Comparing root equality in O(1).`,
    });

    steps.push({
      type: "connected-result",
      description: isConnected
        ? `CONNECTED: Node ${x} and Node ${y} both belong to Component ${rootX} (TRUE)`
        : `DISCONNECTED: Node ${x} (Root ${rootX}) and Node ${y} (Root ${rootY}) are in separate components (FALSE)`,
      parent: [...this.parent],
      rank: [...this.rank],
      size: [...this.size],
      activeNodes: isConnected ? [rootX] : [rootX, rootY],
      comparedRoots: [rootX, rootY],
      compressedNodes: [],
      cycleDetected: isConnected,
      componentsCount: this.getComponentCount(),
      highlightedEdge: isConnected ? [x, y] : null,
      explanation: isConnected
        ? `Both elements share the exact same root representative (${rootX}). A valid path connects them.`
        : `Elements reside in disjoint trees with different representatives. No path exists between them.`,
    });

    return steps;
  }

  /**
   * Loads a preset scenario and returns initial step
   */
  public loadPreset(preset: UFPreset): UFStep {
    if (preset.id === "chain") {
      // Create degenerate chain: 5 -> 4 -> 3 -> 2 -> 1 -> 0
      this.n = 6;
      this.parent = [0, 0, 1, 2, 3, 4];
      this.rank = [5, 4, 3, 2, 1, 0];
      this.size = [6, 5, 4, 3, 2, 1];

      return {
        type: "init",
        description: `Loaded ${preset.name}: Degenerate skewed chain of height 6.`,
        parent: [...this.parent],
        rank: [...this.rank],
        size: [...this.size],
        activeNodes: [],
        comparedRoots: null,
        compressedNodes: [],
        cycleDetected: false,
        componentsCount: 1,
        highlightedEdge: null,
        explanation: `Nodes form a worst-case chain: 5 -> 4 -> 3 -> 2 -> 1 -> 0. Run find(5) with Path Compression to watch the chain collapse to height 1!`,
      };
    }

    this.reset(preset.nodeCount);
    for (const [u, v] of preset.initialUnions) {
      const rU = this.findRootSync(u);
      const rV = this.findRootSync(v);
      if (rU !== rV) {
        if (this.rank[rU] < this.rank[rV]) {
          this.parent[rU] = rV;
          this.size[rV] += this.size[rU];
        } else if (this.rank[rU] > this.rank[rV]) {
          this.parent[rV] = rU;
          this.size[rU] += this.size[rV];
        } else {
          this.parent[rV] = rU;
          this.size[rU] += this.size[rV];
          this.rank[rU]++;
        }
      }
    }

    return {
      type: "init",
      description: `Loaded preset: ${preset.name} (${this.getComponentCount()} components).`,
      parent: [...this.parent],
      rank: [...this.rank],
      size: [...this.size],
      activeNodes: [],
      comparedRoots: null,
      compressedNodes: [],
      cycleDetected: false,
      componentsCount: this.getComponentCount(),
      highlightedEdge: null,
      explanation: preset.description,
    };
  }

  /**
   * Computes 2D coordinate projections for SVG tree/forest rendering
   */
  public computeForestCoordinates(
    width: number = 700,
    height: number = 320
  ): { nodes: UFNodeCoord[]; edges: UFEdge[] } {
    const parentArr = this.parent;
    const n = this.n;

    // Group nodes by root
    const roots: number[] = [];
    const childrenMap: Map<number, number[]> = new Map();

    for (let i = 0; i < n; i++) {
      childrenMap.set(i, []);
    }

    for (let i = 0; i < n; i++) {
      if (parentArr[i] === i) {
        roots.push(i);
      } else {
        const p = parentArr[i];
        if (!childrenMap.has(p)) childrenMap.set(p, []);
        childrenMap.get(p)!.push(i);
      }
    }

    // Determine subtree heights and depths
    const depths: number[] = Array(n).fill(0);
    const computeDepth = (u: number, d: number) => {
      depths[u] = d;
      const children = childrenMap.get(u) || [];
      for (const ch of children) {
        computeDepth(ch, d + 1);
      }
    };

    for (const r of roots) {
      computeDepth(r, 0);
    }

    const maxDepth = Math.max(1, ...depths);
    const numRoots = roots.length;
    const colWidth = width / Math.max(1, numRoots);

    const coords: UFNodeCoord[] = [];
    const edges: UFEdge[] = [];

    roots.forEach((rootId, rootIdx) => {
      const rootColor = UF_PALETTE[rootId % UF_PALETTE.length];
      const rootCenterX = colWidth * rootIdx + colWidth / 2;

      // Layout subtree nodes with BFS level spacing
      const levels: Map<number, number[]> = new Map();
      const queue: { id: number; level: number }[] = [{ id: rootId, level: 0 }];

      while (queue.length > 0) {
        const { id, level } = queue.shift()!;
        if (!levels.has(level)) levels.set(level, []);
        levels.get(level)!.push(id);

        const children = childrenMap.get(id) || [];
        for (const child of children) {
          queue.push({ id: child, level: level + 1 });
        }
      }

      // Compute (x, y) for nodes in this tree
      const topY = 45;
      const verticalSpacing = Math.min(65, (height - 90) / Math.max(1, maxDepth));

      levels.forEach((nodeList, level) => {
        const y = topY + level * verticalSpacing;
        const count = nodeList.length;
        const subColWidth = colWidth * 0.9;
        const startX = rootCenterX - subColWidth / 2;

        nodeList.forEach((nodeId, idx) => {
          const x = count === 1 ? rootCenterX : startX + (subColWidth / (count + 1)) * (idx + 1);

          coords.push({
            id: nodeId,
            label: `${nodeId}`,
            x,
            y,
            depth: level,
            isRoot: nodeId === rootId,
            rootId,
            color: rootColor,
          });

          if (nodeId !== rootId) {
            edges.push({
              from: nodeId,
              to: parentArr[nodeId],
              isCompressed: parentArr[nodeId] === rootId && level > 1,
            });
          }
        });
      });
    });

    coords.sort((a, b) => a.id - b.id);
    return { nodes: coords, edges };
  }
}
