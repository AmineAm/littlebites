export type Allergy =
  | 'nuts' | 'dairy' | 'gluten' | 'eggs'
  | 'soy' | 'shellfish' | 'fish' | 'sesame'

/** Maps exactly onto the three culture-card fact tiers. */
export type AgeBand = '2-4' | '5-8' | '9-12'

/** One child. Not an array — see CLAUDE.md § Data model. */
export interface ChildProfile {
  name:               string | undefined
  ageBand:            AgeBand
  allergies:          Allergy[]
  /** Distinguishes "no allergies" from "not yet answered". */
  allergiesConfirmed: boolean
}

export interface ChildPreferences {
  liked:          string[]
  disliked:       string[]
  cuisineHistory: Record<string, 'accepted' | 'rejected'>
}

/** Recipe age-range filtering keys off the band, not an exact age. */
export const AGE_BAND_RANGE: Record<AgeBand, { min: number; max: number }> = {
  '2-4':  { min: 2, max: 4 },
  '5-8':  { min: 5, max: 8 },
  '9-12': { min: 9, max: 12 },
}

export const AGE_BAND_FACT_KEY: Record<AgeBand, 'age2to4' | 'age5to8' | 'age9to12'> = {
  '2-4':  'age2to4',
  '5-8':  'age5to8',
  '9-12': 'age9to12',
}
