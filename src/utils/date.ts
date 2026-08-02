// ISO 8601 week maths. Pure — no React, no storage. See CLAUDE.md § Testing.
//
// The rule that matters: a week belongs to the year containing its Thursday,
// and week 1 is the week containing 4 January. Anchoring on 1 January instead
// is wrong in every year where 1 Jan falls on a Friday, Saturday or Sunday.

const MS_PER_DAY = 86_400_000

/** ISO week id, e.g. "2026-W32". */
export function getWeekId(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const day = d.getUTCDay() || 7            // Monday = 1 … Sunday = 7

  d.setUTCDate(d.getUTCDate() + 4 - day)    // shift to this week's Thursday
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / MS_PER_DAY + 1) / 7)

  return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`
}

/** The Monday of the ISO week containing a given date, at midnight. */
export function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay() || 7

  d.setDate(d.getDate() - day + 1)
  d.setHours(0, 0, 0, 0)
  return d
}

/** The Monday of the week named by an id, e.g. "2026-W32" → Mon 3 Aug 2026. */
export function getWeekStartFromId(weekId: string): Date {
  const [yearPart, weekPart] = weekId.split('-W')
  const year = parseInt(yearPart, 10)
  const week = parseInt(weekPart, 10)

  // 4 January is always in ISO week 1, so walk back to that week's Monday.
  const jan4 = new Date(year, 0, 4)
  const jan4Day = jan4.getDay() || 7

  const monday = new Date(jan4)
  monday.setDate(jan4.getDate() - jan4Day + 1 + (week - 1) * 7)
  monday.setHours(0, 0, 0, 0)
  return monday
}

/**
 * Human label for a week — "3–9 Aug", or "29 Dec – 4 Jan" when the week spans
 * two months. Repeating the month is the whole point: "29–4 Jan" reads as if
 * the 29th were in January.
 */
export function formatWeekLabel(weekId: string): string {
  const monday = getWeekStartFromId(weekId)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  const dayMonth = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' })

  return monday.getMonth() === sunday.getMonth()
    ? `${monday.getDate()}–${dayMonth.format(sunday)}`
    : `${dayMonth.format(monday)} – ${dayMonth.format(sunday)}`
}
