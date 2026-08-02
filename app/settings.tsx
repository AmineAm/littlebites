// Settings — reached from the gear icon on Today, not a tab.
//
// Holds everything onboarding deliberately did not ask for: adventure level and
// home cuisine, plus corrections to the child profile.

import { useState } from 'react'
import {
  ScrollView, View, Text, TextInput, Pressable, StyleSheet, Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { colors, spacing, radius, typography, touchTarget } from '@/constants/tokens'
import { useProfileStore, AdventureLevel } from '@/store/profile.store'
import { useCharacterStore } from '@/store/character.store'
import { usePlannerStore } from '@/store/planner.store'
import { usePreferencesStore } from '@/store/preferences.store'
import { useUnlock } from '@/hooks/useUnlock'
import { CHARACTER_PAIRS, CHARACTER_PAIR_ORDER } from '@/constants/characters'
import { CUISINES } from '@/constants/cuisines'
import { AgeBand, Allergy } from '@/types/child'
import { CuisineId, CharacterPairId } from '@/types/character'
import { AllergyChip } from '@/components/ui/AllergyChip'
import { CuisinePickerChip } from '@/components/profile/CuisinePickerChip'
import { AdventureLevelSelector } from '@/components/profile/AdventureLevelSelector'

const AGE_BANDS: AgeBand[] = ['2-4', '5-8', '9-12']
const ALLERGIES: Allergy[] = [
  'nuts', 'dairy', 'gluten', 'eggs', 'soy', 'shellfish', 'fish', 'sesame',
]

export default function SettingsScreen() {
  const router = useRouter()

  const child          = useProfileStore((s) => s.child)
  const settings       = useProfileStore((s) => s.settings)
  const updateChild    = useProfileStore((s) => s.updateChild)
  const setAllergies   = useProfileStore((s) => s.setAllergies)
  const updateSettings = useProfileStore((s) => s.updateSettings)
  const resetProfile   = useProfileStore((s) => s.reset)

  const activePairId    = useCharacterStore((s) => s.activePairId)
  const setActivePairId = useCharacterStore((s) => s.setActivePairId)
  const resetCharacter  = useCharacterStore((s) => s.reset)
  const resetPlanner    = usePlannerStore((s) => s.reset)
  const resetPrefs      = usePreferencesStore((s) => s.reset)

  const { unlockedPairs } = useUnlock()
  const [name, setName] = useState(child?.name ?? '')

  function handleReset() {
    Alert.alert(
      'Start over?',
      'This erases your plan, passport stamps, unlocked characters and preferences. It cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Erase everything',
          style: 'destructive',
          onPress: () => {
            resetPlanner()
            resetPrefs()
            resetCharacter()
            resetProfile()          // clears onboardingComplete → back to onboarding
          },
        },
      ],
    )
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.heading}>Settings</Text>
          <Pressable onPress={() => router.back()} hitSlop={12} accessibilityRole="button">
            <Text style={styles.done}>Done</Text>
          </Pressable>
        </View>

        {/* ── Child ── */}
        <Section title="Their name">
          <TextInput
            style={styles.input}
            placeholder="Optional"
            placeholderTextColor={colors.gray[400]}
            value={name}
            onChangeText={setName}
            onBlur={() => updateChild({ name: name.trim() || undefined })}
            returnKeyType="done"
            maxLength={24}
          />
        </Section>

        <Section title="Age">
          <View style={styles.row}>
            {AGE_BANDS.map((band) => {
              const selected = child?.ageBand === band
              return (
                <Pressable
                  key={band}
                  style={[styles.pill, selected && styles.pillOn]}
                  onPress={() => updateChild({ ageBand: band })}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                >
                  <Text style={[styles.pillText, selected && styles.pillTextOn]}>{band}</Text>
                </Pressable>
              )
            })}
          </View>
        </Section>

        <Section title="Allergies" hint="Recipes containing these are never suggested.">
          <View style={styles.wrap}>
            {ALLERGIES.map((a) => (
              <AllergyChip
                key={a}
                allergen={a}
                selected={child?.allergies.includes(a) ?? false}
                onToggle={(allergen) => {
                  const current = child?.allergies ?? []
                  setAllergies(
                    current.includes(allergen)
                      ? current.filter((x) => x !== allergen)
                      : [...current, allergen],
                  )
                }}
              />
            ))}
          </View>
        </Section>

        {/* ── Tuning ── */}
        <Section title="Adventure level" hint="How bold should the suggestions be?">
          <AdventureLevelSelector
            value={settings.adventureLevel}
            onChange={(level: AdventureLevel) => updateSettings({ adventureLevel: level })}
          />
        </Section>

        <Section title="Home cuisine" hint="What your family cooks most — your familiar anchor.">
          <View style={styles.wrap}>
            {Object.values(CUISINES).map((cuisine) => (
              <CuisinePickerChip
                key={cuisine.cuisineId}
                cuisine={cuisine}
                selected={settings.homeCuisine === cuisine.cuisineId}
                onPress={(id) =>
                  updateSettings({
                    homeCuisine: settings.homeCuisine === id ? undefined : (id as CuisineId),
                  })
                }
              />
            ))}
          </View>
        </Section>

        {/* ── Characters ── */}
        <Section title="Cooking companions" hint="Unlock more by cooking together.">
          <View style={styles.stack}>
            {CHARACTER_PAIR_ORDER.map((pairId) => {
              const pair     = CHARACTER_PAIRS[pairId]
              const unlocked = unlockedPairs.includes(pairId)
              const active   = activePairId === pairId

              return (
                <Pressable
                  key={pairId}
                  style={[
                    styles.pairRow,
                    active && { borderColor: pair.accentColor, backgroundColor: pair.accentBg },
                    !unlocked && styles.pairLocked,
                  ]}
                  disabled={!unlocked}
                  onPress={() => setActivePairId(pairId as CharacterPairId)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: active, disabled: !unlocked }}
                >
                  <View style={[styles.pairSwatch, { backgroundColor: pair.accentColor }]}>
                    <Text style={styles.pairSwatchText}>
                      {unlocked ? pair.displayName.charAt(0) : '🔒'}
                    </Text>
                  </View>
                  <View style={styles.pairInfo}>
                    <Text style={styles.pairName}>{pair.displayName}</Text>
                    <Text style={styles.pairTagline}>
                      {unlocked ? pair.tagline : 'Keep cooking to unlock'}
                    </Text>
                  </View>
                  {active && <Text style={styles.pairActive}>Active</Text>}
                </Pressable>
              )
            })}
          </View>
        </Section>

        {/* ── Danger ── */}
        <Section title="Start over">
          <Text style={styles.dangerHint}>
            Everything lives on this device — there is no account and no backup.
          </Text>
          <Pressable style={styles.danger} onPress={handleReset} accessibilityRole="button">
            <Text style={styles.dangerText}>Erase all data</Text>
          </Pressable>
        </Section>
      </ScrollView>
    </SafeAreaView>
  )
}

