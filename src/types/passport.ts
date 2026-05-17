import { Timestamp } from 'firebase/firestore'

export interface Passport {
  userId:                 string
  updatedAt:              Timestamp
  stamps:                 Record<string, number>
  badges:                 string[]
  totalMealsCooked:       number
  distinctCuisinesCooked: number
}

export interface Unlocks {
  userId:        string
  updatedAt:     Timestamp
  unlockedPairs: string[]
  starterPair:   string
  milestones: {
    mealsCooked:    number
    cuisinesTried:  number
    passportStamps: number
  }
}

export type BadgeId = 'first-bite' | 'explorer' | 'little-chef'

export interface Stamp {
  cuisineId: string
  earned:    boolean
  count:     number
}
