export function loadGameState(gameId) {
  try {
    const raw = localStorage.getItem(`dailyle_${gameId}`)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveGameState(gameId, state) {
  try {
    localStorage.setItem(`dailyle_${gameId}`, JSON.stringify(state))
  } catch {}
}

export function loadStreak(gameId) {
  try {
    const raw = localStorage.getItem(`dailyle_streak_${gameId}`)
    return raw ? JSON.parse(raw) : { current: 0, best: 0 }
  } catch {
    return { current: 0, best: 0 }
  }
}

export function updateStreak(gameId, won) {
  const streak = loadStreak(gameId)
  if (won) {
    streak.current++
    streak.best = Math.max(streak.best, streak.current)
  } else {
    streak.current = 0
  }
  try {
    localStorage.setItem(`dailyle_streak_${gameId}`, JSON.stringify(streak))
  } catch {}
  return streak
}

export function hasPlayedToday(gameId, todayKey) {
  const state = loadGameState(gameId)
  return state?.date === todayKey
}
