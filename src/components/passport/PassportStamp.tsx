import { Pressable, Text, StyleSheet } from 'react-native'
import { colors, spacing, radius, typography } from '@/constants/tokens'
import { CUISINES } from '@/constants/cuisines'
import { CuisineId } from '@/types/character'
import { PlaceholderImage } from '@/components/ui/PlaceholderImage'

interface Props {
  cuisineId: string
  earned: boolean
  count: number
  onTap: () => void
}

export function PassportStamp({ cuisineId, earned, count: _count, onTap }: Props) {
  const cuisine = CUISINES[cuisineId as CuisineId]

  if (!earned) {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.stamp,
          styles.locked,
          pressed && styles.pressed,
        ]}
        onPress={onTap}
        accessibilityRole="button"
        accessibilityLabel={`${cuisine?.name ?? cuisineId} stamp - locked`}
      >
        <PlaceholderImage
          type="stamp"
          width={64}
          height={72}
          label="?"
          style={styles.image}
        />
      </Pressable>
    )
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.stamp,
        styles.earned,
        pressed && styles.pressed,
      ]}
      onPress={onTap}
      accessibilityRole="button"
      accessibilityLabel={`${cuisine?.name ?? cuisineId} stamp - earned`}
    >
      <PlaceholderImage
        type="stamp"
        width={64}
        height={72}
        emoji={cuisine?.flagEmoji}
        label={cuisine?.name?.charAt(0) ?? '?'}
        style={styles.image}
      />
      <Text style={styles.label} numberOfLines={1}>
        {cuisine?.name ?? cuisineId}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  stamp: {
    width: 80,
    alignItems: 'center',
  },
  locked: {
    opacity: 0.4,
  },
  earned: {
    opacity: 1,
  },
  pressed: {
    opacity: 0.7,
  },
  image: {
    width: 64,
    height: 72,
    borderRadius: radius.md,
  },
  label: {
    ...typography.label,
    color: colors.gray[900],
    marginTop: spacing[1],
    textAlign: 'center',
  },
})
