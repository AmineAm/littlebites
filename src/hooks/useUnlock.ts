import { useCharacterStore, progressFrom } from '@/store/character.store'
import { evaluateMilestones, nextUnlockTarget } from '@/utils/milestones'

/**
 * Thin wrapper over the pure milestone evaluator. All the logic lives in
 * src/utils/milestones.ts so it can be tested without a renderer.
 */
export function useUnlock() {
  const passport    = useCharacterStore((s) => s.passport)
  const starterPair = useCharacterStore((s) => s.starterPair)

  const progress      = progressFrom(passport)
  const unlockedPairs = evaluateMilestones(progress, starterPair)

  return {
    unlockedPairs,
    isUnlocked: (pairId: string) => unlockedPairs.includes(pairId as never),
    milestoneProgress: progress,
    nextUnlockTarget: nextUnlockTarget(progress, starterPair),
  }
}
