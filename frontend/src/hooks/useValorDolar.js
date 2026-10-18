import { useQuery } from '@tanstack/react-query'

export function useValorDolar() {
  const consulta = useQuery({
    queryKey: ['cotizacion', 'dolar', 'oficial'],
    queryFn: async () => {
      const respuesta = await fetch('https://api.bluelytics.com.ar/v2/latest')
      if (!respuesta.ok) throw new Error('No se pudo cargar la cotización del dólar.')

      const datos = await respuesta.json()
      const valorDolar = Number(datos?.oficial?.value_sell)
      if (!Number.isFinite(valorDolar) || valorDolar <= 0) {
        throw new Error('La cotización recibida no es válida.')
      }

      return valorDolar
    },
    staleTime: 15 * 60 * 1000,
  })

  
  return {
    valor: consulta.data ?? null,
    cargando: consulta.isPending,
  }
}