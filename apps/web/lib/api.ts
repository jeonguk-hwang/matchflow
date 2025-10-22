import axios from 'axios'

export const api = axios.create({ baseURL: 'http://localhost:4000' })

api.interceptors.request.use((config) => {
  // 쿠키에서 토큰을 읽어 Authorization 헤더에 붙임 (브라우저 전용)
  if (typeof document !== 'undefined') {
    const token = document.cookie.split('; ').find(v => v.startsWith('mf_token='))?.split('=')[1]
    if (token) config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== 'undefined') {
      location.href = '/login'
    }
    return Promise.reject(error)
  }
)