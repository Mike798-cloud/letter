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

  function init() {
    schedule();
    const visualRoot = $("detail-visual");
    if (visualRoot) new MutationObserver(schedule).observe(visualRoot, {childList:true});

    const interactiveRoot = document.querySelector("#interactive-overlay .interactive-body");
    if (interactiveRoot) new MutationObserver(schedule).observe(interactiveRoot, {childList:true});

    window.__LETTER_VISUAL_EVIDENCE_UPGRADE__ = {
      version: BUILD,
      refresh: schedule,
      health() {
        return {
          detailObserverScope: "childList-only",
          bodyWideObserver: false,
          attributeObserver: false,
          images: Object.values(imageByKind)
        };
      }
    };
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, {once:true});
  else init();
})();
