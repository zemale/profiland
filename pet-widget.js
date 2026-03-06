/**
 * Profiland Pet Widget
 * Инжектит виджет питомцев на любую страницу где подключён этот скрипт
 */

const PETS = {
  desman: { emoji:'🦦', name:'Выхухоль', desc:'Редкое и мудрое существо. Всегда рядом.',       unlock:'always',      check: () => true },
  lion:   { emoji:'🦁', name:'Лев',      desc:'Храбрый. Разблокируется за 10 значков.',         unlock:'10 значков',  check: d => d.badges >= 10 },
  snake:  { emoji:'🐍', name:'Змея',     desc:'Мудрая и загадочная. За 5 пройденных квизов.',   unlock:'5 квизов',    check: d => d.quizzes >= 5 },
  raven:  { emoji:'🪶', name:'Ворон',    desc:'Умный наблюдатель. За первый районный трофей.',  unlock:'1 трофей',    check: d => d.trophies >= 1 },
  deer:   { emoji:'🦌', name:'Олень',    desc:'Грациозный странник. За посещение 10 районов.',  unlock:'10 районов',  check: d => d.districts >= 10 },
};

const MOODS = {
  sunny:   { suffix:'',    tip:'Питомцы счастливы — продолжай исследовать!' },
  cloudy:  { suffix:'',    tip:'Питомцы скучают — зайди в новый район?' },
  rainy:   { suffix:' 😴', tip:'Питомцы задремали... Давно тебя не было!' },
  stormy:  { suffix:' 😢', tip:'Питомцы очень скучают по тебе!' },
};

function getPetData() {
  try {
    const badges   = JSON.parse(localStorage.getItem('profiland_badges')   || '[]').length;
    const quizzes  = JSON.parse(localStorage.getItem('profiland_quiz_done') || '[]').length;
    const trophies = JSON.parse(localStorage.getItem('profiland_trophies') || '[]').length;
    const distMap  = JSON.parse(localStorage.getItem('profiland_district_map') || '{}');
    const earnedB  = JSON.parse(localStorage.getItem('profiland_badges')   || '[]');
    const districts = new Set(earnedB.map(b => distMap[b]).filter(Boolean)).size;
    return { badges, quizzes, trophies, districts };
  } catch { return { badges:0, quizzes:0, trophies:0, districts:0 }; }
}

function getWeather() {
  const lastVisit = parseInt(localStorage.getItem('profiland_last_visit') || '0');
  const now = Date.now();
  const daysSince = (now - lastVisit) / (1000 * 60 * 60 * 24);
  const d = getPetData();
  const activity = d.badges + d.quizzes * 2 + d.trophies * 5;

  if (daysSince > 7)  return 'stormy';
  if (daysSince > 3)  return 'rainy';
  if (activity < 3)   return 'cloudy';
  return 'sunny';
}

function getSelectedPets() {
  try { return JSON.parse(localStorage.getItem('profiland_selected_pets') || '["desman"]'); }
  catch { return ['desman']; }
}

function saveSelectedPets(arr) {
  localStorage.setItem('profiland_selected_pets', JSON.stringify(arr));
}

function updateLastVisit() {
  localStorage.setItem('profiland_last_visit', Date.now().toString());
}

