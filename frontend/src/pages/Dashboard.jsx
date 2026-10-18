import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Header from '../components/Header'
import { obtenerErrorApi } from '../api/products'
import { useCrearProducto, useEliminarProducto, useProductos } from '../hooks/useProducts'
import { useAuth } from '../hooks/useAuth'
import { productoSchema } from '../utils/validaciones'

const initialForm = { nombre: '', descripcion: '', precio: '', stock: '' }


export default function Dashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { data: productos = [], isPending: cargandoProductos, error: errorCarga } = useProductos()
  const crearProductoMutation = useCrearProducto()
  const eliminarProductoMutation = useEliminarProducto()
  const [imagen, setImagen] = useState(null)
  const [errorAccion, setErrorAccion] = useState('')
  const inputImagenRef = useRef(null)
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(productoSchema),
    defaultValues: initialForm,
  })


  const guardarProducto = async (datosProducto) => {
    setErrorAccion('')

    try {
      const formData = new FormData()
      Object.entries(datosProducto).forEach(([nombre, valor]) => formData.append(nombre, valor))

      if (imagen) {
        formData.append('imagen', imagen)
      }

      await crearProductoMutation.mutateAsync(formData)
      reset(initialForm)
      setImagen(null)
      if (inputImagenRef.current) inputImagenRef.current.value = ''
    } catch (error) {
      setErrorAccion(obtenerErrorApi(error, 'No se pudo guardar el producto.'))
    }
  }


  const eliminarProductoDelPanel = async (id) => {
    setErrorAccion('')
    try {
      await eliminarProductoMutation.mutateAsync(id)
    } catch (error) {
      setErrorAccion(obtenerErrorApi(error, 'No se pudo eliminar el producto.'))
    }
  }

  const mensajeErrorCarga = errorCarga
    ? obtenerErrorApi(errorCarga, 'No se pudieron cargar los productos.')
    : ''

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  
  return (
    <div className="pagina-tiempo-real dashboard-page">
      <Header />

      <div className="dashboard-shell">
        <div className="dashboard-topbar">
          <div>
            <strong>Mi dashboard</strong>
          </div>
          <div className="dashboard-user-row">
            <span>Bienvenido, {user?.username}</span>
            <button type="button" className="dashboard-logout" onClick={handleLogout}>Cerrar sesión</button>
          </div>
        </div>

        <section className="dashboard-panel">
          <h2>Agregar producto</h2>
          <form onSubmit={handleSubmit(guardarProducto)} className="dashboard-form">
            <input {...register('nombre')} placeholder="Nombre" />
            {errors.nombre && <small role="alert">{errors.nombre.message}</small>}
            <input {...register('descripcion')} placeholder="Descripción" />
            <input {...register('precio')} type="number" min="0" step="0.01" placeholder="Precio" />
            {errors.precio && <small role="alert">{errors.precio.message}</small>}
            <input {...register('stock')} type="number" min="0" step="1" placeholder="Stock" />
            {errors.stock && <small role="alert">{errors.stock.message}</small>}
            <label className="file-upload">
              <span>Seleccionar archivo</span>
              <input ref={inputImagenRef} name="imagen" type="file" accept="image/*" onChange={(evento) => setImagen(evento.target.files[0] || null)} />
            </label>
            <button type="submit" disabled={crearProductoMutation.isPending}>{crearProductoMutation.isPending ? 'Guardando...' : 'Guardar'}</button>
          </form>
          {errorAccion && <p role="alert">{errorAccion}</p>}
        </section>

        <section className="dashboard-products">
          <h2>Productos</h2>
          {cargandoProductos && <p>Cargando productos...</p>}
          {mensajeErrorCarga && <p role="alert">{mensajeErrorCarga}</p>}
          {!cargandoProductos && !mensajeErrorCarga && productos.length === 0 && <p>No hay productos cargados todavía.</p>}
          <div className="dashboard-grid">
            {!mensajeErrorCarga && productos.map((producto) => (
              <article key={producto.id} className="dashboard-card">
                <h3>{producto.nombre}</h3>
                <p className="muted">{producto.descripcion || 'Sin descripción'}</p>
                <p><strong>Precio:</strong> ${Number(producto.precio).toFixed(2)}</p>
                <p><strong>Stock:</strong> {producto.stock}</p>
                <div className="dashboard-actions">
                  <button type="button" className="dashboard-edit" onClick={() => navigate(`/editar/${producto.id}`)}>Editar</button>
                  <button type="button" className="dashboard-delete" disabled={eliminarProductoMutation.isPending} onClick={() => eliminarProductoDelPanel(producto.id)}>Eliminar</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
