import { useState, useEffect } from 'react'
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, TextInput, Alert, ActivityIndicator
} from 'react-native'
import api from '../services/api'
import { colors, spacing, radius, fontSize } from '../theme'

export default function CategoriasScreen({ navigation, route }) {
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [editando, setEditando] = useState(null)
  const [nome, setNome] = useState('')
  const [icone, setIcone] = useState('')
  const [salvando, setSalvando] = useState(false)

  useEffect(() => { carregar() }, [])

  async function carregar() {
    try {
      const res = await api.get('/categorias')
      setCategorias(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function abrirFormNovo() {
    setEditando(null)
    setNome('')
    setIcone('')
    setMostrarForm(true)
  }

  function abrirFormEditar(cat) {
    setEditando(cat)
    setNome(cat.nome)
    setIcone(cat.icone)
    setMostrarForm(true)
  }

  function fecharForm() {
    setMostrarForm(false)
    setEditando(null)
    setNome('')
    setIcone('')
  }

  async function salvar() {
    if (!nome.trim()) {
      Alert.alert('Atenção', 'O nome da categoria é obrigatório.')
      return
    }

    setSalvando(true)
    try {
      if (editando) {
        await api.put(`/categorias/${editando.id}`, {
          nome: nome.trim(),
          icone: icone.trim() || '📌',
        })
      } else {
        await api.post('/categorias', {
          nome: nome.trim(),
          icone: icone.trim() || '📌',
          cor: colors.primary,
        })
      }
      fecharForm()
      carregar()
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível salvar a categoria.')
    } finally {
      setSalvando(false)
    }
  }

  async function deletar(cat) {
    Alert.alert(
      'Excluir categoria',
      `Deseja excluir "${cat.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir', style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/categorias/${cat.id}`)
              carregar()
            } catch (err) {
              Alert.alert('Erro', 'Não foi possível excluir a categoria.')
            }
          }
        }
      ]
    )
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
        data={categorias}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.lista}
        ListHeaderComponent={
          mostrarForm ? (
            <View style={styles.form}>
              <Text style={styles.formTitulo}>
                {editando ? 'editar categoria' : 'nova categoria'}
              </Text>

              <Text style={styles.label}>nome</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: exercício, leitura..."
                placeholderTextColor={colors.textMuted}
                value={nome}
                onChangeText={setNome}
              />

              <Text style={styles.label}>ícone (emoji)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 🏃"
                placeholderTextColor={colors.textMuted}
                value={icone}
                onChangeText={setIcone}
              />

              <View style={styles.formBtns}>
                <TouchableOpacity style={styles.cancelarBtn} onPress={fecharForm}>
                  <Text style={styles.cancelarText}>cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.salvarBtn, salvando && { opacity: 0.6 }]}
                  onPress={salvar}
                  disabled={salvando}
                >
                  {salvando
                    ? <ActivityIndicator color="white" size="small" />
                    : <Text style={styles.salvarText}>salvar</Text>
                  }
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity style={styles.novaCatBtn} onPress={abrirFormNovo}>
              <Text style={styles.novaCatText}>+ nova categoria</Text>
            </TouchableOpacity>
          )
        }
        renderItem={({ item }) => (
          <View style={styles.catItem}>
            <View style={styles.catLeft}>
              <View style={[styles.catCircle, { backgroundColor: colors.primaryLighter }]}>
                <Text style={styles.catIcone}>{item.icone}</Text>
              </View>
              <Text style={styles.catNome}>{item.nome}</Text>
            </View>
            <View style={styles.catActions}>
              <TouchableOpacity onPress={() => abrirFormEditar(item)}>
                <Text style={styles.editarBtn}>editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deletar(item)}>
                <Text style={styles.deletarBtn}>excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          !mostrarForm && (
            <Text style={styles.vazio}>nenhuma categoria criada ainda</Text>
          )
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  lista: { padding: spacing.lg },
  form: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 0.5,
    borderColor: colors.primaryBorder,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  formTitulo: {
    fontSize: fontSize.lg, fontWeight: '500',
    color: colors.textMedium, marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSize.sm, fontWeight: '500',
    color: colors.primary, marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 0.5, borderColor: colors.primaryBorder,
    borderRadius: radius.sm, padding: spacing.md,
    fontSize: fontSize.sm, color: colors.textDark,
    marginBottom: spacing.md,
  },
  formBtns: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  cancelarBtn: {
    flex: 1, borderWidth: 0.5, borderColor: colors.primaryBorder,
    borderRadius: radius.sm, padding: spacing.md, alignItems: 'center',
  },
  cancelarText: { fontSize: fontSize.sm, color: colors.textMuted },
  salvarBtn: {
    flex: 1, backgroundColor: colors.primary,
    borderRadius: radius.sm, padding: spacing.md, alignItems: 'center',
  },
  salvarText: { color: 'white', fontSize: fontSize.sm, fontWeight: '500' },
  novaCatBtn: {
    borderWidth: 0.5, borderStyle: 'dashed',
    borderColor: colors.primaryBorder, borderRadius: radius.sm,
    padding: spacing.md, alignItems: 'center', marginBottom: spacing.lg,
  },
  novaCatText: { fontSize: fontSize.sm, color: colors.primary },
  catItem: {
    backgroundColor: colors.card,
    borderRadius: radius.md, borderWidth: 0.5,
    borderColor: colors.primaryLighter,
    padding: spacing.md, marginBottom: spacing.sm,
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
  },
  catLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  catCircle: {
    width: 32, height: 32, borderRadius: radius.full,
    justifyContent: 'center', alignItems: 'center',
  },
  catIcone: { fontSize: 16 },
  catNome: { fontSize: fontSize.sm, fontWeight: '500', color: colors.textDark },
  catActions: { flexDirection: 'row', gap: spacing.md },
  editarBtn: { fontSize: fontSize.sm, color: colors.primaryLight },
  deletarBtn: { fontSize: fontSize.sm, color: colors.danger },
  vazio: {
    textAlign: 'center', color: colors.textMuted,
    fontSize: fontSize.md, marginTop: spacing.xl,
  },
})