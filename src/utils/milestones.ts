import { CharacterPairId } from '@/types/character'
import { CHARACTER_PAIR_ORDER, UNLOCK_MILESTONES } from '@/constants/characters'

export interface MilestoneProgress {
  mealsCooked:  number
  cuisinesTried: number
  stampsEarned: number
}

/**
 * Which character pairs are unlocked, given progress and the starter pair.
 *
 * Evaluated client-side — there is no server to validate against, and nothing
 * is being protected (no leaderboard, nothing purchasable). See CLAUDE.md.
 *
 * The three thresholds are independent, not sequential: three distinct cuisines
 * is reachable in three meals, which is fewer than the five the meals gate needs,
 * so the second earnable pair can unlock before the first.
 */
export function evaluateMilestones(
  progress: MilestoneProgress,
  starterPair: CharacterPairId,
): CharacterPairId[] {
  const earnable = CHARACTER_PAIR_ORDER.filter((id) => id !== starterPair)
  const unlocked: CharacterPairId[] = [starterPair]

  if (progress.mealsCooked   >= UNLOCK_MILESTONES.mealsForPair2    && earnable[0]) {
    unlocked.push(earnable[0])
  }
  if (progress.cuisinesTried >= UNLOCK_MILESTONES.cuisinesForPair3 && earnable[1]) {
    unlocked.push(earnable[1])
  }
  if (progress.stampsEarned  >= UNLOCK_MILESTONES.stampsForPair4   && earnable[2]) {
    unlocked.push(earnable[2])
  }

  return unlocked
}

/** The next pair to work towards, or null when everything is unlocked. */
export function nextUnlockTarget(
  progress: MilestoneProgress,
  starterPair: CharacterPairId,
): { pairId: CharacterPairId; type: 'meals' | 'cuisines' | 'stamps'; current: number; required: number } | null {
  const earnable = CHARACTER_PAIR_ORDER.filter((id) => id !== starterPair)

  if (earnable[0] && progress.mealsCooked < UNLOCK_MILESTONES.mealsForPair2) {
    return {
      pairId: earnable[0], type: 'meals',
      current: progress.mealsCooked, required: UNLOCK_MILESTONES.mealsForPair2,
    }
  }
  if (earnable[1] && progress.cuisinesTried < UNLOCK_MILESTONES.cuisinesForPair3) {
    return {
      pairId: earnable[1], type: 'cuisines',
      current: progress.cuisinesTried, required: UNLOCK_MILESTONES.cuisinesForPair3,
    }
  }
  if (earnable[2] && progress.stampsEarned < UNLOCK_MILESTONES.stampsForPair4) {
    return {
      pairId: earnable[2], type: 'stamps',
      current: progress.stampsEarned, required: UNLOCK_MILESTONES.stampsForPair4,
    }
  }
  return null
}
