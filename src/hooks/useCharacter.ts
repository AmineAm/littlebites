import { ImageSourcePropType } from 'react-native'
import { useCharacterStore } from '@/store/character.store'
import { CHARACTER_PAIRS } from '@/constants/characters'
import { CharacterPair, CharacterPairId } from '@/types/character'

/**
 * One look per pair — there are no per-cuisine outfits. Metro cannot resolve
 * dynamic require(), so every asset is statically referenced here.
 *
 * Entries are added as illustration lands; a missing entry renders a
 * placeholder rather than crashing.
 */
export interface CharacterAssets {
  hero:       ImageSourcePropType
  face:       ImageSourcePropType
  silhouette: ImageSourcePropType
}

export const CHARACTER_ASSETS: Partial<Record<CharacterPairId, CharacterAssets>> = {
  // 'marco-lily': {
  //   hero:       require('@/assets/characters/marco-lily/hero.png'),
  //   face:       require('@/assets/characters/marco-lily/face.png'),
  //   silhouette: require('@/assets/characters/marco-lily/silhouette.png'),
  // },
}

export function useCharacter() {
  const activePairId   = useCharacterStore((s) => s.activePairId)
  const setActivePairId = useCharacterStore((s) => s.setActivePairId)

  const activePair: CharacterPair = CHARACTER_PAIRS[activePairId]

  return {
    activePair,
    activeAssets: CHARACTER_ASSETS[activePairId],
    setActivePair: setActivePairId,
  }
}
