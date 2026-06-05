import { useEffect, useState, useCallback } from 'react'
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, ActivityIndicator, RefreshControl
} from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import api from '../services/api'
import RegistroCard from '../components/RegistroCard'
import { colors, spacing, radius, fontSize } from '../theme'

export default function HomeScreen({ navigation }) {
  const [registros, setRegistros] = useState([])
  const [categorias, setCategorias] = useState([])
  const [dashboard, setDashboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const mesAtual = new Date().getMonth() + 1
  const anoAtual = new Date().getFullYear()

  async function carregar() {
    try {
      const [resRegistros, resCategorias, resDashboard] = await Promise.all([
        api.get('/registros'),
        api.get('/categorias'),
        api.get(`/registros/dashboard?mes=${mesAtual}&ano=${anoAtual}`)
      ])
      setRegistros(resRegistros.data)
      setCategorias(resCategorias.data)
      setDashboard(resDashboard.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useFocusEffect(useCallback(() => { carregar() }, []))

  function getCategoriaDoRegistro(categoria_id) {
    return categorias.find(c => c.id === categoria_id)
  }

  function onRefresh() {
    setRefreshing(true)
    carregar()
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={registros}
        keyExtractor={item => String(item.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        ListHeaderComponent={
          <View>
            <Text style={styles.titulo}>hábitos</Text>
            <Text style={styles.subtitulo}>
              {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </Text>

            {/* Dashboard */}
            <View style={styles.dashRow}>
              <View style={styles.dashCard}>
                <Text style={styles.dashNum}>{registros.length}</Text>
                <Text style={styles.dashLbl}>registros</Text>
              </View>
              <View style={styles.dashCard}>
                <Text style={styles.dashNum}>{categorias.length}</Text>
                <Text style={styles.dashLbl}>categorias</Text>
              </View>
            </View>

            {/* Barras por categoria */}
            {dashboard.map(item => (
              <View key={item.categoria_id} style={styles.barRow}>
                <View style={styles.barLabelRow}>
                  <Text style={styles.barCat}>{item.icone} {item.categoria}</Text>
                  <Text style={styles.barPct}>{item.percentual}%</Text>
                </View>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, {
                    width: `${item.percentual}%`,
                    backgroundColor: item.cor || colors.primary
                  }]} />
                </View>
              </View>
            ))}

            <View style={styles.divider} />
          </View>
        }
        renderItem={({ item }) => (
          <RegistroCard
            registro={item}
            categoria={getCategoriaDoRegistro(item.categoria_id)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.vazio}>nenhum registro ainda</Text>
        }
        contentContainerStyle={styles.lista}
      />

      {/* Botão + flutuante */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('NovoRegistro')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  lista: { padding: spacing.lg, paddingBottom: 80 },
  titulo: { fontSize: fontSize.xxl, fontWeight: '500', color: colors.textMedium, marginBottom: 2 },
  subtitulo: { fontSize: fontSize.sm, color: colors.primaryLight, marginBottom: spacing.lg },
  dashRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  dashCard: {
    flex: 1, backgroundColor: colors.card,
    borderRadius: radius.md, borderWidth: 0.5,
    borderColor: colors.primaryBorder, padding: spacing.sm,
    alignItems: 'center',
  },
  dashNum: { fontSize: fontSize.xl, fontWeight: '500', color: colors.textMedium },
  dashLbl: { fontSize: fontSize.xs, color: colors.primaryLight, marginTop: 2 },
  barRow: { marginBottom: spacing.sm },
  barLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  barCat: { fontSize: fontSize.sm, color: colors.textMedium, fontWeight: '500' },
  barPct: { fontSize: fontSize.sm, color: colors.primaryLight },
  barTrack: { height: 5, backgroundColor: colors.primaryLighter, borderRadius: radius.full },
  barFill: { height: 5, borderRadius: radius.full },
  divider: { height: 0.5, backgroundColor: colors.primaryLighter, marginVertical: spacing.lg },
  vazio: { textAlign: 'center', color: colors.textMuted, fontSize: fontSize.md, marginTop: spacing.xl },
  fab: {
    position: 'absolute', bottom: spacing.xl, right: spacing.xl,
    width: 52, height: 52, borderRadius: radius.full,
    backgroundColor: colors.primary,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: colors.primary, shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  fabText: { color: 'white', fontSize: 28, fontWeight: '300', lineHeight: 32 },
})