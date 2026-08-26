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

  // 支持页自动弹出：第一次进入第三章后，仅在界面空闲时出现一次。
  // 规则：已支持 -> 永不自动弹；此前手动看过 -> 不再自动弹；关闭/“先继续查案”后 -> 不重复。
  const SUPPORT_SEEN_KEY = "dead-letter-room-support-seen";
  const SUPPORT_PAID_KEY = "dead-letter-room-support-paid";
  const supportButton = document.getElementById("support-btn");
  const supportModal = document.getElementById("support-modal");
  const gameScreen = document.getElementById("game-screen");
  const chapterKicker = document.getElementById("chapter-kicker");
  const chapterTitle = document.getElementById("chapter-title");
  const storyInterlude = document.getElementById("story-interlude");

  const storage = {
    get(key) { try { return localStorage.getItem(key); } catch (_) { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch (_) {} }
  };

  let supportTimer = 0;
  let supportRetryCount = 0;

  function supportHandled() {
    return storage.get(SUPPORT_PAID_KEY) === "1" || storage.get(SUPPORT_SEEN_KEY) === "1";
  }

  function markSupportSeen() {
    storage.set(SUPPORT_SEEN_KEY, "1");
    if (supportTimer) { clearTimeout(supportTimer); supportTimer = 0; }
  }

  function inThirdChapter() {
    const kicker = chapterKicker?.textContent?.trim() || "";
    const title = chapterTitle?.textContent?.trim() || "";
    return kicker.includes("第三章") || title === "隔夜";
  }

  function gameIsVisible() {
    return !!gameScreen && !gameScreen.classList.contains("hidden");
  }

  function modalIsVisible(el) {
    return !!el && !el.classList.contains("hidden");
  }

  function supportDisplayBlocked() {
    if (document.hidden || !gameIsVisible() || !inThirdChapter()) return true;
    if (modalIsVisible(storyInterlude)) return true;
    const blockers = [
      "dispatch-modal", "detail-modal", "archive-modal", "notebook-modal",
      "hint-modal", "menu-modal", "ending-modal"
    ];
    return blockers.some(id => modalIsVisible(document.getElementById(id)));
  }

  function tryAutoSupport() {
    supportTimer = 0;
    if (!supportButton || !supportModal || supportHandled() || !gameIsVisible() || !inThirdChapter()) return;

    if (supportDisplayBlocked()) {
      // 玩家正在阅读/推理时不抢焦点；最多等待约 24 秒，之后交给下一次界面变化再次检查。
      if (supportRetryCount < 24) {
        supportRetryCount += 1;
        supportTimer = window.setTimeout(tryAutoSupport, 1000);
      }
      return;
    }

    supportRetryCount = 0;
    // 先写入“已看过”，再打开；即使玩家此时刷新，也不会重复弹出。
    markSupportSeen();
    supportButton.click();
  }

  function scheduleAutoSupport() {
    if (!supportButton || !supportModal || supportHandled() || !gameIsVisible() || !inThirdChapter()) return;
    if (supportTimer) clearTimeout(supportTimer);
    supportRetryCount = 0;
    // 给章节过场收尾、图片渲染和玩家视线约 1.4 秒缓冲。
    supportTimer = window.setTimeout(tryAutoSupport, 1400);
  }

  // 玩家在第三章之前主动查看过支持页，也算已经看过，不再进行自动提示。
  supportButton?.addEventListener("click", markSupportSeen, true);

  // 无论支持页通过何种方式打开，都记录“已看过”，防止再次自动弹出。
  if (supportModal && "MutationObserver" in window) {
    new MutationObserver(() => {
      if (!supportModal.classList.contains("hidden")) markSupportSeen();
    }).observe(supportModal, { attributes: true, attributeFilter: ["class"] });
  }

  // 章节推进和读档都会改写标题；据此覆盖正常推进与“继续调查”两条路径。
  if (chapterKicker && "MutationObserver" in window) {
    const chapterObserver = new MutationObserver(scheduleAutoSupport);
    chapterObserver.observe(chapterKicker, { childList: true, characterData: true, subtree: true });
    if (chapterTitle) chapterObserver.observe(chapterTitle, { childList: true, characterData: true, subtree: true });
  }
  if (gameScreen && "MutationObserver" in window) {
    new MutationObserver(scheduleAutoSupport).observe(gameScreen, { attributes: true, attributeFilter: ["class"] });
  }

  // 从后台回来、关闭其他弹窗后，再检查一次是否到了安全弹出时机。
  document.addEventListener("visibilitychange", () => { if (!document.hidden) scheduleAutoSupport(); });
  document.addEventListener("click", (event) => {
    if (event.target.closest?.("[data-close],#resume-game,#support-later,#dialogue-next,#story-continue")) {
      window.setTimeout(scheduleAutoSupport, 180);
    }
  }, true);

  // 处理直接读取第三章存档时，脚本加载后标题已经是第三章、不会再触发 mutation 的情况。
  window.setTimeout(scheduleAutoSupport, 500);

  // 从后台恢复时清掉可能遗留的阅读忙碌状态，避免辅助状态看起来像“卡死”。
  window.addEventListener("pageshow", () => {
    document.getElementById("portal-reading")?.removeAttribute("aria-busy");
  });
})();
