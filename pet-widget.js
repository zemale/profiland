/**
 * Profiland Pet Widget v2
 * Система питомцев: заявки, задания, настроение, бонусы
 */

// ══════════════════════════════════════════
// КОНФИГУРАЦИЯ ПИТОМЦЕВ
// ══════════════════════════════════════════
const PETS = {
  desman: {
    emoji:'🦦', name:'Выхухоль', unlocked: true, // всегда доступна
    desc:'Редкое мудрое существо. Всегда рядом.',
    bonus:'Убирает один неверный вариант в квизе',
    bonusKey:'quiz_hint',
    color:'#00CEC9',
    // Задания на счастье — любые активности
    tasks:[
      { type:'quiz',     id:'any',         text:'Пройди любой квиз' },
      { type:'scenario', id:'any',         text:'Пройди любой сценарий' },
      { type:'detective',id:'any',         text:'Разгадай одну загадку в детективе' },
      { type:'quiz',     id:'psychologist',text:'Пройди квиз психолога' },
      { type:'scenario', id:'teacher',     text:'Пройди сценарий учителя' },
    ]
  },
  lion: {
    emoji:'🦁', name:'Лев',
    desc:'Смелый и сильный. За 10 значков.',
    unlockCondition:'Получи 10 значков',
    bonus:'Повтор хода в сценарии без штрафа',
    bonusKey:'scenario_retry',
    color:'#FDCB6E',
    unlockTasks:[
      { type:'scenario', id:'military_officer', text:'Пройди сценарий офицера' },
      { type:'scenario', id:'police_officer',   text:'Пройди сценарий полицейского' },
      { type:'scenario', id:'pilot',            text:'Пройди сценарий пилота' },
      { type:'quiz',     id:'sports_journalist',text:'Пройди квиз спортивного журналиста' },
    ],
    tasks:[
      { type:'scenario', id:'military_officer', text:'Пройди сценарий офицера' },
      { type:'scenario', id:'pilot',            text:'Пройди сценарий пилота' },
      { type:'scenario', id:'police_officer',   text:'Пройди сценарий полицейского' },
      { type:'quiz',     id:'sports_journalist',text:'Пройди квиз спортивного журналиста' },
      { type:'quiz',     id:'referee',          text:'Пройди квиз судьи' },
    ]
  },
  snake: {
    emoji:'🐍', name:'Змея',
    desc:'Хитрая и умная. За 5 квизов.',
    unlockCondition:'Пройди 5 квизов',
    bonus:'Бесплатная улика в игре «Детектив»',
    bonusKey:'detective_clue',
    color:'#6AB04C',
    unlockTasks:[
      { type:'quiz', id:'programmer',    text:'Пройди квиз программиста' },
      { type:'quiz', id:'data_analyst',  text:'Пройди квиз аналитика данных' },
      { type:'quiz', id:'cybersecurity', text:'Пройди квиз специалиста по кибербезопасности' },
      { type:'quiz', id:'scientist',     text:'Пройди квиз учёного' },
    ],
    tasks:[
      { type:'quiz', id:'programmer',    text:'Пройди квиз программиста' },
      { type:'quiz', id:'data_analyst',  text:'Пройди квиз аналитика данных' },
      { type:'quiz', id:'cybersecurity', text:'Пройди квиз специалиста по кибербезопасности' },
      { type:'quiz', id:'physicist',     text:'Пройди квиз физика' },
      { type:'quiz', id:'scientist',     text:'Пройди квиз учёного' },
    ]
  },
  raven: {
    emoji:'🪶', name:'Ворон',
    desc:'Мудрый наблюдатель. За первый трофей.',
    unlockCondition:'Получи районный трофей',
    bonus:'Подсказка Ворона в трофейном испытании',
    bonusKey:'trophy_hint',
    color:'#636E72',
    unlockTasks:[
      { type:'scenario', id:'animator',    text:'Пройди сценарий аниматора' },
      { type:'scenario', id:'journalist',  text:'Пройди сценарий журналиста' },
      { type:'quiz',     id:'musician',    text:'Пройди квиз музыканта' },
      { type:'quiz',     id:'photographer',text:'Пройди квиз фотографа' },
    ],
    tasks:[
      { type:'scenario', id:'animator',    text:'Пройди сценарий аниматора' },
      { type:'scenario', id:'journalist',  text:'Пройди сценарий журналиста' },
      { type:'quiz',     id:'musician',    text:'Пройди квиз музыканта' },
      { type:'quiz',     id:'photographer',text:'Пройди квиз фотографа' },
      { type:'scenario', id:'game_designer',text:'Пройди сценарий геймдизайнера' },
    ]
  },
  deer: {
    emoji:'🦌', name:'Олень',
    desc:'Грациозный странник. За 10 районов.',
    unlockCondition:'Получи значки в 10 районах',
    bonus:'+10 XP после каждого выполненного задания',
    bonusKey:'xp_bonus',
    color:'#55EFC4',
    unlockTasks:[
      { type:'quiz',     id:'ecologist',  text:'Пройди квиз эколога' },
      { type:'scenario', id:'agronomist', text:'Пройди сценарий агронома' },
      { type:'quiz',     id:'forester',   text:'Пройди квиз лесничего' },
      { type:'scenario', id:'city_farmer',text:'Пройди сценарий сити-фермера' },
    ],
    tasks:[
      { type:'quiz',     id:'ecologist',  text:'Пройди квиз эколога' },
      { type:'scenario', id:'agronomist', text:'Пройди сценарий агронома' },
      { type:'quiz',     id:'forester',   text:'Пройди квиз лесничего' },
      { type:'quiz',     id:'entomologist',text:'Пройди квиз энтомолога' },
      { type:'scenario', id:'city_farmer',text:'Пройди сценарий сити-фермера' },
    ]
  }
};

