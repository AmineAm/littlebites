import { useCharacterStore } from '@/store/character.store'
import { CHARACTER_PAIRS } from '@/constants/characters'
import { CharacterPair, CharacterPairId, CuisineId, CharacterOutfit } from '@/types/character'

// Character assets are statically required — Metro cannot resolve dynamic paths.
// Add entries here as illustration assets arrive.
export const CHARACTER_ASSETS: Partial<Record<CharacterPairId, {
  face:       ReturnType<typeof require>
  silhouette: ReturnType<typeof require>
  outfits:    Partial<Record<CuisineId, CharacterOutfit>>
}>> = {
  // ── ASSETS: add static requires here as files are delivered ──
  // 'marco-lily': {
  //   face:       require('@/assets/characters/marco-lily/face@2x.png'),
  //   silhouette: require('@/assets/characters/marco-lily/silhouette@2x.png'),
  //   outfits: {
  //     italian: {
  //       hero:     require('@/assets/characters/marco-lily/italian/hero@2x.png'),
  //       heroWave: require('@/assets/characters/marco-lily/italian/hero-wave@2x.png'),
  //       stamp:    require('@/assets/characters/marco-lily/italian/stamp@2x.png'),
  //     },
  //   },
  // },
}

export function useCharacter() {
  const { activePairId, setActivePairId } = useCharacterStore()

  const activePair: CharacterPair = CHARACTER_PAIRS[activePairId]

  function getCuisineOutfit(cuisineId: string): CharacterOutfit | undefined {
    return CHARACTER_ASSETS[activePairId]?.outfits?.[cuisineId as CuisineId]
  }

  return {
    activePair,
    activeAssets: CHARACTER_ASSETS[activePairId],
    getCuisineOutfit,
    setActivePair: setActivePairId,
  }
}
