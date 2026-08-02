import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ChildProfile, AgeBand, Allergy } from '@/types/child'
import { CuisineId } from '@/types/character'

export type AdventureLevel = 'cautious' | 'curious' | 'adventurous'

export interface Settings {
  adventureLevel: AdventureLevel
  homeCuisine:    CuisineId | undefined
}

interface ProfileState {
  child:              ChildProfile | null
  settings:           Settings
  onboardingComplete: boolean

  setChild:           (child: ChildProfile) => void
  updateChild:        (patch: Partial<ChildProfile>) => void
  setAgeBand:         (ageBand: AgeBand) => void
  setAllergies:       (allergies: Allergy[]) => void
  updateSettings:     (patch: Partial<Settings>) => void
  completeOnboarding: () => void
  reset:              () => void
}

const DEFAULT_SETTINGS: Settings = {
  adventureLevel: 'curious',
  homeCuisine:    undefined,
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      child:              null,
      settings:           DEFAULT_SETTINGS,
      onboardingComplete: false,

      setChild: (child) => set({ child }),

      updateChild: (patch) =>
        set((s) => (s.child ? { child: { ...s.child, ...patch } } : s)),

      setAgeBand: (ageBand) =>
        set((s) => (s.child ? { child: { ...s.child, ageBand } } : s)),

      setAllergies: (allergies) =>
        set((s) =>
          s.child ? { child: { ...s.child, allergies, allergiesConfirmed: true } } : s,
        ),

      updateSettings: (patch) =>
        set((s) => ({ settings: { ...s.settings, ...patch } })),

      completeOnboarding: () => set({ onboardingComplete: true }),

      reset: () =>
        set({ child: null, settings: DEFAULT_SETTINGS, onboardingComplete: false }),
    }),
    {
      name:    'littlebites-profile',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)
