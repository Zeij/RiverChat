import axios, { AxiosInstance } from 'axios'
import { socketUrl } from './config'
import {
  requestFail,
  requestSuccess,
  responseFail,
  responseSuccess
} from './interceptors'
const raxios: AxiosInstance = axios.create({
  timeout: 60000, // 超时时间一分钟
  baseURL: socketUrl,
  headers: {
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache'
  }
})
// 应用拦截器
raxios.interceptors.request.use(requestSuccess, requestFail)
raxios.interceptors.response.use(responseSuccess, responseFail)
export default raxios