// ══════════════════════════════════════════
// РАБОТА С ДАННЫМИ
// ══════════════════════════════════════════
const KEYS = {
  owned:     'profiland_pets_owned',
  quests:    'profiland_pet_quests',    // {petId: {taskIdx, done}}
  dailyTasks:'profiland_pet_daily',     // {petId: {taskIdx, done, date}}
  moods:     'profiland_pet_moods',     // {petId: 'happy'|'neutral'|'sad'}
  selected:  'profiland_selected_pets',
  lastVisit: 'profiland_last_visit',
};

function load(key, def) { try { return JSON.parse(localStorage.getItem(key) ?? 'null') ?? def; } catch { return def; } }
function save(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
function today() { return new Date().toDateString(); }

function getOwned() {
  const o = load(KEYS.owned, []);
  if (!o.includes('desman')) o.push('desman');
  return o;
}

function isOwned(petId) { return getOwned().includes(petId); }

function getSelected() {
  const s = load(KEYS.selected, ['desman']);
  return s.filter(id => isOwned(id));
}

function saveSelected(arr) { save(KEYS.selected, arr); }

// ── Разблокировка ──
function getQuest(petId) { return load(KEYS.quests, {})[petId] || null; }

function startQuest(petId) {
  const pet = PETS[petId];
  if (!pet || !pet.unlockTasks) return;
  const pool = pet.unlockTasks;
  const idx = Math.floor(Math.random() * pool.length);
  const quests = load(KEYS.quests, {});
  quests[petId] = { taskIdx: idx, done: false };
  save(KEYS.quests, quests);
  return pool[idx];
}

function checkQuestDone(petId) {
  const pet = PETS[petId];
  const quest = getQuest(petId);
  if (!quest || quest.done || !pet) return false;
  const task = pet.unlockTasks[quest.taskIdx];
  if (!task) return false;
  const done = isTaskCompleted(task);
  if (done) {
    const quests = load(KEYS.quests, {});
    quests[petId].done = true;
    save(KEYS.quests, quests);
    const owned = getOwned();
    if (!owned.includes(petId)) { owned.push(petId); save(KEYS.owned, owned); }
  }
  return done;
}

// ── Ежедневные задания ──
function pickBestTask(pet) {
  // Сначала пробуем подобрать задание по интересам пользователя
  const visited = Object.keys(load('profiland_district_map', {}));
  const badges  = load('profiland_badges', []);
  // Профессии из посещённых районов — берём из значков
  const preferred = new Set([...badges, ...visited]);

  // Задания которые совпадают с интересами и ещё не выполнены
  const fresh = pet.tasks.filter(t => !isTaskCompleted(t));
  const matched = fresh.filter(t => t.id === 'any' || preferred.has(t.id));

  // Приоритет: совпадающее + невыполненное → просто невыполненное → любое
  const pool = matched.length > 0 ? matched : (fresh.length > 0 ? fresh : pet.tasks);
  return pet.tasks.indexOf(pool[Math.floor(Math.random() * pool.length)]);
}

function getDailyTask(petId) {
  const daily = load(KEYS.dailyTasks, {});
  const entry = daily[petId];
  if (entry && entry.date === today()) return entry;
  // Новый день — новое задание с учётом интересов
  const pet = PETS[petId];
  if (!pet) return null;
  const idx = pickBestTask(pet);
  const task = pet.tasks[idx];
  // Если задание уже выполнено — сразу happy
  const done = isTaskCompleted(task);
  const newEntry = { taskIdx: idx, done, date: today() };
  daily[petId] = newEntry;
  save(KEYS.dailyTasks, daily);
  return newEntry;
}

function markDailyDone(petId) {
  const daily = load(KEYS.dailyTasks, {});
  if (daily[petId]) { daily[petId].done = true; save(KEYS.dailyTasks, daily); }
}

function isTaskCompleted(task) {
  if (!task) return false;
  if (task.type === 'quiz') {
    if (task.id === 'any') return load('profiland_quiz_done', []).length > 0;
    return load('profiland_quiz_done', []).includes(task.id);
  }
  if (task.type === 'scenario') {
    if (task.id === 'any') return load('profiland_scenario_done', []).length > 0;
    return load('profiland_scenario_done', []).includes(task.id);
  }
  if (task.type === 'detective') {
    return parseInt(localStorage.getItem('profiland_detective_best') || '0') > 0;
  }
  return false;
}

// ── Настроение ──
function getMood(petId) {
  const daily = getDailyTask(petId);
  if (!daily) return 'neutral';
  return daily.done ? 'happy' : 'neutral';
}

// ── Бонусы ──
function isPetHappy(petId) {
  return isOwned(petId) && getSelected().includes(petId) && getMood(petId) === 'happy';
}

// Публичные функции для проверки бонусов из других страниц
window.PET_BONUS = {
  quizHint:      () => isPetHappy('desman'),
  scenarioRetry: () => isPetHappy('lion'),
  detectiveClue: () => isPetHappy('snake'),
  trophyHint:    () => isPetHappy('raven'),
  xpBonus:       () => isPetHappy('deer') ? 10 : 0,
  // Уведомить что задание выполнено
  notifyTaskDone(type, id) {
    Object.keys(PETS).forEach(petId => {
      if (!isOwned(petId)) return;
      const daily = getDailyTask(petId);
      if (!daily || daily.done) return;
      const task = PETS[petId].tasks[daily.taskIdx];
      if (!task) return;
      const matches = task.type === type && (task.id === 'any' || task.id === id);
      if (matches) {
        markDailyDone(petId);
        triggerHappyAnimation(petId);
        showPetNotification(petId);
      }
    });
    // Проверить незавершённые квесты
    Object.keys(PETS).forEach(petId => {
      if (isOwned(petId)) return;
      checkQuestDone(petId);
    });
  }
};

function triggerHappyAnimation(petId) {
  const el = document.getElementById('pet-emojis');
  if (el) { el.classList.remove('pet-celebrate'); void el.offsetWidth; el.classList.add('pet-celebrate'); }
}

function showPetNotification(petId) {
  const pet = PETS[petId];
  const toast = document.createElement('div');
  toast.style.cssText = `
    position:fixed;bottom:90px;right:20px;z-index:10000;
    background:rgba(10,10,20,.95);backdrop-filter:blur(12px);
    border:1px solid ${pet.color}66;border-radius:16px;
    padding:12px 16px;max-width:240px;
    animation:pet-toast-in .4s cubic-bezier(.34,1.56,.64,1);
  `;
  toast.innerHTML = `
    <div style="display:flex;align-items:center;gap:8px">
      <span style="font-size:1.4rem">${pet.emoji}</span>
      <div>
        <div style="font-size:.8rem;font-weight:700;color:${pet.color}">${pet.name} счастлив!</div>
        <div style="font-size:.7rem;color:rgba(255,255,255,.6);margin-top:2px">Бонус активирован: ${pet.bonus}</div>
      </div>
    </div>`;
  const style = document.createElement('style');
  style.textContent = `@keyframes pet-toast-in{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}`;
  document.head.appendChild(style);
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.transition='opacity .5s'; toast.style.opacity='0'; setTimeout(()=>toast.remove(),500); }, 4000);
}

