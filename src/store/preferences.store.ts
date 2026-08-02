import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ChildPreferences } from '@/types/child'
import { Recipe } from '@/types/recipe'

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

function move(from: string[], to: string[], ids: string[]) {
  return {
    from: from.filter((id) => !ids.includes(id)),
    to:   [...new Set([...to, ...ids])],
  }
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      ...EMPTY,

      recordMealVerdict: (recipe, likedIt) =>
        set((s) => {
          // The signal attaches to what the meal was actually made of.
          const ids = [...recipe.mainProteins, ...recipe.mainVeg]

          const shifted = likedIt
            ? move(s.disliked, s.liked, ids)
            : move(s.liked, s.disliked, ids)

          return {
            liked:    likedIt ? shifted.to : shifted.from,
            disliked: likedIt ? shifted.from : shifted.to,
            cuisineHistory: {
              ...s.cuisineHistory,
              [recipe.cuisineId]: likedIt ? 'accepted' : 'rejected',
            },
          }
        }),

      reset: () => set({ ...EMPTY }),
    }),
    {
      name:    'littlebites-preferences',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)
