import { useState, useEffect } from 'react'
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, ActivityIndicator, Alert, ScrollView
} from 'react-native'
import api from '../services/api'
import { colors, spacing, radius, fontSize } from '../theme'

export default function NovoRegistroScreen({ navigation }) {
  const [descricao, setDescricao] = useState('')
  const [categorias, setCategorias] = useState([])
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null)
  const [mostrarCategorias, setMostrarCategorias] = useState(false)
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    carregarCategorias()
  }, [])

  async function carregarCategorias() {
    try {
      const res = await api.get('/categorias')
      setCategorias(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  async function salvar() {
    if (!descricao.trim()) {
      Alert.alert('Atenção', 'Descreva o que você fez.')
      return
    }
    if (!categoriaSelecionada) {
      Alert.alert('Atenção', 'Selecione uma categoria.')
      return
    }

    setSalvando(true)
    try {
      await api.post('/registros', {
        descricao: descricao.trim(),
        categoria_id: categoriaSelecionada.id,
      })
      navigation.goBack()
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível salvar o registro.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      <Text style={styles.label}>o que você fez?</Text>
      <TextInput
        style={styles.input}
        placeholder="Descreva seu hábito..."
        placeholderTextColor={colors.textMuted}
        value={descricao}
        onChangeText={setDescricao}
        multiline
        numberOfLines={3}
      />

      <Text style={styles.label}>categoria</Text>

      {/* Seletor de categoria */}
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setMostrarCategorias(!mostrarCategorias)}
      >
        <Text style={categoriaSelecionada ? styles.selectorText : styles.selectorPlaceholder}>
          {categoriaSelecionada
            ? `${categoriaSelecionada.icone} ${categoriaSelecionada.nome}`
            : 'Selecione uma categoria'}
        </Text>
        <Text style={styles.arrow}>{mostrarCategorias ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {/* Lista de categorias */}
      {mostrarCategorias && (
        <View style={styles.dropdown}>
          {categorias.length === 0 && (
            <Text style={styles.dropdownVazio}>nenhuma categoria criada ainda</Text>
          )}
          {categorias.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.dropdownItem,
                categoriaSelecionada?.id === cat.id && styles.dropdownItemAtivo
              ]}
              onPress={() => {
                setCategoriaSelecionada(cat)
                setMostrarCategorias(false)
              }}
            >
              <Text style={styles.dropdownItemText}>{cat.icone} {cat.nome}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Botão criar nova categoria */}
      <TouchableOpacity
        style={styles.novaCatBtn}
        onPress={() => navigation.navigate('Categorias', { onVoltar: carregarCategorias })}
      >
        <Text style={styles.novaCatText}>+ gerenciar categorias</Text>
      </TouchableOpacity>

      {/* Botão salvar */}
      <TouchableOpacity
        style={[styles.salvarBtn, salvando && styles.salvarBtnDisabled]}
        onPress={salvar}
        disabled={salvando}
      >
        {salvando
          ? <ActivityIndicator color="white" />
          : <Text style={styles.salvarText}>salvar registro</Text>
        }
      </TouchableOpacity>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  label: {
    fontSize: fontSize.sm, fontWeight: '500',
    color: colors.primary, marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 0.5, borderColor: colors.primaryBorder,
    borderRadius: radius.sm, padding: spacing.md,
    fontSize: fontSize.sm, color: colors.textDark,
    marginBottom: spacing.lg, minHeight: 72,
    textAlignVertical: 'top',
  },
  selector: {
    backgroundColor: colors.card,
    borderWidth: 0.5, borderColor: colors.primaryBorder,
    borderRadius: radius.sm, padding: spacing.md,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  selectorText: { fontSize: fontSize.sm, color: colors.textDark },
  selectorPlaceholder: { fontSize: fontSize.sm, color: colors.textMuted },
  arrow: { fontSize: fontSize.xs, color: colors.primaryLight },
  dropdown: {
    backgroundColor: colors.card,
    borderWidth: 0.5, borderColor: colors.primaryBorder,
    borderRadius: radius.sm, marginTop: 4,
    overflow: 'hidden',
  },
  dropdownItem: {
    padding: spacing.md,
    borderBottomWidth: 0.5, borderBottomColor: colors.primaryLighter,
  },
  dropdownItemAtivo: { backgroundColor: colors.primaryLighter },
  dropdownItemText: { fontSize: fontSize.sm, color: colors.textDark },
  dropdownVazio: {
    padding: spacing.md, fontSize: fontSize.sm,
    color: colors.textMuted, textAlign: 'center',
  },
  novaCatBtn: {
    marginTop: spacing.sm, marginBottom: spacing.lg,
    borderWidth: 0.5, borderStyle: 'dashed',
    borderColor: colors.primaryBorder, borderRadius: radius.sm,
    padding: spacing.md, alignItems: 'center',
  },
  novaCatText: { fontSize: fontSize.sm, color: colors.primary },
  salvarBtn: {
    backgroundColor: colors.primary, borderRadius: radius.sm,
    padding: spacing.md, alignItems: 'center',
  },
  salvarBtnDisabled: { opacity: 0.6 },
  salvarText: { color: 'white', fontSize: fontSize.sm, fontWeight: '500' },
})