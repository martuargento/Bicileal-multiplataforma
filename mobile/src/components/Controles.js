import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { colores } from '../theme/colores'

export function Boton({ titulo, onPress, variante = 'principal', deshabilitado = false, cargando = false, icono }) {
  const secundario = variante === 'secundario'
  const peligro = variante === 'peligro'
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={deshabilitado || cargando}
      style={({ pressed }) => [
        estilos.boton,
        secundario && estilos.botonSecundario,
        peligro && estilos.botonPeligro,
        (deshabilitado || cargando) && estilos.deshabilitado,
        pressed && estilos.presionado,
      ]}
    >
      {cargando
        ? <ActivityIndicator color={secundario ? colores.tinta : colores.superficie} />
        : (
          <Text style={[estilos.textoBoton, secundario && estilos.textoBotonSecundario, peligro && estilos.textoBotonPeligro]}>
            {icono ? `${icono}  ` : ''}{titulo}
          </Text>
        )}
    </Pressable>
  )
}

export function Campo({ etiqueta, valor, alCambiar, placeholder, error, seguro = false, multilinea = false, teclado, autoCapitalize = 'sentences' }) {
  return (
    <View style={estilos.grupoCampo}>
      {!!etiqueta && <Text style={estilos.etiqueta}>{etiqueta}</Text>}
      <TextInput
        accessibilityLabel={etiqueta || placeholder}
        value={valor}
        onChangeText={alCambiar}
        placeholder={placeholder}
        placeholderTextColor={colores.secundaria}
        secureTextEntry={seguro}
        multiline={multilinea}
        keyboardType={teclado}
        autoCapitalize={autoCapitalize}
        style={[estilos.campo, multilinea && estilos.campoMultilinea, error && estilos.campoError]}
      />
      {!!error && <Text style={estilos.textoError}>{error}</Text>}
    </View>
  )
}

export function Mensaje({ titulo, detalle, tipo = 'info' }) {
  const esError = tipo === 'error'
  const esExito = tipo === 'exito'
  return (
    <View style={[estilos.mensaje, esError && estilos.mensajeError, esExito && estilos.mensajeExito]}>
      {!!titulo && <Text style={[estilos.tituloMensaje, esError && estilos.textoError, esExito && estilos.textoExito]}>{titulo}</Text>}
      {!!detalle && <Text style={estilos.detalleMensaje}>{detalle}</Text>}
    </View>
  )
}

export function Cargando({ mensaje = 'Cargando...' }) {
  return (
    <View style={estilos.cargando}>
      <ActivityIndicator size="large" color={colores.primarioOscuro} />
      <Text style={estilos.detalleMensaje}>{mensaje}</Text>
    </View>
  )
}

export function EtiquetaSeccion({ titulo, detalle }) {
  return (
    <View style={estilos.seccion}>
      <Text style={estilos.tituloSeccion}>{titulo}</Text>
      {!!detalle && <Text style={estilos.detalleMensaje}>{detalle}</Text>}
    </View>
  )
}

const estilos = StyleSheet.create({
  boton: {
    minHeight: 50,
    paddingHorizontal: 18,
    borderRadius: 15,
    backgroundColor: colores.primarioOscuro,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonSecundario: { backgroundColor: colores.primarioClaro },
  botonPeligro: { backgroundColor: colores.errorClaro },
  textoBoton: { color: colores.superficie, fontSize: 15, fontWeight: '700' },
  textoBotonSecundario: { color: colores.primarioOscuro },
  textoBotonPeligro: { color: colores.error },
  deshabilitado: { opacity: 0.55 },
  presionado: { opacity: 0.82, transform: [{ scale: 0.99 }] },
  grupoCampo: { gap: 7 },
  etiqueta: { color: colores.tinta, fontSize: 13, fontWeight: '700' },
  campo: {
    minHeight: 50,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colores.linea,
    borderRadius: 13,
    backgroundColor: colores.superficie,
    color: colores.tinta,
    fontSize: 15,
  },
  campoMultilinea: { minHeight: 120, paddingTop: 13, textAlignVertical: 'top' },
  campoError: { borderColor: colores.error },
  textoError: { color: colores.error, fontSize: 13, lineHeight: 18 },
  textoExito: { color: colores.exito },
  mensaje: { padding: 14, borderRadius: 14, backgroundColor: colores.primarioClaro, gap: 4 },
  mensajeError: { backgroundColor: colores.errorClaro },
  mensajeExito: { backgroundColor: '#E8F5EC' },
  tituloMensaje: { color: colores.tinta, fontSize: 14, fontWeight: '700' },
  detalleMensaje: { color: colores.secundaria, fontSize: 14, lineHeight: 21 },
  cargando: { paddingVertical: 32, alignItems: 'center', gap: 12 },
  seccion: { marginTop: 6, marginBottom: 13, gap: 4 },
  tituloSeccion: { color: colores.tinta, fontSize: 21, fontWeight: '800', letterSpacing: -0.4 },
})
