import { useMutation } from '@tanstack/react-query'
import { crearPedido } from '../api/pedidos'


export function useCrearPedido() {
  return useMutation({ mutationFn: crearPedido })
}