import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '../../lib/apiClient'

// ─── API Functions ─────────────────────────────────────────────────────────────

export const submitOrder = async (orderPayload) => {
  // Adjust endpoint to match your API spec
  const { data } = await apiClient.post('/orders', orderPayload)
  return data
}

export const fetchOrders = async () => {
  const { data } = await apiClient.get('/orders')
  return data
}

export const fetchOrderById = async (id) => {
  const { data } = await apiClient.get(`/orders/${id}`)
  return data
}

// ─── Query Keys ────────────────────────────────────────────────────────────────
export const orderKeys = {
  all: ['orders'],
  detail: (id) => ['orders', id],
}

// ─── Hooks ─────────────────────────────────────────────────────────────────────

export const useOrders = () =>
  useQuery({
    queryKey: orderKeys.all,
    queryFn: fetchOrders,
  })

export const useOrder = (id) =>
  useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => fetchOrderById(id),
    enabled: !!id,
  })

export const useSubmitOrder = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: submitOrder,
    onSuccess: () => {
      // Invalidate orders list so history refreshes
      queryClient.invalidateQueries({ queryKey: orderKeys.all })
    },
  })
}
