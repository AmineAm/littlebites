// S9 — Guided Prep Mode
// Figma: P01-S9 | Auth required: Yes
import { useState, useRef } from 'react'
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { colors, spacing, radius, typography } from '@/constants/tokens'
import { useCharacter } from '@/hooks/useCharacter'
import { getRecipe } from '@/data/recipes'
import { useCharacterStore } from '@/store/character.store'
import { usePreferencesStore } from '@/store/preferences.store'
import { useUnlock } from '@/hooks/useUnlock'
import { PrepHeader } from '@/components/recipe/PrepHeader'
import { StepCard } from '@/components/recipe/StepCard'
import { PrepTimer } from '@/components/recipe/PrepTimer'
import { TipBar } from '@/components/recipe/TipBar'
import { PrimaryButton } from '@/components/ui/PrimaryButton'

export default function CookScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const { activePair } = useCharacter()
  const recordMealCooked  = useCharacterStore((s) => s.recordMealCooked)
  const recordMealVerdict = usePreferencesStore((s) => s.recordMealVerdict)
  const { unlockedPairs } = useUnlock()

  // Synchronous — recipes are bundled, so there is nothing to await.
  const recipe = id ? getRecipe(id) : null

  const [currentStep, setCurrentStep] = useState(1)
  const [complete, setComplete]       = useState(false)
  const [verdict, setVerdict]         = useState<boolean | null>(null)
  const pairsBefore = useRef<string[]>(unlockedPairs)

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

  function handleNext() {
    if (!isLastStep) {
      setCurrentStep((prev) => prev + 1)
      return
    }
    // Client-side now — no Cloud Function. See CLAUDE.md § Known constraints.
    pairsBefore.current = unlockedPairs
    if (recipe) recordMealCooked(recipe.cuisineId)
    setComplete(true)
  }

  /** One tap, skippable. This replaces the upfront taste quiz. */
  function handleVerdict(likedIt: boolean) {
    if (!recipe) return
    setVerdict(likedIt)
    recordMealVerdict(recipe, likedIt)
  }

  function finish() {
    // A pair that appeared during this cook gets its reveal screen.
    const newPair = unlockedPairs.find((p) => !pairsBefore.current.includes(p))
    router.replace(newPair ? `/unlock/${newPair}` : '/(tabs)')
  }

  if (complete) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.completeContainer}>
          <Text style={styles.completeEmoji}>🎉</Text>
          <Text style={styles.completeTitle}>Meal complete!</Text>
          <Text style={styles.completeSub}>You cooked {recipe.title}.</Text>

          {verdict === null ? (
            <View style={styles.verdictBlock}>
              <Text style={styles.verdictQuestion}>Did they like it?</Text>
              <View style={styles.verdictRow}>
                <Pressable
                  style={styles.verdictButton}
                  onPress={() => handleVerdict(true)}
                  accessibilityRole="button"
                  accessibilityLabel="They liked it"
                >
                  <Text style={styles.verdictEmoji}>👍</Text>
                </Pressable>
                <Pressable
                  style={styles.verdictButton}
                  onPress={() => handleVerdict(false)}
                  accessibilityRole="button"
                  accessibilityLabel="They did not like it"
                >
                  <Text style={styles.verdictEmoji}>👎</Text>
                </Pressable>
              </View>
              <Pressable onPress={finish} hitSlop={8} accessibilityRole="button">
                <Text style={styles.verdictSkip}>Skip</Text>
              </Pressable>
            </View>
          ) : (
            <Text style={styles.verdictThanks}>
              {verdict ? "Noted — we'll suggest more like this." : "Noted — we'll steer away from this."}
            </Text>
          )}

          <PrimaryButton label="Done" onPress={finish} style={styles.completeCta} />
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
  verdictBlock:    { alignItems: 'center', gap: spacing[3], marginTop: spacing[6] },
  verdictQuestion: { ...typography.h1, color: colors.gray[900] },
  verdictRow:      { flexDirection: 'row', gap: spacing[4] },
  verdictButton: {
    width: 88, height: 88, borderRadius: radius.full,
    backgroundColor: colors.white, borderWidth: 2, borderColor: colors.gray[100],
    alignItems: 'center', justifyContent: 'center',
  },
  verdictEmoji:  { fontSize: 40 },
  verdictSkip:   { ...typography.body, color: colors.gray[600] },
  verdictThanks: { ...typography.body, color: colors.teal[800], marginTop: spacing[6] },

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
