import { View, Text, StyleSheet } from 'react-native'
import { colors, spacing, radius, typography } from '@/constants/tokens'

interface Props {
  icon: string
  label: string
  accentColor?: string
  accentBg?: string
}

export function InfoChip({ icon, label, accentColor, accentBg }: Props) {
  return (
    <View
      style={[
        styles.chip,
        accentBg ? { backgroundColor: accentBg } : undefined,
      ]}
    >
      <Text style={styles.icon}>{icon}</Text>
      <Text
        style={[
          styles.label,
          accentColor ? { color: accentColor } : undefined,
        ]}
      >
        {label}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    backgroundColor: colors.gray[100],
    borderRadius: radius.pill,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
  },
  icon: {
    fontSize: 12,
  },
  label: {
    ...typography.label,
    color: colors.gray[600],
  },
})
