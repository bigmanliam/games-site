<script>
  import { onDestroy } from 'svelte'
  import { getDailyNumber, getTodayKey } from '$lib/utils/daily.js'
  import { loadGameState, saveGameState } from '$lib/utils/storage.js'
  import ResultModal from '$lib/components/ResultModal.svelte'

  const GAME_ID = 'blindtap'
  const TARGET = 5000
  const todayKey = getTodayKey()
  const gameNumber = getDailyNumber()

  let phase = 'ready' // ready | running | done
  let elapsed = 0
  let score = null
  let timer = null
  let startTime = null
  let showModal = false

  const saved = loadGameState(GAME_ID)
  if (saved?.date === todayKey) {
    phase = 'done'
    elapsed = saved.elapsed
    score = saved.score
  }

  function startRun() {
    phase = 'running'
    startTime = performance.now()
    timer = setInterval(() => {}, 100) // keep tick alive
  }

  function stop() {
    if (phase !== 'running') return
    clearInterval(timer)
    elapsed = performance.now() - startTime
    score = Math.round(Math.abs(elapsed - TARGET))
    phase = 'done'
    showModal = true
    saveGameState(GAME_ID, { date: todayKey, elapsed, score })
  }

  function handleKey(e) {
    if (e.code === 'Space') {
      e.preventDefault()
      if (phase === 'ready') startRun()
      else if (phase === 'running') stop()
    }
  }

  onDestroy(() => { if (timer) clearInterval(timer) })

  $: elapsedSec = (elapsed / 1000).toFixed(3)
  $: scoreLabel = score === null ? '' : score < 50 ? 'Uncanny' : score < 200 ? 'Excellent' : score < 500 ? 'Good' : score < 1000 ? 'Close' : 'Keep practicing'

  function getShareText() {
    return `Blindtap #${gameNumber}\n👆 Tapped at ${elapsedSec}s (${score}ms off)\ndaily-le.us/blindtap`
  }
</script>

<svelte:window on:keydown={handleKey} />
<svelte:head><title>Blindtap — daily-le.us</title></svelte:head>

<main class="min-h-screen flex flex-col items-center justify-center px-4 py-10">
  <div class="w-full max-w-sm">

    <div class="page-header justify-between">
      <a href="/" class="back-btn">← Hub</a>
      <span class="text-xs text-slate-500">Day #{gameNumber}</span>
    </div>

    <div class="text-center mb-8">
      <h1 class="text-2xl font-bold text-white mb-1">👆 Blindtap</h1>
      <p class="text-sm text-slate-400">No timer. Press start, then tap STOP after exactly <span class="text-blue-400 font-semibold">5 seconds</span>.</p>
    </div>

    <!-- Display -->
    <div class="card p-10 text-center mb-6" style="border-color: rgba(59,130,246,0.2)">
      {#if phase === 'ready'}
        <div class="text-5xl mb-2">👆</div>
        <p class="text-slate-400 text-sm">Feel the rhythm. No peeking.</p>
      {:else if phase === 'running'}
        <div class="text-5xl mb-2 animate-pulse">⏳</div>
        <p class="text-blue-400 font-semibold">Counting… tap when you feel 5 seconds.</p>
      {:else}
        <div class="text-5xl font-mono font-bold tabular-nums mb-2"
          class:text-green-400={score < 200}
          class:text-yellow-400={score >= 200 && score < 700}
          class:text-red-400={score >= 700}>
          {elapsedSec}s
        </div>
        <p class="text-slate-400 text-sm">{score}ms off target · {scoreLabel}</p>
      {/if}
    </div>

    {#if phase === 'ready'}
      <button class="btn w-full text-white text-lg py-4" style="background:#3b82f6" on:click={startRun}>
        START
      </button>
    {:else if phase === 'running'}
      <button class="btn w-full text-white text-lg py-4" style="background:#3b82f6" on:click={stop}>
        STOP
      </button>
    {:else}
      <div class="flex gap-3">
        <button class="btn btn-ghost flex-1" on:click={() => showModal = true}>Results</button>
        <button class="btn flex-1 text-white" style="background:#3b82f6" on:click={startRun}>Try Again*</button>
      </div>
      <p class="text-center text-xs text-slate-600 mt-2">*Only your first attempt counts for the day</p>
    {/if}

  </div>
</main>

{#if showModal}
  <ResultModal
    won={score < 500}
    answer="5.000s"
    shareText={getShareText()}
    color="#3b82f6"
    onClose={() => showModal = false}
  />
{/if}
