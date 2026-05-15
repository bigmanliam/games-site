const MAX_GUESSES = 4;
const DAILY_DONE_KEY = "languagle_daily_done_v1";

const LANGUAGES = [
  // ---- East Asian ----
  {language:"Japanese", snippet:"桜の花が風に舞い散る美しい春の日", hints:["East Asian language","Uses three writing systems","Spoken primarily on an island nation in the Pacific"]},
  {language:"Korean", snippet:"하늘 아래 모든 것이 아름답다", hints:["East Asian language","Uses a unique alphabetic block script","The script was invented in the 15th century"]},
  {language:"Mandarin Chinese", snippet:"学而时习之，不亦说乎", hints:["East Asian language","Uses logographic characters","The most spoken language in the world by native speakers"]},
  {language:"Cantonese", snippet:"飲水思源，知恩圖報", hints:["East Asian language","Uses traditional Chinese characters","Spoken mainly in southern China and Hong Kong"]},

  // ---- South Asian ----
  {language:"Hindi", snippet:"जहाँ चाह वहाँ राह", hints:["South Asian language","Written in Devanagari script","Official language of the world's most populous country"]},
  {language:"Bengali", snippet:"যে জাতির ভাষা নেই, সে জাতির মূল্য নেই", hints:["Uses a distinctive rounded script","One of the most spoken languages in the world","Official language of Bangladesh"]},
  {language:"Tamil", snippet:"கற்றது பசு, பசு பால் கல்", hints:["Dravidian language","One of the oldest living classical languages","Spoken in southern India and Sri Lanka"]},
  {language:"Nepali", snippet:"धैर्य राख्नेलाई सबै मिल्छ", hints:["South Asian language written in Devanagari","Spoken in a Himalayan nation","Related to Hindi but distinct"]},
  {language:"Telugu", snippet:"చదువు రాని వాడు వింత పశువు", hints:["Dravidian language","Known as the Italian of the East","Second most spoken language in India by native speakers"]},
  {language:"Kannada", snippet:"ವಿದ್ಯೆ ಕಲಿತವನಿಗೆ ಯಾವ ದೇಶವೂ ಪರದೇಶವಲ್ಲ", hints:["Dravidian language","Spoken in southwestern India","Its script has rounded characters similar to Telugu"]},
  {language:"Malayalam", snippet:"അറിവ് ധനത്തിലും വലുത്", hints:["Dravidian language","Spoken in Kerala, India","Known for its highly rounded and looping script"]},
  {language:"Gujarati", snippet:"જ્ઞાન એ સૌથી મોટું ધન છે", hints:["Indo-Aryan language","Spoken in western India","The native language of Mahatma Gandhi"]},
  {language:"Punjabi", snippet:"ਜਿੱਥੇ ਚਾਹ ਉੱਥੇ ਰਾਹ", hints:["Indo-Aryan language","Written in Gurmukhi script in India","Spoken across the India-Pakistan border region"]},
  {language:"Sinhala", snippet:"දැනුම උතුම් සම්පතකි", hints:["Indo-Aryan language with Dravidian influence","Spoken on an island nation in the Indian Ocean","Uses a unique rounded script"]},
  {language:"Urdu", snippet:"بوند بوند سے دریا بنتا ہے", hints:["Written in a modified Arabic script","Closely related to Hindi in spoken form","National language of Pakistan"]},
  {language:"Marathi", snippet:"ज्ञानाचा दिवा लावा, अंधार दूर करा", hints:["Indo-Aryan language written in Devanagari","Spoken in western India around Mumbai","One of the oldest regional literary languages in India"]},

  // ---- Southeast Asian ----
  {language:"Thai", snippet:"น้ำขึ้นหลายปลาอยู่ได้ เรือหลายปลาช่วยขับได้", hints:["Southeast Asian language","Uses a unique abugida script with many tonal marks","This country was never colonized by a European power"]},
  {language:"Vietnamese", snippet:"Học, học nữa, học mãi", hints:["Southeast Asian language","Uses Latin script with many diacritical marks","A tonal language with six tones"]},
  {language:"Tagalog", snippet:"Ang hindi marunong lumingon sa pinanggalingan ay hindi makararating sa paroroonan", hints:["Austronesian language","The basis for the national language of a Southeast Asian archipelago","Uses Latin script, formerly written in Baybayin"]},
  {language:"Malay", snippet:"Sedikit-sedikit, lama-lama menjadi bukit", hints:["Austronesian language","Spoken across Southeast Asia as a lingua franca","Very closely related to Indonesian"]},
  {language:"Indonesian", snippet:"Tak kenal maka tak sayang", hints:["Austronesian language","Spoken in the world's largest archipelago","Uses Latin script with no tonal system"]},
  {language:"Burmese", snippet:"ပညာသည် အကောင်းဆုံး ရတနာ ဖြစ်သည်", hints:["Southeast Asian language","Uses a circular, looping script","Spoken in a country formerly known as Burma"]},
  {language:"Khmer", snippet:"សេចក្តីអត់ធ្មត់នាំមកនូវសេចក្តីសុខ", hints:["Southeast Asian language","Has one of the largest alphabets in the world","The official language of Cambodia"]},
  {language:"Lao", snippet:"ຄວາມຮູ້ຄືຊັບສົມບັດ", hints:["Southeast Asian tonal language","Its script is closely related to Thai","A landlocked country on the Mekong River"]},
  {language:"Javanese", snippet:"Ngono ya ngono, ning aja ngono", hints:["Austronesian language","The most spoken language without official status in any country","Spoken primarily on the island of Java"]},

  // ---- Middle Eastern ----
  {language:"Arabic", snippet:"العلم نور والجهل ظلام", hints:["Written right to left","Semitic language family","Spoken across North Africa and the Middle East"]},
  {language:"Hebrew", snippet:"בראשית ברא אלהים את השמים ואת הארץ", hints:["Written right to left","Revived as a spoken language in the 19th century","Official language of Israel"]},
  {language:"Persian", snippet:"هر که بامش بیش برفش بیشتر", hints:["Written in a modified Arabic script","Also known as Farsi","An Indo-European language spoken in the Middle East and Central Asia"]},
  {language:"Turkish", snippet:"Bir elin nesi var, iki elin sesi var", hints:["Turkic language family","Uses Latin script with special characters","Bridges Europe and Asia"]},
  {language:"Kurdish", snippet:"Zanîn hêz e û hêz azadî ye", hints:["Indo-European language","Spoken across multiple Middle Eastern countries","Does not have a single unified nation-state"]},
  {language:"Pashto", snippet:"پوهه ځواک دی او ځواک ازادي ده", hints:["Eastern Iranian language","Written in a modified Arabic script","One of the two official languages of Afghanistan"]},

  // ---- European ----
  {language:"Russian", snippet:"В гостях хорошо, а дома лучше", hints:["Uses Cyrillic script","Slavic language","The largest country in the world speaks this"]},
  {language:"Greek", snippet:"Η γνώση είναι δύναμη", hints:["European language with its own unique alphabet","One of the oldest written languages still in use","The language of ancient philosophers and democracy"]},
  {language:"Portuguese", snippet:"Quem não tem cão, caça com gato", hints:["Romance language","Spoken on two continents as a primary language","Uses cedilla and nasal vowels"]},
  {language:"Spanish", snippet:"No hay mal que por bien no venga", hints:["Romance language","The second most spoken native language in the world","Spoken across most of Central and South America"]},
  {language:"French", snippet:"Petit à petit, l'oiseau fait son nid", hints:["Romance language","Known for its nasal vowels and liaison","Official language in over 25 countries"]},
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
  {language:"Albanian", snippet:"Dija është fuqia më e madhe", hints:["Indo-European language with its own branch","Spoken in the Western Balkans","Uses Latin script with special characters like ë and ç"]},
  {language:"Serbian", snippet:"Знање је моћ", hints:["South Slavic language","Can be written in both Cyrillic and Latin scripts","Spoken in the Western Balkans"]},
  {language:"Croatian", snippet:"Znanje je moć", hints:["South Slavic language","Uses only Latin script","Spoken on the Adriatic coast"]},
  {language:"Bulgarian", snippet:"Знанието е сила", hints:["South Slavic language","Uses Cyrillic script","The oldest documented Slavic language"]},
  {language:"Ukrainian", snippet:"Знання — це сила", hints:["East Slavic language","Uses Cyrillic script with unique letters like і, ї, є","The second largest country in Europe by area speaks this"]},
  {language:"Lithuanian", snippet:"Žinios yra galia", hints:["Baltic language","One of the oldest living Indo-European languages","Uses Latin script with diacritics like ė, ū, š"]},
  {language:"Latvian", snippet:"Zināšanas ir spēks", hints:["Baltic language","Uses Latin script with macrons and cedillas","Spoken on the eastern shore of the Baltic Sea"]},
  {language:"Estonian", snippet:"Teadmine on jõud", hints:["Not an Indo-European language despite being in Europe","Finno-Ugric language family","Spoken on the southern coast of the Gulf of Finland"]},
  {language:"Slovak", snippet:"Kto veľa vie, ten veľa dosiahne", hints:["West Slavic language","Very closely related to Czech","Uses the háček and dĺžeň diacritics"]},
  {language:"Slovenian", snippet:"Znanje je moč", hints:["South Slavic language","Has a rare dual grammatical number","A small Alpine country speaks this"]},
  {language:"Danish", snippet:"Øvelse gør mester", hints:["North Germanic language","Uses the letters æ, ø, and å","Known for its glottal stop called stød"]},
  {language:"Catalan", snippet:"El saber no ocupa lloc", hints:["Romance language","Spoken in northeastern Spain and Andorra","Closely related to both Spanish and French"]},
  {language:"Galician", snippet:"O saber non ocupa lugar", hints:["Romance language","Spoken in northwestern Spain","Closely related to Portuguese"]},
  {language:"Maltese", snippet:"L-għerf hu qawwa", hints:["The only Semitic language written in Latin script","Official language of a small Mediterranean island nation","Heavily influenced by Italian and English"]},
  {language:"Scottish Gaelic", snippet:"Is e an t-eòlas cumhachd", hints:["Celtic language","Spoken in the Scottish Highlands and islands","Related to Irish but mutually unintelligible"]},
  {language:"Breton", snippet:"Ar skiant zo galloud", hints:["Celtic language","Spoken in northwestern France","The only Celtic language spoken on the European mainland"]},

  // ---- African ----
  {language:"Swahili", snippet:"Umoja ni nguvu, utengano ni udhaifu", hints:["Bantu language family","Widely spoken in East Africa","A lingua franca across multiple African nations"]},
  {language:"Yoruba", snippet:"Àgbaà ò fin lé ni, ò fin lé òrò", hints:["West African language","Uses Latin script with subdots and tonal marks","One of the largest languages in Nigeria"]},
  {language:"Amharic", snippet:"ስበር ከሰበረ አጋሩን የመሳከሰው", hints:["Uses the Ge’ez script","Semitic language spoken in East Africa","The official working language of Ethiopia"]},
  {language:"Zulu", snippet:"Indlela ibuzwa kwabaphambili", hints:["Bantu language","Known for its click consonants","The most widely spoken home language in South Africa"]},
  {language:"Hausa", snippet:"Ruwan dare ba ya cika randa", hints:["Chadic language using Latin script","One of the most widely spoken languages in West Africa","Serves as a lingua franca across the Sahel region"]},
  {language:"Igbo", snippet:"Onye ajulu aju adighī efu", hints:["West African language","Uses Latin script with subdots","Spoken primarily in southeastern Nigeria"]},
  {language:"Somali", snippet:"Aqoon la’aani waa iftiin la’aan", hints:["Cushitic language family","Uses Latin script since the 1970s","Spoken in the Horn of Africa"]},
  {language:"Xhosa", snippet:"Umntu ngumntu ngabantu", hints:["Bantu language","Known for its three types of click consonants","Nelson Mandela's native language"]},
  {language:"Shona", snippet:"Ruzivo simba", hints:["Bantu language","Spoken in southern Africa","The most widely spoken language in Zimbabwe"]},
  {language:"Kinyarwanda", snippet:"Ubwenge burakura bukanagira inzira", hints:["Bantu language","Tonal language with long and short vowels","Official language of a small East African country known as the Land of a Thousand Hills"]},
  {language:"Tigrinya", snippet:"ፍልጠት ሕይሊ እዩ", hints:["Uses the Ge'ez script like Amharic","Semitic language spoken in the Horn of Africa","Official language of Eritrea"]},
  {language:"Wolof", snippet:"Ku am xam-xam, am na doole", hints:["West African language","Spoken primarily in Senegal","Uses Latin script and is widely used in daily commerce"]},
  {language:"Lingala", snippet:"Boyebi ezali makasi", hints:["Bantu language","A major lingua franca of the Congo Basin","Widely used in Congolese popular music"]},
  {language:"Twi", snippet:"Nimde3 y3 tumi", hints:["Akan language spoken in West Africa","Uses Latin script with special characters","One of the most spoken languages in Ghana"]},
  {language:"Malagasy", snippet:"Ny fahalalana dia hery", hints:["Austronesian language spoken in Africa","Despite being in Africa, it is related to Indonesian","The official language of a large island nation off southeast Africa"]},

  // ---- Central/North Asian ----
  {language:"Mongolian", snippet:"Нэг нэгэндээ хүчтэй, давхар давхардаа хүчтэй", hints:["Uses Cyrillic script in its modern form","Spoken across the steppes of Central Asia","The language of Genghis Khan's descendants"]},
  {language:"Kazakh", snippet:"Білім — күш", hints:["Turkic language","Uses Cyrillic script (transitioning to Latin)","Spoken in the largest landlocked country in the world"]},
  {language:"Uzbek", snippet:"Bilim kuch", hints:["Turkic language","Recently switched from Cyrillic to Latin script","Spoken in a Central Asian country along the ancient Silk Road"]},
  {language:"Tibetan", snippet:"ཤེས་རབ་ཉིད་ཀྱི་སྟོབས་ཡིན", hints:["Written in an Indic-derived script","Spoken on the highest plateau in the world","A Tibeto-Burman language with a complex honorific system"]},

  // ---- Indigenous American ----
  {language:"Quechua", snippet:"Yachayqa kallpam", hints:["Indigenous language of South America","Was the administrative language of the Inca Empire","Still spoken by millions in the Andes mountains"]},
  {language:"Guarani", snippet:"Arandu ha'e mbarete", hints:["Indigenous South American language","Co-official language with Spanish in a South American country","One of the few indigenous languages with official national status"]},
  {language:"Nahuatl", snippet:"In tlamatiliztli ipan chicahualiztli", hints:["Indigenous language of Mexico","The language of the Aztec civilization","Many English words like chocolate, tomato, and avocado come from this language"]},
  {language:"Aymara", snippet:"Yatiqawinxa ch'amawa", hints:["Indigenous South American language","Spoken around Lake Titicaca","Has an unusual three-valued logic system"]},
  {language:"Cherokee", snippet:"ᎠᏂᎦᏙᏅᎣ ᎠᎳᏂᎬ", hints:["Indigenous North American language","Uses a syllabary writing system","The script was created by Sequoyah in the 1820s"]},
  {language:"Navajo", snippet:"Íhóóʼájí t’áá bí náháztiin", hints:["Indigenous North American language","Famous for its use as a code in World War II","One of the most spoken Native American languages in the U.S."]},
  {language:"Mapudungun", snippet:"Kimvn ta newen", hints:["Indigenous language of South America","Spoken by the Mapuche people","Historically spoken in what is now Chile and Argentina"]},

  // ---- Pacific & Oceanian ----
  {language:"Hawaiian", snippet:"O ka ‘ike ka mea e ola ai", hints:["Polynesian language","Uses only 13 letters including the okina","Official language of a U.S. state"]},
  {language:"Maori", snippet:"Ko te mātauranga te mea nui", hints:["Polynesian language","Official language of New Zealand","Uses macrons over vowels to indicate long sounds"]},
  {language:"Samoan", snippet:"O le poto o le malosi lea", hints:["Polynesian language","Spoken in a Pacific island nation","Uses Latin script with a glottal stop"]},
  {language:"Tongan", snippet:"Ko e ‘ilo ko e mālohi ia", hints:["Polynesian language","Spoken in a Pacific island kingdom","The only remaining monarchy in the Pacific"]},
  {language:"Fijian", snippet:"Na kila e na kaukauwa", hints:["Austronesian language","Spoken in a Pacific island nation","Uses Latin script where b is pronounced 'mb'"]},
  {language:"Tok Pisin", snippet:"Save em i strong", hints:["English-based creole language","One of the official languages of Papua New Guinea","Combines English vocabulary with Melanesian grammar"]},

  // ---- Constructed & Ancient ----
  {language:"Esperanto", snippet:"Kiu semis venton, rikoltos fulmotondron", hints:["A constructed language","Created in 1887 by L.L. Zamenhof","Designed to be an easy-to-learn international auxiliary language"]},
  {language:"Latin", snippet:"Veni, vidi, vici", hints:["An ancient classical language","The ancestor of all Romance languages","Was the lingua franca of the Roman Empire"]},
  {language:"Sanskrit", snippet:"विद्या धनं सर्वधनप्रधानम्", hints:["Ancient Indo-Aryan language","Written in Devanagari script","The classical literary language of Hinduism and Buddhism"]},
  {language:"Ancient Greek", snippet:"γνῶθι σαυτόν", hints:["An ancient classical language","The language of Homer and Plato","Uses a script that is the ancestor of the Latin alphabet"]},
  {language:"Toki Pona", snippet:"sona li wawa", hints:["A minimalist constructed language","Has only about 120-130 words","Created in 2001 to simplify thoughts"]},

  // ---- Sign language descriptions ----
  {language:"American Sign Language", snippet:"[Visual-gestural language using handshapes, movements, and facial expressions — not based on English grammar]", hints:["A visual-gestural language, not a written one","Has its own grammar distinct from English","The primary sign language used in the United States and parts of Canada"]},
  {language:"British Sign Language", snippet:"[Visual-spatial language with two-handed fingerspelling and distinct grammar from spoken English]", hints:["A visual-gestural language","Not mutually intelligible with American Sign Language despite shared spoken language","Uses a two-handed manual alphabet"]},

  // ---- Additional languages for diversity ----
  {language:"Afrikaans", snippet:"Kennis is mag", hints:["Germanic language","Developed from Dutch colonial dialects","Spoken in southern Africa"]},
  {language:"Swazi", snippet:"Lwati lungemandla", hints:["Bantu language","Official language of a small southern African kingdom","Closely related to Zulu"]},
  {language:"Luxembourgish", snippet:"Wessen ass Muecht", hints:["Germanic language","A blend of German and French influences","Official language of one of Europe's smallest countries"]},
  {language:"Faroese", snippet:"Vitan er megn", hints:["North Germanic language","Spoken on a group of islands in the North Atlantic","Related to Icelandic and Old Norse"]},
  {language:"Romani", snippet:"E ćib si zor", hints:["Indo-Aryan language spoken in Europe","The language of the Romani people","Does not have a single standardized written form"]},
  {language:"Yiddish", snippet:"וויסן איז מאכט", hints:["Germanic language written in Hebrew script","Historically spoken by Ashkenazi Jewish communities","Combines German, Hebrew, and Slavic elements"]},
  {language:"Haitian Creole", snippet:"Konesans se pouvwa", hints:["French-based creole language","Spoken in a Caribbean island nation","One of two official languages alongside French"]},
  {language:"Cebuano", snippet:"Ang kahibalo mao ang gahum", hints:["Austronesian language","The second most spoken language in the Philippines","Spoken primarily in the Visayas and Mindanao regions"]},
];

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

