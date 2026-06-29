import { Link, useParams, useLocation } from 'react-router-dom'
import { useOrder } from '../features/orders/orderQueries'
import { ErrorMessage } from '../components/Feedback'
import { Skeleton } from '../components/Skeletons'

const FALLBACK = 'https://placehold.co/60x60/e2e8f0/94a3b8?text=IMG'

export default function OrderDetailPage() {
  const { id } = useParams()
  const { state } = useLocation()

  // Use passed state (from confirmation page) or fetch from API
  const { data: fetchedOrder, isLoading, isError, error } = useOrder(
    state?.order ? null : id
  )

  const order = state?.order || fetchedOrder

  const date = order?.createdAt
    ? new Date(order.createdAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
      })
    : null

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-4">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-32" />
        <div className="card p-6 space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full" />)}
        </div>
      </div>
    )
  }

  if (isError) return <div className="max-w-3xl mx-auto px-4 py-10"><ErrorMessage message={error?.userMessage} /></div>
  if (!order) return null

  const subtotal = order.totals?.subtotal || order.items?.reduce((s, i) => s + i.price * i.quantity, 0) || 0
  const shipping = order.totals?.shipping ?? (subtotal > 50 ? 0 : 9.99)
  const total = order.totals?.total || subtotal + shipping

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link to="/orders" className="hover:text-slate-800">My Orders</Link>
        <span>/</span>
        <span className="text-slate-800 font-medium">Order #{order.id}</span>
      </nav>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Order #{order.id}</h1>
          {date && <p className="text-sm text-slate-500 mt-1">Placed on {date}</p>}
        </div>
        <span className={`badge text-sm px-3 py-1 ${
          order.status === 'delivered' ? 'bg-emerald-50 text-emerald-700' :
          order.status === 'shipped'   ? 'bg-violet-50 text-violet-700'  :
          order.status === 'cancelled' ? 'bg-red-50 text-red-700'        :
                                         'bg-amber-50 text-amber-700'
        } capitalize`}>
          {order.status || 'Pending'}
        </span>
      </div>

      {/* Items */}
      <div className="card p-6 mb-6">
        <h2 className="text-sm font-semibold text-slate-900 mb-4">Items</h2>
        <ul className="divide-y divide-slate-100">
          {order.items?.map((item, i) => (
            <li key={i} className="flex gap-4 py-4 first:pt-0 last:pb-0">
              <img
                src={item.image || item.product?.images?.[0] || FALLBACK}
                alt={item.title}
                className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                onError={(e) => { e.currentTarget.src = FALLBACK }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800">{item.title || `Product #${item.productId}`}</p>
                <p className="text-xs text-slate-500 mt-0.5">Qty: {item.quantity} × ${Number(item.price).toFixed(2)}</p>
              </div>
              <span className="text-sm font-semibold text-slate-900">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {/* Shipping */}
        {order.shipping && (
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">Shipping Address</h2>
            <address className="text-sm text-slate-600 not-italic space-y-0.5">
              <p>{order.shipping.name}</p>
              <p>{order.shipping.address}</p>
              <p>{order.shipping.city}, {order.shipping.zip}</p>
              <p>{order.shipping.country}</p>
            </address>
          </div>
        )}

        {/* Totals */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">Order Total</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping</span>
              <span>{shipping === 0 ? <span className="text-emerald-600">Free</span> : `$${Number(shipping).toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between font-bold text-slate-900 pt-2 border-t border-slate-200">
              <span>Total</span><span>${Number(total).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Link to="/orders" className="btn-secondary">← Back to Orders</Link>
      </div>
    </div>
  )
}
