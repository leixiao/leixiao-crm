import axios, { AxiosInstance } from 'axios'
import { useNotyf } from '/@src/composable/useNotyf'
import { useUserSession } from '/@src/stores/userSession'

let api: AxiosInstance

const notyf = useNotyf()

export function createApi() {
  api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
  })

  api.interceptors.request.use((config) => {
    const userSession = useUserSession()
    if (userSession.isLoggedIn) {
      config.headers.Authorization = `Bearer ${userSession.token}`
    }
    return config
  })
  
  api.interceptors.response.use(
    (response) => {
      console.log('useAPI response: ', JSON.stringify(response, null, 2))
      return response
    },
    (err) => {
      console.log('useAPI Error: ', err.response.status)
      if (err.response.status === 401) {
        err.response.data = 'Wrong username or password'
      }else if(err.response.status == 403){
        err.response.data = 'Token expired, please login again.'
      }else if(err.response.status == 404){
        err.response.data = 'Wrong API.'
      }else if(err.response.status == 503){
        err.response.data = 'Service Unavailable, please contact IT.'
      }
      
      //Here the notyf cannot show up. Console shows error: "Cannot read properties of undefined (reading 'error')"
      notyf.error({
        message: err.response.data,
        duration: 5000,
      })
      return Promise.reject(err)
    }
  )

  return api
}

export function useApi() {
  if (!api) {
    createApi()
  }
  return api
}
