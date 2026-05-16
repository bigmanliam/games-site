const MAX_GUESSES = 4;
const DAILY_DONE_KEY = "statele_daily_done_v1";

/* Utilities: $, setText, todayLocalISO, gameNumberFromDate, hashStringToUint32,
   pickFromBag, showModal, hideModal, shareNice from ../shared.js */

/* ---- Data: 210 city/state entries covering all 50 states + territories ---- */
const CITIES = [
  // Alabama (4)
  {city:"Birmingham",state:"Alabama",hint:"Deep South",borders:"Tennessee, Georgia, Florida, Mississippi"},
  {city:"Tuscaloosa",state:"Alabama",hint:"Deep South",borders:"Tennessee, Georgia, Florida, Mississippi"},
  {city:"Huntsville",state:"Alabama",hint:"Deep South",borders:"Tennessee, Georgia, Florida, Mississippi"},
  {city:"Mobile",state:"Alabama",hint:"Gulf Coast",borders:"Tennessee, Georgia, Florida, Mississippi"},
  // Alaska (4)
  {city:"Anchorage",state:"Alaska",hint:"Far North",borders:"None (non-contiguous)"},
  {city:"Juneau",state:"Alaska",hint:"Far North",borders:"None (non-contiguous)"},
  {city:"Fairbanks",state:"Alaska",hint:"Far North",borders:"None (non-contiguous)"},
  {city:"Sitka",state:"Alaska",hint:"Far North",borders:"None (non-contiguous)"},
  // Arizona (4)
  {city:"Scottsdale",state:"Arizona",hint:"Southwest",borders:"Utah, Colorado, New Mexico, Nevada, California"},
  {city:"Flagstaff",state:"Arizona",hint:"Southwest",borders:"Utah, Colorado, New Mexico, Nevada, California"},
  {city:"Tempe",state:"Arizona",hint:"Southwest",borders:"Utah, Colorado, New Mexico, Nevada, California"},
  {city:"Sedona",state:"Arizona",hint:"Southwest",borders:"Utah, Colorado, New Mexico, Nevada, California"},
  // Arkansas (4)
  {city:"Little Rock",state:"Arkansas",hint:"South Central",borders:"Missouri, Tennessee, Mississippi, Louisiana, Texas, Oklahoma"},
  {city:"Fayetteville",state:"Arkansas",hint:"South Central",borders:"Missouri, Tennessee, Mississippi, Louisiana, Texas, Oklahoma"},
  {city:"Hot Springs",state:"Arkansas",hint:"South Central",borders:"Missouri, Tennessee, Mississippi, Louisiana, Texas, Oklahoma"},
  {city:"Bentonville",state:"Arkansas",hint:"South Central",borders:"Missouri, Tennessee, Mississippi, Louisiana, Texas, Oklahoma"},
  // California (5)
  {city:"San Diego",state:"California",hint:"West Coast",borders:"Oregon, Nevada, Arizona"},
  {city:"Eureka",state:"California",hint:"West Coast",borders:"Oregon, Nevada, Arizona"},
  {city:"Pasadena",state:"California",hint:"West Coast",borders:"Oregon, Nevada, Arizona"},
  {city:"Santa Barbara",state:"California",hint:"West Coast",borders:"Oregon, Nevada, Arizona"},
  {city:"Fresno",state:"California",hint:"West Coast",borders:"Oregon, Nevada, Arizona"},
  // Colorado (4)
  {city:"Boulder",state:"Colorado",hint:"Mountain West",borders:"Wyoming, Nebraska, Kansas, Oklahoma, New Mexico, Arizona, Utah"},
  {city:"Aspen",state:"Colorado",hint:"Mountain West",borders:"Wyoming, Nebraska, Kansas, Oklahoma, New Mexico, Arizona, Utah"},
  {city:"Fort Collins",state:"Colorado",hint:"Mountain West",borders:"Wyoming, Nebraska, Kansas, Oklahoma, New Mexico, Arizona, Utah"},
  {city:"Colorado Springs",state:"Colorado",hint:"Mountain West",borders:"Wyoming, Nebraska, Kansas, Oklahoma, New Mexico, Arizona, Utah"},
  // Connecticut (4)
  {city:"Stamford",state:"Connecticut",hint:"New England",borders:"New York, Massachusetts, Rhode Island"},
  {city:"New Haven",state:"Connecticut",hint:"New England",borders:"New York, Massachusetts, Rhode Island"},
  {city:"Hartford",state:"Connecticut",hint:"New England",borders:"New York, Massachusetts, Rhode Island"},
  {city:"Mystic",state:"Connecticut",hint:"New England",borders:"New York, Massachusetts, Rhode Island"},
  // Delaware (3)
  {city:"Wilmington",state:"Delaware",hint:"Mid-Atlantic",borders:"Maryland, Pennsylvania, New Jersey"},
  {city:"Dover",state:"Delaware",hint:"Mid-Atlantic",borders:"Maryland, Pennsylvania, New Jersey"},
  {city:"Rehoboth Beach",state:"Delaware",hint:"Mid-Atlantic",borders:"Maryland, Pennsylvania, New Jersey"},
  // Florida (5)
  {city:"Tampa",state:"Florida",hint:"Southeast",borders:"Alabama, Georgia"},
  {city:"Pensacola",state:"Florida",hint:"Gulf Coast",borders:"Alabama, Georgia"},
  {city:"Key West",state:"Florida",hint:"Southeast",borders:"Alabama, Georgia"},
  {city:"Sarasota",state:"Florida",hint:"Gulf Coast",borders:"Alabama, Georgia"},
  {city:"St. Augustine",state:"Florida",hint:"Southeast",borders:"Alabama, Georgia"},
  // Georgia (4)
  {city:"Savannah",state:"Georgia",hint:"Southeast",borders:"Florida, Alabama, Tennessee, North Carolina, South Carolina"},
  {city:"Augusta",state:"Georgia",hint:"Southeast",borders:"Florida, Alabama, Tennessee, North Carolina, South Carolina"},
  {city:"Athens",state:"Georgia",hint:"Southeast",borders:"Florida, Alabama, Tennessee, North Carolina, South Carolina"},
  {city:"Macon",state:"Georgia",hint:"Southeast",borders:"Florida, Alabama, Tennessee, North Carolina, South Carolina"},
  // Hawaii (4)
  {city:"Honolulu",state:"Hawaii",hint:"Pacific Islands",borders:"None (island state)"},
  {city:"Kailua",state:"Hawaii",hint:"Pacific Islands",borders:"None (island state)"},
  {city:"Hilo",state:"Hawaii",hint:"Pacific Islands",borders:"None (island state)"},
  {city:"Lahaina",state:"Hawaii",hint:"Pacific Islands",borders:"None (island state)"},
  // Idaho (4)
  {city:"Boise",state:"Idaho",hint:"Pacific Northwest",borders:"Montana, Wyoming, Utah, Nevada, Oregon, Washington"},
  {city:"Pocatello",state:"Idaho",hint:"Pacific Northwest",borders:"Montana, Wyoming, Utah, Nevada, Oregon, Washington"},
  {city:"Coeur d'Alene",state:"Idaho",hint:"Pacific Northwest",borders:"Montana, Wyoming, Utah, Nevada, Oregon, Washington"},
  {city:"Twin Falls",state:"Idaho",hint:"Pacific Northwest",borders:"Montana, Wyoming, Utah, Nevada, Oregon, Washington"},
  // Illinois (4)
  {city:"Naperville",state:"Illinois",hint:"Midwest",borders:"Wisconsin, Iowa, Missouri, Kentucky, Indiana"},
  {city:"Springfield",state:"Illinois",hint:"Midwest",borders:"Wisconsin, Iowa, Missouri, Kentucky, Indiana"},
  {city:"Peoria",state:"Illinois",hint:"Midwest",borders:"Wisconsin, Iowa, Missouri, Kentucky, Indiana"},
  {city:"Evanston",state:"Illinois",hint:"Midwest",borders:"Wisconsin, Iowa, Missouri, Kentucky, Indiana"},
  // Indiana (4)
  {city:"Fort Wayne",state:"Indiana",hint:"Midwest",borders:"Michigan, Ohio, Kentucky, Illinois"},
  {city:"Bloomington",state:"Indiana",hint:"Midwest",borders:"Michigan, Ohio, Kentucky, Illinois"},
  {city:"South Bend",state:"Indiana",hint:"Midwest",borders:"Michigan, Ohio, Kentucky, Illinois"},
  {city:"Carmel",state:"Indiana",hint:"Midwest",borders:"Michigan, Ohio, Kentucky, Illinois"},
  // Iowa (4)
  {city:"Cedar Rapids",state:"Iowa",hint:"Midwest",borders:"Minnesota, Wisconsin, Illinois, Missouri, Nebraska, South Dakota"},
  {city:"Des Moines",state:"Iowa",hint:"Midwest",borders:"Minnesota, Wisconsin, Illinois, Missouri, Nebraska, South Dakota"},
  {city:"Iowa City",state:"Iowa",hint:"Midwest",borders:"Minnesota, Wisconsin, Illinois, Missouri, Nebraska, South Dakota"},
  {city:"Davenport",state:"Iowa",hint:"Midwest",borders:"Minnesota, Wisconsin, Illinois, Missouri, Nebraska, South Dakota"},
  // Kansas (4)
  {city:"Wichita",state:"Kansas",hint:"Great Plains",borders:"Nebraska, Missouri, Oklahoma, Colorado"},
  {city:"Topeka",state:"Kansas",hint:"Great Plains",borders:"Nebraska, Missouri, Oklahoma, Colorado"},
  {city:"Lawrence",state:"Kansas",hint:"Great Plains",borders:"Nebraska, Missouri, Oklahoma, Colorado"},
  {city:"Manhattan",state:"Kansas",hint:"Great Plains",borders:"Nebraska, Missouri, Oklahoma, Colorado"},
  // Kentucky (4)
  {city:"Lexington",state:"Kentucky",hint:"Upper South",borders:"Indiana, Ohio, West Virginia, Virginia, Tennessee, Missouri, Illinois"},
  {city:"Louisville",state:"Kentucky",hint:"Upper South",borders:"Indiana, Ohio, West Virginia, Virginia, Tennessee, Missouri, Illinois"},
  {city:"Bowling Green",state:"Kentucky",hint:"Upper South",borders:"Indiana, Ohio, West Virginia, Virginia, Tennessee, Missouri, Illinois"},
  {city:"Paducah",state:"Kentucky",hint:"Upper South",borders:"Indiana, Ohio, West Virginia, Virginia, Tennessee, Missouri, Illinois"},
  // Louisiana (4)
  {city:"Baton Rouge",state:"Louisiana",hint:"Gulf Coast",borders:"Arkansas, Mississippi, Texas"},
  {city:"Shreveport",state:"Louisiana",hint:"Gulf Coast",borders:"Arkansas, Mississippi, Texas"},
  {city:"Lafayette",state:"Louisiana",hint:"Gulf Coast",borders:"Arkansas, Mississippi, Texas"},
  {city:"Lake Charles",state:"Louisiana",hint:"Gulf Coast",borders:"Arkansas, Mississippi, Texas"},
  // Maine (4)
  {city:"Bangor",state:"Maine",hint:"New England",borders:"New Hampshire"},
  {city:"Portland",state:"Maine",hint:"New England",borders:"New Hampshire"},
  {city:"Bar Harbor",state:"Maine",hint:"New England",borders:"New Hampshire"},
  {city:"Augusta",state:"Maine",hint:"New England",borders:"New Hampshire"},
  // Maryland (4)
  {city:"Annapolis",state:"Maryland",hint:"Mid-Atlantic",borders:"Pennsylvania, Delaware, Virginia, West Virginia"},
  {city:"Baltimore",state:"Maryland",hint:"Mid-Atlantic",borders:"Pennsylvania, Delaware, Virginia, West Virginia"},
  {city:"Frederick",state:"Maryland",hint:"Mid-Atlantic",borders:"Pennsylvania, Delaware, Virginia, West Virginia"},
  {city:"Ocean City",state:"Maryland",hint:"Mid-Atlantic",borders:"Pennsylvania, Delaware, Virginia, West Virginia"},
  // Massachusetts (4)
  {city:"Cambridge",state:"Massachusetts",hint:"New England",borders:"New York, Vermont, New Hampshire, Rhode Island, Connecticut"},
  {city:"Salem",state:"Massachusetts",hint:"New England",borders:"New York, Vermont, New Hampshire, Rhode Island, Connecticut"},
  {city:"Plymouth",state:"Massachusetts",hint:"New England",borders:"New York, Vermont, New Hampshire, Rhode Island, Connecticut"},
  {city:"Worcester",state:"Massachusetts",hint:"New England",borders:"New York, Vermont, New Hampshire, Rhode Island, Connecticut"},
  // Michigan (4)
  {city:"Grand Rapids",state:"Michigan",hint:"Great Lakes",borders:"Ohio, Indiana, Wisconsin"},
  {city:"Traverse City",state:"Michigan",hint:"Great Lakes",borders:"Ohio, Indiana, Wisconsin"},
  {city:"Ann Arbor",state:"Michigan",hint:"Great Lakes",borders:"Ohio, Indiana, Wisconsin"},
  {city:"Kalamazoo",state:"Michigan",hint:"Great Lakes",borders:"Ohio, Indiana, Wisconsin"},
  // Minnesota (4)
  {city:"Duluth",state:"Minnesota",hint:"Upper Midwest",borders:"Wisconsin, Iowa, South Dakota, North Dakota"},
  {city:"Rochester",state:"Minnesota",hint:"Upper Midwest",borders:"Wisconsin, Iowa, South Dakota, North Dakota"},
  {city:"Bloomington",state:"Minnesota",hint:"Upper Midwest",borders:"Wisconsin, Iowa, South Dakota, North Dakota"},
  {city:"St. Cloud",state:"Minnesota",hint:"Upper Midwest",borders:"Wisconsin, Iowa, South Dakota, North Dakota"},
  // Mississippi (4)
  {city:"Biloxi",state:"Mississippi",hint:"Deep South",borders:"Tennessee, Alabama, Louisiana, Arkansas"},
  {city:"Natchez",state:"Mississippi",hint:"Deep South",borders:"Tennessee, Alabama, Louisiana, Arkansas"},
  {city:"Hattiesburg",state:"Mississippi",hint:"Deep South",borders:"Tennessee, Alabama, Louisiana, Arkansas"},
  {city:"Oxford",state:"Mississippi",hint:"Deep South",borders:"Tennessee, Alabama, Louisiana, Arkansas"},
  // Missouri (4)
  {city:"Branson",state:"Missouri",hint:"Midwest",borders:"Iowa, Illinois, Kentucky, Tennessee, Arkansas, Oklahoma, Kansas, Nebraska"},
  {city:"Springfield",state:"Missouri",hint:"Midwest",borders:"Iowa, Illinois, Kentucky, Tennessee, Arkansas, Oklahoma, Kansas, Nebraska"},
  {city:"Independence",state:"Missouri",hint:"Midwest",borders:"Iowa, Illinois, Kentucky, Tennessee, Arkansas, Oklahoma, Kansas, Nebraska"},
  {city:"Columbia",state:"Missouri",hint:"Midwest",borders:"Iowa, Illinois, Kentucky, Tennessee, Arkansas, Oklahoma, Kansas, Nebraska"},
  // Montana (4)
  {city:"Billings",state:"Montana",hint:"Mountain West",borders:"North Dakota, South Dakota, Wyoming, Idaho"},
  {city:"Missoula",state:"Montana",hint:"Mountain West",borders:"North Dakota, South Dakota, Wyoming, Idaho"},
  {city:"Helena",state:"Montana",hint:"Mountain West",borders:"North Dakota, South Dakota, Wyoming, Idaho"},
  {city:"Bozeman",state:"Montana",hint:"Mountain West",borders:"North Dakota, South Dakota, Wyoming, Idaho"},
  // Nebraska (4)
  {city:"Omaha",state:"Nebraska",hint:"Great Plains",borders:"South Dakota, Iowa, Missouri, Kansas, Colorado, Wyoming"},
  {city:"Lincoln",state:"Nebraska",hint:"Great Plains",borders:"South Dakota, Iowa, Missouri, Kansas, Colorado, Wyoming"},
  {city:"Grand Island",state:"Nebraska",hint:"Great Plains",borders:"South Dakota, Iowa, Missouri, Kansas, Colorado, Wyoming"},
  {city:"Kearney",state:"Nebraska",hint:"Great Plains",borders:"South Dakota, Iowa, Missouri, Kansas, Colorado, Wyoming"},
  // Nevada (4)
  {city:"Reno",state:"Nevada",hint:"West",borders:"Oregon, Idaho, Utah, Arizona, California"},
  {city:"Henderson",state:"Nevada",hint:"West",borders:"Oregon, Idaho, Utah, Arizona, California"},
  {city:"Carson City",state:"Nevada",hint:"West",borders:"Oregon, Idaho, Utah, Arizona, California"},
  {city:"Sparks",state:"Nevada",hint:"West",borders:"Oregon, Idaho, Utah, Arizona, California"},
  // New Hampshire (4)
  {city:"Nashua",state:"New Hampshire",hint:"New England",borders:"Maine, Vermont, Massachusetts"},
  {city:"Concord",state:"New Hampshire",hint:"New England",borders:"Maine, Vermont, Massachusetts"},
  {city:"Portsmouth",state:"New Hampshire",hint:"New England",borders:"Maine, Vermont, Massachusetts"},
  {city:"Hanover",state:"New Hampshire",hint:"New England",borders:"Maine, Vermont, Massachusetts"},
  // New Jersey (4)
  {city:"Newark",state:"New Jersey",hint:"Mid-Atlantic",borders:"New York, Pennsylvania, Delaware"},
  {city:"Princeton",state:"New Jersey",hint:"Mid-Atlantic",borders:"New York, Pennsylvania, Delaware"},
  {city:"Hoboken",state:"New Jersey",hint:"Mid-Atlantic",borders:"New York, Pennsylvania, Delaware"},
  {city:"Atlantic City",state:"New Jersey",hint:"Mid-Atlantic",borders:"New York, Pennsylvania, Delaware"},
  // New Mexico (4)
  {city:"Santa Fe",state:"New Mexico",hint:"Southwest",borders:"Colorado, Oklahoma, Texas, Arizona, Utah"},
  {city:"Albuquerque",state:"New Mexico",hint:"Southwest",borders:"Colorado, Oklahoma, Texas, Arizona, Utah"},
  {city:"Las Cruces",state:"New Mexico",hint:"Southwest",borders:"Colorado, Oklahoma, Texas, Arizona, Utah"},
  {city:"Taos",state:"New Mexico",hint:"Southwest",borders:"Colorado, Oklahoma, Texas, Arizona, Utah"},
  // New York (4)
  {city:"Buffalo",state:"New York",hint:"Northeast",borders:"New Jersey, Pennsylvania, Connecticut, Massachusetts, Vermont"},
  {city:"Syracuse",state:"New York",hint:"Northeast",borders:"New Jersey, Pennsylvania, Connecticut, Massachusetts, Vermont"},
  {city:"Ithaca",state:"New York",hint:"Northeast",borders:"New Jersey, Pennsylvania, Connecticut, Massachusetts, Vermont"},
  {city:"Saratoga Springs",state:"New York",hint:"Northeast",borders:"New Jersey, Pennsylvania, Connecticut, Massachusetts, Vermont"},
  // North Carolina (4)
  {city:"Asheville",state:"North Carolina",hint:"Southeast",borders:"Virginia, Tennessee, Georgia, South Carolina"},
  {city:"Wilmington",state:"North Carolina",hint:"Southeast",borders:"Virginia, Tennessee, Georgia, South Carolina"},
  {city:"Chapel Hill",state:"North Carolina",hint:"Southeast",borders:"Virginia, Tennessee, Georgia, South Carolina"},
  {city:"Durham",state:"North Carolina",hint:"Southeast",borders:"Virginia, Tennessee, Georgia, South Carolina"},
  // North Dakota (3)
  {city:"Fargo",state:"North Dakota",hint:"Upper Great Plains",borders:"Minnesota, South Dakota, Montana"},
  {city:"Bismarck",state:"North Dakota",hint:"Upper Great Plains",borders:"Minnesota, South Dakota, Montana"},
  {city:"Grand Forks",state:"North Dakota",hint:"Upper Great Plains",borders:"Minnesota, South Dakota, Montana"},
  // Ohio (4)
  {city:"Akron",state:"Ohio",hint:"Midwest",borders:"Michigan, Indiana, Kentucky, West Virginia, Pennsylvania"},
  {city:"Cincinnati",state:"Ohio",hint:"Midwest",borders:"Michigan, Indiana, Kentucky, West Virginia, Pennsylvania"},
  {city:"Dayton",state:"Ohio",hint:"Midwest",borders:"Michigan, Indiana, Kentucky, West Virginia, Pennsylvania"},
  {city:"Toledo",state:"Ohio",hint:"Midwest",borders:"Michigan, Indiana, Kentucky, West Virginia, Pennsylvania"},
  // Oklahoma (4)
  {city:"Tulsa",state:"Oklahoma",hint:"South Central",borders:"Kansas, Missouri, Arkansas, Texas, New Mexico, Colorado"},
  {city:"Norman",state:"Oklahoma",hint:"South Central",borders:"Kansas, Missouri, Arkansas, Texas, New Mexico, Colorado"},
  {city:"Stillwater",state:"Oklahoma",hint:"South Central",borders:"Kansas, Missouri, Arkansas, Texas, New Mexico, Colorado"},
  {city:"Lawton",state:"Oklahoma",hint:"South Central",borders:"Kansas, Missouri, Arkansas, Texas, New Mexico, Colorado"},
  // Oregon (4)
  {city:"Eugene",state:"Oregon",hint:"Pacific Northwest",borders:"Washington, Idaho, Nevada, California"},
  {city:"Bend",state:"Oregon",hint:"Pacific Northwest",borders:"Washington, Idaho, Nevada, California"},
  {city:"Salem",state:"Oregon",hint:"Pacific Northwest",borders:"Washington, Idaho, Nevada, California"},
  {city:"Ashland",state:"Oregon",hint:"Pacific Northwest",borders:"Washington, Idaho, Nevada, California"},
  // Pennsylvania (4)
  {city:"Pittsburgh",state:"Pennsylvania",hint:"Mid-Atlantic",borders:"New York, New Jersey, Delaware, Maryland, West Virginia, Ohio"},
  {city:"Gettysburg",state:"Pennsylvania",hint:"Mid-Atlantic",borders:"New York, New Jersey, Delaware, Maryland, West Virginia, Ohio"},
  {city:"State College",state:"Pennsylvania",hint:"Mid-Atlantic",borders:"New York, New Jersey, Delaware, Maryland, West Virginia, Ohio"},
  {city:"Hershey",state:"Pennsylvania",hint:"Mid-Atlantic",borders:"New York, New Jersey, Delaware, Maryland, West Virginia, Ohio"},
  // Rhode Island (3)
  {city:"Providence",state:"Rhode Island",hint:"New England",borders:"Connecticut, Massachusetts"},
  {city:"Newport",state:"Rhode Island",hint:"New England",borders:"Connecticut, Massachusetts"},
  {city:"Warwick",state:"Rhode Island",hint:"New England",borders:"Connecticut, Massachusetts"},
  // South Carolina (4)
  {city:"Charleston",state:"South Carolina",hint:"Southeast",borders:"North Carolina, Georgia"},
  {city:"Greenville",state:"South Carolina",hint:"Southeast",borders:"North Carolina, Georgia"},
  {city:"Myrtle Beach",state:"South Carolina",hint:"Southeast",borders:"North Carolina, Georgia"},
  {city:"Hilton Head",state:"South Carolina",hint:"Southeast",borders:"North Carolina, Georgia"},
  // South Dakota (4)
  {city:"Sioux Falls",state:"South Dakota",hint:"Great Plains",borders:"North Dakota, Minnesota, Iowa, Nebraska, Wyoming, Montana"},
  {city:"Rapid City",state:"South Dakota",hint:"Great Plains",borders:"North Dakota, Minnesota, Iowa, Nebraska, Wyoming, Montana"},
  {city:"Deadwood",state:"South Dakota",hint:"Great Plains",borders:"North Dakota, Minnesota, Iowa, Nebraska, Wyoming, Montana"},
  {city:"Pierre",state:"South Dakota",hint:"Great Plains",borders:"North Dakota, Minnesota, Iowa, Nebraska, Wyoming, Montana"},
  // Tennessee (4)
  {city:"Knoxville",state:"Tennessee",hint:"Upper South",borders:"Kentucky, Virginia, North Carolina, Georgia, Alabama, Mississippi, Arkansas, Missouri"},
  {city:"Chattanooga",state:"Tennessee",hint:"Upper South",borders:"Kentucky, Virginia, North Carolina, Georgia, Alabama, Mississippi, Arkansas, Missouri"},
  {city:"Gatlinburg",state:"Tennessee",hint:"Upper South",borders:"Kentucky, Virginia, North Carolina, Georgia, Alabama, Mississippi, Arkansas, Missouri"},
  {city:"Pigeon Forge",state:"Tennessee",hint:"Upper South",borders:"Kentucky, Virginia, North Carolina, Georgia, Alabama, Mississippi, Arkansas, Missouri"},
  // Texas (5)
  {city:"El Paso",state:"Texas",hint:"South Central",borders:"New Mexico, Oklahoma, Arkansas, Louisiana"},
  {city:"Galveston",state:"Texas",hint:"Gulf Coast",borders:"New Mexico, Oklahoma, Arkansas, Louisiana"},
  {city:"Amarillo",state:"Texas",hint:"South Central",borders:"New Mexico, Oklahoma, Arkansas, Louisiana"},
  {city:"Corpus Christi",state:"Texas",hint:"Gulf Coast",borders:"New Mexico, Oklahoma, Arkansas, Louisiana"},
  {city:"Lubbock",state:"Texas",hint:"South Central",borders:"New Mexico, Oklahoma, Arkansas, Louisiana"},
  // Utah (4)
  {city:"Provo",state:"Utah",hint:"Mountain West",borders:"Idaho, Wyoming, Colorado, New Mexico, Arizona, Nevada"},
  {city:"Park City",state:"Utah",hint:"Mountain West",borders:"Idaho, Wyoming, Colorado, New Mexico, Arizona, Nevada"},
  {city:"Moab",state:"Utah",hint:"Mountain West",borders:"Idaho, Wyoming, Colorado, New Mexico, Arizona, Nevada"},
  {city:"St. George",state:"Utah",hint:"Mountain West",borders:"Idaho, Wyoming, Colorado, New Mexico, Arizona, Nevada"},
  // Vermont (4)
  {city:"Burlington",state:"Vermont",hint:"New England",borders:"New Hampshire, Massachusetts, New York"},
  {city:"Montpelier",state:"Vermont",hint:"New England",borders:"New Hampshire, Massachusetts, New York"},
  {city:"Stowe",state:"Vermont",hint:"New England",borders:"New Hampshire, Massachusetts, New York"},
  {city:"Brattleboro",state:"Vermont",hint:"New England",borders:"New Hampshire, Massachusetts, New York"},
  // Virginia (4)
  {city:"Virginia Beach",state:"Virginia",hint:"Mid-Atlantic",borders:"Maryland, West Virginia, Kentucky, Tennessee, North Carolina"},
  {city:"Charlottesville",state:"Virginia",hint:"Mid-Atlantic",borders:"Maryland, West Virginia, Kentucky, Tennessee, North Carolina"},
  {city:"Alexandria",state:"Virginia",hint:"Mid-Atlantic",borders:"Maryland, West Virginia, Kentucky, Tennessee, North Carolina"},
  {city:"Roanoke",state:"Virginia",hint:"Mid-Atlantic",borders:"Maryland, West Virginia, Kentucky, Tennessee, North Carolina"},
  // Washington (4)
  {city:"Tacoma",state:"Washington",hint:"Pacific Northwest",borders:"Oregon, Idaho"},
  {city:"Spokane",state:"Washington",hint:"Pacific Northwest",borders:"Oregon, Idaho"},
  {city:"Bellingham",state:"Washington",hint:"Pacific Northwest",borders:"Oregon, Idaho"},
  {city:"Olympia",state:"Washington",hint:"Pacific Northwest",borders:"Oregon, Idaho"},
  // West Virginia (4)
  {city:"Morgantown",state:"West Virginia",hint:"Appalachia",borders:"Pennsylvania, Maryland, Virginia, Kentucky, Ohio"},
  {city:"Charleston",state:"West Virginia",hint:"Appalachia",borders:"Pennsylvania, Maryland, Virginia, Kentucky, Ohio"},
  {city:"Harpers Ferry",state:"West Virginia",hint:"Appalachia",borders:"Pennsylvania, Maryland, Virginia, Kentucky, Ohio"},
  {city:"Wheeling",state:"West Virginia",hint:"Appalachia",borders:"Pennsylvania, Maryland, Virginia, Kentucky, Ohio"},
  // Wisconsin (4)
  {city:"Green Bay",state:"Wisconsin",hint:"Upper Midwest",borders:"Michigan, Minnesota, Iowa, Illinois"},
  {city:"Madison",state:"Wisconsin",hint:"Upper Midwest",borders:"Michigan, Minnesota, Iowa, Illinois"},
  {city:"Milwaukee",state:"Wisconsin",hint:"Upper Midwest",borders:"Michigan, Minnesota, Iowa, Illinois"},
  {city:"Eau Claire",state:"Wisconsin",hint:"Upper Midwest",borders:"Michigan, Minnesota, Iowa, Illinois"},
  // Wyoming (4)
  {city:"Cheyenne",state:"Wyoming",hint:"Mountain West",borders:"Montana, South Dakota, Nebraska, Colorado, Utah, Idaho"},
  {city:"Jackson",state:"Wyoming",hint:"Mountain West",borders:"Montana, South Dakota, Nebraska, Colorado, Utah, Idaho"},
  {city:"Laramie",state:"Wyoming",hint:"Mountain West",borders:"Montana, South Dakota, Nebraska, Colorado, Utah, Idaho"},
  {city:"Cody",state:"Wyoming",hint:"Mountain West",borders:"Montana, South Dakota, Nebraska, Colorado, Utah, Idaho"},
  // Territories (5)
  {city:"San Juan",state:"Puerto Rico",hint:"Caribbean Territory",borders:"None (island territory)"},
  {city:"Pago Pago",state:"American Samoa",hint:"Pacific Territory",borders:"None (island territory)"},
  {city:"Hagatna",state:"Guam",hint:"Pacific Territory",borders:"None (island territory)"},
  {city:"Charlotte Amalie",state:"US Virgin Islands",hint:"Caribbean Territory",borders:"None (island territory)"},
  {city:"Saipan",state:"Northern Mariana Islands",hint:"Pacific Territory",borders:"None (island territory)"},
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

/* ---- Share ---- */
function buildShareText(puzzleNo, history, solved, guessesUsed) {
  const emojis = history.map(h => h.correct ? "🟩" : "🟥").join("");
  const score = solved ? `${guessesUsed}/${MAX_GUESSES}` : `X/${MAX_GUESSES}`;
  return `Statele #${puzzleNo} 🏙️\n${emojis}\n${score}\nhttps://daily-le.com/statele/`;
}

/* ---- Main ---- */
(function main() {
  const today = todayLocalISO();
  const gameNum = gameNumberFromDate(today);
  setText("dayPill", `#${gameNum} · ${today}`);
  setText("triesPill", `Guesses: 0/${MAX_GUESSES}`);

  const chosen = pickFromBag(CITIES, "statele", today);
  setText("cityName", chosen.city);

  const getGuess = setupSearch();

  let guesses = 0;
  let solved = false;
  const history = [];

  /* Share & modal close (bound before early-return so they work on revisit) */
  function currentShareText() {
    return buildShareText(gameNum, history, solved, guesses);
  }
  $("shareBtn")?.addEventListener("click", () => shareNice("Statele", currentShareText(), "https://daily-le.com/statele/"));
  $("shareTopBtn")?.addEventListener("click", () => shareNice("Statele", currentShareText(), "https://daily-le.com/statele/"));
  $("closeStatsBtn")?.addEventListener("click", hideModal);
  $("statsBackdrop")?.addEventListener("click", hideModal);

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

    if (guesses >= MAX_GUESSES) { endGame(false); return; }

    $("guessInput").focus();
  });

  /* Reveal Hint button — all 3 hints available from the start, revealed one at a time */
  let hintsRevealed = 0;
  const hintBtn = $("hintBtn");

  hintBtn.addEventListener("click", () => {
    if (solved || hintsRevealed >= 3) return;
    hintsRevealed++;
    const hint = getHint(chosen, hintsRevealed);
    const current = $("hintLine").textContent;
    if (current) {
      setText("hintLine", current + " | " + hint);
    } else {
      setText("hintLine", hint);
    }
    if (hintsRevealed >= 3) {
      hintBtn.disabled = true;
    }
  });

})();
