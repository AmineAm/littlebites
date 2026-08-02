// S7 — Recipe Detail
// Figma: P01-S7 | Auth required: Yes
import { useState, useEffect } from 'react'
import { ScrollView, View, Text, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { colors, spacing, radius, typography } from '@/constants/tokens'
import { useCharacter } from '@/hooks/useCharacter'
import { getRecipe } from '@/services/recipes'
import { Recipe } from '@/types/recipe'
import { RecipeHeroImage } from '@/components/recipe/RecipeHeroImage'
import { InfoChip } from '@/components/ui/InfoChip'
import { CultureCard } from '@/components/recipe/CultureCard'
import { NutritionBadges } from '@/components/recipe/NutritionBadges'
import { IngredientsList } from '@/components/recipe/IngredientsList'
import { PrimaryButton } from '@/components/ui/PrimaryButton'


export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const { activePair } = useCharacter()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    getRecipe(id)
      .then(setRecipe)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.loadingText}>Loading recipe...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (!recipe) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.loadingText}>Recipe not found</Text>
        </View>
      </SafeAreaView>
    )
  }

  const ageGroup = 5

  let factKey: 'age2to4' | 'age5to8' | 'age9to12' = 'age5to8'
  if (ageGroup <= 4) factKey = 'age2to4'
  else if (ageGroup >= 9) factKey = 'age9to12'

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero Image ── */}
        <RecipeHeroImage
          recipeId={recipe.recipeId}
          imageFilename={recipe.imageFilename}
          pairId={activePair.id}
        />

        {/* ── Title + Info Chips ── */}
        <View style={styles.header}>
          <Text style={styles.title}>{recipe.title}</Text>
          <View style={styles.chips}>
            <InfoChip icon="⏱" label={`${recipe.prepMinutes} min`} />
            <InfoChip icon="👤" label={`Ages ${recipe.ageRange.min}–${recipe.ageRange.max}`} />
            <InfoChip
              icon="💚"
              label="Healthy"
              accentColor={colors.teal[400]}
              accentBg={colors.teal[50]}
            />
          </View>
        </View>

        {/* ── Culture Card ── */}
        {recipe.cultureCard && (
          <CultureCard
            cuisineId={recipe.cuisineId}
            countryName={recipe.cultureCard.countryName}
            flagEmoji={recipe.cultureCard.flagEmoji}
            fact={recipe.cultureCard.facts[factKey]}
          />
        )}

        {/* ── Nutrition Badges ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nutrition</Text>
          <NutritionBadges tags={recipe.nutritionTags} />
        </View>

        {/* ── Ingredients ── */}
        <IngredientsList
          ingredients={recipe.ingredients}
          substitutions={recipe.substitutions}
        />

        {/* ── Steps Preview ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Steps ({recipe.steps.length})</Text>
          {recipe.steps.slice(0, 2).map((step) => (
            <View key={step.stepNumber} style={styles.stepPreview}>
              <Text style={styles.stepNumber}>Step {step.stepNumber}</Text>
              <Text style={styles.stepText} numberOfLines={2}>
                {step.instruction}
              </Text>
            </View>
          ))}
        </View>

        {/* ── CTA ── */}
        <PrimaryButton
          label="Start cooking"
          onPress={() => router.push(`/cook/${recipe.recipeId}`)}
          style={styles.cta}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: colors.linen },
  scroll: { flex: 1 },
  content: {
    paddingBottom: spacing[12],
    gap: spacing[4],
  },

  container: { flex: 1, backgroundColor: colors.linen },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...typography.body,
    color: colors.gray[600],
  },

  header: {
    paddingHorizontal: spacing[6],
  },
  title: {
    ...typography.display,
    color: colors.gray[900],
    marginBottom: spacing[3],
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },

  section: {
    paddingHorizontal: spacing[6],
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.gray[900],
    marginBottom: spacing[3],
  },

  stepPreview: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing[3],
    marginBottom: spacing[2],
  },
  stepNumber: {
    ...typography.label,
    color: colors.coral[400],
    marginBottom: spacing[1],
  },
  stepText: {
    ...typography.body,
    color: colors.gray[600],
  },

  cta: {
    marginHorizontal: spacing[6],
  },
})
