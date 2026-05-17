import { create } from 'zustand'
import { WeekPlan, DayKey, MealType } from '@/types/planner'

interface PlannerState {
  plans:         Record<string, WeekPlan>
  isLoading:     boolean

  setPlan:       (weekId: string, plan: WeekPlan) => void
  setMealSlot:   (weekId: string, day: DayKey, meal: MealType, recipeId: string) => void
  clearMealSlot: (weekId: string, day: DayKey, meal: MealType) => void
  setLoading:    (loading: boolean) => void
}

const EMPTY_DAY = { breakfast: undefined, lunch: undefined, dinner: undefined }

function emptyWeekPlan(weekId: string, userId: string, childId: string): WeekPlan {
  return {
    weekId,
    userId,
    childId,
    updatedAt: null as unknown as WeekPlan['updatedAt'],
    days: {
      monday: EMPTY_DAY,
      tuesday: EMPTY_DAY,
      wednesday: EMPTY_DAY,
      thursday: EMPTY_DAY,
      friday: EMPTY_DAY,
      saturday: EMPTY_DAY,
      sunday: EMPTY_DAY,
    },
  }
}

export const usePlannerStore = create<PlannerState>((set) => ({
  plans:     {},
  isLoading: false,

  setPlan: (weekId, plan) =>
    set((state) => ({ plans: { ...state.plans, [weekId]: plan } })),

  setMealSlot: (weekId, day, meal, recipeId) =>
    set((state) => {
      const existing = state.plans[weekId] ?? emptyWeekPlan(weekId, '', '')
      return {
        plans: {
          ...state.plans,
          [weekId]: {
            ...existing,
            days: {
              ...existing.days,
              [day]: { ...existing.days[day], [meal]: recipeId },
            },
          },
        },
      }
    }),

  clearMealSlot: (weekId, day, meal) =>
    set((state) => {
      const existing = state.plans[weekId]
      if (!existing) return state
      return {
        plans: {
          ...state.plans,
          [weekId]: {
            ...existing,
            days: {
              ...existing.days,
              [day]: { ...existing.days[day], [meal]: undefined },
            },
          },
        },
      }
    }),

  setLoading: (isLoading) => set({ isLoading }),
}))