// ══════════════════════════════════════════
// ПОГОДА
// ══════════════════════════════════════════
function getWeather() {
  const last = parseInt(localStorage.getItem(KEYS.lastVisit) || '0');
  const days = (Date.now() - last) / 86400000;
  const happy = Object.keys(PETS).filter(id => isOwned(id) && isPetHappy(id)).length;
  if (days > 7) return 'stormy';
  if (days > 3) return 'rainy';
  if (happy >= 3) return 'sunny';
  if (happy >= 1) return 'cloudy';
  return 'cloudy';
}

const MOODS_UI = {
  happy:   { emoji:'😄', label:'Счастлив', color:'#FFD700' },
  neutral: { emoji:'😐', label:'Ждёт задание', color:'rgba(255,255,255,.5)' },
  sad:     { emoji:'😔', label:'Скучает', color:'#636e72' },
};

// ══════════════════════════════════════════
// ВИДЖЕТ
// ══════════════════════════════════════════
function initPetWidget() {
  localStorage.setItem(KEYS.lastVisit, Date.now().toString());

  const style = document.createElement('style');
  style.textContent = `
    #pw-wrap { position:fixed;bottom:20px;right:20px;z-index:9999;display:flex;flex-direction:column;align-items:flex-end;gap:8px; }
    #pw-bubble {
      background:rgba(10,10,20,.9);backdrop-filter:blur(12px);
      border:1px solid rgba(255,255,255,.15);border-radius:20px;
      padding:10px 14px;cursor:pointer;
      display:flex;align-items:center;gap:8px;
      transition:transform .2s,box-shadow .2s;
      box-shadow:0 4px 20px rgba(0,0,0,.4);
    }
    #pw-bubble:hover{transform:translateY(-3px);box-shadow:0 8px 28px rgba(0,0,0,.5);}
    #pw-emojis{font-size:1.4rem;animation:pw-idle 2s ease-in-out infinite;}
    @keyframes pw-idle{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
    #pw-mood-icon{font-size:.85rem;}

    #pw-panel {
      display:none;position:fixed;bottom:80px;right:20px;z-index:9998;
      background:rgba(10,10,20,.97);backdrop-filter:blur(16px);
      border:1px solid rgba(255,255,255,.15);border-radius:20px;
      padding:0;width:300px;max-height:85vh;overflow-y:auto;
      box-shadow:0 8px 40px rgba(0,0,0,.7);
    }
    #pw-panel.open{display:block;animation:pw-panel-in .25s ease;}
    @keyframes pw-panel-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}

    .pw-tabs{display:flex;border-bottom:1px solid rgba(255,255,255,.08);padding:0 16px;}
    .pw-tab{flex:1;padding:12px 8px;font-size:.75rem;font-weight:700;text-align:center;
      color:rgba(255,255,255,.4);cursor:pointer;border-bottom:2px solid transparent;transition:all .2s;}
    .pw-tab.active{color:#FFD700;border-bottom-color:#FFD700;}

    .pw-body{padding:16px;}
    .pw-title-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;}
    .pw-section-title{font-size:.7rem;font-weight:700;color:rgba(255,255,255,.35);text-transform:uppercase;letter-spacing:1px;}
    .pw-close{cursor:pointer;font-size:1rem;opacity:.5;color:#fff;}
    .pw-close:hover{opacity:1;}

    /* Pet cards */
    .pw-pet-card {
      display:flex;align-items:center;gap:10px;
      padding:10px 12px;border-radius:14px;margin-bottom:8px;
      border:2px solid transparent;cursor:pointer;transition:all .2s;
      background:rgba(255,255,255,.05);
    }
    .pw-pet-card:hover{background:rgba(255,255,255,.09);}
    .pw-pet-card.selected{border-color:rgba(255,215,0,.5);background:rgba(255,215,0,.08);}
    .pw-pet-card.locked{opacity:.45;cursor:default;filter:grayscale(.7);}
    .pw-pet-emoji{font-size:1.7rem;flex-shrink:0;}
    .pw-pet-info{flex:1;min-width:0;}
    .pw-pet-name{font-size:.85rem;font-weight:700;color:#fff;}
    .pw-pet-desc{font-size:.68rem;color:rgba(255,255,255,.45);margin-top:2px;line-height:1.3;}
    .pw-pet-mood{font-size:.75rem;margin-top:3px;}
    .pw-pet-action{font-size:.75rem;flex-shrink:0;}

    /* Task cards */
    .pw-task-card{
      background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);
      border-radius:12px;padding:12px 14px;margin-bottom:8px;
    }
    .pw-task-pet{font-size:.7rem;font-weight:700;margin-bottom:4px;}
    .pw-task-text{font-size:.82rem;color:rgba(255,255,255,.85);line-height:1.4;}
    .pw-task-done{color:#4dff9a;font-size:.8rem;margin-top:4px;}
    .pw-task-bonus{font-size:.7rem;margin-top:4px;padding:3px 8px;
      border-radius:8px;display:inline-block;background:rgba(255,255,255,.07);}

    /* Unlock quest */
    .pw-quest-card{
      background:rgba(255,215,0,.07);border:1px solid rgba(255,215,0,.2);
      border-radius:14px;padding:14px;margin-bottom:10px;
    }
    .pw-quest-title{font-size:.75rem;font-weight:700;color:#FFD700;margin-bottom:6px;}
    .pw-quest-text{font-size:.82rem;color:rgba(255,255,255,.8);line-height:1.4;}
    .pw-quest-btn{
      width:100%;margin-top:10px;padding:9px;font-size:.8rem;font-weight:700;
      background:linear-gradient(135deg,#FFD700,#FFA500);color:#1a0a00;
      border:none;border-radius:10px;cursor:pointer;
    }
    .pw-want-btn{
      width:100%;padding:8px;font-size:.75rem;font-weight:700;margin-top:6px;
      background:rgba(255,215,0,.12);color:#FFD700;border:1px solid rgba(255,215,0,.3);
      border-radius:10px;cursor:pointer;transition:background .2s;
    }
    .pw-want-btn:hover{background:rgba(255,215,0,.22);}

    .pet-celebrate{animation:pw-celebrate .6s ease!important;}
    @keyframes pw-celebrate{0%,100%{transform:scale(1)}30%{transform:scale(1.5)}60%{transform:scale(.9)}}
  `;
  document.head.appendChild(style);

  const wrap = document.createElement('div');
  wrap.id = 'pw-wrap';
  wrap.innerHTML = `
    <div id="pw-bubble" onclick="pwToggle()">
      <span id="pw-emojis">🦦</span>
      <span id="pw-mood-icon"></span>
    </div>`;
  document.body.appendChild(wrap);

  const panel = document.createElement('div');
  panel.id = 'pw-panel';
  panel.innerHTML = `
    <div class="pw-tabs">
      <div class="pw-tab active" onclick="pwTab('squad')">Отряд</div>
      <div class="pw-tab" onclick="pwTab('tasks')">Задания</div>
      <div class="pw-tab" onclick="pwTab('unlock')">Получить</div>
    </div>
    <div class="pw-body">
      <div class="pw-title-row">
        <span class="pw-section-title" id="pw-tab-title">Мой отряд</span>
        <span class="pw-close" onclick="pwClose()">✕</span>
      </div>
      <div id="pw-content"></div>
    </div>`;
  document.body.appendChild(panel);

  pwRender('squad');

  // Close on outside click
  document.addEventListener('click', e => {
    const panel = document.getElementById('pw-panel');
    const bubble = document.getElementById('pw-bubble');
    if (panel?.classList.contains('open') && !panel.contains(e.target) && !bubble?.contains(e.target))
      panel.classList.remove('open');
  });
}

