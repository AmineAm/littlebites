import { View, Text, StyleSheet } from 'react-native'
import { ImageStyle } from 'react-native-fast-image'
import FastImage from 'react-native-fast-image'
import { CHARACTER_PAIRS } from '@/constants/characters'
import { CHARACTER_ASSETS } from '@/hooks/useCharacter'
import { CharacterPairId } from '@/types/character'
import { colors, radius, typography } from '@/constants/tokens'

interface Props {
  pairId: CharacterPairId
  size?: number
  style?: ImageStyle
}

export function CharacterFaceIcon({ pairId, size = 32, style }: Props) {
  const pair = CHARACTER_PAIRS[pairId]
  const faceAsset = CHARACTER_ASSETS[pairId]?.face

  if (faceAsset) {
    return (
      <FastImage
        source={faceAsset}
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
          style,
        ]}
        resizeMode={FastImage.resizeMode.cover}
      />
    )
  }

  return (
    <View
      style={[
        styles.placeholder,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: pair.accentColor,
        },
        style,
      ]}
    >
      <Text style={[styles.initial, { fontSize: size * 0.4 }]}>
        {pair.members[0]?.name[0]}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    ...typography.label,
    color: colors.white,
  },
})
