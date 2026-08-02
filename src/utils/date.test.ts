import { describe, it, expect } from 'vitest'
import { getWeekId, getWeekStart, getWeekStartFromId, formatWeekLabel } from './date'

describe('getWeekId', () => {
  it('formats as YYYY-Wnn with a padded week number', () => {
    expect(getWeekId(new Date(2026, 0, 1))).toMatch(/^\d{4}-W\d{2}$/)
  })

  // ISO 8601: a week belongs to the year containing its Thursday. These are the
  // cases that break naive implementations.
  describe('year boundaries', () => {
    it('puts 31 Dec 2020 in week 53 of 2020', () => {
      expect(getWeekId(new Date(2020, 11, 31))).toBe('2020-W53')
    })

    it('puts 1 Jan 2021 in week 53 of the PREVIOUS year', () => {
      expect(getWeekId(new Date(2021, 0, 1))).toBe('2020-W53')
    })

    it('puts 30 Dec 2019 in week 1 of the FOLLOWING year', () => {
      expect(getWeekId(new Date(2019, 11, 30))).toBe('2020-W01')
    })

    it('puts 4 Jan 2021 in week 1 of 2021', () => {
      expect(getWeekId(new Date(2021, 0, 4))).toBe('2021-W01')
    })

    it('puts 1 Jan 2026 — a Thursday — in week 1 of 2026', () => {
      expect(getWeekId(new Date(2026, 0, 1))).toBe('2026-W01')
    })
  })

  it('gives every day of one week the same id', () => {
    const monday = new Date(2026, 7, 3)
    const ids = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday)
      d.setDate(monday.getDate() + i)
      return getWeekId(d)
    })
    expect(new Set(ids).size).toBe(1)
  })

  it('changes id across a week boundary', () => {
    const sunday = new Date(2026, 7, 2)
    const monday = new Date(2026, 7, 3)
    expect(getWeekId(sunday)).not.toBe(getWeekId(monday))
  })
})

describe('getWeekStart', () => {
  it('returns the Monday of the week', () => {
    expect(getWeekStart(new Date(2026, 7, 5)).getDay()).toBe(1)
  })

  it('returns the same Monday for a Sunday', () => {
    // Sunday 2 Aug 2026 belongs to the week starting Monday 27 Jul
    const start = getWeekStart(new Date(2026, 7, 2))
    expect(start.getDate()).toBe(27)
    expect(start.getMonth()).toBe(6)
  })

  it('zeroes the time component', () => {
    const start = getWeekStart(new Date(2026, 7, 5, 13, 45, 30))
    expect(start.getHours()).toBe(0)
    expect(start.getMinutes()).toBe(0)
  })
})

describe('getWeekStartFromId', () => {
  it('returns the Monday of the identified week', () => {
    expect(getWeekStartFromId('2026-W32').getDay()).toBe(1)
  })

  // ISO week 1 is the week containing 4 January — NOT the week containing
  // 1 January. These differ whenever 1 Jan falls on a Friday, Saturday or Sunday.
  it('anchors on 4 Jan when 1 Jan is a Friday (2021)', () => {
    const monday = getWeekStartFromId('2021-W01')
    expect(monday.getDate()).toBe(4)
    expect(monday.getMonth()).toBe(0)
    expect(monday.getFullYear()).toBe(2021)
  })

  it('starts in the previous year when 1 Jan is a Thursday (2026)', () => {
    const monday = getWeekStartFromId('2026-W01')
    expect(monday.getDate()).toBe(29)
    expect(monday.getMonth()).toBe(11)
    expect(monday.getFullYear()).toBe(2025)
  })

  it('round-trips with getWeekId', () => {
    for (const id of ['2020-W53', '2021-W01', '2024-W01', '2026-W01', '2026-W32']) {
      expect(getWeekId(getWeekStartFromId(id))).toBe(id)
    }
  })
})

describe('formatWeekLabel', () => {
  it('shows one month when the week does not cross a boundary', () => {
    // 2026-W32 is Mon 3 Aug – Sun 9 Aug
    expect(formatWeekLabel('2026-W32')).toBe('3–9 Aug')
  })

  it('shows both months when the week crosses a boundary', () => {
    // 2026-W01 is Mon 29 Dec 2025 – Sun 4 Jan 2026
    expect(formatWeekLabel('2026-W01')).toBe('29 Dec – 4 Jan')
  })

  it('labels a week that starts on 4 Jan correctly', () => {
    expect(formatWeekLabel('2021-W01')).toBe('4–10 Jan')
  })
})
