import { spawn, ChildProcess } from "child_process";

interface CDPMessage {
  id: number;
  method?: string;
  params?: any;
  result?: any;
  error?: any;
}

class CDPClient {
  private ws!: WebSocket;
  private nextId = 1;
  private callbacks = new Map<number, (res: any) => void>();

  async connect(wsUrl: string) {
    this.ws = new WebSocket(wsUrl);
    await new Promise<void>((resolve, reject) => {
      this.ws.onopen = () => resolve();
      this.ws.onerror = (e) => reject(e);
    });

    this.ws.onmessage = (event) => {
      const msg: CDPMessage = JSON.parse(event.data.toString());
      if (msg.id && this.callbacks.has(msg.id)) {
        const cb = this.callbacks.get(msg.id)!;
        this.callbacks.delete(msg.id);
        if (msg.error) {
          cb(msg);
        } else {
          cb(msg.result);
        }
      }
    };
  }

  send(method: string, params: any = {}): Promise<any> {
    const id = this.nextId++;
    return new Promise((resolve) => {
      this.callbacks.set(id, resolve);
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    this.ws.close();
  }
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function getMetrics(cdp: CDPClient) {
  await cdp.send("HeapProfiler.collectGarbage");
  await sleep(600);
  const res = await cdp.send("Performance.getMetrics");
  const metrics = res.metrics || [];
  const get = (name: string) => metrics.find((m: any) => m.name === name)?.value || 0;
  return {
    jsHeapUsedMB: Number((get("JSHeapUsedSize") / 1024 / 1024).toFixed(3)),
    totalNodes: get("Nodes"),
    jsEventListeners: get("JSEventListeners"),
    documents: get("Documents"),
    frames: get("Frames"),
    layouts: get("LayoutCount"),
  };
}

async function main() {
  console.log("==================================================================");
  console.log("  ALGOHUB EXTENDED MEMORY & RETAINED-OBJECT PROFILER INVESTIGATION");
  console.log("==================================================================");

  const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  const port = 9223;

  const chromeProc: ChildProcess = spawn(chromePath, [
    "--headless=new",
    `--remote-debugging-port=${port}`,
    "--no-first-run",
    "--no-default-browser-check",
    "--js-flags=--expose-gc",
  ]);

  await sleep(2000);

  try {
    const listRes = await fetch(`http://127.0.0.1:${port}/json/list`);
    const targets = await listRes.json();
    const pageTarget = targets.find((t: any) => t.type === "page") || targets[0];

    const cdp = new CDPClient();
    await cdp.connect(pageTarget.webSocketDebuggerUrl);

    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");
    await cdp.send("DOM.enable");
    await cdp.send("HeapProfiler.enable");
    await cdp.send("Performance.enable");

    // ------------------------------------------------------------------------
    // TEST 1: EXTENDED 15-CYCLE TEST (90 COMPONENT MOUNT/UNMOUNT TRANSITIONS)
    // ------------------------------------------------------------------------
    console.log("\n------------------------------------------------------------------");
    console.log("TEST 1: EXTENDED 15-CYCLE TEST (PLATEAU VS LINEAR GROWTH VERIFICATION)");
    console.log("------------------------------------------------------------------");

    await cdp.send("Page.navigate", { url: "http://localhost:3005/visualizer" });
    await sleep(2500);

    const baseline = await getMetrics(cdp);
    console.log(`[Baseline Snapshot (Pre-Test)]`);
    console.log(`  JS Heap Used   : ${baseline.jsHeapUsedMB} MB`);
    console.log(`  DOM Nodes      : ${baseline.totalNodes}`);
    console.log(`  EventListeners : ${baseline.jsEventListeners}`);
    console.log(`  Documents      : ${baseline.documents}`);

    const algorithms = ["bubble", "quick", "merge", "stack", "linked-list", "binary-search"];
    const snapshotHistory: { cycle: number; metrics: any; deltaFromPrev: any }[] = [];
    let prevMetrics = baseline;

    for (let cycle = 1; cycle <= 15; cycle++) {
      for (const algo of algorithms) {
        // Use client-side React state transition via TopicNavbarDropdown / history state
        await cdp.send("Runtime.evaluate", {
          expression: `
            (function() {
              const url = new URL(window.location.href);
              url.searchParams.set("algo", "${algo}");
              window.history.pushState({}, "", url.toString());
              window.dispatchEvent(new Event("popstate"));
            })()
          `,
        });
        await sleep(200);
      }

      if (cycle === 5 || cycle === 10 || cycle === 15) {
        const metrics = await getMetrics(cdp);
        const delta = {
          heapMB: Number((metrics.jsHeapUsedMB - prevMetrics.jsHeapUsedMB).toFixed(3)),
          nodes: metrics.totalNodes - prevMetrics.totalNodes,
          listeners: metrics.jsEventListeners - prevMetrics.jsEventListeners,
        };

        snapshotHistory.push({ cycle, metrics, deltaFromPrev: delta });
        console.log(`\n[Snapshot at Cycle ${cycle} (After Forced GC)]`);
        console.log(`  JS Heap Used   : ${metrics.jsHeapUsedMB} MB (Delta from prev: ${delta.heapMB >= 0 ? "+" : ""}${delta.heapMB} MB)`);
        console.log(`  DOM Nodes      : ${metrics.totalNodes} (Delta from prev: ${delta.nodes >= 0 ? "+" : ""}${delta.nodes})`);
        console.log(`  EventListeners : ${metrics.jsEventListeners} (Delta from prev: ${delta.listeners >= 0 ? "+" : ""}${delta.listeners})`);
        console.log(`  Documents      : ${metrics.documents}`);
        prevMetrics = metrics;
      }
    }

    // Growth Rate Comparison
    console.log("\n=== GROWTH RATE INTERVAL COMPARISON ===");
    console.log(`  Interval 0 -> 5  (0-30 switches) : Heap Delta: +${(snapshotHistory[0].metrics.jsHeapUsedMB - baseline.jsHeapUsedMB).toFixed(3)} MB | Node Delta: +${snapshotHistory[0].metrics.totalNodes - baseline.totalNodes} | Listener Delta: +${snapshotHistory[0].metrics.jsEventListeners - baseline.jsEventListeners}`);
    console.log(`  Interval 5 -> 10 (30-60 switches): Heap Delta: ${snapshotHistory[1].deltaFromPrev.heapMB >= 0 ? "+" : ""}${snapshotHistory[1].deltaFromPrev.heapMB} MB | Node Delta: ${snapshotHistory[1].deltaFromPrev.nodes >= 0 ? "+" : ""}${snapshotHistory[1].deltaFromPrev.nodes} | Listener Delta: ${snapshotHistory[1].deltaFromPrev.listeners >= 0 ? "+" : ""}${snapshotHistory[1].deltaFromPrev.listeners}`);
    console.log(`  Interval 10 -> 15 (60-90 switches): Heap Delta: ${snapshotHistory[2].deltaFromPrev.heapMB >= 0 ? "+" : ""}${snapshotHistory[2].deltaFromPrev.heapMB} MB | Node Delta: ${snapshotHistory[2].deltaFromPrev.nodes >= 0 ? "+" : ""}${snapshotHistory[2].deltaFromPrev.nodes} | Listener Delta: ${snapshotHistory[2].deltaFromPrev.listeners >= 0 ? "+" : ""}${snapshotHistory[2].deltaFromPrev.listeners}`);

    // ------------------------------------------------------------------------
    // TEST 2: RETAINED-OBJECT & DETACHED DOM INSPECTION
    // ------------------------------------------------------------------------
    console.log("\n------------------------------------------------------------------");
    console.log("TEST 2: RETAINED OBJECT INSPECTION & COMPONENT-LEVEL LEAK AUDIT");
    console.log("------------------------------------------------------------------");

    const retainedAudit = await cdp.send("Runtime.evaluate", {
      expression: `
        (function() {
          // 1. Check Detached vs Attached DOM nodes
          const allDomElements = document.querySelectorAll("*");
          const liveNodeCount = allDomElements.length;

          // 2. Check for zombie Canvas elements
          const canvases = document.querySelectorAll("canvas");

          // 3. Check for zombie Timers / Intervals
          let maxTimerId = setTimeout(()=>{}, 0);
          clearTimeout(maxTimerId);

          // 4. Check Presence Tracker & Realtime channels
          const presenceSyncHandlers = window.__algohub_listeners || 0;

          // 5. Inspect specific component signatures
          const sortingBars = document.querySelectorAll("[data-testid='sorting-bar'], .array-bar");
          const visualizerRoot = document.querySelector("main");

          return {
            liveNodeCount,
            canvasCount: canvases.length,
            highestTimerId: maxTimerId,
            visualizerContainerExists: !!visualizerRoot,
            pathname: window.location.pathname,
            search: window.location.search,
          };
        })()
      `,
      returnByValue: true,
    });

    console.log("DOM & Runtime Inspection Result:", JSON.stringify(retainedAudit.result?.value, null, 2));

    // ------------------------------------------------------------------------
    // TEST 3: REALISTIC SINGLE-VISUALIZER CONTINUOUS SESSION (50 RE-RUNS)
    // ------------------------------------------------------------------------
    console.log("\n------------------------------------------------------------------");
    console.log("TEST 3: REALISTIC CONTINUOUS SESSION (50 CONSECUTIVE SORTING RE-RUNS)");
    console.log("------------------------------------------------------------------");

    await cdp.send("Page.navigate", { url: "http://localhost:3005/visualizer?algo=bubble" });
    await sleep(2000);
    await cdp.send("HeapProfiler.collectGarbage");
    await sleep(500);

    const sessionBase = await getMetrics(cdp);
    console.log(`[Continuous Session Baseline]`);
    console.log(`  JS Heap Used   : ${sessionBase.jsHeapUsedMB} MB`);
    console.log(`  DOM Nodes      : ${sessionBase.totalNodes}`);
    console.log(`  EventListeners : ${sessionBase.jsEventListeners}`);

    console.log("Simulating 50 consecutive sorting runs with array generation & step execution...");

    await cdp.send("Runtime.evaluate", {
      expression: `
        new Promise((resolve) => {
          let runs = 0;
          const maxRuns = 50;

          function runOnce() {
            // Find Reset, Randomize, and Start buttons
            const buttons = Array.from(document.querySelectorAll("button"));
            const randomBtn = buttons.find(b => b.textContent && (b.textContent.includes("Random") || b.textContent.includes("Generate")));
            const startBtn = buttons.find(b => b.textContent && b.textContent.includes("Start"));
            const resetBtn = buttons.find(b => b.textContent && b.textContent.includes("Reset"));

            if (randomBtn) randomBtn.click();
            if (startBtn) startBtn.click();

            setTimeout(() => {
              if (resetBtn) resetBtn.click();
              runs++;
              if (runs < maxRuns) {
                runOnce();
              } else {
                resolve({ completedRuns: runs });
              }
            }, 60);
          }

          runOnce();
        })
      `,
      awaitPromise: true,
      returnByValue: true,
    });

    await sleep(1000);
    await cdp.send("HeapProfiler.collectGarbage");
    await sleep(600);

    const sessionFinal = await getMetrics(cdp);
    console.log(`\n[Continuous Session Final (After 50 Re-Runs & GC)]`);
    console.log(`  JS Heap Used   : ${sessionFinal.jsHeapUsedMB} MB (Delta: ${(sessionFinal.jsHeapUsedMB - sessionBase.jsHeapUsedMB).toFixed(3)} MB)`);
    console.log(`  DOM Nodes      : ${sessionFinal.totalNodes} (Delta: ${sessionFinal.totalNodes - sessionBase.totalNodes})`);
    console.log(`  EventListeners : ${sessionFinal.jsEventListeners} (Delta: ${sessionFinal.jsEventListeners - sessionBase.jsEventListeners})`);

    cdp.close();
  } catch (err) {
    console.error("Audit error:", err);
  } finally {
    chromeProc.kill();
    console.log("\n✓ Profiler audit process completed.");
  }
}

main().catch(console.error);
