(() => {
  "use strict";

  const SAVE_KEY = "dead-letter-room-save-v5";
  const LEGACY_SAVE_KEYS = ["dead-letter-room-save-v4", "dead-letter-room-save-v3", "dead-letter-room-save-v2", "dead-letter-room-save-v1"];
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
        "十九年前，赫尔曼在一座雨站台上把一个无人来接的女孩带回邮局。此后很多年，她住在他家里，却始终习惯叫他“局长”。",
        "艾达·克莱因脱下被雾打湿的手套，先确认门闩没有被碰过，才走到玛戈面前。她问：“昨晚你离开这里的时候，赫尔曼还在和你说话吗？”"
      ]
    },
    chapter1:{
      register:"CASE 17—B · FIELD NOTE", folio:"INTERLUDE 02", kicker:"第一章之后 · 地下楼梯", heading:"三只没有邮戳的信封", button:"去局长办公室", theme:"paper",
      lines:[
        "地下室渐渐安静下来。证物袋沿墙排开，铅笔写下时间、位置和痕迹，没人急着替那些记录作解释。",
        "玛戈一直等在楼梯拐角。艾达上来时，她先问的不是尸体，而是赫尔曼桌上的《雪落以前》。",
        "“昨晚他念到一半。”她低头揉着袖口，“念到那个孩子还在等母亲。然后我们就吵起来了。”",
        "办公室的磨砂玻璃后，三只没有邮戳的信封并排压在台灯下。纸页都很旧，只有最上面那只信封的折痕还新，像是昨夜才被人反复拿起又放下。"
      ]
    },
    chapter2:{
      register:"PRIVATE MAIL · INDEX 17—B", folio:"INTERLUDE 03", kicker:"第二章之后 · 局长办公室", heading:"墙里的呼吸", button:"去气动管控制室", theme:"glass",
      lines:[
        "三封信终于能读了。安娜·韦伯的名字散在不同年份的纸上；有的墨已经发褐，有的仍深得像刚刚写下。",
        "玛戈把旧处方翻过去，又翻回来。她的拇指始终停在那块被水洇开的剂量栏上，直到纸角被捏出一道新的折痕。",
        "墙里的气动管就在这时响了一声。黄铜胶囊撞进接收槽，在安静的办公室里显得格外突兀。",
        "维克托没有碰它，只抬头看了眼墙上的维修表：“昨晚这条管线漏气。可这东西还是到了，只是晚了很久。”"
      ]
    },
    chapter3:{
      register:"COLD VAULT · TEMPERATURE LOG", folio:"INTERLUDE 04", kicker:"第三章之后 · 冷库门口", heading:"冷库门外", button:"开始重建案情", theme:"cold",
      lines:[
        "冷库门一开，霜气贴着地面慢慢散出来。艾达把层板纤维、地面拖痕和温度表的记录依次夹进调查簿，没有先写结论。",
        "玛戈站在门外。她没有进来，只盯着温度表上被改过的那一格。过了很久，她说：“那一晚，我确实来过这里。”",
        "艾达没有追问。她把调查簿翻到新的一页，把已经确认的证物编号一件件写下。",
        "她把几份证词合到一边。接下来只看已经验证过的时间、痕迹和纸面记录，再把它们一项项对在一起。"
      ]
    }
  };
  const storyTransitions = {
    opening:{chapter:1,scene:"deadroom",minutes:0},
    chapter1:{chapter:2,scene:"office",minutes:25},
    chapter2:{chapter:3,scene:"tube",minutes:25},
    chapter3:{chapter:4,scene:"finale",minutes:25}
  };

  const caseFragments = {
    exterior:{title:"门房老奥托记得的，是一盏总比别人晚熄的灯",source:"2007 年口述档案补录 · 奥托之子提供",copy:`<p>老奥托在邮局做了三十一年门房。冬天关门前，他会逐间看炉火、拔插销、把湿伞倒过来靠在墙边。只有局长办公室常常还亮着。</p><p>儿子问过他为什么不催。奥托说，福格尔偶尔会留一壶已经煮苦的咖啡，等夜班车把最后一袋邮件送来；也有人天黑后才从侧门进来，把信压在帽檐下面，不愿让街上的熟人看见。奥托从不问姓名，只在他们走后把门闩重新扣好。</p><p>“那盏灯总要晚半个钟头。”他晚年还记得这件事。至于最后那一夜为什么一直亮到清晨，他没有机会再去问。</p>`},
    deadroom:{title:"裁缝铺十月账页：左胸内衬只补了一半",source:"施耐德裁缝铺 · 1927 年 10 月账页",copy:`<p>十月二十三日，赫尔曼把制服送到施耐德裁缝铺。左胸内衬磨得发白，靠近口袋的地方裂了两寸。施耐德说整片换掉省事，他却按着那块旧布，只让补裂口。</p><p>临走前，他已经走到门边，又回来问了一句：新线的结能不能藏在夹层里。施耐德说能，只是以后拆起来麻烦。赫尔曼点点头，把制服搭回臂弯。账本边上因此多了一行小字：『左胸旧布保留。客人自带深灰线。』</p>`},
    office:{title:"艾尔莎记得，玛戈小时候总在高柜旁写作业",source:"抄写员艾尔莎·克劳斯退休访谈 · 1958",copy:`<p>艾尔莎十九岁进邮局，座位就在局长办公室外。玛戈放学后常坐在高柜旁写作业，墨水冻住时就把小瓶放到炉边；写累了，会枕着叠好的退信袋睡一会儿。赫尔曼经过时从不叫醒她，只把盖邮戳的木槌换到另一张桌上。</p><p>有同事笑着问，既然养了这么多年，怎么还让孩子一口一个“局长”。赫尔曼正在分拣挂号信，手没有停：“称呼是她自己的东西。”玛戈那天就在门外，不知道有没有听见。</p>`},
    lab:{title:"哈斯的诊所关门那天，药秤还摆在原来的位置",source:"镇医务所清点册 · 利奥波德·哈斯条目",copy:`<p>哈斯脾气坏，字也难看，却每天用软布擦药秤。学徒说，他开处方时写得很快，唯独遇到小数点会停一停，再把那个点描得很重，像怕墨干以后消失。</p><p>诊所在他退休那天清点了四十七只药瓶、两把镊子和一只黄铜药秤。抽屉最里面还压着一张练字纸，整页都是“0.2、0.4、0.6”。纸已经发黄，只有一个个小圆点黑得突兀。学徒说，那习惯是十九年前一场大雨以后留下的。</p>`},
    tube:{title:"维克托能凭声音听出哪一段管线在漏气",source:"艾达·克莱因私人边注 · 未列入正式证词",copy:`<p>维克托修阀门时很少看图纸。他用指节从黄铜外壳一节节敲过去，听到第三个弯头时停下来，把耳朵贴近金属：“这里。”拆开以后，裂缝果然就在密封圈背面。</p><p>艾达问他从哪里学的。他把螺丝一枚枚排在手帕上，只说：“以前靠这个吃饭。”当天的住宿登记里，他职业一栏写的是邮票商；三天后退房，床头只剩两枚外国硬币和一根用旧的鞋带。</p>`},
    cold:{title:"十一月十七日傍晚，玛戈买了两人份早餐",source:"福格尔宅邸杂项袋 · 附件 3",copy:`<p>收据开在十一月十七日十八点十二分：黑麦面包两份、腌李子一小罐、咖啡豆半磅。店员在背面用铅笔写着“鲜奶一瓶，明早来取”，下面还有玛戈随手画的一道短线。</p><p>店员晚年还能记起她。那天玛戈嫌面包烤得太硬，特意换了一只软些的，说“他牙不好，还不承认”。第二天清晨，鲜奶照常摆上柜台，直到中午也没人来取。</p>`},
    finale:{title:"艾达调查簿的最后一页，只记了几件很小的事",source:"艾达·克莱因 · 私人调查簿最后一页",copy:`<p>正式结论写完后，艾达又在页脚记了三件事：玛戈离开询问室时把赫尔曼的围巾叠好放回椅背；哈斯在走廊抽了半支烟又掐灭；艾尔莎问制服上的破口还能不能补。</p><p>最下面原本还有一句话，写到一半被划掉，只剩几个能辨认的字：『明早……早餐……』再往后，是一整页没有使用的纸。</p>`}
  };

  const novelPages = {
    1:{title:"雨里的孩子",copy:`<p>小站整夜下雨。女孩坐在第六站台最靠里的长椅上，脚上的雨靴大了一码，走两步就会从脚跟脱下来。她不肯脱，因为母亲说过，下雨天鞋袜湿了会发烧。</p><p>每趟车进站，她都站起来，把裙角抻平，再问检票员一次：“这一趟有从南边来的人吗？”检票员起初还低头看名单，后来只摇头。到末班车时，站台钟停在十一点十七分，雨水从钟面上往下淌，像时间也被冲淡了。</p><p>最后一个离开的，是穿邮政制服的男人。他把伞举到女孩头顶，没有说“她不会来了”，也没有说“别等”。他只把自己那副干手套塞给她，说：“先回去把鞋烤干。明天要是还想来，我陪你。”</p><p>女孩跟着他走了几步，又回头看。长椅上留着一个浅浅的水印，像还有谁坐在那里。</p>`},
    2:{title:"每年一封",copy:`<p>往后的五年，女孩生日都会收到一封信。信里很少提“想念”，只写一些小事：窗台第一场雪比去年早了三天；牛奶又烧糊了；院子里那只灰雀把面包屑全抢走；她小时候总把左脚鞋带系得太紧，脚背会勒出一道红印。</p><p>女孩起先会把每封信念两遍，后来只念一遍，再后来不当着别人的面拆。她把信折成同样大小，藏进床板下面。某一年她问邮局长，母亲为什么从不写自己的地址。男人正在给挂号信盖戳，木槌停了一下，说：“她搬得勤。”</p><p>他把信递过去时总把邮戳朝下。女孩以为他怕油墨沾手。多年以后她才发现，那几封信的戳记颜色太相近，边缘也从没有真正磨损过。</p>`},
    3:{title:"零点六克",copy:`<p>故事里有一位医生，冬天出诊时总带一只黑色皮箱。箱角被磕得发白，里面的药瓶却排得很整齐。他写字极快，数字之间常连在一起，只有小数点会停一下，再用笔尖轻轻点实。</p><p>女孩记不清医生的脸，只记得母亲床头那张处方。雨从没关严的窗缝打进来，纸角湿透，剂量栏晕成一团。医生把纸拿到灯下，看了很久，说：“原来那一个点还在。”</p><p>页边后来多了一行与正文不同的字迹：<em>0.6g。数字没有变，变的是那块被水洗掉的纸。</em></p><p>女孩没有看见这行补记。她记住的是湿纸上那个空掉的位置，并让那个空白在许多年里长出了自己的形状。</p>`},
    4:{title:"改姓的人",copy:`<p>女孩长大以后改了姓。登记员把新证件递给她，她看了很久，说名字没有问题。回家路上，男人问是不是该改回去，她说：“不用，反正大家已经这么叫了。”</p><p>那天晚饭是土豆汤。男人把盐递过去，又收回来，像还有话要说。女孩忽然问：“你替一个已经不在的人留了这么多年信，不累吗？”</p><p>男人把勺子放下：“我不是替她留。”</p><p>“那替谁？”</p><p>他看着桌面，过了好一会儿才说：“替还会来取的人。”</p><p>女孩没有再问。窗外正好有邮车经过，玻璃被车灯照亮一瞬。那以后，他们仍每天在同一张桌子吃饭，却很少再提雨站台和母亲。</p>`},
    5:{title:"雪落以前",copy:`<p>最后一页原本夹在冷库温度表后。页脚沾着两种墨：一层已经褪成褐色，一层仍很深，像是隔了许多年才有人重新把笔放回同一个故事里。</p><p>故事写到女孩推开地下室的门。男人手里握着一封没有封口的信，桌上有两只杯子，其中一只茶已经凉了。女孩先看见信，又看见他的手。她问：“你还准备替她骗我多久？”</p><p>男人说了什么，纸上没有留下。正文在这里断开，只剩三个被划去又重写的开头：<em>我本来…… / 那一年…… / 玛戈，其实……</em></p><p class="missing">此处缺失三行。此处缺失三行。此处缺失三行。</p><p>页面最下方另有一小块铅笔痕，像写作者试过一句话，又用指腹擦掉。迎着侧光看，只能认出最后两个字：<em>明早。</em></p>`},
    6:{title:"收件人",copy:`<p>前五页的纸张、墨色和折痕属于安娜。第六页不是。</p><p>它折成信封大小，缝在赫尔曼制服左胸的旧内衬里。封面没有地址，只写“玛戈”。信口没有火漆，也没有邮戳，纸边还留着昨夜折过以后才有的硬痕。</p><p>纸页右上角没有页码。第一行是赫尔曼的笔迹：『前五封信是你母亲写的。这一封，是我欠你的。』</p>`}
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
    version: 4, started: false, chapter: 1, scene: "deadroom", clock: 460,
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
  ["portal-screen","portal-search","portal-search-input","portal-home-view","portal-breadcrumb","dispatch-modal","dispatch-enter","dispatch-later","portal-continue","portal-reading","portal-reading-kicker","portal-reading-title","portal-reading-meta","portal-reading-copy","portal-reading-close","portal-urgent-thread","title-screen","game-screen","case-home","case-breadcrumb-text","case-page-label","case-page-heading","case-fragment-title","case-fragment-copy","case-fragment-source","continue-game","chapter-kicker","chapter-title","scene-image","hotspots","scene-number","scene-name","scene-subtitle","objective-text","objective-progress","game-clock","location-nav","location-rail","evidence-panel","evidence-list","evidence-count","knowledge-list","inventory-list","dialogue","dialogue-speaker","dialogue-text","dialogue-next","modal-backdrop","detail-modal","detail-kicker","detail-title","detail-visual","detail-copy","detail-actions","archive-modal","archive-tabs","archive-page-no","archive-page-title","archive-page-copy","archive-query","archive-result","archive-badge","notebook-modal","notebook-objectives","suspect-notes","hint-modal","hint-text","support-modal","support-btn","sound-btn","menu-modal","ending-modal","ending-title","ending-copy","ending-stats","ending-letter","final-letter","toast","story-interlude","story-register","story-folio","story-kicker","story-heading","story-lines","story-continue"].forEach(id=>els[id.replaceAll("-","_")]=$(id));

  function save(){ localStorage.setItem(SAVE_KEY, JSON.stringify(state)); }
  function load(){
    try{
      const raw=localStorage.getItem(SAVE_KEY)||LEGACY_SAVE_KEYS.map(k=>localStorage.getItem(k)).find(Boolean);
      const parsed=JSON.parse(raw||"null");
      if(parsed){
        state=Object.assign(defaultState(),parsed,{version:5});
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
    if(els.case_breadcrumb_text)els.case_breadcrumb_text.textContent=`17—B › ${chapters[state.chapter].kicker} · ${chapters[state.chapter].title} › ${s.name}`;
    if(els.case_page_label)els.case_page_label.textContent=state.scene==="finale"?"案情重建页":"原案现场复原页";
    if(els.case_page_heading)els.case_page_heading.textContent=`${s.name} · ${s.sub}`;
    const fragment=caseFragments[state.scene];
    if(fragment&&els.case_fragment_title){els.case_fragment_title.textContent=fragment.title;els.case_fragment_copy.innerHTML=fragment.copy;els.case_fragment_source.textContent=fragment.source;}
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
        "艾达|门闩先留着。你昨晚是什么时候见到赫尔曼的，就从那里说起，不用替任何人解释。",
        "玛戈|晚饭以后。我来找他，为了母亲留下的信。我们吵了几句……我先走了。",
        "艾达|记得哪一句就说哪一句。想不起来的地方先空着，也比后来替自己补上要好。"
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
    const ok=hasItem("pencil");showDetail("信 A · 空白压痕",ok?"纸面没有墨，侧光下却能看见一排浅沟。铅笔的软芯不会弄湿纸，也不会像钢笔那样重新压伤它。":"纸面似乎完全空白。斜着看，纤维里有一道道极浅的沟槽。",null,ok?[{label:"用铅笔侧锋轻擦",primary:true,run:()=>solveLetter("letterA","e_letterA","玛戈|17—B……我小时候在母亲的东西上见过这个编号。赫尔曼后来把那一格柜子一直锁着。","纸张压痕可以在不浸湿旧纸的情况下显现。") }]:[],"纸张检查");
  }
  function letterB(){
    if(state.flags.letterB){showDetail("信 B · 已开启",evidenceData.e_letterB.copy,null,[],"旧医疗纸片");return;}
    if(!hasItem("candle")&&!hasItem("burner")){showDetail("信 B · 火漆封面","火漆已经发脆，下面垫着一张更薄的旧纸。硬撬会把两层一起扯破。",null,[],"封缄检查");return;}
    showDetail("信 B · 控制火焰","你只需要让旧火漆软下来，而不是把它熔成一滩。选择加热方式。",null,[
      {label:"让火焰贴住火漆",run:()=>wrong("火漆冒烟，纸边很快卷起。你及时把火移开。")},
      {label:"隔两指宽缓慢温热",run:()=>{unlockFragment(3);solveLetter("letterB","e_letterB","哈斯|这是我十九年前开的处方。那场雨之后纸被泡坏了，剂量栏缺了一块；我能确认的，只有现在还看得见的笔画。","间接加热能让旧火漆软化，同时减少对薄纸的灼伤。");}},
      {label:"放到窗边冷却",run:()=>wrong("低温只会让旧火漆更脆，封口没有松动。")}
    ],"封缄实验");
  }
  function letterC(){
    if(state.flags.letterC){showDetail("信 C · 已显影",evidenceData.e_letterC.copy,null,[],"隐写字迹");return;}
    if(!hasItem("diluted")||!hasItem("swab")){showDetail("信 C · 蓝边纸","纸上有几乎透明的书写痕。深色碘酒若直接滴下去，会把细线全部盖住。",null,[],"纸张检查");return;}
    showDetail("信 C · 淀粉墨","稀释后的碘液已经调好。棉签可以控制显色范围。",null,[{label:"用棉签沿透明笔迹薄涂",primary:true,run:()=>{unlockFragment(4);solveLetter("letterC","e_letterC","玛戈|零点六……这行字我以前没见过。我记得的那张处方，剂量栏一直是缺的。","碘与淀粉墨发生显色反应，稀释后更容易保留细笔画。",()=>{state.inventory=state.inventory.filter(x=>x!=="diluted");});}}],"显色实验");
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
      {label:"立即",run:()=>wrong("这无法解释前一日的邮戳。")},{label:"6 小时",run:()=>wrong("投递时间仍然晚了整整十八小时。")},{label:"12 小时",run:()=>wrong("还差半天。")},{label:"24 小时",run:()=>{state.flags.tubeSolved=true;addClue("c_capsule","延时阀的24小时档能解释17日邮戳为何到18日清晨才出现。");closeAll();dialogue(["维克托|这是二十四小时档。胶囊如果昨晚进了管线，今早落到办公室，时间正好。至于是谁放进去的，机械本身回答不了。"],()=>{checkChapter3();render();});}}
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
    els.ending_copy.innerHTML="<p>11月17日夜里，玛戈为了母亲那张残缺处方与赫尔曼争执。赫尔曼退到桌边时失去重心，后枕撞上桌角。那一下就是致命伤；杯里的药没有被喝下，现场也没有第二件凶器。</p><p>玛戈却把那一瞬间同十九年前的雨夜连在了一起。她把赫尔曼移进 <b>2°C</b> 冷库，改写温度记录，让前一日的胶囊延迟到清晨落下，再从通风管牵落门闩。她花了一整夜，把一次失手布置成一桩似乎早有缘由的谋杀。</p><p>艾达写完最后一行时间，起身去取赫尔曼的制服。左胸内衬有一道颜色很新的线，针脚歪得不像裁缝铺的手艺。拆开以后，一只薄信封从夹层里滑到桌上。封面只有两个字：玛戈。没有邮戳。</p>";
    els.ending_letter.classList.remove("hidden");els.final_letter.classList.add("hidden");
    const eggs=(state.flags.catLetter?1:0)+(state.flags.radioEgg?1:0)+(state.flags.suitcaseEgg?1:0);
    els.ending_stats.innerHTML=`<div><b>${state.clues.length}</b><span>登记证物</span></div><div><b>${state.mistakes}</b><span>错误尝试</span></div><div><b>${eggs} / 3</b><span>系列暗线</span></div>`;
    openModal("ending-modal");if(state.flags.finalRead)revealFinalLetter();
  }

  function revealFinalLetter(){
    state.flags.finalRead=true;unlockFragment(6);addClue("c_sixth","赫尔曼在死前已经决定把安娜的死因与自己的心意一起告诉玛戈。");state.readFragments.push(6);state.readFragments=[...new Set(state.readFragments)];
    els.ending_title.textContent="第六封信";els.ending_letter.classList.add("hidden");els.final_letter.classList.remove("hidden");
    els.final_letter.innerHTML=`<p>玛戈：</p><p>前五封信是你母亲写的。这一封，是我欠你的。</p><p>安娜走的那一夜很清醒。哈斯写的是零点六克。窗漏雨，处方湿了一角，那个点后来几乎看不见了。她知道自己的病到了哪里，也知道药只能让疼痛轻一点。</p><p>她把五封信交给我，说一年给你一封。她还留了一只蓝碗、一条旧围巾和你的订报证，要我等你长大一些再交给你。她说，等到那时候，你大概已经不需要靠一封生日信确认自己还被谁记得。</p><p>信，我一年一年给了。剩下的话，我总觉得可以晚一点。</p><p>你小时候在邮局睡着，我怕木槌吵醒你，就去另一张桌上盖戳；你十五岁第一次发烧，我在门外坐到天亮，却只会问你第二天还去不去上课。你一直叫我“局长”，后来叫“福格尔先生”。每一次我都想说点别的，又觉得临时改口太奇怪。</p><p>我把这封信写好以后，去厨房看了一眼。黑麦面包还有两片，咖啡也够。明早如果你愿意，我们一起吃。你叫我什么都行。</p><p>有件事我不想再拖到下一年：这些年你住在我家，不是借住，也不是因为我答应过谁。</p><p class="sign">赫尔曼<br>11月17日晚</p><p class="last-line">第二天清晨，玛戈订的鲜奶一直放在店里。到中午，瓶身外面的水珠已经干了。</p>`;
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
      if(i===correct[k]){state.radioSteps++;closeAll();if(state.radioSteps===3){state.flags.radioEgg=true;dialogue(["收音机|——月亮升起时，老橡树下见。——","维克托|这不是本案的通讯码。我以前见过类似格式，但现在说不准是谁留下的。"],render);}else setTimeout(radio,280);}
      else{state.radioSteps=0;wrong("旋钮从窄频带里滑了出去，节拍重新开始。");setTimeout(radio,280);}
    }}));
    const accessible=audio.enabled?"静电里有三段长短不同的脉冲。选择与你听到的一致的节拍。":`扬声器没有开启。旁边的记录针在纸带上留下：${target}。`;
    showDetail("短波调频",`${accessible}<br><small class="detail-note">这是系列暗线，不影响本案结局。</small>`,null,choices,"无线电记录");
  }
  function deadletters(){
    const stories=["一封寄给1912年的自己：『不要搭上星期四的船。』信封背面又补：『如果已经搭了，就记得告诉莉娜，我不是故意没回来。』","一张没有地址的明信片，只画着一棵被劈成两半的橡树。右下角写着：『我们在树还完整的时候见过。』","一封儿童笔迹的信：『妈妈说死人不会回信，可邮差先生回了。』下面有赫尔曼的铅笔字：『回的是邮局。别让孩子等。』","一只空信封。夹层里粘着一粒海盐和半张码头票，收件人栏只有一个名字：阿黛尔。","一封被退回三次的求职信。寄信人后来在邮局做了二十三年夜班，第四次没有再寄，因为收信的工厂已经倒闭。","一张没有正文的讣告剪报，背面写：『我原本只是想告诉你，我已经学会做那道汤。』"];
    const i=(state.actions+state.clues.length)%stories.length;showDetail("随机死信",stories[i],"✉");
  }
  function suitcase(){
    if(state.flags.suitcaseEgg){showDetail("维克托的手提箱","暗格已经打开。里面的护照分别把他称作商人、记者和『野兔七号』。","▣");return;}
    showDetail("维克托的手提箱","三枚邮票按王冠、乌鸦、橡树排列。箱扣也有三枚图案。","▣",[
      {label:"王冠 → 乌鸦 → 橡树",run:()=>{state.flags.suitcaseEgg=true;closeAll();dialogue(["维克托|这三本护照都是真的，只是属于不同年份。","艾达|你以前替谁工作？","维克托|等这案子结束。如果你还想知道，我会把能说的部分告诉你。"],render);}},
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
    const entries=Object.values(chapters).map((c,i)=>{const n=i+1,done=state.chapter>n||state.ending;return `<div class="note-entry ${done?"complete":""}"><b>${c.kicker} · ${c.objective}</b><p>${n<=state.chapter?`${n===state.chapter?"正在复核":"已归档"} · ${n===state.chapter?progress()+" / "+c.target:c.target+" / "+c.target}`:"尚未开放"}</p></div>`;}).join("");
    els.notebook_objectives.innerHTML=entries;
    const margo=state.chapter<3?"赫尔曼的养女，曾在诊所做护士。她说起昨夜争吵时停了两次，每次都先把袖口抹平。旧订报证上，她小时候登记的姓仍是韦伯。":"她熟悉处方、冷库和邮局作息。冷库记录被摊到桌上以后，她很久没有说话，只把赫尔曼留下的围巾重新叠了一遍。";
    const haas=state.flags.letterB?"十九年前为安娜开过处方。那场雨毁掉剂量栏以后，他写每个小数点都格外重。诊所旧账里，穷人就诊的收费栏常常空着。":"镇上医生。杯底检出镇静剂，但死者胃内容物没有对应成分。他说话不耐烦，遇到无法确认的剂量时却始终只答『不知道』。";
    els.suspect_notes.innerHTML=`<div class="note-entry person"><b>赫尔曼·福格尔</b><p>邮局长。十九年前把雨站台上的玛戈带回家。办公室里常备儿童铅笔和酸李子；退信柜最后一格每周五都会清空一次，他说要留给『明天来的那一封』。</p></div><div class="note-entry person"><b>玛戈·福格尔</b><p>${margo}</p></div><div class="note-entry person"><b>利奥波德·哈斯</b><p>${haas}</p></div><div class="note-entry person"><b>维克托·莱茵</b><p>邮票商，熟悉旧式气动管。住宿簿上的职业写得很普通，手提箱里却有不同年份、不同姓名的证件。他修机器时会把拆下的螺丝按长短排在手帕上。</p></div><div class="note-entry person"><b>安娜·韦伯</b><p>${state.flags.letterA?"玛戈的生母，《雪落以前》的署名者。病中手稿记着玛戈的鞋带、果酱和明年要换的新鞋，关于自己的病只写过一句。":"玛戈的生母。《雪落以前》的署名者。旧目录仍保留她的编号17—B，钉孔附近有多次翻阅留下的磨损。"}</p></div><div class="note-entry person minor"><b>艾尔莎·克劳斯</b><p>邮局抄写员。她记得玛戈小时候在高柜旁写作业，也记得赫尔曼在孩子睡着时把盖邮戳的木槌换到另一张桌上。</p></div>`;openModal("notebook-modal");
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
    else if(q.includes("第六")||q==="6"||q.includes("结尾"))els.archive_result.textContent=state.ending?"第六页已从制服内衬取出。":"第六页：索引存在，原件缺失。";
    else els.archive_result.textContent="没有匹配记录。请检查拼写，或改用人物别名、案号检索。";
    save();
  }
  function openSupport(){localStorage.setItem(SUPPORT_SEEN,"1");openModal("support-modal");}
  function hasStoredSave(){return !!(localStorage.getItem(SAVE_KEY)||LEGACY_SAVE_KEYS.some(k=>localStorage.getItem(k)));}

  function start(newGame=false){
    clearStoryTimers();storyActive=false;els.story_interlude.classList.add("hidden");
    if(newGame)reset();else load();
    state.started=true;els.portal_screen.classList.add("hidden");els.dispatch_modal.classList.add("hidden");els.title_screen.classList.add("hidden");els.game_screen.classList.remove("hidden");render();
    if(newGame){queueStory("opening");return;}
    if(state.pendingStory){setTimeout(()=>playStory(state.pendingStory),80);return;}
    if(state.ending)setTimeout(finish,80);
  }
  function backTitle(){closeAll();els.game_screen.classList.add("hidden");els.title_screen.classList.add("hidden");els.portal_screen.classList.remove("hidden");els.portal_continue.classList.toggle("hidden",!hasStoredSave());}

  const portalStories={
    casesIndex:{tab:"cases",kicker:"站点导航 · 旧案陈列",meta:"整理：灰烬 / 页面修订 12-28",title:"旧案陈列：未结案、误判案与重新复核记录",copy:`<p>本站旧案按编号收录，不按结果分类。部分卷宗只有现场照片和几页询问笔录；无法确认的部分保留原样，不补写后续。</p><h3>11—A · 雨站台</h3><p>一名男子在雨夜失踪。站台脚印被雨水破坏，七个月调查未确认去向。卷宗保留两张未使用的回程票和当夜报摊记录。</p><h3>04—C · 熄灯后的走廊</h3><p>走廊停电后发生伤人事件。四名证人对黑暗持续时间的估计相差八分钟，后以楼下钟声与值夜记录重新校准。</p><h3>17—B · 魏瑟堡死信室</h3><p>1927年旧案，原登记为意外死亡。数字化清点时发现未登记私人信件、冷库附件与原索引不一致，现转入复核。</p><p class="portal-archive-note">档案状态：17—B 原始照片已上传；后期补录与原案材料分栏显示。</p>`},
    notesIndex:{tab:"notes",kicker:"站点导航 · 前辈手记",meta:"共 146 篇 / 含失败复盘与现场方法",title:"前辈手记：现场、询问与失败复盘",copy:`<p>这里收录成员的个人调查笔记。正文保留当时判断，页尾另附复盘；若后续发现判断有误，不回删原文。</p><h3>北窗：一扇开着的窗</h3><p>我曾在现场记录里写“逃生通道”。几年后重看底片，照片能够确认的只有“窗户打开”。从那以后，我的现场本分成左右两栏：左边写看到的，右边写当时的判断。</p><h3>南桥：关于“冷静”的一次误判</h3><p>询问记录写着“受访者情绪平静”。我把这句话理解成提前准备，调查因此偏了两天。后来才知道，对方小时候口吃，一紧张反而说不出话。</p><h3>灰烬：待证栏</h3><p>值班表上专门留了一栏“暂无法确认”。日期、人物、动机都可以先放进去，等下一份材料再处理。</p>`},
    rulesIndex:{tab:"rules",kicker:"站点导航 · 调查守则",meta:"值班室共同修订 / 第 7 版",title:"调查守则 · 第七版",copy:`<ol class="portal-rules"><li><b>事实与推论分栏。</b> “杯里检出药物”与“死者摄入药物”分别记录。</li><li><b>保留证人的原话。</b> “不记得”“大概”“我不确定”不得在整理时改成确定表述。</li><li><b>先核对物理条件。</b> 时间、距离、伤痕、温度与机械结构优先实测。</li><li><b>职业、性格、关系只作背景。</b> 不单独作为行为判断依据。</li><li><b>错误路径保留复盘。</b> 注明从哪一条材料开始偏离。</li><li><b>关键结论至少需要两条相互独立的材料支持。</b></li><li><b>私人文字单列。</b> 日记、信件与文学手稿不得直接替代现场证物。</li><li><b>人物评价与案件结论分开。</b> 不因善恶印象增减证据权重。</li><li><b>后期口述注明年份与来源。</b> 与原始证词并存，不覆盖原文。</li><li><b>结论止于证据能够到达的地方。</b> 无法确认的内容标记“待证”。</li></ol>`},
    rain:{tab:"hall",kicker:"前辈手记 · 11—A",meta:"北窗 / 最后修改 12-27 02:13",title:"雨站台：一个没有等到结论的夜晚",copy:`<p>那年我在一座没有钟的车站守到天亮。雨从棚檐一股股落下来，站台上的脚印刚拍完照就淡了。失踪者的妻子坐在候车室里，手里一直捏着两张回程票。她每隔十几分钟就把其中一张抹平，再折回原来的样子。</p><p>凌晨四点，卖热牛奶的老妇人来开摊。她认得失踪者，说他每周三替二号街一位眼睛不好的老人买报纸。那天恰好是周三，报摊底下还压着一份没有取走的《晨报》，纸边被雨气卷成了弧。</p><p>我们查了七个月，没有找到人。妻子后来搬走，只把那两张票寄给我。一张已经被手心磨得发软，另一张几乎是新的。很多年后我整理旧箱子，仍能看出它们原本应该在同一个检票钳下留下缺口。</p><p>案卷最后一页只有日期、天气和“去向不明”四个字。纸很薄，翻过去时，可以看见背面下一宗案件的墨。</p>`},
    lamp:{tab:"hall",kicker:"旧案复盘 · 04—C",meta:"柯石 / 现场时间专题",title:"煤油灯熄灭后的七分钟：四个人为什么都说“没多久”",copy:`<p>灯灭时，走廊里有四个人。事后他们分别说自己只停了“一小会儿”“几分钟”“没多久”“等灯亮”。我们差点把四份相似证词当成互相印证。</p><p>第二天，一个学徒想起楼下的钟敲过两次。重新计时后，四个人所谓的“片刻”分别是三分钟、五分钟、八分钟和十一分钟。没人撒谎；恐惧只是让每个人心里的钟走得不一样。</p><p>从那以后我不再问“你等了多久”，而会问“你等的时候听见了什么、做了什么、谁经过”。时间不是人脑里的一把尺，它更像一团会被情绪揉皱的纸。</p>`},
    letter:{tab:"hall",kicker:"夜读随笔 · 未投递信件",meta:"灰烬 / 12-16",title:"有地址的信，也会寄不出去",copy:`<p>刚来站里整理死信时，我以为“未投递”大多是地址写错、邮资不足，或者收件人已经搬走。做久了才发现，还有一种信地址写得很完整，街道、门牌、姓名一项不少，甚至收件人每天都在写信人身边。</p><p>我见过一封在父亲书桌里放了二十二年的信。纸上没有道歉，也没有遗言，只问女儿搬家以后窗户朝哪边，冬天胃还疼不疼，小时候那只缺耳朵的布兔子是不是还留着。女儿看完以后说，这些事父亲活着时从没问过。可他们几乎每个星期都通电话，话题总是天气、房租和“最近忙不忙”。</p><p>另有一封夹在离婚协议背面。丈夫写：“那天不是你做的汤太咸，是我刚接到医院电话，不知道怎么告诉你。”他们后来又一起生活了六年，那张纸始终没有翻过来。人有时不是缺少一句话，而是不知道该把它放进哪一个已经过得很熟练的日子里。早餐太短，晚饭太累，睡前又觉得明天说也一样。</p><p>我自己的抽屉里也有过这样的纸。写完时觉得郑重得无法当面开口，放久了，又觉得事情已经过去，不必再惊动谁。几年以后再看，真正刺眼的不是那些字，而是纸张上没有邮戳的空白——原来我当时那么确信，明天还会待在原处。</p><p class="portal-pullquote">有些信没有走远，不是因为没有地址。只是写信的人把“明天再说”当成了不会失效的邮票。</p>`},
    mistake:{tab:"hall",kicker:"失败复盘 · 南桥",meta:"公开给新人 / 12-04",title:"我曾因为一句“他看起来很冷静”把方向查反了",copy:`<p>询问记录原文是：“受访者情绪平静，回答简短。”我在自己的笔记旁边写了两个字——“预谋”。这两个字没有来源，却让后面两天的调查都朝同一个方向走。</p><p>最后把时间线纠正过来的是一张杂货店小票。受访者在关键时段正在三条街外买面粉。店主还记得他结账时一句完整的话都没说，只把清单递过去。后来他的姐姐告诉我，他从小口吃，越紧张越安静。</p><p>我去道歉时，他说“没关系”，仍然没有看我。以后半年，我们偶尔在法院走廊碰见，他都会先靠到另一边。再后来有一次，他远远点了点头。我把那天的日期也记在这页下面。</p>`},
    hermann:{tab:"hall",kicker:"人物志 · 魏瑟堡邮政区",meta:"退休职员口述整理 / 非案情结论",title:"赫尔曼·福格尔：一个把退信柜钥匙带回家的人",copy:`<p>赫尔曼做了二十六年邮局长。考勤表几乎没有迟到，办公室抽屉里却常有一些与公务无关的东西：备用鞋带、儿童铅笔、退烧用的湿布，还有一小罐玛戈不肯吃的酸李子。</p><p>1910年前后的冬天，他常带一个小女孩来上班。女孩在高柜旁写字，困了就趴在两只退信袋中间。有人问是不是他的女儿，赫尔曼先说“不是”，隔了一会儿又补：“她叫玛戈。”以后同事便不再问。</p><p>艾尔莎记得他每周五会把退信柜最后一格清出来。遇到实在找不到收件人的信，他不立刻销毁，总要多留七天。理由也很简单：“也许明天有人来问。”这句话他说了很多年，大家听惯了，没人觉得有什么特别。</p><p>他去世以后，办公室钥匙从大衣口袋里取出来。钥匙圈上除了铜牌，还系着一小段已经褪色的红毛线。玛戈小时候的围巾，正是这个颜色。</p>`},
    anna:{tab:"hall",kicker:"人物文稿 · A.W.",meta:"小满 / 私印本整理札记",title:"安娜·韦伯的五页纸：她把明年写得比病情更仔细",copy:`<p>安娜留下的文字很少。病历里是体温、咳血次数和药量，租房簿上是三个月欠款。那五页没有出版过的手稿，反而记了许多医生不会问的事：玛戈吃苹果要削掉皮，睡觉时总把右脚伸出被子，左边鞋带常比右边多打一个结。</p><p>病痛只出现过一次：“今天手没有力气，所以字比昨天难看。”下一句便转去写厨房里的牛奶，说火开得太大，锅底结了一圈褐色的皮，玛戈却喜欢拿勺子去刮。纸角有一小块圆形油渍，大概来自当时放在旁边的碟子。</p><p>第五页背面列着几件尚未发生的事：春天给孩子换一双鞋；天气暖了去河堤看船；生日时把杏酱里的糖少放一勺。最后一项只写了“冬天——”，后面没有字。铅笔停在那里，木头被指甲掐出一道浅痕。</p><p>安娜去世后，这几页纸没有跟随遗物一起封存。有人把它们折好，放进了17—B号柜。折线经过多年开合，正好从“冬天”两个字中间穿过去。</p>`},
    snow:{tab:"hall",kicker:"夜读文库 · 散文诗",meta:"匿名投稿 / 第 41 期",title:"雪落在没有地址的地方",copy:`<div class="portal-poem"><p>夜里落雪的时候，城里许多东西会暂时失去自己的颜色。红邮筒、铜门牌、石阶上昨天留下的泥，都被薄薄一层白压低了声音。只有还亮着灯的窗口知道，雪并没有把什么真正抹去；它只是让人晚一点看见。</p><p>有个人伏在桌边写信。纸已经写满，地址栏却空着。墨水慢慢干成暗蓝色，他把笔搁下，去厨房关火，顺手把第二只杯子也洗了。杯沿相碰，发出很轻的一声。隔壁房间有人翻了个身，两个人之间不过十几步，他仍把信折成四折，放进最里面的抽屉。</p><p>我们每天都在替明天留下位置：多买一个面包，灯不急着关，门锁只扣一层；把一句难说的话挪到周末，把一次道歉挪到天气好一点，把拥抱留到出门以前。日子因此显得宽裕，像雪地还没有脚印，往哪里走都来得及。</p><p>天亮后，送奶的人把玻璃瓶放到门前。瓶身很冷，里面却有乳白色的温度。雪开始化，屋檐一滴一滴往下落，昨晚遮住的门牌重新露出来。抽屉里的信仍旧有姓名，没有日期。</p><p>很多年以后，也许有人会拆开它。那时纸已经脆了，折痕也白了。真正没有地址的，并不是信，而是那个原本预备拿来开口的明天。</p></div>`},
    clerk:{tab:"hall",kicker:"人物小传 · 卷宗边角",meta:"北窗 / 10-30",title:"艾尔莎·克劳斯：抄写员下班以后",copy:`<p>艾尔莎在17—B正式卷宗里只有两行：确认办公室钥匙数量，确认局长昨日下午到岗。退休访谈却录了一个小时零十三分钟。她说话很快，提到年轻时想去剧院做服装，父亲病倒后便留在镇上，从此一坐就是三十七年。</p><p>她每年入冬给同事织手套，尺寸全记在一本邮资表背面。赫尔曼右手比左手宽半指，哈斯嫌羊毛扎，玛戈小时候总把一只手套弄丢，所以她后来干脆织三只。战争那几年，阵亡通知由她誊抄。每一封她都多垫一张纸，怕笔尖划破薄薄的公文纸。</p><p>赫尔曼死后，玛戈有很长一段时间绕开邮局那条街。艾尔莎没有去找她。每年第一场雪，她仍比平时早到十分钟，把局长办公室窗台擦一遍，再把窗开一条缝。访谈员问为什么，她想了很久，说：“那屋子以前太闷，他总不肯开窗。”</p><p>她八十二岁去世。遗物里有一只没有配对的深灰色手套，手腕处缝着很小的字母 H。</p>`},
    waiting:{tab:"hall",kicker:"夜读随笔",meta:"灰烬 / 无案号",title:"等人的房间",copy:`<p>做夜间值班以后，我对房间里“多出来的一份”很敏感。医院家属室的桌上常有一杯彻底凉掉的水；车站候车室有人把行李放在旁边座位，却在每次广播响起时立刻挪开；凌晨去做询问，厨房里如果摆着两副筷子，留下的人通常会先把另一副收进抽屉，再来开门。</p><p>我母亲等我父亲下夜班时，也有这样的习惯。她嘴上说“不等，困了就睡”，却总把汤留在最小的火上。十一点以后，汤面会结一层薄皮，她用勺背轻轻拨开，再把锅盖盖回去。父亲有时两点才回来，有时临时住在厂里。第二天早上，母亲会把没动过的那只碗洗掉，从不说昨晚等过。</p><p>后来父亲不在了，她仍有半年时间会在傍晚下意识地拿出两只碗。第二只放到桌上以后，她才想起来，又慢慢放回橱柜。那动作很短，短到旁人不注意就会错过。可我现在想起父亲，最先出现的不是葬礼，也不是医院，而是瓷碗在木桌上轻轻磕到的一声。</p><p>人习惯把等待理解成一件有开始、有结果的事：列车到了，手术结束了，门终于打开了。其实更多时候，等待只是生活把形状让给了另一个人。床往里睡一点，灯晚关半小时，买面包时顺手拿两份。那个人若没有回来，这些形状不会立刻恢复原样。</p><p>所以我越来越少劝人“向前看”。日子自己会往前，它不需要劝。真正慢的是手：某一天终于只拿一只杯子，某一天买菜时不再多称半斤，某一天关灯以后没有因为楼道脚步声重新坐起来。等到这些细小的动作都学会了新的分寸，人也许才算从一间等人的房间里，搬出去一点点。</p>`},
    case17:{tab:"hall",kicker:"旧案索引 · 17—B",meta:"状态：复核中",title:"17—B · 魏瑟堡死信室",copy:`<p><b>原案日期：</b>1927年11月18日<br><b>地点：</b>魏瑟堡旧邮局地下死信室<br><b>原始登记：</b>意外死亡，现场从内侧闩锁<br><b>复核原因：</b>数字化清点发现未登记私人信件、冷库附件与原证物索引不一致。</p><p><b>已开放材料：</b>原始现场照片 5 组、艾达·克莱因调查簿扫描件、证物登记表、冷库温度附件、气动管维修记录。</p><p><b>复核方式：</b>原结论页面暂时折叠。完成现场材料登记后，可在17—B复核室建立证物关系并提交新的时间线。</p>`}
  };
  let dispatchTimer=null,dispatchDeferred=false;
  function setPortalActive(tab="hall"){document.querySelectorAll(".portal-nav").forEach(b=>b.classList.toggle("active",b.dataset.portalTab===tab));}
  function bindPortalStoryLinks(root=document){root.querySelectorAll("[data-story]").forEach(el=>{el.onclick=e=>{e.preventDefault();openPortalStory(el.dataset.story);};});}
  function openPortalStory(key){
    const x=portalStories[key];if(!x)return;
    els.portal_home_view.classList.add("hidden");els.portal_reading.classList.add("open");
    els.portal_reading_kicker.textContent=x.kicker||"站内文章";els.portal_reading_title.textContent=x.title;els.portal_reading_meta.textContent=x.meta||"";els.portal_reading_copy.innerHTML=x.copy;
    els.portal_breadcrumb.textContent=`当前位置：烛影侦探社 › ${x.tab==="cases"?"旧案陈列":x.tab==="notes"?"前辈手记":x.tab==="rules"?"调查守则":"值班室"} › ${x.title}`;
    setPortalActive(x.tab||"hall");bindPortalStoryLinks(els.portal_reading_copy);els.portal_reading.scrollIntoView({block:"start"});
  }
  function closePortalStory(){els.portal_reading.classList.remove("open");els.portal_home_view.classList.remove("hidden");els.portal_breadcrumb.textContent="当前位置：烛影侦探社 › 值班室";setPortalActive("hall");}
  function showDispatch(){if(state.started||dispatchDeferred||!els.game_screen.classList.contains("hidden"))return;els.dispatch_modal.classList.remove("hidden");}
  function showPortalSearch(q){
    const query=q.toLowerCase();const results=Object.entries(portalStories).filter(([k,x])=>!k.endsWith("Index")&&(x.title+x.kicker+x.meta+x.copy.replace(/<[^>]+>/g," ")).toLowerCase().includes(query));
    els.portal_home_view.classList.add("hidden");els.portal_reading.classList.add("open");els.portal_reading_kicker.textContent="站内检索";els.portal_reading_title.textContent=`“${q}” 的检索结果`;els.portal_reading_meta.textContent=`找到 ${results.length} 条可读取页面`;
    els.portal_reading_copy.innerHTML=results.length?`<div class="portal-search-results">${results.map(([k,x])=>`<button class="portal-search-hit" data-story="${k}"><b>${x.title}</b><span>${x.kicker}</span></button>`).join("")}</div>`:"<p>旧站索引里没有匹配这一关键词。可以试试人物姓名、案件编号、地点或作者。</p>";
    els.portal_breadcrumb.textContent="当前位置：烛影侦探社 › 站内检索";setPortalActive("hall");bindPortalStoryLinks(els.portal_reading_copy);
  }
  function initPortal(){
    els.portal_continue.classList.toggle("hidden",!hasStoredSave());bindPortalStoryLinks(els.portal_screen);
    els.portal_reading_close.onclick=closePortalStory;
    els.portal_search.onsubmit=e=>{e.preventDefault();const q=els.portal_search_input.value.trim();if(!q){closePortalStory();return;}showPortalSearch(q);};
    els.portal_urgent_thread.onclick=()=>{dispatchDeferred=false;showDispatch();};
    els.dispatch_later.onclick=()=>{dispatchDeferred=true;els.dispatch_modal.classList.add("hidden");};
    els.dispatch_enter.onclick=()=>{if(!audio.ctx||!audio.enabled)initAudio();start(true);};
    els.portal_continue.onclick=()=>start(false);
    document.querySelectorAll(".portal-nav").forEach(b=>b.onclick=()=>{const tab=b.dataset.portalTab;if(tab==="hall")closePortalStory();else openPortalStory({cases:"casesIndex",notes:"notesIndex",rules:"rulesIndex"}[tab]);});
    clearTimeout(dispatchTimer);dispatchTimer=setTimeout(()=>showDispatch(),10500);
  }

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
  function updateSound(){$("sound-btn").innerHTML=`<i>声音</i><span>${audio.enabled?"已开启":"已静音"}</span>`;$("title-sound").textContent=audio.enabled?"关闭声音 · 环境声与间页乐音已开启":"开启声音 · 推荐佩戴耳机";}

  function bind(){
    initPortal();
    if(els.case_home)els.case_home.onclick=backTitle;
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
  load();bind();
})();
