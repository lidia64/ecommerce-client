import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { ProductGridSkeleton } from '../components/Skeletons'
import { ErrorMessage, EmptyState } from '../components/Feedback'
import { useProducts, useCategories } from '../features/products/productQueries'
import { useDebounce } from '../hooks/useDebounce'

const LIMIT = 12

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [categoryId, setCategoryId] = useState(searchParams.get('category') || '')
  const [page, setPage] = useState(Number(searchParams.get('page') || 1))

  const debouncedSearch = useDebounce(search, 400)
  const offset = (page - 1) * LIMIT

  const { data: products, isLoading, isError, error } = useProducts({
    categoryId: categoryId || undefined,
    search: debouncedSearch || undefined,
    offset,
    limit: LIMIT,
  })

  const { data: categories } = useCategories()

  useEffect(() => {
    const params = {}
    if (debouncedSearch) params.q = debouncedSearch
    if (categoryId) params.category = categoryId
    if (page > 1) params.page = page
    setSearchParams(params, { replace: true })
  }, [debouncedSearch, categoryId, page, setSearchParams])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, categoryId])

  const handleCategoryChange = (id) => {
    setCategoryId(id === categoryId ? '' : id)
  }

  const hasResults = Array.isArray(products) && products.length > 0
  const canGoNext = hasResults && products.length === LIMIT

  return (
    <div className="bg-slate-100 min-h-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white border border-slate-200 rounded-md shadow-sm mb-5 px-4 sm:px-5 py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-black text-slate-900">Products</h1>
              <p className="text-sm text-slate-500 mt-1">
                {!isLoading && hasResults
                  ? `Showing ${offset + 1}-${offset + products.length}`
                  : 'Browse our full catalog'}
              </p>
            </div>

            <div className="relative w-full lg:max-w-xl">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search products"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="input rounded-md border-orange-200 pl-9 pr-10 focus:ring-orange-500"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-600"
                  aria-label="Clear search"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-5">
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white border border-slate-200 rounded-md shadow-sm sticky top-36 overflow-hidden">
              <div className="px-4 py-3 bg-orange-500 text-white text-sm font-black">
                Categories
              </div>
              <div className="p-3">
                <button
                  onClick={() => handleCategoryChange('')}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-bold transition-colors ${
                    !categoryId
                      ? 'bg-orange-100 text-orange-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  All Categories
                </button>
                <div className="mt-2 space-y-1">
                  {categories?.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(String(cat.id))}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        categoryId === String(cat.id)
                          ? 'bg-orange-100 text-orange-700 font-bold'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {isLoading ? (
              <ProductGridSkeleton count={LIMIT} />
            ) : isError ? (
              <ErrorMessage message={error?.userMessage} />
            ) : !hasResults ? (
              <EmptyState
                icon={
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                }
                title="No products found"
                description={search ? `No results for "${search}". Try a different search term.` : 'No products in this category yet.'}
                action={
                  <button
                    onClick={() => {
                      setSearch('')
                      setCategoryId('')
                    }}
                    className="btn-primary rounded-md bg-orange-500 hover:bg-orange-600"
                  >
                    Clear filters
                  </button>
                }
              />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                <div className="bg-white border border-slate-200 rounded-md shadow-sm flex items-center justify-between mt-6 p-3">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="btn-secondary rounded-md"
                  >
                    Previous
                  </button>
                  <span className="text-sm font-bold text-slate-600">Page {page}</span>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!canGoNext}
                    className="btn-secondary rounded-md"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
