import { doc, onSnapshot, Unsubscribe } from 'firebase/firestore'
import { httpsCallable } from 'firebase/functions'
import { db, functions } from './firebase'
import { Unlocks } from '@/types/passport'

export function subscribeToUnlocks(
  userId: string,
  callback: (unlocks: Unlocks) => void,
): Unsubscribe {
  const ref = doc(db, 'users', userId, 'unlocks', userId)
  return onSnapshot(ref, (snap) => {
    if (snap.exists()) callback(snap.data() as Unlocks)
  })
}

// Called after a recipe's final step is confirmed complete.
// Cloud Function handles milestone evaluation and Firestore writes.
export async function recordMealComplete(opts: {
  userId:    string
  childId:   string
  recipeId:  string
  cuisineId: string
}): Promise<void> {
  const fn = httpsCallable(functions, 'onMealComplete')
  await fn(opts)
}
