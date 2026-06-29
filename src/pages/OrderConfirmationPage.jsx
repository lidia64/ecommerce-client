import { Link, useLocation, useParams } from 'react-router-dom'

export default function OrderConfirmationPage() {
  const { id } = useParams()
  const { state } = useLocation()
  const order = state?.order

  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      {/* Success icon */}
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-3xl font-bold text-slate-900 mb-2">Order Confirmed!</h1>
      <p className="text-slate-600 mb-1">
        Thank you for your purchase. Your order has been received.
      </p>
      {id && id !== 'confirmation' && (
        <p className="text-xs text-slate-500 mb-8">
          Order ID: <span className="font-mono font-medium text-slate-700">#{id}</span>
        </p>
      )}

      {/* Order summary if we have it */}
      {order?.items && (
        <div className="card p-4 text-left mb-8">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Items ordered</h2>
          <ul className="space-y-2">
            {order.items.map((item, i) => (
              <li key={i} className="flex justify-between text-sm text-slate-600">
                <span>{item.title || `Product #${item.productId}`} × {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* What's next */}
      <div className="card p-5 text-left mb-8">
        <h2 className="text-sm font-semibold text-slate-900 mb-3">What happens next?</h2>
        <ol className="space-y-2 text-sm text-slate-600 list-decimal list-inside">
          <li>You'll receive a confirmation email shortly.</li>
          <li>Your order will be processed within 1 business day.</li>
          <li>Estimated delivery: 3–7 business days.</li>
        </ol>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/orders" className="btn-primary">
          View Order History
        </Link>
        <Link to="/products" className="btn-secondary">
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}
