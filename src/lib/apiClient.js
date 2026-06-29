import axios from 'axios'

// ─── Axios Instance ────────────────────────────────────────────────────────────
// Replace BASE_URL with your actual API base URL from the E-Comm API docs.
const BASE_URL = 'https://api.escuelajs.co/api/v1'

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// ─── Request Interceptor ───────────────────────────────────────────────────────
// Attach auth token if present (e.g., after login)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ─── Response Interceptor ─────────────────────────────────────────────────────
// Surfaces server-side error messages from the response body
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const serverMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred'

    // Attach a clean message so UI can display it
    error.userMessage = serverMessage

    if (error.response?.status === 401) {
      // Token expired — clear storage and redirect to login
      localStorage.removeItem('access_token')
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default apiClient
