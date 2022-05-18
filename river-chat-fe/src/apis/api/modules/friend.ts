import raxios from '@/apis/raxios'

/**
 * 群分页消息
 * @param params
 */

export async function getFriendMessage(params: PagingParams) {
  return await raxios.get(`/friend/friendMessages`, {
    params
  })
}
