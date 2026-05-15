const TARGET = 5.000;
const DAILY_DONE_KEY = "reactionle_daily_done_v1";

/* Utilities: $, setText, todayLocalISO, gameNumberFromDate, showModal, hideModal, shareNice from ../shared.js */

function buildShareText(puzzleNo, finalTime, diffMs) {
  return `Reactionle #${puzzleNo} ⏱️\n${finalTime.toFixed(3)}s (off by ${diffMs}ms)\nhttps://daily-le.com/reactionle/`;
}

/* ---- Main ---- */
(function main() {
  const today = todayLocalISO();
  const puzzleNo = gameNumberFromDate(today);
  setText("dayPill", `#${puzzleNo} — ${today}`);

  const btn = $("actionBtn");
  const timerText = $("timerText");
  const resultText = $("resultText");

  let state = "idle"; // idle | running | done
  let startTime = null;
  let rafId = null;

  function updateTimer() {
    if (state !== "running") return;
    const elapsed = (performance.now() - startTime) / 1000;
    timerText.textContent = elapsed.toFixed(3) + "s";
    rafId = requestAnimationFrame(updateTimer);
  }

  function finishGame(finalTime) {
    state = "done";
    if (rafId) cancelAnimationFrame(rafId);

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
    if (diffMs === 0) verdict = "Perfect! ⏱️";
    else if (diffMs <= 50) verdict = "Incredible! ⏱️";
    else if (diffMs <= 150) verdict = "Great timing! ⏱️";
    else if (diffMs <= 300) verdict = "Not bad! ⏱️";
    else if (diffMs <= 500) verdict = "Close enough ⏱️";
    else verdict = "Keep practicing ⏱️";

    setText("endTitle", verdict);
    setText("endBody", `You stopped at ${finalTime.toFixed(3)}s — off by ${diffMs}ms`);

    $("shareBtn").disabled = false;
    $("shareTopBtn").disabled = false;
    showModal();

    const shareText = buildShareText(puzzleNo, finalTime, diffMs);
    $("shareBtn").onclick = () => shareNice("Reactionle", shareText, "https://daily-le.com/reactionle/");
    $("shareTopBtn").onclick = () => shareNice("Reactionle", shareText, "https://daily-le.com/reactionle/");
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
      $("shareBtn").onclick = () => shareNice("Reactionle", shareText, "https://daily-le.com/reactionle/");
      $("shareTopBtn").onclick = () => shareNice("Reactionle", shareText, "https://daily-le.com/reactionle/");
      return;
    }
  } catch {}

  btn.addEventListener("click", () => {
    if (state === "idle") {
      state = "running";
      startTime = performance.now();
      btn.textContent = "Stop";
      updateTimer();
    } else if (state === "running") {
      const finalTime = (performance.now() - startTime) / 1000;
      finishGame(finalTime);
    }
  });

  // Modal close
  $("closeStatsBtn")?.addEventListener("click", hideModal);
  $("statsBackdrop")?.addEventListener("click", hideModal);
})();
