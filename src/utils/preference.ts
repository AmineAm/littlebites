import { Recipe } from '@/types/recipe'
import { ChildPreferences, Allergy } from '@/types/child'

// Returns a 0–100 match score for a recipe against a child's preferences.
// Higher = better match. Used for recipe suggestions and "% match" display.
export function scoreRecipe(recipe: Recipe, prefs: ChildPreferences, allergies: Allergy[]): number {
  // Hard block — allergen present
  if (recipe.allergens.some((a) => allergies.includes(a))) return 0

  let score = 50 // neutral baseline

  // Preferred proteins
  for (const protein of recipe.mainProteins) {
    if (prefs.liked.includes(protein))    score += 10
    if (prefs.disliked.includes(protein)) score -= 20
  }

  // Preferred veg
  for (const veg of recipe.mainVeg) {
    if (prefs.liked.includes(veg))    score += 8
    if (prefs.disliked.includes(veg)) score -= 15
  }

  // Cuisine history
  const cuisineResult = prefs.cuisineHistory[recipe.cuisineId]
  if (cuisineResult === 'accepted') score += 15
  if (cuisineResult === 'rejected') score -= 25

  // Spicy food preference
  if (recipe.coreFlavours.includes('spicy')) {
    if (prefs.disliked.includes('spicy-food')) score -= 30
  }

  return Math.max(0, Math.min(100, Math.round(score)))
}

// Sorts recipes by match score descending, filtering allergens.
export function rankRecipes(
  recipes: Recipe[],
  prefs: ChildPreferences,
  allergies: Allergy[],
): Array<{ recipe: Recipe; score: number }> {
  return recipes
    .map((recipe) => ({ recipe, score: scoreRecipe(recipe, prefs, allergies) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
}

/**
 * Applies the one-tap verdict recorded at the end of guided prep.
 *
 * The rule is deliberately asymmetric. A child eating something is strong
 * evidence about that ingredient, so a thumbs-up overrides a previous dislike.
 * A child refusing a composite dish is weak evidence about any single
 * ingredient in it — so a thumbs-down never demotes something already liked.
 * Without that asymmetry, one bad chicken curry costs a chicken-loving child
 * their chicken, and every future chicken recipe is penalised.
 *
 * Cuisine history is recorded in both directions: refusing the dish IS direct
 * evidence about the dish.
 */
export function applyMealVerdict(
  prefs: ChildPreferences,
  recipe: Recipe,
  likedIt: boolean,
): ChildPreferences {
  const ingredients = [...recipe.mainProteins, ...recipe.mainVeg]

  const liked = likedIt
    ? [...new Set([...prefs.liked, ...ingredients])]
    : prefs.liked

  const disliked = likedIt
    ? prefs.disliked.filter((id) => !ingredients.includes(id))
    : [...new Set([
        ...prefs.disliked,
        ...ingredients.filter((id) => !prefs.liked.includes(id)),
      ])]

  return {
    liked,
    disliked,
    cuisineHistory: {
      ...prefs.cuisineHistory,
      [recipe.cuisineId]: likedIt ? 'accepted' : 'rejected',
    },
  }
}
