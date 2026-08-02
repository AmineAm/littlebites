import { useState } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { colors, spacing, radius, typography } from '@/constants/tokens'
import { Ingredient } from '@/types/recipe'

interface Props {
  ingredients: Ingredient[]
  substitutions?: Record<string, string>
}

const PREVIEW_COUNT = 3

export function IngredientsList({ ingredients, substitutions }: Props) {
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? ingredients : ingredients.slice(0, PREVIEW_COUNT)
  const hasMore = ingredients.length > PREVIEW_COUNT

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ingredients</Text>

      {visible.map((ingredient, index) => (
        <View key={index} style={styles.item}>
          <View style={styles.itemLeft}>
            <View style={styles.bullet} />
            <Text style={styles.name}>
              {ingredient.amount} {ingredient.unit} {ingredient.name}
              {ingredient.notes ? ` (${ingredient.notes})` : ''}
            </Text>
          </View>
          {ingredient.isGlobal && (
            <Text style={styles.globalIcon}>ℹ️</Text>
          )}
        </View>
      ))}

      {hasMore && (
        <Pressable
          style={styles.expandButton}
          onPress={() => setExpanded(!expanded)}
        >
          <Text style={styles.expandText}>
            {expanded ? 'Show less' : `Show all ${ingredients.length} ingredients`}
          </Text>
        </Pressable>
      )}
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
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing[2],
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.gray[400],
  },
  name: {
    ...typography.body,
    color: colors.gray[900],
    flex: 1,
  },
  globalIcon: {
    fontSize: 14,
    marginLeft: spacing[2],
  },
  expandButton: {
    marginTop: spacing[3],
    alignItems: 'center',
  },
  expandText: {
    ...typography.body,
    color: colors.coral[400],
  },
})
