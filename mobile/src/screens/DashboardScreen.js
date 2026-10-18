import { useCallback, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import Encabezado from '../components/Encabezado'
import { Boton, Campo, Cargando, Mensaje } from '../components/Controles'
import TarjetaProducto from '../components/TarjetaProducto'
import { crearFormularioProducto, crearProducto, eliminarProducto } from '../api/productos'
import { obtenerErrorApi } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useCatalogo } from '../context/CatalogoContext'
import { colores } from '../theme/colores'

const formularioVacio = { nombre: '', descripcion: '', precio: '', stock: '' }

export default function DashboardScreen({ navigation }) {
  const { usuario, logout } = useAuth()
  const { productos, cargarProductos: cargarCatalogo, agregarAlCatalogo, quitarDelCatalogo } = useCatalogo()
  const [datosProducto, setDatosProducto] = useState(formularioVacio)
  const [imagen, setImagen] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [errorCarga, setErrorCarga] = useState('')
  const [errorAccion, setErrorAccion] = useState('')

  const cargarProductos = useCallback(async () => {
    setCargando(true)
    setErrorCarga('')
    try {
      await cargarCatalogo()
    } catch (error) {
      setErrorCarga(obtenerErrorApi(error, 'No se pudieron cargar los productos.'))
    } finally {
      setCargando(false)
    }
  }, [cargarCatalogo])

  useFocusEffect(useCallback(() => {
    cargarCatalogo().catch((error) => {
      setErrorCarga(obtenerErrorApi(error, 'No se pudieron cargar los productos.'))
    })
  }, [cargarCatalogo]))

  async function seleccionarImagen() {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permiso.granted) {
      Alert.alert('Permiso necesario', 'Permití el acceso a tus fotos para elegir una imagen de producto.')
      return
    }
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 0.8,
    })
    if (!resultado.canceled) setImagen(resultado.assets[0])
  }

  async function guardarProducto() {
    const precio = Number(datosProducto.precio)
    const stock = Number(datosProducto.stock)
    if (!datosProducto.nombre.trim()) return setErrorAccion('El nombre es obligatorio.')
    if (datosProducto.precio.trim() === '' || !Number.isFinite(precio) || precio < 0) return setErrorAccion('Ingresá un precio válido, mayor o igual a cero.')
    if (datosProducto.stock.trim() === '' || !Number.isInteger(stock) || stock < 0) return setErrorAccion('Ingresá un stock entero, mayor o igual a cero.')

    setErrorAccion('')
    setGuardando(true)
    try {
      const producto = await crearProducto(crearFormularioProducto({ ...datosProducto, nombre: datosProducto.nombre.trim(), precio, stock }, imagen))
      agregarAlCatalogo(producto)
      setDatosProducto(formularioVacio)
      setImagen(null)
    } catch (error) {
      setErrorAccion(obtenerErrorApi(error, 'No se pudo guardar el producto.'))
    } finally {
      setGuardando(false)
    }
  }

  function confirmarEliminar(producto) {
    Alert.alert('Eliminar producto', `¿Querés eliminar "${producto.nombre}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => {
        setErrorAccion('')
        try {
          await eliminarProducto(producto.id)
          quitarDelCatalogo(producto.id)
        } catch (error) {
          setErrorAccion(obtenerErrorApi(error, 'No se pudo eliminar el producto.'))
        }
      } },
    ])
  }

  return (
    <View style={estilos.pantalla}>
      <Encabezado navigation={navigation} titulo="Administración" subtitulo={`Sesión: ${usuario?.username || ''}`} />
      <ScrollView contentContainerStyle={estilos.contenido} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={estilos.panel}>
          <Text style={estilos.tituloPanel}>Agregar producto</Text>
          <View style={estilos.formulario}>
            <Campo etiqueta="Nombre" valor={datosProducto.nombre} alCambiar={(nombre) => setDatosProducto((actual) => ({ ...actual, nombre }))} placeholder="Ej. Bicicleta urbana" />
            <Campo etiqueta="Descripción" valor={datosProducto.descripcion} alCambiar={(descripcion) => setDatosProducto((actual) => ({ ...actual, descripcion }))} placeholder="Detalles del producto" multilinea />
            <View style={estilos.fila}>
              <View style={estilos.columna}><Campo etiqueta="Precio (ARS)" valor={datosProducto.precio} alCambiar={(precio) => setDatosProducto((actual) => ({ ...actual, precio }))} placeholder="0" teclado="decimal-pad" /></View>
              <View style={estilos.columna}><Campo etiqueta="Stock" valor={datosProducto.stock} alCambiar={(stock) => setDatosProducto((actual) => ({ ...actual, stock }))} placeholder="0" teclado="number-pad" /></View>
            </View>
            <Boton titulo={imagen ? 'Cambiar imagen' : 'Elegir imagen'} variante="secundario" onPress={seleccionarImagen} />
            {!!imagen && (
              <View style={estilos.imagenElegida}>
                <Image source={{ uri: imagen.uri }} style={estilos.vistaPrevia} />
                <View style={estilos.infoImagen}>
                  <Text style={estilos.tituloImagen}>Imagen lista para guardar</Text>
                  <Text style={estilos.nombreImagen} numberOfLines={2}>
                    {imagen.fileName || 'Se adjuntará al producto cuando toques Guardar producto.'}
                  </Text>
                </View>
              </View>
            )}
            {!!errorAccion && <Mensaje titulo="No se pudo guardar" detalle={errorAccion} tipo="error" />}
            <Boton titulo="Guardar producto" onPress={guardarProducto} cargando={guardando} />
          </View>
        </View>

        <View style={estilos.seccion}>
          <Text style={estilos.tituloPanel}>Productos</Text>
          {cargando && productos.length === 0 && <Cargando mensaje="Cargando productos..." />}
          {!!errorCarga && <Mensaje titulo="No se pudo cargar el listado" detalle={errorCarga} tipo="error" />}
          {!cargando && !errorCarga && productos.length === 0 && <Mensaje titulo="No hay productos cargados" detalle="Agregá el primero con el formulario de arriba." />}
          {productos.map((producto) => (
            <View key={producto.id} style={estilos.itemProducto}>
              <TarjetaProducto producto={producto} mostrarAccion={false} />
              <Text style={estilos.stock}>Stock: {producto.stock}</Text>
              <View style={estilos.acciones}>
                <View style={estilos.columna}><Boton titulo="Editar" variante="secundario" onPress={() => navigation.navigate('EditarProducto', { id: producto.id })} /></View>
                <View style={estilos.columna}><Boton titulo="Eliminar" variante="peligro" onPress={() => confirmarEliminar(producto)} /></View>
              </View>
            </View>
          ))}
          <Boton titulo="Cerrar sesión" variante="secundario" onPress={async () => { await logout(); navigation.goBack() }} />
        </View>
      </ScrollView>
    </View>
  )
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  contenido: { paddingHorizontal: 20, paddingBottom: 28, gap: 20 },
  panel: { padding: 18, borderRadius: 21, backgroundColor: colores.superficie, gap: 15 },
  tituloPanel: { color: colores.tinta, fontSize: 20, fontWeight: '800' },
  formulario: { gap: 14 },
  fila: { flexDirection: 'row', gap: 12 },
  columna: { flex: 1 },
  imagenElegida: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10, borderRadius: 14, backgroundColor: colores.fondo },
  vistaPrevia: { width: 64, height: 64, borderRadius: 10, backgroundColor: colores.primarioClaro },
  infoImagen: { flex: 1, gap: 4 },
  tituloImagen: { color: colores.tinta, fontSize: 13, fontWeight: '700' },
  nombreImagen: { color: colores.secundaria, fontSize: 12, lineHeight: 17 },
  seccion: { gap: 14 },
  itemProducto: { gap: 7 },
  stock: { color: colores.secundaria, fontSize: 12, textAlign: 'right' },
  acciones: { flexDirection: 'row', gap: 10, marginBottom: 8 },
})
