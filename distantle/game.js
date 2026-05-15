const MAX_GUESSES = 6;
const WIN_PCT = 0.10; // within 10%

const DAILY_DONE_KEY = "distantle_daily_done_v1";

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

function gameNumberFromDate(dateISO) {
  const base = new Date("2026-01-01T00:00:00");
  const cur = new Date(dateISO + "T00:00:00");
  return Math.max(1, Math.round((cur - base) / 86400000) + 1);
}

// Haversine distance in km
function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = d => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// 80 major world cities with coordinates
const CITIES = [
  {name:"Tokyo",country:"Japan",lat:35.6762,lon:139.6503},
  {name:"Delhi",country:"India",lat:28.7041,lon:77.1025},
  {name:"Shanghai",country:"China",lat:31.2304,lon:121.4737},
  {name:"São Paulo",country:"Brazil",lat:-23.5505,lon:-46.6333},
  {name:"Mexico City",country:"Mexico",lat:19.4326,lon:-99.1332},
  {name:"Cairo",country:"Egypt",lat:30.0444,lon:31.2357},
  {name:"Mumbai",country:"India",lat:19.0760,lon:72.8777},
  {name:"Beijing",country:"China",lat:39.9042,lon:116.4074},
  {name:"Dhaka",country:"Bangladesh",lat:23.8103,lon:90.4125},
  {name:"Osaka",country:"Japan",lat:34.6937,lon:135.5023},
  {name:"New York",country:"USA",lat:40.7128,lon:-74.0060},
  {name:"Karachi",country:"Pakistan",lat:24.8607,lon:67.0011},
  {name:"Buenos Aires",country:"Argentina",lat:-34.6037,lon:-58.3816},
  {name:"Istanbul",country:"Turkey",lat:41.0082,lon:28.9784},
  {name:"Lagos",country:"Nigeria",lat:6.5244,lon:3.3792},
  {name:"Manila",country:"Philippines",lat:14.5995,lon:120.9842},
  {name:"Rio de Janeiro",country:"Brazil",lat:-22.9068,lon:-43.1729},
  {name:"Guangzhou",country:"China",lat:23.1291,lon:113.2644},
  {name:"Moscow",country:"Russia",lat:55.7558,lon:37.6173},
  {name:"Paris",country:"France",lat:48.8566,lon:2.3522},
  {name:"Bangkok",country:"Thailand",lat:13.7563,lon:100.5018},
  {name:"London",country:"UK",lat:51.5074,lon:-0.1278},
  {name:"Lima",country:"Peru",lat:-12.0464,lon:-77.0428},
  {name:"Jakarta",country:"Indonesia",lat:-6.2088,lon:106.8456},
  {name:"Bogotá",country:"Colombia",lat:4.7110,lon:-74.0721},
  {name:"Berlin",country:"Germany",lat:52.5200,lon:13.4050},
  {name:"Madrid",country:"Spain",lat:40.4168,lon:-3.7038},
  {name:"Rome",country:"Italy",lat:41.9028,lon:12.4964},
  {name:"Nairobi",country:"Kenya",lat:-1.2921,lon:36.8219},
  {name:"Johannesburg",country:"South Africa",lat:-26.2041,lon:28.0473},
  {name:"Sydney",country:"Australia",lat:-33.8688,lon:151.2093},
  {name:"Toronto",country:"Canada",lat:43.6532,lon:-79.3832},
  {name:"Los Angeles",country:"USA",lat:34.0522,lon:-118.2437},
  {name:"Seoul",country:"South Korea",lat:37.5665,lon:126.9780},
  {name:"Singapore",country:"Singapore",lat:1.3521,lon:103.8198},
  {name:"Hong Kong",country:"China",lat:22.3193,lon:114.1694},
  {name:"Taipei",country:"Taiwan",lat:25.0330,lon:121.5654},
  {name:"Hanoi",country:"Vietnam",lat:21.0278,lon:105.8342},
  {name:"Santiago",country:"Chile",lat:-33.4489,lon:-70.6693},
  {name:"Dubai",country:"UAE",lat:25.2048,lon:55.2708},
  {name:"Riyadh",country:"Saudi Arabia",lat:24.7136,lon:46.6753},
  {name:"Tehran",country:"Iran",lat:35.6892,lon:51.3890},
  {name:"Baghdad",country:"Iraq",lat:33.3152,lon:44.3661},
  {name:"Kuala Lumpur",country:"Malaysia",lat:3.1390,lon:101.6869},
  {name:"Addis Ababa",country:"Ethiopia",lat:9.0250,lon:38.7469},
  {name:"Casablanca",country:"Morocco",lat:33.5731,lon:-7.5898},
  {name:"Accra",country:"Ghana",lat:5.6037,lon:-0.1870},
  {name:"Cape Town",country:"South Africa",lat:-33.9249,lon:18.4241},
  {name:"Lisbon",country:"Portugal",lat:38.7223,lon:-9.1393},
  {name:"Warsaw",country:"Poland",lat:52.2297,lon:21.0122},
  {name:"Vienna",country:"Austria",lat:48.2082,lon:16.3738},
  {name:"Athens",country:"Greece",lat:37.9838,lon:23.7275},
  {name:"Stockholm",country:"Sweden",lat:59.3293,lon:18.0686},
  {name:"Oslo",country:"Norway",lat:59.9139,lon:10.7522},
  {name:"Copenhagen",country:"Denmark",lat:55.6761,lon:12.5683},
  {name:"Helsinki",country:"Finland",lat:60.1699,lon:24.9384},
  {name:"Dublin",country:"Ireland",lat:53.3498,lon:-6.2603},
  {name:"Zurich",country:"Switzerland",lat:47.3769,lon:8.5417},
  {name:"Amsterdam",country:"Netherlands",lat:52.3676,lon:4.9041},
  {name:"Brussels",country:"Belgium",lat:50.8503,lon:4.3517},
  {name:"Prague",country:"Czech Republic",lat:50.0755,lon:14.4378},
  {name:"Budapest",country:"Hungary",lat:47.4979,lon:19.0402},
  {name:"Bucharest",country:"Romania",lat:44.4268,lon:26.1025},
  {name:"Havana",country:"Cuba",lat:23.1136,lon:-82.3666},
  {name:"Reykjavik",country:"Iceland",lat:64.1466,lon:-21.9426},
  {name:"Kathmandu",country:"Nepal",lat:27.7172,lon:85.3240},
  {name:"Colombo",country:"Sri Lanka",lat:6.9271,lon:79.8612},
  {name:"Auckland",country:"New Zealand",lat:-36.8485,lon:174.7633},
  {name:"Dakar",country:"Senegal",lat:14.7167,lon:-17.4677},
  {name:"Kinshasa",country:"DR Congo",lat:-4.4419,lon:15.2663},
  {name:"Dar es Salaam",country:"Tanzania",lat:-6.7924,lon:39.2083},
  {name:"Yangon",country:"Myanmar",lat:16.8661,lon:96.1951},
  {name:"Phnom Penh",country:"Cambodia",lat:11.5564,lon:104.9282},
  {name:"Islamabad",country:"Pakistan",lat:33.6844,lon:73.0479},
  {name:"Ankara",country:"Turkey",lat:39.9334,lon:32.8597},
  {name:"Brasília",country:"Brazil",lat:-15.7975,lon:-47.8919},
  {name:"Washington DC",country:"USA",lat:38.9072,lon:-77.0369},
  {name:"Canberra",country:"Australia",lat:-35.2809,lon:149.1300},
  {name:"Ottawa",country:"Canada",lat:45.4215,lon:-75.6972},
  {name:"Rabat",country:"Morocco",lat:34.0209,lon:-6.8416},
];

