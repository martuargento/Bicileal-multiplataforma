import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'
import { cargarPerfil, crearCuenta, iniciarSesion } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [cargandoSesion, setCargandoSesion] = useState(true)
  const [errorSesion, setErrorSesion] = useState('')

  useEffect(() => {
    let activo = true

    async function restaurarSesion() {
      try {
        const [token, usuarioGuardado] = await Promise.all([
          SecureStore.getItemAsync('access_token'),
          AsyncStorage.getItem('bicileal-user'),
        ])
        if (!token) return
        if (usuarioGuardado && activo) setUsuario(JSON.parse(usuarioGuardado))

        try {
          const perfil = await cargarPerfil()
          if (!activo) return
          setUsuario(perfil)
          await AsyncStorage.setItem('bicileal-user', JSON.stringify(perfil))
        } catch (error) {
          if (error.response?.status === 401) {
            await SecureStore.deleteItemAsync('access_token')
            await AsyncStorage.removeItem('bicileal-user')
            if (activo) setUsuario(null)
          } else if (activo) {
            setErrorSesion('No pudimos validar tu sesión. Revisá que el servidor esté conectado.')
          }
        }
      } catch (error) {
        if (activo) setErrorSesion(`No se pudo restaurar la sesión: ${error.message}`)
      } finally {
        if (activo) setCargandoSesion(false)
      }
    }

    restaurarSesion()
    return () => { activo = false }
  }, [])

  const guardarSesion = useCallback(async ({ usuario: nuevoUsuario, token }) => {
    if (!token) throw new Error('La respuesta del servidor no incluyó el token de acceso.')
    await SecureStore.setItemAsync('access_token', token)
    await AsyncStorage.setItem('bicileal-user', JSON.stringify(nuevoUsuario))
    setUsuario(nuevoUsuario)
    setErrorSesion('')
  }, [])

  const login = useCallback(async (username, password) => {
    const sesion = await iniciarSesion(username, password)
    await guardarSesion(sesion)
  }, [guardarSesion])

  const registro = useCallback(async (username, email, password) => {
    const sesion = await crearCuenta(username, email, password)
    await guardarSesion(sesion)
  }, [guardarSesion])

  const logout = useCallback(async () => {
    await SecureStore.deleteItemAsync('access_token')
    await AsyncStorage.removeItem('bicileal-user')
    setUsuario(null)
  }, [])

  const reintentarSesion = useCallback(async () => {
    setErrorSesion('')
    try {
      const perfil = await cargarPerfil()
      setUsuario(perfil)
      await AsyncStorage.setItem('bicileal-user', JSON.stringify(perfil))
    } catch (error) {
      setErrorSesion(`No se pudo validar la sesión: ${error.message}`)
    }
  }, [])

  const value = useMemo(() => ({
    usuario,
    cargandoSesion,
    errorSesion,
    login,
    registro,
    logout,
    reintentarSesion,
  }), [usuario, cargandoSesion, errorSesion, login, registro, logout, reintentarSesion])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe utilizarse dentro de AuthProvider.')
  return context
}
