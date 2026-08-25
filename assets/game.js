(() => {
  "use strict";

  const SAVE_KEY = "dead-letter-room-save-v1";
  const SUPPORT_SEEN = "dead-letter-room-support-seen";
  const SUPPORT_PAID = "dead-letter-room-support-paid";

  const chapters = {
    1: { kicker: "第一章", title: "滞留", objective: "邮政局长究竟死于何时？", target: 6 },
    2: { kicker: "第二章", title: "三封信", objective: "让三封无法阅读的信重新开口。", target: 3 },
    3: { kicker: "第三章", title: "管道与冷库", objective: "谁偷走了尸体的一天？", target: 4 },
    4: { kicker: "第四章", title: "真相", objective: "用六个回答还原并不存在的谋杀。", target: 6 }
  };

  const sceneData = {
    exterior: {
      name: "魏瑟堡邮局", sub: "雾中的石阶", image: "assets/images/exterior.webp", chapter: 1,
      hotspots: [
        { id: "cat", x: 67, y: 52, w: 14, h: 33, title: "橘猫", action: "cat" },
        { id: "car", x: 13, y: 54, w: 25, h: 30, title: "抛锚汽车", text: "散热器已经凉透。有人故意把车停在唯一一条出镇的路上。" },
        { id: "doorway", x: 58, y: 27, w: 22, h: 44, title: "邮局大门", text: "门半开着。雾沿石阶爬进门厅，像一封没有收件人的信。" }
      ]
    },
    deadroom: {
      name: "死信室", sub: "地下室 · 案发现场", image: "assets/images/deadroom.webp", chapter: 1,
      hotspots: [
        { id: "corpse", x: 29, y: 48, w: 36, h: 43, title: "赫尔曼的尸体", action: "clue", clue: "c_lividity", glyph: "♙", copy: "面部朝下，但尸斑集中在背侧。死亡后的很长时间里，他并不是这样趴着。", knowledge: "尸斑一旦固定，不会随着尸体后来翻转而完全改变。" },
        { id: "door", x: 0, y: 19, w: 19, h: 66, title: "内侧门闩", action: "clue", clue: "c_latch", glyph: "▰", copy: "插销确实落在内侧，但木孔边缘留有极细的切割痕，像被线绳牵动过。" },
        { id: "window", x: 22, y: 0, w: 28, h: 34, title: "钉死的高窗", action: "clue", clue: "c_window", glyph: "▦", copy: "木板从室内钉死，钉头锈迹完整。这里不是出入口。" },
        { id: "vent", x: 58, y: 0, w: 31, h: 34, title: "通风管", action: "clue", clue: "c_vent", glyph: "⌁", copy: "管径只够通过气流。弯头里却挂着一小段透明钓线。" },
        { id: "tea", x: 58, y: 34, w: 17, h: 18, title: "凉茶", action: "clue", clue: "c_tea", glyph: "♨", copy: "茶早已凉透，杯底有少量镇静剂沉淀。但死者胃里没有对应成分。" },
        { id: "floor", x: 37, y: 71, w: 33, h: 26, title: "石地与头部", action: "clue", clue: "c_rigor", glyph: "✢", copy: "后枕部伤口符合跌倒撞击桌角。四肢僵硬程度却比报案时间早了近一天。", knowledge: "低温会显著延缓尸僵消退和腐败，让死亡时间看起来更近。" }
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
        { id: "capsule", x: 67, y: 59, w: 24, h: 28, title: "投递胶囊", action: "clue", clue: "c_capsule", glyph: "◈", copy: "胶囊内壁沾有前一日的蓝色邮戳油墨。那封所谓的临终信，至少被扣留过一夜。" }
      ]
    },
    cold: {
      name: "邮票冷藏库", sub: "地下二层 · 温度 2°C", image: "assets/images/cold-vault.webp", chapter: 3,
      hotspots: [
        { id: "shelf", x: 26, y: 24, w: 48, h: 35, title: "空置长层板", action: "clue", clue: "c_shelf", glyph: "▭", copy: "这一格被清空得过分彻底，长度恰好容纳一个成年人。霜面有织物纤维。" },
        { id: "drag", x: 26, y: 65, w: 49, h: 28, title: "地面拖痕", action: "clue", clue: "c_drag", glyph: "≋", copy: "拖痕从长层板一直通到门外。两道平行刮痕之间的距离与死者肩宽一致。" },
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

  const evidenceNames = {
    c_lividity:"背侧尸斑",c_latch:"门闩线痕",c_window:"钉死高窗",c_vent:"通风管钓线",c_tea:"镇静剂凉茶",c_rigor:"尸僵与伤口",
    e_letterA:"压痕信：冷库",e_letterB:"火漆下的处方",e_letterC:"淀粉墨字条",c_capsule:"隔夜邮戳胶囊",c_shelf:"人体长空层板",c_drag:"冷库拖痕",c_chart:"被改写的温度表",c_hand:"伪造的 h 笔迹"
  };
  const itemNames = { pencil:"铅笔",candle:"短蜡烛",iodine:"碘酒",water:"清水",swab:"棉签",flour:"面粉",gelatin:"明胶片",burner:"酒精灯",diluted:"稀释碘液",gasket:"明胶密封圈",fish:"熏鱼",milk:"牛奶",bread:"黑面包" };
  const itemGlyphs = { pencil:"✎",candle:"♨",iodine:"⚗",water:"◒",swab:"—",flour:"◉",gelatin:"▱",burner:"♨",diluted:"⚗",gasket:"◯",fish:"><>",milk:"▥",bread:"▰" };

  const defaultState = () => ({
    version: 1, started: false, chapter: 1, scene: "deadroom", clock: 460,
    clues: [], inventory: [], knowledge: [], flags: {}, selected: null,
    hints: {1:0,2:0,3:0,4:0}, mistakes: 0, actions: 0, catFeeds: 0,
    radioSteps: 0, ending: false, supportTriggered: false
  });
  let state = defaultState();
  let audio = { ctx:null, hum:null, enabled:false };
  let dialogueQueue = [];
  let toastTimer;

  const $ = (id) => document.getElementById(id);
  const els = {};
  ["title-screen","game-screen","continue-game","chapter-kicker","chapter-title","scene-image","hotspots","scene-number","scene-name","scene-subtitle","objective-text","objective-progress","game-clock","location-nav","evidence-list","evidence-count","knowledge-list","inventory-list","dialogue","dialogue-speaker","dialogue-text","dialogue-next","modal-backdrop","detail-modal","detail-kicker","detail-title","detail-visual","detail-copy","detail-actions","notebook-modal","notebook-objectives","suspect-notes","hint-modal","hint-text","support-modal","support-btn","sound-btn","menu-modal","ending-modal","ending-title","ending-copy","ending-stats","toast"].forEach(id=>els[id.replaceAll("-","_")]=$(id));

  function save(){ localStorage.setItem(SAVE_KEY, JSON.stringify(state)); }
  function load(){ try{ const parsed=JSON.parse(localStorage.getItem(SAVE_KEY)); if(parsed&&parsed.version===1) state=Object.assign(defaultState(),parsed); }catch{} }
  function reset(){ localStorage.removeItem(SAVE_KEY); state=defaultState(); }
  function hasItem(id){ return state.inventory.includes(id); }
  function addItem(id){ if(!hasItem(id)){ state.inventory.push(id); toast(`取得：${itemNames[id]}`,"success"); } }
  function addClue(id,knowledge){ if(!state.clues.includes(id)){ state.clues.push(id); if(knowledge&&!state.knowledge.includes(knowledge))state.knowledge.push(knowledge); tick(12); toast(`证物登记：${evidenceNames[id]||id}`,"success"); } }
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
    s.hotspots.forEach(h=>{ const b=document.createElement("button");b.className="hotspot"+(isHotspotDone(h)?" done":"");b.style.cssText=`left:${h.x}%;top:${h.y}%;width:${h.w}%;height:${h.h}%`;b.title=h.title;b.setAttribute("aria-label",h.title);b.onclick=()=>activate(h);els.hotspots.appendChild(b); });
  }
  function isHotspotDone(h){
    return (h.clue&&state.clues.includes(h.clue))||(h.action&&state.flags[h.action])||(h.item&&hasItem(h.item));
  }
  function renderEvidence(){
    els.evidence_list.innerHTML=""; els.evidence_count.textContent=`${state.clues.length} / 24`;
    state.clues.forEach((id,i)=>{ const b=document.createElement("button");b.className="evidence-card";b.innerHTML=`<b>${String(i+1).padStart(2,"0")}</b><span>${evidenceNames[id]||id}</span>`;b.onclick=()=>showEvidence(id);els.evidence_list.appendChild(b); });
    if(!state.clues.length)els.evidence_list.innerHTML='<p style="font-size:10px;padding:8px">现场尚未登记证物。</p>';
  }
  function renderKnowledge(){ els.knowledge_list.innerHTML=state.knowledge.length?state.knowledge.map(x=>`<p>${x}</p>`).join(""):"<p>尚无记录</p>"; }
  function renderInventory(){
    els.inventory_list.innerHTML="";
    if(!state.inventory.length){els.inventory_list.innerHTML='<p class="empty-inventory">道具会收进这只旧木匣。</p>';return;}
    state.inventory.forEach(id=>{const b=document.createElement("button");b.className="inventory-item"+(state.selected===id?" selected":"");b.dataset.glyph=itemGlyphs[id]||"◆";b.textContent=itemNames[id]||id;b.title=`选择${itemNames[id]}`;b.onclick=()=>{state.selected=state.selected===id?null:id;renderInventory();toast(state.selected?`已选择：${itemNames[id]}`:"已放回物品");};els.inventory_list.appendChild(b);});
  }
  function goScene(id){ if(!availableScenes().includes(id))return; state.scene=id;tick(4);closeAll();render(); }

  function activate(h){
    clickSound();
    if(h.text){showDetail(h.title,h.text,"⌕");return;}
    const actions={clue:()=>inspectClue(h),take:()=>takeItem(h),cat:catAction,letterA:letterA,letterB:letterB,letterC:letterC,drawer:openDrawer,experiment:experiment,radio:radio,deadletters,medical,suitcase,gasket,valve,chart,deduction};
    (actions[h.action]||(()=>showDetail(h.title,"没有更多可观察的细节。","·")))();
  }
  function inspectClue(h){
    showDetail(h.title,h.copy,h.glyph,[{label:state.clues.includes(h.clue)?"已登记":"登记为证物",primary:true,run:()=>{addClue(h.clue,h.knowledge);closeAll();afterClue();render();}}]);
  }
  function afterClue(){
    if(state.chapter===1&&progress()===6&&!state.flags.ch1Ready){state.flags.ch1Ready=true;dialogue(["艾达|尸体被移动过，房间却没有藏人的出口。密室不是为了藏凶手，而是为了藏时间。","玛戈|父亲的办公室里还有三封没有寄出的信。也许……你该看看。"],()=>advanceChapter(2,"office"));}
    if(state.chapter===3){state.flags.coldSolved=state.clues.includes("c_shelf")&&state.clues.includes("c_drag");checkChapter3();}
  }
  function takeItem(h){
    showDetail(h.title,h.copy,h.glyph,[{label:hasItem(h.item)?"已经取过":"收进物品匣",primary:true,run:()=>{addItem(h.item);closeAll();render();}}]);
  }
  function openDrawer(){
    const first=!state.flags.drawer;showDetail("半开的抽屉",first?"抽屉里有一支扁平木工铅笔、一截短蜡烛、半块黑面包和一张写着『先让纸说话』的便笺。":"抽屉已经空了。","▤",[{label:first?"取走物品":"合上抽屉",primary:true,run:()=>{if(first){["pencil","candle","bread"].forEach(addItem);state.flags.drawer=true;}closeAll();render();}}]);
  }
  function letterA(){
    if(state.flags.letterA){showDetail("信 A · 已显影","铅笔石墨让压痕显出：『冷库并不是只保存邮票。』","✎");return;}
    const ok=hasItem("pencil");showDetail("信 A · 空白压痕",ok?"纸面无墨，却能从侧光看见上一张纸留下的凹痕。":"纸面似乎完全空白，斜着看却有细小的沟槽。需要一种不会弄湿纸面的办法。","▧",ok?[{label:"用铅笔侧锋轻擦",primary:true,run:()=>solveLetter("letterA","e_letterA","石墨掠过纸面，凹痕显出一句话：『冷库并不是只保存邮票。』","纸张压痕可用柔软石墨侧锋显现。",()=>{})}]:[]);
  }
  function letterB(){
    if(state.flags.letterB){showDetail("信 B · 已显影","温热软化火漆，下面压着半张镇静剂处方。","◉");return;}
    if(!hasItem("candle")&&!hasItem("burner")){showDetail("信 B · 火漆封面","厚火漆遮住纸面。直接撬会撕毁下面的薄纸，也许可以让它缓慢变软。","◉");return;}
    showDetail("信 B · 控制火焰","火漆需要受热，但纸不能烧焦。把火焰放在哪里？","♨",[
      {label:"紧贴火焰",run:()=>wrong("火漆冒烟，纸边发黑。幸好及时移开。")},
      {label:"两指宽的距离",primary:true,run:()=>solveLetter("letterB","e_letterB","火漆缓慢变软，完整揭下。下面是哈斯医生开给玛戈母亲的镇静剂处方残片。","火漆受温和间接热可逆软化。")},
      {label:"放在窗边等",run:()=>wrong("十一月的冷风只会让火漆更脆。")}
    ]);
  }
  function letterC(){
    if(state.flags.letterC){showDetail("信 C · 已显影","稀释碘液与淀粉墨反应，显出蓝字：『处方不是死因。去问温度。』","⚗");return;}
    if(!hasItem("diluted")||!hasItem("swab")){showDetail("信 C · 蓝边纸","纸上有几乎透明的书写痕。实验台或许能配出显色液；直接使用碘酒会污染整封信。","▧");return;}
    showDetail("信 C · 淀粉墨","稀释后的碘液已经调好。棉签能让液体只经过可疑笔画。","⚗",[{label:"用棉签薄涂",primary:true,run:()=>solveLetter("letterC","e_letterC","纸面浮出深蓝字：『处方不是死因。去问温度。』","碘遇淀粉会形成蓝黑色复合物。",()=>{state.inventory=state.inventory.filter(x=>x!=="diluted");})}]);
  }
  function solveLetter(flag,clue,copy,knowledge,after){
    state.flags[flag]=true;addClue(clue,knowledge);if(after)after();closeAll();dialogue([`艾达|${copy}`],()=>{maybeSupport();checkChapter2();render();});
  }
  function maybeSupport(){
    if(state.flags.letterA&&state.flags.letterB&&!state.supportTriggered){state.supportTriggered=true;save();setTimeout(()=>{if(localStorage.getItem(SUPPORT_SEEN)!=="1")openSupport(true);},500);}
  }
  function checkChapter2(){ if(["letterA","letterB","letterC"].every(x=>state.flags[x])&&!state.flags.ch2Ready){state.flags.ch2Ready=true;dialogue(["艾达|三封信指向同一件事：温度、处方与投递时间都被人安排过。","维克托|地下控制室的气动管昨夜坏了。密封圈像是被故意割开的。"],()=>advanceChapter(3,"tube"));} }
  function experiment(){
    if(state.chapter===2&&!hasItem("diluted")){
      showDetail("显色液实验","碘酒必须稀释。选择要放进玻璃杯的材料。","⚗",[
        {label:"碘酒 + 清水",primary:true,run:()=>{if(hasItem("iodine")&&hasItem("water")){addItem("diluted");state.knowledge.push("浓碘液会遮住笔迹；稀释后才能辨认淀粉墨的线条。");closeAll();render();}else wrong("还没有拿齐碘酒和清水。")}},
        {label:"碘酒 + 面粉",run:()=>wrong("混合物立刻变成深蓝糊状，无法用于纸面。")},
        {label:"清水 + 柠檬",run:()=>wrong("没有任何显色反应。")}
      ]);return;
    }
    if(state.chapter>=3&&!hasItem("gasket")){
      showDetail("明胶密封圈","旧维修册的图示表明：干明胶吸水后，加热可以倒进模具重新塑形。","◯",[
        {label:"明胶 + 水 + 加热",primary:true,run:()=>{if(hasItem("gelatin")&&hasItem("water")&&hasItem("burner")){addItem("gasket");state.flags.gasketMade=true;state.knowledge.push("明胶受热溶解、冷却凝固，可制作临时气密垫圈。");closeAll();render();}else wrong("还缺少明胶片、清水或稳定热源。")}},
        {label:"面粉 + 碘酒 + 加热",run:()=>wrong("得到的是蓝色浆糊，不会形成有弹性的密封圈。")},
        {label:"蜡烛油直接浇模",run:()=>wrong("蜡太脆，受压后会立刻开裂。")}
      ]);return;
    }
    showDetail("实验台","能做的实验都已经完成。烧杯底部留着一圈深蓝色。","⚗");
  }
  function gasket(){
    if(state.flags.gasketInstalled){showDetail("新密封圈","明胶圈已经贴合阀门，管道恢复气密。","◯");return;}
    if(!hasItem("gasket")){showDetail("破损密封圈","橡胶圈被割开，气动管无法建立压力。实验台上也许能制作一个可逆的临时替代品。","◯");return;}
    showDetail("破损密封圈","明胶圈大小与瓶盖模具完全一致。","◯",[{label:"安装明胶密封圈",primary:true,run:()=>{state.flags.gasketInstalled=true;tick(18);closeAll();render();}}]);
  }
  function valve(){
    if(!state.flags.gasketInstalled){showDetail("延时阀","管道漏气，阀门转动也不会输送胶囊。先修复密封圈。","⌾");return;}
    showDetail("延时阀","四个刻度分别对应立即、六小时、十二小时、二十四小时。死者的信带着前一日邮戳，却在今晨落下。","⌾",[
      {label:"立即",run:()=>wrong("这无法解释前一日的邮戳。")},{label:"6 小时",run:()=>wrong("投递时间仍然晚了整整十八小时。")},{label:"12 小时",run:()=>wrong("还差半天。")},{label:"24 小时",primary:true,run:()=>{state.flags.tubeSolved=true;addClue("c_capsule");closeAll();dialogue(["艾达|有人在昨晨把伪造的信装进胶囊，把阀门转到二十四小时。于是死人今天才『寄出』了信。"],()=>{checkChapter3();render();});}}
    ]);
  }
  function chart(){
    if(state.flags.chartSolved){showDetail("温度记录表","11月17日的『12°C』由原本的『2°C』添写而成，h 的收笔与玛戈登记簿一致。","▤");return;}
    const ready=state.clues.includes("c_shelf")&&state.clues.includes("c_drag");
    showDetail("温度记录表",ready?"表格中『12°C』的数字 1 墨色较新。冷库拖痕和空层板说明低温不是偶然。":"有一格温度被改写，但单看表格还不能说明改写是为了什么。","▤",ready?[{label:"登记被改写的 2°C",primary:true,run:()=>{state.flags.chartSolved=true;addClue("c_chart","2°C冷藏约24小时，会让尸僵和腐败表现整体推迟。");closeAll();checkChapter3();render();}}]:[]);
  }
  function handwriting(){
    showDetail("笔迹比对","伪造信、温度表与玛戈的护士登记簿里，小写 h 都有向左回钩的收笔。","h",[{label:"确认同一书写者",primary:true,run:()=>{state.flags.handSolved=true;addClue("c_hand");closeAll();checkChapter3();render();}}]);
  }
  function checkChapter3(){
    state.flags.coldSolved=state.clues.includes("c_shelf")&&state.clues.includes("c_drag");
    if(["tubeSolved","coldSolved","chartSolved","handSolved"].every(x=>state.flags[x])&&!state.flags.ch3Ready){state.flags.ch3Ready=true;dialogue(["艾达|密室、伪信、冷库和处方都不是杀人手段。它们是一场把意外伪装成谋杀的戏。","玛戈|如果我告诉你真相，你会先听完吗？"],()=>advanceChapter(4,"finale"));}
  }

  const deductions = [
    {q:"赫尔曼的直接死因是什么？",a:"争执中跌倒，后枕撞上桌角",opts:["哈斯注射毒药","争执中跌倒，后枕撞上桌角","维克托用手杖击打"]},
    {q:"玛戈为何怀疑哈斯医生？",a:"她误读母亲旧处方，以为哈斯误诊致死",opts:["她欠哈斯一笔钱","她误读母亲旧处方，以为哈斯误诊致死","她受维克托指使"]},
    {q:"尸体为何显得刚死不久？",a:"曾在2°C冷库停放约24小时",opts:["茶中镇静剂减慢腐败","曾在2°C冷库停放约24小时","地下室一直开窗"]},
    {q:"门闩如何在室外落下？",a:"钓线穿过通风管牵动插销",opts:["有人躲在邮袋里","门锁有第二把钥匙","钓线穿过通风管牵动插销"]},
    {q:"处方残片与镇静剂茶是谁布置的？",a:"玛戈，为了把怀疑引向哈斯",opts:["赫尔曼生前自行留下","玛戈，为了把怀疑引向哈斯","维克托为偷邮票布置"]},
    {q:"死者今晨寄出的信如何出现？",a:"玛戈伪造后用延时阀扣留24小时",opts:["赫尔曼预先写好定时投递","哈斯从镇外寄回","玛戈伪造后用延时阀扣留24小时"]}
  ];
  function deduction(){
    const step=state.flags.deductionStep||0;if(step>=deductions.length){finish();return;}
    const d=deductions[step];showDetail(`推理 ${step+1} / 6`,d.q,"?",d.opts.map(o=>({label:o,primary:o===d.a,run:()=>{if(o===d.a){state.flags.deductionStep=step+1;tick(15);closeAll();toast("推理成立","success");if(step+1===6)setTimeout(finish,500);else setTimeout(deduction,350);render();}else wrong("这项解释与至少一件已确认物证矛盾。",true);}})));
  }
  function finish(){
    state.ending=true;save();closeAll();
    els.ending_title.textContent="无人谋杀赫尔曼·福格尔";
    els.ending_copy.innerHTML="赫尔曼在与养女玛戈的争执中意外跌倒身亡。玛戈没有杀他，却因对母亲旧病历的误解，把尸体藏进冷库、伪造处方与死信，并用钓线制造密室，企图让哈斯医生承担谋杀罪。<br><br>真正被谋杀的，是事实本来可以拥有的形状。";
    const eggs=(state.flags.catLetter?1:0)+(state.flags.radioEgg?1:0)+(state.flags.suitcaseEgg?1:0);
    els.ending_stats.innerHTML=`<div><b>${state.clues.length}</b><span>登记证物</span></div><div><b>${state.mistakes}</b><span>错误尝试</span></div><div><b>${eggs} / 3</b><span>隐藏档案</span></div>`;
    openModal("ending-modal");
  }

  function catAction(){
    if(state.flags.catLetter){showDetail("邮差 · 橘猫","它已经把那封旧情书交给你，现在正假装从未认识你。","♘");return;}
    const feed=state.chapter===1?"fish":state.chapter===2?"milk":"bread";
    if(!hasItem(feed)){
      if(feed==="fish"){addItem("fish");showDetail("橘猫","它盯着抛锚汽车旁的熏鱼包。看来你应该先把鱼捡起来。","♘",[{label:"把熏鱼递给它",primary:true,run:()=>{state.catFeeds++;state.inventory=state.inventory.filter(x=>x!=="fish");closeAll();render();}}]);}
      else if(feed==="milk"){addItem("milk");showDetail("橘猫","门房窗台有一小瓶牛奶。它显然认为那是给自己的。","♘",[{label:"倒出牛奶",primary:true,run:()=>{state.catFeeds++;state.inventory=state.inventory.filter(x=>x!=="milk");closeAll();render();}}]);}
      else showDetail("橘猫","它用爪子点了点你的物品匣。也许黑面包还留着。","♘");
      return;
    }
    state.catFeeds++;state.inventory=state.inventory.filter(x=>x!==feed);
    if(state.catFeeds>=3){state.flags.catLetter=true;showDetail("橘猫邮差","第三次吃完后，它从门垫下拖出一封1914年的旧情书。收件人是『未能回家的阿黛尔』。信末有一个系列印记：CASE 02 · 橡树下。","✉");}
    else{showDetail("橘猫","它接受了食物，尾巴在石阶上敲了三下。","♘");}
    render();
  }
  function radio(){
    if(state.flags.radioEgg){showDetail("短波收音机","静电里仍循环着摩斯电码：『月亮升起时，老橡树下见。』","◉");return;}
    const steps=["长 · 短短 · 长","短 · 长长 · 短","长长 · 短 · 短"];const correct=[1,0,2];const k=state.radioSteps;
    const choices=steps.map((x,i)=>({
      label:x,
      run:()=>{
        if(i===correct[k]){
          state.radioSteps++;closeAll();
          if(state.radioSteps===3){
            state.flags.radioEgg=true;
            dialogue(["收音机|——月亮升起时，老橡树下见。——","艾达|这不是气象电台。像是下一宗案子留下的约会。"],render);
          }else setTimeout(radio,250);
        }else{
          state.radioSteps=0;
          wrong("频率滑回起点。三组节拍必须连续正确。",true);
        }
      }
    }));
    showDetail("短波调频",`旋钮下方刻着第 ${k+1} 组节拍。选择与静电声相同的波形。`,`◉`,choices);
  }
  function deadletters(){
    const stories=["一封寄给1912年的自己：『不要搭上星期四的船。』","一张没有地址的明信片，只画着一棵被劈成两半的橡树。","一封儿童笔迹的信：『妈妈说死人不会回信，可邮差先生回了。』","一只空信封，打开后能闻到遥远海港的盐味。"];
    const i=(state.actions+state.clues.length)%stories.length;showDetail("随机死信",stories[i],"✉");
  }
  function suitcase(){
    if(state.flags.suitcaseEgg){showDetail("维克托的手提箱","暗格已经打开。里面的护照分别把他称作商人、记者和『野兔七号』。","▣");return;}
    showDetail("维克托的手提箱","三枚邮票按王冠、乌鸦、橡树排列。箱扣也有三枚图案。","▣",[
      {label:"王冠 → 乌鸦 → 橡树",primary:true,run:()=>{state.flags.suitcaseEgg=true;closeAll();dialogue(["维克托|邮票商只是其中一份职业。","艾达|那另外两份呢？","维克托|一份不能说。另一份已经不存在了。"],render);}},
      {label:"乌鸦 → 橡树 → 王冠",run:()=>wrong("锁扣弹回原位。")},{label:"橡树 → 王冠 → 乌鸦",run:()=>wrong("锁扣弹回原位。")}
    ]);
  }
  function medical(){
    if(state.chapter>=3&&!state.flags.handSolved){showDetail("法医学手册","书页夹着玛戈的护士登记簿。她的小写 h 总在末端向左回钩，正适合和温度表、伪造信比对。","☤",[{label:"进行三份笔迹比对",primary:true,run:handwriting}]);}
    else showDetail("法医学手册","书中强调：低温改变尸体变化的速度，却不会改变原始伤口和已经固定的尸斑。页边写着：『温度说谎，伤口不说。』","☤");
  }

  function advanceChapter(n,scene){ state.chapter=n;state.scene=scene;state.selected=null;tick(25);closeAll();save();render();toast(`进入${chapters[n].kicker}：${chapters[n].title}`,"success"); }
  function showEvidence(id){ showDetail(evidenceNames[id]||id,"这件证物已经封入牛皮纸袋，并记录在艾达的调查簿中。","◆"); }
  function showDetail(title,copy,glyph="◆",actions=[]){
    els.detail_kicker.textContent="现场观察";els.detail_title.textContent=title;els.detail_copy.innerHTML=copy;els.detail_visual.innerHTML=`<span class="object-glyph">${glyph}</span>`;els.detail_actions.innerHTML="";
    actions.forEach(a=>{const b=document.createElement("button");b.className="ink-button"+(a.primary?" primary":"");b.textContent=a.label;b.onclick=a.run;els.detail_actions.appendChild(b);});openModal("detail-modal");
  }
  function wrong(message,keep=false){state.mistakes++;tick(5);toast(message,"warning");if(!keep)closeAll();render();}
  function toast(message,type=""){clearTimeout(toastTimer);els.toast.textContent=message;els.toast.className=`toast ${type}`;toastTimer=setTimeout(()=>els.toast.classList.add("hidden"),2600);}
  function openModal(id){els.modal_backdrop.classList.remove("hidden");$(id).classList.remove("hidden");}
  function closeAll(){["detail-modal","notebook-modal","hint-modal","support-modal","menu-modal","ending-modal"].forEach(id=>$(id).classList.add("hidden"));els.modal_backdrop.classList.add("hidden");}
  function dialogue(lines,done){dialogueQueue=lines.map(x=>{const i=x.indexOf("|");return [x.slice(0,i),x.slice(i+1)];});showNextDialogue(done);}
  function showNextDialogue(done){
    const next=dialogueQueue.shift();if(!next){els.dialogue.classList.add("hidden");els.dialogue_next.onclick=null;if(done)done();return;}
    els.dialogue_speaker.textContent=next[0];els.dialogue_text.textContent=next[1];els.dialogue.classList.remove("hidden");els.dialogue_next.onclick=()=>showNextDialogue(done);
  }

  const hints={
    1:["把尸体姿势、尸斑位置和僵硬程度分开看。","死信室里有六个观察点：尸体、门闩、高窗、通风管、茶杯和地面伤口。","尸斑在背侧却面朝下，说明尸体先仰躺很久；低温又让尸僵看起来比实际更新。"],
    2:["三封信分别需要『压力』『温度』『化学反应』。","A用铅笔侧锋；B用火焰隔两指温热；C先在实验台把碘酒加水稀释，再用棉签。","先打开办公室抽屉拿铅笔和蜡烛，再去配药间拿碘酒、水、棉签。"],
    3:["要证明少了一天，需要同时修好管道、检查冷库、还原温度并比对笔迹。","明胶＋水＋酒精灯可制密封圈；延时阀应设为24小时。冷库需要检查空层板、拖痕和温度表。","在实验台制明胶圈→装到管道→选24小时；冷库登记两处痕迹后检查温度表；最后在法医学手册里比对笔迹。"],
    4:["每个回答都必须能同时解释物证，而不是只解释某个人的动机。","顺序是：意外跌倒→误读母亲处方→冷藏24小时→钓线门闩→玛戈布置处方与茶→延时管伪信。","点击场景中央『重建案情』，依次选择上述六项。"]
  };
  function openHint(){const n=Math.min(state.hints[state.chapter]||0,2);els.hint_text.textContent=hints[state.chapter][n];$("next-hint").textContent=n>=2?"这是最具体的提示":"再具体一点";openModal("hint-modal");}
  function nextHint(){state.hints[state.chapter]=Math.min((state.hints[state.chapter]||0)+1,2);save();openHint();}
  function openNotebook(){
    const entries=Object.values(chapters).map((c,i)=>{const n=i+1,done=state.chapter>n||state.ending;return `<div class="note-entry ${done?"complete":""}"><b>${c.kicker} · ${c.objective}</b><p>${n<=state.chapter?`${n===state.chapter?"正在调查":"已经解决"} · ${n===state.chapter?progress()+" / "+c.target:c.target+" / "+c.target}`:"尚未开启"}</p></div>`;}).join("");
    els.notebook_objectives.innerHTML=entries;
    els.suspect_notes.innerHTML=`<div class="note-entry"><b>玛戈·福格尔</b><p>养女兼护士。保护死者的语气过于坚决，熟悉处方与冷库。</p></div><div class="note-entry"><b>利奥波德·哈斯</b><p>医生。旧处方让他显得可疑，但镇静剂并未进入死者胃部。</p></div><div class="note-entry"><b>维克托·莱茵</b><p>邮票商。身份不止一种，却似乎更关心冷库里的邮票。</p></div>`;openModal("notebook-modal");
  }
  function openSupport(auto=false){localStorage.setItem(SUPPORT_SEEN,"1");openModal("support-modal");if(auto)toast("这次提示只会自动出现一次");}

  function start(newGame=false){if(newGame)reset();else load();state.started=true;els.title_screen.classList.add("hidden");els.game_screen.classList.remove("hidden");render();if(newGame)dialogue(["艾达|赫尔曼面朝下倒在地上。门闩从内部落下，窗户也被钉死。","玛戈|昨晚十点我还听见他在整理死信。今晨七点，门再也打不开。","艾达|先别告诉我谁可疑。让房间自己说。"]);}
  function backTitle(){closeAll();els.game_screen.classList.add("hidden");els.title_screen.classList.remove("hidden");els.continue_game.classList.toggle("hidden",!localStorage.getItem(SAVE_KEY));}

  function initAudio(){
    if(audio.ctx){audio.enabled=!audio.enabled;if(audio.enabled)audio.ctx.resume();else audio.ctx.suspend();updateSound();return;}
    const Ctx=window.AudioContext||window.webkitAudioContext;if(!Ctx)return;audio.ctx=new Ctx();const osc=audio.ctx.createOscillator(),gain=audio.ctx.createGain();osc.type="sine";osc.frequency.value=54;gain.gain.value=.016;osc.connect(gain).connect(audio.ctx.destination);osc.start();audio.hum=osc;audio.enabled=true;updateSound();
  }
  function clickSound(){if(!audio.ctx||!audio.enabled)return;const o=audio.ctx.createOscillator(),g=audio.ctx.createGain();o.type="triangle";o.frequency.setValueAtTime(240,audio.ctx.currentTime);o.frequency.exponentialRampToValueAtTime(120,audio.ctx.currentTime+.06);g.gain.setValueAtTime(.035,audio.ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.ctx.currentTime+.07);o.connect(g).connect(audio.ctx.destination);o.start();o.stop(audio.ctx.currentTime+.08);}
  function updateSound(){$("sound-btn").innerHTML=`${audio.enabled?"◖":"×"} <span>${audio.enabled?"声音":"静音"}</span>`;}

  function bind(){
    $("new-game").onclick=()=>start(true);els.continue_game.onclick=()=>start(false);els.continue_game.classList.toggle("hidden",!localStorage.getItem(SAVE_KEY));
    $("title-sound").onclick=initAudio;$("sound-btn").onclick=initAudio;$("notebook-btn").onclick=openNotebook;$("hint-btn").onclick=openHint;$("next-hint").onclick=nextHint;$("support-btn").onclick=()=>openSupport(false);$("menu-btn").onclick=()=>openModal("menu-modal");
    $("support-done").onclick=()=>{localStorage.setItem(SUPPORT_PAID,"1");closeAll();toast("谢谢你让这间死信室继续亮着灯 ♡","success");render();};$("support-later").onclick=closeAll;
    $("resume-game").onclick=closeAll;$("reset-game").onclick=()=>{if(confirm("确定清除当前调查进度并重新开始吗？"))start(true);};$("back-title").onclick=backTitle;$("ending-restart").onclick=()=>start(true);
    $("inventory-prev").onclick=()=>els.inventory_list.scrollBy({left:-210,behavior:"smooth"});$("inventory-next").onclick=()=>els.inventory_list.scrollBy({left:210,behavior:"smooth"});
    document.querySelectorAll("[data-close]").forEach(b=>b.onclick=closeAll);els.modal_backdrop.onclick=closeAll;
    document.addEventListener("keydown",e=>{if(e.key==="Escape")closeAll();});
  }

  window.__DEAD_LETTER_TEST__ = {
    reset:()=>{reset();return state;}, state:()=>JSON.parse(JSON.stringify(state)),
    solveChapter1:()=>{["c_lividity","c_latch","c_window","c_vent","c_tea","c_rigor"].forEach(addClue);state.chapter=2;state.scene="office";render();},
    solveChapter2:()=>{["letterA","letterB","letterC"].forEach(x=>state.flags[x]=true);["e_letterA","e_letterB","e_letterC"].forEach(addClue);state.chapter=3;state.scene="tube";render();},
    solveChapter3:()=>{["tubeSolved","coldSolved","chartSolved","handSolved"].forEach(x=>state.flags[x]=true);state.chapter=4;state.scene="finale";render();},
    finish:()=>{state.flags.deductionStep=6;finish();return state;}
  };
  bind();load();
})();
