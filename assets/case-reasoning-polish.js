(() => {
  'use strict';
  const PATCH = '2026-08-26-case-reasoning-v3';
  if (document.documentElement.dataset.caseReasoningPolish === PATCH) return;
  document.documentElement.dataset.caseReasoningPolish = PATCH;

  const $ = (id) => document.getElementById(id);
  const aliases = {
    '背侧尸斑':'赫尔曼的尸体', '门闩线痕':'内侧门闩', '钉死高窗':'钉死的高窗',
    '通风管钓线':'通风管', '镇静剂凉茶':'凉茶', '后枕伤与尸僵':'石地与头部',
    '冷库层板纤维':'空置长层板', '冷库平行拖痕':'地面拖痕', '温度表覆写':'温度记录表',
    '三处 h 的同形收笔':'三份笔迹'
  };
  const canonicalTitle = (raw='') => aliases[raw] || raw;
  const esc = (s='') => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  const photoForTitle = (title='') => {
    if (/门闩|尸体|高窗|凉茶|石地|后枕|桌角/.test(title)) return 'assets/images/deadroom.webp';
    if (/通风|胶囊|延时阀|气动|管线/.test(title)) return 'assets/images/tube.webp';
    if (/冷库|层板|拖痕|温度/.test(title)) return 'assets/images/cold-vault.webp';
    if (/信 A|信 B|信 C|火漆|压痕|处方|笔迹|抽屉/.test(title)) return 'assets/images/office.webp';
    if (/显色|碘|明胶|法医学|实验/.test(title)) return 'assets/images/lab.webp';
    return 'assets/images/deadroom.webp';
  };

  const questions = {
    '赫尔曼的尸体': {
      q: '仅根据发现姿势和固定尸斑位置，哪一项最符合当前证据？',
      options: [
        'A. 死者一直保持俯卧，背侧尸斑只是正常沉积',
        'B. 尸斑与发现姿势不一致，尸体在尸斑形成后曾被翻动',
        'C. 背侧尸斑说明凶手从背后实施了致命打击',
        'D. 仅凭尸斑位置即可把死亡时间精确到某一个小时'
      ], correct: 1,
      why: '固定尸斑反映形成时期的受重力面。它与后来俯卧的发现姿势不一致，能证明尸体曾移动，但不能单独指认凶手或给出精确时刻。'
    },
    '内侧门闩': {
      q: '门闩上的新磨痕和透明纤维，最合理支持哪一种受力方式？',
      options: [
        'A. 木门受潮变形，插销自行滑入扣孔',
        'B. 有细线沿插销移动方向施力，从门外牵动门闩',
        'C. 有人从外侧猛烈撞门，震动让插销自然落下',
        'D. 门闩被提前削薄，关门时折断后卡住'
      ], correct: 1,
      why: '横向新磨痕与透明纤维都位于插销受力路径上。门体变形或撞击无法同时解释纤维、磨痕位置和一致的受力方向。'
    },
    '钉死的高窗': {
      q: '连续锈层和室内钉死的木板，最合理说明什么？',
      options: [
        'A. 凶手从高窗出入，事后把木板和钉子完全复原',
        'B. 高窗近期没有被拔动，不应作为密室出入路线',
        'C. 钉头生锈说明木板是在案发当晚匆忙钉上的',
        'D. 窗缝能穿过钓线，因此成年人也可能从这里进出'
      ], correct: 1,
      why: '近期拔钉会破坏锈层并撕裂木纤维。现场没有这些新伤，因此高窗更适合用来排除出入路线。'
    },
    '通风管': {
      q: '通风弯头的尺寸和残留钓线，最合理说明什么？',
      options: [
        'A. 人无法通过，但细线可以绕过弯头传递拉力',
        'B. 成人可侧身爬过，只是没有留下脚印',
        'C. 通风不良造成死者缺氧，因此无需解释门闩',
        'D. 木屑说明有人临时锯开管道，再从里面离开'
      ], correct: 0,
      why: '管径排除了人和手臂直接通过；钓线本身却能绕过弯头。它可以与门闩上的横向磨痕组成一条连续受力路径。'
    },
    '凉茶': {
      q: '杯底检出镇静剂，但胃内容物没有对应成分。哪项结论最严谨？',
      options: [
        'A. 死者一定喝过药，只是剂量不足所以没检出',
        'B. 杯中曾有药，但现有证据不能证明药物进入死者体内',
        'C. 镇静剂就是致死原因，杯底残留已经足够定性',
        'D. 胃里没药说明杯子属于别人，与本案完全无关'
      ], correct: 1,
      why: '“杯中有药”和“死者摄入药物”是两件不同的事实。胃内容物没有对应成分，因此药物致死不能由这只杯子单独成立。'
    },
    '石地与头部': {
      q: '把后枕伤口、桌角高度和低温干扰放在一起，哪项解释最符合证据链？',
      options: [
        'A. 后枕伤与桌角高度接近，跌倒撞击更符合致命伤；低温只干扰死亡时间判断',
        'B. 低温本身造成后枕伤，因此伤口高度没有意义',
        'C. 镇静剂导致死亡，头部伤只是搬尸过程中留下的擦伤',
        'D. 高窗入侵者从上方袭击，桌角高度只是巧合'
      ], correct: 0,
      why: '伤口机制和时间误差必须分开判断。桌角高度能解释后枕撞击，低温则解释尸体现象为什么显得比真实死亡时间更近。'
    },
    '投递胶囊': {
      q: '胶囊内壁带有17日蓝色邮戳油墨，却在18日清晨才落下。当前最稳妥的判断是什么？',
      options: [
        'A. 邮局一定把邮戳日期盖错了，所以这件证物没有时间价值',
        'B. 胶囊在17日已经进入或接触管线，之后至少经历了一段跨夜滞留',
        'C. 大雾让邮递员整夜迷路，18日清晨才把胶囊从外面塞进投递口',
        'D. 赫尔曼死后有人重新蘸了17日的旧墨，在清晨伪造了整个胶囊'
      ], correct: 1,
      why: '油墨日期和实际到达时点之间存在跨夜间隔。它能先证明“胶囊被延迟”，具体延迟机制仍需结合阀门状态继续验证。'
    },
    '空置长层板': {
      q: '层板上的制服纤维最适合作为什么性质的证据？',
      options: [
        'A. 证明赫尔曼曾与这块低温层板直接接触',
        'B. 证明玛戈一定亲手把尸体搬入冷库',
        'C. 证明尸体在冷库中停留了精确二十四小时',
        'D. 证明层板原本存放的是邮件而不是人体'
      ], correct: 0,
      why: '纤维能证明接触关系，却不能单独回答搬运者和精确停留时长；这些必须由其他证物继续交叉验证。'
    },
    '地面拖痕': {
      q: '冷库地面的平行拖痕，哪一种解释与其他现场痕迹最相容？',
      options: [
        'A. 有较重物体从层板方向被拖向门口，需要与层板接触痕共同验证',
        'B. 清洁工推过拖把，因此任何拖痕都没有证据价值',
        'C. 拖痕直接证明搬运者就是玛戈',
        'D. 拖痕说明尸体从门外拖入，并且与层板纤维无关'
      ], correct: 0,
      why: '拖痕只能说明移动方向和方式。与层板上的制服纤维结合后，才支持尸体曾在冷库停留并被移出的物理过程。'
    },
    '温度记录表': {
      q: '11月17日的“12°C”下方压着另一个数字。结合冷库痕迹，哪项处理最严谨？',
      options: [
        'A. 直接认定有人伪造全部温度记录并预谋杀人',
        'B. 侧光确认底层原数值，再与层板纤维和拖痕交叉验证低温使用事实',
        'C. 只要数字被改过，就可以把死亡时间固定为二十四小时前',
        'D. 温度表属于纸面材料，优先级低于任何口述，不必继续查'
      ], correct: 1,
      why: '覆写只能先证明记录被改。确认底层数字并与独立物理痕迹互证后，才能把低温使用写进案件事实。'
    },
    '三份笔迹': {
      q: '三份材料的小写 h 收笔高度一致。哪项表述最符合笔迹比对的证据边界？',
      options: [
        'A. 一个字母相似就足以百分之百确认同一书写者',
        'B. 相同收笔角度和停笔位置构成稳定书写特征，可作为同一习惯的支持证据',
        'C. 字迹相似只说明使用了同一种钢笔，与书写者无关',
        'D. 只要两份材料年代接近，笔迹差异就可以忽略'
      ], correct: 1,
      why: '单一字形不应写成绝对身份鉴定；多个稳定细节一致时，可以作为与时间、行为证据共同使用的强支持项。'
    }
  };

  function buildPhotoPanel(title) {
    const src = photoForTitle(title);
    const sceneName = $('scene-name')?.textContent || '魏瑟堡旧邮局';
    const sceneSub = $('scene-subtitle')?.textContent || '原始现场复原';
    return `<div class="evidence-photo-review">
      <img src="${src}" alt="${esc(title)}所在位置的现场照片复核" decoding="async"/>
      <div class="evidence-photo-shade"></div>
      <div class="evidence-photo-id"><b>17—B / ORIGINAL SCENE</b><span>${esc(sceneName)} · ${esc(sceneSub)}</span></div>
      <div class="evidence-photo-focus"><span>证物复核点</span><b>${esc(title)}</b></div>
    </div>`;
  }

  function removeSketchVisuals() {
    const title = canonicalTitle($('detail-title')?.textContent?.trim() || '');
    if (!title) return;
    document.querySelectorAll('#detail-modal .fx-figure-wrap').forEach(wrap => {
      const hasSketch = wrap.querySelector('svg.fx-figure, svg:not(.replay-rope-photo)');
      if (!hasSketch) return;
      if (wrap.dataset.photoPolished === title && wrap.querySelector('.evidence-photo-review')) return;
      wrap.dataset.photoPolished = title;
      wrap.innerHTML = buildPhotoPanel(title);
    });
  }

  const GAME_SAVE_KEY = 'dead-letter-room-save-v5';
  const REASONING_SAVE_KEY = 'dead-letter-room-reasoning-v3';
  const stateMarkers = {
    '赫尔曼的尸体': { clue: 'c_lividity' },
    '内侧门闩': { clue: 'c_latch' },
    '钉死的高窗': { clue: 'c_window' },
    '通风管': { clue: 'c_vent' },
    '凉茶': { clue: 'c_tea' },
    '石地与头部': { clue: 'c_rigor' },
    '投递胶囊': { clue: 'c_capsule' },
    '空置长层板': { clue: 'c_shelf' },
    '地面拖痕': { clue: 'c_drag' },
    '温度记录表': { flag: 'chartSolved' },
    '三份笔迹': { flag: 'handSolved' }
  };

  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_) {
      return fallback;
    }
  }
  function readGameState() { return readJSON(GAME_SAVE_KEY, null); }
  function coreDone(title) {
    const marker = stateMarkers[canonicalTitle(title)];
    const s = readGameState();
    if (!marker || !s) return false;
    if (marker.clue) return Array.isArray(s.clues) && s.clues.includes(marker.clue);
    if (marker.flag) return !!(s.flags && s.flags[marker.flag]);
    return false;
  }
  function rememberReasoning(title, correctIndex) {
    const data = readJSON(REASONING_SAVE_KEY, {});
    data[canonicalTitle(title)] = { answer: correctIndex, at: Date.now() };
    try { localStorage.setItem(REASONING_SAVE_KEY, JSON.stringify(data)); } catch (_) {}
  }

  function renderResolved(actions, qData, title) {
    const canonical = canonicalTitle(title || $('detail-title')?.textContent?.trim() || '');
    actions.dataset.reasoningTitle = canonical;
    actions.querySelectorAll('.reasoning-question').forEach(el => el.remove());
    actions.querySelectorAll(':scope > button.reasoning-core-action').forEach(btn => {
      btn.hidden = true;
      btn.setAttribute('aria-hidden', 'true');
      btn.tabIndex = -1;
    });
    const section = document.createElement('section');
    section.className = 'reasoning-question reasoning-resolved';
    section.innerHTML = `<div class="reasoning-head"><span>现场判断 / 已登记</span><b>${esc(qData.q)}</b></div>
      <div class="reasoning-resolution"><span>${String.fromCharCode(65 + qData.correct)}</span><p>${esc(qData.options[qData.correct].replace(/^[A-D][\.、]\s*/, ''))}</p></div>
      <p class="reasoning-feedback correct"><b>判断已记入案卷。</b>${esc(qData.why)}</p>`;
    actions.prepend(section);
  }

  function verifyAndRemember(title, qData, feedback) {
    let tries = 0;
    const check = () => {
      if (coreDone(title)) {
        rememberReasoning(title, qData.correct);
        return;
      }
      tries += 1;
      if (tries < 8) {
        setTimeout(check, 35);
      } else if (feedback && document.body.contains(feedback)) {
        feedback.className = 'reasoning-feedback wrong';
        feedback.innerHTML = '<b>登记没有完成。</b>请关闭后重新打开这一证物再试；当前判断不会被误记为已完成。';
      }
    };
    check();
  }

  function optionButton(text, idx, qData, originalButton, host, title) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'reasoning-option';
    b.innerHTML = `<span>${String.fromCharCode(65 + idx)}</span><p>${esc(text.replace(/^[A-D][\.、]\s*/, ''))}</p>`;
    b.addEventListener('click', () => {
      if (b.dataset.locked === '1') return;
      const feedback = host.querySelector('.reasoning-feedback');
      if (idx === qData.correct) {
        host.querySelectorAll('.reasoning-option').forEach(x => { x.dataset.locked = '1'; x.disabled = true; });
        b.classList.add('correct');
        feedback.className = 'reasoning-feedback correct';
        feedback.innerHTML = `<b>判断成立，正在登记证物。</b>${esc(qData.why)}`;

        // 保留原游戏按钮在 DOM 中并同步触发。这样原案卷自己的 state / save / afterClue / checkChapter3
        // 会按原流程执行，章节推进不再依赖补丁自行猜测游戏内部状态。
        try {
          originalButton.click();
        } catch (err) {
          console.error('[case-reasoning] core action failed', err);
        }
        verifyAndRemember(title, qData, feedback);
      } else {
        b.classList.add('wrong');
        b.dataset.locked = '1';
        b.disabled = true;
        feedback.className = 'reasoning-feedback wrong';
        feedback.innerHTML = '<b>暂不登记，本页进度不会增加。</b>这一解释要么超出当前物证能够证明的范围，要么与已经观察到的物理事实冲突。';
      }
    });
    return b;
  }

  function selectCoreAction(actions) {
    const buttons = [...actions.querySelectorAll(':scope > button.ink-button')];
    const usable = buttons.filter(btn =>
      !btn.dataset.forensicReplay &&
      !btn.classList.contains('forensic-action') &&
      !btn.classList.contains('reasoning-shadow-action')
    );
    if (!usable.length) return null;
    const preferred = usable.find(btn => /登记为证物|用侧光确认底层数字|登记共同书写特征|已登记/.test(btn.textContent.trim()));
    return preferred || (usable.length === 1 ? usable[0] : null);
  }

  function upgradeDirectConclusion() {
    const modal = $('detail-modal'), actions = $('detail-actions'), titleEl = $('detail-title');
    if (!modal || !actions || !titleEl || modal.classList.contains('hidden')) return;
    const title = canonicalTitle(titleEl.textContent.trim());
    const qData = questions[title];
    if (!qData) return;

    // 以主游戏存档为唯一“是否完成”依据。刷新、关闭弹窗、重新进入地点后都能稳定恢复。
    if (coreDone(title)) {
      if (!actions.querySelector('.reasoning-resolved')) renderResolved(actions, qData, title);
      return;
    }

    // 若同一弹窗已经升级，不因 forensic-enhance 后续插入按钮而重复重建题目。
    if (actions.dataset.reasoningTitle === title && actions.querySelector('.reasoning-question:not(.reasoning-resolved)')) return;

    const originalButton = selectCoreAction(actions);
    if (!originalButton) return;
    const label = originalButton.textContent.trim();
    if (/已登记|已确认|已完成/.test(label) && coreDone(title)) {
      renderResolved(actions, qData, title);
      return;
    }

    actions.querySelectorAll('.reasoning-question').forEach(el => el.remove());
    originalButton.classList.add('reasoning-core-action');
    originalButton.hidden = true;
    originalButton.setAttribute('aria-hidden', 'true');
    originalButton.tabIndex = -1;
    actions.dataset.reasoningTitle = title;

    const wrap = document.createElement('section');
    wrap.className = 'reasoning-question';
    wrap.innerHTML = `<div class="reasoning-head"><span>现场判断 / 只选一项</span><b>${esc(qData.q)}</b></div><div class="reasoning-grid"></div><p class="reasoning-feedback" aria-live="polite">选择与当前证物边界一致的一项。错误判断不会写入证物，也不会增加本章进度。</p>`;
    const grid = wrap.querySelector('.reasoning-grid');
    qData.options.forEach((opt, idx) => grid.appendChild(optionButton(opt, idx, qData, originalButton, wrap, title)));
    actions.prepend(wrap);
  }

  function polishForensicReplay() {
    const overlay = $('forensic-overlay');
    if (!overlay || overlay.hidden) return;
    overlay.querySelectorAll('.fx-figure').forEach(svg => {
      const title = overlay.querySelector('h2')?.textContent || '现场推演';
      const holder = svg.parentElement;
      if (holder) holder.innerHTML = buildPhotoPanel(title);
    });
  }

  // 删除“玩家应该如何理解页面”“这不是……而是……”等开发者口吻说明，只保留案件内事实。
  function removeMetaExplanations() {
    document.querySelectorAll('#detail-modal .fx-note-box, #forensic-overlay .fx-note-box, .evidence-photo-focus small').forEach(el => el.remove());
    document.querySelectorAll('#detail-modal .fx-chip-row, #forensic-overlay .fx-chip-row').forEach(el => el.remove());

    const metaRow = /(玩家|玩法|游戏里|图像|视觉|呈现|不再|页面|抽离感|中央登记卡|按钮|应当|需要看起来|退回|空间逻辑|收纳逻辑|情感作用|叙事作用|排查后修正|修正[^复核])/;
    document.querySelectorAll('#detail-modal .fx-facts, #forensic-overlay .fx-facts').forEach(dl => {
      const terms = [...dl.querySelectorAll('dt')];
      terms.forEach(dt => {
        const dd = dt.nextElementSibling;
        if (!dd || dd.tagName !== 'DD') return;
        const text = `${dt.textContent} ${dd.textContent}`;
        if (metaRow.test(text)) { dt.remove(); dd.remove(); }
      });
    });

    // 少数通用物件原本带有“像真正物件而不是按钮”一类幕后说明，改回卷宗内可见事实。
    const factualDescriptions = {
      '短波收音机':'旧机器仍调在夜间频道。旋钮边缘磨得发亮，布面喇叭罩积着浅灰，刻度窗里停着昨夜留下的频点。',
      '死信柜':'高柜抽屉被反复开合，标签纸已经发脆，锁孔附近却有较新的摩擦痕。',
      '维克托的手提箱':'皮箱边角磨白，金属搭扣保养得很好，提手内侧留下长期携带形成的深色汗痕。',
      '碘酒与滴管':'瓶口留有褐色碘渍，滴管胶头已经发硬，玻璃内壁仍挂着深色液痕。',
      '清水':'玻璃杯里是清水，杯壁有旧水垢和细小气泡。',
      '棉签':'棉头已经泛黄，木杆一端留有淡褐色药液痕。',
      '面粉罐':'铁皮罐边缘磨损，盖内残着干燥面粉，罐身有厨房油烟留下的暗斑。',
      '明胶片':'几片半透明明胶叠在蜡纸里，边缘因受潮微微卷曲。',
      '酒精灯':'玻璃灯体有煤烟痕，灯芯烧黑，火焰细而稳定。',
      '旧法医学手册':'手册页边写满批注，夹页特别标出：低温会延缓尸僵和腐败，却不会改变伤口本身的位置与形态。'
    };
    const title = canonicalTitle($('detail-title')?.textContent?.trim() || '');
    const replacement = factualDescriptions[title];
    if (replacement) {
      document.querySelectorAll('#detail-modal .fx-side .fx-sheet > p').forEach(p => { if (p.textContent.trim() !== replacement) p.textContent = replacement; });
    }
    if (title === '延时阀') {
      document.querySelectorAll('#detail-modal .fx-head span').forEach(span => {
        if (/虚构|24小时/.test(span.textContent)) span.textContent = '隔夜档 · 约12小时';
      });
    }
  }

  function trimHomeUpdates() {
    const board = $('portal-hall');
    if (!board) return;
    const note = board.querySelector('.portal-more-note');
    if (!note) return;
    let node = note.nextElementSibling;
    while (node) {
      const next = node.nextElementSibling;
      if (node.classList.contains('portal-thread') && node.classList.contains('patch-thread')) node.remove();
      node = next;
    }
    if (!/人物随笔/.test(note.textContent)) {
      note.textContent = '这里只保留最近 4 条更新与 1 条值班置顶；人物随笔、人物边注、前辈手记、夜读文库与旧案全文请从左侧“站点导航”进入。';
    }
  }

  function run() {
    trimHomeUpdates();
    removeSketchVisuals();
    upgradeDirectConclusion();
    polishForensicReplay();
    removeMetaExplanations();
  }

  let raf = 0;
  const schedule = () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      run();
      setTimeout(run, 0); // forensic/literature 补丁可能在当前帧之后追加内容。
    });
  };

  const observer = new MutationObserver(schedule);
  observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['class', 'hidden'] });
  document.addEventListener('click', schedule, true);
  window.addEventListener('load', schedule, { once: true });
  schedule();
})();
