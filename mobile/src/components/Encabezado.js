import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { colores } from '../theme/colores'

const logoBicileal = require('../../assets/Logoheader.jpg')

export default function Encabezado({ navigation, titulo, subtitulo }) {
  return (
    <View style={estilos.encabezado}>
      <View style={estilos.filaSuperior}>
        <Pressable accessibilityRole="button" accessibilityLabel="Ir a la tienda" onPress={() => navigation.navigate('Principal', { screen: 'Tienda' })}>
          <Image source={logoBicileal} style={estilos.logo} resizeMode="contain" accessibilityLabel="Bicileal" />
        </Pressable>
        <View style={estilos.acciones}>
          <Pressable accessibilityLabel="Nuestra historia" onPress={() => navigation.navigate('NuestraHistoria')} style={estilos.iconoAccion}>
            <Feather name="info" size={20} color={colores.tinta} />
          </Pressable>
          <Pressable accessibilityLabel="Contacto" onPress={() => navigation.navigate('Contactanos')} style={estilos.iconoAccion}>
            <Feather name="message-circle" size={20} color={colores.tinta} />
          </Pressable>
        </View>
      </View>
      {!!titulo && (
        <View style={estilos.titulos}>
          <Text style={estilos.titulo}>{titulo}</Text>
          {!!subtitulo && <Text style={estilos.subtitulo}>{subtitulo}</Text>}
        </View>
      )}
    </View>
  )
}

const estilos = StyleSheet.create({
  encabezado: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 15, backgroundColor: colores.fondo },
  filaSuperior: { height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  logo: { width: 125, height: 44 },
  acciones: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconoAccion: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colores.superficie,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulos: { marginTop: 15, gap: 4 },
  titulo: { color: colores.tinta, fontSize: 27, fontWeight: '800', letterSpacing: -0.7 },
  subtitulo: { color: colores.secundaria, fontSize: 14, lineHeight: 20 },
})
