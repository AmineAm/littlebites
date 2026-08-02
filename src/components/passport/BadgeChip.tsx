import { View, Text, StyleSheet } from 'react-native'
import { colors, spacing, radius, typography } from '@/constants/tokens'
import { BadgeId } from '@/types/passport'

interface Props {
  badge: BadgeId
}

const BADGE_CONFIG: Record<BadgeId, { icon: string; label: string; bg: string; text: string }> = {
  'first-bite': {
    icon: '⭐',
    label: 'First bite',
    bg: colors.teal[50],
    text: colors.teal[400],
  },
  'explorer': {
    icon: '🌍',
    label: 'Explorer',
    bg: colors.purple[50],
    text: colors.purple[400],
  },
  'little-chef': {
    icon: '👨‍🍳',
    label: 'Little chef',
    bg: colors.amber[50],
    text: colors.amber[400],
  },
}

export function BadgeChip({ badge }: Props) {
  const config = BADGE_CONFIG[badge] ?? { icon: '🏆', label: badge, bg: colors.gray[100], text: colors.gray[600] }

  return (
    <View style={[styles.chip, { backgroundColor: config.bg }]}>
      <Text style={styles.icon}>{config.icon}</Text>
      <Text style={[styles.label, { color: config.text }]}>{config.label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    borderRadius: radius.pill,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  icon: {
    fontSize: 14,
  },
  label: {
    ...typography.label,
  },
})
