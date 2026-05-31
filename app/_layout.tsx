import '../global.css'
import { useEffect } from 'react'
import { Stack, useRouter, useSegments } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/services/firebase'
import { useAuthStore } from '@/store/auth.store'
import { colors } from '@/constants/tokens'

export default function RootLayout() {
  const router   = useRouter()
  const segments = useSegments()
  const { user, isLoading, setUser, setLoading } = useAuthStore()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null)
        setLoading(false)
        return
      }

      // Fetch the Firestore user doc to get onboardingComplete flag
      try {
        const snap = await getDoc(doc(db, 'users', firebaseUser.uid))
        const data = snap.data()

        setUser({
          uid:                  firebaseUser.uid,
          email:                firebaseUser.email ?? '',
          displayName:          firebaseUser.displayName ?? undefined,
          activeCharacter:      data?.activeCharacter      ?? 'marco-lily',
          onboardingComplete:   data?.onboardingComplete   ?? false,
          adventureLevel:       data?.adventureLevel       ?? 'curious',
          homeCuisine:          data?.homeCuisine          ?? '',
          notificationsEnabled: data?.notificationsEnabled ?? false,
        })
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    })

    return unsub
  }, [])

  // Wait until Firebase tells us if there's a session
  useEffect(() => {
    if (isLoading) return

    const inAuthGroup = segments[0] === '(auth)'

    if (!user) {
      // Not signed in — always send to splash
      if (!inAuthGroup) router.replace('/(auth)/')
    } else if (!user.onboardingComplete) {
      // Signed in but onboarding not done
      router.replace('/(auth)/profile')
    } else {
      // Fully onboarded
      if (inAuthGroup) router.replace('/(tabs)/')
    }
  }, [user, isLoading])

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.coral[400]} />
      </View>
    )
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
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
  loader: { flex: 1, backgroundColor: colors.linen, alignItems: 'center', justifyContent: 'center' },
})
