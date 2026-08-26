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
    exterior:{title:"门房老奥托记得的，是一盏总比别人晚熄的灯",source:"2007 年口述档案补录",copy:`<p>老奥托在邮局做了三十一年门房。冬天六点以后，大厅的人声会先散掉，随后是分拣室、登记台和柜台一盏一盏熄灯。局长办公室通常最晚，他常说那扇磨砂玻璃后面的灯像一只慢半拍的钟。</p><p>赫尔曼下班很少走正门。他会先绕到锅炉间看一眼火，再把门房桌上的水壶添满。老奥托年轻时总觉得这是局长在检查工作，后来才明白，赫尔曼只是知道他夜里腿疼，不愿让他再去地下室提水。</p><p>口述录到这里时，老奥托已经九十岁。他仍记得邮局门轴在冬天会发涩，记得赫尔曼习惯戴右手手套、左手夹文件，也记得第一场雪后门厅里总有湿羊毛和煤烟混在一起的味道。至于那些年究竟有多少个夜晚灯亮得很迟，他说自己早已数不清了。</p>`},
    deadroom:{title:"裁缝铺十月账页：一件穿了很多年的制服",source:"施耐德裁缝铺 · 1927.10",copy:`<p>施耐德裁缝铺留下的十月账页上，赫尔曼的名字旁边记着袖口加固、领口换线和左胸旧布修补。这样的项目并不昂贵，却每隔一两年就会重复出现。</p><p>老裁缝的儿子回忆，赫尔曼很少愿意整件换新。他说旧布已经顺着肩膀和手臂的动作磨出了形状，新的反而别扭。制服送去修时，他通常站在柜台边等，不坐椅子，也不催，只会在裁缝剪下旧线头时伸手把它们拢到纸片上，免得掉进地板缝。</p><p>账页还夹着一张褪色布样：深灰羊毛，织纹很密，边缘因为多年摩擦变得发亮。裁缝铺把这种料子称作“邮政灰”。在魏瑟堡街上，它曾经和邮筒的红、冬季煤烟的黑一样普通。</p>`},
    office:{title:"艾尔莎记得，玛戈小时候总在高柜旁写作业",source:"艾尔莎·克劳斯退休访谈 · 1958",copy:`<p>玛戈放学后常在高柜旁写作业。那张小桌原本用来捆扎退信，桌面比普通书桌高，她坐上去时脚尖够不到地，只能一下一下碰柜门。</p><p>她写字很慢，尤其不喜欢把姓名写歪。艾尔莎记得她曾在一张废邮资单背面连续写了七遍自己的名字，最后一遍才满意。赫尔曼经过时没有夸她，只把墨水瓶往远处挪了半掌，怕她袖口碰倒。</p><p>下午最忙的时候，邮戳木槌敲在桌面上很响。玛戈若睡着，赫尔曼便把盖戳的工作搬到另一张桌。艾尔莎说，那时候大家都装作没注意，因为赫尔曼最不喜欢别人把这种事说成体贴。</p>`},
    lab:{title:"哈斯下班前，总要把药秤擦到看不见粉末",source:"镇医务所清点册与学徒访谈",copy:`<p>哈斯说话直接，脾气也坏，病人若把剂量记在烟盒背面，他会当场训人。但每天最后一个病人离开后，他一定把黄铜药秤擦干净，再把砝码从大到小放回木盒。</p><p>学徒记得，他不许上一位病人的药粉留到下一位病人的托盘里。擦秤用的软布挂在窗边，冬天常常来不及干透，第二天仍带一点酒精和苦药混在一起的气味。</p><p>医务所的抽屉里保存着许多练字纸和废弃标签。哈斯会在空白边角写药名、日期、重量，也会因为一个字写得太潦草整行划掉重来。那些纸张没有被当作正式病历，只是一个长期做精细工作的医生留下的日常痕迹。</p>`},
    tube:{title:"维克托拆机器时，习惯把每一枚螺丝排成一条线",source:"艾达私人边注与旅馆口述",copy:`<p>维克托处理机械时几乎不说话。他先铺一块旧手帕，拆下来的螺丝按长度从左到右排好，垫圈单独放，若有人顺手替他挪位置，他会停下来重新排一次。</p><p>旅馆女主人记得，他每天清晨喝不加糖的黑咖啡，喝完会把杯柄转到右侧，再把硬币压在碟子下面。这样的动作和他修机器时一样，像是在离开之前把东西恢复到自己认可的位置。</p><p>气动管控制室里长年有机油、黄铜和旧皮革的味道。维克托第一次进去时，没有表现出新奇，只在几段管线上用指节轻轻敲过。有人问他以前是否做过这类工作，他说：“很久以前靠手吃饭。”然后就没有再解释。</p>`},
    cold:{title:"冷库管理员的冬季值班，总从一只搪瓷杯开始",source:"邮票冷藏库值班簿 · 1926—1928",copy:`<p>冷藏库保存的是怕潮的邮票纸、胶料和少量档案用品。管理员每天清晨先在门外喝完一杯热水，再进去抄温度，因为里面太冷，钢笔墨会变稠，手指也容易发僵。</p><p>值班簿边角记了许多与工作无关的小事：哪一扇门铰链需要上油，哪一批木架会在低温里收缩发响，谁又忘记把羊毛围巾从门后的钉子上取走。长期重复的工作让这些细节比日期更容易留在记忆里。</p><p>管理员退休后说，他最讨厌冬天有人把热咖啡带进冷库，因为杯口会很快结雾，纸张又怕潮。他在门边放了一块小木牌，上面只写四个字：“杯子留外。”这块牌后来一直挂到邮局改造。</p>`},
    finale:{title:"艾达调查簿的最后一页，总比正文写得更慢",source:"艾达·克莱因私人调查簿",copy:`<p>艾达写正式记录很快。日期、位置、尺寸和人员，她会一项一项压进固定栏格里，字迹像在赶时间。真正写得慢的是页脚，那些不属于证据、却又舍不得完全丢掉的小事。</p><p>她常记谁把湿外套搭在了哪把椅子上，谁在等询问时把烟掐灭又重新点起，谁离开房间前把别人碰歪的杯子扶正。这样的句子不会进入结论，也不会改变任何证物的重量。</p><p>多年以后整理者才发现，几乎每宗旧案最后都有类似的边注。它们让调查簿不像一台只会产出答案的机器，更像有人真实地在那些房间里待过，听过钟声、闻过煤烟，也见过一些无法归档的小动作。</p>`}
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
    case17:{kicker:"案卷索引",title:"17—B · 六封没有寄出的信",meta:"只读摘要",copy:["1927年11月18日，赫尔曼·福格尔被发现死于地下死信室。","原案结论存在多处时间与密室逻辑冲突。公开索引只列原始登记与附件目录，最终结论在复核完成前保持折叠。"]}
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
    const frag=caseFragments[state.scene];els.case_fragment_title.textContent=frag.title;els.case_fragment_copy.innerHTML=frag.copy;els.case_fragment_source.textContent=frag.source;
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
      intro:"三封信都已经打开。这一步先复核每种处理方法的来源：现场材料、旧守则或对照实验。来源不足的方法不能写入案卷。",
      steps:[
        {q:"压痕显影的方法来源是什么？",need:["src_pencil"],pool:["src_pencil","src_wax","src_starch"],labels:{src_pencil:"抽屉便笺 + 软芯木工铅笔",src_wax:"旧邮件火漆处理守则",src_starch:"蓝边纸采购登记 + 淀粉对照实验"},ok:"先看见压痕，再找到不会浸湿旧纸的软芯工具，处理方法由现场自己推出。"},
        {q:"火漆为什么可以采用‘隔距慢热’？",need:["src_wax"],pool:["src_pencil","src_wax","src_starch"],labels:{src_pencil:"抽屉便笺 + 软芯木工铅笔",src_wax:"旧邮件火漆处理守则",src_starch:"蓝边纸采购登记 + 淀粉对照实验"},ok:"旧邮件处理守则明确留下了隔距慢热的处理方法，这一操作有可追溯来源。"},
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
    showDetail("死信柜与用品登记","柜内保留旧邮局实际使用过的处理守则与采购登记。纸张批次、封缄方法和用品来源都能在这里核对。",archiveLedgerVisual(),actions,"档案用品记录");
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
      showDetail("对照实验 · 碘与淀粉",ready?"用面粉做牺牲样本，不接触原证物。先验证碘与淀粉的反应，再决定是否处理蓝边纸。":"要做安全的对照实验，需要碘酒和含淀粉的面粉样本。",labVisual("control"),ready?[{label:"把一滴碘酒滴在面粉样本上",primary:true,run:()=>{state.flags.starchConfirmed=true;addKnowledge("对照样本迅速变蓝黑：碘能检出淀粉。 ");closeAll();render();toast("对照反应成立。现在才有理由处理蓝边纸。","success");}}]:[],"对照实验");return;
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
    const panel=interactiveShell("现场重演 · 门闩受力路径","先在原始现场照片中定位通风弯头和门闩，再用两块放大底片确认线材与磨痕，最后施加拉力复现受力路径。",`<div class="photo-replay replay-dossier"><img src="assets/images/deadroom.webp" alt="死信室现场复原照片"><div class="replay-vignette"></div><div class="replay-caption"><b>原始现场照片 · 17—B</b><span>所有标记都建立在照片位置上</span></div><button class="photo-pin pin-vent" data-step="vent">1 · 定位通风弯头</button><button class="photo-pin pin-latch" data-step="latch" disabled>2 · 定位门闩磨痕</button><svg viewBox="0 0 1000 560" preserveAspectRatio="none"><path id="replay-line" d="M735 120 C625 164 420 195 165 288"/></svg></div><div class="replay-macros"><figure id="macro-vent"><div class="macro-photo macro-vent-photo"></div><figcaption><b>弯头放大底片</b><span>透明线卡在内侧，手臂无法通过</span></figcaption></figure><figure id="macro-latch"><div class="macro-photo macro-latch-photo"><i id="macro-bolt"></i></div><figcaption><b>门闩放大底片</b><span>新磨痕沿横向受力方向延伸</span></figcaption></figure></div><label class="range-control replay-tension">3 · 从门外缓慢施力 <input id="replay-range" type="range" min="0" max="100" value="0" disabled><b id="replay-value">0%</b></label><p id="replay-feedback" class="interactive-feedback">先在现场照片中确认通风弯头位置。</p>`);
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
  function cat(){if(hasItem("fish")){state.inventory=state.inventory.filter(x=>x!=="fish");state.catFeeds++;if(state.catFeeds===1)toast("橘猫叼走熏鱼，钻进邮袋架下。","success");else toast("橘猫已经不再怕你。","success");if(state.reviewMode&&!state.reviewNotes.includes("exterior"))unlockReviewNote("exterior");save();renderInventory();}else showDetail("橘猫","它蹲在石阶边看着你，鼻尖一直朝着油纸包的方向。",visualForGeneric("橘猫","exterior"),[],"可选支线");}
  function radio(){showDetail("短波收音机","旋钮旁压着一张抄录：‘月亮升起时，老橡树下见。’频率刻度被人在同一位置反复划过。",visualForGeneric("短波收音机","office"),[{label:"夹入未编号附件",run:()=>{state.flags.radio=true;save();closeAll();toast("未编号附件已夹入案卷边页。","success");}}],"系列暗线");}
  function suitcase(){if(state.reviewMode&&!state.reviewNotes.includes("personal"))unlockReviewNote("personal");showDetail("维克托的手提箱","箱内有多本不同姓名的护照、旧维修手套和一张写着‘野兔七号’的车票。搭扣没有近期撬动痕迹。",visualForGeneric("维克托的手提箱","office"),[{label:"记入人物记录（非证物）",run:()=>{state.flags.suitcase=true;save();closeAll();renderNotebook();}}],"人物侧写");}

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
  function evidenceVisual(id){
    const d=evidenceData[id],img=sceneData[d.scene]?.image||"assets/images/deadroom.webp";
    const detail={
      c_lividity:{label:"尸体与周边位置",pos:"46% 68%",scale:1.72},
      c_latch:{label:"门闩与插销区域",pos:"4% 49%",scale:1.95},
      c_window:{label:"高窗木板与钉头",pos:"31% 11%",scale:1.9},
      c_vent:{label:"通风弯头与格栅",pos:"68% 8%",scale:1.9},
      c_tea:{label:"桌面杯具所在区域",pos:"70% 51%",scale:2.05},
      c_rigor:{label:"头部与桌角相对位置",pos:"50% 70%",scale:1.72},
      e_letterA:{label:"信纸表面与压痕",pos:"30% 62%",scale:1.9},
      e_letterB:{label:"火漆封口与纸边",pos:"50% 60%",scale:1.9},
      e_letterC:{label:"蓝边纸与笔画区域",pos:"69% 61%",scale:1.9},
      c_capsule:{label:"投递胶囊与接收槽",pos:"76% 69%",scale:1.85},
      c_shelf:{label:"冷库长层板霜面",pos:"49% 37%",scale:1.7},
      c_drag:{label:"层板至门口地面",pos:"49% 74%",scale:1.7},
      c_chart:{label:"温度记录表区域",pos:"82% 34%",scale:1.95},
      c_hand:{label:"三份原件的书写区域",pos:"53% 56%",scale:1.65},
      c_sixth:{label:"制服与内衬位置",pos:"45% 63%",scale:1.8}
    }[id]||{label:d.name,pos:"50% 50%",scale:1.65};
    return `<div class="evidence-photo"><div class="photo-main"><img src="${img}" alt="${esc(d.name)} 所在场景"></div><aside><p class="modal-kicker">EVIDENCE DETAIL</p><h3>${esc(d.name)}</h3><figure class="evidence-crop"><img src="${img}" alt="${esc(detail.label)}" style="object-position:${detail.pos};--evidence-zoom:${detail.scale}"><figcaption><b>局部复核</b><span>${esc(detail.label)}</span></figcaption></figure><p>${esc(d.copy)}</p></aside></div>`;
  }
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

/* ================================================================
   Integrated v8 archive module
   Source formerly maintained in literature-patch.js.
   Kept inside game.js so the old standalone file can be deleted.
   ================================================================ */
(() => {
  "use strict";

  if (window.__CANDLELIT_ARCHIVE_MODULE__) return;
  window.__CANDLELIT_ARCHIVE_MODULE__ = true;

  const ARCHIVE_MODULE_VERSION = "2026-08-26-stability-archive-5";
  const $ = (id) => document.getElementById(id);

  const stories = {
    casesIndex: {
      tab: "cases",
      kicker: "站点导航 · 旧案陈列",
      meta: "整理：灰烬 / 旧卷数字化第 12 批 / 页面修订 12-31",
      title: "旧案陈列：案子结束以后，卷宗还会留下什么",
      pages: [
        `<div class="case-dossier"><p>烛影的旧案不按“精彩程度”排序，也不把所有结案写成胜利。这里有抓到人的案子，有证明没人犯罪的案子，也有查了半年，只能把“去向不明”四个字写得更准确一些的案子。我们保留全过程，是因为调查真正有用的部分往往不在最后那一行结论，而在中途那些差一点把人带错方向的判断。</p>
         <p>旧卷统一保留六类内容：首次报案、现场原始记录、当时的主要假设、被排除的错误方向、关键验证、结案或暂停理由。后来的漂亮总结不能覆盖当年走过的弯路。否则新人只会学会“答案”，学不会为什么某个答案曾经看起来那么像真的。</p>
         <div class="case-card"><span class="case-status closed">已结案</span><h3>04—C · 熄灯后的走廊</h3><p>一名会计在档案馆停电后的黑暗里受伤，四位证人都说“灯只灭了一会儿”。案子最初被当作有预谋袭击，最后却从楼下钟声、茶壶鸣笛和一只沾煤灰的保险丝重新获得时间。</p><button data-story="case04">阅读完整办案过程 ›</button></div>
         <div class="case-card"><span class="case-status closed">已结案</span><h3>08—D · 蓝窗旅馆的第十三把钥匙</h3><p>只有十二间客房的旅馆，清点时却有十三把铜钥匙。珠宝失窃案因此被指向“内部人”，真正的问题却是：那把多出来的钥匙到底开过什么。</p><button data-story="case08">阅读完整办案过程 ›</button></div></div>`,
        `<div class="case-dossier"><div class="case-card"><span class="case-status open">暂停调查</span><h3>11—A · 雨站台</h3><p>一名男子在末班车后失踪。脚印被雨冲散，两张回程票、一份无人领取的晨报和七个月的排查都没能回答他去了哪里。卷宗没有“真相”，只有越来越窄的可能性。</p><button data-story="case11">阅读七个月调查记录 ›</button></div>
         <div class="case-card"><span class="case-status closed">已结案</span><h3>13—F · 河岸仓库的干鞋</h3><p>涨水后的仓库里发现一具湿透的尸体，鞋底却几乎是干的。第一眼像搬尸，第二眼像伪装，最后发现“干”本身才是被误读的证据。</p><button data-story="case13">阅读完整办案过程 ›</button></div>
         <div class="case-card"><span class="case-status review">复核中</span><h3>17—B · 魏瑟堡死信室</h3><p>1927 年旧案。当前夜班正在重走原始现场，旧结论暂时折叠。此页只列公开索引，不提前展示复核结果。</p><button data-story="case17">查看无剧透卷宗索引 ›</button></div></div>`,
        `<div class="case-dossier"><h3>为什么把“没破”的案子也放进陈列</h3><p>新人最容易从旧案里学到一种危险的错觉：只要足够聪明，每个细节都会在最后排成整齐的一列。真实调查并不总这么配合。有人记错时间，有东西被雨冲掉，有证人去世，有一条路在几十年前就断了。承认缺口不是失败，而是对后来的人负责。</p>
         <p>灰烬在旧案室门后贴过一张纸：<em>“请勿在结论不足时强行获得文学性。现实已经够麻烦，不需要我们替它补第三幕。”</em>据说这张纸是写给南桥的。南桥坚称是写给打印机，因为那台机器尤其喜欢在最后一页卡纸。</p>
         <p>旧案陈列因此同时保留两种结束：一种叫“结案”，一种叫“停止扩大确定性”。前者告诉我们发生了什么；后者至少告诉我们，哪些事还不能诚实地说成发生过。</p><p class="portal-archive-note">当前公开：4 宗完整旧案、1 宗复核中案卷。人物私生活与文学资料仍与证物分栏。</p></div>`
      ]
    },
    case04: {
      tab: "cases", kicker: "旧案全过程 · 04—C", meta: "主办：柯石 / 复盘批注：南桥 / 已结案",
      title: "熄灯后的十一分钟：一桩被四个人共同缩短的事故",
      pages: [
        `<div class="case-dossier"><h3>一、报案：所有人都说“没多久”</h3><p>案发在市立档案馆二楼。21:14 左右走廊突然停电，恢复照明后，会计路德维希倒在楼梯转角，后枕裂伤，身边有一根沾血的黄铜镇纸。当天他刚与出纳埃米尔因一笔缺账争吵，四名在场者又都承认黑暗中“听见过脚步”，于是最初方向几乎自然地滑向了袭击。</p><p>第一轮询问给出的黑暗时长分别是三分钟、五分钟、八分钟和“最多两三分钟”。奇怪的是，四个人语气都很确定。柯石在卷宗边上写：<em>“如果四只钟都不一样，先别急着挑一只最顺眼的。”</em></p>
         <h3>二、现场：镇纸很显眼，灰尘更有用</h3><p>镇纸上的血来自伤者，但握柄没有新鲜手汗，只沾到倒地时溅上的血点。真正异常的是配电箱：一枚保险丝被人为旋松，螺纹上有新鲜煤灰，而煤灰只来自地下锅炉房。二楼四名证人中只有值夜工去过锅炉房，可他右手戴着厚皮手套，保险丝上的指腹纹却很清楚。</p><p>到这里，调查出现第一个岔路：有人故意制造停电，这是真的；“制造停电的人就是袭击者”，还只是一个方便的句子。</p></div>`,
        `<div class="case-dossier"><h3>三、时间重建：楼下的钟比证词难哄</h3><p>档案馆没有停电时钟，但楼下钟表店每十五分钟敲一次小钟。四名证人里两人记得黑暗中听到一次，门卫记得灯亮前又听到一次。隔壁茶房的水壶在21:20烧开，女工关火后摸黑上楼，照明恢复时她才刚到二层。把三条外部事件叠起来，黑暗不是“三五分钟”，而是约十一分钟。</p><p>这十一分钟解释了另一个细节：伤者袖口有干燥的纸灰，而不是走廊地面尘土。沿着灰屑找到旧档案室，发现一本缺账簿被塞回高柜，柜脚的折梯仍没有收好。</p>
         <h3>四、错误方向：大家都在等一个“打人的人”</h3><p>埃米尔有争执、有时间，也说谎。他说停电后一直站在原地，实际上摸黑下楼找过门卫。这个谎让他成为最像嫌疑人的人。南桥后来在复盘里写：“人只要撒一个与犯罪无关的谎，调查员就很容易奖励他一整套犯罪。”</p><p>埃米尔隐瞒下楼，是因为他怕被发现私自借过账簿。这个事实难看，但和路德维希的伤不是同一件事。</p></div>`,
        `<div class="case-dossier"><h3>五、验证与结案：停电是他自己制造的</h3><p>路德维希清醒后承认，缺账是他多年挪用公款留下的痕迹。当晚他旋松保险丝，想利用黑暗取回旧账簿再制造“停电混乱中遗失”的假象。摸黑爬折梯时，他听见楼下有人上来，急着转身，脚踩空后撞上墙边黄铜镇纸架。镇纸随身体跌落，才沾上血。</p><p>保险丝指纹、旧柜纸灰、折梯位置与伤口高度全部吻合。埃米尔的谎另行记入内部纪律调查，未与伤害事件合并处理。04—C 最终以“自制造停电、意外坠落；另涉账目犯罪”结案。</p>
         <h3>六、后记</h3><p>这宗案子后来被用来训练“时间锚点”。柯石每次讲到这里都要提醒新人：<em>“人脑不是秒表。尤其害怕的时候，它连钟面都懒得画。”</em>有人问那四个证人为什么都把十一分钟说短。他答：“因为黑暗里没东西可看。没东西可看，人就以为时间也没做事。”</p><p>南桥在页脚补了一句：“还有一种可能，他们只是都急着回家。”柯石用红笔写：<em>“不排除。无证据。”</em></p></div>`
      ]
    },
    case08: {
      tab: "cases", kicker: "旧案全过程 · 08—D", meta: "主办：灰烬 / 现场协查：北窗 / 已结案",
      title: "蓝窗旅馆的第十三把钥匙",
      pages: [
        `<div class="case-dossier"><h3>一、失窃与第十三把钥匙</h3><p>蓝窗旅馆只有十二间客房。冬季舞会第二天，住在7号房的珠宝商报失一只装有六枚胸针的皮匣，门窗无撬痕，房门夜间反锁。柜台清点却发现钥匙板上有十三把几乎一样的铜钥匙。老板娘当场指向夜班伙计：只有内部人知道多余钥匙的存在。</p><p>灰烬没有先问“第十三把是谁的”，而是把十三把都编号、称重、描摹齿口。第十三把比客房钥匙短两毫米，齿口磨损方向也相反。它看起来像客房钥匙，只因为旅馆用了同一批铜坯。</p>
         <h3>二、第一天：一个太漂亮的嫌疑人</h3><p>夜班伙计欠赌债，案发时独自在柜台，鞋底还有七楼走廊同种蓝色蜡屑。动机、机会、痕迹几乎齐全。北窗却注意到他的蓝蜡粘在鞋跟外缘，而七楼刚打蜡的地面会把蜡压进前掌纹路。鞋跟蜡来自他早晨帮人搬窗框时蹭到的油漆封蜡，不是走廊。</p><p>灰烬后来写：“证据整齐得像排版好的讣告时，我会先怀疑是不是自己太想下班。”</p></div>`,
        `<div class="case-dossier"><h3>三、钥匙真正开的门</h3><p>第十三把最终打开的是地下洗衣间外一扇废弃送餐升降井。旅馆改造前，十二间房都能通过小升降箱送热水；改造后井口封死，只有7号房衣柜背板还保留检修口。检修口的螺钉上有新鲜肥皂屑，说明有人用湿肥皂压过螺纹位置再复装。</p><p>这时“密室”才真正被拆开：房门不需要打开。皮匣可以从衣柜背后的旧检修口进入升降井，再由地下层取出。</p>
         <h3>四、谁知道旧结构</h3><p>所有现职员工都说不知道升降井。北窗去镇档案所查到十二年前的改造图，签字的木匠恰好是珠宝商本人早年的合伙人克莱因。克莱因当晚也住在旅馆，房号11。他否认见过7号房，却在询问时准确说出“那块背板早该换了”。这句话被原样记下，没有立即追问。</p><p>第二天测量两间房墙厚，11号房衣柜背后同样有封板。克莱因从自己房间进入旧井道，再从7号房取走皮匣。井道灰尘中找到他左袖缺失的一枚骨扣。</p></div>`,
        `<div class="case-dossier"><h3>五、结案：钥匙只是让人看错门</h3><p>胸针在克莱因寄存车站的样品箱里找到。他承认因旧债与珠宝商纠纷计划盗窃。第十三把钥匙与犯罪无直接关系，只是打开地下维护门；真正进入7号房的是封存升降井。</p><p>这案子最常被新人记成“第十三把钥匙的秘密”，灰烬对此很不满意。他在归档封面写：<em>“钥匙没有秘密。人看见钥匙就自动替它安排了一扇门，这才是问题。”</em></p>
         <h3>六、人物余波</h3><p>夜班伙计因为赌债曾被怀疑，洗清后仍辞了工作。老板娘在工资袋里多放了半个月薪水，嘴上说是“避免他去外面说旅馆坏话”。北窗说这算道歉。灰烬说：“不要替别人把笨拙的好意翻译得太流利。”</p><p>那把第十三钥匙如今还在旧案柜里，标签写着：<b>非作案工具 / 重要误导物。</b>下面有人铅笔补了一句：<em>“也是一把正常工作的地下室钥匙。请尊重它的本职。”</em></p></div>`
      ]
    },
    case11: {
      tab: "cases", kicker: "旧案全过程 · 11—A", meta: "主办：北窗 / 调查 7 个月 / 状态：暂停",
      title: "雨站台：七个月以后，我们只排除了几种离开方式",
      pages: [
        `<div class="case-dossier"><h3>一、失踪当夜</h3><p>三月的雨从傍晚下到天亮。失踪者马丁与妻子原定乘22:40末班车回家，两张回程票都已买好。妻子去候车室取落下的围巾，回来时马丁不见了。站台没有打斗痕迹，雨却在二十分钟内把脚印冲成一层模糊水痕。</p><p>警方最早考虑落轨、自行离开和临时会面。河道、铁路沿线、旅馆与医院都查过。没有尸体，没有新购车票，没有可靠目击。</p><p>妻子一直捏着两张回程票。北窗在第一天笔记里只写：<em>“票证明两个人计划回来，不证明两个人最后都打算回来。”</em></p></div>`,
        `<div class="case-dossier"><h3>二、第二周：一份没有取走的晨报</h3><p>凌晨四点开摊的报贩老妇记得马丁每周三替二号街一位视力不好的老人买《晨报》。失踪那天正是周三，报摊底下还压着一份预留的报纸。这条生活习惯让“长期计划出走”变得不那么顺畅，却不能排除临时决定。</p><p>调查随后找到三笔小额欠款、一次与兄长的争吵、以及他半年前向船运公司问过工作的记录。每一条都足够写成故事，没有一条足够成为结论。南桥当时建议把“可能离镇”加粗，北窗把字改回普通字号，并在旁边写：“字体大小不是证据权重。”</p>
         <h3>三、第四个月：雨停以后才出现的空白</h3><p>铁路局核对货运列车，确认有一趟未载客慢车在23:05经过外侧货线，理论上可以攀上，但当夜巡检员没有发现异常。河面下游搜寻三次无结果。邻镇收容所出现过一个相似姓名，最终证实是另一人。</p><p>调查不是越来越接近一个答案，而是不断把一些看似可能的门关上。</p></div>`,
        `<div class="case-dossier"><h3>四、第七个月：为什么停止</h3><p>七个月后，没有新物证能够区分“自愿离开、意外落水、搭乘未登记车辆”中的剩余可能。继续把同一批材料重新排列，只会让推测看起来越来越熟练。北窗申请暂停，结论写作：<b>去向不明；未发现足以支持犯罪、事故或主动失踪中任何单一解释的证据。</b></p><p>妻子后来搬走，把两张票寄给侦探社。一张被手心磨得发软，一张几乎是新的。北窗没有把它们放进公开证物柜，只在手记里写：“它们证明有人等过。仅此而已，也已经不少。”</p>
         <h3>五、案卷余页</h3><p>新人偶尔会问：这么多年以后，会不会突然找到答案。北窗通常说“会”，然后补：“也可能不会。”这两个回答在他那里并不矛盾。</p><p>11—A 是烛影陈列里少数没有结案庆祝页的案子。最后一张纸只有日期、天气和暂停理由。翻过去时，能透出下一宗案件的墨。旧站一直保留这种扫描瑕疵，因为它很像调查本身：你以为某一页应该在这里结束，背面却总有别人的生活已经开始。</p></div>`
      ]
    },
    case13: {
      tab: "cases", kicker: "旧案全过程 · 13—F", meta: "主办：南桥 / 法医协查：柯石 / 已结案",
      title: "河岸仓库的干鞋：最像搬尸的细节其实来自暖气",
      pages: [
        `<div class="case-dossier"><h3>一、现场：全身湿透，鞋底却干</h3><p>春汛后，一名货运经纪人倒在河岸仓库二层。外套、裤腿和头发全部湿透，鞋底却只有薄灰，没有泥水。仓库一楼进水到脚踝，二楼地板干燥。第一判断因此非常诱人：尸体在别处淋湿后被搬上楼。</p><p>南桥也这么想，并且在第一版记录上写了“搬运”。柯石看见后把词圈起来，问：“谁搬？怎么搬？从哪搬？你现在有几个答案？”南桥说：“零个。”柯石：“那你至少有一个词太多。”</p><h3>二、测量：鞋不是干，是干得更快</h3><p>仓库二层有旧蒸汽管，正从尸体脚边经过。鞋底橡胶薄，贴近热管，表面水分比羊毛裤腿蒸发得快。将同材质旧鞋浸湿后按现场距离放置，两小时后出现相同“鞋底近干、鞋面仍湿”的差异。</p></div>`,
        `<div class="case-dossier"><h3>三、重新问“为什么湿”</h3><p>搬尸假设被撤回后，湿衣重新变成问题。屋顶没有漏水，二楼窗也关着。死者袖口和口袋里有细小黑藻，只生在河岸东侧排水沟。沿着沟渠找到仓库后门，门槛有被洪水冲来的芦苇碎屑。</p><p>死者当晚先到东侧码头查看一批被水泡过的货，踩空跌入浅沟，全身湿透但没有明显外伤。他回到二楼准备更换衣物时，与合伙人因保险单争执。</p><h3>四、真正的致命伤</h3><p>尸检发现胸口有局限性挤压痕，不符合跌水。二楼手推货车把手高度与痕迹吻合。合伙人最初说只“推了他一下”，现场重演证明湿滑鞋面让死者向后撞上推车，推车又滑动把他夹在墙与车架之间。</p></div>`,
        `<div class="case-dossier"><h3>五、结案与错误记录保留</h3><p>合伙人承认争执中推搡，最终以过失致死处理。湿衣来自跌入排水沟；“干鞋底”来自暖气加速蒸发，不是搬尸。现场从头到尾只有一次真正改变方向的实验：把一双旧鞋弄湿，然后等。</p><p>南桥坚持把自己第一版“搬运”保留在数字档案里，并在下面加批注：<em>“删掉它会让后来的人误以为我一开始就很聪明。事实并不支持这一人物设定。”</em></p><p>柯石追加：“同意。”</p><p>南桥又追加：“他难得赞美我。”</p><p>柯石第三次追加：“这不是赞美。”</p><p>这三行被管理员保留至今，主要原因是灰烬认为删除日志比冷笑话更危险。</p></div>`
      ]
    },
    case17: {
      tab: "cases", kicker: "旧案索引 · 17—B", meta: "状态：复核中 / 仅显示接入前可见内容",
      title: "17—B · 魏瑟堡死信室：旧结论暂时折叠",
      pages: [
        `<div class="case-dossier"><p><b>原案日期：</b>1927 年 11 月 18 日<br><b>地点：</b>魏瑟堡旧邮局地下死信室<br><b>原始登记：</b>局长赫尔曼·福格尔死亡，门从内侧闩锁<br><b>本次复核原因：</b>数字化清点发现未登记私人信件、冷库附件与原证物索引不一致。</p><p>当前已开放原始现场照片、艾达·克莱因调查簿扫描、证物登记表、冷库温度附件与气动管维修记录。为避免旧结论影响判断，1927 年最终结论页在玩家完成现场重建以前保持折叠。</p><p>站内人物小传、散文和退休口述只用于补足生活背景，不作为证明行为的证据。复核室中可用的结论必须来自原始材料或经验证的物理事实。</p></div>`,
        `<div class="case-dossier"><h3>复核提醒</h3><p>17—B 最容易让人提前形成的印象有三个：密室必然意味着有人制造机关；杯中有药意味着死者服过药；一个人与死者关系复杂意味着他更可能做出极端行为。三句话听起来都像常识，三句话都需要证据。</p><p>烛影把这个案子重新开放，不是为了证明前辈愚蠢。旧时代的记录条件有限，部分附件又在数十年间分散。复核的意义只是把今天能看见的材料重新放回同一张桌上。</p><p class="portal-archive-note">若准备开始复核，请返回值班室打开置顶电报。此页不会显示结案答案。</p></div>`
      ]
    },
    notesIndex: {
      tab: "notes", kicker: "站点导航 · 前辈手记", meta: "共 146 篇 / 本页精选 4 位前辈 / 原判断与后来复盘并存",
      title: "前辈手记：同一件事，四个人会用四种方式写下来",
      pages: [
        `<div class="mentor-index"><p>手记区不是教材。我们刻意保留语气、坏习惯、脾气和不太必要的笑话，因为调查方法从来不是从人格里剥离出来的一套螺丝刀。有人先量尺寸，有人先听人说完，有人见到漂亮结论就本能地想拆掉它，还有人最关心文件名到底有没有写日期。</p>
         <div class="mentor-card"><b>北窗</b><span>安静、耐心、讨厌替证人补句子</span><p>习惯记天气、声音和人的小动作。冷幽默很轻，通常要过两行才发现他刚刚是在开玩笑。</p><button data-story="rain">读《雨夜里最容易误判的，不是脚印，是等待》</button></div>
         <div class="mentor-card"><b>南桥</b><span>自嘲、话多、愿意公开自己的错</span><p>手记里嫌疑人可能还没出现，他本人已经先被自己批评一遍。相信道歉也是调查工作的一部分。</p><button data-story="mistake">读《我曾因为“冷静”把方向查反》</button></div></div>`,
        `<div class="mentor-index"><div class="mentor-card"><b>柯石</b><span>测量派、嘴硬、对形容词保持敌意</span><p>认为“似乎、显然、没多久”都是需要现场验证的危险词。笑话像螺丝帽，拧得过紧。</p><button data-story="lamp">读《钟不会撒谎，但人会把十一分钟说成一会儿》</button></div>
         <div class="mentor-card"><b>灰烬</b><span>档案管理员、克制、对版本管理近乎宗教</span><p>不迷信灵感，迷信编号；不怕没有答案，怕有人把猜测保存成 final_final2。</p><button data-story="ashesNote">读《待证栏不会咬人》</button></div>
         <p class="portal-archive-note">说明：手记中的个人判断按原文保留；涉及具体旧案的事实，以对应案卷最终核验页为准。</p></div>`,
        `<div class="mentor-index"><h3>站里流传的一条非正式守则</h3><p>不要试图找到“最像侦探的人”。北窗能在雨里守六小时，找不到人也不乱补答案；南桥会在问错人以后回去道歉；柯石愿意花一下午证明一双鞋为什么比裤腿先干；灰烬能从三百页旧扫描里发现一个文件日期少了两位数。</p><p>这些能力彼此并不相似。真正相同的只有一点：他们都允许事实让自己难堪。</p><p>新人问过灰烬，什么叫成熟的调查员。灰烬说：“开始给文件起正常名字的时候。”柯石说这和调查无关。灰烬回答：“你没见过证物照片叫‘这个应该是门_final_真的final.jpg’。”争论到此结束。</p></div>`
      ]
    },
    rain: {
      tab: "notes", kicker: "北窗手记 · 11—A", meta: "最后修改 12-27 02:13 / 语气保留原稿",
      title: "雨夜里最容易误判的，不是脚印，是等待",
      pages: [
        `<div class="mentor-note"><p>我不喜欢雨夜现场。不是因为浪漫，正相反，因为雨会把调查员以为很重要的东西冲走，然后把不重要的东西冲得闪闪发亮。鞋印、烟灰、车辙都在变。唯一稳定的是每个人都说“刚才还在”。</p><p>11—A 的站台没有钟。我到的时候，失踪者妻子坐在候车室，手里有两张回程票。她每隔十几分钟把其中一张抹平，再沿原折痕折回去。我没有问她为什么。问了也不会让票多告诉我们什么。</p><p>新人的第一冲动通常是安慰。我年轻时也做过。后来发现，“一定能找到”属于一种很昂贵的承诺，调查员最好不要拿别人的明天来支付自己的善意。</p></div>`,
        `<div class="mentor-note"><p>第四天，我们在河边找到一只与失踪者同牌子的帽子。队里有三个人明显松了口气，因为终于出现了一个可以解释故事的东西。帽子内圈尺寸不符，后来确认属于上游渔夫。那天我记了一句：<em>“调查员也会渴望坏消息，只要坏消息足够明确。”</em></p><p>这句话写得不好听，但是真的。悬而未决让人疲惫。一个确定的事故，哪怕悲伤，也比三十个可能性更容易装进文件夹。</p><p>雨具倒比人诚实。湿了就是湿了，不会说“大概只是路过”。所以雨夜回站以后，我先把外套挂好，再写判断。至少等水滴完，纸不会被我的袖口替证据增加新的痕迹。</p></div>`,
        `<div class="mentor-note"><p>七个月后我们暂停调查。有人问我是不是不甘心。我当然不甘心，但不甘心不是继续制造确定性的理由。卷宗能写到哪里，取决于证据，不取决于调查员有没有睡好。</p><p>妻子后来把两张回程票寄来。我没有把它们当作“爱情证物”。它们只证明当晚原计划有两个人一起回来。至于她后来怎样生活，那是她自己的事，不该被我拿来替案卷增加文学效果。</p><p>不过这篇手记不是案卷，所以我可以承认一件私人小事：多年以后我仍把那两张票放在同一个纸袋里。不是为了等答案。只是提醒自己，有时候调查做到最后，能替一个人保存下来的不是解释，而是一个没有被擅自解释掉的空白。</p></div>`
      ]
    },
    mistake: {
      tab: "notes", kicker: "南桥手记 · 失败复盘", meta: "公开给新人 / 自愿保留原错误批注",
      title: "我曾因为一句“他看起来很冷静”把方向查反了",
      pages: [
        `<div class="mentor-note"><p>这篇的主角严格说来不是嫌疑人，是我。因为真正稳定地制造麻烦的人从头到尾只有我。</p><p>询问记录原文：“受访者情绪平静，回答简短。”我在旁边写了两个字——<b>预谋</b>。没有来源，没有测量，没有证人，纯属脑内加工。偏偏字写得很重，第二天我再看时，它已经像一条经过批准的结论。</p><p>后来证明，那个人从小口吃，越紧张越说不出话。我把他的恐惧当作镇定，又把镇定当作准备充分。逻辑非常流畅，唯一缺点是每一步都错。</p></div>`,
        `<div class="mentor-note"><p>把方向纠正过来的是一袋面粉。准确说是一张面粉小票。案发关键时段，他在三条街外的杂货店买面粉，店主记得他一句完整的话都没说，只把清单递过去。</p><p>所以我后来常告诉新人：我职业生涯里最可靠的证人之一是一袋面粉。它不紧张，不讨好调查员，也不会因为被问第三遍就开始怀疑自己。缺点是拒绝签字。</p><p>我去道歉时，对方说“没关系”，没看我。这三个字当然也不代表真的没关系。以后半年我们在法院走廊碰见，他都会主动靠到另一侧。调查结论修正只需要一页纸，一个人被错误怀疑以后重新觉得安全，显然没有这么高效。</p></div>`,
        `<div class="mentor-note"><p>从那以后我给所有形容词加一道手续。冷静、慌张、傲慢、悲伤、可疑——都可以写，但必须放进“观察者判断”栏，不能冒充事实。事实是“沉默二十秒”“手握得很紧”“回答只有三个词”。至于为什么，让后面的材料来。</p><p>这套方法没有让我变得神奇，只让我犯错时比较容易知道错在第几行。已经很不错。成年人能拥有可定位的错误，是一种奢侈。</p><p>顺带一提，那袋面粉后来被厨房用了。有人问为什么不永久保存。我说因为证物已经拍照归档，而且站里经费有限。灰烬说真正原因是我忘了贴“勿食用”。这属于个人攻击，但基本属实。</p></div>`
      ]
    },
    lamp: {
      tab: "notes", kicker: "柯石手记 · 时间与测量", meta: "04—C 复盘 / 批注保留",
      title: "钟不会撒谎，但人会把十一分钟说成“一会儿”",
      pages: [
        `<div class="mentor-note"><p>先说结论：不要问证人“过了多久”。至少不要只问这一句。人的时间感在黑暗、疼痛、争吵、等人和开会时都不可靠。最后一种尤其明显。</p><p>04—C 四个人都说停电没多久。三分钟、五分钟、八分钟，另一个坚持“两三分钟”。后来用钟声、茶壶和门卫记录重建，是十一分钟。没人故意撒谎。人的脑子只是擅长把没有事件的时间压缩。</p><p>所以我问：灯灭后听见什么？摸到什么？走了几级楼梯？钟敲之前还是之后？物理世界很烦，但它通常不在意你的叙事是否好听，这是优点。</p></div>`,
        `<div class="mentor-note"><p>我不反对直觉。我反对直觉穿上白大褂以后自称测量结果。“门很窄”不是测量。“伤口大概到这里”不是测量。“他应该来不及”尤其不是。拿尺子。拿钟。走一遍。</p><p>南桥说我缺乏想象力。这不准确。我想象过很多可能，只是不会因为某个可能比较漂亮，就给它发工资。</p><p>有次新人说卷尺会破坏现场氛围。我让他先量完再恢复氛围。后来灰烬禁止我负责新人欢迎讲话。这个决定缺乏公开测量依据。</p></div>`,
        `<div class="mentor-note"><p>做完测量以后也别崇拜数字。温度计会坏，钟会停，尺会从错误起点开始。数字需要来源和误差范围。04—C 的楼下钟后来发现每天慢四十秒，所幸不影响十一分钟的区分；如果我们需要精确到半分钟，就必须把它算进去。</p><p>我喜欢物理证据，不是因为它“绝对客观”，而是因为它允许重复。另一个人可以拿同一把尺再量一次，可以把同样的鞋弄湿再放到暖气旁。判断能被别人重做，是比“相信我”更体面的工作方式。</p><p>页脚给南桥：十一分钟不是“一会儿”。除非等公交。等公交时三分钟也可以是一生。</p></div>`
      ]
    },
    ashesNote: {
      tab: "notes", kicker: "灰烬手记 · 档案与待证栏", meta: "值班室内部帖 / 第 9 次修订",
      title: "待证栏不会咬人，错误结论会——尤其打印三份以后",
      pages: [
        `<div class="mentor-note"><p>我管理档案以后发现，新人最怕的不是死人，也不是凌晨电话，是表格里有一格空着。他们会本能地想填：日期不确定，就写“大约”；关系不知道，就写“朋友”；动机没有，就写“疑似纠纷”。半小时后再看，那些“疑似”会像潮气一样蒸发，只剩一个看起来非常确定的表格。</p><p>所以我增加了“待证”栏。它不会咬人，也不会降低绩效。真正降低绩效的是把猜测写进正式结论以后，下一班人花三小时证明你只是打字很快。</p><p>规则一：不知道就写不知道。规则二：不知道不等于不存在。规则三：文件名必须有日期。第三条最重要。</p></div>`,
        `<div class="mentor-note"><p>我见过最危险的文件叫“最终版”。第二危险叫“最终版2”。第三危险叫“这个才是真的最终版”。案件没有因此出错，但我血压出现了明确证据。</p><p>版本管理听起来不像侦探故事。遗憾的是，很多误判也不像侦探故事：扫描页漏了一张，时间抄错一位，后来口述覆盖原话，某人把“未发现”改成“没有”。没有黑影，没有密道，只有一个疲倦的人按下保存。</p><p>所以我宁愿档案显得笨重。原件、转录、批注、修订分开。让错误留下来并注明它为什么错。清理得太漂亮，会把思考过程一起擦掉。</p></div>`,
        `<div class="mentor-note"><p>有人说我没有侦探气质。我同意。我对“灵光一现”的兴趣低于对备份盘的兴趣。但如果某个天才结论只存在一个人的脑子里，它在档案管理上属于单点故障。</p><p>我真正喜欢的时刻，是一宗旧案被重新打开时，几十年前的人留下足够清楚的原始记录，让今天的人还能不同意他们。这是一种很克制的善意：我可能错，所以我把我看到的东西尽量原样留给你。</p><p>最后提醒：今晚值班结束前请把扫描仪盖上。上次有人忘了，一只飞蛾被完整数字化成了“附件 7”。南桥提议保留。我拒绝，因为它与案情无关。柯石认为至少应测量翅展。我现在开始理解为什么档案管理员需要门锁。</p></div>`
      ]
    },
    letter: {
      tab: "hall",
      kicker: "夜读随笔 · 未投递信件",
      meta: "灰烬 / 12-16 / 修订第三稿",
      title: "有地址的信，也会寄不出去",
      pages: [
        `<p>刚来站里整理死信时，我以为“未投递”只是邮政术语：门牌错了，邮资少了，收件人搬走了。后来才知道，还有一种信，街道、楼层、姓名一项不少，收件人甚至每天坐在写信人的对面。它们哪里也没去，只是在一张饭桌、一道卧室门、一次擦肩而过的下班声里，被一次又一次留到明天。</p>
         <p>我见过一封在父亲书桌里放了二十二年的信。信里没有遗嘱，也没有戏剧性的道歉，只问女儿搬家以后窗户朝哪边，冬天胃还疼不疼，小时候那只缺耳朵的布兔子是不是还在。女儿看完后把纸压在膝上，很久才说：“这些事他活着时从没问过。”可他们几乎每周都通电话，话题总是天气、房租和“最近忙不忙”。</p>
         <p>那天我忽然明白，人与人之间最难送达的，常常不是大事。真正滞留的，是那些太小、太近、近到说出口反而显得郑重的话。一个父亲可以替女儿修三次漏水的水管，却不知道怎样问一句“你一个人住，晚上会不会害怕”；一个孩子可以每周准时回家吃饭，却把“我其实很想你”说成“菜有点凉了”。</p>`,
        `<p>另有一封夹在离婚协议背面。丈夫写：“那天不是你做的汤太咸，是我刚接到医院电话，不知道怎么告诉你。”他们后来又一起生活了六年。纸一直压在那里，边角沾了酱汁，折痕上有几粒很小的盐。六年里他们也许争过无数次汤咸不咸，却没有谁把那张纸翻过来。</p>
         <p>人有时并不是缺少一句话，而是不知道把它放进哪一个已经过得很熟练的日子。早餐太短，晚饭太累，孩子在旁边写作业，水壶又偏偏在这时响；等灯都关了，便觉得明天说也一样。于是日子像一条看不见的传送带，把那句话向后运。一天、一个月、几年。我们站在原处，以为它还在手边。</p>
         <p>我自己的抽屉里也有过这样的纸。写完时觉得郑重得无法当面开口，放久了，又觉得事情已经过去，不必再惊动谁。几年以后再看，最刺眼的不是字，而是信封正面那片没有邮戳的空白。原来当时的我并不是胆小，只是太相信时间，像相信一间熟悉的店明天仍会开门，一盏总亮到深夜的窗明天仍会亮。</p>`,
        `<p>所以现在整理旧信，我很少再问“为什么没有寄”。一个人把信留下，有时是犹豫，有时是体谅，有时只是想等一个更合适的晚上。真正令人难过的，并不是他没有勇气，而是那个“更合适的晚上”后来没有出现。</p>
         <p>旧纸有一种奇怪的诚实。墨会淡，指纹会散，人的解释会在几十年里长出新的版本，只有折痕始终留在原处。你能看见写信人曾经把纸折起来，又打开；再折一次，又压平。那些反复的白线，比任何一句“我想了很久”都更接近犹豫本身。</p>
         <p>夜班快结束时，我偶尔会把归档完的信封在桌上排齐。它们都有姓名，有街道，有的甚至贴好了邮票。窗外第一班公交开过去，玻璃轻轻震一下。我总会想，所谓错过，也许并不是一个巨大的瞬间。它更像早晨收走第二只杯子时那一下很轻的碰响——当时谁都没有注意，后来却再也找不到原来的位置。</p>
         <p class="portal-pullquote">有些信没有走远，不是因为没有地址。只是写信的人把“明天再说”当成了不会失效的邮票。</p>`
      ]
    },
    waiting: {
      tab: "hall",
      kicker: "夜读随笔",
      meta: "灰烬 / 无案号 / 值班室旧帖",
      title: "等人的房间",
      pages: [
        `<p>做夜间值班以后，我对房间里“多出来的一份”很敏感。医院家属室的桌上常有一杯彻底凉掉的水；车站候车室有人把行李放在旁边座位，却在每次广播响起时立刻挪开；凌晨去做询问，厨房里若摆着两副筷子，留下的人通常会先把另一副收进抽屉，再来开门。</p>
         <p>我母亲等父亲下夜班时也这样。她嘴上说“不等，困了就睡”，却总把汤留在最小的火上。十一点以后，汤面会结一层薄皮，她用勺背轻轻拨开，再把锅盖盖回去。父亲有时两点回来，有时临时睡在厂里。第二天早晨，母亲会把没动过的那只碗洗掉，从不说昨夜等过。</p>
         <p>小时候我以为等待就是看钟。后来才知道，等待更多时候藏在身体里：耳朵会替门留一点位置，手会在切菜时自动多切一份，睡到半夜仍能从一串脚步里认出熟悉的那双鞋。一个人尚未回来，另一个人的生活已经先替他腾好了形状。</p>`,
        `<p>父亲不在以后，母亲有半年时间会在傍晚下意识地拿出两只碗。第二只放到桌上，她才想起来，又慢慢放回橱柜。那动作短得像没有发生过。可我现在想起父亲，最先出现的不是医院，也不是葬礼，而是瓷碗在木桌上轻轻磕到的一声。</p>
         <p>人习惯把等待理解成一件有开始、有结果的事：列车到了，手术结束了，门终于打开了。其实很多等待没有结束仪式。它只是逐渐变薄。那个人不再每天被提起，可他的杯子还在最高一层；衣柜里那件外套挪过几次位置，却始终没有被扔掉；买菜时偶尔仍会多称半斤，走到家门口才发现。</p>
         <p>我曾劝一个失去孩子的母亲“向前看”。她没有生气，只问我：“向前看，要先把哪一双拖鞋收起来？”那一刻我才明白，安慰常常把人生说得太大。真正难的不是走向未来，而是星期二的早餐该煮几颗鸡蛋，天气转凉时还要不要把那条小毯子晒一遍。</p>`,
        `<p>所以后来我很少劝人“放下”。日子自己会往前，它不需要劝。真正慢的是手：某一天终于只拿一只杯子，某一天买面包时不再顺手拿两份，某一天关灯以后没有因为楼道里相似的脚步声重新坐起来。</p>
         <p>可我也不觉得这些迟缓是失败。人用习惯爱过另一个人，习惯当然会留下惯性。它不宏大，也不漂亮，甚至常常有些笨拙。正因为笨拙，才让人知道那段共同生活不是一句“曾经”就能折起来放进抽屉。</p>
         <p>现在值夜，凌晨两三点总有人在站里读这篇旧帖。屏幕右下角会多一个在线数字。我不知道对方在等谁，也不知道他为什么不睡。有时我只把茶重新添热，不发消息。隔着城市的夜，我们各自在自己的房间里坐一会儿。那也许算不上陪伴，但至少这一刻，没有谁需要独自把第二只碗收回去。</p>`
      ]
    },
    snow: {
      tab: "hall",
      kicker: "夜读文库 · 散文诗",
      meta: "匿名投稿 / 第 41 期 / 三叶本",
      title: "雪落在没有地址的地方",
      pages: [
        `<div class="portal-poem"><p>夜里落雪的时候，城里许多东西会暂时失去自己的颜色。红邮筒、铜门牌、石阶上昨天留下的泥，被薄薄一层白压低了声音。只有还亮着灯的窗口知道，雪没有把什么真正抹去；它只是让人晚一点看见。</p>
         <p>街角面包房最后一炉黑麦刚出炉，玻璃上蒙着雾。老板把门口那块“营业中”的木牌翻过去，却没有立刻熄灯。他妻子住院以后，他仍每天多留半小时。有人问他等谁，他说炉子要凉。其实炉子早就凉了。</p>
         <p>有个人伏在桌边写信。纸已经写满，地址栏却空着。墨水慢慢干成暗蓝色，他把笔搁下，去厨房关火，顺手把第二只杯子也洗了。杯沿相碰，发出很轻的一声。隔壁房间有人翻了个身，两个人之间不过十几步，他仍把信折成四折，放进最里面的抽屉。</p></div>`,
        `<div class="portal-poem"><p>我们每天都在替明天留下位置：多买一个面包，灯不急着关，门锁只扣一层；把一句难说的话挪到周末，把一次道歉挪到天气好一点，把拥抱留到出门以前。日子因此显得宽裕，像雪地还没有脚印，往哪里走都来得及。</p>
         <p>可雪是会化的。凌晨四点，屋檐开始滴水，一滴落进旧铁桶，一滴落在窗台那盆枯掉的天竺葵旁。城市一点一点露出昨天的颜色：门牌、车辙、没有扫净的煤灰，还有一个孩子白天用树枝画下、夜里被雪盖住的歪太阳。</p>
         <p>有些东西重新出现时已经不是原来的样子。纸受过潮，会在干后起皱；手套湿过一次，指尖总比掌心硬；一个人错过某句话，即使后来终于说出来，声音也会带着后来这些年的重量。</p></div>`,
        `<div class="portal-poem"><p>天亮后，送奶的人把玻璃瓶放到门前。瓶身很冷，里面却有乳白色的温度。昨夜遮住的门牌重新露出来。抽屉里的信仍旧有姓名，没有日期。</p>
         <p>很多年以后，也许有人会拆开它。那时纸已经脆了，折痕也白了。读信的人会在某个句子上停很久，然后抬头看看屋里。窗框换过，桌子换过，那个曾经睡在隔壁房间的人早已不在。可是杯子碰杯子的那一声，竟还能从一页旧纸里回来。</p>
         <p>雪落得最深的时候，地址其实都还在。只是门牌被遮住，路变得一样白，人误以为世界没有方向。真正没有地址的，从来不是信。</p>
         <p>是那个原本预备拿来开口的明天。</p></div>`
      ]
    },
    hermann: {
      tab: "hall",
      kicker: "人物志 · 魏瑟堡邮政区",
      meta: "艾尔莎口述、邮资表边注与退休职员访谈整理 / 非案情证据",
      title: "赫尔曼·福格尔：一个把退信柜钥匙带回家的人",
      pages: [
        `<p>赫尔曼做了二十六年邮局长。考勤表几乎没有迟到，字写得像印刷体，连假日值班都把领口扣到第二颗。可办公室抽屉里总有些与局长身份不相称的东西：备用鞋带、儿童铅笔、退烧用的湿布、半包蜜饯，还有一小罐玛戈不肯吃的酸李子。</p>
         <p>艾尔莎说他不善于安慰人。哪位职员家里出了事，他不会说“节哀”，只会悄悄替人把第二天的班换掉；谁咳嗽，他也不问病情，午后桌上却会多一壶热水。有人感谢，他就皱眉，说是“工作安排”。他把关心藏得太像规章，以至于年轻时几乎没人认出来。</p>
         <p>1910年前后的冬天，他常带一个小女孩来上班。女孩在高柜旁写字，困了就趴在两只退信袋中间。有人问是不是他的女儿，赫尔曼先说“不是”，停了一会，又补：“她叫玛戈。”以后同事便不再问。</p>`,
        `<p>玛戈十二岁那年有一次发烧，趴在分拣桌边睡着。下午邮袋最忙的时候，赫尔曼把平日用来盖戳的木槌搬去了另一张桌。艾尔莎嫌麻烦，问他为什么。他只说这边光线更好。当天的窗户朝北，另一张桌反而更暗。</p>
         <p>他每周五会把退信柜最后一格清出来。真正找不到收件人的信，他不立刻销毁，总要多留七天。理由很简单：“也许明天有人来问。”这句话他说了很多年，大家听惯了，没人觉得特别。后来有人翻旧记录，发现玛戈母亲的几封私人信，也曾在那个格子里停留。</p>
         <p>赫尔曼不喝甜咖啡，却会在厨房存方糖。自己鞋底磨穿了能拖一个月，玛戈的冬鞋却总提前半码买好。他擅长安排别人生活里的小事，却极不擅长给关系命名。收养手续、称呼、该说出口的解释，他总觉得“再等合适一点”。</p>`,
        `<p>他去世以后，办公室钥匙从大衣口袋里取出来。钥匙圈上除了铜牌，还系着一小段褪色红毛线。那不是装饰。艾尔莎认得，是玛戈小时候围巾的线头。</p>
         <p>退休访谈里，艾尔莎沉默了很久才说：“福格尔先生把每封信的去处都管得明明白白，偏偏自己想说的话，一封也寄不出去。”她说完又笑，觉得这句话太像小说，要求删掉。整理者最终还是保留了。</p>
         <p>人物志不负责替一个人判定善恶。我们只把能确认的生活放在这里：他怕木槌吵醒孩子；他把酸李子放在右边第二格；他每周多给陌生人的信七天；他把一段红毛线带了很多年。至于这些细小的动作应该叫什么，留给后来读到的人自己决定。</p>`
      ]
    },
    anna: {
      tab: "hall",
      kicker: "人物文稿 · A.W.",
      meta: "小满 / 私印本整理札记 / 与17—B证物分栏",
      title: "安娜·韦伯的五页纸：她把明年写得比病情更仔细",
      pages: [
        `<p>安娜留下的正式记录很少。病历里是体温、咳血次数和药量，租房簿上是三个月欠款。真正让她重新像一个人，而不是病历编号的，是那五页没有出版过的手稿。她在里面记玛戈吃苹果一定削皮，睡觉时总把右脚伸出被子，左边鞋带常比右边多打一个结。</p>
         <p>病痛只出现过一次：“今天手没有力气，所以字比昨天难看。”下一句就转去写厨房里的牛奶，说火开得太大，锅底结了一圈褐色的皮，玛戈却喜欢拿勺子去刮。纸角有一小块圆形油渍，像那只碟子曾经压在那里。</p>
         <p>她并不回避死亡，只是不愿让死亡占满纸。也许人在真正知道时间有限以后，反而会把注意力交给更小的事：窗缝什么时候开始进风，女儿新鞋会不会磨脚，一罐杏酱究竟放几勺糖才不会太酸。</p>`,
        `<p>第五页背面列着一些尚未发生的事情：春天给孩子换一双鞋；天气暖了去河堤看船；生日时把杏酱里的糖少放一勺；冬天给旧大衣换一排纽扣。最后一项只写了“冬天——”，后面没有字。铅笔停在那里，木杆被指甲掐出一道浅痕。</p>
         <p>我第一次整理这几页时，最难受的不是“冬天”后面的空白，而是前面那些计划写得太具体。人只有真心相信自己会活到某一天，才会操心一双尚未买的鞋穿多大，才会记得河堤上的船要等四月水涨以后才多。</p>
         <p>玛戈后来把苹果皮削得很薄。退休职员说，她成年后偶尔来邮局，坐在靠窗的位置削苹果，长长的果皮几乎不断。没人知道这个习惯是不是从母亲那里学的。档案无法证明的事，我们不把它写进结论。可生活有时本来就不需要成为证据，才值得被记住。</p>`,
        `<p>安娜去世后，这五页纸没有和衣物一起封存。有人把它们折好，放进17—B号柜。折线经过多年开合，正好从“冬天”两个字中间穿过去。纸页边缘有两枚不同年份的索引钉孔，说明至少有人取出过它，又重新放回。</p>
         <p>如果只看病历，安娜的一生会显得很短：发病、就诊、恶化、死亡。可那五页纸把时间往另一边撑开了。她的人生里还有牛奶烧糊的味道，孩子不肯穿整齐的袜子，杏酱里的糖，以及一个没有写完的冬天。</p>
         <p>我们整理人物文稿，不是为了让它们替案件说话。恰恰相反，是为了提醒自己：案件最后总会被压成日期、行为和结论，而一个人曾经怎样过日子，不能也跟着被压扁。</p>`
      ]
    },
    clerk: {
      tab: "hall",
      kicker: "人物小传 · 卷宗边角",
      meta: "北窗 / 艾尔莎晚年访谈整理",
      title: "艾尔莎·克劳斯：抄写员下班以后",
      pages: [
        `<p>艾尔莎在17—B正式卷宗里只有两行：确认办公室钥匙数量，确认局长昨日下午到岗。退休访谈却录了一个小时零十三分钟。她说话很快，提到年轻时想去剧院做服装，父亲病倒后便留在镇上，从此在邮局一坐就是三十七年。</p>
         <p>她的手很巧。冬天给同事织手套，尺寸全记在一本邮资表背面：赫尔曼右手比左手宽半指，哈斯嫌羊毛扎，年轻邮差的虎口总磨破，玛戈小时候一年能丢两只，于是她后来干脆织三只。</p>
         <p>战争那几年，阵亡通知由她誊抄。每一封都多垫一张废纸，怕钢笔尖划破薄薄的公文纸。她说那只是工作习惯。可几十年以后，她仍能背出当时常见的几个开头，却记不起自己二十岁生日吃了什么。</p>`,
        `<p>艾尔莎最喜欢下班后的十分钟。大厅没有顾客，分拣员也走了，她会把白天滚到桌脚的橡皮筋捡起来，把墨水瓶口擦净，再去厨房把水壶倒空。她说人在工作时属于别人，下班以后那十分钟才重新属于自己。</p>
         <p>赫尔曼死后，玛戈有很长一段时间绕开邮局那条街。艾尔莎没有去找她。有人问为什么，她说：“有些人正在用力走路，你过去扶，反而会让她发现自己腿在抖。”这不是调查结论，只是一位年长同事的判断。</p>
         <p>每年第一场雪，她还是比平时早到十分钟，把局长办公室窗台擦一遍，再把窗开一条缝。访谈员问原因，她想了很久：“那屋子以前太闷，他总不肯开窗。”说完又补一句：“也许也不是因为这个。”</p>`,
        `<p>八十二岁那年，艾尔莎在家中去世。遗物里有一只没有配对的深灰色手套，手腕处缝着很小的字母 H。她侄女不知道是谁的，准备和旧围巾一起捐掉。整理遗物的邮局退休职员认出针法，才把它留下。</p>
         <p>一个抄写员一生替别人誊过无数姓名。她自己的名字却很少进入故事。她没有改变17—B的物理事实，也没有提供决定性证词。她只是记得谁怕冷，谁不吃酸，谁在孩子睡着时把木槌搬远。</p>
         <p>次要人物常在案卷里被缩成“证人二”“职员甲”“值夜人”。可真正的生活并没有主次之分。有人只在真相旁边站了十分钟，回家以后仍要过完自己的几十年。我们保留这篇小传，是因为那几十年也应该有一页纸。</p>`
      ]
    },
    margo: {
      tab: "hall",
      kicker: "值班员随笔 · 人物侧写不作证",
      meta: "小满 / 旧站人物栏 / 依据公开生活记录整理",
      title: "她总把苹果皮削得很长：关于玛戈的几件小事",
      pages: [
        `<p>第一次在旧账里看到玛戈，不是案发那晚，而是一张儿童订报证。九岁，住址写得很慢，姓氏后来被另一种墨改过。纸的背面有铅笔试写的三个M，第三个才没有歪。档案员把它放在灯下时笑了一下：原来一个后来被写进大案的人，也曾经只是怕把自己名字写坏的孩子。</p>
         <p>退休职员说她小时候吃苹果一定削皮。不是嫌脏，而是牙齿怕酸。成年后她仍这样，果皮能沿着刀口垂到桌边，很少断。她谈正事时手反而更稳，越生气，越会把果皮削得薄。</p>
         <p>玛戈不喜欢别人替她收拾东西。围巾可以乱放，书也常摊着，却会在离开前自己把杯子洗净。她说过一句很普通的话：“用过的东西不要留给别人猜。”后来读到这句话，总觉得它和她人生里那些最难说清的部分放在一起，有一种近乎残忍的反差。</p>`,
        `<p>她年轻时在药房做过一年记账。账本上的字很齐，遇到模糊处却从不擅自补全，总会空一格，第二天再找原票据核对。有人嫌她死板，她说：字写错了还能划掉，替别人想当然地补上去，往往连错在哪里都找不到。</p>
         <p>她和赫尔曼住在同一屋檐下多年，却很少在公开场合用亲属称呼。有人说这是疏远，也有人说只是那个年代复杂收养关系的习惯。我们没有给它下结论。能确认的是：赫尔曼生病时，她会把药盒按早晚排好；赫尔曼问她“晚饭回来吗”，她通常只答“看情况”。</p>
         <p>人与人的亲近不总能从称呼里量出来。有的人每天叫“父亲”，彼此却没有一句真话；有的人一辈子叫姓氏，厨房里却知道对方咖啡要不要糖。案卷必须区分这些东西，否则情感会被误当成证据。可人物小传可以把它们留下，让一个人不只剩下她做错的那一晚。</p>`,
        `<p>晚年没有可靠记录说明玛戈是否再回过魏瑟堡。旧邮局拆迁前，有人见过一位老妇在门口站了十几分钟，没有进去。描述太模糊，不能确认是她。</p>
         <p>我希望不是她，又有一点希望是。不是，因为我不愿随便把一个陌生人的沉默塞进别人的故事；是，因为如果真是她，至少说明很多年以后，她仍有一次自己决定停在哪里、看多久、什么时候转身的机会。</p>
         <p>调查会追问一个人“做了什么”。人物记录还应该问另一件事：在那些决定性的行为之外，她怎样吃饭，怎样系鞋带，怎样把一只杯子洗干净。不是为了替谁开脱，只是为了不让错误吞掉一个人的全部轮廓。</p>`
      ]
    },
    haas: {
      tab: "hall",
      kicker: "前辈手记 · 医生不是一张处方",
      meta: "北窗 / 医务所清点册与学徒访谈",
      title: "药秤上的灰：利奥波德·哈斯下班以前",
      pages: [
        `<p>哈斯脾气坏，字也难看。病人说话绕远了，他会用指关节敲桌面；孩子哭，他更不会哄，只把听诊器先在掌心焐热。镇上很多人不喜欢他，却又习惯在半夜敲他家的门。</p>
         <p>学徒记得，他每天关门前一定擦药秤。黄铜托盘先用软布绕三圈，再把砝码从大到小放回木盒。别人笑他洁癖，他说：“明早第一个病人不该替今天最后一个病人承担误差。”这句话后来被抄进医务所的培训册。</p>
         <p>他开处方很快，碰到被水汽洇过、难以辨认的旧纸却会停很久。学徒说，多年前一场大雨以后，哈斯看见纸张受潮就会发脾气，诊所窗边也从此常备一块吸水布。原因他从不解释。</p>`,
        `<p>医生最容易在故事里被写成两种人：救人的人，或者害人的人。真实的哈斯要麻烦得多。他会因为病人不按时吃药怒斥十分钟，也会把付不起诊金的人名字记在一本从不催收的薄册里；他不愿承认自己记错，却会在夜里重新核对整箱处方。</p>
         <p>退休前一天，他照常看完最后三个病人。下午五点把药秤擦干净，五点十二分关柜，五点二十七分又折返回来，因为忘了给窗台那盆薄荷浇水。清点册上写着四十七只药瓶、两把镊子、一只黄铜药秤。抽屉最里面还有一张练字纸，写满了不同药名、日期和被反复描过的数字。</p>
         <p>一个人可能花很多年重复某个小动作，不是因为他已经放下，而是因为他没有。那些被反复描过的数字，既不能证明罪，也不能证明无辜。它们只说明某件旧事一直留在他的手腕里，每次落笔都会先经过那里。</p>`,
        `<p>我们整理哈斯的条目时，有新人问：既然人物细节不能作为证据，为什么还要留？答案很简单——因为“不能证明案情”和“没有意义”不是一回事。</p>
         <p>医学记录需要冷静，人物记忆却不必把冷静误写成无情。一个粗暴的老人会记得把听诊器焐热；一个固执的医生可能用余生反复核对同一种旧记录。人的矛盾不会让证据失效，只会提醒调查者，不要急着把任何人压进一个方便理解的标签。</p>
         <p>哈斯的药秤后来被镇医务所保留。托盘边缘已经发暗，中央却仍比周围亮一点。那是多年软布摩擦留下的光。没有人知道该把它理解成职业习惯、愧疚，还是一种老派医生近乎偏执的认真。于是我们只写：这里亮过。</p>`
      ]
    },
    viktor: {
      tab: "hall",
      kicker: "人物边注 · 旅人",
      meta: "灰烬 / 住宿簿、维修旁注与未采用口述",
      title: "把螺丝排成一条线的人：维克托·莱茵",
      pages: [
        `<p>维克托在住宿簿上把职业写成“邮票商”。字很小，地址只写到城市，没有街道。他随身带一只旧手提箱，里面确实有邮票，也有几把尺寸不属于集邮工具的扳手。</p>
         <p>他修东西时有一个习惯：拆下来的螺丝按长短排在手帕上，缺一枚就不装回去。艾达问他是不是做过机械工，他只说“以前靠这个吃饭”。再问，他便把话题转到天气。</p>
         <p>有人把这种沉默理解成可疑。可沉默本身什么也不能证明。旅馆女主人记得他每天清晨六点下楼，要最苦的咖啡，不加糖；喝完会把杯柄朝右转正，再压一枚硬币在碟子下面。连续住了三晚，每晚如此。</p>`,
        `<p>维克托能凭声音听出哪一段气动管漏气。他用指节从黄铜外壳一节节敲过去，到第三个弯头停下，把耳朵贴近金属：“这里。”拆开以后，裂缝果然在密封圈背面。</p>
         <p>那种能力来自长期劳动，不来自神秘天赋。人在同一类机器旁待久了，耳朵会学会分辨别人听不出的差别：正常的嗡鸣、轴承将坏未坏的摩擦、压力泄出去时一丝细得像呼吸的嘶声。职业会留在身体里，即使一个人后来换了职业，也不会立刻消失。</p>
         <p>他离开魏瑟堡时没有告别。三天后的房间只剩两枚外国硬币和一根磨旧的鞋带。旅馆女主人把鞋带扔了，硬币留给孙子玩。很多年后她接受访谈，还记得维克托临走前把椅子推回桌下：“像以后还会有人来坐。”</p>`,
        `<p>次要人物最容易被故事利用完就丢掉：提供一项技能、一句证词、一个误导，然后从页面上消失。可真实人生不会因为主线结束就停止。</p>
         <p>维克托后来去了哪里，没有可靠记录。也许继续卖邮票，也许回到了机械厂，也许名字本身就是临时的。我们无法补写他的后半生。</p>
         <p>所以这篇只停在那根被扔掉的鞋带和两枚硬币上。不是所有人物都需要一个完整结局。有时候承认“不知道”，比替他安排一个漂亮去处更尊重一个曾经真实站在现场边缘的人。</p>`
      ]
    },
    ada: {
      tab: "hall",
      kicker: "前辈札记 · 调查者",
      meta: "北窗 / 艾达·克莱因私人边注摘录",
      title: "艾达把“不知道”写得比答案更大",
      pages: [
        `<p>艾达的调查簿第一眼并不好看。战地医生的字很快，箭头到处都是，页边常有药名缩写。最醒目的却是两个字：不知道。她会把它写得很大，外面再画一个方框。</p>
         <p>“尸体被移动过——知道。”“为什么移动——不知道。”“门闩有磨痕——知道。”“谁动的——不知道。”她像故意把空白留在纸上，防止后面的判断偷偷长成事实。</p>
         <p>退伍以后，她很少谈战场。有人问她为什么改做调查，她说医生和调查员其实都有一件相同的工作：在没有把握的时候，不要为了让旁人安心，就假装自己有把握。</p>`,
        `<p>艾达喝咖啡很慢，常常放到凉。做询问时，她不在对方停顿时立刻追问，而会等一会。有人以为这是技巧，其实她在私人边注里写：“人在找词的时候，不要替他把词递过去。”</p>
         <p>她的手在天气冷时会轻微发抖，是旧伤。使用放大镜时习惯用左手托住右腕。案卷照片里这个动作很不起眼，却让后来整理者第一次意识到，所谓冷静的调查视角也来自一副会疼、会疲倦的身体。</p>
         <p>她不喜欢“天才侦探”这个词。晚年一次访谈，她说：“我只是比年轻时更愿意承认自己可能看错。”真正让她成为好调查者的，也许不是看见别人忽略的东西，而是不急着把看见的东西解释完。</p>`,
        `<p>17—B后来被很多人记作她最著名的案子。但在她自己的记录里，这一案旁边没有星号，只在最后写了日期和一句：“结论足够了。人物不够。”</p>
         <p>多年后烛影侦探社整理这批材料，才明白那句话不是谦辞。案件能被一条时间线关闭，可生活不能。一个人为什么犹豫、怎样爱人、某句没有说出口的话在他身体里停了多久，这些都不会因为真相查明就自动得到答案。</p>
         <p>因此我们把人物文章放在证物栏之外。艾达若看到，大概会同意。她最常说的一句话不是“我知道”，而是：“先把能证明的写清楚。剩下的，别急着替别人说完。”</p>`
      ]
    }
  };

  const profileSupplements = {
    "赫尔曼·福格尔": "生活补录：准时、寡言，关心别人时常借‘工作安排’的名义。办公室常备儿童铅笔、备用鞋带和酸李子；有人咳嗽，他不会追问病情，只会让热水壶离那张桌近一点。",
    "玛戈·福格尔": "生活补录：越紧张，手上的动作反而越稳。削苹果时习惯让果皮尽量不断，用过的杯子一定自己洗净；说到不愿回答的问题时不会立刻回避，而是先把袖口抹平。",
    "利奥波德·哈斯": "生活补录：说话直接，脾气并不好，却会在给孩子听诊前先把听诊器焐热。每天关门前把药秤和桌面擦一遍；遇到无法确认的事，他宁愿说‘不知道’，不肯用含糊的肯定敷衍。",
    "维克托·莱茵": "生活补录：每天早晨喝不加糖的黑咖啡，离桌前会把杯柄转回右侧。修东西时不喜欢别人递零件，拆下什么就按原顺序摆回去；关于过去，他很少主动解释。",
    "安娜·韦伯": "生活补录：私人文稿里很少把篇幅留给自己的疼痛，反而反复写天气、牛奶锅底、孩子的鞋带和明年想做的小事。人物文稿只补生活轮廓，不替代医疗记录。",
    "艾尔莎·克劳斯": "生活补录：年轻时想去剧院做服装，后来因父亲生病留在邮局。她把同事手套尺寸记在邮资表背面；下班后总多留十分钟，捡起桌脚的橡皮筋、擦净墨水瓶口，再把水壶倒空。"
  };

  const adaProfile = `<div class="note-entry person patch-profile"><b>艾达·克莱因</b><p>复核负责人。前战地医生，右腕有旧伤，天气冷时用放大镜会以左手托住右腕。询问时很少在对方停顿后立刻追问；她的私人笔记把“知道”和“不知道”分栏写，宁可留下空白，也不替证据把话说完。</p><small>人物生活补录 · 非证物</small></div>`;

  function pageMarkup(story, pageIndex) {
    const page = Math.max(0, Math.min(pageIndex, story.pages.length - 1));
    return `<div class="literary-reader" data-lit-page="${page}">
      <div class="literary-page">${story.pages[page]}</div>
      <div class="literary-pagination" aria-label="文章分页">
        <button class="literary-page-btn" data-lit-dir="-1" ${page === 0 ? "disabled" : ""}>‹ 上一页</button>
        <span>第 ${page + 1} / ${story.pages.length} 页</span>
        <button class="literary-page-btn" data-lit-dir="1" ${page === story.pages.length - 1 ? "disabled" : ""}>下一页 ›</button>
      </div>
    </div>`;
  }

  let currentStory = null;
  let currentPage = 0;
  let pageTransitionLocked = false;

  function renderPatchedStory(key, page = 0) {
    const story = stories[key];
    if (!story) return false;
    const home = $("portal-home-view");
    const reading = $("portal-reading");
    const copy = $("portal-reading-copy");
    if (!home || !reading || !copy) return false;
    const previousStory = currentStory;
    const nextPage = Math.max(0, Math.min(page, story.pages.length - 1));
    const renderKey = `${key}:${nextPage}`;
    currentStory = key;
    currentPage = nextPage;
    home.classList.add("hidden");
    reading.classList.add("active");
    reading.setAttribute("aria-busy", "true");
    $("portal-reading-kicker").textContent = story.kicker;
    $("portal-reading-title").textContent = story.title;
    $("portal-reading-meta").textContent = story.meta;
    if (copy.dataset.renderKey !== renderKey) {
      copy.innerHTML = pageMarkup(story, currentPage);
      copy.dataset.renderKey = renderKey;
    }
    const tabNames = { cases: "旧案陈列", notes: "前辈手记", rules: "调查守则", hall: "值班室" };
    const tabName = tabNames[story.tab] || "夜读文库";
    $("portal-breadcrumb").textContent = `当前位置：烛影侦探社 › ${tabName} › ${story.title}`;
    document.querySelectorAll(".portal-nav").forEach(btn => btn.classList.toggle("active", btn.dataset.portalTab === (story.tab || "hall")));
    requestAnimationFrame(() => {
      reading.removeAttribute("aria-busy");
      if (previousStory !== key) {
        const top = reading.getBoundingClientRect().top + window.scrollY - 8;
        window.scrollTo(0, Math.max(0, top));
      } else {
        const header = reading.querySelector(".portal-article-head");
        header?.scrollIntoView({ block: "start", behavior: "auto" });
      }
    });
    return true;
  }

  function injectStyles() {
    const style = document.createElement("style");
    style.id = "integrated-literature-style";
    style.textContent = `
      .literary-reader{max-width:760px;margin:0 auto}.literary-page{min-height:34rem;padding:1.4rem 1.1rem 1.8rem;border-top:1px solid rgba(76,58,36,.18);border-bottom:1px solid rgba(76,58,36,.18);background:linear-gradient(90deg,rgba(95,70,37,.025),transparent 14%,transparent 86%,rgba(95,70,37,.025));box-shadow:inset 0 0 38px rgba(82,57,29,.025)}
      .literary-page p{margin:0 0 1.35em;line-height:2.05;text-align:justify;text-justify:inter-ideograph;letter-spacing:.02em}.literary-page p:first-child:first-letter{font-size:2.15em;line-height:.9;float:left;margin:.12em .12em 0 0;font-family:serif;color:#6d4b32}.portal-poem p{line-height:2.22;margin-bottom:1.55em}.portal-pullquote{margin:2rem 0 1rem!important;padding:1rem 1.25rem;border-left:3px solid #8a6543;font-size:1.05em}
      .literary-pagination{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:1rem .2rem .2rem;color:#756a5c;font-size:.86rem}.literary-page-btn{border:1px solid #9b8c77;background:#eee6d7;color:#332b24;padding:.55rem .9rem;cursor:pointer}.literary-page-btn:hover:not(:disabled){background:#e2d5c0}.literary-page-btn:disabled{opacity:.35;cursor:default}
      .portal-thread.patch-thread{border-left:2px solid rgba(126,83,50,.45)}.portal-thread.patch-thread .thread-tag{background:#ddd0ba}.portal-library .patch-library-link{display:block;margin:.42rem 0}
      .note-entry.person p{line-height:1.8}.note-entry.person b{letter-spacing:.03em}.note-entry.person.minor{opacity:.92}
      .case-dossier h3,.mentor-index h3{margin:1.65rem 0 .65rem;padding-bottom:.38rem;border-bottom:1px solid rgba(90,66,42,.22);font-size:1.05rem;letter-spacing:.03em}.case-dossier em,.mentor-note em{color:#5c4635}.case-card,.mentor-card{position:relative;margin:1rem 0;padding:1rem 1.05rem;border:1px solid rgba(91,70,48,.22);background:rgba(255,252,245,.46);box-shadow:0 1px 0 rgba(255,255,255,.55) inset}.case-card h3{padding-right:6.2rem;margin:.15rem 0 .55rem;border:0}.case-card button,.mentor-card button{margin-top:.65rem;border:0;border-bottom:1px solid #8b6848;background:transparent;color:#5a3f2c;padding:.35rem 0;cursor:pointer;font:inherit}.case-card button:hover,.mentor-card button:hover{color:#241a13}.case-status{position:absolute;right:.85rem;top:.85rem;padding:.18rem .45rem;border:1px solid currentColor;font-size:.69rem;letter-spacing:.08em}.case-status.closed{color:#52634b}.case-status.open{color:#80603c}.case-status.review{color:#7a4a3d}.mentor-card b{display:block;font-size:1.12rem}.mentor-card>span{display:block;margin:.2rem 0 .6rem;color:#756858;font-size:.78rem}.mentor-note{font-family:inherit}.mentor-note p{position:relative}.mentor-note p+ p{margin-top:1.1rem}.patch-search-label{font-size:.78rem;color:#7b6c5a;letter-spacing:.08em}.portal-right .patch-case-link{display:block;margin:.45rem 0}.case-card,.mentor-card,.portal-thread.patch-thread{content-visibility:auto;contain-intrinsic-size:1px 180px}.literary-page{contain:layout style paint}.literary-page,.case-dossier,.mentor-note{overflow-wrap:anywhere}.literary-page-btn,.case-card button,.mentor-card button{touch-action:manipulation}.performance-lite .literary-page{box-shadow:none;background:#f5efe3}.performance-lite .case-card,.performance-lite .mentor-card{box-shadow:none}
      @media(max-width:760px){.literary-page{min-height:0;padding:1rem .2rem 1.2rem}.literary-page p{line-height:1.9;text-align:left}.literary-pagination{position:sticky;bottom:0;background:rgba(238,230,215,.96);padding:.75rem .3rem;z-index:3}.literary-page-btn{min-height:42px}.case-card h3{padding-right:0;padding-top:1.7rem}.case-status{left:1rem;right:auto}.case-card,.mentor-card{padding:.9rem}}
    `;
    document.head.appendChild(style);
  }

  function addThreads() {
    const board = $("portal-hall");
    if (board && !board.querySelector('[data-story="margo"]')) {
      const rows = [
        ["margo", "人物随笔", "她总把苹果皮削得很长：关于玛戈的几件小事", "小满 · 人物侧写，不作证据", "10-24"],
        ["haas", "人物随笔", "药秤上的灰：利奥波德·哈斯下班以前", "北窗 · 医务所清点册与学徒访谈", "10-19"],
        ["viktor", "人物边注", "把螺丝排成一条线的人：维克托·莱茵", "灰烬 · 一个从主线边缘经过的人", "10-12"],
        ["ada", "前辈札记", "艾达把“不知道”写得比答案更大", "北窗 · 调查者也有自己的手和旧伤", "10-05"]
      ];
      rows.forEach(([key, tag, title, sub, date]) => {
        const btn = document.createElement("button");
        btn.className = "portal-thread patch-thread";
        btn.dataset.story = key;
        btn.innerHTML = `<span class="thread-tag">${tag}</span><div><b>${title}</b><small>${sub}</small></div><time>${date}</time>`;
        board.appendChild(btn);
      });
    }
    const lib = document.querySelector(".portal-library");
    if (lib && !lib.querySelector('[data-story="margo"]')) {
      [["margo","人物随笔 · 玛戈"],["haas","人物随笔 · 哈斯"],["viktor","人物边注 · 维克托"],["ada","前辈札记 · 艾达"]].forEach(([key,label])=>{
        const p=document.createElement("p");
        p.className="patch-library-link";
        p.innerHTML=`<a data-story="${key}" href="#">${label}</a>`;
        lib.appendChild(p);
      });
    }
    const oldCases = document.querySelector(".portal-right .portal-box:last-of-type");
    if (oldCases && !oldCases.querySelector('[data-story="case08"]')) {
      [["case08","08—D · 第十三把钥匙"],["case13","13—F · 河岸仓库的干鞋"]].forEach(([key,label])=>{
        const p=document.createElement("p");
        p.className="patch-case-link";
        p.innerHTML=`<a data-story="${key}" href="#">${label}</a>`;
        oldCases.appendChild(p);
      });
    }
  }

  function guaranteeAgencyLanding() {
    const portal = $("portal-screen");
    const game = $("game-screen");
    const title = $("title-screen");
    if (!portal || !game || !title) return;
    // 初次载入必须先看见侦探社。只有原游戏已经显式进入案卷时才保持案卷界面。
    const gameActuallyOpen = !game.classList.contains("hidden");
    if (!gameActuallyOpen) {
      portal.classList.remove("hidden");
      title.classList.add("hidden");
    }
    const back = $("back-title");
    if (back) back.textContent = "返回烛影侦探社";
  }

  function enrichNotebookAfterOriginal() {
    const box = $("suspect-notes");
    if (!box) return;
    // 保留原游戏按章节变化的人物信息，只增加生活细节，避免提前泄露后续证物。
    box.querySelectorAll(".note-entry.person").forEach(entry => {
      const name = entry.querySelector("b")?.textContent?.trim();
      const extra = profileSupplements[name];
      if (!extra || entry.querySelector(".profile-supplement")) return;
      const p = document.createElement("p");
      p.className = "profile-supplement";
      p.textContent = extra;
      entry.appendChild(p);
    });
    if (!box.querySelector(".patch-profile")) box.insertAdjacentHTML("afterbegin", adaProfile);
  }

  function plainTextFast(html) {
    return String(html)
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;|&#160;/gi, " ")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&amp;/gi, "&")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;|&apos;/gi, "'")
      .replace(/\s+/g, " ")
      .trim();
  }

  const storySearchIndex = new Map(
    Object.entries(stories).map(([key, story]) => [
      key,
      [story.title, story.kicker, story.meta, ...story.pages.map(plainTextFast)].join(" ").toLowerCase()
    ])
  );

  document.addEventListener("submit", (e) => {
    if (e.target?.id !== "portal-search") return;
    const input = $("portal-search-input") || e.target.querySelector("input");
    const query = (input?.value || "").trim().toLowerCase();
    if (!query) return;
    const matches = Object.entries(stories).filter(([key]) => storySearchIndex.get(key)?.includes(query));
    if (!matches.length) return;
    // 不替换原站检索结果；等原游戏完成搜索后，把新增/扩写文库的命中补到结果末尾。
    requestAnimationFrame(() => {
      const copy = $("portal-reading-copy");
      const meta = $("portal-reading-meta");
      if (!copy || !$("portal-reading")?.classList.contains("active")) return;
      const additions = matches.filter(([key]) => !copy.querySelector(`[data-story="${key}"]`));
      if (!additions.length) return;
      let extra = copy.querySelector(".patch-search-extra");
      if (!extra) {
        extra = document.createElement("div");
        extra.className = "portal-search-results patch-search-extra";
        extra.innerHTML = `<p class="patch-search-label">夜读文库补充结果</p>`;
        copy.appendChild(extra);
      }
      additions.forEach(([key, story]) => {
        const btn = document.createElement("button");
        btn.className = "portal-search-hit patch-thread";
        btn.dataset.story = key;
        btn.innerHTML = `<b>${story.title}</b><span>${story.kicker}</span>`;
        extra.appendChild(btn);
      });
      if (meta) meta.textContent = `${meta.textContent} · 夜读补充 ${additions.length} 条`;
    }, 0);
  }, true);

  document.addEventListener("click", (e) => {
    const nav = e.target.closest(".portal-nav[data-portal-tab]");
    if (nav && (nav.dataset.portalTab === "cases" || nav.dataset.portalTab === "notes")) {
      e.preventDefault();
      e.stopImmediatePropagation();
      renderPatchedStory(nav.dataset.portalTab === "cases" ? "casesIndex" : "notesIndex", 0);
      return;
    }
    const storyEl = e.target.closest("[data-story]");
    if (storyEl && stories[storyEl.dataset.story]) {
      e.preventDefault();
      e.stopImmediatePropagation();
      renderPatchedStory(storyEl.dataset.story, 0);
      return;
    }
    const pageBtn = e.target.closest("[data-lit-dir]");
    if (pageBtn && currentStory) {
      e.preventDefault();
      e.stopImmediatePropagation();
      if (pageTransitionLocked || pageBtn.disabled) return;
      pageTransitionLocked = true;
      const next = currentPage + Number(pageBtn.dataset.litDir || 0);
      renderPatchedStory(currentStory, next);
      setTimeout(() => { pageTransitionLocked = false; }, 120);
      return;
    }
    if (e.target.closest("#notebook-btn")) {
      setTimeout(enrichNotebookAfterOriginal, 0);
    }
  }, true);

  window.addEventListener("pageshow", guaranteeAgencyLanding);

  document.addEventListener("keydown", (e) => {
    if (!currentStory || !$("portal-reading")?.classList.contains("active")) return;
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    const tag = document.activeElement?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const story = stories[currentStory];
    const next = Math.max(0, Math.min(currentPage + dir, story.pages.length - 1));
    if (next === currentPage) return;
    e.preventDefault();
    renderPatchedStory(currentStory, next);
  }, true);

  function init() {
    if ($("integrated-literature-style")) return;
    const lowMemory = typeof navigator.deviceMemory === "number" && navigator.deviceMemory <= 4;
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (lowMemory || reducedMotion) document.documentElement.classList.add("performance-lite");
    injectStyles();
    addThreads();
    guaranteeAgencyLanding();
    document.documentElement.dataset.literatureModule = ARCHIVE_MODULE_VERSION;
  }

  init();
})();

/* ================================================================
   Integrated v8 stability module
   Source formerly maintained in stability-polish.js.
   Kept inside game.js so the old standalone file can be deleted.
   ================================================================ */
(() => {
  "use strict";

  if (window.__CANDLELIT_STABILITY_MODULE__) return;
  window.__CANDLELIT_STABILITY_MODULE__ = true;

  const root = document.documentElement;
  const lowMemory = typeof navigator.deviceMemory === "number" && navigator.deviceMemory <= 4;
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if (lowMemory || reducedMotion) root.classList.add("performance-lite");

  // 场景图切换时优先异步解码；空闲时间按顺序预热后续场景，避免一次性抢主线程。
  const sceneImages = [
    "assets/images/exterior.webp",
    "assets/images/deadroom.webp",
    "assets/images/office.webp",
    "assets/images/lab.webp",
    "assets/images/tube.webp",
    "assets/images/cold-vault.webp"
  ];
  const scene = document.getElementById("scene-image");
  if (scene) {
    scene.decoding = "async";
    scene.fetchPriority = "high";
  }

  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const mayPrefetch = !connection?.saveData && !(connection && /(^|-)2g$/.test(connection.effectiveType || ""));
  function preloadOne(index = 0) {
    if (!mayPrefetch || index >= sceneImages.length || document.hidden) return;
    const img = new Image();
    img.decoding = "async";
    img.src = sceneImages[index];
    const next = () => schedulePreload(index + 1);
    if (img.decode) img.decode().then(next, next);
    else { img.onload = next; img.onerror = next; }
  }
  function schedulePreload(index = 0) {
    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => preloadOne(index), { timeout: 1300 });
    } else {
      setTimeout(() => preloadOne(index), 240 + index * 80);
    }
  }
  schedulePreload(0);
  if (document.hidden) {
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) schedulePreload(0);
    }, { once: true });
  }

  // 防止触摸设备上的双击/抖动导致同一重型交互连续执行两次。
  const expensiveSelector = [
    ".hotspot", ".location-btn", ".evidence-card", ".inventory-item",
    ".archive-tab", ".ink-button", ".portal-nav", ".portal-thread",
    ".portal-search-hit", ".literary-page-btn", "[data-story]"
  ].join(",");
  let lastTarget = null;
  let lastAt = 0;
  document.addEventListener("click", (event) => {
    const target = event.target.closest?.(expensiveSelector);
    if (!target) return;
    const now = performance.now();
    if (target === lastTarget && now - lastAt < 145) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    lastTarget = target;
    lastAt = now;
  }, true);

  // 长任务连续出现时自动降级纯装饰效果，不改变谜题、文本或交互规则。
  if ("PerformanceObserver" in window) {
    try {
      let longTasks = 0;
      let windowStart = performance.now();
      const observer = new PerformanceObserver((list) => {
        const now = performance.now();
        if (now - windowStart > 8000) {
          longTasks = 0;
          windowStart = now;
        }
        longTasks += list.getEntries().filter(entry => entry.duration >= 90).length;
        if (longTasks >= 3) {
          root.classList.add("performance-lite");
          observer.disconnect();
        }
      });
      observer.observe({ type: "longtask", buffered: true });
    } catch (_) {}
  }

  // 阅读长文时不让定时新案弹窗强行覆盖页面；改成低干扰“待阅”提示。
  const dispatch = document.getElementById("dispatch-modal");
  const reading = document.getElementById("portal-reading");
  const breadcrumb = document.getElementById("portal-breadcrumb");
  function ensureDispatchChip() {
    if (!breadcrumb || document.getElementById("deferred-dispatch-chip")) return;
    const chip = document.createElement("button");
    chip.id = "deferred-dispatch-chip";
    chip.type = "button";
    chip.textContent = "新案电报 · 待读";
    chip.addEventListener("click", () => {
      // Close the current article first so the intentionally requested dispatch
      // is not caught by the interruption guard below.
      document.getElementById("portal-reading-close")?.click();
      requestAnimationFrame(() => {
        document.getElementById("portal-urgent-thread")?.click();
        chip.remove();
      });
    });
    breadcrumb.appendChild(chip);
  }
  if (dispatch && reading && "MutationObserver" in window) {
    const dispatchObserver = new MutationObserver(() => {
      if (!dispatch.classList.contains("hidden") && reading.classList.contains("active")) {
        dispatch.classList.add("hidden");
        ensureDispatchChip();
      }
    });
    dispatchObserver.observe(dispatch, { attributes: true, attributeFilter: ["class"] });
  }

  // 从后台恢复时清掉可能遗留的阅读忙碌状态，避免辅助状态看起来像“卡死”。
  window.addEventListener("pageshow", () => {
    document.getElementById("portal-reading")?.removeAttribute("aria-busy");
  });
})();
