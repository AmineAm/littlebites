import { View, Text, StyleSheet } from 'react-native'
import { colors, spacing, radius, typography } from '@/constants/tokens'
import { WeekPlan, DayKey, MealType } from '@/types/planner'
import { PlannerCell } from './PlannerCell'

interface Props {
  weekPlan: WeekPlan
  onCellTap: (day: DayKey, meal: MealType) => void
}

const DAYS: DayKey[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
const DAY_LABELS: Record<DayKey, string> = {
  monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu',
  friday: 'Fri', saturday: 'Sat', sunday: 'Sun',
}
const MEALS: MealType[] = ['breakfast', 'lunch', 'dinner']
const MEAL_LABELS: Record<MealType, string> = {
  breakfast: '🌅', lunch: '☀️', dinner: '🌙',
}

export function PlannerGrid({ weekPlan, onCellTap }: Props) {
  return (
    <View style={styles.container}>
      {/* Day headers */}
      <View style={styles.headerRow}>
        <View style={styles.mealLabel} />
        {DAYS.map((day) => (
          <View key={day} style={styles.dayHeader}>
            <Text style={styles.dayLabel}>{DAY_LABELS[day]}</Text>
          </View>
        ))}
      </View>

      {/* Meal rows */}
      {MEALS.map((meal) => (
        <View key={meal} style={styles.mealRow}>
          <View style={styles.mealLabel}>
            <Text style={styles.mealIcon}>{MEAL_LABELS[meal]}</Text>
          </View>
          {DAYS.map((day) => (
            <PlannerCell
              key={`${day}-${meal}`}
              recipeId={weekPlan.days[day]?.[meal]}
              mealType={meal}
              dayKey={day}
              onTap={() => onCellTap(day, meal)}
            />
          ))}
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing[3],
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: spacing[2],
  },
  mealRow: {
    flexDirection: 'row',
    marginBottom: spacing[2],
  },
  mealLabel: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mealIcon: {
    fontSize: 14,
  },
  dayHeader: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: spacing[1],
  },
  dayLabel: {
    ...typography.label,
    color: colors.gray[600],
  },
})
