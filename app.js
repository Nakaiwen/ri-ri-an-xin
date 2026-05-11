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
      words: '今天也平平安安。\n先喝一點水，慢慢開始今天就好。'
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
      time: '夜 · 已 · 深',
      hello: '夜深了',
      words: '如果還沒睡，也不用急。\n願你心裡安安穩穩，慢慢休息。'
    },
    {
      from: 0, to: 5,
      time: '夜 · 已 · 深',
      hello: '夜深了',
      words: '如果還沒睡，也不用急。\n願你心裡安安穩穩，慢慢休息。'
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

  // --- 成語補字題庫 ---
  const IDIOM_QUESTIONS = [
    { question: '家和萬事＿', options: ['興', '平', '安'], answer: '興', blessing: '願今天家裡也平平安安。' },
    { question: '知足常＿', options: ['樂', '走', '忙'], answer: '樂', blessing: '知足常樂，簡單的日子也有福氣。' },
    { question: '平安就是＿', options: ['福', '急', '吵'], answer: '福', blessing: '平安就是福，今天安穩就很好。' },
    { question: '心寬體＿', options: ['胖', '健', '忙'], answer: '胖', blessing: '心放寬一點，日子也會舒服一點。' },
    { question: '日日是＿日', options: ['好', '忙', '難'], answer: '好', blessing: '日日是好日，慢慢過也很好。' },
    { question: '老當益＿', options: ['壯', '小', '靜'], answer: '壯', blessing: '老當益壯，今天也是好好的一天。' },
    { question: '兒孫自有兒孫＿', options: ['福', '事', '苦'], answer: '福', blessing: '不用太擔心，兒孫自有兒孫福。' },
    { question: '萬事如＿', options: ['意', '舊', '常'], answer: '意', blessing: '願你萬事如意。' }
  ];

  // --- 謎語題庫 ---
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
    { text: '長輩有沒有教過你什麼，到現在你還記得？', defaultCategory: '人生智慧' }
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

  // --- 家人訊息 ---
  const FAMILY_MESSAGES = [
    { emoji: '😊', label: '我今天很好', text: '我今天很好，請你放心。願你今天也平安。' },
    { emoji: '😌', label: '我有點累', text: '我今天有點累，不用擔心。有空時可以跟我說說話。' },
    { emoji: '📞', label: '有空打給我', text: '你有空的時候，可以打給我一下嗎？我想跟你說說話。' },
    { emoji: '💗', label: '我想你了', text: '我今天有點想你。看到訊息不用急，有空再回我就好。' },
    { emoji: '💊', label: '我已經吃藥了', text: '我剛剛已經吃藥了，請放心。' },
    { emoji: '✨', label: '我今天想分享一件事', text: '我今天想起一件小事，想找時間跟你說。' }
  ];

  // --- 照顧項目 ---
  const CARE_ITEMS = [
    { type: 'water', label: '喝水', icon: '💧', desc: '現在可以喝幾口水，讓身體舒服一點。', btn: '我喝了' },
    { type: 'medicine', label: '吃藥', icon: '💊', desc: '如果到了吃藥時間，記得配溫開水。\n如果已經吃了，可以按一下記錄。', btn: '我吃好了' },
    { type: 'bloodPressure', label: '量血壓', icon: '❤️', desc: '如果今天方便，可以量一下血壓，知道身體的狀態。', btn: '我量了' },
    { type: 'walk', label: '散步', icon: '🚶', desc: '如果天氣和身體都可以，慢慢走幾步也很好。', btn: '我走了' },
    { type: 'rest', label: '休息', icon: '🛌', desc: '身體有點累的時候，休息也是很重要的事。', btn: '我休息了' }
  ];

  const CARE_LABEL_BY_TYPE = CARE_ITEMS.reduce((acc, c) => { acc[c.type] = c.label; return acc; }, {});

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
    familyNotes: 'ri_ri_an_xin_family_notes'
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

  function addCareRecord(type) {
    const list = loadList(KEYS.care);
    list.push({
      id: 'care_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
      type: type,
      label: CARE_LABEL_BY_TYPE[type] || type,
      createdAt: new Date().toISOString()
    });
    saveList(KEYS.care, list);
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

    // 祝福（依日期穩定）
    const blessing = BLESSINGS[dailySeedIndex(BLESSINGS.length, 1)];
    document.getElementById('blessingText').textContent = blessing;

    // V1.1: 家人留言（每日穩定挑一則）
    renderFamilyNoteOnHome();

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
  function renderFamilyNoteOnHome() {
    const el = document.getElementById('familyNoteText');
    const notes = loadList(KEYS.familyNotes);
    if (notes.length === 0) {
      el.textContent = '有人惦記著你，今天也不孤單。';
      return;
    }
    const note = notes[dailySeedIndex(notes.length, 3)];
    el.textContent = note.content;
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
      const shown = Math.min(count, 5);
      let html = '';
      for (let i = 0; i < shown; i++) {
        html += '<span class="flower" style="animation-delay:' + (i * 80) + 'ms;">' + FLOWERS[i % FLOWERS.length] + '</span>';
      }
      flowersEl.innerHTML = html;
      countEl.textContent = '今天開了 ' + count + ' 朵';
      hintEl.innerHTML = count >= 3
        ? '今天有好好陪自己。'
        : '剩下的慢慢來。';
      hintEl.classList.remove('hidden');
    }
  }

  // 計算今日「平安花」朵數：所有今日的活動 + 照顧 + 故事 + 心情(V1.1)
  function countTodayFlowers() {
    const acts = loadList(KEYS.activity).filter(function (a) { return isToday(a.createdAt); });
    const cares = loadList(KEYS.care).filter(function (a) { return isToday(a.createdAt); });
    const stories = loadList(KEYS.stories).filter(function (a) { return isToday(a.createdAt); });
    const moods = loadList(KEYS.mood).filter(function (a) { return isToday(a.createdAt); });
    // 心情可以重複按，只算「今天有沒有記」一朵，避免一直按花園爆滿
    const moodFlower = moods.length > 0 ? 1 : 0;
    return acts.length + cares.length + stories.length + moodFlower;
  }

  function renderHomeCareStatus() {
    const todayCares = loadList(KEYS.care).filter(function (c) { return isToday(c.createdAt); });
    const doneTypes = {};
    todayCares.forEach(function (c) { doneTypes[c.type] = true; });

    document.querySelectorAll('#homeCareList .care-row').forEach(function (row) {
      const t = row.dataset.careType;
      const btn = row.querySelector('.care-btn');
      if (doneTypes[t]) {
        row.classList.add('done');
        btn.textContent = '已記錄';
      } else {
        row.classList.remove('done');
        btn.textContent = '我做了';
      }
    });
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

    const el = document.getElementById('summaryContent');
    const lines = [];

    // V1.1: 心情放第一行
    if (moods.length > 0) {
      const latest = moods[moods.length - 1];
      const m = MOOD_BY_TYPE[latest.type];
      const emoji = m ? '<span class="summary-mood-emoji">' + m.emoji + '</span>' : '';
      lines.push(emoji + '今天心情：' + escapeHtml(latest.label));
    }
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
    renderStoriesHistory();
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
    CARE_ITEMS.forEach(function (item) {
      const card = document.createElement('div');
      card.className = 'care-page-card' + (countByType[item.type] ? ' done' : '');
      card.innerHTML =
        '<div class="care-page-head">' +
          '<div class="care-page-icon">' + item.icon + '</div>' +
          '<div class="care-page-title">' + item.label + '</div>' +
          (countByType[item.type] ? '<div class="care-page-count">今天 ' + countByType[item.type] + ' 次</div>' : '') +
        '</div>' +
        '<div class="care-page-desc">' + item.desc.replace(/\n/g, '<br>') + '</div>' +
        '<button class="care-page-btn">' + item.btn + '</button>';

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
      list.innerHTML = '<div class="family-notes-empty">還沒有家人寫的話。<br>請家人寫一句，會出現在首頁。</div>';
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

    // 首頁照顧按鈕
    document.querySelectorAll('#homeCareList .care-row').forEach(function (row) {
      const btn = row.querySelector('.care-btn');
      btn.addEventListener('click', function () {
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

    // 字體大小
    document.querySelectorAll('.font-size-btn').forEach(function (b) {
      b.addEventListener('click', function () { applyFontSize(b.dataset.fs); });
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
      showToast('加好了，會出現在首頁。', 2200);
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
    goTo('home');

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
