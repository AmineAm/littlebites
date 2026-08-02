// S6 — Meal Planner
// Figma: P01-S6 | Auth required: Yes
import { useState, useCallback } from 'react'
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { colors, spacing, radius, typography } from '@/constants/tokens'
import { useMealPlan } from '@/hooks/useMealPlan'
import { PlannerGrid } from '@/components/planner/PlannerGrid'
import { NutritionWeekSummary } from '@/components/planner/NutritionWeekSummary'
import { RecipePickerSheet } from '@/components/planner/RecipePickerSheet'
import { formatWeekLabel } from '@/utils/date'
import { DayKey, MealType } from '@/types/planner'

export default function PlanScreen() {
  const router = useRouter()
  const { currentPlan, currentWeekId } = useMealPlan()
  const [pickerVisible, setPickerVisible] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<{ day: DayKey; meal: MealType } | null>(null)

  const handleCellTap = useCallback((day: DayKey, meal: MealType) => {
    const recipeId = currentPlan?.days[day]?.[meal]
    if (recipeId) {
      router.push(`/recipe/${recipeId}`)
    } else {
      setSelectedSlot({ day, meal })
      setPickerVisible(true)
    }
  }, [currentPlan, router])

  const weekLabel = formatWeekLabel(currentWeekId)

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.heading}>Meal Plan</Text>
            <Text style={styles.weekLabel}>{weekLabel}</Text>
          </View>
          <Pressable style={styles.autoFillButton}>
            <Text style={styles.autoFillText}>Auto-fill</Text>
          </Pressable>
        </View>

        {/* ── Planner Grid ── */}
        {currentPlan ? (
          <PlannerGrid
            weekPlan={currentPlan}
            onCellTap={handleCellTap}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No meal plan yet</Text>
            <Text style={styles.emptySub}>
              Tap Auto-fill to get started, or add meals manually.
            </Text>
          </View>
        )}

        {/* ── Nutrition Summary ── */}
        {currentPlan && <NutritionWeekSummary weekPlan={currentPlan} />}

        {/* ── Legend ── */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.teal[400] }]} />
            <Text style={styles.legendLabel}>Familiar</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.purple[400] }]} />
            <Text style={styles.legendLabel}>Adventure</Text>
          </View>
        </View>
      </ScrollView>

      {/* ── Recipe Picker Sheet ── */}
      <RecipePickerSheet
        visible={pickerVisible}
        onDismiss={() => setPickerVisible(false)}
        onSelect={(recipeId) => {
          if (selectedSlot) {
            // TODO: Save to planner store + Firestore
            console.log('Add recipe', recipeId, 'to', selectedSlot)
          }
        }}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: colors.linen },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[8],
    gap: spacing[4],
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: spacing[4],
  },
  heading: {
    ...typography.display,
    color: colors.gray[900],
  },
  weekLabel: {
    ...typography.body,
    color: colors.gray[600],
    marginTop: spacing[1],
  },
  autoFillButton: {
    backgroundColor: colors.coral[400],
    borderRadius: radius.pill,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
  },
  autoFillText: {
    ...typography.label,
    color: colors.white,
  },

  emptyState: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing[8],
    alignItems: 'center',
  },
  emptyText: {
    ...typography.h2,
    color: colors.gray[900],
    marginBottom: spacing[2],
  },
  emptySub: {
    ...typography.body,
    color: colors.gray[600],
    textAlign: 'center',
  },

  legend: {
    flexDirection: 'row',
    gap: spacing[4],
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
  },
  legendLabel: {
    ...typography.bodySm,
    color: colors.gray[600],
  },
})
