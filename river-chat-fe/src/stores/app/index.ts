import raxios from '@/apis/raxios'
import { processReturn } from '@/utils/common'
import { defineStore } from 'pinia'
import { json } from 'stream/consumers'
import {
  CLEAR_USER,
  SET_BACKGROUND,
  SET_MOBILE,
  SET_TOKEN,
  SET_USER
} from './types'
export interface AppState {
  user: User
  token: string
  mobile: boolean
  background: string
}
export const useAppStore = defineStore('app', {
  state: () => {
    return {
      //JSON.parse(’{}’)、JSON.parse(’[]’)为真 因此要加一个getItem的判断
      user: JSON.parse(localStorage.getItem('riveruser') || '0') || {
        userId: '',
        username: '',
        password: '',
        avatar: '',
        // 'https://cdn.jsdelivr.net/gh/Zeij/CDN/img/202111042133207.png',
        createTime: 0
      },
      token: '',
      mobile: false,
      background: ''
    } as AppState
  },
  actions: {
    [SET_USER](payload: User) {
      this.user = payload
      // 数据持久化
      localStorage.setItem('riveruser', JSON.stringify(payload))
    },
    [SET_TOKEN](payload: string) {
      this.token = payload
      localStorage.setItem('rivertoken', JSON.stringify(payload))
    },
    [SET_BACKGROUND](payload: string) {
      this.background = payload
      localStorage.setItem('background', JSON.stringify(payload))
    },
    [SET_MOBILE](payload: boolean) {
      this.mobile = payload
    },
    [CLEAR_USER]() {
      this.user = {
        userId: '',
        username: '',
        password: '',
        avatar: '',
        createTime: 0
      }
      localStorage.removeItem('riveruser')
    },
    async register(payload: Partial<User>) {
      let res = await raxios.post('/auth/register', {
        ...payload
      })
      let data: any = processReturn(res)
      if (data) {
        this.set_user(data.user)
        this.set_token(data.token)
        return data
      }
    },
    async login(payload: Partial<User>) {
      let res = await raxios.post('/auth/login', {
        ...payload
      })
      let data: any = processReturn(res)
      if (data) {
        this.set_user(data.user)
        this.set_token(data.token)
        return data
      }
    }
  }
})
