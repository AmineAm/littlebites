// Onboarding — the whole thing. One screen, roughly three taps.
//
// Everything here is tap-only except the optional name. Adventure level and
// home cuisine deliberately live in Settings instead: nobody knows what
// "adventure level" means before they have used the app once.

import { useState } from 'react'
import {
  ScrollView, View, Text, TextInput, Pressable, StyleSheet,
  KeyboardAvoidingView, Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useProfileStore } from '@/store/profile.store'
import { useCharacterStore } from '@/store/character.store'
import { colors, spacing, radius, typography, touchTarget } from '@/constants/tokens'
import { CHARACTER_PAIR_ORDER } from '@/constants/characters'
import { CharacterPairId } from '@/types/character'
import { AgeBand, Allergy } from '@/types/child'
import { PrimaryButton } from '@/components/ui/PrimaryButton'
import { AllergyChip } from '@/components/ui/AllergyChip'
import { CharacterPickerCard } from '@/components/character/CharacterPickerCard'

const AGE_BANDS: Array<{ band: AgeBand; label: string; emoji: string }> = [
  { band: '2-4',  label: '2–4',  emoji: '🧸' },
  { band: '5-8',  label: '5–8',  emoji: '🎨' },
  { band: '9-12', label: '9–12', emoji: '🚀' },
]

const ALLERGIES: Allergy[] = [
  'nuts', 'dairy', 'gluten', 'eggs', 'soy', 'shellfish', 'fish', 'sesame',
]

export default function OnboardingScreen() {
  const router = useRouter()
  const setChild      = useProfileStore((s) => s.setChild)
  const completeOnboarding = useProfileStore((s) => s.completeOnboarding)
  const setStarterPair = useCharacterStore((s) => s.setStarterPair)

  const [pairId, setPairId]       = useState<CharacterPairId>('marco-lily')
  const [ageBand, setAgeBand]     = useState<AgeBand>('5-8')
  const [allergies, setAllergies] = useState<Allergy[]>([])
  const [name, setName]           = useState('')

  function toggleAllergy(allergen: Allergy) {
    setAllergies((prev) =>
      prev.includes(allergen)
        ? prev.filter((a) => a !== allergen)
        : [...prev, allergen],
    )
  }

  function handleStart() {
    setChild({
      name:               name.trim() || undefined,
      ageBand,
      allergies,
      allergiesConfirmed: true,
    })
    setStarterPair(pairId)
    completeOnboarding()
    router.replace('/(tabs)')
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Little Bites, Big World</Text>
            <Text style={styles.sub}>Three taps and we're cooking.</Text>
          </View>

          {/* ── Character pair ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Who's cooking with you?</Text>
            <View style={styles.stack}>
              {CHARACTER_PAIR_ORDER.map((id) => (
                <CharacterPickerCard
                  key={id}
                  pairId={id}
                  selected={pairId === id}
                  onSelect={setPairId}
                />
              ))}
            </View>
          </View>

          {/* ── Age band ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How old are they?</Text>
            <View style={styles.ageRow}>
              {AGE_BANDS.map((opt) => {
                const selected = ageBand === opt.band
                return (
                  <Pressable
                    key={opt.band}
                    style={[styles.ageButton, selected && styles.ageButtonOn]}
                    onPress={() => setAgeBand(opt.band)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                    accessibilityLabel={`Age ${opt.label}`}
                  >
                    <Text style={styles.ageEmoji}>{opt.emoji}</Text>
                    <Text style={[styles.ageLabel, selected && styles.ageLabelOn]}>
                      {opt.label}
                    </Text>
                  </Pressable>
                )
              })}
            </View>
          </View>

          {/* ── Allergies ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Anything to avoid?</Text>
            <Text style={styles.hint}>
              {allergies.length === 0
                ? 'No allergies — tap any that apply.'
                : 'These will never be suggested.'}
            </Text>
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
          </View>

          {/* ── Name (optional) ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Their name (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Leave blank if you'd rather not"
              placeholderTextColor={colors.gray[400]}
              value={name}
              onChangeText={setName}
              returnKeyType="done"
              maxLength={24}
            />
          </View>

          <PrimaryButton label="Start cooking" onPress={handleStart} style={styles.cta} />
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.linen },
  safe: { flex: 1 },
  content: {
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[12],
    gap: spacing[6],
  },

  header: { paddingTop: spacing[6] },
  title: { ...typography.display, color: colors.gray[900] },
  sub:   { ...typography.body, color: colors.gray[600], marginTop: spacing[1] },

  section:      { gap: spacing[3] },
  sectionTitle: { ...typography.h1, color: colors.gray[900] },
  hint:         { ...typography.bodySm, color: colors.gray[600], marginTop: -spacing[2] },
  stack:        { gap: spacing[2] },

  ageRow: { flexDirection: 'row', gap: spacing[3] },
  ageButton: {
    flex: 1,
    minHeight: 88,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.gray[100],
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[1],
  },
  ageButtonOn: { borderColor: colors.teal[400], backgroundColor: colors.teal[50] },
  ageEmoji:    { fontSize: 28 },
  ageLabel:    { ...typography.h2, color: colors.gray[900] },
  ageLabelOn:  { color: colors.teal[800] },

  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] },

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

  cta: { marginTop: spacing[2] },
})
