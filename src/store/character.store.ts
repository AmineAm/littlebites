import { create } from 'zustand'
import { CharacterPairId } from '@/types/character'

interface CharacterState {
  activePairId:  CharacterPairId
  unlockedPairs: string[]
  starterPair:   string
  milestones: {
    mealsCooked:    number
    cuisinesTried:  number
    passportStamps: number
  }

  setActivePairId:   (pairId: CharacterPairId) => void
  setUnlockedPairs:  (pairs: string[]) => void
  setMilestones:     (milestones: CharacterState['milestones']) => void
  unlockPair:        (pairId: string) => void
}

export const useCharacterStore = create<CharacterState>((set) => ({
  activePairId:  'marco-lily',
  unlockedPairs: ['marco-lily'],
  starterPair:   'marco-lily',
  milestones: {
    mealsCooked:    0,
    cuisinesTried:  0,
    passportStamps: 0,
  },

  setActivePairId: (pairId) => set({ activePairId: pairId }),

  setUnlockedPairs: (pairs) => set({ unlockedPairs: pairs }),

  setMilestones: (milestones) => set({ milestones }),

  unlockPair: (pairId) =>
    set((state) => ({
      unlockedPairs: state.unlockedPairs.includes(pairId)
        ? state.unlockedPairs
        : [...state.unlockedPairs, pairId],
    })),
}))
