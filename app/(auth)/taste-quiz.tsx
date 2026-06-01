// S3 — Taste Preference Quiz (optional)
// Figma: P01-S3 | Auth required: Yes
//
// Designed for kids to do — hand them the phone. Skippable from the top right.
// Onboarding is marked complete on either Finish or Skip.

import { useState } from 'react'
import {
  ScrollView, View, Text, Pressable, StyleSheet, Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/services/firebase'
import { useAuthStore } from '@/store/auth.store'
import { colors, spacing, radius, typography } from '@/constants/tokens'
import { FOODS } from '@/constants/foods'
import { PrimaryButton } from '@/components/ui/PrimaryButton'

type FoodState = 'liked' | 'disliked' | 'neutral'

const MIN_TO_FINISH = 8

export default function TasteQuizScreen() {
  const router = useRouter()
  const { user } = useAuthStore()

  const [states, setStates] = useState<Record<string, FoodState>>({})
  const [saving, setSaving] = useState(false)

  function cycle(foodId: string) {
    setStates((prev) => {
      const current = prev[foodId] ?? 'neutral'
      const next: FoodState =
        current === 'neutral'  ? 'liked'
      : current === 'liked'    ? 'disliked'
      :                          'neutral'
      return { ...prev, [foodId]: next }
    })
  }

  const ratedCount = Object.values(states).filter((s) => s !== 'neutral').length
  const canFinish  = ratedCount >= MIN_TO_FINISH

  async function completeOnboarding(savePrefs: boolean) {
    if (!user) return
    setSaving(true)
    try {
      const liked    = Object.entries(states).filter(([_, s]) => s === 'liked').map(([id]) => id)
      const disliked = Object.entries(states).filter(([_, s]) => s === 'disliked').map(([id]) => id)

      if (savePrefs && (liked.length > 0 || disliked.length > 0)) {
        // Single shared preferences doc — keyed by user for now.
        // (Per-child preferences come later when child switcher ships.)
        const prefRef = doc(db, 'users', user.uid, 'preferences', user.uid)
        await setDoc(prefRef, {
          childId:        user.uid,
          updatedAt:      serverTimestamp(),
          liked,
          disliked,
          cuisineHistory: {},
          recipeScores:   {},
        })
      }

      // Mark onboarding complete on the user doc
      await updateDoc(doc(db, 'users', user.uid), {
        onboardingComplete: true,
        updatedAt:          serverTimestamp(),
      })

      router.replace('/(tabs)/')
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Could not save. Please try again.'
      Alert.alert('Error', msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header with Skip ─────────────────────────────────────────────── */}
        <View style={styles.headerRow}>
          <View style={styles.headerText}>
            <Text style={styles.heading}>What do they like?</Text>
            <Text style={styles.sub}>
              Tap each food: ♡ likes, ✕ dislikes. Skip any you're not sure about.
            </Text>
          </View>
          <Pressable onPress={() => completeOnboarding(false)} hitSlop={8}>
            <Text style={styles.skip}>Skip</Text>
          </Pressable>
        </View>

        {/* ── Progress ─────────────────────────────────────────────────────── */}
        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>
            {ratedCount} of {FOODS.length} rated
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min(100, (ratedCount / MIN_TO_FINISH) * 100)}%` },
              ]}
            />
          </View>
        </View>

        {/* ── Food grid ────────────────────────────────────────────────────── */}
        <View style={styles.grid}>
          {FOODS.map((food) => {
            const state = states[food.id] ?? 'neutral'
            return (
              <Pressable
                key={food.id}
                style={[styles.chip, chipStyleFor(state)]}
                onPress={() => cycle(food.id)}
                accessibilityRole="button"
                accessibilityLabel={`${food.label}, currently ${state}`}
              >
                <Text style={styles.emoji}>{food.emoji}</Text>
                <Text style={[styles.chipLabel, labelStyleFor(state)]}>
                  {food.label}
                </Text>
                <Text style={styles.icon}>{iconFor(state)}</Text>
              </Pressable>
            )
          })}
        </View>

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
        <PrimaryButton
          label={canFinish ? 'Finish' : `Rate ${MIN_TO_FINISH - ratedCount} more`}
          onPress={() => completeOnboarding(true)}
          loading={saving}
          disabled={!canFinish}
          style={styles.cta}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

function chipStyleFor(state: FoodState) {
  if (state === 'liked')    return { backgroundColor: colors.teal[50],  borderColor: colors.teal[400] }
  if (state === 'disliked') return { backgroundColor: colors.coral[50], borderColor: colors.coral[400] }
  return { backgroundColor: colors.white, borderColor: colors.gray[100] }
}

function labelStyleFor(state: FoodState) {
  if (state === 'liked')    return { color: colors.teal[800],  fontWeight: '500' as const }
  if (state === 'disliked') return { color: colors.coral[800], fontWeight: '500' as const }
  return { color: colors.gray[900] }
}

function iconFor(state: FoodState): string {
  if (state === 'liked')    return '♡'
  if (state === 'disliked') return '✕'
  return '○'
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: colors.linen },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[12],
    gap: spacing[6],
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: spacing[6],
    gap: spacing[4],
  },
  headerText: { flex: 1 },
  heading: {
    ...typography.display,
    color: colors.gray[900],
    marginBottom: spacing[2],
  },
  sub: {
    ...typography.body,
    color: colors.gray[600],
  },
  skip: {
    ...typography.body,
    color: colors.coral[400],
    paddingTop: spacing[2],
  },

  progressRow: { gap: spacing[2] },
  progressLabel: {
    ...typography.bodySm,
    color: colors.gray[600],
  },
  progressBar: {
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.gray[100],
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.coral[400],
    borderRadius: radius.pill,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  chip: {
    flexBasis: '47%',
    flexGrow: 1,
    borderWidth: 1.5,
    borderRadius: radius.lg,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[3],
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    minHeight: 56,
  },
  emoji: { fontSize: 22 },
  chipLabel: {
    ...typography.bodyLg,
    flex: 1,
  },
  icon: {
    fontSize: 18,
    color: colors.gray[400],
  },

  cta: { marginTop: spacing[4] },
})
