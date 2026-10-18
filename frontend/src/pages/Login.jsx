import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '../hooks/useAuth'
import { loginSchema, registroSchema } from '../utils/validaciones'

export default function Login() {
  const { login, registro: crearCuenta } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [modoRegistro, setModoRegistro] = useState(false)
  const [error, setError] = useState('')
  const esquema = modoRegistro ? registroSchema : loginSchema
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(esquema),
    defaultValues: { username: '', email: '', password: '' },
  })

  const onSubmit = async (form) => {
    setError('')

    try {
      if (modoRegistro) {
        await crearCuenta(form.username, form.email, form.password)
      } else {
        await login(form.username, form.password)
      }
      const destino = location.state?.from
      const rutaDestino = destino?.pathname
        ? `${destino.pathname}${destino.search || ''}${destino.hash || ''}`
        : '/dashboard'
      navigate(rutaDestino, { replace: true })
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.detail || err.message || 'No se pudo iniciar sesión.')
    }
  }


  const alternarModoRegistro = () => {
    setError('')
    setModoRegistro((modoActual) => !modoActual)
  }

  
  return (
    <div className="container">
      <div className="auth-card">
        <h1>{modoRegistro ? 'Crear cuenta' : 'Iniciar sesión'}</h1>
        <p className="muted">Acceso con autenticación JWT</p>

        <form onSubmit={handleSubmit(onSubmit)} className="form-grid" noValidate>
          <label htmlFor="username">Usuario</label>
          <input id="username" type="text" autoComplete="username" placeholder="Usuario" {...register('username')} />
          {errors.username && <small role="alert">{errors.username.message}</small>}

          {modoRegistro && (
            <>
              <label htmlFor="email">Email</label>
              <input id="email" type="email" autoComplete="email" placeholder="Email" {...register('email')} />
              {errors.email && <small role="alert">{errors.email.message}</small>}
            </>
          )}

          <label htmlFor="password">Contraseña</label>
          <input id="password" type="password" autoComplete={modoRegistro ? 'new-password' : 'current-password'} placeholder="Contraseña" {...register('password')} />
          {errors.password && <small role="alert">{errors.password.message}</small>}

          {error && <p role="alert" style={{ color: 'crimson' }}>{error}</p>}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Procesando...' : modoRegistro ? 'Registrarme' : 'Entrar'}
          </button>
          <button type="button" className="secondary" onClick={alternarModoRegistro}>
            {modoRegistro ? 'Ya tengo cuenta' : 'Crear cuenta'}
          </button>
        </form>
      </div>
    </div>
  )
}
