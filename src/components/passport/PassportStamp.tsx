import { Pressable, Text, View, StyleSheet } from 'react-native'
import { colors, spacing, radius, typography } from '@/constants/tokens'
import { CUISINES } from '@/constants/cuisines'
import { CuisineId } from '@/types/character'

/**
 * Rendered, not illustrated — a flag emoji on the cuisine's accent colour.
 * This replaces 28 commissioned stamp files. For a children's app, bold flat
 * colour reads as a deliberate style rather than a missing asset.
 */
interface Props {
  cuisineId: string
  earned:    boolean
  count:     number
  onTap:     () => void
}

export function PassportStamp({ cuisineId, earned, count, onTap }: Props) {
  const cuisine = CUISINES[cuisineId as CuisineId]
  const name = cuisine?.name ?? cuisineId

  return (
    <Pressable
      style={({ pressed }) => [styles.stamp, pressed && styles.pressed]}
      onPress={onTap}
      accessibilityRole="button"
      accessibilityLabel={
        earned
          ? `${name} stamp, earned, ${count} ${count === 1 ? 'meal' : 'meals'} cooked`
          : `${name} stamp, locked`
      }
    >
      <View
        style={[
          styles.face,
          earned
            ? { backgroundColor: cuisine?.accentBg ?? colors.linen }
            : styles.lockedFace,
        ]}
      >
        <Text style={[styles.flag, !earned && styles.lockedFlag]}>
          {earned ? cuisine?.flagEmoji : '🔒'}
        </Text>
        {earned && count > 1 && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{count}</Text>
          </View>
        )}
      </View>

      <Text
        style={[styles.label, !earned && styles.lockedLabel]}
        numberOfLines={1}
      >
        {name}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  stamp:   { alignItems: 'center', gap: spacing[1], width: 76 },
  pressed: { opacity: 0.7 },

  face: {
    width: 64,
    height: 72,
    borderTopLeftRadius: radius.md,
    borderTopRightRadius: radius.md,
    borderBottomLeftRadius: radius.sm,
    borderBottomRightRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.gray[100],
  },
  lockedFace: { backgroundColor: colors.gray[100], opacity: 0.6 },

  flag:       { fontSize: 30 },
  lockedFlag: { fontSize: 20, opacity: 0.5 },

  countBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 20,
    height: 20,
    borderRadius: radius.full,
    backgroundColor: colors.coral[400],
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  countText: { ...typography.label, color: colors.white, fontSize: 10 },

  label:       { ...typography.bodySm, color: colors.gray[900], textAlign: 'center' },
  lockedLabel: { color: colors.gray[400] },
})