let currentTab = 'squad';

function pwTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.pw-tab').forEach((t,i) => {
    t.classList.toggle('active', ['squad','tasks','unlock'][i] === tab);
  });
  const titles = {squad:'Мой отряд', tasks:'Задания питомцев', unlock:'Получить питомца'};
  document.getElementById('pw-tab-title').textContent = titles[tab];
  pwRender(tab);
}

function pwToggle() {
  const panel = document.getElementById('pw-panel');
  if (!panel) return;
  panel.classList.toggle('open');
  if (panel.classList.contains('open')) pwRender(currentTab);
}

function pwClose() { document.getElementById('pw-panel')?.classList.remove('open'); }

function pwRender(tab) {
  const content = document.getElementById('pw-content');
  if (!content) return;

  // Update bubble
  const owned = getOwned();
  const selected = getSelected();
  const emojis = selected.map(id => PETS[id]?.emoji || '').join('');
  const happyCount = selected.filter(id => getMood(id) === 'happy').length;
  const allHappy = selected.length > 0 && happyCount === selected.length;
  document.getElementById('pw-emojis').textContent = emojis || '🦦';
  document.getElementById('pw-mood-icon').textContent = allHappy ? '✨' : (happyCount > 0 ? '⭐' : '');

  if (tab === 'squad') renderSquadTab(content, owned, selected);
  else if (tab === 'tasks') renderTasksTab(content, owned);
  else if (tab === 'unlock') renderUnlockTab(content, owned);
}

