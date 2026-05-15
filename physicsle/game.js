const MAX_GUESSES = 4;
const DAILY_DONE_KEY = "physicsle_daily_done_v1";

const PHENOMENA = [
  {name:"Doppler Effect", description:"The apparent change in frequency of a wave when the source and observer are moving relative to each other. Commonly noticed when a siren approaches and then recedes."},
  {name:"Rayleigh Scattering", description:"The scattering of light by particles much smaller than the wavelength of the light, responsible for the blue color of the daytime sky."},
  {name:"Cherenkov Radiation", description:"Electromagnetic radiation emitted when a charged particle passes through a medium at a speed greater than the phase velocity of light in that medium, producing a characteristic blue glow."},
  {name:"Photoelectric Effect", description:"The emission of electrons from a material when light of sufficient frequency shines on it. The energy of emitted electrons depends on frequency, not intensity."},
  {name:"Brownian Motion", description:"The random, erratic movement of microscopic particles suspended in a fluid, caused by collisions with the fast-moving molecules of the fluid."},
  {name:"Bernoulli Effect", description:"A decrease in fluid pressure that occurs when the speed of the fluid increases. It helps explain how airplane wings generate lift."},
  {name:"Coriolis Effect", description:"The apparent deflection of moving objects when viewed from a rotating reference frame, responsible for the rotation of weather systems on Earth."},
  {name:"Superconductivity", description:"A phenomenon where certain materials exhibit zero electrical resistance and expulsion of magnetic fields when cooled below a critical temperature."},
  {name:"Refraction", description:"The bending of a wave as it passes from one medium to another with a different density, causing a straw in water to appear broken."},
  {name:"Diffraction", description:"The bending and spreading of waves around obstacles or through openings, allowing sound to be heard around corners."},
  {name:"Total Internal Reflection", description:"When a light ray hits a boundary at an angle greater than the critical angle, it is completely reflected back into the medium rather than passing through."},
  {name:"Electromagnetic Induction", description:"The production of an electromotive force across a conductor when it is exposed to a changing magnetic field, the principle behind generators and transformers."},
  {name:"Piezoelectricity", description:"The generation of an electric charge in certain materials in response to applied mechanical stress. Used in lighters, microphones, and quartz watches."},
  {name:"Triboluminescence", description:"The emission of light when a material is mechanically pulled apart, ripped, scratched, crushed, or rubbed. Seen when crushing certain candies in the dark."},
  {name:"Sonoluminescence", description:"The emission of short bursts of light from imploding bubbles in a liquid when excited by sound waves."},
  {name:"Bioluminescence", description:"The production and emission of light by living organisms through chemical reactions, as seen in fireflies and deep-sea creatures."},
  {name:"Superfluidity", description:"A state of matter in which a fluid flows with zero viscosity, able to climb container walls and flow through microscopic pores without friction."},
  {name:"Capillary Action", description:"The ability of a liquid to flow in narrow spaces against the force of gravity, due to surface tension and adhesion. This is how plants draw water upward."},
  {name:"Surface Tension", description:"The elastic tendency of a fluid surface to minimize its area, caused by cohesive forces between molecules. It allows insects to walk on water."},
  {name:"Quantum Tunneling", description:"A quantum mechanical phenomenon where a particle passes through a potential energy barrier that it classically could not surmount."},
  {name:"Wave-Particle Duality", description:"The concept that every quantum entity exhibits both wave and particle properties. Demonstrated by the double-slit experiment with electrons."},
  {name:"Blackbody Radiation", description:"The electromagnetic radiation emitted by an idealized object that absorbs all incident radiation. Its spectrum depends only on temperature."},
  {name:"Hawking Radiation", description:"Theoretical radiation predicted to be emitted by black holes due to quantum effects near the event horizon, causing them to slowly lose mass and eventually evaporate."},
  {name:"Gravitational Lensing", description:"The bending of light from distant objects by the gravitational field of a massive object between the source and observer, distorting or magnifying the image."},
  {name:"Redshift", description:"The increase in wavelength and decrease in frequency of electromagnetic radiation from an object moving away from the observer, used to measure the expansion of the universe."},
  {name:"Time Dilation", description:"The difference in elapsed time measured by two clocks due to a difference in their velocity or gravitational potential, as predicted by relativity."},
  {name:"Lenz's Law", description:"The direction of an induced current is always such that it opposes the change in magnetic flux that produced it, a consequence of conservation of energy."},
  {name:"Meissner Effect", description:"The complete expulsion of magnetic field lines from the interior of a superconductor as it transitions to the superconducting state, enabling magnetic levitation."},
  {name:"Hall Effect", description:"The production of a voltage difference across an electrical conductor when a magnetic field is applied perpendicular to the current flow."},
  {name:"Compton Scattering", description:"The decrease in energy of a photon when it interacts with a free charged particle, demonstrating the particle nature of light."},
  {name:"Pair Production", description:"The creation of a particle and its antiparticle from a photon interacting with a strong electromagnetic field, converting energy into mass."},
  {name:"Leidenfrost Effect", description:"A phenomenon where a liquid, in near contact with a surface significantly hotter than its boiling point, produces a vapor layer that insulates it and causes it to hover."},
  {name:"Eddy Currents", description:"Loops of electrical current induced within conductors by a changing magnetic field. They cause braking forces in magnetic braking systems."},
  {name:"Resonance", description:"The tendency of a system to oscillate with greater amplitude at certain frequencies, which match the system's natural frequencies. It can cause bridges to sway."},
  {name:"Interference", description:"The phenomenon where two waves superpose to form a resultant wave of greater, lower, or the same amplitude. Creates bright and dark fringes in light experiments."},
  {name:"Polarization", description:"The property of waves that describes the orientation of their oscillations. For light, it restricts vibrations to a single plane, used in sunglasses and LCD screens."},
  {name:"Thermoelectric Effect", description:"The direct conversion of temperature differences to electric voltage and vice versa, used in thermocouples and solid-state cooling devices."},
  {name:"Entropy", description:"A measure of the disorder or randomness in a system. The second law of thermodynamics states it always increases in an isolated system."},
  {name:"Centripetal Force", description:"The force that keeps an object moving in a circular path, always directed toward the center of rotation. Without it, the object would travel in a straight line."},
  {name:"Precession", description:"The slow, conical motion of the rotation axis of a spinning body, such as a wobbling top or the gradual shift of Earth's axial orientation over thousands of years."},
  {name:"Parallax", description:"The apparent shift in the position of an object when viewed from two different vantage points. Used to measure distances to nearby stars."},
  {name:"Buoyancy", description:"The upward force exerted on an object immersed in a fluid, equal to the weight of the fluid displaced. It explains why ships float despite being made of steel."},
  {name:"Inertia", description:"The tendency of an object to resist changes in its state of motion. An object at rest stays at rest, and an object in motion stays in motion unless acted upon by a force."},
  {name:"Friction", description:"The resistive force that opposes the relative motion of two surfaces in contact. Without it, walking and driving would be impossible."},
  {name:"Elasticity", description:"The ability of a material to return to its original shape after being deformed by an external force, like a rubber band snapping back after being stretched."},
  {name:"Radioactive Decay", description:"The spontaneous transformation of an unstable atomic nucleus into a lighter nucleus, accompanied by the emission of particles or radiation."},
  {name:"Nuclear Fission", description:"The splitting of a heavy atomic nucleus into two or more lighter nuclei, releasing a large amount of energy. The process used in nuclear power plants."},
  {name:"Nuclear Fusion", description:"The combining of two light atomic nuclei to form a heavier nucleus, releasing enormous energy. The process that powers the Sun and other stars."},
  {name:"Aurora", description:"A natural light display in the sky caused by charged particles from the solar wind interacting with gases in the Earth's upper atmosphere near the poles."},
  {name:"Tidal Forces", description:"Gravitational effects that stretch a body along the line toward and away from the center of mass of another body, responsible for ocean tides and geological stresses on moons."},
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
function getHint(answer, guessNum) {
  switch (guessNum) {
    case 1: return `Starts with "${answer[0]}".`;
    case 2: return `${answer.length} letters. Starts with "${answer[0]}".`;
    case 3: return `"${answer.slice(0, Math.ceil(answer.length / 3))}…" (${answer.length} letters).`;
    default: return "";
  }
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
  return `Physicsle #${puzzleNo} ⚛️\n${emojis}\n${score}\nhttps://daily-le.com/physicsle/`;
}

async function shareNice(text) {
  if (navigator.share) {
    try { await navigator.share({ title: "Physicsle", text, url: "https://daily-le.com/physicsle/" }); return; } catch {}
  }
  try { await navigator.clipboard.writeText(text); } catch { prompt("Copy:", text); }
}

/* ---- Main ---- */
(function main() {
  const today = todayLocalISO();
  const puzzleNo = gameNumberFromDate(today);
  setText("dayPill", `#${puzzleNo} — ${today}`);
  setText("triesPill", `Guesses: 0/${MAX_GUESSES}`);

  const chosen = pickDeterministic(PHENOMENA, "physicsle|" + today);
  setText("descriptionText", chosen.description);

  const allNames = PHENOMENA.map(p => p.name).sort();
  const getGuess = setupSearch(allNames);

  let guesses = 0;
  let solved = false;
  const history = [];

  // Already played
  if (localStorage.getItem(DAILY_DONE_KEY) === today) {
    $("guessInput").disabled = true;
    $("guessBtn").disabled = true;
    setText("endTitle", "Already played today");
    setText("endBody", `The answer was: ${chosen.name}`);
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

    setText("endTitle", win ? "You got it! ⚛️" : "Not this time ❌");
    setText("endBody", `The answer was: ${chosen.name}`);

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
      setText("errorLine", "Type a phenomenon name.");
      return;
    }

    guesses++;
    const correct = guess.toLowerCase().trim() === chosen.name.toLowerCase().trim();
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

    const hint = getHint(chosen.name, guesses);
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
