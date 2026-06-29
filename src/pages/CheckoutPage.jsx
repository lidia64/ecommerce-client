import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useCartStore from '../features/cart/cartStore'
import { useSubmitOrder } from '../features/orders/orderQueries'

const FALLBACK = 'https://placehold.co/60x60/e2e8f0/94a3b8?text=IMG'

const INITIAL_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  address: '',
  city: '',
  zip: '',
  country: '',
  cardNumber: '',
  expiry: '',
  cvv: '',
}

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items)
  const clearCart = useCartStore((s) => s.clearCart)
  const navigate = useNavigate()

  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const shipping = subtotal > 50 ? 0 : 9.99
  const total = subtotal + shipping

  const { mutate: submitOrder, isPending } = useSubmitOrder()

  const validate = () => {
    const e = {}
    if (!form.firstName.trim()) e.firstName = 'Required'
    if (!form.lastName.trim()) e.lastName = 'Required'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Enter a valid email'
    if (!form.address.trim()) e.address = 'Required'
    if (!form.city.trim()) e.city = 'Required'
    if (!form.zip.trim()) e.zip = 'Required'
    if (!form.country.trim()) e.country = 'Required'
    if (!form.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) e.cardNumber = 'Enter a 16-digit card number'
    if (!form.expiry.match(/^\d{2}\/\d{2}$/)) e.expiry = 'Format: MM/YY'
    if (!form.cvv.match(/^\d{3,4}$/)) e.cvv = '3 or 4 digits'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    let formatted = value
    if (name === 'cardNumber') {
      formatted = value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
    }
    if (name === 'expiry') {
      formatted = value.replace(/\D/g, '').slice(0, 4).replace(/(\d{2})(\d)/, '$1/$2')
    }
    setForm((prev) => ({ ...prev, [name]: formatted }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setServerError('')
    if (!validate()) return

    const payload = {
      items: items.map((i) => ({ productId: i.id, quantity: i.quantity, price: i.price })),
      shipping: { name: `${form.firstName} ${form.lastName}`, address: form.address, city: form.city, zip: form.zip, country: form.country },
      contact: { email: form.email },
      totals: { subtotal, shipping, total },
    }

    submitOrder(payload, {
      onSuccess: (order) => {
        clearCart()
        navigate(`/orders/${order?.id || 'confirmation'}`, { state: { order } })
      },
      onError: (err) => {
        setServerError(err?.userMessage || 'Order submission failed. Please try again.')
      },
    })
  }

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-600 mb-4">Your cart is empty.</p>
        <Link to="/products" className="btn-primary">Browse Products</Link>
      </div>
    )
  }

  const Field = ({ label, name, type = 'text', placeholder, half }) => (
    <div className={half ? 'col-span-1' : 'col-span-2'}>
      <label className="block text-xs font-medium text-slate-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className={`input ${errors[name] ? 'border-red-400 focus:ring-red-400' : ''}`}
      />
      {errors[name] && <p className="text-xs text-red-500 mt-1">{errors[name]}</p>}
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── Form ─────────────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Contact */}
            <div className="card p-6">
              <h2 className="text-sm font-semibold text-slate-900 mb-4">Contact Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <Field label="First name" name="firstName" placeholder="Jane" half />
                <Field label="Last name" name="lastName" placeholder="Doe" half />
                <Field label="Email address" name="email" type="email" placeholder="jane@example.com" />
              </div>
            </div>

            {/* Shipping */}
            <div className="card p-6">
              <h2 className="text-sm font-semibold text-slate-900 mb-4">Shipping Address</h2>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Street address" name="address" placeholder="123 Main St" />
                <Field label="City" name="city" placeholder="New York" half />
                <Field label="ZIP / Postal code" name="zip" placeholder="10001" half />
                <Field label="Country" name="country" placeholder="United States" />
              </div>
            </div>

            {/* Payment */}
            <div className="card p-6">
              <h2 className="text-sm font-semibold text-slate-900 mb-1">Payment Details</h2>
              <p className="text-xs text-slate-500 mb-4">This is a demo — no real payment is processed.</p>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Card number" name="cardNumber" placeholder="1234 5678 9012 3456" />
                <Field label="Expiry" name="expiry" placeholder="MM/YY" half />
                <Field label="CVV" name="cvv" placeholder="123" half />
              </div>
            </div>
          </div>

          {/* ── Summary ──────────────────────────────────────────────────── */}
          <div>
            <div className="card p-6 sticky top-24">
              <h2 className="text-sm font-semibold text-slate-900 mb-4">Order Summary</h2>

              <ul className="space-y-3 mb-4">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-3 items-center">
                    <img
                      src={item.image || FALLBACK}
                      alt={item.title}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      onError={(e) => { e.currentTarget.src = FALLBACK }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-800 line-clamp-1">{item.title}</p>
                      <p className="text-xs text-slate-500">Qty {item.quantity}</p>
                    </div>
                    <span className="text-xs font-semibold text-slate-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="border-t border-slate-200 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <span className="text-emerald-600">Free</span> : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total</span><span>${total.toFixed(2)}</span>
                </div>
              </div>

              {serverError && (
                <p className="mt-4 text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{serverError}</p>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="btn-primary w-full py-3 text-sm mt-5"
              >
                {isPending ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Placing Order…
                  </>
                ) : (
                  'Place Order'
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
