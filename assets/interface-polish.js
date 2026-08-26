(() => {
  "use strict";

  const SAVE_KEYS = [
    "dead-letter-room-save-v7",
    "dead-letter-room-save-v6",
    "dead-letter-room-save-v5",
    "dead-letter-room-save-v4",
    "dead-letter-room-save-v3",
    "dead-letter-room-save-v2",
    "dead-letter-room-save-v1"
  ];
  const $ = id => document.getElementById(id);

  const ARCHIVE_PAGES = Object.freeze({
    1: {
      title: "雨里的孩子",
      paragraphs: [
        "小站整夜下雨。雨不是骤然落下来的，像有人从天色最暗的地方慢慢拧开了一只旧水龙头，先湿了铁轨，再湿了站牌，最后把候车棚外那一小截月台泡成发亮的灰。末班车已经过去很久，售票窗后的灯也灭了，女孩仍坐在长椅最边上，两只鞋灌满了水。她把脚尖并得很紧，仿佛只要坐得足够规矩，那个答应来接她的人就还会从雨幕里出现。",
        "穿邮政制服的男人是收完最后一袋邮件才看见她的。他本来已经走过，又停下来，隔着几步问她是不是在等人。女孩没有回答，只抬头看了一眼站外。于是男人也不再追问。他把伞往她那边偏，自己的半边肩膀很快湿透；雨沿着帽檐往下滴，在昏黄的站灯里一颗一颗地亮。两个人就那样站了一会儿，谁也没有替另一个人说出那些还不能确定的话。",
        "后来女孩终于起身，鞋底在木板上留下深色的水印。男人没有碰她的行李，只把伞举得更低一些，说：‘先回去把鞋烤干。明天要是还想来，我陪你。’他说“明天”时语气很平常，像说明早邮车几点到站，像雨总会停，像一个孩子可以先把今晚过完，再决定下一步往哪里去。女孩走出候车棚前回头看了一次空铁轨，雨水从睫毛上落下来，她没有哭。",
        "那一夜后来被人记成许多不同的样子：有人记得雨，有人记得湿透的制服，有人只记得炉边烘了很久的一双鞋。可对女孩而言，真正留下来的也许只是那句话。人在很小的时候并不懂得怎样衡量承诺，只知道有些话说出口以后，黑夜就不再是一整块黑。她没有等到原先约定的人，却第一次知道，“明天”也可以由另一个人陪着走过去。"
      ]
    },
    2: {
      title: "每年一封",
      paragraphs: [
        "往后的五年，每逢生日，女孩都会收到一封信。信封并不漂亮，纸也只是邮局里常见的米白色，有时边角被压出浅浅的折痕。男人把信递给她时，总把邮戳朝下，像那不过是一件不值得多看的小事。女孩起初也确实不看。她更在意信里那些琐碎的句子：天气转凉要添衣，别总把头发湿着睡，冬天的苹果比夏天耐放。",
        "她把五封信收在同一只木盒里。年纪小的时候，生日意味着蛋糕、蜡烛和有人记得；再大一点，生日就成了日历上一个不愿声张的格子。只有那些信始终按时出现。她读完后常把纸重新折回原来的折线，压在盒底，像把一年里没有来得及问出口的话也一起压平。男人从不问她读到了什么，她也没有问那些信为何总经他的手。",
        "很多年以后，她在一个下雪的下午重新打开木盒。旧纸已经带了干燥的脆意，墨色深浅不一，邮票的图案也换过几次。她原本只是想把信按年份排好，却在把五只信封并排放到桌上时停住了：那几枚邮戳的颜色太相近，像从同一小瓶墨里蘸出来的五个冬天。她没有立刻得出任何结论，只把最早的一封拿近窗边，又看了很久。",
        "人年轻时总以为，记忆会替自己保存一切；后来才明白，记忆最擅长保存的是感受，而不是细节。她仍记得每年拆信时手心的温度，记得有人在厨房里切面包，记得窗外有雪或雨，却想不起自己是否真正看过那些邮戳。五封信安静地躺在桌上。纸没有开口，只有时间第一次显出了它并不完全整齐的边缘。"
      ]
    },
    3: {
      title: "零点六克",
      paragraphs: [
        "那张处方被雨浸过。纸纤维在水里发胀，墨迹沿着细小的纹路散开，姓名、日期和剂量栏都像隔着一层薄雾。许多年后，医生再次看见它时已经老了。他把纸放在窗边，没有急着说话，只先用指腹压住翘起的纸角。屋里很安静，连街上的车轮声都显得很远。",
        "水渍最重的地方正穿过剂量栏。原本紧凑的一行字被冲成几段，数字旁边那一点尤其浅，几乎与纸上的斑痕混在一起。医生看了很久，又把眼镜摘下来擦了擦。他没有替缺损的地方补上任何想象，只低声说：‘原来那一个点还在。’那句话轻得像是在对过去的自己说。",
        "页边后来补写了一行：0.6g。只有四个字符，墨色却比整张旧处方都新。数字并没有因此变得戏剧化；它仍只是一个小数，一个需要被准确写下、准确读出的剂量。可有些误差落在纸上只占针尖那么大，落进一个人的年月里，却可能长成再也绕不开的一段路。",
        "医生把纸放回桌面时，窗外又开始下雨。他说年轻时总觉得错误应该有响声，应该像玻璃摔碎那样，让屋里所有人都立刻知道事情出了岔子。后来行医久了才明白，更多错误没有声音。它们只是少了一个点、漏了一句话，或者在所有人都以为看清的时候，悄悄留下一块没有被认真看过的空白。"
      ]
    },
    4: {
      title: "改姓的人",
      paragraphs: [
        "女孩长大以后改了姓。手续办完那天，她把新证件放在桌上，男人看了很久，问她是不是有一天还会改回去。她说不用。语气并不重，也没有故意回避谁；只是一个已经学会自己填写表格的人，在空白栏里写下了愿意继续使用的名字。男人点点头，把证件推回她面前，没有再问。",
        "那以后，他们仍每天在同一张桌子吃饭。早餐常常很安静，刀切过面包皮会发出干脆的一声；晚饭稍晚一些，窗外的街灯亮起，厨房玻璃上便浮出两个人模糊的影子。他们会谈煤价、邮车、屋顶漏水，也会争论盐放得太多还是太少。生活把很多关系磨成了习惯，习惯又让人误以为有些话永远可以留到以后。",
        "只有雨站台和母亲很少再被提起。并不是谁下了禁令，而是每次话题靠近那里，两个人都会自然地转向别处。女孩小时候以为大人沉默，是因为他们知道答案；长大之后才明白，有时恰恰因为不知道该怎样说，人才会把沉默练得像一种礼貌。男人也从不催她回头。他似乎相信，只要桌上的另一只杯子还在，许多事总有一天能慢慢说。",
        "名字改过之后，门牌、账单和包裹上的称呼逐渐都换了。只有家里的餐桌没有变化，旧木纹里仍留着杯底烫出的浅圈。她偶尔会想，一个人究竟从什么时候开始算真正长大：是签下新姓的那一天，还是第一次意识到，和最亲近的人之间也可能隔着一段谁都没有勇气先走完的路。"
      ]
    },
    5: {
      title: "雪落以前",
      paragraphs: [
        "故事写到女孩推开地下室的门。门轴比她想象中轻，只在最后一寸发出很短的摩擦声。楼上的灯光被门框切成一道窄线，台阶下面更暗。她先闻到旧纸、潮气和冬天衣料受冷后的味道，然后才看见男人站在桌边，手里握着一封没有封口的信。",
        "他们谁也没有马上说话。女孩一路准备好的句子在那一刻忽然显得太整齐，整齐得不像真正要说的话。男人把信放下，又拿起来，手指在封口处停了停。他像平时处理一件普通公事那样想先找一个妥当的开头，可有些话拖得太久，越想说得准确，越容易只剩下沉默。",
        "正文写到‘玛戈，其实……’以后断开。纸上能看见笔尖曾经停过，后面没有完整的句子，只有被擦掉的两个字：明早。擦痕很浅，并没有把纸磨破。仿佛写信的人并不是决定不说，而只是又一次把某件事挪到了第二天。那两个字留在纸纤维里，比真正写下的墨迹更淡，也更难完全消失。",
        "窗外的雪还没有落。街上只是冷，风从门缝里钻进来，把桌角的一张空纸吹得轻轻抬起。女孩站在门边，男人站在桌旁，他们之间不过几步路，却像各自守着一段没有寄出的文字。故事在这里停住，没有替任何人安排下一句话。因为在雪落以前，他们都还以为明早会来。"
      ]
    },
    6: {
      title: "收件人",
      paragraphs: [
        "前五页属于安娜。第六页不是。整理旧稿的人起初把它们夹在一起，只因为纸张尺寸相近、折痕也差不多。直到最后一次清点，才有人发现第六页没有装订孔。它被折成信封大小，折线很深，像曾经长久贴着某种柔软却不断活动的东西。",
        "后来那张纸从赫尔曼制服左胸的旧内衬里找到。针脚已经老化，拆开时必须一点一点挑断，免得把纸边扯碎。制服本身并不起眼，深灰布料被多年穿着磨得发亮；只有内衬里这块略厚，像有人曾经不愿把一封信放进抽屉，又没有真正把它交出去。",
        "纸的正面没有地址，没有邮资，也没有邮戳。封面只写了两个字：玛戈。字迹旁边留着很大一片空白，使那个名字看起来不像邮件上的收件人，更像一句终于被单独叫出口的称呼。它不需要经过车站、邮袋或分拣桌，真正要跨越的距离从来不在地图上。",
        "故事写到这里，再没有下一页。没有人替那封信补上投递日期，也没有人知道写信的人原本打算在什么时刻把它交出去。旧纸被重新摊平时，折痕仍旧在。人们只能确认它曾经被认真折好、贴身保存，并且有一个明确的收件人。至于一句话为什么会晚到那么多年，纸本身无法回答。"
      ]
    }
  });

  const PEOPLE = Object.freeze({
    "赫尔曼·福格尔": [
      "魏瑟堡邮政局长，在邮局任职多年。工作时话不多，遇到争执也很少抬高声音，习惯先把当天该做的事情一项项处理完。熟悉他的同事说，他并不是让人一见面就觉得亲近的人，但长期共事以后，会慢慢发现他把许多关心都藏在不动声色的日常安排里。",
      "离开柜台以后，赫尔曼的生活很简单。他偏爱硬一点的黑麦面包，茶总要放到温了才喝；冬天散步走固定的街区，遇到认识的人会摘帽致意，却很少停下来寒暄太久。家里坏掉的小东西，他通常先自己琢磨着修，修不好才肯请人帮忙。",
      "他不擅长谈感情，也不喜欢把体贴说得太郑重。别人向他道谢时，他常用一句‘顺手’把话带过去。也因此，与他亲近的人有时会觉得他可靠，有时又会觉得他把真正重要的话藏得太深。"
    ],
    "玛戈": [
      "长期生活在魏瑟堡邮局周围的年轻女性。她熟悉大厅什么时候最吵、午后什么时候最安静，也熟悉老职员们各自不同的脾气。面对陌生人时礼貌而克制，不喜欢把自己的情绪留在公共场合；真正放松下来以后，说话会比第一印象活泼得多。",
      "玛戈做事有一种近乎固执的整洁感。吃苹果时喜欢把果皮削成长长的一圈，用过的杯子会自己洗净，外套口袋里常塞着折过几次的购物单。她不喜欢含混的约定，买东西、出门、赴约都愿意先把时间说清楚。",
      "她并不是容易向别人倾诉的人。遇到难回答的问题时，常先沉默片刻，再决定要说多少；但对于朋友托付的小事又记得很牢。认识她久的人会发现，她的坚硬和温柔并不冲突，只是前者更容易被看见。"
    ],
    "玛戈·福格尔": [
      "长期生活在魏瑟堡邮局周围的年轻女性。她熟悉大厅什么时候最吵、午后什么时候最安静，也熟悉老职员们各自不同的脾气。面对陌生人时礼貌而克制，不喜欢把自己的情绪留在公共场合；真正放松下来以后，说话会比第一印象活泼得多。",
      "玛戈做事有一种近乎固执的整洁感。吃苹果时喜欢把果皮削成长长的一圈，用过的杯子会自己洗净，外套口袋里常塞着折过几次的购物单。她不喜欢含混的约定，买东西、出门、赴约都愿意先把时间说清楚。",
      "她并不是容易向别人倾诉的人。遇到难回答的问题时，常先沉默片刻，再决定要说多少；但对于朋友托付的小事又记得很牢。认识她久的人会发现，她的坚硬和温柔并不冲突，只是前者更容易被看见。"
    ],
    "利奥波德·哈斯": [
      "镇医务所的医生，行医多年。说话直接，有时甚至显得不耐烦，但对病人的实际照料比语气温和得多。给孩子听诊前会先把冰凉的听诊器在掌心焐一会儿；遇上深夜出诊，嘴上抱怨天气，最后通常还是会把围巾系好出门。",
      "哈斯的诊室不算整洁，却有他自己的秩序。窗台上养着几盆总也养不旺的植物，书页里夹着旧车票和药厂寄来的便笺。他午饭经常拖到下午，咖啡也常忘在桌角，等想起来时已经彻底凉了。",
      "熟人形容他是‘脾气先到，善意后到’。他不喜欢客套，也不擅长安慰人，但会记得病人家里有没有老人、冬天有没有足够的煤。被人夸奖时，他多半皱眉，好像那会耽误下一位病人的时间。"
    ],
    "维克托·莱茵": [
      "常年往来各地的邮票商，带着一只不算新的手提箱。因为旅行得多，他对火车时刻、廉价旅馆和各城邮局的营业时间比本地人更熟。说话不急，遇到不想谈的过去也不会编故事，只会礼貌地把话题换到别处。",
      "维克托每天早晨习惯喝不加糖的黑咖啡，坐下后会先把当天要去的地方写在小纸片上。箱里的衣物总叠得很平，邮票册按地区分开，零钱也很少混在一起。长途旅行留下的不是浪漫气质，更多是一种不愿把时间浪费在找东西上的习惯。",
      "他看上去有些疏离，却并不冷漠。旅馆侍者记得他会把读完的报纸叠好留在公共桌上，也会替不识字的旅客念站牌。只是当别人试图把这些小事说成热心时，他往往笑一下，像那不过是顺手。"
    ],
    "艾尔莎·克劳斯": [
      "邮局抄写员，长期负责登记、誊写和整理日常文书。她说话轻，听别人说话时很少打断，因此常被误认为性格软弱；真正共事久了才会知道，她对工作边界和自己的决定都很清楚，并不容易被人左右。",
      "年轻时她曾想去剧院做服装，后来生活把她留在了魏瑟堡。这个愿望并没有完全消失，她仍喜欢看橱窗里的布料和旧海报，偶尔会替同事改袖口、补纽扣。桌上总放一小盒别针，和工作无关，却经常有人来借。",
      "艾尔莎很会记人，而不是记评价。她记得谁喝茶不放糖，谁冬天总忘记手套，谁在坏消息以后反而会说很多话。她很少把这种记忆拿来议论别人；对她来说，陪一个人把话说完，往往比替对方解释更重要。"
    ],
    "安娜·韦伯": [
      "留在私人文稿与旧人口述中的女性。她喜欢把日子写得很具体：天气、菜价、窗台上的灰、牛奶煮沸前的声音，以及第二年春天想种什么。即使生活不顺，她也很少用夸张的词形容自己，更愿意记下那些还能照常进行的小事。",
      "安娜对衣物和家用东西很爱惜，旧围巾会拆线重织，玻璃罐洗净后总要留下来。她不把节俭当成苦日子的标志，反而觉得能把一件东西用久一些，是一种让生活不至于轻易散掉的办法。",
      "认识她的人记得，她笑起来很快，生气却持续不了太久。真正困扰她的事，她反而不一定马上说。私人记录里的安娜并不是一个只由某段往事构成的人，她也会盼晴天、嫌面包太硬、盘算下个月要添一双新鞋。"
    ],
    "艾达·克莱因": [
      "本案复核负责人，曾做过战地医生。她给人的第一印象通常是冷静和克制，但这种冷静并非毫无情绪，而是多年工作留下的节制。天气寒冷时右腕的旧伤会发紧，她写字便慢一些，偶尔会停下来活动手指。",
      "工作之外的艾达并不神秘。她常把咖啡放凉，出门时忘记围巾，却很少忘记给别人带回托付的东西。住处书很多，摆得并不整齐，书页之间夹着车票、药房收据和已经过期的展览票。",
      "她不喜欢别人把她形容成难以接近。只是比起说漂亮的话，她更习惯留下时间让对方自己整理情绪。朋友回忆，与艾达一起吃饭时，沉默并不会让人不自在；她能安静坐很久，也会在真正轻松的时候笑得很突然。"
    ]
  });

  function esc(value){
    return String(value ?? "").replace(/[&<>\"]/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[ch]));
  }

  function readState(){
    for(const key of SAVE_KEYS){
      try{
        const raw = localStorage.getItem(key);
        if(!raw) continue;
        const parsed = JSON.parse(raw);
        if(parsed && typeof parsed === "object") return parsed;
      }catch(_){/* try an older save */}
    }
    return {};
  }

  function injectStyles(){
    if($("interface-content-depth-style")) return;
    const style = document.createElement("style");
    style.id = "interface-content-depth-style";
    style.textContent = `
      #archive-page-copy .interface-archive-paragraph{
        margin:0 0 1.05em;
        line-height:1.92;
        text-align:justify;
        text-justify:inter-ideograph;
      }
      #archive-page-copy .interface-archive-paragraph:last-child{margin-bottom:.25em;}
      #suspect-notes details[data-always-open] > summary{
        cursor:default;
        list-style:none;
      }
      #suspect-notes details[data-always-open] > summary::-webkit-details-marker{display:none;}
      #suspect-notes .interface-profile-paragraph,
      #suspect-notes .patch-profile .interface-profile-paragraph{
        margin:.48em 0 0;
        line-height:1.78;
      }
      #suspect-notes details[data-always-open]{padding-bottom:.9rem;}
      #suspect-notes .patch-profile[data-interface-profile="v2"]{padding-bottom:.9rem;}
    `;
    document.head.appendChild(style);
  }

  function currentArchivePage(){
    const label = $("archive-page-no")?.textContent || "";
    const numeric = label.match(/([1-6])/);
    if(numeric) return Number(numeric[1]);
    const chinese = {"一":1,"二":2,"三":3,"四":4,"五":5,"六":6};
    for(const [glyph,n] of Object.entries(chinese)) if(label.includes(glyph)) return n;
    const statePage = Number(readState().archivePage || 1);
    return statePage >= 1 && statePage <= 6 ? statePage : 1;
  }

  function enrichArchivePage(){
    const n = currentArchivePage();
    const page = ARCHIVE_PAGES[n];
    const title = $("archive-page-title");
    const copy = $("archive-page-copy");
    if(!page || !title || !copy) return;

    const richChildren = [...copy.children].filter(el => el.classList.contains("interface-archive-paragraph"));
    const alreadyRich = copy.dataset.interfaceArchivePage === String(n) && richChildren.length === page.paragraphs.length;
    if(alreadyRich && title.textContent === page.title) return;

    title.textContent = page.title;
    copy.innerHTML = page.paragraphs.map(text => `<p class="interface-archive-paragraph">${esc(text)}</p>`).join("");
    copy.dataset.interfaceArchivePage = String(n);
  }

  function decorateArchiveTabs(){
    const root = $("archive-tabs");
    if(!root) return;
    const state = readState();
    const fragments = Array.isArray(state.fragments) ? state.fragments.map(Number) : [1];
    const read = Array.isArray(state.readFragments) ? state.readFragments.map(Number) : [];
    const current = currentArchivePage();

    [...root.children].forEach((btn,index) => {
      const n = index + 1;
      const unlocked = !btn.disabled || fragments.includes(n);
      const active = btn.classList.contains("active") || current === n;
      const status = !unlocked ? "缺页" : (read.includes(n) || active ? "已读" : "可读");
      const signature = `${active ? 1 : 0}|${unlocked ? 1 : 0}|${status}`;
      if(btn.dataset.folioSignature === signature && btn.querySelector(".archive-tab-state")) return;
      btn.innerHTML = `<span class="archive-tab-title">第${n}页</span><small class="archive-tab-state">${status}</small>`;
      btn.dataset.folioDecorated = "2";
      btn.dataset.folioSignature = signature;
      btn.setAttribute("aria-label", `第${n}页，${status}`);
    });
  }

  function richArchiveSearch(){
    const query = ($("archive-query")?.value || "").trim();
    const result = $("archive-result");
    if(!result) return;
    if(!query){
      result.textContent = "目录仍有几枚钉孔。";
      return;
    }

    const state = readState();
    const unlocked = new Set(Array.isArray(state.fragments) ? state.fragments.map(Number) : [1]);
    const tabs = $("archive-tabs");
    if(tabs) [...tabs.children].forEach((btn,index) => { if(!btn.disabled) unlocked.add(index + 1); });

    const hit = Object.entries(ARCHIVE_PAGES).find(([n,page]) => {
      if(!unlocked.has(Number(n))) return false;
      return (page.title + page.paragraphs.join("" )).includes(query);
    });

    if(!hit){
      result.textContent = "已解锁页面中没有找到这个词。";
      return;
    }

    const n = Number(hit[0]);
    const button = tabs?.children?.[n - 1];
    if(button && !button.disabled) button.click();
    result.textContent = `在第${n}页找到相关文字。`;
    requestAnimationFrame(() => {
      enrichArchivePage();
      decorateArchiveTabs();
    });
  }

  function replaceProfileContainer(container,name,paragraphs){
    if(!container || !paragraphs?.length) return;
    const marker = `${name}|${paragraphs.length}`;
    if(container.dataset.interfaceProfile === marker && container.querySelectorAll(".interface-profile-paragraph").length === paragraphs.length) return;

    if(container.tagName === "DETAILS"){
      const summary = container.querySelector(":scope > summary") || container.querySelector("summary");
      [...container.children].forEach(child => { if(child !== summary) child.remove(); });
      paragraphs.forEach(text => {
        const p = document.createElement("p");
        p.className = "interface-profile-paragraph";
        p.textContent = text;
        container.appendChild(p);
      });
      container.open = true;
      container.setAttribute("data-always-open","1");
    }else{
      const heading = container.querySelector("b") || container.querySelector("strong");
      [...container.children].forEach(child => {
        if(child !== heading && child.tagName !== "SMALL") child.remove();
      });
      paragraphs.forEach(text => {
        const p = document.createElement("p");
        p.className = "interface-profile-paragraph";
        p.textContent = text;
        const small = container.querySelector(":scope > small");
        if(small) container.insertBefore(p,small); else container.appendChild(p);
      });
    }
    container.dataset.interfaceProfile = marker;
  }

  function enrichPeople(){
    const root = $("suspect-notes");
    if(!root) return;

    root.querySelectorAll(":scope > details").forEach(detail => {
      const name = detail.querySelector("summary")?.textContent?.trim();
      const paragraphs = PEOPLE[name];
      if(paragraphs) replaceProfileContainer(detail,name,paragraphs);
      detail.open = true;
      detail.setAttribute("data-always-open","1");
    });

    root.querySelectorAll(".note-entry.person, .patch-profile").forEach(entry => {
      const name = entry.querySelector("b, strong")?.textContent?.trim();
      const paragraphs = PEOPLE[name];
      if(paragraphs) replaceProfileContainer(entry,name,paragraphs);
    });
  }

  function showReasoning(){
    const modal = $("reasoning-modal");
    const backdrop = $("modal-backdrop");
    const menu = $("menu-modal");
    if(!modal || !backdrop) return;
    menu?.classList.add("hidden");
    modal.classList.remove("hidden");
    backdrop.classList.remove("hidden");
    document.documentElement.classList.add("reasoning-open");
    $("reasoning-close")?.focus({preventScroll:true});
  }

  function hideReasoning(){
    const modal = $("reasoning-modal");
    if(!modal || modal.classList.contains("hidden")) return false;
    modal.classList.add("hidden");
    $("modal-backdrop")?.classList.add("hidden");
    document.documentElement.classList.remove("reasoning-open");
    $("menu-btn")?.focus({preventScroll:true});
    return true;
  }

  let archiveScheduled = false;
  function scheduleArchiveRefresh(){
    if(archiveScheduled) return;
    archiveScheduled = true;
    requestAnimationFrame(() => {
      archiveScheduled = false;
      decorateArchiveTabs();
      enrichArchivePage();
    });
  }

  let peopleScheduled = false;
  function schedulePeopleRefresh(){
    if(peopleScheduled) return;
    peopleScheduled = true;
    requestAnimationFrame(() => {
      peopleScheduled = false;
      enrichPeople();
    });
  }

  function initObservers(){
    const archiveTabs = $("archive-tabs");
    if(archiveTabs){
      new MutationObserver(scheduleArchiveRefresh)
        .observe(archiveTabs,{childList:true,subtree:false,attributes:true,attributeFilter:["class","disabled"]});
    }

    const pageNo = $("archive-page-no");
    if(pageNo){
      new MutationObserver(scheduleArchiveRefresh)
        .observe(pageNo,{childList:true,subtree:true,characterData:true});
    }

    const archiveCopy = $("archive-page-copy");
    if(archiveCopy){
      new MutationObserver(scheduleArchiveRefresh)
        .observe(archiveCopy,{childList:true,subtree:false});
    }

    const people = $("suspect-notes");
    if(people){
      new MutationObserver(schedulePeopleRefresh)
        .observe(people,{childList:true,subtree:true});
    }
  }

  function installArchiveSearch(){
    const form = $("archive-search");
    if(!form) return;
    form.onsubmit = e => {
      e.preventDefault();
      richArchiveSearch();
    };
  }

  document.addEventListener("click", e => {
    if(e.target.closest("#archive-btn")) requestAnimationFrame(() => requestAnimationFrame(scheduleArchiveRefresh));
    if(e.target.closest("#archive-tabs > button")) requestAnimationFrame(() => requestAnimationFrame(scheduleArchiveRefresh));
    if(e.target.closest("#notebook-btn")) requestAnimationFrame(() => requestAnimationFrame(schedulePeopleRefresh));

    if(e.target.closest("#open-reasoning-board")){
      e.preventDefault();
      showReasoning();
      return;
    }
    if(e.target.closest("#reasoning-close")){
      e.preventDefault();
      hideReasoning();
      return;
    }

    const summary = e.target.closest("#suspect-notes details[data-always-open] > summary");
    if(summary){
      e.preventDefault();
      summary.parentElement.open = true;
    }
  }, true);

  document.addEventListener("click", e => {
    if(e.target === $("modal-backdrop") && !$("reasoning-modal")?.classList.contains("hidden")){
      e.preventDefault();
      e.stopImmediatePropagation();
      hideReasoning();
    }
  }, true);

  document.addEventListener("keydown", e => {
    if(e.key === "Escape" && !$("reasoning-modal")?.classList.contains("hidden")){
      e.preventDefault();
      e.stopImmediatePropagation();
      hideReasoning();
    }
  }, true);

  window.addEventListener("storage", e => {
    if(SAVE_KEYS.includes(e.key)) scheduleArchiveRefresh();
  });

  injectStyles();
  installArchiveSearch();
  initObservers();
  decorateArchiveTabs();
  enrichArchivePage();
  enrichPeople();
  document.documentElement.dataset.interfacePolish = "v3";
})();
