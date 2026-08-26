(() => {
  "use strict";

  if (window.__CANDLELIT_STABILITY_PATCH__) return;
  window.__CANDLELIT_STABILITY_PATCH__ = true;

  const root = document.documentElement;
  const lowMemory = typeof navigator.deviceMemory === "number" && navigator.deviceMemory <= 4;
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if (lowMemory || reducedMotion) root.classList.add("performance-lite");

  // 场景图切换时优先异步解码；空闲时间按顺序预热后续场景，避免一次性抢主线程。
  const sceneImages = [
    "assets/images/exterior.webp",
    "assets/images/deadroom.webp",
    "assets/images/office.webp",
    "assets/images/lab.webp",
    "assets/images/tube.webp",
    "assets/images/cold-vault.webp"
  ];
  const scene = document.getElementById("scene-image");
  if (scene) {
    scene.decoding = "async";
    scene.fetchPriority = "high";
  }

  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const mayPrefetch = !connection?.saveData && !(connection && /(^|-)2g$/.test(connection.effectiveType || ""));
  function preloadOne(index = 0) {
    if (!mayPrefetch || index >= sceneImages.length || document.hidden) return;
    const img = new Image();
    img.decoding = "async";
    img.src = sceneImages[index];
    const next = () => schedulePreload(index + 1);
    if (img.decode) img.decode().then(next, next);
    else { img.onload = next; img.onerror = next; }
  }
  function schedulePreload(index = 0) {
    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => preloadOne(index), { timeout: 1300 });
    } else {
      setTimeout(() => preloadOne(index), 240 + index * 80);
    }
  }
  schedulePreload(0);
  if (document.hidden) {
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) schedulePreload(0);
    }, { once: true });
  }

  // 防止触摸设备上的双击/抖动导致同一重型交互连续执行两次。
  const expensiveSelector = [
    ".hotspot", ".location-btn", ".evidence-card", ".inventory-item",
    ".archive-tab", ".ink-button", ".portal-nav", ".portal-thread",
    ".portal-search-hit", ".literary-page-btn", "[data-story]"
  ].join(",");
  let lastTarget = null;
  let lastAt = 0;
  document.addEventListener("click", (event) => {
    const target = event.target.closest?.(expensiveSelector);
    if (!target) return;
    const now = performance.now();
    if (target === lastTarget && now - lastAt < 145) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    lastTarget = target;
    lastAt = now;
  }, true);

  // 长任务连续出现时自动降级纯装饰效果，不改变谜题、文本或交互规则。
  if ("PerformanceObserver" in window) {
    try {
      let longTasks = 0;
      let windowStart = performance.now();
      const observer = new PerformanceObserver((list) => {
        const now = performance.now();
        if (now - windowStart > 8000) {
          longTasks = 0;
          windowStart = now;
        }
        longTasks += list.getEntries().filter(entry => entry.duration >= 90).length;
        if (longTasks >= 3) {
          root.classList.add("performance-lite");
          observer.disconnect();
        }
      });
      observer.observe({ type: "longtask", buffered: true });
    } catch (_) {}
  }

  // 阅读长文时不让定时新案弹窗强行覆盖页面；改成低干扰“待阅”提示。
  const dispatch = document.getElementById("dispatch-modal");
  const reading = document.getElementById("portal-reading");
  const breadcrumb = document.getElementById("portal-breadcrumb");
  function ensureDispatchChip() {
    if (!breadcrumb || document.getElementById("deferred-dispatch-chip")) return;
    const chip = document.createElement("button");
    chip.id = "deferred-dispatch-chip";
    chip.type = "button";
    chip.textContent = "新案电报 · 待读";
    chip.addEventListener("click", () => {
      // Close the current article first so the intentionally requested dispatch
      // is not caught by the interruption guard below.
      document.getElementById("portal-reading-close")?.click();
      requestAnimationFrame(() => {
        document.getElementById("portal-urgent-thread")?.click();
        chip.remove();
      });
    });
    breadcrumb.appendChild(chip);
  }
  if (dispatch && reading && "MutationObserver" in window) {
    const dispatchObserver = new MutationObserver(() => {
      if (!dispatch.classList.contains("hidden") && reading.classList.contains("open")) {
        dispatch.classList.add("hidden");
        ensureDispatchChip();
      }
    });
    dispatchObserver.observe(dispatch, { attributes: true, attributeFilter: ["class"] });
  }

  // 从后台恢复时清掉可能遗留的阅读忙碌状态，避免辅助状态看起来像“卡死”。
  window.addEventListener("pageshow", () => {
    document.getElementById("portal-reading")?.removeAttribute("aria-busy");
  });
})();
