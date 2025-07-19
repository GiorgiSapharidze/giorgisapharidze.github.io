let facts = [];
let currentFactIndex = 0;
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let selectedCategory = "All";
let categories = [];

const factText = document.getElementById("factText");
const factCategory = document.getElementById("factCategory");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const randomBtn = document.getElementById("randomBtn");
const favoriteBtn = document.getElementById("favoriteBtn");
const totalFacts = document.getElementById("totalFacts");
const favoriteCount = document.getElementById("favoriteCount");
const categoryCount = document.getElementById("categoryCount");
const factCard = document.getElementById("factCard");
const categoryButtons = document.getElementById("categoryButtons");
const favoritesSection = document.getElementById("favoritesSection");
const dailyFactSection = document.getElementById("dailyFactSection");
const themeToggle = document.getElementById("themeToggle");

function saveFavorites() {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

function addTransitionEffect(direction = "right") {
  factCard.classList.add('transitioning');
  factCard.style.transform = direction === "right" ? "translateX(40px)" : "translateX(-40px)";
  setTimeout(() => {
    factCard.classList.remove('transitioning');
    factCard.style.transform = "";
    const elements = factCard.querySelectorAll('.fact-text, .fact-category, .fact-buttons');
    elements.forEach(el => {
      el.style.animation = 'none';
      el.offsetHeight; 
      el.style.animation = null;
    });
  }, 300);
}

function updateFavoriteButton(isFavorited) {
  if (isFavorited) {
    favoriteBtn.textContent = "❤️";
    favoriteBtn.classList.add('favorited');
    setTimeout(() => favoriteBtn.classList.remove('favorited'), 600);
  } else {
    favoriteBtn.textContent = "♡";
  }
}

function initializeFacts() {
  fetch("facts.json")
    .then(res => res.json())
    .then(data => {
      facts = data;
      categories = ["All", ...new Set(facts.map(f => f.category))];
      renderDailyFact();
      renderCategories();
      renderFact();
    });
}

function renderCategories() {
  categoryButtons.innerHTML = "";
  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    btn.classList.toggle("active", cat === selectedCategory);
    btn.onclick = () => {
      selectedCategory = cat;
      currentFactIndex = 0;
      
      renderCategories();
      renderFact();
    };
    categoryButtons.appendChild(btn);
  });
}

function getFilteredFacts() {
  return selectedCategory === "All"
    ? facts
    : facts.filter(f => f.category === selectedCategory);
}

function renderFact() {
  const filtered = getFilteredFacts();
  if (!filtered.length) return;
  
  const current = filtered[currentFactIndex % filtered.length];
  factText.textContent = current.fact;
  factCategory.textContent = current.category;
  
  const isFavorited = favorites.includes(current.id);
  updateFavoriteButton(isFavorited);
  
  totalFacts.textContent = facts.length;
  favoriteCount.textContent = favorites.length;
  categoryCount.textContent = categories.length - 1;
  renderFavorites();

  const filteredLength = filtered.length;
  prevBtn.classList.toggle('disabled', filteredLength <= 1);
  nextBtn.classList.toggle('disabled', filteredLength <= 1);
}

function renderFavorites() {
  favoritesSection.innerHTML = "";
  if (!favorites.length) return;
  const favHeader = document.createElement("h3");
  favHeader.textContent = "Your Favorites";
  favoritesSection.appendChild(favHeader);

  favorites
    .map(id => facts.find(f => f.id === id))
    .filter(fact => fact)
    .forEach(fact => {
      const div = document.createElement("div");
      div.className = "favorite-item";
      div.textContent = `${fact.fact} (${fact.category})`;
      favoritesSection.appendChild(div);
    });
}

function renderDailyFact() {
  if (!facts.length) return;
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
  const dailyFact = facts[dayOfYear % facts.length];
  dailyFactSection.innerHTML = `<h3>Today's Fact</h3><p>${dailyFact.fact}</p><span class="fact-category">${dailyFact.category}</span>`;
}

prevBtn.onclick = () => {
  const filtered = getFilteredFacts();
  if (filtered.length <= 1) return;
  addTransitionEffect("left");
  setTimeout(() => {
    currentFactIndex = (currentFactIndex - 1 + filtered.length) % filtered.length;
    renderFact();
  }, 300); // match the transition duration
};

nextBtn.onclick = () => {
  const filtered = getFilteredFacts();
  if (filtered.length <= 1) return;
  addTransitionEffect("right");
  setTimeout(() => {
    currentFactIndex = (currentFactIndex + 1) % filtered.length;
    renderFact();
  }, 300); // match the transition duration
};

randomBtn.onclick = () => {
  const filtered = getFilteredFacts();
  if (filtered.length <= 1) return;
  addTransitionEffect("right");
  setTimeout(() => {
    const newIndex = Math.floor(Math.random() * filtered.length);
    currentFactIndex = newIndex !== currentFactIndex ? newIndex : (newIndex + 1) % filtered.length;
    renderFact();
  }, 300); // match the transition duration
};

favoriteBtn.onclick = () => {
  const current = getFilteredFacts()[currentFactIndex];
  const isFavorited = favorites.includes(current.id);
  
  if (isFavorited) {
    favorites = favorites.filter(id => id !== current.id);
  } else {
    favorites.push(current.id);
  }
  
  saveFavorites();
  updateFavoriteButton(!isFavorited);
  favoriteCount.textContent = favorites.length;
  renderFavorites();
};

themeToggle.onclick = () => {
  document.body.classList.toggle("light-mode");
  themeToggle.textContent = document.body.classList.contains("light-mode") ? "☀️" : "🌙";
};

// Initialize the app
initializeFacts();
