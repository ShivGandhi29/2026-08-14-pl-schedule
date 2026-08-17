const STORAGE_KEY = "pl-schedule-favourites";

const teamsById = Object.fromEntries(TEAMS.map((t) => [t.id, t]));

function loadFavourites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveFavourites(favourites) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...favourites]));
}

let favourites = loadFavourites();
let showOnlyFavourites = false;

function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function crestTextColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.55 ? "#04140d" : "#f4f6f8";
}

function crestEl(team) {
  const span = document.createElement("span");
  span.className = "crest";
  span.style.background = team.color;
  span.style.color = crestTextColor(team.color);
  span.textContent = team.short.slice(0, 3);
  span.setAttribute("aria-hidden", "true");
  return span;
}

const STAR_PATH =
  "M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.27 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z";

function starIcon(className) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "currentColor");
  svg.setAttribute("aria-hidden", "true");
  svg.classList.add(className);
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", STAR_PATH);
  svg.appendChild(path);
  return svg;
}

function renderTeamGrid() {
  const grid = document.getElementById("team-grid");
  grid.innerHTML = "";

  TEAMS.forEach((team) => {
    const isFav = favourites.has(team.id);
    const btn = document.createElement("button");
    btn.className = "team-card" + (isFav ? " favourited" : "");
    btn.setAttribute("aria-pressed", isFav);
    btn.setAttribute(
      "aria-label",
      `${team.name}${isFav ? ", favourited" : ""}`
    );

    btn.appendChild(crestEl(team));

    const label = document.createElement("span");
    label.className = "team-name";
    label.textContent = team.name;
    btn.appendChild(label);

    btn.appendChild(starIcon("fav-check"));

    btn.addEventListener("click", () => {
      if (favourites.has(team.id)) {
        favourites.delete(team.id);
      } else {
        favourites.add(team.id);
      }
      saveFavourites(favourites);
      renderTeamGrid();
      renderFixtures();
    });

    grid.appendChild(btn);
  });
}

function renderFixtures() {
  const list = document.getElementById("fixture-list");
  const emptyState = document.getElementById("empty-state");
  list.innerHTML = "";

  if (showOnlyFavourites && favourites.size === 0) {
    emptyState.hidden = false;
    return;
  }
  emptyState.hidden = true;

  const visible = FIXTURES.filter((f) => {
    if (!showOnlyFavourites) return true;
    return favourites.has(f.home) || favourites.has(f.away);
  });

  let lastMatchweek = null;

  visible.forEach((fixture) => {
    if (fixture.matchweek !== lastMatchweek) {
      lastMatchweek = fixture.matchweek;
      const heading = document.createElement("div");
      heading.className = "matchweek-heading";
      heading.textContent = `Matchweek ${fixture.matchweek}`;
      list.appendChild(heading);
    }

    const home = teamsById[fixture.home];
    const away = teamsById[fixture.away];
    const isFavMatch = favourites.has(fixture.home) || favourites.has(fixture.away);

    const card = document.createElement("div");
    card.className = "fixture-card" + (isFavMatch ? " has-favourite" : "");

    const homeSlot = document.createElement("div");
    homeSlot.className = "team-slot home";
    homeSlot.appendChild(crestEl(home));
    const homeLabel = document.createElement("span");
    homeLabel.className = "team-name";
    homeLabel.textContent = home.short;
    homeSlot.appendChild(homeLabel);
    if (favourites.has(fixture.home)) {
      homeSlot.appendChild(starIcon("fav-star"));
    }

    const meta = document.createElement("div");
    meta.className = "fixture-meta";
    meta.innerHTML = `<span class="time">${fixture.time}</span>${formatDate(fixture.date)}`;

    const awaySlot = document.createElement("div");
    awaySlot.className = "team-slot away";
    if (favourites.has(fixture.away)) {
      awaySlot.appendChild(starIcon("fav-star"));
    }
    const awayLabel = document.createElement("span");
    awayLabel.className = "team-name";
    awayLabel.textContent = away.short;
    awaySlot.appendChild(awayLabel);
    awaySlot.appendChild(crestEl(away));

    card.appendChild(homeSlot);
    card.appendChild(meta);
    card.appendChild(awaySlot);
    list.appendChild(card);
  });
}

function setupTabs() {
  const tabFixtures = document.getElementById("tab-fixtures");
  const tabTeams = document.getElementById("tab-teams");
  const viewFixtures = document.getElementById("view-fixtures");
  const viewTeams = document.getElementById("view-teams");

  function activate(tab) {
    const isFixtures = tab === "fixtures";
    tabFixtures.classList.toggle("active", isFixtures);
    tabTeams.classList.toggle("active", !isFixtures);
    tabFixtures.setAttribute("aria-selected", isFixtures);
    tabTeams.setAttribute("aria-selected", !isFixtures);
    viewFixtures.classList.toggle("active", isFixtures);
    viewTeams.classList.toggle("active", !isFixtures);
  }

  tabFixtures.addEventListener("click", () => activate("fixtures"));
  tabTeams.addEventListener("click", () => activate("teams"));
}

function setupFilters() {
  const allBtn = document.getElementById("filter-all");
  const mineBtn = document.getElementById("filter-mine");

  allBtn.addEventListener("click", () => {
    showOnlyFavourites = false;
    allBtn.classList.add("active");
    mineBtn.classList.remove("active");
    renderFixtures();
  });

  mineBtn.addEventListener("click", () => {
    showOnlyFavourites = true;
    mineBtn.classList.add("active");
    allBtn.classList.remove("active");
    renderFixtures();
  });
}

setupTabs();
setupFilters();
renderTeamGrid();
renderFixtures();