function renderSquadTab(content, owned, selected) {
  content.innerHTML = Object.entries(PETS).map(([id, pet]) => {
    const own = owned.includes(id);
    const sel = selected.includes(id);
    const mood = own ? getMood(id) : null;
    const moodUI = mood ? MOODS_UI[mood] : null;
    return `
      <div class="pw-pet-card ${sel?'selected':''} ${!own?'locked':''}"
           onclick="${own ? `pwTogglePet('${id}')` : ''}">
        <div class="pw-pet-emoji">${pet.emoji}</div>
        <div class="pw-pet-info">
          <div class="pw-pet-name">${pet.name} ${!own ? '🔒' : ''}</div>
          <div class="pw-pet-desc">${own ? pet.bonus : (pet.unlockCondition || 'Всегда с тобой')}</div>
          ${moodUI ? `<div class="pw-pet-mood" style="color:${moodUI.color}">${moodUI.emoji} ${moodUI.label}</div>` : ''}
        </div>
        <div class="pw-pet-action">${sel ? '✅' : (own ? '○' : '')}</div>
      </div>`;
  }).join('');
}

function refreshDailyTask(petId) {
  const daily = load(KEYS.dailyTasks, {});
  delete daily[petId]; // сбрасываем кэш
  save(KEYS.dailyTasks, daily);
  pwRender('tasks');
}

