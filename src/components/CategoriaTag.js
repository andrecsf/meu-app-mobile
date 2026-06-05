import { View, Text, StyleSheet } from 'react-native'
import { colors, radius, fontSize, spacing } from '../theme'

export default function CategoriaTag({ categoria }) {
  const bgColor = categoria?.cor ? categoria.cor + '22' : colors.primaryLighter
  const textColor = categoria?.cor || colors.primary

  return (
    <View style={[styles.tag, { backgroundColor: bgColor, borderColor: textColor + '44' }]}>
      <Text style={[styles.text, { color: textColor }]}>
        {categoria?.icone} {categoria?.nome}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 0.5,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: fontSize.xs,
    fontWeight: '500',
  },
})