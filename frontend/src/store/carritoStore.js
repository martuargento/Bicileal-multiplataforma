import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

function recuperarCarritoLocalStorage() {
  try {
    const saved = JSON.parse(localStorage.getItem('bicicleal-cart') || 'null')
    if (Array.isArray(saved)) return saved
    return Array.isArray(saved?.state?.items) ? saved.state.items : []
  } catch {
    return []
  }
}

export const useCarritoStore = create(
  persist(
    (set) => ({
      items: recuperarCarritoLocalStorage(),
      agregarAlCarrito: (producto) => set((estado) => {
        const productoExistente = estado.items.find((item) => item.id === producto.id)
        if (productoExistente) {
          return {
            items: estado.items.map((item) =>
              item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
            ),
          }
        }

        return {
          items: [...estado.items, {
            id: producto.id,
            titulo: producto.nombre,
            precio: Number(producto.precio || 0),
            cantidad: 1,
          }],
        }
      }),
      quitarDelCarrito: (id) => set((estado) => ({
        items: estado.items.filter((item) => item.id !== id),
      })),
      vaciarCarrito: () => set({ items: [] }),
    }),
    {
      name: 'bicicleal-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (estado) => ({ items: estado.items }),
    }
  )
)