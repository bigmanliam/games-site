const MAX_GUESSES = 6;
const DAILY_DONE_KEY = "elemently_daily_done_v1";

/* Utilities: $, setText, todayLocalISO, gameNumberFromDate, hashStringToUint32,
   pickFromBag, showModal, hideModal, shareNice from ../shared.js */

/* ---- All 118 Elements ---- */
const ELEMENTS = [
  {name:"Hydrogen",symbol:"H",number:1},
  {name:"Helium",symbol:"He",number:2},
  {name:"Lithium",symbol:"Li",number:3},
  {name:"Beryllium",symbol:"Be",number:4},
  {name:"Boron",symbol:"B",number:5},
  {name:"Carbon",symbol:"C",number:6},
  {name:"Nitrogen",symbol:"N",number:7},
  {name:"Oxygen",symbol:"O",number:8},
  {name:"Fluorine",symbol:"F",number:9},
  {name:"Neon",symbol:"Ne",number:10},
  {name:"Sodium",symbol:"Na",number:11},
  {name:"Magnesium",symbol:"Mg",number:12},
  {name:"Aluminum",symbol:"Al",number:13},
  {name:"Silicon",symbol:"Si",number:14},
  {name:"Phosphorus",symbol:"P",number:15},
  {name:"Sulfur",symbol:"S",number:16},
  {name:"Chlorine",symbol:"Cl",number:17},
  {name:"Argon",symbol:"Ar",number:18},
  {name:"Potassium",symbol:"K",number:19},
  {name:"Calcium",symbol:"Ca",number:20},
  {name:"Scandium",symbol:"Sc",number:21},
  {name:"Titanium",symbol:"Ti",number:22},
  {name:"Vanadium",symbol:"V",number:23},
  {name:"Chromium",symbol:"Cr",number:24},
  {name:"Manganese",symbol:"Mn",number:25},
  {name:"Iron",symbol:"Fe",number:26},
  {name:"Cobalt",symbol:"Co",number:27},
  {name:"Nickel",symbol:"Ni",number:28},
  {name:"Copper",symbol:"Cu",number:29},
  {name:"Zinc",symbol:"Zn",number:30},
  {name:"Gallium",symbol:"Ga",number:31},
  {name:"Germanium",symbol:"Ge",number:32},
  {name:"Arsenic",symbol:"As",number:33},
  {name:"Selenium",symbol:"Se",number:34},
  {name:"Bromine",symbol:"Br",number:35},
  {name:"Krypton",symbol:"Kr",number:36},
  {name:"Rubidium",symbol:"Rb",number:37},
  {name:"Strontium",symbol:"Sr",number:38},
  {name:"Yttrium",symbol:"Y",number:39},
  {name:"Zirconium",symbol:"Zr",number:40},
  {name:"Niobium",symbol:"Nb",number:41},
  {name:"Molybdenum",symbol:"Mo",number:42},
  {name:"Technetium",symbol:"Tc",number:43},
  {name:"Ruthenium",symbol:"Ru",number:44},
  {name:"Rhodium",symbol:"Rh",number:45},
  {name:"Palladium",symbol:"Pd",number:46},
  {name:"Silver",symbol:"Ag",number:47},
  {name:"Cadmium",symbol:"Cd",number:48},
  {name:"Indium",symbol:"In",number:49},
  {name:"Tin",symbol:"Sn",number:50},
  {name:"Antimony",symbol:"Sb",number:51},
  {name:"Tellurium",symbol:"Te",number:52},
  {name:"Iodine",symbol:"I",number:53},
  {name:"Xenon",symbol:"Xe",number:54},
  {name:"Cesium",symbol:"Cs",number:55},
  {name:"Barium",symbol:"Ba",number:56},
  {name:"Lanthanum",symbol:"La",number:57},
  {name:"Cerium",symbol:"Ce",number:58},
  {name:"Praseodymium",symbol:"Pr",number:59},
  {name:"Neodymium",symbol:"Nd",number:60},
  {name:"Promethium",symbol:"Pm",number:61},
  {name:"Samarium",symbol:"Sm",number:62},
  {name:"Europium",symbol:"Eu",number:63},
  {name:"Gadolinium",symbol:"Gd",number:64},
  {name:"Terbium",symbol:"Tb",number:65},
  {name:"Dysprosium",symbol:"Dy",number:66},
  {name:"Holmium",symbol:"Ho",number:67},
  {name:"Erbium",symbol:"Er",number:68},
  {name:"Thulium",symbol:"Tm",number:69},
  {name:"Ytterbium",symbol:"Yb",number:70},
  {name:"Lutetium",symbol:"Lu",number:71},
  {name:"Hafnium",symbol:"Hf",number:72},
  {name:"Tantalum",symbol:"Ta",number:73},
  {name:"Tungsten",symbol:"W",number:74},
  {name:"Rhenium",symbol:"Re",number:75},
  {name:"Osmium",symbol:"Os",number:76},
  {name:"Iridium",symbol:"Ir",number:77},
  {name:"Platinum",symbol:"Pt",number:78},
  {name:"Gold",symbol:"Au",number:79},
  {name:"Mercury",symbol:"Hg",number:80},
  {name:"Thallium",symbol:"Tl",number:81},
  {name:"Lead",symbol:"Pb",number:82},
  {name:"Bismuth",symbol:"Bi",number:83},
  {name:"Polonium",symbol:"Po",number:84},
  {name:"Astatine",symbol:"At",number:85},
  {name:"Radon",symbol:"Rn",number:86},
  {name:"Francium",symbol:"Fr",number:87},
  {name:"Radium",symbol:"Ra",number:88},
  {name:"Actinium",symbol:"Ac",number:89},
  {name:"Thorium",symbol:"Th",number:90},
  {name:"Protactinium",symbol:"Pa",number:91},
  {name:"Uranium",symbol:"U",number:92},
  {name:"Neptunium",symbol:"Np",number:93},
  {name:"Plutonium",symbol:"Pu",number:94},
  {name:"Americium",symbol:"Am",number:95},
  {name:"Curium",symbol:"Cm",number:96},
  {name:"Berkelium",symbol:"Bk",number:97},
  {name:"Californium",symbol:"Cf",number:98},
  {name:"Einsteinium",symbol:"Es",number:99},
  {name:"Fermium",symbol:"Fm",number:100},
  {name:"Mendelevium",symbol:"Md",number:101},
  {name:"Nobelium",symbol:"No",number:102},
  {name:"Lawrencium",symbol:"Lr",number:103},
  {name:"Rutherfordium",symbol:"Rf",number:104},
  {name:"Dubnium",symbol:"Db",number:105},
  {name:"Seaborgium",symbol:"Sg",number:106},
  {name:"Bohrium",symbol:"Bh",number:107},
  {name:"Hassium",symbol:"Hs",number:108},
  {name:"Meitnerium",symbol:"Mt",number:109},
  {name:"Darmstadtium",symbol:"Ds",number:110},
  {name:"Roentgenium",symbol:"Rg",number:111},
  {name:"Copernicium",symbol:"Cn",number:112},
  {name:"Nihonium",symbol:"Nh",number:113},
  {name:"Flerovium",symbol:"Fl",number:114},
  {name:"Moscovium",symbol:"Mc",number:115},
  {name:"Livermorium",symbol:"Lv",number:116},
  {name:"Tennessine",symbol:"Ts",number:117},
  {name:"Oganesson",symbol:"Og",number:118},
];

