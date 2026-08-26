(() => {
  "use strict";

  const PATCH_VERSION = "2026-08-26-literature-3";
  const $ = (id) => document.getElementById(id);

  const stories = {
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

  function renderPatchedStory(key, page = 0) {
    const story = stories[key];
    if (!story) return false;
    const home = $("portal-home-view");
    const reading = $("portal-reading");
    if (!home || !reading) return false;
    currentStory = key;
    currentPage = Math.max(0, Math.min(page, story.pages.length - 1));
    home.classList.add("hidden");
    reading.classList.add("open");
    $("portal-reading-kicker").textContent = story.kicker;
    $("portal-reading-title").textContent = story.title;
    $("portal-reading-meta").textContent = story.meta;
    $("portal-reading-copy").innerHTML = pageMarkup(story, currentPage);
    $("portal-breadcrumb").textContent = `当前位置：烛影侦探社 › 夜读文库 › ${story.title}`;
    reading.scrollIntoView({ block: "start" });
    return true;
  }

  function injectStyles() {
    const style = document.createElement("style");
    style.id = "literature-patch-style";
    style.textContent = `
      .literary-reader{max-width:760px;margin:0 auto}.literary-page{min-height:34rem;padding:1.4rem 1.1rem 1.8rem;border-top:1px solid rgba(76,58,36,.18);border-bottom:1px solid rgba(76,58,36,.18);background:linear-gradient(90deg,rgba(95,70,37,.025),transparent 14%,transparent 86%,rgba(95,70,37,.025));box-shadow:inset 0 0 38px rgba(82,57,29,.025)}
      .literary-page p{margin:0 0 1.35em;line-height:2.05;text-align:justify;text-justify:inter-ideograph;letter-spacing:.02em}.literary-page p:first-child:first-letter{font-size:2.15em;line-height:.9;float:left;margin:.12em .12em 0 0;font-family:serif;color:#6d4b32}.portal-poem p{line-height:2.22;margin-bottom:1.55em}.portal-pullquote{margin:2rem 0 1rem!important;padding:1rem 1.25rem;border-left:3px solid #8a6543;font-size:1.05em}
      .literary-pagination{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:1rem .2rem .2rem;color:#756a5c;font-size:.86rem}.literary-page-btn{border:1px solid #9b8c77;background:#eee6d7;color:#332b24;padding:.55rem .9rem;cursor:pointer}.literary-page-btn:hover:not(:disabled){background:#e2d5c0}.literary-page-btn:disabled{opacity:.35;cursor:default}
      .portal-thread.patch-thread{border-left:2px solid rgba(126,83,50,.45)}.portal-thread.patch-thread .thread-tag{background:#ddd0ba}.portal-library .patch-library-link{display:block;margin:.42rem 0}
      .note-entry.person p{line-height:1.8}.note-entry.person b{letter-spacing:.03em}.note-entry.person.minor{opacity:.92}
      @media(max-width:760px){.literary-page{min-height:0;padding:1rem .2rem 1.2rem}.literary-page p{line-height:1.9;text-align:left}.literary-pagination{position:sticky;bottom:0;background:rgba(238,230,215,.96);padding:.75rem .3rem}.literary-page-btn{min-height:42px}}
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

  function plainText(html) {
    const div = document.createElement("div");
    div.innerHTML = html;
    return (div.textContent || "").replace(/\s+/g, " ").trim();
  }

  function storySearchBlob(story) {
    return [story.title, story.kicker, story.meta]
      .concat(story.pages.map(page => plainText(page)))
      .join(" ")
      .toLowerCase();
  }

  document.addEventListener("submit", (e) => {
    if (e.target?.id !== "portal-search") return;
    const input = $("portal-search-input") || e.target.querySelector("input");
    const query = (input?.value || "").trim().toLowerCase();
    if (!query) return;
    const matches = Object.entries(stories).filter(([, story]) => storySearchBlob(story).includes(query));
    if (!matches.length) return;
    // 不替换原站检索结果；等原游戏完成搜索后，把新增/扩写文库的命中补到结果末尾。
    setTimeout(() => {
      const copy = $("portal-reading-copy");
      const meta = $("portal-reading-meta");
      if (!copy || !$("portal-reading")?.classList.contains("open")) return;
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
      const next = currentPage + Number(pageBtn.dataset.litDir || 0);
      renderPatchedStory(currentStory, next);
      return;
    }
    if (e.target.closest("#notebook-btn")) {
      setTimeout(enrichNotebookAfterOriginal, 0);
    }
  }, true);

  window.addEventListener("pageshow", guaranteeAgencyLanding);

  function init() {
    if ($("literature-patch-style")) return;
    injectStyles();
    addThreads();
    guaranteeAgencyLanding();
    document.documentElement.dataset.literaturePatch = PATCH_VERSION;
  }

  init();
})();
