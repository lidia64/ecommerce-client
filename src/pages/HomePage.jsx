import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { ProductGridSkeleton } from '../components/Skeletons'
import { useCategories, useProducts } from '../features/products/productQueries'

const FALLBACK = 'https://placehold.co/400x300/f8fafc/f97316?text=Category'

const quickLinks = ['Supermarket', 'Phones', 'Computers', 'Home & Living', 'Fashion', 'Beauty']

export default function HomePage() {
  const { data: categories, isLoading: categoriesLoading } = useCategories()
  const { data: products, isLoading: productsLoading } = useProducts({ limit: 8, offset: 0 })

  return (
    <div className="bg-slate-100">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
          <aside className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-orange-500 text-white font-bold text-sm">
              Product Categories
            </div>
            <div className="divide-y divide-slate-100">
              {categoriesLoading
                ? Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="px-4 py-3">
                      <div className="skeleton h-4 w-4/5" />
                    </div>
                  ))
                : categories?.slice(0, 8).map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/products?category=${cat.id}`}
                      className="flex items-center justify-between px-4 py-3 text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    >
                      <span>{cat.name}</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
            </div>
          </aside>

          <div className="grid gap-4 xl:grid-cols-[1fr_280px]">
            <div className="relative min-h-[360px] overflow-hidden rounded-md bg-white border border-slate-200 shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1400&q=80"
                alt="Online shopping products"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/45 to-transparent" />
              <div className="relative max-w-xl px-6 sm:px-10 py-10 sm:py-14 text-white">
                <p className="inline-flex bg-orange-500 px-3 py-1 rounded-sm text-xs font-black uppercase tracking-wide mb-5">
                  Best prices in town
                </p>
                <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
                  Shop electronics, fashion and home essentials.
                </h1>
                <p className="text-sm sm:text-base text-slate-100 mb-7">
                  Discover new deals, compare categories, and check out quickly with a clean local shopping experience.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link to="/products" className="btn-primary rounded-md bg-orange-500 hover:bg-orange-600 active:bg-orange-700">
                    Start Shopping
                  </Link>
                  <Link to="/orders" className="btn-secondary rounded-md border-white/30 bg-white/95 text-slate-900 hover:bg-white">
                    My Orders
                  </Link>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              <div className="bg-white border border-slate-200 rounded-md shadow-sm p-5">
                <p className="text-xs font-bold uppercase text-orange-500 mb-2">Today only</p>
                <h2 className="text-2xl font-black text-slate-900 leading-tight mb-2">Up to 45% off selected items</h2>
                <p className="text-sm text-slate-500 mb-5">Fresh deals across top categories.</p>
                <Link to="/products" className="text-sm font-bold text-orange-600 hover:text-orange-700">
                  Shop deals
                </Link>
              </div>
              <div className="bg-slate-900 text-white rounded-md shadow-sm p-5">
                <p className="text-xs font-bold uppercase text-orange-300 mb-2">Delivery</p>
                <h2 className="text-2xl font-black leading-tight mb-2">Fast dispatch from trusted stores</h2>
                <p className="text-sm text-slate-300">Order, pay, and follow every purchase from your account.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 grid gap-3 sm:grid-cols-3 text-sm">
          {[
            ['Fast Delivery', 'Reliable fulfillment for your order'],
            ['Secure Checkout', 'Simple local cart and payment flow'],
            ['Support', 'Order history stays easy to find'],
          ].map(([title, description]) => (
            <div key={title} className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-md bg-orange-100 text-orange-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span>
                <span className="block font-bold text-slate-900">{title}</span>
                <span className="block text-xs text-slate-500">{description}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-5">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Featured Categories</h2>
            <p className="text-sm text-slate-500">Browse the sections shoppers visit most.</p>
          </div>
          <Link to="/products" className="text-sm font-bold text-orange-600 hover:text-orange-700">
            View all products
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {(categories || []).slice(0, 6).map((cat) => {
            const img = Array.isArray(cat.image) ? cat.image[0] : cat.image || FALLBACK
            return (
              <Link
                key={cat.id}
                to={`/products?category=${cat.id}`}
                className="bg-white rounded-md border border-slate-200 overflow-hidden hover:border-orange-300 hover:shadow-sm transition"
              >
                <img
                  src={img}
                  alt={cat.name}
                  className="w-full aspect-square object-cover bg-slate-100"
                  onError={(event) => {
                    event.currentTarget.src = FALLBACK
                  }}
                />
                <span className="block px-3 py-2 text-sm font-bold text-slate-800 truncate">{cat.name}</span>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-4 sm:px-5 py-4 border-b border-slate-200 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900">Latest Products</h2>
              <p className="text-sm text-slate-500">New arrivals ready for your cart.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {quickLinks.map((label) => (
                <Link
                  key={label}
                  to={`/products?q=${encodeURIComponent(label)}`}
                  className="px-3 py-1.5 rounded-md bg-slate-100 text-xs font-bold text-slate-600 hover:bg-orange-100 hover:text-orange-700 transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div className="p-4 sm:p-5">
            {productsLoading ? (
              <ProductGridSkeleton count={8} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {products?.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
