import { Link } from 'react-router-dom'
import useCartStore from '../features/cart/cartStore'
import { EmptyState } from '../components/Feedback'

const FALLBACK = 'https://placehold.co/80x80/e2e8f0/94a3b8?text=IMG'

export default function CartPage() {
  const items = useCartStore((s) => s.items)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)
  const clearCart = useCartStore((s) => s.clearCart)

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const shipping = subtotal > 50 ? 0 : 9.99
  const total = subtotal + shipping

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <EmptyState
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          title="Your cart is empty"
          description="Add some products to get started."
          action={
            <Link to="/products" className="btn-primary">
              Browse Products
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Your Cart <span className="text-slate-400 font-normal text-base ml-1">({items.length} {items.length === 1 ? 'item' : 'items'})</span>
        </h1>
        <button
          onClick={clearCart}
          className="text-xs text-red-500 hover:text-red-700 hover:underline"
        >
          Clear cart
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* ── Line Items ───────────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="card flex gap-4 p-4">
              {/* Thumbnail */}
              <Link to={`/products/${item.id}`} className="flex-shrink-0">
                <img
                  src={item.image || FALLBACK}
                  alt={item.title}
                  className="w-20 h-20 object-cover rounded-lg"
                  onError={(e) => { e.currentTarget.src = FALLBACK }}
                />
              </Link>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.id}`} className="text-sm font-semibold text-slate-800 hover:text-sky-600 line-clamp-2 block mb-1">
                  {item.title}
                </Link>
                <p className="text-xs text-slate-500 mb-3">
                  ${Number(item.price).toFixed(2)} each
                </p>

                <div className="flex items-center justify-between">
                  {/* Quantity stepper */}
                  <div className="flex items-center gap-2 border border-slate-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-slate-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                      aria-label="Remove item"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Order Summary ────────────────────────────────────────────────── */}
        <div>
          <div className="card p-6 sticky top-24">
            <h2 className="text-base font-semibold text-slate-900 mb-5">Order Summary</h2>

            <div className="space-y-3 text-sm mb-5">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-emerald-600 font-medium">Free</span> : `$${shipping.toFixed(2)}`}</span>
              </div>
              {subtotal <= 50 && (
                <p className="text-xs text-sky-600 bg-sky-50 rounded-lg px-3 py-2">
                  Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                </p>
              )}
              <div className="border-t border-slate-200 pt-3 flex justify-between font-bold text-slate-900">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <Link to="/checkout" className="btn-primary w-full py-3 text-sm">
              Proceed to Checkout →
            </Link>
            <Link to="/products" className="btn-secondary w-full py-2.5 text-sm mt-2 text-center">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
