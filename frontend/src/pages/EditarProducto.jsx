import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Header from '../components/Header'
import { obtenerErrorApi } from '../api/products'
import { useActualizarProducto, useProductos } from '../hooks/useProducts'
import { productoSchema } from '../utils/validaciones'

const valoresInicialesProducto = { nombre: '', descripcion: '', precio: '', stock: '' }


export default function EditarProducto() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: productos = [], isPending: cargandoProductos, error: errorCarga } = useProductos()
  const producto = productos.find((item) => String(item.id) === String(id))
  const actualizarProductoMutation = useActualizarProducto()
  const [imagen, setImagen] = useState(null)
  const [errorAccion, setErrorAccion] = useState('')
  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm({
    resolver: zodResolver(productoSchema),
    defaultValues: valoresInicialesProducto,
  })

  useEffect(() => {
    if (!producto || isDirty) return
    reset({
      nombre: producto.nombre || '',
      descripcion: producto.descripcion || '',
      precio: String(producto.precio ?? ''),
      stock: String(producto.stock ?? ''),
    })
  }, [producto, reset, isDirty])



  const guardarCambios = async (datosProducto) => {
    setErrorAccion('')

    try {
      const formData = new FormData()
      Object.entries(datosProducto).forEach(([nombre, valor]) => formData.append(nombre, valor))

      if (imagen) {
        formData.append('imagen', imagen)
      }

      await actualizarProductoMutation.mutateAsync({ id, formData })
      navigate('/dashboard')
    } catch (requestError) {
      setErrorAccion(obtenerErrorApi(requestError, 'No se pudo actualizar el producto.'))
    }
  }


  const mensajeErrorCarga = errorCarga
    ? obtenerErrorApi(errorCarga, 'No se pudo cargar el producto.')
    : ''


    
  return (
    <div className="pagina-tiempo-real dashboard-page">
      <Header />

      <div className="dashboard-shell edit-shell">
        <div className="dashboard-panel">
          <h2>Editar producto</h2>
          {cargandoProductos && <p>Cargando producto...</p>}
          {mensajeErrorCarga && <p role="alert">{mensajeErrorCarga}</p>}
          {!cargandoProductos && !mensajeErrorCarga && !producto && <p>No se encontró el producto.</p>}
          {producto && (
            <form onSubmit={handleSubmit(guardarCambios)} className="dashboard-form dashboard-form-edit">
              <input {...register('nombre')} placeholder="Nombre" />
              {errors.nombre && <small role="alert">{errors.nombre.message}</small>}
              <input {...register('descripcion')} placeholder="Descripción" />
              <input {...register('precio')} type="number" min="0" step="0.01" placeholder="Precio" />
              {errors.precio && <small role="alert">{errors.precio.message}</small>}
              <input {...register('stock')} type="number" min="0" step="1" placeholder="Stock" />
              {errors.stock && <small role="alert">{errors.stock.message}</small>}
              <label className="file-upload">
                <span>Seleccionar imagen nueva</span>
                <input type="file" accept="image/*" onChange={(evento) => setImagen(evento.target.files[0] || null)} />
              </label>
              {errorAccion && <p role="alert">{errorAccion}</p>}
              <div className="dashboard-actions edit-buttons">
                <button type="submit" disabled={actualizarProductoMutation.isPending}>{actualizarProductoMutation.isPending ? 'Guardando...' : 'Guardar cambios'}</button>
                <button type="button" className="dashboard-delete" onClick={() => navigate('/dashboard')}>Cancelar</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
