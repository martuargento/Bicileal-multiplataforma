import api from './client'

export async function crearPedido(total) {
  const { data } = await api.post('/api/pedidos/crear/', { total })
  return data
}

export async function obtenerPedidos() {
  const { data } = await api.get('/api/pedidos/')
  return data
}
