const EPOCH = new Date('2025-01-01T00:00:00Z').getTime()

function utcDaysSinceEpoch() {
  const now = new Date()
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  return Math.floor((today - EPOCH) / 86400000)
}

export function getDailyIndex(total) {
  return utcDaysSinceEpoch() % total
}

export function getDailyNumber() {
  return utcDaysSinceEpoch() + 1
}

export function getTodayKey() {
  const d = new Date()
  return `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`
}
