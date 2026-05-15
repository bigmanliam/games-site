const MAX_GUESSES = 6;
const DAILY_DONE_KEY = "capitdle_daily_done_v1";

const WD_ENDPOINT = "https://query.wikidata.org/sparql";
const WD_CACHE_KEY = "capitdle_wd_data_v1";
const WD_CACHE_AT_KEY = "capitdle_wd_data_at_v1";

function $(id) { return document.getElementById(id); }
function setText(id, txt) { const el = $(id); if (el) el.textContent = txt; }

function todayLocalISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function hashStringToUint32(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193); }
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

async function getCountriesWithCapitals() {
  const cached = localStorage.getItem(WD_CACHE_KEY);
  const cachedAt = Number(localStorage.getItem(WD_CACHE_AT_KEY) || "0");
  if (cached && cachedAt && (Date.now() - cachedAt) / 86400000 < 30) {
    try { return JSON.parse(cached); } catch {}
  }

  const sparql = `
SELECT ?country ?countryLabel ?capital ?capitalLabel WHERE {
  ?country wdt:P31 wd:Q3624078.
  ?country wdt:P36 ?capital.
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
ORDER BY ?countryLabel`.trim();

  const url = WD_ENDPOINT + "?format=json&query=" + encodeURIComponent(sparql);
  const data = await fetchJSON(url, { headers: { Accept: "application/sparql-results+json" } });
  const rows = data?.results?.bindings || [];

  const seen = new Set();
  const results = [];
  for (const r of rows) {
    const country = r.countryLabel?.value;
    const capital = r.capitalLabel?.value;
    if (!country || !capital || seen.has(country)) continue;
    // Skip entries where label is a Q-id (unresolved)
    if (/^Q\d+$/.test(country) || /^Q\d+$/.test(capital)) continue;
    seen.add(country);
    results.push({ country, capital });
  }

  localStorage.setItem(WD_CACHE_KEY, JSON.stringify(results));
  localStorage.setItem(WD_CACHE_AT_KEY, String(Date.now()));
  return results;
}

/* ---- Hints ---- */
function getHint(capital, guessNum) {
  // Progressive hints
  switch (guessNum) {
    case 1: return `The capital has ${capital.length} letters.`;
    case 2: return `It starts with "${capital[0]}".`;
    case 3: return `First two letters: "${capital.slice(0, 2)}".`;
    case 4: return `It starts with "${capital.slice(0, 3)}…" (${capital.length} letters).`;
    case 5: return `"${capital.slice(0, Math.ceil(capital.length / 2))}…" (${capital.length} letters).`;
    default: return "";
  }
}

