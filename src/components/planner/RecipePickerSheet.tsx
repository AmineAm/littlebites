import { useState, useEffect } from 'react'
import { View, Text, Pressable, StyleSheet, Modal } from 'react-native'
import { colors, spacing, radius, typography } from '@/constants/tokens'
import { getRecipesFiltered } from '@/services/recipes'
import { Recipe } from '@/types/recipe'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface Props {
  visible: boolean
  cuisineId?: string
  onSelect: (recipeId: string) => void
  onDismiss: () => void
}

export function RecipePickerSheet({ visible, cuisineId, onSelect, onDismiss }: Props) {
  const reducedMotion = useReducedMotion()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!visible) return
    setLoading(true)
    getRecipesFiltered({ cuisineId, count: 20 })
      .then(setRecipes)
      .finally(() => setLoading(false))
  }, [visible, cuisineId])

  return (
    <Modal
      visible={visible}
      transparent
      animationType={reducedMotion ? 'none' : 'slide'}
      onRequestClose={onDismiss}
    >
      <Pressable style={styles.overlay} onPress={onDismiss}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />
          <Text style={styles.title}>Choose a recipe</Text>

          {loading ? (
            <Text style={styles.loading}>Loading recipes...</Text>
          ) : recipes.length === 0 ? (
            <Text style={styles.empty}>No recipes found for this cuisine.</Text>
          ) : (
            recipes.map((recipe) => (
              <Pressable
                key={recipe.recipeId}
                style={({ pressed }) => [
                  styles.recipeItem,
                  pressed && styles.pressed,
                ]}
                onPress={() => {
                  onSelect(recipe.recipeId)
                  onDismiss()
                }}
              >
                <Text style={styles.recipeTitle}>{recipe.title}</Text>
                <Text style={styles.recipeMeta}>
                  {recipe.prepMinutes} min · {recipe.difficulty}
                </Text>
              </Pressable>
            ))
          )}

          <Pressable style={styles.cancelButton} onPress={onDismiss}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing[6],
    maxHeight: '70%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.gray[200],
    alignSelf: 'center',
    marginBottom: spacing[4],
  },
  title: {
    ...typography.h1,
    color: colors.gray[900],
    marginBottom: spacing[4],
  },
  loading: {
    ...typography.body,
    color: colors.gray[400],
    textAlign: 'center',
    paddingVertical: spacing[8],
  },
  empty: {
    ...typography.body,
    color: colors.gray[400],
    textAlign: 'center',
    paddingVertical: spacing[8],
  },
  recipeItem: {
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  pressed: {
    opacity: 0.7,
  },
  recipeTitle: {
    ...typography.bodyLg,
    color: colors.gray[900],
  },
  recipeMeta: {
    ...typography.bodySm,
    color: colors.gray[600],
    marginTop: spacing[1],
  },
  cancelButton: {
    marginTop: spacing[4],
    paddingVertical: spacing[3],
    alignItems: 'center',
  },
  cancelText: {
    ...typography.body,
    color: colors.gray[600],
  },
})
