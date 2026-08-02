import { View, Text, StyleSheet } from 'react-native'
import { colors, spacing, radius, typography } from '@/constants/tokens'
import { WeekPlan } from '@/types/planner'
import { NutritionBadge } from '@/components/ui/NutritionBadge'
import { NutritionTag } from '@/types/recipe'

interface Props {
  weekPlan: WeekPlan
}

const ALL_TAGS: NutritionTag[] = ['protein', 'veg', 'carbs', 'dairy']

export function NutritionWeekSummary({ weekPlan: _weekPlan }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>This week's nutrition</Text>
      <View style={styles.badges}>
        {ALL_TAGS.map((tag) => (
          <NutritionBadge key={tag} tag={tag} status="partial" />
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing[4],
  },
  title: {
    ...typography.h2,
    color: colors.gray[900],
    marginBottom: spacing[3],
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
})
