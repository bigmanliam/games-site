<script>
  import { onDestroy } from 'svelte'
  import { getDailyNumber, getTodayKey } from '$lib/utils/daily.js'
  import { loadGameState, saveGameState } from '$lib/utils/storage.js'
  import ResultModal from '$lib/components/ResultModal.svelte'

  const GAME_ID = 'reaction'
  const TARGET = 5000
  const todayKey = getTodayKey()
  const gameNumber = getDailyNumber()

  let phase = 'ready' // ready | countdown | running | done
  let countdownValue = 3
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

  function startCountdown() {
    phase = 'countdown'
    countdownValue = 3
    const iv = setInterval(() => {
      countdownValue--
      if (countdownValue <= 0) {
        clearInterval(iv)
        startRun()
      }
    }, 1000)
  }

  function startRun() {
    phase = 'running'
    startTime = performance.now()
    timer = setInterval(() => {
      elapsed = performance.now() - startTime
    }, 16)
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
      if (phase === 'ready') startCountdown()
      else if (phase === 'running') stop()
    }
  }

  onDestroy(() => { if (timer) clearInterval(timer) })

  $: elapsedSec = (elapsed / 1000).toFixed(3)
  $: scoreLabel = score === null ? '' : score === 0 ? 'Perfect!' : score < 50 ? 'Excellent' : score < 200 ? 'Good' : score < 500 ? 'Close' : 'Keep practicing'

  function getShareText() {
    const diff = score >= 0 ? `+${score}ms` : `${score}ms`
    return `Reactionle #${gameNumber}\n⏱️ ${elapsedSec}s (${score}ms off target)\ndaily-le.us/reaction`
  }
</script>

<svelte:window on:keydown={handleKey} />

<svelte:head><title>Reactionle — daily-le.us</title></svelte:head>

<main class="min-h-screen flex flex-col items-center justify-center px-4 py-10">
  <div class="w-full max-w-sm">

    <div class="page-header justify-between">
      <a href="/" class="back-btn">← Hub</a>
      <span class="text-xs text-slate-500">Day #{gameNumber}</span>
    </div>

    <div class="text-center mb-8">
      <h1 class="text-2xl font-bold text-white mb-1">⏱️ Reactionle</h1>
      <p class="text-sm text-slate-400">Stop the timer as close to <span class="text-green-400 font-semibold">5.000s</span> as you can.</p>
    </div>

    <!-- Timer display -->
    <div class="card p-8 text-center mb-6" style="border-color: rgba(34,197,94,0.2)">
      {#if phase === 'ready'}
        <div class="text-6xl font-mono font-bold text-slate-600">5.000</div>
        <p class="text-slate-500 text-sm mt-3">Press START or Space</p>
      {:else if phase === 'countdown'}
        <div class="text-7xl font-mono font-bold text-green-400">{countdownValue}</div>
        <p class="text-slate-400 text-sm mt-3">Get ready…</p>
      {:else if phase === 'running'}
        <div class="text-6xl font-mono font-bold text-white tabular-nums">{elapsedSec}</div>
        <p class="text-green-400 text-sm mt-3 animate-pulse">Tap STOP when you hit 5.000!</p>
      {:else}
        <div class="text-6xl font-mono font-bold tabular-nums" class:text-green-400={score < 100} class:text-yellow-400={score >= 100 && score < 500} class:text-red-400={score >= 500}>
          {elapsedSec}
        </div>
        <p class="text-slate-400 text-sm mt-2">{score}ms off · {scoreLabel}</p>
      {/if}
    </div>

    <!-- Action button -->
    {#if phase === 'ready'}
      <button class="btn w-full text-white text-lg py-4" style="background:#22c55e" on:click={startCountdown}>
        START
      </button>
    {:else if phase === 'countdown'}
      <button class="btn w-full btn-ghost text-lg py-4" disabled>Starting…</button>
    {:else if phase === 'running'}
      <button class="btn w-full text-white text-lg py-4" style="background:#ef4444" on:click={stop}>
        STOP
      </button>
    {:else}
      <div class="flex gap-3">
        <button class="btn btn-ghost flex-1" on:click={() => showModal = true}>Results</button>
        <button class="btn flex-1 text-white" style="background:#22c55e" on:click={startCountdown}>Try Again*</button>
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
    color="#22c55e"
    onClose={() => showModal = false}
  />
{/if}
