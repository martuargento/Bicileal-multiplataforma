import { useCallback, useMemo, useState } from 'react'
import { FlatList, ImageBackground, RefreshControl, StyleSheet, Text, TextInput, View } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useFocusEffect } from '@react-navigation/native'
import Encabezado from '../components/Encabezado'
import TarjetaProducto from '../components/TarjetaProducto'
import { Cargando, Mensaje } from '../components/Controles'
import { obtenerCotizacionDolar } from '../api/cotizacion'
import { obtenerErrorApi } from '../api/client'
import { useCarrito } from '../context/CarritoContext'
import { useCatalogo } from '../context/CatalogoContext'
import { colores } from '../theme/colores'

const imagenHero = require('../../assets/nuestrahistoria.jpg')

export default function TiendaScreen({ navigation }) {
  const [cotizacion, setCotizacion] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(true)
  const [actualizando, setActualizando] = useState(false)
  const [error, setError] = useState('')
  const { agregarAlCarrito } = useCarrito()
  const { productos, cargarProductos: cargarCatalogo } = useCatalogo()

  const cargarDatos = useCallback(async (esRefresco = false) => {
    if (esRefresco) setActualizando(true)
    else setCargando(true)
    setError('')
    try {
      const [, valorDolar] = await Promise.all([
        cargarCatalogo(),
        obtenerCotizacionDolar().catch(() => null),
      ])
      setCotizacion(valorDolar)
    } catch (errorCarga) {
      setError(obtenerErrorApi(errorCarga, 'No se pudieron cargar los productos.'))
    } finally {
      setCargando(false)
      setActualizando(false)
    }
  }, [cargarCatalogo])

  useFocusEffect(useCallback(() => {
    cargarDatos()
  }, [cargarDatos]))

  const productosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLocaleLowerCase('es-AR')
    if (!termino) return productos
    return productos.filter((producto) => (
      `${producto.nombre} ${producto.descripcion || ''}`.toLocaleLowerCase('es-AR').includes(termino)
    ))
  }, [productos, busqueda])

  return (
    <View style={estilos.pantalla}>
      <FlatList
        data={productosFiltrados}
        keyExtractor={(producto) => String(producto.id)}
        renderItem={({ item }) => (
          <TarjetaProducto producto={item} cotizacion={cotizacion} agregarAlCarrito={agregarAlCarrito} />
        )}
        contentContainerStyle={estilos.lista}
        ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
        ListHeaderComponent={(
          <>
            <Encabezado navigation={navigation} />
            <ImageBackground source={imagenHero} imageStyle={estilos.imagenHero} style={estilos.hero}>
              <View style={estilos.capaHero}>
                <Text style={estilos.etiquetaHero}>BICILEAL · DESDE 2004</Text>
                <Text style={estilos.tituloHero}>Tu próxima aventura empieza acá.</Text>
                <Text style={estilos.textoHero}>Calidad y confianza para pedalear más lejos.</Text>
              </View>
            </ImageBackground>
            <View style={estilos.cabeceraLista}>
              <View style={estilos.tituloLista}>
                <Text style={estilos.tituloSeccion}>Encontrá tu bicicleta</Text>
                <Text style={estilos.subtituloSeccion}>
                  {productos.length} {productos.length === 1 ? 'producto' : 'productos'} disponibles
                </Text>
              </View>
              <View style={estilos.busqueda}>
                <Feather name="search" size={17} color={colores.secundaria} />
                <TextInput
                  value={busqueda}
                  onChangeText={setBusqueda}
                  placeholder="Buscar productos"
                  placeholderTextColor={colores.secundaria}
                  style={estilos.campoBusqueda}
                  returnKeyType="search"
                />
              </View>
              {!cotizacion && <Text style={estilos.notaDolar}>Cotización en dólares temporalmente no disponible</Text>}
              {cargando && productos.length === 0 && <Cargando mensaje="Cargando productos..." />}
              {!!error && (
                <View style={{ gap: 10 }}>
                  <Mensaje titulo="No se pudo conectar con la tienda" detalle={error} tipo="error" />
                  <Text onPress={() => cargarDatos()} style={estilos.reintentar}>Tocar para volver a intentar</Text>
                </View>
              )}
              {!cargando && !error && productosFiltrados.length === 0 && (
                <Mensaje
                  titulo={productos.length ? 'No encontramos resultados' : 'Todavía no hay productos'}
                  detalle={productos.length ? 'Probá con otra búsqueda.' : 'Volvé más tarde para conocer las novedades.'}
                />
              )}
            </View>
          </>
        )}
        refreshControl={<RefreshControl refreshing={actualizando} onRefresh={() => cargarDatos(true)} tintColor={colores.primarioOscuro} />}
        ListEmptyComponent={null}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  lista: { paddingBottom: 22 },
  hero: { minHeight: 206, marginHorizontal: 20, marginBottom: 23, overflow: 'hidden', borderRadius: 24, justifyContent: 'flex-end' },
  imagenHero: { borderRadius: 24 },
  capaHero: { minHeight: 206, padding: 20, justifyContent: 'flex-end', gap: 8, backgroundColor: 'rgba(13, 29, 15, 0.60)' },
  etiquetaHero: { color: '#D4F0B3', fontSize: 11, fontWeight: '800', letterSpacing: 1.4 },
  tituloHero: { maxWidth: 290, color: '#FFFFFF', fontSize: 27, fontWeight: '900', lineHeight: 32 },
  textoHero: { maxWidth: 285, color: '#F3F6F0', fontSize: 13, lineHeight: 19 },
  cabeceraLista: { paddingHorizontal: 20, gap: 14 },
  tituloLista: { gap: 3 },
  tituloSeccion: { color: colores.tinta, fontSize: 21, fontWeight: '800' },
  subtituloSeccion: { color: colores.secundaria, fontSize: 13 },
  busqueda: { minHeight: 49, paddingHorizontal: 14, borderWidth: 1, borderColor: colores.linea, borderRadius: 14, backgroundColor: colores.superficie, flexDirection: 'row', alignItems: 'center', gap: 10 },
  campoBusqueda: { flex: 1, color: colores.tinta, fontSize: 14 },
  notaDolar: { color: colores.secundaria, fontSize: 12 },
  reintentar: { color: colores.primarioOscuro, fontWeight: '700', textAlign: 'center', padding: 8 },
})
