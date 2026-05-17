import { useCharacterStore } from '@/store/character.store'
import { CHARACTER_PAIR_ORDER, UNLOCK_MILESTONES } from '@/constants/characters'
import { CharacterPairId } from '@/types/character'

export interface UnlockTarget {
  pairId:    CharacterPairId
  type:      'meals' | 'cuisines' | 'stamps'
  current:   number
  required:  number
}

export function useUnlock() {
  const { unlockedPairs, milestones } = useCharacterStore()

  function isUnlocked(pairId: string): boolean {
    return unlockedPairs.includes(pairId)
  }

  const milestoneProgress = {
    mealsCooked:   milestones.mealsCooked,
    cuisinesTried: milestones.cuisinesTried,
    stampsEarned:  milestones.passportStamps,
  }

  function getNextUnlockTarget(): UnlockTarget | null {
    // Pair 2 — marco-lily, mei-theo, nour-boo, elsa-kit-finn (index 1)
    const pair2 = CHARACTER_PAIR_ORDER[1]
    if (!isUnlocked(pair2)) {
      return {
        pairId:   pair2,
        type:     'meals',
        current:  milestones.mealsCooked,
        required: UNLOCK_MILESTONES.mealsForPair2,
      }
    }
    const pair3 = CHARACTER_PAIR_ORDER[2]
    if (!isUnlocked(pair3)) {
      return {
        pairId:   pair3,
        type:     'cuisines',
        current:  milestones.cuisinesTried,
        required: UNLOCK_MILESTONES.cuisinesForPair3,
      }
    }
    const pair4 = CHARACTER_PAIR_ORDER[3]
    if (!isUnlocked(pair4)) {
      return {
        pairId:   pair4,
        type:     'stamps',
        current:  milestones.passportStamps,
        required: UNLOCK_MILESTONES.stampsForPair4,
      }
    }
    return null
  }

  return {
    unlockedPairs,
    isUnlocked,
    milestoneProgress,
    nextUnlockTarget: getNextUnlockTarget(),
  }
}
