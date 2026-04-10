import axios from 'axios'

export const http = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

http.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('HTTP error:', error)
    const status = error.response?.status
    if (status === 401) {
      const currentPath = window.location.pathname
      const allowUnauthenticated =
        currentPath === '/login' ||
        currentPath === '/example-playground' ||
        currentPath.startsWith('/share/')
      if (!allowUnauthenticated) {
        window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`
      }
    }
    return Promise.reject(error)
  }
)
