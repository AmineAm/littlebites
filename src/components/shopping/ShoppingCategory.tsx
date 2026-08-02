import { useState } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { colors, spacing, radius, typography } from '@/constants/tokens'
import { ShoppingItem, ShoppingItemData } from './ShoppingItem'

interface Props {
  category: string
  items: ShoppingItemData[]
  checkedItems: Record<string, boolean>
  onToggleItem: (name: string) => void
}

export function ShoppingCategory({ category, items, checkedItems, onToggleItem }: Props) {
  const [expanded, setExpanded] = useState(true)
  const checkedCount = items.filter((item) => checkedItems[item.name]).length

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
      >
        <View style={styles.headerLeft}>
          <Text style={styles.arrow}>{expanded ? '▼' : '▶'}</Text>
          <Text style={styles.category}>{category}</Text>
        </View>
        <Text style={styles.count}>
          {checkedCount}/{items.length}
        </Text>
      </Pressable>

      {expanded && (
        <View style={styles.items}>
          {items.map((item) => (
            <ShoppingItem
              key={item.name}
              item={item}
              checked={checkedItems[item.name] ?? false}
              onToggle={() => onToggleItem(item.name)}
            />
          ))}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  arrow: {
    fontSize: 10,
    color: colors.gray[400],
  },
  category: {
    ...typography.h2,
    color: colors.gray[900],
  },
  count: {
    ...typography.label,
    color: colors.gray[600],
  },
  items: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[3],
  },
})
