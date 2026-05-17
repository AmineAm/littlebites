// Returns ISO week ID in the format YYYY-WNN, e.g. "2025-W32"
export function getWeekId(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const day = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - day)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const weekNumber = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
  )
  return `${d.getUTCFullYear()}-W${String(weekNumber).padStart(2, '0')}`
}

// Returns the Monday of the ISO week containing the given date
export function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay() || 7
  d.setDate(d.getDate() - day + 1)
  d.setHours(0, 0, 0, 0)
  return d
}

export function formatWeekLabel(weekId: string): string {
  // e.g. "2025-W32" → "4–10 Aug"
  const [year, weekPart] = weekId.split('-W')
  const week = parseInt(weekPart, 10)
  const jan1 = new Date(parseInt(year, 10), 0, 1)
  const monday = new Date(jan1)
  monday.setDate(jan1.getDate() + (week - 1) * 7 - (jan1.getDay() || 7) + 1)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  const fmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' })
  return `${monday.getDate()}–${fmt.format(sunday)}`
}
