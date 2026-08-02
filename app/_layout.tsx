import { useEffect, useState } from 'react'
import { Stack, useRouter, useSegments } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { useProfileStore } from '@/store/profile.store'
import { colors } from '@/constants/tokens'

/** Waits for the persisted profile to load before deciding where to send the user. */
function useHydrated() {
  const [hydrated, setHydrated] = useState(() => useProfileStore.persist.hasHydrated())

  useEffect(() => {
    const unsubFinish = useProfileStore.persist.onFinishHydration(() => setHydrated(true))
    return unsubFinish
  }, [])

  return hydrated
}

export default function RootLayout() {
  const router   = useRouter()
  const segments = useSegments()
  const hydrated = useHydrated()
  const onboardingComplete = useProfileStore((s) => s.onboardingComplete)

  useEffect(() => {
    if (!hydrated) return

    const inOnboarding = segments[0] === 'onboarding'

    if (!onboardingComplete && !inOnboarding) {
      router.replace('/onboarding')
    } else if (onboardingComplete && inOnboarding) {
      router.replace('/(tabs)')
    }
  }, [hydrated, onboardingComplete, segments])

  if (!hydrated) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.coral[400]} />
      </View>
    )
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="settings" options={{ presentation: 'modal' }} />
        <Stack.Screen name="recipe/[id]" />
        <Stack.Screen name="cook/[id]" />
        <Stack.Screen name="adventure/[cuisine]" />
        <Stack.Screen name="unlock/[character]" options={{ presentation: 'fullScreenModal' }} />
      </Stack>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  root:   { flex: 1 },
  loader: {
    flex: 1,
    backgroundColor: colors.linen,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