function initPetWidget() {
  updateLastVisit();

  const style = document.createElement('style');
  style.textContent = `
    #pet-widget {
      position: fixed; bottom: 20px; right: 20px; z-index: 9999;
      display: flex; flex-direction: column; align-items: flex-end; gap: 8px;
    }
    #pet-bubble {
      background: rgba(10,10,20,.88); backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,.15); border-radius: 20px;
      padding: 10px 14px; cursor: pointer;
      display: flex; align-items: center; gap: 6px;
      transition: transform .2s, box-shadow .2s;
      box-shadow: 0 4px 20px rgba(0,0,0,.4);
      max-width: 200px;
    }
    #pet-bubble:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(0,0,0,.5); }
    #pet-emojis { font-size: 1.4rem; animation: pet-idle 2s ease-in-out infinite; }
    @keyframes pet-idle { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
    #pet-tip { font-size: .65rem; color: rgba(255,255,255,.5); max-width: 120px; line-height: 1.3; display: none; }
    #pet-bubble:hover #pet-tip { display: block; }

    #pet-panel {
      display: none; position: fixed; bottom: 80px; right: 20px; z-index: 9998;
      background: rgba(10,10,20,.95); backdrop-filter: blur(16px);
      border: 1px solid rgba(255,255,255,.15); border-radius: 20px;
      padding: 20px; width: 280px;
      box-shadow: 0 8px 40px rgba(0,0,0,.6);
      animation: panel-in .25s ease;
    }
    @keyframes panel-in { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
    #pet-panel.open { display: block; }
    #pet-panel-title {
      font-size: .75rem; font-weight: 700; color: rgba(255,255,255,.4);
      text-transform: uppercase; letter-spacing: 1px; margin-bottom: 14px;
      display: flex; justify-content: space-between; align-items: center;
    }
    #pet-close { cursor: pointer; font-size: 1rem; opacity: .5; }
    #pet-close:hover { opacity: 1; }

    .pet-card {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 12px; border-radius: 14px;
      border: 2px solid transparent; cursor: pointer;
      margin-bottom: 8px; transition: all .2s;
      background: rgba(255,255,255,.05);
    }
    .pet-card:hover { background: rgba(255,255,255,.1); }
    .pet-card.selected { border-color: rgba(255,215,0,.5); background: rgba(255,215,0,.08); }
    .pet-card.locked { opacity: .4; cursor: not-allowed; filter: grayscale(.8); }
    .pet-emoji { font-size: 1.6rem; }
    .pet-info { flex: 1; }
    .pet-name { font-size: .85rem; font-weight: 700; color: #fff; }
    .pet-desc { font-size: .7rem; color: rgba(255,255,255,.45); margin-top: 2px; line-height: 1.3; }
    .pet-check { font-size: .9rem; }

    .pet-mood-bar {
      margin-top: 14px; padding-top: 14px;
      border-top: 1px solid rgba(255,255,255,.08);
      font-size: .75rem; color: rgba(255,255,255,.5); line-height: 1.5;
    }
    .pet-mood-bar strong { color: rgba(255,255,255,.8); }

    /* Bounce on badge earn */
    @keyframes pet-bounce {
      0%,100%{transform:scale(1)} 30%{transform:scale(1.4)} 60%{transform:scale(.9)}
    }
    .pet-celebrate { animation: pet-bounce .6s ease !important; }
  `;
  document.head.appendChild(style);

  const widget = document.createElement('div');
  widget.id = 'pet-widget';
  widget.innerHTML = `
    <div id="pet-bubble" onclick="togglePetPanel()">
      <span id="pet-emojis">🦦</span>
      <span id="pet-tip"></span>
    </div>`;
  document.body.appendChild(widget);

  const panel = document.createElement('div');
  panel.id = 'pet-panel';
  panel.innerHTML = `
    <div id="pet-panel-title">
      🐾 Мой отряд
      <span id="pet-close" onclick="closePetPanel()">✕</span>
    </div>
    <div id="pet-list"></div>
    <div class="pet-mood-bar" id="pet-mood-info"></div>`;
  document.body.appendChild(panel);

  renderPetWidget();

  // Listen for badge events
  window.addEventListener('profiland_badge_earned', () => {
    const el = document.getElementById('pet-emojis');
    if (el) { el.classList.remove('pet-celebrate'); void el.offsetWidth; el.classList.add('pet-celebrate'); }
    renderPetWidget();
  });
}

function renderPetWidget() {
  const d = getPetData();
  const weather = getWeather();
  const mood = MOODS[weather] || MOODS.sunny;
  const selected = getSelectedPets();

  // Bubble
  const activeEmojis = selected.filter(id => PETS[id]).map(id => PETS[id].emoji).join('');
  const emojisEl = document.getElementById('pet-emojis');
  const tipEl = document.getElementById('pet-tip');
  if (emojisEl) emojisEl.textContent = (activeEmojis || '🦦') + mood.suffix;
  if (tipEl) tipEl.textContent = mood.tip;

  // Panel list
  const listEl = document.getElementById('pet-list');
  if (!listEl) return;
  listEl.innerHTML = Object.entries(PETS).map(([id, pet]) => {
    const unlocked = pet.check(d);
    const isSelected = selected.includes(id);
    return `
      <div class="pet-card ${isSelected ? 'selected' : ''} ${!unlocked ? 'locked' : ''}"
           onclick="${unlocked ? `togglePet('${id}')` : ''}">
        <div class="pet-emoji">${pet.emoji}</div>
        <div class="pet-info">
          <div class="pet-name">${pet.name} ${!unlocked ? '🔒' : ''}</div>
          <div class="pet-desc">${unlocked ? pet.desc : 'Нужно: ' + pet.unlock}</div>
        </div>
        <div class="pet-check">${isSelected ? '✅' : ''}</div>
      </div>`;
  }).join('');

  // Mood
  const moodEl = document.getElementById('pet-mood-info');
  if (moodEl) {
    const weatherEmoji = {sunny:'☀️', cloudy:'⛅', rainy:'🌧️', stormy:'⛈️'}[weather] || '☀️';
    moodEl.innerHTML = `<strong>${weatherEmoji} Настроение отряда</strong><br>${mood.tip}`;
  }
}

function togglePet(id) {
  let selected = getSelectedPets();
  if (selected.includes(id)) {
    if (selected.length === 1) return; // хотя бы один должен быть
    selected = selected.filter(s => s !== id);
  } else {
    selected.push(id);
  }
  saveSelectedPets(selected);
  renderPetWidget();
}

function togglePetPanel() {
  const panel = document.getElementById('pet-panel');
  if (!panel) return;
  panel.classList.toggle('open');
  if (panel.classList.contains('open')) renderPetWidget();
}

function closePetPanel() {
  const panel = document.getElementById('pet-panel');
  if (panel) panel.classList.remove('open');
}

// Close panel on outside click
document.addEventListener('click', e => {
  const panel = document.getElementById('pet-panel');
  const bubble = document.getElementById('pet-bubble');
  if (panel && panel.classList.contains('open') &&
      !panel.contains(e.target) && bubble && !bubble.contains(e.target)) {
    panel.classList.remove('open');
  }
});

// Auto-init
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPetWidget);
} else {
  initPetWidget();
}
