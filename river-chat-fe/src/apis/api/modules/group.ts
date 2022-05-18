import raxios from '@/apis/raxios'

/**
 * 群名模糊搜索用户
 * @param string
 */
// interface AjaxReturnRs<T> {
//   success: 0 | 1
//   data: T
//   msg: string
// }
// interface AjaxReturnArr<T> {
//   sucess: 0 | 1
//   data: Array<T>
//   total: number
//   msg: string
// }
export interface GetfindByNameRs {
  groupId: string
  userId: string
  groupName: string
  notice: string
  createTime: string
}
export async function getGroupsByName(groupName: string) {
  return await raxios.get(`/group/findByName?groupName=${groupName}`)
}

/**
 * 群分页消息
 * @param params
 */
export async function getGroupMessages(params: PagingParams) {
  return await raxios.get(`/group/groupMessages`, {
    params
  })
}
