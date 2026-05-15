const MAX_GUESSES = 6;
const DAILY_DONE_KEY = "datele_daily_done_v1";

const MONTHS = ["","January","February","March","April","May","June","July","August","September","October","November","December"];

const EVENTS = [
  // ---- Ancient & Classical ----
  {event:"The Great Pyramid of Giza was completed", month:1, year:-2560},
  {event:"The city of Rome was traditionally founded", month:4, year:-753},
  {event:"The first Olympic Games were held in ancient Greece", month:7, year:-776},
  {event:"Alexander the Great died in Babylon", month:6, year:-323},
  {event:"Julius Caesar was assassinated on the Ides of March", month:3, year:-44},
  {event:"The eruption of Mount Vesuvius destroyed Pompeii", month:8, year:79},
  {event:"The fall of the Western Roman Empire", month:9, year:476},
  {event:"The Battle of Marathon was fought", month:9, year:-490},
  {event:"Cleopatra VII died in Egypt", month:8, year:-30},
  {event:"The construction of the Parthenon was completed", month:1, year:-432},
  {event:"The Peloponnesian War began", month:5, year:-431},
  {event:"Hannibal crossed the Alps with his army", month:10, year:-218},
  {event:"The destruction of Carthage ended the Third Punic War", month:2, year:-146},
  {event:"Emperor Constantine issued the Edict of Milan", month:2, year:313},
  {event:"The Visigoths sacked Rome", month:8, year:410},

  // ---- Medieval ----
  {event:"Muhammad's Hijra from Mecca to Medina", month:7, year:622},
  {event:"Charlemagne was crowned Emperor of the Romans", month:12, year:800},
  {event:"The Battle of Hastings was fought", month:10, year:1066},
  {event:"The Magna Carta was sealed at Runnymede", month:6, year:1215},
  {event:"The Black Death reached Europe", month:10, year:1347},
  {event:"Joan of Arc was burned at the stake", month:5, year:1431},
  {event:"Constantinople fell to the Ottoman Turks", month:5, year:1453},
  {event:"The First Crusade captured Jerusalem", month:7, year:1099},
  {event:"The Domesday Book was completed in England", month:12, year:1086},
  {event:"Genghis Khan united the Mongol tribes", month:3, year:1206},
  {event:"The Mongol siege of Baghdad destroyed the Abbasid Caliphate", month:2, year:1258},
  {event:"The Great Schism divided Christianity into East and West", month:7, year:1054},
  {event:"The Hundred Years' War began between England and France", month:5, year:1337},
  {event:"The Peasants' Revolt took place in England", month:6, year:1381},
  {event:"Gutenberg printed his first Bible", month:2, year:1455},

  // ---- Age of Exploration & Early Modern ----
  {event:"Columbus first arrived in the Americas", month:10, year:1492},
  {event:"Vasco da Gama reached India by sea", month:5, year:1498},
  {event:"Martin Luther posted his 95 Theses", month:10, year:1517},
  {event:"Magellan's expedition began circumnavigating the globe", month:9, year:1519},
  {event:"The Spanish conquered the Aztec Empire", month:8, year:1521},
  {event:"Henry VIII broke with the Catholic Church", month:11, year:1534},
  {event:"The defeat of the Spanish Armada", month:8, year:1588},
  {event:"The Jamestown colony was founded in Virginia", month:5, year:1607},
  {event:"The Pilgrims landed at Plymouth Rock", month:12, year:1620},
  {event:"Galileo was tried by the Roman Inquisition", month:6, year:1633},
  {event:"The English Civil War began", month:8, year:1642},
  {event:"The Peace of Westphalia ended the Thirty Years' War", month:10, year:1648},
  {event:"The Great Fire of London", month:9, year:1666},
  {event:"Isaac Newton published the Principia Mathematica", month:7, year:1687},
  {event:"The Salem witch trials began", month:2, year:1692},
  {event:"The Treaty of Tordesillas divided the New World", month:6, year:1494},
  {event:"Copernicus published his heliocentric theory", month:5, year:1543},
  {event:"The Edict of Nantes granted religious tolerance in France", month:4, year:1598},

  // ---- 18th Century ----
  {event:"The Act of Union created Great Britain", month:5, year:1707},
  {event:"The Boston Tea Party took place", month:12, year:1773},
  {event:"The Declaration of Independence was signed", month:7, year:1776},
  {event:"The French Revolution began with the storming of the Bastille", month:7, year:1789},
  {event:"George Washington was inaugurated as first U.S. President", month:4, year:1789},
  {event:"The Reign of Terror began in France", month:9, year:1793},
  {event:"Napoleon seized power in the coup of 18 Brumaire", month:11, year:1799},
  {event:"Captain James Cook reached Australia", month:4, year:1770},
  {event:"The American Revolutionary War began at Lexington and Concord", month:4, year:1775},
  {event:"The Rosetta Stone was discovered in Egypt", month:7, year:1799},
  {event:"Mozart died in Vienna", month:12, year:1791},
  {event:"The U.S. Constitution was ratified", month:6, year:1788},

  // ---- 19th Century ----
  {event:"The Battle of Trafalgar was fought", month:10, year:1805},
  {event:"Napoleon was defeated at Waterloo", month:6, year:1815},
  {event:"The Erie Canal opened in New York", month:10, year:1825},
  {event:"Greece gained independence from the Ottoman Empire", month:2, year:1832},
  {event:"Queen Victoria ascended to the British throne", month:6, year:1837},
  {event:"The Irish Great Famine began", month:9, year:1845},
  {event:"The California Gold Rush began", month:1, year:1848},
  {event:"Karl Marx published The Communist Manifesto", month:2, year:1848},
  {event:"Charles Darwin published On the Origin of Species", month:11, year:1859},
  {event:"The American Civil War began at Fort Sumter", month:4, year:1861},
  {event:"Abraham Lincoln issued the Emancipation Proclamation", month:1, year:1863},
  {event:"Abraham Lincoln was assassinated", month:4, year:1865},
  {event:"The Suez Canal opened", month:11, year:1869},
  {event:"The telephone was patented by Alexander Graham Bell", month:3, year:1876},
  {event:"Thomas Edison demonstrated the phonograph", month:11, year:1877},
  {event:"The Statue of Liberty was dedicated in New York", month:10, year:1886},
  {event:"The Eiffel Tower opened for the Paris Exposition", month:3, year:1889},
  {event:"The first modern Olympic Games were held in Athens", month:4, year:1896},
  {event:"The Spanish-American War began", month:4, year:1898},
  {event:"The Boer War began in South Africa", month:10, year:1899},
  {event:"Napoleon's invasion of Russia began", month:6, year:1812},
  {event:"The Meiji Restoration modernized Japan", month:1, year:1868},
  {event:"The Berlin Conference partitioned Africa among European powers", month:11, year:1884},
  {event:"The Dreyfus Affair divided France", month:12, year:1894},
  {event:"Brazil abolished slavery", month:5, year:1888},
  {event:"The Boxer Rebellion began in China", month:11, year:1899},

  // ---- Early 20th Century ----
  {event:"The Wright Brothers made their first powered flight", month:12, year:1903},
  {event:"The San Francisco earthquake devastated the city", month:4, year:1906},
  {event:"The Titanic sank on its maiden voyage", month:4, year:1912},
  {event:"World War I began after the assassination of Archduke Franz Ferdinand", month:7, year:1914},
  {event:"The Panama Canal officially opened", month:8, year:1914},
  {event:"The Gallipoli Campaign began", month:4, year:1915},
  {event:"The Battle of the Somme began", month:7, year:1916},
  {event:"The Russian Revolution overthrew the Tsar", month:3, year:1917},
  {event:"The Bolsheviks seized power in the October Revolution", month:11, year:1917},
  {event:"World War I ended with the Armistice", month:11, year:1918},
  {event:"The Treaty of Versailles was signed", month:6, year:1919},
  {event:"Women won the right to vote in the United States", month:8, year:1920},
  {event:"The Tomb of Tutankhamun was discovered", month:11, year:1922},
  {event:"The Wall Street Crash triggered the Great Depression", month:10, year:1929},
  {event:"The Hindenburg airship disaster occurred", month:5, year:1937},
  {event:"The Spanish Civil War began", month:7, year:1936},
  {event:"Kristallnacht attacks against Jews occurred across Germany", month:11, year:1938},
  {event:"Germany invaded Poland, starting World War II", month:9, year:1939},
  {event:"The Dunkirk evacuation took place", month:6, year:1940},
  {event:"The Japanese attacked Pearl Harbor", month:12, year:1941},
  {event:"The Battle of Stalingrad began", month:8, year:1942},
  {event:"D-Day: Allied forces landed at Normandy", month:6, year:1944},
  {event:"World War II ended in Europe (V-E Day)", month:5, year:1945},
  {event:"The atomic bomb was dropped on Hiroshima", month:8, year:1945},
  {event:"Japan surrendered, ending World War II (V-J Day)", month:8, year:1945},
  {event:"The United Nations was officially established", month:10, year:1945},
  {event:"The Nuremberg Trials began", month:11, year:1945},
  {event:"India gained independence from Britain", month:8, year:1947},
  {event:"The State of Israel was proclaimed", month:5, year:1948},
  {event:"The Berlin Airlift began", month:6, year:1948},
  {event:"NATO was established", month:4, year:1949},
  {event:"The People's Republic of China was founded", month:10, year:1949},

  // ---- Cold War Era ----
  {event:"The Korean War began", month:6, year:1950},
  {event:"Queen Elizabeth II was crowned", month:6, year:1953},
  {event:"The Korean War armistice was signed", month:7, year:1953},
  {event:"Brown v. Board of Education desegregated U.S. schools", month:5, year:1954},
  {event:"Rosa Parks refused to give up her bus seat", month:12, year:1955},
  {event:"The Suez Crisis erupted", month:10, year:1956},
  {event:"The Soviet Union launched Sputnik", month:10, year:1957},
  {event:"Alaska became the 49th U.S. state", month:1, year:1959},
  {event:"Hawaii became the 50th U.S. state", month:8, year:1959},
  {event:"The Cuban Revolution brought Fidel Castro to power", month:1, year:1959},
  {event:"Yuri Gagarin became the first human in space", month:4, year:1961},
  {event:"The Berlin Wall was constructed", month:8, year:1961},
  {event:"The Cuban Missile Crisis brought the world to the brink", month:10, year:1962},
  {event:"John F. Kennedy was assassinated in Dallas", month:11, year:1963},
  {event:"Martin Luther King Jr. delivered his 'I Have a Dream' speech", month:8, year:1963},
  {event:"The Civil Rights Act was signed into law", month:7, year:1964},
  {event:"The Gulf of Tonkin incident escalated the Vietnam War", month:8, year:1964},
  {event:"The first successful heart transplant was performed", month:12, year:1967},
  {event:"Martin Luther King Jr. was assassinated", month:4, year:1968},
  {event:"The Prague Spring was crushed by Soviet tanks", month:8, year:1968},
  {event:"Humans first walked on the Moon", month:7, year:1969},
  {event:"The first Woodstock music festival took place", month:8, year:1969},
  {event:"The Kent State shootings occurred during Vietnam War protests", month:5, year:1970},
  {event:"The Watergate break-in occurred", month:6, year:1972},
  {event:"The Munich Olympics massacre occurred", month:9, year:1972},
  {event:"Richard Nixon resigned as President", month:8, year:1974},
  {event:"Saigon fell, ending the Vietnam War", month:4, year:1975},
  {event:"The first Star Wars film was released in theaters", month:5, year:1977},
  {event:"Egypt and Israel signed the Camp David Accords", month:9, year:1978},
  {event:"The Iranian Revolution overthrew the Shah", month:2, year:1979},
  {event:"The Three Mile Island nuclear accident occurred", month:3, year:1979},
  {event:"The Soviet Union invaded Afghanistan", month:12, year:1979},
  {event:"Mount St. Helens erupted in Washington State", month:5, year:1980},
  {event:"John Lennon was assassinated in New York", month:12, year:1980},
  {event:"The Falklands War began", month:4, year:1982},
  {event:"The Bhopal gas disaster struck India", month:12, year:1984},
  {event:"The Chernobyl nuclear disaster occurred", month:4, year:1986},
  {event:"The Challenger space shuttle exploded after launch", month:1, year:1986},

  // ---- End of Cold War & 1990s ----
  {event:"The Berlin Wall fell", month:11, year:1989},
  {event:"The Tiananmen Square protests were suppressed", month:6, year:1989},
  {event:"Nelson Mandela was released from prison", month:2, year:1990},
  {event:"The Hubble Space Telescope was launched", month:4, year:1990},
  {event:"Germany was officially reunified", month:10, year:1990},
  {event:"The apartheid system was officially ended in South Africa", month:6, year:1991},
  {event:"The Soviet Union officially dissolved", month:12, year:1991},
  {event:"The Maastricht Treaty established the European Union", month:2, year:1992},
  {event:"The World Wide Web became publicly available", month:4, year:1993},
  {event:"The Rwandan genocide began", month:4, year:1994},
  {event:"Nelson Mandela became President of South Africa", month:5, year:1994},
  {event:"The Oklahoma City bombing occurred", month:4, year:1995},
  {event:"Dolly the sheep, the first cloned mammal, was born", month:7, year:1996},
  {event:"Hong Kong was returned to China by Britain", month:7, year:1997},
  {event:"Princess Diana died in a car crash in Paris", month:8, year:1997},
  {event:"The Good Friday Agreement was signed", month:4, year:1998},
  {event:"The Euro currency was introduced in physical form", month:1, year:2002},

  // ---- 21st Century ----
  {event:"The September 11 attacks took place", month:9, year:2001},
  {event:"The U.S. invaded Afghanistan", month:10, year:2001},
  {event:"The Columbia space shuttle broke apart during reentry", month:2, year:2003},
  {event:"The U.S. invaded Iraq", month:3, year:2003},
  {event:"Facebook launched from a Harvard dorm room", month:2, year:2004},
  {event:"The Indian Ocean earthquake and tsunami struck", month:12, year:2004},
  {event:"Hurricane Katrina made landfall in Louisiana", month:8, year:2005},
  {event:"Pluto was reclassified as a dwarf planet", month:8, year:2006},
  {event:"The first iPhone was released to the public", month:6, year:2007},
  {event:"The global financial crisis intensified with Lehman Brothers' collapse", month:9, year:2008},
  {event:"The Large Hadron Collider was first turned on", month:9, year:2008},
  {event:"Barack Obama was inaugurated as President", month:1, year:2009},
  {event:"Bitcoin was created with its genesis block", month:1, year:2009},
  {event:"The Deepwater Horizon oil spill began in the Gulf of Mexico", month:4, year:2010},
  {event:"The Arab Spring protests began in Tunisia", month:12, year:2010},
  {event:"Osama bin Laden was killed in Pakistan", month:5, year:2011},
  {event:"The Fukushima nuclear disaster occurred in Japan", month:3, year:2011},
  {event:"The Rosetta spacecraft landed a probe on a comet", month:11, year:2014},
  {event:"The Paris Climate Agreement was adopted", month:12, year:2015},
  {event:"The United Kingdom voted to leave the European Union", month:6, year:2016},
  {event:"The World Health Organization declared COVID-19 a pandemic", month:3, year:2020},
  {event:"The Suez Canal was blocked by the Ever Given", month:3, year:2021},
  {event:"Queen Elizabeth II died", month:9, year:2022},
  {event:"Russia launched a full-scale invasion of Ukraine", month:2, year:2022},
  {event:"The James Webb Space Telescope released its first images", month:7, year:2022},

  // ---- Science & Technology ----
  {event:"Penicillin was discovered by Alexander Fleming", month:9, year:1928},
  {event:"The first nuclear chain reaction was achieved in Chicago", month:12, year:1942},
  {event:"The structure of DNA was described by Watson and Crick", month:4, year:1953},
  {event:"The first successful polio vaccine was announced", month:4, year:1955},
  {event:"The first laser was demonstrated", month:5, year:1960},
  {event:"The first email was sent over ARPANET", month:10, year:1971},
  {event:"The first mobile phone call was made", month:4, year:1973},
  {event:"The first personal computer, the Altair 8800, was released", month:1, year:1975},
  {event:"The first test-tube baby was born in England", month:7, year:1978},
  {event:"The IBM PC was introduced", month:8, year:1981},
  {event:"The World Wide Web was invented by Tim Berners-Lee", month:3, year:1989},
  {event:"The Human Genome Project was completed", month:4, year:2003},
  {event:"The Higgs boson particle was confirmed at CERN", month:7, year:2012},
  {event:"CRISPR gene editing technology was first demonstrated", month:6, year:2012},
  {event:"SpaceX successfully landed a reusable rocket", month:12, year:2015},
  {event:"AlphaGo defeated the world champion Go player", month:3, year:2016},
  {event:"The first image of a black hole was released", month:4, year:2019},

  // ---- Natural Disasters ----
  {event:"The Great Lisbon Earthquake destroyed the city", month:11, year:1755},
  {event:"The eruption of Krakatoa caused a global climate shift", month:8, year:1883},
  {event:"The Great Kanto Earthquake struck Tokyo", month:9, year:1923},
  {event:"The Tangshan earthquake killed hundreds of thousands in China", month:7, year:1976},
  {event:"The eruption of Mount Pinatubo in the Philippines", month:6, year:1991},
  {event:"The Haiti earthquake devastated Port-au-Prince", month:1, year:2010},
  {event:"Nepal was struck by a devastating earthquake", month:4, year:2015},

  // ---- Sports ----
  {event:"The first FIFA World Cup was held in Uruguay", month:7, year:1930},
  {event:"Jesse Owens won four gold medals at the Berlin Olympics", month:8, year:1936},
  {event:"Roger Bannister ran the first sub-four-minute mile", month:5, year:1954},
  {event:"Muhammad Ali defeated Sonny Liston for the heavyweight title", month:2, year:1964},
  {event:"The Miracle on Ice occurred at the Winter Olympics", month:2, year:1980},
  {event:"Diego Maradona scored the 'Hand of God' goal", month:6, year:1986},
  {event:"Michael Jordan hit 'The Last Shot' to win his sixth NBA title", month:6, year:1998},
  {event:"Usain Bolt set the 100m world record in Berlin", month:8, year:2009},

  // ---- Culture & Society ----
  {event:"The Gutenberg Bible was printed, starting the printing revolution", month:2, year:1455},
  {event:"Shakespeare's Globe Theatre opened in London", month:6, year:1599},
  {event:"Beethoven's Ninth Symphony premiered in Vienna", month:5, year:1824},
  {event:"The first photograph was taken by Nicephore Niepce", month:6, year:1826},
  {event:"The abolition of slavery in the British Empire took effect", month:8, year:1834},
  {event:"The Seneca Falls Convention launched the women's rights movement", month:7, year:1848},
  {event:"The Red Cross was founded in Geneva", month:2, year:1863},
  {event:"The first motion picture was shown to a public audience", month:12, year:1895},
  {event:"The Nineteenth Amendment gave U.S. women the right to vote", month:8, year:1920},
  {event:"The Universal Declaration of Human Rights was adopted", month:12, year:1948},
  {event:"Disneyland opened in California", month:7, year:1955},
  {event:"The Beatles appeared on The Ed Sullivan Show", month:2, year:1964},
  {event:"Stonewall riots galvanized the LGBTQ rights movement", month:6, year:1969},
  {event:"Live Aid concerts were held simultaneously in London and Philadelphia", month:7, year:1985},
  {event:"The Hubble Space Telescope captured the 'Pillars of Creation' image", month:4, year:1995},
];

