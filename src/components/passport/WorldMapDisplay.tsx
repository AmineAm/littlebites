import { View, Text, StyleSheet } from 'react-native'
import { colors, spacing, radius, typography } from '@/constants/tokens'
import { CharacterFaceIcon } from '@/components/character/CharacterFaceIcon'
import { CharacterPairId } from '@/types/character'
import { PlaceholderImage } from '@/components/ui/PlaceholderImage'

interface Props {
  activeCharacterPairId: CharacterPairId
  totalStamps: number
  earnedCount: number
}

export function WorldMapDisplay({ activeCharacterPairId, totalStamps, earnedCount }: Props) {
  return (
    <View style={styles.container}>
      <PlaceholderImage
        type="cuisine-card"
        width={360}
        height={200}
        style={styles.map}
      />

      <View style={styles.info}>
        <CharacterFaceIcon pairId={activeCharacterPairId} size={32} />
        <View style={styles.textBlock}>
          <Text style={styles.label}>Your passport</Text>
          <Text style={styles.count}>
            {earnedCount} of {totalStamps} countries visited
          </Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: 200,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    padding: spacing[4],
  },
  textBlock: {
    flex: 1,
  },
  label: {
    ...typography.label,
    color: colors.gray[400],
  },
  count: {
    ...typography.body,
    color: colors.gray[900],
    marginTop: spacing[1],
  },
})
