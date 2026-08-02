export interface DayPlan {
  breakfast: string | undefined
  lunch:     string | undefined
  dinner:    string | undefined
}

export interface WeekPlan {
  weekId:    string   // 'YYYY-WNN'
  updatedAt: number   // epoch ms
  days: {
    monday:    DayPlan
    tuesday:   DayPlan
    wednesday: DayPlan
    thursday:  DayPlan
    friday:    DayPlan
    saturday:  DayPlan
    sunday:    DayPlan
  }
}

export type MealType = 'breakfast' | 'lunch' | 'dinner'
export type DayKey = keyof WeekPlan['days']

export const DAY_ORDER: DayKey[] = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
]

export const MEAL_ORDER: MealType[] = ['breakfast', 'lunch', 'dinner']
