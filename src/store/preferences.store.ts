import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ChildPreferences } from '@/types/child'
import { Recipe } from '@/types/recipe'
import { applyMealVerdict } from '@/utils/preference'

interface PreferencesState extends ChildPreferences {
  /**
   * Records the one-tap verdict after cooking. This replaces the upfront taste
   * quiz — the child actually ate the meal, so it is a truer signal than a
   * hypothetical answer about a food they were only shown a picture of.
   */
  recordMealVerdict: (recipe: Recipe, liked: boolean) => void
  reset: () => void
}

const EMPTY: ChildPreferences = {
  liked:          [],
  disliked:       [],
  cuisineHistory: {},
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      ...EMPTY,

      // Delegates to the pure rule in utils so the asymmetry is testable.
      recordMealVerdict: (recipe, likedIt) =>
        set((s) => applyMealVerdict(
          { liked: s.liked, disliked: s.disliked, cuisineHistory: s.cuisineHistory },
          recipe,
          likedIt,
        )),

      reset: () => set({ ...EMPTY }),
    }),
    {
      name:    'littlebites-preferences',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)
