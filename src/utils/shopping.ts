import { Recipe } from '@/types/recipe'
import { WeekPlan, DAY_ORDER, MEAL_ORDER } from '@/types/planner'

export type ShoppingCategoryName = 'Produce' | 'Protein' | 'Dairy' | 'Bakery' | 'Pantry'

/** Shop order, not alphabetical — this is the order you walk a supermarket. */
const CATEGORY_ORDER: ShoppingCategoryName[] = [
  'Produce', 'Protein', 'Dairy', 'Bakery', 'Pantry',
]

export interface ShoppingListItem {
  /** name + unit, lowercased — the deduplication key */
  key:          string
  name:         string
  amount:       number
  unit:         string
  /** Every planned recipe this item is needed for */
  recipeIds:    string[]
  isGlobal:     boolean
  substitution: string | undefined
  category:     ShoppingCategoryName
}

export interface ShoppingCategoryGroup {
  category: ShoppingCategoryName
  items:    ShoppingListItem[]
}

// ── Categorisation ────────────────────────────────────────────────────────────
// Whole-word matching, so "egg" does not claim "eggplant" and "pepper" does not
// claim "peppercorn". Anything unmatched falls back to Pantry.

const KEYWORDS: Array<[ShoppingCategoryName, string[]]> = [
  ['Produce', [
    'carrot', 'carrots', 'onion', 'onions', 'tomato', 'tomatoes', 'potato', 'potatoes',
    'spinach', 'broccoli', 'pepper', 'peppers', 'garlic', 'lemon', 'lemons', 'lime',
    'limes', 'apple', 'apples', 'banana', 'bananas', 'cucumber', 'courgette', 'zucchini',
    'lettuce', 'mushroom', 'mushrooms', 'avocado', 'corn', 'peas', 'ginger', 'chilli',
    'chili', 'eggplant', 'aubergine', 'parsley', 'coriander', 'cilantro', 'mint',
    'basil', 'celery', 'cabbage', 'cauliflower', 'leek', 'leeks', 'berries', 'grapes',
    'orange', 'oranges', 'mango', 'pear', 'pears', 'spring onion', 'sweet potato',
  ]],
  ['Protein', [
    'chicken', 'beef', 'lamb', 'pork', 'turkey', 'mince', 'sausage', 'sausages',
    'bacon', 'ham', 'fish', 'salmon', 'tuna', 'cod', 'prawn', 'prawns', 'shrimp',
    'egg', 'eggs', 'tofu', 'lentil', 'lentils', 'chickpea', 'chickpeas', 'bean',
    'beans', 'tempeh',
  ]],
  ['Dairy', [
    'milk', 'cheese', 'yoghurt', 'yogurt', 'butter', 'cream', 'feta', 'mozzarella',
    'parmesan', 'halloumi', 'ricotta', 'mascarpone',
  ]],
  ['Bakery', [
    'bread', 'pitta', 'pita', 'tortilla', 'tortillas', 'wrap', 'wraps', 'bun', 'buns',
    'roll', 'rolls', 'baguette', 'naan', 'brioche', 'bagel', 'croissant',
  ]],
]

export function categoriseIngredient(name: string): ShoppingCategoryName {
  const haystack = name.trim().toLowerCase()

  for (const [category, keywords] of KEYWORDS) {
    for (const keyword of keywords) {
      const pattern = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`)
      if (pattern.test(haystack)) return category
    }
  }
  return 'Pantry'
}

// ── Derivation ────────────────────────────────────────────────────────────────

/**
 * The shopping list for a week's plan.
 *
 * The same ingredient across several recipes is listed once with its quantities
 * summed — but only when the units match. A recipe calling for one onion and
 * another calling for 100g of onion stay separate lines, because silently adding
 * 1 to 100 would be worse than showing two lines.
 */
export function deriveShoppingList(plan: WeekPlan, recipes: Recipe[]): ShoppingCategoryGroup[] {
  const byId = new Map(recipes.map((r) => [r.recipeId, r]))
  const items = new Map<string, ShoppingListItem>()

  for (const day of DAY_ORDER) {
    const dayPlan = plan.days[day]
    if (!dayPlan) continue

    for (const meal of MEAL_ORDER) {
      const recipeId = dayPlan[meal]
      if (!recipeId) continue

      const recipe = byId.get(recipeId)
      if (!recipe) continue

      for (const ingredient of recipe.ingredients) {
        const key = `${ingredient.name.trim().toLowerCase()}|${ingredient.unit}`
        const existing = items.get(key)

        if (existing) {
          existing.amount += ingredient.amount
          if (!existing.recipeIds.includes(recipeId)) existing.recipeIds.push(recipeId)
          if (!existing.substitution && ingredient.substitution) {
            existing.substitution = ingredient.substitution
          }
          existing.isGlobal = existing.isGlobal || ingredient.isGlobal
          continue
        }

        items.set(key, {
          key,
          name:         ingredient.name.trim(),
          amount:       ingredient.amount,
          unit:         ingredient.unit,
          recipeIds:    [recipeId],
          isGlobal:     ingredient.isGlobal,
          substitution: ingredient.substitution,
          category:     categoriseIngredient(ingredient.name),
        })
      }
    }
  }

  const all = [...items.values()]

  return CATEGORY_ORDER
    .map((category) => ({ category, items: all.filter((i) => i.category === category) }))
    .filter((group) => group.items.length > 0)
}
