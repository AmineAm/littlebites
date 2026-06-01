// S2 — Child Profile Setup (merged with S4 Adventure Level)
// Figma: P01-S2 | Auth required: Yes
//
// Mandatory fields: child name, child age, character pair.
// Optional fields:  allergies, adventure level, home cuisine.
//
// Layout: single scroll, sections clearly labelled "Required" vs "Optional".

import { useState } from 'react'
import {
  ScrollView, View, Text, StyleSheet, Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import {
  collection, doc, serverTimestamp, writeBatch,
} from 'firebase/firestore'
import { db } from '@/services/firebase'
import { useAuthStore } from '@/store/auth.store'
import { useCharacterStore } from '@/store/character.store'
import { colors, spacing, radius, typography } from '@/constants/tokens'
import { CHARACTER_PAIR_ORDER } from '@/constants/characters'
import { CUISINES } from '@/constants/cuisines'
import { CharacterPairId, CuisineId } from '@/types/character'
import { Allergy } from '@/types/child'
import { PrimaryButton } from '@/components/ui/PrimaryButton'
import { Toggle } from '@/components/ui/Toggle'
import { AllergyChip } from '@/components/ui/AllergyChip'
import { ChildCard } from '@/components/profile/ChildCard'
import { AddChildField } from '@/components/profile/AddChildField'
import { CharacterPickerCard } from '@/components/character/CharacterPickerCard'
import {
  AdventureLevelSelector, AdventureLevel,
} from '@/components/profile/AdventureLevelSelector'
import { CuisinePickerChip } from '@/components/profile/CuisinePickerChip'

const ALLERGIES: Allergy[] = [
  'nuts', 'dairy', 'gluten', 'eggs', 'soy', 'shellfish', 'fish', 'sesame',
]

interface ChildDraft {
  id:   string
  name: string
  age:  number
}

export default function ProfileSetupScreen() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { setActivePairId, setUnlockedPairs } = useCharacterStore()

  // ── Required ─────────────────────────────────────────────────────────────────
  const [children, setChildren]         = useState<ChildDraft[]>([])
  const [selectedPair, setSelectedPair] = useState<CharacterPairId>('marco-lily')

  // ── Optional ────────────────────────────────────────────────────────────────
  const [noAllergies, setNoAllergies]         = useState(false)
  const [allergies, setAllergiesState]        = useState<Allergy[]>([])
  const [adventureLevel, setAdventureLevel]   = useState<AdventureLevel>('curious')
  const [homeCuisine, setHomeCuisine]         = useState<CuisineId | ''>('')

  const [saving, setSaving] = useState(false)

  // ── Handlers ────────────────────────────────────────────────────────────────

  function addChild(name: string, age: number) {
    setChildren((prev) => [...prev, { id: `${Date.now()}`, name, age }])
  }

  function removeChild(id: string) {
    setChildren((prev) => prev.filter((c) => c.id !== id))
  }

  function toggleAllergy(a: Allergy) {
    setNoAllergies(false)
    setAllergiesState((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a],
    )
  }

  function handleNoAllergiesToggle(next: boolean) {
    setNoAllergies(next)
    if (next) setAllergiesState([])
  }

  // ── Save ────────────────────────────────────────────────────────────────────

  async function handleContinue() {
    if (!user) return
    if (children.length === 0) {
      Alert.alert('Add a child', 'Please add at least one child to continue.')
      return
    }

    setSaving(true)
    try {
      const batch = writeBatch(db)

      // Children — one document each
      for (const child of children) {
        const childRef = doc(collection(db, 'users', user.uid, 'children'))
        batch.set(childRef, {
          childId:   childRef.id,
          name:      child.name,
          age:       child.age,
          allergies: allergies,
          createdAt: serverTimestamp(),
        })
      }

      // User doc — adventure level + home cuisine
      const userRef = doc(db, 'users', user.uid)
      batch.update(userRef, {
        activeCharacter: selectedPair,
        adventureLevel:  adventureLevel,
        homeCuisine:     homeCuisine,
        updatedAt:       serverTimestamp(),
      })

      // Unlocks — starter pair only
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

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ───────────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <Text style={styles.heading}>Tell us about your child</Text>
          <Text style={styles.sub}>
            The more we know, the better the meal suggestions. Most fields are optional.
          </Text>
        </View>

        {/* ── Required: Children ───────────────────────────────────────────── */}
        <Section title="Children" required>
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
        </Section>

        {/* ── Required: Character pair ─────────────────────────────────────── */}
        <Section title="Cooking companions" required>
          <Text style={styles.hint}>
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
        </Section>

        {/* ── Optional: Allergies ──────────────────────────────────────────── */}
        <Section title="Allergies & intolerances">
          <Text style={styles.hint}>
            Recipes containing these will never be suggested. Safety first.
          </Text>
          <Toggle
            label="No known allergies"
            value={noAllergies}
            onChange={handleNoAllergiesToggle}
          />
          {!noAllergies && (
            <View style={styles.chipWrap}>
              {ALLERGIES.map((a) => (
                <AllergyChip
                  key={a}
                  allergen={a}
                  selected={allergies.includes(a)}
                  onToggle={toggleAllergy}
                />
              ))}
            </View>
          )}
        </Section>

        {/* ── Optional: Adventure level ────────────────────────────────────── */}
        <Section title="Adventure level">
          <Text style={styles.hint}>
            How bold should the suggestions be? You can change this any time.
          </Text>
          <AdventureLevelSelector
            value={adventureLevel}
            onChange={setAdventureLevel}
          />
        </Section>

        {/* ── Optional: Home cuisine ───────────────────────────────────────── */}
        <Section title="Home cuisine">
          <Text style={styles.hint}>
            The cuisine your family cooks most at home — your "familiar" anchor.
          </Text>
          <View style={styles.chipWrap}>
            {Object.values(CUISINES).map((cuisine) => (
              <CuisinePickerChip
                key={cuisine.cuisineId}
                cuisine={cuisine}
                selected={homeCuisine === cuisine.cuisineId}
                onPress={(id) =>
                  setHomeCuisine((prev) => (prev === id ? '' : (id as CuisineId)))
                }
              />
            ))}
          </View>
        </Section>

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
        <PrimaryButton
          label="Continue"
          onPress={handleContinue}
          loading={saving}
          disabled={children.length === 0}
          style={styles.cta}
        />

        {children.length === 0 && (
          <Text style={styles.ctaHint}>Add at least one child to continue</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

// ── Section wrapper ────────────────────────────────────────────────────────────

function Section({
  title, required, children,
}: {
  title:     string
  required?: boolean
  children:  React.ReactNode
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {required
          ? <Text style={styles.required}>Required</Text>
          : <Text style={styles.optional}>Optional</Text>
        }
      </View>
      {children}
    </View>
  )
}

// ── Styles ─────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: colors.linen },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[12],
    gap: spacing[6],
  },

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

  section: { gap: spacing[3] },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.gray[900],
  },
  required: {
    ...typography.label,
    color: colors.coral[400],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  optional: {
    ...typography.label,
    color: colors.gray[400],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  hint: {
    ...typography.bodySm,
    color: colors.gray[600],
  },

  childList:     { gap: spacing[2] },
  characterList: { gap: spacing[2] },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },

  cta:     { marginTop: spacing[4] },
  ctaHint: {
    ...typography.bodySm,
    color: colors.gray[400],
    textAlign: 'center',
    marginTop: -spacing[2],
  },
})
