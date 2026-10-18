import api from './client'

export function crearFormularioProducto(datosProducto, imagen) {
  const formulario = new FormData()
  Object.entries(datosProducto).forEach(([nombre, valor]) => formulario.append(nombre, String(valor)))
  if (imagen) {
    formulario.append('imagen', {
      uri: imagen.uri,
      name: imagen.fileName || `bicileal-${Date.now()}.jpg`,
      type: imagen.mimeType || 'image/jpeg',
    })
  }
  return formulario
}

export async function obtenerProductos() {
  const { data } = await api.get('/api/productos/')
  return data
}

export async function crearProducto(datosProducto) {
  const { data } = await api.post('/api/productos/crear/', datosProducto)
  return data
}

export async function actualizarProducto(id, datosProducto) {
  const { data } = await api.patch(`/api/productos/${id}/actualizar/`, datosProducto)
  return data
}

export async function eliminarProducto(id) {
  const { data } = await api.delete(`/api/productos/${id}/eliminar/`)
  return data
}
