import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { obtenerProductos, crearProducto, actualizarProducto, eliminarProducto } from '../api/products'

const claveConsultaProductos = ['productos']


export function useProductos() {
  return useQuery({ queryKey: claveConsultaProductos, queryFn: obtenerProductos })
}


export function useCrearProducto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: crearProducto,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: claveConsultaProductos }),
  })
}


export function useActualizarProducto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: actualizarProducto,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: claveConsultaProductos }),
  })
}


export function useEliminarProducto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: eliminarProducto,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: claveConsultaProductos }),
  })
}