function renderTasksTab(content, owned) {
  if (owned.length === 0) {
    content.innerHTML = '<div style="color:rgba(255,255,255,.4);font-size:.85rem">Сначала получи питомцев!</div>';
    return;
  }

  content.innerHTML = owned.map(id => {
    const pet = PETS[id];
    const daily = getDailyTask(id);
    if (!daily) return '';
    const task = pet.tasks[daily.taskIdx];

    // Проверяем актуальность выполнения
    if (!daily.done && isTaskCompleted(task)) {
      markDailyDone(id);
      daily.done = true;
    }

    return `
      <div class="pw-task-card" style="border-color:${daily.done ? 'rgba(77,255,154,.3)' : `${pet.color}44`}">
        <div class="pw-task-pet" style="color:${pet.color}">${pet.emoji} ${pet.name}</div>
        <div class="pw-task-text" style="margin:6px 0">${task?.text || ''}</div>
        ${daily.done
          ? `<div class="pw-task-done">✅ Выполнено — бонус активен!</div>`
          : `<div>
               <div class="pw-task-bonus" style="color:${pet.color}">🎁 Бонус: ${pet.bonus}</div>
               <button onclick="refreshDailyTask('${id}')" style="margin-top:8px;font-size:.7rem;padding:5px 10px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.15);color:rgba(255,255,255,.5);border-radius:8px;cursor:pointer">
                 🔄 Другое задание
               </button>
             </div>`
        }
      </div>`;
  }).join('');
}

