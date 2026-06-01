import { View, StyleSheet } from 'react-native'
import { colors, spacing, radius } from '@/constants/tokens'

interface Props {
  total:   number
  current: number   // 1-based
}

export function ProgressDots({ total, current }: Props) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={[styles.dot, i + 1 === current ? styles.active : styles.inactive]}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing[2],
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    height: 8,
    borderRadius: radius.pill,
  },
  active: {
    width: 24,
    backgroundColor: colors.coral[400],
  },
  inactive: {
    width: 8,
    backgroundColor: colors.gray[100],
  },
})
