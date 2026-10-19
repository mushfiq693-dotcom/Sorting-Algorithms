/**
 * Hash Table (Hash Map) Engine & Step Generator
 * Supports both Separate Chaining (linked list buckets) and Open Addressing (Linear Probing with Tombstones),
 * alongside dynamic rehashing and multi-step algorithmic playback (Two Sum with Hash Map).
 */

export type HashTableMode = "separate-chaining" | "linear-probing";

export type HashTableOperationType =
  | "idle"
  | "hash-compute"
  | "insert-start"
  | "insert-probe"
  | "insert-collision"
  | "insert-success"
  | "insert-update"
  | "search-start"
  | "search-probe"
  | "search-found"
  | "search-not-found"
  | "delete-start"
  | "delete-probe"
  | "delete-success"
  | "delete-not-found"
  | "rehash-start"
  | "rehash-complete"
  | "clear"
  | "two-sum-inspect"
  | "two-sum-lookup"
  | "two-sum-insert"
  | "two-sum-found"
  | "two-sum-complete";

export interface HashEntry {
  id: string;
  key: number;
  value: string;
  isTombstone?: boolean;
}

export interface HashBucket {
  index: number;
  entries: HashEntry[];
}

export interface LinearSlot {
  index: number;
  entry: HashEntry | null;
  state: "empty" | "occupied" | "tombstone";
}

export interface TwoSumState {
  nums: number[];
  target: number;
  currentIndex: number;
  currentComplement: number | null;
  mapSnapshot: { [key: number]: number };
  foundIndices: [number, number] | null;
}

export interface HashTableStep {
  type: HashTableOperationType;
  description: string;
  codeLine: number;
  mode: HashTableMode;
  capacity: number;
  size: number;
  loadFactor: number;
  buckets: HashBucket[];
  linearSlots: LinearSlot[];
  activeKey: number | null;
  activeValue: string | null;
  computedHash: number | null;
  highlightedIndices: number[];
  probeChain: number[];
  collisionCount: number;
  twoSum?: TwoSumState | null;
}

export class HashTableEngine {
  private capacity: number;
  private mode: HashTableMode = "separate-chaining";
  private buckets: HashBucket[] = [];
  private linearSlots: LinearSlot[] = [];
  private size: number = 0;
  private collisionCount: number = 0;
  private lastActiveKey: number | null = null;
  private lastActiveValue: string | null = null;

  constructor(capacity = 8, initialPairs: [number, string][] = [[12, "Data-12"], [25, "Data-25"], [20, "Data-20"]]) {
    this.capacity = capacity;
    this.rebuild(initialPairs);
  }

  public getCapacity(): number {
    return this.capacity;
  }

  public getSize(): number {
    return this.size;
  }

  public getMode(): HashTableMode {
    return this.mode;
  }

  public setMode(mode: HashTableMode): HashTableStep {
    this.mode = mode;
    return this.createStep("idle", `Switched collision resolution mode to ${mode === "separate-chaining" ? "Separate Chaining (Linked Buckets)" : "Open Addressing (Linear Probing)"}`, 1);
  }

  private hash(key: number, cap = this.capacity): number {
    return Math.abs(key) % cap;
  }

  private rebuild(pairs: [number, string][]) {
    this.buckets = Array.from({ length: this.capacity }, (_, i) => ({
      index: i,
      entries: [],
    }));

    this.linearSlots = Array.from({ length: this.capacity }, (_, i) => ({
      index: i,
      entry: null,
      state: "empty",
    }));

    this.size = 0;
    this.collisionCount = 0;

    for (const [k, v] of pairs) {
      this.rawInsert(k, v);
    }
  }

