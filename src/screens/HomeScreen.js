import { useState, useCallback } from 'react'
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator, RefreshControl
} from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import api from '../services/api'
import RegistroCard from '../components/RegistroCard'
import { colors, spacing, radius, fontSize } from '../theme'

function agruparPorDia(registros) {
  const grupos = {}
  for (const r of registros) {
    const dia = new Date(r.criado_em).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    })
    if (!grupos[dia]) grupos[dia] = []
    grupos[dia].push(r)
  }
  return Object.entries(grupos).map(([dia, itens]) => ({ dia, itens }))
}

export default function HomeScreen({ navigation }) {
  const agora = new Date()
  const [mesSelecionado, setMesSelecionado] = useState(agora.getMonth() + 1)
  const [anoSelecionado, setAnoSelecionado] = useState(agora.getFullYear())
  const [registros, setRegistros] = useState([])
  const [categorias, setCategorias] = useState([])
  const [dashboard, setDashboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const meses = [
    'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
    'jul', 'ago', 'set', 'out', 'nov', 'dez'
  ]

  async function carregar(mes = mesSelecionado, ano = anoSelecionado) {
    try {
      const [resRegistros, resCategorias, resDashboard] = await Promise.all([
        api.get(`/registros?mes=${mes}&ano=${ano}`),
        api.get('/categorias'),
        api.get(`/registros/dashboard?mes=${mes}&ano=${ano}`)
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

  useFocusEffect(useCallback(() => {
    carregar(mesSelecionado, anoSelecionado)
  }, [mesSelecionado, anoSelecionado]))

  function getCategoriaDoRegistro(categoria_id) {
    return categorias.find(c => c.id === categoria_id)
  }

  function mudarMes(direcao) {
    let novoMes = mesSelecionado + direcao
    let novoAno = anoSelecionado
    if (novoMes > 12) { novoMes = 1; novoAno++ }
    if (novoMes < 1) { novoMes = 12; novoAno-- }
    setMesSelecionado(novoMes)
    setAnoSelecionado(novoAno)
  }

  const gruposDias = agruparPorDia(registros)

  const listaItens = gruposDias.flatMap(({ dia, itens }) => [
    { tipo: 'cabecalho', dia, key: `cab-${dia}` },
    ...itens.map(r => ({ tipo: 'registro', registro: r, key: `reg-${r.id}` }))
  ])

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
        data={listaItens}
        keyExtractor={item => item.key}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); carregar() }}
            tintColor={colors.primary}
          />
        }
        ListHeaderComponent={
          <View>
            <Text style={styles.titulo}>Hábitos</Text>

            {/* Seletor de mês */}
            <View style={styles.mesSeletor}>
              <TouchableOpacity onPress={() => mudarMes(-1)} style={styles.mesBtn}>
                <Text style={styles.mesBtnText}>‹</Text>
              </TouchableOpacity>
              <Text style={styles.mesLabel}>
                {meses[mesSelecionado - 1]} {anoSelecionado}
              </Text>
              <TouchableOpacity onPress={() => mudarMes(1)} style={styles.mesBtn}>
                <Text style={styles.mesBtnText}>›</Text>
              </TouchableOpacity>
            </View>

            {/* Cards de resumo */}
            <View style={styles.dashRow}>
              <View style={styles.dashCard}>
                <Text style={styles.dashNum}>{registros.length}</Text>
                <Text style={styles.dashLbl}>registros</Text>
              </View>
              <View style={styles.dashCard}>
                <Text style={styles.dashNum}>{dashboard.length}</Text>
                <Text style={styles.dashLbl}>categorias ativas</Text>
              </View>
            </View>

            {/* Barras do dashboard */}
            {dashboard.length > 0 && (
              <View style={styles.dashBarras}>
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
              </View>
            )}

            <View style={styles.divider} />
          </View>
        }
        renderItem={({ item }) => {
          if (item.tipo === 'cabecalho') {
            return <Text style={styles.diaHeader}>{item.dia}</Text>
          }
          const categoria = getCategoriaDoRegistro(item.registro.categoria_id)
          return (
            <TouchableOpacity
              onPress={() => navigation.navigate('EditarRegistro', {
                registro: item.registro,
                categorias,
              })}
            >
              <RegistroCard registro={item.registro} categoria={categoria} />
            </TouchableOpacity>
          )
        }}
        ListEmptyComponent={
          <Text style={styles.vazio}>nenhum registro em {meses[mesSelecionado - 1]}</Text>
        }
        contentContainerStyle={styles.lista}
      />

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
  titulo: { fontSize: fontSize.xxl, fontWeight: '500', color: colors.textMedium, marginBottom: spacing.lg },

  mesSeletor: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: spacing.lg,
    backgroundColor: colors.card, borderRadius: radius.md,
    borderWidth: 0.5, borderColor: colors.primaryBorder,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
  },
  mesBtn: { padding: spacing.sm },
  mesBtnText: { fontSize: 22, color: colors.primary, lineHeight: 26 },
  mesLabel: { fontSize: fontSize.md, fontWeight: '500', color: colors.textMedium },

  dashRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  dashCard: {
    flex: 1, backgroundColor: colors.card,
    borderRadius: radius.md, borderWidth: 0.5,
    borderColor: colors.primaryBorder, padding: spacing.sm,
    alignItems: 'center',
  },
  dashNum: { fontSize: fontSize.xl, fontWeight: '500', color: colors.textMedium },
  dashLbl: { fontSize: fontSize.xs, color: colors.primaryLight, marginTop: 2 },

  dashBarras: {
    backgroundColor: colors.card, borderRadius: radius.md,
    borderWidth: 0.5, borderColor: colors.primaryBorder,
    padding: spacing.md, marginBottom: spacing.lg,
  },
  barRow: { marginBottom: spacing.sm },
  barLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  barCat: { fontSize: fontSize.sm, color: colors.textMedium, fontWeight: '500' },
  barPct: { fontSize: fontSize.sm, color: colors.primaryLight },
  barTrack: { height: 5, backgroundColor: colors.primaryLighter, borderRadius: radius.full },
  barFill: { height: 5, borderRadius: radius.full },

  divider: { height: 0.5, backgroundColor: colors.primaryLighter, marginBottom: spacing.md },

  diaHeader: {
    fontSize: fontSize.xs, fontWeight: '500',
    color: colors.textMuted, marginBottom: spacing.sm,
    marginTop: spacing.sm, textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  vazio: { textAlign: 'center', color: colors.textMuted, fontSize: fontSize.md, marginTop: spacing.xl },
  fab: {
    position: 'absolute', bottom: spacing.xl, right: spacing.xl,
    width: 52, height: 52, borderRadius: radius.full,
    backgroundColor: colors.primary,
    justifyContent: 'center', alignItems: 'center',
    elevation: 6,
  },
  fabText: { color: 'white', fontSize: 28, fontWeight: '300', lineHeight: 32 },
})