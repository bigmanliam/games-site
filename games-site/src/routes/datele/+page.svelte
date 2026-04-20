<script>
  import { getDailyIndex, getDailyNumber, getTodayKey } from '$lib/utils/daily.js'
  import { loadGameState, saveGameState, loadStreak, updateStreak } from '$lib/utils/storage.js'
  import { events } from '$lib/data/datele.js'
  import ResultModal from '$lib/components/ResultModal.svelte'

  const GAME_ID = 'datele'
  const COLOR = '#eab308'
  const MAX_GUESSES = 6
  const todayKey = getTodayKey()
  const gameNumber = getDailyNumber()
  const puzzle = events[getDailyIndex(events.length)]

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

  let guesses = []     // [{month, year}]
  let month = ''       // 1-12 string
  let year = ''        // number string
  let gameOver = false
  let won = false
  let showModal = false
  let streak = loadStreak(GAME_ID)

  // Bonus round
  let bonusActive = false
  let dayGuess = ''
  let bonusWon = null

  const saved = loadGameState(GAME_ID)
  if (saved?.date === todayKey) {
    guesses = saved.guesses
    gameOver = true
    won = saved.won
    bonusWon = saved.bonusWon ?? null
    bonusActive = won
  }

  function submitGuess() {
    const m = parseInt(month)
    const y = parseInt(year)
    if (!m || !y || m < 1 || m > 12 || y < 1 || y > 2100) return
    if (gameOver) return

    const feedback = getFeedback(m, y)
    guesses = [...guesses, { month: m, year: y, feedback }]

    if (m === puzzle.month && y === puzzle.year) {
      gameOver = true
      won = true
      bonusActive = true
      streak = updateStreak(GAME_ID, true)
      saveGameState(GAME_ID, { date: todayKey, guesses, won: true, bonusWon: null })
    } else if (guesses.length >= MAX_GUESSES) {
      gameOver = true
      won = false
      showModal = true
      streak = updateStreak(GAME_ID, false)
      saveGameState(GAME_ID, { date: todayKey, guesses, won: false, bonusWon: null })
    }

    month = ''
    year = ''
  }

  function getFeedback(m, y) {
    const guessVal = y * 12 + m
    const ansVal = puzzle.year * 12 + puzzle.month
    const diff = guessVal - ansVal
    const absDiff = Math.abs(diff)

    if (diff === 0) return { label: '✓ Correct!', type: 'correct' }
    const dir = diff > 0 ? 'too late' : 'too early'
    if (absDiff <= 2) return { label: `Very close — ${dir}`, type: 'close' }
    if (absDiff <= 12) return { label: `Within a year — ${dir}`, type: 'warm' }
    if (absDiff <= 60) return { label: `Within 5 years — ${dir}`, type: 'cool' }
    return { label: `More than 5 years off — ${dir}`, type: 'cold' }
  }

  function submitBonus() {
    const d = parseInt(dayGuess)
    if (!d || d < 1 || d > 31) return
    bonusWon = d === puzzle.day
    saveGameState(GAME_ID, { date: todayKey, guesses, won: true, bonusWon })
    showModal = true
  }

  function getShareText() {
    const rows = guesses.map(g => {
      const t = g.feedback.type
      const em = t === 'correct' ? '🟨' : t === 'close' ? '🟧' : t === 'warm' ? '🟥' : '⬛'
      return `${em} ${MONTHS[g.month - 1]} ${g.year}`
    }).join('\n')
    const bonus = bonusWon === true ? '\n🎯 Bonus day correct!' : bonusWon === false ? '\n❌ Bonus day wrong' : ''
    return `Datele #${gameNumber} ${won ? guesses.length : 'X'}/${MAX_GUESSES}${bonus}\n${rows}\ndaily-le.us/datele`
  }

  function feedbackClass(type) {
    if (type === 'correct') return 'result-correct'
    if (type === 'close') return 'result-close'
    if (type === 'warm') return 'result-close'
    return 'result-wrong'
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !bonusActive) submitGuess()
  }
</script>

<svelte:head><title>Datele — daily-le.us</title></svelte:head>

