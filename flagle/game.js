const MAX_GUESSES = 6;
// Tile reveal order: which tile index to reveal after each wrong guess
// Start with 1 tile revealed (index 0), then reveal one more per guess
const REVEAL_ORDER = [0, 3, 1, 4, 2, 5]; // staggered pattern for interest

const WD_ENDPOINT = "https://query.wikidata.org/sparql";
const WD_CACHE_KEY = "flagle_wd_countries_v1";
const WD_CACHE_AT_KEY = "flagle_wd_countries_at_v1";
const DAILY_DONE_KEY = "flagle_daily_done_v1";
const FLAG_CDN = "https://flagcdn.com/w640";

function $(id) { return document.getElementById(id); }
function setText(id, txt) { const el = $(id); if (el) el.textContent = txt; }

function todayLocalISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function hashStringToUint32(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function pickDeterministic(arr, seedStr) {
  return arr[hashStringToUint32(seedStr) % arr.length];
}

function gameNumberFromDate(dateISO) {
  const base = new Date("2026-01-01T00:00:00");
  const cur = new Date(dateISO + "T00:00:00");
  return Math.max(1, Math.round((cur - base) / 86400000) + 1);
}

async function fetchJSON(url, opts = {}) {
  const res = await fetch(url, opts);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function getCountries() {
  const cached = localStorage.getItem(WD_CACHE_KEY);
  const cachedAt = Number(localStorage.getItem(WD_CACHE_AT_KEY) || "0");
  if (cached && cachedAt && (Date.now() - cachedAt) / 86400000 < 30) {
    try { return JSON.parse(cached); } catch {}
  }

  const sparql = `
SELECT ?item ?itemLabel ?iso2 WHERE {
  ?item wdt:P31 wd:Q3624078.
  ?item wdt:P297 ?iso2.
  FILTER(STRLEN(?iso2)=2)
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
ORDER BY ?itemLabel`.trim();

  const url = WD_ENDPOINT + "?format=json&query=" + encodeURIComponent(sparql);
  const data = await fetchJSON(url, { headers: { Accept: "application/sparql-results+json" } });
  const rows = data?.results?.bindings || [];
  const seen = new Set();
  const countries = [];
  for (const r of rows) {
    const name = r.itemLabel.value;
    const iso2 = r.iso2.value.toLowerCase();
    if (!name || !iso2 || !/^[a-z]{2}$/.test(iso2) || seen.has(iso2)) continue;
    seen.add(iso2);
    countries.push({ name, iso2 });
  }
  localStorage.setItem(WD_CACHE_KEY, JSON.stringify(countries));
  localStorage.setItem(WD_CACHE_AT_KEY, String(Date.now()));
  return countries;
}

function flagURL(iso2) {
  return `${FLAG_CDN}/${iso2}.png`;
}

/* ---- UI ---- */
function buildFlagGrid(iso2) {
  const grid = $("flagGrid");
  grid.innerHTML = "";
  const imgSrc = flagURL(iso2);

  for (let i = 0; i < 6; i++) {
    const tile = document.createElement("div");
    tile.className = "flag-tile";
    tile.dataset.index = i;

    // Each tile shows a portion of the flag via object-position
    const col = i % 3;
    const row = Math.floor(i / 3);
    const img = document.createElement("img");
    img.className = "tile-img";
    img.src = imgSrc;
    img.alt = "";
    img.draggable = false;
    // Use object-position to show the right section
    img.style.objectPosition = `${col * 50}% ${row * 100}%`;

    const cover = document.createElement("div");
    cover.className = "tile-cover";
    cover.textContent = "?";

    tile.appendChild(img);
    tile.appendChild(cover);
    grid.appendChild(tile);
  }
}

function revealTile(index) {
  const tiles = document.querySelectorAll(".flag-tile");
  if (tiles[index]) tiles[index].classList.add("revealed");
}

function revealAll() {
  document.querySelectorAll(".flag-tile").forEach(t => t.classList.add("revealed"));
}

/* ---- Dropdown search ---- */
function setupSearch(countries, onSelect) {
  const input = $("guessInput");
  const dropdown = $("dropdown");
  let selected = null;
  let activeIdx = -1;
  let filtered = [];

  function render(list) {
    dropdown.innerHTML = "";
    filtered = list;
    activeIdx = -1;
    if (!list.length) { dropdown.hidden = true; return; }
    dropdown.hidden = false;
    list.slice(0, 8).forEach((c, i) => {
      const div = document.createElement("div");
      div.className = "dropdown-item";
      div.textContent = c.name;
      div.addEventListener("mousedown", (e) => {
        e.preventDefault();
        pick(c);
      });
      dropdown.appendChild(div);
    });
  }

  function pick(c) {
    selected = c;
    input.value = c.name;
    dropdown.hidden = true;
  }

  input.addEventListener("input", () => {
    selected = null;
    const q = input.value.trim().toLowerCase();
    if (q.length < 1) { dropdown.hidden = true; return; }
    const matches = countries.filter(c => c.name.toLowerCase().includes(q));
    render(matches);
  });

  input.addEventListener("keydown", (e) => {
    const items = dropdown.querySelectorAll(".dropdown-item");
    if (e.key === "ArrowDown") {
      e.preventDefault();
      activeIdx = Math.min(activeIdx + 1, items.length - 1);
      items.forEach((el, i) => el.classList.toggle("active", i === activeIdx));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      activeIdx = Math.max(activeIdx - 1, 0);
      items.forEach((el, i) => el.classList.toggle("active", i === activeIdx));
    } else if (e.key === "Enter" && activeIdx >= 0 && filtered[activeIdx]) {
      e.preventDefault();
      pick(filtered[activeIdx]);
    }
  });

  input.addEventListener("blur", () => {
    setTimeout(() => { dropdown.hidden = true; }, 150);
  });

  return () => {
    const val = selected;
    selected = null;
    input.value = "";
    return val;
  };
}

/* ---- Share ---- */
function buildShareText(puzzleNo, history, solved, guessesUsed) {
  const emojis = history.map(h => h.correct ? "🟩" : "🟥").join("");
  const score = solved ? `${guessesUsed}/${MAX_GUESSES}` : `X/${MAX_GUESSES}`;
  return `Flagle #${puzzleNo} 🏁\n${emojis}\n${score}\nhttps://daily-le.com/flagle/`;
}

async function shareNice(text) {
  if (navigator.share) {
    try { await navigator.share({ title: "Flagle", text, url: "https://daily-le.com/flagle/" }); return; } catch {}
  }
  try { await navigator.clipboard.writeText(text); } catch { prompt("Copy your share text:", text); }
}

/* ---- Modal ---- */
function showModal() {
  const bd = $("statsBackdrop"); const md = $("statsModal");
  if (bd) bd.hidden = false; if (md) md.hidden = false;
  document.body.style.overflow = "hidden";
}
function hideModal() {
  const bd = $("statsBackdrop"); const md = $("statsModal");
  if (bd) bd.hidden = true; if (md) md.hidden = true;
  document.body.style.overflow = "";
}

/* ---- Main ---- */
(async function main() {
  setText("dayPill", `Daily: ${todayLocalISO()}`);
  setText("triesPill", `Guesses: 0/${MAX_GUESSES}`);

  let countries;
  try {
    countries = await getCountries();
  } catch (e) {
    setText("errorLine", "Couldn't load countries. Try refreshing.");
    console.error(e);
    return;
  }

  const today = todayLocalISO();
  const chosen = pickDeterministic(countries, "flagle|" + today);
  buildFlagGrid(chosen.iso2);

  // Reveal first tile
  revealTile(REVEAL_ORDER[0]);

  const getSelected = setupSearch(countries, () => {});

  let guesses = 0;
  let solved = false;
  const history = [];

  // Already played?
  if (localStorage.getItem(DAILY_DONE_KEY) === today) {
    revealAll();
    $("guessInput").disabled = true;
    $("guessBtn").disabled = true;
    setText("endTitle", "Already played today ✅");
    setText("endBody", `The flag was ${chosen.name}`);
    const reveal = $("flagReveal");
    if (reveal) reveal.innerHTML = `<img src="${flagURL(chosen.iso2)}" alt="${chosen.name} flag">`;
    $("shareBtn").disabled = false;
    $("shareTopBtn").disabled = false;
    showModal();
    return;
  }

  function endGame(win) {
    solved = win;
    revealAll();
    $("guessInput").disabled = true;
    $("guessBtn").disabled = true;

    localStorage.setItem(DAILY_DONE_KEY, today);

    setText("endTitle", win ? "You got it! ✅" : "Not this time ❌");
    setText("endBody", `The flag was ${chosen.name}`);
    const reveal = $("flagReveal");
    if (reveal) reveal.innerHTML = `<img src="${flagURL(chosen.iso2)}" alt="${chosen.name} flag">`;

    const grid = $("emojiGrid");
    if (grid) {
      grid.textContent = "";
      history.forEach(h => {
        const s = document.createElement("span");
        s.textContent = h.correct ? "🟩" : "🟥";
        grid.appendChild(s);
      });
      if (!win) {
        const s = document.createElement("span");
        s.textContent = "❌";
        grid.appendChild(s);
      }
    }

    $("shareBtn").disabled = false;
    $("shareTopBtn").disabled = false;
    showModal();
  }

  $("guessForm").addEventListener("submit", (e) => {
    e.preventDefault();
    setText("errorLine", "");
    if (solved) return;

    const pick = getSelected();
    if (!pick) {
      setText("errorLine", "Select a country from the dropdown.");
      return;
    }

    guesses++;
    const correct = pick.iso2 === chosen.iso2;
    history.push({ name: pick.name, correct });

    setText("triesPill", `Guesses: ${guesses}/${MAX_GUESSES}`);

    // Add history row
    const histEl = $("history");
    const row = document.createElement("div");
    row.className = "history-row";
    row.innerHTML = `
      <span class="emoji">${correct ? "🟩" : "🟥"}</span>
      <span class="name">${pick.name}</span>
      <span class="tag ${correct ? "good" : "bad"}">${correct ? "Correct!" : "Wrong"}</span>
    `;
    histEl.prepend(row);

    if (correct) { endGame(true); return; }

    // Reveal next tile
    if (guesses < MAX_GUESSES) {
      revealTile(REVEAL_ORDER[guesses]);
    }

    if (guesses >= MAX_GUESSES) { endGame(false); return; }

    $("guessInput").focus();
  });

  // Share
  function currentShareText() {
    const no = gameNumberFromDate(today);
    return buildShareText(no, history, solved, guesses);
  }
  $("shareBtn")?.addEventListener("click", () => shareNice(currentShareText()));
  $("shareTopBtn")?.addEventListener("click", () => shareNice(currentShareText()));

  // Modal close
  $("closeStatsBtn")?.addEventListener("click", hideModal);
  $("statsBackdrop")?.addEventListener("click", hideModal);
})();
