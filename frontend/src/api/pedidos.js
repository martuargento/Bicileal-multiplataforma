import api from './client'

export async function crearPedido(total) {
  const { data } = await api.post('/pedidos/crear/', { total })
  return data
}