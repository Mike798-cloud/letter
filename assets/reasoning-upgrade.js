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
