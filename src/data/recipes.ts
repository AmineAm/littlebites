// Typed access to the bundled recipe content.
//
// Synchronous by design — there is no network and no database, so nothing here
// returns a promise and no screen needs a loading state. Regenerate the JSON
// with: npx tsx scripts/import-recipes.ts

import data from './recipes.json'
import { Recipe } from '@/types/recipe'
import { Allergy, AgeBand, AGE_BAND_RANGE } from '@/types/child'

export const RECIPES = data.recipes as unknown as Recipe[]

const BY_ID = new Map(RECIPES.map((r) => [r.recipeId, r]))

export function getRecipe(recipeId: string): Recipe | null {
  return BY_ID.get(recipeId) ?? null
}

export function getRecipes(): Recipe[] {
  return RECIPES
}

export function getRecipesByCuisine(cuisineId: string): Recipe[] {
  return RECIPES.filter((r) => r.cuisineId === cuisineId)
}

export interface RecipeFilter {
  cuisineId?: string
  ageBand?:   AgeBand
  allergies?: Allergy[]
  limit?:     number
}

/**
 * Allergen exclusion is a hard filter, not a weighting — a recipe containing a
 * declared allergen is never returned, whatever else matches.
 */
export function filterRecipes({ cuisineId, ageBand, allergies, limit }: RecipeFilter): Recipe[] {
  let result = RECIPES

  if (allergies?.length) {
    result = result.filter((r) => !r.allergens.some((a) => allergies.includes(a)))
  }
  if (cuisineId) {
    result = result.filter((r) => r.cuisineId === cuisineId)
  }
  if (ageBand) {
    const band = AGE_BAND_RANGE[ageBand]
    result = result.filter((r) => r.ageRange.min <= band.max && r.ageRange.max >= band.min)
  }

  return limit ? result.slice(0, limit) : result
}
