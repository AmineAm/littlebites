import { Pressable, Text, StyleSheet } from 'react-native'
import { colors, spacing, radius, typography } from '@/constants/tokens'
import { Allergy } from '@/types/child'

const ALLERGY_LABELS: Record<Allergy, string> = {
  nuts:      '🥜 Nuts',
  dairy:     '🥛 Dairy',
  gluten:    '🌾 Gluten',
  eggs:      '🥚 Eggs',
  soy:       '🫘 Soy',
  shellfish: '🦐 Shellfish',
  fish:      '🐟 Fish',
  sesame:    '🫙 Sesame',
}

interface Props {
  allergen: Allergy
  selected: boolean
  onToggle: (allergen: Allergy) => void
}

export function AllergyChip({ allergen, selected, onToggle }: Props) {
  return (
    <Pressable
      style={[styles.chip, selected && styles.selected]}
      onPress={() => onToggle(allergen)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={`${ALLERGY_LABELS[allergen]} allergy`}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>
        {ALLERGY_LABELS[allergen]}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1.5,
    borderColor: colors.gray[100],
    borderRadius: radius.pill,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    backgroundColor: colors.white,
  },
  selected: {
    borderColor: colors.coral[400],
    backgroundColor: colors.coral[50],
  },
  label: {
    ...typography.bodySm,
    color: colors.gray[600],
  },
  labelSelected: {
    color: colors.coral[800],
    fontWeight: '500',
  },
})
