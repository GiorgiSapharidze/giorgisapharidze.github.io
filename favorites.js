const favoritesList = document.getElementById("favoritesList");
const themeToggle = document.getElementById("themeToggle");

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let facts = []; // We'll load facts from facts.json

fetch("facts.json")
  .then(res => res.json())
  .then(data => {
    facts = data;
    renderFavorites();
  });

function renderFavorites() {
  favoritesList.innerHTML = "";
  if (!favorites.length) {
    favoritesList.innerHTML = "<p>No favorite facts yet.</p>";
    return;
  }

  const header = document.createElement("h3");
  header.textContent = "Your Favorites";
  favoritesList.appendChild(header);

  favorites.forEach(id => {
    const fact = facts.find(f => f.id === id);
    if (fact) {
      const div = document.createElement("div");
      div.className = "favorite-item";
      div.textContent = `${fact.fact} (${fact.category})`;
      favoritesList.appendChild(div);
    }
  });
}

themeToggle.onclick = () => {
  document.body.classList.toggle("light-mode");
  themeToggle.textContent = document.body.classList.contains("light-mode") ? "☀️" : "🌙";
};