// Generate city pairs (avoid same-country pairs and too-close pairs)
function generatePairs() {
  const pairs = [];
  for (let i = 0; i < CITIES.length; i++) {
    for (let j = i + 1; j < CITIES.length; j++) {
      const d = haversineKm(CITIES[i].lat, CITIES[i].lon, CITIES[j].lat, CITIES[j].lon);
      if (d > 300 && CITIES[i].country !== CITIES[j].country) {
        pairs.push({ a: CITIES[i], b: CITIES[j], dist: Math.round(d) });
      }
    }
  }
  return pairs;
}

const ALL_PAIRS = generatePairs();

function pickDailyPair(dateISO) {
  const h = hashStringToUint32("distantle|" + dateISO);
  return ALL_PAIRS[h % ALL_PAIRS.length];
}

function formatKm(n) {
  return n.toLocaleString(undefined) + " km";
}

function bandForError(pct) {
  if (pct <= WIN_PCT) return { label: "Win Range", cls: "good", emoji: "🟢" };
  if (pct <= 0.10) return { label: "Very Close", cls: "good", emoji: "🟢" };
  if (pct <= 0.20) return { label: "Close", cls: "warn", emoji: "🟡" };
  if (pct <= 0.40) return { label: "Far", cls: "warn", emoji: "🟠" };
  return { label: "Very Far", cls: "bad", emoji: "🔴" };
}

function directionArrow(guess, actual) {
  if (guess === actual) return "✅";
  return guess < actual ? "⬆️" : "⬇️";
}

