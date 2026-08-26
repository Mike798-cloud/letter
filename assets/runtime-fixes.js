(() => {
  "use strict";

  // The support dialog may still be opened manually from “支持本站”.
  // Automatic display is intentionally restricted to the exact transition
  // from the first chapter interlude into Chapter 2, and only once per browser.
  const AUTO_SHOWN_KEY = "dead-letter-room-support-auto-chapter2-v1";
  const PAID_KEY = "dead-letter-room-support-paid";
  const storyContinue = document.getElementById("story-continue");
  const storyKicker = document.getElementById("story-kicker");
  const chapterKicker = document.getElementById("chapter-kicker");
  const supportButton = document.getElementById("support-btn");
  const supportModal = document.getElementById("support-modal");

  if (!storyContinue || !storyKicker || !chapterKicker || !supportButton || !supportModal) return;

  let pendingChapterTwoPopup = false;

  const storageGet = key => {
    try { return localStorage.getItem(key); } catch (_) { return null; }
  };
  const storageSet = (key, value) => {
    try { localStorage.setItem(key, value); } catch (_) {}
  };

  const hasAlreadyHandledAutoPopup = () => Boolean(storageGet(AUTO_SHOWN_KEY) || storageGet(PAID_KEY));

  const showAfterChapterTransition = () => {
    if (!pendingChapterTwoPopup) return;
    pendingChapterTwoPopup = false;

    // finishStory("chapter1") updates the chapter synchronously.  A small delay
    // lets the interlude close and the Chapter 2 UI finish painting before the
    // support sheet is opened, so it never competes with the story transition.
    window.setTimeout(() => {
      if (hasAlreadyHandledAutoPopup()) return;
      if (chapterKicker.textContent.trim() !== "第二章") return;

      storageSet(AUTO_SHOWN_KEY, "1");
      supportButton.click();
    }, 120);
  };

  storyContinue.addEventListener("click", () => {
    if (hasAlreadyHandledAutoPopup()) return;

    // Only the first chapter's closing interlude is allowed to arm the popup.
    // Opening/continuing a Chapter 2 save, entering Chapters 1/3/4, returning
    // from menus, or manually opening the support dialog cannot trigger it.
    if (!storyKicker.textContent.includes("第一章之后")) return;

    pendingChapterTwoPopup = true;
    showAfterChapterTransition();
  }, true);
})();


