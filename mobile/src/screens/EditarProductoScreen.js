import { useEffect, useState } from 'react'
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import Encabezado from '../components/Encabezado'
import { Boton, Campo, Cargando, Mensaje } from '../components/Controles'
import { actualizarProducto, crearFormularioProducto, obtenerProductos } from '../api/productos'
import { obtenerErrorApi } from '../api/client'
import { useCatalogo } from '../context/CatalogoContext'
import { colores } from '../theme/colores'

export default function EditarProductoScreen({ navigation, route }) {
  const { id } = route.params
  const { actualizarEnCatalogo } = useCatalogo()
  const [producto, setProducto] = useState(null)
  const [datosProducto, setDatosProducto] = useState({ nombre: '', descripcion: '', precio: '', stock: '' })
  const [imagen, setImagen] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true
    obtenerProductos()
      .then((productos) => {
        const encontrado = productos.find((item) => String(item.id) === String(id))
        if (!activo) return
        if (!encontrado) setError('No se encontró el producto.')
        else {
          setProducto(encontrado)
          setDatosProducto({
            nombre: encontrado.nombre || '',
            descripcion: encontrado.descripcion || '',
            precio: String(encontrado.precio ?? ''),
            stock: String(encontrado.stock ?? ''),
          })
        }
      })
      .catch((errorCarga) => { if (activo) setError(obtenerErrorApi(errorCarga, 'No se pudo cargar el producto.')) })
      .finally(() => { if (activo) setCargando(false) })
    return () => { activo = false }
  }, [id])

  async function seleccionarImagen() {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permiso.granted) {
      Alert.alert('Permiso necesario', 'Permití el acceso a tus fotos para elegir una imagen de producto.')
      return
    }
    const resultado = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: false, quality: 0.8 })
    if (!resultado.canceled) setImagen(resultado.assets[0])
  }

  async function guardarCambios() {
    const precio = Number(datosProducto.precio)
    const stock = Number(datosProducto.stock)
    if (!datosProducto.nombre.trim()) return setError('El nombre es obligatorio.')
    if (datosProducto.precio.trim() === '' || !Number.isFinite(precio) || precio < 0) return setError('Ingresá un precio válido, mayor o igual a cero.')
    if (datosProducto.stock.trim() === '' || !Number.isInteger(stock) || stock < 0) return setError('Ingresá un stock entero, mayor o igual a cero.')

    setError('')
    setGuardando(true)
    try {
      const productoActualizado = await actualizarProducto(id, crearFormularioProducto({ ...datosProducto, nombre: datosProducto.nombre.trim(), precio, stock }, imagen))
      actualizarEnCatalogo(productoActualizado)
      navigation.goBack()
    } catch (errorGuardar) {
      setError(obtenerErrorApi(errorGuardar, 'No se pudo actualizar el producto.'))
    } finally {
      setGuardando(false)
    }
  }

  return (
    <View style={estilos.pantalla}>
      <Encabezado navigation={navigation} titulo="Editar producto" subtitulo="Actualizá la información de tu catálogo." />
      <ScrollView contentContainerStyle={estilos.contenido} keyboardShouldPersistTaps="handled">
        {cargando ? <Cargando mensaje="Cargando producto..." /> : producto && (
          <View style={estilos.formulario}>
            <Campo etiqueta="Nombre" valor={datosProducto.nombre} alCambiar={(nombre) => setDatosProducto((actual) => ({ ...actual, nombre }))} placeholder="Nombre" />
            <Campo etiqueta="Descripción" valor={datosProducto.descripcion} alCambiar={(descripcion) => setDatosProducto((actual) => ({ ...actual, descripcion }))} placeholder="Descripción" multilinea />
            <Campo etiqueta="Precio (ARS)" valor={datosProducto.precio} alCambiar={(precio) => setDatosProducto((actual) => ({ ...actual, precio }))} placeholder="0" teclado="decimal-pad" />
            <Campo etiqueta="Stock" valor={datosProducto.stock} alCambiar={(stock) => setDatosProducto((actual) => ({ ...actual, stock }))} placeholder="0" teclado="number-pad" />
            <Boton titulo={imagen ? 'Cambiar imagen' : 'Seleccionar imagen nueva'} variante="secundario" onPress={seleccionarImagen} />
            {!!imagen && (
              <View style={estilos.imagenElegida}>
                <Image source={{ uri: imagen.uri }} style={estilos.vistaPrevia} />
                <View style={estilos.infoImagen}>
                  <Text style={estilos.tituloImagen}>Imagen lista para guardar</Text>
                  <Text style={estilos.nombreImagen} numberOfLines={2}>
                    {imagen.fileName || 'Se adjuntará al producto cuando toques Guardar cambios.'}
                  </Text>
                </View>
              </View>
            )}
            {!!error && <Mensaje titulo="No se pudieron guardar los cambios" detalle={error} tipo="error" />}
            <Boton titulo="Guardar cambios" onPress={guardarCambios} cargando={guardando} />
            <Boton titulo="Cancelar" variante="secundario" onPress={() => navigation.goBack()} />
          </View>
        )}
        {!cargando && !producto && !!error && <Mensaje titulo="Producto no disponible" detalle={error} tipo="error" />}
      </ScrollView>
    </View>
  )
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  contenido: { paddingHorizontal: 20, paddingBottom: 28 },
  formulario: { padding: 18, borderRadius: 21, backgroundColor: colores.superficie, gap: 15 },
  imagenElegida: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10, borderRadius: 14, backgroundColor: colores.fondo },
  vistaPrevia: { width: 64, height: 64, borderRadius: 10, backgroundColor: colores.primarioClaro },
  infoImagen: { flex: 1, gap: 4 },
  tituloImagen: { color: colores.tinta, fontSize: 13, fontWeight: '700' },
  nombreImagen: { color: colores.secundaria, fontSize: 12, lineHeight: 17 },
})
