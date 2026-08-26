(() => {
  "use strict";

  const SAVE_KEY = "dead-letter-room-save-v7";
  const $ = id => document.getElementById(id);

  function readState(){
    try{return JSON.parse(localStorage.getItem(SAVE_KEY) || "null") || {};}
    catch(_){return {};}
  }

  function decorateArchiveTabs(){
    const root = $("archive-tabs");
    if(!root) return;
    const state = readState();
    const fragments = Array.isArray(state.fragments) ? state.fragments : [1];
    const read = Array.isArray(state.readFragments) ? state.readFragments : [];
    const current = Number(state.archivePage || 1);
    [...root.children].forEach((btn,index) => {
      const n = index + 1;
      if(btn.dataset.folioDecorated === "1" && btn.dataset.folioActive === String(btn.classList.contains("active"))) return;
      const unlocked = !btn.disabled || fragments.includes(n);
      const active = btn.classList.contains("active") || current === n;
      const status = !unlocked ? "缺页" : (read.includes(n) || active ? "已读" : "可读");
      btn.innerHTML = `<span class="archive-tab-title">第${n}页</span><small class="archive-tab-state">${status}</small>`;
      btn.dataset.folioDecorated = "1";
      btn.dataset.folioActive = String(active);
      btn.setAttribute("aria-label", `第${n}页，${status}`);
    });
  }

  function keepPeopleVisible(){
    const root = $("suspect-notes");
    if(!root) return;
    root.querySelectorAll("details").forEach(detail => {
      detail.open = true;
      detail.setAttribute("data-always-open", "1");
    });
  }

  function showReasoning(){
    const modal = $("reasoning-modal");
    const backdrop = $("modal-backdrop");
    const menu = $("menu-modal");
    if(!modal || !backdrop) return;
    menu?.classList.add("hidden");
    modal.classList.remove("hidden");
    backdrop.classList.remove("hidden");
    document.documentElement.classList.add("reasoning-open");
    $("reasoning-close")?.focus({preventScroll:true});
  }

  function hideReasoning(){
    const modal = $("reasoning-modal");
    if(!modal || modal.classList.contains("hidden")) return false;
    modal.classList.add("hidden");
    $("modal-backdrop")?.classList.add("hidden");
    document.documentElement.classList.remove("reasoning-open");
    $("menu-btn")?.focus({preventScroll:true});
    return true;
  }

  function initObservers(){
    const archiveTabs = $("archive-tabs");
    if(archiveTabs){
      new MutationObserver(() => requestAnimationFrame(decorateArchiveTabs))
        .observe(archiveTabs,{childList:true,subtree:false,attributes:true,attributeFilter:["class","disabled"]});
    }
    const people = $("suspect-notes");
    if(people){
      new MutationObserver(() => requestAnimationFrame(keepPeopleVisible))
        .observe(people,{childList:true,subtree:true});
    }
  }

  document.addEventListener("click", e => {
    if(e.target.closest("#archive-btn")) requestAnimationFrame(() => requestAnimationFrame(decorateArchiveTabs));
    if(e.target.closest("#notebook-btn")) requestAnimationFrame(() => requestAnimationFrame(keepPeopleVisible));

    if(e.target.closest("#open-reasoning-board")){
      e.preventDefault();
      showReasoning();
      return;
    }
    if(e.target.closest("#reasoning-close")){
      e.preventDefault();
      hideReasoning();
      return;
    }
    const summary = e.target.closest("#suspect-notes details[data-always-open] > summary");
    if(summary){
      e.preventDefault();
      summary.parentElement.open = true;
    }
  }, true);

  document.addEventListener("click", e => {
    if(e.target === $("modal-backdrop") && !$("reasoning-modal")?.classList.contains("hidden")){
      e.preventDefault();
      e.stopImmediatePropagation();
      hideReasoning();
    }
  }, true);

  document.addEventListener("keydown", e => {
    if(e.key === "Escape" && !$("reasoning-modal")?.classList.contains("hidden")){
      e.preventDefault();
      e.stopImmediatePropagation();
      hideReasoning();
    }
  }, true);

  window.addEventListener("storage", e => {
    if(e.key === SAVE_KEY) decorateArchiveTabs();
  });

  initObservers();
  decorateArchiveTabs();
  keepPeopleVisible();
  document.documentElement.dataset.interfacePolish = "v1";
})();
