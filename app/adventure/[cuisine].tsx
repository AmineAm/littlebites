// S11 — Adventure Mode
// Figma: P01-S11 | Auth required: Yes
import { useState, useEffect } from 'react'
import { ScrollView, View, Text, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { colors, spacing, radius, typography } from '@/constants/tokens'
import { useCharacter } from '@/hooks/useCharacter'
import { getRecipesByCuisine } from '@/services/recipes'
import { Recipe } from '@/types/recipe'
import { AdventureHeroBar } from '@/components/recipe/AdventureHeroBar'
import { CultureCard } from '@/components/recipe/CultureCard'
import { RecipeTeaser } from '@/components/recipe/RecipeTeaser'
import { CharacterOutfitTeaser } from '@/components/character/CharacterOutfitTeaser'
import { PrimaryButton } from '@/components/ui/PrimaryButton'

export default function AdventureModeScreen() {
  const { cuisine } = useLocalSearchParams<{ cuisine: string }>()
  const router = useRouter()
  const { activePair } = useCharacter()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!cuisine) return
    setLoading(true)
    getRecipesByCuisine(cuisine)
      .then(setRecipes)
      .finally(() => setLoading(false))
  }, [cuisine])

  const ageGroup = 5

  let factKey: 'age2to4' | 'age5to8' | 'age9to12' = 'age5to8'
  if (ageGroup <= 4) factKey = 'age2to4'
  else if (ageGroup >= 9) factKey = 'age9to12'

  const firstRecipe = recipes[0]

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Adventure Hero Bar ── */}
        {cuisine && <AdventureHeroBar cuisineId={cuisine} />}

        {/* ── Culture Fact Card ── */}
        {firstRecipe?.cultureCard && (
          <CultureCard
            cuisineId={cuisine ?? ''}
            countryName={firstRecipe.cultureCard.countryName}
            flagEmoji={firstRecipe.cultureCard.flagEmoji}
            fact={firstRecipe.cultureCard.facts[factKey]}
          />
        )}

        {/* ── Recipe Teaser ── */}
        {firstRecipe && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Try this week</Text>
            <RecipeTeaser
              recipe={firstRecipe}
              onTap={() => router.push(`/recipe/${firstRecipe.recipeId}`)}
            />
          </View>
        )}

        {loading && (
          <Text style={styles.loadingText}>Finding the perfect recipe...</Text>
        )}

        {/* ── Character Outfit Teaser ── */}
        <CharacterOutfitTeaser
          pairId={activePair.id}
          cuisineId={cuisine ?? ''}
        />

        {/* ── Not ready note ── */}
        <View style={styles.note}>
          <Text style={styles.noteText}>
            Not ready? No pressure — you can always explore this cuisine later.
          </Text>
        </View>

        {/* ── CTAs ── */}
        <PrimaryButton
          label="Add to this week's plan"
          onPress={() => {
            // TODO: Add recipe to meal plan
            router.back()
          }}
        />

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
    gap: spacing[4],
  },

  section: {
    gap: spacing[3],
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.gray[900],
  },

  loadingText: {
    ...typography.body,
    color: colors.gray[400],
    textAlign: 'center',
    paddingVertical: spacing[4],
  },

  note: {
    backgroundColor: colors.gray[100],
    borderRadius: radius.lg,
    padding: spacing[4],
  },
  noteText: {
    ...typography.body,
    color: colors.gray[600],
    textAlign: 'center',
  },
})
