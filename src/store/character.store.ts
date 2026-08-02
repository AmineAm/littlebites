import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { CharacterPairId } from '@/types/character'
import { Passport, BadgeId } from '@/types/passport'
import { evaluateMilestones, MilestoneProgress } from '@/utils/milestones'

/**
 * Characters and progress live together because unlocks are derived from the
 * passport counters — keeping them in one store means there is a single source
 * of truth rather than two that can disagree.
 */
interface CharacterState {
  activePairId: CharacterPairId
  starterPair:  CharacterPairId
  passport:     Passport

  setActivePairId: (pairId: CharacterPairId) => void
  setStarterPair:  (pairId: CharacterPairId) => void
  /** Records a completed meal. This is what the Cloud Function used to do. */
  recordMealCooked: (cuisineId: string) => void
  reset: () => void
}

const EMPTY_PASSPORT: Passport = {
  updatedAt:              0,
  stamps:                 {},
  badges:                 [],
  totalMealsCooked:       0,
  distinctCuisinesCooked: 0,
}

export const useCharacterStore = create<CharacterState>()(
  persist(
    (set) => ({
      activePairId: 'marco-lily',
      starterPair:  'marco-lily',
      passport:     EMPTY_PASSPORT,

      setActivePairId: (pairId) => set({ activePairId: pairId }),

      setStarterPair: (pairId) =>
        set({ starterPair: pairId, activePairId: pairId }),

      recordMealCooked: (cuisineId) =>
        set((s) => {
          const stamps = { ...s.passport.stamps }
          stamps[cuisineId] = (stamps[cuisineId] ?? 0) + 1

          const distinct = Object.keys(stamps).length
          const total    = s.passport.totalMealsCooked + 1

          const badges = new Set<BadgeId>(s.passport.badges)
          if (total >= 1)     badges.add('first-bite')
          if (distinct >= 3)  badges.add('explorer')
          if (total >= 10)    badges.add('little-chef')

          return {
            passport: {
              updatedAt:              Date.now(),
              stamps,
              badges:                 [...badges],
              totalMealsCooked:       total,
              distinctCuisinesCooked: distinct,
            },
          }
        }),

      reset: () =>
        set({
          activePairId: 'marco-lily',
          starterPair:  'marco-lily',
          passport:     EMPTY_PASSPORT,
        }),
    }),
    {
      name:    'littlebites-character',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)

/** Progress in the shape the milestone evaluator expects. */
export function progressFrom(passport: Passport): MilestoneProgress {
  return {
    mealsCooked:   passport.totalMealsCooked,
    cuisinesTried: passport.distinctCuisinesCooked,
    stampsEarned:  Object.keys(passport.stamps).length,
  }
}

/** Unlocked pairs are derived, never stored — see evaluateMilestones. */
export function selectUnlockedPairs(state: CharacterState): CharacterPairId[] {
  return evaluateMilestones(progressFrom(state.passport), state.starterPair)
}
