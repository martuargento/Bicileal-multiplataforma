import api from './client'

export async function iniciarSesion(username, password) {
  const { data } = await api.post('/api/auth/login/', { username, password })
  return {
    usuario: data.user,
    token: data.tokens?.access || data.access,
  }
}

export async function crearCuenta(username, email, password) {
  const { data } = await api.post('/api/auth/registro/', { username, email, password })
  return {
    usuario: data.user,
    token: data.tokens?.access || data.access,
  }
}

export async function cargarPerfil() {
  const { data } = await api.get('/api/auth/perfil/')
  return data.user || data
}