/* ---- Share ---- */
function buildShareText(puzzleNo, history, solved, guessesUsed, target) {
  const emojis = history.map(h => {
    if (h.correct) return "🟩";
    return h.direction === "higher" ? "⬆️" : "⬇️";
  }).join("");
  const score = solved ? `${guessesUsed}/${MAX_GUESSES}` : `X/${MAX_GUESSES}`;
  return `Elemently #${puzzleNo} ⚛️\n${emojis}\n${score}\nhttps://daily-le.com/elemently/`;
}

/* ---- Main ---- */
(function main() {
  const today = todayLocalISO();
  const gameNum = gameNumberFromDate(today);
  setText("dayPill", `#${gameNum} — ${today}`);
  setText("triesPill", `Guesses: 0/${MAX_GUESSES}`);

  const chosen = pickFromBag(ELEMENTS, "elemently", today);
  setText("elementName", chosen.name);
  setText("elementSymbol", chosen.symbol);

  let guesses = 0;
  let solved = false;
  const history = [];

  /* Already played */
  if (localStorage.getItem(DAILY_DONE_KEY) === today) {
    $("guessInput").disabled = true;
    $("guessBtn").disabled = true;
    setText("endTitle", "Already played today");
    setText("endBody", `${chosen.name} (${chosen.symbol}) is element #${chosen.number}.`);
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
    setText("endBody", `${chosen.name} (${chosen.symbol}) is element #${chosen.number}.`);

    const grid = $("emojiGrid");
    if (grid) {
      grid.textContent = "";
      history.forEach(h => {
        const s = document.createElement("span");
        if (h.correct) s.textContent = "🟩";
        else s.textContent = h.direction === "higher" ? "⬆️" : "⬇️";
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

    const input = $("guessInput");
    const val = parseInt(input.value, 10);
    input.value = "";

    if (isNaN(val) || val < 1 || val > 118) {
      setText("errorLine", "Enter a number between 1 and 118.");
      return;
    }

    guesses++;
    const correct = val === chosen.number;
    const direction = val < chosen.number ? "higher" : "lower";
    history.push({ guess: val, correct, direction });

    setText("triesPill", `Guesses: ${guesses}/${MAX_GUESSES}`);

    /* Hint line */
    if (!correct) {
      setText("hintLine", val < chosen.number
        ? `${val} is too low — go higher`
        : `${val} is too high — go lower`);
    }

    /* History row */
    const histEl = $("history");
    const row = document.createElement("div");
    row.className = "history-row";
    if (correct) {
      row.innerHTML = `
        <span class="emoji">🟩</span>
        <span class="name">${val}</span>
        <span class="tag good">Correct!</span>
      `;
    } else {
      const arrow = direction === "higher" ? "⬆️" : "⬇️";
      const label = direction === "higher" ? "Higher" : "Lower";
      row.innerHTML = `
        <span class="emoji">${arrow}</span>
        <span class="name">${val}</span>
        <span class="tag warn">${label}</span>
      `;
    }
    histEl.prepend(row);

    if (correct) { endGame(true); return; }
    if (guesses >= MAX_GUESSES) { endGame(false); return; }

    $("guessInput").focus();
  });

  /* Share */
  function currentShareText() {
    return buildShareText(gameNum, history, solved, guesses, chosen.number);
  }
  $("shareBtn")?.addEventListener("click", () => shareNice("Elemently", currentShareText(), "https://daily-le.com/elemently/"));
  $("shareTopBtn")?.addEventListener("click", () => shareNice("Elemently", currentShareText(), "https://daily-le.com/elemently/"));

  $("closeStatsBtn")?.addEventListener("click", hideModal);
  $("statsBackdrop")?.addEventListener("click", hideModal);
})();
