import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useProduct } from '../features/products/productQueries'
import { ProductDetailSkeleton } from '../components/Skeletons'
import { ErrorMessage } from '../components/Feedback'
import useCartStore from '../features/cart/cartStore'

const FALLBACK = 'https://placehold.co/600x450/e2e8f0/94a3b8?text=No+Image'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: product, isLoading, isError, error } = useProduct(id)

  const addItem = useCartStore((s) => s.addItem)
  const cartItems = useCartStore((s) => s.items)
  const inCart = cartItems.find((i) => i.id === Number(id))

  const [selectedImg, setSelectedImg] = useState(0)
  const [addedFeedback, setAddedFeedback] = useState(false)

  const handleAdd = () => {
    const imageUrl = images[0] || FALLBACK
    addItem({ id: product.id, title: product.title, price: product.price, image: imageUrl })
    setAddedFeedback(true)
    setTimeout(() => setAddedFeedback(false), 2000)
  }

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <ProductDetailSkeleton />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <ErrorMessage message={error?.userMessage} />
      </div>
    )
  }

  const images = (product.images || []).map((img) =>
    typeof img === 'string' ? img.replace(/[[\]"]/g, '') : img
  ).filter(Boolean)

  if (images.length === 0) images.push(FALLBACK)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
        <Link to="/" className="hover:text-slate-800">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-slate-800">Products</Link>
        <span>/</span>
        <span className="text-slate-800 font-medium truncate max-w-xs">{product.title}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10">
        {/* ── Image Gallery ──────────────────────────────────────────────── */}
        <div className="space-y-3">
          <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100">
            <img
              src={images[selectedImg]}
              alt={product.title}
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.src = FALLBACK }}
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImg(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImg === i ? 'border-sky-500' : 'border-transparent'
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.src = FALLBACK }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Product Info ───────────────────────────────────────────────── */}
        <div>
          {product.category && (
            <Link
              to={`/products?category=${product.category.id}`}
              className="badge bg-sky-50 text-sky-700 mb-3 hover:bg-sky-100"
            >
              {product.category.name}
            </Link>
          )}
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
            {product.title}
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            {product.description}
          </p>

          <div className="flex items-baseline gap-2 mb-8">
            <span className="text-3xl font-bold text-slate-900">
              ${Number(product.price).toFixed(2)}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAdd}
              className={`btn-primary flex-1 py-3 text-sm ${
                addedFeedback ? 'bg-emerald-600 hover:bg-emerald-700' : ''
              }`}
            >
              {addedFeedback ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Added to Cart!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Add to Cart
                </>
              )}
            </button>
            {inCart && (
              <Link to="/cart" className="btn-secondary flex-1 py-3 text-sm text-center">
                View Cart →
              </Link>
            )}
          </div>

          {/* Features */}
          <div className="mt-8 pt-6 border-t border-slate-200 space-y-3">
            {[
              { icon: '🚚', text: 'Free shipping on orders over $50' },
              { icon: '↩️', text: '30-day easy returns' },
              { icon: '🔒', text: 'Secure checkout' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-sm text-slate-600">
                <span>{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
