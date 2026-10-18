import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import { resolverUrlMultimedia } from '../api/client'
import { useValorDolar } from '../hooks/useValorDolar'
import { obtenerErrorApi } from '../api/products'
import { useProductos } from '../hooks/useProducts'
import { useCarritoStore } from '../store/carritoStore'

const IMAGEN_FALLBACK = 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=900&q=80'

const formatNumber = (value) => Number(value || 0)


export default function Tienda() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { data: productos = [], isPending: cargandoProductos, error: errorCarga } = useProductos()
  const { valor: cotizacion, cargando: cargandoCotizacion } = useValorDolar()
  const carrito = useCarritoStore((estado) => estado.items)
  const quitarDelCarrito = useCarritoStore((estado) => estado.quitarDelCarrito)
  const agregarAlCarrito = useCarritoStore((estado) => estado.agregarAlCarrito)
  const errorProductos = errorCarga
    ? obtenerErrorApi(errorCarga, 'No se pudieron cargar los productos.')
    : ''

  const totalItems = carrito.reduce((sum, item) => sum + Number(item.cantidad || 0), 0)
  const totalAr = carrito.reduce((sum, item) => sum + Number(item.precio || 0) * Number(item.cantidad || 0), 0)
  const agregarProductoAlCarrito = (producto) => {
    agregarAlCarrito(producto)
    setMenuOpen(true)
  }

  const formatearPrecio = (valor) => `$${formatNumber(valor).toLocaleString('es-AR')}`
  const formatearPrecioDolares = (valor) => {
    if (!cotizacion) return cargandoCotizacion ? 'Cargando cotización...' : 'Cotización no disponible'
    return `USD ${Math.round(formatNumber(valor) / cotizacion).toLocaleString('es-AR')}`
  }

  
  return (
    <div className="pagina-tiempo-real">
      <Header paginaActiva="productos">
        <div className="contenedor-carrito">
          <button type="button" className="contenedor-carrito-icono" aria-label={`Carrito, ${totalItems} productos`} aria-expanded={menuOpen} aria-controls="mini-carrito" onClick={() => setMenuOpen((valor) => !valor)}>
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="icono-carrito">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            <span className="contador-productos">
              <span id="contador-productos">{totalItems}</span>
            </span>
          </button>

          <div id="mini-carrito" className={`contenedor-productos-carrito ${menuOpen ? '' : 'ocultar'}`}>
            <div className="fila-de-un-producto">
              {carrito.length === 0 ? (
                <p className="carrito-vacio">El carrito esta vacio</p>
              ) : (
                carrito.map((item) => (
                  <div className="producto-seleccionado" key={item.id}>
                    <div className="info-producto-seleccionado">
                      <span className="cantidad-producto-seleccionado">{item.cantidad}</span>
                      <p className="titulo-producto-seleccionado">{item.titulo}</p>
                      <div className="contenedor-productos-sel">
                        <span className="precio-producto-seleccionado">{formatearPrecio(item.precio * item.cantidad)}</span>
                        <span className="precio-producto-seleccionado-usd">{formatearPrecioDolares(item.precio * item.cantidad)}</span>
                      </div>
                    </div>
                    <button type="button" className="boton-quitar-carrito" aria-label={`Quitar ${item.titulo} del carrito`} onClick={() => quitarDelCarrito(item.id)}>
                      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="icono-cerrar">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>

            {carrito.length > 0 && (
              <>
                <div className="carrito-total">
                  <h3>Total:</h3>
                  <span className="total-pagar">{formatearPrecio(totalAr)}</span>
                  <span className="total-pagar-usd">{formatearPrecioDolares(totalAr)}</span>
                </div>
                <div className="comprar">
                  <Link to="/carrito" className="boton-comprar">Ir al carrito</Link>
                </div>
              </>
            )}
          </div>
        </div>
      </Header>

      <main className="contenedor-productos-ofrecidos container-main">
        {cargandoProductos ? (
          <div className="empty-state">Cargando productos...</div>
        ) : errorProductos ? (
          <div className="empty-state" role="alert">{errorProductos}</div>
        ) : productos.length === 0 ? (
          <div className="empty-state">No hay productos cargados todavía.</div>
        ) : (
          productos.map((producto) => {
            return (
              <div className="item" key={producto.id}>
                <figure>
                  <img src={producto.imagen ? resolverUrlMultimedia(producto.imagen) : IMAGEN_FALLBACK} alt={producto.nombre} className="imagen" />
                  <div className="superposicion" />
                </figure>

                <div className="info-producto-ofrecido">
                  <h2>{producto.nombre}</h2>
                  <div className="contenedor-precio">
                    <p className="precio">{formatearPrecio(producto.precio)}</p>
                    <p className="precio_usd">{formatearPrecioDolares(producto.precio)}</p>
                  </div>
                  <button type="button" className="btn-agregar-carrito" onClick={() => agregarProductoAlCarrito(producto)}>
                    Añadir al carrito
                  </button>
                </div>
              </div>
            )
          })
        )}
      </main>

      <footer>
        <hr />
        <small> ©2026 Mayorista Bicileal </small>
      </footer>
    </div>
  )
}
