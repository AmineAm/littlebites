import { describe, it, expect } from 'vitest'
import { deriveShoppingList } from './shopping'
import { Recipe, Ingredient } from '@/types/recipe'
import { WeekPlan, DayPlan } from '@/types/planner'

// ── Fixtures ──────────────────────────────────────────────────────────────────

function ingredient(over: Partial<Ingredient> & { name: string }): Ingredient {
  return {
    amount: 100,
    unit: 'g',
    notes: undefined,
    isGlobal: false,
    substitution: undefined,
    ...over,
  }
}

function recipe(id: string, ingredients: Ingredient[]): Recipe {
  return {
    recipeId: id,
    title: id,
    cuisineId: 'italian',
    ageRange: { min: 2, max: 12 },
    prepMinutes: 20,
    difficulty: 'easy',
    servings: 2,
    allergens: [],
    nutritionTags: [],
    ingredients,
    steps: [],
    coreFlavours: [],
    textures: [],
    mainProteins: [],
    mainVeg: [],
    substitutions: {},
    launchWave: 1,
  } as Recipe
}

const EMPTY_DAY: DayPlan = { breakfast: undefined, lunch: undefined, dinner: undefined }

function plan(slots: Partial<Record<'monday' | 'tuesday', Partial<DayPlan>>> = {}): WeekPlan {
  return {
    weekId: '2026-W32',
    updatedAt: 0,
    days: {
      monday:    { ...EMPTY_DAY, ...slots.monday },
      tuesday:   { ...EMPTY_DAY, ...slots.tuesday },
      wednesday: EMPTY_DAY,
      thursday:  EMPTY_DAY,
      friday:    EMPTY_DAY,
      saturday:  EMPTY_DAY,
      sunday:    EMPTY_DAY,
    },
  }
}

function allItems(groups: ReturnType<typeof deriveShoppingList>) {
  return groups.flatMap((g) => g.items)
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('deriveShoppingList', () => {
  it('returns nothing for an empty plan', () => {
    expect(deriveShoppingList(plan(), [])).toEqual([])
  })

  it('returns nothing when the plan references a recipe that does not exist', () => {
    const p = plan({ monday: { dinner: 'missing-recipe' } })
    expect(deriveShoppingList(p, [])).toEqual([])
  })

  it('lists the ingredients of a single planned recipe', () => {
    const r = recipe('pasta', [ingredient({ name: 'Flour', amount: 200, unit: 'g' })])
    const p = plan({ monday: { dinner: 'pasta' } })

    const items = allItems(deriveShoppingList(p, [r]))
    expect(items).toHaveLength(1)
    expect(items[0]).toMatchObject({ name: 'Flour', amount: 200, unit: 'g' })
  })

  describe('deduplication', () => {
    it('sums quantities when the same ingredient appears in two recipes', () => {
      const a = recipe('a', [ingredient({ name: 'Flour', amount: 200, unit: 'g' })])
      const b = recipe('b', [ingredient({ name: 'Flour', amount: 150, unit: 'g' })])
      const p = plan({ monday: { dinner: 'a' }, tuesday: { dinner: 'b' } })

      const items = allItems(deriveShoppingList(p, [a, b]))
      expect(items).toHaveLength(1)
      expect(items[0].amount).toBe(350)
    })

    it('sums a recipe planned into two different slots', () => {
      const a = recipe('a', [ingredient({ name: 'Flour', amount: 100, unit: 'g' })])
      const p = plan({ monday: { lunch: 'a', dinner: 'a' } })

      const items = allItems(deriveShoppingList(p, [a]))
      expect(items[0].amount).toBe(200)
    })

    it('matches ingredient names case-insensitively', () => {
      const a = recipe('a', [ingredient({ name: 'Flour', amount: 100, unit: 'g' })])
      const b = recipe('b', [ingredient({ name: 'flour', amount: 100, unit: 'g' })])
      const p = plan({ monday: { dinner: 'a' }, tuesday: { dinner: 'b' } })

      expect(allItems(deriveShoppingList(p, [a, b]))).toHaveLength(1)
    })

    it('does NOT combine the same ingredient measured in different units', () => {
      const a = recipe('a', [ingredient({ name: 'Onion', amount: 1, unit: 'piece' })])
      const b = recipe('b', [ingredient({ name: 'Onion', amount: 100, unit: 'g' })])
      const p = plan({ monday: { dinner: 'a' }, tuesday: { dinner: 'b' } })

      const items = allItems(deriveShoppingList(p, [a, b]))
      expect(items).toHaveLength(2)
    })

    it('records every recipe an ingredient came from', () => {
      const a = recipe('a', [ingredient({ name: 'Flour' })])
      const b = recipe('b', [ingredient({ name: 'Flour' })])
      const p = plan({ monday: { dinner: 'a' }, tuesday: { dinner: 'b' } })

      const items = allItems(deriveShoppingList(p, [a, b]))
      expect(items[0].recipeIds).toEqual(['a', 'b'])
    })
  })

  describe('category grouping', () => {
    it('groups produce, protein and pantry separately', () => {
      const r = recipe('r', [
        ingredient({ name: 'Carrot' }),
        ingredient({ name: 'Chicken breast' }),
        ingredient({ name: 'Olive oil' }),
      ])
      const groups = deriveShoppingList(plan({ monday: { dinner: 'r' } }), [r])

      const byCategory = Object.fromEntries(groups.map((g) => [g.category, g.items.length]))
      expect(byCategory['Produce']).toBe(1)
      expect(byCategory['Protein']).toBe(1)
      expect(byCategory['Pantry']).toBe(1)
    })

    it('falls back to Pantry for unrecognised ingredients', () => {
      const r = recipe('r', [ingredient({ name: 'Za\'atar' })])
      const groups = deriveShoppingList(plan({ monday: { dinner: 'r' } }), [r])

      expect(groups).toHaveLength(1)
      expect(groups[0].category).toBe('Pantry')
    })

    it('omits categories that have no items', () => {
      const r = recipe('r', [ingredient({ name: 'Carrot' })])
      const groups = deriveShoppingList(plan({ monday: { dinner: 'r' } }), [r])

      expect(groups).toHaveLength(1)
      expect(groups[0].category).toBe('Produce')
    })
  })

  describe('substitutions', () => {
    it('carries the substitution note through for hard-to-source ingredients', () => {
      const r = recipe('r', [
        ingredient({ name: 'Soy sauce', isGlobal: true, substitution: 'coconut aminos' }),
      ])
      const items = allItems(deriveShoppingList(plan({ monday: { dinner: 'r' } }), [r]))

      expect(items[0].isGlobal).toBe(true)
      expect(items[0].substitution).toBe('coconut aminos')
    })
  })
})