  private rawInsert(key: number, value: string) {
    const idx = this.hash(key);
    const entryId = `entry-${key}-${Math.random().toString(36).substring(2, 6)}`;

    // Separate chaining insertion
    const bucket = this.buckets[idx];
    const existingChainIdx = bucket.entries.findIndex((e) => e.key === key);
    if (existingChainIdx >= 0) {
      bucket.entries[existingChainIdx].value = value;
    } else {
      if (bucket.entries.length > 0) this.collisionCount++;
      bucket.entries.push({ id: entryId, key, value });
    }

    // Linear probing insertion
    let probeIdx = idx;
    let placed = false;
    for (let i = 0; i < this.capacity; i++) {
      probeIdx = (idx + i) % this.capacity;
      const slot = this.linearSlots[probeIdx];
      if (slot.state === "occupied" && slot.entry?.key === key) {
        slot.entry.value = value;
        placed = true;
        break;
      }
      if (slot.state === "empty" || slot.state === "tombstone") {
        slot.entry = { id: entryId, key, value };
        slot.state = "occupied";
        placed = true;
        break;
      }
    }
    if (placed) this.size++;
  }

  private cloneBuckets(): HashBucket[] {
    return this.buckets.map((b) => ({
      index: b.index,
      entries: b.entries.map((e) => ({ ...e })),
    }));
  }

  private cloneLinearSlots(): LinearSlot[] {
    return this.linearSlots.map((s) => ({
      index: s.index,
      state: s.state,
      entry: s.entry ? { ...s.entry } : null,
    }));
  }

  private createStep(
    type: HashTableOperationType,
    description: string,
    codeLine: number,
    extra: Partial<HashTableStep> = {}
  ): HashTableStep {
    const loadFactor = this.capacity > 0 ? this.size / this.capacity : 0;
    return {
      type,
      description,
      codeLine,
      mode: this.mode,
      capacity: this.capacity,
      size: this.size,
      loadFactor,
      buckets: this.cloneBuckets(),
      linearSlots: this.cloneLinearSlots(),
      activeKey: this.lastActiveKey,
      activeValue: this.lastActiveValue,
      computedHash: this.lastActiveKey !== null ? this.hash(this.lastActiveKey) : null,
      highlightedIndices: [],
      probeChain: [],
      collisionCount: this.collisionCount,
      ...extra,
    };
  }

  public getCurrentStep(): HashTableStep {
    return this.createStep("idle", "Hash Table initialized and ready for key-value operations.", 1);
  }

