import { Pressable, Text, View, StyleSheet } from 'react-native'
import { colors, spacing, radius, typography } from '@/constants/tokens'
import { SubstitutionNote } from './SubstitutionNote'

export interface ShoppingItemData {
  name: string
  amount: string
  category: string
  cuisineFlag?: string
  substitution?: { original: string; substitute: string }
}

interface Props {
  item: ShoppingItemData
  checked: boolean
  onToggle: () => void
}

export function ShoppingItem({ item, checked, onToggle }: Props) {
  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.row,
          pressed && styles.pressed,
        ]}
        onPress={onToggle}
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
      >
        <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
          {checked && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <View style={styles.info}>
          <Text style={[styles.name, checked && styles.nameChecked]} numberOfLines={1}>
            {item.amount} {item.name}
          </Text>
          {item.cuisineFlag && (
            <Text style={styles.flag}>{item.cuisineFlag}</Text>
          )}
        </View>
      </Pressable>
      {item.substitution && checked === false && (
        <SubstitutionNote
          original={item.substitution.original}
          substitute={item.substitution.substitute}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing[2],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  pressed: {
    opacity: 0.7,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.gray[200],
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.teal[400],
    borderColor: colors.teal[400],
  },
  checkmark: {
    ...typography.label,
    color: colors.white,
    fontSize: 12,
  },
  info: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    ...typography.body,
    color: colors.gray[900],
    flex: 1,
  },
  nameChecked: {
    textDecorationLine: 'line-through',
    color: colors.gray[400],
  },
  flag: {
    fontSize: 14,
    marginLeft: spacing[2],
  },
})
