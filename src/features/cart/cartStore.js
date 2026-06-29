import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ─── Cart Store ────────────────────────────────────────────────────────────────
// Persisted to localStorage so cart survives page refresh.
// Server state (products, orders) lives in TanStack Query.
// This store manages ONLY local UI state for the cart.

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [], // [{ id, title, price, image, quantity }]

      // ── Add or increment ──
      addItem: (product) => {
        const { items } = get()
        const existing = items.find((i) => i.id === product.id)
        if (existing) {
          set({
            items: items.map((i) =>
              i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          })
        } else {
          set({ items: [...items, { ...product, quantity: 1 }] })
        }
      },

      // ── Set exact quantity ──
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        })
      },

      // ── Remove a single item ──
      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) })
      },

      // ── Empty the cart ──
      clearCart: () => set({ items: [] }),

      // ── Derived values ──
      get totalItems() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0)
      },
      get subtotal() {
        return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0)
      },
    }),
    {
      name: 'modern-market-cart', // localStorage key
    }
  )
)

export default useCartStore
