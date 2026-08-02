import { describe, it, expect } from 'vitest'
import { scoreRecipe, rankRecipes, applyMealVerdict } from './preference'
import { Recipe } from '@/types/recipe'
import { ChildPreferences, Allergy } from '@/types/child'

const NO_PREFS: ChildPreferences = { liked: [], disliked: [], cuisineHistory: {} }

function recipe(over: Partial<Recipe> = {}): Recipe {
  return {
    recipeId: 'r', title: 'R', cuisineId: 'italian',
    ageRange: { min: 2, max: 12 }, prepMinutes: 20, difficulty: 'easy', servings: 2,
    allergens: [], nutritionTags: [], ingredients: [], steps: [],
    coreFlavours: [], textures: [], mainProteins: [], mainVeg: [],
    substitutions: {}, launchWave: 1,
    ...over,
  } as Recipe
}

describe('scoreRecipe', () => {
  describe('allergen exclusion — safety critical', () => {
    it('scores zero when the recipe contains a declared allergen', () => {
      const r = recipe({ allergens: ['nuts'] })
      expect(scoreRecipe(r, NO_PREFS, ['nuts'])).toBe(0)
    })

    it('scores zero even when every other signal is positive', () => {
      const r = recipe({ allergens: ['nuts'], mainProteins: ['chicken'], mainVeg: ['carrot'] })
      const prefs: ChildPreferences = {
        liked: ['chicken', 'carrot'], disliked: [],
        cuisineHistory: { italian: 'accepted' },
      }
      expect(scoreRecipe(r, prefs, ['nuts'])).toBe(0)
    })

    it('scores zero if ANY one of several allergens matches', () => {
      const r = recipe({ allergens: ['dairy'] })
      const allergies: Allergy[] = ['nuts', 'dairy', 'soy']
      expect(scoreRecipe(r, NO_PREFS, allergies)).toBe(0)
    })

    it('does not penalise an allergen the child does not have', () => {
      const r = recipe({ allergens: ['fish'] })
      expect(scoreRecipe(r, NO_PREFS, ['nuts'])).toBeGreaterThan(0)
    })
  })

  describe('preference signals', () => {
    it('scores a liked protein above a neutral one', () => {
      const r = recipe({ mainProteins: ['chicken'] })
      const liked: ChildPreferences = { ...NO_PREFS, liked: ['chicken'] }
      expect(scoreRecipe(r, liked, [])).toBeGreaterThan(scoreRecipe(r, NO_PREFS, []))
    })

    it('scores a disliked protein below a neutral one', () => {
      const r = recipe({ mainProteins: ['chicken'] })
      const disliked: ChildPreferences = { ...NO_PREFS, disliked: ['chicken'] }
      expect(scoreRecipe(r, disliked, [])).toBeLessThan(scoreRecipe(r, NO_PREFS, []))
    })

    it('rewards a previously accepted cuisine', () => {
      const r = recipe({ cuisineId: 'thai' })
      const accepted: ChildPreferences = { ...NO_PREFS, cuisineHistory: { thai: 'accepted' } }
      expect(scoreRecipe(r, accepted, [])).toBeGreaterThan(scoreRecipe(r, NO_PREFS, []))
    })

    it('penalises a previously rejected cuisine', () => {
      const r = recipe({ cuisineId: 'thai' })
      const rejected: ChildPreferences = { ...NO_PREFS, cuisineHistory: { thai: 'rejected' } }
      expect(scoreRecipe(r, rejected, [])).toBeLessThan(scoreRecipe(r, NO_PREFS, []))
    })

    it('penalises spice for a child who dislikes spicy food', () => {
      const r = recipe({ coreFlavours: ['spicy'] })
      const noSpice: ChildPreferences = { ...NO_PREFS, disliked: ['spicy-food'] }
      expect(scoreRecipe(r, noSpice, [])).toBeLessThan(scoreRecipe(r, NO_PREFS, []))
    })
  })

  describe('bounds', () => {
    it('never returns above 100', () => {
      const r = recipe({
        mainProteins: ['chicken', 'egg', 'beef'],
        mainVeg: ['carrot', 'peas', 'corn'],
        cuisineId: 'italian',
      })
      const prefs: ChildPreferences = {
        liked: ['chicken', 'egg', 'beef', 'carrot', 'peas', 'corn'],
        disliked: [],
        cuisineHistory: { italian: 'accepted' },
      }
      expect(scoreRecipe(r, prefs, [])).toBeLessThanOrEqual(100)
    })

    it('never returns below 0', () => {
      const r = recipe({
        mainProteins: ['chicken', 'egg', 'beef'],
        mainVeg: ['carrot', 'peas', 'corn'],
        coreFlavours: ['spicy'],
        cuisineId: 'thai',
      })
      const prefs: ChildPreferences = {
        liked: [],
        disliked: ['chicken', 'egg', 'beef', 'carrot', 'peas', 'corn', 'spicy-food'],
        cuisineHistory: { thai: 'rejected' },
      }
      expect(scoreRecipe(r, prefs, [])).toBeGreaterThanOrEqual(0)
    })

    it('returns a whole number', () => {
      expect(Number.isInteger(scoreRecipe(recipe(), NO_PREFS, []))).toBe(true)
    })
  })
})