(() => {
  "use strict";

  const SAVE_KEY = "dead-letter-room-save-v7";
  const JUDGEMENT_KEY = "dead-letter-room-evidence-judgements-v1";

  const defs = {
    c_lividity: {
      chapter: 1,
      name: "背侧尸斑",
      titles: ["赫尔曼的尸体", "背侧尸斑"],
      question: "发现时尸体俯卧，但固定尸斑主要在背侧。现在最稳妥的判断是哪一项？",
      options: [
        "俯卧就是死亡时的原始姿势，尸斑位置可以忽略",
        "尸体在尸斑形成过程中曾长期仰卧，之后姿势发生过改变",
        "这足以证明死者一定在冷库里死亡",
        "这足以证明有人为了制造密室而搬动尸体"
      ],
      correct: 1,
      explanation: "尸斑能支持的是“发现姿势并非完整死亡过程”。它能证明姿势发生过错位，但此时还不能替移动者、地点或目的下结论。"
    },
    c_latch: {
      chapter: 1,
      name: "门闩线痕",
      titles: ["内侧门闩", "门闩线痕"],
      question: "插销确实落在内侧，但受力处有新磨痕和透明纤维。下一步最合理的判断是什么？",
      options: [
        "门既然从内侧闩住，就可以直接排除外部操控",
        "应该继续验证是否存在细线牵引门闩的受力路径",
        "透明纤维已经足以证明维克托操作过门闩",
        "磨痕说明门闩在案发前已经彻底损坏"
      ],
      correct: 1,
      explanation: "这里最重要的是把“内侧闩住”和“可能存在外部传力”同时保留。磨痕与纤维给出了可验证方向，却还没有给出操作者身份。"
    },
    c_window: {
      chapter: 1,
      name: "钉死高窗",
      titles: ["钉死的高窗", "钉死高窗"],
      question: "高窗木板的钉头锈蚀连续，没有近期拔动断口。它最适合支持哪一句话？",
      options: [
        "近期没有通过拆开木板的方式从高窗进出",
        "高窗从建成以后从未被任何人打开过",
        "只要高窗没开，案件就必然属于自杀",
        "锈蚀连续说明通风管也一定没有被使用"
      ],
      correct: 0,
      explanation: "证物只能排除“近期拆板进出”这一条具体路径。把时间范围和对象限定住，才不会把一个排除项扩大成整个案件的答案。"
    },
    c_vent: {
      chapter: 1,
      name: "通风管钓线",
      titles: ["通风管", "通风管钓线"],
      question: "通风管不能容手臂通过，却留下新鲜断口的透明钓线和木屑。最值得保留的推论是什么？",
      options: [
        "有人曾经从通风管整个人进入死信室",
        "线材可能穿过通风管传递过拉力，应与门闩痕迹联查",
        "木屑说明通风管本身就是凶器",
        "只要发现钓线，就可以直接认定这是预谋杀人"
      ],
      correct: 1,
      explanation: "管径排除了“人通过”，却没有排除“力通过”。钓线和木屑的价值在于它们可能与另一处受力痕迹组成连续机关链。"
    },
    c_tea: {
      chapter: 1,
      name: "镇静剂凉茶",
      titles: ["凉茶", "镇静剂凉茶"],
      question: "杯底有镇静剂沉淀，但胃内容物没有对应成分。哪一句最符合证据边界？",
      options: [
        "死者一定喝下了镇静剂，只是剂量太少所以没检出",
        "只能确认杯中有药，不能确认药物进入了死者体内",
        "杯中有药就足以证明医生实施了投毒",
        "胃内没有药，说明这杯茶与案件完全无关"
      ],
      correct: 1,
      explanation: "“杯中存在”与“人体摄入”是两件不同的事实。既不能把杯子直接写成死因，也不能因为未摄入就把它从调查中删掉。"
    },
    c_rigor: {
      chapter: 1,
      name: "后枕伤与尸体现象",
      titles: ["石地与头部", "后枕伤与尸体现象"],
      question: "后枕伤高度接近桌角，尸体现象却与07:40的常规推算不一致。此时应该怎样处理？",
      options: [
        "直接按尸体现象给出精确死亡时刻，不再考虑环境",
        "把伤口形态与时间估算分开记录，并继续验证低温是否干扰尸体现象",
        "桌角高度相符已经能证明有人把死者推向桌角",
        "只要时间推算异常，就说明法医学记录全部失效"
      ],
      correct: 1,
      explanation: "伤口能回答“撞到了什么”，尸体现象尝试回答“经过了多久”。两条信息必须分开，并让环境温度进入时间判断。"
    },
    e_letterA: {
      chapter: 2,
      name: "压痕信 · 17—B",
      titles: ["信 A · 已显影", "压痕信 · 17—B"],
      question: "压痕显出“前五封已交；第六封未投递”。这条信息最合理的用途是什么？",
      options: [
        "第六封没有寄出，因此写信人一定计划犯罪",
        "确认存在一封应当出现却未进入正常投递流程的信，并继续追查它的去向",
        "前五封已经寄出，所以它们与十九年前的事件完全无关",
        "只要编号是17—B，就能确定第六封一直藏在地下室"
      ],
      correct: 1,
      explanation: "压痕先建立的是“第六封存在且未按正常流程投递”。它把一个缺口变成调查对象，但还不能替这封信安排藏匿地点或动机。"
    },
    e_letterB: {
      chapter: 2,
      name: "安娜的氯醛处方",
      titles: ["信 B · 已开启", "安娜的氯醛处方"],
      question: "处方水渍正穿过剂量栏，小数点位置模糊。现在最可靠的处理方式是哪一项？",
      options: [
        "按肉眼最像的数字直接记录为6克",
        "承认剂量栏本身不完整，必须等待独立材料互证具体数字",
        "因为纸张受潮，所以整张处方都失去证据价值",
        "医生开过处方，就能说明他与当晚死亡直接有关"
      ],
      correct: 1,
      explanation: "受损处方仍然有价值，但它不能自己补上缺失的小数点。把“不知道具体数字”保留下来，才给后续互证留下空间。"
    },
    e_letterC: {
      chapter: 2,
      name: "淀粉墨 · 0.6克",
      titles: ["信 C · 已显影", "淀粉墨 · 0.6克"],
      question: "隐写补注写着“剂量是0.6，不是6。安娜知道。——H”。它最直接修正了什么？",
      options: [
        "修正了十九年前对处方剂量的读取，说明小数点不能被省略",
        "直接证明H就是杀死赫尔曼的人",
        "证明安娜故意把错误剂量告诉了玛戈",
        "证明今天所有被改动的记录都由同一个人书写"
      ],
      correct: 0,
      explanation: "这张补注首先修正的是“0.6/6”的读法。签名、今天的字迹以及谁在利用旧误解，都需要后面的独立材料继续回答。"
    },
    c_capsule: {
      chapter: 3,
      name: "隔夜邮戳胶囊",
      titles: ["隔夜邮戳胶囊", "延时阀 · 已复现"],
      question: "胶囊带有17日晚间的邮戳油墨，却到18日清晨才落下。最关键的结论是什么？",
      options: [
        "胶囊出现的时间就是它被放入管道的时间",
        "气动管可以制造跨夜机械延时，因此到达时间不能直接当作投递时间",
        "只有邮局局长知道延时阀，所以操作人一定是赫尔曼",
        "隔夜到达说明胶囊曾经被人带出邮局再送回来"
      ],
      correct: 1,
      explanation: "这一步解决的是“时间如何被延迟”，不是“谁操作”。机械装置把投递时刻与出现时刻拆开，给时间线增加了一个可验证变量。"
    },
    c_shelf: {
      chapter: 3,
      name: "冷库层板纤维",
      titles: ["空置长层板", "冷库层板纤维"],
      question: "层板霜面粘着与赫尔曼制服相同的深灰羊毛纤维。它最稳妥地说明什么？",
      options: [
        "死者或其制服曾与冷库层板发生直接接触",
        "赫尔曼一定是在冷库层板上被杀害",
        "只要纤维一致，就能确认搬运者是玛戈",
        "纤维来自旧制服，所以不需要再与其他痕迹组合"
      ],
      correct: 0,
      explanation: "纤维能建立“接触”，不能单独决定接触发生在死亡前还是死亡后，更不能决定是谁造成的。它需要与温度和拖痕一起进入关系链。"
    },
    c_drag: {
      chapter: 3,
      name: "冷库平行拖痕",
      titles: ["地面拖痕", "冷库平行拖痕"],
      question: "两道平行拖痕从层板延伸到门外，间距接近死者肩宽。最合理的下一步是什么？",
      options: [
        "把它与层板接触痕迹组合，验证是否存在由层板向门外的连续搬运路径",
        "仅凭间距就认定拖痕一定由尸体形成",
        "拖痕朝门外，所以死者一定自己爬出了冷库",
        "拖痕出现后，温度记录就不再重要"
      ],
      correct: 0,
      explanation: "拖痕本身仍需要来源互证；与层板纤维组合后，它才从一条地面痕迹变成更连续的搬运路径。"
    },
    c_chart: {
      chapter: 3,
      name: "温度表覆写",
      titles: ["温度记录表", "温度表覆写"],
      question: "11月17日的“12°C”是在原“2°C”前补写数字1。最值得写入案卷的是哪一句？",
      options: [
        "原记录约为2°C，后来有人把它改写成看似正常的12°C",
        "温度表被改过，所以冷库当天一定没有正常运行",
        "覆写数字能直接证明改写者就是杀人者",
        "只要真实温度是2°C，就能精确推回死亡分钟数"
      ],
      correct: 0,
      explanation: "覆写证明“记录被改动”以及真实低温曾被遮盖。身份与死亡时刻仍然必须分别依靠笔迹和法医学关系来确认。"
    },
    c_hand: {
      chapter: 3,
      name: "三处h的同形收笔",
      titles: ["三处h的同形收笔"],
      question: "今晨来信、温度覆写与登记簿中的h都有相同回钩。笔迹比对最适合支持什么？",
      options: [
        "三份书写具有稳定的共同结构特征，应继续与登记簿身份互证",
        "字母看起来相似，所以三份文字百分之百出自同一时刻",
        "只要字体相似，就能证明写字的人实施了全部现场机关",
        "同色墨水比收笔结构更能证明是同一个人"
      ],
      correct: 0,
      explanation: "笔迹比较能把几份书写放到同一条身份验证线上，却不能越过证据直接把所有行为都归到一个人身上。"
    }
  };

  const chapterRequirements = {
    1: ["c_lividity", "c_latch", "c_window", "c_vent", "c_tea", "c_rigor"],
    2: ["e_letterA", "e_letterB", "e_letterC"],
    3: ["c_capsule", "c_shelf", "c_drag", "c_chart", "c_hand"]
  };

  let judgements = loadJudgements();
  let lastMainSnapshot = readMainRaw();
  let detailMutationLock = false;

  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s ?? "").replace(/[&<>\"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  }
  function loadJudgements() {
    try {
      const raw = JSON.parse(localStorage.getItem(JUDGEMENT_KEY) || "null");
      return raw && typeof raw === "object" ? raw : {};
    } catch (_) { return {}; }
  }
  function saveJudgements() {
    try { localStorage.setItem(JUDGEMENT_KEY, JSON.stringify(judgements)); } catch (_) {}
  }
  function readMainRaw() {
    try { return localStorage.getItem(SAVE_KEY) || ""; } catch (_) { return ""; }
  }
  function readMain() {
    try { return JSON.parse(readMainRaw() || "null") || {}; } catch (_) { return {}; }
  }
  function currentChapter() {
    const n = Number(readMain().chapter || 1);
    return n >= 1 && n <= 4 ? n : 1;
  }
  function requiredFor(chapter) { return chapterRequirements[chapter] || []; }
  function statusFor(chapter) {
    const required = requiredFor(chapter);
    const done = required.filter(id => judgements[id]?.correct).length;
    return {required, done, total: required.length, complete: required.length === 0 || done === required.length};
  }
  function clueFromCurrentDetail() {
    const title = ($("detail-title")?.textContent || "").trim();
    if (!title) return null;
    for (const [id, def] of Object.entries(defs)) {
      if (def.titles.some(t => title === t || title.includes(t))) return id;
    }
    return null;
  }
  function choiceLetter(index) { return String.fromCharCode(65 + index); }

  function replaceLegacyReasonActions() {
    const root = $("detail-actions");
    if (!root) return;
    const buttons = [...root.querySelectorAll("button")];
    const legacy = buttons.filter(b => /^放入：/.test((b.textContent || "").trim()));
    if (!legacy.length) return;
    const id = clueFromCurrentDetail();
    if (!id || !defs[id]) return;

    legacy.forEach(b => b.remove());
    root.querySelectorAll(".evidence-judgement").forEach(n => n.remove());
    renderJudgement(root, id);
  }

  function renderJudgement(root, id) {
    const def = defs[id];
    const record = judgements[id];
    const wrap = document.createElement("section");
    wrap.className = "evidence-judgement";
    wrap.dataset.evidence = id;

    const head = document.createElement("div");
    head.className = "judgement-head";
    head.innerHTML = `<span>证物判断 / 四选一</span><b>${record?.correct ? "已写入调查簿" : "需要作出判断"}</b>`;
    wrap.appendChild(head);

    const q = document.createElement("p");
    q.className = "judgement-question";
    q.textContent = def.question;
    wrap.appendChild(q);

    const grid = document.createElement("div");
    grid.className = "judgement-options";
    def.options.forEach((text, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "judgement-option";
      if (record && record.choice === i) btn.classList.add(record.correct ? "is-correct" : "is-wrong");
      btn.disabled = !!record?.correct;
      btn.innerHTML = `<span>${choiceLetter(i)}</span><b>${esc(text)}</b>`;
      btn.addEventListener("click", () => chooseJudgement(id, i, wrap));
      grid.appendChild(btn);
    });
    wrap.appendChild(grid);

    const feedback = document.createElement("p");
    feedback.className = "judgement-feedback";
    if (record?.correct) {
      feedback.classList.add("success");
      feedback.textContent = def.explanation;
    } else if (record) {
      feedback.classList.add("warning");
      feedback.textContent = "这句话比证物本身多走了一步。选择已暂存，你可以重新判断；只有证据能直接支持的那一项才会写入本章复核。";
    } else {
      feedback.textContent = "四项都能组成一个故事，但只有一项没有越过当前证物的边界。回答会自动保存。";
    }
    wrap.appendChild(feedback);

    root.prepend(wrap);
  }

  function chooseJudgement(id, choice, wrap) {
    const def = defs[id];
    const previous = judgements[id] || {};
    const correct = choice === def.correct;
    judgements[id] = {
      choice,
      correct,
      attempts: Number(previous.attempts || 0) + 1,
      updatedAt: Date.now()
    };
    saveJudgements();

    const root = wrap.parentElement;
    if (root) {
      wrap.remove();
      renderJudgement(root, id);
    }
    decorateEvidenceCards();
    syncProgressLabel();
    if (correct) showToast("这项判断已写入调查簿。", "success");
    else showToast("判断暂存，但证据还不足以支持这句话。", "warning");
  }

  function showToast(text, type = "") {
    const toast = $("toast");
    if (!toast) return;
    toast.textContent = text;
    toast.classList.remove("hidden", "success", "warning");
    if (type) toast.classList.add(type);
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.add("hidden"), 2200);
  }

  function hideOpenModals(exceptId) {
    ["detail-modal","archive-modal","notebook-modal","hint-modal","support-modal","menu-modal","reasoning-modal"].forEach(id => {
      if (id !== exceptId) $(id)?.classList.add("hidden");
    });
    $("location-rail")?.classList.remove("open");
    $("evidence-panel")?.classList.remove("open");
  }

  function closePatchModal(id) {
    $(id)?.classList.add("hidden");
    $("modal-backdrop")?.classList.add("hidden");
    if (id === "reasoning-modal") document.documentElement.classList.remove("reasoning-open");
  }

  function openEvidenceIndex() {
    closePatchModal("detail-modal");
    if (matchMedia("(max-width:760px)").matches) {
      $("evidence-panel")?.classList.add("open");
      $("modal-backdrop")?.classList.remove("hidden");
    }
  }

  function showJudgementGate(chapter) {
    const st = statusFor(chapter);
    if (st.complete) return false;
    const detail = $("detail-modal");
    if (!detail) return false;
    hideOpenModals("detail-modal");
    detail.classList.remove("hidden");
    $("modal-backdrop")?.classList.remove("hidden");

    const missing = st.required.filter(id => !judgements[id]?.correct);
    $("detail-kicker").textContent = `阶段复核 · 第${chapter}章前置判断`;
    $("detail-title").textContent = "先把证物写成能够被检验的判断";
    $("detail-visual").innerHTML = `
      <div class="judgement-gate-sheet">
        <div><span>RECORDED</span><b>${st.done}</b><small>已成立</small></div>
        <i></i>
        <div><span>REQUIRED</span><b>${st.total}</b><small>本章必需</small></div>
      </div>`;
    $("detail-copy").innerHTML = `
      <p class="checkpoint-intro">本章的证物已经收集到可以进入阶段复核的程度，但“收集到”不等于“理解了”。先回到证物索引，对每件关键证物完成一次四选一判断；所有结果都会保存。</p>
      <div class="judgement-missing"><b>仍需完成</b>${missing.map(id => `<span>${esc(defs[id].name)}</span>`).join("")}</div>`;
    const actions = $("detail-actions");
    actions.innerHTML = "";
    const back = document.createElement("button");
    back.className = "ink-button primary";
    back.textContent = "回到证物索引";
    back.onclick = openEvidenceIndex;
    const log = document.createElement("button");
    log.className = "ink-button";
    log.textContent = "查看判断记录";
    log.onclick = openJudgementLog;
    actions.append(back, log);
    return true;
  }

  function openJudgementLog() {
    hideOpenModals("reasoning-modal");
    const modal = $("reasoning-modal");
    const root = $("reason-board");
    if (!modal || !root) return;
    modal.classList.remove("hidden");
    $("modal-backdrop")?.classList.remove("hidden");
    document.documentElement.classList.add("reasoning-open");
    $("reasoning-title").textContent = "证物判断记录";
    const intro = modal.querySelector(".reasoning-intro");
    if (intro) intro.textContent = "这里不再把证物机械地塞进“时间 / 机关 / 人物”三个抽屉。记录只回答一件事：你从当前证物中，究竟能够合理推出到哪一步。";
    const foot = modal.querySelector(".reasoning-footnote");
    if (foot) foot.textContent = "第一至第三章的关键证物判断全部成立后，阶段复核才会开放。错误选择会保留到你重新作答，但不会把错误结论写入正式复核。";

    root.innerHTML = [1,2,3].map(chapter => {
      const st = statusFor(chapter);
      const rows = st.required.map(id => {
        const r = judgements[id];
        const chosen = r ? defs[id].options[r.choice] : "尚未作答";
        return `<div class="judgement-log-row ${r?.correct ? "done" : r ? "attempted" : ""}"><b>${esc(defs[id].name)}</b><span>${r?.correct ? "已成立" : r ? "待修正" : "未判断"}</span><small>${esc(chosen)}</small></div>`;
      }).join("");
      return `<section class="judgement-log-chapter"><header><b>第${chapter}章</b><span>${st.done} / ${st.total}</span></header>${rows}</section>`;
    }).join("");
  }

  function decorateEvidenceCards() {
    const list = $("evidence-list");
    if (!list) return;
    [...list.querySelectorAll(".evidence-card")].forEach(card => {
      // 只清掉旧版“时间 / 机关 / 人物”分类标签；自己的状态标签必须幂等更新，
      // 否则 MutationObserver 会因为反复 remove/append 形成无意义的重绘循环。
      card.querySelectorAll("em:not(.evidence-judgement-state)").forEach(em => em.remove());
      const text = card.textContent || "";
      const id = Object.keys(defs).find(key => text.includes(defs[key].name));
      if (!id) return;
      const span = card.querySelector("span");
      if (!span) return;

      const state = judgements[id]?.correct ? "done" : judgements[id] ? "pending" : "idle";
      const label = state === "done" ? "判断已记录" : state === "pending" ? "判断待修正" : "待判断";
      let mark = span.querySelector("em.evidence-judgement-state");
      if (!mark) {
        mark = document.createElement("em");
        mark.className = "evidence-judgement-state";
        span.appendChild(mark);
      }
      if (mark.dataset.state !== state) {
        mark.dataset.state = state;
        mark.className = `evidence-judgement-state${state === "done" ? " done" : state === "pending" ? " pending" : ""}`;
      }
      if (mark.textContent !== label) mark.textContent = label;
    });
  }

  function syncProgressLabel() {
    const node = $("objective-progress");
    if (!node) return;
    const ch = currentChapter();
    if (ch > 3) return;
    const st = statusFor(ch);
    const base = node.textContent.replace(/\s*·\s*判断\s*\d+\s*\/\s*\d+\s*$/, "");
    const next = `${base} · 判断 ${st.done}/${st.total}`;
    if (node.textContent !== next) node.textContent = next;
  }

  function gateCheckpointEvent(event) {
    const target = event.target instanceof Element ? event.target.closest("#objective-progress.checkpoint-pending,[data-checkpoint]") : null;
    if (!target) return;
    const chapter = Number(target.getAttribute("data-checkpoint")) || currentChapter();
    const st = statusFor(chapter);
    if (st.complete) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    showJudgementGate(chapter);
  }

  function gateCheckpointKeyboard(event) {
    if (event.key !== "Enter" && event.key !== " ") return;
    gateCheckpointEvent(event);
  }

  function inspectAutoCheckpoint() {
    const modal = $("detail-modal");
    const title = ($("detail-title")?.textContent || "").trim();
    if (!modal || modal.classList.contains("hidden") || !title.startsWith("阶段复核")) return;
    const ch = currentChapter();
    if (ch <= 3 && !statusFor(ch).complete) showJudgementGate(ch);
  }

  function resetJudgementsIfNewCase() {
    const now = readMainRaw();
    if (now === lastMainSnapshot) return;
    let before = {}, after = {};
    try { before = JSON.parse(lastMainSnapshot || "null") || {}; } catch (_) {}
    try { after = JSON.parse(now || "null") || {}; } catch (_) {}
    const wasProgressed = Number(before.chapter || 1) > 1 || (before.clues?.length || 0) > 0 || Number(before.actions || 0) > 0;
    const isFresh = Number(after.chapter || 1) === 1 && (after.clues?.length || 0) === 0 && Number(after.actions || 0) === 0;
    if (wasProgressed && isFresh) {
      judgements = {};
      saveJudgements();
    }
    lastMainSnapshot = now;
  }

  function validatePatch() {
    const errors = [];
    const ids = new Set(Object.keys(defs));
    for (const [chapter, required] of Object.entries(chapterRequirements)) {
      required.forEach(id => { if (!ids.has(id)) errors.push(`chapter ${chapter} missing judgement ${id}`); });
    }
    Object.entries(defs).forEach(([id, def]) => {
      if (!Array.isArray(def.options) || def.options.length !== 4) errors.push(`${id} does not have four options`);
      if (!(def.correct >= 0 && def.correct < 4)) errors.push(`${id} invalid correct index`);
      if (!def.titles?.length) errors.push(`${id} has no detail-title mapping`);
    });
    return errors;
  }

  function init() {
    const menuButton = $("open-reasoning-board");
    if (menuButton) menuButton.textContent = "查看判断记录";

    document.addEventListener("click", gateCheckpointEvent, true);
    document.addEventListener("keydown", gateCheckpointKeyboard, true);
    document.addEventListener("click", event => {
      const button = event.target instanceof Element ? event.target.closest("#open-reasoning-board") : null;
      if (!button) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      openJudgementLog();
    }, true);
    $("reasoning-close")?.addEventListener("click", event => {
      event.preventDefault();
      event.stopImmediatePropagation();
      closePatchModal("reasoning-modal");
    }, true);

    // 结局页“重新登记此案”会立即清空主案卷，因此这里同步清掉本补丁记录。
    // 标题页“登记此案”可能先弹出复核方式选择，不在点击瞬间清空；真正开始新案卷后
    // 由下方主存档变化检测统一处理，避免玩家只是打开选择框就丢掉判断记录。
    ["ending-restart","reset-game"].forEach(id => {
      $(id)?.addEventListener("click", () => {
        judgements = {};
        saveJudgements();
        decorateEvidenceCards();
        syncProgressLabel();
      }, true);
    });

    const detailActions = $("detail-actions");
    if (detailActions) {
      new MutationObserver(() => {
        if (detailMutationLock) return;
        detailMutationLock = true;
        queueMicrotask(() => {
          try { replaceLegacyReasonActions(); }
          finally { detailMutationLock = false; }
        });
      }).observe(detailActions, {childList:true});
    }

    const detailTitle = $("detail-title");
    if (detailTitle) new MutationObserver(inspectAutoCheckpoint).observe(detailTitle, {childList:true, characterData:true, subtree:true});
    const detailModal = $("detail-modal");
    if (detailModal) new MutationObserver(inspectAutoCheckpoint).observe(detailModal, {attributes:true, attributeFilter:["class"]});

    const progress = $("objective-progress");
    if (progress) new MutationObserver(syncProgressLabel).observe(progress, {childList:true, subtree:true, characterData:true});
    const evidence = $("evidence-list");
    if (evidence) new MutationObserver(decorateEvidenceCards).observe(evidence, {childList:true, subtree:true});

    // 只保留低频主存档复核。旧版每0.6s/1.2s反复扫描DOM，在长时间游玩时会造成额外负担。
    setInterval(resetJudgementsIfNewCase, 1800);

    // 兼容页面恢复时详情弹窗已经处于打开状态；正常游戏流程中的后续详情变化仍由观察器接管。
    replaceLegacyReasonActions();
    inspectAutoCheckpoint();
    syncProgressLabel();
    decorateEvidenceCards();
    const errors = validatePatch();
    if (errors.length) console.warn("[letter reasoning upgrade]", errors);
    window.__LETTER_REASONING_UPGRADE__ = {version:"1.1.0", defs, chapterRequirements, statusFor, validate:validatePatch};
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, {once:true});
  else init();
})();


