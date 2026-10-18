import api from './client'

async function crearSesion(data) {
  const access = data.tokens?.access || data.access
  const refresh = data.tokens?.refresh || data.refresh

  if (!access) {
    throw new Error('La respuesta de autenticación no incluye un token de acceso.')
  }

  localStorage.setItem('access_token', access)
  if (refresh) localStorage.setItem('refresh_token', refresh)

  const user = data.user || (await api.get('/auth/perfil/')).data
  localStorage.setItem('user', JSON.stringify(user))

  return { user, access, refresh }
}




export async function login(username, password) {
  const { data } = await api.post('/auth/login/', { username, password })
  return crearSesion(data)
}


export async function registro(username, email, password) {
  const { data } = await api.post('/auth/registro/', { username, email, password })

  if (data.tokens?.access || data.access) return crearSesion(data)
  return login(username, password)
}


export async function cargarPerfil() {
  const { data } = await api.get('/auth/perfil/')
  return data.user || data
}