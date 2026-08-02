// S9 — Guided Prep Mode
// Figma: P01-S9 | Auth required: Yes
import { useState, useEffect } from 'react'
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { colors, spacing, radius, typography } from '@/constants/tokens'
import { useCharacter } from '@/hooks/useCharacter'
import { getRecipe } from '@/services/recipes'
import { recordMealComplete } from '@/services/unlock'
import { useAuthStore } from '@/store/auth.store'
import { Recipe } from '@/types/recipe'
import { PrepHeader } from '@/components/recipe/PrepHeader'
import { StepCard } from '@/components/recipe/StepCard'
import { PrepTimer } from '@/components/recipe/PrepTimer'
import { TipBar } from '@/components/recipe/TipBar'
import { PrimaryButton } from '@/components/ui/PrimaryButton'

export default function CookScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const { activePair } = useCharacter()
  const user = useAuthStore((s) => s.user)
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [complete, setComplete] = useState(false)

  useEffect(() => {
    if (!id) return
    getRecipe(id).then(setRecipe)
  }, [id])

  if (!recipe) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.loadingText}>Loading recipe...</Text>
        </View>
      </SafeAreaView>
    )
  }

  const step = recipe?.steps.find((s) => s.stepNumber === currentStep) ?? null
  const isLastStep = currentStep >= (recipe?.steps.length ?? 0)

  function handleBack() {
    if (currentStep === 1) {
      Alert.alert(
        'Leave cooking?',
        'Are you sure you want to leave? Your progress won\'t be saved.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Leave', style: 'destructive', onPress: () => router.back() },
        ],
      )
    } else {
      setCurrentStep((prev) => prev - 1)
    }
  }

  async function handleNext() {
    if (isLastStep) {
      setComplete(true)
      if (user && recipe) {
        try {
          await recordMealComplete({
            userId: user.uid,
            childId: user.uid,
            recipeId: recipe.recipeId,
            cuisineId: recipe.cuisineId,
          })
        } catch (e) {
          console.error('Failed to record meal complete:', e)
        }
      }
    } else {
      setCurrentStep((prev) => prev + 1)
    }
  }

  if (complete) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.completeContainer}>
          <Text style={styles.completeEmoji}>🎉</Text>
          <Text style={styles.completeTitle}>Meal complete!</Text>
          <Text style={styles.completeSub}>
            Great job cooking {recipe.title}!
          </Text>
          <PrimaryButton
            label="Back to home"
            onPress={() =>           router.replace('/(tabs)/' as any)}
            style={styles.completeCta}
          />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <PrepHeader
        recipeName={recipe.title}
        stepNumber={currentStep}
        totalSteps={recipe.steps.length}
        onBack={handleBack}
      />

      <View style={styles.content}>
        {step && (
          <StepCard
            instruction={step.instruction}
            kidPrompt={step.kidParticipation}
            characterPairId={activePair.id}
          />
        )}

        {step?.timerSeconds && (
          <PrepTimer
            seconds={step.timerSeconds}
            onComplete={() => {}}
          />
        )}
      </View>

      {step?.kidParticipation && !step.timerSeconds && (
        <TipBar tip="Let your little chef help with this step!" />
      )}

      <View style={styles.nav}>
        <PrimaryButton
          label={isLastStep ? 'Meal complete! 🎉' : 'Next step →'}
          onPress={handleNext}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.linen,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...typography.body,
    color: colors.gray[600],
  },
  content: {
    flex: 1,
  },
  nav: {
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[6],
  },

  completeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[6],
  },
  completeEmoji: {
    fontSize: 64,
    marginBottom: spacing[4],
  },
  completeTitle: {
    ...typography.display,
    color: colors.gray[900],
    marginBottom: spacing[2],
  },
  completeSub: {
    ...typography.body,
    color: colors.gray[600],
    marginBottom: spacing[8],
  },
  completeCta: {
    width: '100%',
  },
})
