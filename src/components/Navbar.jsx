import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import useCartStore from '../features/cart/cartStore'

const navItems = [
  { to: '/products', label: 'All Products' },
  { to: '/products?category=1', label: 'Clothes' },
  { to: '/products?category=2', label: 'Electronics' },
  { to: '/products?category=3', label: 'Furniture' },
  { to: '/orders', label: 'My Orders' },
]

export default function Navbar() {
  const navigate = useNavigate()
  const [term, setTerm] = useState('')
  const items = useCartStore((s) => s.items)
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)

  const handleSubmit = (event) => {
    event.preventDefault()
    const query = term.trim()
    navigate(query ? `/products?q=${encodeURIComponent(query)}` : '/products')
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between text-xs">
          <span className="hidden sm:inline text-slate-300">Call to order: +250 788 000 000</span>
          <span className="text-slate-300">Fast delivery across Kigali</span>
          <Link to="/orders" className="hidden sm:inline font-medium text-orange-300 hover:text-orange-200">
            Track order
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <span className="w-10 h-10 bg-orange-500 rounded-md flex items-center justify-center shadow-sm">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7h18M6 7l1 13h10l1-13M9 7V5a3 3 0 016 0v2"
                  />
                </svg>
              </span>
              <span className="text-2xl font-black tracking-tight text-slate-900">
                Modern<span className="text-orange-500">Market</span>
              </span>
            </Link>

            <Link
              to="/cart"
              className="relative lg:hidden p-2 text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
              aria-label="Cart"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 lg:max-w-2xl">
            <div className="flex overflow-hidden rounded-md border-2 border-orange-500 bg-white">
              <input
                type="search"
                value={term}
                onChange={(event) => setTerm(event.target.value)}
                placeholder="Search for products, brands and categories"
                className="w-full px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 sm:px-6 bg-orange-500 text-white text-sm font-bold hover:bg-orange-600 transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/products"
              className="px-4 py-2.5 rounded-md bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-colors"
            >
              Sell on Modern Market
            </Link>
            <Link
              to="/cart"
              className="relative flex items-center gap-2 px-3 py-2.5 text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="text-sm font-bold">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      <nav className="border-t border-slate-100 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto">
          <div className="flex items-center gap-5 h-10 min-w-max">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  `text-sm font-semibold transition-colors ${
                    isActive ? 'text-orange-600' : 'text-slate-600 hover:text-slate-900'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>
    </header>
  )
}
