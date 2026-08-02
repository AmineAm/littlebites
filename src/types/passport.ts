export interface Passport {
  updatedAt:              number   // epoch ms
  /** cuisineId → number of recipes cooked from it */
  stamps:                 Record<string, number>
  badges:                 BadgeId[]
  totalMealsCooked:       number
  distinctCuisinesCooked: number
}

export type BadgeId = 'first-bite' | 'explorer' | 'little-chef'

export interface Stamp {
  cuisineId: string
  earned:    boolean
  count:     number
}
