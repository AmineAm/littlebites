import { describe, it, expect } from 'vitest'
import { aggregateNutritionTags, getNutritionStatus, getTagLabel } from './nutrition'

describe('aggregateNutritionTags', () => {
  it('returns all zeroes for no recipes', () => {
    expect(aggregateNutritionTags([])).toEqual({
      protein: 0, veg: 0, carbs: 0, dairy: 0, fruit: 0,
    })
  })

  it('counts a tag once per recipe that carries it', () => {
    const counts = aggregateNutritionTags([['protein'], ['protein'], ['veg']])
    expect(counts.protein).toBe(2)
    expect(counts.veg).toBe(1)
  })

  it('counts every tag on a single recipe', () => {
    const counts = aggregateNutritionTags([['protein', 'veg', 'carbs']])
    expect(counts).toMatchObject({ protein: 1, veg: 1, carbs: 1, dairy: 0, fruit: 0 })
  })

  it('ignores recipes with no tags', () => {
    const counts = aggregateNutritionTags([[], ['veg'], []])
    expect(counts.veg).toBe(1)
  })
})

describe('getNutritionStatus', () => {
  it('is missing at zero', () => {
    expect(getNutritionStatus(0)).toBe('missing')
  })

  it('is missing just below the partial threshold', () => {
    expect(getNutritionStatus(1)).toBe('missing')
  })

  it('is partial at exactly 2', () => {
    expect(getNutritionStatus(2)).toBe('partial')
  })

  it('is partial just below the met threshold', () => {
    expect(getNutritionStatus(4)).toBe('partial')
  })

  it('is met at exactly 5', () => {
    expect(getNutritionStatus(5)).toBe('met')
  })

  it('stays met well above the threshold', () => {
    expect(getNutritionStatus(21)).toBe('met')
  })
})

describe('getTagLabel', () => {
  it('gives a human label for every tag', () => {
    expect(getTagLabel('veg')).toBe('Vegetables')
    expect(getTagLabel('protein')).toBe('Protein')
  })
})
