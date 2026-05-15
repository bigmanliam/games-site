const ROUNDS = 4;
const DAILY_DONE_KEY = "sportle_daily_done_v1";

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

/* Pick N unique items deterministically from array */
function pickMultipleDeterministic(arr, seedStr, count) {
  const h = hashStringToUint32(seedStr);
  const indices = [];
  const used = new Set();
  for (let attempt = 0; indices.length < count && attempt < arr.length * 3; attempt++) {
    const idx = hashStringToUint32(seedStr + "|" + attempt) % arr.length;
    if (!used.has(idx)) { used.add(idx); indices.push(idx); }
  }
  return indices.map(i => arr[i]);
}

/* ---- Data: 40+ sports with descriptions ---- */
const SPORTS = [
  {name:"Cricket", description:"Two teams of 11 take turns batting and fielding on an oval pitch. The batting side tries to score runs by hitting a ball bowled at them and running between two sets of stumps, while the bowling side tries to dismiss batters by hitting the wicket or catching the ball."},
  {name:"Baseball", description:"Two teams of nine alternate between batting and fielding over nine innings. The batter tries to hit a pitched ball and run around four bases to score a run. Three outs retire the batting side."},
  {name:"Rugby", description:"Two teams of 15 carry, pass, and kick an oval ball to score tries by grounding it in the opposing team's in-goal area. Forward passing is not allowed. Players tackle opponents to stop their advance."},
  {name:"Badminton", description:"Players use lightweight rackets to hit a feathered shuttlecock over a high net. The shuttlecock must not touch the ground, and points are scored when the opponent fails to return it. Matches are best of three games to 21 points."},
  {name:"Fencing", description:"Two competitors face each other on a narrow strip, each armed with a bladed weapon. Points are scored by touching the opponent with the weapon tip or edge, depending on the discipline. Electronic scoring equipment detects valid touches."},
  {name:"Water Polo", description:"Two teams of seven swim in a pool and try to throw a ball into the opposing team's goal. Players cannot touch the bottom of the pool and must tread water throughout. Each game consists of four periods."},
  {name:"Curling", description:"Teams slide polished granite stones across a sheet of ice toward a circular target. Teammates sweep the ice in front of the stone to control its speed and direction. The team with stones closest to the center scores."},
  {name:"Table Tennis", description:"Players use small paddles to hit a lightweight ball back and forth across a net on a hard table. The ball must bounce once on each side. Games are played to 11 points with a two-point lead required."},
  {name:"Lacrosse", description:"Players use a long stick with a mesh pocket at the end to carry, catch, and throw a rubber ball. The objective is to shoot the ball into the opposing team's goal. It originated among Indigenous peoples of North America."},
  {name:"Handball", description:"Two teams of seven players throw a ball into the opposing team's goal on an indoor court. Players can take three steps while holding the ball and must pass or shoot within three seconds. The goalkeeper is the only player who can use their feet."},
  {name:"Polo", description:"Two teams of four ride horses on a large grass field, using long-handled mallets to drive a small ball through the opposing team's goal posts. Each match is divided into periods called chukkers."},
  {name:"Archery", description:"Competitors shoot arrows at a circular target from a set distance using a bow. The target has concentric rings with the center bullseye worth the most points. Precision and consistency are key."},
  {name:"Squash", description:"Two players take turns hitting a small rubber ball against the front wall of an enclosed court. The ball may only bounce once on the floor before being returned. Players share the same court space."},
  {name:"Volleyball", description:"Two teams of six are separated by a high net. Teams hit a ball over the net using no more than three contacts per side. Points are scored when the ball lands on the opposing team's court or they commit a fault."},
  {name:"Ice Hockey", description:"Two teams of six skate on an ice rink and use sticks to shoot a vulcanized rubber puck into the opposing team's net. Body checking is allowed to separate opponents from the puck. Games consist of three periods."},
  {name:"Boxing", description:"Two competitors wearing padded gloves fight in a roped-off ring. They score points by landing clean punches on the opponent's head or body. A match can end by knockout, decision, or stoppage."},
  {name:"Judo", description:"Two competitors try to throw each other to the ground or pin their opponent on the mat. Arm locks and chokes are also permitted. An ippon, the highest score, ends the match immediately."},
  {name:"Gymnastics", description:"Athletes perform routines on various apparatus including the floor, vault, balance beam, and bars. Judges score performances based on difficulty, execution, and artistry. Both individual and team competitions exist."},
  {name:"Surfing", description:"Athletes ride ocean waves while standing on a board. Judges score based on the difficulty and variety of maneuvers performed on the wave face. Competitors are given a set time to catch and ride waves."},
  {name:"Rowing", description:"Athletes propel a narrow boat through water using oars. Races are typically 2,000 metres on a straight course. Crews can range from a single sculler to eight rowers with a coxswain who steers."},
  {name:"Golf", description:"Players use various clubs to hit a small ball into a series of holes on a large outdoor course in as few strokes as possible. A standard course has 18 holes with varying distances and hazards like bunkers and water."},
  {name:"Tennis", description:"Two or four players hit a felt-covered ball over a net on a rectangular court. The ball may bounce once before being returned. Scoring progresses through points, games, and sets."},
  {name:"Basketball", description:"Two teams of five try to score by throwing a ball through an elevated hoop with a net. Players advance the ball by dribbling or passing. A shot from beyond the arc is worth three points, inside is worth two."},
  {name:"Soccer", description:"Two teams of 11 try to kick a ball into the opposing team's goal on a large grass pitch. Outfield players cannot use their hands or arms. Matches consist of two 45-minute halves."},
  {name:"Swimming", description:"Athletes race through water in a pool using one of four strokes: freestyle, backstroke, breaststroke, or butterfly. Races range from 50 to 1500 metres. Touching the wall first wins."},
  {name:"Taekwondo", description:"A Korean martial art where competitors score points by landing kicks and punches on the opponent's torso protector or head. Spinning and jumping kicks score higher. Matches are three rounds of two minutes."},
  {name:"Weightlifting", description:"Athletes attempt to lift the heaviest weight possible in two movements: the snatch and the clean and jerk. Each lifter gets three attempts per lift. The highest successful total from both lifts determines the winner."},
  {name:"Cycling", description:"Athletes race on bicycles, either on road courses, velodromes, or off-road trails. Road races can span over 200 kilometres, while track events are shorter and held on banked oval tracks."},
  {name:"Diving", description:"Athletes leap from a platform or springboard and perform acrobatic maneuvers in the air before entering the water. Judges score each dive based on approach, takeoff, execution, and entry splash."},
  {name:"Skeleton", description:"An athlete runs with a small sled, jumps on face-down and head-first, then slides down a frozen track at speeds exceeding 130 km/h. Times are measured to hundredths of a second over multiple runs."},
  {name:"Biathlon", description:"Athletes combine cross-country skiing and rifle marksmanship. They ski a set distance, stop at a shooting range to hit five targets, and receive time penalties for each miss. The fastest combined time wins."},
  {name:"Kabaddi", description:"A raider enters the opposing half, tries to tag defenders and return to their own half in a single breath while chanting the sport's name. Tagged defenders are out. The team with more points after two halves wins."},
  {name:"Sepak Takraw", description:"Two teams of three are separated by a net similar to volleyball, but players may only use their feet, knees, chest, and head to hit a rattan ball. Acrobatic bicycle kicks are common."},
  {name:"Bobsled", description:"A team of two or four athletes push a sled at the start, then jump in and ride it down a narrow, frozen track with banked turns. The team with the fastest combined time over multiple runs wins."},
  {name:"Darts", description:"Players throw small pointed missiles at a circular board divided into numbered segments. The bullseye is at the center. The most common game starts at 501 points and players subtract their scores to reach exactly zero."},
  {name:"Snooker", description:"Players use a cue to pot balls on a large green baize table. Red balls are worth one point each, and colored balls range from two to seven. Players must alternate between potting a red and a colored ball."},
  {name:"Field Hockey", description:"Two teams of 11 use curved sticks to hit a small hard ball along the ground into the opposing team's goal. The ball may only be played with the flat side of the stick. Games are played on turf."},
  {name:"American Football", description:"Two teams of 11 try to advance an oval ball down a 100-yard field by running or passing it. The offense has four attempts to move 10 yards. A touchdown in the end zone scores six points."},
  {name:"Sumo", description:"Two wrestlers face off in a circular ring. The objective is to force the opponent out of the ring or make any part of their body other than the soles of their feet touch the ground. Matches are often very short."},
  {name:"Hurling", description:"Teams of 15 use a flat wooden stick to hit a small ball called a sliotar. Scoring over the crossbar between the posts earns one point; under the crossbar into the net earns three. It is one of Ireland's native sports."},
  {name:"Triathlon", description:"Athletes complete three consecutive disciplines without stopping: a swim, a bike ride, and a run. The Olympic distance is a 1.5 km swim, 40 km cycle, and 10 km run. Fastest overall time wins."},
  {name:"Pickleball", description:"Players use solid paddles to hit a perforated polymer ball over a low net on a court roughly the size of a badminton court. Serving is underhand, and there is a non-volley zone near the net called the kitchen."}
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
function buildShareText(puzzleNo, results, correctCount) {
  const emojis = results.map(r => r ? "🟩" : "🟥").join("");
  return `Sportle #${puzzleNo} 🏅\n${emojis}\n${correctCount}/${ROUNDS}\nhttps://daily-le.com/sportle/`;
}

async function shareNice(text) {
  if (navigator.share) {
    try { await navigator.share({ title: "Sportle", text, url: "https://daily-le.com/sportle/" }); return; } catch {}
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
  setText("dayPill", "#" + puzzleNo + " — " + today);

  const dailySports = pickMultipleDeterministic(SPORTS, "sportle|" + today, ROUNDS);

  let currentRound = 0;
  let correctCount = 0;
  const results = [];

  function updateUI() {
    setText("roundPill", "Round: " + (currentRound + 1) + "/" + ROUNDS);
    setText("scorePill", "Score: " + correctCount + "/" + ROUNDS);
  }

  function showRound(idx) {
    if (idx >= ROUNDS) {
      endGame();
      return;
    }
    setText("descText", dailySports[idx].description);
    setText("hintLine", "");
    setText("errorLine", "");
    $("guessInput").value = "";
    $("guessInput").disabled = false;
    $("guessBtn").disabled = false;
    updateUI();
    $("guessInput").focus();
  }

  // Already played
  if (localStorage.getItem(DAILY_DONE_KEY) === today) {
    $("guessInput").disabled = true;
    $("guessBtn").disabled = true;
    setText("descText", "You have already played today.");
    setText("endTitle", "Already played today ✅");
    setText("endBody", "Come back tomorrow for new sports.");
    $("shareBtn").disabled = false;
    $("shareTopBtn").disabled = false;
    showModal();
    return;
  }

  showRound(0);

  function endGame() {
    $("guessInput").disabled = true;
    $("guessBtn").disabled = true;
    localStorage.setItem(DAILY_DONE_KEY, today);

    const allCorrect = correctCount === ROUNDS;
    setText("endTitle", allCorrect ? "Perfect score! ✅" : "Finished! " + correctCount + "/" + ROUNDS);
    setText("endBody", "Sports today: " + dailySports.map(function(s) { return s.name; }).join(", "));

    var grid = $("emojiGrid");
    if (grid) {
      grid.textContent = "";
      results.forEach(function(r) {
        var s = document.createElement("span");
        s.textContent = r ? "🟩" : "🟥";
        grid.appendChild(s);
      });
    }

    $("shareBtn").disabled = false;
    $("shareTopBtn").disabled = false;
    showModal();
  }

  $("guessForm").addEventListener("submit", function(e) {
    e.preventDefault();
    setText("errorLine", "");

    var input = $("guessInput");
    var guess = input.value.trim();
    input.value = "";

    if (!guess) {
      setText("errorLine", "Type a sport name.");
      return;
    }

    var sport = dailySports[currentRound];
    var correct = normalize(guess) === normalize(sport.name);
    results.push(correct);
    if (correct) correctCount++;

    // History row
    var histEl = $("history");
    var row = document.createElement("div");
    row.className = "history-row";
    row.innerHTML =
      '<span class="emoji">' + (correct ? "🟩" : "🟥") + '</span>' +
      '<span class="name">Round ' + (currentRound + 1) + ': ' + guess + '</span>' +
      '<span class="tag ' + (correct ? "good" : "bad") + '">' +
        (correct ? "Correct!" : "It was " + sport.name) +
      '</span>';
    histEl.prepend(row);

    currentRound++;
    updateUI();

    if (currentRound >= ROUNDS) {
      endGame();
      return;
    }

    // Short pause then show next round
    $("guessInput").disabled = true;
    $("guessBtn").disabled = true;
    setTimeout(function() {
      showRound(currentRound);
    }, 800);
  });

  // Share
  function currentShareText() {
    return buildShareText(puzzleNo, results, correctCount);
  }
  if ($("shareBtn")) $("shareBtn").addEventListener("click", function() { shareNice(currentShareText()); });
  if ($("shareTopBtn")) $("shareTopBtn").addEventListener("click", function() { shareNice(currentShareText()); });

  if ($("closeStatsBtn")) $("closeStatsBtn").addEventListener("click", hideModal);
  if ($("statsBackdrop")) $("statsBackdrop").addEventListener("click", hideModal);
})();
