const TARGET = 5.000;
const DAILY_DONE_KEY = "blindtap_daily_done_v1";

function $(id) { return document.getElementById(id); }
function setText(id, txt) { const el = $(id); if (el) el.textContent = txt; }

function todayLocalISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function gameNumberFromDate(dateISO) {
  const base = new Date("2026-01-01T00:00:00");
  const cur = new Date(dateISO + "T00:00:00");
  return Math.max(1, Math.round((cur - base) / 86400000) + 1);
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
function buildShareText(puzzleNo, finalTime, diffMs) {
  return `Blindtap #${puzzleNo} 🙈\n${finalTime.toFixed(3)}s (off by ${diffMs}ms)\nhttps://daily-le.com/blindtap/`;
}

async function shareNice(text) {
  if (navigator.share) {
    try { await navigator.share({ title: "Blindtap", text, url: "https://daily-le.com/blindtap/" }); return; } catch {}
  }
  try { await navigator.clipboard.writeText(text); } catch { prompt("Copy your share text:", text); }
}

/* ---- Main ---- */
(function main() {
  const today = todayLocalISO();
  const puzzleNo = gameNumberFromDate(today);
  setText("dayPill", `#${puzzleNo} — ${today}`);

  const btn = $("actionBtn");
  const timerText = $("timerText");
  const resultText = $("resultText");
  const gameCard = $("gameCard");

  let state = "idle"; // idle | running | done
  let startTime = null;

  // Running state color — a subtle border glow to show the clock is ticking
  const RUNNING_BORDER = "1px solid rgba(123,220,255,0.4)";
  const DEFAULT_BORDER = "";

  function finishGame(finalTime) {
    state = "done";

    // Reset visual
    if (gameCard) gameCard.style.border = DEFAULT_BORDER;

    const diff = Math.abs(finalTime - TARGET);
    const diffMs = Math.round(diff * 1000);

    timerText.textContent = finalTime.toFixed(3) + "s";
    resultText.textContent = `Off by ${diffMs}ms`;
    btn.textContent = "Done";
    btn.disabled = true;

    // Save daily
    localStorage.setItem(DAILY_DONE_KEY, JSON.stringify({
      date: today, time: finalTime, diffMs: diffMs
    }));

    // Modal
    let verdict;
    if (diffMs === 0) verdict = "Perfect! 🙈";
    else if (diffMs <= 50) verdict = "Incredible! 🙈";
    else if (diffMs <= 150) verdict = "Great timing! 🙈";
    else if (diffMs <= 300) verdict = "Not bad! 🙈";
    else if (diffMs <= 500) verdict = "Close enough 🙈";
    else verdict = "Keep practicing 🙈";

    setText("endTitle", verdict);
    setText("endBody", `You stopped at ${finalTime.toFixed(3)}s — off by ${diffMs}ms`);

    $("shareBtn").disabled = false;
    $("shareTopBtn").disabled = false;
    showModal();

    const shareText = buildShareText(puzzleNo, finalTime, diffMs);
    $("shareBtn").onclick = () => shareNice(shareText);
    $("shareTopBtn").onclick = () => shareNice(shareText);
  }

  // Already played?
  try {
    const saved = JSON.parse(localStorage.getItem(DAILY_DONE_KEY) || "null");
    if (saved && saved.date === today) {
      timerText.textContent = saved.time.toFixed(3) + "s";
      resultText.textContent = `Off by ${saved.diffMs}ms`;
      btn.textContent = "Done";
      btn.disabled = true;
      state = "done";

      setText("endTitle", "Already played today ✅");
      setText("endBody", `You stopped at ${saved.time.toFixed(3)}s — off by ${saved.diffMs}ms`);
      $("shareBtn").disabled = false;
      $("shareTopBtn").disabled = false;
      showModal();

      const shareText = buildShareText(puzzleNo, saved.time, saved.diffMs);
      $("shareBtn").onclick = () => shareNice(shareText);
      $("shareTopBtn").onclick = () => shareNice(shareText);
      return;
    }
  } catch {}

  btn.addEventListener("click", () => {
    if (state === "idle") {
      state = "running";
      startTime = performance.now();
      btn.textContent = "Stop";
      timerText.textContent = "...";
      // Visual cue: card border glows to show running, but NO timer numbers
      if (gameCard) gameCard.style.border = RUNNING_BORDER;
    } else if (state === "running") {
      const finalTime = (performance.now() - startTime) / 1000;
      finishGame(finalTime);
    }
  });

  // Modal close
  $("closeStatsBtn")?.addEventListener("click", hideModal);
  $("statsBackdrop")?.addEventListener("click", hideModal);
})();
