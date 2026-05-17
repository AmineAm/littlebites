import { create } from 'zustand'
import { ChildPreferences } from '@/types/child'

interface PreferencesState {
  preferences: Record<string, ChildPreferences>
  setPreferences: (childId: string, prefs: ChildPreferences) => void
  updateLiked:    (childId: string, foodId: string) => void
  updateDisliked: (childId: string, foodId: string) => void
  clearFood:      (childId: string, foodId: string) => void
}

export const usePreferencesStore = create<PreferencesState>((set) => ({
  preferences: {},

  setPreferences: (childId, prefs) =>
    set((state) => ({
      preferences: { ...state.preferences, [childId]: prefs },
    })),

  updateLiked: (childId, foodId) =>
    set((state) => {
      const prefs = state.preferences[childId]
      if (!prefs) return state
      return {
        preferences: {
          ...state.preferences,
          [childId]: {
            ...prefs,
            liked:    [...prefs.liked.filter((f) => f !== foodId), foodId],
            disliked: prefs.disliked.filter((f) => f !== foodId),
          },
        },
      }
    }),

  updateDisliked: (childId, foodId) =>
    set((state) => {
      const prefs = state.preferences[childId]
      if (!prefs) return state
      return {
        preferences: {
          ...state.preferences,
          [childId]: {
            ...prefs,
            disliked: [...prefs.disliked.filter((f) => f !== foodId), foodId],
            liked:    prefs.liked.filter((f) => f !== foodId),
          },
        },
      }
    }),

  clearFood: (childId, foodId) =>
    set((state) => {
      const prefs = state.preferences[childId]
      if (!prefs) return state
      return {
        preferences: {
          ...state.preferences,
          [childId]: {
            ...prefs,
            liked:    prefs.liked.filter((f) => f !== foodId),
            disliked: prefs.disliked.filter((f) => f !== foodId),
          },
        },
      }
    }),
}))
