import { Timestamp } from 'firebase/firestore'

export type Allergy =
  | 'nuts' | 'dairy' | 'gluten' | 'eggs'
  | 'soy' | 'shellfish' | 'fish' | 'sesame'

export interface ChildProfile {
  childId:   string
  name:      string
  age:       number
  allergies: Allergy[]
  createdAt: Timestamp
}

export interface ChildPreferences {
  childId:        string
  updatedAt:      Timestamp
  liked:          string[]
  disliked:       string[]
  cuisineHistory: Record<string, 'accepted' | 'rejected'>
  recipeScores:   Record<string, number>
}
