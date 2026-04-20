<script>
  import { getDailyIndex, getDailyNumber, getTodayKey } from '$lib/utils/daily.js'
  import { loadGameState, saveGameState, loadStreak, updateStreak } from '$lib/utils/storage.js'
  import { elements } from '$lib/data/elemently.js'
  import ResultModal from '$lib/components/ResultModal.svelte'

  const GAME_ID = 'elemently'
  const COLOR = '#14b8a6'
  const MAX_GUESSES = 5
  const todayKey = getTodayKey()
  const gameNumber = getDailyNumber()
  const puzzle = elements[getDailyIndex(elements.length)]

  let guesses = []   // [{value, diff}]
  let input = ''
  let gameOver = false
  let won = false
  let showModal = false
  let streak = loadStreak(GAME_ID)
  let hint1Shown = false  // period hint (after 2nd wrong)
  let hint2Shown = false  // group hint (after 3rd wrong)

  const saved = loadGameState(GAME_ID)
  if (saved?.date === todayKey) {
    guesses = saved.guesses
    gameOver = true
    won = saved.won
    hint1Shown = guesses.length >= 2
    hint2Shown = guesses.length >= 3
  }

  function submitGuess() {
    const val = parseInt(input)
    if (isNaN(val) || val < 1 || val > 118 || gameOver) return

    const diff = val - puzzle.number
    guesses = [...guesses, { value: val, diff }]

    if (diff === 0) {
      gameOver = true
      won = true
      showModal = true
      streak = updateStreak(GAME_ID, true)
      saveGameState(GAME_ID, { date: todayKey, guesses, won: true })
    } else {
      hint1Shown = guesses.length >= 2
      hint2Shown = guesses.length >= 3
      if (guesses.length >= MAX_GUESSES) {
        gameOver = true
        won = false
        showModal = true
        streak = updateStreak(GAME_ID, false)
        saveGameState(GAME_ID, { date: todayKey, guesses, won: false })
      }
    }
    input = ''
  }

  function handleKey(e) {
    if (e.key === 'Enter') submitGuess()
  }

  function diffLabel(diff) {
    const abs = Math.abs(diff)
    const dir = diff > 0 ? '↓ Lower' : '↑ Higher'
    if (abs <= 2) return `🔥 Very close! ${dir}`
    if (abs <= 10) return `🌡️ Warm (${dir})`
    if (abs <= 30) return `❄️ Cool (${dir})`
    return `🧊 Cold (${dir})`
  }

  function diffClass(diff) {
    const abs = Math.abs(diff)
    if (diff === 0) return 'result-correct'
    if (abs <= 2) return 'result-close'
    if (abs <= 10) return 'result-close'
    return 'result-wrong'
  }

  function getEmojiGrid() {
    return guesses.map(g =>
      g.diff === 0 ? '🟩' : Math.abs(g.diff) <= 5 ? '🟨' : '⬛'
    ).join('')
  }

  function getShareText() {
    return `Elemently #${gameNumber} — ${puzzle.name}\n${won ? guesses.length : 'X'}/${MAX_GUESSES} ${getEmojiGrid()}\ndaily-le.us/elemently`
  }

  $: groupLabel = puzzle.group ? `Group ${puzzle.group}` : 'Lanthanide/Actinide series'
</script>

<svelte:head><title>Elemently — daily-le.us</title></svelte:head>

<main class="min-h-screen py-10 px-4">
  <div class="max-w-lg mx-auto">

    <div class="page-header justify-between">
      <a href="/" class="back-btn">← Hub</a>
      <div class="flex items-center gap-3">
        {#if streak.current > 0}<span class="text-xs text-teal-400">🔥 {streak.current}</span>{/if}
        <span class="text-xs text-slate-500">Day #{gameNumber}</span>
      </div>
    </div>

    <div class="text-center mb-6">
      <h1 class="text-2xl font-bold text-white mb-1">🔬 Elemently</h1>
      <p class="text-sm text-slate-400">Guess the <span class="text-teal-400 font-semibold">atomic number</span> of the element.</p>
    </div>

    <!-- Element display -->
    <div class="card p-8 text-center mb-4" style="border-color:rgba(20,184,166,0.25)">
      <p class="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Element</p>
      <p class="text-5xl font-bold text-white mb-1">{puzzle.name}</p>
      <p class="text-slate-500 text-sm font-mono">{puzzle.symbol}</p>
    </div>

    <!-- Hints -->
    {#if hint1Shown || hint2Shown || gameOver}
      <div class="flex gap-2 mb-4 flex-wrap">
        {#if hint1Shown || gameOver}
          <span class="tag" style="background:#14b8a622;color:#14b8a6">Period {puzzle.period}</span>
        {/if}
        {#if hint2Shown || gameOver}
          <span class="tag" style="background:#14b8a622;color:#14b8a6">{groupLabel}</span>
        {/if}
        {#if hint1Shown && !hint2Shown && !gameOver}
          <span class="text-xs text-slate-500 self-center">One more wrong guess reveals the group</span>
        {/if}
      </div>
    {:else}
      <p class="text-slate-500 text-xs text-center mb-4">2nd wrong guess → period hint &nbsp;|&nbsp; 3rd → group hint</p>
    {/if}

    <!-- Guesses -->
    {#if guesses.length > 0}
      <div class="space-y-1.5 mb-4">
        {#each guesses as g}
          <div class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm card {diffClass(g.diff)}">
            <span class="font-mono font-bold tabular-nums w-8">{g.value}</span>
            <span class="text-xs opacity-80">{g.diff === 0 ? '✓ Correct!' : diffLabel(g.diff)}</span>
          </div>
        {/each}
      </div>
    {/if}

    {#if !gameOver}
      <div class="flex gap-2">
        <input
          class="input-field font-mono text-xl text-center"
          type="number"
          placeholder="1 – 118"
          bind:value={input}
          on:keydown={handleKey}
          min="1"
          max="118"
          autofocus
        />
        <button class="btn text-white shrink-0" style="background:#14b8a6" on:click={submitGuess} disabled={!input}>
          Guess
        </button>
      </div>
      <p class="text-xs text-slate-600 mt-2 text-center">{guesses.length}/{MAX_GUESSES} guesses used</p>
    {:else if !won}
      <div class="clue-card result-wrong text-center py-4">
        <p class="text-sm text-slate-300">{puzzle.name} is atomic number <span class="font-bold text-white text-lg">{puzzle.number}</span></p>
      </div>
      <button class="btn w-full mt-3 text-white" style="background:#14b8a6" on:click={() => showModal = true}>See Results</button>
    {:else}
      <button class="btn w-full text-white" style="background:#14b8a6" on:click={() => showModal = true}>Share Results</button>
    {/if}

  </div>
</main>

{#if showModal}
  <ResultModal
    {won}
    answer="#{puzzle.number} — {puzzle.name}"
    shareText={getShareText()}
    color={COLOR}
    onClose={() => showModal = false}
  />
{/if}