  /**
   * Generates step-by-step animation sequence for Insert(key, value)
   */
  public generateInsertSteps(key: number, value: string): HashTableStep[] {
    const steps: HashTableStep[] = [];
    this.lastActiveKey = key;
    this.lastActiveValue = value;
    const initialHash = this.hash(key);

    steps.push(
      this.createStep(
        "hash-compute",
        `Calculating hash index: h(${key}) = abs(${key}) % ${this.capacity} = [${initialHash}]`,
        31,
        { activeKey: key, activeValue: value, computedHash: initialHash, highlightedIndices: [initialHash] }
      )
    );

    if (this.mode === "separate-chaining") {
      const bucket = this.buckets[initialHash];
      const existingIdx = bucket.entries.findIndex((e) => e.key === key);

      if (bucket.entries.length > 0 && existingIdx === -1) {
        this.collisionCount++;
        steps.push(
          this.createStep(
            "insert-collision",
            `Collision detected at bucket [${initialHash}]! Bucket already contains ${bucket.entries.length} element(s). Chaining node to list.`,
            34,
            { activeKey: key, activeValue: value, computedHash: initialHash, highlightedIndices: [initialHash] }
          )
        );
      }

      if (existingIdx >= 0) {
        bucket.entries[existingIdx].value = value;
        steps.push(
          this.createStep(
            "insert-update",
            `Key ${key} already exists in bucket [${initialHash}]. Updated value to "${value}".`,
            33,
            { activeKey: key, activeValue: value, computedHash: initialHash, highlightedIndices: [initialHash] }
          )
        );
      } else {
        const entryId = `entry-${key}-${Math.random().toString(36).substring(2, 6)}`;
        bucket.entries.push({ id: entryId, key, value });
        this.size++;

        steps.push(
          this.createStep(
            "insert-success",
            `Successfully inserted key ${key} with value "${value}" into bucket [${initialHash}].`,
            35,
            { activeKey: key, activeValue: value, computedHash: initialHash, highlightedIndices: [initialHash] }
          )
        );
      }
    } else {
      // Linear probing mode
      const probeChain: number[] = [];
      let placedIndex = -1;
      let isUpdate = false;

      for (let i = 0; i < this.capacity; i++) {
        const probeIdx = (initialHash + i) % this.capacity;
        probeChain.push(probeIdx);
        const slot = this.linearSlots[probeIdx];

        if (slot.state === "occupied") {
          if (slot.entry?.key === key) {
            slot.entry.value = value;
            placedIndex = probeIdx;
            isUpdate = true;
            steps.push(
              this.createStep(
                "insert-update",
                `Found existing key ${key} at slot [${probeIdx}] after ${i} probe(s). Overwritten value to "${value}".`,
                33,
                { activeKey: key, activeValue: value, computedHash: initialHash, highlightedIndices: [probeIdx], probeChain: [...probeChain] }
              )
            );
            break;
          } else {
            this.collisionCount++;
            steps.push(
              this.createStep(
                "insert-probe",
                `Slot [${probeIdx}] is occupied by key ${slot.entry?.key}. Linear probing to (${probeIdx} + 1) % ${this.capacity}...`,
                32,
                { activeKey: key, activeValue: value, computedHash: initialHash, highlightedIndices: [probeIdx], probeChain: [...probeChain] }
              )
            );
          }
        } else {
          // Empty or tombstone slot found!
          const wasTombstone = slot.state === "tombstone";
          const entryId = `entry-${key}-${Math.random().toString(36).substring(2, 6)}`;
          slot.entry = { id: entryId, key, value };
          slot.state = "occupied";
          placedIndex = probeIdx;
          this.size++;

          steps.push(
            this.createStep(
              "insert-success",
              `Found available slot [${probeIdx}] (${wasTombstone ? "reused Tombstone" : "empty slot"}). Stored {${key}: "${value}"}.`,
              35,
              { activeKey: key, activeValue: value, computedHash: initialHash, highlightedIndices: [probeIdx], probeChain: [...probeChain] }
            )
          );
          break;
        }
      }

      if (placedIndex === -1 && !isUpdate) {
        steps.push(
          this.createStep(
            "insert-start",
            `Table is full! Unable to insert key ${key} under linear probing without rehashing.`,
            24,
            { activeKey: key, activeValue: value, computedHash: initialHash }
          )
        );
      }
    }

    // Check load factor for auto-rehash recommendation
    if (this.size / this.capacity > 0.75) {
      steps.push(
        this.createStep(
          "rehash-start",
          `⚠️ High Load Factor Warning: α = ${(this.size / this.capacity).toFixed(2)} > 0.75! Capacity doubling recommended to preserve O(1) performance.`,
          24,
          { activeKey: key, activeValue: value }
        )
      );
    }

    return steps;
  }

