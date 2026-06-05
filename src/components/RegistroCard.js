import { View, Text, StyleSheet } from 'react-native'
import { colors, spacing, radius, fontSize } from '../theme'
import CategoriaTag from './CategoriaTag'

export default function RegistroCard({ registro, categoria }) {
  const data = new Date(registro.criado_em)

  const hoje = new Date()
  const ontem = new Date()
  ontem.setDate(ontem.getDate() - 1)

  const ehHoje = data.toDateString() === hoje.toDateString()
  const ehOntem = data.toDateString() === ontem.toDateString()

  const diaLabel = ehHoje
    ? 'hoje'
    : ehOntem
    ? 'ontem'
    : data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })

  const hora = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <Text style={styles.descricao}>{registro.descricao}</Text>
        <CategoriaTag categoria={categoria} />
      </View>
      <Text style={styles.tempo}>{diaLabel} · {hora}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 0.5,
    borderColor: colors.primaryLighter,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
    gap: spacing.sm,
  },
  descricao: {
    fontSize: fontSize.sm,
    color: colors.textDark,
    fontWeight: '500',
    flex: 1,
    lineHeight: 16,
  },
  tempo: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
})