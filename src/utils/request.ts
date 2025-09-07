import axios from 'axios'
import { ElMessage } from 'element-plus'
import cookies from './cookies'

const env = import.meta.env

// create an axios instance
const service = axios.create({
  timeout: 80000, // request timeout
})

// request interceptor
service.interceptors.request.use(
  (config: any) => {
    const token: string | undefined = cookies.get('bst')
    if (token) {
      config.headers['zp_token'] = token
    }
    config.headers['zhipin-phone'] = localStorage.getItem('zhipin-phone')
    config.headers['zhipin-note-id'] = env.VITE_MINI_ZHIPIN_NOTE_ID
    return config
  },
  (error: any) => {
    console.error(error)
    Promise.reject(error)
  }
)

const getTraceid = function () {
  for (var e = Date.now().toString(36).padStart(8, '0'), t = '', r = 0; r < 10; r++)
    t += '0123456789abcdefghijklmnopqrstuvwxyz'[Math.floor(36 * Math.random())]
  return 'F-'.concat(e).concat(t)
}

// response interceptor
service.interceptors.response.use(
  (response: any) => {
    return response.data
  },
  (error: any) => {
    console.error(error)
    ElMessage.error('服务器请求错误，请稍后再试')
    return Promise.reject(error)
  }
)

// assemble request
const request = (options: any, baseURL: string): Promise<any> => {
  // 合并baseURL到options中
  return service({ ...options, baseURL })
    .then((res) => res)
    .catch((error) => {
      throw error
    }) as Promise<any>
}

export const requestZhipin = async (options: any): Promise<ResultModelZhipin<any>> => {
  if (await requestAccount()) {
    errorCallBack('账号无效')
    return Promise.reject('账号无效')
  }
  options.url = env.VITE_MINI_ZHIPIN_API_PREFIX
  options.method = 'post'
  options.headers = { ...options.headers, traceid: getTraceid() }
  return request(options, env.VITE_MINI_ZHIPIN_UI_PREFIX).then((res: any) => {
    if (res.success) {
      return res.body
    } else {
      errorCallBack(res)
      return Promise.reject(res)
    }
  }) as Promise<ResultModelZhipin<any>>
}

export const errorCallBack = (res: any) => {
  const error = (res.body ? JSON.stringify(res.body) : res.message) || res.message || res
  console.error(error)
  ElMessage.error(error)
}

function requestAccount(): Promise<boolean> {
  return request(
    {
      url: '/account',
      method: 'get',
    },
    env.VITE_MINI_ZHIPIN_UI_PREFIX
  ).then((res: any) => {
    console.log('account', res)
    return res.isExpired
  }) as Promise<boolean>
}
