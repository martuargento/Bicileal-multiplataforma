import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function RutaProtegida({ children }) {
  const { user, loading, token, errorPerfil, reintentarPerfil } = useAuth()
  const location = useLocation()

  
  if (loading) {
    return <div className="container">Cargando...</div>
  }

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (!user) {
    return (
      <div className="container" role="alert">
        <p>{errorPerfil || 'No se pudo recuperar el usuario de la sesión.'}</p>
        <button type="button" onClick={reintentarPerfil}>Reintentar</button>
      </div>
    )
  }

  
  return (
    <>
      {errorPerfil && (
        <div className="container" role="status">
          <p>{errorPerfil}</p>
          <button type="button" onClick={reintentarPerfil}>Reintentar</button>
        </div>
      )}
      {children}
    </>
  )
}
