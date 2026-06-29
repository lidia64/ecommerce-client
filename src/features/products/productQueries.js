import { useQuery } from '@tanstack/react-query'
import apiClient from '../../lib/apiClient'

// ─── API Functions ─────────────────────────────────────────────────────────────

export const fetchCategories = async () => {
  const { data } = await apiClient.get('/categories')
  return data
}

export const fetchProducts = async ({ categoryId, search, offset = 0, limit = 12 }) => {
  const params = { offset, limit }
  if (search) params.title = search
  const url = categoryId
    ? `/categories/${categoryId}/products`
    : '/products'
  const { data } = await apiClient.get(url, { params })
  return data
}

export const fetchProductById = async (id) => {
  const { data } = await apiClient.get(`/products/${id}`)
  return data
}

// ─── Query Keys ────────────────────────────────────────────────────────────────
export const productKeys = {
  all: ['products'],
  list: (filters) => ['products', 'list', filters],
  detail: (id) => ['products', 'detail', id],
  categories: ['categories'],
}

// ─── Hooks ─────────────────────────────────────────────────────────────────────

export const useCategories = () =>
  useQuery({
    queryKey: productKeys.categories,
    queryFn: fetchCategories,
    staleTime: Infinity, // categories rarely change
  })

export const useProducts = ({ categoryId, search, offset, limit } = {}) =>
  useQuery({
    queryKey: productKeys.list({ categoryId, search, offset, limit }),
    queryFn: () => fetchProducts({ categoryId, search, offset, limit }),
  })

export const useProduct = (id) =>
  useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => fetchProductById(id),
    enabled: !!id,
  })
