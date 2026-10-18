import axios from 'axios'

export const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')

const api = axios.create({
  baseURL: API_BASE_URL,
})


export function resolverUrlMultimedia(ruta) {
  if (!ruta) return ''

  try {
    return new URL(ruta, `${API_BASE_URL || window.location.origin}/`).href
  } catch {
    return ruta
  }
}


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    }
  }

  return config
})


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')

      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export default api
