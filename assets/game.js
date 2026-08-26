(() => {
  "use strict";

  const SAVE_KEY = "dead-letter-room-save-v3";
  const LEGACY_SAVE_KEYS = ["dead-letter-room-save-v2", "dead-letter-room-save-v1"];
  const SUPPORT_SEEN = "dead-letter-room-support-seen";
  const SUPPORT_PAID = "dead-letter-room-support-paid";

  const chapters = {
    1: { kicker: "第一章", title: "滞留", objective: "邮政局长究竟死于何时？", target: 6 },
    2: { kicker: "第二章", title: "三封信", objective: "让三封无法阅读的信重新开口。", target: 3 },
    3: { kicker: "第三章", title: "少掉的一天", objective: "谁从尸体上偷走了二十四小时？", target: 4 },
    4: { kicker: "第四章", title: "无法投递", objective: "用六组证据关系重建11月17日的最后一小时。", target: 6 }
  };

  const storySequences = {
    opening:{
      register:"WEISSBURG POSTAL DISTRICT · 18 NOV 1927", folio:"INTERLUDE 01", kicker:"案卷间页 · 07:40", heading:"雾停在门外", button:"进入死信室", theme:"low",
      lines:[
        "雾在魏瑟堡的石阶上停了一夜，清晨七点四十分还没有散。",
        "邮局地下一层，一扇从内侧闩住的门后，赫尔曼·福格尔倒在成堆的死信旁。",
        "十九年前，他从一场漫长的等待里接过一个没有等到母亲的女孩；十九年后，她站在门外，第一次不知道该叫他“局长”还是“父亲”。",
        "艾达·克莱因把手套收进大衣口袋。她没有先问谁最可疑，只问这间房最后一次说真话，是什么时候。"
      ]
    },
    chapter1:{
      register:"CASE 17—B · FIELD NOTE", folio:"INTERLUDE 02", kicker:"第一章之后 · 地下楼梯", heading:"三只没有邮戳的信封", button:"去局长办公室", theme:"paper",
      lines:[
        "地下室的潮气黏在袖口。六件证物已经装进纸袋，却没有一件肯替任何人说出结论。",
        "玛戈在楼梯口等着。她没有问尸体，只问书桌上那本《雪落以前》有没有被翻动。",
        "“他昨晚念到一半。”她说，“念到那个孩子还在等一封信。”",
        "办公室磨砂玻璃后，三只没有邮戳的信封并排躺着。像三句话，被同一个人咽回去太久。"
      ]
    },
    chapter2:{
      register:"PRIVATE MAIL · INDEX 17—B", folio:"INTERLUDE 03", kicker:"第二章之后 · 局长办公室", heading:"墙里的呼吸", button:"去气动管控制室", theme:"glass",
      lines:[
        "三封信一封比一封更像是写给过去。显出来的名字，都指向十九年前的安娜·韦伯。",
        "玛戈把那张旧处方翻过来，又翻回去。她的拇指始终压着那块被水吃掉的小数点。",
        "这时，办公室墙里的气动管忽然一震。一只黄铜胶囊迟到了整整一个清晨。",
        "维克托把它放到桌边，没有拆信，只低声说：“这管子昨晚就在漏气。有人比我们更早知道它会迟到。”"
      ]
    },
    chapter3:{
      register:"COLD VAULT · TEMPERATURE LOG", folio:"INTERLUDE 04", kicker:"第三章之后 · 冷库门口", heading:"别替我回答", button:"开始重建案情", theme:"cold",
      lines:[
        "冷库的霜在鞋底下发出很轻的碎响。新墨、旧墨、羊毛纤维和一条迟到的邮路，终于落在同一天上。",
        "玛戈站在门外，没有进来。她盯着温度表上的数字，像盯着一个迟早会被叫到的名字。",
        "“你想问什么就问。”她说。停了一会儿，又补上一句：“但别替我回答。”",
        "艾达合上调查簿。现在需要的不是更多证物，而是让已经找到的证物彼此作证。"
      ]
    }
  };
  const storyTransitions = {
    opening:{chapter:1,scene:"deadroom",minutes:0},
    chapter1:{chapter:2,scene:"office",minutes:25},
    chapter2:{chapter:3,scene:"tube",minutes:25},
    chapter3:{chapter:4,scene:"finale",minutes:25}
  };

  const novelPages = {
    1:{title:"雨里的孩子",copy:`<p>小站整夜下雨。女孩坐在第六站台，脚上的雨靴大了一码。每趟车停下，她都问检票员：母亲是不是坐在下一趟车上。</p><p>最后一趟车走后，一个穿邮政制服的男人把伞放到她头上。他没有说母亲不会回来，只说：『先回家。明天也可以等。』</p>`},
    2:{title:"每年一封",copy:`<p>往后的五年，女孩生日都收到一封信。信里不写大道理，只写母亲窗前的雪、厨房里烧焦的牛奶，以及她总把左脚鞋带系得更紧。</p><p>女孩因此相信，远方有人仍记得她。邮局长每次把信交给她，都把邮戳朝下。他说油墨会弄脏手。</p>`},
    3:{title:"零点六克",copy:`<p>故事里有一位沉默的医生。他每次称药，都要把小数点描两遍。女孩记住的却不是他的脸，而是母亲床头那张被水打湿的处方。</p><p>页边后来多了一行陌生字迹：一个小点，有时只隔着一支笔尖；有时却能隔开药与罪。</p>`},
    4:{title:"改姓的人",copy:`<p>女孩长大后改了姓。她说这只是登记员写错了，男人没有纠正。</p><p>有一年，她问：『你替一个死人送了这么多年信，不累吗？』男人答：『邮差不替死人送信。只替还在等的人。』</p><p>她没有听懂。那天以后，两个人都不再提母亲。</p>`},
    5:{title:"雪落以前",copy:`<p>最后一页原本夹在冷库温度表后。页脚沾着两种墨：一层已经褪成褐色，一层刚写不久。</p><p>故事写到女孩推开地下室的门。男人手里握着第六封信。他们都以为下一句话还有时间说。</p><p class="missing">此处缺失三行。此处缺失三行。此处缺失三行。</p>`},
    6:{title:"收件人",copy:`<p>这不是小说的结尾。安娜只写了前五页。第六页的笔迹属于赫尔曼。</p><p>它被缝在制服内衬里，封口从未沾过邮戳。寄信人离收件人只有一扇门，却仍然没能把它送到。</p>`}
  };

  const sceneData = {
    exterior: {
      name: "魏瑟堡邮局", sub: "雾中的石阶", image: "assets/images/exterior.webp", chapter: 1,
      hotspots: [
        { id: "cat", x: 67, y: 52, w: 14, h: 33, title: "橘猫", action: "cat" },
        { id: "car", x: 13, y: 54, w: 25, h: 30, title: "抛锚汽车", text: "散热器已经凉透。车主昨夜把它推到路边，雾水在引擎盖上结了一层细珠。" },
        { id: "fishpack", x: 15, y: 70, w: 14, h: 12, title: "油纸包", action: "take", item: "fish", copy: "汽车后座掉下一小包熏鱼，油纸边角已经被猫抓破。", fromChapter: 1 },
        { id: "milk", x: 76, y: 42, w: 8, h: 18, title: "门房牛奶瓶", action: "take", item: "milk", copy: "门房窗台上搁着今晨送来的小瓶牛奶，瓶口还封着蜡纸。", fromChapter: 2 },
        { id: "doorway", x: 58, y: 27, w: 22, h: 44, title: "邮局大门", text: "门半开着。雾沿石阶爬进门厅，像一封没有收件人的信。" }
      ]
    },
    deadroom: {
      name: "死信室", sub: "地下室 · 案发现场", image: "assets/images/deadroom.webp", chapter: 1,
      hotspots: [
        { id: "corpse", x: 29, y: 48, w: 36, h: 43, title: "赫尔曼的尸体", action: "clue", clue: "c_lividity", glyph: "♙", copy: "面部朝下，但尸斑集中在背侧。死亡后的很长时间里，他并不是这样趴着。", knowledge: "尸斑一旦固定，不会随着尸体后来翻转而完全改变。" },
        { id: "door", x: 0, y: 19, w: 19, h: 66, title: "内侧门闩", action: "clue", clue: "c_latch", glyph: "▰", copy: "插销确实落在内侧。木孔边缘有一道不足一毫米宽的新磨痕，里面嵌着透明纤维。" },
        { id: "window", x: 22, y: 0, w: 28, h: 34, title: "钉死的高窗", action: "clue", clue: "c_window", glyph: "▦", copy: "木板从室内钉死，钉头锈迹连续。若近期拔动，锈层和木纤维都应该留下断口。" },
        { id: "vent", x: 58, y: 0, w: 31, h: 34, title: "通风管", action: "clue", clue: "c_vent", glyph: "⌁", copy: "管径只够通过气流。弯头里却挂着一小段透明钓线。" },
        { id: "tea", x: 58, y: 34, w: 17, h: 18, title: "凉茶", action: "clue", clue: "c_tea", glyph: "♨", copy: "茶早已凉透，杯底有少量镇静剂沉淀。但死者胃里没有对应成分。" },
        { id: "floor", x: 37, y: 71, w: 33, h: 26, title: "石地与头部", action: "clue", clue: "c_rigor", glyph: "✢", copy: "后枕只有一处主要撞击伤，高度接近桌角。四肢僵硬和表面变化与七点报案推算并不一致，偏差接近一天。", knowledge: "低温会显著延缓尸僵消退和腐败，让死亡时间看起来更近。" }
      ]
    },
    office: {
      name: "局长办公室", sub: "三封无人投递的信", image: "assets/images/office.webp", chapter: 2,
      hotspots: [
        { id: "letterA", x: 19, y: 48, w: 23, h: 31, title: "信 A · 空白压痕", action: "letterA" },
        { id: "letterB", x: 41, y: 46, w: 22, h: 34, title: "信 B · 火漆封面", action: "letterB" },
        { id: "letterC", x: 61, y: 47, w: 22, h: 32, title: "信 C · 蓝边纸", action: "letterC" },
        { id: "drawer", x: 48, y: 76, w: 31, h: 23, title: "半开的抽屉", action: "drawer" },
        { id: "tube-port", x: 66, y: 15, w: 17, h: 27, title: "气动管投递口", text: "黄铜胶囊从这里落下。管壁贴着一张维修标记：阀门最多可滞留二十四小时。" },
        { id: "radio", x: 0, y: 14, w: 19, h: 31, title: "短波收音机", action: "radio" },
        { id: "letters", x: 13, y: 14, w: 44, h: 29, title: "死信柜", action: "deadletters" },
        { id: "suitcase", x: 76, y: 74, w: 23, h: 24, title: "维克托的手提箱", action: "suitcase" }
      ]
    },
    lab: {
      name: "配药储物间", sub: "旧邮局的小化验台", image: "assets/images/lab.webp", chapter: 2,
      hotspots: [
        { id: "iodine", x: 5, y: 39, w: 16, h: 38, title: "碘酒与滴管", action: "take", item: "iodine", glyph: "⚗", copy: "取得碘酒。直接滴在纸上会染成一片褐色，必须稀释。" },
        { id: "water", x: 21, y: 38, w: 15, h: 39, title: "清水", action: "take", item: "water", glyph: "◒", copy: "取得一小杯清水。" },
        { id: "swab", x: 37, y: 45, w: 12, h: 28, title: "棉签", action: "take", item: "swab", glyph: "—", copy: "取得棉签。它能让显色液均匀覆盖纸面。" },
        { id: "flour", x: 48, y: 36, w: 15, h: 43, title: "面粉罐", action: "take", item: "flour", glyph: "◉", copy: "一罐普通面粉。也含淀粉，但把它倒进信里只会毁掉证据。" },
        { id: "gelatin", x: 63, y: 39, w: 15, h: 39, title: "明胶片", action: "take", item: "gelatin", glyph: "▱", copy: "取得干明胶片。加水加热后可以重新塑形。" },
        { id: "heat", x: 76, y: 41, w: 18, h: 37, title: "酒精灯", action: "take", item: "burner", glyph: "♨", copy: "点燃酒精灯。火焰很稳，既能温热火漆，也能溶化明胶。" },
        { id: "bench", x: 16, y: 73, w: 67, h: 25, title: "实验台", action: "experiment" },
        { id: "medical", x: 83, y: 10, w: 16, h: 28, title: "旧法医学手册", action: "medical" }
      ]
    },
    tube: {
      name: "气动管控制室", sub: "延时阀与破损密封圈", image: "assets/images/tube.webp", chapter: 3,
      hotspots: [
        { id: "gasket", x: 5, y: 60, w: 21, h: 30, title: "破损垫圈", action: "gasket" },
        { id: "valve", x: 32, y: 25, w: 36, h: 48, title: "延时阀", action: "valve" },
        { id: "capsule", x: 67, y: 59, w: 24, h: 28, title: "投递胶囊", action: "clue", clue: "c_capsule", copy: "胶囊内壁沾有11月17日的蓝色邮戳油墨，而它直到18日清晨才从管口落下。" }
      ]
    },
    cold: {
      name: "邮票冷藏库", sub: "地下二层 · 温度 2°C", image: "assets/images/cold-vault.webp", chapter: 3,
      hotspots: [
        { id: "shelf", x: 26, y: 24, w: 48, h: 35, title: "空置长层板", action: "clue", clue: "c_shelf", copy: "这一格被清空得过分彻底。霜面粘着与死者制服相同的深灰羊毛纤维。" },
        { id: "drag", x: 26, y: 65, w: 49, h: 28, title: "地面拖痕", action: "clue", clue: "c_drag", copy: "两道平行拖痕从长层板延伸到门外，间距与死者肩部宽度相近。" },
        { id: "chart", x: 70, y: 24, w: 24, h: 32, title: "温度记录表", action: "chart" }
      ]
    },
    finale: {
      name: "死信室", sub: "最后陈述", image: "assets/images/deadroom.webp", chapter: 4,
      hotspots: [
        { id: "deduction", x: 32, y: 33, w: 46, h: 55, title: "重建案情", action: "deduction" }
      ]
    }
  };

  const evidenceData = {
    c_lividity:{name:"背侧尸斑",kind:"尸体记录",copy:"死者被发现时面朝下，尸斑却主要固定在背侧。姿势与尸斑形成时的体位并不一致。"},
    c_latch:{name:"门闩线痕",kind:"门窗痕迹",copy:"内侧插销已经落下，木孔边缘却有一道极细的新鲜磨痕，宽度接近透明钓线。"},
    c_window:{name:"钉死高窗",kind:"门窗痕迹",copy:"木板从室内钉死，锈蚀连续，没有近期拔钉或重新固定的迹象。"},
    c_vent:{name:"通风管钓线",kind:"纤维与线材",copy:"通风管弯头挂着一小截透明钓线，断口新鲜，线身有轻微木屑。"},
    c_tea:{name:"镇静剂凉茶",kind:"杯中残留",copy:"杯底检出少量镇静剂沉淀，但死者胃内容物没有对应成分。杯中残留与体内检验彼此不一致。"},
    c_rigor:{name:"后枕伤与尸僵",kind:"尸体记录",copy:"后枕裂伤形态与桌角高度相符；四肢僵硬与表面腐败程度，却比报案时间应有的状态更早。"},
    e_letterA:{name:"压痕信 · 17—B",kind:"纸张压痕",copy:"石墨显出上一张纸留下的字：『安娜·韦伯，17—B。前五封已交；第六封未投递。』"},
    e_letterB:{name:"安娜的氯醛处方",kind:"旧医疗纸片",copy:"水渍正好经过剂量栏，小数点位置已经模糊；其余笔画仍能辨认。"},
    e_letterC:{name:"淀粉墨 · 0.6 克",kind:"隐写字迹",copy:"碘液显出的补注写着：『剂量是零点六，不是六。安娜知道。——H』"},
    c_capsule:{name:"隔夜邮戳胶囊",kind:"气动管部件",copy:"胶囊内壁有11月17日蓝色邮戳油墨，而胶囊直到18日清晨才落到办公室。"},
    c_shelf:{name:"冷库层板纤维",kind:"冷库痕迹",copy:"空层板霜面粘着深灰羊毛纤维，与死者制服材质相同。"},
    c_drag:{name:"冷库平行拖痕",kind:"冷库痕迹",copy:"拖痕从层板延伸到门外，间距与死者肩部宽度相近。"},
    c_chart:{name:"温度表覆写",kind:"记录纸张",copy:"11月17日的『12°C』中，数字1使用了更新的墨。轻擦后可见原记录为『2°C』。"},
    c_hand:{name:"三处 h 的同形收笔",kind:"笔迹比对",copy:"今晨来信、温度表覆写和玛戈登记簿中的小写 h，都在末端留下相同的向左回钩。"},
    c_sixth:{name:"制服内衬里的第六封信",kind:"私人信件",copy:"信封没有邮戳，缝在赫尔曼制服内衬。它从未离开过寄信人身边。"}
  };
  const evidenceNames = Object.fromEntries(Object.entries(evidenceData).map(([id,v])=>[id,v.name]));
  const itemData = {
    pencil:{name:"扁平木工铅笔",kind:"书写工具",copy:"铅芯很软，侧锋适合把纸面压痕显出来。"},
    candle:{name:"短蜡烛",kind:"低温热源",copy:"燃烧并不稳定，但隔开距离后足以慢慢软化旧火漆。"},
    iodine:{name:"碘酒",kind:"显色试剂",copy:"颜色很深，直接接触纸面会遮住细笔画。"},
    water:{name:"清水",kind:"实验材料",copy:"一小杯清水，可以用来稀释试剂，也能让干明胶吸水。"},
    swab:{name:"棉签",kind:"实验工具",copy:"棉头能控制液体经过的位置，减少对旧纸的污染。"},
    flour:{name:"面粉",kind:"实验材料",copy:"普通面粉含淀粉。它能验证碘的反应，却不适合直接倒在证物上。"},
    gelatin:{name:"干明胶片",kind:"维修材料",copy:"吸水并受热后会软化，冷却后重新凝固。"},
    burner:{name:"酒精灯",kind:"稳定热源",copy:"火焰稳定，适合需要持续、可控加热的实验。"},
    diluted:{name:"稀释碘液",kind:"显色试剂",copy:"颜色已经降到足以观察纸面细线的程度。"},
    gasket:{name:"明胶密封圈",kind:"临时维修件",copy:"按旧垫圈尺寸塑成，弹性有限，但足以短时恢复气密。"},
    fish:{name:"油纸包熏鱼",kind:"杂物",copy:"盐味很重。邮局石阶上的橘猫已经闻到了。"},
    milk:{name:"门房牛奶",kind:"杂物",copy:"今晨送来的小瓶牛奶，瓶口仍封着蜡纸。"},
    bread:{name:"半块黑面包",kind:"杂物",copy:"办公室抽屉里留下的早餐。边缘已经发硬。"}
  };
  const itemNames = Object.fromEntries(Object.entries(itemData).map(([id,v])=>[id,v.name]));

  const defaultState = () => ({
    version: 3, started: false, chapter: 1, scene: "deadroom", clock: 460,
    clues: [], inventory: [], knowledge: [], flags: {},
    hints: {1:0,2:0,3:0,4:0}, mistakes: 0, actions: 0, catFeeds: 0,
    radioSteps: 0, ending: false, supportTriggered: false, pendingStory: null,
    fragments:[1], readFragments:[], archivePage:1
  });
  let state = defaultState();
  let audio = { ctx:null, hum:null, master:null, noiseGain:null, enabled:false };
  let dialogueQueue = [];
  let toastTimer;
  let storyTimers = [];
  let storyActive = false;

  const $ = (id) => document.getElementById(id);
  const els = {};
  ["title-screen","game-screen","continue-game","chapter-kicker","chapter-title","scene-image","hotspots","scene-number","scene-name","scene-subtitle","objective-text","objective-progress","game-clock","location-nav","location-rail","evidence-panel","evidence-list","evidence-count","knowledge-list","inventory-list","dialogue","dialogue-speaker","dialogue-text","dialogue-next","modal-backdrop","detail-modal","detail-kicker","detail-title","detail-visual","detail-copy","detail-actions","archive-modal","archive-tabs","archive-page-no","archive-page-title","archive-page-copy","archive-query","archive-result","archive-badge","notebook-modal","notebook-objectives","suspect-notes","hint-modal","hint-text","support-modal","support-btn","sound-btn","menu-modal","ending-modal","ending-title","ending-copy","ending-stats","ending-letter","final-letter","toast","story-interlude","story-register","story-folio","story-kicker","story-heading","story-lines","story-continue"].forEach(id=>els[id.replaceAll("-","_")]=$(id));

  function save(){ localStorage.setItem(SAVE_KEY, JSON.stringify(state)); }
  function load(){
    try{
      const raw=localStorage.getItem(SAVE_KEY)||LEGACY_SAVE_KEYS.map(k=>localStorage.getItem(k)).find(Boolean);
      const parsed=JSON.parse(raw||"null");
      if(parsed){
        state=Object.assign(defaultState(),parsed,{version:3});
        state.fragments=Array.isArray(parsed.fragments)?parsed.fragments:[1];
        state.readFragments=Array.isArray(parsed.readFragments)?parsed.readFragments:[];
        state.knowledge=Array.isArray(parsed.knowledge)?parsed.knowledge:[];
        if((parsed.version||1)<3&&!state.pendingStory){
          if(state.chapter===1&&state.flags.ch1Ready)state.pendingStory="chapter1";
          else if(state.chapter===2&&state.flags.ch2Ready)state.pendingStory="chapter2";
          else if(state.chapter===3&&state.flags.ch3Ready)state.pendingStory="chapter3";
        }
      }
    }catch{}
  }
  function reset(){ localStorage.removeItem(SAVE_KEY); LEGACY_SAVE_KEYS.forEach(k=>localStorage.removeItem(k)); state=defaultState(); }
  function hasItem(id){ return state.inventory.includes(id); }
  function addItem(id){ if(!hasItem(id)){ state.inventory.push(id); toast(`取得：${itemNames[id]}`,"success"); } }
  function addClue(id,knowledge){ if(!state.clues.includes(id)){ state.clues.push(id); if(knowledge&&!state.knowledge.includes(knowledge))state.knowledge.push(knowledge); tick(12); toast(`证物登记：${evidenceNames[id]||id}`,"success"); } }
  function unlockFragment(n){
    if(!state.fragments.includes(n)){state.fragments.push(n);state.fragments.sort((a,b)=>a-b);toast(`私印本新增：第${n}页`,"success");}
  }
  function tick(minutes=8){ state.clock=Math.min(state.clock+minutes,1439); state.actions++; }
  function timeText(){ const h=Math.floor(state.clock/60)%24,m=state.clock%60; return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`; }
  function progress(){
    if(state.chapter===1) return ["c_lividity","c_latch","c_window","c_vent","c_tea","c_rigor"].filter(x=>state.clues.includes(x)).length;
    if(state.chapter===2) return ["letterA","letterB","letterC"].filter(x=>state.flags[x]).length;
    if(state.chapter===3) return ["tubeSolved","coldSolved","chartSolved","handSolved"].filter(x=>state.flags[x]).length;
    return state.flags.deductionStep||0;
  }

  function render(){
    const chapter=chapters[state.chapter];
    els.chapter_kicker.textContent=chapter.kicker; els.chapter_title.textContent=chapter.title;
    els.objective_text.textContent=chapter.objective; els.objective_progress.textContent=`${progress()} / ${chapter.target}`;
    els.game_clock.textContent=timeText();
    renderLocations(); renderScene(); renderEvidence(); renderInventory(); renderKnowledge();
    els.support_btn.classList.toggle("paid",localStorage.getItem(SUPPORT_PAID)==="1");
    const unread=state.fragments.filter(n=>!state.readFragments.includes(n)).length;
    els.archive_badge.textContent=unread;els.archive_badge.classList.toggle("hidden",unread===0);
    setAmbience(state.scene);
    save();
  }
  function availableScenes(){
    if(state.chapter===1)return ["exterior","deadroom"];
    if(state.chapter===2)return ["exterior","deadroom","office","lab"];
    if(state.chapter===3)return ["exterior","office","lab","tube","cold"];
    return ["exterior","deadroom","office","lab","tube","cold","finale"];
  }
  function renderLocations(){
    els.location_nav.innerHTML="";
    const labels={exterior:["邮局外","石阶与雾"],deadroom:["死信室","案发现场"],office:["局长室","三封信"],lab:["配药间","实验台"],tube:["管道室","延时阀"],cold:["冷藏库","2°C"],finale:["最后陈述","六个回答"]};
    availableScenes().forEach(id=>{ const b=document.createElement("button");b.className="location-btn"+(id===state.scene?" active":"");b.innerHTML=`${labels[id][0]}<small>${labels[id][1]}</small>`;b.onclick=()=>goScene(id);els.location_nav.appendChild(b); });
  }
  function renderScene(){
    const s=sceneData[state.scene]||sceneData.deadroom;
    els.scene_image.src=s.image; els.scene_image.alt=s.name+"，"+s.sub; els.scene_name.textContent=s.name; els.scene_subtitle.textContent=s.sub;
    els.scene_number.textContent=String(availableScenes().indexOf(state.scene)+1).padStart(2,"0"); els.hotspots.innerHTML="";
    s.hotspots.filter(h=>!h.fromChapter||state.chapter>=h.fromChapter).forEach(h=>{ const b=document.createElement("button");b.className="hotspot"+(isHotspotDone(h)?" done":"");b.style.cssText=`left:${h.x}%;top:${h.y}%;width:${h.w}%;height:${h.h}%`;b.title=h.title;b.setAttribute("aria-label",h.title);b.onclick=()=>activate(h);els.hotspots.appendChild(b); });
  }
  function isHotspotDone(h){
    return (h.clue&&state.clues.includes(h.clue))||(h.action&&state.flags[h.action])||(h.item&&(hasItem(h.item)||state.flags[`taken_${h.item}`]));
  }
  function renderEvidence(){
    els.evidence_list.innerHTML=""; els.evidence_count.textContent=`${state.clues.length} / 15`;
    state.clues.forEach((id,i)=>{ const data=evidenceData[id]||{name:id,kind:"未分类"};const b=document.createElement("button");b.className="evidence-card";b.innerHTML=`<b>${String(i+1).padStart(2,"0")}</b><span>${data.name}<small>${data.kind}</small></span>`;b.onclick=()=>showEvidence(id);els.evidence_list.appendChild(b); });
    if(!state.clues.length)els.evidence_list.innerHTML='<p class="panel-empty">现场尚未登记证物。</p>';
  }
  function renderKnowledge(){ els.knowledge_list.innerHTML=state.knowledge.length?state.knowledge.map(x=>`<p>${x}</p>`).join(""):"<p>只记录已经亲手验证的物理事实。</p>"; }
  function renderInventory(){
    els.inventory_list.innerHTML="";
    if(!state.inventory.length){els.inventory_list.innerHTML='<p class="empty-inventory">道具会收进这只旧木匣。</p>';return;}
    state.inventory.forEach((id,i)=>{const data=itemData[id]||{name:id,kind:"杂物"};const b=document.createElement("button");b.className="inventory-item";b.innerHTML=`<small>${String(i+1).padStart(2,"0")}</small><b>${data.name}</b><span>${data.kind}</span>`;b.title=`查看${data.name}`;b.onclick=()=>showItem(id);els.inventory_list.appendChild(b);});
  }
  function goScene(id){ if(storyActive||!els.dialogue.classList.contains("hidden")||!availableScenes().includes(id))return; state.scene=id;tick(4);closeAll();render(); }

  function queueStory(id){
    if(!storySequences[id])return;
    state.pendingStory=id;
    save();
    playStory(id);
  }
  function clearStoryTimers(){ storyTimers.forEach(clearTimeout); storyTimers=[]; }
  function playStory(id){
    const data=storySequences[id];if(!data)return;
    clearStoryTimers();storyActive=true;closeAll();
    els.story_register.textContent=data.register;els.story_folio.textContent=data.folio;els.story_kicker.textContent=data.kicker;els.story_heading.textContent=data.heading;
    els.story_lines.innerHTML="";els.story_continue.textContent=data.button;els.story_continue.classList.add("hidden");
    els.story_interlude.classList.remove("hidden");
    const reduced=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    data.lines.forEach((line,index)=>{
      const p=document.createElement("p");p.textContent=line;p.className=reduced?"story-line visible":"story-line";els.story_lines.appendChild(p);
      if(!reduced){
        const timer=setTimeout(()=>{p.classList.add("visible");playNarrativeNote(data.theme,index);},500+index*980);storyTimers.push(timer);
      }
    });
    const delay=reduced?0:500+data.lines.length*980;
    storyTimers.push(setTimeout(()=>{els.story_continue.classList.remove("hidden");els.story_continue.focus({preventScroll:true});},delay));
  }
  function finishStory(){
    if(!storyActive||els.story_continue.classList.contains("hidden"))return;
    const id=state.pendingStory;const transition=storyTransitions[id];
    clearStoryTimers();storyActive=false;els.story_interlude.classList.add("hidden");state.pendingStory=null;
    if(transition){state.chapter=transition.chapter;state.scene=transition.scene;if(transition.minutes)tick(transition.minutes);}
    save();render();
    if(id!=="opening")toast(`进入${chapters[state.chapter].kicker}：${chapters[state.chapter].title}`,"success");
    if(id==="opening"){
      dialogue([
        "艾达|门闩确实落在里面。先别告诉我谁有动机。",
        "玛戈|昨晚我和他吵过一架。争的是一封他拖了十九年都没寄出的信。",
        "艾达|那就从房间开始。人会记错，痕迹通常慢一点撒谎。"
      ]);
    }
  }

  function activate(h){
    if(storyActive||!els.dialogue.classList.contains("hidden"))return;
    clickSound();
    if(h.text){showDetail(h.title,h.text,"⌕");return;}
    const actions={clue:()=>inspectClue(h),take:()=>takeItem(h),cat:catAction,letterA:letterA,letterB:letterB,letterC:letterC,drawer:openDrawer,experiment:experiment,radio:radio,deadletters,medical,suitcase,gasket,valve,chart,deduction};
    (actions[h.action]||(()=>showDetail(h.title,"没有更多可观察的细节。","·")))();
  }
  function inspectClue(h){
    showDetail(h.title,h.copy,h.glyph,[{label:state.clues.includes(h.clue)?"已登记":"登记为证物",primary:true,run:()=>{addClue(h.clue,h.knowledge);closeAll();afterClue();render();}}],evidenceData[h.clue]?.kind||"现场观察");
  }
  function afterClue(){
    if(state.chapter===1&&progress()===6&&!state.flags.ch1Ready){state.flags.ch1Ready=true;unlockFragment(2);save();queueStory("chapter1");}
    if(state.chapter===3){state.flags.coldSolved=state.clues.includes("c_shelf")&&state.clues.includes("c_drag");checkChapter3();}
  }
  function takeItem(h){
    const taken=hasItem(h.item)||state.flags[`taken_${h.item}`];
    showDetail(h.title,taken?"这里已经空了。物品此前已被你收走。":h.copy,h.glyph,taken?[]:[{label:"收进物品匣",primary:true,run:()=>{addItem(h.item);state.flags[`taken_${h.item}`]=true;closeAll();render();}}],itemData[h.item]?.kind||"现场物品");
  }
  function openDrawer(){
    const first=!state.flags.drawer;showDetail("半开的抽屉",first?"木工铅笔、短蜡烛和半块黑面包挤在一起。最下面压着一张便笺，只写：『别问纸上写了什么，先看纸留下了什么。』":"抽屉已经空了，只剩下一圈蜡油印。",null,[{label:first?"收起抽屉里的东西":"合上抽屉",primary:true,run:()=>{if(first){["pencil","candle","bread"].forEach(addItem);state.flags.drawer=true;}closeAll();render();}}],"局长办公室 · 私人物品");
  }
  function letterA(){
    if(state.flags.letterA){showDetail("信 A · 已显影",evidenceData.e_letterA.copy,null,[],"纸张压痕");return;}
    const ok=hasItem("pencil");showDetail("信 A · 空白压痕",ok?"纸面没有墨，侧光下却能看见一排浅沟。铅笔的软芯不会弄湿纸，也不会像钢笔那样重新压伤它。":"纸面似乎完全空白。斜着看，纤维里有一道道极浅的沟槽。",null,ok?[{label:"用铅笔侧锋轻擦",primary:true,run:()=>solveLetter("letterA","e_letterA","玛戈|17—B……那是我母亲留下的旧编号。赫尔曼从不让我碰那一格柜子。","纸张压痕可以在不浸湿旧纸的情况下显现。") }]:[],"纸张检查");
  }
  function letterB(){
    if(state.flags.letterB){showDetail("信 B · 已开启",evidenceData.e_letterB.copy,null,[],"旧医疗纸片");return;}
    if(!hasItem("candle")&&!hasItem("burner")){showDetail("信 B · 火漆封面","火漆已经发脆，下面垫着一张更薄的旧纸。硬撬会把两层一起扯破。",null,[],"封缄检查");return;}
    showDetail("信 B · 控制火焰","你只需要让旧火漆软下来，而不是把它熔成一滩。选择加热方式。",null,[
      {label:"让火焰贴住火漆",run:()=>wrong("火漆冒烟，纸边很快卷起。你及时把火移开。")},
      {label:"隔两指宽缓慢温热",run:()=>{unlockFragment(3);solveLetter("letterB","e_letterB","哈斯|那是我十九年前开的处方。纸被水泡过，别把缺掉的地方当成我写过的东西。","间接加热能让旧火漆软化，同时减少对薄纸的灼伤。");}},
      {label:"放到窗边冷却",run:()=>wrong("低温只会让旧火漆更脆，封口没有松动。")}
    ],"封缄实验");
  }
  function letterC(){
    if(state.flags.letterC){showDetail("信 C · 已显影",evidenceData.e_letterC.copy,null,[],"隐写字迹");return;}
    if(!hasItem("diluted")||!hasItem("swab")){showDetail("信 C · 蓝边纸","纸上有几乎透明的书写痕。深色碘酒若直接滴下去，会把细线全部盖住。",null,[],"纸张检查");return;}
    showDetail("信 C · 淀粉墨","稀释后的碘液已经调好。棉签可以控制显色范围。",null,[{label:"用棉签沿透明笔迹薄涂",primary:true,run:()=>{unlockFragment(4);solveLetter("letterC","e_letterC","玛戈|零点六……我小时候只见过那张被水泡坏的处方。赫尔曼从来没给我看过这一句。","碘与淀粉墨发生显色反应，稀释后更容易保留细笔画。",()=>{state.inventory=state.inventory.filter(x=>x!=="diluted");});}}],"显色实验");
  }
  function solveLetter(flag,clue,dialogueLine,knowledge,after){
    state.flags[flag]=true;addClue(clue,knowledge);if(after)after();closeAll();dialogue([dialogueLine],()=>{maybeSupport();checkChapter2();render();});
  }
  function maybeSupport(){
    if(state.flags.letterA&&state.flags.letterB&&!state.supportTriggered){state.supportTriggered=true;save();}
  }
  function checkChapter2(){
    if(["letterA","letterB","letterC"].every(x=>state.flags[x])&&!state.flags.ch2Ready){state.flags.ch2Ready=true;save();queueStory("chapter2");}
  }
  function experiment(){
    if(state.chapter===2&&!hasItem("diluted")){
      showDetail("显色液实验","碘酒必须稀释。选择要放进玻璃杯的材料。","⚗",[
        {label:"碘酒 + 清水",run:()=>{if(hasItem("iodine")&&hasItem("water")){addItem("diluted");state.knowledge.push("浓碘液会遮住笔迹；稀释后才能辨认淀粉墨的线条。");closeAll();render();}else wrong("还没有拿齐碘酒和清水。")}},
        {label:"碘酒 + 面粉",run:()=>wrong("混合物立刻变成深蓝糊状，无法用于纸面。")},
        {label:"清水 + 柠檬",run:()=>wrong("没有任何显色反应。")}
      ]);return;
    }
    if(state.chapter>=3&&!hasItem("gasket")){
      showDetail("明胶密封圈","旧维修册的图示表明：干明胶吸水后，加热可以倒进模具重新塑形。","◯",[
        {label:"明胶 + 水 + 加热",run:()=>{if(hasItem("gelatin")&&hasItem("water")&&hasItem("burner")){addItem("gasket");state.inventory=state.inventory.filter(x=>x!=="gelatin");state.flags.gasketMade=true;state.knowledge.push("明胶受热溶解、冷却凝固，可制作临时气密垫圈。");closeAll();render();}else wrong("还缺少明胶片、清水或稳定热源。")}},
        {label:"面粉 + 碘酒 + 加热",run:()=>wrong("得到的是蓝色浆糊，不会形成有弹性的密封圈。")},
        {label:"蜡烛油直接浇模",run:()=>wrong("蜡太脆，受压后会立刻开裂。")}
      ]);return;
    }
    showDetail("实验台","能做的实验都已经完成。烧杯底部留着一圈深蓝色。","⚗");
  }
  function gasket(){
    if(state.flags.gasketInstalled){showDetail("新密封圈","明胶圈已经贴合阀门，管道恢复气密。","◯");return;}
    if(!hasItem("gasket")){showDetail("破损密封圈","橡胶圈被割开，气动管无法建立压力。实验台上也许能制作一个可逆的临时替代品。","◯");return;}
    showDetail("破损密封圈","明胶圈大小与瓶盖模具完全一致。","◯",[{label:"安装明胶密封圈",primary:true,run:()=>{state.flags.gasketInstalled=true;state.inventory=state.inventory.filter(x=>x!=="gasket");tick(18);closeAll();render();}}]);
  }
  function valve(){
    if(!state.flags.gasketInstalled){showDetail("延时阀","管道漏气，阀门转动也不会输送胶囊。先修复密封圈。","⌾");return;}
    showDetail("延时阀","四个刻度分别对应立即、六小时、十二小时、二十四小时。死者的信带着前一日邮戳，却在今晨落下。","⌾",[
      {label:"立即",run:()=>wrong("这无法解释前一日的邮戳。")},{label:"6 小时",run:()=>wrong("投递时间仍然晚了整整十八小时。")},{label:"12 小时",run:()=>wrong("还差半天。")},{label:"24 小时",run:()=>{state.flags.tubeSolved=true;addClue("c_capsule","延时阀的24小时档能解释17日邮戳为何到18日清晨才出现。");closeAll();dialogue(["维克托|二十四小时。难怪胶囊今天才落下来。至于是谁把它放进去——管子可没有眼睛。"],()=>{checkChapter3();render();});}}
    ]);
  }
  function chart(){
    if(state.flags.chartSolved){showDetail("温度记录表",evidenceData.c_chart.copy,null,[],"记录纸张");return;}
    const ready=state.clues.includes("c_shelf")&&state.clues.includes("c_drag");
    showDetail("温度记录表",ready?"11月17日一栏里，『12°C』的数字1比其余墨迹更亮。纸纤维下面还压着另一道竖笔。":"11月17日一栏有一处覆写，但只看这张表，还无法判断它和冷库里的痕迹是否相关。",null,ready?[{label:"用侧光确认底层数字",primary:true,run:()=>{state.flags.chartSolved=true;addClue("c_chart","11月17日温度栏的12°C由2°C覆写而来。");closeAll();checkChapter3();render();}}]:[],"记录纸张");
  }
  function handwriting(){
    showDetail("三份笔迹","把今晨来信、温度表覆写和玛戈的护士登记簿叠在灯下。三个小写 h 的最后一笔都向左折回，折角和停笔位置几乎重合。",null,[{label:"登记共同书写特征",primary:true,run:()=>{state.flags.handSolved=true;addClue("c_hand","三份记录存在高度一致的 h 收笔特征。");closeAll();checkChapter3();render();}}],"笔迹比对");
  }
  function checkChapter3(){
    state.flags.coldSolved=state.clues.includes("c_shelf")&&state.clues.includes("c_drag");
    if(["tubeSolved","coldSolved","chartSolved","handSolved"].every(x=>state.flags[x])&&!state.flags.ch3Ready){state.flags.ch3Ready=true;unlockFragment(5);save();queueStory("chapter3");}
  }

  const deductions = [
    {
      q:"尸体少掉的那一天去了哪里？",
      prompt:"先选两件能共同说明『尸体曾在低温中停留』的证物。",
      supports:["c_chart","c_shelf"], pool:["c_chart","c_shelf","c_window","c_capsule"],
      a:"尸体曾在2°C冷库停放约24小时",
      opts:["地下室本身整夜保持2°C","尸体曾在2°C冷库停放约24小时","镇静剂让尸体变化变慢"],
      reason:"被覆写的2°C记录说明冷库当日处于低温；层板上的制服纤维说明死者曾与那里直接接触。"
    },
    {
      q:"门闩为什么能在空房间里落下？",
      prompt:"选出一件『受力处』和一件『传力物』。",
      supports:["c_latch","c_vent"], pool:["c_latch","c_vent","c_window","c_tea"],
      a:"钓线穿过通风管牵动内侧插销",
      opts:["门锁还有未登记的第二把钥匙","有人从高窗伸手拨动插销","钓线穿过通风管牵动内侧插销"],
      reason:"插销孔边缘的新磨痕与通风管内的透明钓线能够构成同一条受力路径。"
    },
    {
      q:"今晨才落下的信，是怎么越过一夜的？",
      prompt:"选一件能说明『时间』、一件能说明『书写者』的证物。",
      supports:["c_capsule","c_hand"], pool:["c_capsule","c_hand","e_letterA","c_drag"],
      a:"玛戈写下后让胶囊在延时阀中滞留24小时",
      opts:["赫尔曼生前写好并正常投递","玛戈写下后让胶囊在延时阀中滞留24小时","哈斯从镇外寄回后被大雾耽误"],
      reason:"胶囊的17日油墨与18日到达之间相差一夜；今晨来信的 h 又与玛戈登记簿同形。"
    },
    {
      q:"十九年前，玛戈真正看错了什么？",
      prompt:"把受损处方与后来显出的补注放在一起。",
      supports:["e_letterB","e_letterC"], pool:["e_letterB","e_letterC","c_tea","c_lividity"],
      a:"她把被水抹掉小数点的0.6克读成了6克",
      opts:["她把被水抹掉小数点的0.6克读成了6克","她把安娜的姓名认成了另一个病人","她把处方日期误看成了死亡日期"],
      reason:"旧处方的水渍正穿过剂量栏，而隐写补注明确留下『0.6，不是6』。"
    },
    {
      q:"谁把旧日的误解带进了今天的现场？",
      prompt:"选一件指向『今天的手』、一件指向『十九年前的执念』。",
      supports:["c_hand","e_letterB"], pool:["c_hand","e_letterB","c_window","c_capsule"],
      a:"玛戈",
      opts:["利奥波德·哈斯","玛戈","维克托·莱茵"],
      reason:"今天被改写的记录和来信都留下玛戈的笔迹特征；而她始终围绕母亲那张残缺处方行动。"
    },
    {
      q:"那么，赫尔曼真正死于什么？",
      prompt:"选一件说明『真正伤口』、一件排除『杯中药物』的证物。",
      supports:["c_rigor","c_tea"], pool:["c_rigor","c_tea","c_latch","e_letterC"],
      a:"后退跌倒，后枕撞上桌角造成致命伤",
      opts:["哈斯给他服下过量镇静剂","有人用钝器从背后袭击","后退跌倒，后枕撞上桌角造成致命伤"],
      reason:"后枕伤的高度和形态与桌角吻合；杯里虽有镇静剂，胃里却没有，药物并未进入死亡过程。"
    }
  ];
  let deductionSelection=[];
  let deductionLinked=false;

  function deduction(){
    if((state.flags.deductionStep||0)>=deductions.length){finish();return;}
    deductionSelection=[];deductionLinked=false;renderDeduction();openModal("detail-modal");
  }
  function renderDeduction(){
    const step=state.flags.deductionStep||0;const d=deductions[step];if(!d)return;
    els.detail_kicker.textContent=`终局推理 · RELATION ${String(step+1).padStart(2,"0")}`;
    els.detail_title.textContent=d.q;
    els.detail_visual.innerHTML=`<div class="relation-plate"><span>CASE 17—B</span><b>${step+1} / ${deductions.length}</b><small>先建立证物关系，再提交结论</small></div>`;
    els.detail_copy.innerHTML=`<span class="deduction-prompt">${d.prompt}</span><div id="deduction-evidence" class="deduction-evidence"></div><p id="deduction-feedback" class="deduction-feedback">选择两件证物。</p>`;
    els.detail_actions.innerHTML="";
    const grid=$("deduction-evidence");
    d.pool.forEach(id=>{
      const data=evidenceData[id];const b=document.createElement("button");b.className="evidence-choice"+(deductionSelection.includes(id)?" selected":"");b.innerHTML=`<small>${data.kind}</small><b>${data.name}</b>`;
      b.onclick=()=>{
        if(deductionLinked)return;
        if(deductionSelection.includes(id))deductionSelection=deductionSelection.filter(x=>x!==id);
        else if(deductionSelection.length<2)deductionSelection.push(id);
        else{deductionSelection.shift();deductionSelection.push(id);}
        renderDeduction();
      };
      grid.appendChild(b);
    });
    const verify=document.createElement("button");verify.className="ink-button";verify.textContent=deductionLinked?"证物关系成立":"检验证物关系";verify.disabled=deductionLinked||deductionSelection.length!==2;
    verify.onclick=()=>verifyDeductionRelation(d);els.detail_actions.appendChild(verify);
    if(deductionLinked)showDeductionConclusions(d);
  }
  function verifyDeductionRelation(d){
    const chosen=[...deductionSelection].sort().join("|");const expected=[...d.supports].sort().join("|");
    if(chosen!==expected){state.mistakes++;tick(5);save();$("deduction-feedback").textContent="这两件证物还不能共同回答当前问题。换一种关系试试。";$("deduction-feedback").classList.add("warning");toast("证物关系还不成立","warning");return;}
    deductionLinked=true;renderDeduction();const feedback=$("deduction-feedback");feedback.textContent=d.reason;feedback.classList.add("success");playPaperTick();
  }
  function showDeductionConclusions(d){
    const feedback=$("deduction-feedback");feedback.textContent=d.reason;feedback.classList.add("success");
    const divider=document.createElement("p");divider.className="conclusion-label";divider.textContent="基于这组关系，提交你的结论：";els.detail_actions.appendChild(divider);
    d.opts.forEach(o=>{const b=document.createElement("button");b.className="ink-button conclusion-choice";b.textContent=o;b.onclick=()=>{if(o===d.a){const step=state.flags.deductionStep||0;state.flags.deductionStep=step+1;tick(15);closeAll();toast("关系成立，结论已写入调查簿","success");render();if(step+1===deductions.length)setTimeout(finish,550);else setTimeout(deduction,420);}else{state.mistakes++;tick(5);save();toast("这项结论无法同时解释刚才两件证物","warning");}};els.detail_actions.appendChild(b);});
  }

  function finish(){
    state.ending=true;save();closeAll();
    els.ending_title.textContent="没有凶手的密室";
    els.ending_copy.innerHTML="<p>11月17日夜里，玛戈为了母亲那张残缺处方与赫尔曼争执。赫尔曼后退时失去重心，后枕撞上桌角。致命伤发生在那一刻；杯里的药没有被喝下，也没有第二件凶器。</p><p>玛戈看着他倒下，却仍把十九年前那枚消失的小数点当作一桩没有偿还的罪。她让尸体在 <b>2°C</b> 冷库里停了一夜，改写温度，做出迟到的信，再用钓线把门闩落下。她不是在制造一种杀人方法，而是在制造一个自己愿意相信的答案。</p><p>到这里，案件已经能闭合。可赫尔曼制服内衬有一段新缝线——那里藏着一封既没有邮戳，也从未真正离开寄信人的信。</p>";
    els.ending_letter.classList.remove("hidden");els.final_letter.classList.add("hidden");
    const eggs=(state.flags.catLetter?1:0)+(state.flags.radioEgg?1:0)+(state.flags.suitcaseEgg?1:0);
    els.ending_stats.innerHTML=`<div><b>${state.clues.length}</b><span>登记证物</span></div><div><b>${state.mistakes}</b><span>错误尝试</span></div><div><b>${eggs} / 3</b><span>系列暗线</span></div>`;
    openModal("ending-modal");if(state.flags.finalRead)revealFinalLetter();
  }

  function revealFinalLetter(){
    state.flags.finalRead=true;unlockFragment(6);addClue("c_sixth","赫尔曼在死前已经决定把安娜的死因与自己的心意一起告诉玛戈。");state.readFragments.push(6);state.readFragments=[...new Set(state.readFragments)];
    els.ending_title.textContent="第六封信";els.ending_letter.classList.add("hidden");els.final_letter.classList.remove("hidden");
    els.final_letter.innerHTML=`<p>玛戈：</p><p>前五封信是你母亲写的。这一封，是我欠你的。</p><p>安娜走的那一夜很清醒。她知道哈斯给的是零点六克，只够让疼痛安静一阵；也知道热病不会因为我们不肯承认，就绕开这间屋子。</p><p>她托我每年把一封信交给你。还托我在你不再需要那些信的时候告诉你：人不会因为失去一个家，就永远只能做别人的客人。</p><p>第一件事，我做了十九年。第二件事，我拖了十九年。</p><p>你总叫我福格尔先生。我每次都想纠正，又怕一开口，就显得这些年是我向你讨来的。</p><p>如果你愿意，明早一起吃早餐。你叫我什么都行。只是别再一个人等。</p><p class="sign">赫尔曼<br>11月17日晚</p><p class="last-line">案卷在午后合上。那顿写在信里的早餐，却永远停在了第二天。</p>`;
    els.ending_stats.innerHTML=`<div><b>${state.clues.length}</b><span>登记证物</span></div><div><b>${state.mistakes}</b><span>错误尝试</span></div><div><b>${state.fragments.length} / 6</b><span>读到的书页</span></div>`;
    save();render();
  }

  function catAction(){
    if(state.flags.catLetter){showDetail("石阶上的橘猫","它把旧情书交出来以后就再不看你，仿佛邮差也有保密义务。",null,[],"邮局外 · 无关证物");return;}
    const feed=["fish","milk","bread"][Math.min(state.catFeeds,2)];
    if(!hasItem(feed)){
      const copy=feed==="fish"?"它一直闻着抛锚汽车旁那只破了角的油纸包。":feed==="milk"?(state.chapter<2?"它吃完鱼便蜷回台阶。也许明早的门房会留下别的东西。":"它把鼻尖转向门房窗台上的牛奶瓶。") : "它盯着你的物品匣。办公室抽屉里的黑面包大概还在。";
      showDetail("石阶上的橘猫",copy,null,[],"邮局外 · 无关证物");return;
    }
    showDetail("石阶上的橘猫",`它闻到了${itemNames[feed]}，难得抬眼看你。`,null,[{label:`把${itemNames[feed]}留在石阶上`,primary:true,run:()=>{state.catFeeds++;state.inventory=state.inventory.filter(x=>x!==feed);closeAll();if(state.catFeeds>=3){state.flags.catLetter=true;showDetail("一封替别人保管的信","橘猫从门垫下拖出一封1914年的旧情书。收件人写着『未能回家的阿黛尔』。页脚有一枚小小的系列印记：CASE 02 · 橡树下。",null,[],"系列暗线 · 非本案证物");}else toast("它收下食物，又把尾巴绕回脚边。","success");render();}}],"邮局外 · 无关证物");
  }
  function radio(){
    if(state.flags.radioEgg){showDetail("短波收音机","静电后面仍循环着一句已经抄下来的短报码：『月亮升起时，老橡树下见。』",null,[],"系列暗线 · 无线电");return;}
    const steps=["长 · 短短 · 长","短 · 长长 · 短","长长 · 短 · 短"],correct=[1,0,2],k=state.radioSteps;
    const target=steps[correct[k]];if(audio.enabled)playMorse(target);
    const choices=steps.map((x,i)=>({label:x,run:()=>{
      if(i===correct[k]){state.radioSteps++;closeAll();if(state.radioSteps===3){state.flags.radioEgg=true;dialogue(["收音机|——月亮升起时，老橡树下见。——","维克托|别看我。我只卖邮票，不替陌生人解释约会地点。"],render);}else setTimeout(radio,280);}
      else{state.radioSteps=0;wrong("旋钮从窄频带里滑了出去，节拍重新开始。");setTimeout(radio,280);}
    }}));
    const accessible=audio.enabled?"静电里有三段长短不同的脉冲。选择与你听到的一致的节拍。":`扬声器没有开启。旁边的记录针在纸带上留下：${target}。`;
    showDetail("短波调频",`${accessible}<br><small class="detail-note">这是系列暗线，不影响本案结局。</small>`,null,choices,"无线电记录");
  }
  function deadletters(){
    const stories=["一封寄给1912年的自己：『不要搭上星期四的船。』","一张没有地址的明信片，只画着一棵被劈成两半的橡树。","一封儿童笔迹的信：『妈妈说死人不会回信，可邮差先生回了。』","一只空信封，打开后能闻到遥远海港的盐味。"];
    const i=(state.actions+state.clues.length)%stories.length;showDetail("随机死信",stories[i],"✉");
  }
  function suitcase(){
    if(state.flags.suitcaseEgg){showDetail("维克托的手提箱","暗格已经打开。里面的护照分别把他称作商人、记者和『野兔七号』。","▣");return;}
    showDetail("维克托的手提箱","三枚邮票按王冠、乌鸦、橡树排列。箱扣也有三枚图案。","▣",[
      {label:"王冠 → 乌鸦 → 橡树",run:()=>{state.flags.suitcaseEgg=true;closeAll();dialogue(["维克托|邮票商只是其中一份职业。","艾达|那另外两份呢？","维克托|一份不能说。另一份已经不存在了。"],render);}},
      {label:"乌鸦 → 橡树 → 王冠",run:()=>wrong("锁扣弹回原位。")},{label:"橡树 → 王冠 → 乌鸦",run:()=>wrong("锁扣弹回原位。")}
    ]);
  }
  function medical(){
    if(state.chapter>=3&&!state.flags.handSolved){showDetail("法医学手册","书页里夹着玛戈的护士登记簿。她记录药名时写过很多小写 h，其中几处收笔让你想起刚才见过的笔画。",null,[{label:"把三份字迹并在灯下",primary:true,run:handwriting}],"夹页记录");}
    else showDetail("法医学手册","书中把低温列为死亡时间判断的常见干扰项：温度会改变尸体变化的速度，却不会重写原始伤口或已经固定的尸斑。",null,[],"法医学参考");
  }

  function advanceChapter(n,scene){ state.chapter=n;state.scene=scene;tick(25);closeAll();save();render();toast(`进入${chapters[n].kicker}：${chapters[n].title}`,"success"); }
  function showEvidence(id){ const data=evidenceData[id]||{name:id,kind:"证物",copy:"这件证物已经登记。"};showDetail(data.name,data.copy,null,[],data.kind); }
  function showItem(id){ const data=itemData[id]||{name:id,kind:"物品",copy:"已收进物品匣。"};showDetail(data.name,data.copy,null,[],data.kind); }
  function showDetail(title,copy,glyph=null,actions=[],kind="现场观察"){
    els.detail_kicker.textContent=kind;els.detail_title.textContent=title;els.detail_copy.innerHTML=copy;els.detail_visual.innerHTML=`<div class="specimen-card"><span>WEISSBURG · CASE 17—B</span><b>${title}</b><small>${kind} · ${timeText()}</small><i aria-hidden="true">REGISTERED</i></div>`;els.detail_actions.innerHTML="";
    actions.forEach(a=>{const b=document.createElement("button");b.className="ink-button"+(a.primary?" primary":"");b.textContent=a.label;b.disabled=!!a.disabled;b.onclick=a.run;els.detail_actions.appendChild(b);});openModal("detail-modal");
  }
  function wrong(message,keep=false){state.mistakes++;tick(5);toast(message,"warning");if(!keep)closeAll();render();}
  function toast(message,type=""){clearTimeout(toastTimer);els.toast.textContent=message;els.toast.className=`toast ${type}`;toastTimer=setTimeout(()=>els.toast.classList.add("hidden"),2600);}
  function openModal(id){els.modal_backdrop.classList.remove("hidden");$(id).classList.remove("hidden");}
  function closeAll(){["detail-modal","archive-modal","notebook-modal","hint-modal","support-modal","menu-modal","ending-modal"].forEach(id=>$(id).classList.add("hidden"));els.location_rail.classList.remove("open");els.evidence_panel.classList.remove("open");els.modal_backdrop.classList.add("hidden");}
  function dialogue(lines,done){dialogueQueue=lines.map(x=>{const i=x.indexOf("|");return [x.slice(0,i),x.slice(i+1)];});showNextDialogue(done);}
  function showNextDialogue(done){
    const next=dialogueQueue.shift();if(!next){els.dialogue.classList.add("hidden");els.dialogue_next.onclick=null;if(done)done();return;}
    els.dialogue_speaker.textContent=next[0];els.dialogue_text.textContent=next[1];els.dialogue.classList.remove("hidden");els.dialogue_next.onclick=()=>showNextDialogue(done);
  }

  const hints={
    1:["先把『尸体现在的姿势』和『尸体形成尸斑时的姿势』分开看。不要急着给密室找凶手。","死信室里有六类痕迹值得登记：尸体、门闩、高窗、通风管、茶杯，以及后枕伤口附近。","如果死亡时间与报案时间对不上，想想什么环境因素会改变尸僵和腐败的速度。"],
    2:["三封信不是三道密码。分别想：如何读取压痕、如何无损打开旧火漆、如何让透明字迹显色。","A需要柔软石墨；B需要间接温热；C需要先把碘液稀释，再让它只经过可疑笔画。","办公室抽屉和配药间已经提供全部必要材料，不需要在别处寻找密码。"],
    3:["这一章的四件事彼此独立：让管道重新气密、确认延时长度、证明冷库被用过、确认被改写记录的书写特征。","明胶吸水受热后可以临时塑形；延时阀的选择要和胶囊油墨日期、实际到达时间一起计算。","冷库先找能证明『有人/某物在这里停留』的痕迹，再看温度表；笔迹比对的样本夹在法医学手册里。"],
    4:["终局不是直接猜答案。每一问都要先选两件能够形成因果或排除关系的证物。","前三问分别在找：低温停留、门闩受力路径、迟到来信的时间与书写者。","后三问分别把旧处方与0.6补注、今天的笔迹与旧执念、真实伤口与未被喝下的茶放在一起。"]
  };
  function openHint(){const n=Math.min(state.hints[state.chapter]||0,2);els.hint_text.textContent=hints[state.chapter][n];$("next-hint").textContent=n>=2?"这是最具体的提示":"再具体一点";openModal("hint-modal");}
  function nextHint(){state.hints[state.chapter]=Math.min((state.hints[state.chapter]||0)+1,2);save();openHint();}
  function openNotebook(){
    const entries=Object.values(chapters).map((c,i)=>{const n=i+1,done=state.chapter>n||state.ending;return `<div class="note-entry ${done?"complete":""}"><b>${c.kicker} · ${c.objective}</b><p>${n<=state.chapter?`${n===state.chapter?"正在调查":"已经解决"} · ${n===state.chapter?progress()+" / "+c.target:c.target+" / "+c.target}`:"尚未开启"}</p></div>`;}).join("");
    els.notebook_objectives.innerHTML=entries;
    els.suspect_notes.innerHTML=`<div class="note-entry"><b>玛戈·福格尔</b><p>${state.chapter<3?"赫尔曼的养女，曾做护士。昨夜承认与赫尔曼为一封旧信争吵；谈起他时常先叫『局长』，再改口。":"熟悉处方记录与冷库工作。她承认昨夜争吵，但要求艾达不要替她回答最后发生了什么。"}</p></div><div class="note-entry"><b>利奥波德·哈斯</b><p>${state.flags.letterB?"十九年前为安娜开过氯醛处方。面对受损剂量栏时，他只强调：缺失的墨迹不能当作原本的数字。":"镇上医生。杯底镇静剂让他的职业显得可疑，但胃内容物暂时不能支持『喝下药』这一点。"}</p></div><div class="note-entry"><b>维克托·莱茵</b><p>邮票商，熟悉旧邮局的管道和邮戳。他对自己的身份含糊其辞，但愿意说明机械结构。</p></div><div class="note-entry"><b>安娜·韦伯</b><p>${state.flags.letterA?"玛戈的生母，也是《雪落以前》的署名者。编号17—B与她有关；前五封信已经交付，第六封仍未投递。":"玛戈的生母。《雪落以前》的署名者。她的名字仍留在旧目录的钉孔附近。"}</p></div>`;openModal("notebook-modal");
  }

  function renderArchive(page=state.archivePage||1){
    const accessible=state.fragments.includes(page);if(!accessible)page=state.fragments[state.fragments.length-1]||1;state.archivePage=page;
    if(!state.readFragments.includes(page))state.readFragments.push(page);
    els.archive_tabs.innerHTML="";
    for(let n=1;n<=6;n++){
      const b=document.createElement("button"),open=state.fragments.includes(n);b.className=`archive-tab${n===page?" active":""}${open?"":" locked"}`;b.innerHTML=`第${n}页 <span>${open?(state.readFragments.includes(n)?"已读":"新页"):"缺页"}</span>`;b.disabled=!open;b.onclick=()=>renderArchive(n);els.archive_tabs.appendChild(b);
    }
    const p=novelPages[page];els.archive_page_no.textContent=`第${page}叶 · ${page===6?"未投递":"私印本"}`;els.archive_page_title.textContent=p.title;els.archive_page_copy.innerHTML=p.copy;render();
  }
  function openArchive(page){renderArchive(page||state.archivePage||1);openModal("archive-modal");}
  function searchArchive(e){
    e.preventDefault();const q=els.archive_query.value.trim().toLowerCase();
    if(!q){els.archive_result.textContent="请输入一个仍有人记得的名字。";return;}
    if(q.includes("安娜")||q.includes("anna")||q.includes("a.w")){
      state.flags.searchedAnna=true;els.archive_result.textContent=state.chapter<3?"安娜·韦伯：死信室私印本，索引17—B。保管人：赫尔曼·福格尔。":"没有匹配记录。纸页上仍留着两枚索引钉孔。";
    }else if(q.includes("玛戈")||q.includes("margo"))els.archive_result.textContent="儿童订报证：玛戈·韦伯。1910年后，姓氏改为福格尔。";
    else if(q.includes("赫尔曼")||q.includes("hermann"))els.archive_result.textContent="赫尔曼·福格尔：局长；未投递私人信件，登记数量：6。";
    else if(q.includes("第六")||q==="6"||q.includes("结尾"))els.archive_result.textContent=state.ending?"第六页已从制服内衬取出。":"第六页未装订。档案员备注：『还没到明早。』";
    else els.archive_result.textContent="没有匹配记录。空白并不证明它从未存在。";
    save();
  }
  function openSupport(){localStorage.setItem(SUPPORT_SEEN,"1");openModal("support-modal");}
  function hasStoredSave(){return !!(localStorage.getItem(SAVE_KEY)||LEGACY_SAVE_KEYS.some(k=>localStorage.getItem(k)));}

  function start(newGame=false){
    clearStoryTimers();storyActive=false;els.story_interlude.classList.add("hidden");
    if(newGame)reset();else load();
    state.started=true;els.title_screen.classList.add("hidden");els.game_screen.classList.remove("hidden");render();
    if(newGame){queueStory("opening");return;}
    if(state.pendingStory){setTimeout(()=>playStory(state.pendingStory),80);return;}
    if(state.ending)setTimeout(finish,80);
  }
  function backTitle(){closeAll();els.game_screen.classList.add("hidden");els.title_screen.classList.remove("hidden");els.continue_game.classList.toggle("hidden",!hasStoredSave());}

  function initAudio(){
    if(audio.ctx){audio.enabled=!audio.enabled;if(audio.enabled){audio.ctx.resume();setAmbience(state.scene);}else audio.ctx.suspend();updateSound();return;}
    const Ctx=window.AudioContext||window.webkitAudioContext;if(!Ctx)return;audio.ctx=new Ctx();audio.master=audio.ctx.createGain();audio.master.gain.value=.8;audio.master.connect(audio.ctx.destination);
    const osc=audio.ctx.createOscillator(),gain=audio.ctx.createGain();osc.type="sine";osc.frequency.value=46;gain.gain.value=.015;osc.connect(gain).connect(audio.master);osc.start();audio.hum=osc;
    const length=audio.ctx.sampleRate*2,buffer=audio.ctx.createBuffer(1,length,audio.ctx.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<length;i++)data[i]=(Math.random()*2-1)*.16;
    const noise=audio.ctx.createBufferSource(),filter=audio.ctx.createBiquadFilter(),noiseGain=audio.ctx.createGain();noise.buffer=buffer;noise.loop=true;filter.type="lowpass";filter.frequency.value=520;noiseGain.gain.value=.018;noise.connect(filter).connect(noiseGain).connect(audio.master);noise.start();audio.noiseGain=noiseGain;
    audio.enabled=true;setAmbience(state.scene);updateSound();
  }
  function setAmbience(scene){if(!audio.ctx||!audio.enabled||!audio.hum)return;const frequencies={exterior:38,deadroom:47,office:52,lab:58,tube:43,cold:35,finale:31};const noise={exterior:.025,deadroom:.014,office:.009,lab:.012,tube:.018,cold:.006,finale:.004};audio.hum.frequency.setTargetAtTime(frequencies[scene]||45,audio.ctx.currentTime,.35);if(audio.noiseGain)audio.noiseGain.gain.setTargetAtTime(noise[scene]||.01,audio.ctx.currentTime,.4);}
  function clickSound(){if(!audio.ctx||!audio.enabled)return;const o=audio.ctx.createOscillator(),g=audio.ctx.createGain();o.type="triangle";o.frequency.setValueAtTime(240,audio.ctx.currentTime);o.frequency.exponentialRampToValueAtTime(120,audio.ctx.currentTime+.06);g.gain.setValueAtTime(.028,audio.ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.ctx.currentTime+.07);o.connect(g).connect(audio.master);o.start();o.stop(audio.ctx.currentTime+.08);}
  function playNarrativeNote(theme,index){
    if(!audio.ctx||!audio.enabled)return;
    const scales={low:[110,131,147,165],paper:[196,220,247,294],glass:[261,294,330,392],cold:[174,196,233,261]};
    const base=(scales[theme]||scales.paper)[index%4],now=audio.ctx.currentTime;
    const timbres={low:[[1,"triangle",.032],[2,"sine",.008]],paper:[[1,"triangle",.028],[2,"sine",.012],[3,"sine",.004]],glass:[[1,"sine",.025],[2.41,"sine",.009],[3.98,"sine",.004]],cold:[[1,"sine",.022],[1.5,"triangle",.006]]};
    const decay=theme==="glass"?1.08:theme==="low"?.92:.72;
    (timbres[theme]||timbres.paper).forEach(([ratio,type,level],part)=>{const o=audio.ctx.createOscillator(),g=audio.ctx.createGain(),filter=audio.ctx.createBiquadFilter();o.type=type;o.frequency.value=base*ratio;o.detune.value=part?part*1.7:0;filter.type="lowpass";filter.frequency.value=theme==="glass"?2400:1300;g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(level,now+.014);g.gain.exponentialRampToValueAtTime(.0001,now+decay);o.connect(filter).connect(g).connect(audio.master);o.start(now);o.stop(now+decay+.05);});
    if(theme==="paper")playPaperTick();
  }
  function playPaperTick(){if(!audio.ctx||!audio.enabled)return;const now=audio.ctx.currentTime,o=audio.ctx.createOscillator(),g=audio.ctx.createGain();o.type="triangle";o.frequency.setValueAtTime(720,now);o.frequency.exponentialRampToValueAtTime(360,now+.035);g.gain.setValueAtTime(.018,now);g.gain.exponentialRampToValueAtTime(.0001,now+.05);o.connect(g).connect(audio.master);o.start(now);o.stop(now+.055);}
  function playMorse(label){
    if(!audio.ctx||!audio.enabled)return;
    const patterns={"长 · 短短 · 长":[.42,.13,.13,.42],"短 · 长长 · 短":[.13,.42,.42,.13],"长长 · 短 · 短":[.42,.42,.13,.13]},seq=patterns[label]||[];let t=audio.ctx.currentTime+.08;
    seq.forEach(d=>{const o=audio.ctx.createOscillator(),g=audio.ctx.createGain();o.type="sine";o.frequency.value=510;g.gain.setValueAtTime(.025,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(audio.master);o.start(t);o.stop(t+d+.01);t+=d+.11;});
  }
  function updateSound(){$("sound-btn").innerHTML=`<i>A-05</i><span>${audio.enabled?"声音":"静音"}</span>`;$("title-sound").textContent=audio.enabled?"关闭声音 · 环境声与间页乐音已开启":"开启声音 · 推荐佩戴耳机";}

  function bind(){
    $("new-game").onclick=()=>start(true);els.continue_game.onclick=()=>start(false);els.continue_game.classList.toggle("hidden",!hasStoredSave());
    $("title-sound").onclick=initAudio;$("sound-btn").onclick=initAudio;$("archive-btn").onclick=()=>openArchive();$("archive-search").onsubmit=searchArchive;$("notebook-btn").onclick=openNotebook;$("hint-btn").onclick=openHint;$("next-hint").onclick=nextHint;$("support-btn").onclick=openSupport;$("menu-btn").onclick=()=>openModal("menu-modal");
    $("support-done").onclick=()=>{localStorage.setItem(SUPPORT_PAID,"1");closeAll();toast("谢谢你让这间死信室继续亮着灯 ♡","success");render();};$("support-later").onclick=closeAll;
    $("resume-game").onclick=closeAll;$("reset-game").onclick=()=>{if(confirm("确定清除当前调查进度并重新开始吗？"))start(true);};$("back-title").onclick=backTitle;$("ending-letter").onclick=revealFinalLetter;$("ending-restart").onclick=()=>start(true);
    $("inventory-prev").onclick=()=>els.inventory_list.scrollBy({left:-210,behavior:"smooth"});$("inventory-next").onclick=()=>els.inventory_list.scrollBy({left:210,behavior:"smooth"});
    $("mobile-locations").onclick=()=>{closeAll();els.location_rail.classList.add("open");els.modal_backdrop.classList.remove("hidden");};$("close-locations").onclick=closeAll;
    $("mobile-evidence").onclick=()=>{closeAll();els.evidence_panel.classList.add("open");els.modal_backdrop.classList.remove("hidden");};
    document.querySelectorAll("[data-close]").forEach(b=>b.onclick=closeAll);els.modal_backdrop.onclick=()=>{if(!storyActive)closeAll();};els.story_continue.onclick=finishStory;
    document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!storyActive)closeAll();});
  }

  window.__DEAD_LETTER_TEST__ = {
    reset:()=>{reset();return state;}, state:()=>JSON.parse(JSON.stringify(state)),
    solveChapter1:()=>{["c_lividity","c_latch","c_window","c_vent","c_tea","c_rigor"].forEach(addClue);state.chapter=2;state.scene="office";render();},
    solveChapter2:()=>{["letterA","letterB","letterC"].forEach(x=>state.flags[x]=true);["e_letterA","e_letterB","e_letterC"].forEach(addClue);state.chapter=3;state.scene="tube";render();},
    solveChapter3:()=>{["tubeSolved","coldSolved","chartSolved","handSolved"].forEach(x=>state.flags[x]=true);["c_capsule","c_shelf","c_drag","c_chart","c_hand"].forEach(addClue);state.chapter=4;state.scene="finale";render();},
    finish:()=>{state.flags.deductionStep=6;finish();return state;}
  };
  bind();load();
})();
