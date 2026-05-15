const MAX_GUESSES = 6;
const DAILY_DONE_KEY = "datele_daily_done_v1";

const MONTHS = ["","January","February","March","April","May","June","July","August","September","October","November","December"];

const EVENTS = [
  {event:"The Berlin Wall fell", month:11, year:1989},
  {event:"The Titanic sank on its maiden voyage", month:4, year:1912},
  {event:"Humans first walked on the Moon", month:7, year:1969},
  {event:"The Declaration of Independence was signed", month:7, year:1776},
  {event:"World War I ended with the Armistice", month:11, year:1918},
  {event:"World War II ended in Europe (V-E Day)", month:5, year:1945},
  {event:"Japan surrendered, ending World War II (V-J Day)", month:8, year:1945},
  {event:"The atomic bomb was dropped on Hiroshima", month:8, year:1945},
  {event:"The French Revolution began with the storming of the Bastille", month:7, year:1789},
  {event:"Abraham Lincoln was assassinated", month:4, year:1865},
  {event:"John F. Kennedy was assassinated in Dallas", month:11, year:1963},
  {event:"Martin Luther King Jr. delivered his 'I Have a Dream' speech", month:8, year:1963},
  {event:"Martin Luther King Jr. was assassinated", month:4, year:1968},
  {event:"The Chernobyl nuclear disaster occurred", month:4, year:1986},
  {event:"The September 11 attacks took place", month:9, year:2001},
  {event:"Pearl Harbor was attacked by Japan", month:12, year:1941},
  {event:"The first iPhone was released to the public", month:6, year:2007},
  {event:"Facebook launched from a Harvard dorm room", month:2, year:2004},
  {event:"Nelson Mandela was released from prison", month:2, year:1990},
  {event:"The Soviet Union officially dissolved", month:12, year:1991},
  {event:"D-Day: Allied forces landed at Normandy", month:6, year:1944},
  {event:"The Wright Brothers made their first powered flight", month:12, year:1903},
  {event:"The Hindenburg airship disaster occurred", month:5, year:1937},
  {event:"Princess Diana died in a car crash in Paris", month:8, year:1997},
  {event:"The Challenger space shuttle exploded after launch", month:1, year:1986},
  {event:"The Columbia space shuttle broke apart during reentry", month:2, year:2003},
  {event:"Hurricane Katrina made landfall in Louisiana", month:8, year:2005},
  {event:"The Indian Ocean earthquake and tsunami struck", month:12, year:2004},
  {event:"The Panama Canal officially opened", month:8, year:1914},
  {event:"Alaska became the 49th U.S. state", month:1, year:1959},
  {event:"Hawaii became the 50th U.S. state", month:8, year:1959},
  {event:"The first successful heart transplant was performed", month:12, year:1967},
  {event:"Yuri Gagarin became the first human in space", month:4, year:1961},
  {event:"The Hubble Space Telescope was launched", month:4, year:1990},
  {event:"Dolly the sheep, the first cloned mammal, was born", month:7, year:1996},
  {event:"The Euro currency was introduced in physical form", month:1, year:2002},
  {event:"The World Health Organization declared COVID-19 a pandemic", month:3, year:2020},
  {event:"Barack Obama was inaugurated as President", month:1, year:2009},
  {event:"Queen Elizabeth II died", month:9, year:2022},
  {event:"The Suez Canal was blocked by the Ever Given", month:3, year:2021},
  {event:"The first Woodstock music festival took place", month:8, year:1969},
  {event:"The Watergate break-in occurred", month:6, year:1972},
  {event:"Richard Nixon resigned as President", month:8, year:1974},
  {event:"The first Star Wars film was released in theaters", month:5, year:1977},
  {event:"The Maastricht Treaty established the European Union", month:2, year:1992},
  {event:"The Good Friday Agreement was signed", month:4, year:1998},
  {event:"Hong Kong was returned to China by Britain", month:7, year:1997},
  {event:"The apartheid system was officially ended in South Africa", month:6, year:1991},
  {event:"The Rosetta spacecraft landed a probe on a comet", month:11, year:2014},
  {event:"Pluto was reclassified as a dwarf planet", month:8, year:2006},
  {event:"The Large Hadron Collider was first turned on", month:9, year:2008},
  {event:"The Fukushima nuclear disaster occurred in Japan", month:3, year:2011},
  {event:"The Arab Spring protests began in Tunisia", month:12, year:2010},
  {event:"Bitcoin was created with its genesis block", month:1, year:2009},
];

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
function buildShareText(puzzleNo, history, solved, guessesUsed, chosen) {
  const emojis = history.map(h => {
    const mE = h.monthCorrect ? "🟩" : "🟥";
    const yE = h.yearCorrect ? "🟩" : (h.yearClose ? "🟨" : "🟥");
    return mE + yE;
  }).join("\n");
  const score = solved ? `${guessesUsed}/${MAX_GUESSES}` : `X/${MAX_GUESSES}`;
  return `Datele #${puzzleNo} 📅\n${emojis}\n${score}\nhttps://daily-le.com/datele/`;
}

