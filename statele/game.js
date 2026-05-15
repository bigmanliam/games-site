const MAX_GUESSES = 4;
const DAILY_DONE_KEY = "statele_daily_done_v1";

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

/* ---- Data: 65 city/state entries covering all 50 states + territories ---- */
const CITIES = [
  {city:"Anchorage",state:"Alaska",hint:"Far North",borders:"None (non-contiguous)"},
  {city:"Birmingham",state:"Alabama",hint:"Deep South",borders:"Tennessee, Georgia, Florida, Mississippi"},
  {city:"Little Rock",state:"Arkansas",hint:"South Central",borders:"Missouri, Tennessee, Mississippi, Louisiana, Texas, Oklahoma"},
  {city:"Scottsdale",state:"Arizona",hint:"Southwest",borders:"Utah, Colorado, New Mexico, Nevada, California"},
  {city:"San Diego",state:"California",hint:"West Coast",borders:"Oregon, Nevada, Arizona"},
  {city:"Boulder",state:"Colorado",hint:"Mountain West",borders:"Wyoming, Nebraska, Kansas, Oklahoma, New Mexico, Arizona, Utah"},
  {city:"Stamford",state:"Connecticut",hint:"New England",borders:"New York, Massachusetts, Rhode Island"},
  {city:"Wilmington",state:"Delaware",hint:"Mid-Atlantic",borders:"Maryland, Pennsylvania, New Jersey"},
  {city:"Tampa",state:"Florida",hint:"Southeast",borders:"Alabama, Georgia"},
  {city:"Savannah",state:"Georgia",hint:"Southeast",borders:"Florida, Alabama, Tennessee, North Carolina, South Carolina"},
  {city:"Honolulu",state:"Hawaii",hint:"Pacific Islands",borders:"None (island state)"},
  {city:"Boise",state:"Idaho",hint:"Pacific Northwest",borders:"Montana, Wyoming, Utah, Nevada, Oregon, Washington"},
  {city:"Naperville",state:"Illinois",hint:"Midwest",borders:"Wisconsin, Iowa, Missouri, Kentucky, Indiana"},
  {city:"Fort Wayne",state:"Indiana",hint:"Midwest",borders:"Michigan, Ohio, Kentucky, Illinois"},
  {city:"Cedar Rapids",state:"Iowa",hint:"Midwest",borders:"Minnesota, Wisconsin, Illinois, Missouri, Nebraska, South Dakota"},
  {city:"Wichita",state:"Kansas",hint:"Great Plains",borders:"Nebraska, Missouri, Oklahoma, Colorado"},
  {city:"Lexington",state:"Kentucky",hint:"Upper South",borders:"Indiana, Ohio, West Virginia, Virginia, Tennessee, Missouri, Illinois"},
  {city:"Baton Rouge",state:"Louisiana",hint:"Gulf Coast",borders:"Arkansas, Mississippi, Texas"},
  {city:"Bangor",state:"Maine",hint:"New England",borders:"New Hampshire"},
  {city:"Annapolis",state:"Maryland",hint:"Mid-Atlantic",borders:"Pennsylvania, Delaware, Virginia, West Virginia"},
  {city:"Cambridge",state:"Massachusetts",hint:"New England",borders:"New York, Vermont, New Hampshire, Rhode Island, Connecticut"},
  {city:"Grand Rapids",state:"Michigan",hint:"Great Lakes",borders:"Ohio, Indiana, Wisconsin"},
  {city:"Duluth",state:"Minnesota",hint:"Upper Midwest",borders:"Wisconsin, Iowa, South Dakota, North Dakota"},
  {city:"Biloxi",state:"Mississippi",hint:"Deep South",borders:"Tennessee, Alabama, Louisiana, Arkansas"},
  {city:"Branson",state:"Missouri",hint:"Midwest",borders:"Iowa, Illinois, Kentucky, Tennessee, Arkansas, Oklahoma, Kansas, Nebraska"},
  {city:"Billings",state:"Montana",hint:"Mountain West",borders:"North Dakota, South Dakota, Wyoming, Idaho"},
  {city:"Omaha",state:"Nebraska",hint:"Great Plains",borders:"South Dakota, Iowa, Missouri, Kansas, Colorado, Wyoming"},
  {city:"Reno",state:"Nevada",hint:"West",borders:"Oregon, Idaho, Utah, Arizona, California"},
  {city:"Nashua",state:"New Hampshire",hint:"New England",borders:"Maine, Vermont, Massachusetts"},
  {city:"Newark",state:"New Jersey",hint:"Mid-Atlantic",borders:"New York, Pennsylvania, Delaware"},
  {city:"Santa Fe",state:"New Mexico",hint:"Southwest",borders:"Colorado, Oklahoma, Texas, Arizona, Utah"},
  {city:"Buffalo",state:"New York",hint:"Northeast",borders:"New Jersey, Pennsylvania, Connecticut, Massachusetts, Vermont"},
  {city:"Asheville",state:"North Carolina",hint:"Southeast",borders:"Virginia, Tennessee, Georgia, South Carolina"},
  {city:"Fargo",state:"North Dakota",hint:"Upper Great Plains",borders:"Minnesota, South Dakota, Montana"},
  {city:"Akron",state:"Ohio",hint:"Midwest",borders:"Michigan, Indiana, Kentucky, West Virginia, Pennsylvania"},
  {city:"Tulsa",state:"Oklahoma",hint:"South Central",borders:"Kansas, Missouri, Arkansas, Texas, New Mexico, Colorado"},
  {city:"Eugene",state:"Oregon",hint:"Pacific Northwest",borders:"Washington, Idaho, Nevada, California"},
  {city:"Pittsburgh",state:"Pennsylvania",hint:"Mid-Atlantic",borders:"New York, New Jersey, Delaware, Maryland, West Virginia, Ohio"},
  {city:"Providence",state:"Rhode Island",hint:"New England",borders:"Connecticut, Massachusetts"},
  {city:"Charleston",state:"South Carolina",hint:"Southeast",borders:"North Carolina, Georgia"},
  {city:"Sioux Falls",state:"South Dakota",hint:"Great Plains",borders:"North Dakota, Minnesota, Iowa, Nebraska, Wyoming, Montana"},
  {city:"Knoxville",state:"Tennessee",hint:"Upper South",borders:"Kentucky, Virginia, North Carolina, Georgia, Alabama, Mississippi, Arkansas, Missouri"},
  {city:"El Paso",state:"Texas",hint:"South Central",borders:"New Mexico, Oklahoma, Arkansas, Louisiana"},
  {city:"Provo",state:"Utah",hint:"Mountain West",borders:"Idaho, Wyoming, Colorado, New Mexico, Arizona, Nevada"},
  {city:"Burlington",state:"Vermont",hint:"New England",borders:"New Hampshire, Massachusetts, New York"},
  {city:"Virginia Beach",state:"Virginia",hint:"Mid-Atlantic",borders:"Maryland, West Virginia, Kentucky, Tennessee, North Carolina"},
  {city:"Tacoma",state:"Washington",hint:"Pacific Northwest",borders:"Oregon, Idaho"},
  {city:"Morgantown",state:"West Virginia",hint:"Appalachia",borders:"Pennsylvania, Maryland, Virginia, Kentucky, Ohio"},
  {city:"Green Bay",state:"Wisconsin",hint:"Upper Midwest",borders:"Michigan, Minnesota, Iowa, Illinois"},
  {city:"Cheyenne",state:"Wyoming",hint:"Mountain West",borders:"Montana, South Dakota, Nebraska, Colorado, Utah, Idaho"},
  {city:"San Juan",state:"Puerto Rico",hint:"Caribbean Territory",borders:"None (island territory)"},
  {city:"Pago Pago",state:"American Samoa",hint:"Pacific Territory",borders:"None (island territory)"},
  {city:"Hagatna",state:"Guam",hint:"Pacific Territory",borders:"None (island territory)"},
  {city:"Charlotte Amalie",state:"US Virgin Islands",hint:"Caribbean Territory",borders:"None (island territory)"},
  {city:"Saipan",state:"Northern Mariana Islands",hint:"Pacific Territory",borders:"None (island territory)"},
  {city:"Tuscaloosa",state:"Alabama",hint:"Deep South",borders:"Tennessee, Georgia, Florida, Mississippi"},
  {city:"Juneau",state:"Alaska",hint:"Far North",borders:"None (non-contiguous)"},
  {city:"Flagstaff",state:"Arizona",hint:"Southwest",borders:"Utah, Colorado, New Mexico, Nevada, California"},
  {city:"Eureka",state:"California",hint:"West Coast",borders:"Oregon, Nevada, Arizona"},
  {city:"Pensacola",state:"Florida",hint:"Gulf Coast",borders:"Alabama, Georgia"},
  {city:"Kailua",state:"Hawaii",hint:"Pacific Islands",borders:"None (island state)"},
  {city:"Pocatello",state:"Idaho",hint:"Pacific Northwest",borders:"Montana, Wyoming, Utah, Nevada, Oregon, Washington"},
  {city:"Topeka",state:"Kansas",hint:"Great Plains",borders:"Nebraska, Missouri, Oklahoma, Colorado"},
  {city:"Traverse City",state:"Michigan",hint:"Great Lakes",borders:"Ohio, Indiana, Wisconsin"},
  {city:"Natchez",state:"Mississippi",hint:"Deep South",borders:"Tennessee, Alabama, Louisiana, Arkansas"},
  {city:"Galveston",state:"Texas",hint:"Gulf Coast",borders:"New Mexico, Oklahoma, Arkansas, Louisiana"},
];

