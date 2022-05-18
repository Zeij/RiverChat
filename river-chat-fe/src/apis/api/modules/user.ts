import raxios from '@/apis/raxios'

// 更新用户名

export const patchUserName = (params: User) => {
  return raxios.patch(`/user/username`, {
    ...params
  })
}

// 更新用户密码

export const patchPassword = (user: User, password: string) => {
  return raxios.patch(`/user/password?password=${password}`, {
    ...user
  })
}

// 用户名模糊搜索用户
export function getUsersByName(username: string) {
  return raxios.get(`/user/findByName?username=${username}`)
}

// 用户头像上传
export function setUserAvatar(params: FormData) {
  return raxios.post(`/user/avatar`, params, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 删除用户
export function deleteUser(params: any) {
  return raxios.delete(`/user`, { params: params })
}
