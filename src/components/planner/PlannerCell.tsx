import { Pressable, Text, StyleSheet } from 'react-native'
import { colors, spacing, radius, typography } from '@/constants/tokens'
import { DayKey, MealType } from '@/types/planner'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface Props {
  recipeId?: string
  mealType: MealType
  dayKey: DayKey
  onTap: () => void
}

export function PlannerCell({ recipeId, mealType: _mealType, dayKey: _dayKey, onTap }: Props) {
  const reducedMotion = useReducedMotion()

  if (!recipeId) {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.cell,
          styles.empty,
          pressed && !reducedMotion && styles.pressed,
        ]}
        onPress={onTap}
        accessibilityRole="button"
        accessibilityLabel="Add meal"
      >
        <Text style={styles.plus}>+</Text>
      </Pressable>
    )
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.cell,
        styles.filled,
        pressed && !reducedMotion && styles.pressed,
      ]}
      onPress={onTap}
      accessibilityRole="button"
      accessibilityLabel="View recipe"
    >
      <Text style={styles.recipeLabel} numberOfLines={2}>
        {recipeId}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[1],
  },
  empty: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.gray[200],
    backgroundColor: colors.linen,
  },
  filled: {
    backgroundColor: colors.teal[50],
  },
  pressed: {
    opacity: 0.7,
  },
  plus: {
    ...typography.h2,
    color: colors.gray[400],
  },
  recipeLabel: {
    ...typography.bodySm,
    color: colors.teal[800],
    textAlign: 'center',
  },
})
