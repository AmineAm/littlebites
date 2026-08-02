// Shop — the week's shopping list, derived from the plan.
//
// Nothing is stored here. The list is computed from the planned recipes by
// deriveShoppingList; only the ticked state is persisted.

import { useMemo } from 'react'
import { ScrollView, View, Text, Pressable, StyleSheet, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, radius, typography } from '@/constants/tokens'
import { useMealPlan } from '@/hooks/useMealPlan'
import { usePlannerStore } from '@/store/planner.store'
import { deriveShoppingList } from '@/utils/shopping'
import { CUISINES } from '@/constants/cuisines'
import { getRecipe } from '@/data/recipes'
import { CuisineId } from '@/types/character'
import { ShoppingCategory } from '@/components/shopping/ShoppingCategory'
import { ShoppingItemData } from '@/components/shopping/ShoppingItem'

/** "350g", "2 pieces", "1 bunch" — word units get spaced and pluralised. */
function formatAmount(amount: number, unit: string): string {
  const rounded = Math.round(amount * 100) / 100
  const wordUnits = ['piece', 'bunch', 'cup', 'tbsp', 'tsp']
  if (!wordUnits.includes(unit)) return `${rounded}${unit}`
  return `${rounded} ${rounded === 1 ? unit : `${unit}s`}`
}

export default function ShopScreen() {
  const { plan, plannedRecipes, weekId } = useMealPlan()

  const checkedList   = usePlannerStore((s) => s.checked[weekId] ?? [])
  const toggleChecked = usePlannerStore((s) => s.toggleChecked)
  const clearChecked  = usePlannerStore((s) => s.clearChecked)

  const groups = useMemo(
    () => deriveShoppingList(plan, plannedRecipes),
    [plan, plannedRecipes],
  )

  const checkedMap = useMemo(
    () => Object.fromEntries(checkedList.map((k) => [k, true])),
    [checkedList],
  )

  const totalItems   = groups.reduce((n, g) => n + g.items.length, 0)
  const checkedCount = checkedList.length

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.heading}>This week's list</Text>
            <Text style={styles.subtitle}>
              {totalItems === 0
                ? 'Nothing to buy yet'
                : `${checkedCount} of ${totalItems} in the trolley`}
            </Text>
          </View>
          {checkedCount > 0 && (
            <Pressable
              style={styles.reset}
              onPress={() =>
                Alert.alert('Clear ticks?', 'This unticks everything on the list.', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Clear', style: 'destructive', onPress: () => clearChecked(weekId) },
                ])
              }
              accessibilityRole="button"
            >
              <Text style={styles.resetText}>Reset</Text>
            </Pressable>
          )}
        </View>

        {groups.map((group) => {
          const items: ShoppingItemData[] = group.items.map((item) => {
            const firstRecipe = getRecipe(item.recipeIds[0])
            const cuisine = firstRecipe
              ? CUISINES[firstRecipe.cuisineId as CuisineId]
              : undefined

            return {
              id:          item.key,
              name:        item.name,
              amount:      formatAmount(item.amount, item.unit),
              category:    group.category,
              cuisineFlag: cuisine?.flagEmoji,
              substitution: item.substitution
                ? { original: item.name, substitute: item.substitution }
                : undefined,
            }
          })

          return (
            <ShoppingCategory
              key={group.category}
              category={group.category}
              items={items}
              checkedItems={checkedMap}
              onToggleItem={(itemKey) => toggleChecked(weekId, itemKey)}
            />
          )
        })}

        {totalItems === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🛒</Text>
            <Text style={styles.emptyText}>No items yet</Text>
            <Text style={styles.emptySub}>
              Add meals to your plan and the list fills itself.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: colors.linen },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[8],
    gap: spacing[3],
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: spacing[6],
    paddingBottom: spacing[2],
    gap: spacing[4],
  },
  headerText: { flex: 1 },
  heading:  { ...typography.display, color: colors.gray[900] },
  subtitle: { ...typography.body, color: colors.gray[600], marginTop: spacing[1] },

  reset: {
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.gray[100],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    backgroundColor: colors.white,
  },
  resetText: { ...typography.bodySm, color: colors.gray[600] },

  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing[12],
    gap: spacing[2],
  },
  emptyIcon: { fontSize: 40 },
  emptyText: { ...typography.h1, color: colors.gray[900] },
  emptySub: {
    ...typography.body,
    color: colors.gray[600],
    textAlign: 'center',
    paddingHorizontal: spacing[6],
  },
})
