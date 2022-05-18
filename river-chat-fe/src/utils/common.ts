import { AxiosResponse } from 'axios'
import { FormItemRule, useMessage } from 'naive-ui'
import dayjs from 'dayjs'
export function nameVerify(rule: FormItemRule, value: string) {
  const nameReg = /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/
  if (!value) {
    return new Error('用户名不能为空')
  } else if (!nameReg.test(value)) {
    return new Error(
      '用户名只含有汉字、字母、数字和下划线，不能以下划线开头和结尾'
    )
  } else if (value.length > 9) {
    return new Error('用户名长度应小于10')
  } else if (value.length < 3) {
    return new Error('用户名长度应大于3')
  }
  return true
}
export function passwordVerify(rule: FormItemRule, value: string) {
  const passwordReg = /^\w+$/gis
  if (!value) {
    return new Error('密码不能为空')
  } else if (!passwordReg.test(value)) {
    return new Error('密码只含有字母、数字和下划线')
  } else if (value.length > 9) {
    return new Error('密码长度应小于10')
  } else if (value.length < 3) {
    return new Error('密码长度应大于3')
  }
  return true
}
// 处理所有后端返回的数据
export function processReturn<T>(res: AxiosResponse<ServerRes<T>>) {
  // 服务器定义code： 0:成功 1:错误 2:后端报错
  let { code, msg, data } = res.data
  if (code) {
    window.$message.error(msg)
    return data
  }
  if (msg) {
    window.$message.success(msg)
  }
  return data
}
export function processReturnArr<T>(res: AxiosResponse<ServerArrRes<T>>) {
  // 服务器定义code： 0:成功 1:错误 2:后端报错
  let { code, msg, data } = res.data
  if (code) {
    window.$message.error(msg)
    return data
  }
  if (msg) {
    window.$message.success(msg)
  }
  return data
}

export function changenameVerify(name: string): boolean {
  const nameReg = /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/
  if (name.length === 0) {
    return false
  }
  if (!nameReg.test(name)) {
    return false
  }
  if (name.length < 3) {
    return false
  }
  if (name.length > 9) {
    return false
  }
  return true
}
export function GroupnameVerify(name: string): boolean {
  const nameReg = /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/
  if (name.length === 0) {
    window.$message.error('群名不能为空')
    return false
  }
  if (!nameReg.test(name)) {
    window.$message.error(
      '群名只含有汉字、字母、数字和下划线 不能以下划线开头和结尾'
    )
    return false
  }
  if (name.length < 3) {
    window.$message.error('群名不能小于3')
    return false
  }
  if (name.length > 9) {
    window.$message.error('群名太长')
    return false
  }
  return true
}

export function changepasswordVerify(password: string): boolean {
  const passwordReg = /^\w+$/gis
  if (password.length === 0) {
    return false
  }
  if (!passwordReg.test(password)) {
    return false
  }
  if (password.length < 3) {
    return false
  }
  if (password.length > 9) {
    return false
  }
  return true
}
//判断是否URL
export function isUrl(text: string) {
  // 解析网址
  const UrlReg = new RegExp(/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/)
  return UrlReg.test(text)
}

//消息时间格式化
export function formatTime(time: number) {
  const nowTime = new Date().valueOf()
  // 大于昨天
  if (
    !dayjs(nowTime).subtract(1, 'days').startOf('day').isBefore(dayjs(time))
  ) {
    return dayjs(time).format('M/D HH:mm')
  }
  // 昨天
  if (!dayjs(nowTime).startOf('day').isBefore(dayjs(time))) {
    return '昨天 ' + dayjs(time).format('HH:mm')
  }
  // 大于五分钟不显示秒
  if (nowTime > time + 300000) {
    return dayjs(time).format('HH:mm')
  }
  return dayjs(time).format('HH:mm:ss')
}
