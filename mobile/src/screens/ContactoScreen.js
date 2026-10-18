import { useState } from 'react'
import { Alert, Linking, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Feather } from '@expo/vector-icons'
import Encabezado from '../components/Encabezado'
import { Boton, Campo, Mensaje } from '../components/Controles'
import { colores } from '../theme/colores'

const formularioVacio = { nombre: '', apellido: '', email: '', telefono: '', mensaje: '' }
const redes = [
  { nombre: 'Instagram', icono: 'instagram', url: 'https://www.instagram.com' },
  { nombre: 'Facebook', icono: 'facebook', url: 'https://www.facebook.com' },
  { nombre: 'WhatsApp', icono: 'message-circle', url: 'https://wa.me/' },
  { nombre: 'Telegram', icono: 'send', url: 'https://telegram.org' },
]

export default function ContactoScreen({ navigation }) {
  const [datos, setDatos] = useState(formularioVacio)
  const [errores, setErrores] = useState({})
  const [enviado, setEnviado] = useState(false)

  function cambiarCampo(nombre, valor) {
    setDatos((actual) => ({ ...actual, [nombre]: valor }))
    setErrores((actual) => ({ ...actual, [nombre]: '' }))
    setEnviado(false)
  }

  function enviarFormulario() {
    const nuevosErrores = {}
    if (!datos.nombre.trim()) nuevosErrores.nombre = 'El nombre es obligatorio.'
    if (!datos.apellido.trim()) nuevosErrores.apellido = 'El apellido es obligatorio.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email.trim())) nuevosErrores.email = 'Ingresá un email válido.'
    if (datos.telefono.trim().replace(/\D/g, '').length < 8) nuevosErrores.telefono = 'Ingresá un teléfono válido.'
    if (datos.mensaje.trim().length < 10) nuevosErrores.mensaje = 'El mensaje debe tener al menos 10 caracteres.'
    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length) return

    setDatos(formularioVacio)
    setEnviado(true)
  }

  async function abrirRed(url) {
    try {
      const soportado = await Linking.canOpenURL(url)
      if (soportado) await Linking.openURL(url)
      else Alert.alert('Enlace no disponible', 'No se pudo abrir este enlace en el dispositivo.')
    } catch {
      Alert.alert('Enlace no disponible', 'No se pudo abrir este enlace en el dispositivo.')
    }
  }

  return (
    <View style={estilos.pantalla}>
      <Encabezado navigation={navigation} titulo="Contactanos" subtitulo="Estamos para ayudarte con tu próxima bici." />
      <ScrollView contentContainerStyle={estilos.contenido} keyboardShouldPersistTaps="handled">
        <View style={estilos.panel}>
          <Text style={estilos.tituloPanel}>Conectá con nosotros</Text>
          <View style={estilos.redes}>
            {redes.map((red) => (
              <Text key={red.nombre} onPress={() => abrirRed(red.url)} style={estilos.red}>
                <Feather name={red.icono} size={17} color={colores.primarioOscuro} />  {red.nombre}
              </Text>
            ))}
          </View>
        </View>

        <View style={estilos.panel}>
          <Text style={estilos.tituloPanel}>Escribinos</Text>
          <Text style={estilos.detalle}>Dejanos tus datos y un mensaje. Te responderemos a la brevedad.</Text>
          <View style={estilos.formulario}>
            <Campo etiqueta="Nombre" valor={datos.nombre} alCambiar={(valor) => cambiarCampo('nombre', valor)} placeholder="Tu nombre" error={errores.nombre} />
            <Campo etiqueta="Apellido" valor={datos.apellido} alCambiar={(valor) => cambiarCampo('apellido', valor)} placeholder="Tu apellido" error={errores.apellido} />
            <Campo etiqueta="Email" valor={datos.email} alCambiar={(valor) => cambiarCampo('email', valor)} placeholder="nombre@correo.com" teclado="email-address" autoCapitalize="none" error={errores.email} />
            <Campo etiqueta="Número de teléfono" valor={datos.telefono} alCambiar={(valor) => cambiarCampo('telefono', valor)} placeholder="Tu teléfono" teclado="phone-pad" error={errores.telefono} />
            <Campo etiqueta="Mensaje" valor={datos.mensaje} alCambiar={(valor) => cambiarCampo('mensaje', valor)} placeholder="¿En qué podemos ayudarte?" multilinea error={errores.mensaje} />
            <Boton titulo="Enviar mensaje" onPress={enviarFormulario} />
            <Boton titulo="Borrar formulario" variante="secundario" onPress={() => { setDatos(formularioVacio); setErrores({}); setEnviado(false) }} />
            {enviado && <Mensaje titulo="¡Gracias por escribirnos!" detalle="Tu mensaje fue enviado correctamente." tipo="exito" />}
          </View>
        </View>

        <View style={estilos.panel}>
          <Text style={estilos.tituloPanel}>Visitanos</Text>
          <View style={estilos.filaDireccion}><Feather name="map-pin" size={18} color={colores.primarioOscuro} /><Text style={estilos.detalle}>Suipacha 559, CABA, Buenos Aires</Text></View>
          <View style={estilos.filaDireccion}><Feather name="clock" size={18} color={colores.primarioOscuro} /><Text style={estilos.detalle}>Lunes a viernes, de 10 a 18 hs.</Text></View>
          <Boton titulo="Abrir ubicación en Maps" variante="secundario" onPress={() => abrirRed('https://maps.google.com/?q=Suipacha+559+CABA')} />
        </View>
      </ScrollView>
    </View>
  )
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  contenido: { paddingHorizontal: 20, paddingBottom: 28, gap: 14 },
  panel: { padding: 18, borderRadius: 20, backgroundColor: colores.superficie, gap: 12 },
  tituloPanel: { color: colores.tinta, fontSize: 18, fontWeight: '800' },
  detalle: { flex: 1, color: colores.secundaria, fontSize: 13, lineHeight: 20 },
  redes: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  red: { overflow: 'hidden', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12, backgroundColor: colores.primarioClaro, color: colores.primarioOscuro, fontSize: 13, fontWeight: '700' },
  formulario: { gap: 13 },
  filaDireccion: { flexDirection: 'row', alignItems: 'center', gap: 10 },
})