function parseGuessKm(raw) {
  const cleaned = raw.trim().replace(/[, _]/g, "");
  if (!cleaned) return null;
  if (!/^\d+$/.test(cleaned)) return null;
  const val = Number(cleaned);
  if (!Number.isFinite(val) || val < 1 || val > 25000) return null;
  return val;
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
  const row = history.map(h => `${h.band.emoji}${h.arrow}`).join(" ");
  const score = solved ? `${guessesUsed}/${MAX_GUESSES}` : `X/${MAX_GUESSES}`;
  return `Distantle #${puzzleNo} 📏\n${row}\n${score}\nhttps://daily-le.com/distantle/`;
}

async function shareNice(text) {
  if (navigator.share) {
    try { await navigator.share({ title: "Distantle", text, url: "https://daily-le.com/distantle/" }); return; } catch {}
  }
  try { await navigator.clipboard.writeText(text); } catch { prompt("Copy:", text); }
}

/* ---- Main ---- */
(function main() {
  const today = todayLocalISO();
  setText("dayPill", `Daily: ${today}`);
  setText("triesPill", `Guesses: 0/${MAX_GUESSES}`);

  const pair = pickDailyPair(today);
  setText("city1", pair.a.name);
  setText("country1", pair.a.country);
  setText("city2", pair.b.name);
  setText("country2", pair.b.country);

  const actualDist = pair.dist;
  let guesses = 0;
  let solved = false;
  const history = [];

  const guessInput = $("guessInput");
  const guessForm = $("guessForm");

  // Already played
  if (localStorage.getItem(DAILY_DONE_KEY) === today) {
    guessInput.disabled = true;
    $("guessBtn").disabled = true;
    setText("endTitle", "Already played today ✅");
    setText("endBody", `${pair.a.name} ↔ ${pair.b.name}: ${formatKm(actualDist)}`);
    $("shareBtn").disabled = false;
    $("shareTopBtn").disabled = false;
    showModal();
    return;
  }

  function endGame(win) {
    solved = win;
    guessInput.disabled = true;
    $("guessBtn").disabled = true;
    localStorage.setItem(DAILY_DONE_KEY, today);

    setText("endTitle", win ? "You got it! ✅" : "Out of guesses ❌");
    setText("endBody", `${pair.a.name} ↔ ${pair.b.name}: ${formatKm(actualDist)}`);

    // Emoji grid
    const grid = $("emojiGrid");
    if (grid) {
      grid.textContent = "";
      history.forEach(h => {
        const s = document.createElement("span");
        s.textContent = `${h.band.emoji}${h.arrow}`;
        grid.appendChild(s);
      });
      if (!win) {
        const s = document.createElement("span"); s.textContent = "❌"; grid.appendChild(s);
      }
    }

    // Guess list
    const list = $("guessStatsList");
    if (list) {
      list.textContent = "";
      history.forEach((h, i) => {
        const row = document.createElement("div"); row.className = "guessStatRow";
        row.innerHTML = `
          <div class="left">
            <div class="dot">${h.band.emoji}</div>
            <div class="meta">
              <div class="big">Guess ${i+1}: ${formatKm(h.guessKm)} ${h.arrow}</div>
              <div class="tiny">${h.band.label} • ${h.pctOff}% off</div>
            </div>
          </div>
          <div class="right"><span class="tag ${h.band.cls}">${h.band.label}</span></div>
        `;
        list.appendChild(row);
      });
    }

    $("shareBtn").disabled = false;
    $("shareTopBtn").disabled = false;
    showModal();
  }

  guessForm.addEventListener("submit", (e) => {
    e.preventDefault();
    setText("errorLine", "");
    if (solved) return;

    const guessKm = parseGuessKm(guessInput.value);
    if (guessKm === null) {
      setText("errorLine", "Enter a distance in km (e.g. 5000).");
      return;
    }

    guesses++;
    setText("triesPill", `Guesses: ${guesses}/${MAX_GUESSES}`);

    const pctErr = Math.abs(guessKm - actualDist) / Math.max(1, actualDist);
    const pctOff = Math.round(pctErr * 1000) / 10;
    const band = bandForError(pctErr);
    const arrow = pctErr <= WIN_PCT ? "✅" : directionArrow(guessKm, actualDist);

    history.push({ guessKm, arrow, band, pctOff });

    // History row
    const histEl = $("history");
    const row = document.createElement("div"); row.className = "row";
    row.innerHTML = `
      <div class="left">
        <div class="badge">${band.emoji}</div>
        <div class="meta">
          <div class="big">${formatKm(guessKm)} ${arrow}</div>
          <div class="tiny">${band.label}</div>
        </div>
      </div>
      <div class="right"><span class="tag ${band.cls}">${band.label}</span></div>
    `;
    histEl.prepend(row);

    if (pctErr <= WIN_PCT) { endGame(true); return; }
    if (guesses >= MAX_GUESSES) { endGame(false); return; }

    guessInput.value = "";
    guessInput.focus();
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