(() => {
  "use strict";

  const BUILD = "2.0.0";
  const $ = id => document.getElementById(id);
  const esc = value => String(value ?? "").replace(/[&<>\"]/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[ch]));

  const imageByKind = {
    office: "assets/images/office.webp",
    lab: "assets/images/lab.webp",
    tube: "assets/images/tube.webp",
    cold: "assets/images/cold-vault.webp",
    dead: "assets/images/deadroom.webp"
  };

  function photoPanel({image, kicker, title, status, note, crop = "50% 50%", zoom = 1.55, extra = ""}) {
    return `<div class="ve-photo-evidence" data-ve-upgraded="1">
      <figure class="ve-photo-main">
        <img src="${image}" alt="${esc(title)}所在调查现场">
        <figcaption><b>${esc(kicker)}</b><span>${esc(status)}</span></figcaption>
      </figure>
      <aside class="ve-photo-notes">
        <p class="ve-photo-kicker">EVIDENCE RECORD / 17-B</p>
        <h3>${esc(title)}</h3>
        <figure class="ve-photo-crop">
          <img src="${image}" alt="${esc(title)}局部复核" style="object-position:${crop};--ve-zoom:${zoom}">
          <figcaption>局部复核 · 只记录当前已经能够确认的事实</figcaption>
        </figure>
        <p>${esc(note)}</p>
        ${extra}
      </aside>
    </div>`;
  }

  function paperPanel(type, done) {
    if (type === "A") {
      return photoPanel({
        image: imageByKind.office,
        kicker: "纸张侧光检查",
        title: done ? "信 A · 压痕已经显出" : "信 A · 空白压痕",
        status: done ? "压痕文字已登记" : "未显影 · 只确认纸面存在浅沟",
        note: done ? "侧锋显影已经完成，17—B与“第六封未投递”被作为可复核文字登记。" : "当前只能确认纸面存在浅沟；在没有安全工具之前，不对文字内容作猜测。",
        crop: "58% 66%",
        zoom: 1.85
      });
    }
    if (type === "B") {
      return photoPanel({
        image: imageByKind.office,
        kicker: "旧医疗纸片 / 封缄复核",
        title: done ? "信 B · 已安全开启" : "信 B · 火漆封面",
        status: done ? "封口已开启 · 原纸未被硬撬破坏" : "脆化火漆 · 等待合适热源与处理依据",
        note: done ? "处方原件已经暴露；水渍正穿过剂量栏，缺失的小数点不能凭外观补写。" : "先确认死信柜中的旧邮件处理守则，再用稳定热源隔距缓慢温热。",
        crop: "42% 62%",
        zoom: 1.75
      });
    }
    return photoPanel({
      image: done ? imageByKind.lab : imageByKind.office,
      kicker: "蓝边纸 / 局部显色",
      title: done ? "信 C · 补注已经显出" : "信 C · 蓝边纸",
      status: done ? "局部显色完成" : "透明痕迹尚未确认材料",
      note: done ? "对照实验、稀释和局部涂抹都完成后，补注才被正式登记。" : "在确认纸张上浆工艺并完成牺牲样本对照前，不把透明痕迹直接解释成某种墨水。",
      crop: done ? "58% 58%" : "67% 61%",
      zoom: 1.7
    });
  }

  function ledgerPanel() {
    return photoPanel({
      image: imageByKind.office,
      kicker: "死信柜 / 用品来源",
      title: "旧邮件处理守则与蓝边纸采购登记",
      status: "来源记录 · 可作为后续操作依据",
      note: "这里提供的是处理方法和纸张来源，不直接给出案件结论。火漆需隔距慢热；蓝边纸属于淀粉上浆批次17—B。",
      crop: "35% 62%",
      zoom: 1.7,
      extra: `<div class="ve-record-lines"><span><b>守则</b>旧火漆：隔开热源，缓慢温热。</span><span><b>采购</b>蓝边纸：淀粉上浆，批次17—B。</span></div>`
    });
  }

  function waxPanel() {
    return photoPanel({
      image: imageByKind.office,
      kicker: "封缄检查",
      title: "旧火漆封口",
      status: "等待按守则处理",
      note: "封口脆化，硬撬会破坏下面的薄纸。操作条件只有在处理守则与稳定热源都齐备后才成立。",
      crop: "48% 58%",
      zoom: 1.8
    });
  }

  function timingPanel(done) {
    return photoPanel({
      image: imageByKind.tube,
      kicker: "气动管 / 延时机构",
      title: done ? "延时阀 · 隔夜档已复现" : "延时阀 · 等待时间复现",
      status: done ? "17日19:20 → 18日07:32 / 机械时间窗成立" : "卡槽：立即 / 3h / 6h / 隔夜",
      note: done ? "释放销位于隔夜槽，能解释昨夜进入而今晨才落下的胶囊。" : "不要把胶囊出现的时刻直接当作投递时刻；先把昨夜邮戳和今晨落下放到同一时间轴。",
      crop: "53% 48%",
      zoom: 1.55,
      extra: `<div class="ve-record-lines"><span><b>进入</b>17日 19:20</span><span><b>落下</b>18日 07:32</span></div>`
    });
  }

  function chartPanel(done) {
    return photoPanel({
      image: imageByKind.cold,
      kicker: "低温库 / 原始温度记录",
      title: "11月17日温度表",
      status: done ? "侧光复核完成 · 底层原记录2°C" : "记录存在覆写 · 等待侧光复核",
      note: done ? "侧光确认“12°C”是在原“2°C”前补写数字1。记录被改动，但改写者身份仍需独立材料支持。" : "先用层板纤维与拖痕确认低温库确实与尸体有关，再对覆写位置做侧光检查。",
      crop: "48% 57%",
      zoom: 1.7,
      extra: `<div class="ve-record-lines"><span><b>11 / 16</b>3°C · 3°C · 2°C</span><span><b>11 / 17</b>2°C · ${done ? "原2°C / 后加1" : "12°C（待复核）"} · 2°C</span></div>`
    });
  }

  function handPanel() {
    return `<div class="ve-photo-compare" data-ve-upgraded="1">
      <header><p>EVIDENCE RECORD / HANDWRITING</p><h3>三处书写的结构复核</h3><span>只比较稳定收笔结构，不用“整体看着像”代替结论</span></header>
      <div class="ve-photo-compare-grid">
        <figure><img src="${imageByKind.office}" alt="今晨来信所在调查场景"><figcaption><b>今晨来信</b><span>来源：办公室与来信原件</span></figcaption></figure>
        <figure><img src="${imageByKind.cold}" alt="温度表所在低温库"><figcaption><b>温度表覆写</b><span>来源：低温库记录</span></figcaption></figure>
        <figure><img src="${imageByKind.office}" alt="玛戈登记簿所在档案场景"><figcaption><b>玛戈登记簿</b><span>来源：旧登记材料</span></figcaption></figure>
      </div>
      <p class="ve-photo-compare-note">三份材料来自不同纸张与不同位置。当前只把末笔回钩角度和停笔位置作为可复核特征，身份判断仍需与登记簿来源互证。</p>
    </div>`;
  }

  function bookPanel() {
    return photoPanel({
      image: imageByKind.office,
      kicker: "参考资料 / 旧法医学与纸张手册",
      title: "资料页与夹页记录",
      status: "方法来源 · 非案件证物",
      note: "低温会改变尸体现象的发展速度，但不会重写原始伤口和已经固定的尸斑；纸张处理前应先做对照实验。",
      crop: "55% 64%",
      zoom: 1.7,
      extra: `<div class="ve-record-lines"><span><b>法医学</b>时间估算必须把环境温度单独纳入。</span><span><b>纸张检验</b>先在牺牲样本上验证方法，再处理原证物。</span></div>`
    });
  }

  function relationPanel(question) {
    return `<div class="ve-relation-photo" data-ve-upgraded="1">
      <header><p>FINAL RECONSTRUCTION / RELATION</p><h3>${esc(question || "当前关系待复核")}</h3><span>从真实证物来源中选择两件能够彼此独立支持关系的材料</span></header>
      <div class="ve-relation-scenes">
        <figure><img src="${imageByKind.dead}" alt="死信室现场"><figcaption>死信室 / 现场事实</figcaption></figure>
        <figure><img src="${imageByKind.tube}" alt="气动管控制室"><figcaption>气动管 / 机械时间</figcaption></figure>
        <figure><img src="${imageByKind.cold}" alt="低温库现场"><figcaption>低温库 / 环境与搬运痕迹</figcaption></figure>
      </div>
      <p>关系板不再用“证物A—证物B”的示意线替玩家推理；真正的选择仍在下方证物池完成。</p>
    </div>`;
  }


  function checkpointPanel(text) {
    const title = $("detail-title")?.textContent || "阶段复核";
    const kicker = $("detail-kicker")?.textContent || "阶段复核";
    const chapter = /第3章|第三章|机械|低温|书写/.test(title + kicker + text) ? 3 : /第2章|第二章|方法|三封信/.test(title + kicker + text) ? 2 : 1;
    const scenes = chapter === 1
      ? [[imageByKind.dead,"死信室现场"],[imageByKind.office,"办公室记录"],[imageByKind.dead,"门窗与尸体事实"]]
      : chapter === 2
        ? [[imageByKind.office,"原件与用品来源"],[imageByKind.lab,"对照实验"],[imageByKind.office,"三封信处理记录"]]
        : [[imageByKind.tube,"机械延时"],[imageByKind.cold,"低温与搬运痕迹"],[imageByKind.office,"书写来源"]];
    return `<div class="ve-relation-photo ve-checkpoint-photo" data-ve-upgraded="1">
      <header><p>CASE REVIEW / CHAPTER ${chapter}</p><h3>${esc(title)}</h3><span>阶段复核只组织已经登记的事实，不用图示替玩家提前画出答案。</span></header>
      <div class="ve-relation-scenes">${scenes.map(([src,label]) => `<figure><img src="${src}" alt="${esc(label)}"><figcaption>${esc(label)}</figcaption></figure>`).join("")}</div>
      <p>从下方卡片中选择能够直接支持题目表述的事实。错误组合不会推进章节，正确结果会写入阶段复核。</p>
    </div>`;
  }

  function judgementGatePanel(text) {
    const counts = [...String(text || "").matchAll(/(\d+)/g)].map(m => m[1]);
    return `<div class="ve-relation-photo ve-gate-photo" data-ve-upgraded="1">
      <header><p>CASE REVIEW / EVIDENCE JUDGEMENT</p><h3>关键证物判断尚未完成</h3><span>先完成证物四选一判断，再进入本章关系复核。</span></header>
      <div class="ve-relation-scenes">
        <figure><img src="${imageByKind.dead}" alt="现场证物来源"><figcaption>现场事实</figcaption></figure>
        <figure><img src="${imageByKind.office}" alt="文书与信件来源"><figcaption>文书与信件</figcaption></figure>
        <figure><img src="${imageByKind.cold}" alt="后续环境证物来源"><figcaption>环境与记录</figcaption></figure>
      </div>
      <p>${counts.length >= 2 ? `当前记录：${esc(counts[0])} / ${esc(counts[1])}。` : "当前还有关键判断未写入调查簿。"}只有证据能直接支持的选项才会计入章节开放条件。</p>
    </div>`;
  }

  function drawerPanel() {
    return photoPanel({
      image: imageByKind.office,
      kicker: "办公室 / 抽屉清点",
      title: "现场可取用品",
      status: "只登记实际存在的物品",
      note: "扁平铅笔、短蜡烛、黑面包和便笺都来自同一办公室场景。需要什么，由当前证物处理方法决定。",
      crop: "61% 71%",
      zoom: 1.8,
      extra: `<div class="ve-record-lines"><span><b>工具</b>扁平铅笔 · 短蜡烛</span><span><b>样本</b>黑面包 · 便笺</span></div>`
    });
  }

  function replaceKnownDetail() {
    const root = $("detail-visual");
    if (!root) return;
    const child = root.firstElementChild;
    if (!child || child.dataset.veUpgraded === "1" || child.matches(".ve-photo-evidence,.ve-photo-compare,.ve-relation-photo")) return;

    let html = "";
    if (child.classList.contains("paper-evidence")) {
      const sheet = child.querySelector(".paper-sheet");
      const cls = sheet?.className || "";
      const type = cls.includes("type-A") ? "A" : cls.includes("type-B") ? "B" : "C";
      html = paperPanel(type, child.classList.contains("done"));
    } else if (child.classList.contains("ledger-visual")) {
      html = ledgerPanel();
    } else if (child.classList.contains("wax-evidence")) {
      html = waxPanel();
    } else if (child.classList.contains("timing-dossier")) {
      html = timingPanel(/释放销|隔夜槽/.test(child.textContent || ""));
    } else if (child.classList.contains("chart-visual")) {
      html = chartPanel(!!child.querySelector("del") || /底层原记录|侧光确认/.test(child.textContent || ""));
    } else if (child.classList.contains("hand-compare")) {
      html = handPanel();
    } else if (child.classList.contains("book-visual")) {
      html = bookPanel();
    } else if (child.classList.contains("relation-board")) {
      html = relationPanel($("detail-title")?.textContent || "");
    } else if (child.classList.contains("object-layout")) {
      html = drawerPanel();
    } else if (child.classList.contains("checkpoint-visual")) {
      html = checkpointPanel(child.textContent || "");
    } else if (child.classList.contains("judgement-gate-sheet")) {
      html = judgementGatePanel(child.textContent || "");
    }

    if (html) root.innerHTML = html;
  }

  function markInteractive() {
    const body = document.querySelector("#interactive-overlay .interactive-body");
    if (!body) return;
    const work = body.querySelector(".paper-work,.wax-work,.timeline-work,.chart-work");
    if (!work || work.dataset.veInteractive === "1") return;
    work.dataset.veInteractive = "1";
    body.classList.add("ve-realistic-interactive");
    const heat = body.querySelector("#heat-source");
    if (heat) heat.setAttribute("aria-label", "酒精灯热源");
  }

  let scheduled = false;
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      replaceKnownDetail();
      markInteractive();
    });
  }

  let interactiveObserver = null;
  let overlayCreationObserver = null;

  function attachInteractiveObserver() {
    const interactiveRoot = document.querySelector("#interactive-overlay .interactive-body");
    if (!interactiveRoot || interactiveRoot.dataset.veObserved === "1") return false;
    interactiveRoot.dataset.veObserved = "1";
    interactiveObserver = new MutationObserver(schedule);
    interactiveObserver.observe(interactiveRoot, {childList:true});
    schedule();
    return true;
  }

  function watchForInteractiveOverlay() {
    if (attachInteractiveObserver() || !document.body) return;

    // interactiveShell() appends #interactive-overlay directly to <body>.  Watch
    // body children only until that one node appears, then disconnect immediately.
    // This fixes late-created puzzle visuals without bringing back the old
    // body-wide/subtree observer that could make long sessions unresponsive.
    overlayCreationObserver = new MutationObserver(mutations => {
      const addedOverlay = mutations.some(m => [...m.addedNodes].some(node =>
        node?.nodeType === 1 && (node.id === "interactive-overlay" || node.querySelector?.("#interactive-overlay"))
      ));
      if (!addedOverlay) return;
      if (attachInteractiveObserver()) {
        overlayCreationObserver.disconnect();
        overlayCreationObserver = null;
      }
    });
    overlayCreationObserver.observe(document.body, {childList:true});
  }

  function init() {
    schedule();
    const visualRoot = $("detail-visual");
    if (visualRoot) new MutationObserver(schedule).observe(visualRoot, {childList:true});

    watchForInteractiveOverlay();

    window.__LETTER_VISUAL_EVIDENCE_UPGRADE__ = {
      version: BUILD + "+dynamic-overlay-fix",
      refresh: schedule,
      health() {
        return {
          detailObserverScope: "childList-only",
          bodyWideObserver: false,
          overlayCreationObserver: overlayCreationObserver ? "body-childList-once" : "not-needed",
          interactiveObserverAttached: Boolean(interactiveObserver),
          attributeObserver: false,
          images: Object.values(imageByKind)
        };
      }
    };
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, {once:true});
  else init();
})();