/* All valid state/territory names for the dropdown */
const ALL_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
  "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
  "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
  "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire",
  "New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio",
  "Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota",
  "Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia",
  "Wisconsin","Wyoming","Puerto Rico","American Samoa","Guam","US Virgin Islands",
  "Northern Mariana Islands","District of Columbia"
];

/* ---- Hints ---- */
function getHint(entry, guessNum) {
  switch (guessNum) {
    case 1: return `Region: ${entry.hint}`;
    case 2: return `Starts with "${entry.state[0]}"`;
    case 3: return `Borders: ${entry.borders}`;
    default: return "";
  }
}

/* ---- Search dropdown ---- */
function setupSearch() {
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
    const matches = ALL_STATES.filter(s => s.toLowerCase().includes(q));
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
  return `Statele #${puzzleNo} 🏙️\n${emojis}\n${score}\nhttps://daily-le.com/statele/`;
}

async function shareNice(text) {
  if (navigator.share) {
    try { await navigator.share({ title: "Statele", text, url: "https://daily-le.com/statele/" }); return; } catch {}
  }
  try { await navigator.clipboard.writeText(text); } catch { prompt("Copy:", text); }
}

/* ---- Main ---- */
(function main() {
  const today = todayLocalISO();
  const gameNum = gameNumberFromDate(today);
  setText("dayPill", `#${gameNum} — ${today}`);
  setText("triesPill", `Guesses: 0/${MAX_GUESSES}`);

  const chosen = pickDeterministic(CITIES, "statele|" + today);
  setText("cityName", chosen.city);

  const getGuess = setupSearch();

  let guesses = 0;
  let solved = false;
  const history = [];

  /* Already played */
  if (localStorage.getItem(DAILY_DONE_KEY) === today) {
    $("guessInput").disabled = true;
    $("guessBtn").disabled = true;
    setText("endTitle", "Already played today");
    setText("endBody", `${chosen.city} is in ${chosen.state}.`);
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

    setText("endTitle", win ? "You got it!" : "Not this time");
    setText("endBody", `${chosen.city} is in ${chosen.state}.`);

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
      setText("errorLine", "Type a state or territory name.");
      return;
    }

    /* Validate it is a real state */
    const match = ALL_STATES.find(s => s.toLowerCase() === guess.toLowerCase());
    if (!match) {
      setText("errorLine", "Not a recognized US state or territory.");
      return;
    }

    guesses++;
    const correct = match.toLowerCase() === chosen.state.toLowerCase();
    history.push({ name: match, correct });

    setText("triesPill", `Guesses: ${guesses}/${MAX_GUESSES}`);

    /* History row */
    const histEl = $("history");
    const row = document.createElement("div");
    row.className = "history-row";
    row.innerHTML = `
      <span class="emoji">${correct ? "🟩" : "🟥"}</span>
      <span class="name">${match}</span>
      <span class="tag ${correct ? "good" : "bad"}">${correct ? "Correct!" : "Wrong"}</span>
    `;
    histEl.prepend(row);

    if (correct) { endGame(true); return; }

    /* Show hint */
    const hint = getHint(chosen, guesses);
    if (hint) setText("hintLine", "Hint: " + hint);

    if (guesses >= MAX_GUESSES) { endGame(false); return; }

    $("guessInput").focus();
  });

  /* Share */
  function currentShareText() {
    return buildShareText(gameNum, history, solved, guesses);
  }
  $("shareBtn")?.addEventListener("click", () => shareNice(currentShareText()));
  $("shareTopBtn")?.addEventListener("click", () => shareNice(currentShareText()));

  $("closeStatsBtn")?.addEventListener("click", hideModal);
  $("statsBackdrop")?.addEventListener("click", hideModal);
})();
