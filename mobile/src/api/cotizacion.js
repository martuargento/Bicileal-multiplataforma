import axios from 'axios'

export async function obtenerCotizacionDolar() {
  const { data } = await axios.get('https://api.bluelytics.com.ar/v2/latest', { timeout: 10000 })
  const valor = Number(data?.oficial?.value_sell)
  if (!Number.isFinite(valor) || valor <= 0) {
    throw new Error('La cotización recibida no es válida.')
  }
  return valor
}
