(() => {
  "use strict";

  const SAVE_KEY = "dead-letter-room-save-v7";
  const LEGACY_KEYS = ["dead-letter-room-save-v6","dead-letter-room-save-v5","dead-letter-room-save-v4","dead-letter-room-save-v3","dead-letter-room-save-v2","dead-letter-room-save-v1"];
  const META_KEY = "dead-letter-room-meta-v1";
  const SUPPORT_PAID = "dead-letter-room-support-paid";
  const $ = id => document.getElementById(id);
  const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];

  const chapters = {
    1:{kicker:"第一章",title:"滞留",objective:"先记录现场事实，不急着替它们解释。",target:6},
    2:{kicker:"第二章",title:"三封信",objective:"让三封无法阅读的信重新开口，并确认每一种处理方法都有来源。",target:3},
    3:{kicker:"第三章",title:"隔夜",objective:"复现气动管的隔夜延时，并确认低温如何干扰死亡时间判断。",target:4},
    4:{kicker:"第四章",title:"无法投递",objective:"用六组证据关系重建11月17日的最后一小时。",target:6}
  };

  const storySequences = {
    opening:{register:"WEISSBURG POSTAL DISTRICT · 18 NOV 1927",folio:"INTERLUDE 01",kicker:"案卷间页 · 07:40",heading:"雾停在门外",button:"进入死信室",lines:[
      "雾在魏瑟堡的石阶上停了一夜，清晨七点四十分还没有散。",
      "邮局地下一层，一扇从内侧闩住的门后，赫尔曼·福格尔倒在成堆的死信旁。",
      "十九年前，赫尔曼在一座雨站台上把一个无人来接的女孩带回邮局。此后很多年，她住在他家里，却始终习惯叫他“局长”。",
      "艾达·克莱因没有先问谁像凶手。她翻开调查簿，第一页只写了四个字：先记事实。"
    ]},
    chapter1:{register:"CASE 17—B · FIELD NOTE",folio:"INTERLUDE 02",kicker:"第一章之后 · 地下楼梯",heading:"三只没有邮戳的信封",button:"去局长办公室",lines:[
      "证物袋沿墙排开。尸斑、门闩、钓线、凉茶——艾达没有在任何一张标签上写“所以”。",
      "玛戈一直等在楼梯拐角。她问的第一句话不是尸体，而是赫尔曼桌上的《雪落以前》。",
      "“昨晚他念到一半。”她低头揉着袖口，“然后我们就吵起来了。”",
      "办公室的磨砂玻璃后，三只没有邮戳的信封并排压在台灯下。处理旧纸需要方法，而方法也必须有出处。"
    ]},
    chapter2:{register:"PRIVATE MAIL · INDEX 17—B",folio:"INTERLUDE 03",kicker:"第二章之后 · 局长办公室",heading:"墙里的呼吸",button:"去气动管控制室",lines:[
      "三封信终于能读了。压痕、处方、隐写补注没有直接给出凶手，只把十九年前那个被水洗掉的小数点重新放回桌面。",
      "墙里的气动管就在这时响了一声。黄铜胶囊撞进接收槽，在安静的办公室里显得格外突兀。",
      "维克托拆开漏气的检修盖，按维修册把夹箍重新压紧：“我只恢复到能低压复现的程度。别让我替你们推理。”",
      "艾达看着胶囊内壁的旧蓝墨。下一步不是修机器，而是验证：什么样的机械延时，能让昨夜的东西到今晨才出现。"
    ]},
    chapter3:{register:"COLD VAULT · TEMPERATURE LOG",folio:"INTERLUDE 04",kicker:"第三章之后 · 冷库门口",heading:"冷库门外",button:"开始重建案情",lines:[
      "冷库门一开，霜气贴着地面慢慢散出来。层板纤维、拖痕和被覆写的温度记录各自只说一件事。",
      "玛戈站在门外。她没有进来，只盯着温度表上那个后来加上去的“1”。",
      "艾达把调查簿翻到新的一页。此前所有结论都只是临时归类；现在才轮到证物彼此说话。",
      "没有任何一件证物能独自解决这桩案子。"
    ]}
  };

  const caseFragments = {
    exterior:{title:"门房老奥托记得的，是一盏总比别人晚熄的灯",source:"2007 年口述档案补录",copy:"老奥托在邮局做了三十一年门房。只有局长办公室常常比别处晚熄半个钟头。最后那一夜为什么一直亮到清晨，他没有机会再问。"},
    deadroom:{title:"裁缝铺十月账页：左胸内衬只补了一半",source:"施耐德裁缝铺 · 1927.10",copy:"赫尔曼坚持保留制服左胸那块旧内衬，只补裂口。账页边上写着：‘旧布保留，结藏夹层。’"},
    office:{title:"艾尔莎记得，玛戈小时候总在高柜旁写作业",source:"艾尔莎·克劳斯退休访谈 · 1958",copy:"玛戈放学后常在高柜旁写作业，写累了就枕着退信袋睡。赫尔曼经过时会把盖邮戳的木槌换到另一张桌子。"},
    lab:{title:"哈斯写小数点时总会停一下",source:"镇医务所清点册",copy:"哈斯写数字很快，只有小数点会停一下，再描得很重。抽屉里有一页练字纸，整页都是‘0.2、0.4、0.6’。"},
    tube:{title:"维克托能凭声音听出哪一段管线在漏气",source:"艾达私人边注",copy:"维克托只做了最低限度的气密恢复，让旧管线能够低压复现。他没有替调查员选择延时档。"},
    cold:{title:"十一月十七日傍晚，玛戈买了两人份早餐",source:"福格尔宅邸杂项袋 · 附件 3",copy:"收据开在18:12：黑麦面包两份、腌李子、咖啡豆。背面写着‘鲜奶一瓶，明早来取’。第二天中午，奶仍在店里。"},
    finale:{title:"艾达调查簿的最后一页，只记了几件很小的事",source:"艾达私人调查簿",copy:"正式结论写完后，她记下玛戈叠好的围巾、哈斯掐灭的半支烟，以及制服破口还能不能补。最下面一句被划掉，只剩‘明早……早餐……’。"}
  };

  const novelPages = {
    1:{title:"雨里的孩子",copy:"小站整夜下雨。女孩等到末班车以后，穿邮政制服的男人把伞举到她头顶：‘先回去把鞋烤干。明天要是还想来，我陪你。’"},
    2:{title:"每年一封",copy:"往后的五年，女孩生日都会收到一封信。男人把信递过去时总把邮戳朝下。多年以后她才发现，那几封信的戳记颜色太相近。"},
    3:{title:"零点六克",copy:"雨把处方的剂量栏洇开。医生多年后重新看那张纸，只说：‘原来那一个点还在。’页边补写：0.6g。"},
    4:{title:"改姓的人",copy:"女孩长大以后改了姓。男人问是不是该改回去，她说不用。那以后，他们仍每天在同一张桌子吃饭，却很少再提雨站台和母亲。"},
    5:{title:"雪落以前",copy:"故事写到女孩推开地下室的门。男人手里握着一封没有封口的信。正文在‘玛戈，其实……’以后断开，只剩被擦掉的两个字：明早。"},
    6:{title:"收件人",copy:"前五页属于安娜。第六页不是。它折成信封大小，缝在赫尔曼制服左胸旧内衬里，封面只写‘玛戈’。"}
  };

  const portalStories = {
    rain:{kicker:"旧案 11—A",title:"雨站台：没有答案也是一种结案",meta:"北窗 · 旧案复盘",copy:["一名乘客在暴雨站台失踪。两张回程票、没有取走的报纸和一只未干的伞把调查拉向三个方向。","七个月后，北窗只写：去向不明。没有足够证据支持犯罪、事故或主动失踪中的任意一种。","‘不知道’不是懒惰。把证据没有说过的话补进去，才是。"]},
    lamp:{kicker:"旧案 04—C",title:"熄灯后的十一分钟",meta:"柯石 · 时间感复盘",copy:["四名证人都说停电‘没多久’，实际差异超过六分钟。","柯石最后没有相信任何人的体感，而是拿外部钟声、茶壶沸腾和配电箱煤灰重建时间。","漂亮的解释不能代替时间锚。"]},
    letter:{kicker:"随笔",title:"有地址的信，也会寄不出去",meta:"灰烬",copy:["地址正确、邮资足够、收件人也存在，有些信仍会失败。","人更容易把‘以后再说’误认为一个稳定的投递系统。","档案里最常见的不是没有写完的信，是写完了却一直放在抽屉里的信。"]},
    mistake:{kicker:"失败记录",title:"我曾因为一句‘他看起来很冷静’把方向查反了",meta:"南桥",copy:["我把‘冷静’当成预谋，把一个人的性格当成证据。","后来一张杂货店小票证明，他只是在隐藏另一件与案件无关的事。","我保留原错误记录，因为新调查员需要知道：推理最危险的时候，往往是你觉得自己特别懂人的时候。"]},
    hermann:{kicker:"人物志",title:"赫尔曼·福格尔",meta:"旧邮政人物志",copy:["他把退信柜最后一格留给‘明天来的那一封’。","玛戈小时候在邮局睡着，他会换一张桌子盖邮戳。","别人问是不是他的女儿，他先说不是，停了一会儿，又说：她叫玛戈。"]},
    anna:{kicker:"人物",title:"安娜·韦伯的五页纸",meta:"小满 · 私人文稿整理",copy:["安娜把未来五年的生日信提前写好。","她写天气、灰雀、烧糊的牛奶，也写女儿左脚鞋带总系得太紧。","她没有写自己还能活多久。"]},
    snow:{kicker:"夜读文库",title:"雪落在没有地址的地方",meta:"匿名投稿",copy:["雪落下来时，每个屋顶都有地址。","只有人在离开以后，会把地址留给还在等的人。"]},
    waiting:{kicker:"随笔",title:"等人的房间",meta:"夜读文库",copy:["房间最像一个人不在时的样子，是桌上还摆着两只杯子。","一只已经凉了，另一只还没有被用过。"]},
    blue:{kicker:"旧案 08—D",title:"蓝窗旅馆的第十三把钥匙",meta:"灰烬 · 档案摘录",copy:["旅馆只有十二间客房，却在柜台上挂着第十三把钥匙。所有人先问‘它开哪间房’，这个问题本身就把调查带偏了。","钥匙真正打开的是旧维护门；废弃送餐井和改造图说明，知道这条路径的人比拥有钥匙的人更重要。","结案边注写：问题不是钥匙有秘密，而是人看见钥匙以后自动替它安排了一扇门。"]},
    ashcase:{kicker:"旧案 13—F",title:"灰烬里没有第三个人",meta:"南桥 · 失败后复核",copy:["火灾现场最初被写成‘至少有第三人在场’，依据只是两组鞋印之间的一块空白。","后续复原证明，那块空白来自屋檐滴水融掉了薄灰。第三个人从来没有被证据支持过。","南桥保留了自己最初的错误箭头，并在旁边写：空白也会诱导人补东西。"]},
    north:{kicker:"前辈手记 · 北窗",title:"‘一定能找到’是一种很昂贵的承诺",meta:"北窗",copy:["有些失踪案最后只剩下一个不够漂亮的结论。","调查员如果为了安慰家属而提前承诺答案，之后很容易把每一条模糊迹象都往承诺上推。","把不知道写成不知道，是对证据和收件人都更诚实。"]},
    south:{kicker:"前辈手记 · 南桥",title:"把我第一次写错的箭头留下来",meta:"南桥",copy:["复盘不是把报告改成‘我一开始就知道’。","我会把错误判断留在页边，因为新人需要看到错误是怎么长出来的：一句性格评价、一个太顺的故事、一次没有验证的联想。"]},
    stone:{kicker:"前辈手记 · 柯石",title:"别告诉我‘没多久’，给我一个会冷掉的东西",meta:"柯石",copy:["证人说‘几分钟’时，我会先看炉火、茶壶、票据和机械钟。","形容词可以留在证词里，时间轴必须另外找锚。","能够被测量的东西，通常比语气更耐用。"]},
    gray:{kicker:"前辈手记 · 灰烬",title:"不要把猜测保存成 final_final2",meta:"灰烬",copy:["档案管理员最怕的不是没有答案，是有人把‘可能’复制到下一版以后忘了删。","待证栏不是垃圾桶，它是防止猜测偷偷变成事实的隔离区。","文件名可以很丑，证据层级不能乱。"]},
    case17:{kicker:"案卷索引",title:"17—B · 六封没有寄出的信",meta:"只读摘要",copy:["1927年11月18日，赫尔曼·福格尔被发现死于地下死信室。","原案结论存在多处时间与密室逻辑冲突。当前页面只保留事实索引，不提前写出复核结论。"]}
  };

  const sceneData = {
    exterior:{name:"魏瑟堡邮局",sub:"雾中的石阶",image:"assets/images/exterior.webp",chapter:1,hotspots:[
      {id:"cat",x:67,y:52,w:14,h:33,title:"橘猫",action:"cat"},
      {id:"car",x:13,y:54,w:25,h:30,title:"抛锚汽车",action:"car"},
      {id:"fishpack",x:15,y:70,w:14,h:12,title:"油纸包",action:"take",item:"fish",copy:"汽车后座掉下一小包熏鱼，油纸边角已经被猫抓破。"},
      {id:"milk",x:76,y:42,w:8,h:18,title:"门房牛奶瓶",action:"take",item:"milk",copy:"门房窗台上搁着今晨送来的小瓶牛奶，瓶口还封着蜡纸。",fromChapter:2},
      {id:"doorway",x:58,y:27,w:22,h:44,title:"邮局大门",action:"text",copy:"门半开着。雾沿石阶爬进门厅，像一封没有收件人的信。"}
    ]},
    deadroom:{name:"死信室",sub:"地下室 · 案发现场",image:"assets/images/deadroom.webp",chapter:1,hotspots:[
      {id:"corpse",x:29,y:48,w:36,h:43,title:"赫尔曼的尸体",action:"clue",clue:"c_lividity",copy:"死者被发现时面朝下，固定尸斑却主要位于背侧。这里只登记姿势与尸斑位置，不提前替它作结论。",knowledge:"固定尸斑与发现姿势不一致。"},
      {id:"door",x:0,y:19,w:19,h:66,title:"内侧门闩",action:"clue",clue:"c_latch",copy:"插销确实落在内侧。木孔边缘有一道不足一毫米宽的新磨痕，里面嵌着透明纤维。",knowledge:"插销受力路径上存在新鲜细磨痕。"},
      {id:"window",x:22,y:0,w:28,h:34,title:"钉死的高窗",action:"clue",clue:"c_window",copy:"木板从室内钉死，钉头锈迹连续，没有近期拔动留下的断口。",knowledge:"高窗近期没有被开启。"},
      {id:"vent",x:58,y:0,w:31,h:34,title:"通风管",action:"clue",clue:"c_vent",copy:"管径不能容手臂通过。弯头里挂着一小段透明钓线，断口新鲜，线身带木屑。",knowledge:"通风管内残留透明钓线。"},
      {id:"tea",x:58,y:34,w:17,h:18,title:"凉茶",action:"clue",clue:"c_tea",copy:"杯底检出少量镇静剂沉淀；死者胃内容物没有对应成分。两项事实分开记录。",knowledge:"杯中有药，但胃内未检出对应成分。"},
      {id:"floor",x:37,y:71,w:33,h:26,title:"石地与头部",action:"clue",clue:"c_rigor",copy:"后枕只有一处主要撞击伤，高度接近桌角。尸体现象与07:40报案推算不一致，但低温可能干扰这些变化。",knowledge:"后枕伤与桌角高度相符；死亡时间判断可能受低温影响。"}
    ]},
    office:{name:"局长办公室",sub:"三封无人投递的信",image:"assets/images/office.webp",chapter:2,hotspots:[
      {id:"letterA",x:19,y:48,w:23,h:31,title:"信 A · 空白压痕",action:"letterA"},
      {id:"letterB",x:41,y:46,w:22,h:34,title:"信 B · 火漆封面",action:"letterB"},
      {id:"letterC",x:61,y:47,w:22,h:32,title:"信 C · 蓝边纸",action:"letterC"},
      {id:"drawer",x:48,y:76,w:31,h:23,title:"半开的抽屉",action:"drawer"},
      {id:"tube-port",x:66,y:15,w:17,h:27,title:"气动管投递口",action:"tubePort"},
      {id:"radio",x:0,y:14,w:19,h:31,title:"短波收音机",action:"radio"},
      {id:"letters",x:13,y:14,w:44,h:29,title:"死信柜与用品登记",action:"deadletters"},
      {id:"suitcase",x:76,y:74,w:23,h:24,title:"维克托的手提箱",action:"suitcase"}
    ]},
    lab:{name:"配药储物间",sub:"旧邮局的小化验台",image:"assets/images/lab.webp",chapter:2,hotspots:[
      {id:"iodine",x:5,y:39,w:16,h:38,title:"碘酒与滴管",action:"take",item:"iodine",copy:"取得碘酒。原液颜色很深，不能直接涂满旧纸。"},
      {id:"water",x:21,y:38,w:15,h:39,title:"清水",action:"take",item:"water",copy:"取得一小杯清水。"},
      {id:"swab",x:37,y:45,w:12,h:28,title:"棉签",action:"take",item:"swab",copy:"取得棉签，用于控制液体经过的位置。"},
      {id:"flour",x:48,y:36,w:15,h:43,title:"面粉罐",action:"take",item:"flour",copy:"普通面粉含淀粉，可作为不接触证物的对照样本。"},
      {id:"heat",x:76,y:41,w:18,h:37,title:"酒精灯",action:"take",item:"burner",copy:"稳定热源，可用于低温、可控的间接加热。"},
      {id:"bench",x:16,y:73,w:67,h:25,title:"实验台",action:"experiment"},
      {id:"medical",x:83,y:10,w:16,h:28,title:"旧法医学与纸张手册",action:"medical"}
    ]},
    tube:{name:"气动管控制室",sub:"检修盖与隔夜延时盘",image:"assets/images/tube.webp",chapter:3,hotspots:[
      {id:"gasket",x:5,y:60,w:21,h:30,title:"检修盖与维修记录",action:"gasket"},
      {id:"valve",x:32,y:25,w:36,h:48,title:"延时阀",action:"valve"},
      {id:"capsule",x:67,y:59,w:24,h:28,title:"投递胶囊",action:"clue",clue:"c_capsule",copy:"胶囊内壁沾有11月17日晚间的蓝色邮戳油墨，而它直到18日清晨才从管口落下。",knowledge:"胶囊跨过了昨夜到今晨的时间窗。"}
    ]},
    cold:{name:"邮票冷藏库",sub:"地下二层 · 低温保存间",image:"assets/images/cold-vault.webp",chapter:3,hotspots:[
      {id:"shelf",x:26,y:24,w:48,h:35,title:"空置长层板",action:"clue",clue:"c_shelf",copy:"层板霜面粘着与赫尔曼制服相同的深灰羊毛纤维。",knowledge:"死者制服曾直接接触冷库层板。"},
      {id:"drag",x:26,y:65,w:49,h:28,title:"地面拖痕",action:"clue",clue:"c_drag",copy:"两道平行拖痕从层板延伸到门外，间距接近死者肩宽。",knowledge:"冷库存在由层板向门外的搬运痕迹。"},
      {id:"chart",x:70,y:24,w:24,h:32,title:"温度记录表",action:"chart"}
    ]},
    finale:{name:"死信室",sub:"最后陈述",image:"assets/images/deadroom.webp",chapter:4,hotspots:[
      {id:"deduction",x:32,y:33,w:46,h:55,title:"重建案情",action:"deduction"}
    ]}
  };

  const evidenceData = {
    c_lividity:{name:"背侧尸斑",kind:"尸体记录",scene:"deadroom",copy:"发现时俯卧，固定尸斑主要在背侧。"},
    c_latch:{name:"门闩线痕",kind:"门窗痕迹",scene:"deadroom",copy:"内侧插销孔边缘有极细的新磨痕与透明纤维。"},
    c_window:{name:"钉死高窗",kind:"门窗痕迹",scene:"deadroom",copy:"高窗木板锈蚀连续，没有近期拔动痕迹。"},
    c_vent:{name:"通风管钓线",kind:"纤维与线材",scene:"deadroom",copy:"弯头里残留透明钓线，线身带细木屑。"},
    c_tea:{name:"镇静剂凉茶",kind:"杯中残留",scene:"deadroom",copy:"杯中有镇静剂；胃内容物没有对应成分。"},
    c_rigor:{name:"后枕伤与尸体现象",kind:"尸体记录",scene:"deadroom",copy:"后枕伤与桌角高度相符；尸体现象可能受低温干扰。"},
    e_letterA:{name:"压痕信 · 17—B",kind:"纸张压痕",scene:"office",copy:"石墨显出：安娜·韦伯，17—B。前五封已交；第六封未投递。"},
    e_letterB:{name:"安娜的氯醛处方",kind:"旧医疗纸片",scene:"office",copy:"水渍正穿过剂量栏，小数点位置模糊。"},
    e_letterC:{name:"淀粉墨 · 0.6克",kind:"隐写字迹",scene:"office",copy:"显色补注：剂量是0.6，不是6。安娜知道。——H"},
    c_capsule:{name:"隔夜邮戳胶囊",kind:"气动管部件",scene:"tube",copy:"17日晚间的邮戳油墨，18日清晨才落下。"},
    c_shelf:{name:"冷库层板纤维",kind:"冷库痕迹",scene:"cold",copy:"层板霜面有与制服相同的深灰羊毛纤维。"},
    c_drag:{name:"冷库平行拖痕",kind:"冷库痕迹",scene:"cold",copy:"两道平行拖痕由层板延伸至门外。"},
    c_chart:{name:"温度表覆写",kind:"记录纸张",scene:"cold",copy:"11月17日的12°C是在原2°C上补写数字1。"},
    c_hand:{name:"三处h的同形收笔",kind:"笔迹比对",scene:"lab",copy:"今晨来信、温度覆写与玛戈登记簿中的h有相同回钩。"},
    c_sixth:{name:"制服内衬里的第六封信",kind:"私人信件",scene:"finale",copy:"信封没有邮戳，缝在赫尔曼制服内衬里。"}
  };

  const itemData = {
    pencil:{name:"扁平木工铅笔",kind:"纸张工具",copy:"软芯侧锋适合显出压痕。"},
    candle:{name:"短蜡烛",kind:"低温热源",copy:"旧邮件处理守则允许隔距慢慢温热火漆。"},
    iodine:{name:"碘酒",kind:"显色试剂",copy:"先做对照实验，再决定是否用于蓝边纸。"},
    water:{name:"清水",kind:"实验材料",copy:"用于稀释碘液。"},
    swab:{name:"棉签",kind:"实验工具",copy:"控制显色液的范围。"},
    flour:{name:"面粉对照样本",kind:"对照材料",copy:"含淀粉，只用于验证碘反应，不接触原证物。"},
    burner:{name:"酒精灯",kind:"稳定热源",copy:"火焰稳定。"},
    diluted:{name:"稀释碘液",kind:"显色试剂",copy:"浓度足够显色，又不会盖住细笔画。"},
    fish:{name:"油纸包熏鱼",kind:"杂物",copy:"橘猫很感兴趣。"},
    milk:{name:"门房牛奶",kind:"生活记录",copy:"今晨送来的鲜奶。"},
    bread:{name:"半块黑面包",kind:"生活记录",copy:"办公室抽屉里的早餐。"}
  };

  const hints = {
    1:["第一章先记录六件现场事实；材料齐全后还需要完成一次‘现场矛盾’阶段复核，章节不会因收集完线索自动推进。","尸斑、门闩、高窗、通风管、凉茶、后枕伤都要登记。阶段复核只组织矛盾，不提前公布凶手或机关答案。","如果卡在阶段复核：先找‘发现状态与死亡过程不一致’、‘密室机制待证’和‘杯中有药≠死者服药’这三层证据边界。"],
    2:["三封信各有一种物理障碍；先在办公室和配药间找‘方法来源’，再动证物。三封信处理完还要复核方法来源。","压痕来自抽屉便笺与软芯铅笔；火漆处理法写在死信柜旧守则；蓝边纸采购登记说明它是淀粉上浆纸。","先用面粉做碘反应对照，再把碘酒稀释、用棉签薄涂。阶段复核会检查这三种方法是否都有现场依据。"],
    3:["这一章不需要你制造维修零件。维克托只恢复最低限度气密；你负责验证延时、低温和纸面改动。材料齐全后仍需阶段复核。","胶囊昨夜进入、今晨落下；维修铭牌有立即/3h/6h/隔夜四个卡槽。冷库材料要彼此建立独立关系。","隔夜槽解释机械时间窗；温度表+层板说明低温接触，层板+拖痕说明搬运路径，覆写+笔迹说明今天有人改动记录。"],
    4:["每一题先选两件能共同回答问题的证物，再判断结论。","如果你之前把证物放进临时推论板，同栏关系可能会提醒你。","六组关系依次涉及：低温、密室受力、隔夜信、0.6剂量、今日书写者、真正伤口。"]
  };

  const people = [
    ["赫尔曼·福格尔","邮政局长。习惯把退信柜最后一格留给‘明天来的那一封’。"],
    ["玛戈","十九年前在雨站台被赫尔曼带回邮局。一直叫他‘局长’。"],
    ["利奥波德·哈斯","医生。写小数点时会停笔并重复点实。"],
    ["维克托·莱茵","自称邮票商，实际非常熟悉气动管维修。"],
    ["艾尔莎·克劳斯","抄写员。记得玛戈小时候常在局长办公室外写作业。"]
  ];

  const deductions = [
    {q:"死亡时间为什么会被误判？",prompt:"选一件说明冷库真实温度、一件说明死者接触过冷库的证物。",supports:["c_chart","c_shelf"],pool:["c_chart","c_shelf","c_window","c_capsule"],answer:"尸体曾被移入2°C冷库，低温干扰了死亡时间判断",opts:["地下死信室整夜保持2°C","尸体曾被移入2°C冷库，低温干扰了死亡时间判断","镇静剂让尸体现象减慢"],reason:"温度覆写证明冷库当日约2°C；制服纤维证明死者接触过层板。证据能支持‘低温干扰’，不能凭空推出整整24小时。"},
    {q:"门闩为什么能在空房间里落下？",prompt:"选一件‘受力处’和一件‘传力物’。",supports:["c_latch","c_vent"],pool:["c_latch","c_vent","c_window","c_tea"],answer:"钓线穿过通风管牵动内侧插销",opts:["门锁还有第二把钥匙","有人从高窗伸手拨动插销","钓线穿过通风管牵动内侧插销"],reason:"门闩新磨痕与通风弯头内钓线可以构成同一条受力路径。"},
    {q:"今晨才落下的信，是怎么越过一夜的？",prompt:"选一件说明‘时间’、一件说明‘书写者’的证物。",supports:["c_capsule","c_hand"],pool:["c_capsule","c_hand","e_letterA","c_drag"],answer:"玛戈写下后让胶囊进入隔夜延时槽",opts:["赫尔曼生前正常投递","玛戈写下后让胶囊进入隔夜延时槽","哈斯从镇外寄回后被大雾耽误"],reason:"胶囊跨过昨夜到今晨；三份h的共同收笔特征把今晨记录与玛戈联系起来。"},
    {q:"十九年前，玛戈真正看错了什么？",prompt:"把受损处方与后来显出的补注放在一起。",supports:["e_letterB","e_letterC"],pool:["e_letterB","e_letterC","c_tea","c_lividity"],answer:"她把被水抹掉小数点的0.6克读成了6克",opts:["她把被水抹掉小数点的0.6克读成了6克","她把安娜姓名认成另一个病人","她把处方日期误成死亡日期"],reason:"旧处方的水渍穿过剂量栏，补注明确留下‘0.6，不是6’。"},
    {q:"谁把旧日的误解带进了今天的现场？",prompt:"选一件指向‘今天的手’、一件指向‘十九年前的执念’。",supports:["c_hand","e_letterB"],pool:["c_hand","e_letterB","c_window","c_capsule"],answer:"玛戈",opts:["利奥波德·哈斯","玛戈","维克托·莱茵"],reason:"今天被改写的记录和来信具有玛戈字迹特征；她的行动又始终围绕那张残缺处方。"},
    {q:"那么，赫尔曼真正死于什么？",prompt:"选一件说明真正伤口、一件排除杯中药物的证物。",supports:["c_rigor","c_tea"],pool:["c_rigor","c_tea","c_latch","e_letterC"],answer:"后退跌倒，后枕撞上桌角造成致命伤",opts:["哈斯让他服下过量镇静剂","有人用钝器从背后袭击","后退跌倒，后枕撞上桌角造成致命伤"],reason:"后枕伤高度和形态与桌角吻合；杯里虽有药，胃里却没有，药物没有进入死亡过程。"}
  ];

  const reviewVariants = [
    {label:"没有取走的早餐",task:"找出三张不改变凶案结论、却能证明赫尔曼与玛戈原本还在安排第二天生活的边注。",notes:{exterior:"门房备忘：鲜奶按玛戈的名字留到中午。",archive:"退信柜末格贴着‘明晨先清’的铅笔条。",personal:"维克托随手记下：局长昨晚问过明早第一班邮车几点到。"}},
    {label:"同色墨水不是同一只手",task:"找出三处蓝墨来源，确认颜色相同不能代替笔迹结构比对。",notes:{exterior:"汽车登记笔使用镇公所蓝墨，与邮局墨水同色但批号不同。",archive:"用品登记注明17-B邮戳油墨批次为B-14。",personal:"维克托箱中的蓝铅笔属于铁路维修用品，颜色接近但并非邮戳油墨。"}},
    {label:"谁还在准备明天",task:"补齐三条夜班生活记录，只作为人物复核，不把它们冒充凶案物证。",notes:{exterior:"门房记得赫尔曼昨晚让他别锁侧门太早。",archive:"局长桌上夹着第二天早班的分拣表。",personal:"维克托回忆赫尔曼问过咖啡豆是否还能再磨一壶。"}}
  ];

  const metaDefault = () => ({replayUnlocked:false,bestRank:null,clears:0,seenVariants:[]});
  const defaultState = () => ({
    version:7,started:false,chapter:1,scene:"deadroom",clock:460,clues:[],inventory:[],knowledge:[],flags:{},
    hints:{1:0,2:0,3:0,4:0},mistakes:0,actions:0,catFeeds:0,ending:false,pendingStory:null,
    fragments:[1],readFragments:[],archivePage:1,reasoning:{time:[],mechanism:[],people:[]},reasonBoardUses:0,
    reviewMode:false,reviewVariant:0,reviewNotes:[],deductionStep:0,checkpoint:{1:false,2:false,3:false}
  });

  let state = defaultState();
  let meta = loadMeta();
  let storyTimers = [];
  let storyActive = false;
  let dialogueQueue = [];
  let dialogueDone = null;
  let toastTimer = null;
  let audio = {ctx:null,master:null,enabled:false,hum:null};
  let deductionSelection = [];
  let deductionLinked = false;

  const ids = ["portal-screen","portal-search","portal-search-input","portal-home-view","portal-breadcrumb","dispatch-modal","dispatch-enter","dispatch-later","portal-continue","portal-reading","portal-reading-kicker","portal-reading-title","portal-reading-meta","portal-reading-copy","portal-reading-close","portal-urgent-thread","title-screen","game-screen","case-home","case-breadcrumb-text","case-page-label","case-page-heading","case-fragment-title","case-fragment-copy","case-fragment-source","continue-game","chapter-kicker","chapter-title","scene-image","hotspots","scene-number","scene-name","scene-subtitle","objective-text","objective-progress","game-clock","location-nav","location-rail","evidence-panel","evidence-list","evidence-count","knowledge-list","inventory-list","dialogue","dialogue-speaker","dialogue-text","dialogue-next","modal-backdrop","detail-modal","detail-kicker","detail-title","detail-visual","detail-copy","detail-actions","archive-btn","archive-modal","archive-tabs","archive-page-no","archive-page-title","archive-page-copy","archive-query","archive-result","archive-badge","notebook-btn","notebook-modal","notebook-objectives","suspect-notes","hint-btn","hint-modal","hint-text","next-hint","support-modal","support-btn","sound-btn","menu-btn","menu-modal","ending-modal","ending-title","ending-copy","ending-stats","ending-letter","final-letter","toast","story-interlude","story-register","story-folio","story-kicker","story-heading","story-lines","story-continue","reason-board"];
  const els = {};
  ids.forEach(id=>els[id.replaceAll("-","_")]=$(id));

  function loadMeta(){try{return Object.assign(metaDefault(),JSON.parse(localStorage.getItem(META_KEY)||"null")||{});}catch(_){return metaDefault();}}
  function saveMeta(){try{localStorage.setItem(META_KEY,JSON.stringify(meta));}catch(_){}}
  function save(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(state));}catch(_){}}
  function load(){
    try{
      const raw=localStorage.getItem(SAVE_KEY)||LEGACY_KEYS.map(k=>localStorage.getItem(k)).find(Boolean);
      const parsed=JSON.parse(raw||"null");
      if(!parsed)return false;
      state=Object.assign(defaultState(),parsed,{version:7});
      state.flags=Object.assign({},parsed.flags||{});
      state.clues=Array.isArray(parsed.clues)?parsed.clues:[];
      state.inventory=Array.isArray(parsed.inventory)?parsed.inventory:[];
      state.knowledge=Array.isArray(parsed.knowledge)?parsed.knowledge:[];
      state.fragments=Array.isArray(parsed.fragments)?parsed.fragments:[1];
      state.readFragments=Array.isArray(parsed.readFragments)?parsed.readFragments:[];
      state.reasoning=Object.assign({time:[],mechanism:[],people:[]},parsed.reasoning||{});
      state.reviewNotes=Array.isArray(parsed.reviewNotes)?parsed.reviewNotes:[];
      state.checkpoint=Object.assign({1:false,2:false,3:false},parsed.checkpoint||{});
      if(state.chapter>=2)state.checkpoint[1]=true;
      if(state.chapter>=3)state.checkpoint[2]=true;
      if(state.chapter>=4)state.checkpoint[3]=true;
      save();
      return true;
    }catch(_){return false;}
  }
  function clearSave(){try{localStorage.removeItem(SAVE_KEY);LEGACY_KEYS.forEach(k=>localStorage.removeItem(k));}catch(_){}}

  function hasItem(id){return state.inventory.includes(id);}
  function addItem(id){if(!hasItem(id)){state.inventory.push(id);save();renderInventory();playPaperTick();}}
  function addKnowledge(text){if(!state.knowledge.includes(text)){state.knowledge.push(text);save();renderKnowledge();}}
  function addClue(id,knowledge){if(!state.clues.includes(id)){state.clues.push(id);playPaperTick();if(knowledge)addKnowledge(knowledge);save();renderEvidence();}}
  function unlockFragment(n){if(!state.fragments.includes(n)){state.fragments.push(n);save();renderArchiveBadge();}}
  function tick(minutes=4){state.clock+=minutes;state.actions++;save();renderClock();}
  function timeText(){const m=state.clock;return `${String(Math.floor(m/60)%24).padStart(2,"0")}:${String(m%60).padStart(2,"0")}`;}
  function esc(s){return String(s??"").replace(/[&<>\"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]));}

  function startAudio(){
    if(!audio.ctx){
      const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
      audio.ctx=new C();audio.master=audio.ctx.createGain();audio.master.gain.value=.18;audio.master.connect(audio.ctx.destination);
    }
    if(audio.ctx.state==="suspended")audio.ctx.resume();
  }
  function tone(f=440,d=.08,g=.025,type="sine",delay=0){if(!audio.enabled||!audio.ctx)return;const o=audio.ctx.createOscillator(),v=audio.ctx.createGain();o.type=type;o.frequency.value=f;v.gain.value=.0001;o.connect(v);v.connect(audio.master);const t=audio.ctx.currentTime+delay;v.gain.exponentialRampToValueAtTime(g,t+.01);v.gain.exponentialRampToValueAtTime(.0001,t+d);o.start(t);o.stop(t+d+.03);}
  function playPaperTick(){tone(690,.05,.012,"triangle");tone(1020,.04,.008,"triangle",.04);}
  function setSound(on){audio.enabled=!!on;if(on)startAudio();els.sound_btn?.classList.toggle("active",audio.enabled);if($("title-sound"))$("title-sound").textContent=audio.enabled?"声音已开启":"开启声音 · 推荐佩戴耳机";}

  function showOnly(which){
    [els.portal_screen,els.title_screen,els.game_screen].forEach(x=>x?.classList.add("hidden"));
    if(which==="portal")els.portal_screen?.classList.remove("hidden");
    if(which==="title")els.title_screen?.classList.remove("hidden");
    if(which==="game")els.game_screen?.classList.remove("hidden");
  }

  function startCase(mode="standard"){
    state=defaultState();state.started=true;state.reviewMode=mode==="review";state.reviewVariant=state.reviewMode?chooseVariant():0;save();showOnly("game");queueStory("opening");render();
  }
  function chooseVariant(){
    const unseen=[0,1,2].filter(x=>!meta.seenVariants.includes(x));
    return unseen.length?unseen[Math.floor(Math.random()*unseen.length)]:Math.floor(Math.random()*3);
  }
  function continueCase(){if(load()){showOnly("game");render();if(state.pendingStory)playStory(state.pendingStory);}else startCase();}

  function openStartChoice(){
    if(!meta.replayUnlocked){startCase();return;}
    showDetail("复核方式","你已经结过一次案。二次复核不会改变主案真相，但会随机开放一组新的档案边注，并打乱终局证物池顺序。",null,[
      {label:"标准复核",primary:true,run:()=>{closeAll();startCase("standard");}},
      {label:"二次复核模式",run:()=>{closeAll();startCase("review");}}
    ],"CASE REVIEW");
  }

  function availableScenes(){
    if(state.chapter===1)return ["deadroom","exterior"];
    if(state.chapter===2)return ["office","lab","exterior"];
    if(state.chapter===3)return ["tube","cold","lab","office","exterior"];
    return ["finale","deadroom","office","cold"];
  }
  function progress(){
    if(state.chapter===1)return ["c_lividity","c_latch","c_window","c_vent","c_tea","c_rigor"].filter(x=>state.clues.includes(x)).length;
    if(state.chapter===2)return ["letterA","letterB","letterC"].filter(x=>state.flags[x]).length;
    if(state.chapter===3)return ["tubeSolved","coldSolved","chartSolved","handSolved"].filter(x=>state.flags[x]).length;
    return Math.min(state.deductionStep||0,6);
  }

  function render(){renderHeader();renderLocations();renderScene();renderEvidence();renderKnowledge();renderInventory();renderArchiveBadge();renderNotebook();updateContinue();}
  function renderHeader(){
    const c=chapters[state.chapter];if(!c)return;
    els.chapter_kicker.textContent=c.kicker;els.chapter_title.textContent=c.title;els.objective_text.textContent=c.objective;
    const n=state.chapter,ready=checkpointReady(n),done=!!state.checkpoint?.[n];
    els.objective_progress.textContent=n<4&&ready&&!done?`${progress()} / ${c.target} · 待阶段复核`:`${progress()} / ${c.target}`;
    els.objective_progress.classList.toggle("checkpoint-pending",n<4&&ready&&!done);
    if(n<4&&ready&&!done){els.objective_progress.setAttribute("role","button");els.objective_progress.tabIndex=0;els.objective_progress.title="打开阶段复核";els.objective_progress.onclick=()=>openChapterCheckpoint(n);els.objective_progress.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();openChapterCheckpoint(n);}};}else{els.objective_progress.removeAttribute("role");els.objective_progress.removeAttribute("tabindex");els.objective_progress.removeAttribute("title");els.objective_progress.onclick=null;els.objective_progress.onkeydown=null;}
    renderClock();
  }
  function renderClock(){els.game_clock.textContent=timeText();}
  function renderLocations(){els.location_nav.innerHTML="";availableScenes().forEach((id,i)=>{const s=sceneData[id];const b=document.createElement("button");b.className="location-button"+(state.scene===id?" active":"");b.innerHTML=`<small>${String(i+1).padStart(2,"0")}</small><span>${esc(s.name)}<i>${esc(s.sub)}</i></span>`;b.onclick=()=>goScene(id);els.location_nav.appendChild(b);});}
  function renderScene(){
    const s=sceneData[state.scene]||sceneData.deadroom;
    els.scene_image.src=s.image;els.scene_image.alt=`${s.name} · ${s.sub}`;els.scene_name.textContent=s.name;els.scene_subtitle.textContent=s.sub;els.scene_number.textContent=String(availableScenes().indexOf(state.scene)+1).padStart(2,"0");
    els.case_breadcrumb_text.textContent=`17—B › ${chapters[state.chapter].kicker} › ${s.name}`;els.case_page_heading.textContent=`${s.name} · ${s.sub}`;els.case_page_label.textContent=state.reviewMode?"二次复核页":"现场复原页";
    const frag=caseFragments[state.scene];els.case_fragment_title.textContent=frag.title;els.case_fragment_copy.innerHTML=`<p>${esc(frag.copy)}</p>`;els.case_fragment_source.textContent=frag.source;
    els.hotspots.innerHTML="";
    s.hotspots.filter(h=>!h.fromChapter||state.chapter>=h.fromChapter).forEach(h=>{const b=document.createElement("button");b.className="hotspot"+(isResolvedHotspot(h)?" resolved":"");b.style.left=h.x+"%";b.style.top=h.y+"%";b.style.width=h.w+"%";b.style.height=h.h+"%";b.setAttribute("aria-label",h.title);b.title=h.title;b.onclick=()=>handleHotspot(h);els.hotspots.appendChild(b);});
  }
  function isResolvedHotspot(h){return (h.clue&&state.clues.includes(h.clue))||(h.action&&state.flags[h.action])||(h.item&&(hasItem(h.item)||state.flags[`taken_${h.item}`]));}
  function renderEvidence(){els.evidence_list.innerHTML="";els.evidence_count.textContent=`${state.clues.length} / 15`;state.clues.forEach((id,i)=>{const d=evidenceData[id]||{name:id,kind:"未分类"};const b=document.createElement("button");b.className="evidence-card";const groups=reasonGroupsFor(id);b.innerHTML=`<b>${String(i+1).padStart(2,"0")}</b><span>${esc(d.name)}<small>${esc(d.kind)}</small>${groups?`<em>${groups}</em>`:""}</span>`;b.onclick=()=>showEvidence(id);els.evidence_list.appendChild(b);});if(!state.clues.length)els.evidence_list.innerHTML='<p class="panel-empty">现场尚未登记证物。</p>';}
  function renderKnowledge(){els.knowledge_list.innerHTML=state.knowledge.length?state.knowledge.map(x=>`<p>${esc(x)}</p>`).join(""):'<p>只记录已经亲手验证的物理事实。</p>';}
  function renderInventory(){els.inventory_list.innerHTML="";if(!state.inventory.length){els.inventory_list.innerHTML='<p class="empty-inventory">道具会收进这只旧木匣。</p>';return;}state.inventory.forEach((id,i)=>{const d=itemData[id]||{name:id,kind:"杂物"};const b=document.createElement("button");b.className="inventory-item";b.innerHTML=`<small>${String(i+1).padStart(2,"0")}</small><b>${esc(d.name)}</b><span>${esc(d.kind)}</span>`;b.onclick=()=>showItem(id);els.inventory_list.appendChild(b);});}
  function renderArchiveBadge(){els.archive_badge.textContent=state.fragments.length;}
  function updateContinue(){const has=!!localStorage.getItem(SAVE_KEY)||LEGACY_KEYS.some(k=>!!localStorage.getItem(k));if(els.continue_game)els.continue_game.disabled=!has;if(els.portal_continue)els.portal_continue.classList.toggle("hidden",!has);}

  function renderNotebook(){
    if(!els.notebook_objectives)return;
    els.notebook_objectives.innerHTML=Object.entries(chapters).map(([n,c])=>{const num=Number(n),isCurrent=num===state.chapter,ready=checkpointReady(num),done=!!state.checkpoint?.[num];const status=num<state.chapter?"已复核":isCurrent?`${progress()} / ${c.target}${num<4&&ready&&!done?" · 待阶段复核":""}`:"未开始";return `<div class="notebook-row ${num<state.chapter?"done":isCurrent?"current":""}"><b>${c.kicker} · ${c.title}</b><span>${status}</span>${isCurrent&&num<4&&ready&&!done?`<button class="checkpoint-open" data-checkpoint="${num}">进行阶段复核</button>`:""}</div>`;}).join("") + (state.reviewMode?`<div class="review-note"><b>二次复核 · ${esc(reviewVariants[state.reviewVariant]?.label||"")}</b><span>${state.reviewNotes.length} / 3</span><p>${esc(reviewTaskText())}</p>${state.reviewNotes.length?`<ul>${state.reviewNotes.map(src=>`<li>${esc(reviewVariants[state.reviewVariant]?.notes?.[src]||src)}</li>`).join("")}</ul>`:""}</div>`:"");
    $$('[data-checkpoint]',els.notebook_objectives).forEach(b=>b.onclick=()=>openChapterCheckpoint(Number(b.dataset.checkpoint)));
    els.suspect_notes.innerHTML=people.map(([n,t])=>`<details><summary>${esc(n)}</summary><p>${esc(t)}</p></details>`).join("");
    renderReasonBoard();
  }
  function renderReasonBoard(){
    const root=els.reason_board;if(!root)return;
    const defs=[['time','时间'],['mechanism','机关'],['people','人物 / 动机']];
    root.innerHTML=defs.map(([k,label])=>`<section class="reason-column" data-reason="${k}"><h4>${label}</h4><div>${state.reasoning[k].length?state.reasoning[k].map(id=>`<button data-remove-reason="${k}" data-id="${id}">${esc(evidenceData[id]?.name||id)}</button>`).join(""):'<p>尚未归类</p>'}</div></section>`).join("");
    $$('[data-remove-reason]',root).forEach(b=>b.onclick=()=>{const k=b.dataset.removeReason,id=b.dataset.id;state.reasoning[k]=state.reasoning[k].filter(x=>x!==id);save();renderNotebook();renderEvidence();});
  }
  function reasonGroupsFor(id){const labels=[];if(state.reasoning.time.includes(id))labels.push("时间");if(state.reasoning.mechanism.includes(id))labels.push("机关");if(state.reasoning.people.includes(id))labels.push("人物");return labels.join(" · ");}

  function goScene(id){if(storyActive||!availableScenes().includes(id))return;state.scene=id;tick(3);closeAll();render();}
  function handleHotspot(h){if(storyActive)return;tick(2);const a=h.action||"text";({clue:()=>inspectClue(h),take:()=>takeItem(h),text:()=>showDetail(h.title,h.copy||"没有更多可登记内容。",visualForGeneric(h.title,state.scene),[],"现场观察"),drawer:openDrawer,letterA,letterB,letterC,tubePort,radio,deadletters,suitcase,experiment,medical,gasket,valve,chart,cat,car,deduction}[a]||(()=>showDetail(h.title,h.copy||"没有更多内容。",visualForGeneric(h.title,state.scene))))();}

  function inspectClue(h){
    const registered=state.clues.includes(h.clue);
    showDetail(h.title,registered?evidenceData[h.clue].copy:h.copy,evidenceVisual(h.clue),registered?reasonActions(h.clue):[
      {label:"登记事实",primary:true,run:()=>{addClue(h.clue,h.knowledge);closeAll();afterClue();render();}}
    ],evidenceData[h.clue]?.kind||"现场观察");
  }
  function afterClue(){
    if(state.chapter===1&&progress()===6&&!state.checkpoint[1]){state.flags.ch1Ready=true;unlockFragment(2);save();toast("现场事实已齐。现在需要完成阶段复核，不能只靠收集线索进入下一章。","success");setTimeout(()=>openChapterCheckpoint(1),180);}
    if(state.chapter===3){state.flags.coldSolved=state.clues.includes("c_shelf")&&state.clues.includes("c_drag");checkChapter3();}
  }
  function takeItem(h){const taken=hasItem(h.item)||state.flags[`taken_${h.item}`];showDetail(h.title,taken?"这里已经空了。":h.copy,visualForGeneric(h.title,state.scene),taken?[]:[{label:"收进物品匣",primary:true,run:()=>{addItem(h.item);state.flags[`taken_${h.item}`]=true;closeAll();render();}}],itemData[h.item]?.kind||"现场物品");}

  function reasonActions(id){return [
    {label:"放入：时间",run:()=>addReason(id,"time")},{label:"放入：机关",run:()=>addReason(id,"mechanism")},{label:"放入：人物 / 动机",run:()=>addReason(id,"people")}
  ];}
  function addReason(id,group){Object.keys(state.reasoning).forEach(k=>state.reasoning[k]=state.reasoning[k].filter(x=>x!==id));state.reasoning[group].push(id);state.reasonBoardUses++;save();toast(`已放入${{time:"时间",mechanism:"机关",people:"人物 / 动机"}[group]}栏。这里不会立即告诉你对错。`);closeAll();render();}

  const checkpointDefs = {
    1:{
      title:"阶段复核 · 现场矛盾",
      intro:"六件现场材料已经登记。先把它们组织成‘值得继续查的矛盾’，而不是直接猜凶手。每一步都只要求证据能支持到哪一层。",
      steps:[
        {q:"哪两件材料共同说明：发现时看到的状态，不能直接当成完整死亡过程？",need:["c_lividity","c_rigor"],pool:["c_lividity","c_rigor","c_tea","c_window"],ok:"尸斑与尸体现象都和‘发现当下’存在错位。这里只确认现场状态被改变或被干扰，不提前写死死亡方式。"},
        {q:"哪三件门窗材料应该被放在同一条‘密室机制待证’线上继续追查？",need:["c_latch","c_window","c_vent"],pool:["c_latch","c_window","c_vent","c_tea"],ok:"高窗负责排除一条明显出入口；门闩磨痕和通风管钓线留下了另一个待验证的受力方向。此时仍不直接宣布机关答案。"},
        {q:"哪一件材料目前只能写成‘杯中有药’，不能写成‘死者服药’？",need:["c_tea"],pool:["c_tea","c_rigor","c_lividity"],ok:"杯中检出药物与人体摄入是两件不同事实。把这层边界守住，下一章才不会被一只杯子带偏。"}
      ]
    },
    2:{
      title:"阶段复核 · 方法必须有出处",
      intro:"三封信都已经打开，但这一步不问凶手。先确认你使用的每种处理方法都来自现场材料、守则或对照实验，而不是作者临时指定。",
      steps:[
        {q:"压痕显影的方法来源是什么？",need:["src_pencil"],pool:["src_pencil","src_wax","src_starch"],labels:{src_pencil:"抽屉便笺 + 软芯木工铅笔",src_wax:"旧邮件火漆处理守则",src_starch:"蓝边纸采购登记 + 淀粉对照实验"},ok:"先看见压痕，再找到不会浸湿旧纸的软芯工具，处理方法由现场自己推出。"},
        {q:"火漆为什么可以采用‘隔距慢热’？",need:["src_wax"],pool:["src_pencil","src_wax","src_starch"],labels:{src_pencil:"抽屉便笺 + 软芯木工铅笔",src_wax:"旧邮件火漆处理守则",src_starch:"蓝边纸采购登记 + 淀粉对照实验"},ok:"正确方法已经在邮局旧守则中出现，玩家不是凭三选一猜作者偏好。"},
        {q:"为什么会想到用稀释碘液处理蓝边纸？",need:["src_starch"],pool:["src_pencil","src_wax","src_starch"],labels:{src_pencil:"抽屉便笺 + 软芯木工铅笔",src_wax:"旧邮件火漆处理守则",src_starch:"蓝边纸采购登记 + 淀粉对照实验"},ok:"采购登记先说明纸张淀粉上浆，对照实验再证明碘反应；原证物只在方法被验证后才接触试剂。"}
      ]
    },
    3:{
      title:"阶段复核 · 三条独立关系",
      intro:"第三章收集的是机械、低温和书写痕迹。终局之前，先证明你至少能建立三条相互独立的关系；这一步不要求指出凶手。",
      steps:[
        {q:"哪两件材料能共同证明：低温确实进入了死亡时间判断？",need:["c_chart","c_shelf"],pool:["c_chart","c_shelf","c_capsule","c_window"],ok:"温度表给出真实低温，制服纤维证明死者接触过冷库。到这里只能说‘低温干扰时间判断’，不能虚构24小时。"},
        {q:"哪两件材料共同证明：尸体在冷库里发生过搬运，而不是只靠近门口？",need:["c_shelf","c_drag"],pool:["c_shelf","c_drag","c_hand","c_capsule"],ok:"层板接触痕迹和从层板向门外延伸的平行拖痕形成连续搬运路径。"},
        {q:"哪两件材料把‘今天有人改动过记录’和‘同一个书写习惯’连在一起？",need:["c_chart","c_hand"],pool:["c_chart","c_hand","c_tea","e_letterA"],ok:"覆写记录提供‘今天被改动的纸面’，笔迹叠合提供稳定书写特征。人物身份仍留到终局结合更多材料判断。"}
      ]
    }
  };
  let checkpointSession=null;
  function checkpointReady(n){
    if(n===1)return state.chapter===1&&progress()===6;
    if(n===2)return state.chapter===2&&["letterA","letterB","letterC"].every(x=>state.flags[x]);
    if(n===3)return state.chapter===3&&["tubeSolved","coldSolved","chartSolved","handSolved"].every(x=>state.flags[x]);
    return false;
  }
  function openChapterCheckpoint(n){
    if(n<1||n>3||state.checkpoint?.[n])return;
    if(!checkpointReady(n)){toast("当前材料还不足以进行阶段复核。","warning");return;}
    checkpointSession={chapter:n,step:0,selected:[]};
    renderChapterCheckpoint();openModal("detail-modal");
  }
  function renderChapterCheckpoint(){
    const session=checkpointSession;if(!session)return;
    const def=checkpointDefs[session.chapter],step=def.steps[session.step];
    els.detail_kicker.textContent=`阶段复核 · ${session.step+1} / ${def.steps.length}`;
    els.detail_title.textContent=def.title;
    els.detail_visual.innerHTML=`<div class="checkpoint-visual"><div class="checkpoint-ledger"><span>FACTS</span><b>${session.chapter===1?"现场事实":session.chapter===2?"方法来源":"证物关系"}</b></div><i></i><div class="checkpoint-ledger"><span>INFERENCE</span><b>只写证据能支持到的范围</b></div></div>`;
    els.detail_copy.innerHTML=`<p class="checkpoint-intro">${esc(session.step===0?def.intro:step.q)}</p><p class="checkpoint-question">${esc(step.q)}</p><div class="checkpoint-pool" id="checkpoint-pool"></div><p class="deduction-feedback" id="checkpoint-feedback">选择 ${step.need.length} 项，再检验这一步。</p>`;
    els.detail_actions.innerHTML="";
    step.pool.forEach(id=>{const b=document.createElement("button");b.className="checkpoint-card"+(session.selected.includes(id)?" selected":"");const label=step.labels?.[id]||evidenceData[id]?.name||id;b.innerHTML=`<small>${step.labels?"方法来源":esc(evidenceData[id]?.kind||"证物")}</small><b>${esc(label)}</b>`;b.onclick=()=>{if(session.selected.includes(id))session.selected=session.selected.filter(x=>x!==id);else if(session.selected.length<step.need.length)session.selected.push(id);else{session.selected.shift();session.selected.push(id);}renderChapterCheckpoint();};$("checkpoint-pool").appendChild(b);});
    const verify=document.createElement("button");verify.className="ink-button primary";verify.textContent="检验这一步";verify.disabled=session.selected.length!==step.need.length;verify.onclick=verifyCheckpointStep;els.detail_actions.appendChild(verify);
    const later=document.createElement("button");later.className="ink-button";later.textContent="先回现场";later.onclick=closeAll;els.detail_actions.appendChild(later);
  }
  function verifyCheckpointStep(){
    const session=checkpointSession,def=checkpointDefs[session.chapter],step=def.steps[session.step];
    const chosen=[...session.selected].sort().join("|"),need=[...step.need].sort().join("|");
    if(chosen!==need){state.mistakes++;save();const f=$("checkpoint-feedback");if(f){f.textContent="这组材料还不足以支持题目里的那句话。注意区分‘看到的事实’和‘你想解释的原因’。";f.classList.add("warning");}return;}
    state.reasonBoardUses++;save();playPaperTick();
    if(session.step<def.steps.length-1){session.step++;session.selected=[];renderChapterCheckpoint();const f=$("checkpoint-feedback");if(f){f.textContent=step.ok;f.classList.add("success");}return;}
    completeChapterCheckpoint(session.chapter,step.ok);
  }
  function completeChapterCheckpoint(n,message){
    state.checkpoint[n]=true;state.flags[`ch${n}Ready`]=true;checkpointSession=null;save();closeAll();toast(message||"阶段复核完成。","success");
    if(n===1){unlockFragment(2);queueStory("chapter1");}
    if(n===2){queueStory("chapter2");}
    if(n===3){unlockFragment(5);queueStory("chapter3");}
    render();
  }

  function openDrawer(){
    const first=!state.flags.drawer;
    showDetail("半开的抽屉",first?"铅笔、短蜡烛和半块黑面包挤在一起。最下面的便笺写着：‘别问纸上写了什么，先看纸留下了什么。’":"抽屉已经清空，只剩蜡油印。",drawerVisual(),first?[{label:"把三件东西分别收好",primary:true,run:()=>{["pencil","candle","bread"].forEach(addItem);state.flags.drawer=true;closeAll();render();}}]:[],"局长办公室 · 私人物品");
  }

  function deadletters(){
    const actions=[];
    if(!state.flags.waxGuide)actions.push({label:"读旧邮件处理守则",primary:true,run:()=>{state.flags.waxGuide=true;addKnowledge("旧火漆应隔开热源缓慢温热，避免贴火与硬撬。经验标注：约两指宽。 ");save();deadletters();}});
    if(!state.flags.paperStock)actions.push({label:"翻蓝边公文纸采购登记",run:()=>{state.flags.paperStock=true;addKnowledge("蓝边公文纸使用淀粉上浆；若怀疑淀粉字迹，可先在对照样本验证碘反应。 ");save();deadletters();}});
    if(state.reviewMode&&!state.reviewNotes.includes("archive") )actions.push({label:"二次复核：看柜底夹页",run:()=>{unlockReviewNote("archive");deadletters();}});
    showDetail("死信柜与用品登记","这不是‘提示箱’，而是旧邮局真实使用过的处理守则与采购登记。纸张与封缄方法都能在这里找到出处。",archiveLedgerVisual(),actions,"档案用品记录");
  }

  function letterA(){
    if(state.flags.letterA){showDetail("信 A · 已显影",evidenceData.e_letterA.copy,paperVisual("A",true),reasonActions("e_letterA"),"纸张压痕");return;}
    const ok=hasItem("pencil");
    showDetail("信 A · 空白压痕",ok?"侧光下能看见一排浅沟。你已经有一支软芯木工铅笔。":"纸面没有墨，但斜着看能见浅沟。先找不会浸湿、也不会再次压伤旧纸的工具。",paperVisual("A",false),ok?[{label:"开始侧锋显影",primary:true,run:openIndentPuzzle}]:[],"纸张检查");
  }
  function openIndentPuzzle(){
    const panel=interactiveShell("纸面压痕显影","把铅笔侧锋缓慢扫过纸面。拖动滑块只是模拟覆盖面积；越过90%即可看清全部压痕。",`<div class="paper-work"><div class="indent-reveal" id="indent-reveal"><span>安娜·韦伯，17—B。前五封已交；第六封未投递。</span></div></div><label class="range-control">侧锋覆盖 <input id="indent-range" type="range" min="0" max="100" value="0"><b id="indent-value">0%</b></label><button class="ink-button primary" id="indent-finish" disabled>登记显出的文字</button>`);
    const r=panel.querySelector("#indent-range"),v=panel.querySelector("#indent-value"),rev=panel.querySelector("#indent-reveal"),done=panel.querySelector("#indent-finish");
    r.oninput=()=>{const n=+r.value;v.textContent=n+"%";rev.style.setProperty("--reveal",n+"%");done.disabled=n<90;};
    done.onclick=()=>{state.flags.letterA=true;addClue("e_letterA","软芯侧锋可以在不浸湿旧纸的情况下显出压痕。 ");unlockFragment(3);save();closeInteractive();dialogue(["玛戈|17—B……我小时候在母亲的东西上见过这个编号。"],()=>checkChapter2());};
  }

  function letterB(){
    if(state.flags.letterB){showDetail("信 B · 已开启",evidenceData.e_letterB.copy,paperVisual("B",true),reasonActions("e_letterB"),"旧医疗纸片");return;}
    if(!state.flags.waxGuide){showDetail("信 B · 火漆封面","火漆已经发脆，硬撬会伤到下面的薄纸。你还没有任何可靠的处理依据。",waxVisual(),[{label:"先去死信柜找处理守则",run:()=>{closeAll();state.scene="office";render();}}],"封缄检查");return;}
    if(!hasItem("candle")&&!hasItem("burner")){showDetail("信 B · 火漆封面","守则已经说明需要隔距温热，但你还没有稳定热源。",waxVisual(),[],"封缄检查");return;}
    showDetail("信 B · 火漆封面","守则写得很明确：隔开约两指宽，慢慢温热，只让旧火漆变软。",waxVisual(),[{label:"按守则进行温热",primary:true,run:openWaxPuzzle}],"封缄实验");
  }
  function openWaxPuzzle(){
    const panel=interactiveShell("控制热量","先把热源距离调进守则标出的安全区，再保持温热。太近会卷纸，太远不会软化。",`<div class="wax-work"><div class="wax-envelope"><i id="wax-seal"></i><span>旧火漆</span></div><div class="heat-source" id="heat-source">🔥</div><div class="safe-band">守则：两指宽安全区</div></div><label class="range-control">热源距离 <input id="wax-distance" type="range" min="0" max="100" value="70"><b id="wax-distance-v">70</b></label><label class="range-control">温热时间 <input id="wax-time" type="range" min="0" max="100" value="0"><b id="wax-time-v">0%</b></label><button class="ink-button primary" id="wax-finish" disabled>沿封口慢慢揭开</button><p id="wax-feedback" class="interactive-feedback">先把距离放进安全区（38–52）。</p>`);
    const d=panel.querySelector("#wax-distance"),t=panel.querySelector("#wax-time"),dv=panel.querySelector("#wax-distance-v"),tv=panel.querySelector("#wax-time-v"),finish=panel.querySelector("#wax-finish"),fb=panel.querySelector("#wax-feedback"),seal=panel.querySelector("#wax-seal"),heat=panel.querySelector("#heat-source");
    function update(){const dist=+d.value,time=+t.value;dv.textContent=dist;tv.textContent=time+"%";heat.style.left=`${Math.min(78,18+dist*.6)}%`;const safe=dist>=38&&dist<=52;if(!safe&&time>35){fb.textContent=dist<38?"太近：纸边已经发热，先把火移远。":"太远：火漆没有明显变软。";seal.dataset.state="bad";}else if(safe&&time>=72){fb.textContent="火漆边缘已经变软，纸张没有卷曲。";seal.dataset.state="soft";finish.disabled=false;}else{fb.textContent=safe?"距离正确，继续缓慢温热。":"先把距离调进守则标出的安全区。";finish.disabled=true;}}d.oninput=update;t.oninput=update;update();
    finish.onclick=()=>{state.flags.letterB=true;addClue("e_letterB","旧火漆可以通过隔距、低温、缓慢加热安全软化。 ");unlockFragment(4);save();closeInteractive();dialogue(["哈斯|这是十九年前的处方。水渍正好穿过剂量栏，别替缺掉的部分猜数字。"],()=>checkChapter2());};
  }

  function letterC(){
    if(state.flags.letterC){showDetail("信 C · 已显影",evidenceData.e_letterC.copy,paperVisual("C",true),reasonActions("e_letterC"),"隐写字迹");return;}
    if(!state.flags.paperStock){showDetail("信 C · 蓝边纸","纸上有近乎透明的笔迹，但这还不足以判断它是什么材料。先确认这批蓝边纸的纸张工艺。",paperVisual("C",false),[{label:"去查死信柜的采购登记",run:()=>closeAll()}],"纸张检查");return;}
    if(!state.flags.starchConfirmed){showDetail("信 C · 蓝边纸","采购登记写明‘淀粉上浆’，但旧纸不能拿来试错。先用不接触证物的对照样本验证碘是否真的能检出淀粉。",paperVisual("C",false),[{label:"去实验台做对照实验",primary:true,run:()=>{closeAll();state.scene="lab";render();}}],"纸张检查");return;}
    if(!hasItem("diluted")||!hasItem("swab")){showDetail("信 C · 蓝边纸","你已经证明碘能检淀粉，但原液太深。还需要把它稀释，并用棉签控制范围。",paperVisual("C",false),[{label:"去实验台配制",primary:true,run:()=>{closeAll();state.scene="lab";render();}}],"纸张检查");return;}
    showDetail("信 C · 蓝边纸","方法链已经完整：采购登记说明纸张上浆材料；对照实验验证碘反应；稀释液和棉签降低污染风险。",paperVisual("C",false),[{label:"开始局部显色",primary:true,run:openRevealPuzzle}],"显色实验");
  }
  function openRevealPuzzle(){
    const panel=interactiveShell("局部显色","用棉签沿透明痕迹移动。滑块代表涂抹范围；控制在笔迹区域内即可逐渐显出补注。",`<div class="paper-work blue"><div class="ink-reveal" id="ink-reveal"><span>剂量是 0.6，不是 6。安娜知道。——H</span></div></div><label class="range-control">薄涂进度 <input id="reveal-range" type="range" min="0" max="100" value="0"><b id="reveal-value">0%</b></label><button class="ink-button primary" id="reveal-finish" disabled>登记显出的补注</button>`);
    const r=panel.querySelector("#reveal-range"),v=panel.querySelector("#reveal-value"),ink=panel.querySelector("#ink-reveal"),done=panel.querySelector("#reveal-finish");r.oninput=()=>{const n=+r.value;v.textContent=n+"%";ink.style.setProperty("--reveal",n+"%");done.disabled=n<92;};done.onclick=()=>{state.flags.letterC=true;state.inventory=state.inventory.filter(x=>x!=="diluted");addClue("e_letterC","稀释碘液使淀粉墨显色；结论建立在采购登记和对照实验之上。 ");save();closeInteractive();dialogue(["玛戈|零点六……我记得的那张处方，剂量栏一直是缺的。"],()=>checkChapter2());};
  }

  function experiment(){
    if(state.chapter===2&&!state.flags.starchConfirmed){
      const ready=hasItem("iodine")&&hasItem("flour");
      showDetail("对照实验 · 碘与淀粉",ready?"用面粉做牺牲样本，不接触原证物。这样你不是因为‘作者摆了碘酒’才知道答案，而是先验证反应。":"要做安全的对照实验，需要碘酒和含淀粉的面粉样本。",labVisual("control"),ready?[{label:"把一滴碘酒滴在面粉样本上",primary:true,run:()=>{state.flags.starchConfirmed=true;addKnowledge("对照样本迅速变蓝黑：碘能检出淀粉。 ");closeAll();render();toast("对照反应成立。现在才有理由处理蓝边纸。","success");}}]:[],"对照实验");return;
    }
    if(state.chapter===2&&!hasItem("diluted")){
      const ready=state.flags.starchConfirmed&&hasItem("iodine")&&hasItem("water");
      showDetail("配制稀释碘液",ready?"对照实验已证明反应成立。现在只需要降低试剂浓度，避免深色原液盖住笔迹。":"先完成对照实验，再决定是否配制用于原证物的试剂。",labVisual("mix"),ready?[{label:"把少量碘酒加入清水并混匀",primary:true,run:()=>{addItem("diluted");addKnowledge("浓碘液会遮住细笔画；稀释后更适合局部显色。 ");closeAll();render();}}]:[],"显色液配置");return;
    }
    showDetail("实验台","本案需要的实验已经完成。这里没有为了‘多一道谜题’而额外制造维修任务。",labVisual("done"),[],"实验记录");
  }

  function checkChapter2(){if(["letterA","letterB","letterC"].every(x=>state.flags[x])&&!state.checkpoint[2]&&!state.flags.ch2Ready){state.flags.ch2Ready=true;save();toast("三封信已经处理完成。先做一次方法来源复核，再进入机械调查。","success");setTimeout(()=>openChapterCheckpoint(2),180);}render();}

  function tubePort(){showDetail("气动管投递口","黄铜胶囊从这里落下。维修铭牌写的是：立即 / 3小时 / 6小时 / 隔夜。具体哪一档，需要把昨夜邮戳与今晨到达放在同一条时间轴上。",tubeVisual(),[],"设备观察");}
  function gasket(){state.flags.gasketChecked=true;showDetail("检修盖与维修记录","维克托已按维修册把漏气处夹紧到‘低压复现’水平。调查员不需要制造零件；你需要确认的是延时结构本身能不能解释时间差。",tubeVisual("repair"),[{label:"翻看延时盘维护铭牌",primary:true,run:()=>{state.flags.valveGuide=true;addKnowledge("延时盘四个卡槽：立即、3小时、6小时、隔夜约12小时。 ");save();closeAll();render();}}],"维修记录");}
  function valve(){
    if(!state.flags.valveGuide){showDetail("延时阀","转盘有四个卡槽，但没有理由盲猜。先看检修盖内的维护铭牌。",valveVisual(),[],"机械复现");return;}
    if(state.flags.tubeSolved){showDetail("延时阀 · 已复现","释放销位于隔夜槽。结合17日晚间蓝墨和18日清晨到达，机械时间窗成立。",valveVisual("overnight"),reasonActions("c_capsule"),"机械复现");return;}
    showDetail("延时阀","你已经知道每个卡槽的时长。把昨夜进入、今晨落下的胶囊放到时间轴里，再放置释放销。",valveVisual(),[{label:"开始复现延时盘",primary:true,run:openValvePuzzle}],"机械复现");
  }
  function openValvePuzzle(){
    const panel=interactiveShell("复现隔夜延时","胶囊残留来自17日晚间；调查开始于18日07:40。四个卡槽的时长都写在维护铭牌上。点击或拖动释放销选择槽位。",`<div class="timeline-work"><div class="time-axis"><span>17日 19:20<br>进入管线</span><span>18日 07:32<br>胶囊落下</span></div><div class="cam-slots" id="cam-slots"><button data-hours="0">立即</button><button data-hours="3">3h</button><button data-hours="6">6h</button><button data-hours="12">隔夜 ≈12h</button></div><div class="timing-pin" id="timing-pin">释放销</div></div><p class="interactive-feedback" id="valve-feedback">两端时间相隔约一夜。选择最接近、且能解释清晨释放的卡槽。</p>`);
    $$("[data-hours]",panel).forEach(b=>b.onclick=()=>{const h=+b.dataset.hours;$$('[data-hours]',panel).forEach(x=>x.classList.remove("selected"));b.classList.add("selected");const fb=panel.querySelector("#valve-feedback");if(h===12){fb.innerHTML='<b>机械复现成立。</b> 隔夜槽能让昨晚进入的胶囊在今晨释放。';state.flags.tubeSolved=true;addClue("c_capsule","隔夜档约12小时，能解释17日晚间进入、18日清晨释放。 ");save();setTimeout(()=>{closeInteractive();checkChapter3();render();},700);}else{state.mistakes++;fb.textContent=h===0?"立即释放不能跨过一夜。":`${h}小时不足以从昨晚跨到今晨。`;save();}});
  }

  function chart(){
    if(state.flags.chartSolved){showDetail("温度记录表",evidenceData.c_chart.copy,chartVisual(true),reasonActions("c_chart"),"记录纸张");return;}
    const ready=state.clues.includes("c_shelf")&&state.clues.includes("c_drag");
    showDetail("温度记录表",ready?"层板和拖痕已经证明这里和尸体有关。现在看这张表：11月17日的‘1’墨色明显更新。":"表上有一处覆写，但单独看它，还不知道与案件中的谁有关。先调查冷库里的物理痕迹。",chartVisual(false),ready?[{label:"移动侧光，确认底层数字",primary:true,run:openChartPuzzle}]:[],"记录纸张");
  }
  function openChartPuzzle(){
    const panel=interactiveShell("侧光检查温度表","移动侧光，让纸纤维的压痕逐渐显出来。",`<div class="chart-work"><div class="chart-paper"><b>11 / 17</b><span class="under-temp">2°C</span><span class="over-one" id="over-one">1</span><i class="side-light" id="side-light"></i></div></div><label class="range-control">侧光位置 <input id="chart-range" type="range" min="0" max="100" value="0"><b id="chart-value">0</b></label><button class="ink-button primary" id="chart-finish" disabled>登记覆写层</button>`);
    const r=panel.querySelector("#chart-range"),v=panel.querySelector("#chart-value"),light=panel.querySelector("#side-light"),done=panel.querySelector("#chart-finish");r.oninput=()=>{const n=+r.value;v.textContent=n;light.style.left=n+"%";done.disabled=!(n>=42&&n<=62);};done.onclick=()=>{state.flags.chartSolved=true;addClue("c_chart","侧光确认：12°C是在原2°C上加写数字1。 ");save();closeInteractive();checkChapter3();render();};
  }

  function medical(){
    if(state.chapter>=3&&!state.flags.handSolved){showDetail("旧法医学与纸张手册","夹页里有玛戈的护士登记簿。手册强调：笔迹比对只看稳定结构特征，不把‘整体看着像’当结论。",handVisual(),[{label:"把三份h的收笔位置叠合",primary:true,run:()=>{state.flags.handSolved=true;addClue("c_hand","三份h在末笔回钩角度、停笔位置上高度一致。 ");save();closeAll();checkChapter3();render();}}],"笔迹比对");return;}
    showDetail("旧法医学与纸张手册","低温会改变尸体变化的速度，却不会重写原始伤口和已经固定的尸斑。纸张章节还说明：淀粉上浆纸可用碘做对照检验。",bookVisual(),[],"参考资料");
  }
  function checkChapter3(){state.flags.coldSolved=state.clues.includes("c_shelf")&&state.clues.includes("c_drag");if(["tubeSolved","coldSolved","chartSolved","handSolved"].every(x=>state.flags[x])&&!state.checkpoint[3]&&!state.flags.ch3Ready){state.flags.ch3Ready=true;unlockFragment(5);save();toast("机械、低温与笔迹材料都已齐。完成关系复核后才开放终局重建。","success");setTimeout(()=>openChapterCheckpoint(3),180);}render();}

  function deduction(){if((state.deductionStep||0)>=deductions.length){finish();return;}deductionSelection=[];deductionLinked=false;renderDeduction();openModal("detail-modal");}
  function renderDeduction(){
    const step=state.deductionStep||0,d=deductions[step];if(!d)return;
    els.detail_kicker.textContent=`终局推理 · RELATION ${String(step+1).padStart(2,"0")}`;els.detail_title.textContent=d.q;els.detail_visual.innerHTML=relationVisual(d);
    els.detail_copy.innerHTML=`<span class="deduction-prompt">${esc(d.prompt)}</span><div id="deduction-evidence" class="deduction-evidence"></div><p id="deduction-feedback" class="deduction-feedback">选择两件证物。${reasonHintFor(d)}</p>`;els.detail_actions.innerHTML="";
    const pool=state.reviewMode?seedShuffle(d.pool,step):d.pool;
    pool.forEach(id=>{const data=evidenceData[id],b=document.createElement("button");b.className="evidence-choice"+(deductionSelection.includes(id)?" selected":"");b.innerHTML=`<small>${esc(data.kind)}</small><b>${esc(data.name)}</b>`;b.onclick=()=>{if(deductionLinked)return;if(deductionSelection.includes(id))deductionSelection=deductionSelection.filter(x=>x!==id);else if(deductionSelection.length<2)deductionSelection.push(id);else{deductionSelection.shift();deductionSelection.push(id);}renderDeduction();};$("deduction-evidence").appendChild(b);});
    const verify=document.createElement("button");verify.className="ink-button";verify.textContent=deductionLinked?"证物关系成立":"检验证物关系";verify.disabled=deductionLinked||deductionSelection.length!==2;verify.onclick=()=>verifyRelation(d);els.detail_actions.appendChild(verify);if(deductionLinked)renderConclusions(d);
  }
  function reasonHintFor(d){const supports=d.supports;const same=Object.entries(state.reasoning).find(([,arr])=>supports.every(x=>arr.includes(x)));return same?` 你此前已经把这两件相关证物放在同一推论栏，但系统仍不会替你提交答案。`:"";}
  function verifyRelation(d){const chosen=[...deductionSelection].sort().join("|"),expected=[...d.supports].sort().join("|");if(chosen!==expected){state.mistakes++;tick(3);const f=$("deduction-feedback");f.textContent="这两件证物还不能共同回答当前问题。换一种关系试试。";f.classList.add("warning");save();return;}deductionLinked=true;renderDeduction();const f=$("deduction-feedback");f.textContent=d.reason;f.classList.add("success");playPaperTick();}
  function renderConclusions(d){const label=document.createElement("p");label.className="conclusion-label";label.textContent="基于这组证物关系，提交结论：";els.detail_actions.appendChild(label);d.opts.forEach(opt=>{const b=document.createElement("button");b.className="ink-button conclusion-button";b.textContent=opt;b.onclick=()=>{if(opt===d.answer){state.deductionStep=(state.deductionStep||0)+1;save();closeAll();if(state.deductionStep>=deductions.length)finish();else setTimeout(deduction,220);}else{state.mistakes++;toast("这句话超过了当前两件证物能支持的范围。","warning");save();}};els.detail_actions.appendChild(b);});}
  function seedShuffle(arr,step){const a=[...arr],seed=(state.reviewVariant+1)*37+(step+1)*17;for(let i=a.length-1;i>0;i--){const j=(seed+i*13)% (i+1);[a[i],a[j]]=[a[j],a[i]];}return a;}

  function openLatchReplay(){
    const panel=interactiveShell("现场重演 · 门闩受力路径","这次只使用现场照片与局部放大，不用简笔机关图。先在整张照片定位，再在两块放大底片里确认线材与磨痕，最后施加拉力。",`<div class="photo-replay replay-dossier"><img src="assets/images/deadroom.webp" alt="死信室现场复原照片"><div class="replay-vignette"></div><div class="replay-caption"><b>原始现场照片 · 17—B</b><span>所有标记都建立在照片位置上</span></div><button class="photo-pin pin-vent" data-step="vent">1 · 定位通风弯头</button><button class="photo-pin pin-latch" data-step="latch" disabled>2 · 定位门闩磨痕</button><svg viewBox="0 0 1000 560" preserveAspectRatio="none"><path id="replay-line" d="M735 120 C625 164 420 195 165 288"/></svg></div><div class="replay-macros"><figure id="macro-vent"><div class="macro-photo macro-vent-photo"></div><figcaption><b>弯头放大底片</b><span>透明线卡在内侧，手臂无法通过</span></figcaption></figure><figure id="macro-latch"><div class="macro-photo macro-latch-photo"><i id="macro-bolt"></i></div><figcaption><b>门闩放大底片</b><span>新磨痕沿横向受力方向延伸</span></figcaption></figure></div><label class="range-control replay-tension">3 · 从门外缓慢施力 <input id="replay-range" type="range" min="0" max="100" value="0" disabled><b id="replay-value">0%</b></label><p id="replay-feedback" class="interactive-feedback">先在现场照片中确认通风弯头位置。</p>`);
    const vent=panel.querySelector('[data-step="vent"]'),latch=panel.querySelector('[data-step="latch"]'),r=panel.querySelector("#replay-range"),v=panel.querySelector("#replay-value"),fb=panel.querySelector("#replay-feedback"),line=panel.querySelector("#replay-line"),macroVent=panel.querySelector("#macro-vent"),macroLatch=panel.querySelector("#macro-latch"),bolt=panel.querySelector("#macro-bolt");let step=0;
    vent.onclick=()=>{if(step)return;step=1;vent.classList.add("done");macroVent.classList.add("examined");latch.disabled=false;latch.classList.add("active");line.classList.add("visible");fb.textContent="弯头位置成立。现在确认另一端是否能落在门闩新磨痕对应的受力点。";};
    latch.onclick=()=>{if(step!==1)return;step=2;latch.classList.add("done");latch.classList.remove("active");macroLatch.classList.add("examined");r.disabled=false;fb.textContent="两个端点都与证物位置一致。缓慢施力，观察放大底片中的插销横移。";};
    r.oninput=()=>{const n=+r.value;v.textContent=n+"%";bolt.style.transform=`translateX(${Math.min(46,n*.46)}px)`;if(n>=88&&step===2){step=3;fb.innerHTML='<b>受力路径成立。</b> 透明线绕过弯头后仍能把外侧拉力传到内闩，新磨痕与插销横移方向一致；高窗无需开启。';state.flags.latchReplay=true;save();r.disabled=true;macroLatch.classList.add("verified");}};
  }

  function finish(){
    if(state.ending)return;
    state.ending=true;addClue("c_sixth");unlockFragment(6);save();
    meta.replayUnlocked=true;meta.clears=(meta.clears||0)+1;if(state.reviewMode&&!meta.seenVariants.includes(state.reviewVariant))meta.seenVariants.push(state.reviewVariant);
    const rank=calculateRank();if(!meta.bestRank||rankScore(rank)>rankScore(meta.bestRank))meta.bestRank=rank;saveMeta();
    els.ending_title.textContent="没有凶手的密室";els.ending_copy.innerHTML=`<p>赫尔曼不是被毒杀，也不是被人从背后袭击。争执中，他后退失衡，后枕撞上桌角。</p><p>玛戈随后把尸体移入低温冷库，覆写温度记录，让气动胶囊跨过一夜，并用钓线制造了内闩密室。她把一次意外包装成了自己十九年来一直相信存在的“谋杀”。</p><p>真相没有让任何人赢。</p>`;
    els.ending_stats.innerHTML=endingStats(rank);els.final_letter.classList.add("hidden");els.ending_letter.classList.remove("hidden");openModal("ending-modal");
  }
  function calculateRank(){let score=100-state.mistakes*4-Object.values(state.hints).reduce((a,b)=>a+b,0)*3+(state.flags.latchReplay?5:0)+(state.reasonBoardUses>=4?4:0)+(state.reviewNotes.length*2);if(score>=94)return"完整复核";if(score>=82)return"严谨复核";if(score>=68)return"有效结案";return"快速结案";}
  function rankScore(r){return {"快速结案":1,"有效结案":2,"严谨复核":3,"完整复核":4}[r]||0;}
  function endingStats(rank){return `<div class="stat-card"><b>${rank}</b><span>本轮复核评级</span></div><div class="stat-card"><b>${state.mistakes}</b><span>无效关系 / 操作失误</span></div><div class="stat-card"><b>${state.reasonBoardUses}</b><span>主动使用推论板</span></div><div class="stat-card"><b>${state.reviewMode?state.reviewNotes.length+" / 3":"—"}</b><span>二次复核边注</span></div><p class="replay-unlock">二次复核模式已解锁：下次重新登记本案时，支线边注与终局证物排列会发生变化，但案件真相不变。</p>`;}
  function showFinalLetter(){
    els.final_letter.innerHTML=`<p>玛戈：</p><p>前五封信是你母亲写的。这一封，是我欠你的。</p><p>你小时候在邮局睡着，我怕木槌把你吵醒，会换一张桌子盖邮戳。你十五岁发烧，我在门外坐到天亮，那不是因为我不知道该去哪。</p><p>厨房还有两片黑麦面包，咖啡也够。明早如果你愿意，我们一起吃。</p><p>你叫我什么都行。</p><p>还有一件事我一直没有说清楚：你住在我家，不是借住。</p><p class="letter-sign">—— 赫尔曼</p><hr><p>第二天清晨，玛戈订的鲜奶一直放在店里。到中午，瓶身外面的水珠已经干了。</p>${state.reviewMode&&state.reviewNotes.length===3?'<p class="review-epilogue">二次复核附页：三张边注没有改变案件结论，只让你更清楚地看见——赫尔曼原本真的在准备“明天”。</p>':''}`;
    els.final_letter.classList.remove("hidden");els.ending_letter.classList.add("hidden");
  }

  function reviewTaskText(){return reviewVariants[state.reviewVariant]?.task||"";}
  function unlockReviewNote(source){if(!state.reviewMode||state.reviewNotes.includes(source))return;state.reviewNotes.push(source);save();const note=reviewVariants[state.reviewVariant]?.notes?.[source]||"边注";toast(`二次复核边注 ${state.reviewNotes.length}/3：${note}`,"success");renderNotebook();}
  function car(){if(state.reviewMode&&!state.reviewNotes.includes("exterior"))unlockReviewNote("exterior");showDetail("抛锚汽车","散热器已经凉透。二次复核时，座椅夹层里可能多一张与本案主结论无关的夜班边注。",visualForGeneric("抛锚汽车","exterior"),[],"外景记录");}
  function cat(){if(hasItem("fish")){state.inventory=state.inventory.filter(x=>x!=="fish");state.catFeeds++;if(state.catFeeds===1)toast("橘猫叼走熏鱼，钻进邮袋架下。","success");else toast("橘猫已经不再怕你。","success");if(state.reviewMode&&!state.reviewNotes.includes("exterior"))unlockReviewNote("exterior");save();renderInventory();}else showDetail("橘猫","它蹲在石阶边看着你。这里是气氛与支线，不承担主案解法。",visualForGeneric("橘猫","exterior"),[],"可选支线");}
  function radio(){showDetail("短波收音机","这是一条系列暗线，不再把‘听到顺序→原样选择’包装成主谜题。旋钮旁压着一张抄录：‘月亮升起时，老橡树下见。’",visualForGeneric("短波收音机","office"),[{label:"收录为系列暗线",run:()=>{state.flags.radio=true;save();closeAll();toast("CASE 02 暗线已收录。","success");}}],"系列暗线");}
  function suitcase(){if(state.reviewMode&&!state.reviewNotes.includes("personal"))unlockReviewNote("personal");showDetail("维克托的手提箱","不再设置‘王冠→乌鸦→橡树’这种照抄顺序锁。箱内只作为人物侧写：多本不同姓名的护照、旧维修手套和一张写着‘野兔七号’的车票。",visualForGeneric("维克托的手提箱","office"),[{label:"记入人物记录（非证物）",run:()=>{state.flags.suitcase=true;save();closeAll();renderNotebook();}}],"人物侧写");}

  function showEvidence(id){const d=evidenceData[id];showDetail(d.name,d.copy,evidenceVisual(id),reasonActions(id),d.kind);if((id==="c_latch"||id==="c_vent")&&state.clues.includes("c_latch")&&state.clues.includes("c_vent")){const b=document.createElement("button");b.className="ink-button replay-button";b.textContent=state.flags.latchReplay?"再次重演门闩机关":"用现场照片重演门闩机关";b.onclick=openLatchReplay;els.detail_actions.appendChild(b);}}
  function showItem(id){const d=itemData[id]||{name:id,kind:"物品",copy:""};showDetail(d.name,d.copy,visualForGeneric(d.name,state.scene),[],d.kind);}

  function showDetail(title,copy,visual=null,actions=[],kind="现场观察"){
    els.detail_kicker.textContent=kind;els.detail_title.textContent=title;els.detail_copy.innerHTML=copy;els.detail_visual.innerHTML=visual||visualForGeneric(title,state.scene);els.detail_actions.innerHTML="";actions.forEach(a=>{const b=document.createElement("button");b.className="ink-button"+(a.primary?" primary":"");b.textContent=a.label;b.disabled=!!a.disabled;b.onclick=a.run;els.detail_actions.appendChild(b);});openModal("detail-modal");
  }
  function openModal(id){els.modal_backdrop.classList.remove("hidden");$(id).classList.remove("hidden");}
  function closeAll(){["detail-modal","archive-modal","notebook-modal","hint-modal","support-modal","menu-modal","ending-modal"].forEach(id=>$(id)?.classList.add("hidden"));els.location_rail.classList.remove("open");els.evidence_panel.classList.remove("open");els.modal_backdrop.classList.add("hidden");}
  function toast(message,type=""){clearTimeout(toastTimer);els.toast.textContent=message;els.toast.className=`toast ${type}`;toastTimer=setTimeout(()=>els.toast.classList.add("hidden"),2800);}

  function interactiveShell(title,lead,body){
    closeAll();let overlay=$("interactive-overlay");if(!overlay){overlay=document.createElement("section");overlay.id="interactive-overlay";overlay.className="interactive-overlay";overlay.innerHTML='<article class="interactive-card"><button class="interactive-close" aria-label="关闭">×</button><p class="modal-kicker">现场操作 / TOUCH + POINTER</p><h2></h2><p class="interactive-lead"></p><div class="interactive-body"></div></article>';document.body.appendChild(overlay);overlay.querySelector(".interactive-close").onclick=closeInteractive;overlay.addEventListener("click",e=>{if(e.target===overlay)closeInteractive();});}
    overlay.querySelector("h2").textContent=title;overlay.querySelector(".interactive-lead").textContent=lead;overlay.querySelector(".interactive-body").innerHTML=body;overlay.classList.add("open");return overlay.querySelector(".interactive-body");
  }
  function closeInteractive(){const o=$("interactive-overlay");if(o)o.classList.remove("open");}

  function queueStory(id){state.pendingStory=id;save();playStory(id);}
  function playStory(id){const data=storySequences[id];if(!data)return;storyTimers.forEach(clearTimeout);storyTimers=[];storyActive=true;closeAll();els.story_register.textContent=data.register;els.story_folio.textContent=data.folio;els.story_kicker.textContent=data.kicker;els.story_heading.textContent=data.heading;els.story_lines.innerHTML="";els.story_continue.textContent=data.button;els.story_continue.classList.add("hidden");els.story_interlude.classList.remove("hidden");const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;data.lines.forEach((line,i)=>{const p=document.createElement("p");p.textContent=line;if(reduced){p.classList.add("shown");els.story_lines.appendChild(p);}else{els.story_lines.appendChild(p);storyTimers.push(setTimeout(()=>p.classList.add("shown"),i*520+100));}});storyTimers.push(setTimeout(()=>els.story_continue.classList.remove("hidden"),reduced?0:data.lines.length*520+300));els.story_continue.onclick=()=>finishStory(id);}
  function finishStory(id){const trans={opening:{chapter:1,scene:"deadroom"},chapter1:{chapter:2,scene:"office"},chapter2:{chapter:3,scene:"tube"},chapter3:{chapter:4,scene:"finale"}}[id];if(trans){state.chapter=trans.chapter;state.scene=trans.scene;}state.pendingStory=null;storyActive=false;els.story_interlude.classList.add("hidden");save();render();}

  function dialogue(lines,done){dialogueQueue=lines.map(x=>{const i=x.indexOf("|");return [x.slice(0,i),x.slice(i+1)];});dialogueDone=done;showNextDialogue();}
  function showNextDialogue(){if(!dialogueQueue.length){els.dialogue.classList.add("hidden");const d=dialogueDone;dialogueDone=null;if(d)d();return;}const [s,t]=dialogueQueue.shift();els.dialogue_speaker.textContent=s;els.dialogue_text.textContent=t;els.dialogue.classList.remove("hidden");}

  function openArchive(){renderArchive();openModal("archive-modal");}
  function renderArchive(){els.archive_tabs.innerHTML="";[1,2,3,4,5,6].forEach(n=>{const b=document.createElement("button");b.textContent=`第${n}页`;b.disabled=!state.fragments.includes(n);b.className=state.archivePage===n?"active":"";b.onclick=()=>{state.archivePage=n;if(!state.readFragments.includes(n))state.readFragments.push(n);save();renderArchive();};els.archive_tabs.appendChild(b);});const n=state.fragments.includes(state.archivePage)?state.archivePage:Math.max(...state.fragments),p=novelPages[n];state.archivePage=n;els.archive_page_no.textContent=`第${n}叶`;els.archive_page_title.textContent=p.title;els.archive_page_copy.innerHTML=`<p>${esc(p.copy)}</p>`;}
  function archiveSearch(){
    const q=els.archive_query.value.trim();if(!q){els.archive_result.textContent="目录仍有几枚钉孔。";return;}
    const hit=Object.entries(novelPages).find(([n,p])=>state.fragments.includes(Number(n))&&(p.title+p.copy).includes(q));
    if(hit){state.archivePage=Number(hit[0]);els.archive_result.textContent=`在第${hit[0]}页找到相关文字。`;renderArchive();}
    else els.archive_result.textContent="已解锁页面中没有找到这个词。";
  }

  function openNotebook(){renderNotebook();openModal("notebook-modal");}
  function openHint(){const c=state.chapter,l=Math.min(state.hints[c]||0,2);els.hint_text.textContent=hints[c][l];els.next_hint.textContent=l>=2?"已经是最具体提示":"再具体一点";els.next_hint.disabled=l>=2;openModal("hint-modal");}
  function nextHint(){const c=state.chapter;state.hints[c]=Math.min(3,(state.hints[c]||0)+1);save();openHint();}

  function openSupport(){openModal("support-modal");}
  function markPaid(){localStorage.setItem(SUPPORT_PAID,"1");els.support_btn.classList.add("paid");closeAll();toast("谢谢。案件、小说与结局始终完整开放。","success");}

  function portalTab(tab){
    $$("[data-portal-tab]").forEach(b=>b.classList.toggle("active",b.dataset.portalTab===tab));
    if(tab==="hall"){closePortalStory();return;}
    els.portal_home_view.classList.add("hidden");els.portal_reading.classList.add("active");
    if(tab==="cases"){
      els.portal_reading_kicker.textContent="旧案陈列";els.portal_reading_title.textContent="结案、未结案与失败记录";els.portal_reading_meta.textContent="按证据层级保存，不强求漂亮答案";
      els.portal_reading_copy.innerHTML=`<div class="portal-archive-list"><button data-archive-story="lamp"><b>04—C · 熄灯后的十一分钟</b><span>时间感与外部时间锚</span></button><button data-archive-story="blue"><b>08—D · 蓝窗旅馆的第十三把钥匙</b><span>先问钥匙能开哪里，可能已经问错了</span></button><button data-archive-story="rain"><b>11—A · 雨站台</b><span>没有答案也是一种结案</span></button><button data-archive-story="ashcase"><b>13—F · 灰烬里没有第三个人</b><span>不要替空白补人</span></button><button data-archive-story="case17"><b>17—B · 六封没有寄出的信</b><span>当前复核案</span></button></div>`;
      $$('[data-archive-story]',els.portal_reading_copy).forEach(b=>b.onclick=()=>openPortalStory(b.dataset.archiveStory));
    }else if(tab==="notes"){
      els.portal_reading_kicker.textContent="前辈手记";els.portal_reading_title.textContent="四种不同的调查习惯";els.portal_reading_meta.textContent="北窗 / 南桥 / 柯石 / 灰烬";
      els.portal_reading_copy.innerHTML=`<div class="portal-archive-list"><button data-archive-story="north"><b>北窗</b><span>‘一定能找到’是一种很昂贵的承诺</span></button><button data-archive-story="south"><b>南桥</b><span>把第一次写错的箭头留下来</span></button><button data-archive-story="stone"><b>柯石</b><span>别告诉我‘没多久’，给我一个会冷掉的东西</span></button><button data-archive-story="gray"><b>灰烬</b><span>不要把猜测保存成 final_final2</span></button></div>`;
      $$('[data-archive-story]',els.portal_reading_copy).forEach(b=>b.onclick=()=>openPortalStory(b.dataset.archiveStory));
    }else{
      els.portal_reading_kicker.textContent="调查守则 · 第七版";els.portal_reading_title.textContent="事实、推论与人物评价分栏";els.portal_reading_meta.textContent="站内新人必读";
      els.portal_reading_copy.innerHTML='<p>1. 现场所见与个人判断分栏记录。</p><p>2. “不确定”“不记得”按原话保留。</p><p>3. 职业、性格与关系不单独作证据。</p><p>4. 关键结论至少需要两条能够互相独立支撑的材料。</p><p>5. 私人文字可以解释人物，但不能替代物理证据。</p>';
    }
    els.portal_breadcrumb.textContent=`当前位置：烛影侦探社 › ${els.portal_reading_kicker.textContent}`;
  }

  function openPortalStory(id){const d=portalStories[id]||portalStories.letter;els.portal_home_view.classList.add("hidden");els.portal_reading.classList.add("active");els.portal_reading_kicker.textContent=d.kicker;els.portal_reading_title.textContent=d.title;els.portal_reading_meta.textContent=d.meta;els.portal_reading_copy.innerHTML=d.copy.map(p=>`<p>${esc(p)}</p>`).join("");els.portal_breadcrumb.textContent=`当前位置：烛影侦探社 › ${d.kicker} › ${d.title}`;}
  function closePortalStory(){els.portal_reading.classList.remove("active");els.portal_home_view.classList.remove("hidden");els.portal_breadcrumb.textContent="当前位置：烛影侦探社 › 值班室";}
  function portalSearch(q){const term=q.trim();if(!term)return;const entry=Object.entries(portalStories).find(([,v])=>[v.title,v.meta,...v.copy].join(" ").includes(term));if(entry)openPortalStory(entry[0]);else{openPortalStory("letter");els.portal_reading_title.textContent=`未找到“${term}”`;els.portal_reading_copy.innerHTML='<p>旧站检索只覆盖已经数字化的索引。没有结果不等于不存在记录。</p>';}}

  function visualForGeneric(title,scene){const img=sceneData[scene]?.image||"assets/images/deadroom.webp";return `<figure class="photo-dossier"><img src="${img}" alt="${esc(title)} 所在现场"><figcaption><b>${esc(title)}</b><span>现场照片与卷宗文字并列保存</span></figcaption></figure>`;}
  function evidenceVisual(id){const d=evidenceData[id],img=sceneData[d.scene]?.image||"assets/images/deadroom.webp";const focus={c_lividity:"尸体姿势与固定尸斑",c_latch:"插销孔边缘新磨痕",c_window:"连续锈蚀的钉头",c_vent:"弯头内透明钓线",c_tea:"杯底沉淀 / 胃内容物对照",c_rigor:"后枕伤 / 桌角高度",e_letterA:"压痕显影",e_letterB:"水渍穿过剂量栏",e_letterC:"0.6 补注显色",c_capsule:"17日晚蓝墨 / 18日晨到达",c_shelf:"霜面羊毛纤维",c_drag:"由层板向门外拖痕",c_chart:"2°C 上补写数字1",c_hand:"三份h末笔回钩",c_sixth:"制服内衬夹层"}[id]||d.name;return `<div class="evidence-photo"><div class="photo-main"><img src="${img}" alt="${esc(d.name)} 所在场景"></div><aside><p class="modal-kicker">EVIDENCE DETAIL</p><h3>${esc(d.name)}</h3><div class="evidence-magnifier">${esc(focus)}</div><p>${esc(d.copy)}</p></aside></div>`;}
  function drawerVisual(){return `<div class="object-layout"><div class="object-scene"><img src="assets/images/office.webp" alt="办公室抽屉所在场景"></div><div class="object-tray"><span>扁平铅笔</span><span>短蜡烛</span><span>黑面包</span><span>便笺</span></div></div>`;}
  function archiveLedgerVisual(){return `<div class="ledger-visual"><div class="ledger-page"><b>死信处理守则</b><p>旧火漆：隔距慢热，约两指宽；勿贴火，勿硬撬。</p></div><div class="ledger-page blue"><b>用品采购 · 蓝边纸</b><p>纸张：淀粉上浆。批次 17-B。</p></div></div>`;}
  function paperVisual(type,done){return `<div class="paper-evidence ${done?"done":""}"><div class="paper-sheet type-${type}"><span>${type==="A"?(done?"17—B · 第六封未投递":"侧光下有浅沟"):type==="B"?(done?"处方剂量栏被水渍穿过":"旧火漆封口"):done?"0.6，不是6。——H":"蓝边纸上有透明痕迹"}</span></div></div>`;}
  function waxVisual(){return `<div class="wax-evidence"><div class="wax-paper"><i></i><b>W</b></div><aside>守则来源：死信柜旧邮件处理手册</aside></div>`;}
  function labVisual(mode){return `<div class="lab-evidence"><img src="assets/images/lab.webp" alt="配药储物间实验台"><div class="lab-caption">${mode==="control"?"先在牺牲样本验证碘—淀粉反应":mode==="mix"?"对照成立后才配制稀释液":"实验完成，不增加无关合成题"}</div></div>`;}
  function tubeVisual(mode=""){return `<div class="lab-evidence"><img src="assets/images/tube.webp" alt="气动管控制室"><div class="lab-caption">${mode==="repair"?"维修只恢复低压复现；调查员负责验证时间机关":"设备铭牌与胶囊时间记录必须一起看"}</div></div>`;}
  function valveVisual(mode=""){return `<div class="timing-dossier"><div><b>17日 19:20</b><span>胶囊进入</span></div><i></i><div><b>18日 07:32</b><span>胶囊落下</span></div><aside>${mode==="overnight"?"释放销：隔夜槽":"卡槽：立即 / 3h / 6h / 隔夜≈12h"}</aside></div>`;}
  function chartVisual(done){return `<div class="chart-visual"><table><tr><th>日期</th><th>06:00</th><th>12:00</th><th>18:00</th></tr><tr><td>11/16</td><td>3°C</td><td>3°C</td><td>2°C</td></tr><tr><td>11/17</td><td>2°C</td><td class="overwrite">${done?'<del>1</del>2°C':'12°C'}</td><td>2°C</td></tr></table><p>${done?"侧光确认底层原记录为2°C。":"数字1的墨色更新，需要结合冷库痕迹后再做侧光检查。"}</p></div>`;}
  function handVisual(){return `<div class="hand-compare"><figure><b>今晨来信</b><span>h</span></figure><figure><b>温度表覆写</b><span>h</span></figure><figure><b>玛戈登记簿</b><span>h</span></figure><p>比较末笔回钩角度与停笔位置，不使用“整体看起来像”作为标准。</p></div>`;}
  function bookVisual(){return `<div class="book-visual"><div class="book-page"><b>死亡时间判断</b><p>低温改变变化速度；不会重写原始伤口或固定尸斑。</p></div><div class="book-page"><b>纸张检验</b><p>先做对照实验，再把试剂用于原证物。</p></div></div>`;}
  function relationVisual(d){return `<div class="relation-board"><div class="relation-node"><span>证物 A</span></div><i></i><div class="relation-node"><span>证物 B</span></div><strong>${esc(d.q)}</strong></div>`;}

  function wrong(message){state.mistakes++;save();toast(message,"warning");}

  function bind(){
    const on=(target,event,fn)=>{const el=typeof target==="string"?$(target):target;if(el)el.addEventListener(event,fn);};
    on("new-game","click",openStartChoice);on(els.continue_game,"click",continueCase);on("title-sound","click",()=>setSound(!audio.enabled));
    on(els.portal_urgent_thread,"click",()=>els.dispatch_modal?.classList.remove("hidden"));on(els.dispatch_later,"click",()=>els.dispatch_modal?.classList.add("hidden"));on(els.dispatch_enter,"click",()=>{els.dispatch_modal?.classList.add("hidden");showOnly("title");});on(els.portal_continue,"click",()=>showOnly("title"));
    $$("[data-story]").forEach(a=>on(a,"click",e=>{e.preventDefault();openPortalStory(a.dataset.story);}));$$("[data-portal-tab]").forEach(b=>on(b,"click",()=>portalTab(b.dataset.portalTab)));on(els.portal_reading_close,"click",()=>portalTab("hall"));if(els.portal_search)els.portal_search.onsubmit=e=>{e.preventDefault();portalSearch(els.portal_search_input.value);};
    on(els.case_home,"click",()=>{closeAll();showOnly("portal");updateContinue();});
    on("mobile-locations","click",()=>{closeAll();els.location_rail?.classList.add("open");els.modal_backdrop?.classList.remove("hidden");});on("close-locations","click",closeAll);on("mobile-evidence","click",()=>{closeAll();els.evidence_panel?.classList.add("open");els.modal_backdrop?.classList.remove("hidden");});
    on("archive-btn","click",openArchive);const archiveForm=$("archive-search");if(archiveForm)archiveForm.onsubmit=e=>{e.preventDefault();archiveSearch();};on("notebook-btn","click",openNotebook);on("hint-btn","click",openHint);on(els.next_hint,"click",nextHint);on("support-btn","click",openSupport);on("sound-btn","click",()=>setSound(!audio.enabled));on("menu-btn","click",()=>openModal("menu-modal"));
    on("resume-game","click",closeAll);on("reset-game","click",()=>{if(confirm("重新调查会覆盖当前案卷进度。")){clearSave();closeAll();openStartChoice();}});on("back-title","click",()=>{closeAll();showOnly("portal");updateContinue();});
    on("support-done","click",markPaid);on("support-later","click",closeAll);on(els.ending_letter,"click",showFinalLetter);on("ending-restart","click",()=>{closeAll();clearSave();showOnly("title");updateContinue();});
    $$("[data-close]").forEach(b=>on(b,"click",closeAll));on(els.modal_backdrop,"click",closeAll);on(els.dialogue_next,"click",showNextDialogue);
    on("inventory-prev","click",()=>els.inventory_list?.scrollBy({left:-220,behavior:"smooth"}));on("inventory-next","click",()=>els.inventory_list?.scrollBy({left:220,behavior:"smooth"}));
    document.addEventListener("keydown",e=>{if(e.key==="Escape"){if($("interactive-overlay")?.classList.contains("open"))closeInteractive();else if(storyActive){}else closeAll();}});
  }

  function init(){bind();if(localStorage.getItem(SUPPORT_PAID))els.support_btn.classList.add("paid");updateContinue();showOnly("portal");render();if(new URLSearchParams(location.search).has("test")){window.__caseTest={get state(){return state;},start:mode=>startCase(mode),setState:p=>{state=Object.assign(defaultState(),p);render();},deductions,chapters,sceneData,evidenceData,validate:validateData,checkpointReady,openCheckpoint:n=>openChapterCheckpoint(n),completeCheckpoint:n=>completeChapterCheckpoint(n,"test")};}}

  function validateData(){const errors=[];const required=["archive-btn","notebook-btn","hint-btn","support-btn","sound-btn","menu-btn","archive-modal","notebook-modal","hint-modal","support-modal","menu-modal"];required.forEach(id=>{if(!$(id))errors.push(`missing dom ${id}`);});Object.entries(sceneData).forEach(([sid,s])=>s.hotspots.forEach(h=>{if(h.clue&&!evidenceData[h.clue])errors.push(`missing evidence ${h.clue}`);if(h.item&&!itemData[h.item])errors.push(`missing item ${h.item}`);}));deductions.forEach((d,i)=>{d.supports.forEach(x=>{if(!evidenceData[x])errors.push(`deduction ${i} missing ${x}`);});if(!d.opts.includes(d.answer))errors.push(`deduction ${i} answer not in opts`);});return errors;}

  init();
})();
