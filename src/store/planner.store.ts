import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { WeekPlan, DayKey, MealType } from '@/types/planner'

interface PlannerState {
  plans: Record<string, WeekPlan>
  /** Ticked shopping-list items, keyed by weekId → item key. */
  checked: Record<string, string[]>

  setMealSlot:   (weekId: string, day: DayKey, meal: MealType, recipeId: string) => void
  clearMealSlot: (weekId: string, day: DayKey, meal: MealType) => void
  toggleChecked: (weekId: string, itemKey: string) => void
  clearChecked:  (weekId: string) => void
  reset:         () => void
}

const EMPTY_DAY = { breakfast: undefined, lunch: undefined, dinner: undefined }

export function emptyWeekPlan(weekId: string): WeekPlan {
  return {
    weekId,
    updatedAt: Date.now(),
    days: {
      monday:    { ...EMPTY_DAY },
      tuesday:   { ...EMPTY_DAY },
      wednesday: { ...EMPTY_DAY },
      thursday:  { ...EMPTY_DAY },
      friday:    { ...EMPTY_DAY },
      saturday:  { ...EMPTY_DAY },
      sunday:    { ...EMPTY_DAY },
    },
  }
}

export const usePlannerStore = create<PlannerState>()(
  persist(
    (set) => ({
      plans:   {},
      checked: {},

      setMealSlot: (weekId, day, meal, recipeId) =>
        set((s) => {
          const plan = s.plans[weekId] ?? emptyWeekPlan(weekId)
          return {
            plans: {
              ...s.plans,
              [weekId]: {
                ...plan,
                updatedAt: Date.now(),
                days: { ...plan.days, [day]: { ...plan.days[day], [meal]: recipeId } },
              },
            },
          }
        }),

      clearMealSlot: (weekId, day, meal) =>
        set((s) => {
          const plan = s.plans[weekId]
          if (!plan) return s
          return {
            plans: {
              ...s.plans,
              [weekId]: {
                ...plan,
                updatedAt: Date.now(),
                days: { ...plan.days, [day]: { ...plan.days[day], [meal]: undefined } },
              },
            },
          }
        }),

      toggleChecked: (weekId, itemKey) =>
        set((s) => {
          const current = s.checked[weekId] ?? []
          const next = current.includes(itemKey)
            ? current.filter((k) => k !== itemKey)
            : [...current, itemKey]
          return { checked: { ...s.checked, [weekId]: next } }
        }),

      clearChecked: (weekId) =>
        set((s) => ({ checked: { ...s.checked, [weekId]: [] } })),

      reset: () => set({ plans: {}, checked: {} }),
    }),
    {
      name:    'littlebites-planner',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)
