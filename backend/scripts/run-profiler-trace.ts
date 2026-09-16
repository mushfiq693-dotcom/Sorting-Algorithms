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
          console.error("CDP Error:", msg.error);
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

async function main() {
  console.log("=== LAUNCHING HEADLESS CHROME FOR PROFILING & TRACE ===");
  const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  const port = 9222;

  const chromeProc: ChildProcess = spawn(chromePath, [
    "--headless=new",
    `--remote-debugging-port=${port}`,
    "--no-first-run",
    "--no-default-browser-check",
    "--js-flags=--expose-gc",
  ]);

  await sleep(1500);

  try {
    const versionRes = await fetch(`http://127.0.0.1:${port}/json/version`);
    const versionData = await versionRes.json();
    console.log("✓ Connected to Chrome CDP:", versionData.Browser);

    const listRes = await fetch(`http://127.0.0.1:${port}/json/list`);
    const targets = await listRes.json();
    const pageTarget = targets.find((t: any) => t.type === "page") || targets[0];

    const cdp = new CDPClient();
    await cdp.connect(pageTarget.webSocketDebuggerUrl);

    // Enable domains
    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");
    await cdp.send("DOM.enable");
    await cdp.send("HeapProfiler.enable");
    await cdp.send("Performance.enable");

    // ------------------------------------------------------------------------
    // SECTION 1: MEMORY LEAK PROFILING (Mount / Unmount Cycles)
    // ------------------------------------------------------------------------
    console.log("\n=== 1. MEMORY LEAK PROFILING (5+ Mount/Unmount Cycles) ===");
    console.log("Navigating to http://localhost:3005/visualizer ...");
    await cdp.send("Page.navigate", { url: "http://localhost:3005/visualizer" });
    await sleep(2000);

    // Force GC to get pristine baseline
    await cdp.send("HeapProfiler.collectGarbage");
    await sleep(500);

    const baselineMetrics = await cdp.send("Performance.getMetrics");
    const getMetric = (metrics: any[], name: string) =>
      metrics.find((m: any) => m.name === name)?.value || 0;

    const baseHeap = getMetric(baselineMetrics.metrics, "JSHeapUsedSize");
    const baseNodes = getMetric(baselineMetrics.metrics, "Nodes");
    const baseListeners = getMetric(baselineMetrics.metrics, "JSEventListeners");

    console.log(`[Baseline Snapshot]`);
    console.log(`  JS Heap Used   : ${(baseHeap / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  DOM Nodes      : ${baseNodes}`);
    console.log(`  EventListeners : ${baseListeners}`);

    // Cycle through 6 algorithms / visualizers 5 times each
    const algorithmsToCycle = ["bubble", "quick", "merge", "stack", "linked-list", "binary-search"];
    console.log(`\nExecuting 5 full navigation/mounting cycles across 6 visualizers...`);

    for (let cycle = 1; cycle <= 5; cycle++) {
      for (const algo of algorithmsToCycle) {
        await cdp.send("Runtime.evaluate", {
          expression: `
            window.location.search = "?algo=${algo}";
          `,
        });
        await sleep(350);
      }
      process.stdout.write(`  ✓ Completed Cycle ${cycle}/5\n`);
    }

    // Unmount back to baseline
    await cdp.send("Page.navigate", { url: "http://localhost:3005/visualizer?algo=bubble" });
    await sleep(1500);

    // Force GC before final measurement
    await cdp.send("HeapProfiler.collectGarbage");
    await sleep(800);

    const postMetrics = await cdp.send("Performance.getMetrics");
    const postHeap = getMetric(postMetrics.metrics, "JSHeapUsedSize");
    const postNodes = getMetric(postMetrics.metrics, "Nodes");
    const postListeners = getMetric(postMetrics.metrics, "JSEventListeners");

    const heapDiff = (postHeap - baseHeap) / 1024 / 1024;
    const nodesDiff = postNodes - baseNodes;
    const listenersDiff = postListeners - baseListeners;

    console.log(`\n[Post-5x-Cycle Snapshot (After GC)]`);
    console.log(`  JS Heap Used   : ${(postHeap / 1024 / 1024).toFixed(2)} MB (Diff: ${heapDiff >= 0 ? "+" : ""}${heapDiff.toFixed(2)} MB)`);
    console.log(`  DOM Nodes      : ${postNodes} (Diff: ${nodesDiff >= 0 ? "+" : ""}${nodesDiff})`);
    console.log(`  EventListeners : ${postListeners} (Diff: ${listenersDiff >= 0 ? "+" : ""}${listenersDiff})`);

    // ------------------------------------------------------------------------
    // SECTION 2: RUNTIME ANIMATION FPS & DROPPED FRAMES TRACE
    // ------------------------------------------------------------------------
    console.log("\n=== 2. RUNTIME ANIMATION FPS & PERFORMANCE TRACE ===");
    console.log("Triggering active sorting animation loop and measuring frame deltas...");

    // Evaluate client-side FPS tracer while running animation
    const traceResult = await cdp.send("Runtime.evaluate", {
      expression: `
        new Promise((resolve) => {
          // Find Start button and click it
          const startBtn = Array.from(document.querySelectorAll("button")).find(b => b.textContent && b.textContent.includes("Start"));
          if (startBtn) startBtn.click();

          const frameDeltas = [];
          let lastTime = performance.now();
          let frameCount = 0;
          const maxFrames = 120; // 2 seconds of 60fps frames

          function step(now) {
            const delta = now - lastTime;
            lastTime = now;
            frameDeltas.push(delta);
            frameCount++;

            if (frameCount < maxFrames) {
              requestAnimationFrame(step);
            } else {
              resolve(frameDeltas);
            }
          }

          requestAnimationFrame(step);
        });
      `,
      awaitPromise: true,
      returnByValue: true,
    });

    const deltas: number[] = traceResult.result?.value || [];
    if (deltas.length > 0) {
      // First delta might include startup click, slice off first 2
      const activeDeltas = deltas.slice(2);
      const avgFrameTime = activeDeltas.reduce((a, b) => a + b, 0) / activeDeltas.length;
      const fps = 1000 / avgFrameTime;
      const maxFrameTime = Math.max(...activeDeltas);
      const minFrameTime = Math.min(...activeDeltas);

      // Dropped frames: frame time > 20ms (> 1.2x budget of 16.6ms)
      const droppedFrames = activeDeltas.filter((d) => d > 20).length;
      const droppedPct = ((droppedFrames / activeDeltas.length) * 100).toFixed(1);

      console.log(`  Sampled Frames      : ${activeDeltas.length} frames`);
      console.log(`  Average Frame Time  : ${avgFrameTime.toFixed(2)} ms`);
      console.log(`  Calculated FPS      : ${fps.toFixed(1)} FPS`);
      console.log(`  Min Frame Duration  : ${minFrameTime.toFixed(2)} ms`);
      console.log(`  Max Frame Duration  : ${maxFrameTime.toFixed(2)} ms`);
      console.log(`  Dropped Frames (>20ms): ${droppedFrames} (${droppedPct}%)`);
    }

    cdp.close();
  } catch (err) {
    console.error("CDP profiling failed:", err);
  } finally {
    chromeProc.kill();
    console.log("\n✓ Headless Chrome instance terminated.");
  }
}

main().catch(console.error);
