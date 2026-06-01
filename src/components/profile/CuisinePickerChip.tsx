import { Pressable, Text, StyleSheet } from 'react-native'
import { colors, spacing, radius, typography } from '@/constants/tokens'
import { Cuisine } from '@/constants/cuisines'

interface Props {
  cuisine:  Cuisine
  selected: boolean
  onPress:  (cuisineId: string) => void
}

export function CuisinePickerChip({ cuisine, selected, onPress }: Props) {
  return (
    <Pressable
      style={[
        styles.chip,
        selected && {
          borderColor: cuisine.accentText,
          backgroundColor: cuisine.accentBg,
        },
      ]}
      onPress={() => onPress(cuisine.cuisineId)}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={cuisine.name}
    >
      <Text style={styles.flag}>{cuisine.flagEmoji}</Text>
      <Text
        style={[
          styles.label,
          selected && { color: cuisine.accentText, fontWeight: '500' },
        ]}
      >
        {cuisine.name}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    borderWidth: 1.5,
    borderColor: colors.gray[100],
    borderRadius: radius.pill,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    backgroundColor: colors.white,
  },
  flag:  { fontSize: 14 },
  label: {
    ...typography.bodySm,
    color: colors.gray[600],
  },
})