/* ---- Search dropdown ---- */
function setupSearch(allCapitals) {
  const input = $("guessInput");
  const dropdown = $("dropdown");
  let selected = null;
  let filtered = [];
  let activeIdx = -1;

  function render(list) {
    dropdown.innerHTML = "";
    filtered = list;
    activeIdx = -1;
    if (!list.length) { dropdown.hidden = true; return; }
    dropdown.hidden = false;
    list.slice(0, 8).forEach((name) => {
      const div = document.createElement("div");
      div.className = "dropdown-item";
      div.textContent = name;
      div.addEventListener("mousedown", (e) => { e.preventDefault(); pick(name); });
      dropdown.appendChild(div);
    });
  }

  function pick(name) {
    selected = name;
    input.value = name;
    dropdown.hidden = true;
  }

  input.addEventListener("input", () => {
    selected = null;
    const q = input.value.trim().toLowerCase();
    if (q.length < 1) { dropdown.hidden = true; return; }
    const matches = allCapitals.filter(c => c.toLowerCase().includes(q));
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
    const val = selected || input.value.trim();
    selected = null;
    input.value = "";
    return val;
  };
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

/* ---- Share ---- */
function buildShareText(puzzleNo, history, solved, guessesUsed) {
  const emojis = history.map(h => h.correct ? "🟩" : "🟥").join("");
  const score = solved ? `${guessesUsed}/${MAX_GUESSES}` : `X/${MAX_GUESSES}`;
  return `Capitdle #${puzzleNo} 🏛️\n${emojis}\n${score}\nhttps://daily-le.com/capitdle/`;
}

async function shareNice(text) {
  if (navigator.share) {
    try { await navigator.share({ title: "Capitdle", text, url: "https://daily-le.com/capitdle/" }); return; } catch {}
  }
  try { await navigator.clipboard.writeText(text); } catch { prompt("Copy:", text); }
}

/* ---- Main ---- */
(async function main() {
  const today = todayLocalISO();
  setText("dayPill", `Daily: ${today}`);
  setText("triesPill", `Guesses: 0/${MAX_GUESSES}`);

  let data;
  try {
    data = await getCountriesWithCapitals();
  } catch (e) {
    setText("errorLine", "Couldn't load data. Try refreshing.");
    console.error(e);
    return;
  }

  const chosen = pickDeterministic(data, "capitdle|" + today);
  setText("countryName", chosen.country);

  // Build list of all unique capital names for dropdown
  const allCapitals = [...new Set(data.map(d => d.capital))].sort();
  const getGuess = setupSearch(allCapitals);

  let guesses = 0;
  let solved = false;
  const history = [];

  // Already played
  if (localStorage.getItem(DAILY_DONE_KEY) === today) {
    $("guessInput").disabled = true;
    $("guessBtn").disabled = true;
    setText("endTitle", "Already played today ✅");
    setText("endBody", `The capital of ${chosen.country} is ${chosen.capital}.`);
    $("shareBtn").disabled = false;
    $("shareTopBtn").disabled = false;
    showModal();
    return;
  }

  function endGame(win) {
    solved = win;
    $("guessInput").disabled = true;
    $("guessBtn").disabled = true;
    localStorage.setItem(DAILY_DONE_KEY, today);

    setText("endTitle", win ? "You got it! ✅" : "Not this time ❌");
    setText("endBody", `The capital of ${chosen.country} is ${chosen.capital}.`);

    const grid = $("emojiGrid");
    if (grid) {
      grid.textContent = "";
      history.forEach(h => {
        const s = document.createElement("span");
        s.textContent = h.correct ? "🟩" : "🟥";
        grid.appendChild(s);
      });
      if (!win) {
        const s = document.createElement("span"); s.textContent = "❌"; grid.appendChild(s);
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

    const guess = getGuess();
    if (!guess) {
      setText("errorLine", "Type a capital city name.");
      return;
    }

    guesses++;
    const correct = guess.toLowerCase().trim() === chosen.capital.toLowerCase().trim();
    history.push({ name: guess, correct });

    setText("triesPill", `Guesses: ${guesses}/${MAX_GUESSES}`);

    // History row
    const histEl = $("history");
    const row = document.createElement("div");
    row.className = "history-row";
    row.innerHTML = `
      <span class="emoji">${correct ? "🟩" : "🟥"}</span>
      <span class="name">${guess}</span>
      <span class="tag ${correct ? "good" : "bad"}">${correct ? "Correct!" : "Wrong"}</span>
    `;
    histEl.prepend(row);

    if (correct) { endGame(true); return; }

    // Show hint
    const hint = getHint(chosen.capital, guesses);
    if (hint) setText("hintLine", "Hint: " + hint);

    if (guesses >= MAX_GUESSES) { endGame(false); return; }

    $("guessInput").focus();
  });

  // Share
  function currentShareText() {
    return buildShareText(gameNumberFromDate(today), history, solved, guesses);
  }
  $("shareBtn")?.addEventListener("click", () => shareNice(currentShareText()));
  $("shareTopBtn")?.addEventListener("click", () => shareNice(currentShareText()));

  $("closeStatsBtn")?.addEventListener("click", hideModal);
  $("statsBackdrop")?.addEventListener("click", hideModal);
})();
