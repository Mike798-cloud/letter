(() => {
  "use strict";

  const BUILD = "1.0.0";
  let locked = false;

  const $ = id => document.getElementById(id);
  const esc = s => String(s ?? "").replace(/[&<>\"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

  function paperMarkup(type, done) {
    const commonHead = `<div class="doc-head"><strong>17-B / ORIGINAL</strong><span>STATION ARCHIVE · PAPER EXAM</span></div><div class="doc-lines"><i class="doc-line"></i><i class="doc-line"></i><i class="doc-line"></i><i class="doc-line"></i></div>`;
    if (type === "A") {
      return `<div class="ve-stage ve-paper-stage"><div class="ve-photo-bed" style="background-image:url('assets/images/office.webp');background-position:44% 63%"></div><span class="ve-evidence-tag">LETTER A · OBLIQUE LIGHT</span><span class="ve-doc-status">${done ? "IMPRESSION RECORDED" : "UNINKED / INDENTED"}</span><article class="ve-paper">${commonHead}<div class="ve-indent-area"><i></i><i></i><i></i><i></i></div>${done ? `<p class="ve-revealed graphite">安娜·韦伯，17—B。前五封已交；第六封未投递。</p>` : `<div class="ve-side-light"></div>`}</article><div class="ve-scale"></div></div>`;
    }
    if (type === "B") {
      return `<div class="ve-stage ve-paper-stage"><div class="ve-photo-bed" style="background-image:url('assets/images/office.webp');background-position:53% 59%"></div><span class="ve-evidence-tag">LETTER B · SEALED MEDICAL PAPER</span><span class="ve-doc-status">${done ? "SEAL OPENED / DOCUMENT EXPOSED" : "FRAGILE WAX / DO NOT PRY"}</span><article class="ve-paper">${commonHead}<div class="ve-dose-card"><span>处方记录</span><span>剂量</span><span>日期</span><span>A. Weber</span><span class="obscured">${done ? "0.?" : "—"}</span><span>19—</span></div><i class="watermark-stain"></i>${done ? `<p class="ve-revealed">剂量栏正被旧水渍穿过；缺失处仍不可凭外观补写。</p>` : ``}</article><i class="ve-wax-seal"></i><div class="ve-scale"></div></div>`;
    }
    return `<div class="ve-stage ve-paper-stage"><div class="ve-photo-bed" style="background-image:url('assets/images/office.webp');background-position:69% 61%"></div><span class="ve-evidence-tag">LETTER C · BLUE-EDGE STOCK</span><span class="ve-doc-status">${done ? "LOCAL REVEAL RECORDED" : "TRANSLUCENT TRACE / UNCONFIRMED"}</span><article class="ve-paper blue">${commonHead}${done ? `<p class="ve-revealed">剂量是 0.6，不是 6。安娜知道。——H</p>` : `<p class="ve-blue-ghost">一段近乎透明的笔画停在纸纤维之间，肉眼不能确认材料。</p>`}</article><div class="ve-scale"></div></div>`;
  }

  function ledgerMarkup() {
    return `<div class="ve-stage ve-ledger-stage"><div class="ve-photo-bed"></div><span class="ve-evidence-tag">DEAD LETTER CABINET · SOURCE MATERIAL</span><div class="ve-ledger-stack"><article class="ve-ledger-sheet"><h4>死信处理守则</h4><p>旧火漆：隔开热源，缓慢温热。</p><p>经验距离：约两指宽。禁止贴火、硬撬。</p><small>旧邮局内部用品手册 / 手写修订仍保留</small><i class="ve-ledger-stamp">ARCHIVE</i></article><article class="ve-ledger-sheet"><h4>用品采购 · 蓝边公文纸</h4><p>纸张：淀粉上浆。</p><p>批次：17-B。用途：站务与内部医疗附页。</p><small>采购登记 / 同批纸张需先做对照后再显色</small><i class="ve-ledger-stamp">17-B</i></article></div></div>`;
  }

  function waxMarkup() {
    return `<div class="ve-stage ve-wax-stage"><div class="ve-photo-bed"></div><span class="ve-evidence-tag">LETTER B · WAX EXAMINATION</span><div class="ve-envelope"></div><p class="ve-envelope-address">旧医疗纸片 · 封口未拆</p><i class="ve-wax-seal"></i><span class="ve-doc-status">依据死信柜守则处理</span><div class="ve-scale"></div></div>`;
  }

  function timingMarkup(done) {
    return `<div class="ve-stage ve-timing-stage"><div class="ve-photo-bed"></div><span class="ve-evidence-tag">PNEUMATIC TUBE · MAINTENANCE RECONSTRUCTION</span><section class="ve-time-log"><h4>胶囊时刻记录</h4><div class="ve-time-row"><strong>17日 19:20</strong><span>蓝墨残留对应进入管线</span></div><div class="ve-time-row ${done ? "marked" : ""}"><strong>18日 07:32</strong><span>接收槽记录胶囊落下</span></div><div class="ve-time-row"><strong>间隔</strong><span>需与维护铭牌的四个卡槽比对</span></div></section><section class="ve-valve-plate"><div class="ve-dial"><span>0h</span><span>3h</span><span>6h</span><span>≈12h</span></div></section><span class="ve-doc-status">${done ? "PIN: OVERNIGHT SLOT" : "SLOTS: 0 / 3 / 6 / OVERNIGHT"}</span></div>`;
  }

  function chartMarkup(done) {
    return `<div class="ve-stage ve-chart-stage"><div class="ve-photo-bed"></div><span class="ve-evidence-tag">COLD ROOM · ORIGINAL TEMPERATURE LOG</span><article class="ve-clipboard"><div class="ve-temp-title"><strong>低温库温度记录</strong><span>11 / 16—17</span></div><div class="ve-temp-grid"><span>日期</span><span>06:00</span><span>12:00</span><span>18:00</span><span>11 / 16</span><span>3°C</span><span>3°C</span><span>2°C</span><span>11 / 17</span><span>2°C</span><span class="handwrite ${done ? "confirmed" : "overwritten"}">2°C</span><span>2°C</span></div><p class="ve-chart-note">${done ? "<b>侧光复核：</b>原始书写为 2°C；后加数字“1”形成 12°C。" : "墨色与压痕层次不一致。必须先用冷库物理痕迹确认这张表值得进一步侧光复核。"}</p></article><div class="ve-scale"></div></div>`;
  }

  function handMarkup() {
    return `<div class="ve-stage ve-hand-stage"><div class="ve-photo-bed"></div><span class="ve-evidence-tag">HANDWRITING · STRUCTURAL COMPARISON</span><div class="ve-hand-board"><article class="ve-hand-strip"><b>今晨来信 / 原件</b><div class="ve-hand-line">…nacht… h… weiter…</div><i class="ve-hook-mark"></i><small>末笔回钩角度 / 停笔位置</small></article><article class="ve-hand-strip"><b>温度表覆写 / 原件</b><div class="ve-hand-line">…höhe… h… 12…</div><i class="ve-hook-mark"></i><small>不比较“整体像不像”</small></article><article class="ve-hand-strip"><b>登记簿 / 原件</b><div class="ve-hand-line">…heute… h… 17-B…</div><i class="ve-hook-mark"></i><small>只叠合稳定结构特征</small></article></div><p class="ve-hand-note">三份纸张材质不同；比较对象只有同一字母的稳定收笔结构。</p></div>`;
  }

  function bookMarkup() {
    return `<div class="ve-stage ve-book-stage"><div class="ve-photo-bed"></div><span class="ve-evidence-tag">REFERENCE MANUAL · MARGINAL NOTES</span><div class="ve-open-book"><article class="ve-book-page"><h4>死亡时间判断</h4><p>低温会减慢尸体现象的发展速度，因此常温时间表不能直接套用。</p><p>原始伤口形态与已固定尸斑不会因此被“重写”。</p><i class="ve-book-margin"></i><small>214</small></article><article class="ve-book-page"><h4>纸张与笔迹检验</h4><p>原证物处理前，先用牺牲样本建立对照。</p><p>笔迹比对优先看稳定结构，而不是整体外观。</p><i class="ve-book-margin"></i><small>215</small></article></div></div>`;
  }

  function relationMarkup(question) {
    return `<div class="ve-stage ve-relation-stage"><div class="ve-photo-bed"></div><span class="ve-evidence-tag">FINAL RECONSTRUCTION · RELATION BOARD</span><div class="ve-caseboard"><article class="ve-case-card one"><i class="ve-case-pin"></i><b>EVIDENCE / 01</b><span>从下方证物池选择第一件能够直接支持当前问题的材料。</span></article><article class="ve-case-card two"><i class="ve-case-pin"></i><b>EVIDENCE / 02</b><span>第二件材料必须与第一件形成独立、可检验的关系。</span></article><i class="ve-thread"></i><p class="ve-question-slip">${esc(question || "当前关系待验证")}</p></div></div>`;
  }

  function upgradeDetailVisual() {
    const root = $("detail-visual");
    if (!root || root.dataset.veBusy === "1") return;
    const child = root.firstElementChild;
    if (!child || child.classList.contains("ve-stage")) return;

    root.dataset.veBusy = "1";
    try {
      if (child.classList.contains("paper-evidence")) {
        const sheet = child.querySelector(".paper-sheet");
        const cls = sheet?.className || "";
        const type = cls.includes("type-A") ? "A" : cls.includes("type-B") ? "B" : "C";
        const done = child.classList.contains("done");
        root.innerHTML = paperMarkup(type, done);
      } else if (child.classList.contains("ledger-visual")) {
        root.innerHTML = ledgerMarkup();
      } else if (child.classList.contains("wax-evidence")) {
        root.innerHTML = waxMarkup();
      } else if (child.classList.contains("timing-dossier")) {
        const done = /释放销|隔夜槽/.test(child.textContent || "");
        root.innerHTML = timingMarkup(done);
      } else if (child.classList.contains("chart-visual")) {
        const done = !!child.querySelector("del") || /底层原记录|侧光确认/.test(child.textContent || "");
        root.innerHTML = chartMarkup(done);
      } else if (child.classList.contains("hand-compare")) {
        root.innerHTML = handMarkup();
      } else if (child.classList.contains("book-visual")) {
        root.innerHTML = bookMarkup();
      } else if (child.classList.contains("relation-board")) {
        root.innerHTML = relationMarkup($("detail-title")?.textContent || "");
      }
    } finally {
      delete root.dataset.veBusy;
    }
  }

  function upgradeInteractive() {
    const body = document.querySelector("#interactive-overlay .interactive-body");
    if (!body) return;
    const heat = body.querySelector("#heat-source");
    if (heat && heat.dataset.veUpgraded !== "1") {
      heat.textContent = "";
      heat.setAttribute("aria-label", "酒精灯热源");
      heat.dataset.veUpgraded = "1";
    }
    const paperWork = body.querySelector(".paper-work");
    if (paperWork && paperWork.dataset.veUpgraded !== "1") {
      paperWork.dataset.veUpgraded = "1";
      paperWork.setAttribute("data-evidence-stage", paperWork.classList.contains("blue") ? "蓝边纸局部显色" : "压痕侧锋显影");
    }
    const chartWork = body.querySelector(".chart-work");
    if (chartWork && chartWork.dataset.veUpgraded !== "1") chartWork.dataset.veUpgraded = "1";
    const timeline = body.querySelector(".timeline-work");
    if (timeline && timeline.dataset.veUpgraded !== "1") timeline.dataset.veUpgraded = "1";
  }

  function run() {
    if (locked) return;
    locked = true;
    queueMicrotask(() => {
      try {
        upgradeDetailVisual();
        upgradeInteractive();
      } finally { locked = false; }
    });
  }

  function validate() {
    const errors = [];
    if (!$("detail-visual")) errors.push("detail-visual missing");
    const refs = ["assets/images/office.webp", "assets/images/lab.webp", "assets/images/tube.webp", "assets/images/cold-vault.webp", "assets/images/deadroom.webp"];
    if (!refs.length) errors.push("asset reference table empty");
    return errors;
  }

  function init() {
    run();
    const detail = $("detail-modal");
    if (detail) new MutationObserver(run).observe(detail, {subtree:true, childList:true, characterData:true, attributes:true});
    const bodyObserver = new MutationObserver(run);
    bodyObserver.observe(document.body, {subtree:true, childList:true});
    const errors = validate();
    if (errors.length) console.warn("[letter visual evidence upgrade]", errors);
    window.__LETTER_VISUAL_EVIDENCE_UPGRADE__ = {version:BUILD, validate, refresh:run};
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, {once:true});
  else init();
})();
