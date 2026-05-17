import { usePlannerStore } from '@/store/planner.store'
import { getWeekId } from '@/utils/date'
import { DayKey, MealType } from '@/types/planner'

export function useMealPlan() {
  const { plans, setMealSlot, clearMealSlot } = usePlannerStore()

  const currentWeekId = getWeekId(new Date())
  const currentPlan = plans[currentWeekId]

  const activeAdventureCuisine: string | undefined = undefined // resolved from plan + recipe data

  function getMealSlot(day: DayKey, meal: MealType): string | undefined {
    return currentPlan?.days[day]?.[meal]
  }

  return {
    currentPlan,
    currentWeekId,
    activeAdventureCuisine,
    getMealSlot,
    setMealSlot: (day: DayKey, meal: MealType, recipeId: string) =>
      setMealSlot(currentWeekId, day, meal, recipeId),
    clearMealSlot: (day: DayKey, meal: MealType) =>
      clearMealSlot(currentWeekId, day, meal),
  }
}
