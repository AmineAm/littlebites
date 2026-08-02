import { Timestamp } from 'firebase/firestore'
import { Allergy } from './child'

export type NutritionTag = 'protein' | 'veg' | 'carbs' | 'dairy' | 'fruit'
export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Ingredient {
  name:         string
  amount:       number
  unit:         'g' | 'ml' | 'tbsp' | 'tsp' | 'cup' | 'piece' | 'bunch'
  notes:        string | undefined
  isGlobal:     boolean
  substitution: string | undefined
}

export interface RecipeStep {
  stepNumber:       number
  instruction:      string
  timerSeconds:     number | undefined
  kidParticipation: string | undefined
}

export interface CultureCard {
  countryName: string
  flagEmoji:   string
  facts: {
    age2to4:  string
    age5to8:  string
    age9to12: string
  }
}

export interface Recipe {
  recipeId:      string
  title:         string
  titleAdapted?: string
  cuisineId:     string
  source?:        'original' | 'adapted'
  ageRange:      { min: number; max: number }
  prepMinutes:   number
  difficulty:    Difficulty
  servings:      number
  allergens:     Allergy[]
  nutritionTags: NutritionTag[]
  ingredients:   Ingredient[]
  steps:         RecipeStep[]
  cultureCard?:  CultureCard
  coreFlavours:  string[]
  textures:      string[]
  mainProteins:  string[]
  mainVeg:       string[]
  substitutions: Record<string, string>
  kidAdaptation?: {
    remove?:       string
    substitute?:   string
    presentation?: string
    ageNotes?:     string
  }
  imageFilename?: string
  launchWave:    1 | 2 | 3
  createdAt:     Timestamp
  updatedAt:     Timestamp
}