  /**
   * Generates step-by-step animation sequence for Search(key)
   */
  public generateSearchSteps(key: number): HashTableStep[] {
    const steps: HashTableStep[] = [];
    this.lastActiveKey = key;
    const initialHash = this.hash(key);

    steps.push(
      this.createStep(
        "search-start",
        `Initiating Search for key ${key}: compute hash index h(${key}) = [${initialHash}]. Direct bucket jump.`,
        40,
        { activeKey: key, computedHash: initialHash, highlightedIndices: [initialHash] }
      )
    );

    if (this.mode === "separate-chaining") {
      const bucket = this.buckets[initialHash];
      let found = false;

      for (let i = 0; i < bucket.entries.length; i++) {
        const entry = bucket.entries[i];
        if (entry.key === key) {
          found = true;
          steps.push(
            this.createStep(
              "search-found",
              `🎯 Match found at bucket [${initialHash}] at chain node #${i + 1}! Key: ${entry.key}, Value: "${entry.value}".`,
              43,
              { activeKey: key, activeValue: entry.value, computedHash: initialHash, highlightedIndices: [initialHash] }
            )
          );
          break;
        }
      }

      if (!found) {
        steps.push(
          this.createStep(
            "search-not-found",
            `❌ Key ${key} not found. Searched all ${bucket.entries.length} node(s) in bucket [${initialHash}]. Key is absent.`,
            45,
            { activeKey: key, computedHash: initialHash, highlightedIndices: [initialHash] }
          )
        );
      }
    } else {
      // Linear probing search
      const probeChain: number[] = [];
      let found = false;

      for (let i = 0; i < this.capacity; i++) {
        const probeIdx = (initialHash + i) % this.capacity;
        probeChain.push(probeIdx);
        const slot = this.linearSlots[probeIdx];

        if (slot.state === "occupied") {
          if (slot.entry?.key === key) {
            found = true;
            steps.push(
              this.createStep(
                "search-found",
                `🎯 Match found at slot [${probeIdx}] after ${i} probe(s)! Key: ${key}, Value: "${slot.entry.value}".`,
                43,
                { activeKey: key, activeValue: slot.entry.value, computedHash: initialHash, highlightedIndices: [probeIdx], probeChain: [...probeChain] }
              )
            );
            break;
          } else {
            steps.push(
              this.createStep(
                "search-probe",
                `Slot [${probeIdx}] contains key ${slot.entry?.key} ≠ ${key}. Continuing linear probe to slot ${(probeIdx + 1) % this.capacity}...`,
                41,
                { activeKey: key, computedHash: initialHash, highlightedIndices: [probeIdx], probeChain: [...probeChain] }
              )
            );
          }
        } else if (slot.state === "tombstone") {
          steps.push(
            this.createStep(
              "search-probe",
              `Slot [${probeIdx}] has a Tombstone (DEL)! Probing continues past it to maintain chain integrity.`,
              41,
              { activeKey: key, computedHash: initialHash, highlightedIndices: [probeIdx], probeChain: [...probeChain] }
            )
          );
        } else {
          // Empty slot hit! Search terminates immediately
          steps.push(
            this.createStep(
              "search-not-found",
              `❌ Hit empty slot [${probeIdx}] after ${i} probe(s). Search terminates immediately: key ${key} is absent from table.`,
              45,
              { activeKey: key, computedHash: initialHash, highlightedIndices: [probeIdx], probeChain: [...probeChain] }
            )
          );
          break;
        }
      }

      if (!found && probeChain.length === this.capacity) {
        steps.push(
          this.createStep(
            "search-not-found",
            `❌ Scanned entire capacity without encountering key ${key}. Key is absent.`,
            45,
            { activeKey: key, computedHash: initialHash, probeChain: [...probeChain] }
          )
        );
      }
    }

    return steps;
  }

