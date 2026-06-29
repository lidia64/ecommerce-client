import { Link } from 'react-router-dom'
import useCartStore from '../features/cart/cartStore'

const FALLBACK_IMG = 'https://placehold.co/400x300/f8fafc/f97316?text=No+Image'

export default function ProductCard({ product }) {
  const addItem = useCartStore((s) => s.addItem)
  const cartItems = useCartStore((s) => s.items)
  const inCart = cartItems.find((i) => i.id === product.id)

  const imageUrl =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0].replace(/[[\]"]/g, '')
      : FALLBACK_IMG

  const handleAdd = (event) => {
    event.preventDefault()
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: imageUrl,
    })
  }

  return (
    <Link
      to={`/products/${product.id}`}
      className="bg-white border border-slate-200 rounded-md overflow-hidden group block hover:border-orange-300 hover:shadow-md transition"
    >
      <div className="relative overflow-hidden bg-slate-100 aspect-[4/3]">
        <img
          src={imageUrl}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(event) => {
            event.currentTarget.src = FALLBACK_IMG
          }}
          loading="lazy"
        />
        {product.category && (
          <span className="absolute top-2 left-2 badge rounded-md bg-white text-slate-700 shadow-sm border border-slate-100">
            {product.category.name}
          </span>
        )}
      </div>

      <div className="p-3">
        <h3 className="text-sm font-bold text-slate-800 line-clamp-2 min-h-10 group-hover:text-orange-600 transition-colors">
          {product.title}
        </h3>
        <p className="text-xs text-slate-500 line-clamp-2 mt-1 min-h-8">{product.description}</p>

        <div className="flex items-center justify-between gap-3 mt-3">
          <span className="text-lg font-black text-orange-600">
            ${Number(product.price).toFixed(2)}
          </span>
          <button
            onClick={handleAdd}
            className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-bold text-white transition-colors ${
              inCart ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-orange-500 hover:bg-orange-600'
            }`}
          >
            {inCart ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                In Cart
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </Link>
  )
}
