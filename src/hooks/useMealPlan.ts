import { usePlannerStore, emptyWeekPlan } from '@/store/planner.store'
import { getWeekId } from '@/utils/date'
import { DayKey, MealType, DAY_ORDER, MEAL_ORDER } from '@/types/planner'
import { getRecipe } from '@/data/recipes'

export function useMealPlan(weekId: string = getWeekId(new Date())) {
  const plans         = usePlannerStore((s) => s.plans)
  const setMealSlot   = usePlannerStore((s) => s.setMealSlot)
  const clearMealSlot = usePlannerStore((s) => s.clearMealSlot)

  const plan = plans[weekId] ?? emptyWeekPlan(weekId)

  const plannedRecipeIds = DAY_ORDER.flatMap((day) =>
    MEAL_ORDER.map((meal) => plan.days[day][meal]).filter(Boolean) as string[],
  )

  const plannedRecipes = plannedRecipeIds
    .map(getRecipe)
    .filter((r): r is NonNullable<typeof r> => r !== null)

  /** The cuisine of this week's adventure meal, if one is planned. */
  const activeAdventureCuisine = plannedRecipes[0]?.cuisineId

  return {
    weekId,
    plan,
    plannedRecipeIds,
    plannedRecipes,
    mealsPlanned: plannedRecipeIds.length,
    activeAdventureCuisine,
    getMealSlot: (day: DayKey, meal: MealType) => plan.days[day][meal],
    setMealSlot: (day: DayKey, meal: MealType, recipeId: string) =>
      setMealSlot(weekId, day, meal, recipeId),
    clearMealSlot: (day: DayKey, meal: MealType) => clearMealSlot(weekId, day, meal),
  }
}
