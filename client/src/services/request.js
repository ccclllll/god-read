import axios from 'axios'
import config from './config'

// create an axios instance
const service = axios.create({
  baseURL: config.BASE, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000000, // request timeout
  withCredentials: true
})

// request interceptor
service.interceptors.request.use(
  config => {
    // 对请求头的操作

    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  async response => {
    if (response.data.code === 10000 || response.data.code === '10000') {
      //return Promise.reject(new Error(response.data.message || 'Error'))
   
    } else {

      return response
    }
  },
  error => {
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)


export default service
