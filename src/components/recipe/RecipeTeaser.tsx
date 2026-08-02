import { Pressable, Text, StyleSheet } from 'react-native'
import { colors, spacing, radius, typography } from '@/constants/tokens'
import { Recipe } from '@/types/recipe'
import { PlaceholderImage } from '@/components/ui/PlaceholderImage'

interface Props {
  recipe: Recipe
  onTap: () => void
}

export function RecipeTeaser({ recipe, onTap }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
      ]}
      onPress={onTap}
    >
      <PlaceholderImage
        type="recipe"
        width={120}
        height={80}
        style={styles.image}
      />
      <Text style={styles.title} numberOfLines={2}>{recipe.title}</Text>
      <Text style={styles.meta}>
        {recipe.prepMinutes} min · {recipe.difficulty}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing[3],
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  pressed: {
    opacity: 0.7,
  },
  image: {
    width: 120,
    height: 80,
    borderRadius: radius.md,
  },
  title: {
    ...typography.bodyLg,
    color: colors.gray[900],
    flex: 1,
  },
  meta: {
    ...typography.bodySm,
    color: colors.gray[600],
  },
})
