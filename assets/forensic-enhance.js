(() => {
  "use strict";

  const PATCH = "2026-08-26-forensic-v4";
  if (document.documentElement.dataset.forensicEnhance === PATCH) return;
  document.documentElement.dataset.forensicEnhance = PATCH;

  const $ = (id) => document.getElementById(id);
  const REPLAY_KEY = "dead-letter-room-latch-replay-v1";
  const SAVE_KEY = "dead-letter-room-save-v5";

  injectStyles();

  const aliasMap = {
    "背侧尸斑": "赫尔曼的尸体",
    "门闩线痕": "内侧门闩",
    "钉死高窗": "钉死的高窗",
    "通风管钓线": "通风管",
    "镇静剂凉茶": "凉茶",
    "后枕伤与尸僵": "石地与头部",
    "压痕信 · 17—B": "信 A · 已显影",
    "安娜的氯醛处方": "信 B · 已开启",
    "淀粉墨 · 0.6 克": "信 C · 已显影",
    "隔夜邮戳胶囊": "投递胶囊",
    "冷库层板纤维": "空置长层板",
    "冷库平行拖痕": "地面拖痕",
    "温度表覆写": "温度记录表",
    "三处 h 的同形收笔": "三份笔迹",
    "制服内衬里的第六封信": "第六封信",
    "法医学手册": "旧法医学手册"
  };

  const exactReplacements = new Map([
    ["第三章 · 少掉的一天", "第三章 · 隔夜"],
    ["少掉的一天", "隔夜"],
    ["谁从尸体上偷走了二十四小时？", "低温与延时装置怎样共同制造了错误时间感？"],
    ["尸体少掉的那一天去了哪里？", "死亡时间为什么会被误判？"],
    ["尸体曾在2°C冷库停放约24小时", "尸体曾被移入2°C冷库，低温干扰了死亡时间判断"],
    ["玛戈写下后让胶囊在延时阀中滞留24小时", "玛戈写下后让胶囊在隔夜档中滞留约12小时"],
    ["延时阀的24小时档能解释17日邮戳为何到18日清晨才出现。", "延时阀的隔夜档（约12小时）能解释17日晚间胶囊为何到18日清晨才出现。"],
    ["这是二十四小时档。胶囊如果昨晚进了管线，今早落到办公室，时间正好。至于是谁放进去的，机械本身回答不了。", "这是隔夜档，约十二小时。胶囊如果昨晚进了管线，今早落到办公室，时间正好。至于是谁放进去的，机械本身回答不了。"],
    ["投递时间仍然晚了整整十八小时。", "这个档位仍不足以跨过昨夜到今晨的完整时间窗。"],
    ["还差半天。", "六小时仍短于昨夜到今晨的间隔。"]
  ]);

  const visuals = {
    "赫尔曼的尸体": () => plate({
      title: "尸斑位置复核",
      tag: "姿势 ≠ 形成姿势",
      figure: corpseFigure(),
      side: facts([
        ["发现姿势", "俯卧"],
        ["固定尸斑", "主要在背侧"],
        ["可推出", "尸体曾被翻动"],
        ["不可直接推出", "精确死亡小时"]
      ]),
      note: "尸斑固定后不会随着尸体后来的摆放方式完全改变。它先证明‘姿势被改动’，再为后续低温误导留下入口。"
    }),
    "内侧门闩": () => plate({
      title: "门闩磨痕近景",
      tag: "受力处",
      figure: latchFigure(),
      side: facts([
        ["新痕位置", "插销横向移动路径"],
        ["痕迹宽度", "接近透明钓线"],
        ["伴随物", "透明纤维"],
        ["推理作用", "说明有人从外部施力"]
      ]),
      note: "这是一处真正能被‘看见’的物证：磨痕落在插销受力方向上，只有横向牵拉才会留下这样的一道新痕。"
    }),
    "钉死的高窗": () => plate({
      title: "高窗封死状态",
      tag: "排除出入路径",
      figure: windowFigure(),
      side: facts([
        ["木板位置", "从室内钉死"],
        ["钉头锈迹", "连续完整"],
        ["若近期拔动", "应见断裂锈层与木纤维"],
        ["结论", "并非进出密室的通道"]
      ]),
      note: "高窗不是制造密室的入口。这里的价值在于排除错误路线，让玩家把注意力转回门闩与通风管。"
    }),
    "通风管": () => plate({
      title: "通风弯头截面",
      tag: "传力物",
      figure: ventFigure(),
      side: facts([
        ["通道尺寸", "手臂无法穿过"],
        ["发现物", "透明钓线"],
        ["线身附着", "细小木屑"],
        ["推理作用", "可与门闩磨痕拼成一条受力路径"]
      ]),
      note: "这不是简笔说明，而是一块证物截面。玩家能直接看到：人过不去，细线却能绕过弯头。"
    }),
    "凉茶": () => plate({
      title: "杯中残留对照",
      tag: "杯底有药，不等于死者服药",
      figure: teaFigure(),
      side: facts([
        ["杯底沉淀", "检出镇静剂"],
        ["胃内容物", "未见对应成分"],
        ["能证明", "杯中曾有药"],
        ["不能证明", "赫尔曼喝下了它"]
      ]),
      note: "这一页应当可视化区分‘杯里的事实’与‘体内的事实’。它的工作不是指凶，而是排除药物致死。"
    }),
    "石地与头部": () => plate({
      title: "后枕伤与桌角高度比对",
      tag: "真正伤口",
      figure: impactFigure(),
      side: facts([
        ["致命伤", "后枕单一撞击伤"],
        ["高度比对", "接近桌角"],
        ["同时观察到", "尸僵与表面变化被低温扰动"],
        ["结论", "不能把误差武断写成整整一天"]
      ]),
      note: "这幅比对图把伤口机制与时间误导拆开：前者指向跌倒撞击，后者只提示低温干扰。"
    }),
    "信 A · 空白压痕": () => plate({
      title: "纸面压痕侧光",
      tag: "待显影",
      figure: indentFigure(false),
      side: facts([
        ["纸面状态", "无墨迹"],
        ["斜侧光", "可见浅沟"],
        ["适合工具", "软芯铅笔侧锋"],
        ["错误做法", "浸湿或重压"]
      ]),
      note: "先让玩家看见凹痕，再决定是否使用铅笔。这样知识是观察的延伸，而不是凭空出现的答案。"
    }),
    "信 A · 已显影": () => plate({
      title: "纸面压痕侧光",
      tag: "显影完成",
      figure: indentFigure(true),
      side: facts([
        ["显出文字", "17—B / 前五封已交 / 第六封未投递"],
        ["操作方式", "铅笔侧锋轻擦"],
        ["保护原则", "不浸湿旧纸"],
        ["作用", "把第六封信推入案件中心"]
      ]),
      note: "显出的不是神秘密码，而是上层纸张留下的真实压痕。"
    }),
    "信 B · 火漆封面": () => plate({
      title: "旧火漆封口",
      tag: "不可硬撬",
      figure: waxFigure(false),
      side: facts([
        ["火漆状态", "发脆"],
        ["下层纸张", "更薄、更旧"],
        ["安全处理", "隔距缓慢温热"],
        ["错误处理", "贴火或硬撬"]
      ]),
      note: "这页不该再是中间一张小卡片。火漆和纸边的危险点要直接呈现出来。"
    }),
    "信 B · 控制火焰": () => plate({
      title: "控制热量",
      tag: "只软化，不熔毁",
      figure: waxFigure(false, true),
      side: facts([
        ["推荐距离", "约两指宽"],
        ["目标", "让火漆缓慢变软"],
        ["不该发生", "纸边卷曲冒烟"],
        ["结论", "间接加热才是正确操作"]
      ]),
      note: "让玩家从画面上理解热量控制：火焰不是越近越好，‘能开封而不伤纸’才是目标。"
    }),
    "信 B · 已开启": () => plate({
      title: "处方残页展开",
      tag: "水渍正穿过剂量栏",
      figure: prescriptionFigure(),
      side: facts([
        ["残缺位置", "剂量栏"],
        ["仍可辨认", "其余笔画"],
        ["单独不足", "不能凭它直接还原剂量"],
        ["须结合", "后续显色补注"]
      ]),
      note: "这页的图像任务是让玩家真正看见‘小数点为什么会被误读’。"
    }),
    "信 C · 蓝边纸": () => plate({
      title: "蓝边纸隐写痕迹",
      tag: "待显色",
      figure: reagentFigure(false),
      side: facts([
        ["看见的", "近乎透明的笔迹"],
        ["可用手段", "稀释碘液 + 棉签"],
        ["不能直接做", "原液整片滴覆"],
        ["原因", "会遮住细线"]
      ]),
      note: "先显示薄弱笔画本身，再解释为何需要稀释显色。"
    }),
    "信 C · 淀粉墨": () => plate({
      title: "显色进行中",
      tag: "稀释后才看得见线条",
      figure: reagentFigure(true),
      side: facts([
        ["操作工具", "棉签薄涂"],
        ["显色原理", "碘与淀粉墨反应"],
        ["正在浮现", "0.6，不是6"],
        ["意义", "把十九年前的误读钉死"]
      ]),
      note: "显色应是一张带过程感的图，而不只是告知玩家‘成功了’。"
    }),
    "信 C · 已显影": () => plate({
      title: "显色完成",
      tag: "0.6，不是6",
      figure: reagentFigure(true),
      side: facts([
        ["补注内容", "剂量是零点六"],
        ["留下人", "H"],
        ["与处方关系", "补全了原本缺失的小数点信息"],
        ["作用", "解释玛戈十九年前的误解"]
      ]),
      note: "真正关键的不是一句‘补注出现了’，而是让玩家看见数字差一位就能改变命运。"
    }),
    "半开的抽屉": () => plate({
      title: "抽屉内物件",
      tag: "取证与收纳",
      figure: drawerFigure(),
      side: facts([
        ["可拿取", "扁平木工铅笔 / 短蜡烛 / 半块黑面包"],
        ["压在底部", "一张便笺"],
        ["空间逻辑", "玩家能区分物与位置"],
        ["意义", "收纳应基于图像，不是纯文本罗列"]
      ]),
      note: "这里也强化成图像式收纳示意，避免‘文字收纳’的抽离感。"
    }),
    "气动管投递口": () => plate({
      title: "投递口与维修标记",
      tag: "时间装置入口",
      figure: tubePortFigure(),
      side: facts([
        ["看见的", "黄铜投递口与延时铭牌"],
        ["本案关键", "胶囊跨过一夜"],
        ["排查后修正", "不再强写成24小时"],
        ["后续关联", "延时阀 / 投递胶囊"]
      ]),
      note: "投递口不应只剩一句文字说明。它是第三章时间机关的视觉前导。"
    }),
    "短波收音机": () => genericItem("短波收音机", "旧机器仍调在夜间频道。旋钮边缘磨得发亮，布面喇叭罩积了一层浅灰。"),
    "死信柜": () => genericItem("死信柜", "高柜抽屉被反复开合，标签纸陈旧，锁孔附近却较新。它服务于人物关系，也服务于第六封信的隐藏。"),
    "维克托的手提箱": () => genericItem("维克托的手提箱", "皮箱边角磨白，金属搭扣保养得很好。它像一个真正被长期携带的工作物件，而不是游戏里的‘按钮’。"),
    "碘酒与滴管": () => genericItem("碘酒与滴管", "用于调配显色液的实际器材。瓶口、滴管和液体颜色都以旧化风格表现。"),
    "清水": () => genericItem("清水", "一只小烧杯或玻璃杯，作为实验材料呈现。"),
    "棉签": () => genericItem("棉签", "棉头、木杆和投影都应明确可见。"),
    "面粉罐": () => genericItem("面粉罐", "一只旧厨房罐头样式的小罐，既像生活用品，也能在实验逻辑里站得住。"),
    "明胶片": () => genericItem("明胶片", "半透明片材堆在纸包里，能让玩家直观看出是可塑材料。"),
    "酒精灯": () => genericItem("酒精灯", "稳定热源以玻璃灯体和细小火焰表现，不再只用图标代替。"),
    "实验台": () => plate({
      title: "实验台",
      tag: "显色与制模操作位",
      figure: labBenchFigure(),
      side: facts([
        ["当前用途", "配稀释碘液 / 制作明胶密封圈"],
        ["保留痕迹", "烧杯蓝痕 / 小模具 / 夹具"],
        ["玩法目标", "让物理过程有操作感"],
        ["收纳逻辑", "道具在画面里有明确位置"]
      ]),
      note: "实验台需要看起来像一个真实的操作空间，而不是抽象的‘解谜入口’。"
    }),
    "显色液实验": () => plate({
      title: "配制显色液",
      tag: "碘酒必须先稀释",
      figure: reagentMixFigure(),
      side: facts([
        ["正确组合", "碘酒 + 清水"],
        ["错误组合", "碘酒 + 面粉"],
        ["效果区别", "可用显色液 vs 蓝色浆糊"],
        ["目的", "保留细笔画可读性"]
      ]),
      note: "配液也是一页应有视觉反馈的实验，而非只靠按钮读结果。"
    }),
    "旧法医学手册": () => genericItem("旧法医学手册", "翻开的手册以旧纸、批注和夹页的方式出现，重点是‘低温会改变判断，不会重写伤口与尸斑’。"),
    "明胶密封圈": () => plate({
      title: "明胶制模原理",
      tag: "吸水、加热、塑形",
      figure: gasketMakingFigure(),
      side: facts([
        ["材料", "干明胶片"],
        ["步骤", "吸水 → 加热 → 入模 → 冷却"],
        ["形成", "临时密封圈"],
        ["作用", "短时恢复气密"]
      ]),
      note: "把‘明胶可以制圈’画出来，玩家才会感到这是一条可信的现实路径。"
    }),
    "破损密封圈": () => plate({
      title: "破损垫圈",
      tag: "漏气原因",
      figure: gasketFigure(false),
      side: facts([
        ["损坏位置", "切裂缺口"],
        ["直接后果", "无法建立压力"],
        ["补救思路", "制作可逆临时替代件"],
        ["关联", "延时阀无法工作"]
      ]),
      note: "把缺口、材质和受压位置画清楚，玩家会更自然地想到‘修复而不是替换整个系统’。"
    }),
    "新密封圈": () => plate({
      title: "新密封圈",
      tag: "气密恢复",
      figure: gasketFigure(true),
      side: facts([
        ["装配状态", "已贴合阀门"],
        ["材质", "明胶"],
        ["性质", "临时、可逆"],
        ["作用", "允许重新验证延时阀"]
      ]),
      note: "修复后的状态应与破损件形成直观对比。"
    }),
    "延时阀": () => plate({
      title: "延时阀刻度盘",
      tag: "隔夜档而非虚构24小时",
      figure: valveFigure(),
      side: facts([
        ["档位", "立即 / 3小时 / 6小时 / 隔夜约12小时"],
        ["本案需要", "跨过昨夜到今晨"],
        ["修正", "不再让时间线互相打架"],
        ["验证结果", "隔夜档成立"]
      ]),
      note: "把时间逻辑缩回到故事真正需要的‘隔夜时间窗’，避免玩家算时间时发现矛盾。"
    }),
    "投递胶囊": () => plate({
      title: "投递胶囊",
      tag: "17日晚间进入，18日清晨落下",
      figure: capsuleFigure(),
      side: facts([
        ["内壁残留", "11月17日蓝色邮戳油墨"],
        ["到达时点", "18日清晨"],
        ["推理作用", "证明信越过一夜"],
        ["需结合", "延时阀与笔迹"]
      ]),
      note: "胶囊作为核心时间证物，需要有近景、残留与时间轴三层信息。"
    }),
    "空置长层板": () => plate({
      title: "冷库层板纤维",
      tag: "制服接触痕迹",
      figure: coldFigure("shelf"),
      side: facts([
        ["层板状态", "空得过分彻底"],
        ["霜面附着", "深灰羊毛纤维"],
        ["对应物", "赫尔曼制服"],
        ["作用", "证明尸体接触过冷库"]
      ]),
      note: "这一页的重点是‘看见纤维真的留在霜面上’。"
    }),
    "地面拖痕": () => plate({
      title: "冷库地面拖痕",
      tag: "由层板向门外延伸",
      figure: coldFigure("drag"),
      side: facts([
        ["拖痕形态", "两道平行线"],
        ["间距", "接近死者肩宽"],
        ["方向", "从层板到门外"],
        ["作用", "补足尸体曾被移动的路径"]
      ]),
      note: "拖痕不是一句文字，它应当是一眼可辨的地面纹路。"
    }),
    "温度记录表": () => plate({
      title: "温度表侧光复核",
      tag: "底层为 2°C",
      figure: chartFigure(),
      side: facts([
        ["可见问题", "11/17 一栏墨色不同"],
        ["侧光结论", "12°C 是在 2°C 上覆写"],
        ["能证明", "当日冷库处于低温"],
        ["不能单独证明", "尸体整整停了24小时"]
      ]),
      note: "物证页要清楚告诉玩家：它能证明什么，不能证明什么。"
    }),
    "三份笔迹": () => plate({
      title: "三份字迹叠合",
      tag: "只比共同特征",
      figure: handwritingFigure(),
      side: facts([
        ["比较对象", "今晨来信 / 覆写记录 / 护士登记簿"],
        ["共同特征", "h 收笔向左回钩"],
        ["比较原则", "只比结构，不比‘感觉像不像’"],
        ["结论", "今天的手与玛戈有关"]
      ]),
      note: "笔迹比对应当长得像比对，而不是单纯一段说明文字。"
    }),
    "第六封信": () => plate({
      title: "制服内衬里的第六封信",
      tag: "从未投递",
      figure: sixthLetterFigure(),
      side: facts([
        ["发现位置", "制服内衬夹层"],
        ["信封状态", "无邮戳、贴身保存"],
        ["情感作用", "把赫尔曼的迟疑具体化"],
        ["叙事作用", "回收标题‘死信’的多重含义"]
      ]),
      note: "这封信既是证物，也应当是情绪上最被珍视的一件物。"
    })
  };

  function injectStyles(){
    if (document.getElementById("forensic-enhance-style")) return;
    const style = document.createElement("style");
    style.id = "forensic-enhance-style";
    style.textContent = `
      :root{--fx-paper:#eadfcd;--fx-paper2:#d7c7aa;--fx-paper3:#f2e9da;--fx-ink:#2b241d;--fx-soft:#6b5b4a;--fx-line:#9f8f77;--fx-red:#7d443b;--fx-green:#52634b;--fx-blue:#45606a;--fx-gold:#9b7a49;--fx-night:#141613;--fx-shadow:0 16px 40px rgba(0,0,0,.18)}
      .detail-visual{display:block!important;min-height:270px!important}
      .forensic-view{position:relative;display:flex;flex-direction:column;gap:12px;min-height:290px!important;padding:14px;background:linear-gradient(145deg,var(--fx-paper3),var(--fx-paper2));border:1px solid rgba(77,62,45,.35);box-shadow:inset 0 0 0 1px rgba(255,255,255,.4),0 14px 32px rgba(34,24,16,.1)!important;overflow:hidden}
      .forensic-view::before{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 14% 18%,rgba(255,255,255,.3),transparent 28%),repeating-linear-gradient(0deg,rgba(54,41,29,.03) 0 1px,transparent 1px 4px)}
      .fx-head{position:relative;z-index:2;display:flex;justify-content:space-between;align-items:center;gap:12px;padding-bottom:10px;border-bottom:2px double rgba(81,64,45,.45);font:700 11px/1.3 Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#6c5d4b}
      .fx-head b{display:block;color:#2d241b;font-size:13px;letter-spacing:.06em}
      .fx-body{position:relative;z-index:2;display:grid;grid-template-columns:minmax(0,1.55fr) minmax(220px,.9fr);gap:12px;align-items:stretch;min-height:0;flex:1}
      .fx-figure-wrap{position:relative;min-height:220px;background:linear-gradient(180deg,#efe5d5,#dfcfb1);border:1px solid rgba(88,69,48,.35);box-shadow:inset 0 0 0 1px rgba(255,255,255,.35);overflow:hidden}
      .fx-figure-wrap::after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,rgba(255,255,255,.12),transparent 24%),repeating-linear-gradient(90deg,rgba(53,40,28,.025) 0 1px,transparent 1px 7px)}
      .fx-figure{display:block;width:100%;height:100%}
      .fx-side{display:flex;flex-direction:column;gap:10px}
      .fx-sheet{background:#f1e7d7;border:1px solid rgba(96,78,55,.35);padding:12px;box-shadow:0 8px 18px rgba(49,35,24,.08)}
      .fx-sheet h4{margin:0 0 8px;font:700 12px/1.2 Arial,sans-serif;letter-spacing:.08em;color:#5e4e3c;text-transform:uppercase}
      .fx-facts{display:grid;grid-template-columns:1fr auto;gap:0;border-top:1px solid #c6b493}
      .fx-facts dt,.fx-facts dd{margin:0;padding:7px 0;border-bottom:1px solid #d4c3a4;font-size:12px;line-height:1.55}
      .fx-facts dt{padding-right:10px;color:#5b4d3f;font-weight:700}
      .fx-facts dd{color:#2f261d;text-align:right}
      .fx-note-box{position:relative;z-index:2;padding:10px 12px;border-left:4px solid #7a5d3c;background:rgba(245,238,228,.94);font-size:13px;line-height:1.72;color:#362d23}
      .fx-chip-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}
      .fx-chip{padding:4px 8px;border:1px solid rgba(84,63,43,.28);background:#efe5d3;font-size:11px}
      .fx-label{font:700 11px/1.2 Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;fill:#f4ece0}
      .fx-call{font:12px/1.3 Arial,sans-serif;fill:#342c22}
      .fx-call-line{stroke:#604f3f;stroke-width:1.5;fill:none;stroke-dasharray:4 4}
      .fx-white{fill:#f6f0e3}.fx-paperfill{fill:#ede1ce}.fx-paperline{stroke:#7d6a54;stroke-width:1}.fx-wood{fill:#78553a}.fx-wood-dark{fill:#5d412d}.fx-metal{fill:#736a61}.fx-metal-dark{fill:#48413a}.fx-glass{fill:#bac7ca}.fx-ink{fill:#2f261f}.fx-rust{fill:#83483f}.fx-thread{stroke:#d6e0de;stroke-width:3;fill:none}.fx-cold{fill:#dfe8ea}.fx-frost{fill:#f6f7f2}.fx-shadow{fill:rgba(0,0,0,.16)}.fx-bluefill{fill:#48636f}.fx-greenfill{fill:#53654f}.fx-goldfill{fill:#9a7a49}.fx-redfill{fill:#7d433a}
      .forensic-tip{margin-top:10px;padding:9px 11px;border-left:3px solid #725844;background:rgba(103,82,58,.08);font-size:12px;line-height:1.65}
      .forensic-action{position:relative}.forensic-action::after{content:"现场重演";position:absolute;right:8px;top:-8px;font-size:9px;background:#6b5139;color:#f2eadc;padding:2px 4px;letter-spacing:.08em}
      .forensic-scene-pin{position:absolute;z-index:12;right:18px;top:18px;border:1px solid rgba(230,220,201,.7);background:rgba(25,27,25,.86);color:#e9dfcf;padding:8px 11px;cursor:pointer;font:12px inherit;box-shadow:0 5px 16px #0005}.forensic-scene-pin:hover{background:#39372f}.forensic-scene-pin small{display:block;font-size:9px;opacity:.7;margin-top:2px}
      .forensic-overlay{position:fixed;z-index:9999;inset:0;background:rgba(12,11,9,.78);display:grid;place-items:center;padding:18px}.forensic-overlay[hidden]{display:none}
      .forensic-window{position:relative;width:min(1040px,96vw);max-height:92vh;overflow:auto;background:#e8dfcf;color:#30281f;border:1px solid #9a876b;box-shadow:0 30px 90px #0009;padding:20px}
      .forensic-close{position:absolute;right:12px;top:10px;width:38px;height:38px;border:1px solid #8e7d68;background:#eee4d1;color:#3c3126;cursor:pointer;font-size:22px}
      .forensic-window h2{margin:4px 54px 7px 0;font-size:25px}.forensic-window .kicker{font-size:10px;letter-spacing:.13em;color:#6f5d49}.forensic-window .lead{line-height:1.75;color:#51463a}
      .replay-stage{position:relative;margin-top:14px;background:linear-gradient(180deg,#d9cab0,#c5b28f);border:1px solid #6b5845;overflow:hidden;box-shadow:inset 0 0 0 1px rgba(255,255,255,.24)}
      .replay-figure{display:block;width:100%;height:auto;min-height:420px}
      .replay-point{position:absolute;width:44px;height:44px;border-radius:50%;border:2px solid #f0e1bf;background:#5d4731e6;color:#fff;display:grid;place-items:center;cursor:pointer;box-shadow:0 0 0 5px rgba(240,225,191,.12),0 8px 18px rgba(0,0,0,.16);font-weight:700}
      .replay-point.active{outline:3px solid #c9aa72}.replay-point.done{background:#53654e}.rp-vent{left:59%;top:23%}.rp-latch{left:26%;top:49%}
      .replay-controls{display:grid;grid-template-columns:1fr auto;align-items:center;gap:14px;padding:14px;background:#d6c6aa;border:1px solid #a99475;border-top:0}.replay-controls input{width:100%}
      .replay-status{padding:10px 12px;margin-top:12px;border-left:3px solid #7c6345;background:#f1e8d8;line-height:1.65}.replay-status.success{border-color:#53654e;background:#e2e8dc}
      .forensic-timeline{display:grid;grid-template-columns:140px 1fr;gap:0;margin-top:16px;border-top:1px solid #9c8b72}.forensic-timeline dt,.forensic-timeline dd{margin:0;padding:12px;border-bottom:1px solid #aa997f}.forensic-timeline dt{font-weight:700;background:#dfd2bd}.forensic-timeline dd{background:#eee5d5;line-height:1.65}.logic-fix{margin-top:14px;padding:11px 12px;border:1px solid #aa997f;background:#f1e8d8;line-height:1.7}.logic-fix b{color:#69483a}
      .deduction-audit{margin-top:10px;padding:8px 10px;background:#e3ebdf;border-left:3px solid #53654e;font-size:12px;line-height:1.55}.deduction-audit.pending{background:#eee4d5;border-color:#886d4b}
      .fx-relation{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;padding:10px}.fx-rel-card{background:#f1e7d7;border:1px solid rgba(92,71,48,.35);padding:12px;box-shadow:0 8px 18px rgba(49,35,24,.08)}.fx-rel-card b{display:block;font-size:14px}.fx-rel-card small{display:block;color:#6d5d4a;margin-bottom:6px;font-family:Arial,sans-serif;letter-spacing:.06em;text-transform:uppercase}.fx-rel-card p{margin:0;font-size:12px;line-height:1.6}
      .paper-modal,.hint-modal,.archive-modal,.notebook-modal,.support-modal,.ending-modal{max-height:min(92vh,calc(100dvh - 20px))!important;overflow:auto!important}
      #detail-modal{width:min(980px,calc(100vw - 20px))!important}
      .forensic-view .specimen-card,.forensic-view .relation-plate{display:none!important}
      @media(max-width:1180px){.portal-shell{grid-template-columns:230px minmax(0,1fr) 210px!important}.game-layout{grid-template-columns:220px minmax(0,1fr) 250px!important}.casebar{padding-left:12px!important}}
      @media(max-width:960px){.fx-body{grid-template-columns:1fr!important}.fx-side{order:2}.portal-shell{grid-template-columns:1fr!important}.portal-left,.portal-right{display:grid;grid-template-columns:1fr 1fr;gap:12px}.portal-main{order:-1}}
      @media(max-width:860px){html,body{height:auto!important;overflow:auto!important}.game-screen{height:auto!important;min-height:100dvh!important;grid-template-rows:auto minmax(0,1fr) auto!important}.casebar{display:grid!important;grid-template-columns:1fr auto!important;align-items:start!important;padding:0 0 0 10px!important}.case-id{padding-top:6px}.case-tools{display:grid!important;grid-template-columns:repeat(4,minmax(56px,1fr))!important;grid-column:1/-1}.tool-button,.mobile-sheet-button{min-height:54px}.game-layout{grid-template-columns:1fr!important;grid-template-areas:"stage"!important}.location-rail,.evidence-panel{position:fixed!important;left:10px;right:10px;bottom:86px;top:auto;max-height:60vh;overflow:auto;z-index:25;transform:translateY(calc(100% + 24px));transition:transform .26s ease,opacity .26s ease;opacity:0}.location-rail.open,.evidence-panel.open{transform:translateY(0);opacity:1}.stage-wrap{min-width:0}.inventory-drawer{display:grid!important;grid-template-columns:auto auto 1fr auto auto!important;gap:8px;padding:8px 10px!important;height:auto!important}.scene-caption{left:12px!important;bottom:12px!important}.paper-modal,.hint-modal,.archive-modal,.notebook-modal,.support-modal,.ending-modal,.dispatch-window,.cover-file,.story-sheet{width:calc(100vw - 20px)!important;max-width:none!important;margin:10px auto!important}.detail-visual{min-height:240px!important}.forensic-window{width:calc(100vw - 16px)!important;padding:16px}.replay-figure{min-height:340px}.forensic-timeline{grid-template-columns:1fr}.forensic-timeline dt{padding-bottom:4px}.forensic-timeline dd{padding-top:5px}}
      @media(max-width:640px){.portal-left,.portal-right{grid-template-columns:1fr}.casebar{grid-template-columns:1fr!important}.case-tools{grid-template-columns:repeat(4,1fr)!important}.inventory-drawer{grid-template-columns:auto 1fr auto auto!important}.drawer-label{grid-column:1/-1}.fx-head{font-size:10px}.fx-head b{font-size:12px}.fx-note-box{font-size:12px}.fx-sheet h4{font-size:11px}.fx-facts dt,.fx-facts dd{font-size:11px}.replay-point{width:40px;height:40px}.rp-vent{left:56%;top:24%}.rp-latch{left:22%;top:51%}}
      @media(prefers-reduced-motion:reduce){.location-rail,.evidence-panel{transition:none!important}}
    `;
    document.head.appendChild(style);
  }

  function facts(rows){
    return `<div class="fx-sheet"><h4>复核记录</h4><dl class="fx-facts">${rows.map(([k,v])=>`<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("")}</dl></div>`;
  }

  function plate({title, tag, figure, side = "", note = ""}){
    return `<div class="forensic-view"><div class="fx-head"><b>${esc(title)}</b><span>${esc(tag || "")}</span></div><div class="fx-body"><div class="fx-figure-wrap">${figure}</div><div class="fx-side">${side}</div></div><div class="fx-note-box">${note}</div></div>`;
  }

  function genericItem(title, desc){
    return plate({
      title,
      tag: "物件可视化",
      figure: dossierFigure(title),
      side: `<div class="fx-sheet"><h4>观察</h4><p style="margin:0;font-size:12px;line-height:1.72">${esc(desc)}</p><div class="fx-chip-row"><span class="fx-chip">旧站风格</span><span class="fx-chip">可辨识实物</span><span class="fx-chip">非简笔图标</span></div></div>`,
      note: `${esc(title)} 的页面也统一做成图像化证物视图，避免出现只有说明文字或中央孤立小卡片的情况。`
    });
  }

  function dossierFigure(title){
    return `<svg class="fx-figure" viewBox="0 0 760 320" aria-hidden="true"><rect width="760" height="320" fill="#d9c8aa"/><rect x="56" y="38" width="420" height="248" rx="6" fill="#efe6d6" stroke="#8b7a62"/><rect x="495" y="52" width="205" height="216" rx="6" fill="#ebdfcb" stroke="#9c8b72"/><rect x="82" y="68" width="168" height="110" fill="#d4c2a4" stroke="#8b7a62"/><rect x="98" y="84" width="136" height="78" fill="#f1eadc" stroke="#85725b"/><circle cx="165" cy="123" r="28" fill="#b1a083"/><rect x="131" y="163" width="68" height="8" fill="#9d8b6d"/><text x="82" y="210" class="fx-call">${esc(title)}</text><text x="82" y="232" class="fx-call">旧档案视图 · 玩家可见实物与摆放位置</text><line x1="510" y1="96" x2="675" y2="96" class="fx-paperline"/><line x1="510" y1="132" x2="675" y2="132" class="fx-paperline"/><line x1="510" y1="168" x2="675" y2="168" class="fx-paperline"/><line x1="510" y1="204" x2="640" y2="204" class="fx-paperline"/><text x="510" y="78" class="fx-call">观察要点</text><circle cx="610" cy="250" r="36" fill="none" stroke="#ae6a5c" stroke-width="3"/><text x="584" y="255" class="fx-call" fill="#ae6a5c">Filed</text></svg>`;
  }

  function corpseFigure(){
    return `<svg class="fx-figure" viewBox="0 0 760 320" aria-hidden="true"><defs><marker id="fx-arr" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#7d433a"/></marker></defs><rect width="760" height="320" fill="#d3c09e"/><rect x="28" y="40" width="704" height="250" fill="#c7b18f" stroke="#8e7b63"/><g transform="translate(95 55)"><path d="M104 22c30 0 48 22 48 52 0 19-8 33-17 43l21 58-31 92H83l-31-92 21-58c-9-10-17-24-17-43 0-30 18-52 48-52z" fill="#baa79a" stroke="#5d5146" stroke-width="2"/><ellipse cx="104" cy="85" rx="40" ry="30" fill="#7b5662" opacity=".76"/><path d="M67 113h74l12 61-26 78H82l-26-78z" fill="#7b5662" opacity=".76"/><text x="6" y="290" class="fx-call">固定尸斑主要位于背侧</text></g><g transform="translate(466 72) rotate(86 70 95)" opacity=".58"><path d="M70 18c28 0 45 21 45 49 0 18-7 31-15 40l20 53-28 84H48l-28-84 20-53c-8-9-15-22-15-40 0-28 17-49 45-49z" fill="#baa79a" stroke="#5d5146" stroke-width="2"/></g><line x1="318" y1="156" x2="438" y2="156" stroke="#7d433a" stroke-width="3" marker-end="url(#fx-arr)"/><text x="316" y="136" class="fx-call">后来翻成俯卧</text></svg>`;
  }

  function latchFigure(){
    return `<svg class="fx-figure" viewBox="0 0 760 320" aria-hidden="true"><rect width="760" height="320" fill="#d2c2a7"/><rect x="28" y="32" width="704" height="256" fill="url(#wood)" stroke="#4a3526"/><defs><linearGradient id="wood" x1="0" x2="1"><stop offset="0" stop-color="#7a593d"/><stop offset="1" stop-color="#5f432f"/></linearGradient></defs><rect x="108" y="140" width="280" height="34" rx="4" fill="#72685f" stroke="#302923" stroke-width="3"/><rect x="356" y="125" width="58" height="66" fill="none" stroke="#575047" stroke-width="9"/><line x1="340" y1="162" x2="394" y2="154" stroke="#dce6e1" stroke-width="3"/><circle cx="310" cy="95" r="74" fill="#eadfcb" stroke="#99866f" stroke-width="8"/><rect x="258" y="70" width="104" height="50" fill="url(#micro)" stroke="#6d4f33"/><defs><linearGradient id="micro" x1="0" x2="1"><stop offset="0" stop-color="#78583a"/><stop offset="1" stop-color="#64472f"/></linearGradient></defs><line x1="272" y1="92" x2="346" y2="82" stroke="#dce6e1" stroke-width="2"/><text x="266" y="113" class="fx-call">透明纤维</text><path d="M409 150 C 466 139, 514 122, 554 96" class="fx-call-line"/><text x="560" y="94" class="fx-call">新磨痕位于受力方向</text></svg>`;
  }

  function windowFigure(){
    return `<svg class="fx-figure" viewBox="0 0 760 320" aria-hidden="true"><rect width="760" height="320" fill="#d8c5a8"/><rect x="94" y="42" width="334" height="236" fill="#564136" stroke="#3b2a1f" stroke-width="6"/><rect x="128" y="76" width="266" height="168" fill="#7d715e"/><g><rect x="118" y="94" width="286" height="26" transform="rotate(-8 118 94)" fill="#8b6645" stroke="#4d3928"/><rect x="118" y="142" width="286" height="26" transform="rotate(5 118 142)" fill="#8b6645" stroke="#4d3928"/><rect x="118" y="188" width="286" height="26" transform="rotate(-2 118 188)" fill="#8b6645" stroke="#4d3928"/></g><g fill="#604434"><circle cx="150" cy="108" r="7"/><circle cx="208" cy="99" r="7"/><circle cx="330" cy="159" r="7"/><circle cx="240" cy="198" r="7"/><circle cx="380" cy="205" r="7"/></g><circle cx="594" cy="148" r="86" fill="#eadfcb" stroke="#9d8a72" stroke-width="8"/><line x1="544" y1="148" x2="645" y2="148" stroke="#6f5e4a" stroke-width="2"/><text x="534" y="112" class="fx-call">放大检查</text><text x="534" y="136" class="fx-call">锈迹连续，无断裂口</text><text x="534" y="160" class="fx-call">若近期拔动，应见断口</text></svg>`;
  }

  function ventFigure(){
    return `<svg class="fx-figure" viewBox="0 0 760 320" aria-hidden="true"><rect width="760" height="320" fill="#d6c7ae"/><rect x="64" y="110" width="382" height="88" rx="44" fill="#2a2d2e" stroke="#7a7b76" stroke-width="24"/><path d="M440 92 h84 a34 34 0 0 1 34 34 v90" fill="none" stroke="#7a7b76" stroke-width="24"/><path d="M136 152 C 238 152, 352 155, 457 130 C 500 120, 523 126, 550 143" stroke="#dce4df" stroke-width="4" fill="none" stroke-dasharray="5 4"/><circle cx="551" cy="144" r="5" fill="#dce4df"/><path d="M352 144 C 424 144, 476 130, 526 110" class="fx-call-line"/><text x="534" y="108" class="fx-call">透明钓线卡在弯头内侧</text><text x="120" y="245" class="fx-call">人手无法通过，细线可以传力</text></svg>`;
  }

  function teaFigure(){
    return `<svg class="fx-figure" viewBox="0 0 760 320" aria-hidden="true"><rect width="760" height="320" fill="#d6c6ab"/><ellipse cx="204" cy="182" rx="118" ry="72" fill="#f2eadb" stroke="#ab9a7d" stroke-width="10"/><ellipse cx="204" cy="182" rx="94" ry="52" fill="#6f4e35"/><path d="M300 160 q40 18 0 42" fill="none" stroke="#f2eadb" stroke-width="14"/><path d="M181 209 q20 12 56 8" stroke="#b2a07c" stroke-width="8" fill="none" stroke-linecap="round"/><text x="152" y="249" class="fx-call">杯底可见沉淀</text><rect x="420" y="74" width="260" height="174" fill="#efe5d2" stroke="#968569"/><line x1="440" y1="128" x2="660" y2="128" stroke="#baa98b"/><line x1="440" y1="170" x2="660" y2="170" stroke="#baa98b"/><line x1="440" y1="212" x2="660" y2="212" stroke="#baa98b"/><text x="442" y="106" class="fx-call">杯底镇静剂</text><text x="610" y="106" class="fx-call" fill="#7d443b">阳性</text><text x="442" y="148" class="fx-call">胃内容物对应成分</text><text x="586" y="148" class="fx-call" fill="#52634b">未检出</text><text x="442" y="190" class="fx-call">可否证明服药</text><text x="603" y="190" class="fx-call" fill="#52634b">不能</text><text x="440" y="232" class="fx-call">结论：排除‘药物进入死亡过程’</text></svg>`;
  }

  function impactFigure(){
    return `<svg class="fx-figure" viewBox="0 0 760 320" aria-hidden="true"><rect width="760" height="320" fill="#d7c7ae"/><rect x="468" y="98" width="168" height="18" fill="#5f422e"/><rect x="468" y="116" width="168" height="24" fill="#3d2b1e"/><ellipse cx="218" cy="172" rx="86" ry="104" fill="#b8a69b" stroke="#5b4a3f" stroke-width="2" transform="rotate(12 218 172)"/><ellipse cx="242" cy="134" rx="26" ry="9" fill="#763c37" transform="rotate(-10 242 134)"/><line x1="278" y1="144" x2="546" y2="108" stroke="#7d433a" stroke-width="3" stroke-dasharray="7 5"/><text x="556" y="110" class="fx-call">伤口高度与桌角接近</text><text x="112" y="268" class="fx-call">伤口机制指向跌倒撞击</text><text x="112" y="288" class="fx-call">低温只影响时间判断，不改写伤口本身</text></svg>`;
  }

  function indentFigure(done){
    return `<svg class="fx-figure" viewBox="0 0 760 320" aria-hidden="true"><rect width="760" height="320" fill="#d7c5a7"/><rect x="112" y="46" width="540" height="228" transform="rotate(-2 382 160)" fill="#efe5d2" stroke="#9a876c"/><g stroke="#c6b495"><line x1="138" y1="104" x2="624" y2="104"/><line x1="138" y1="138" x2="624" y2="138"/><line x1="138" y1="172" x2="624" y2="172"/><line x1="138" y1="206" x2="624" y2="206"/></g><text x="148" y="130" font-size="24" fill="${done ? '#5b534a' : '#a79d90'}">${done ? '17—B …… 前五封已交；第六封未投递。' : '＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿'}</text><text x="148" y="168" font-size="24" fill="${done ? '#5b534a' : '#a79d90'}">${done ? '安娜·韦伯 …… ' : '＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿'}</text><rect x="90" y="250" width="164" height="22" fill="#6e6458" opacity="${done ? '.38' : '.14'}"/><text x="426" y="260" class="fx-call">${done ? '石墨已挂在凸起纤维上' : '斜侧光下先看见浅沟'}</text></svg>`;
  }

  function waxFigure(opened, warm){
    return `<svg class="fx-figure" viewBox="0 0 760 320" aria-hidden="true"><rect width="760" height="320" fill="#d6c6ab"/><rect x="116" y="58" width="524" height="208" transform="rotate(-4 378 162)" fill="#f0e5d3" stroke="#9b896d"/><circle cx="372" cy="154" r="54" fill="url(#sealGrad)" stroke="#5a241f" stroke-width="4" opacity="${opened ? '.28' : '1'}"/><defs><radialGradient id="sealGrad" cx="35%" cy="30%"><stop offset="0" stop-color="#b97260"/><stop offset="1" stop-color="#6b2f28"/></radialGradient></defs><circle cx="372" cy="154" r="28" fill="none" stroke="#d2a18f" opacity="${opened ? '.28' : '.72'}"/><text x="363" y="163" font-size="34" fill="#d2a18f" opacity="${opened ? '.28' : '.92'}">W</text><rect x="194" y="90" width="240" height="132" fill="none" stroke="#d7c8ad" stroke-dasharray="4 4" opacity="${opened ? '.35' : '.0'}"/>
      ${warm ? '<ellipse cx="278" cy="145" rx="120" ry="72" fill="#ca78494b"/><path d="M168 102 q30 24 20 58" stroke="#ca7849" stroke-width="4" fill="none"/><text x="150" y="90" class="fx-call">保持两指宽距离慢慢温热</text>' : ''}
      <text x="154" y="246" class="fx-call">${opened ? '封口已经软开，处方残页得以展开' : '旧火漆发脆，不能硬撬'}</text></svg>`;
  }

  function prescriptionFigure(){
    return `<svg class="fx-figure" viewBox="0 0 760 320" aria-hidden="true"><rect width="760" height="320" fill="#d7c6aa"/><rect x="132" y="42" width="492" height="236" fill="#efe4cf" stroke="#95846b"/><line x1="158" y1="90" x2="598" y2="90" stroke="#9a876d"/><line x1="158" y1="128" x2="598" y2="128" stroke="#c4b290"/><line x1="158" y1="164" x2="598" y2="164" stroke="#c4b290"/><line x1="158" y1="200" x2="598" y2="200" stroke="#c4b290"/><rect x="386" y="108" width="132" height="48" fill="#d9c8aa" opacity=".7"/><path d="M375 98 C 432 138, 452 160, 520 162" stroke="#cdbb9c" stroke-width="34" opacity=".56" fill="none"/><text x="164" y="116" class="fx-call">剂量</text><text x="322" y="116" class="fx-call">氯醛</text><text x="174" y="244" class="fx-call">水渍正穿过剂量栏，小数点位置难以独立确认</text></svg>`;
  }

  function reagentFigure(revealed){
    return `<svg class="fx-figure" viewBox="0 0 760 320" aria-hidden="true"><rect width="760" height="320" fill="#d8c6aa"/><rect x="116" y="46" width="526" height="230" fill="#efe6d5" stroke="#99876a"/><line x1="144" y1="108" x2="614" y2="108" stroke="#c7b79a"/><line x1="144" y1="144" x2="614" y2="144" stroke="#c7b79a"/><line x1="144" y1="180" x2="614" y2="180" stroke="#c7b79a"/><text x="150" y="132" font-size="23" fill="${revealed ? '#436270' : 'rgba(67,98,112,.17)'}">${revealed ? '剂量是 0.6，不是 6。安娜知道。——H' : '几乎透明的笔画浮在纸面上……'}</text><g transform="translate(564 76) rotate(24)"><rect x="0" y="0" width="12" height="118" rx="6" fill="#e4dbc9" stroke="#a79c8b"/><ellipse cx="6" cy="124" rx="16" ry="20" fill="#b7ab92"/></g><path d="M528 98 C 544 118, 548 144, 546 182" stroke="${revealed ? '#4f6774' : '#8ca2aa'}" stroke-width="3" opacity="${revealed ? '.94' : '.36'}" fill="none"/></svg>`;
  }

  function drawerFigure(){
    return `<svg class="fx-figure" viewBox="0 0 760 320" aria-hidden="true"><rect width="760" height="320" fill="#d7c7ab"/><rect x="126" y="72" width="508" height="184" fill="#76543a" stroke="#523927" stroke-width="8"/><rect x="160" y="108" width="440" height="112" fill="#4b3525"/><rect x="184" y="126" width="112" height="18" fill="#d6c29e" stroke="#9b8867"/><rect x="318" y="118" width="34" height="78" fill="#f0e6cf" stroke="#9b8867"/><rect x="372" y="138" width="92" height="52" fill="#6b4b32" stroke="#423022"/><rect x="480" y="118" width="96" height="66" fill="#efe4ce" stroke="#9c8a6f"/><text x="191" y="171" class="fx-call">木工铅笔</text><text x="306" y="214" class="fx-call">短蜡烛</text><text x="384" y="212" class="fx-call">黑面包</text><text x="492" y="212" class="fx-call">便笺</text></svg>`;
  }

  function tubePortFigure(){
    return `<svg class="fx-figure" viewBox="0 0 760 320" aria-hidden="true"><rect width="760" height="320" fill="#d6c6ab"/><rect x="92" y="72" width="178" height="178" rx="14" fill="#68492f" stroke="#4b3524" stroke-width="8"/><circle cx="181" cy="160" r="64" fill="#ae8a57" stroke="#6e522d" stroke-width="10"/><circle cx="181" cy="160" r="35" fill="#2a2d2c"/><rect x="348" y="88" width="286" height="146" fill="#efe4cf" stroke="#9c8a6f"/><text x="374" y="122" class="fx-call">维修标记</text><line x1="372" y1="142" x2="612" y2="142" stroke="#c7b79a"/><line x1="372" y1="174" x2="612" y2="174" stroke="#c7b79a"/><text x="376" y="164" class="fx-call">此型号设有隔夜延时档</text><text x="376" y="196" class="fx-call">需结合17日晚与18日晨判断</text></svg>`;
  }

  function labBenchFigure(){
    return `<svg class="fx-figure" viewBox="0 0 760 320" aria-hidden="true"><rect width="760" height="320" fill="#d7c6a9"/><rect x="48" y="182" width="664" height="72" fill="#6d4d34" stroke="#513a27" stroke-width="6"/><rect x="72" y="98" width="82" height="84" fill="#8aa0a4" stroke="#5f7074"/><rect x="182" y="106" width="72" height="76" fill="#dfe7e8" stroke="#8b9798"/><rect x="278" y="116" width="46" height="64" fill="#e7ddd0" stroke="#9f917c"/><rect x="350" y="82" width="92" height="100" fill="#f1e6d2" stroke="#9d8a6f"/><rect x="466" y="108" width="84" height="72" fill="#d2b791" stroke="#957c5b"/><rect x="580" y="92" width="66" height="88" fill="#8e6b45" stroke="#664a32"/><text x="82" y="200" class="fx-call">碘酒</text><text x="184" y="200" class="fx-call">清水</text><text x="268" y="200" class="fx-call">棉签</text><text x="356" y="200" class="fx-call">小模具</text><text x="474" y="200" class="fx-call">明胶</text><text x="566" y="200" class="fx-call">酒精灯</text></svg>`;
  }

  function reagentMixFigure(){
    return `<svg class="fx-figure" viewBox="0 0 760 320" aria-hidden="true"><rect width="760" height="320" fill="#d8c7ab"/><circle cx="238" cy="166" r="72" fill="#dfe7e8" stroke="#8a9599" stroke-width="8"/><rect x="206" y="96" width="64" height="34" fill="#7e4f36" stroke="#573523"/><text x="188" y="255" class="fx-call">碘酒 + 清水 = 可用显色液</text><circle cx="540" cy="166" r="72" fill="#c2c0a9" stroke="#8f8b74" stroke-width="8"/><rect x="505" y="120" width="70" height="52" fill="#485e84" opacity=".78"/><text x="474" y="255" class="fx-call">碘酒 + 面粉 = 深蓝浆糊</text><line x1="310" y1="166" x2="468" y2="166" stroke="#6e5b47" stroke-width="2" stroke-dasharray="5 5"/><text x="346" y="156" class="fx-call">不要把错误配方抹上证物</text></svg>`;
  }

  function gasketMakingFigure(){
    return `<svg class="fx-figure" viewBox="0 0 760 320" aria-hidden="true"><rect width="760" height="320" fill="#d7c7ab"/><circle cx="162" cy="162" r="44" fill="#ece5d2" stroke="#93826b" stroke-width="6"/><text x="126" y="235" class="fx-call">干明胶</text><path d="M210 162 H 288" stroke="#6a5a47" stroke-width="2" stroke-dasharray="5 5"/><circle cx="350" cy="162" r="52" fill="#d9d2bc" stroke="#93826b" stroke-width="6"/><path d="M316 164 q34 28 68 0" stroke="#c17746" stroke-width="6" fill="none"/><text x="304" y="235" class="fx-call">加水加热</text><path d="M404 162 H 494" stroke="#6a5a47" stroke-width="2" stroke-dasharray="5 5"/><circle cx="564" cy="162" r="52" fill="#eadfcb" stroke="#93826b" stroke-width="6"/><circle cx="564" cy="162" r="26" fill="none" stroke="#6d573f" stroke-width="10"/><text x="520" y="235" class="fx-call">入模冷却成圈</text></svg>`;
  }

  function gasketFigure(installed){
    return `<svg class="fx-figure" viewBox="0 0 760 320" aria-hidden="true"><rect width="760" height="320" fill="#d7c6ab"/><circle cx="260" cy="160" r="104" fill="#e9dfcc" stroke="#97866c" stroke-width="10"/><circle cx="260" cy="160" r="62" fill="none" stroke="#6e5640" stroke-width="16" stroke-dasharray="${installed ? 'none' : '250 36'}" stroke-linecap="round"/><text x="188" y="284" class="fx-call">${installed ? '明胶圈完整贴合' : '缺口导致无法建立压力'}</text><rect x="470" y="92" width="162" height="138" rx="12" fill="#74675b" stroke="#4a433d" stroke-width="8"/><circle cx="551" cy="161" r="48" fill="#a89164" stroke="#6f5730" stroke-width="10"/><circle cx="551" cy="161" r="18" fill="#272625"/></svg>`;
  }

  function valveFigure(){
    return `<svg class="fx-figure" viewBox="0 0 760 320" aria-hidden="true"><rect width="760" height="320" fill="#d8c7ab"/><circle cx="272" cy="160" r="114" fill="#7d6545" stroke="#5a432c" stroke-width="12"/><circle cx="272" cy="160" r="74" fill="#c2ae89" stroke="#765d3d" stroke-width="8"/><line x1="272" y1="160" x2="344" y2="110" stroke="#643d2b" stroke-width="8" stroke-linecap="round"/><text x="252" y="60" class="fx-call">立即</text><text x="392" y="126" class="fx-call">3h</text><text x="356" y="252" class="fx-call">6h</text><text x="168" y="274" class="fx-call">隔夜约12h</text><rect x="470" y="90" width="184" height="144" fill="#efe4cf" stroke="#9a886d"/><text x="490" y="128" class="fx-call">本案使用：隔夜档</text><text x="490" y="158" class="fx-call">跨过17日晚 → 18日清晨</text><text x="490" y="188" class="fx-call">不再与故事时间线冲突</text></svg>`;
  }

  function capsuleFigure(){
    return `<svg class="fx-figure" viewBox="0 0 760 320" aria-hidden="true"><defs><linearGradient id="capGrad" x1="0" x2="1"><stop offset="0" stop-color="#b18c58"/><stop offset=".5" stop-color="#6f502d"/><stop offset="1" stop-color="#b18c58"/></linearGradient></defs><rect width="760" height="320" fill="#d7c5a9"/><rect x="82" y="140" width="596" height="42" rx="21" fill="#8f7248" opacity=".7"/><rect x="142" y="124" width="164" height="74" rx="34" fill="url(#capGrad)" stroke="#573d23" stroke-width="3"/><text x="156" y="228" class="fx-call">胶囊内壁留有 11 / 17 蓝色邮戳油墨</text><line x1="358" y1="238" x2="626" y2="238" stroke="#7c6953" stroke-width="2"/><circle cx="400" cy="238" r="4" fill="#7c6953"/><circle cx="624" cy="238" r="4" fill="#7c6953"/><text x="378" y="224" class="fx-call">17日晚进入</text><text x="572" y="224" class="fx-call">18日晨落下</text></svg>`;
  }

  function coldFigure(kind){
    const extra = kind === "shelf"
      ? `<rect x="112" y="134" width="536" height="24" fill="#afb6b7" stroke="#6d7475"/><rect x="112" y="124" width="536" height="16" fill="#f3f4ef" opacity=".88"/><path d="M314 118 q40 12 92 14" stroke="#555c62" stroke-width="5" fill="none"/><text x="322" y="106" class="fx-call">制服羊毛纤维粘在霜面上</text>`
      : `<rect x="112" y="108" width="536" height="24" fill="#afb6b7" stroke="#6d7475" opacity=".35"/><line x1="168" y1="224" x2="612" y2="224" stroke="#837b6f" stroke-width="4"/><line x1="168" y1="254" x2="612" y2="254" stroke="#837b6f" stroke-width="4"/><text x="172" y="206" class="fx-call">两道平行拖痕由层板方向延伸到门外</text>`;
    return `<svg class="fx-figure" viewBox="0 0 760 320" aria-hidden="true"><rect width="760" height="320" fill="#d9d9cf"/><rect x="72" y="44" width="616" height="232" fill="#cbd3d4" stroke="#889191"/><rect x="84" y="58" width="592" height="204" fill="#dce4e5"/>${extra}<rect x="626" y="80" width="28" height="156" fill="#9aa2a2"/></svg>`;
  }

  function chartFigure(){
    return `<svg class="fx-figure" viewBox="0 0 760 320" aria-hidden="true"><rect width="760" height="320" fill="#d7c5a9"/><rect x="102" y="52" width="556" height="216" fill="#efe4cf" stroke="#99876a"/><g stroke="#9f8e74"><line x1="102" y1="98" x2="658" y2="98"/><line x1="102" y1="144" x2="658" y2="144"/><line x1="102" y1="190" x2="658" y2="190"/><line x1="198" y1="52" x2="198" y2="268"/><line x1="352" y1="52" x2="352" y2="268"/><line x1="506" y1="52" x2="506" y2="268"/></g><text x="128" y="86" class="fx-call">11/16</text><text x="128" y="132" class="fx-call">11/17</text><text x="128" y="178" class="fx-call">11/18</text><text x="230" y="86" class="fx-call">3°C</text><text x="386" y="86" class="fx-call">3°C</text><text x="540" y="86" class="fx-call">2°C</text><text x="230" y="132" class="fx-call">2°C</text><text x="386" y="132" font-size="30" fill="#5f4a39">2°C</text><text x="402" y="122" font-size="30" fill="#2e2319">1</text><text x="540" y="132" class="fx-call">2°C</text><text x="230" y="178" class="fx-call">2°C</text><rect x="98" y="52" width="564" height="216" fill="url(#scan)" opacity=".28"/><defs><linearGradient id="scan" x1="0" x2="1"><stop offset=".3" stop-color="transparent"/><stop offset=".52" stop-color="#fff7ca"/><stop offset=".7" stop-color="transparent"/></linearGradient></defs></svg>`;
  }

  function handwritingFigure(){
    return `<svg class="fx-figure" viewBox="0 0 760 320" aria-hidden="true"><rect width="760" height="320" fill="#d7c7ab"/><rect x="60" y="60" width="190" height="190" fill="#efe4cf" stroke="#98866b"/><rect x="286" y="60" width="190" height="190" fill="#efe4cf" stroke="#98866b"/><rect x="512" y="60" width="190" height="190" fill="#efe4cf" stroke="#98866b"/><text x="82" y="92" class="fx-call">今晨来信</text><text x="308" y="92" class="fx-call">温度表覆写</text><text x="534" y="92" class="fx-call">护士登记簿</text><text x="120" y="184" font-size="88" font-style="italic" fill="#42362d">h</text><text x="346" y="184" font-size="88" font-style="italic" fill="#42362d">h</text><text x="572" y="184" font-size="88" font-style="italic" fill="#42362d">h</text><path d="M154 161 q18 16 34 10" stroke="#8a443c" stroke-width="4" fill="none"/><path d="M380 161 q18 16 34 10" stroke="#8a443c" stroke-width="4" fill="none"/><path d="M606 161 q18 16 34 10" stroke="#8a443c" stroke-width="4" fill="none"/></svg>`;
  }

  function sixthLetterFigure(){
    return `<svg class="fx-figure" viewBox="0 0 760 320" aria-hidden="true"><rect width="760" height="320" fill="#d7c5a9"/><path d="M112 80 h220 l34 26 v132 h-254 z" fill="#5d4d42" stroke="#3f352f" stroke-width="4"/><path d="M188 120 h106 l76 58 v76 h-182 z" fill="#efe4cf" stroke="#9a886d"/><line x1="430" y1="94" x2="650" y2="94" stroke="#c1b091"/><line x1="430" y1="126" x2="650" y2="126" stroke="#c1b091"/><line x1="430" y1="158" x2="650" y2="158" stroke="#c1b091"/><text x="430" y="214" class="fx-call">发现位置：制服左胸内衬夹层</text><text x="430" y="236" class="fx-call">状态：无邮戳，从未真正寄出</text></svg>`;
  }

  function deductionBoard(title, promptText){
    const cards = {
      "死亡时间为什么会被误判？": [
        ["低温", "温度覆写 + 冷库接触痕迹"],
        ["结论", "低温干扰死亡时间判断，而非凭空消失24小时"]
      ],
      "门闩为什么能在空房间里落下？": [
        ["受力处", "门闩新磨痕"],
        ["传力物", "通风管钓线"]
      ],
      "今晨才落下的信，是怎么越过一夜的？": [
        ["时间", "投递胶囊跨过一夜"],
        ["书写者", "三份字迹共同特征"]
      ],
      "十九年前，玛戈真正看错了什么？": [
        ["受损原件", "旧处方水渍穿过剂量栏"],
        ["补充证据", "显色补注：0.6，不是6"]
      ],
      "谁把旧日的误解带进了今天的现场？": [
        ["今天的手", "今晨来信与覆写笔迹"],
        ["十九年前的执念", "安娜处方"]
      ],
      "那么，赫尔曼真正死于什么？": [
        ["真正伤口", "后枕撞击伤"],
        ["排除误导", "凉茶有药但死者未服"]
      ]
    };
    const data = cards[title] || [["证据关系", "先建立两件证物的关系"], ["提示", promptText || "再提交结论"]];
    return `<div class="forensic-view"><div class="fx-head"><b>关系板</b><span>先建立证物关系，再提交结论</span></div><div class="fx-body" style="grid-template-columns:1fr"><div class="fx-figure-wrap" style="padding:8px"><div class="fx-relation"><div class="fx-rel-card"><small>${esc(data[0][0])}</small><b>${esc(data[0][1])}</b><p>从证物中找出真正能够互相支撑的一对。</p></div><div class="fx-rel-card"><small>${esc(data[1][0])}</small><b>${esc(data[1][1])}</b><p>不是所有看上去相关的东西都能共同回答同一个问题。</p></div></div></div></div><div class="fx-note-box">${esc(promptText || "选择两件证物。")}</div></div>`;
  }

  function esc(s){
    return String(s || "").replace(/[&<>\"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]));
  }

  function evidenceRegistered(fragment){
    return [...document.querySelectorAll("#evidence-list .evidence-card")].some(card => card.textContent.includes(fragment));
  }

  function addReplayButton(title){
    if (!["内侧门闩", "通风管", "门闩线痕", "通风管钓线"].includes(title)) return;
    const actions = $("detail-actions");
    if (!actions || actions.querySelector("[data-forensic-replay]")) return;
    const hasPair = evidenceRegistered("门闩") && evidenceRegistered("通风管");
    const b = document.createElement("button");
    b.className = "ink-button forensic-action";
    b.dataset.forensicReplay = "1";
    b.textContent = localStorage.getItem(REPLAY_KEY) ? "再次重演门闩机关" : "重演门闩受力路径";
    b.disabled = !hasPair;
    b.title = hasPair ? "亲手验证钓线如何从通风管牵落内侧插销" : "先分别登记门闩磨痕与通风管钓线";
    b.addEventListener("click", openReplay);
    actions.appendChild(b);
    if (!hasPair){
      const n = document.createElement("div");
      n.className = "forensic-tip";
      n.textContent = "现场重演需要先登记“内侧门闩”和“通风管”两件证物。";
      actions.appendChild(n);
    }
  }

  function applyDetailVisual(){
    const modal = $("detail-modal");
    const titleEl = $("detail-title");
    const visual = $("detail-visual");
    const kicker = $("detail-kicker");
    const copy = $("detail-copy");
    if (!modal || !titleEl || !visual || modal.classList.contains("hidden")) return;

    const rawTitle = titleEl.textContent.trim();
    const title = aliasMap[rawTitle] || rawTitle;
    const key = `${rawTitle}::${kicker ? kicker.textContent.trim() : ""}::${copy ? copy.textContent.trim() : ""}`;

    if (kicker && kicker.textContent.includes("终局推理")) {
      visual.innerHTML = deductionBoard(rawTitle, copy ? copy.textContent.trim() : "");
      visual.dataset.fxKey = key;
    } else {
      const maker = visuals[title];
      if (maker) {
        visual.innerHTML = maker();
        visual.dataset.fxKey = key;
      } else if (!visual.dataset.fxKey || visual.dataset.fxKey !== key || visual.querySelector(".specimen-card,.relation-plate") || !visual.textContent.trim()) {
        visual.innerHTML = genericItem(rawTitle, copy ? copy.textContent.trim() : "这是一页旧案卷中的物件或记录。它现在也采用图像化方式显示。");
        visual.dataset.fxKey = key;
      }
    }

    repairCaseLogic(rawTitle);
    patchDeduction(rawTitle);
    addReplayButton(rawTitle);
  }

  function patchDeduction(title){
    const copy = $("detail-copy");
    const actions = $("detail-actions");
    if (!copy || !actions) return;
    if ((title === "死亡时间为什么会被误判？" || title === "尸体少掉的那一天去了哪里？") && !copy.querySelector(".deduction-audit")) {
      const feed = $("deduction-feedback");
      if (feed) {
        const d = document.createElement("div");
        d.className = "deduction-audit";
        d.textContent = "复核原则：这组证据证明‘低温接触导致死亡时间判断失真’，不把冷库存放时长写成证据没有直接支持的24小时。";
        copy.appendChild(d);
      }
    }
    if ((title === "门闩为什么能在空房间里落下？") && !copy.querySelector(".deduction-audit")) {
      const d = document.createElement("div");
      const done = !!localStorage.getItem(REPLAY_KEY);
      d.className = `deduction-audit ${done ? "" : "pending"}`;
      d.textContent = done ? "现场重演：钓线—弯头—插销的受力路径已亲手验证。" : "可选强化：先在门闩或通风管证物页完成一次现场重演，再提交机关结论。";
      copy.appendChild(d);
      if (!done && !actions.querySelector("[data-forensic-replay]")) {
        const b = document.createElement("button");
        b.className = "ink-button forensic-action";
        b.dataset.forensicReplay = "1";
        b.textContent = "先重演门闩机关";
        b.onclick = openReplay;
        actions.prepend(b);
      }
    }
  }

  function repairCaseLogic(title){
    const copy = $("detail-copy");
    const actions = $("detail-actions");
    if (!copy || !actions) return;
    if (title === "延时阀") {
      const revised = "四个刻度分别对应立即、三小时、六小时与隔夜约十二小时。胶囊带着前一日晚间的邮戳油墨，却在18日清晨落下；需要选择能跨过这一夜、又不与昨晚争执时间冲突的档位。";
      if (copy.innerHTML !== revised) copy.innerHTML = revised;
      [...actions.querySelectorAll("button")].forEach((b) => {
        const map = {"6 小时":"3 小时","12 小时":"6 小时","24 小时":"12 小时 · 隔夜档"};
        if (map[b.textContent.trim()]) b.textContent = map[b.textContent.trim()];
      });
    }
    if (title === "石地与头部") {
      const revised = "后枕只有一处主要撞击伤，高度接近桌角。四肢僵硬和表面变化与07:40报案推算不一致，但低温会明显干扰这些现象；因此这里只能确认死亡时间被低温伪装，不能仅凭尸体现象把偏差精确成整整一天。";
      if (copy.innerHTML !== revised) copy.innerHTML = revised;
    }
    if (title === "气动管投递口") {
      const revised = "黄铜胶囊从这里落下。维修标记显示，这一型号具有用于隔夜投递的延时档；本案需要结合17日晚间与18日清晨的时间窗判断具体档位。";
      if (copy.innerHTML !== revised) copy.innerHTML = revised;
    }
  }

  function repairVisibleText(root = document.body){
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let node;
    while ((node = walker.nextNode())) nodes.push(node);
    nodes.forEach((n) => {
      const raw = n.nodeValue;
      const trimmed = raw.trim();
      if (exactReplacements.has(trimmed)) {
        n.nodeValue = raw.replace(trimmed, exactReplacements.get(trimmed));
      } else {
        let out = raw;
        out = out.replace(/偏差接近一天。/g, "存在明显偏差，但无法仅凭尸体现象精确到小时。");
        out = out.replace(/阀门最多可滞留二十四小时/g, "阀门设有用于隔夜投递的延时档");
        out = out.replace(/二十四小时档/g, "隔夜档（约十二小时）");
        out = out.replace(/24小时档/g, "隔夜档（约12小时）");
        out = out.replace(/滞留24小时/g, "滞留约12小时");
        if (out !== raw) n.nodeValue = out;
      }
    });
  }

  function normalizeSave(){
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return;
      const s = JSON.parse(raw);
      if (!s || typeof s !== "object") return;
      let dirty = false;
      if (s.version !== 5) { s.version = 5; dirty = true; }
      if (s.supportTriggered && !s.flags?.letterB) { s.supportTriggered = false; dirty = true; }
      if (dirty) localStorage.setItem(SAVE_KEY, JSON.stringify(s));
    } catch (_) {}
  }

  function ensureColdPin(){
    const stage = $("stage");
    const scene = $("scene-name");
    if (!stage || !scene) return;
    let pin = stage.querySelector(".forensic-scene-pin");
    const isCold = scene.textContent.includes("冷藏库") || scene.textContent.includes("冷库");
    if (!isCold) { if (pin) pin.remove(); return; }
    if (pin) return;
    pin = document.createElement("button");
    pin.className = "forensic-scene-pin";
    pin.innerHTML = '复核时间窗<small>边注 · 不计入证物</small>';
    pin.onclick = openColdAudit;
    stage.appendChild(pin);
  }

  function createOverlay(){
    if ($("forensic-overlay")) return $("forensic-overlay");
    const o = document.createElement("section");
    o.id = "forensic-overlay";
    o.className = "forensic-overlay";
    o.hidden = true;
    o.setAttribute("role", "dialog");
    o.setAttribute("aria-modal", "true");
    o.innerHTML = '<div class="forensic-window" id="forensic-window"></div>';
    document.body.appendChild(o);
    o.addEventListener("click", (e) => { if (e.target === o) closeOverlay(); });
    return o;
  }

  function closeOverlay(){
    const o = $("forensic-overlay");
    if (o) o.hidden = true;
  }

  function openColdAudit(){
    const o = createOverlay(), w = $("forensic-window");
    w.innerHTML = `<button class="forensic-close" aria-label="关闭">×</button><p class="kicker">17—B · 时间逻辑复核边注</p><h2>冷库能证明什么，不能证明什么</h2><p class="lead">原记录能直接证明的是：冷库在11月17日实际约2°C，死者制服与层板接触，并有向门外延伸的拖痕。它足以解释为什么尸体现象让死亡时间显得更近，但不能独立推出“整整24小时”。</p><dl class="forensic-timeline"><dt>11月17日 18:12</dt><dd>玛戈购买两人份早餐。该生活记录只限定“当晚仍有共同早餐计划”，不作为尸体进入冷库的物证。</dd><dt>11月17日晚间</dt><dd>争执发生，赫尔曼后退撞上桌角。随后尸体被短时移入2°C冷库，低温干扰尸僵与表面变化。</dd><dt>隔夜时间窗</dt><dd>气动胶囊使用约12小时的隔夜档，让前一日晚间进入管线的胶囊在18日清晨落下。</dd><dt>11月18日 07:40</dt><dd>艾达进入案卷时间。此时能够确认“低温接触 + 隔夜延时”，而不是虚构一个与故事时间冲突的24小时空档。</dd></dl><div class="logic-fix"><b>修正后的结论：</b>尸体曾被移入2°C冷库，低温干扰了死亡时间判断；延时胶囊跨过一夜。两条时间机制各自有证据，不再强行写成同一个“24小时”。</div>`;
    w.querySelector(".forensic-close").onclick = closeOverlay;
    o.hidden = false;
  }

  function openReplay(){
    const o = createOverlay(), w = $("forensic-window");
    w.innerHTML = `<button class="forensic-close" aria-label="关闭">×</button><p class="kicker">17—B · 机关现场重演</p><h2>让空房间里的门闩自己落下</h2><p class="lead">按证物实际位置重走一遍：先确认钓线能够进入通风弯头，再把另一端挂到插销受力点，最后从门外缓慢拉紧。只有三步都成立，密室机关才算被亲手验证。</p><div class="replay-stage" id="replay-stage"><svg class="replay-figure" viewBox="0 0 1200 560" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><defs><linearGradient id="rpDoor" x1="0" x2="1"><stop offset="0" stop-color="#755239"/><stop offset="1" stop-color="#5e412d"/></linearGradient><linearGradient id="rpWall" x1="0" x2="1"><stop offset="0" stop-color="#2a2f2f"/><stop offset="1" stop-color="#202525"/></linearGradient><linearGradient id="rpBolt" x1="0" x2="1"><stop offset="0" stop-color="#8c8477"/><stop offset="1" stop-color="#4f4943"/></linearGradient></defs><rect width="1200" height="560" fill="#d8c7aa"/><rect x="0" y="0" width="318" height="560" fill="url(#rpDoor)"/><rect x="318" y="0" width="396" height="560" fill="url(#rpWall)"/><rect x="714" y="0" width="486" height="560" fill="url(#rpDoor)" opacity=".96"/><rect x="444" y="102" width="300" height="164" rx="72" fill="#26292b" stroke="#777772" stroke-width="30"/><path d="M732 96 h106 a42 42 0 0 1 42 42 v106" fill="none" stroke="#777772" stroke-width="30"/><rect x="94" y="250" width="148" height="40" fill="url(#rpBolt)" stroke="#26211d" stroke-width="4" id="replay-bolt-shape"/><rect x="198" y="232" width="74" height="84" fill="none" stroke="#4f4942" stroke-width="12"/><path id="replay-path" d="M 630 182 C 574 226, 492 256, 268 262" fill="none" stroke="rgba(225,236,231,.2)" stroke-width="6" stroke-dasharray="11 8"/><circle cx="630" cy="182" r="6" fill="#f0eadc" opacity=".85"/><circle cx="268" cy="262" r="6" fill="#f0eadc" opacity=".85"/><path d="M 268 262 C 302 250, 328 238, 360 216" stroke="#d9e3df" stroke-width="2" stroke-dasharray="4 4" fill="none" opacity=".45"/><text x="830" y="160" style="font:12px Arial,sans-serif;fill:#f4ece0">弯头里残留透明钓线</text><text x="102" y="338" style="font:12px Arial,sans-serif;fill:#f4ece0">插销会沿新磨痕方向横移</text></svg><button class="replay-point rp-vent" data-step="vent" aria-label="把钓线送入通风弯头">1</button><button class="replay-point rp-latch" data-step="latch" aria-label="把钓线挂到门闩受力点">2</button></div><div class="replay-controls"><label>3 · 从门外缓慢拉紧钓线<br/><input id="replay-pull" type="range" min="0" max="100" value="0" disabled/></label><b id="replay-pull-value">0%</b></div><div class="replay-status" id="replay-status">第一步：点击通风弯头，把透明钓线送进去。</div>`;

    w.querySelector(".forensic-close").onclick = closeOverlay;
    const stage = $("replay-stage");
    const status = $("replay-status");
    const range = $("replay-pull");
    const value = $("replay-pull-value");
    const path = $("replay-path");
    const vent = w.querySelector('[data-step="vent"]');
    const latch = w.querySelector('[data-step="latch"]');
    const boltShape = $("replay-bolt-shape");
    let step = 0;

    vent.onclick = () => {
      if (step !== 0) return;
      step = 1;
      vent.classList.add("done");
      latch.classList.add("active");
      path.setAttribute("stroke", "rgba(225,236,231,.85)");
      status.textContent = "第二步：把钓线另一端挂到门闩插销的受力处。";
    };
    latch.onclick = () => {
      if (step !== 1) return;
      step = 2;
      latch.classList.remove("active");
      latch.classList.add("done");
      range.disabled = false;
      status.textContent = "第三步：从门外拉紧。观察插销是否沿磨痕方向移动并落入扣孔。";
    };
    range.oninput = () => {
      const v = Number(range.value);
      value.textContent = `${v}%`;
      boltShape.setAttribute("x", String(94 + Math.min(60, v * 0.6)));
      if (v >= 88 && step === 2) {
        step = 3;
        localStorage.setItem(REPLAY_KEY, "1");
        status.className = "replay-status success";
        status.innerHTML = "<b>受力路径成立。</b> 钓线从通风弯头传力，插销沿新磨痕方向移动并落入扣孔。密室不需要第二个人留在房内。";
        range.disabled = true;
        repairVisibleText();
        setTimeout(applyDetailVisual, 20);
      }
    };
    o.hidden = false;
  }

  function postMutation(){
    repairVisibleText();
    applyDetailVisual();
    ensureColdPin();
    normalizeSave();
  }

  let queued = false;
  const observer = new MutationObserver(() => {
    if (queued) return;
    queued = true;
    queueMicrotask(() => { queued = false; postMutation(); });
  });
  observer.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ["class"] });

  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !$("forensic-overlay")?.hidden) closeOverlay(); });
  document.addEventListener("click", () => setTimeout(normalizeSave, 0), true);
  window.addEventListener("beforeunload", normalizeSave);
  window.addEventListener("pageshow", postMutation);

  postMutation();
})();