describe('rankRecipes', () => {
  it('orders by score, best first', () => {
    const liked = recipe({ recipeId: 'liked', mainProteins: ['chicken'] })
    const neutral = recipe({ recipeId: 'neutral' })
    const prefs: ChildPreferences = { ...NO_PREFS, liked: ['chicken'] }

    const ranked = rankRecipes([neutral, liked], prefs, [])
    expect(ranked[0].recipe.recipeId).toBe('liked')
  })

  it('excludes recipes containing a declared allergen entirely', () => {
    const unsafe = recipe({ recipeId: 'unsafe', allergens: ['nuts'] })
    const safe = recipe({ recipeId: 'safe' })

    const ranked = rankRecipes([unsafe, safe], NO_PREFS, ['nuts'])
    expect(ranked.map((r) => r.recipe.recipeId)).toEqual(['safe'])
  })

  it('returns an empty list when everything is unsafe', () => {
    const unsafe = recipe({ allergens: ['dairy'] })
    expect(rankRecipes([unsafe], NO_PREFS, ['dairy'])).toEqual([])
  })
})

describe('applyMealVerdict', () => {
  const recipe = (over: Partial<Recipe> = {}) => ({
    recipeId: 'r', title: 'R', cuisineId: 'thai',
    ageRange: { min: 2, max: 12 }, prepMinutes: 20, difficulty: 'easy', servings: 2,
    allergens: [], nutritionTags: [], ingredients: [], steps: [],
    coreFlavours: [], textures: [], mainProteins: ['chicken'], mainVeg: ['broccoli'],
    substitutions: {}, launchWave: 1, ...over,
  }) as Recipe

  describe('thumbs up', () => {
    it('adds the meal\u2019s ingredients to liked', () => {
      const next = applyMealVerdict(NO_PREFS, recipe(), true)
      expect(next.liked).toEqual(expect.arrayContaining(['chicken', 'broccoli']))
    })

    it('records the cuisine as accepted', () => {
      expect(applyMealVerdict(NO_PREFS, recipe(), true).cuisineHistory.thai).toBe('accepted')
    })

    it('overrides a previous dislike \u2014 eating it is strong evidence', () => {
      const prev: ChildPreferences = { ...NO_PREFS, disliked: ['broccoli'] }
      const next = applyMealVerdict(prev, recipe(), true)
      expect(next.liked).toContain('broccoli')
      expect(next.disliked).not.toContain('broccoli')
    })
  })

  describe('thumbs down', () => {
    it('records the cuisine as rejected', () => {
      expect(applyMealVerdict(NO_PREFS, recipe(), false).cuisineHistory.thai).toBe('rejected')
    })

    it('marks previously unknown ingredients as disliked', () => {
      const next = applyMealVerdict(NO_PREFS, recipe(), false)
      expect(next.disliked).toEqual(expect.arrayContaining(['chicken', 'broccoli']))
    })

    // One bad curry should not cost a chicken-loving child their chicken.
    it('does NOT demote an ingredient the child already likes', () => {
      const prev: ChildPreferences = { ...NO_PREFS, liked: ['chicken'] }
      const next = applyMealVerdict(prev, recipe(), false)
      expect(next.liked).toContain('chicken')
      expect(next.disliked).not.toContain('chicken')
      expect(next.disliked).toContain('broccoli')
    })
  })

  it('never records an ingredient twice', () => {
    const prev: ChildPreferences = { ...NO_PREFS, liked: ['chicken'] }
    const next = applyMealVerdict(prev, recipe(), true)
    expect(new Set(next.liked).size).toBe(next.liked.length)
  })

  it('does not mutate the input', () => {
    const prev: ChildPreferences = { liked: [], disliked: [], cuisineHistory: {} }
    applyMealVerdict(prev, recipe(), true)
    expect(prev.liked).toEqual([])
  })
})