  /**
   * Generates step-by-step animation sequence for Delete(key)
   */
  public generateDeleteSteps(key: number): HashTableStep[] {
    const steps: HashTableStep[] = [];
    this.lastActiveKey = key;
    const initialHash = this.hash(key);

    steps.push(
      this.createStep(
        "delete-start",
        `Initiating Deletion for key ${key}: hash h(${key}) = [${initialHash}]. Locating target...`,
        48,
        { activeKey: key, computedHash: initialHash, highlightedIndices: [initialHash] }
      )
    );

    if (this.mode === "separate-chaining") {
      const bucket = this.buckets[initialHash];
      const matchIdx = bucket.entries.findIndex((e) => e.key === key);

      if (matchIdx >= 0) {
        const deletedEntry = bucket.entries.splice(matchIdx, 1)[0];
        this.size--;
        steps.push(
          this.createStep(
            "delete-success",
            `🗑️ Successfully removed key ${key} from bucket [${initialHash}] by unlinking node. New bucket size: ${bucket.entries.length}.`,
            52,
            { activeKey: key, activeValue: deletedEntry.value, computedHash: initialHash, highlightedIndices: [initialHash] }
          )
        );
      } else {
        steps.push(
          this.createStep(
            "delete-not-found",
            `❌ Deletion failed: key ${key} not found in bucket [${initialHash}].`,
            56,
            { activeKey: key, computedHash: initialHash, highlightedIndices: [initialHash] }
          )
        );
      }
    } else {
      // Linear probing deletion with Tombstone
      const probeChain: number[] = [];
      let found = false;

      for (let i = 0; i < this.capacity; i++) {
        const probeIdx = (initialHash + i) % this.capacity;
        probeChain.push(probeIdx);
        const slot = this.linearSlots[probeIdx];

        if (slot.state === "occupied") {
          if (slot.entry?.key === key) {
            found = true;
            slot.state = "tombstone";
            slot.entry = null;
            this.size--;

            steps.push(
              this.createStep(
                "delete-success",
                `🗑️ Deleted key ${key} at slot [${probeIdx}]! Marked slot as Tombstone (DEL) so subsequent search probe chains stay connected.`,
                52,
                { activeKey: key, computedHash: initialHash, highlightedIndices: [probeIdx], probeChain: [...probeChain] }
              )
            );
            break;
          } else {
            steps.push(
              this.createStep(
                "delete-probe",
                `Slot [${probeIdx}] contains key ${slot.entry?.key} ≠ ${key}. Probing to next slot...`,
                50,
                { activeKey: key, computedHash: initialHash, highlightedIndices: [probeIdx], probeChain: [...probeChain] }
              )
            );
          }
        } else if (slot.state === "tombstone") {
          steps.push(
            this.createStep(
              "delete-probe",
              `Slot [${probeIdx}] is a Tombstone. Probing continues past it...`,
              50,
              { activeKey: key, computedHash: initialHash, highlightedIndices: [probeIdx], probeChain: [...probeChain] }
            )
          );
        } else {
          // Empty slot hit!
          steps.push(
            this.createStep(
              "delete-not-found",
              `❌ Hit empty slot [${probeIdx}]. Key ${key} is not in the table; deletion aborted.`,
              56,
              { activeKey: key, computedHash: initialHash, highlightedIndices: [probeIdx], probeChain: [...probeChain] }
            )
          );
          break;
        }
      }

      if (!found && probeChain.length === this.capacity) {
        steps.push(
          this.createStep(
            "delete-not-found",
            `❌ Searched entire table without finding key ${key}.`,
            56,
            { activeKey: key, computedHash: initialHash, probeChain: [...probeChain] }
          )
        );
      }
    }

    return steps;
  }

  /**
   * Generates step-by-step animation sequence for Rehash / Dynamic Doubling
   */
  public generateRehashSteps(): HashTableStep[] {
    const steps: HashTableStep[] = [];
    const oldCap = this.capacity;
    const newCap = oldCap * 2;

    steps.push(
      this.createStep(
        "rehash-start",
        `Initiating Rehash: doubling table capacity from ${oldCap} to ${newCap} slots. Allocating fresh backing buffer.`,
        17,
        { capacity: newCap }
      )
    );

    // Extract all existing non-tombstone entries
    const existingEntries: { key: number; value: string }[] = [];
    if (this.mode === "separate-chaining") {
      for (const bucket of this.buckets) {
        for (const entry of bucket.entries) {
          existingEntries.push({ key: entry.key, value: entry.value });
        }
      }
    } else {
      for (const slot of this.linearSlots) {
        if (slot.state === "occupied" && slot.entry) {
          existingEntries.push({ key: slot.entry.key, value: slot.entry.value });
        }
      }
    }

    this.capacity = newCap;
    this.buckets = Array.from({ length: newCap }, (_, i) => ({
      index: i,
      entries: [],
    }));
    this.linearSlots = Array.from({ length: newCap }, (_, i) => ({
      index: i,
      entry: null,
      state: "empty",
    }));
    this.size = 0;
    this.collisionCount = 0;

    for (const item of existingEntries) {
      this.rawInsert(item.key, item.value);
    }

    steps.push(
      this.createStep(
        "rehash-complete",
        `🎉 Rehashing complete! Migrated all ${existingEntries.length} element(s) into ${newCap} slots. Load factor reset to ${(this.size / newCap).toFixed(2)}.`,
        26,
        { capacity: newCap }
      )
    );

    return steps;
  }

