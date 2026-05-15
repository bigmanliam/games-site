/**
 * Shared utilities for all Daily-le games.
 * Include via <script src="../shared.js"></script> before game.js
 */

/** FNV-1a hash */
function hashStringToUint32(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Deterministic shuffle using seed (Fisher-Yates with seeded PRNG) */
function seededShuffle(arr, seed) {
  const out = arr.slice();
  // Simple seeded PRNG (mulberry32)
  let s = seed >>> 0;
  function rand() {
    s |= 0; s = s + 0x6D2B79F5 | 0;
    let t = Math.imul(s ^ s >>> 15, 1 | s);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Bag-based selection: shuffles the full pool deterministically,
 * iterates through it one per day, and only reshuffles after the
 * entire pool has been used.
 *
 * @param {Array} pool - Array of items to select from
 * @param {string} gameName - Unique game identifier for seeding
 * @param {string} dateISO - Today's date as YYYY-MM-DD
 * @returns {*} The selected item for today
 */
function pickFromBag(pool, gameName, dateISO) {
  const dayNum = daysSinceEpoch(dateISO);
  const cycleLength = pool.length;
  const cycleIndex = Math.floor(dayNum / cycleLength);
  const dayInCycle = dayNum % cycleLength;

  // Seed changes each cycle so the order is different each time through
  const seed = hashStringToUint32(gameName + "|cycle" + cycleIndex);
  const shuffled = seededShuffle(pool, seed);
  return shuffled[dayInCycle];
}

/**
 * Bag-based selection returning multiple unique items per day.
 *
 * @param {Array} pool - Array of items
 * @param {string} gameName - Unique game identifier
 * @param {string} dateISO - Today's date
 * @param {number} count - How many items to pick
 * @returns {Array} Array of selected items
 */
function pickMultipleFromBag(pool, gameName, dateISO, count) {
  const dayNum = daysSinceEpoch(dateISO);
  // Each day we need `count` items; cycle through pool in chunks
  const effectiveDayNum = dayNum * count;
  const results = [];
  for (let i = 0; i < count; i++) {
    const idx = effectiveDayNum + i;
    const cycleIndex = Math.floor(idx / pool.length);
    const dayInCycle = idx % pool.length;
    const seed = hashStringToUint32(gameName + "|cycle" + cycleIndex);
    const shuffled = seededShuffle(pool, seed);
    results.push(shuffled[dayInCycle]);
  }
  return results;
}

/** Days since 2026-01-01 */
function daysSinceEpoch(dateISO) {
  const base = new Date("2026-01-01T00:00:00");
  const cur = new Date(dateISO + "T00:00:00");
  return Math.max(0, Math.round((cur - base) / 86400000));
}

/** Game number (1-indexed) */
function gameNumberFromDate(dateISO) {
  return daysSinceEpoch(dateISO) + 1;
}

/** Today as YYYY-MM-DD in local timezone */
function todayLocalISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

/** DOM helpers */
function $(id) { return document.getElementById(id); }
function setText(id, txt) { const el = $(id); if (el) el.textContent = txt; }

/** Share helper */
async function shareNice(title, text, url) {
  if (navigator.share) {
    try { await navigator.share({ title, text, url }); return; } catch {}
  }
  try { await navigator.clipboard.writeText(text); } catch { prompt("Copy:", text); }
}

/** Modal helpers */
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
