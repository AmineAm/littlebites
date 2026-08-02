import { View, Text, StyleSheet } from 'react-native'
import { colors, spacing, radius, typography } from '@/constants/tokens'
import { CHARACTER_PAIRS } from '@/constants/characters'
import { CharacterPairId, CuisineId } from '@/types/character'
import { CHARACTER_ASSETS } from '@/hooks/useCharacter'
import { PlaceholderImage } from '@/components/ui/PlaceholderImage'

interface Props {
  pairId: CharacterPairId
  cuisineId: string
}

export function CharacterOutfitTeaser({ pairId, cuisineId }: Props) {
  const pair = CHARACTER_PAIRS[pairId]
  const outfit = CHARACTER_ASSETS[pairId]?.outfits?.[cuisineId as CuisineId]

  // Hide entirely if no outfit asset exists
  if (!outfit) return null

  return (
    <View style={styles.card}>
      <Text style={styles.label}>New outfit unlocked!</Text>
      <View style={styles.row}>
        <PlaceholderImage
          type="character-hero"
          characterId={pairId}
          width={80}
          height={120}
          style={styles.image}
        />
        <View style={styles.info}>
          <Text style={styles.pairName}>{pair.displayName}</Text>
          <Text style={styles.cuisine}>
            {cuisineId.charAt(0).toUpperCase() + cuisineId.slice(1)} style
          </Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.amber[50],
    borderRadius: radius.lg,
    padding: spacing[4],
  },
  label: {
    ...typography.overline,
    color: colors.amber[400],
    marginBottom: spacing[3],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
  },
  image: {
    width: 80,
    height: 120,
    borderRadius: radius.md,
  },
  info: {
    flex: 1,
  },
  pairName: {
    ...typography.h2,
    color: colors.gray[900],
  },
  cuisine: {
    ...typography.body,
    color: colors.gray[600],
    marginTop: spacing[1],
  },
})
