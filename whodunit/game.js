const MAX_GUESSES = 6;
const DAILY_DONE_KEY = "whodunit_daily_done_v1";

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

/* ---- Data: 40 famous people with 6 progressive clues each ---- */
const PEOPLE = [
  {name:"Albert Einstein", clues:["Born in Germany in 1879","Worked as a patent clerk in Switzerland","Published groundbreaking papers in 1905","Developed the theory of special relativity","Won the Nobel Prize in Physics in 1921","Famous equation: E=mc²"]},
  {name:"Leonardo da Vinci", clues:["Born in a small Italian town in 1452","Was left-handed and wrote in mirror script","Designed flying machines centuries before airplanes","Painted a famous fresco of the Last Supper","Studied anatomy by dissecting human bodies","Painted the Mona Lisa"]},
  {name:"Cleopatra", clues:["Ruled during the Ptolemaic dynasty","Spoke nine languages fluently","Formed political alliances through personal relationships","Allied with Julius Caesar","Her kingdom was in North Africa","Last active pharaoh of Egypt"]},
  {name:"William Shakespeare", clues:["Born in Stratford-upon-Avon in 1564","Married Anne Hathaway at age 18","Was part-owner of a playing company called the Lord Chamberlain's Men","Wrote 154 sonnets","Created characters like Hamlet, Othello, and Macbeth","Often called the Bard of Avon"]},
  {name:"Marie Curie", clues:["Born in Warsaw, Poland in 1867","Moved to Paris to study at the Sorbonne","First woman to win a Nobel Prize","Discovered two chemical elements","Died from aplastic anemia caused by radiation exposure","Pioneer in the study of radioactivity"]},
  {name:"Mahatma Gandhi", clues:["Studied law in London","Spent 21 years in South Africa","Led a famous march to the sea in 1930","Advocated for nonviolent civil disobedience","Called the Father of the Nation in India","Led India's independence movement against British rule"]},
  {name:"Napoleon Bonaparte", clues:["Born on the island of Corsica in 1769","Rose to prominence during the French Revolution","Crowned himself Emperor in 1804","Lost a famous battle in Russia due to winter","Exiled to Elba but escaped","Defeated at the Battle of Waterloo in 1815"]},
  {name:"Rosa Parks", clues:["Born in Tuskegee, Alabama in 1913","Worked as a seamstress in a department store","Was secretary of the local NAACP chapter","Her act of defiance sparked a 381-day boycott","Arrested on December 1, 1955","Refused to give up her bus seat in Montgomery"]},
  {name:"Isaac Newton", clues:["Born in Lincolnshire, England in 1642","Attended Trinity College, Cambridge","Was Warden and Master of the Royal Mint","Published the Principia Mathematica","An apple supposedly inspired his greatest discovery","Formulated the laws of gravity and motion"]},
  {name:"Frida Kahlo", clues:["Born in Coyoacan, Mexico in 1907","Survived a devastating bus accident as a teenager","Married fellow artist Diego Rivera twice","Created 55 self-portraits","Known for painting with vivid colors and symbolic imagery","One of Mexico's most celebrated artists"]},
  {name:"Martin Luther King Jr.", clues:["Born in Atlanta, Georgia in 1929","Earned a doctorate in theology from Boston University","Led the Montgomery Bus Boycott","Delivered a historic speech at the Lincoln Memorial","Won the Nobel Peace Prize in 1964","Famous words: I have a dream"]},
  {name:"Nikola Tesla", clues:["Born in modern-day Croatia in 1856","Worked briefly for Thomas Edison","Demonstrated wireless energy transmission","Held over 300 patents in his lifetime","Pioneered alternating current electrical systems","The electric car company is named after him"]},
  {name:"Queen Victoria", clues:["Became monarch at age 18 in 1837","Married her first cousin, Prince Albert","Had nine children who married into royal families across Europe","An entire era of British history bears her name","Was Empress of India","Ruled the United Kingdom for 63 years"]},
  {name:"Charles Darwin", clues:["Born in Shrewsbury, England in 1809","Originally studied medicine and then theology","Traveled the world on HMS Beagle for five years","Studied finches on the Galapagos Islands","Published a revolutionary book in 1859","Proposed the theory of evolution by natural selection"]},
  {name:"Nelson Mandela", clues:["Born in the Transkei region of South Africa in 1918","Studied law at the University of Witwatersrand","Was imprisoned for 27 years","Released from prison on February 11, 1990","Won the Nobel Peace Prize in 1993","Became South Africa's first Black president"]},
  {name:"Wolfgang Amadeus Mozart", clues:["Born in Salzburg, Austria in 1756","Composed his first piece at age five","Toured European courts as a child prodigy","Wrote over 600 compositions in his short life","Composed The Magic Flute and Don Giovanni","Died at 35; one of history's greatest classical composers"]},
  {name:"Amelia Earhart", clues:["Born in Atchison, Kansas in 1897","Worked as a nurse's aide during World War I","Set multiple aviation altitude records","First woman to fly solo across the Atlantic Ocean","Disappeared over the Pacific Ocean in 1937","America's most famous female aviator"]},
  {name:"Genghis Khan", clues:["Born around 1162 on the Mongolian steppe","United warring nomadic tribes","Established a postal relay system across Asia","His empire stretched from China to Eastern Europe","Founded the largest contiguous land empire in history","Born as Temujin, he became the Great Khan"]},
  {name:"Ada Lovelace", clues:["Born in London in 1815","Was the daughter of the poet Lord Byron","Worked with Charles Babbage on his Analytical Engine","Wrote what is considered the first computer algorithm","A modern programming language is named after her","Often called the first computer programmer"]},
  {name:"Pablo Picasso", clues:["Born in Malaga, Spain in 1881","His father was an art teacher","Co-founded the Cubist art movement","Created over 50,000 works of art in his lifetime","Painted a famous anti-war mural called Guernica","One of the most influential artists of the 20th century"]},
  {name:"Abraham Lincoln", clues:["Born in a log cabin in Kentucky in 1809","Was largely self-educated","Served as an Illinois state legislator","Delivered the Gettysburg Address in 1863","Issued the Emancipation Proclamation","16th President of the United States"]},
  {name:"Harriet Tubman", clues:["Born into slavery in Maryland around 1822","Escaped to freedom in Philadelphia","Served as a spy for the Union Army","Made 13 missions to rescue enslaved people","Used a network of safe houses known as the Underground Railroad","One of the most famous conductors of the Underground Railroad"]},
  {name:"Alexander the Great", clues:["Born in Pella, Macedonia in 356 BC","Was tutored by Aristotle","Became king at age 20 after his father's assassination","Never lost a single battle","Created an empire stretching from Greece to India","One of the most successful military commanders in history"]},
  {name:"Coco Chanel", clues:["Born in Saumur, France in 1883","Grew up in an orphanage","Revolutionized women's fashion by introducing trousers","Created a legendary perfume called No. 5","Popularized the little black dress","Founder of one of the world's most famous fashion houses"]},
  {name:"Ludwig van Beethoven", clues:["Born in Bonn, Germany in 1770","Moved to Vienna to study under Haydn","Began losing his hearing in his late twenties","Composed nine symphonies","Wrote the Moonlight Sonata and Fur Elise","Composed his Ninth Symphony while completely deaf"]},
  {name:"Galileo Galilei", clues:["Born in Pisa, Italy in 1564","Studied medicine before switching to mathematics","Improved the design of the telescope","Discovered four moons orbiting Jupiter","Was tried by the Roman Inquisition for heresy","Called the father of modern observational astronomy"]},
  {name:"Florence Nightingale", clues:["Born in Florence, Italy in 1820","Defied her wealthy family to pursue nursing","Worked during the Crimean War","Known as the Lady with the Lamp","Pioneered the use of statistics in healthcare","Founder of modern nursing"]},
  {name:"Vincent van Gogh", clues:["Born in the Netherlands in 1853","Worked as an art dealer and a preacher before painting","Only sold one painting during his lifetime","Famously cut off part of his own ear","Painted over 2,000 works in just over a decade","Created The Starry Night"]},
  {name:"Julius Caesar", clues:["Born into a patrician family in Rome around 100 BC","Conquered Gaul over eight years of campaigning","Crossed the Rubicon river in 49 BC","Became dictator perpetuo of Rome","Was assassinated on the Ides of March","The month of July is named after him"]},
  {name:"Mother Teresa", clues:["Born Agnes Gonxha Bojaxhiu in 1910 in Skopje","Joined the Sisters of Loreto at age 18","Moved to Calcutta and worked among the poorest","Founded the Missionaries of Charity in 1950","Won the Nobel Peace Prize in 1979","Canonized as a saint by the Catholic Church in 2016"]},
  {name:"Thomas Edison", clues:["Born in Milan, Ohio in 1847","Was partially deaf from childhood","Held 1,093 US patents","Established the first industrial research laboratory","Invented the phonograph and the motion picture camera","Credited with inventing the practical incandescent light bulb"]},
  {name:"Tutankhamun", clues:["Became pharaoh at approximately age nine","Ruled Egypt during the 18th Dynasty","Died around age 19 under mysterious circumstances","His tomb was discovered in the Valley of the Kings in 1922","Howard Carter spent years searching for his burial site","Known as King Tut, the boy pharaoh"]},
  {name:"Oprah Winfrey", clues:["Born in rural Mississippi in 1954","Started in local radio while still in high school","Moved to Chicago to host a morning talk show","Built a media empire including a magazine and TV network","Became North America's first Black multi-billionaire","Hosted the highest-rated talk show in television history"]},
  {name:"Marco Polo", clues:["Born in Venice, Italy around 1254","Traveled the Silk Road with his father and uncle","Spent 17 years in the court of a Mongol ruler","Returned to Venice with a fortune in gems","Dictated his travel memoirs while in a Genoese prison","His book inspired European exploration of Asia"]},
  {name:"Sigmund Freud", clues:["Born in Freiberg, Moravia in 1856","Studied at the University of Vienna","Developed the technique of free association","Proposed that the mind has conscious and unconscious parts","Wrote The Interpretation of Dreams","Considered the father of psychoanalysis"]},
  {name:"Bruce Lee", clues:["Born in San Francisco in 1940 but raised in Hong Kong","Studied philosophy at the University of Washington","Created his own martial arts style called Jeet Kune Do","Appeared in the TV series The Green Hornet","Died mysteriously at age 32","The most iconic martial artist in film history"]},
  {name:"Jane Austen", clues:["Born in Steventon, England in 1775","Never married despite receiving at least one proposal","Published her novels anonymously during her lifetime","Wrote about the British landed gentry","Created characters like Elizabeth Bennet and Mr. Darcy","Author of Pride and Prejudice and Sense and Sensibility"]},
  {name:"Neil Armstrong", clues:["Born in Wapakoneta, Ohio in 1930","Was a naval aviator during the Korean War","Worked as a test pilot for NASA's predecessor NACA","Commanded the Gemini 8 mission","Landed on the lunar surface on July 20, 1969","First person to walk on the Moon"]},
  {name:"Confucius", clues:["Born in the state of Lu around 551 BC","Worked as a bookkeeper and a caretaker of horses","Traveled across China for 14 years seeking an advisory role","Emphasized the importance of education and morality","His teachings were compiled by students into the Analerta","The most influential philosopher in Chinese history"]},
  {name:"Walt Disney", clues:["Born in Chicago, Illinois in 1901","Was fired from a newspaper for lacking imagination","Created a cartoon character named Oswald the Lucky Rabbit","Won 22 Academy Awards in his lifetime","Opened a revolutionary theme park in Anaheim in 1955","Created Mickey Mouse and built a global entertainment empire"]}
];

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
  return `Whodunit #${puzzleNo} 🔍\n${emojis}\n${score}\nhttps://daily-le.com/whodunit/`;
}