<main class="min-h-screen py-10 px-4">
  <div class="max-w-lg mx-auto">

    <div class="page-header justify-between">
      <a href="/" class="back-btn">← Hub</a>
      <div class="flex items-center gap-3">
        {#if streak.current > 0}<span class="text-xs text-yellow-400">🔥 {streak.current}</span>{/if}
        <span class="text-xs text-slate-500">Day #{gameNumber}</span>
      </div>
    </div>

    <div class="text-center mb-6">
      <h1 class="text-2xl font-bold text-white mb-1">📅 Datele</h1>
      <p class="text-sm text-slate-400">Guess the <span class="text-yellow-400 font-semibold">month and year</span> of a historical event.</p>
    </div>

    <!-- Event -->
    <div class="card p-5 mb-6" style="border-color:rgba(234,179,8,0.2)">
      <p class="text-white leading-relaxed font-medium">{puzzle.event}</p>
      {#if puzzle.hint && (gameOver || guesses.length >= 3)}
        <p class="text-slate-400 text-sm mt-3 pt-3 border-t border-white/5">💡 {puzzle.hint}</p>
      {/if}
    </div>

    <!-- Previous guesses -->
    {#if guesses.length > 0}
      <div class="space-y-1.5 mb-4">
        {#each guesses as g}
          <div class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm card {feedbackClass(g.feedback.type)}">
            <span class="font-semibold tabular-nums">{MONTHS[g.month - 1]} {g.year}</span>
            <span class="ml-auto text-xs opacity-80">{g.feedback.label}</span>
          </div>
        {/each}
      </div>
    {/if}

    <!-- Input -->
    {#if !gameOver}
      <div class="flex gap-2" on:keydown={handleKey}>
        <select
          class="input-field flex-none w-28"
          bind:value={month}
        >
          <option value="">Month</option>
          {#each MONTHS as m, i}
            <option value={i + 1}>{m}</option>
          {/each}
        </select>
        <input
          class="input-field"
          type="number"
          placeholder="Year (e.g. 1969)"
          bind:value={year}
          min="1"
          max="2100"
        />
        <button
          class="btn text-white shrink-0"
          style="background:#eab308"
          on:click={submitGuess}
          disabled={!month || !year}
        >
          Guess
        </button>
      </div>
      <p class="text-xs text-slate-600 mt-2 text-center">{guesses.length}/{MAX_GUESSES} guesses used · Hint appears after 3 wrong guesses</p>
    {/if}

    <!-- Bonus round -->
    {#if bonusActive}
      <div class="card mt-4 p-5" style="border-color:rgba(234,179,8,0.3)">
        <p class="text-yellow-400 font-semibold mb-1">🎯 Bonus Round!</p>
        <p class="text-slate-300 text-sm mb-4">You got the month and year. Now guess the exact <strong class="text-white">day</strong> (1–31) for a bonus point.</p>
        {#if bonusWon === null}
          <div class="flex gap-2">
            <input
              class="input-field"
              type="number"
              placeholder="Day (e.g. 20)"
              bind:value={dayGuess}
              min="1"
              max="31"
            />
            <button class="btn text-white shrink-0" style="background:#eab308" on:click={submitBonus} disabled={!dayGuess}>
              Guess
            </button>
          </div>
        {:else if bonusWon}
          <p class="text-green-400 font-semibold">🎯 Correct! The date was the {puzzle.day}th.</p>
          <button class="btn w-full mt-3 text-white" style="background:#eab308" on:click={() => showModal = true}>Share Results</button>
        {:else}
          <p class="text-red-400">The day was the <span class="font-bold text-white">{puzzle.day}th</span>.</p>
          <button class="btn w-full mt-3 text-white" style="background:#eab308" on:click={() => showModal = true}>Share Results</button>
        {/if}
      </div>
    {/if}

    <!-- Game over, didn't win -->
    {#if gameOver && !won}
      <div class="card result-wrong text-center py-4 mt-2">
        <p class="text-sm text-slate-300">The answer was <span class="font-bold text-white">{MONTHS[puzzle.month - 1]} {puzzle.year} ({puzzle.day}th)</span></p>
      </div>
      <button class="btn w-full mt-3 text-white" style="background:#eab308" on:click={() => showModal = true}>See Results</button>
    {/if}

  </div>
</main>

{#if showModal}
  <ResultModal
    {won}
    answer="{MONTHS[puzzle.month - 1]} {puzzle.day}, {puzzle.year}"
    shareText={getShareText()}
    color={COLOR}
    onClose={() => showModal = false}
  />
{/if}

<style>
  select.input-field option { background: #0f0f1a; }
</style>
