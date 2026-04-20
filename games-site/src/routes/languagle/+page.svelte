<script>
  import { getDailyIndex, getDailyNumber, getTodayKey } from '$lib/utils/daily.js'
  import { loadGameState, saveGameState, loadStreak, updateStreak } from '$lib/utils/storage.js'
  import { languages } from '$lib/data/languagle.js'
  import ResultModal from '$lib/components/ResultModal.svelte'

  const GAME_ID = 'languagle'
  const COLOR = '#ec4899'
  const todayKey = getTodayKey()
  const gameNumber = getDailyNumber()
  const puzzle = languages[getDailyIndex(languages.length)]
  const MAX_CLUES = puzzle.clues.length

  let guesses = []
  let input = ''
  let cluesRevealed = 0  // start with just the snippet, clues reveal on wrong guess
  let gameOver = false
  let won = false
  let showModal = false
  let streak = loadStreak(GAME_ID)

  const saved = loadGameState(GAME_ID)
  if (saved?.date === todayKey) {
    guesses = saved.guesses
    cluesRevealed = saved.cluesRevealed
    gameOver = true
    won = saved.won
  }

  function normalise(s) {
    return s.toLowerCase().replace(/[^a-z]/g, '')
  }

  function submitGuess() {
    const trimmed = input.trim()
    if (!trimmed || gameOver) return

    guesses = [...guesses, trimmed]

    if (normalise(trimmed) === normalise(puzzle.answer)) {
      gameOver = true
      won = true
      showModal = true
      streak = updateStreak(GAME_ID, true)
      saveGameState(GAME_ID, { date: todayKey, guesses, cluesRevealed, won: true })
    } else if (cluesRevealed < MAX_CLUES) {
      cluesRevealed++
      input = ''
    } else {
      gameOver = true
      won = false
      showModal = true
      streak = updateStreak(GAME_ID, false)
      saveGameState(GAME_ID, { date: todayKey, guesses, cluesRevealed, won: false })
    }
    input = ''
  }

  function handleKey(e) {
    if (e.key === 'Enter') submitGuess()
  }

  function getEmojiGrid() {
    const total = MAX_CLUES + 1 // snippet + clues
    return Array.from({ length: total }, (_, i) =>
      i < guesses.length ? (i === guesses.length - 1 && won ? '🟩' : '⬛') : '⬜'
    ).join('')
  }

  function getShareText() {
    return `Languagle #${gameNumber} ${won ? guesses.length : 'X'}/${MAX_CLUES + 1}\n${getEmojiGrid()}\ndaily-le.us/languagle`
  }
</script>

<svelte:head><title>Languagle — daily-le.us</title></svelte:head>

<main class="min-h-screen py-10 px-4">
  <div class="max-w-lg mx-auto">

    <div class="page-header justify-between">
      <a href="/" class="back-btn">← Hub</a>
      <div class="flex items-center gap-3">
        {#if streak.current > 0}<span class="text-xs text-pink-400">🔥 {streak.current}</span>{/if}
        <span class="text-xs text-slate-500">Day #{gameNumber}</span>
      </div>
    </div>

    <div class="text-center mb-6">
      <h1 class="text-2xl font-bold text-white mb-1">🌐 Languagle</h1>
      <p class="text-sm text-slate-400">Identify the language. More clues = lower score.</p>
    </div>

    <!-- Snippet (always visible) -->
    <div class="card p-5 mb-4" style="border-color:rgba(236,72,153,0.25)">
      <p class="text-xs text-pink-400 font-semibold uppercase tracking-wider mb-2">Text Snippet</p>
      <p class="text-white text-lg leading-relaxed font-medium italic">"{puzzle.snippet}"</p>
    </div>

    <!-- Progressive clues -->
    {#if cluesRevealed > 0}
      <div class="space-y-2 mb-4">
        {#each puzzle.clues.slice(0, cluesRevealed) as clue, i}
          <div class="clue-card flex gap-3 items-start">
            <span class="tag mt-0.5 shrink-0" style="background:#ec489922;color:#ec4899">#{i + 1}</span>
            <p class="text-slate-200 text-sm leading-relaxed">{clue}</p>
          </div>
        {/each}
        {#each Array(MAX_CLUES - cluesRevealed) as _, i}
          <div class="clue-card flex gap-3 items-center opacity-30">
            <span class="tag" style="background:#ec489911;color:#ec4899">#{cluesRevealed + i + 1}</span>
            <p class="text-slate-500 text-sm">Locked</p>
          </div>
        {/each}
      </div>
    {:else if !gameOver}
      <p class="text-slate-500 text-xs text-center mb-4">Wrong guess reveals a clue about the language.</p>
    {/if}

    {#if guesses.length > 0}
      <div class="mb-4 space-y-1.5">
        {#each guesses as g, i}
          <div class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm
            {i === guesses.length - 1 && won ? 'result-correct' : 'result-wrong'} card">
            <span>{i === guesses.length - 1 && won ? '✓' : '✗'}</span>
            <span>{g}</span>
          </div>
        {/each}
      </div>
    {/if}

    {#if !gameOver}
      <div class="flex gap-2">
        <input
          class="input-field"
          placeholder="Name the language…"
          bind:value={input}
          on:keydown={handleKey}
          autofocus
        />
        <button class="btn text-white shrink-0" style="background:#ec4899" on:click={submitGuess} disabled={!input.trim()}>
          Guess
        </button>
      </div>
      <p class="text-xs text-slate-600 mt-2 text-center">{guesses.length} guesses · Wrong guess reveals next clue</p>
    {:else if !won}
      <div class="clue-card result-wrong text-center py-4">
        <p class="text-sm text-slate-300">The language was <span class="font-bold text-white">{puzzle.answer}</span></p>
      </div>
      <button class="btn w-full mt-3 text-white" style="background:#ec4899" on:click={() => showModal = true}>See Results</button>
    {:else}
      <button class="btn w-full text-white" style="background:#ec4899" on:click={() => showModal = true}>Share Results</button>
    {/if}

  </div>
</main>

{#if showModal}
  <ResultModal
    {won}
    answer={puzzle.answer}
    shareText={getShareText()}
    color={COLOR}
    onClose={() => showModal = false}
  />
{/if}
