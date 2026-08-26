(function () {
  'use strict';

  const OVERLAY_CLASS = 'wj-scroll-overlay';
  const VIEWPORT_CLASS = 'wj-scroll-viewport';
  const EXCLUDED_IDS = new Set(['boot', 'transition', 'toast']);
  const NAME_HINT = /(modal|overlay|reader|archive|record|dossier|profile|biograph|literature|document|book|story|paper|library)/i;
  let queued = false;

  function visible(el) {
    if (!(el instanceof HTMLElement)) return false;
    const style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 2 && r.height > 2;
  }

  function overflowAmount(el) {
    return Math.max(0, el.scrollHeight - el.clientHeight);
  }

  function isLargeFixed(el) {
    if (!visible(el) || EXCLUDED_IDS.has(el.id)) return false;
    const style = getComputedStyle(el);
    if (style.position !== 'fixed') return false;
    const r = el.getBoundingClientRect();
    return r.width >= innerWidth * 0.55 && r.height >= innerHeight * 0.55;
  }

  function hinted(el) {
    const name = `${el.id || ''} ${typeof el.className === 'string' ? el.className : ''}`;
    return el.getAttribute('role') === 'dialog' || NAME_HINT.test(name);
  }

  function hasCloseControl(el) {
    return !!el.querySelector('button.close, button[data-close], button[aria-label*="关闭"], button[title*="关闭"]');
  }

  function addClass(el, name) {
    if (!el.classList.contains(name)) el.classList.add(name);
  }

  function setImportant(el, prop, value) {
    if (el.style.getPropertyValue(prop) === value && el.style.getPropertyPriority(prop) === 'important') return;
    el.style.setProperty(prop, value, 'important');
  }

  function unlock(el, overlay) {
    if (!visible(el)) return;
    addClass(el, overlay ? OVERLAY_CLASS : VIEWPORT_CLASS);
    if (overlay) {
      /* 旧版长文页面可能写死 overflow:hidden；这里仅覆盖纵向滚动相关属性。 */
      setImportant(el, 'overflow-y', 'auto');
      setImportant(el, 'overflow-x', 'hidden');
      if (el.style.getPropertyValue('-webkit-overflow-scrolling') !== 'touch') {
        el.style.setProperty('-webkit-overflow-scrolling', 'touch');
      }
      if (el.style.getPropertyValue('overscroll-behavior-y') !== 'contain') {
        el.style.setProperty('overscroll-behavior-y', 'contain');
      }
    }
  }

  function repairModal() {
    const modal = document.querySelector('#modal .modal');
    const body = modal && modal.querySelector('.modal-body');
    if (!modal || !body || !visible(modal)) return;
    unlock(body, false);
  }

  function candidateRoots() {
    const roots = new Set();

    document.querySelectorAll('[role="dialog"], [class*="overlay"], [class*="reader"], [class*="archive"], [class*="record"], [class*="dossier"], [class*="literature"], [class*="document"], [class*="book"], [class*="story"], [class*="paper"], [class*="library"]').forEach(el => {
      if (el instanceof HTMLElement && isLargeFixed(el)) roots.add(el);
    });

    /* 类名未知时仍识别覆盖大部分屏幕的 fixed 页面。 */
    document.querySelectorAll('body *').forEach(el => {
      if (el instanceof HTMLElement && isLargeFixed(el)) roots.add(el);
    });

    return [...roots];
  }

  function scrollableDescendants(root) {
    const candidates = [];
    root.querySelectorAll('*').forEach(el => {
      if (!(el instanceof HTMLElement) || !visible(el)) return;
      const r = el.getBoundingClientRect();
      if (r.height < innerHeight * 0.38 || r.width < Math.min(260, innerWidth * 0.22)) return;
      if (overflowAmount(el) <= 4) return;
      candidates.push(el);
    });

    /* 优先使用最内层真正承载正文的区域，避免父子同时出现两条滚动条。 */
    return candidates.filter(el => !candidates.some(other => other !== el && el.contains(other)));
  }

  function repairCustomOverlays() {
    for (const root of candidateRoots()) {
      if (!visible(root) || EXCLUDED_IDS.has(root.id) || root.id === 'modal') continue;
      if (root.closest('#boot, #transition, #toast')) continue;

      const innerTargets = scrollableDescendants(root);
      if (innerTargets.length) {
        innerTargets.forEach(el => unlock(el, false));
        continue;
      }

      /* 单页长文通常直接超出全屏根容器；此时滚动根容器本身。 */
      if (overflowAmount(root) > 4 || ((hinted(root) || hasCloseControl(root)) && root.scrollHeight > innerHeight + 4)) {
        unlock(root, true);
      }
    }
  }

  function cleanup() {
    document.querySelectorAll(`.${OVERLAY_CLASS}, .${VIEWPORT_CLASS}`).forEach(el => {
      if (!(el instanceof HTMLElement) || !visible(el)) return;
      if (el.matches('#modal .modal-body')) return;
      if (overflowAmount(el) <= 2 && !isLargeFixed(el)) {
        el.classList.remove(OVERLAY_CLASS, VIEWPORT_CLASS);
      }
    });
  }

  function repair() {
    queued = false;
    repairModal();
    repairCustomOverlays();
    cleanup();
  }

  function scheduleRepair() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(repair);
  }

  function activeScrollTarget() {
    const all = [...document.querySelectorAll(`.${VIEWPORT_CLASS}, .${OVERLAY_CLASS}, #modal .modal-body`)]
      .filter(el => visible(el) && overflowAmount(el) > 2);
    if (!all.length) return null;
    /* 后出现的元素通常是当前最上层弹窗。 */
    return all[all.length - 1];
  }

  /* 补充键盘翻页；鼠标滚轮、触控板、拖动滚动条和触摸滑动均走浏览器原生滚动。 */
  document.addEventListener('keydown', function (e) {
    if (!['PageDown', 'PageUp', 'Home', 'End'].includes(e.key)) return;
    const active = document.activeElement;
    if (active && /^(INPUT|TEXTAREA|SELECT)$/.test(active.tagName)) return;
    const target = activeScrollTarget();
    if (!target) return;
    const page = Math.max(120, target.clientHeight * 0.82);
    if (e.key === 'PageDown') target.scrollBy({ top: page, behavior: 'smooth' });
    if (e.key === 'PageUp') target.scrollBy({ top: -page, behavior: 'smooth' });
    if (e.key === 'Home') target.scrollTo({ top: 0, behavior: 'smooth' });
    if (e.key === 'End') target.scrollTo({ top: target.scrollHeight, behavior: 'smooth' });
    e.preventDefault();
  }, true);

  const observer = new MutationObserver(scheduleRepair);
  observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['class', 'style', 'hidden']
  });

  addEventListener('resize', scheduleRepair, { passive: true });
  addEventListener('orientationchange', scheduleRepair, { passive: true });
  addEventListener('load', scheduleRepair, { once: true });
  document.addEventListener('DOMContentLoaded', scheduleRepair, { once: true });
  scheduleRepair();
})();
