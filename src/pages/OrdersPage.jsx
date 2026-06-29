import { Link } from 'react-router-dom'
import { useOrders } from '../features/orders/orderQueries'
import { ErrorMessage, EmptyState } from '../components/Feedback'
import { Skeleton } from '../components/Skeletons'

function OrderStatusBadge({ status }) {
  const map = {
    pending: 'bg-amber-50 text-amber-700',
    processing: 'bg-sky-50 text-sky-700',
    shipped: 'bg-violet-50 text-violet-700',
    delivered: 'bg-emerald-50 text-emerald-700',
    cancelled: 'bg-red-50 text-red-700',
  }
  const cls = map[status?.toLowerCase()] || 'bg-slate-100 text-slate-600'
  return <span className={`badge ${cls} capitalize`}>{status || 'Pending'}</span>
}

export default function OrdersPage() {
  const { data: orders, isLoading, isError, error } = useOrders()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">My Orders</h1>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-5 space-y-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <ErrorMessage message={error?.userMessage} />
      ) : !orders?.length ? (
        <EmptyState
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
          title="No orders yet"
          description="When you place an order, it'll appear here."
          action={<Link to="/products" className="btn-primary">Start Shopping</Link>}
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const date = order.createdAt
              ? new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })
              : 'Unknown date'
            const itemCount = order.items?.length || 0
            const total = order.totals?.total || order.total

            return (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="card p-5 block hover:shadow-md transition-shadow group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-sm font-semibold text-slate-800 group-hover:text-sky-600 transition-colors">
                        Order #{order.id}
                      </span>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <p className="text-xs text-slate-500">
                      {date} · {itemCount} {itemCount === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                  {total != null && (
                    <span className="text-base font-bold text-slate-900">
                      ${Number(total).toFixed(2)}
                    </span>
                  )}
                </div>

                {order.items?.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100 flex gap-2 flex-wrap">
                    {order.items.slice(0, 3).map((item, i) => (
                      <span key={i} className="text-xs text-slate-500 bg-slate-50 rounded-full px-2.5 py-1">
                        {item.title || `Item #${item.productId}`}
                      </span>
                    ))}
                    {order.items.length > 3 && (
                      <span className="text-xs text-slate-400 bg-slate-50 rounded-full px-2.5 py-1">
                        +{order.items.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
