// S2 — Child Profile Setup
// Figma: P01-S2 | Auth required: Yes
import { useState } from 'react'
import {
  ScrollView, View, Text, StyleSheet, Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import {
  collection, doc, setDoc, serverTimestamp, writeBatch,
} from 'firebase/firestore'
import { db } from '@/services/firebase'
import { useAuthStore } from '@/store/auth.store'
import { useCharacterStore } from '@/store/character.store'
import { colors, spacing, radius, typography } from '@/constants/tokens'
import { CHARACTER_PAIR_ORDER } from '@/constants/characters'
import { CharacterPairId } from '@/types/character'
import { Allergy } from '@/types/child'
import { ProgressDots } from '@/components/ui/ProgressDots'
import { PrimaryButton } from '@/components/ui/PrimaryButton'
import { AllergyChip } from '@/components/ui/AllergyChip'
import { ChildCard } from '@/components/profile/ChildCard'
import { AddChildField } from '@/components/profile/AddChildField'
import { CharacterPickerCard } from '@/components/character/CharacterPickerCard'

const ALLERGIES: Allergy[] = [
  'nuts', 'dairy', 'gluten', 'eggs', 'soy', 'shellfish', 'fish', 'sesame',
]

interface ChildDraft {
  id:        string
  name:      string
  age:       number
  allergies: Allergy[]
}

export default function ProfileSetupScreen() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { setActivePairId, setUnlockedPairs } = useCharacterStore()

  const [children, setChildren]             = useState<ChildDraft[]>([])
  const [selectedAllergies, setAllergies]   = useState<Allergy[]>([])
  const [selectedPair, setSelectedPair]     = useState<CharacterPairId>('marco-lily')
  const [saving, setSaving]                 = useState(false)

  // ── Children ────────────────────────────────────────────────────────────────

  function addChild(name: string, age: number) {
    setChildren((prev) => [
      ...prev,
      { id: `${Date.now()}`, name, age, allergies: selectedAllergies },
    ])
  }

  function removeChild(id: string) {
    setChildren((prev) => prev.filter((c) => c.id !== id))
  }

  function toggleAllergy(allergen: Allergy) {
    setAllergies((prev) =>
      prev.includes(allergen)
        ? prev.filter((a) => a !== allergen)
        : [...prev, allergen],
    )
  }

  // ── Save & navigate ──────────────────────────────────────────────────────────

  async function handleNext() {
    if (!user) return
    if (children.length === 0) {
      Alert.alert('Add a child', 'Please add at least one child to continue.')
      return
    }

    setSaving(true)
    try {
      const batch = writeBatch(db)

      // Write each child document
      for (const child of children) {
        const childRef = doc(collection(db, 'users', user.uid, 'children'))
        batch.set(childRef, {
          childId:   childRef.id,
          name:      child.name,
          age:       child.age,
          allergies: selectedAllergies,   // shared across all children for now
          createdAt: serverTimestamp(),
        })
      }

      // Write unlocks — starter pair chosen here
      const unlocksRef = doc(db, 'users', user.uid, 'unlocks', user.uid)
      batch.set(unlocksRef, {
        userId:        user.uid,
        updatedAt:     serverTimestamp(),
        unlockedPairs: [selectedPair],
        starterPair:   selectedPair,
        milestones: {
          mealsCooked:    0,
          cuisinesTried:  0,
          passportStamps: 0,
        },
      })

      await batch.commit()

      // Update local stores
      setActivePairId(selectedPair)
      setUnlockedPairs([selectedPair])

      router.push('/(auth)/taste-quiz')
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
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.heading}>Who are we cooking for?</Text>
          <Text style={styles.sub}>
            Add the children you're cooking for. Allergies apply to all children.
          </Text>
        </View>

        {/* ── Children ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Children</Text>
          <View style={styles.childList}>
            {children.map((child) => (
              <ChildCard
                key={child.id}
                name={child.name}
                age={child.age}
                onRemove={() => removeChild(child.id)}
              />
            ))}
            <AddChildField onAdd={addChild} />
          </View>
        </View>

        {/* ── Allergies ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Allergies & intolerances</Text>
          <Text style={styles.sectionHint}>
            Recipes containing these will never be suggested. Safety first.
          </Text>
          <View style={styles.chipWrap}>
            {ALLERGIES.map((allergen) => (
              <AllergyChip
                key={allergen}
                allergen={allergen}
                selected={selectedAllergies.includes(allergen)}
                onToggle={toggleAllergy}
              />
            ))}
          </View>
          {selectedAllergies.length === 0 && (
            <Text style={styles.noAllergies}>No allergies — tap any that apply</Text>
          )}
        </View>

        {/* ── Character picker ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Choose your cooking companions</Text>
          <Text style={styles.sectionHint}>
            They'll guide you through every recipe. You can unlock more later.
          </Text>
          <View style={styles.characterList}>
            {CHARACTER_PAIR_ORDER.map((pairId) => (
              <CharacterPickerCard
                key={pairId}
                pairId={pairId}
                selected={selectedPair === pairId}
                onSelect={setSelectedPair}
              />
            ))}
          </View>
        </View>

        {/* ── CTA ── */}
        <PrimaryButton
          label="Next"
          onPress={handleNext}
          loading={saving}
          disabled={children.length === 0}
          style={styles.cta}
        />

        {children.length === 0 && (
          <Text style={styles.ctaHint}>Add at least one child to continue</Text>
        )}

        {/* ── Progress dots ── */}
        <View style={styles.dots}>
          <ProgressDots total={3} current={1} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: colors.linen },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[12],
    gap: spacing[6],
  },

  // ── Header ──────────────────────────────────────────────────────────────────
  header: { paddingTop: spacing[6] },
  heading: {
    ...typography.display,
    color: colors.gray[900],
    marginBottom: spacing[2],
  },
  sub: {
    ...typography.body,
    color: colors.gray[600],
  },

  // ── Sections ────────────────────────────────────────────────────────────────
  section:      { gap: spacing[3] },
  sectionLabel: {
    ...typography.h2,
    color: colors.gray[900],
  },
  sectionHint: {
    ...typography.bodySm,
    color: colors.gray[600],
    marginTop: -spacing[1],
  },

  // ── Children ────────────────────────────────────────────────────────────────
  childList: { gap: spacing[2] },

  // ── Allergies ───────────────────────────────────────────────────────────────
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  noAllergies: {
    ...typography.bodySm,
    color: colors.gray[400],
    fontStyle: 'italic',
  },

  // ── Characters ──────────────────────────────────────────────────────────────
  characterList: { gap: spacing[2] },

  // ── CTA ─────────────────────────────────────────────────────────────────────
  cta:     { marginTop: spacing[2] },
  ctaHint: {
    ...typography.bodySm,
    color: colors.gray[400],
    textAlign: 'center',
    marginTop: -spacing[2],
  },

  // ── Dots ────────────────────────────────────────────────────────────────────
  dots: { paddingBottom: spacing[4] },
})
