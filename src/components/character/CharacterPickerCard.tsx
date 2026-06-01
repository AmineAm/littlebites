import { Pressable, Text, View, StyleSheet } from 'react-native'
import { colors, spacing, radius, typography } from '@/constants/tokens'
import { CHARACTER_PAIRS } from '@/constants/characters'
import { CharacterPairId } from '@/types/character'

interface Props {
  pairId:   CharacterPairId
  selected: boolean
  onSelect: (pairId: CharacterPairId) => void
}

export function CharacterPickerCard({ pairId, selected, onSelect }: Props) {
  const pair = CHARACTER_PAIRS[pairId]

  return (
    <Pressable
      style={[
        styles.card,
        { borderColor: selected ? pair.accentColor : colors.gray[100] },
        selected && { backgroundColor: pair.accentBg },
      ]}
      onPress={() => onSelect(pairId)}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={`${pair.displayName}, ${pair.tagline}`}
    >
      {/* Colour swatch — stands in for character art until assets arrive */}
      <View style={[styles.swatch, { backgroundColor: pair.accentColor }]}>
        <Text style={styles.swatchInitial}>
          {pair.displayName.charAt(0)}
        </Text>
      </View>

      <View style={styles.info}>
        <Text style={[styles.name, selected && { color: pair.accentColor }]}>
          {pair.displayName}
        </Text>
        <Text style={styles.tagline}>{pair.tagline}</Text>
        <Text style={styles.background}>{pair.background}</Text>
      </View>

      {selected && (
        <View style={[styles.check, { backgroundColor: pair.accentColor }]}>
          <Text style={styles.checkMark}>✓</Text>
        </View>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: radius.lg,
    padding: spacing[3],
    backgroundColor: colors.white,
    gap: spacing[3],
  },
  swatch: {
    width: 48,
    height: 56,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  swatchInitial: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.white,
  },
  info: { flex: 1 },
  name: {
    ...typography.h2,
    color: colors.gray[900],
  },
  tagline: {
    ...typography.bodySm,
    color: colors.gray[600],
    marginTop: 1,
  },
  background: {
    ...typography.label,
    color: colors.gray[400],
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  check: {
    width: 22,
    height: 22,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkMark: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '700',
  },
})
