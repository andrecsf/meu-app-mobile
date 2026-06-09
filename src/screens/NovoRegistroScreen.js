import { useState, useCallback } from 'react'
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, ActivityIndicator, Alert, ScrollView, Platform
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useFocusEffect } from '@react-navigation/native'
import api from '../services/api'
import { colors, spacing, radius, fontSize } from '../theme'

export default function NovoRegistroScreen({ navigation }) {
  const [descricao, setDescricao] = useState('')
  const [categorias, setCategorias] = useState([])
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null)
  const [mostrarCategorias, setMostrarCategorias] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [data, setData] = useState(new Date())
  const [mostrarData, setMostrarData] = useState(false)
  const [mostrarHora, setMostrarHora] = useState(false)

  useFocusEffect(useCallback(() => {
    carregarCategorias()
  }, []))

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
        criado_em: data.toISOString(),
      })
      navigation.goBack()
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível salvar o registro.')
    } finally {
      setSalvando(false)
    }
  }

  function formatarData(d) {
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  function formatarHora(d) {
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
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

      <Text style={styles.label}>quando?</Text>
      <View style={styles.dataRow}>
        <TouchableOpacity
          style={[styles.dataBtn, { flex: 2 }]}
          onPress={() => setMostrarData(true)}
        >
          <Text style={styles.dataBtnText}>📅 {formatarData(data)}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.dataBtn, { flex: 1 }]}
          onPress={() => setMostrarHora(true)}
        >
          <Text style={styles.dataBtnText}>🕐 {formatarHora(data)}</Text>
        </TouchableOpacity>
      </View>

      {mostrarData && (
        <DateTimePicker
          value={data}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          maximumDate={new Date()}
          onChange={(event, selected) => {
            setMostrarData(false)
            if (selected) {
              const nova = new Date(data)
              nova.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate())
              setData(nova)
            }
          }}
        />
      )}

      {mostrarHora && (
        <DateTimePicker
          value={data}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selected) => {
            setMostrarHora(false)
            if (selected) {
              const nova = new Date(data)
              nova.setHours(selected.getHours(), selected.getMinutes())
              setData(nova)
            }
          }}
        />
      )}

      <Text style={styles.label}>categoria</Text>
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

      <TouchableOpacity
        style={styles.novaCatBtn}
        onPress={() => navigation.navigate('Categorias')}
      >
        <Text style={styles.novaCatText}>+ gerenciar categorias</Text>
      </TouchableOpacity>

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
  dataRow: {
    flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg,
  },
  dataBtn: {
    backgroundColor: colors.card,
    borderWidth: 0.5, borderColor: colors.primaryBorder,
    borderRadius: radius.sm, padding: spacing.md,
    alignItems: 'center',
  },
  dataBtnText: { fontSize: fontSize.sm, color: colors.textDark },
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