/* ---- Main ---- */
(function main() {
  const today = todayLocalISO();
  const puzzleNo = gameNumberFromDate(today);
  setText("dayPill", `#${puzzleNo} — ${today}`);
  setText("triesPill", `Guesses: 0/${MAX_GUESSES}`);

  const chosen = pickFromBag(LANGUAGES, "languagle", today);
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

    setText("endTitle", win ? "You got it! \u{1F30D}" : "Not this time ❌");
    setText("endBody", `The answer was: ${chosen.language}`);

    const grid = $("emojiGrid");
    if (grid) {
      grid.textContent = "";
      history.forEach(h => {
        const s = document.createElement("span");
        s.textContent = h.correct ? "\u{1F7E9}" : "\u{1F7E5}";
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

  /* ---- Share ---- */
  function buildShareText() {
    const emojis = history.map(h => h.correct ? "\u{1F7E9}" : "\u{1F7E5}").join("");
    const score = solved ? `${guesses}/${MAX_GUESSES}` : `X/${MAX_GUESSES}`;
    return `Languagle #${puzzleNo} \u{1F30D}\n${emojis}\n${score}\nhttps://daily-le.com/languagle/`;
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
      <span class="emoji">${correct ? "\u{1F7E9}" : "\u{1F7E5}"}</span>
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
  $("shareBtn")?.addEventListener("click", () => shareNice("Languagle", buildShareText(), "https://daily-le.com/languagle/"));
  $("shareTopBtn")?.addEventListener("click", () => shareNice("Languagle", buildShareText(), "https://daily-le.com/languagle/"));

  $("closeStatsBtn")?.addEventListener("click", hideModal);
  $("statsBackdrop")?.addEventListener("click", hideModal);
})();
