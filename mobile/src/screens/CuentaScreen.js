import { useCallback, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { Feather } from '@expo/vector-icons'
import Encabezado from '../components/Encabezado'
import { Boton, Cargando, Mensaje } from '../components/Controles'
import { obtenerPedidos } from '../api/pedidos'
import { obtenerErrorApi } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { formatearPrecio } from '../utils/formato'
import { colores } from '../theme/colores'

export default function CuentaScreen({ navigation }) {
  const { usuario, cargandoSesion, errorSesion, logout, reintentarSesion } = useAuth()
  const [pedidos, setPedidos] = useState([])
  const [cargandoPedidos, setCargandoPedidos] = useState(false)
  const [errorPedidos, setErrorPedidos] = useState('')

  useFocusEffect(useCallback(() => {
    let activo = true
    if (!usuario) {
      setPedidos([])
      return () => { activo = false }
    }
    setCargandoPedidos(true)
    setErrorPedidos('')
    obtenerPedidos()
      .then((lista) => { if (activo) setPedidos(lista) })
      .catch((error) => { if (activo) setErrorPedidos(obtenerErrorApi(error, 'No se pudieron cargar tus pedidos.')) })
      .finally(() => { if (activo) setCargandoPedidos(false) })
    return () => { activo = false }
  }, [usuario]))

  async function cerrarSesion() {
    await logout()
  }

  return (
    <View style={estilos.pantalla}>
      <Encabezado navigation={navigation} titulo="Tu cuenta" subtitulo="Tu espacio en Bicileal." />
      <ScrollView contentContainerStyle={estilos.contenido} showsVerticalScrollIndicator={false}>
        {cargandoSesion ? <Cargando mensaje="Verificando tu sesión..." /> : usuario ? (
          <>
            <View style={estilos.perfil}>
              <View style={estilos.avatar}><Feather name="user" size={27} color={colores.primarioOscuro} /></View>
              <View style={estilos.perfilInfo}>
                <Text style={estilos.saludo}>Hola, {usuario.username}</Text>
                <Text style={estilos.email}>{usuario.email}</Text>
              </View>
            </View>
            {!!errorSesion && (
              <View style={{ gap: 10 }}>
                <Mensaje titulo="Sesión sin verificar" detalle={errorSesion} tipo="error" />
                <Boton titulo="Reintentar" variante="secundario" onPress={reintentarSesion} />
              </View>
            )}
            <Boton titulo="Administrar productos" icono="⚙" onPress={() => navigation.navigate('Dashboard')} />
            <View style={estilos.seccion}>
              <Text style={estilos.tituloSeccion}>Mis pedidos</Text>
              {cargandoPedidos ? <Cargando mensaje="Cargando pedidos..." /> : errorPedidos ? (
                <Mensaje titulo="No se pudieron cargar" detalle={errorPedidos} tipo="error" />
              ) : pedidos.length ? pedidos.map((pedido) => (
                <View key={pedido.id} style={estilos.pedido}>
                  <View>
                    <Text style={estilos.numeroPedido}>Pedido #{pedido.id}</Text>
                    <Text style={estilos.fechaPedido}>{new Date(pedido.creado_en).toLocaleDateString('es-AR')}</Text>
                  </View>
                  <Text style={estilos.totalPedido}>{formatearPrecio(pedido.total)}</Text>
                </View>
              )) : <Mensaje titulo="Todavía no tenés pedidos" detalle="Tus compras van a aparecer acá." />}
            </View>
            <Boton titulo="Cerrar sesión" variante="secundario" onPress={cerrarSesion} />
          </>
        ) : (
          <>
            <View style={estilos.invitado}>
              <View style={estilos.avatar}><Feather name="user" size={27} color={colores.primarioOscuro} /></View>
              <Text style={estilos.saludo}>Ingresá a tu cuenta</Text>
              <Text style={estilos.textoInvitado}>Accedé a tu historial y confirmá tus pedidos de forma sencilla.</Text>
            </View>
            {!!errorSesion && <Mensaje titulo="No pudimos revisar tu sesión" detalle={errorSesion} tipo="error" />}
            <Boton titulo="Iniciar sesión" onPress={() => navigation.navigate('Login')} />
            <Boton titulo="Crear una cuenta" variante="secundario" onPress={() => navigation.navigate('Login', { modoRegistro: true })} />
          </>
        )}
      </ScrollView>
    </View>
  )
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  contenido: { paddingHorizontal: 20, paddingBottom: 26, gap: 13 },
  perfil: { padding: 18, borderRadius: 20, backgroundColor: colores.superficie, flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: { width: 54, height: 54, borderRadius: 18, backgroundColor: colores.primarioClaro, alignItems: 'center', justifyContent: 'center' },
  perfilInfo: { flex: 1, gap: 4 },
  saludo: { color: colores.tinta, fontSize: 19, fontWeight: '800' },
  email: { color: colores.secundaria, fontSize: 13 },
  invitado: { paddingVertical: 22, paddingHorizontal: 12, alignItems: 'center', gap: 12 },
  textoInvitado: { maxWidth: 300, color: colores.secundaria, fontSize: 14, lineHeight: 21, textAlign: 'center' },
  seccion: { marginTop: 7, gap: 11 },
  tituloSeccion: { color: colores.tinta, fontSize: 19, fontWeight: '800' },
  pedido: { padding: 16, borderRadius: 16, backgroundColor: colores.superficie, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  numeroPedido: { color: colores.tinta, fontSize: 15, fontWeight: '800' },
  fechaPedido: { marginTop: 3, color: colores.secundaria, fontSize: 12 },
  totalPedido: { color: colores.tinta, fontSize: 15, fontWeight: '800' },
})
