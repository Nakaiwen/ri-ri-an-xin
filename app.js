/* =========================================================
   日日安心 — app.js
   純前端、localStorage 儲存、不發送任何網路請求
   ========================================================= */

(function () {
  'use strict';

  // ============================================================
  // 一、資料
  // ============================================================

  // --- 時段問候（V1.1: 使用 {name} placeholder） ---
  const GREETINGS = [
    {
      from: 5, to: 11,
      time: '今 · 日 · 早 · 安',
      hello: '{name}，早安',
      words: '今天也平平安安。\n先喝一點水，慢慢開始美好的一天。'
    },
    {
      from: 11, to: 17,
      time: '今 · 日 · 午 · 安',
      hello: '{name}，午安',
      words: '今天過得還好嗎？\n記得吃飯，也記得讓自己休息一下。'
    },
    {
      from: 17, to: 22,
      time: '今 · 日 · 晚 · 安',
      hello: '{name}，晚上好',
      words: '今天辛苦了。\n可以慢慢放鬆，讓身體安穩下來。'
    },
    {
      from: 22, to: 29, // 22-24
      time: '該 · 休 · 息 · 囉',
      hello: '夜晚到了',
      words: '今天就快圓滿結束了。\n可以慢慢準備休息，深呼吸放鬆自己。'
    },
    {
      from: 0, to: 5,
      time: '夜 · 已 · 深',
      hello: '夜深了',
      words: '如果還沒睡，也不用急。\n深呼吸放鬆自己，慢慢入睡。'
    }
  ];

  // --- 今日祝福 ---
  const BLESSINGS = [
    '今天只要平安，就是很好的一天。',
    '慢慢來也很好，不用急。',
    '願你心裡安穩，身體舒服。',
    '有人惦記著你，今天也不孤單。',
    '小小的一步，也是照顧自己的開始。',
    '日日是好日，慢慢過也很好。',
    '心放寬一點，日子也會舒服一點。',
    '今天這樣，就很好。'
  ];

  // --- 成語補字題庫（V1.8.4: 擴充到 20 題）---
  const IDIOM_QUESTIONS = [
    { question: '家和萬事＿', options: ['興', '平', '安'], answer: '興', blessing: '願今天家裡也平平安安。' },
    { question: '知足常＿', options: ['樂', '走', '忙'], answer: '樂', blessing: '知足常樂，簡單的日子也有福氣。' },
    { question: '平安就是＿', options: ['福', '急', '吵'], answer: '福', blessing: '平安就是福，今天安穩就很好。' },
    { question: '心寬體＿', options: ['胖', '健', '忙'], answer: '胖', blessing: '心放寬一點，日子也會舒服一點。' },
    { question: '日日是＿日', options: ['好', '忙', '難'], answer: '好', blessing: '日日是好日，慢慢過也很好。' },
    { question: '老當益＿', options: ['壯', '小', '靜'], answer: '壯', blessing: '老當益壯，今天也是好好的一天。' },
    { question: '兒孫自有兒孫＿', options: ['福', '事', '苦'], answer: '福', blessing: '不用太擔心，兒孫自有兒孫福。' },
    { question: '萬事如＿', options: ['意', '舊', '常'], answer: '意', blessing: '願你萬事如意。' },
    { question: '福如東＿', options: ['海', '山', '風'], answer: '海', blessing: '福如東海，願福氣天天來。' },
    { question: '壽比南＿', options: ['山', '水', '花'], answer: '山', blessing: '壽比南山，祝你身體健康。' },
    { question: '步步高＿', options: ['升', '跑', '忙'], answer: '升', blessing: '步步高升，日子一天比一天好。' },
    { question: '心想事＿', options: ['成', '多', '遠'], answer: '成', blessing: '心想事成，願你的願望慢慢實現。' },
    { question: '吉祥如＿', options: ['意', '雲', '春'], answer: '意', blessing: '吉祥如意，願今天有好心情。' },
    { question: '一帆風＿', options: ['順', '雨', '亮'], answer: '順', blessing: '一帆風順，做什麼都順順利利。' },
    { question: '花開富＿', options: ['貴', '忙', '久'], answer: '貴', blessing: '花開富貴，願生活越來越美。' },
    { question: '身體健＿', options: ['康', '忙', '寒'], answer: '康', blessing: '身體健康，就是最大的福氣。' },
    { question: '出入平＿', options: ['安', '快', '多'], answer: '安', blessing: '出入平安，願你每天都安心。' },
    { question: '笑口常＿', options: ['開', '跑', '等'], answer: '開', blessing: '笑口常開，好運自然來。' },
    { question: '年年有＿', options: ['餘', '雨', '事'], answer: '餘', blessing: '年年有餘，願生活豐足又安心。' },
    { question: '和氣生＿', options: ['財', '風', '火'], answer: '財', blessing: '和氣生財，願人和事順、福氣滿滿。' }
  ];

  // --- 謎語題庫（V1.8.5: 擴充到 20 題）---
  const RIDDLE_QUESTIONS = [
    {
      question: '身穿綠衣裳，肚裡水汪汪，\n生的子兒多，個個黑臉膛。',
      options: ['西瓜', '蘋果', '花生'],
      answer: '西瓜',
      blessing: '夏天吃一口西瓜，心裡也涼快一點。'
    },
    {
      question: '小小一間房，有門沒有窗，\n出門要帶它，開門靠它忙。',
      options: ['鑰匙', '茶杯', '拖鞋'],
      answer: '鑰匙',
      blessing: '小小鑰匙，也守著一個安心的家。'
    },
    {
      question: '白白胖胖一身香，\n早餐桌上常常見。',
      options: ['饅頭', '雨傘', '毛巾'],
      answer: '饅頭',
      blessing: '簡單吃一口，也是一天的開始。'
    },
    {
      question: '一個小娃娃，全身毛茸茸，\n人見人想抱，會喵不會說。',
      options: ['貓咪', '兔子', '小鳥'],
      answer: '貓咪',
      blessing: '家裡如果有小動物，今天也記得摸摸牠。'
    },
    {
      question: '頭戴小紅帽，身穿白衣裳，\n會走不用腳，會說沒嘴巴。',
      options: ['時鐘', '電燈', '電視'],
      answer: '時鐘',
      blessing: '時間慢慢走，今天也慢慢過就好。'
    },
    {
      question: '圓圓一張臉，掛在牆上看，\n白天晚上都陪伴，提醒時間不偷懶。',
      options: ['時鐘', '鏡子', '盤子'],
      answer: '時鐘',
      blessing: '看看時間，也別忘了讓自己休息一下。'
    },
    {
      question: '身體方方正正，肚裡裝故事，\n翻開一頁頁，越看越有味。',
      options: ['書本', '枕頭', '鞋子'],
      answer: '書本',
      blessing: '讀一點書，心也會慢慢安靜下來。'
    },
    {
      question: '一把小傘花，雨天才開花，\n遮住頭和肩，陪你平安回家。',
      options: ['雨傘', '扇子', '竹籃'],
      answer: '雨傘',
      blessing: '下雨天有傘，心裡也多一份安心。'
    },
    {
      question: '圓圓小臉紅又甜，\n咬一口，香滿嘴邊。',
      options: ['蘋果', '洋蔥', '石頭'],
      answer: '蘋果',
      blessing: '吃點水果，願你今天精神好。'
    },
    {
      question: '身穿黃衣裳，彎彎像月亮，\n剝開吃一口，香甜又軟香。',
      options: ['香蕉', '黃瓜', '毛巾'],
      answer: '香蕉',
      blessing: '甜甜香蕉，願今天也有甜甜心情。'
    },
    {
      question: '一根小木棒，頭上火光亮，\n點亮黑夜裡，暖暖一小方。',
      options: ['火柴', '鉛筆', '湯匙'],
      answer: '火柴',
      blessing: '小小光亮，也能帶來溫暖。'
    },
    {
      question: '肚子胖胖會裝水，嘴巴小小倒出來，\n泡茶煮水少不了。',
      options: ['茶壺', '皮包', '帽子'],
      answer: '茶壺',
      blessing: '喝杯熱茶，願你身心都暖暖的。'
    },
    {
      question: '兩片小船腳下穿，\n走路出門它在前。',
      options: ['鞋子', '手套', '碗筷'],
      answer: '鞋子',
      blessing: '穿好鞋慢慢走，平安最重要。'
    },
    {
      question: '一面亮晶晶，照出你的臉，\n早晚看一看，笑容在眼前。',
      options: ['鏡子', '碗', '棉被'],
      answer: '鏡子',
      blessing: '照照鏡子，也送自己一個微笑。'
    },
    {
      question: '身體軟綿綿，晚上抱著眠，\n天冷蓋身上，暖到心裡邊。',
      options: ['棉被', '扇子', '桌子'],
      answer: '棉被',
      blessing: '睡得暖、睡得好，明天精神更好。'
    },
    {
      question: '小小白衣人，刷牙時來幫忙，\n擠一點入口中，清清爽爽香。',
      options: ['牙膏', '米飯', '膠水'],
      answer: '牙膏',
      blessing: '牙齒清爽，笑起來也更自在。'
    },
    {
      question: '圓圓一個口，天天裝飯菜，\n吃飽有精神，身體更自在。',
      options: ['碗', '帽子', '鐘'],
      answer: '碗',
      blessing: '好好吃飯，就是照顧自己的福氣。'
    },
    {
      question: '長長一條線，會把衣服串，\n風吹太陽曬，衣服慢慢乾。',
      options: ['曬衣繩', '筷子', '雨鞋'],
      answer: '曬衣繩',
      blessing: '曬乾衣服，也曬一曬好心情。'
    },
    {
      question: '小小一張紙，寫滿好消息，\n貼在冰箱上，提醒別忘記。',
      options: ['便條紙', '手帕', '牙刷'],
      answer: '便條紙',
      blessing: '記下小事，生活也會更從容。'
    },
    {
      question: '冷冷一個大箱子，水果飯菜住裡頭，\n打開門兒看一看，新鮮味道都保留。',
      options: ['冰箱', '電扇', '書櫃'],
      answer: '冰箱',
      blessing: '飯菜新鮮，日子也踏實安心。'
    }
  ];

  // --- 記憶遊戲題庫 ---
  const MEMORY_SETS = [
    {
      items: ['茶杯', '鑰匙', '蘋果'],
      question: '剛剛看到哪一個？',
      options: ['茶杯', '雨傘', '鉛筆'],
      answer: '茶杯'
    },
    {
      items: ['菊花', '毛巾', '香蕉'],
      question: '剛剛看到哪一個？',
      options: ['拖鞋', '香蕉', '電鍋'],
      answer: '香蕉'
    },
    {
      items: ['佛珠', '飯碗', '雨傘'],
      question: '剛剛看到哪一個？',
      options: ['雨傘', '西瓜', '報紙'],
      answer: '雨傘'
    },
    {
      items: ['老花鏡', '蒲扇', '茶壺'],
      question: '剛剛看到哪一個？',
      options: ['茶壺', '電話', '蘋果'],
      answer: '茶壺'
    },
    // V1.8.6: 擴充記憶遊戲
    {
      items: ['牙刷', '毛巾', '肥皂'],
      question: '剛剛看到哪一個？',
      options: ['毛巾', '湯匙', '雨傘'],
      answer: '毛巾'
    },
    {
      items: ['鑰匙', '錢包', '口罩'],
      question: '剛剛看到哪一個？',
      options: ['鑰匙', '報紙', '碗'],
      answer: '鑰匙'
    },
    {
      items: ['湯匙', '碗', '電鍋'],
      question: '剛剛看到哪一個？',
      options: ['電鍋', '時鐘', '抱枕'],
      answer: '電鍋'
    },
    {
      items: ['遙控器', '抱枕', '茶杯'],
      question: '剛剛看到哪一個？',
      options: ['抱枕', '剪刀', '電鍋'],
      answer: '抱枕'
    },
    {
      items: ['鉛筆', '便條紙', '眼鏡'],
      question: '剛剛看到哪一個？',
      options: ['便條紙', '茶葉', '拖鞋'],
      answer: '便條紙'
    },
    {
      items: ['梨子', '橘子', '葡萄'],
      question: '剛剛看到哪一個？',
      options: ['橘子', '麵包', '茶杯'],
      answer: '橘子'
    },
    {
      items: ['手帕', '小扇子', '茶杯'],
      question: '剛剛看到哪一個？',
      options: ['手帕', '電鍋', '雨鞋'],
      answer: '手帕'
    },
    {
      items: ['毛線', '針線', '剪刀'],
      question: '剛剛看到哪一個？',
      options: ['剪刀', '時鐘', '蘋果'],
      answer: '剪刀'
    }
  ];

  // --- 生活小行動 ---
  const LIFE_ACTIONS = [
    { emoji: '🪟', title: '看看窗外的天空', description: '走到窗邊，看一眼今天的天色。不用急，看看就好。', doneText: '我看了' },
    { emoji: '🍵', title: '喝幾口溫水', description: '現在可以喝幾口水，讓身體舒服一點。', doneText: '我喝了' },
    { emoji: '🤲', title: '摸摸家裡的一樣東西', description: '找一樣讓你覺得安心的東西，摸一摸、看一看。', doneText: '我找到了' },
    { emoji: '🧺', title: '整理桌上一個小角落', description: '不用整理全部，只要一個小地方就很好。', doneText: '我整理了' },
    { emoji: '🙆', title: '站起來伸展一下', description: '手慢慢舉高，肩膀放鬆，身體舒服最重要。', doneText: '我動了' },
    { emoji: '🌿', title: '看看家裡的植物', description: '如果家裡有植物，可以看看它今天的樣子。', doneText: '我看了' },
    { emoji: '🎵', title: '哼一句熟悉的歌', description: '想到哪一句就哼哪一句，不用唱完整首。', doneText: '我哼了' },
    { emoji: '📷', title: '看一張喜歡的老照片', description: '相簿裡或牆上，找一張會讓你笑的照片。', doneText: '我看了' }
  ];

  // --- 想一想題庫（V1.1: 加入 defaultCategory） ---
  const STORY_PROMPTS = [
    { text: '以前過年時，家裡最常準備哪一道菜？', defaultCategory: '過年過節' },
    { text: '年輕時最喜歡去哪裡走走？', defaultCategory: '年輕時' },
    { text: '以前家裡有沒有讓你印象很深的一件事？', defaultCategory: '家人故事' },
    { text: '你小時候最喜歡吃什麼？', defaultCategory: '小時候' },
    { text: '有沒有一句話，是你覺得很受用的？', defaultCategory: '人生智慧' },
    { text: '以前照顧家人時，最常做的一件事是什麼？', defaultCategory: '家人故事' },
    { text: '你記得哪一次全家一起出門的回憶？', defaultCategory: '家人故事' },
    { text: '今天有沒有想到一個老朋友？', defaultCategory: '老朋友' },
    { text: '以前市場裡，你最常買什麼？', defaultCategory: '家常菜' },
    { text: '有沒有一道菜，是你很拿手的？', defaultCategory: '家常菜' },
    { text: '記憶裡，哪一個季節最讓你想念？', defaultCategory: '年輕時' },
    { text: '小時候，家門口外面是什麼樣子？', defaultCategory: '小時候' },
    { text: '有沒有一首歌、一句經文，會讓你心裡安定？', defaultCategory: '信仰平安' },
    { text: '長輩有沒有教過你什麼，到現在你還記得？', defaultCategory: '人生智慧' },
    // V1.8.6: 擴充想一想題目
    // 家常菜
    { text: '哪一道家常菜，是聞到味道就會想起家裡的？', defaultCategory: '家常菜' },
    { text: '家裡誰最會煮飯？他最拿手的是什麼？', defaultCategory: '家常菜' },
    // 年輕時
    { text: '年輕時，有沒有一段很特別的旅程？', defaultCategory: '年輕時' },
    { text: '年輕時是什麼樣子的個性？跟現在一樣嗎？', defaultCategory: '年輕時' },
    // 過年過節
    { text: '小時候過年，最期待的是什麼？', defaultCategory: '過年過節' },
    { text: '中秋節在你的記憶裡，是什麼樣子？', defaultCategory: '過年過節' },
    { text: '以前過節時，家裡會做什麼特別的事？', defaultCategory: '過年過節' },
    // 小時候
    { text: '小時候最常和誰一起玩？玩些什麼？', defaultCategory: '小時候' },
    { text: '小時候上學的路上，有什麼印象深的事？', defaultCategory: '小時候' },
    // 家人故事
    { text: '家裡的爺爺奶奶或外公外婆，你還記得他們的樣子嗎？', defaultCategory: '家人故事' },
    // 人生智慧
    { text: '經歷過這麼多事，你覺得最珍貴的是什麼？', defaultCategory: '人生智慧' },
    { text: '想對年輕時候的自己說什麼？', defaultCategory: '人生智慧' },
    // 老朋友
    { text: '有沒有一個朋友，是你想再見到一次的？', defaultCategory: '老朋友' },
    { text: '年輕時，最常跟朋友一起做什麼？', defaultCategory: '老朋友' },
    // 信仰平安
    { text: '心裡不平靜的時候，你會怎麼讓自己安定下來？', defaultCategory: '信仰平安' }
  ];

  // --- 故事主題 ---
  const STORY_CATEGORIES = [
    '家常菜', '年輕時', '過年過節', '小時候',
    '家人故事', '人生智慧', '老朋友', '信仰平安'
  ];

  // --- 心情選項 ---
  const MOOD_OPTIONS = [
    { type: 'good',      emoji: '🌞', label: '很好',     response: '聽到你說很好，今天也跟著明朗一點。' },
    { type: 'okay',      emoji: '🌿', label: '還可以',   response: '還可以也很好，平平的日子最珍貴。' },
    { type: 'tired',     emoji: '🍵', label: '有點累',   response: '累了就慢一點，今天不用做太多。\n喝口溫水，先讓自己舒服一下。' },
    { type: 'down',      emoji: '☁️', label: '有點悶',   response: '悶悶的時候，先深呼吸幾下。\n心裡的事不用一次想完，慢慢來就好。' },
    { type: 'sleepless', emoji: '🌙', label: '睡不好',   response: '沒睡好身體會比較沉，今天讓自己輕鬆一些。\n累了隨時躺一下，不用撐。' },
    { type: 'lonely',    emoji: '💬', label: '想聊天',   response: '想說話的時候，可以打給家人，\n或到「說一句」，選一句傳給他們。' }
  ];

  const MOOD_BY_TYPE = MOOD_OPTIONS.reduce(function (a, m) { a[m.type] = m; return a; }, {});

  // --- 找一找 題目 ---
  const FIND_PROMPTS = [
    '在屋子裡找一個紅色的東西',
    '找一樣讓你覺得安心的東西',
    '看看窗外有沒有樹或植物',
    '找一樣以前用了很久的東西',
    '找一張你喜歡的照片',
    '找一個圓圓的東西',
    '找一樣家人送過你的東西',
    '看看牆上掛了什麼',
    '找一樣會發出聲音的東西',
    '找一樣有香味的東西',
    '找一個你最常坐的位子',
    '找一樣是別人手做的東西'
  ];

  // --- 稱呼預設 ---
  const NAME_PRESETS = ['媽媽', '爸爸', '阿嬤', '阿公'];
  const DEFAULT_NAME = '媽媽';

  // --- V1.2 訪客資料 ---
  // 每位訪客都帶一個 fallbackEmoji，當圖片載入失敗時顯示
  const VISITORS = [
    {
      id: 'kiwi',
      name: '奇異鳥',
      image: 'images/visitors/kiwi.jpg',
      imageBase: 'images/visitors/kiwi',
      fallbackEmoji: '🥝',
      title: '今天有一隻正前往紐西蘭的奇異鳥經過您家。',
      greeting: '我走得不快，但我知道慢慢走也會到。今天您也可以慢慢來。',
      invitation: '今天要不要慢慢走到窗邊，看一眼外面的天色？',
      tag: '慢慢來'
    },
    {
      id: 'turtle',
      name: '海龜',
      image: 'images/visitors/turtle.jpg',
      imageBase: 'images/visitors/turtle',
      fallbackEmoji: '🐢',
      title: '今天有一隻剛游過遠方海面的海龜經過您家。',
      greeting: '海浪一波一波慢慢來，日子也可以慢慢過。願您今天心裡安穩。',
      invitation: '今天可以喝幾口水，像海浪一樣慢慢照顧自己。',
      tag: '安穩'
    },
    {
      id: 'sparrow',
      name: '麻雀',
      image: 'images/visitors/sparrow.jpg',
      imageBase: 'images/visitors/sparrow',
      fallbackEmoji: '🐦',
      title: '今天有一隻停在屋簷邊的麻雀來向您問好。',
      greeting: '我在早晨的風裡停了一下，想跟您說：今天也有小小的好事在等著您。',
      invitation: '今天要不要聽聽窗外的聲音，看看生活裡的小熱鬧？',
      tag: '小小喜悅'
    },
    {
      id: 'butterfly',
      name: '蝴蝶',
      image: 'images/visitors/butterfly.jpg',
      imageBase: 'images/visitors/butterfly',
      fallbackEmoji: '🦋',
      title: '今天有一隻從花園飛來的蝴蝶經過您身邊。',
      greeting: '我帶來一點花香和微風。願您今天看見一點漂亮的事。',
      invitation: '今天可以找一樣家裡讓您覺得漂亮的東西，慢慢看一看。',
      tag: '看見美好'
    },
    {
      id: 'owl_nordic',
      name: '貓頭鷹',
      image: 'images/visitors/owl_nordic.jpg',
      imageBase: 'images/visitors/owl_nordic',
      fallbackEmoji: '🦉',
      title: '今天有一隻從北歐森林夜色中飛來的貓頭鷹經過您家。',
      greeting: '夜晚很安靜，我想把一點安穩留給您。今天不需要急，靜靜地過也很好。',
      invitation: '今晚可以坐下來休息一下，聽聽安靜的聲音，讓心慢慢安穩下來。',
      tag: '夜晚陪伴'
    },
    {
      id: 'cat_traveler',
      name: '貓咪旅人',
      image: 'images/visitors/cat_traveler.jpg',
      imageBase: 'images/visitors/cat_traveler',
      fallbackEmoji: '🐱',
      title: '今天有一隻曬過太陽的貓咪旅人經過您家。',
      greeting: '我剛剛在陽光下瞇了一下眼睛。想提醒您，舒服地休息一下也很好。',
      invitation: '今天要不要找個舒服的位置坐一會兒，讓身體放鬆一下？',
      tag: '放鬆',
      isTraveler: true,
      scenes: [
        {
          id: 'sea',
          imageBase: 'images/visitors/cat_traveler_sea',
          title: '今天有一隻在海邊看潮水的貓咪旅人經過您家。',
          greeting: '我剛剛在沙灘上坐了好一會兒，看浪一波一波打過來。想跟您說，日子也可以像海浪這樣，一波接著一波，慢慢來。',
          invitation: '今天可以喝口水，深呼吸一下，想像自己也在海邊。',
          tag: '海邊歇腳'
        },
        {
          id: 'bookstore',
          imageBase: 'images/visitors/cat_traveler_bookstore',
          title: '今天有一隻在書店翻書的貓咪旅人經過您家。',
          greeting: '我剛剛在書店裡找了一本喜歡的書，安安靜靜翻了幾頁。想跟您說，靜下心來讀一點點東西，心也會跟著安穩。',
          invitation: '今天可以看看手邊的書、報紙，或翻翻一張老照片。',
          tag: '書店午後'
        },
        {
          id: 'tea',
          imageBase: 'images/visitors/cat_traveler_tea',
          title: '今天有一隻在茶屋歇腳的貓咪旅人經過您家。',
          greeting: '我剛剛在茶屋喝了一杯熱熱的茶，茶香慢慢散開來。想跟您說，泡一杯茶、給自己一點點時間，是很好的事。',
          invitation: '今天可以泡一杯喜歡的茶，慢慢喝，不用急。',
          tag: '茶屋時光'
        }
      ]
    },
    {
      id: 'penguin',
      name: '企鵝',
      image: 'images/visitors/penguin.jpg',
      imageBase: 'images/visitors/penguin',
      fallbackEmoji: '🐧',
      title: '今天有一隻從遠方冰海來的企鵝經過您身邊。',
      greeting: '我走路有點搖搖晃晃，但有同伴就不孤單。今天也有人惦記著您。',
      invitation: '今天可以傳一句平安給家人，讓彼此都安心一點。',
      tag: '不孤單'
    },
    {
      id: 'deer',
      name: '小鹿',
      image: 'images/visitors/deer.jpg',
      imageBase: 'images/visitors/deer',
      fallbackEmoji: '🦌',
      title: '今天有一隻從森林裡慢慢走來的小鹿經過您家。',
      greeting: '森林裡的路很安靜，我慢慢走來，只想跟您說一聲：願您今天平安。',
      invitation: '今天可以慢慢走幾步，或到窗邊看看外面的綠意。',
      tag: '溫柔'
    },
    {
      id: 'duck',
      name: '鴨子',
      image: 'images/visitors/duck.jpg',
      imageBase: 'images/visitors/duck',
      fallbackEmoji: '🦆',
      title: '今天有一隻從湖邊搖搖擺擺走來的鴨子經過您家。',
      greeting: '我一路晃呀晃地走來，想跟您說：今天不用急，慢慢過也很好。就算只是輕輕鬆鬆地過一天，也很值得。',
      invitation: '今天可以慢慢走幾步，或看看窗外，讓心情像水面一樣放鬆一點。',
      tag: '輕鬆一下'
    },
    {
      id: 'panda',
      name: '熊貓',
      image: 'images/visitors/panda.jpg',
      imageBase: 'images/visitors/panda',
      fallbackEmoji: '🐼',
      title: '今天有一隻從山林裡慢慢散步來的熊貓經過您家。',
      greeting: '我今天走得不快，也坐下來休息了一會兒。想跟您說，照顧自己、慢慢休息，也是一件很好的事。',
      invitation: '今天要不要找個舒服的位置坐一下，喝幾口水，讓自己輕鬆一點？',
      tag: '休息一下'
    },
    {
      id: 'pigeon_postman',
      name: '鴿子郵差',
      image: 'images/visitors/pigeon_postman.jpg',
      imageBase: 'images/visitors/pigeon_postman',
      fallbackEmoji: '🕊️',
      title: '今天有一隻裝扮成郵差的鴿子，在送信途中經過您家。',
      greeting: '我今天一路飛呀飛、送了好多封信，經過這裡時，也想順便送您一份問候。願您今天平平安安，心裡暖暖的。',
      invitation: '今天可以看看窗外，或留一句話給想念的人，讓心情像收到信一樣輕輕亮起來。',
      tag: '捎來問候',
      isTraveler: true
    },
    {
      id: 'tuxedo_cat_ny',
      name: '紐約賓士貓',
      image: 'images/visitors/tuxedo_cat_ny.jpg',
      imageBase: 'images/visitors/tuxedo_cat_ny',
      fallbackEmoji: '🐈',
      title: '今天有一隻從紐約旅行來的賓士貓，背著背包，俏皮地經過您家。',
      greeting: '我從熱鬧的城市一路旅行過來，想在這裡停一下，向您打個招呼。今天就算只是一點點好心情，也很值得珍惜。',
      invitation: '今天可以做一件讓自己開心的小事，像喝口茶、看看窗外，或想一個讓你微笑的人。',
      tag: '俏皮問好',
      isTraveler: true,
      scenes: [
        {
          id: 'paris',
          imageBase: 'images/visitors/tuxedo_cat_ny_paris',
          title: '今天有一隻從紐約跑到巴黎玩的賓士貓，背著小背包經過您家。',
          greeting: '我從紐約一路走到了巴黎的街角，看見櫥窗裡有花，也聞到麵包香。想跟您說，多走幾個地方，心也會慢慢變大。',
          invitation: '今天可以想一個你還沒去過、但有點好奇的地方。',
          tag: '巴黎街角'
        },
        {
          id: 'greece',
          imageBase: 'images/visitors/tuxedo_cat_ny_greece',
          title: '今天有一隻跑到希臘小島的賓士貓，在白色房子前經過您家。',
          greeting: '我從紐約跑到了希臘，這裡的天空和海都是藍藍的。想跟您說，世界真的很大，您也很值得這份遼闊。',
          invitation: '今天可以看一張藍藍的照片，讓眼睛也休息一下。',
          tag: '希臘小島'
        },
        {
          id: 'station',
          imageBase: 'images/visitors/tuxedo_cat_ny_station',
          title: '今天有一隻在車站等車的賓士貓，俏皮地經過您家。',
          greeting: '我剛剛在車站等了一班車，看著來來往往的人，發現每個人都有自己的故事。想跟您說，每一段旅程，都會慢慢到達目的地。',
          invitation: '今天可以慢慢做手邊的事，不用急。',
          tag: '車站等車'
        }
      ]
    },
    {
      id: 'shiba_brothers_kyoto',
      name: '柴犬兄弟',
      image: 'images/visitors/shiba_brothers_kyoto.jpg',
      imageBase: 'images/visitors/shiba_brothers_kyoto',
      fallbackEmoji: '🐕',
      title: '今天有一對從日本京都旅行來的柴犬兄弟，經過您家來向您問好。',
      greeting: '我們從京都的街道一路散步過來，經過這裡時，想一起向您說一聲平安。今天慢慢地過，也是一種很好的旅行節奏。',
      invitation: '今天可以慢慢走幾步，看看身邊的小風景，或想想一件讓你覺得安心的小事。',
      tag: '一起來問好',
      isTraveler: true
    },
    {
      id: 'french_marmot',
      name: '法國土撥鼠',
      image: 'images/visitors/french_marmot.jpg',
      imageBase: 'images/visitors/french_marmot',
      fallbackEmoji: '🐹',
      title: '今天有一隻從法國旅行來的土撥鼠，探出頭來經過您家。',
      greeting: '我從法國的山坡和花田一路旅行過來，看到這裡很溫暖，就想停下來向您打個招呼。今天會很美好，旅途中的片段都是很好的回憶。',
      invitation: '今天可以找一個舒服的位置坐一下，看看窗外，讓心情像遠方的風一樣輕輕放鬆。',
      tag: '慢慢旅行',
      isTraveler: true
    },
    {
      id: 'egypt_camel',
      name: '埃及駱駝',
      image: 'images/visitors/egypt_camel.jpg',
      imageBase: 'images/visitors/egypt_camel',
      fallbackEmoji: '🐪',
      title: '今天有一隻從埃及旅行來的駱駝，正在旅途中經過您家。',
      greeting: '我從遙遠的沙漠一路慢慢走來，途中看見很多風景。經過這裡時，也想停下來向您說一聲平安。慢慢走，沿途欣賞，也是一種很好的旅行方式。',
      invitation: '今天可以慢慢喝幾口水，坐一下，讓自己像沙漠旅人一樣，穩穩地照顧自己。',
      tag: '穩穩前行'
    },
    {
      id: 'red_fox_london',
      name: '倫敦紅狐狸',
      image: 'images/visitors/red_fox_london.jpg',
      imageBase: 'images/visitors/red_fox_london',
      fallbackEmoji: '🦊',
      title: '今天有一隻來自英國倫敦的紅狐狸，正在旅行途中經過您家。',
      greeting: '我從倫敦的街角與公園一路旅行過來，途中看見很多有趣的風景。經過這裡時，也想停下來向您問好。今天慢慢過，也會有屬於自己的小小風景。',
      invitation: '今天可以慢慢看看窗外，或散幾步，留意一下身邊的小景色，讓心情也跟著輕鬆一點。',
      tag: '街角旅行',
      isTraveler: true
    }
  ];

  const VISITOR_BY_ID = VISITORS.reduce(function (a, v) { a[v.id] = v; return a; }, {});

  // V1.8: 場景變體系統
  //
  // 每隻訪客的「主場景」=訪客物件本身（id 為 'main'）
  // 額外場景放在 visitor.scenes 陣列，每個場景可以覆寫 title/greeting/invitation/tag
  //
  // sceneId 'main' = 主場景；其他 = 額外場景

  // 取得某動物的所有場景 ID（包含 'main'）
  function getVisitorSceneIds(visitor) {
    const ids = ['main'];
    if (visitor.scenes && Array.isArray(visitor.scenes)) {
      visitor.scenes.forEach(function (s) {
        if (s.id && s.id !== 'main') ids.push(s.id);
      });
    }
    return ids;
  }

  // 從 visitor + sceneId 解析出實際要顯示的內容
  // 回傳：{ visitor, sceneId, title, greeting, invitation, tag, fallbackEmoji, imageBase, image }
  function resolveVisitorScene(visitor, sceneId) {
    if (!visitor) return null;
    sceneId = sceneId || 'main';

    // 找場景物件
    let scene = null;
    if (sceneId !== 'main' && visitor.scenes) {
      scene = visitor.scenes.find(function (s) { return s.id === sceneId; });
    }

    // 場景找不到 → fallback 回主場景
    if (sceneId !== 'main' && !scene) {
      sceneId = 'main';
    }

    // 組合最終內容：場景覆寫主場景的對應欄位
    return {
      visitor: visitor,
      sceneId: sceneId,
      // 文案：場景有就用場景的、沒有就用主場景的
      title:       (scene && scene.title)       || visitor.title,
      greeting:    (scene && scene.greeting)    || visitor.greeting,
      invitation:  (scene && scene.invitation)  || visitor.invitation,
      tag:         (scene && scene.tag)         || visitor.tag,
      fallbackEmoji: visitor.fallbackEmoji,
      // 圖檔路徑
      // 主場景：imageBase = 'images/visitors/cat_traveler'
      // 其他場景：imageBase = 'images/visitors/cat_traveler_cafe'
      imageBase: (scene && scene.imageBase) || visitor.imageBase,
      image:     (scene && scene.image)     || visitor.image
    };
  }

  // V1.9: 訪客拜訪計數系統（旅人類型用）
  //
  // 在 localStorage 存一個 { kiwi: 3, cat_traveler: 5, ... } 物件
  // 每次抽到某動物（不論場景）就 +1
  // 旅人類型的動物會根據這個計數決定要演哪個場景

  function getVisitorEncounters() {
    try {
      const raw = localStorage.getItem(KEYS.visitorEncounters);
      if (!raw) return {};
      const obj = JSON.parse(raw);
      return (obj && typeof obj === 'object') ? obj : {};
    } catch (e) {
      return {};
    }
  }

  function incrementVisitorEncounter(visitorId) {
    const map = getVisitorEncounters();
    map[visitorId] = (map[visitorId] || 0) + 1;
    try {
      localStorage.setItem(KEYS.visitorEncounters, JSON.stringify(map));
    } catch (e) {}
    return map[visitorId];
  }

  // V1.9: 旅人類型的場景挑選
  //
  // 規則：
  //   - 第 1 次見面 → 主場景（main）「初次相遇的代表照」
  //   - 第 2 次以後 → 場景循環（sea → bookstore → tea → sea → ...）
  //     主場景只在第一次出現，之後純粹輪場景
  //
  // 計數從「該動物已經被抽到 N 次」算（包含這次）
  // 場景循環索引：encounter=2 → scenes[0], encounter=3 → scenes[1] ...
  // 沒有場景的旅人 → 都用主場景
  function pickTravelerScene(visitor, encounterCount) {
    // 第一次見面：用主場景
    if (encounterCount <= 1) return 'main';

    // 沒有額外場景：永遠用主場景
    if (!visitor.scenes || visitor.scenes.length === 0) return 'main';

    // 第 2 次以後：直接走場景循環
    // encounterCount - 2 為「這是第幾次走場景循環」（0-indexed）
    const idx = (encounterCount - 2) % visitor.scenes.length;
    return visitor.scenes[idx].id;
  }

  // V1.7: 「今天沒有訪客」的機率（10%）
  const QUIET_DAY_PROBABILITY = 0.10;

  // V1.7: 安靜日的靜物風景（每天從中挑一張）
  // 結構：title / greeting / invitation / image / imageBase / fallbackEmoji
  const QUIET_SCENES = [
    {
      id: 'quiet_tea',
      image: 'images/quiet/quiet_tea.jpg',
      imageBase: 'images/quiet/quiet_tea',
      fallbackEmoji: '☕',
      title: '今天很安靜',
      greeting: '喝口茶，慢慢也很好。',
      invitation: '今天可以替自己泡一杯熱熱的飲料，喝幾口，讓身體暖起來。'
    },
    {
      id: 'quiet_window',
      image: 'images/quiet/quiet_window.jpg',
      imageBase: 'images/quiet/quiet_window',
      fallbackEmoji: '🪟',
      title: '今天很安靜',
      greeting: '窗外有光，世界也在陪你。',
      invitation: '今天可以走到窗邊看一下，看看天空、看看光。'
    },
    {
      id: 'quiet_chair',
      image: 'images/quiet/quiet_chair.jpg',
      imageBase: 'images/quiet/quiet_chair',
      fallbackEmoji: '🪑',
      title: '今天很安靜',
      greeting: '坐下來休息一下，也很好。',
      invitation: '今天可以找一張喜歡的椅子坐一下，什麼都不做也很好。'
    },
    {
      id: 'quiet_plant',
      image: 'images/quiet/quiet_plant.jpg',
      imageBase: 'images/quiet/quiet_plant',
      fallbackEmoji: '🪴',
      title: '今天很安靜',
      greeting: '靜靜生長，也是一種美好。',
      invitation: '今天可以看看身邊的植物，或想起家裡哪盆花最近過得怎麼樣。'
    },
    {
      id: 'quiet_letter',
      image: 'images/quiet/quiet_letter.jpg',
      imageBase: 'images/quiet/quiet_letter',
      fallbackEmoji: '✉️',
      title: '今天很安靜',
      greeting: '沒有訪客的日子，也有一份安靜問候。',
      invitation: '今天可以寫一句話給自己，或在心裡跟自己說一聲：「您今天也辛苦了。」'
    }
  ];

  const QUIET_SCENE_BY_ID = QUIET_SCENES.reduce(function (a, s) { a[s.id] = s; return a; }, {});


  // --- 家人訊息 ---
  const FAMILY_MESSAGES = [
    // 情緒類（原本就有）
    { emoji: '😊', label: '我今天很好', text: '我今天很好，請你放心。願你今天也平安。' },
    { emoji: '😌', label: '我有點累', text: '我今天有點累，不用擔心。有空時可以跟我說說話。' },
    { emoji: '📞', label: '有空打給我', text: '你有空的時候，可以打給我一下嗎？我想跟你說說話。' },
    { emoji: '💗', label: '我想你了', text: '我今天有點想你。看到訊息不用急，有空再回我就好。' },
    { emoji: '💊', label: '我已經吃藥了', text: '我剛剛已經吃藥了，請放心。' },
    { emoji: '✨', label: '我今天想分享一件事', text: '我今天想起一件小事，想找時間跟你說。' },
    // V1.8.6 新增：生活報告
    { emoji: '🚶', label: '我有出門走走', text: '我今天有出門走走，動一動身體，覺得心情也好一些。' },
    { emoji: '🌤️', label: '今天天氣不錯', text: '今天天氣不錯，看著外面覺得很舒服。希望你那邊也是好天氣。' },
    { emoji: '🏥', label: '我去看醫生了', text: '我今天去看醫生了，一切都好，不用擔心。' },
    { emoji: '🍱', label: '我有好好吃飯', text: '今天三餐都有好好吃，請你放心。' },
    // 感恩
    { emoji: '🌷', label: '謝謝你上次來看我', text: '謝謝你上次來看我，跟你聊天的時間我都記得，很開心。' },
    { emoji: '☎️', label: '謝謝你打電話來', text: '謝謝你前幾天打電話來，聽到你的聲音覺得很安心。' },
    // 問候
    { emoji: '🤲', label: '你最近還好嗎', text: '最近工作累不累？記得也要照顧好自己，不用太擔心我。' },
    { emoji: '👶', label: '孩子們最近好嗎', text: '孩子們最近好嗎？想念他們了，有空帶他們回來坐坐。' },
    { emoji: '🍵', label: '記得喝水休息', text: '不管多忙，記得多喝水、好好休息。我這邊一切都好。' }
  ];

  // --- 照顧項目 ---
  const CARE_ITEMS = [
    { type: 'water', label: '喝水', icon: '💧', desc: '現在可以喝幾口水，讓身體舒服一點。', btn: '我喝了' },
    { type: 'medicine', label: '吃藥', icon: '💊', desc: '如果到了吃藥時間，記得配溫開水。\n如果已經吃了，可以按一下記錄。', btn: '我吃好了' },
    { type: 'bloodPressure', label: '量血壓', icon: '❤️', desc: '如果今天方便，可以量一下血壓，知道身體的狀態。', btn: '我量了' },
    { type: 'walk', label: '散步', icon: '🚶', desc: '如果天氣和身體都可以，慢慢走幾步也很好。', btn: '我走了' },
    { type: 'rest', label: '休息', icon: '🛌', desc: '身體有點累的時候，休息也是很重要的事。', btn: '我休息了' },
    // V1.4 新增四項可選
    { type: 'reading', label: '輕量閱讀', icon: '📖', desc: '看幾頁書、翻一翻報紙，讓心思緩一緩。', btn: '我看了' },
    { type: 'breathing', label: '呼吸練習', icon: '🌬️', desc: '慢慢吸氣、慢慢吐氣，幾次就好。\n讓身體跟著放鬆下來。', btn: '我做了' },
    { type: 'supplement', label: '營養品補充', icon: '🧴', desc: '如果有在吃營養品，記得照平常的份量。', btn: '我吃了' },
    { type: 'nutrition', label: '營養進食', icon: '🍱', desc: '好好吃一頓飯，是對身體最溫柔的事。', btn: '我吃了' }
  ];

  // V1.4: 預設五項（首次使用，或還沒設定過自己的選擇時用這個）
  const DEFAULT_CARE_SELECTION = ['water', 'medicine', 'bloodPressure', 'walk', 'nutrition'];

  // V1.4: 一次最多選 5 項顯示在首頁
  const MAX_CARE_SELECTION = 5;

  // V1.6: 最多自訂幾項照顧項目
  const MAX_CUSTOM_CARE = 5;

  // V1.6: 自訂項目可以挑的 icon
  const CUSTOM_CARE_EMOJIS = [
    '🌿','🌸','🍵','🧘','🪷','💆','🎵','📿',
    '🧩','✍️','🌅','🌙','🐾','🪴','🍎','🥛',
    '☀️','💧','❤️','✨'
  ];

  // V1.6: 自訂項目的預設文案（描述和按鈕字）
  const CUSTOM_CARE_DESC = '記得做的時候，可以按一下記錄。';
  const CUSTOM_CARE_BTN = '我做了';

  const CARE_LABEL_BY_TYPE = CARE_ITEMS.reduce((acc, c) => { acc[c.type] = c.label; return acc; }, {});
  const CARE_BY_TYPE = CARE_ITEMS.reduce((acc, c) => { acc[c.type] = c; return acc; }, {});

  const FLOWERS = ['🌷'];

  // ============================================================
  // 二、儲存模組 (localStorage)
  // ============================================================

  const KEYS = {
    stories: 'ri_ri_an_xin_stories',
    care: 'ri_ri_an_xin_care_records',
    activity: 'ri_ri_an_xin_activity_records',
    fontSize: 'ri_ri_an_xin_font_size',
    // V1.1
    mood: 'ri_ri_an_xin_mood_records',
    personName: 'ri_ri_an_xin_person_name',
    familyNotes: 'ri_ri_an_xin_family_notes',
    // V1.2 拜訪系統
    todayVisitor: 'ri_ri_an_xin_today_visitor',
    visitorCollection: 'ri_ri_an_xin_visitor_collection',
    // V1.3 回憶回放 + 訪客回訪
    todayRecall: 'ri_ri_an_xin_today_recall',  // 當日已挑選的回憶 id
    // V1.4 照顧自己項目選擇
    careSelection: 'ri_ri_an_xin_care_selection',
    // V1.6 自訂照顧項目
    customCare: 'ri_ri_an_xin_custom_care',
    // V1.9 訪客拜訪計數（用於旅人類型的場景循環）
    visitorEncounters: 'ri_ri_an_xin_visitor_encounters'
  };

  function loadList(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  }

  function saveList(key, list) {
    try {
      localStorage.setItem(key, JSON.stringify(list));
    } catch (e) {
      // 儲存失敗也不打擾使用者
      console.warn('storage failed', e);
    }
  }

  function addStory(prompt, content, category) {
    const list = loadList(KEYS.stories);
    list.push({
      id: 'story_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
      prompt: prompt,
      content: content,
      category: category || '',
      createdAt: new Date().toISOString()
    });
    saveList(KEYS.stories, list);
  }

  // V1.1: 心情紀錄
  function addMood(type) {
    const m = MOOD_BY_TYPE[type];
    if (!m) return;
    const list = loadList(KEYS.mood);
    list.push({
      id: 'mood_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
      type: type,
      label: m.label,
      createdAt: new Date().toISOString()
    });
    saveList(KEYS.mood, list);
  }

  // V1.1: 家人留言
  function addFamilyNote(content) {
    const list = loadList(KEYS.familyNotes);
    list.push({
      id: 'note_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
      content: content,
      createdAt: new Date().toISOString()
    });
    saveList(KEYS.familyNotes, list);
  }

  function deleteFamilyNote(id) {
    const list = loadList(KEYS.familyNotes).filter(function (n) { return n.id !== id; });
    saveList(KEYS.familyNotes, list);
  }

  // V1.1: 稱呼
  function getPersonName() {
    try {
      const v = localStorage.getItem(KEYS.personName);
      return (v && v.trim()) ? v : DEFAULT_NAME;
    } catch (e) {
      return DEFAULT_NAME;
    }
  }

  function setPersonName(name) {
    try {
      localStorage.setItem(KEYS.personName, name);
    } catch (e) {}
  }

  // ============================================================
  // V1.2: 拜訪系統資料層
  // ============================================================

  // V1.6: 判斷現在是白天還是晚上（5:00–18:00 算白天）
  function currentDaypart() {
    const h = new Date().getHours();
    return (h >= 5 && h < 18) ? 'day' : 'night';
  }

  // 取得今天的訪客（每天固定一位 + 第一次抽到當下的時段）
  function getTodayVisitor() {
    const today = todayKey();
    let stored = null;
    try {
      const raw = localStorage.getItem(KEYS.todayVisitor);
      if (raw) stored = JSON.parse(raw);
    } catch (e) {}

    // 若有今日紀錄，直接使用（含「安靜日」狀態）
    if (stored && stored.date === today) {
      // V1.7: 安靜日狀態
      if (stored.isQuiet && stored.sceneId && QUIET_SCENE_BY_ID[stored.sceneId]) {
        return {
          isQuiet: true,
          scene: QUIET_SCENE_BY_ID[stored.sceneId],
          daypart: stored.daypart || currentDaypart()
        };
      }
      // 正常訪客
      if (VISITOR_BY_ID[stored.visitorId]) {
        return {
          isQuiet: false,
          visitor: VISITOR_BY_ID[stored.visitorId],
          isReturn: !!stored.isReturn,
          lastSeenISO: stored.lastSeenISO || null,
          daypart: stored.daypart || currentDaypart(),
          sceneId: stored.visitorSceneId || 'main'  // V1.8
        };
      }
    }

    const daypart = currentDaypart();

    // V1.7: 擲骰決定今天是不是安靜日
    if (Math.random() < QUIET_DAY_PROBABILITY) {
      // 避開昨天的場景，連兩天看到同一張會破壞驚喜感
      let pool = QUIET_SCENES;
      if (stored && stored.sceneId && QUIET_SCENES.length > 1) {
        pool = QUIET_SCENES.filter(function (s) { return s.id !== stored.sceneId; });
      }
      const scene = pool[Math.floor(Math.random() * pool.length)];

      try {
        localStorage.setItem(KEYS.todayVisitor, JSON.stringify({
          date: today,
          isQuiet: true,
          sceneId: scene.id,
          daypart: daypart
        }));
      } catch (e) {}

      return { isQuiet: true, scene: scene, daypart: daypart };
    }

    // ↓↓↓ 以下為原本的「有訪客」流程 ↓↓↓
    // V1.3: 25% 機率挑「以前收藏過、超過 14 天沒見」的舊訪客回訪
    let picked = null;
    let isReturn = false;
    let lastSeenISO = null;
    let visitorSceneId = 'main';  // V1.8

    const collection = loadList(KEYS.visitorCollection);
    if (collection.length > 0 && Math.random() < 0.25) {
      // 取每位訪客（不分場景）的最近收藏日期
      const lastSeenMap = {};
      collection.forEach(function (c) {
        if (!lastSeenMap[c.visitorId] || c.createdAt > lastSeenMap[c.visitorId]) {
          lastSeenMap[c.visitorId] = c.createdAt;
        }
      });
      const eligibleIds = Object.keys(lastSeenMap).filter(function (vid) {
        return VISITOR_BY_ID[vid] && daysSince(lastSeenMap[vid]) >= 14;
      });
      const filtered = stored && stored.visitorId
        ? eligibleIds.filter(function (vid) { return vid !== stored.visitorId; })
        : eligibleIds;
      if (filtered.length > 0) {
        const chosenId = filtered[Math.floor(Math.random() * filtered.length)];
        picked = VISITOR_BY_ID[chosenId];
        isReturn = true;
        lastSeenISO = lastSeenMap[chosenId];
      }
    }

    // 一般流程：從訪客陣列隨機挑（避開昨天那位）
    if (!picked) {
      let pool = VISITORS;
      if (stored && stored.visitorId && VISITORS.length > 1) {
        pool = VISITORS.filter(function (v) { return v.id !== stored.visitorId; });
      }
      picked = pool[Math.floor(Math.random() * pool.length)];
    }

    // V1.9: picked 確定後 → 遞增該動物的拜訪計數 → 用計數決定場景
    const encounterCount = incrementVisitorEncounter(picked.id);
    if (picked.isTraveler) {
      visitorSceneId = pickTravelerScene(picked, encounterCount);
    } else {
      // 非旅人類型：永遠用主場景
      visitorSceneId = 'main';
    }

    try {
      localStorage.setItem(KEYS.todayVisitor, JSON.stringify({
        date: today,
        visitorId: picked.id,
        visitorSceneId: visitorSceneId,  // V1.8
        isReturn: isReturn,
        lastSeenISO: lastSeenISO,
        daypart: daypart,
        isQuiet: false
      }));
    } catch (e) {}

    return {
      isQuiet: false,
      visitor: picked,
      isReturn: isReturn,
      lastSeenISO: lastSeenISO,
      daypart: daypart,
      sceneId: visitorSceneId  // V1.8
    };
  }

  // 今天是否已收藏此訪客的這個場景？
  // V1.8: sceneId 加入比對，不同場景算不同收藏
  function isTodayVisitorCollected(visitorId, sceneId) {
    sceneId = sceneId || 'main';
    const today = todayKey();
    const list = loadList(KEYS.visitorCollection);
    return list.some(function (c) {
      const cSceneId = c.sceneId || 'main';  // 舊資料相容
      return c.collectedDate === today && c.visitorId === visitorId && cSceneId === sceneId;
    });
  }

  // 收藏訪客
  // V1.8: 接受 sceneId，並將解析後的場景內容（含 title/greeting...）一起存進收藏紀錄
  function collectVisitor(visitor, daypart, sceneId) {
    sceneId = sceneId || 'main';
    if (isTodayVisitorCollected(visitor.id, sceneId)) return false;

    // 解析該場景的實際顯示內容
    const resolved = resolveVisitorScene(visitor, sceneId);

    const list = loadList(KEYS.visitorCollection);
    const now = new Date();
    list.push({
      id: 'collection_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
      visitorId: visitor.id,
      visitorName: visitor.name,
      sceneId: sceneId,  // V1.8
      // 存當下實際顯示的內容（場景覆寫過的版本）
      image: resolved.image,
      imageBase: resolved.imageBase,
      fallbackEmoji: resolved.fallbackEmoji,
      title: resolved.title,
      greeting: resolved.greeting,
      invitation: resolved.invitation,
      tag: resolved.tag,
      daypart: daypart || currentDaypart(),
      collectedDate: todayKey(),
      createdAt: now.toISOString()
    });
    saveList(KEYS.visitorCollection, list);
    return true;
  }


  function addCareRecord(type) {
    const list = loadList(KEYS.care);
    const item = resolveCareItem(type);
    list.push({
      id: 'care_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
      type: type,
      label: (item && item.label) || type,
      createdAt: new Date().toISOString()
    });
    saveList(KEYS.care, list);
  }

  // V1.4: 取得使用者目前選擇的照顧項目（最多 5 個 type 字串組成的陣列）
  function getCareSelection() {
    try {
      const raw = localStorage.getItem(KEYS.careSelection);
      if (!raw) return DEFAULT_CARE_SELECTION.slice();
      const arr = JSON.parse(raw);
      if (!Array.isArray(arr) || arr.length === 0) return DEFAULT_CARE_SELECTION.slice();
      // 過濾掉不存在的 type；V1.6 同時接受內建與自訂 type
      const customMap = getCustomCareMap();
      const valid = arr.filter(function (t) { return CARE_BY_TYPE[t] || customMap[t]; });
      return valid.length > 0 ? valid.slice(0, MAX_CARE_SELECTION) : DEFAULT_CARE_SELECTION.slice();
    } catch (e) {
      return DEFAULT_CARE_SELECTION.slice();
    }
  }

  function setCareSelection(types) {
    // 去重 + 限制最多 5 個 + 只保留合法 type（內建或自訂都算）
    const customMap = getCustomCareMap();
    const seen = {};
    const filtered = [];
    for (let i = 0; i < types.length && filtered.length < MAX_CARE_SELECTION; i++) {
      const t = types[i];
      if (seen[t]) continue;
      if (CARE_BY_TYPE[t] || customMap[t]) {
        seen[t] = true;
        filtered.push(t);
      }
    }
    try {
      localStorage.setItem(KEYS.careSelection, JSON.stringify(filtered));
    } catch (e) {}
  }

  // V1.6: 取得所有自訂照顧項目（陣列）
  function getCustomCareItems() {
    const list = loadList(KEYS.customCare);
    return Array.isArray(list) ? list : [];
  }

  // V1.6: 取得自訂項目 type → 項目物件 的對照
  function getCustomCareMap() {
    const map = {};
    getCustomCareItems().forEach(function (it) { map[it.type] = it; });
    return map;
  }

  // V1.6: 取得「全部項目」（內建 + 自訂），用於編輯對話框顯示
  function getAllCareItems() {
    return CARE_ITEMS.concat(getCustomCareItems());
  }

  // V1.6: 從 type 字串拿到完整的項目物件（先找內建、再找自訂）
  function resolveCareItem(type) {
    if (CARE_BY_TYPE[type]) return CARE_BY_TYPE[type];
    const map = getCustomCareMap();
    return map[type] || null;
  }

  // V1.6: 新增一個自訂項目
  // 回傳 { ok, message?, item? }
  function addCustomCare(label, icon) {
    label = (label || '').trim();
    if (!label) return { ok: false, message: '請填一個名稱。' };
    if (label.length > 8) return { ok: false, message: '名稱請在 8 個字以內。' };
    icon = icon || CUSTOM_CARE_EMOJIS[0];

    const list = getCustomCareItems();
    if (list.length >= MAX_CUSTOM_CARE) {
      return { ok: false, message: '最多自訂 ' + MAX_CUSTOM_CARE + ' 項。\n要先刪一項才能再加。' };
    }
    // 避免跟內建 / 既有自訂 label 撞名
    const allLabels = CARE_ITEMS.map(function (i) { return i.label; })
                      .concat(list.map(function (i) { return i.label; }));
    if (allLabels.indexOf(label) !== -1) {
      return { ok: false, message: '已經有一項叫「' + label + '」了。' };
    }

    // 用時間戳生成唯一 type id
    const item = {
      type: 'custom_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      label: label,
      icon: icon,
      desc: CUSTOM_CARE_DESC,
      btn: CUSTOM_CARE_BTN,
      isCustom: true,
      createdAt: new Date().toISOString()
    };
    list.push(item);
    saveList(KEYS.customCare, list);
    return { ok: true, item: item };
  }

  // V1.6: 刪除一個自訂項目（同時從首頁選擇清單裡移除）
  function deleteCustomCare(type) {
    const list = getCustomCareItems().filter(function (i) { return i.type !== type; });
    saveList(KEYS.customCare, list);
    // 同步清掉 careSelection 裡的這個 type
    const sel = getCareSelection().filter(function (t) { return t !== type; });
    setCareSelection(sel);
  }

  function addActivity(type, label) {
    const list = loadList(KEYS.activity);
    list.push({
      id: 'activity_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
      type: type,
      label: label,
      createdAt: new Date().toISOString()
    });
    saveList(KEYS.activity, list);
  }

  function clearAllData() {
    localStorage.removeItem(KEYS.stories);
    localStorage.removeItem(KEYS.care);
    localStorage.removeItem(KEYS.activity);
    // V1.1: 紀錄類也清掉，但稱呼、家人留言、字體設定保留
    localStorage.removeItem(KEYS.mood);
    // V1.2: 今日訪客快取清掉（清完會重抽一位），但收藏冊保留（這是珍貴的回憶）
    localStorage.removeItem(KEYS.todayVisitor);
    // V1.3: 今日回憶回放快取（既然 stories 已清，這個也要清）
    localStorage.removeItem(KEYS.todayRecall);
    // 設定類（稱呼、字體、家人留言、照顧選擇、自訂照顧項目、收藏冊）不清
  }

  // ============================================================
  // V1.5: 匯出 / 匯入設定（讓使用者跨裝置、跨 Safari/PWA 移轉資料）
  // ============================================================

  // 哪些 key 要被匯出（只匯「設定與長期累積的內容」，不匯今日快取／當天活動）
  const EXPORTABLE_KEYS = [
    'personName',      // 稱呼
    'fontSize',        // 字體大小
    'familyNotes',     // 給自己的一句話
    'careSelection',   // 照顧自己項目選擇
    'customCare',      // V1.6: 自訂照顧項目
    'visitorCollection', // 來訪收藏冊
    'visitorEncounters', // V1.9: 訪客拜訪計數
    'stories'          // 想一想回憶
  ];

  const EXPORT_FORMAT_VERSION = 1;

  // 把 localStorage 裡的設定打包成一段 base64 字串
  function exportData() {
    const payload = {
      v: EXPORT_FORMAT_VERSION,
      app: 'ri_ri_an_xin',
      at: new Date().toISOString(),
      data: {}
    };
    EXPORTABLE_KEYS.forEach(function (k) {
      const fullKey = KEYS[k];
      if (!fullKey) return;
      try {
        const raw = localStorage.getItem(fullKey);
        if (raw !== null) payload.data[k] = raw;
      } catch (e) {}
    });

    const json = JSON.stringify(payload);
    // 用 TextEncoder 處理 unicode（btoa 直接吃中文會壞）
    // 標準做法：JSON → UTF-8 bytes → base64 字串
    try {
      const bytes = new TextEncoder().encode(json);
      let binary = '';
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary);
    } catch (e) {
      return null;
    }
  }

  // 解析設定碼但不寫入；回傳 { ok, message, payload?, summary? }
  function parseImportCode(code) {
    if (!code || typeof code !== 'string') {
      return { ok: false, message: '請貼上一段設定碼。' };
    }
    const cleaned = code.replace(/\s+/g, '');
    if (!cleaned) {
      return { ok: false, message: '請貼上一段設定碼。' };
    }

    let json;
    try {
      // base64 → binary string → UTF-8 bytes → JSON
      const binary = atob(cleaned);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      json = new TextDecoder().decode(bytes);
    } catch (e) {
      return { ok: false, message: '這段設定碼看起來不對，請再檢查一下。' };
    }

    let payload;
    try {
      payload = JSON.parse(json);
    } catch (e) {
      return { ok: false, message: '這段設定碼看起來不對，請再檢查一下。' };
    }

    if (!payload || payload.app !== 'ri_ri_an_xin' || !payload.data) {
      return { ok: false, message: '這段設定碼不是《日日安心》的設定。' };
    }
    if (typeof payload.v !== 'number' || payload.v > EXPORT_FORMAT_VERSION) {
      return { ok: false, message: '這段設定碼版本較新，這台手機還讀不了。' };
    }

    // 預先計算摘要（給使用者看「即將載入什麼」）
    const summary = {
      personName: false,
      fontSize: false,
      familyNotes: 0,
      careSelection: 0,
      customCare: 0,
      visitorCollection: 0,
      stories: 0
    };
    EXPORTABLE_KEYS.forEach(function (k) {
      const value = payload.data[k];
      if (typeof value !== 'string') return;
      if (k === 'personName') summary.personName = !!value.trim();
      else if (k === 'fontSize') summary.fontSize = !!value.trim();
      else {
        try {
          const arr = JSON.parse(value);
          if (Array.isArray(arr)) summary[k] = arr.length;
        } catch (e) {}
      }
    });

    return { ok: true, payload: payload, summary: summary };
  }

  // 真正寫入 localStorage（拿 parseImportCode 的 payload）
  function applyImportPayload(payload) {
    EXPORTABLE_KEYS.forEach(function (k) {
      const fullKey = KEYS[k];
      if (!fullKey) return;
      const value = payload.data[k];
      if (typeof value !== 'string') return;
      try {
        localStorage.setItem(fullKey, value);
      } catch (e) {}
    });
  }


  // ============================================================
  // 三、日期工具
  // ============================================================

  function todayKey() {
    const d = new Date();
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  function dateKeyOf(iso) {
    const d = new Date(iso);
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  function isToday(iso) {
    return dateKeyOf(iso) === todayKey();
  }

  function formatDateLabel(iso) {
    const d = new Date(iso);
    const today = new Date();
    const sameYear = d.getFullYear() === today.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    if (sameYear) return month + '月' + day + '日';
    return d.getFullYear() + '年' + month + '月' + day + '日';
  }

  function formatTimeShort(iso) {
    const d = new Date(iso);
    const h = d.getHours();
    const m = String(d.getMinutes()).padStart(2, '0');
    if (h < 12) return '早上 ' + h + ':' + m;
    if (h < 13) return '中午 ' + h + ':' + m;
    if (h < 18) return '下午 ' + (h - 12) + ':' + m;
    return '晚上 ' + (h - 12) + ':' + m;
  }

  // V1.3: 算 ISO 日期距今幾天（以日為單位，不含時分秒）
  function daysSince(iso) {
    const then = new Date(iso);
    const todayMid = new Date();
    todayMid.setHours(0, 0, 0, 0);
    const thenMid = new Date(then.getFullYear(), then.getMonth(), then.getDate());
    return Math.floor((todayMid - thenMid) / (24 * 60 * 60 * 1000));
  }

  // V1.3: 把「幾天前」轉成溫柔的中文描述
  function timeAgoLabel(iso) {
    const d = daysSince(iso);
    if (d <= 0) return '今天';
    if (d === 1) return '昨天';
    if (d < 7) return d + ' 天前';
    if (d < 14) return '上週';
    if (d < 30) return Math.floor(d / 7) + ' 週前';
    if (d < 60) return '上個月';
    if (d < 365) return Math.floor(d / 30) + ' 個月前';
    const y = Math.floor(d / 365);
    return y === 1 ? '一年前' : y + ' 年前';
  }

  // 給「今日想一想」題目用：根據日期取一個穩定的問題
  function dailySeedIndex(arrLen, salt) {
    const d = new Date();
    const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate() + (salt || 0);
    return seed % arrLen;
  }

  function randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function randomIndex(arr, except) {
    if (arr.length <= 1) return 0;
    let i;
    do { i = Math.floor(Math.random() * arr.length); } while (i === except);
    return i;
  }

  // ============================================================
  // 四、Toast / Modal
  // ============================================================

  let toastTimer = null;
  function showToast(text, duration) {
    const el = document.getElementById('toast');
    el.textContent = text;
    el.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      el.classList.remove('show');
    }, duration || 2200);
  }

  function showConfirm(title, text, onConfirm) {
    const mask = document.getElementById('modalMask');
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalText').textContent = text;
    mask.hidden = false;

    const confirmBtn = document.getElementById('modalConfirm');
    const cancelBtn = document.getElementById('modalCancel');

    function close() {
      mask.hidden = true;
      confirmBtn.removeEventListener('click', onYes);
      cancelBtn.removeEventListener('click', onNo);
      mask.removeEventListener('click', onMaskClick);
    }
    function onYes() { close(); if (onConfirm) onConfirm(); }
    function onNo() { close(); }
    function onMaskClick(e) { if (e.target === mask) close(); }

    confirmBtn.addEventListener('click', onYes);
    cancelBtn.addEventListener('click', onNo);
    mask.addEventListener('click', onMaskClick);
  }

  // ============================================================
  // 五、View 切換
  // ============================================================

  let currentView = 'home';

  function goTo(view) {
    if (view === currentView) {
      // 點同一頁可以回到頂端
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // 仍重新渲染一次，避免遊戲頁殘留狀態
    }

    currentView = view;

    document.querySelectorAll('.view').forEach(function (el) {
      el.classList.toggle('active', el.dataset.view === view);
    });
    document.querySelectorAll('.nav-btn').forEach(function (el) {
      el.classList.toggle('active', el.dataset.go === view);
    });
    window.scrollTo({ top: 0, behavior: 'auto' });

    // 進入該頁時做對應的渲染
    if (view === 'home') renderHome();
    else if (view === 'play') renderPlay();
    else if (view === 'think') renderThink();
    else if (view === 'move') renderMove();
    else if (view === 'say') renderSay();
    else if (view === 'care') renderCare();
    else if (view === 'album') renderAlbum();
    else if (view === 'settings') renderSettings();
  }

  // ============================================================
  // 六、首頁 (Home)
  // ============================================================

  function getGreeting() {
    const h = new Date().getHours();
    if (h >= 5 && h < 11) return GREETINGS[0];   // 早安
    if (h >= 11 && h < 17) return GREETINGS[1];  // 午安
    if (h >= 17 && h < 22) return GREETINGS[2];  // 晚安
    return GREETINGS[3];                          // 22-23 與 0-4 夜深
  }

  function renderHome() {
    // 問候（V1.1: 套用稱呼）
    const g = getGreeting();
    const name = getPersonName();
    document.getElementById('greetingTime').textContent = g.time;
    document.getElementById('greetingHello').textContent = g.hello.replace('{name}', name);
    document.getElementById('greetingWords').textContent = g.words;

    // V1.1: 家人留言（每日穩定挑一則）
    renderFamilyNoteOnHome();

    // V1.2: 今天的訪客
    renderTodayVisitor();

    // V1.1: 今日心情
    renderMoodSection();

    // 花園
    renderGarden();

    // 照顧卡狀態（首頁版）
    renderHomeCareStatus();

    // 今日摘要
    renderSummary();
  }

  // V1.1: 首頁家人留言
  // V1.8.3: 沒寫任何留言時的預設輪播池
  const DEFAULT_FAMILY_NOTES = [
    '今天也照顧自己一下。',
    '每天都是新的一天。',
    '日常的小事，也是好事。'
  ];

  function renderFamilyNoteOnHome() {
    const el = document.getElementById('familyNoteText');
    const notes = loadList(KEYS.familyNotes);
    if (notes.length === 0) {
      // 沒有自訂留言 → 用系統預設三句輪播（按日期）
      el.textContent = DEFAULT_FAMILY_NOTES[dailySeedIndex(DEFAULT_FAMILY_NOTES.length, 3)];
      return;
    }
    // 有自訂留言 → 從使用者的留言中按日期挑一句
    const note = notes[dailySeedIndex(notes.length, 3)];
    el.textContent = note.content;
  }

  // V1.2: 今天的訪客
  let currentVisitor = null;
  let currentVisitorDaypart = null;
  let currentVisitorSceneId = 'main';  // V1.8

  function renderTodayVisitor() {
    const info = getTodayVisitor();
    currentVisitorDaypart = info.daypart;

    const card = document.getElementById('visitorCard');
    const returnMeta = document.getElementById('visitorReturnMeta');
    const btn = document.getElementById('visitorCollectBtn');
    const albumLink = document.getElementById('visitorAlbumLink');

    if (info.isQuiet) {
      // V1.7: 安靜日狀態
      currentVisitor = null;
      currentVisitorSceneId = 'main';

      const scene = info.scene;
      document.getElementById('visitorTitle').textContent = scene.title;
      document.getElementById('visitorGreeting').textContent = scene.greeting;
      document.getElementById('visitorInvitation').textContent = scene.invitation;

      returnMeta.hidden = true;
      returnMeta.textContent = '';

      // 套用安靜日樣式（背景偏柔和）
      card.classList.add('quiet-day');
      card.classList.remove('collected');

      // 收藏按鈕隱藏（沒有訪客可收藏）
      btn.hidden = true;

      // 圖片用三段式回退（跟訪客一樣，沒準備圖也可以走 emoji）
      loadVisitorImage(scene, info.daypart, '安靜的院子');
      return;
    }

    // ↓↓↓ 正常訪客流程 ↓↓↓
    const visitor = info.visitor;
    currentVisitor = visitor;
    currentVisitorSceneId = info.sceneId || 'main';

    // V1.8: 解析該場景的實際顯示內容（文案可能被場景覆寫）
    const resolved = resolveVisitorScene(visitor, currentVisitorSceneId);

    card.classList.remove('quiet-day');
    btn.hidden = false;

    document.getElementById('visitorTitle').textContent = resolved.title;
    document.getElementById('visitorInvitation').textContent = resolved.invitation;

    // V1.3: 回訪標記
    if (info.isReturn && info.lastSeenISO) {
      const ago = timeAgoLabel(info.lastSeenISO);
      returnMeta.textContent = '— ' + ago + '見過一面，今天又經過了';
      returnMeta.hidden = false;
      document.getElementById('visitorGreeting').textContent =
        '我又經過這裡了。' + resolved.greeting;
    } else {
      returnMeta.hidden = true;
      returnMeta.textContent = '';
      document.getElementById('visitorGreeting').textContent = resolved.greeting;
    }

    // V1.8: 圖片用解析後的 imageBase（場景變體會指到對應的 _cafe / _park 路徑）
    // V1.9.1: 場景變體找不到圖時，回退到主場景的圖（避免顯示 emoji）
    const isSceneVariant = currentVisitorSceneId && currentVisitorSceneId !== 'main';
    loadVisitorImage(resolved, info.daypart, visitor.name, isSceneVariant ? visitor : null);

    // 收藏狀態（依「動物 + 場景」判斷）
    const btnText = btn.querySelector('.visitor-collect-text');
    if (isTodayVisitorCollected(visitor.id, currentVisitorSceneId)) {
      card.classList.add('collected');
      btnText.textContent = '已收藏今天的來訪';
    } else {
      card.classList.remove('collected');
      btnText.textContent = '收藏今天的來訪';
    }
  }

  // V1.9.1: 圖片載入多段式回退（永不顯示 emoji，除非完全沒準備任何圖）
  //
  // 接收一組 candidates 路徑陣列，依序嘗試直到成功；都失敗才走 emoji
  //
  // subject 是訪客或安靜日場景物件
  // fallbackVisitor 是「主場景訪客物件」（場景變體找不到圖時，回退到主場景的圖）
  //   傳 null 表示沒有主場景可回退（例如 subject 本身就是主場景 / 安靜日）
  function loadVisitorImage(subject, daypart, altText, fallbackVisitor) {
    const img = document.getElementById('visitorImage');
    const fallback = document.getElementById('visitorEmojiFallback');
    fallback.textContent = subject.fallbackEmoji || (fallbackVisitor && fallbackVisitor.fallbackEmoji) || '🐾';
    img.alt = altText || '';

    img.onerror = null;
    img.onload = null;
    img.style.display = '';
    fallback.style.display = 'none';

    // 組合候選路徑：
    //   1. <imageBase>_<daypart>.jpg  ← 場景的指定時段版
    //   2. <imageBase>.jpg            ← 場景的通用版
    //   3. 若有 fallbackVisitor：<fallbackVisitor.imageBase>_<daypart>.jpg
    //   4. 若有 fallbackVisitor：<fallbackVisitor.image>
    const candidates = [];
    if (subject.imageBase) {
      candidates.push(subject.imageBase + '_' + daypart + '.jpg');
      candidates.push(subject.imageBase + '.jpg');
    }
    if (subject.image && candidates.indexOf(subject.image) === -1) {
      candidates.push(subject.image);
    }
    // 場景變體找不到 → 回退到主場景圖
    if (fallbackVisitor) {
      if (fallbackVisitor.imageBase) {
        const fbDaypart = fallbackVisitor.imageBase + '_' + daypart + '.jpg';
        const fbGeneric = fallbackVisitor.imageBase + '.jpg';
        if (candidates.indexOf(fbDaypart) === -1) candidates.push(fbDaypart);
        if (candidates.indexOf(fbGeneric) === -1) candidates.push(fbGeneric);
      }
      if (fallbackVisitor.image && candidates.indexOf(fallbackVisitor.image) === -1) {
        candidates.push(fallbackVisitor.image);
      }
    }

    let idx = 0;
    img.onerror = function () {
      idx++;
      if (idx < candidates.length) {
        img.src = candidates[idx];
      } else {
        // 全部都失敗 → 走 emoji（最末手段）
        img.style.display = 'none';
        fallback.style.display = 'flex';
      }
    };

    if (candidates.length === 0) {
      img.style.display = 'none';
      fallback.style.display = 'flex';
    } else {
      img.src = candidates[0];
    }
  }

  function onVisitorCollect() {
    if (!currentVisitor) return;
    if (isTodayVisitorCollected(currentVisitor.id, currentVisitorSceneId)) {
      showToast('今天的來訪已經收藏過囉。', 2200);
      return;
    }
    const ok = collectVisitor(currentVisitor, currentVisitorDaypart, currentVisitorSceneId);
    if (!ok) return;

    // 寫入 activity record（type: visitor）
    addActivity('visitor', '收藏' + currentVisitor.name + '的來訪');

    showToast('已收藏今天的來訪。\n這份問候會留在您的收藏冊裡。', 2800);
    renderTodayVisitor();
    // 平安花園也要更新（visitor 一天最多算一朵，邏輯在 countTodayFlowers 處理）
  }

  // V1.2: 收藏冊頁面
  function renderAlbum() {
    const list = loadList(KEYS.visitorCollection).slice().reverse();
    const el = document.getElementById('albumList');
    if (list.length === 0) {
      el.innerHTML =
        '<div class="album-empty">' +
          '<div class="album-empty-emoji">🌿</div>' +
          '收藏冊還是空的。<br>' +
          '之後遇見喜歡的小訪客，<br>可以把牠留下來。' +
        '</div>';
      return;
    }
    el.innerHTML = list.map(function (c, idx) {
      const dateLabel = formatAlbumDate(c.collectedDate);
      const emoji = c.fallbackEmoji || '🐾';

      // V1.6: 優先用 daypart 圖（如果當時有記錄），失敗就回退
      // V1.9.1: 收藏的若為場景變體（有 sceneId 且非 main），
      //         加入「主場景的圖」作為回退選項，避免顯示 emoji
      const daypart = c.daypart || 'day';
      const base = c.imageBase ||
        (c.image ? c.image.replace(/\.jpg$/i, '').replace(/\.png$/i, '') : '');

      // 組合候選路徑陣列（依序嘗試）
      const candidates = [];
      if (base) {
        candidates.push(base + '_' + daypart + '.jpg');
        candidates.push(base + '.jpg');
      }
      if (c.image && candidates.indexOf(c.image) === -1) {
        candidates.push(c.image);
      }
      // 場景變體 → 加上主場景圖作回退
      const isSceneVariant = c.sceneId && c.sceneId !== 'main';
      if (isSceneVariant) {
        const mainVisitor = VISITOR_BY_ID[c.visitorId];
        if (mainVisitor) {
          if (mainVisitor.imageBase) {
            const mainDay = mainVisitor.imageBase + '_' + daypart + '.jpg';
            const mainGen = mainVisitor.imageBase + '.jpg';
            if (candidates.indexOf(mainDay) === -1) candidates.push(mainDay);
            if (candidates.indexOf(mainGen) === -1) candidates.push(mainGen);
          }
          if (mainVisitor.image && candidates.indexOf(mainVisitor.image) === -1) {
            candidates.push(mainVisitor.image);
          }
        }
      }

      const primary = candidates[0] || '';

      return '<div class="album-card">' +
        '<div class="album-card-image-wrap">' +
          '<img class="album-card-image" ' +
               'data-candidates="' + escapeAttr(JSON.stringify(candidates)) + '" ' +
               'data-idx="0" ' +
               'src="' + escapeAttr(primary) + '" ' +
               'alt="' + escapeAttr(c.visitorName) + '">' +
          '<div class="album-card-emoji-fallback" style="display:none">' + escapeHtml(emoji) + '</div>' +
        '</div>' +
        '<div class="album-card-content">' +
          '<div class="album-card-head">' +
            '<div class="album-card-name">' + escapeHtml(c.visitorName) + '</div>' +
            '<div class="album-card-date">' + escapeHtml(dateLabel) + '</div>' +
          '</div>' +
          (c.tag ? '<div class="album-card-tag">' + escapeHtml(c.tag) + '</div>' : '') +
          '<div class="album-card-greeting">' + escapeHtml(c.greeting) + '</div>' +
          (c.invitation
            ? '<div class="album-card-invitation">' +
                '<div class="album-card-invitation-label">小邀請</div>' +
                escapeHtml(c.invitation) +
              '</div>'
            : '') +
        '</div>' +
      '</div>';
    }).join('');

    // V1.9.1: 綁定圖片 fallback（多段式回退）
    el.querySelectorAll('.album-card-image').forEach(function (img) {
      img.onerror = function () {
        let list = [];
        try { list = JSON.parse(img.dataset.candidates || '[]'); } catch (e) {}
        let idx = parseInt(img.dataset.idx || '0', 10);
        idx++;
        if (idx < list.length) {
          img.dataset.idx = String(idx);
          img.src = list[idx];
        } else {
          // 全部都失敗 → emoji
          img.style.display = 'none';
          const sibling = img.nextElementSibling;
          if (sibling) sibling.style.display = 'flex';
        }
      };
    });
  }

  function escapeAttr(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function formatAlbumDate(yyyymmdd) {
    // collectedDate 格式: "YYYY-MM-DD"
    if (!yyyymmdd) return '';
    const parts = yyyymmdd.split('-');
    if (parts.length !== 3) return yyyymmdd;
    return parts[0] + '/' + parts[1] + '/' + parts[2];
  }


  // V1.1: 今日心情
  function renderMoodSection() {
    const todayMoods = loadList(KEYS.mood).filter(function (m) { return isToday(m.createdAt); });
    const latest = todayMoods.length > 0 ? todayMoods[todayMoods.length - 1] : null;

    // 標記選中態
    document.querySelectorAll('.mood-btn').forEach(function (b) {
      b.classList.toggle('selected', latest && b.dataset.mood === latest.type);
    });

    // 顯示回應
    const resp = document.getElementById('moodResponse');
    if (latest) {
      const m = MOOD_BY_TYPE[latest.type];
      resp.textContent = m ? m.response : '';
      resp.hidden = false;
    } else {
      resp.hidden = true;
      resp.textContent = '';
    }
  }

  function renderGarden() {
    const count = countTodayFlowers();
    const flowersEl = document.getElementById('gardenFlowers');
    const countEl = document.getElementById('gardenCount');
    const hintEl = document.getElementById('gardenHint');

    if (count === 0) {
      flowersEl.innerHTML = '<span style="font-size:0.7em;color:var(--text-faint);letter-spacing:0.2em;">· · · ·</span>';
      countEl.textContent = '今天還沒開花';
      hintEl.innerHTML = '今天靜靜的也很好。<br>有空時，再回來看看就好。';
      hintEl.classList.remove('hidden');
    } else {
      // 一排最多放 8 朵；超過 8 朵就顯示 8 朵 + 文字傳達「花開滿了」
      const MAX_FLOWERS = 8;
      const shown = Math.min(count, MAX_FLOWERS);
      let html = '';
      for (let i = 0; i < shown; i++) {
        html += '<span class="flower" style="animation-delay:' + (i * 80) + 'ms;">' + FLOWERS[i % FLOWERS.length] + '</span>';
      }
      flowersEl.innerHTML = html;

      if (count > MAX_FLOWERS) {
        // 超過上限：花保持滿開，文字改說「滿開」
        countEl.textContent = '今天花開滿了';
        hintEl.innerHTML = '今天好充實，謝謝您這麼用心陪自己。';
      } else {
        countEl.textContent = '今天開了 ' + count + ' 朵';
        hintEl.innerHTML = count >= 3
          ? '今天有好好陪自己。'
          : '今天的花園開花了。';
      }
      hintEl.classList.remove('hidden');
    }
  }

  // 計算今日「平安花」朵數：所有今日的活動 + 照顧 + 故事 + 心情(V1.1) + 訪客(V1.2)
  // 規則：心情、訪客 都是「一天最多算 1 朵」（避免重複按造成花園爆滿）
  function countTodayFlowers() {
    const acts = loadList(KEYS.activity).filter(function (a) { return isToday(a.createdAt); });
    const cares = loadList(KEYS.care).filter(function (a) { return isToday(a.createdAt); });
    const stories = loadList(KEYS.stories).filter(function (a) { return isToday(a.createdAt); });
    const moods = loadList(KEYS.mood).filter(function (a) { return isToday(a.createdAt); });

    // 把 visitor 活動拆出來：一天最多算 1 朵
    const visitorActs = acts.filter(function (a) { return a.type === 'visitor'; });
    const otherActs = acts.filter(function (a) { return a.type !== 'visitor'; });

    const moodFlower = moods.length > 0 ? 1 : 0;
    const visitorFlower = visitorActs.length > 0 ? 1 : 0;

    return otherActs.length + cares.length + stories.length + moodFlower + visitorFlower;
  }

  function renderHomeCareStatus() {
    const selection = getCareSelection();
    const todayCares = loadList(KEYS.care).filter(function (c) { return isToday(c.createdAt); });
    const doneTypes = {};
    todayCares.forEach(function (c) { doneTypes[c.type] = true; });

    const list = document.getElementById('homeCareList');
    list.innerHTML = selection.map(function (type) {
      const item = resolveCareItem(type);
      if (!item) return '';
      const done = !!doneTypes[type];
      // 用 escapeHtml 處理 icon（自訂項目的 icon 是使用者選的，理論上是純 emoji；
      // 但為了防呆，仍 escape 一下避免奇怪輸入）
      return '<div class="care-row' + (done ? ' done' : '') + '" ' +
                'data-care-type="' + escapeAttr(type) + '" ' +
                'data-care-label="' + escapeAttr(item.label) + '">' +
        '<div class="care-icon">' + escapeHtml(item.icon) + '</div>' +
        '<div class="care-name">' + escapeHtml(item.label) + '</div>' +
        '<button class="care-btn">' + (done ? '已記錄' : '我做了') + '</button>' +
      '</div>';
    }).join('');
  }

  // ============================================================
  // V1.4: 編輯照顧項目對話框
  // ============================================================

  // 編輯時的暫存陣列（按下「記住」才寫入 localStorage）
  let careEditDraft = [];

  function openCareEdit() {
    careEditDraft = getCareSelection().slice();
    document.getElementById('careEditMaxCount').textContent = String(MAX_CARE_SELECTION);
    renderCareEditList();
    updateCareEditCount();
    document.getElementById('careEditMask').hidden = false;
  }

  function closeCareEdit() {
    document.getElementById('careEditMask').hidden = true;
    careEditDraft = [];
  }

  function renderCareEditList() {
    const list = document.getElementById('careEditList');
    const isFull = careEditDraft.length >= MAX_CARE_SELECTION;
    const allItems = getAllCareItems();

    const itemsHtml = allItems.map(function (item) {
      const selected = careEditDraft.indexOf(item.type) !== -1;
      const disabled = !selected && isFull;
      const cls = 'care-edit-item' +
                  (selected ? ' selected' : '') +
                  (disabled ? ' disabled' : '') +
                  (item.isCustom ? ' is-custom' : '');
      const deleteBtn = item.isCustom
        ? '<button type="button" class="care-edit-delete" data-delete-type="' + escapeAttr(item.type) + '" aria-label="刪除自訂項目">' +
            '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
              '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>' +
            '</svg>' +
          '</button>'
        : '';
      return '<div class="' + cls + '" data-care-type="' + escapeAttr(item.type) + '">' +
        '<button type="button" class="care-edit-item-main">' +
          '<span class="care-edit-icon">' + escapeHtml(item.icon) + '</span>' +
          '<span class="care-edit-name">' + escapeHtml(item.label) + '</span>' +
          '<span class="care-edit-check">✓</span>' +
        '</button>' +
        deleteBtn +
      '</div>';
    }).join('');

    // 「新增自訂項目」按鈕（達上限時隱藏）
    const customCount = getCustomCareItems().length;
    const addBtn = customCount >= MAX_CUSTOM_CARE
      ? ''
      : '<button type="button" class="care-edit-add-custom" id="careEditAddCustomBtn">' +
          '<span>＋</span>' +
          '<span>新增自訂項目</span>' +
        '</button>';

    list.innerHTML = itemsHtml + addBtn;

    // 委派處理：點主體切換選擇、點垃圾桶刪除、點新增進入自訂介面
    list.onclick = function (e) {
      const addBtnEl = e.target.closest('#careEditAddCustomBtn');
      if (addBtnEl) { openCustomCareForm(); return; }

      const delBtn = e.target.closest('.care-edit-delete');
      if (delBtn) {
        e.stopPropagation();
        const t = delBtn.dataset.deleteType;
        confirmDeleteCustomCare(t);
        return;
      }

      const main = e.target.closest('.care-edit-item-main');
      if (main) {
        const row = main.closest('.care-edit-item');
        if (row) toggleCareEditItem(row.dataset.careType);
      }
    };
  }

  function toggleCareEditItem(type) {
    const idx = careEditDraft.indexOf(type);
    if (idx !== -1) {
      // 取消選擇
      careEditDraft.splice(idx, 1);
    } else {
      // 新增選擇
      if (careEditDraft.length >= MAX_CARE_SELECTION) {
        showToast('最多選 ' + MAX_CARE_SELECTION + ' 項喔。\n要先取消一項才能加新的。', 2400);
        return;
      }
      careEditDraft.push(type);
    }
    renderCareEditList();
    updateCareEditCount();
  }

  function updateCareEditCount() {
    const el = document.getElementById('careEditCount');
    el.textContent = '已選 ' + careEditDraft.length + ' / ' + MAX_CARE_SELECTION;
    el.classList.toggle('full', careEditDraft.length >= MAX_CARE_SELECTION);
  }

  function saveCareEdit() {
    if (careEditDraft.length === 0) {
      showToast('至少選一項吧。', 1800);
      return;
    }
    setCareSelection(careEditDraft);
    closeCareEdit();
    showToast('改好了。', 1600);
    renderHomeCareStatus();
  }

  // ============================================================
  // V1.6: 新增自訂照顧項目 — 表單對話框
  // ============================================================

  // 暫存目前挑的 emoji
  let customCareEmojiDraft = CUSTOM_CARE_EMOJIS[0];

  function openCustomCareForm() {
    if (getCustomCareItems().length >= MAX_CUSTOM_CARE) {
      showToast('最多自訂 ' + MAX_CUSTOM_CARE + ' 項。', 2200);
      return;
    }
    document.getElementById('customCareNameInput').value = '';
    customCareEmojiDraft = CUSTOM_CARE_EMOJIS[0];
    renderCustomCareEmojiGrid();
    document.getElementById('customCareMask').hidden = false;
    // 自動 focus 名稱欄位
    setTimeout(function () {
      document.getElementById('customCareNameInput').focus();
    }, 200);
  }

  function closeCustomCareForm() {
    document.getElementById('customCareMask').hidden = true;
  }

  function renderCustomCareEmojiGrid() {
    const grid = document.getElementById('customCareEmojiGrid');
    grid.innerHTML = CUSTOM_CARE_EMOJIS.map(function (e) {
      const cls = 'custom-care-emoji-btn' + (e === customCareEmojiDraft ? ' selected' : '');
      return '<button type="button" class="' + cls + '" data-emoji="' + escapeAttr(e) + '">' +
        escapeHtml(e) +
      '</button>';
    }).join('');

    grid.onclick = function (ev) {
      const btn = ev.target.closest('.custom-care-emoji-btn');
      if (!btn) return;
      customCareEmojiDraft = btn.dataset.emoji;
      renderCustomCareEmojiGrid();
    };
  }

  function saveCustomCareForm() {
    const label = document.getElementById('customCareNameInput').value;
    const result = addCustomCare(label, customCareEmojiDraft);
    if (!result.ok) {
      showToast(result.message, 2400);
      return;
    }
    closeCustomCareForm();
    showToast('加好了。', 1400);
    // 重新渲染編輯清單（讓新項目立刻出現可以勾選）
    renderCareEditList();
  }

  function confirmDeleteCustomCare(type) {
    const item = getCustomCareMap()[type];
    if (!item) return;
    showConfirm(
      '要刪掉「' + item.label + '」嗎',
      '刪掉後就不會在清單裡，\n但過去的紀錄都還在。',
      function () {
        deleteCustomCare(type);
        // careEditDraft 也要同步（雖然 setCareSelection 內部會清，但這裡是 draft，還沒寫入）
        const idx = careEditDraft.indexOf(type);
        if (idx !== -1) careEditDraft.splice(idx, 1);
        renderCareEditList();
        updateCareEditCount();
        showToast('刪掉了。', 1400);
      }
    );
  }


  // ============================================================
  // V1.5: 匯出 / 匯入設定 — UI 控制
  // ============================================================

  function openExportModal() {
    const code = exportData();
    if (!code) {
      showToast('產生設定碼時遇到問題，請再試一次。', 2400);
      return;
    }
    const ta = document.getElementById('exportCode');
    ta.value = code;

    // 顯示摘要：這次匯出包含什麼
    renderExportSummary();

    // 偵測 Web Share API 支援度
    const shareBtn = document.getElementById('exportShareBtn');
    if (navigator.share) {
      shareBtn.hidden = false;
    } else {
      shareBtn.hidden = true;
    }

    document.getElementById('exportMask').hidden = false;
  }

  function renderExportSummary() {
    const el = document.getElementById('exportSummary');
    const lines = [];
    const name = (function () {
      try { return localStorage.getItem(KEYS.personName); } catch (e) { return null; }
    })();
    if (name && name.trim()) {
      lines.push('<div class="backup-summary-line"><span class="label">稱呼</span><span class="value">' + escapeHtml(name) + '</span></div>');
    }
    const notes = loadList(KEYS.familyNotes);
    if (notes.length > 0) {
      lines.push('<div class="backup-summary-line"><span class="label">給自己的話</span><span class="value">' + notes.length + ' 句</span></div>');
    }
    const stories = loadList(KEYS.stories);
    if (stories.length > 0) {
      lines.push('<div class="backup-summary-line"><span class="label">想一想的回憶</span><span class="value">' + stories.length + ' 段</span></div>');
    }
    const collection = loadList(KEYS.visitorCollection);
    if (collection.length > 0) {
      lines.push('<div class="backup-summary-line"><span class="label">來訪收藏冊</span><span class="value">' + collection.length + ' 張</span></div>');
    }
    const customs = getCustomCareItems();
    if (customs.length > 0) {
      lines.push('<div class="backup-summary-line"><span class="label">自訂照顧項目</span><span class="value">' + customs.length + ' 項</span></div>');
    }

    if (lines.length === 0) {
      el.innerHTML = '<div style="text-align:center;color:var(--text-faint);">這份設定碼還沒有什麼內容，<br>之後再產生也可以。</div>';
    } else {
      el.innerHTML = lines.join('');
    }
  }

  function closeExportModal() {
    document.getElementById('exportMask').hidden = true;
  }

  function copyExportCode() {
    const ta = document.getElementById('exportCode');
    const text = ta.value;
    if (!text) return;

    function ok() { showToast('設定碼已經複製。\n貼到 Line、記事本，或寄給自己都行。', 3000); }
    function fallback() {
      ta.select();
      ta.setSelectionRange(0, ta.value.length);
      try {
        document.execCommand('copy');
        ok();
      } catch (e) {
        showToast('長按下面的文字也可以複製。', 2800);
      }
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(ok).catch(fallback);
    } else {
      fallback();
    }
  }

  function shareExportCode() {
    const text = document.getElementById('exportCode').value;
    if (!text || !navigator.share) return;
    navigator.share({
      title: '日日安心 — 設定碼',
      text: '我的《日日安心》設定碼（換手機時可用）：\n\n' + text
    }).catch(function () { /* 使用者取消分享，不打擾 */ });
  }

  // V1.7: 下載備份檔
  function downloadBackup() {
    const code = exportData();
    if (!code) {
      showToast('產生備份時遇到問題，請再試一次。', 2400);
      return;
    }

    // 檔名：日日安心-備份-2026-05-13.txt
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const filename = '日日安心-備份-' + yyyy + '-' + mm + '-' + dd + '.txt';

    try {
      const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      // iOS Safari 需要把 anchor 加到 DOM 才會觸發下載
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // 延遲一下再釋放 URL，避免 iOS Safari 下載被中斷
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);

      showToast('備份檔已下載。\n你可以在「檔案」App 找到它。', 2800);
    } catch (e) {
      showToast('下載備份時遇到問題。\n你可以改用「進階」裡的文字代碼。', 3200);
    }
  }

  function openImportModal() {
    document.getElementById('importCode').value = '';
    document.getElementById('importFileInput').value = '';
    document.getElementById('importFileStatus').hidden = true;
    document.getElementById('importFileStatus').textContent = '';
    document.getElementById('importMask').hidden = false;
  }

  function closeImportModal() {
    document.getElementById('importMask').hidden = true;
  }

  // V1.7: 觸發 file picker
  function triggerImportFilePicker() {
    document.getElementById('importFileInput').click();
  }

  // V1.7: file picker 選好檔案後
  function onImportFileChosen(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const statusEl = document.getElementById('importFileStatus');
    statusEl.hidden = false;
    statusEl.classList.remove('error');
    statusEl.innerHTML = '正在讀取 <span class="filename">' + escapeHtml(file.name) + '</span>...';

    const reader = new FileReader();
    reader.onload = function () {
      const code = String(reader.result || '');
      processImport(code, file.name);
    };
    reader.onerror = function () {
      statusEl.classList.add('error');
      statusEl.textContent = '檔案讀取失敗，請再試一次。';
    };
    reader.readAsText(file, 'utf-8');
  }

  // V1.7: 統一的匯入處理（從檔案或從進階代碼都會走這裡）
  function processImport(code, sourceLabel) {
    const peek = parseImportCode(code);
    if (!peek.ok) {
      const statusEl = document.getElementById('importFileStatus');
      statusEl.hidden = false;
      statusEl.classList.add('error');
      statusEl.textContent = peek.message;
      return;
    }

    // 顯示二次確認
    const summary = peek.summary;
    let summaryText = '即將覆蓋成：\n';
    if (summary.personName) summaryText += '· 稱呼\n';
    if (summary.familyNotes > 0) summaryText += '· 給自己的話 ' + summary.familyNotes + ' 句\n';
    if (summary.stories > 0) summaryText += '· 回憶 ' + summary.stories + ' 段\n';
    if (summary.visitorCollection > 0) summaryText += '· 收藏冊 ' + summary.visitorCollection + ' 張\n';
    if (summary.customCare > 0) summaryText += '· 自訂照顧項目 ' + summary.customCare + ' 項\n';
    summaryText += '\n這台手機現在的設定會被覆蓋掉。';

    showConfirm(
      '要載入這份備份嗎',
      summaryText.trim(),
      function () {
        applyImportPayload(peek.payload);
        closeImportModal();
        showToast('設定已經載入了。', 2400);
        loadFontSize();
        goTo('home');
      }
    );
  }

  // 從「進階：手動貼上代碼」載入
  function confirmImportFromText() {
    const code = document.getElementById('importCode').value;
    if (!code.trim()) {
      showToast('請先貼上代碼。', 1800);
      return;
    }
    processImport(code, '代碼');
  }



  function renderSummary() {
    const today = todayKey();
    const acts = loadList(KEYS.activity).filter(function (a) { return dateKeyOf(a.createdAt) === today; });
    const cares = loadList(KEYS.care).filter(function (a) { return dateKeyOf(a.createdAt) === today; });
    const stories = loadList(KEYS.stories).filter(function (a) { return dateKeyOf(a.createdAt) === today; });
    const moods = loadList(KEYS.mood).filter(function (a) { return dateKeyOf(a.createdAt) === today; });

    const games = acts.filter(function (a) { return a.type === 'game'; }).length;
    const lifeActs = acts.filter(function (a) { return a.type === 'lifeAction'; }).length;
    const messages = acts.filter(function (a) { return a.type === 'familyMessage'; }).length;
    // V1.2: 收藏訪客的次數
    const visitorCollects = acts.filter(function (a) {
      return a.type === 'visitor' && a.label.indexOf('收藏') === 0;
    }).length;

    const el = document.getElementById('summaryContent');
    const lines = [];

    // V1.1: 心情放第一行
    if (moods.length > 0) {
      const latest = moods[moods.length - 1];
      const m = MOOD_BY_TYPE[latest.type];
      const emoji = m ? '<span class="summary-mood-emoji">' + m.emoji + '</span>' : '';
      lines.push(emoji + '今天心情：' + escapeHtml(latest.label));
    }
    if (visitorCollects > 0) lines.push('收藏了今天的小訪客');
    if (games > 0) lines.push('今天玩了 ' + games + ' 次小遊戲');
    if (lifeActs > 0) lines.push('完成了 ' + lifeActs + ' 個生活小行動');
    if (cares.length > 0) lines.push('照顧自己 ' + cares.length + ' 次');
    if (stories.length > 0) lines.push('留下了 ' + stories.length + ' 段回憶');
    if (messages > 0) lines.push('傳了 ' + messages + ' 句話給家人');

    if (lines.length === 0) {
      el.innerHTML = '<div class="summary-empty">今天還很安靜。<br>沒關係，慢慢來，平安就好。</div>';
    } else {
      el.innerHTML = lines.map(function (s) { return '<div class="summary-item">' + s + '</div>'; }).join('');
    }
  }

  // ============================================================
  // 七、玩一下 (Play)
  // ============================================================

  let gameState = null;

  function renderPlay() {
    document.getElementById('gameSelect').hidden = false;
    document.getElementById('gamePlay').hidden = true;
    gameState = null;
  }

  function startGame(kind) {
    document.getElementById('gameSelect').hidden = true;
    document.getElementById('gamePlay').hidden = false;
    document.getElementById('gameFeedback').hidden = true;
    // 重置遊戲動作列的 class（避免「找一找」的 find-actions 殘留到其他遊戲）
    document.getElementById('gameActions').className = 'game-actions';

    if (kind === 'idiom') startIdiom();
    else if (kind === 'riddle') startRiddle();
    else if (kind === 'memory') startMemory();
    else if (kind === 'find') startFind();
  }

  function startIdiom() {
    const q = randomFrom(IDIOM_QUESTIONS);
    gameState = { kind: 'idiom', label: '成語補字', question: q, answered: false };
    document.getElementById('gamePrompt').textContent = '成 · 語 · 補 · 字';
    // 把 ＿ 換成樣式
    const qText = q.question.replace('＿', '<span class="blank">　</span>');
    document.getElementById('gameQuestion').innerHTML = qText;
    renderOptions(q.options, q.answer, q.blessing);
    renderGameActions();
  }

  function startRiddle() {
    const q = randomFrom(RIDDLE_QUESTIONS);
    gameState = { kind: 'riddle', label: '今日小謎語', question: q, answered: false };
    document.getElementById('gamePrompt').textContent = '今 · 日 · 小 · 謎 · 語';
    document.getElementById('gameQuestion').textContent = q.question;
    renderOptions(q.options, q.answer, q.blessing);
    renderGameActions();
  }

  function startMemory() {
    const set = randomFrom(MEMORY_SETS);
    gameState = { kind: 'memory', label: '記憶小花園', set: set, phase: 'show', answered: false };

    document.getElementById('gamePrompt').textContent = '記 · 憶 · 小 · 花 · 園';
    // 顯示物品 phase
    const qHtml = '<div style="font-size:var(--fs-md);color:var(--text-soft);margin-bottom:18px;letter-spacing:0.05em;">先看看下面三樣東西，記住它們</div>' +
      '<div class="memory-items">' +
      set.items.map(function (x) { return '<div class="memory-item">' + x + '</div>'; }).join('') +
      '</div>';
    document.getElementById('gameQuestion').innerHTML = qHtml;
    document.getElementById('gameOptions').innerHTML = '';
    document.getElementById('gameFeedback').hidden = true;

    const actions = document.getElementById('gameActions');
    actions.innerHTML = '';
    const ready = document.createElement('button');
    ready.className = 'btn-primary';
    ready.textContent = '我看完了';
    ready.addEventListener('click', function () { memoryGoToQuestion(); });
    actions.appendChild(ready);

    const back = document.createElement('button');
    back.className = 'btn-secondary';
    back.textContent = '回遊戲列表';
    back.addEventListener('click', function () { renderPlay(); });
    actions.appendChild(back);
  }

  function memoryGoToQuestion() {
    if (!gameState || gameState.kind !== 'memory') return;
    gameState.phase = 'question';
    const set = gameState.set;
    document.getElementById('gameQuestion').textContent = set.question;
    renderOptions(set.options, set.answer, '剛剛有出現的是：' + set.items.join('、') + '。');
    renderGameActions();
  }

  // V1.1: 找一找
  function startFind(prevIndex) {
    let idx;
    if (typeof prevIndex === 'number') {
      idx = randomIndex(FIND_PROMPTS, prevIndex);
    } else {
      idx = Math.floor(Math.random() * FIND_PROMPTS.length);
    }
    gameState = { kind: 'find', label: '找一找', index: idx, answered: false };

    document.getElementById('gamePrompt').textContent = '找 · 一 · 找';
    // 自訂版面：大字 prompt + 三個直向按鈕
    document.getElementById('gameQuestion').innerHTML =
      '<div class="find-prompt-card">' +
        '<div class="find-prompt-icon">🔍</div>' +
        '<div class="find-prompt-text">' + escapeHtml(FIND_PROMPTS[idx]) + '</div>' +
      '</div>';
    document.getElementById('gameOptions').innerHTML = '';
    document.getElementById('gameFeedback').hidden = true;

    const actions = document.getElementById('gameActions');
    actions.className = 'game-actions find-actions';
    actions.innerHTML = '';

    const foundBtn = document.createElement('button');
    foundBtn.className = 'btn-primary';
    foundBtn.textContent = '我找到了';
    foundBtn.addEventListener('click', findOnFound);
    actions.appendChild(foundBtn);

    const changeBtn = document.createElement('button');
    changeBtn.className = 'btn-secondary';
    changeBtn.textContent = '換一題';
    changeBtn.addEventListener('click', function () { startFind(gameState.index); });
    actions.appendChild(changeBtn);

    const skipBtn = document.createElement('button');
    skipBtn.className = 'btn-secondary';
    skipBtn.textContent = '今天先不找';
    skipBtn.addEventListener('click', function () {
      renderPlay();
    });
    actions.appendChild(skipBtn);
  }

  function findOnFound() {
    if (!gameState || gameState.kind !== 'find' || gameState.answered) return;
    gameState.answered = true;

    // 紀錄活動（type: game, label: 找一找）→ 增加一朵平安花
    addActivity('game', '找一找');

    const fb = document.getElementById('gameFeedback');
    fb.hidden = false;
    fb.classList.remove('warm');
    fb.innerHTML = '很好。今天也認真看了一眼身邊的東西。' +
      '<span class="blessing-line">小小的觀察，也是日子裡的一份禮物。</span>';

    // 動作改為「再找一個」「回遊戲列表」「回首頁」
    const actions = document.getElementById('gameActions');
    actions.className = 'game-actions';
    actions.innerHTML = '';

    const again = document.createElement('button');
    again.className = 'btn-primary';
    again.textContent = '再找一個';
    again.addEventListener('click', function () { startFind(gameState.index); });
    actions.appendChild(again);

    const back = document.createElement('button');
    back.className = 'btn-secondary';
    back.textContent = '回遊戲列表';
    back.addEventListener('click', renderPlay);
    actions.appendChild(back);
  }

  function renderOptions(options, answer, blessing) {
    const optsEl = document.getElementById('gameOptions');
    optsEl.innerHTML = '';
    options.forEach(function (opt) {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = opt;
      btn.addEventListener('click', function () {
        if (gameState && gameState.answered) return;
        onAnswerClicked(btn, opt, answer, blessing);
      });
      optsEl.appendChild(btn);
    });
  }

  function onAnswerClicked(btn, picked, answer, blessing) {
    if (!gameState) return;
    gameState.answered = true;

    const isRight = picked === answer;
    const allBtns = document.querySelectorAll('#gameOptions .option-btn');
    allBtns.forEach(function (b) {
      b.disabled = true;
      if (b.textContent === answer) b.classList.add('correct');
      else if (b === btn && !isRight) b.classList.add('wrong');
      else b.classList.add('dim');
    });

    const fb = document.getElementById('gameFeedback');
    fb.hidden = false;
    fb.classList.toggle('warm', !isRight);

    let feedbackText;
    if (gameState.kind === 'memory') {
      feedbackText = isRight ? '記得很好，今天也有動動腦。' : '沒關係，慢慢玩就好。';
    } else if (isRight) {
      feedbackText = '很好。';
    } else {
      feedbackText = '沒關係，慢慢來。答案是「' + answer + '」。';
    }

    fb.innerHTML = feedbackText + '<span class="blessing-line">' + blessing + '</span>';

    // 記錄今日玩過 + 增加一朵平安花
    addActivity('game', gameState.label);

    renderGameActions(true);
  }

  function renderGameActions(showRestart) {
    const actions = document.getElementById('gameActions');
    actions.innerHTML = '';

    if (showRestart) {
      const again = document.createElement('button');
      again.className = 'btn-primary';
      again.textContent = '再玩一題';
      again.addEventListener('click', function () { startGame(gameState.kind); });
      actions.appendChild(again);
    }

    const back = document.createElement('button');
    back.className = 'btn-secondary';
    back.textContent = showRestart ? '回遊戲列表' : '回遊戲列表';
    back.addEventListener('click', function () { renderPlay(); });
    actions.appendChild(back);
  }

  // ============================================================
  // 八、想一想 (Think / Story)
  // ============================================================

  let currentStoryPrompt = null;  // V1.1: 改為物件 {text, defaultCategory}
  let currentStoryCategory = '';   // V1.1: 當前選中的主題

  function renderThink() {
    currentStoryPrompt = STORY_PROMPTS[dailySeedIndex(STORY_PROMPTS.length, 7)];
    currentStoryCategory = currentStoryPrompt.defaultCategory;
    document.getElementById('storyPrompt').textContent = currentStoryPrompt.text;
    document.getElementById('storyInput').value = '';
    renderCategoryChips();
    renderRecallCard();   // V1.3: 回憶回放
    renderStoriesHistory();
  }

  // V1.3: 挑選並顯示回憶回放卡
  function renderRecallCard() {
    const card = document.getElementById('recallCard');
    const story = pickRecallStory();
    if (!story) {
      card.hidden = true;
      return;
    }
    card.hidden = false;

    // 用「幾天/週/月前」的自然語言搭配「你那時候寫過⋯⋯」
    const ago = timeAgoLabel(story.createdAt);
    const intro = ago === '今天' ? '今天稍早您寫過：'
                : ago === '昨天' ? '昨天您寫過：'
                : ago + '的這一段，您寫過：';

    document.getElementById('recallLabel').textContent = '以 · 前 · 的 · 這 · 一 · 段';
    document.getElementById('recallPrompt').textContent = intro;
    document.getElementById('recallContent').textContent = story.content;

    // 顯示當時的問題（如果有的話）作為小標
    let meta = '— ' + formatDateLabel(story.createdAt);
    if (story.prompt) {
      meta += ' · ' + story.prompt;
    }
    document.getElementById('recallMeta').textContent = meta;
  }

  // V1.3: 挑回憶。每天首次進想一想時挑一則，當天不換。
  //
  // 優先序：
  //   1. 有「整週／整月／整年」紀念日意義（誤差 ±1 天內）的回憶
  //   2. 超過 14 天沒被回放過的隨機一則
  //   3. 都沒符合條件 → 不顯示
  function pickRecallStory() {
    const stories = loadList(KEYS.stories);
    if (stories.length === 0) return null;

    const today = todayKey();

    // 檢查是否今天已挑過
    let cached = null;
    try {
      const raw = localStorage.getItem(KEYS.todayRecall);
      if (raw) cached = JSON.parse(raw);
    } catch (e) {}

    if (cached && cached.date === today) {
      // 從已有 stories 裡找對應的
      const found = stories.find(function (s) { return s.id === cached.storyId; });
      if (found) return found;
      // 若找不到（被刪除），落回正常挑選流程
    }

    // 排除「今天才寫」的回憶，那不算回憶
    const candidates = stories.filter(function (s) {
      return daysSince(s.createdAt) >= 1;
    });
    if (candidates.length === 0) return null;

    // 優先：找紀念日（恰好 7、30、365 天的倍數，±1 天內）
    const anniversaries = candidates.filter(function (s) {
      const d = daysSince(s.createdAt);
      return (
        (d >= 6 && d <= 8) ||      // 一週
        (d >= 29 && d <= 31) ||    // 一個月
        (d >= 59 && d <= 61) ||    // 兩個月
        (d >= 89 && d <= 91) ||    // 三個月
        (d >= 179 && d <= 181) ||  // 半年
        (d >= 364 && d <= 366)     // 一年
      );
    });

    let picked;
    if (anniversaries.length > 0) {
      picked = anniversaries[Math.floor(Math.random() * anniversaries.length)];
    } else {
      // 從候選裡隨機挑一則
      picked = candidates[Math.floor(Math.random() * candidates.length)];
    }

    // 記下今天挑了誰
    try {
      localStorage.setItem(KEYS.todayRecall, JSON.stringify({
        date: today,
        storyId: picked.id
      }));
    } catch (e) {}

    return picked;
  }

  function pickAnotherStoryPrompt() {
    // 隨機選一個不同的
    let idx;
    do {
      idx = Math.floor(Math.random() * STORY_PROMPTS.length);
    } while (STORY_PROMPTS[idx] === currentStoryPrompt && STORY_PROMPTS.length > 1);
    currentStoryPrompt = STORY_PROMPTS[idx];
    currentStoryCategory = currentStoryPrompt.defaultCategory;
    document.getElementById('storyPrompt').textContent = currentStoryPrompt.text;
    renderCategoryChips();
  }

  // V1.1: 主題晶片
  function renderCategoryChips() {
    const wrap = document.getElementById('categoryChips');
    if (!wrap) return;
    wrap.innerHTML = '';
    STORY_CATEGORIES.forEach(function (cat) {
      const chip = document.createElement('button');
      chip.className = 'category-chip' + (cat === currentStoryCategory ? ' selected' : '');
      chip.textContent = cat;
      chip.addEventListener('click', function () {
        currentStoryCategory = cat;
        renderCategoryChips();
      });
      wrap.appendChild(chip);
    });
  }

  function saveCurrentStory() {
    const input = document.getElementById('storyInput');
    const content = input.value.trim();
    if (!content) {
      showToast('現在不寫也沒關係，\n想起來時再回來。', 2600);
      return;
    }
    if (!currentStoryPrompt) return;
    addStory(currentStoryPrompt.text, content, currentStoryCategory);
    input.value = '';
    showToast('這段回憶已經好好收起來了。', 2600);
    renderStoriesHistory();
  }

  function renderStoriesHistory() {
    const el = document.getElementById('storiesHistory');
    const stories = loadList(KEYS.stories).slice().reverse();
    if (stories.length === 0) {
      el.innerHTML = '';
      return;
    }
    let html = '<div class="stories-history-title">以前留下的回憶</div>';
    stories.slice(0, 20).forEach(function (s) {
      const catTag = s.category
        ? '<div><span class="story-item-category">' + escapeHtml(s.category) + '</span></div>'
        : '';
      html += '<div class="story-item">' +
        '<div class="story-item-date">' + formatDateLabel(s.createdAt) + '</div>' +
        catTag +
        '<div class="story-item-prompt">' + escapeHtml(s.prompt) + '</div>' +
        '<div class="story-item-content">' + escapeHtml(s.content) + '</div>' +
        '</div>';
    });
    el.innerHTML = html;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // ============================================================
  // 九、動一動 (Move / Life Action)
  // ============================================================

  let currentActionIndex = -1;

  function renderMove() {
    currentActionIndex = randomIndex(LIFE_ACTIONS, currentActionIndex);
    drawActionCard();
  }

  function drawActionCard() {
    const act = LIFE_ACTIONS[currentActionIndex];
    const el = document.getElementById('actionCard');
    el.classList.remove('action-done');
    el.innerHTML =
      '<div class="action-emoji">' + act.emoji + '</div>' +
      '<div class="action-title">' + act.title + '</div>' +
      '<div class="action-desc">' + act.description + '</div>' +
      '<div class="action-actions">' +
        '<button class="btn-secondary" id="actionChangeBtn">換一個</button>' +
        '<button class="btn-primary" id="actionDoneBtn">' + act.doneText + '</button>' +
      '</div>';

    document.getElementById('actionChangeBtn').addEventListener('click', function () {
      currentActionIndex = randomIndex(LIFE_ACTIONS, currentActionIndex);
      drawActionCard();
    });
    document.getElementById('actionDoneBtn').addEventListener('click', function () {
      const a = LIFE_ACTIONS[currentActionIndex];
      addActivity('lifeAction', a.title);
      showDoneActionCard(a);
    });
  }

  function showDoneActionCard(act) {
    const el = document.getElementById('actionCard');
    el.classList.add('action-done');
    el.innerHTML =
      '<div class="action-emoji">🌷</div>' +
      '<div class="action-title">很好</div>' +
      '<div class="action-desc">今天又和生活連上一點點。<br>剛剛做了：' + act.title + '</div>' +
      '<div class="action-actions">' +
        '<button class="btn-secondary" id="actionAgainBtn">再來一個</button>' +
        '<button class="btn-primary" id="actionHomeBtn">回首頁看花園</button>' +
      '</div>';
    document.getElementById('actionAgainBtn').addEventListener('click', function () {
      currentActionIndex = randomIndex(LIFE_ACTIONS, currentActionIndex);
      drawActionCard();
    });
    document.getElementById('actionHomeBtn').addEventListener('click', function () {
      goTo('home');
    });
  }

  // ============================================================
  // 十、說一句 (Say / Family Message)
  // ============================================================

  function renderSay() {
    document.getElementById('sayResult').hidden = true;
    document.getElementById('sayList').hidden = false;

    const list = document.getElementById('sayList');
    list.innerHTML = '';
    FAMILY_MESSAGES.forEach(function (m, idx) {
      const btn = document.createElement('button');
      btn.className = 'say-btn';
      btn.innerHTML = '<div class="say-btn-emoji">' + m.emoji + '</div>' +
        '<div class="say-btn-text">' + m.label + '</div>';
      btn.addEventListener('click', function () { showSayResult(idx); });
      list.appendChild(btn);
    });
  }

  function showSayResult(idx) {
    const m = FAMILY_MESSAGES[idx];
    document.getElementById('sayList').hidden = true;
    const res = document.getElementById('sayResult');
    res.hidden = false;
    document.getElementById('sayResultText').textContent = m.text;
    // remember for copy
    res.dataset.text = m.text;
    res.dataset.label = m.label;
  }

  function copySayMessage() {
    const res = document.getElementById('sayResult');
    const text = res.dataset.text || '';
    if (!text) return;

    function ok() {
      addActivity('familyMessage', res.dataset.label || '訊息');
      showToast('已經複製好了，可以貼給家人。', 2600);
    }
    function fallback() {
      // 選取文字方便手動複製
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        ok();
      } catch (e) {
        showToast('長按文字也可以複製喔。', 2800);
      }
      document.body.removeChild(ta);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(ok).catch(fallback);
    } else {
      fallback();
    }
  }

  // 用 Line 傳給家人：開啟 Line 分享連結
  // 手機上有裝 Line 會直接跳到 Line app 並預填文字，
  // 沒裝 Line 則會開啟 line.me 網頁分享頁面。
  function sendSayViaLine() {
    const res = document.getElementById('sayResult');
    const text = res.dataset.text || '';
    if (!text) return;

    const label = res.dataset.label || '訊息';
    const shareUrl = 'https://line.me/R/share?text=' + encodeURIComponent(text);

    // 紀錄成「傳給家人」的活動，跟複製文字一樣 +1 朵平安花
    addActivity('familyMessage', label);

    // 開啟 Line 分享。用 _blank 避免覆蓋當前 App。
    // 部分行動瀏覽器會把它當成 deep link 啟動 Line app。
    const opened = window.open(shareUrl, '_blank', 'noopener');
    if (!opened) {
      // 若被瀏覽器阻擋（少見），改用 location 直接跳轉
      window.location.href = shareUrl;
      return;
    }

    showToast('幫你打開 Line 了，\n選一個家人就可以傳。', 2800);
  }

  // ============================================================
  // 十一、照顧 (Care)
  // ============================================================

  function renderCare() {
    const list = document.getElementById('carePageList');
    const todayCares = loadList(KEYS.care).filter(function (c) { return isToday(c.createdAt); });
    const countByType = {};
    todayCares.forEach(function (c) {
      countByType[c.type] = (countByType[c.type] || 0) + 1;
    });

    list.innerHTML = '';
    getAllCareItems().forEach(function (item) {
      const card = document.createElement('div');
      card.className = 'care-page-card' + (countByType[item.type] ? ' done' : '');
      card.innerHTML =
        '<div class="care-page-head">' +
          '<div class="care-page-icon">' + escapeHtml(item.icon) + '</div>' +
          '<div class="care-page-title">' + escapeHtml(item.label) + '</div>' +
          (countByType[item.type] ? '<div class="care-page-count">今天 ' + countByType[item.type] + ' 次</div>' : '') +
        '</div>' +
        '<div class="care-page-desc">' + escapeHtml(item.desc).replace(/\n/g, '<br>') + '</div>' +
        '<button class="care-page-btn">' + escapeHtml(item.btn) + '</button>';

      card.querySelector('.care-page-btn').addEventListener('click', function () {
        addCareRecord(item.type);
        showToast('已經記下來了。\n今天有照顧自己，很好。', 2400);
        renderCare();
      });

      list.appendChild(card);
    });

    // 今日紀錄
    const todayList = document.getElementById('careTodayList');
    if (todayCares.length === 0) {
      todayList.innerHTML = '<div class="care-today-empty">今天還沒有紀錄。<br>什麼時候想到，再記就好。</div>';
    } else {
      const sorted = todayCares.slice().sort(function (a, b) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      todayList.innerHTML = sorted.map(function (c) {
        return '<div class="care-today-item">' +
          '<span>' + (CARE_ITEMS.find(function (x) { return x.type === c.type; }) || {}).icon + ' ' + escapeHtml(c.label) + '</span>' +
          '<span class="care-today-time">' + formatTimeShort(c.createdAt) + '</span>' +
          '</div>';
      }).join('');
    }
  }

  // ============================================================
  // 十二、設定 (Settings)
  // ============================================================

  function applyFontSize(size) {
    document.body.classList.remove('fs-large', 'fs-xlarge');
    if (size === 'large') document.body.classList.add('fs-large');
    else if (size === 'xlarge') document.body.classList.add('fs-xlarge');
    try { localStorage.setItem(KEYS.fontSize, size); } catch (e) {}
    document.querySelectorAll('.font-size-btn').forEach(function (b) {
      b.classList.toggle('active', b.dataset.fs === size);
    });
  }

  function loadFontSize() {
    let size = 'normal';
    try { size = localStorage.getItem(KEYS.fontSize) || 'normal'; } catch (e) {}
    applyFontSize(size);
  }

  function renderSettings() {
    let size = 'normal';
    try { size = localStorage.getItem(KEYS.fontSize) || 'normal'; } catch (e) {}
    document.querySelectorAll('.font-size-btn').forEach(function (b) {
      b.classList.toggle('active', b.dataset.fs === size);
    });

    // V1.1: 稱呼
    renderNameSection();

    // V1.1: 家人留言管理
    renderFamilyNotesList();
  }

  // V1.1: 稱呼設定區塊渲染
  function renderNameSection() {
    const name = getPersonName();
    const isPreset = NAME_PRESETS.indexOf(name) !== -1;
    document.querySelectorAll('.name-btn').forEach(function (b) {
      const preset = b.dataset.namePreset;
      if (preset === 'custom') {
        b.classList.toggle('active', !isPreset);
      } else {
        b.classList.toggle('active', preset === name);
      }
    });
    // 自訂列只在自訂時展開
    const row = document.getElementById('nameCustomRow');
    const input = document.getElementById('nameInput');
    if (!isPreset) {
      row.hidden = false;
      input.value = name;
    } else {
      row.hidden = true;
      input.value = '';
    }
  }

  // V1.1: 家人留言管理列表
  function renderFamilyNotesList() {
    const list = document.getElementById('familyNotesList');
    const notes = loadList(KEYS.familyNotes);
    if (notes.length === 0) {
      list.innerHTML = '<div class="family-notes-empty">還沒有寫下任何一句話。<br>寫一句給自己，會出現在首頁。</div>';
      return;
    }
    list.innerHTML = notes.slice().reverse().map(function (n) {
      return '<div class="family-note-item">' +
        '<div class="family-note-item-text">' + escapeHtml(n.content) + '</div>' +
        '<button class="family-note-item-delete" data-note-id="' + n.id + '" aria-label="刪除這句">✕</button>' +
        '</div>';
    }).join('');
  }

  // ============================================================
  // 十三、事件綁定
  // ============================================================

  function wireEvents() {
    // 主導覽 + 任何 data-go 按鈕
    document.addEventListener('click', function (e) {
      const goEl = e.target.closest('[data-go]');
      if (goEl) {
        e.preventDefault();
        goTo(goEl.dataset.go);
      }
    });

    // brand 回首頁
    document.getElementById('brandHome').addEventListener('click', function () { goTo('home'); });
    document.getElementById('brandHome').addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goTo('home'); }
    });

    // 設定按鈕
    document.getElementById('settingsBtn').addEventListener('click', function () { goTo('settings'); });

    // 首頁照顧按鈕（事件委派，因為清單是動態渲染的）
    document.getElementById('homeCareList').addEventListener('click', function (e) {
      const btn = e.target.closest('.care-btn');
      if (!btn) return;
      const row = btn.closest('.care-row');
      if (!row) return;
      if (row.classList.contains('done')) {
        // 已記錄今天，仍允許再加一次
        addCareRecord(row.dataset.careType);
        showToast('又記了一次，很好。', 2200);
      } else {
        addCareRecord(row.dataset.careType);
        showToast('已經記下來了。\n今天有照顧自己，很好。', 2400);
      }
      renderHome();
    });

    // V1.4: 編輯按鈕
    document.getElementById('careEditBtn').addEventListener('click', openCareEdit);
    document.getElementById('careEditCancel').addEventListener('click', closeCareEdit);
    document.getElementById('careEditSave').addEventListener('click', saveCareEdit);
    document.getElementById('careEditMask').addEventListener('click', function (e) {
      if (e.target === e.currentTarget) closeCareEdit();
    });

    // V1.6: 自訂項目表單
    document.getElementById('customCareCancelBtn').addEventListener('click', closeCustomCareForm);
    document.getElementById('customCareSaveBtn').addEventListener('click', saveCustomCareForm);
    document.getElementById('customCareMask').addEventListener('click', function (e) {
      if (e.target === e.currentTarget) closeCustomCareForm();
    });
    // Enter 直接送出
    document.getElementById('customCareNameInput').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        saveCustomCareForm();
      }
    });

    // V1.5/V1.7: 匯出 / 匯入設定
    document.getElementById('backupExportBtn').addEventListener('click', openExportModal);
    document.getElementById('backupImportBtn').addEventListener('click', openImportModal);
    // V1.7: 新主流程 — 下載備份檔 / 選擇備份檔
    document.getElementById('exportDownloadBtn').addEventListener('click', downloadBackup);
    document.getElementById('importChooseFileBtn').addEventListener('click', triggerImportFilePicker);
    document.getElementById('importFileInput').addEventListener('change', onImportFileChosen);
    // 進階：複製代碼 / 用代碼載入
    document.getElementById('exportCopyBtn').addEventListener('click', copyExportCode);
    document.getElementById('importLoadBtn').addEventListener('click', confirmImportFromText);
    // 其他控制
    document.getElementById('exportShareBtn').addEventListener('click', shareExportCode);
    document.getElementById('exportCloseBtn').addEventListener('click', closeExportModal);
    document.getElementById('importCancelBtn').addEventListener('click', closeImportModal);
    document.getElementById('exportMask').addEventListener('click', function (e) {
      if (e.target === e.currentTarget) closeExportModal();
    });
    document.getElementById('importMask').addEventListener('click', function (e) {
      if (e.target === e.currentTarget) closeImportModal();
    });

    // V1.6: 自訂照顧項目表單
    document.getElementById('customCareCancelBtn').addEventListener('click', closeCustomCareForm);
    document.getElementById('customCareSaveBtn').addEventListener('click', saveCustomCareForm);
    document.getElementById('customCareMask').addEventListener('click', function (e) {
      if (e.target === e.currentTarget) closeCustomCareForm();
    });
    // Enter 鍵也可以送出
    document.getElementById('customCareNameInput').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        saveCustomCareForm();
      }
    });

    // 遊戲卡片
    document.querySelectorAll('.game-card').forEach(function (c) {
      c.addEventListener('click', function () { startGame(c.dataset.game); });
    });

    // 想一想按鈕
    document.getElementById('storySaveBtn').addEventListener('click', saveCurrentStory);
    document.getElementById('storySkipBtn').addEventListener('click', pickAnotherStoryPrompt);

    // 說一句按鈕
    document.getElementById('sayBackBtn').addEventListener('click', renderSay);
    document.getElementById('sayCopyBtn').addEventListener('click', copySayMessage);
    document.getElementById('sayLineBtn').addEventListener('click', sendSayViaLine);

    // V1.2: 訪客卡按鈕
    document.getElementById('visitorCollectBtn').addEventListener('click', onVisitorCollect);

    // 字體大小
    const FS_LABEL = { normal: '一般', large: '大', xlarge: '特大' };
    document.querySelectorAll('.font-size-btn').forEach(function (b) {
      b.addEventListener('click', function () {
        const size = b.dataset.fs;
        applyFontSize(size);
        showToast('字體已調整為「' + FS_LABEL[size] + '」', 1800);
      });
    });

    // 清除資料
    document.getElementById('clearDataBtn').addEventListener('click', function () {
      showConfirm(
        '清除本機紀錄',
        '確定要清除這台手機上的紀錄嗎？\n清除後就沒辦法找回來了。',
        function () {
          clearAllData();
          showToast('已經清乾淨了。', 2200);
          // 回首頁重新渲染
          goTo('home');
        }
      );
    });

    // ============ V1.1 ============

    // 心情選擇
    document.querySelectorAll('.mood-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const type = btn.dataset.mood;
        addMood(type);
        renderHome(); // 重新渲染含 selected 狀態與摘要
        // 額外給一個 toast 確認，避免長輩不確定有沒有按到
        const m = MOOD_BY_TYPE[type];
        if (m) showToast('記下來了：' + m.label, 1800);
      });
    });

    // 稱呼預設按鈕
    document.querySelectorAll('.name-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const preset = btn.dataset.namePreset;
        if (preset === 'custom') {
          // 切到自訂列；不馬上存
          const row = document.getElementById('nameCustomRow');
          row.hidden = false;
          // 把現有自訂值或 placeholder 顯示出來
          const cur = getPersonName();
          const input = document.getElementById('nameInput');
          if (NAME_PRESETS.indexOf(cur) === -1) {
            input.value = cur;
          } else {
            input.value = '';
          }
          input.focus();
          // 標記 custom 為 active，其他取消
          document.querySelectorAll('.name-btn').forEach(function (b) {
            b.classList.toggle('active', b === btn);
          });
        } else {
          setPersonName(preset);
          showToast('改好了：' + preset, 1800);
          renderNameSection();
        }
      });
    });

    // 自訂稱呼儲存
    document.getElementById('nameSaveBtn').addEventListener('click', function () {
      const v = document.getElementById('nameInput').value.trim();
      if (!v) {
        showToast('還沒填稱呼喔。', 1800);
        return;
      }
      if (v.length > 10) {
        showToast('稱呼短一點比較好。', 1800);
        return;
      }
      setPersonName(v);
      showToast('改好了：' + v, 1800);
      renderNameSection();
    });

    // 自訂稱呼輸入框 Enter 鍵
    document.getElementById('nameInput').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('nameSaveBtn').click();
      }
    });

    // 家人留言：新增
    document.getElementById('familyNoteAddBtn').addEventListener('click', function () {
      const input = document.getElementById('familyNoteInput');
      const v = input.value.trim();
      if (!v) {
        showToast('還沒寫內容喔。', 1800);
        return;
      }
      addFamilyNote(v);
      input.value = '';
      showToast('記下來了，會出現在首頁。', 2200);
      renderFamilyNotesList();
    });

    // 家人留言：刪除（事件委派）
    document.getElementById('familyNotesList').addEventListener('click', function (e) {
      const btn = e.target.closest('.family-note-item-delete');
      if (!btn) return;
      const id = btn.dataset.noteId;
      showConfirm(
        '刪除這句話',
        '確定要刪掉這一句嗎？',
        function () {
          deleteFamilyNote(id);
          renderFamilyNotesList();
          showToast('已經刪掉了。', 1800);
        }
      );
    });
  }

  // ============================================================
  // 十四、初始化
  // ============================================================

  function init() {
    loadFontSize();
    wireEvents();

    // PWA shortcut 或外部連結傳入 #view 名稱時，直接導向該頁
    const validViews = ['home', 'play', 'think', 'move', 'say', 'care', 'album', 'settings'];
    const hash = (window.location.hash || '').replace('#', '');
    if (hash && validViews.indexOf(hash) !== -1) {
      goTo(hash);
    } else {
      goTo('home');
    }

    // 每分鐘檢查一次問候是否該換（跨時段）
    setInterval(function () {
      if (currentView === 'home') {
        const g = getGreeting();
        const helloEl = document.getElementById('greetingHello');
        if (helloEl && helloEl.textContent !== g.hello) {
          renderHome();
        }
      }
    }, 60 * 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* =========================================================
   Service Worker 註冊
   讓 App 可以離線開啟、加入主畫面後跟原生 App 一樣
   ========================================================= */
if ('serviceWorker' in navigator) {
  // 等頁面 load 完才註冊，避免跟初始渲染搶資源
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('service-worker.js')
      .catch(function (err) {
        // 註冊失敗只在 console 紀錄，不打擾使用者
        console.warn('Service Worker 註冊失敗：', err);
      });
  });
}
