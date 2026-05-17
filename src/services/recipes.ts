import {
  collection, doc, getDoc, getDocs, query, where, orderBy, limit,
} from 'firebase/firestore'
import { db } from './firebase'
import { Recipe } from '@/types/recipe'
import { Allergy } from '@/types/child'

export async function getRecipe(recipeId: string): Promise<Recipe | null> {
  const snap = await getDoc(doc(db, 'recipes', recipeId))
  return snap.exists() ? (snap.data() as Recipe) : null
}

export async function getRecipesByCuisine(
  cuisineId: string,
  launchWave: 1 | 2 | 3 = 1,
): Promise<Recipe[]> {
  const q = query(
    collection(db, 'recipes'),
    where('cuisineId', '==', cuisineId),
    where('launchWave', '<=', launchWave),
    orderBy('launchWave'),
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => d.data() as Recipe)
}

export async function getRecipesFiltered(opts: {
  cuisineId?:  string
  maxAllergens?: Allergy[]
  maxAge?:     number
  count?:      number
}): Promise<Recipe[]> {
  const constraints: Parameters<typeof query>[1][] = [
    orderBy('launchWave'),
  ]
  if (opts.cuisineId) {
    constraints.push(where('cuisineId', '==', opts.cuisineId))
  }
  if (opts.count) {
    constraints.push(limit(opts.count))
  }
  const q = query(collection(db, 'recipes'), ...constraints)
  const snap = await getDocs(q)
  const recipes = snap.docs.map((d) => d.data() as Recipe)

  if (opts.maxAllergens?.length) {
    return recipes.filter(
      (r) => !r.allergens.some((a) => opts.maxAllergens!.includes(a)),
    )
  }
  return recipes
}
