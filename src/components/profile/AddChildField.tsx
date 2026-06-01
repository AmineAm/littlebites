import { useState } from 'react'
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native'
import { colors, spacing, radius, typography } from '@/constants/tokens'

interface Props {
  onAdd: (name: string, age: number) => void
}

export function AddChildField({ onAdd }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [name, setName]         = useState('')
  const [age, setAge]           = useState('')

  function handleAdd() {
    const parsedAge = parseInt(age, 10)
    if (!name.trim() || isNaN(parsedAge) || parsedAge < 1 || parsedAge > 17) return
    onAdd(name.trim(), parsedAge)
    setName('')
    setAge('')
    setExpanded(false)
  }

  if (!expanded) {
    return (
      <Pressable
        style={styles.trigger}
        onPress={() => setExpanded(true)}
        accessibilityRole="button"
        accessibilityLabel="Add a child"
      >
        <Text style={styles.plus}>+</Text>
        <Text style={styles.triggerLabel}>Add a child</Text>
      </Pressable>
    )
  }

  return (
    <View style={styles.form}>
      <TextInput
        style={styles.input}
        placeholder="Child's name"
        placeholderTextColor={colors.gray[400]}
        value={name}
        onChangeText={setName}
        autoFocus
        returnKeyType="next"
      />
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.ageInput]}
          placeholder="Age"
          placeholderTextColor={colors.gray[400]}
          value={age}
          onChangeText={setAge}
          keyboardType="number-pad"
          maxLength={2}
          returnKeyType="done"
          onSubmitEditing={handleAdd}
        />
        <Pressable
          style={[
            styles.addBtn,
            (!name.trim() || !age) && styles.addBtnDisabled,
          ]}
          onPress={handleAdd}
          disabled={!name.trim() || !age}
        >
          <Text style={styles.addBtnLabel}>Add</Text>
        </Pressable>
        <Pressable
          style={styles.cancelBtn}
          onPress={() => { setExpanded(false); setName(''); setAge('') }}
        >
          <Text style={styles.cancelLabel}>Cancel</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.gray[200],
    borderRadius: radius.lg,
    padding: spacing[4],
    backgroundColor: colors.linen,
  },
  plus: {
    fontSize: 20,
    color: colors.gray[400],
    lineHeight: 22,
  },
  triggerLabel: {
    ...typography.bodyLg,
    color: colors.gray[400],
  },

  form: {
    borderWidth: 1.5,
    borderColor: colors.coral[400],
    borderRadius: radius.lg,
    padding: spacing[3],
    backgroundColor: colors.white,
    gap: spacing[2],
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: colors.gray[100],
    borderRadius: radius.md,
    paddingHorizontal: spacing[3],
    ...typography.bodyLg,
    color: colors.gray[900],
    backgroundColor: colors.linen,
  },
  row: {
    flexDirection: 'row',
    gap: spacing[2],
    alignItems: 'center',
  },
  ageInput: { width: 72 },
  addBtn: {
    flex: 1,
    height: 44,
    backgroundColor: colors.coral[400],
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnDisabled: { backgroundColor: colors.gray[100] },
  addBtnLabel: {
    ...typography.h2,
    color: colors.white,
  },
  cancelBtn: {
    height: 44,
    paddingHorizontal: spacing[3],
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelLabel: {
    ...typography.body,
    color: colors.gray[600],
  },
})
