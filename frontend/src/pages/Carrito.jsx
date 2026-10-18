import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Header from '../components/Header'
import { obtenerErrorApi } from '../api/products'
import { useAuth } from '../hooks/useAuth'
import { useCrearPedido } from '../hooks/usePedidos'
import { useValorDolar } from '../hooks/useValorDolar'
import { useCarritoStore } from '../store/carritoStore'

export default function Carrito() {
  const navigate = useNavigate()
  const { user, token, loading: cargandoSesion } = useAuth()
  const carrito = useCarritoStore((estado) => estado.items)
  const quitarDelCarrito = useCarritoStore((estado) => estado.quitarDelCarrito)
  const vaciarCarrito = useCarritoStore((estado) => estado.vaciarCarrito)
  const crearPedidoMutation = useCrearPedido()
  const { valor: cotizacion, cargando: cargandoCotizacion } = useValorDolar()
  const [mensajePedido, setMensajePedido] = useState('')
  const [errorPedido, setErrorPedido] = useState('')

  const totalAr = carrito.reduce((sum, item) => sum + Number(item.precio || 0) * Number(item.cantidad || 0), 0)
  const formatearPrecioDolares = (valor) => {
    if (!cotizacion) return cargandoCotizacion ? 'Cargando cotización...' : 'Cotización no disponible'
    return `USD ${Math.round(valor / cotizacion).toLocaleString('es-AR')}`
  }


  const confirmarPedido = async () => {
    if (cargandoSesion || carrito.length === 0) return

    if (!user || !token) {
      navigate('/login', { state: { from: { pathname: '/carrito' } } })
      return
    }

    setErrorPedido('')
    setMensajePedido('')

    try {
      const pedido = await crearPedidoMutation.mutateAsync(Number(totalAr.toFixed(2)))
      vaciarCarrito()
      setMensajePedido(`El pedido #${pedido.id} se registró correctamente.`)
    } catch (error) {
      setErrorPedido(obtenerErrorApi(error, 'No se pudo registrar el pedido.'))
    }
  }

  
  return (
    <div className="pagina-tiempo-real">
      <Header />

      <div className="page-shell">
        <div className="page-card carrito-page">
          <h1>Carrito</h1>

          {mensajePedido && <p role="status">{mensajePedido}</p>}
          {errorPedido && <p role="alert">{errorPedido}</p>}
          {carrito.length === 0 ? (
            <>
              {!mensajePedido && <p>Aún no agregaste productos.</p>}
              <Link to="/" className="link-volver">Volver a la tienda</Link>
            </>
          ) : (
            <>
              <div className="carrito-lista">
                {carrito.map((item) => (
                  <div key={item.id} className="carrito-item">
                    <div>
                      <h3>{item.titulo}</h3>
                      <p>Cantidad: {item.cantidad}</p>
                    </div>
                    <div className="carrito-item-precio">
                      <span>$ {Number(item.precio * item.cantidad).toLocaleString('es-AR')}</span>
                      <span>{formatearPrecioDolares(item.precio * item.cantidad)}</span>
                    </div>
                    <button type="button" className="quit-btn" onClick={() => quitarDelCarrito(item.id)}>Quitar</button>
                  </div>
                ))}
              </div>

              <div className="carrito-total-final">
                <h3>Total</h3>
                <p>$ {totalAr.toLocaleString('es-AR')}</p>
                <p>{formatearPrecioDolares(totalAr)}</p>
              </div>

              <div className="carrito-actions">
                <button type="button" className="submit-btn" onClick={vaciarCarrito}>Vaciar carrito</button>
                <button type="button" className="submit-btn" onClick={confirmarPedido} disabled={cargandoSesion || crearPedidoMutation.isPending}>
                  {crearPedidoMutation.isPending ? 'Registrando pedido...' : user ? 'Confirmar pedido' : 'Iniciar sesión para comprar'}
                </button>
                <Link to="/" className="submit-btn secondary">Seguir comprando</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
