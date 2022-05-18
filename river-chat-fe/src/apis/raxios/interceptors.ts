import { AxiosRequestConfig, AxiosResponse } from 'axios'

// 请求拦截器
export const requestSuccess = (config: AxiosRequestConfig) => {
  const token = localStorage.getItem('rivertoken')
  config.headers!.Authorization = token ? `Bearer ${JSON.parse(token)}` : ''
  return config
}

export const requestFail = (error: AxiosRequestConfig) => {
  return Promise.reject(error)
}

// 接收拦截器
export const responseSuccess = (config: AxiosResponse) => {
  return config
}

export const responseFail = (error: AxiosResponse) => {
  return Promise.reject(error)
}
