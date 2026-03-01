const districts = [
  { id: "medical", name: "Медицинский", emoji: "🏥", color: "#FF6B6B", desc: "Врачи, медсёстры, фармацевты — те, кто спасает жизни" },
  { id: "social", name: "Социальный", emoji: "🧠", color: "#4ECDC4", desc: "Психологи, соцработники, педагоги — помощь людям" },
  { id: "creative", name: "Творческий", emoji: "🎭", color: "#FFE66D", desc: "Дизайнеры, художники, актёры — создают красоту" },
  { id: "music", name: "Музыкальный", emoji: "🎵", color: "#A29BFE", desc: "Музыканты, композиторы, звукорежиссёры" },
  { id: "tech", name: "Технологический", emoji: "💻", color: "#6C5CE7", desc: "Программисты, IT-специалисты, разработчики" },
  { id: "science", name: "Научный", emoji: "🔬", color: "#00B894", desc: "Учёные, исследователи, лаборанты — открывают новое" },
  { id: "nature", name: "Природный", emoji: "🌿", color: "#55EFC4", desc: "Экологи, биологи, зоологи — защищают природу" },
  { id: "construction", name: "Строительный", emoji: "🏗️", color: "#FDCB6E", desc: "Архитекторы, инженеры, строители — создают пространства" },
  { id: "business", name: "Деловой", emoji: "⚖️", color: "#0984E3", desc: "Юристы, экономисты, менеджеры — управляют бизнесом" },
  { id: "media", name: "Медиа", emoji: "📰", color: "#E17055", desc: "Журналисты, блогеры, операторы — расскажут всем" },
  { id: "culinary", name: "Кулинарный", emoji: "🍳", color: "#FD79A8", desc: "Повара, кондитеры, технологи — вкусные профессии" },
  { id: "transport", name: "Транспортный", emoji: "✈️", color: "#74B9FF", desc: "Пилоты, машинисты, логисты — движут мир вперёд" },
  { id: "military", name: "Силовой", emoji: "🛡️", color: "#636E72", desc: "Военные, полицейские, спасатели — защищают страну" },
  { id: "sports", name: "Спортивный", emoji: "⚽", color: "#00CEC9", desc: "Спортсмены, тренеры, физиотерапевты — в движении" },
  { id: "agro", name: "Аграрный", emoji: "🌾", color: "#6AB04C", desc: "Агрономы, фермеры, ветеринары — кормят планету" },
  { id: "education", name: "Образовательный", emoji: "🎓", color: "#F9CA24", desc: "Учителя, воспитатели, тьюторы — дают знания" },
  { id: "service", name: "Сервисный", emoji: "💈", color: "#F0932B", desc: "Стилисты, мастера, администраторы — сервис и уют" },
  { id: "tourism", name: "Туристический", emoji: "🗺️", color: "#EB4D4B", desc: "Гиды, менеджеры турагентств, переводчики" },
  { id: "industrial", name: "Промышленный", emoji: "🔧", color: "#7F8C8D", desc: "Инженеры, механики, технологи — создают вещи" },
  { id: "gaming", name: "Игровой", emoji: "🎮", color: "#9B59B6", desc: "Геймдизайнеры, аниматоры, QA-тестеры — создают игры" }
];

function createCard(district, index) {
  const card = document.createElement('div');
  card.className = 'district-card';
  card.style.setProperty('--district-color', district.color);

  // Colored bg overlay
  card.style.background = `linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))`;
  card.style.borderColor = district.color + '40';

  card.innerHTML = `
    <div class="district-card__glow" style="background: radial-gradient(circle, ${district.color}, transparent 70%)"></div>
    <div class="district-card__top" style="
      position: absolute; top: 0; left: 0; right: 0; height: 4px;
      background: ${district.color}; border-radius: 20px 20px 0 0;
    "></div>
    <div class="district-card__emoji">${district.emoji}</div>
    <div class="district-card__name">${district.name}</div>
    <div class="district-card__desc">${district.desc}</div>
    <a href="district.html?id=${district.id}" class="btn btn--district" onclick="event.stopPropagation()">
      Исследовать →
    </a>
  `;

  card.addEventListener('click', () => {
    window.location.href = `district.html?id=${district.id}`;
  });

  // Hover glow color
  card.addEventListener('mouseenter', () => {
    card.style.boxShadow = `0 20px 50px ${district.color}40, 0 0 0 1px ${district.color}60`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.boxShadow = '';
  });

  return card;
}

function initCity() {
  const grid = document.getElementById('cityGrid');

  districts.forEach((district, index) => {
    const card = createCard(district, index);
    grid.appendChild(card);
  });

  // Staggered reveal with IntersectionObserver
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cards = entry.target.querySelectorAll('.district-card');
        cards.forEach((card, i) => {
          setTimeout(() => {
            card.classList.add('visible');
          }, i * 60);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  observer.observe(grid);
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

document.addEventListener('DOMContentLoaded', initCity);
