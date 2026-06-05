import { useState } from 'react'
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, ActivityIndicator, Alert, ScrollView
} from 'react-native'
import api from '../services/api'
import { colors, spacing, radius, fontSize } from '../theme'

export default function EditarRegistroScreen({ navigation, route }) {
  const { registro, categorias } = route.params

  const [descricao, setDescricao] = useState(registro.descricao)
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(
    categorias.find(c => c.id === registro.categoria_id) || null
  )
  const [mostrarCategorias, setMostrarCategorias] = useState(false)
  const [salvando, setSalvando] = useState(false)

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
      await api.put(`/registros/${registro.id}`, {
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

  async function deletar() {
    Alert.alert(
      'Excluir registro',
      'Deseja excluir este registro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir', style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/registros/${registro.id}`)
              navigation.goBack()
            } catch (err) {
              Alert.alert('Erro', 'Não foi possível excluir o registro.')
            }
          }
        }
      ]
    )
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      <Text style={styles.label}>o que você fez?</Text>
      <TextInput
        style={styles.input}
        value={descricao}
        onChangeText={setDescricao}
        multiline
        numberOfLines={3}
        placeholderTextColor={colors.textMuted}
      />

      <Text style={styles.label}>categoria</Text>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setMostrarCategorias(!mostrarCategorias)}
      >
        <Text style={styles.selectorText}>
          {categoriaSelecionada
            ? `${categoriaSelecionada.icone} ${categoriaSelecionada.nome}`
            : 'Selecione uma categoria'}
        </Text>
        <Text style={styles.arrow}>{mostrarCategorias ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {mostrarCategorias && (
        <View style={styles.dropdown}>
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

      <TouchableOpacity
        style={[styles.salvarBtn, salvando && { opacity: 0.6 }]}
        onPress={salvar}
        disabled={salvando}
      >
        {salvando
          ? <ActivityIndicator color="white" />
          : <Text style={styles.salvarText}>salvar alterações</Text>
        }
      </TouchableOpacity>

      <TouchableOpacity style={styles.deletarBtn} onPress={deletar}>
        <Text style={styles.deletarText}>excluir registro</Text>
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
    marginBottom: spacing.sm,
  },
  selectorText: { fontSize: fontSize.sm, color: colors.textDark },
  arrow: { fontSize: fontSize.xs, color: colors.primaryLight },
  dropdown: {
    backgroundColor: colors.card,
    borderWidth: 0.5, borderColor: colors.primaryBorder,
    borderRadius: radius.sm, marginBottom: spacing.md,
    overflow: 'hidden',
  },
  dropdownItem: {
    padding: spacing.md,
    borderBottomWidth: 0.5, borderBottomColor: colors.primaryLighter,
  },
  dropdownItemAtivo: { backgroundColor: colors.primaryLighter },
  dropdownItemText: { fontSize: fontSize.sm, color: colors.textDark },
  salvarBtn: {
    backgroundColor: colors.primary, borderRadius: radius.sm,
    padding: spacing.md, alignItems: 'center', marginTop: spacing.lg,
  },
  salvarText: { color: 'white', fontSize: fontSize.sm, fontWeight: '500' },
  deletarBtn: {
    borderWidth: 0.5, borderColor: colors.danger,
    borderRadius: radius.sm, padding: spacing.md,
    alignItems: 'center', marginTop: spacing.sm,
  },
  deletarText: { color: colors.danger, fontSize: fontSize.sm, fontWeight: '500' },
})