  /**
   * Clears table
   */
  public clear(): HashTableStep {
    this.buckets = Array.from({ length: this.capacity }, (_, i) => ({
      index: i,
      entries: [],
    }));
    this.linearSlots = Array.from({ length: this.capacity }, (_, i) => ({
      index: i,
      entry: null,
      state: "empty",
    }));
    this.size = 0;
    this.collisionCount = 0;
    this.lastActiveKey = null;
    this.lastActiveValue = null;
    return this.createStep("clear", "Cleared all entries from the Hash Table.", 1);
  }

  /**
   * Randomizes table with representative items
   */
  public randomize(): HashTableStep {
    this.clear();
    const sampleKeys = [14, 29, 35, 42, 58, 71];
    for (const k of sampleKeys) {
      this.rawInsert(k, `Val-${k}`);
    }
    return this.createStep("idle", "Randomized table with sample key-value pairs.", 1);
  }

  /**
   * Generates multi-step algorithmic simulation for Two Sum with Hash Map
   */
  public generateTwoSumSteps(nums: number[] = [2, 7, 11, 15], target: number = 9): HashTableStep[] {
    const steps: HashTableStep[] = [];
    const map: { [key: number]: number } = {};

    steps.push(
      this.createStep(
        "two-sum-inspect",
        `Starting Two Sum with target = ${target} across array [${nums.join(", ")}]. Creating empty hash map.`,
        88,
        {
          twoSum: {
            nums,
            target,
            currentIndex: -1,
            currentComplement: null,
            mapSnapshot: {},
            foundIndices: null,
          },
        }
      )
    );

    for (let i = 0; i < nums.length; i++) {
      const x = nums[i];
      const complement = target - x;

      steps.push(
        this.createStep(
          "two-sum-inspect",
          `Index [${i}] (value ${x}): Complement needed is target - ${x} = ${target} - ${x} = ${complement}.`,
          90,
          {
            twoSum: {
              nums,
              target,
              currentIndex: i,
              currentComplement: complement,
              mapSnapshot: { ...map },
              foundIndices: null,
            },
          }
        )
      );

      if (complement in map) {
        const matchIdx = map[complement];
        steps.push(
          this.createStep(
            "two-sum-found",
            `🎯 MATCH FOUND! Complement ${complement} exists in hash map at index ${matchIdx}! Pair indices: [${matchIdx}, ${i}] (${complement} + ${x} = ${target}). O(1) lookup solved problem in O(n) total time!`,
            92,
            {
              twoSum: {
                nums,
                target,
                currentIndex: i,
                currentComplement: complement,
                mapSnapshot: { ...map },
                foundIndices: [matchIdx, i],
              },
            }
          )
        );
        return steps;
      } else {
        map[x] = i;
        steps.push(
          this.createStep(
            "two-sum-insert",
            `Complement ${complement} is not yet in map. Stored seen value {${x} → index ${i}} into hash map in O(1) time.`,
            93,
            {
              twoSum: {
                nums,
                target,
                currentIndex: i,
                currentComplement: complement,
                mapSnapshot: { ...map },
                foundIndices: null,
              },
            }
          )
        );
      }
    }

    steps.push(
      this.createStep(
        "two-sum-complete",
        `Exhausted array without finding any pair that sums to ${target}.`,
        95,
        {
          twoSum: {
            nums,
            target,
            currentIndex: nums.length - 1,
            currentComplement: null,
            mapSnapshot: { ...map },
            foundIndices: null,
          },
        }
      )
    );

    return steps;
  }
}
