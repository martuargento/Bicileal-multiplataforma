import { Image, StyleSheet, Text, View } from 'react-native'
import { Boton } from './Controles'
import { resolverUrlMultimedia } from '../api/client'
import { formatearPrecio, formatearPrecioDolares } from '../utils/formato'
import { colores } from '../theme/colores'

const IMAGEN_FALLBACK = 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=900&q=80'

export default function TarjetaProducto({ producto, cotizacion, agregarAlCarrito, mostrarAccion = true, vistaTablet = false }) {
  const imagen = producto.imagen ? resolverUrlMultimedia(producto.imagen) : IMAGEN_FALLBACK
  return (
    <View style={estilos.tarjeta}>
      <Image source={{ uri: imagen }} style={estilos.imagen} resizeMode={vistaTablet ? 'contain' : 'cover'} />
      <View style={estilos.contenido}>
        <View style={estilos.detalles}>
          <Text style={estilos.nombre} numberOfLines={2}>{producto.nombre}</Text>
          {!!producto.descripcion && <Text style={estilos.descripcion} numberOfLines={2}>{producto.descripcion}</Text>}
          <Text style={estilos.precio}>{formatearPrecio(producto.precio)}</Text>
          <Text style={estilos.dolar}>{formatearPrecioDolares(producto.precio, cotizacion)}</Text>
        </View>
        {mostrarAccion && <Boton titulo="Agregar al carrito" icono="+" onPress={() => agregarAlCarrito(producto)} />}
      </View>
    </View>
  )
}

const estilos = StyleSheet.create({
  tarjeta: {
    overflow: 'hidden',
    borderRadius: 22,
    backgroundColor: colores.superficie,
    shadowColor: colores.sombra,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },
  imagen: { width: '100%', height: 190, backgroundColor: '#FFFFFF' },
  contenido: { padding: 16, gap: 14 },
  detalles: { gap: 5 },
  nombre: { color: colores.tinta, fontSize: 18, fontWeight: '800' },
  descripcion: { color: colores.secundaria, fontSize: 13, lineHeight: 18 },
  precio: { marginTop: 5, color: colores.tinta, fontSize: 20, fontWeight: '800' },
  dolar: { color: colores.secundaria, fontSize: 12 },
})
