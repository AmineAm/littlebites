import { Timestamp } from 'firebase/firestore'

export interface DayPlan {
  breakfast: string | undefined
  lunch:     string | undefined
  dinner:    string | undefined
}

export interface WeekPlan {
  weekId:    string
  userId:    string
  childId:   string
  updatedAt: Timestamp
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
