// Profile & Settings
// Auth required: Yes
import { ScrollView, View, Text, Pressable, StyleSheet, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { colors, spacing, radius, typography } from '@/constants/tokens'
import { useAuthStore } from '@/store/auth.store'
import { useCharacterStore } from '@/store/character.store'
import { useCharacter } from '@/hooks/useCharacter'
import { signOut } from '@/services/auth'
import { CHARACTER_PAIRS, CHARACTER_PAIR_ORDER } from '@/constants/characters'
import { CharacterFaceIcon } from '@/components/character/CharacterFaceIcon'
import { Toggle } from '@/components/ui/Toggle'

export default function ProfileScreen() {
  const router = useRouter()
  const { user, reset } = useAuthStore()
  const { activePairId, setActivePairId } = useCharacterStore()
  const { activePair } = useCharacter()

  async function handleSignOut() {
    try {
      await signOut()
      reset()
      router.replace('/(auth)/' as any)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Could not sign out'
      Alert.alert('Error', msg)
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.heading}>Profile</Text>
        </View>

        {/* ── User Info ── */}
        <View style={styles.card}>
          <View style={styles.userRow}>
            <CharacterFaceIcon pairId={activePair.id} size={48} />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.displayName ?? 'Chef'}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
            </View>
          </View>
        </View>

        {/* ── Active Character ── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Active character</Text>
          <Text style={styles.cardSub}>
            {activePair.displayName} — {activePair.tagline}
          </Text>
          <View style={styles.characterList}>
            {CHARACTER_PAIR_ORDER.map((pairId) => {
              const pair = CHARACTER_PAIRS[pairId]
              const isActive = pairId === activePairId
              return (
                <Pressable
                  key={pairId}
                  style={({ pressed }) => [
                    styles.characterOption,
                    isActive && styles.characterOptionActive,
                    pressed && styles.pressed,
                  ]}
                  onPress={() => setActivePairId(pairId)}
                >
                  <CharacterFaceIcon pairId={pairId} size={36} />
                  <Text
                    style={[
                      styles.characterName,
                      isActive && styles.characterNameActive,
                    ]}
                  >
                    {pair.displayName}
                  </Text>
                </Pressable>
              )
            })}
          </View>
        </View>

        {/* ── Settings ── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Settings</Text>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Notifications</Text>
            <Toggle
              label=""
              value={user?.notificationsEnabled ?? false}
              onChange={() => {}}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Adventure level</Text>
            <Text style={styles.settingValue}>
              {user?.adventureLevel ?? 'curious'}
            </Text>
          </View>
        </View>

        {/* ── Sign Out ── */}
        <Pressable
          style={({ pressed }) => [
            styles.signOutButton,
            pressed && styles.pressed,
          ]}
          onPress={handleSignOut}
        >
          <Text style={styles.signOutText}>Sign out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: colors.linen },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[8],
    gap: spacing[4],
  },

  header: {
    paddingTop: spacing[4],
  },
  heading: {
    ...typography.display,
    color: colors.gray[900],
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing[4],
  },
  cardTitle: {
    ...typography.h2,
    color: colors.gray[900],
    marginBottom: spacing[2],
  },
  cardSub: {
    ...typography.body,
    color: colors.gray[600],
  },

  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    ...typography.h1,
    color: colors.gray[900],
  },
  userEmail: {
    ...typography.body,
    color: colors.gray[600],
  },

  characterList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    marginTop: spacing[3],
  },
  characterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    borderWidth: 1.5,
    borderColor: colors.gray[100],
    borderRadius: radius.pill,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  characterOptionActive: {
    borderColor: colors.coral[400],
    backgroundColor: colors.coral[50],
  },
  pressed: {
    opacity: 0.7,
  },
  characterName: {
    ...typography.label,
    color: colors.gray[600],
  },
  characterNameActive: {
    color: colors.coral[400],
  },

  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  settingLabel: {
    ...typography.body,
    color: colors.gray[900],
  },
  settingValue: {
    ...typography.body,
    color: colors.gray[600],
    textTransform: 'capitalize',
  },

  signOutButton: {
    paddingVertical: spacing[4],
    alignItems: 'center',
  },
  signOutText: {
    ...typography.body,
    color: colors.coral[400],
  },
})
