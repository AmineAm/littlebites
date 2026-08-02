// S8 — Shopping List
// Figma: P01-S8 | Auth required: Yes
import { useState, useMemo } from 'react'
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, radius, typography } from '@/constants/tokens'
import { useMealPlan } from '@/hooks/useMealPlan'
import { ShoppingCategory } from '@/components/shopping/ShoppingCategory'
import { ShoppingItemData } from '@/components/shopping/ShoppingItem'

// Mock shopping data — in production this would be derived from meal plan recipes
const MOCK_ITEMS: ShoppingItemData[] = [
  { name: 'Chicken breast', amount: '500g', category: 'Protein', cuisineFlag: '🇯🇵' },
  { name: 'Rice', amount: '2 cups', category: 'Pantry', cuisineFlag: '🇯🇵' },
  { name: 'Broccoli', amount: '1 head', category: 'Produce', cuisineFlag: '🇮🇹' },
  { name: 'Soy sauce', amount: '3 tbsp', category: 'Pantry', cuisineFlag: '🇯🇵', substitution: { original: 'soy sauce', substitute: 'coconut aminos' } },
  { name: 'Eggs', amount: '6', category: 'Protein', cuisineFlag: '🇮🇹' },
  { name: 'Pasta', amount: '250g', category: 'Pantry', cuisineFlag: '🇮🇹' },
  { name: 'Tomatoes', amount: '4', category: 'Produce' },
  { name: 'Cheese', amount: '100g', category: 'Dairy' },
  { name: 'Bread', amount: '1 loaf', category: 'Bakery' },
  { name: 'Milk', amount: '1L', category: 'Dairy' },
]

const CATEGORIES = ['Produce', 'Protein', 'Pantry', 'Dairy', 'Bakery']

export default function ShopScreen() {
  const { currentPlan } = useMealPlan()
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})

  const itemsByCategory = useMemo(() => {
    const grouped: Record<string, ShoppingItemData[]> = {}
    for (const cat of CATEGORIES) {
      grouped[cat] = MOCK_ITEMS.filter((item) => item.category === cat)
    }
    return grouped
  }, [])

  const totalItems = MOCK_ITEMS.length
  const checkedCount = Object.values(checkedItems).filter(Boolean).length

  function handleToggleItem(name: string) {
    setCheckedItems((prev) => ({ ...prev, [name]: !prev[name] }))
  }

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
            <Text style={styles.heading}>Shopping List</Text>
            <Text style={styles.subtitle}>
              {checkedCount} of {totalItems} items checked
            </Text>
          </View>
          <Pressable style={styles.orderAll}>
            <Text style={styles.orderAllText}>Order all</Text>
          </Pressable>
        </View>

        {/* ── Categories ── */}
        {CATEGORIES.map((category) => {
          const items = itemsByCategory[category]
          if (!items || items.length === 0) return null
          return (
            <ShoppingCategory
              key={category}
              category={category}
              items={items}
              checkedItems={checkedItems}
              onToggleItem={handleToggleItem}
            />
          )
        })}

        {/* ── Empty state ── */}
        {totalItems === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No items yet</Text>
            <Text style={styles.emptySub}>
              Add meals to your plan and the shopping list will populate automatically.
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: spacing[4],
    marginBottom: spacing[2],
  },
  heading: {
    ...typography.display,
    color: colors.gray[900],
  },
  subtitle: {
    ...typography.body,
    color: colors.gray[600],
    marginTop: spacing[1],
  },
  orderAll: {
    backgroundColor: colors.teal[50],
    borderRadius: radius.pill,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  orderAllText: {
    ...typography.label,
    color: colors.teal[400],
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
})
