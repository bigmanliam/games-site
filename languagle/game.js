const MAX_GUESSES = 4;
const DAILY_DONE_KEY = "languagle_daily_done_v1";

const LANGUAGES = [
  {language:"Japanese", snippet:"桜の花が風に舞い散る美しい春の日", hints:["East Asian language","Uses three writing systems","Spoken primarily on an island nation in the Pacific"]},
  {language:"Korean", snippet:"하늘 아래 모든 것이 아름답다", hints:["East Asian language","Uses a unique alphabetic block script","The script was invented in the 15th century"]},
  {language:"Mandarin Chinese", snippet:"学而时习之，不亦说乎", hints:["East Asian language","Uses logographic characters","The most spoken language in the world by native speakers"]},
  {language:"Hindi", snippet:"जहाँ चाह वहाँ राह", hints:["South Asian language","Written in Devanagari script","Official language of the world's most populous country"]},
  {language:"Arabic", snippet:"العلم نور والجهل ظلام", hints:["Written right to left","Semitic language family","Spoken across North Africa and the Middle East"]},
  {language:"Russian", snippet:"В гостях хорошо, а дома лучше", hints:["Uses Cyrillic script","Slavic language","The largest country in the world speaks this"]},
  {language:"Greek", snippet:"Η γνώση είναι δύναμη", hints:["European language with its own unique alphabet","One of the oldest written languages still in use","The language of ancient philosophers and democracy"]},
  {language:"Thai", snippet:"น้ำขึ้นหลายปลาอยู่ได้ เรือหลายปลาช่วยขับได้", hints:["Southeast Asian language","Uses a unique abugida script with many tonal marks","This country was never colonized by a European power"]},
  {language:"Hebrew", snippet:"בראשית ברא אלהים את השמים ואת הארץ", hints:["Written right to left","Revived as a spoken language in the 19th century","Official language of Israel"]},
  {language:"Turkish", snippet:"Bir elin nesi var, iki elin sesi var", hints:["Turkic language family","Uses Latin script with special characters","Bridges Europe and Asia"]},
  {language:"Vietnamese", snippet:"Học, học nữa, học mãi", hints:["Southeast Asian language","Uses Latin script with many diacritical marks","A tonal language with six tones"]},
  {language:"Swahili", snippet:"Umoja ni nguvu, utengano ni udhaifu", hints:["Bantu language family","Widely spoken in East Africa","A lingua franca across multiple African nations"]},
  {language:"Portuguese", snippet:"Quem não tem cão, caça com gato", hints:["Romance language","Spoken on two continents as a primary language","Uses cedilla and nasal vowels"]},
  {language:"Spanish", snippet:"No hay mal que por bien no venga", hints:["Romance language","The second most spoken native language in the world","Spoken across most of Central and South America"]},
  {language:"French", snippet:"Petit à petit, l’oiseau fait son nid", hints:["Romance language","Known for its nasal vowels and liaison","Official language in over 25 countries"]},
  {language:"German", snippet:"Morgenstund hat Gold im Mund", hints:["Germanic language","Known for long compound words","The most widely spoken native language in the EU"]},
  {language:"Italian", snippet:"Chi dorme non piglia pesci", hints:["Romance language","Spoken on a boot-shaped peninsula","Known for its musical quality and double consonants"]},
  {language:"Dutch", snippet:"Wie goed doet, goed ontmoet", hints:["Germanic language","Spoken in the Low Countries","Often described as sounding between English and German"]},
  {language:"Swedish", snippet:"Borta bra men hemma bäst", hints:["North Germanic language","Uses the letters å, ä, and ö","Scandinavian country known for IKEA and Nobel prizes"]},
  {language:"Norwegian", snippet:"Øvelse gjør mester", hints:["North Germanic language","Uses the letters æ, ø, and å","Land of fjords and the midnight sun"]},
  {language:"Finnish", snippet:"Hyvä kala, hyvässä vedessä", hints:["Not an Indo-European language despite being in Europe","Uralic language family","Known for extremely long words and 15 grammatical cases"]},
  {language:"Hungarian", snippet:"Gyakorlat teszi a mestert", hints:["Not an Indo-European language","Uralic language family, related to Finnish","A Central European language with unique vowel harmony"]},
  {language:"Polish", snippet:"Kto rano wstaje, temu Pan Bóg daje", hints:["Slavic language","Uses Latin script with special diacritics","Known for consonant clusters like szcz and prz"]},
  {language:"Czech", snippet:"Kdo jinému jámu kopá, sám do ní padá", hints:["West Slavic language","Uses the háček diacritic extensively","Spoken in a landlocked Central European country"]},
  {language:"Romanian", snippet:"Cine se scoală de dimineață, departe ajunge", hints:["Romance language","The only Romance language in Eastern Europe","Uses a cedilla and a breve diacritic"]},
  {language:"Icelandic", snippet:"Þ að er þjóðsátt, að þekkja sjálfan sig", hints:["North Germanic language","Has changed very little since medieval times","Uses the letters þ and ð, inherited from Old Norse"]},
  {language:"Welsh", snippet:"Cenedl heb iaith, cenedl heb galon", hints:["Celtic language","Spoken in a region of Great Britain","Known for words with many consonants like ll and dd"]},
  {language:"Irish", snippet:"Is fearr Gaeilge briste ná Béarla cliste", hints:["Celtic language","One of the official languages of the EU","Also known as Gaeilge"]},
  {language:"Basque", snippet:"Etxean ondo baina munduan hobeto", hints:["A language isolate in Europe","Spoken in the Pyrenees region","One of the oldest languages in Europe with no known relatives"]},
  {language:"Georgian", snippet:"განათლება და მეცნიერება ხელოვნებას ამშვენებს", hints:["Uses a unique rounded script found nowhere else","Spoken in a Caucasus nation","Has its own alphabet of 33 letters dating back to the 5th century"]},
  {language:"Armenian", snippet:"Կրթութիւնը կարեւոր է", hints:["Uses a unique alphabet created in 405 AD","Spoken in a Caucasus nation","An Indo-European language with its own branch"]},
  {language:"Tagalog", snippet:"Ang hindi marunong lumingon sa pinanggalingan ay hindi makararating sa paroroonan", hints:["Austronesian language","The basis for the national language of a Southeast Asian archipelago","Uses Latin script, formerly written in Baybayin"]},
  {language:"Malay", snippet:"Sedikit-sedikit, lama-lama menjadi bukit", hints:["Austronesian language","Spoken across Southeast Asia as a lingua franca","Very closely related to Indonesian"]},
  {language:"Indonesian", snippet:"Tak kenal maka tak sayang", hints:["Austronesian language","Spoken in the world's largest archipelago","Uses Latin script with no tonal system"]},
  {language:"Yoruba", snippet:"Àgbaà ò fin lé ni, ò fin lé òrò", hints:["West African language","Uses Latin script with subdots and tonal marks","One of the largest languages in Nigeria"]},
  {language:"Amharic", snippet:"ስበር ከሰበረ አጋሩን የመሳከሰው", hints:["Uses the Ge'ez script","Semitic language spoken in East Africa","The official working language of Ethiopia"]},
  {language:"Zulu", snippet:"Indlela ibuzwa kwabaphambili", hints:["Bantu language","Known for its click consonants","The most widely spoken home language in South Africa"]},
  {language:"Mongolian", snippet:"Нэг нэгэндээ хүчтэй, давхар давхардаа хүчтэй", hints:["Uses Cyrillic script in its modern form","Spoken across the steppes of Central Asia","The language of Genghis Khan's descendants"]},
  {language:"Nepali", snippet:"धैर्य राख्नेलाई सबै मिल्छ", hints:["South Asian language written in Devanagari","Spoken in a Himalayan nation","Related to Hindi but distinct"]},
  {language:"Bengali", snippet:"যে জাতির ভাষা নেই, সে জাতির মূল্য নেই", hints:["Uses a distinctive rounded script","One of the most spoken languages in the world","Official language of Bangladesh"]},
  {language:"Tamil", snippet:"கற்றது பசு, பசு பால் கல்", hints:["Dravidian language","One of the oldest living classical languages","Spoken in southern India and Sri Lanka"]},
  {language:"Esperanto", snippet:"Kiu semis venton, rikoltos fulmotondron", hints:["A constructed language","Created in 1887 by L.L. Zamenhof","Designed to be an easy-to-learn international auxiliary language"]},
  {language:"Latin", snippet:"Veni, vidi, vici", hints:["An ancient classical language","The ancestor of all Romance languages","Was the lingua franca of the Roman Empire"]},
  {language:"Persian", snippet:"هر که بامش بیش برفش بیشتر", hints:["Written in a modified Arabic script","Also known as Farsi","An Indo-European language spoken in the Middle East and Central Asia"]},
  {language:"Urdu", snippet:"بوند بوند سے دریا بنتا ہے", hints:["Written in a modified Arabic script","Closely related to Hindi in spoken form","National language of Pakistan"]},
  {language:"Hausa", snippet:"Ruwan dare ba ya cika randa", hints:["Chadic language using Latin script","One of the most widely spoken languages in West Africa","Serves as a lingua franca across the Sahel region"]},
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

/* ---- Hints ---- */
function getHint(chosen, guessNum) {
  if (chosen.hints && chosen.hints[guessNum - 1]) return chosen.hints[guessNum - 1];
  return "";
}

/* ---- Search dropdown ---- */
function setupSearch(allNames) {
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
    const matches = allNames.filter(c => c.toLowerCase().includes(q));
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
  return `Languagle #${puzzleNo} 🌍\n${emojis}\n${score}\nhttps://daily-le.com/languagle/`;
}

async function shareNice(text) {
  if (navigator.share) {
    try { await navigator.share({ title: "Languagle", text, url: "https://daily-le.com/languagle/" }); return; } catch {}
  }
  try { await navigator.clipboard.writeText(text); } catch { prompt("Copy:", text); }
}

/* ---- Main ---- */
(function main() {
  const today = todayLocalISO();
  const puzzleNo = gameNumberFromDate(today);
  setText("dayPill", `#${puzzleNo} — ${today}`);
  setText("triesPill", `Guesses: 0/${MAX_GUESSES}`);

  const chosen = pickDeterministic(LANGUAGES, "languagle|" + today);
  setText("snippetText", chosen.snippet);

  const allNames = [...new Set(LANGUAGES.map(l => l.language))].sort();
  const getGuess = setupSearch(allNames);

  let guesses = 0;
  let solved = false;
  const history = [];

  // Already played
  if (localStorage.getItem(DAILY_DONE_KEY) === today) {
    $("guessInput").disabled = true;
    $("guessBtn").disabled = true;
    setText("endTitle", "Already played today");
    setText("endBody", `The answer was: ${chosen.language}`);
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

    setText("endTitle", win ? "You got it! 🌍" : "Not this time ❌");
    setText("endBody", `The answer was: ${chosen.language}`);

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
      setText("errorLine", "Type a language name.");
      return;
    }

    guesses++;
    const correct = guess.toLowerCase().trim() === chosen.language.toLowerCase().trim();
    history.push({ name: guess, correct });

    setText("triesPill", `Guesses: ${guesses}/${MAX_GUESSES}`);

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

    const hint = getHint(chosen, guesses);
    if (hint) setText("hintLine", "Hint: " + hint);

    if (guesses >= MAX_GUESSES) { endGame(false); return; }

    $("guessInput").focus();
  });

  // Share
  function currentShareText() {
    return buildShareText(puzzleNo, history, solved, guesses);
  }
  $("shareBtn")?.addEventListener("click", () => shareNice(currentShareText()));
  $("shareTopBtn")?.addEventListener("click", () => shareNice(currentShareText()));

  $("closeStatsBtn")?.addEventListener("click", hideModal);
  $("statsBackdrop")?.addEventListener("click", hideModal);
})();