function Section({
  title, hint, children,
}: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {hint && <Text style={styles.sectionHint}>{hint}</Text>}
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.linen },
  content: {
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[12],
    gap: spacing[6],
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing[6],
  },
  heading: { ...typography.display, color: colors.gray[900] },
  done:    { ...typography.h2, color: colors.coral[400] },

  section:      { gap: spacing[3] },
  sectionTitle: { ...typography.h2, color: colors.gray[900] },
  sectionHint:  { ...typography.bodySm, color: colors.gray[600], marginTop: -spacing[2] },

  input: {
    minHeight: touchTarget.min,
    borderWidth: 1,
    borderColor: colors.gray[100],
    borderRadius: radius.md,
    paddingHorizontal: spacing[4],
    ...typography.bodyLg,
    color: colors.gray[900],
    backgroundColor: colors.white,
  },

  row:   { flexDirection: 'row', gap: spacing[2] },
  wrap:  { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] },
  stack: { gap: spacing[2] },

  pill: {
    flex: 1,
    minHeight: touchTarget.min,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.gray[100],
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillOn:     { borderColor: colors.teal[400], backgroundColor: colors.teal[50] },
  pillText:   { ...typography.h2, color: colors.gray[900] },
  pillTextOn: { color: colors.teal[800] },

  pairRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    borderWidth: 2,
    borderColor: colors.gray[100],
    borderRadius: radius.lg,
    padding: spacing[3],
    backgroundColor: colors.white,
    minHeight: touchTarget.min,
  },
  pairLocked: { opacity: 0.5 },
  pairSwatch: {
    width: 44, height: 44, borderRadius: radius.full,
    alignItems: 'center', justifyContent: 'center',
  },
  pairSwatchText: { ...typography.h2, color: colors.white },
  pairInfo:       { flex: 1 },
  pairName:       { ...typography.h2, color: colors.gray[900] },
  pairTagline:    { ...typography.bodySm, color: colors.gray[600], marginTop: 2 },
  pairActive:     { ...typography.label, color: colors.coral[400] },

  dangerHint: { ...typography.bodySm, color: colors.gray[600] },
  danger: {
    minHeight: touchTarget.min,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.coral[400],
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.coral[50],
  },
  dangerText: { ...typography.h2, color: colors.coral[800] },
})
