// S1 — Splash & Sign Up
// Figma: P01-S1 | Auth required: No
import { useEffect, useState } from 'react'
import {
  View, Text, StyleSheet, KeyboardAvoidingView,
  Platform, TextInput, Pressable, Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import * as Google from 'expo-auth-session/providers/google'
import * as WebBrowser from 'expo-web-browser'
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth'
import { useRouter } from 'expo-router'
import { auth } from '@/services/firebase'
import { signUpWithEmail, signInWithEmail } from '@/services/auth'
import { colors, spacing, radius, typography } from '@/constants/tokens'
import { SocialLoginButton } from '@/components/ui/SocialLoginButton'
import { PrimaryButton } from '@/components/ui/PrimaryButton'

WebBrowser.maybeCompleteAuthSession()

type EmailMode = 'hidden' | 'signup' | 'login'

export default function SplashScreen() {
  const router = useRouter()

  // ── Google OAuth ─────────────────────────────────────────────────────────
  const [_request, response, promptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  })

  const [googleLoading, setGoogleLoading] = useState(false)

  useEffect(() => {
    if (response?.type === 'success') {
      const idToken = response.params.id_token
      if (!idToken) return
      setGoogleLoading(true)
      const credential = GoogleAuthProvider.credential(idToken)
      signInWithCredential(auth, credential)
        .catch((e) => {
          Alert.alert('Sign in failed', e.message)
          setGoogleLoading(false)
        })
      // Auth state listener in _layout.tsx handles the redirect
    }
  }, [response])

  // ── Email form ───────────────────────────────────────────────────────────
  const [emailMode, setEmailMode]       = useState<EmailMode>('hidden')
  const [email, setEmail]               = useState('')
  const [password, setPassword]         = useState('')
  const [emailLoading, setEmailLoading] = useState(false)

  async function handleEmailSubmit() {
    if (!email.trim() || !password.trim()) return
    setEmailLoading(true)
    try {
      if (emailMode === 'signup') {
        await signUpWithEmail(email.trim(), password)
      } else {
        await signInWithEmail(email.trim(), password)
      }
      // Auth state listener in _layout.tsx handles the redirect
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Something went wrong'
      Alert.alert('Error', msg)
    } finally {
      setEmailLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* ── Hero — top 40% ─────────────────────────────────────────────── */}
      <LinearGradient
        colors={[colors.amber[200], colors.coral[400]]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={styles.hero}
      >
        <SafeAreaView edges={['top']} style={styles.heroInner}>
          {/* Character silhouettes placeholder — assets added when delivered */}
          <View style={styles.silhouetteRow}>
            {['marco-lily', 'mei-theo', 'nour-boo', 'elsa-kit-finn'].map((id) => (
              <View key={id} style={styles.silhouettePlaceholder} />
            ))}
          </View>

          <View style={styles.logoBlock}>
            <Text style={styles.appName}>Little Bites, Big World</Text>
            <Text style={styles.tagline}>Explore the world, one meal at a time</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* ── Auth card — bottom 60% ──────────────────────────────────────── */}
      <View style={styles.card}>
        <Text style={styles.cardHeading}>
          {emailMode === 'login' ? 'Welcome back' : 'Let's get cooking'}
        </Text>
        <Text style={styles.cardSub}>
          {emailMode === 'login'
            ? 'Sign in to continue your adventure'
            : 'Create a free account to start your food adventure'}
        </Text>

        {/* ── Email form (shown inline when tapped) ── */}
        {emailMode !== 'hidden' && (
          <View style={styles.emailForm}>
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor={colors.gray[400]}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={colors.gray[400]}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <PrimaryButton
              label={emailMode === 'signup' ? 'Create account' : 'Sign in'}
              onPress={handleEmailSubmit}
              loading={emailLoading}
              disabled={!email.trim() || password.length < 6}
            />
            <Pressable onPress={() =>
              setEmailMode(emailMode === 'signup' ? 'login' : 'signup')
            }>
              <Text style={styles.switchMode}>
                {emailMode === 'signup'
                  ? 'Already have an account? Sign in'
                  : 'No account yet? Sign up'}
              </Text>
            </Pressable>
          </View>
        )}

        {/* ── Social + email buttons ── */}
        {emailMode === 'hidden' && (
          <View style={styles.buttons}>
            <SocialLoginButton
              variant="google"
              onPress={() => {
                setGoogleLoading(true)
                promptAsync().finally(() => setGoogleLoading(false))
              }}
              loading={googleLoading}
            />
            <PrimaryButton
              label="Continue with email"
              onPress={() => setEmailMode('signup')}
            />
            <Pressable onPress={() => setEmailMode('login')}>
              <Text style={styles.loginLink}>Already have an account? Sign in</Text>
            </Pressable>
          </View>
        )}

        {emailMode !== 'hidden' && (
          <Pressable onPress={() => setEmailMode('hidden')} style={styles.backRow}>
            <Text style={styles.backLink}>← Back</Text>
          </Pressable>
        )}

        <Text style={styles.legal}>
          By continuing you agree to our Terms of Service and Privacy Policy.
        </Text>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },

  // ── Hero ──────────────────────────────────────────────────────────────────
  hero:        { flex: 0.4 },
  heroInner:   { flex: 1, justifyContent: 'flex-end', paddingBottom: spacing[6] },

  silhouetteRow: {
    flexDirection:  'row',
    justifyContent: 'center',
    alignItems:     'flex-end',
    gap:            spacing[2],
    paddingHorizontal: spacing[4],
    marginBottom:   spacing[4],
  },
  silhouettePlaceholder: {
    width:           52,
    height:          80,
    borderRadius:    radius.md,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },

  logoBlock: { alignItems: 'center', paddingHorizontal: spacing[6] },
  appName: {
    ...typography.display,
    color:      colors.white,
    textAlign:  'center',
    textShadowColor:  'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  tagline: {
    ...typography.bodyLg,
    color:      colors.white,
    textAlign:  'center',
    marginTop:  spacing[1],
    opacity:    0.9,
  },

  // ── Auth card ─────────────────────────────────────────────────────────────
  card: {
    flex:               0.6,
    backgroundColor:    colors.white,
    borderTopLeftRadius:  radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal:  spacing[6],
    paddingTop:         spacing[6],
    paddingBottom:      spacing[4],
  },
  cardHeading: {
    ...typography.h1,
    color:        colors.gray[900],
    marginBottom: spacing[1],
  },
  cardSub: {
    ...typography.body,
    color:        colors.gray[600],
    marginBottom: spacing[6],
  },

  // ── Buttons ───────────────────────────────────────────────────────────────
  buttons: { gap: spacing[3] },

  loginLink: {
    ...typography.body,
    color:     colors.coral[400],
    textAlign: 'center',
    marginTop: spacing[1],
  },

  // ── Email form ────────────────────────────────────────────────────────────
  emailForm: { gap: spacing[3] },
  input: {
    height:           52,
    borderWidth:      1,
    borderColor:      colors.gray[100],
    borderRadius:     radius.md,
    paddingHorizontal: spacing[4],
    ...typography.bodyLg,
    color:            colors.gray[900],
    backgroundColor:  colors.linen,
  },
  switchMode: {
    ...typography.body,
    color:     colors.coral[400],
    textAlign: 'center',
  },

  // ── Footer ────────────────────────────────────────────────────────────────
  backRow:  { marginTop: spacing[4], alignItems: 'flex-start' },
  backLink: { ...typography.body, color: colors.gray[600] },
  legal: {
    ...typography.bodySm,
    color:      colors.gray[400],
    textAlign:  'center',
    marginTop:  'auto',
    paddingTop: spacing[4],
  },
})
