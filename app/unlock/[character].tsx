// Character Unlock Reveal
// Full-screen, non-dismissible until "Meet them" is tapped.
// Auth required: Yes
import { useEffect, useRef } from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { colors, spacing, radius, typography, animation } from '@/constants/tokens'
import { CHARACTER_PAIRS } from '@/constants/characters'
import { useCharacterStore } from '@/store/character.store'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { PrimaryButton } from '@/components/ui/PrimaryButton'
import { PlaceholderImage } from '@/components/ui/PlaceholderImage'
import { CharacterPairId } from '@/types/character'

export default function UnlockScreen() {
  const { character } = useLocalSearchParams<{ character: string }>()
  const router = useRouter()
  const { setActivePairId } = useCharacterStore()
  const reducedMotion = useReducedMotion()

  const pair = CHARACTER_PAIRS[character as CharacterPairId]
  const opacity = useRef(new Animated.Value(reducedMotion ? 1 : 0)).current
  const scale = useRef(new Animated.Value(reducedMotion ? 1 : 0.8)).current

  useEffect(() => {
    if (reducedMotion) return

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: animation.unlockReveal,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start()
  }, [reducedMotion])

  if (!pair) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Character not found</Text>
        </View>
      </SafeAreaView>
    )
  }

  function handleMeet() {
    setActivePairId(pair.id)
    router.replace('/(tabs)/' as any)
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.imageContainer,
            { opacity, transform: [{ scale }] },
          ]}
        >
          <PlaceholderImage
            type="character-hero"
            characterId={pair.id}
            width={200}
            height={300}
            style={styles.image}
          />
        </Animated.View>

        <Animated.View style={[styles.textContainer, { opacity }]}>
          <Text style={styles.label}>New character unlocked!</Text>
          <Text style={styles.name}>{pair.displayName}</Text>
          <Text style={styles.quote}>"{pair.members[0]?.quote}"</Text>
          <Text style={styles.trait}>{pair.members[0]?.trait}</Text>
        </Animated.View>

        <Animated.View style={[styles.buttonContainer, { opacity }]}>
          <PrimaryButton
            label={`Meet ${pair.members[0]?.name}`}
            onPress={handleMeet}
          />
        </Animated.View>
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
  errorText: {
    ...typography.body,
    color: colors.gray[600],
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[6],
    gap: spacing[6],
  },

  imageContainer: {
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 300,
    borderRadius: radius.lg,
  },

  textContainer: {
    alignItems: 'center',
    gap: spacing[2],
  },
  label: {
    ...typography.overline,
    color: colors.amber[400],
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  name: {
    ...typography.display,
    color: colors.gray[900],
  },
  quote: {
    ...typography.cultureCard,
    color: colors.gray[600],
    textAlign: 'center',
    marginTop: spacing[2],
  },
  trait: {
    ...typography.label,
    color: colors.gray[400],
  },

  buttonContainer: {
    width: '100%',
  },
})
