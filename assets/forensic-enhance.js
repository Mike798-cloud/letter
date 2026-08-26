(() => {
  "use strict";

  const PATCH = "2026-08-26-forensic-v3";
  const $ = (id) => document.getElementById(id);
  const REPLAY_KEY = "dead-letter-room-latch-replay-v1";
  const SAVE_KEY = "dead-letter-room-save-v5";

  const style = document.createElement("style");
  style.id = "forensic-enhance-style";
  style.textContent = `
    :root{--fx-ink:#2f2b25;--fx-paper:#e8dfcf;--fx-paper2:#d8c9ae;--fx-red:#7d3d36;--fx-blue:#496471;--fx-green:#53654e;--fx-brass:#9b7648}
    .forensic-view{position:relative;min-height:260px;overflow:hidden;border:1px solid rgba(63,50,35,.24);background:linear-gradient(145deg,#e7ddca,#d4c4a8);box-shadow:inset 0 0 0 1px rgba(255,255,255,.45),0 12px 24px rgba(34,24,16,.09);color:#312a22}
    .forensic-view::after{content:"";position:absolute;inset:0;pointer-events:none;opacity:.26;background-image:repeating-linear-gradient(0deg,rgba(63,47,34,.045) 0 1px,transparent 1px 4px),radial-gradient(circle at 15% 20%,rgba(255,255,255,.55),transparent 28%)}
    .fx-head{position:absolute;z-index:4;left:14px;right:14px;top:12px;display:flex;align-items:center;justify-content:space-between;gap:12px;font-size:11px;letter-spacing:.12em;color:#5c5144;text-transform:uppercase}
    .fx-head b{font-size:12px;color:#33291f}.fx-note{position:absolute;z-index:4;left:14px;bottom:12px;right:14px;padding:8px 10px;background:rgba(239,232,218,.86);border-left:3px solid #7e6242;font-size:12px;line-height:1.6}
    .fx-svg{position:absolute;inset:38px 10px 46px;width:calc(100% - 20px);height:calc(100% - 84px)}
    .fx-callout{font:11px system-ui,sans-serif;fill:#342b23}.fx-callout-line{stroke:#5d4a39;stroke-width:1.4;fill:none;stroke-dasharray:3 3}
    .fx-photo-label{font:700 10px system-ui,sans-serif;fill:#f4eee2;letter-spacing:.08em}
    .fx-paper-grid{stroke:rgba(76,57,39,.14);stroke-width:1}.fx-red{fill:#80433e;stroke:#67322e}.fx-blue{fill:#4c6672;stroke:#3d535e}.fx-brass{fill:#a17c4c;stroke:#6d4f2d}.fx-dark{fill:#3b332b;stroke:#241f1a}.fx-wood{fill:#74563b;stroke:#4b3727}.fx-fiber{stroke:#d9e3dd;stroke-width:2;fill:none;filter:drop-shadow(0 0 2px #5f7168)}
    .forensic-view.fx-lividity .body-back{fill:#bcaaa0;stroke:#54483e;stroke-width:1.5}.forensic-view.fx-lividity .lividity-zone{fill:#79515c;opacity:.72}.forensic-view.fx-lividity .body-now{opacity:.52}.forensic-view.fx-lividity .orientation-arrow{stroke:#743f38;stroke-width:3;marker-end:url(#arr)}
    .fx-micro{position:absolute;right:18px;top:56px;width:32%;min-width:130px;aspect-ratio:1;border:8px solid #ded0b8;border-radius:50%;box-shadow:0 5px 20px #3a2b1b33;overflow:hidden;background:#705338;z-index:3}.fx-micro::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 43% 48%,transparent 0 13%,rgba(214,226,219,.86) 14% 15%,transparent 16%),repeating-linear-gradient(88deg,#785a3d 0 3px,#6a4b31 3px 5px)}.fx-micro::after{content:"透明纤维 · <1 mm";position:absolute;left:7px;right:7px;bottom:8px;background:#e7ddc9d9;padding:4px;text-align:center;font-size:10px}
    .fx-paper{position:absolute;left:8%;right:8%;top:21%;bottom:14%;background:#efe5d2;border:1px solid #9c8a6d;box-shadow:6px 8px 0 #7460481a;transform:rotate(-1deg);padding:14px 18px;font-family:serif}.fx-paper::after{content:"";position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent 0 22px,rgba(83,65,46,.12) 22px 23px)}
    .fx-pressure{position:relative;z-index:2;color:#7b746b;text-shadow:1px 1px 0 #fff,-1px -1px 0 #c9b99c;font-size:19px;letter-spacing:.06em;line-height:1.85}.fx-rub{background:linear-gradient(90deg,transparent 0,#67615b33 12%,#514a443f 50%,transparent 100%);padding:3px 4px}
    .fx-seal{position:absolute;left:25%;top:34%;width:92px;height:92px;border-radius:50%;background:radial-gradient(circle at 36% 28%,#a95c4a,#6d2d27 62%,#401d1a);box-shadow:0 7px 15px #26161055,inset 0 0 0 5px #c27a6655}.fx-seal::after{content:"W";position:absolute;inset:18px;border:1px solid #d9a48f66;border-radius:50%;display:grid;place-items:center;color:#d7a28e;font:700 32px Georgia}.fx-heat{position:absolute;left:12%;top:25%;width:48%;height:60%;border-radius:50%;background:radial-gradient(circle,rgba(204,119,68,.28),transparent 62%);filter:blur(2px)}.fx-distance{position:absolute;left:56%;top:42%;width:25%;height:2px;background:#7c5c3b}.fx-distance::before,.fx-distance::after{content:"";position:absolute;top:-5px;width:1px;height:12px;background:#7c5c3b}.fx-distance::before{left:0}.fx-distance::after{right:0}.fx-distance span{position:absolute;top:6px;left:15%;font-size:11px;white-space:nowrap}
    .fx-reagent-paper .inkline{position:absolute;z-index:2;left:12%;right:12%;top:31%;font:20px serif;color:rgba(91,102,82,.16);line-height:2}.fx-reagent-paper .revealed{color:#3c5368;text-shadow:0 0 1px #49677b;transition:color .45s}.fx-swab{position:absolute;right:12%;top:25%;width:8px;height:120px;background:#dfd6c5;border-radius:6px;transform:rotate(25deg);box-shadow:0 0 0 1px #a79c8b}.fx-swab::after{content:"";position:absolute;left:-5px;bottom:-8px;width:18px;height:24px;border-radius:50%;background:#b5a890;box-shadow:inset 0 0 0 4px #e6dccb}
    .fx-chart{position:absolute;left:8%;right:8%;top:20%;bottom:12%;background:#ece1cc;border:1px solid #8e7e65;padding:16px}.fx-chart table{width:100%;border-collapse:collapse;font:12px system-ui;color:#493d31}.fx-chart td,.fx-chart th{border:1px solid #9e8d73;padding:7px;text-align:center}.fx-overwrite{position:relative;font:bold 22px Georgia;color:#4e3c30}.fx-overwrite .top1{position:absolute;left:18%;top:-6px;color:#34261f;opacity:.9}.fx-overwrite .under2{font-size:22px;color:#70543e;opacity:.48}.fx-side-light{position:absolute;inset:0;background:linear-gradient(105deg,transparent 38%,rgba(255,246,204,.62) 50%,transparent 62%);mix-blend-mode:screen;animation:fxscan 3s ease-in-out infinite}@keyframes fxscan{0%,100%{transform:translateX(-32%)}50%{transform:translateX(32%)}}
    .fx-handwriting{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;position:absolute;left:5%;right:5%;top:24%;bottom:16%}.fx-hand-card{position:relative;background:#efe4cf;border:1px solid #97856c;padding:12px;overflow:hidden}.fx-hand-card b{display:block;font:11px system-ui;color:#6c5c49;margin-bottom:9px}.fx-hand-card .h{font:italic 66px/1 "Times New Roman";color:#42362d;transform:rotate(-6deg);display:inline-block}.fx-hand-card .stroke{position:absolute;width:34px;height:18px;border-bottom:3px solid #8a443c;border-radius:50%;right:18%;top:51%;transform:rotate(18deg)}
    .fx-tea{position:absolute;left:11%;top:29%;width:36%;height:42%;border-radius:0 0 54% 54%/0 0 34% 34%;background:linear-gradient(#6d4a31 0 62%,#b5a278 63% 67%,#d9c9aa 68%);border:4px solid #c9b997;border-top:7px solid #e3d5b9;box-shadow:0 10px 18px #4d331e33}.fx-tea::after{content:"杯底沉淀";position:absolute;left:7%;right:7%;bottom:6px;font-size:10px;text-align:center;color:#4b392c}.fx-assay{position:absolute;right:9%;top:29%;width:38%;background:#efe4ce;border:1px solid #9a876b;padding:10px;font:12px system-ui}.fx-assay b{display:block;margin-bottom:8px}.fx-assay .row{display:flex;justify-content:space-between;padding:7px 4px;border-top:1px solid #b9a88d}.fx-negative{color:#52634b;font-weight:700}.fx-positive{color:#7c4238;font-weight:700}
    .fx-impact .table-edge{position:absolute;right:13%;top:31%;width:34%;height:12px;background:#5a3b27;box-shadow:0 10px 0 #38261a}.fx-impact .head{position:absolute;left:24%;top:29%;width:82px;height:104px;border-radius:48% 48% 44% 44%;background:#b7a69a;border:2px solid #5b4a3e;transform:rotate(13deg)}.fx-impact .wound{position:absolute;left:29%;top:39%;width:25px;height:10px;background:#743b37;border-radius:50%;transform:rotate(-12deg)}.fx-impact .heightline{position:absolute;left:37%;right:19%;top:42%;border-top:2px dashed #7f4a42}.fx-impact .heightline span{position:absolute;right:0;top:-19px;font-size:10px}
    .fx-cold .shelf{position:absolute;left:8%;right:8%;top:38%;height:18px;background:linear-gradient(#c5c8c1,#8c928c);border:1px solid #646c65}.fx-cold .frost{position:absolute;left:8%;right:8%;top:34%;height:18px;background:repeating-linear-gradient(105deg,#f1f3ea 0 4px,#d9dfd8 4px 6px);opacity:.86}.fx-cold .fiber{position:absolute;left:36%;top:32%;width:120px;height:36px;border-top:3px solid #555b60;transform:rotate(4deg)}.fx-cold .fiber::after{content:"制服羊毛纤维";position:absolute;left:20px;top:-22px;font-size:10px}.fx-cold .drag1,.fx-cold .drag2{position:absolute;left:18%;right:18%;height:3px;background:linear-gradient(90deg,transparent,#81796c 12% 88%,transparent);bottom:27%}.fx-cold .drag2{bottom:21%}
    .fx-capsule .tube{position:absolute;left:8%;right:8%;top:44%;height:34px;border-radius:20px;background:linear-gradient(#9e7b4c,#6f512e);box-shadow:inset 0 5px 7px #e0bc7a44,inset 0 -5px 7px #2e1e10aa}.fx-capsule .capsule{position:absolute;top:38%;left:18%;width:76px;height:48px;border-radius:28px;background:linear-gradient(90deg,#b4935f,#684c2e,#b4935f);border:1px solid #523b25;animation:fxtube 5s ease-in-out infinite}@keyframes fxtube{0%{left:18%}45%{left:60%}55%{left:60%}100%{left:18%}}.fx-capsule .timeline{position:absolute;left:12%;right:12%;bottom:17%;display:flex;justify-content:space-between;font:11px system-ui}.fx-capsule .timeline::before{content:"";position:absolute;left:0;right:0;top:-8px;border-top:1px solid #7e694d}.fx-capsule .timeline b{font-size:11px}
    .fx-vent .pipe{position:absolute;left:10%;top:33%;width:69%;height:46px;border:14px solid #69655c;border-left-width:24px;border-radius:42px 0 0 42px;border-right:0;background:#302e2b}.fx-vent .line{position:absolute;left:20%;top:48%;width:61%;height:2px;background:#d8e2df;box-shadow:0 0 4px #d8e2df;transform:rotate(-4deg);transform-origin:left}.fx-vent .bend{position:absolute;right:14%;top:30%;width:60px;height:78px;border-right:17px solid #69655c;border-bottom:17px solid #69655c;border-radius:0 0 38px 0}.fx-vent .tag{position:absolute;right:8%;bottom:22%;font-size:11px}
    .fx-latch .doorwood{position:absolute;left:4%;right:4%;top:22%;bottom:13%;background:repeating-linear-gradient(90deg,#785a3d 0 8px,#6f5136 8px 11px);border:1px solid #4b3727}.fx-latch .bolt{position:absolute;left:16%;top:43%;width:43%;height:25px;background:linear-gradient(#88775f,#4a443c);border:2px solid #302b25;border-radius:4px}.fx-latch .keeper{position:absolute;right:16%;top:39%;width:48px;height:58px;border:8px solid #575047;background:transparent}.fx-latch .scar{position:absolute;right:22%;top:51%;width:52px;border-top:2px solid #d7e2dc;transform:rotate(-9deg);box-shadow:0 0 5px #d7e2dc}.fx-latch .scar-label{position:absolute;right:8%;top:62%;font-size:10px;background:#e9dfcc;padding:4px}
    .forensic-tip{margin-top:10px;padding:9px 11px;border-left:3px solid #725844;background:rgba(103,82,58,.08);font-size:12px;line-height:1.65}.forensic-action{position:relative}.forensic-action::after{content:"现场重演";position:absolute;right:8px;top:-8px;font-size:9px;background:#6b5139;color:#f2eadc;padding:2px 4px;letter-spacing:.08em}
    .forensic-scene-pin{position:absolute;z-index:12;right:18px;top:18px;border:1px solid rgba(230,220,201,.7);background:rgba(25,27,25,.86);color:#e9dfcf;padding:8px 11px;cursor:pointer;font:12px inherit;box-shadow:0 5px 16px #0005}.forensic-scene-pin:hover{background:#39372f}.forensic-scene-pin small{display:block;font-size:9px;opacity:.7;margin-top:2px}
    .forensic-overlay{position:fixed;z-index:9999;inset:0;background:rgba(12,11,9,.78);display:grid;place-items:center;padding:18px}.forensic-overlay[hidden]{display:none}.forensic-window{position:relative;width:min(980px,96vw);max-height:92vh;overflow:auto;background:#e8dfcf;color:#30281f;border:1px solid #9a876b;box-shadow:0 30px 90px #0009;padding:20px}.forensic-close{position:absolute;right:12px;top:10px;width:38px;height:38px;border:1px solid #8e7d68;background:#eee4d1;color:#3c3126;cursor:pointer;font-size:22px}.forensic-window h2{margin:4px 54px 7px 0;font-size:25px}.forensic-window .kicker{font-size:10px;letter-spacing:.13em;color:#6f5d49}.forensic-window .lead{line-height:1.75;color:#51463a}.replay-board{position:relative;margin-top:14px;min-height:420px;background:linear-gradient(110deg,#5e4530 0 29%,#262b2b 29% 58%,#6d5138 58%);border:1px solid #6b5845;overflow:hidden}.replay-door{position:absolute;left:0;top:0;bottom:0;width:29%;background:repeating-linear-gradient(90deg,#725238 0 10px,#66482f 10px 13px)}.replay-vent{position:absolute;left:31%;top:15%;width:28%;height:34%;border:22px solid #6f706b;border-radius:55px;background:#242728;box-shadow:inset 0 0 20px #000}.replay-wall{position:absolute;left:58%;right:0;top:0;bottom:0;background:repeating-linear-gradient(90deg,#75543a 0 8px,#68492f 8px 10px)}.replay-bolt{position:absolute;left:7%;top:43%;width:25%;height:28px;background:linear-gradient(#8b8170,#4b4740);border:2px solid #25211d;transform:translateX(calc(var(--pull,0) * 0.36px));transition:transform .18s}.replay-keeper{position:absolute;left:23%;top:38%;width:62px;height:72px;border:9px solid #4e4942}.replay-rope{position:absolute;inset:0;pointer-events:none}.replay-point{position:absolute;width:42px;height:42px;border-radius:50%;border:2px solid #f0e1bf;background:#5d4731cc;color:#fff;display:grid;place-items:center;cursor:pointer;box-shadow:0 0 0 5px rgba(240,225,191,.12)}.replay-point.active{outline:3px solid #c9aa72}.replay-point.done{background:#53654e}.rp-vent{left:47%;top:25%}.rp-latch{left:20%;top:45%}.replay-controls{display:grid;grid-template-columns:1fr auto;align-items:center;gap:14px;padding:14px;background:#d6c6aa;border:1px solid #a99475;border-top:0}.replay-controls input{width:100%}.replay-status{padding:10px 12px;margin-top:12px;border-left:3px solid #7c6345;background:#f1e8d8;line-height:1.65}.replay-status.success{border-color:#53654e;background:#e2e8dc}.forensic-timeline{display:grid;grid-template-columns:140px 1fr;gap:0;margin-top:16px;border-top:1px solid #9c8b72}.forensic-timeline dt,.forensic-timeline dd{margin:0;padding:12px;border-bottom:1px solid #aa997f}.forensic-timeline dt{font-weight:700;background:#dfd2bd}.forensic-timeline dd{background:#eee5d5;line-height:1.65}.logic-fix{margin-top:14px;padding:11px 12px;border:1px solid #aa997f;background:#f1e8d8;line-height:1.7}.logic-fix b{color:#69483a}
    .deduction-audit{margin-top:10px;padding:8px 10px;background:#e3ebdf;border-left:3px solid #53654e;font-size:12px;line-height:1.55}.deduction-audit.pending{background:#eee4d5;border-color:#886d4b}
    @media(max-width:680px){.forensic-view{min-height:220px}.fx-micro{width:38%;right:8px}.fx-handwriting{grid-template-columns:1fr;overflow:auto}.fx-hand-card{min-height:105px}.replay-board{min-height:360px}.forensic-timeline{grid-template-columns:1fr}.forensic-timeline dt{padding-bottom:4px}.forensic-timeline dd{padding-top:5px}.forensic-scene-pin{right:8px;top:8px}.fx-note{font-size:11px}.forensic-window{padding:16px}.replay-controls{grid-template-columns:1fr}}
    @media(prefers-reduced-motion:reduce){.fx-side-light,.fx-capsule .capsule{animation:none!important}.replay-bolt{transition:none}}
  `;
  document.head.appendChild(style);

  const esc = (s) => String(s || "").replace(/[&<>\"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

  const visuals = {
    "赫尔曼的尸体": () => `<div class="forensic-view fx-lividity"><div class="fx-head"><b>尸斑位置复核</b><span>现姿势 ≠ 形成姿势</span></div><svg class="fx-svg" viewBox="0 0 700 280" aria-label="尸斑位置示意"><defs><marker id="arr" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#743f38"/></marker></defs><g transform="translate(80 20)"><path class="body-back" d="M80 15c28 0 45 18 45 45 0 18-8 31-17 41l22 60-27 83H57l-27-83 22-60c-9-10-17-23-17-41 0-27 17-45 45-45z"/><ellipse class="lividity-zone" cx="80" cy="80" rx="36" ry="30"/><path class="lividity-zone" d="M45 105h70l11 56-25 69H58l-25-69z"/><text x="-5" y="270" class="fx-callout">固定尸斑集中于背侧</text></g><g transform="translate(370 35) rotate(88 80 100)" opacity=".6"><path class="body-back" d="M80 15c28 0 45 18 45 45 0 18-8 31-17 41l22 60-27 83H57l-27-83 22-60c-9-10-17-23-17-41 0-27 17-45 45-45z"/></g><line x1="325" y1="145" x2="405" y2="145" class="orientation-arrow"/><text x="303" y="126" class="fx-callout">后来翻为俯卧</text></svg><div class="fx-note">尸斑固定后不会因为尸体后来翻转而“跟着搬家”。这一点证明尸体姿势被改变，但不单独给出精确死亡小时。</div></div>`,
    "内侧门闩": () => `<div class="forensic-view fx-latch"><div class="fx-head"><b>门闩磨痕特写</b><span>受力处</span></div><div class="doorwood"></div><div class="bolt"></div><div class="keeper"></div><div class="scar"></div><div class="scar-label">新磨痕 / 透明纤维</div><div class="fx-micro"></div><div class="fx-note">磨痕位于插销受横向牵拉的位置。单看这道痕迹只能证明“有人施力”，需要再找到传力物。</div></div>`,
    "通风管": () => `<div class="forensic-view fx-vent"><div class="fx-head"><b>通风弯头截面</b><span>传力物</span></div><div class="pipe"></div><div class="bend"></div><div class="line"></div><div class="tag">透明钓线卡在弯头内侧</div><div class="fx-note">管径不能让手通过，却足够让细线绕过弯头。它与门闩磨痕可以组成一条连续受力路径。</div></div>`,
    "凉茶": () => `<div class="forensic-view fx-tea-view"><div class="fx-head"><b>杯底 / 胃内容物对照</b><span>摄入 ≠ 检出</span></div><div class="fx-tea"></div><div class="fx-assay"><b>化验记录</b><div class="row"><span>杯底镇静剂</span><span class="fx-positive">阳性</span></div><div class="row"><span>胃内容物对应成分</span><span class="fx-negative">未检出</span></div><div class="row"><span>可否证明服药</span><span class="fx-negative">不能</span></div></div><div class="fx-note">“杯中有药”与“死者喝下药”必须分栏。此证物用于排除药物进入死亡过程。</div></div>`,
    "石地与头部": () => `<div class="forensic-view fx-impact"><div class="fx-head"><b>后枕伤 / 桌角高度比对</b><span>伤口机制</span></div><div class="head"></div><div class="wound"></div><div class="table-edge"></div><div class="heightline"><span>高度相符</span></div><div class="fx-note">后枕只有一处主要撞击伤，形态与桌角相符。低温会干扰尸体现象，因此这里不再把偏差武断写成“整整一天”。</div></div>`,
    "信 A · 空白压痕": () => paperIndent(false),
    "信 A · 已显影": () => paperIndent(true),
    "信 B · 火漆封面": () => waxView(),
    "信 B · 控制火焰": () => waxView(),
    "信 B · 已开启": () => waxView(true),
    "信 C · 蓝边纸": () => reagentView(false),
    "信 C · 淀粉墨": () => reagentView(true),
    "信 C · 已显影": () => reagentView(true),
    "温度记录表": () => chartView(),
    "三份笔迹": () => handwritingView(),
    "空置长层板": () => coldView("shelf"),
    "地面拖痕": () => coldView("drag"),
    "投递胶囊": () => capsuleView(),
    "气动管投递口": () => capsuleView(),
    "延时阀": () => capsuleView(),
    "破损密封圈": () => gasketView(),
    "新密封圈": () => gasketView(true)
  };

  function paperIndent(done){
    return `<div class="forensic-view"><div class="fx-head"><b>纸面压痕侧光</b><span>${done?"石墨显影完成":"待显影"}</span></div><div class="fx-paper"><div class="fx-pressure ${done?"fx-rub":""}">${done?"17—B …… 我小时候在母亲的东西上见过这个编号。":"＿＿＿　＿＿＿＿＿＿　＿＿＿＿＿＿＿＿"}</div></div><div class="fx-note">软铅笔侧锋只让凸起纤维挂上石墨，不需要浸湿旧纸，也不会重新压出新的笔画。</div></div>`;
  }
  function waxView(open=false){
    return `<div class="forensic-view"><div class="fx-head"><b>老化火漆检查</b><span>${open?"已软化开启":"间接温热"}</span></div><div class="fx-paper" style="left:14%;right:14%;top:23%;bottom:14%"></div><div class="fx-heat"></div><div class="fx-seal" style="opacity:${open?.45:1}"></div><div class="fx-distance"><span>保持约两指宽距离</span></div><div class="fx-note">目标是让脆化火漆缓慢变软，而不是把封口烧熔。直接贴火会先伤纸纤维。</div></div>`;
  }
  function reagentView(done=false){
    return `<div class="forensic-view fx-reagent-paper"><div class="fx-head"><b>淀粉隐写显色</b><span>${done?"稀释碘液 + 棉签":"透明笔迹"}</span></div><div class="fx-paper"></div><div class="inkline ${done?"revealed":""}">${done?"0.6，不是 6。":"0.6，不是 6。"}<br/>纸纤维中的笔迹只在薄涂后显出边缘。</div><div class="fx-swab"></div><div class="fx-note">浓碘液会把细线染成一片；稀释并控制涂抹范围，才能保住“0.6”中决定性的那个点。</div></div>`;
  }
  function chartView(){
    return `<div class="forensic-view"><div class="fx-head"><b>温度表侧光复核</b><span>覆写层</span></div><div class="fx-chart"><table><tr><th>日期</th><th>06:00</th><th>12:00</th><th>18:00</th></tr><tr><td>11 / 16</td><td>3°C</td><td>3°C</td><td>2°C</td></tr><tr><td>11 / 17</td><td>2°C</td><td><span class="fx-overwrite"><span class="under2">2°C</span><span class="top1">1</span></span></td><td>2°C</td></tr></table><div class="fx-side-light"></div></div><div class="fx-note">侧光只证明“12°C”是在原来的“2°C”上覆写。它证明冷库确实处于低温，但不单独证明尸体停放了24小时。</div></div>`;
  }
  function handwritingView(){
    return `<div class="forensic-view"><div class="fx-head"><b>三份字迹叠合</b><span>只比特征，不比“像不像”</span></div><div class="fx-handwriting"><div class="fx-hand-card"><b>今晨来信</b><span class="h">h</span><i class="stroke"></i></div><div class="fx-hand-card"><b>温度表覆写</b><span class="h">h</span><i class="stroke"></i></div><div class="fx-hand-card"><b>护士登记簿</b><span class="h">h</span><i class="stroke"></i></div></div><div class="fx-note">比对的是最后一笔向左折回的角度、停笔位置与比例，不把“整体看着像”当作结论。</div></div>`;
  }
  function coldView(mode){
    return `<div class="forensic-view fx-cold"><div class="fx-head"><b>冷库现场微痕</b><span>${mode==="drag"?"地面拖痕":"层板接触"}</span></div><div class="frost"></div><div class="shelf"></div><div class="fiber"></div><div class="drag1"></div><div class="drag2"></div><div class="fx-note">纤维证明制服与层板直接接触；拖痕说明重物从层板方向移动到门外。两者能证明尸体进过冷库，但时长仍需克制表述。</div></div>`;
  }
  function capsuleView(){
    return `<div class="forensic-view fx-capsule"><div class="fx-head"><b>气动胶囊延时路径</b><span>隔夜档</span></div><div class="tube"></div><div class="capsule"></div><div class="timeline"><b>17 日晚间 · 入管</b><b>≈ 12 h</b><b>18 日清晨 · 落下</b></div><div class="fx-note">当前案情只需要“跨过一夜”，无需把延时写成整整24小时。隔夜档与11月17日晚争执、18日07:40复核时间能够同时成立。</div></div>`;
  }
  function gasketView(done=false){
    return `<div class="forensic-view"><div class="fx-head"><b>密封圈截面</b><span>${done?"临时气密已恢复":"破损漏气"}</span></div><svg class="fx-svg" viewBox="0 0 700 280"><circle cx="260" cy="142" r="85" fill="none" stroke="#574a3d" stroke-width="35"/><path d="M320 80 L362 45" stroke="${done?'#53654e':'#813f39'}" stroke-width="${done?18:9}"/><circle cx="260" cy="142" r="42" fill="#d7cbb6" stroke="#82715a" stroke-width="2"/><text x="390" y="70" class="fx-callout">${done?'明胶临时垫圈填补裂口':'旧橡胶圈裂口造成泄压'}</text><path d="M350 58 L326 82" class="fx-callout-line"/></svg><div class="fx-note">明胶吸水受热后可塑形，冷却后短时恢复气密。它是临时维修件，不被当成永久修复。</div></div>`;
  }

  function evidenceRegistered(text){
    const list = $("evidence-list");
    return !!list && list.textContent.includes(text);
  }

  function addReplayButton(title){
    if(title !== "内侧门闩" && title !== "通风管") return;
    const actions = $("detail-actions");
    if(!actions || actions.querySelector("[data-forensic-replay]")) return;
    const hasPair = evidenceRegistered("门闩") && evidenceRegistered("通风管");
    const b = document.createElement("button");
    b.className = "ink-button forensic-action";
    b.dataset.forensicReplay = "1";
    b.textContent = localStorage.getItem(REPLAY_KEY) ? "再次重演门闩机关" : "重演门闩受力路径";
    b.disabled = !hasPair;
    b.title = hasPair ? "亲手验证钓线如何从通风管牵落内侧插销" : "先分别登记门闩磨痕与通风管钓线";
    b.addEventListener("click", openReplay);
    actions.appendChild(b);
    if(!hasPair){
      const n=document.createElement("div");n.className="forensic-tip";n.textContent="现场重演需要先登记“内侧门闩”和“通风管”两件证物。";actions.appendChild(n);
    }
  }

  function enhanceDetail(){
    const modal = $("detail-modal");
    const titleEl = $("detail-title");
    const visual = $("detail-visual");
    if(!modal || !titleEl || !visual || modal.classList.contains("hidden")) return;
    const title = titleEl.textContent.trim();
    repairCaseLogic(title);
    const maker = visuals[title];
    if(maker && !visual.querySelector(".forensic-view")) visual.innerHTML = maker();
    addReplayButton(title);
    patchDeduction(title);
  }

  function patchDeduction(title){
    const copy=$("detail-copy"), actions=$("detail-actions");
    if(!copy||!actions) return;
    if(title === "死亡时间为什么会被误判？" || title === "尸体少掉的那一天去了哪里？"){
      const feed=$("deduction-feedback");
      if(feed && !copy.querySelector(".deduction-audit")){
        const d=document.createElement("div");d.className="deduction-audit";d.textContent="复核原则：这组证据证明“低温接触导致死亡时间判断失真”，不把冷库存放时长写成证据没有直接支持的24小时。";copy.appendChild(d);
      }
    }
    if(title === "门闩为什么能在空房间里落下？" && !copy.querySelector(".deduction-audit")){
      const d=document.createElement("div");
      const done=!!localStorage.getItem(REPLAY_KEY);
      d.className="deduction-audit "+(done?"":"pending");
      d.textContent=done?"现场重演：钓线—弯头—插销的受力路径已亲手验证。":"可选强化：先在门闩或通风管证物页完成一次现场重演，再提交机关结论。";
      copy.appendChild(d);
      if(!done && !actions.querySelector("[data-forensic-replay]")){
        const b=document.createElement("button");b.className="ink-button forensic-action";b.dataset.forensicReplay="1";b.textContent="先重演门闩机关";b.onclick=openReplay;actions.prepend(b);
      }
    }
  }

  function repairCaseLogic(title){
    const copy=$("detail-copy"), actions=$("detail-actions");
    if(title === "延时阀" && copy && actions){
      const revised = "四个刻度分别对应立即、三小时、六小时与隔夜约十二小时。胶囊带着前一日晚间的邮戳油墨，却在18日清晨落下；需要选择能跨过这一夜、又不与昨晚争执时间冲突的档位。";
      if(copy.innerHTML !== revised) copy.innerHTML = revised;
      const bs=[...actions.querySelectorAll("button")];
      const map={"6 小时":"3 小时","12 小时":"6 小时","24 小时":"12 小时 · 隔夜档"};
      bs.forEach(b=>{if(map[b.textContent.trim()]) b.textContent=map[b.textContent.trim()];});
    }
    if(title === "石地与头部" && copy){
      const revised = "后枕只有一处主要撞击伤，高度接近桌角。四肢僵硬和表面变化与07:40报案推算不一致，但低温会明显干扰这些现象；因此这里只能确认死亡时间被低温伪装，不能仅凭尸体现象把偏差精确成整整一天。";
      if(copy.innerHTML !== revised) copy.innerHTML = revised;
    }
    if(title === "气动管投递口" && copy){
      const revised = "黄铜胶囊从这里落下。维修标记显示，这一型号具有用于隔夜投递的延时档；本案需要结合17日晚间与18日清晨的时间窗判断具体档位。";
      if(copy.innerHTML !== revised) copy.innerHTML = revised;
    }
  }

  const exactReplacements = new Map([
    ["第三章 · 少掉的一天","第三章 · 隔夜"],
    ["少掉的一天","隔夜"],
    ["谁从尸体上偷走了二十四小时？","低温与延时装置怎样共同制造了错误时间感？"],
    ["尸体少掉的那一天去了哪里？","死亡时间为什么会被误判？"],
    ["尸体曾在2°C冷库停放约24小时","尸体曾被移入2°C冷库，低温干扰了死亡时间判断"],
    ["玛戈写下后让胶囊在延时阀中滞留24小时","玛戈写下后让胶囊在隔夜档中滞留约12小时"],
    ["延时阀的24小时档能解释17日邮戳为何到18日清晨才出现。","延时阀的隔夜档（约12小时）能解释17日晚间胶囊为何到18日清晨才出现。"],
    ["这是二十四小时档。胶囊如果昨晚进了管线，今早落到办公室，时间正好。至于是谁放进去的，机械本身回答不了。","这是隔夜档，约十二小时。胶囊如果昨晚进了管线，今早落到办公室，时间正好。至于是谁放进去的，机械本身回答不了。"],
    ["投递时间仍然晚了整整十八小时。","这个档位仍不足以跨过昨夜到今晨的完整时间窗。"],
    ["还差半天。","六小时仍短于昨夜到今晨的间隔。"]
  ]);

  function repairVisibleText(root=document.body){
    if(!root) return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    const nodes=[];let n;while((n=walker.nextNode())) nodes.push(n);
    nodes.forEach(node=>{
      const raw=node.nodeValue;
      const trimmed=raw.trim();
      if(exactReplacements.has(trimmed)) node.nodeValue=raw.replace(trimmed,exactReplacements.get(trimmed));
      else {
        let out=raw;
        out=out.replace(/偏差接近一天。/g,"存在明显偏差，但无法仅凭尸体现象精确到小时。");
        out=out.replace(/阀门最多可滞留二十四小时/g,"阀门设有用于隔夜投递的延时档");
        out=out.replace(/二十四小时档/g,"隔夜档（约十二小时）");
        out=out.replace(/24小时档/g,"隔夜档（约12小时）");
        out=out.replace(/滞留24小时/g,"滞留约12小时");
        if(out!==raw) node.nodeValue=out;
      }
    });
  }

  function normalizeSave(){
    try{
      const raw=localStorage.getItem(SAVE_KEY);if(!raw)return;
      const s=JSON.parse(raw);if(!s||typeof s!=="object")return;
      let dirty=false;
      if(s.version!==5){s.version=5;dirty=true;}
      if(s.supportTriggered && !s.flags?.letterB){s.supportTriggered=false;dirty=true;}
      if(dirty)localStorage.setItem(SAVE_KEY,JSON.stringify(s));
    }catch(_){ }
  }

  function ensureColdPin(){
    const stage=$("stage"), scene=$("scene-name");
    if(!stage||!scene)return;
    let pin=stage.querySelector(".forensic-scene-pin");
    const isCold=scene.textContent.includes("冷藏库");
    if(!isCold){if(pin)pin.remove();return;}
    if(pin)return;
    pin=document.createElement("button");
    pin.className="forensic-scene-pin";
    pin.innerHTML='复核时间窗<small>边注 · 不计入证物</small>';
    pin.onclick=openColdAudit;
    stage.appendChild(pin);
  }

  function createOverlay(){
    if($("forensic-overlay"))return $("forensic-overlay");
    const o=document.createElement("section");o.id="forensic-overlay";o.className="forensic-overlay";o.hidden=true;o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");o.innerHTML='<div class="forensic-window" id="forensic-window"></div>';
    document.body.appendChild(o);
    o.addEventListener("click",e=>{if(e.target===o)closeOverlay();});
    return o;
  }
  function closeOverlay(){const o=$("forensic-overlay");if(o)o.hidden=true;}

  function openColdAudit(){
    const o=createOverlay(),w=$("forensic-window");
    w.innerHTML=`<button class="forensic-close" aria-label="关闭">×</button><p class="kicker">17—B · 时间逻辑复核边注</p><h2>冷库能证明什么，不能证明什么</h2><p class="lead">原记录能直接证明的是：冷库在11月17日实际约2°C，死者制服与层板接触，并有向门外延伸的拖痕。它足以解释为什么尸体现象让死亡时间显得更近，但不能独立推出“整整24小时”。</p><dl class="forensic-timeline"><dt>11月17日 18:12</dt><dd>玛戈购买两人份早餐。该生活记录只限定“当晚仍有共同早餐计划”，不作为尸体进入冷库的物证。</dd><dt>11月17日晚间</dt><dd>争执发生，赫尔曼后退撞上桌角。随后尸体被短时移入2°C冷库，低温干扰尸僵与表面变化。</dd><dt>隔夜时间窗</dt><dd>气动胶囊使用约12小时的隔夜档，让前一日晚间进入管线的胶囊在18日清晨落下。</dd><dt>11月18日 07:40</dt><dd>艾达进入案卷时间。此时能够确认“低温接触 + 隔夜延时”，而不是虚构一个与故事时间冲突的24小时空档。</dd></dl><div class="logic-fix"><b>修正后的结论：</b>尸体曾被移入2°C冷库，低温干扰了死亡时间判断；延时胶囊跨过一夜。两条时间机制各自有证据，不再强行写成同一个“24小时”。</div>`;
    w.querySelector(".forensic-close").onclick=closeOverlay;o.hidden=false;
  }

  function openReplay(){
    const o=createOverlay(),w=$("forensic-window");
    w.innerHTML=`<button class="forensic-close" aria-label="关闭">×</button><p class="kicker">17—B · 机关现场重演</p><h2>让空房间里的门闩自己落下</h2><p class="lead">按证物实际位置重走一遍：先确认钓线能够进入通风弯头，再把另一端挂到插销受力点，最后从门外拉紧。只有三步都成立，密室机关才算被亲手验证。</p><div class="replay-board" id="replay-board"><div class="replay-door"><div class="replay-bolt" id="replay-bolt"></div><div class="replay-keeper"></div></div><div class="replay-vent"></div><div class="replay-wall"></div><svg class="replay-rope" viewBox="0 0 1000 420" preserveAspectRatio="none"><path id="replay-path" d="M 490 130 C 520 170, 430 210, 225 205" fill="none" stroke="rgba(224,235,230,.15)" stroke-width="4" stroke-dasharray="8 8"/></svg><button class="replay-point rp-vent" data-step="vent" aria-label="把钓线送入通风弯头">1</button><button class="replay-point rp-latch" data-step="latch" aria-label="把钓线挂到门闩受力点">2</button></div><div class="replay-controls"><label>3 · 从门外缓慢拉紧钓线<br/><input id="replay-pull" type="range" min="0" max="100" value="0" disabled/></label><b id="replay-pull-value">0%</b></div><div class="replay-status" id="replay-status">第一步：点击通风弯头，把透明钓线送进去。</div>`;
    w.querySelector(".forensic-close").onclick=closeOverlay;
    const board=$("replay-board"), status=$("replay-status"), range=$("replay-pull"), value=$("replay-pull-value"), path=$("replay-path");
    let step=0;
    const vent=w.querySelector('[data-step="vent"]'), latch=w.querySelector('[data-step="latch"]');
    vent.onclick=()=>{if(step!==0)return;step=1;vent.classList.add("done");latch.classList.add("active");path.setAttribute("stroke","rgba(224,235,230,.72)");status.textContent="第二步：把钓线另一端挂到门闩插销的受力处。";};
    latch.onclick=()=>{if(step!==1)return;step=2;latch.classList.remove("active");latch.classList.add("done");range.disabled=false;status.textContent="第三步：从门外拉紧。观察插销是否沿磨痕方向移动并落入扣孔。";};
    range.oninput=()=>{const v=Number(range.value);value.textContent=v+"%";board.style.setProperty("--pull",v);if(v>=88&&step===2){step=3;localStorage.setItem(REPLAY_KEY,"1");status.className="replay-status success";status.innerHTML="<b>受力路径成立。</b> 钓线从通风弯头传力，插销沿新磨痕方向移动并落入扣孔。密室不需要第二个人留在房内。";range.disabled=true;repairVisibleText();setTimeout(enhanceDetail,20);}};
    o.hidden=false;
  }

  function postMutation(){
    repairVisibleText();
    enhanceDetail();
    ensureColdPin();
    normalizeSave();
  }

  let queued=false;
  const observer=new MutationObserver(()=>{
    if(queued)return;queued=true;
    queueMicrotask(()=>{queued=false;postMutation();});
  });
  observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:["class"]});

  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!$("forensic-overlay")?.hidden)closeOverlay();});
  document.addEventListener("click",()=>setTimeout(normalizeSave,0),true);
  window.addEventListener("beforeunload",normalizeSave);
  window.addEventListener("pageshow",postMutation);

  document.documentElement.dataset.forensicEnhance=PATCH;
  postMutation();
})();