async function shareNice(text) {
  if (navigator.share) {
    try { await navigator.share({ title: "Whodunit", text, url: "https://daily-le.com/whodunit/" }); return; } catch {}
  }
  try { await navigator.clipboard.writeText(text); alert("Copied to clipboard!"); } catch { prompt("Copy:", text); }
}

/* ---- Normalize for comparison ---- */
function normalize(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/* ---- Main ---- */
(function main() {
  const today = todayLocalISO();
  const puzzleNo = gameNumberFromDate(today);
  setText("dayPill", `#${puzzleNo} — ${today}`);

  const chosen = pickDeterministic(PEOPLE, "whodunit|" + today);

  let guesses = 0;
  let solved = false;
  const history = [];

  function showClue(n) {
    setText("clueText", chosen.clues[n]);
    setText("triesPill", `Clue: ${n + 1}/${MAX_GUESSES}`);
  }

  // Already played
  if (localStorage.getItem(DAILY_DONE_KEY) === today) {
    $("guessInput").disabled = true;
    $("guessBtn").disabled = true;
    showClue(MAX_GUESSES - 1);
    setText("endTitle", "Already played today ✅");
    setText("endBody", `The answer was ${chosen.name}.`);
    $("shareBtn").disabled = false;
    $("shareTopBtn").disabled = false;
    showModal();
    return;
  }

  showClue(0);

  function endGame(win) {
    solved = win;
    $("guessInput").disabled = true;
    $("guessBtn").disabled = true;
    localStorage.setItem(DAILY_DONE_KEY, today);

    setText("endTitle", win ? "You got it! ✅" : "Not this time ❌");
    setText("endBody", `The answer was ${chosen.name}.`);

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

  $("guessForm").addEventListener("submit", function(e) {
    e.preventDefault();
    setText("errorLine", "");
    if (solved) return;

    const input = $("guessInput");
    const guess = input.value.trim();
    input.value = "";

    if (!guess) {
      setText("errorLine", "Type a name to guess.");
      return;
    }

    guesses++;
    const correct = normalize(guess) === normalize(chosen.name);
    history.push({ name: guess, correct: correct });

    // History row
    const histEl = $("history");
    const row = document.createElement("div");
    row.className = "history-row";
    row.innerHTML =
      '<span class="emoji">' + (correct ? "🟩" : "🟥") + '</span>' +
      '<span class="name">' + guess + '</span>' +
      '<span class="tag ' + (correct ? "good" : "bad") + '">' + (correct ? "Correct!" : "Wrong") + '</span>';
    histEl.prepend(row);

    if (correct) { endGame(true); return; }

    if (guesses >= MAX_GUESSES) { endGame(false); return; }

    // Show next clue
    showClue(guesses);
    $("guessInput").focus();
  });

  // Share
  function currentShareText() {
    return buildShareText(puzzleNo, history, solved, guesses);
  }
  if ($("shareBtn")) $("shareBtn").addEventListener("click", function() { shareNice(currentShareText()); });
  if ($("shareTopBtn")) $("shareTopBtn").addEventListener("click", function() { shareNice(currentShareText()); });

  if ($("closeStatsBtn")) $("closeStatsBtn").addEventListener("click", hideModal);
  if ($("statsBackdrop")) $("statsBackdrop").addEventListener("click", hideModal);
})();