function renderUnlockTab(content, owned) {
  const locked = Object.entries(PETS).filter(([id]) => !owned.includes(id) && id !== 'desman');
  if (locked.length === 0) { content.innerHTML = '<div style="color:#4dff9a;font-size:.85rem;text-align:center;padding:20px">🎉 Ты собрала весь отряд!</div>'; return; }

  content.innerHTML = locked.map(([id, pet]) => {
    const quest = getQuest(id);
    const alreadyDone = quest?.done;
    if (alreadyDone) return `
      <div class="pw-quest-card" style="border-color:rgba(77,255,154,.3);background:rgba(77,255,154,.07)">
        <div class="pw-quest-title" style="color:#4dff9a">${pet.emoji} ${pet.name} разблокирован!</div>
        <div class="pw-quest-text">Питомец уже в твоём отряде ✨</div>
      </div>`;

    if (quest && !quest.done) {
      const task = pet.unlockTasks[quest.taskIdx];
      return `
        <div class="pw-quest-card">
          <div class="pw-quest-title">${pet.emoji} Заявка на ${pet.name}</div>
          <div class="pw-quest-text">📋 ${task?.text || ''}</div>
          <div style="font-size:.7rem;color:rgba(255,255,255,.4);margin-top:6px">Выполни задание — питомец появится автоматически</div>
          <button class="pw-quest-btn" onclick="pwCheckQuest('${id}')">✅ Проверить выполнение</button>
        </div>`;
    }

    return `
      <div class="pw-quest-card">
        <div class="pw-quest-title">${pet.emoji} ${pet.name}</div>
        <div class="pw-quest-text" style="color:rgba(255,255,255,.5)">${pet.desc}</div>
        <div style="font-size:.7rem;color:rgba(255,255,255,.4);margin-top:4px">Бонус: ${pet.bonus}</div>
        <button class="pw-want-btn" onclick="pwStartQuest('${id}')">🐾 Хочу этого питомца!</button>
      </div>`;
  }).join('');
}

// ── Действия ──
function pwTogglePet(id) {
  const owned = getOwned();
  if (!owned.includes(id)) return;
  let sel = getSelected();
  if (sel.includes(id)) { if (sel.length > 1) sel = sel.filter(s => s !== id); }
  else sel.push(id);
  saveSelected(sel);
  pwRender(currentTab);
}

function pwStartQuest(petId) {
  startQuest(petId);
  pwRender('unlock');
}

function pwCheckQuest(petId) {
  const done = checkQuestDone(petId);
  if (done) {
    showPetNotification(petId);
    setTimeout(() => { pwTab('squad'); }, 600);
  } else {
    // Показываем фидбек прямо внутри карточки
    const btn = document.querySelector(`[onclick="pwCheckQuest('${petId}')"]`);
    if (btn) {
      const orig = btn.textContent;
      btn.textContent = '❌ Ещё не выполнено — пройди задание!';
      btn.style.background = 'rgba(255,100,100,.3)';
      setTimeout(() => { btn.textContent = orig; btn.style.background = ''; }, 3000);
    }
  }
  if (done) setTimeout(() => pwRender('unlock'), 700);
}

// Авто-инициализация
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPetWidget);
} else {
  initPetWidget();
}
