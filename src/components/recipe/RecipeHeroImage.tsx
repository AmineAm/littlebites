import { View, StyleSheet } from 'react-native'
import { colors, radius, spacing } from '@/constants/tokens'
import { CharacterFaceIcon } from '@/components/character/CharacterFaceIcon'
import { CharacterPairId } from '@/types/character'
import { PlaceholderImage } from '@/components/ui/PlaceholderImage'

interface Props {
  recipeId: string
  imageFilename?: string
  pairId: CharacterPairId
}

export function RecipeHeroImage({ recipeId: _recipeId, imageFilename: _imageFilename, pairId }: Props) {
  return (
    <View style={styles.container}>
      <PlaceholderImage
        type="recipe"
        width={400}
        height={240}
        style={styles.image}
      />
      <View style={styles.faceIcon}>
        <CharacterFaceIcon pairId={pairId} size={36} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    height: 240,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  faceIcon: {
    position: 'absolute',
    top: spacing[3],
    right: spacing[3],
    backgroundColor: colors.white,
    borderRadius: radius.full,
    padding: 2,
  },
})
