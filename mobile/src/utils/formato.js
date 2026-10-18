const formatoPesos = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})

export function formatearPrecio(valor) {
  return formatoPesos.format(Number(valor) || 0)
}

export function formatearPrecioDolares(valor, cotizacion) {
  if (!cotizacion) return 'Cotización no disponible'
  const dolares = Math.round((Number(valor) || 0) / cotizacion)
  return `USD ${dolares.toLocaleString('es-AR')}`
}
