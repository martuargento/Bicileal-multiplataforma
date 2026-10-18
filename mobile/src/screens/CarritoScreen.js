import { useState } from 'react'
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native'
import Encabezado from '../components/Encabezado'
import { Boton, Mensaje } from '../components/Controles'
import { crearPedido } from '../api/pedidos'
import { obtenerErrorApi } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useCarrito } from '../context/CarritoContext'
import { formatearPrecio, formatearPrecioDolares } from '../utils/formato'
import { obtenerCotizacionDolar } from '../api/cotizacion'
import { colores } from '../theme/colores'
import { useEffect } from 'react'

export default function CarritoScreen({ navigation }) {
  const { usuario } = useAuth()
  const { items, total, cambiarCantidad, quitarDelCarrito, vaciarCarrito } = useCarrito()
  const [cotizacion, setCotizacion] = useState(null)
  const [procesando, setProcesando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    obtenerCotizacionDolar().then(setCotizacion).catch(() => setCotizacion(null))
  }, [])

  async function confirmarPedido() {
    if (!items.length || procesando) return
    if (!usuario) {
      navigation.navigate('Login', { volverA: 'Carrito' })
      return
    }
    setError('')
    setMensaje('')
    setProcesando(true)
    try {
      const pedido = await crearPedido(Number(total.toFixed(2)))
      vaciarCarrito()
      setMensaje(`El pedido #${pedido.id} se registró correctamente.`)
    } catch (errorPedido) {
      setError(obtenerErrorApi(errorPedido, 'No se pudo registrar el pedido.'))
    } finally {
      setProcesando(false)
    }
  }

  function confirmarVaciado() {
    Alert.alert('Vaciar carrito', '¿Querés quitar todos los productos?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Vaciar', style: 'destructive', onPress: vaciarCarrito },
    ])
  }

  return (
    <View style={estilos.pantalla}>
      <Encabezado navigation={navigation} titulo="Tu carrito" subtitulo="Revisá tus productos antes de confirmar." />
      <ScrollView contentContainerStyle={estilos.contenido} showsVerticalScrollIndicator={false}>
        {!!mensaje && <Mensaje titulo="¡Listo!" detalle={mensaje} tipo="exito" />}
        {!!error && <Mensaje titulo="No se pudo completar el pedido" detalle={error} tipo="error" />}
        {items.length === 0 ? (
          <View style={estilos.vacio}>
            <Text style={estilos.iconoVacio}>🛍️</Text>
            <Text style={estilos.tituloVacio}>{mensaje ? 'Gracias por tu compra' : 'Tu carrito está vacío'}</Text>
            <Text style={estilos.detalleVacio}>Cuando agregues productos, los vas a encontrar acá.</Text>
            <Boton titulo="Explorar bicicletas" onPress={() => navigation.navigate('Principal', { screen: 'Tienda' })} />
          </View>
        ) : (
          <>
            {items.map((item) => (
              <View key={item.id} style={estilos.item}>
                <View style={estilos.infoItem}>
                  <Text style={estilos.nombreItem}>{item.titulo}</Text>
                  <Text style={estilos.precioItem}>{formatearPrecio(item.precio * item.cantidad)}</Text>
                  <Text style={estilos.dolares}>{formatearPrecioDolares(item.precio * item.cantidad, cotizacion)}</Text>
                  <View style={estilos.cantidad}>
                    <Text onPress={() => cambiarCantidad(item.id, -1)} style={estilos.controlCantidad}>−</Text>
                    <Text style={estilos.numeroCantidad}>{item.cantidad}</Text>
                    <Text onPress={() => cambiarCantidad(item.id, 1)} style={estilos.controlCantidad}>+</Text>
                  </View>
                </View>
                <Text onPress={() => quitarDelCarrito(item.id)} style={estilos.quitar}>Quitar</Text>
              </View>
            ))}
            <View style={estilos.resumen}>
              <View style={estilos.filaTotal}>
                <Text style={estilos.totalLabel}>Total</Text>
                <Text style={estilos.total}>{formatearPrecio(total)}</Text>
              </View>
              <Text style={estilos.dolaresTotal}>{formatearPrecioDolares(total, cotizacion)}</Text>
              <Text style={estilos.aviso}>El pago se coordina con el equipo de Bicileal.</Text>
            </View>
            <Boton
              titulo={procesando ? 'Registrando pedido...' : usuario ? 'Confirmar pedido' : 'Iniciar sesión para comprar'}
              onPress={confirmarPedido}
              deshabilitado={!items.length}
              cargando={procesando}
            />
            <Boton titulo="Vaciar carrito" variante="secundario" onPress={confirmarVaciado} />
            <Boton titulo="Seguir comprando" variante="secundario" onPress={() => navigation.navigate('Principal', { screen: 'Tienda' })} />
          </>
        )}
      </ScrollView>
    </View>
  )
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  contenido: { paddingHorizontal: 20, paddingBottom: 28, gap: 12 },
  vacio: { minHeight: 330, alignItems: 'center', justifyContent: 'center', gap: 14 },
  iconoVacio: { fontSize: 42 },
  tituloVacio: { color: colores.tinta, fontSize: 22, fontWeight: '800' },
  detalleVacio: { color: colores.secundaria, fontSize: 14, textAlign: 'center', marginBottom: 5 },
  item: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, padding: 17, borderRadius: 19, backgroundColor: colores.superficie },
  infoItem: { flex: 1, gap: 5 },
  nombreItem: { color: colores.tinta, fontSize: 16, fontWeight: '800' },
  precioItem: { color: colores.tinta, fontSize: 16, fontWeight: '700' },
  dolares: { color: colores.secundaria, fontSize: 12 },
  cantidad: { alignSelf: 'flex-start', marginTop: 7, flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: 11, paddingVertical: 6, borderRadius: 12, backgroundColor: colores.fondo },
  controlCantidad: { color: colores.primarioOscuro, fontSize: 20, fontWeight: '800' },
  numeroCantidad: { color: colores.tinta, fontWeight: '800' },
  quitar: { color: colores.error, fontSize: 13, fontWeight: '700', padding: 4 },
  resumen: { marginTop: 7, padding: 18, borderRadius: 18, backgroundColor: colores.superficie, gap: 5 },
  filaTotal: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  totalLabel: { color: colores.tinta, fontSize: 16, fontWeight: '700' },
  total: { color: colores.tinta, fontSize: 22, fontWeight: '900' },
  dolaresTotal: { color: colores.secundaria, fontSize: 13, textAlign: 'right' },
  aviso: { marginTop: 8, color: colores.secundaria, fontSize: 12, lineHeight: 18 },
})
