(() => {
  'use strict';
  const PATCH = '2026-08-26-case-reasoning-v1';
  if (document.documentElement.dataset.caseReasoningPolish === PATCH) return;
  document.documentElement.dataset.caseReasoningPolish = PATCH;

  const $ = (id) => document.getElementById(id);
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
      q: '仅根据“发现姿势”和“固定尸斑位置”，哪一项最符合当前证据？',
      options: [
        'A. 死者一直保持俯卧，背侧尸斑只是正常沉积',
        'B. 尸斑与发现姿势不一致，尸体在尸斑形成后曾被翻动',
        'C. 背侧尸斑说明凶手从背后实施了致命打击',
        'D. 仅凭尸斑位置即可把死亡时间精确到某一个小时'
      ], correct: 1,
      why: '固定尸斑描述的是形成时期的受重力面；它与后来的俯卧发现姿势不一致，只能先证明“尸体曾移动”，不能直接指认凶手或精确时刻。'
    },
    '内侧门闩': {
      q: '门闩上的新磨痕和透明纤维，最合理支持哪一种受力方式？',
      options: [
        'A. 木门受潮变形，插销自行滑入扣孔',
        'B. 有细线沿插销移动方向施力，从门外牵动门闩',
        'C. 有人从外侧猛烈撞门，撞击震动让插销落下',
        'D. 门闩被提前削薄，关门时自然折断后卡住'
      ], correct: 1,
      why: '横向新磨痕与纤维都落在插销受力路径上，说明存在细线牵拉；撞门或木材变形无法同时解释纤维和方向一致的新痕。'
    },
    '钉死的高窗': {
      q: '对于这扇高窗，哪一项最符合“连续锈层 + 室内钉死”的现场状态？',
      options: [
        'A. 凶手从高窗出入，事后把木板和钉子完全复原',
        'B. 高窗近期没有被拔动，不应作为密室出入路线',
        'C. 钉头生锈说明木板是在案发当晚匆忙钉上的',
        'D. 只要窗缝能穿过钓线，就等同于能让成年人出入'
      ], correct: 1,
      why: '若近期拔动，锈层和木纤维应留下断裂或新伤。连续锈层更支持长期未动，因此它的价值是排除一条看似诱人的错误路线。'
    },
    '通风管': {
      q: '通风弯头的尺寸和残留钓线，最合理说明什么？',
      options: [
        'A. 人无法通过，但细线可以穿过弯头传递拉力',
        'B. 成人可侧身爬过，只是没有留下脚印',
        'C. 通风不良造成死者缺氧，因此无需解释门闩',
        'D. 木屑说明有人临时锯开管道，再从里面离开'
      ], correct: 0,
      why: '管径排除了人或手臂直接通过，却不妨碍细线绕过弯头；这与门闩上的横向磨痕正好能拼成同一条受力路径。'
    },
    '凉茶': {
      q: '杯底检出镇静剂，但胃内容物没有对应成分。哪项结论最严谨？',
      options: [
        'A. 死者一定喝过药，只是剂量不足所以没检出',
        'B. 杯中曾有药，但现有证据不能证明药物进入死者体内',
        'C. 镇静剂就是致死原因，杯底残留已足够定性',
        'D. 胃里没药说明杯子属于别人，与本案完全无关'
      ], correct: 1,
      why: '“杯中有药”与“死者摄入药物”是两件不同的事实。胃内容物的阴性结果使得药物致死不能成立，但杯子本身仍是现场证物。'
    },
    '石地与头部': {
      q: '把后枕伤口、桌角高度和低温干扰放在一起，哪项解释最符合证据链？',
      options: [
        'A. 后枕伤与桌角高度接近，跌倒撞击更符合致命伤；低温只干扰死亡时间判断',
        'B. 低温本身造成了后枕伤，所以伤口高度没有意义',
        'C. 镇静剂导致死亡，头部伤只是搬尸过程中留下的擦伤',
        'D. 高窗入侵者从上方袭击，桌角只是巧合'
      ], correct: 0,
      why: '伤口机制与时间误差应分开判断：桌角高度解释致命撞击，低温只解释为什么尸体现象看起来比真实死亡时间更近。'
    },
    '空置长层板': {
      q: '层板上的制服纤维最适合作为什么性质的证据？',
      options: [
        'A. 证明赫尔曼曾与这块低温层板直接接触',
        'B. 证明玛戈一定亲手把尸体搬入冷库',
        'C. 证明尸体在冷库中停留了精确二十四小时',
        'D. 证明层板原本存放的是邮件而不是人体'
      ], correct: 0,
      why: '纤维能证明接触关系，却不能单独回答搬运者和精确停留时长；后两者必须依靠其他证物继续交叉验证。'
    },
    '地面拖痕': {
      q: '冷库地面的平行拖痕，哪一种解释与其他现场痕迹最相容？',
      options: [
        'A. 有较重物体从层板方向被拖向门口，需要与层板接触痕共同验证',
        'B. 清洁工推过拖把，因此任何拖痕都没有证据价值',
        'C. 拖痕直接证明搬运者就是玛戈',
        'D. 拖痕说明尸体从门外拖入，但与层板纤维无关'
      ], correct: 0,
      why: '拖痕只说明移动方向和方式。它与层板上的制服纤维结合后，才支持“尸体曾在冷库停留并被移出”的物理过程。'
    },
    '温度记录表': {
      q: '11月17日的“12°C”下方压着另一个数字。结合冷库痕迹，哪项记录方式最严谨？',
      options: [
        'A. 直接认定有人伪造全部温度记录并预谋杀人',
        'B. 侧光确认底层原数值，再与层板纤维和拖痕交叉验证低温使用事实',
        'C. 只要数字被改过，就可以把死亡时间固定为24小时前',
        'D. 温度表属于纸面材料，优先级低于任何口述，不必继续查'
      ], correct: 1,
      why: '覆写本身只能说明记录被改。必须先确认底层数字，再与独立的物理痕迹互证，才能支撑“冷库确实处于低温并被使用”。'
    },
    '三份笔迹': {
      q: '三份材料的小写 h 收笔高度一致。哪项表述最符合笔迹比对的证据边界？',
      options: [
        'A. 一个字母相似就足以百分之百确认同一书写者',
        'B. 相同收笔角度和停笔位置构成高度一致的书写特征，可作为同一习惯的支持证据',
        'C. 字迹相似只说明使用了同一种钢笔，与书写者无关',
        'D. 只要两份材料年代接近，笔迹差异可以忽略'
      ], correct: 1,
      why: '单一字形不应被写成绝对身份鉴定，但多个稳定细节一致时，可以成为与其他时间和行为证据共同使用的强支持项。'
    }
  };

  const aliases = {
    '背侧尸斑':'赫尔曼的尸体', '门闩线痕':'内侧门闩', '钉死高窗':'钉死的高窗',
    '通风管钓线':'通风管', '镇静剂凉茶':'凉茶', '后枕伤与尸僵':'石地与头部',
    '冷库层板纤维':'空置长层板', '冷库平行拖痕':'地面拖痕', '温度表覆写':'温度记录表',
    '三处 h 的同形收笔':'三份笔迹'
  };

  function canonicalTitle(raw='') { return aliases[raw] || raw; }

  function buildPhotoPanel(title) {
    const src = photoForTitle(title);
    const sceneName = $('scene-name')?.textContent || '魏瑟堡旧邮局';
    const sceneSub = $('scene-subtitle')?.textContent || '原始现场复原';
    const safe = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    return `<div class="evidence-photo-review">
      <img src="${src}" alt="${safe(title)}所在位置的现场照片复核" decoding="async"/>
      <div class="evidence-photo-shade"></div>
      <div class="evidence-photo-id"><b>17—B / ORIGINAL SCENE</b><span>${safe(sceneName)} · ${safe(sceneSub)}</span></div>
      <div class="evidence-photo-focus"><span>证物复核点</span><b>${safe(title)}</b><small>先从真实场景关系判断，再阅读右侧测量记录。此图不替代证物本身。</small></div>
    </div>`;
  }

  function removeSketchVisuals() {
    const title = canonicalTitle($('detail-title')?.textContent?.trim() || '');
    if (!title) return;
    const wraps = document.querySelectorAll('#detail-modal .fx-figure-wrap');
    wraps.forEach(wrap => {
      const hasSketch = wrap.querySelector('svg.fx-figure, svg:not(.replay-rope-photo)');
      if (!hasSketch) return;
      if (wrap.dataset.photoPolished === title && wrap.querySelector('.evidence-photo-review')) return;
      wrap.dataset.photoPolished = title;
      wrap.innerHTML = buildPhotoPanel(title);
    });
  }

  function genericQuestion(title) {
    return {
      q: `面对“${title}”，哪一种登记方式最符合烛影侦探社的复核规则？`,
      options: [
        'A. 先写下最像真相的解释，再寻找能支持它的材料',
        'B. 只登记当前可观察事实，把人物动机和因果暂时放进待证栏',
        'C. 只要物件看起来可疑，就直接登记为凶器或作案工具',
        'D. 优先采用最有经验的证人口述，物理痕迹只作补充'
      ], correct: 1,
      why: '本站规则要求事实与推论分栏。正确做法不是拒绝推理，而是先保证登记项能够被复测，再让后续证物承担因果关系。'
    };
  }

  function optionButton(text, idx, qData, originalAction, host) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'reasoning-option';
    b.innerHTML = `<span>${String.fromCharCode(65 + idx)}</span><p>${text.replace(/^[A-D][\.、]\s*/, '')}</p>`;
    b.addEventListener('click', () => {
      if (b.dataset.locked === '1') return;
      if (idx === qData.correct) {
        host.querySelectorAll('.reasoning-option').forEach(x => { x.dataset.locked = '1'; x.disabled = true; });
        b.classList.add('correct');
        const feedback = host.querySelector('.reasoning-feedback');
        feedback.className = 'reasoning-feedback correct';
        feedback.innerHTML = `<b>判断成立。</b>${qData.why}`;
        window.setTimeout(() => {
          try { originalAction(); } catch (err) { console.error('[case-reasoning] original action failed', err); }
        }, 260);
      } else {
        b.classList.add('wrong');
        b.dataset.locked = '1';
        b.disabled = true;
        const feedback = host.querySelector('.reasoning-feedback');
        feedback.className = 'reasoning-feedback wrong';
        feedback.innerHTML = '<b>暂不成立。</b>这项解释要么超出了当前物证能证明的范围，要么与已观察到的物理事实冲突。可以保留为假设，但不能登记成结论。';
      }
    });
    return b;
  }

  function upgradeDirectConclusion() {
    const modal = $('detail-modal'), actions = $('detail-actions'), titleEl = $('detail-title');
    if (!modal || !actions || !titleEl || modal.classList.contains('hidden')) return;
    const rawTitle = titleEl.textContent.trim();
    const title = canonicalTitle(rawTitle);
    if (!title) return;

    const buttons = [...actions.querySelectorAll(':scope > button.ink-button')];
    if (buttons.length !== 1) return; // Already a real choice / procedural puzzle.
    const originalButton = buttons[0];
    const label = originalButton.textContent.trim();
    const explicit = questions[title];
    const shouldUpgrade = !!explicit || /登记为证物|登记共同书写特征|用侧光确认底层数字|确认底层数字/.test(label);
    if (!shouldUpgrade) return;
    if (actions.dataset.reasoningTitle === title && actions.querySelector('.reasoning-question')) return;

    const originalFn = typeof originalButton.onclick === 'function' ? originalButton.onclick : () => originalButton.click();
    const qData = explicit || genericQuestion(title);
    actions.dataset.reasoningTitle = title;
    actions.innerHTML = '';

    const wrap = document.createElement('section');
    wrap.className = 'reasoning-question';
    wrap.innerHTML = `<div class="reasoning-head"><span>现场判断 / 只选一项</span><b>${qData.q}</b></div><div class="reasoning-grid"></div><p class="reasoning-feedback" aria-live="polite">四个解释都可能“听起来合理”。请只选择能被当前证物直接支持、且没有多加假设的一项。</p>`;
    const grid = wrap.querySelector('.reasoning-grid');
    qData.options.forEach((opt, idx) => grid.appendChild(optionButton(opt, idx, qData, originalFn, wrap)));
    actions.appendChild(wrap);
  }

  function polishForensicReplay() {
    const overlay = $('forensic-overlay');
    if (!overlay || overlay.hidden) return;
    // Generated line diagrams are forbidden. The replay already uses scene photos; retain only photo-based annotations.
    overlay.querySelectorAll('.fx-figure').forEach(svg => {
      const title = overlay.querySelector('h2')?.textContent || '现场推演';
      const holder = svg.parentElement;
      if (holder) holder.innerHTML = buildPhotoPanel(title);
    });
  }

  function run() {
    removeSketchVisuals();
    upgradeDirectConclusion();
    polishForensicReplay();
  }

  let raf = 0;
  const schedule = () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      run();
      setTimeout(run, 0); // forensic-enhance may render one microtask later.
    });
  };

  const observer = new MutationObserver(schedule);
  observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['class', 'hidden'] });
  document.addEventListener('click', schedule, true);
  window.addEventListener('load', schedule, { once: true });
  schedule();
})();