/* ---- Main ---- */
(function main() {
  const today = todayLocalISO();
  const puzzleNo = gameNumberFromDate(today);
  setText("dayPill", `#${puzzleNo} — ${today}`);
  setText("triesPill", `Guesses: 0/${MAX_GUESSES}`);

  const chosen = pickFromBag(EVENTS, "datele", today);
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

    setText("endTitle", win ? "You got it! \u{1F4C5}" : "Not this time ❌");
    setText("endBody", `${chosen.event}: ${MONTHS[chosen.month]} ${chosen.year}`);

    const grid = $("emojiGrid");
    if (grid) {
      grid.textContent = "";
      history.forEach(h => {
        const row = document.createElement("div");
        const mE = h.monthCorrect ? "\u{1F7E9}" : "\u{1F7E5}";
        const yE = h.yearCorrect ? "\u{1F7E9}" : (h.yearClose ? "\u{1F7E8}" : "\u{1F7E5}");
        row.textContent = mE + yE;
        grid.appendChild(row);
      });
    }

    $("shareBtn").disabled = false;
    $("shareTopBtn").disabled = false;
    showModal();
  }

  /* ---- Share ---- */
  function buildShareText() {
    const emojis = history.map(h => {
      const mE = h.monthCorrect ? "\u{1F7E9}" : "\u{1F7E5}";
      const yE = h.yearCorrect ? "\u{1F7E9}" : (h.yearClose ? "\u{1F7E8}" : "\u{1F7E5}");
      return mE + yE;
    }).join("\n");
    const score = solved ? `${guesses}/${MAX_GUESSES}` : `X/${MAX_GUESSES}`;
    return `Datele #${puzzleNo} \u{1F4C5}\n${emojis}\n${score}\nhttps://daily-le.com/datele/`;
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
      <span class="emoji">${win ? "\u{1F7E9}" : (yearClose || monthCorrect ? "\u{1F7E8}" : "\u{1F7E5}")}</span>
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
  $("shareBtn")?.addEventListener("click", () => shareNice("Datele", buildShareText(), "https://daily-le.com/datele/"));
  $("shareTopBtn")?.addEventListener("click", () => shareNice("Datele", buildShareText(), "https://daily-le.com/datele/"));

  $("closeStatsBtn")?.addEventListener("click", hideModal);
  $("statsBackdrop")?.addEventListener("click", hideModal);
})();
