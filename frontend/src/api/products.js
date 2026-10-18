import api from './client'

export async function obtenerProductos() {
  const { data } = await api.get('/productos/')
  return data
}


export async function crearProducto(formData) {
  const { data } = await api.post('/productos/crear/', formData)
  return data
}


export async function actualizarProducto({ id, formData }) {
  const { data } = await api.patch(`/productos/${id}/actualizar/`, formData)
  return data
}


export async function eliminarProducto(id) {
  await api.delete(`/productos/${id}/eliminar/`)
}


export function obtenerErrorApi(error, fallback) {
  const detalles = Object.values(error.response?.data?.details || {}).flat()
  return error.response?.data?.error || error.response?.data?.detail || detalles[0] || fallback
}