async function shareNice(text) {
  if (navigator.share) {
    try { await navigator.share({ title: "Datele", text, url: "https://daily-le.com/datele/" }); return; } catch {}
  }
  try { await navigator.clipboard.writeText(text); } catch { prompt("Copy:", text); }
}

/* ---- Main ---- */
(function main() {
  const today = todayLocalISO();
  const puzzleNo = gameNumberFromDate(today);
  setText("dayPill", `#${puzzleNo} — ${today}`);
  setText("triesPill", `Guesses: 0/${MAX_GUESSES}`);

  const chosen = pickDeterministic(EVENTS, "datele|" + today);
  setText("eventText", chosen.event);

  let guesses = 0;
  let solved = false;
  const history = [];

  // Already played
  if (localStorage.getItem(DAILY_DONE_KEY) === today) {
    $("monthInput").disabled = true;
    $("yearInput").disabled = true;
    $("guessBtn").disabled = true;
    setText("endTitle", "Already played today");
    setText("endBody", `${chosen.event}: ${MONTHS[chosen.month]} ${chosen.year}`);
    $("shareBtn").disabled = false;
    $("shareTopBtn").disabled = false;
    showModal();
    return;
  }

  function endGame(win) {
    solved = win;
    $("monthInput").disabled = true;
    $("yearInput").disabled = true;
    $("guessBtn").disabled = true;
    localStorage.setItem(DAILY_DONE_KEY, today);

    setText("endTitle", win ? "You got it! 📅" : "Not this time ❌");
    setText("endBody", `${chosen.event}: ${MONTHS[chosen.month]} ${chosen.year}`);

    const grid = $("emojiGrid");
    if (grid) {
      grid.textContent = "";
      history.forEach(h => {
        const row = document.createElement("div");
        const mE = h.monthCorrect ? "🟩" : "🟥";
        const yE = h.yearCorrect ? "🟩" : (h.yearClose ? "🟨" : "🟥");
        row.textContent = mE + yE;
        grid.appendChild(row);
      });
    }

    $("shareBtn").disabled = false;
    $("shareTopBtn").disabled = false;
    showModal();
  }

  $("guessForm").addEventListener("submit", (e) => {
    e.preventDefault();
    setText("errorLine", "");
    if (solved) return;

    const monthVal = parseInt($("monthInput").value, 10);
    const yearVal = parseInt($("yearInput").value, 10);

    if (!monthVal || isNaN(yearVal)) {
      setText("errorLine", "Select a month and enter a year.");
      return;
    }

    guesses++;
    const monthCorrect = monthVal === chosen.month;
    const yearCorrect = yearVal === chosen.year;
    const yearClose = Math.abs(yearVal - chosen.year) <= 1;
    const win = monthCorrect && yearClose;

    history.push({ month: monthVal, year: yearVal, monthCorrect, yearCorrect, yearClose });

    setText("triesPill", `Guesses: ${guesses}/${MAX_GUESSES}`);

    // Year feedback
    let yearFeedback = "";
    let yearClass = "";
    if (yearCorrect) { yearFeedback = "Correct year!"; yearClass = "good"; }
    else if (yearClose) { yearFeedback = "Within 1 year!"; yearClass = "warn"; }
    else if (yearVal < chosen.year) { yearFeedback = "Later ↓"; yearClass = "warn"; }
    else { yearFeedback = "Earlier ↑"; yearClass = "warn"; }

    // Month feedback
    let monthFeedback = monthCorrect ? "Correct month!" : "Wrong month";
    let monthClass = monthCorrect ? "good" : "bad";

    const histEl = $("history");
    const row = document.createElement("div");
    row.className = "history-row";
    row.innerHTML = `
      <span class="emoji">${win ? "🟩" : (yearClose || monthCorrect ? "🟨" : "🟥")}</span>
      <span class="name">${MONTHS[monthVal]} ${yearVal}</span>
      <span class="feedback-month tag ${monthClass}">${monthFeedback}</span>
      <span class="feedback-year tag ${yearClass}">${yearFeedback}</span>
    `;
    histEl.prepend(row);

    if (win) { endGame(true); return; }
    if (guesses >= MAX_GUESSES) { endGame(false); return; }

    $("yearInput").value = "";
    $("monthInput").value = "";
    $("monthInput").focus();
  });

  // Share
  function currentShareText() {
    return buildShareText(puzzleNo, history, solved, guesses, chosen);
  }
  $("shareBtn")?.addEventListener("click", () => shareNice(currentShareText()));
  $("shareTopBtn")?.addEventListener("click", () => shareNice(currentShareText()));

  $("closeStatsBtn")?.addEventListener("click", hideModal);
  $("statsBackdrop")?.addEventListener("click", hideModal);
})();
