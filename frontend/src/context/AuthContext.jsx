import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { cargarPerfil, login as peticionLogin, registro as peticionRegistro } from '../api/auth'

export const AuthContext = createContext(null)

function recuperarUsuarioGuardado() {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null')
  } catch {
    return null
  }
}


export function AuthProvider({ children }) {
  const [user, setUser] = useState(recuperarUsuarioGuardado)
  const [token, setToken] = useState(() => localStorage.getItem('access_token'))
  const [loading, setLoading] = useState(true)
  const [errorPerfil, setErrorPerfil] = useState('')
  const [intentoValidacion, setIntentoValidacion] = useState(0)

  useEffect(() => {
    let activo = true

    const cargar = async () => {
      if (!token) {
        setUser(null)
        setErrorPerfil('')
        setLoading(false)
        return
      }

      setLoading(true)
      setErrorPerfil('')

      try {
        const usuario = await cargarPerfil()
        if (!activo) return
        setUser(usuario)
        localStorage.setItem('user', JSON.stringify(usuario))
      } catch (error) {
        if (!activo) return

        if (error.response?.status === 401) {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          localStorage.removeItem('user')
          setUser(null)
          setToken(null)
        } else {
          setErrorPerfil('No pudimos verificar la sesión con el servidor. Conservamos la sesión local; podés reintentar.')
        }
      } finally {
        if (activo) setLoading(false)
      }
    }

    cargar()
    return () => { activo = false }
  }, [token, intentoValidacion])



  const login = async (username, password) => {
    const session = await peticionLogin(username, password)
    setToken(session.access)
    setUser(session.user)
    return session
  }


  const registro = async (username, email, password) => {
    const session = await peticionRegistro(username, email, password)
    setToken(session.access)
    setUser(session.user)
    return session
  }



  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    setUser(null)
    setToken(null)
  }


  const reintentarPerfil = () => setIntentoValidacion((intento) => intento + 1)

  
  const value = useMemo(() => ({
    user,
    token,
    loading,
    errorPerfil,
    login,
    registro,
    logout,
    reintentarPerfil,
  }), [user, token, loading, errorPerfil])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
