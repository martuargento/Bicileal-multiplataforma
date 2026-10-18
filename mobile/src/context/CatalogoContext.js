import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { obtenerProductos } from '../api/productos'

const CatalogoContext = createContext(null)

export function CatalogoProvider({ children }) {
  const [productos, setProductos] = useState([])

  const cargarProductos = useCallback(async () => {
    const lista = await obtenerProductos()
    setProductos(lista)
    return lista
  }, [])

  const agregarAlCatalogo = useCallback((producto) => {
    setProductos((listaActual) => [
      producto,
      ...listaActual.filter((item) => item.id !== producto.id),
    ].sort((a, b) => Number(b.id) - Number(a.id)))
  }, [])

  const actualizarEnCatalogo = useCallback((productoActualizado) => {
    setProductos((listaActual) => listaActual.map((producto) => (
      producto.id === productoActualizado.id ? productoActualizado : producto
    )))
  }, [])

  const quitarDelCatalogo = useCallback((id) => {
    setProductos((listaActual) => listaActual.filter((producto) => producto.id !== id))
  }, [])

  const value = useMemo(() => ({
    productos,
    cargarProductos,
    agregarAlCatalogo,
    actualizarEnCatalogo,
    quitarDelCatalogo,
  }), [productos, cargarProductos, agregarAlCatalogo, actualizarEnCatalogo, quitarDelCatalogo])

  return <CatalogoContext.Provider value={value}>{children}</CatalogoContext.Provider>
}

export function useCatalogo() {
  const context = useContext(CatalogoContext)
  if (!context) throw new Error('useCatalogo debe utilizarse dentro de CatalogoProvider.')
  return context
}
