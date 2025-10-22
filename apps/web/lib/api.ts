import axios from 'axios'

// 외부 서버 호스트가 주어지면 '/api'를 붙여 사용, 없으면 Next의 '/api'로 프록시
const HOST = process.env.NEXT_PUBLIC_API_BASE
const BASE_URL = HOST && HOST.length > 0 ? `${HOST}/api` : '/api'

export const api = axios.create({ baseURL: BASE_URL })

api.interceptors.request.use((config) => {
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