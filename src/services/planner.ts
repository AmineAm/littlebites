import {
  doc, getDoc, setDoc, updateDoc, serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import { WeekPlan, DayKey, MealType } from '@/types/planner'

export async function getWeekPlan(userId: string, weekId: string): Promise<WeekPlan | null> {
  const ref = doc(db, 'users', userId, 'mealPlans', weekId)
  const snap = await getDoc(ref)
  return snap.exists() ? (snap.data() as WeekPlan) : null
}

export async function saveWeekPlan(userId: string, plan: WeekPlan): Promise<void> {
  const ref = doc(db, 'users', userId, 'mealPlans', plan.weekId)
  await setDoc(ref, { ...plan, updatedAt: serverTimestamp() })
}

export async function updateMealSlot(
  userId: string,
  weekId: string,
  day: DayKey,
  meal: MealType,
  recipeId: string | undefined,
): Promise<void> {
  const ref = doc(db, 'users', userId, 'mealPlans', weekId)
  await updateDoc(ref, {
    [`days.${day}.${meal}`]: recipeId ?? null,
    updatedAt: serverTimestamp(),
  })
}
