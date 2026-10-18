import axios from 'axios'
import { Platform } from 'react-native'
import * as SecureStore from 'expo-secure-store'

const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL
  || (Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000')
).replace(/\/+$/, '')

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
})

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export function resolverUrlMultimedia(ruta) {
  if (!ruta) return ''
  if (/^https?:\/\//i.test(ruta)) return ruta
  return `${API_BASE_URL}/${ruta.replace(/^\/+/, '')}`
}

export function obtenerErrorApi(error, fallback = 'Ocurrió un error. Intentá nuevamente.') {
  const detalles = Object.values(error.response?.data?.details || {}).flat()
  return error.response?.data?.error
    || error.response?.data?.detail
    || detalles[0]
    || error.message
    || fallback
}

export default api
