import axios from 'axios'
import { ElMessage, ElNotification } from 'element-plus'
import cookies from './cookies'

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
    config.headers['zhipin-note-id'] = '6558de4687b34a04'
    return config
  },
  (error: any) => {
    console.log('出错啦', error) // for debug
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
    console.log('err' + error) // for debug
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

export const requestZhipin = (options: any): Promise<ResultModelZhipin<any>> => {
  options.url = import.meta.env.VITE_MINI_ZHIPIN_API_PREFIX
  options.method = 'post'
  options.headers = { ...options.headers, traceid: getTraceid() }
  return request(options, import.meta.env.VITE_MINI_ZHIPIN_UI_PREFIX).then((res: any) => {
    if (res.success) {
      return res.body
    } else {
      errorCallBack(res)
      return Promise.reject(res)
    }
  }) as Promise<ResultModelZhipin<any>>
}

export const errorCallBack = (res: any) => {
  ElNotification({
    title: 'Error',
    message: (res.body ? JSON.stringify(res.body) : res.message) || res.message,
    type: 'error',
    duration: 2000,
  })
}
