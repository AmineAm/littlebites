import { View, Text, StyleSheet } from 'react-native'
import { colors, spacing, radius, typography } from '@/constants/tokens'
import { NutritionTag } from '@/types/recipe'
import { getTagLabel, NutritionStatus } from '@/utils/nutrition'

interface Props {
  tag: NutritionTag
  status: NutritionStatus
}

const STATUS_COLORS: Record<NutritionStatus, { bg: string; text: string; icon: string }> = {
  met:     { bg: colors.teal[50],   text: colors.teal[800],   icon: '✓' },
  partial: { bg: colors.amber[50],  text: colors.amber[400],  icon: '~' },
  missing: { bg: colors.gray[100],  text: colors.gray[600],   icon: '○' },
}

export function NutritionBadge({ tag, status }: Props) {
  const { bg, text, icon } = STATUS_COLORS[status]

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.icon, { color: text }]}>{icon}</Text>
      <Text style={[styles.label, { color: text }]}>{getTagLabel(tag)}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    borderRadius: radius.pill,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
  },
  icon: {
    fontSize: 10,
    fontWeight: '500',
  },
  label: {
    ...typography.label,
  },
})
