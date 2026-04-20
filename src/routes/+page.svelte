<script>
  import { onMount } from 'svelte'
  import GameCard from '$lib/components/GameCard.svelte'
  import { getTodayKey, getDailyNumber } from '$lib/utils/daily.js'
  import { loadGameState, loadStreak } from '$lib/utils/storage.js'

  const games = [
    { id: 'reaction',  name: 'Reactionle',  emoji: '⏱️', color: '#22c55e', route: '/reaction',  description: 'Stop the timer at exactly 5 seconds.' },
    { id: 'blindtap',  name: 'Blindtap',    emoji: '👆', color: '#3b82f6', route: '/blindtap',  description: 'No timer. Tap after exactly 5 seconds.' },
    { id: 'whodunit',  name: 'Whodunit',    emoji: '🕵️', color: '#a855f7', route: '/whodunit',  description: 'Identify a famous person from clues.' },
    { id: 'sportle',   name: 'Sportle',     emoji: '🏆', color: '#f97316', route: '/sportle',   description: 'Name the sport from its description.' },
    { id: 'physicsle', name: 'Physicsle',   emoji: '⚛️', color: '#06b6d4', route: '/physicsle', description: 'Name the physics phenomenon described.' },
    { id: 'datele',    name: 'Datele',      emoji: '📅', color: '#eab308', route: '/datele',    description: 'Guess the month and year of a historical event.' },
    { id: 'languagle', name: 'Languagle',   emoji: '🌐', color: '#ec4899', route: '/languagle', description: 'Identify the language from a text snippet.' },
    { id: 'statele',   name: 'Statele',     emoji: '🗺️', color: '#ef4444', route: '/statele',   description: 'Name the US state or territory from a city.' },
    { id: 'elemently', name: 'Elemently',   emoji: '🔬', color: '#14b8a6', route: '/elemently', description: 'Guess the atomic number of an element.' },
  ]

  let gameStatuses = {}
  let gameStreaks = {}
  const todayKey = getTodayKey()
  const dayNumber = getDailyNumber()

  onMount(() => {
    for (const g of games) {
      const state = loadGameState(g.id)
      gameStatuses[g.id] = state?.date === todayKey
      gameStreaks[g.id] = loadStreak(g.id).current
    }
    gameStatuses = gameStatuses
    gameStreaks = gameStreaks
  })

  $: playedCount = Object.values(gameStatuses).filter(Boolean).length
</script>

<svelte:head>
  <title>daily-le.us — Daily Puzzle Games</title>
</svelte:head>

<main class="min-h-screen py-10 px-4">
  <div class="max-w-3xl mx-auto">

    <!-- Header -->
    <header class="text-center mb-10">
      <h1 class="text-4xl font-extrabold text-white tracking-tight mb-2">
        daily<span class="text-indigo-400">-le</span>.us
      </h1>
      <p class="text-slate-400 text-sm">Nine daily puzzles. One obsession.</p>
      <div class="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-slate-300">
        Day #{dayNumber} &nbsp;·&nbsp; {playedCount}/9 played today
      </div>
    </header>

    <!-- Game grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {#each games as game}
        <GameCard
          name={game.name}
          description={game.description}
          emoji={game.emoji}
          color={game.color}
          route={game.route}
          played={gameStatuses[game.id] ?? false}
          streak={gameStreaks[game.id] ?? 0}
        />
      {/each}
    </div>

    <footer class="mt-12 text-center text-xs text-slate-600">
      Resets daily at midnight UTC
    </footer>
  </div>
</main>
