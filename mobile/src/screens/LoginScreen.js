import { useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Feather } from '@expo/vector-icons'
import Encabezado from '../components/Encabezado'
import { Boton, Campo, Mensaje } from '../components/Controles'
import { obtenerErrorApi } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { colores } from '../theme/colores'

export default function LoginScreen({ navigation, route }) {
  const { login, registro } = useAuth()
  const [modoRegistro, setModoRegistro] = useState(Boolean(route.params?.modoRegistro))
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [procesando, setProcesando] = useState(false)

  async function enviarFormulario() {
    setError('')
    const usuarioIngresado = username.trim()
    if (!usuarioIngresado || !password) {
      setError('Completá el usuario y la contraseña.')
      return
    }
    if (modoRegistro && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Ingresá un email válido.')
      return
    }

    setProcesando(true)
    try {
      if (modoRegistro) await registro(usuarioIngresado, email.trim(), password)
      else await login(usuarioIngresado, password)
      navigation.goBack()
    } catch (errorLogin) {
      setError(obtenerErrorApi(errorLogin, 'No se pudo iniciar sesión.'))
    } finally {
      setProcesando(false)
    }
  }

  return (
    <View style={estilos.pantalla}>
      <Encabezado navigation={navigation} />
      <KeyboardAvoidingView style={estilos.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={estilos.contenido} keyboardShouldPersistTaps="handled">
          <View style={estilos.icono}>
            <Feather name="user" size={26} color={colores.primarioOscuro} />
          </View>
          <Text style={estilos.titulo}>{modoRegistro ? 'Creá tu cuenta' : 'Qué bueno verte'}</Text>
          <Text style={estilos.subtitulo}>{modoRegistro ? 'Registrate para comprar y seguir tus pedidos.' : 'Ingresá para confirmar tu pedido y acceder a tu cuenta.'}</Text>
          <View style={estilos.formulario}>
            <Campo etiqueta="Usuario" valor={username} alCambiar={setUsername} placeholder="Tu nombre de usuario" autoCapitalize="none" />
            {modoRegistro && <Campo etiqueta="Email" valor={email} alCambiar={setEmail} placeholder="nombre@correo.com" teclado="email-address" autoCapitalize="none" />}
            <Campo etiqueta="Contraseña" valor={password} alCambiar={setPassword} placeholder="Tu contraseña" seguro autoCapitalize="none" />
            {!!error && <Mensaje titulo="No pudimos continuar" detalle={error} tipo="error" />}
            <Boton titulo={modoRegistro ? 'Crear cuenta' : 'Iniciar sesión'} onPress={enviarFormulario} cargando={procesando} />
            <Boton
              titulo={modoRegistro ? 'Ya tengo una cuenta' : 'Crear una cuenta'}
              variante="secundario"
              deshabilitado={procesando}
              onPress={() => { setError(''); setModoRegistro((actual) => !actual) }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  flex: { flex: 1 },
  contenido: { padding: 22, paddingTop: 16, gap: 12 },
  icono: { width: 54, height: 54, borderRadius: 18, backgroundColor: colores.primarioClaro, alignItems: 'center', justifyContent: 'center' },
  titulo: { marginTop: 6, color: colores.tinta, fontSize: 29, fontWeight: '900', letterSpacing: -0.7 },
  subtitulo: { color: colores.secundaria, fontSize: 14, lineHeight: 21 },
  formulario: { marginTop: 12, gap: 16 },
})
