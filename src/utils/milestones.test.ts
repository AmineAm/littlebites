import { describe, it, expect } from 'vitest'
import { evaluateMilestones, MilestoneProgress } from './milestones'

const NONE: MilestoneProgress = { mealsCooked: 0, cuisinesTried: 0, stampsEarned: 0 }

// Starter is 'marco-lily' throughout, so the three earnable pairs are, in order:
// mei-theo (5 meals) · nour-boo (3 cuisines) · elsa-kit-finn (10 stamps)

describe('evaluateMilestones', () => {
  it('unlocks only the starter pair when nothing has been cooked', () => {
    expect(evaluateMilestones(NONE, 'marco-lily')).toEqual(['marco-lily'])
  })

  it('always includes the starter pair regardless of which one it is', () => {
    expect(evaluateMilestones(NONE, 'nour-boo')).toEqual(['nour-boo'])
  })

  describe('meals threshold', () => {
    it('does not unlock at 4 meals', () => {
      const result = evaluateMilestones({ ...NONE, mealsCooked: 4 }, 'marco-lily')
      expect(result).toEqual(['marco-lily'])
    })

    it('unlocks the second pair at exactly 5 meals', () => {
      const result = evaluateMilestones({ ...NONE, mealsCooked: 5 }, 'marco-lily')
      expect(result).toContain('mei-theo')
    })

    it('stays unlocked when overshot', () => {
      const result = evaluateMilestones({ ...NONE, mealsCooked: 50 }, 'marco-lily')
      expect(result).toContain('mei-theo')
    })
  })

  describe('cuisines threshold', () => {
    it('does not unlock at 2 cuisines', () => {
      const result = evaluateMilestones({ ...NONE, cuisinesTried: 2 }, 'marco-lily')
      expect(result).toEqual(['marco-lily'])
    })

    it('unlocks the third pair at exactly 3 cuisines', () => {
      const result = evaluateMilestones({ ...NONE, cuisinesTried: 3 }, 'marco-lily')
      expect(result).toContain('nour-boo')
    })
  })

  describe('stamps threshold', () => {
    it('does not unlock at 9 stamps', () => {
      const result = evaluateMilestones({ ...NONE, stampsEarned: 9 }, 'marco-lily')
      expect(result).toEqual(['marco-lily'])
    })

    it('unlocks the fourth pair at exactly 10 stamps', () => {
      const result = evaluateMilestones({ ...NONE, stampsEarned: 10 }, 'marco-lily')
      expect(result).toContain('elsa-kit-finn')
    })
  })

  describe('thresholds are independent, not sequential', () => {
    it('unlocks the cuisines pair without the meals pair', () => {
      // 3 cuisines is reachable in 3 meals — fewer than the 5 the meals gate needs
      const result = evaluateMilestones(
        { mealsCooked: 3, cuisinesTried: 3, stampsEarned: 0 },
        'marco-lily',
      )
      expect(result).toContain('nour-boo')
      expect(result).not.toContain('mei-theo')
    })

    it('unlocks every pair when all thresholds are met', () => {
      const result = evaluateMilestones(
        { mealsCooked: 10, cuisinesTried: 5, stampsEarned: 12 },
        'marco-lily',
      )
      expect(result).toHaveLength(4)
    })
  })

  describe('starter pair is never double-counted', () => {
    it('shifts earnable pairs when the starter is not the first in order', () => {
      // Starter mei-theo → earnable are marco-lily, nour-boo, elsa-kit-finn
      const result = evaluateMilestones({ ...NONE, mealsCooked: 5 }, 'mei-theo')
      expect(result).toEqual(['mei-theo', 'marco-lily'])
    })

    it('returns no duplicates when everything is unlocked', () => {
      const result = evaluateMilestones(
        { mealsCooked: 99, cuisinesTried: 99, stampsEarned: 99 },
        'elsa-kit-finn',
      )
      expect(new Set(result).size).toBe(result.length)
      expect(result).toHaveLength(4)
    })
  })
})
