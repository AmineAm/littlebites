import { View, Text, Pressable, StyleSheet } from 'react-native'
import { colors, spacing, radius, typography } from '@/constants/tokens'

export type AdventureLevel = 'cautious' | 'curious' | 'adventurous'

const OPTIONS: Array<{ level: AdventureLevel; emoji: string; label: string; sub: string }> = [
  { level: 'cautious',    emoji: '🌱', label: 'Cautious',    sub: 'Mostly familiar foods' },
  { level: 'curious',     emoji: '🌍', label: 'Curious',     sub: 'A new cuisine each week' },
  { level: 'adventurous', emoji: '🚀', label: 'Adventurous', sub: 'Push their tastes early' },
]

interface Props {
  value:    AdventureLevel
  onChange: (level: AdventureLevel) => void
}

export function AdventureLevelSelector({ value, onChange }: Props) {
  return (
    <View style={styles.row}>
      {OPTIONS.map((opt) => {
        const selected = value === opt.level
        return (
          <Pressable
            key={opt.level}
            style={[styles.option, selected && styles.selected]}
            onPress={() => onChange(opt.level)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={`${opt.label}: ${opt.sub}`}
          >
            <Text style={styles.emoji}>{opt.emoji}</Text>
            <Text style={[styles.label, selected && styles.labelSelected]}>{opt.label}</Text>
            <Text style={styles.sub}>{opt.sub}</Text>
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  option: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.gray[100],
    borderRadius: radius.lg,
    padding: spacing[3],
    backgroundColor: colors.white,
    alignItems: 'center',
    gap: 2,
  },
  selected: {
    borderColor: colors.purple[400],
    backgroundColor: colors.purple[50],
  },
  emoji: { fontSize: 22 },
  label: {
    ...typography.h2,
    color: colors.gray[900],
  },
  labelSelected: { color: colors.purple[800] },
  sub: {
    ...typography.bodySm,
    color: colors.gray[600],
    textAlign: 'center',
    fontSize: 10,
  },
})
