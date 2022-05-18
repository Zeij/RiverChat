import { AppState } from './../app/index'
import { defineStore } from 'pinia'
import { io, Socket } from 'socket.io-client'
import { useAppStore } from '../app'
import {
  SET_SOCKET,
  SET_DROPPED,
  SET_ACTIVE_GROUP_USER,
  ADD_GROUP_MESSAGE,
  SET_GROUP_MESSAGES,
  ADD_FRIEND_MESSAGE,
  SET_FRIEND_MESSAGES,
  SET_ACTIVE_ROOM,
  SET_GROUP_GATHER,
  SET_FRIEND_GATHER,
  SET_USER_GATHER,
  DEL_GROUP,
  DEL_FRIEND,
  SET_UNREAD_GATHER,
  LOSE_UNREAD_GATHER
} from './type'
import { DEFAULT_GROUP } from '@/const'
import { useMessage } from 'naive-ui'
export interface ChatState {
  socket: Socket | null
  dropped: boolean
  activeGroupUser: ActiveGroupUser
  activeRoom: Group | Friend | null
  groupGather: GroupGather
  userGather: FriendGather
  friendGather: FriendGather
  unReadGather: UnReadGather
}

export const useChatStore = defineStore('chat', {
  state: () => {
    return {
      socket: null,
      dropped: false,
      activeGroupUser: {},
      activeRoom: null,
      groupGather: {},
      userGather: {},
      friendGather: {},
      unReadGather: {}
    } as ChatState
  },
  actions: {
    // 保存socket
    [SET_SOCKET](payload: Socket) {
      this.socket = payload
    },
    // 设置用户是否处于掉线重连状态
    [SET_DROPPED](payload: boolean) {
      this.dropped = payload
    },
    [SET_ACTIVE_GROUP_USER](payload: ActiveGroupUser) {
      this.activeGroupUser = payload
      for (const user of Object.values(payload[DEFAULT_GROUP])) {
        // 如果当前userGather没有该在线用户, 应该马上存储否则看不到该用户发的消息
        if (!user) continue
        else this.userGather[user.userId] = user
      }
    },
    // 新增一条群消息
    [ADD_GROUP_MESSAGE](payload: GroupMessage) {
      const appstate = useAppStore()
      const userId = appstate.user.userId

      if (this.groupGather[payload.groupId].messages) {
        this.groupGather[payload.groupId].messages!.push(payload)
      } else {
        this.groupGather[payload.groupId].messages = [payload]
      }
    },
    // 设置群消息
    [SET_GROUP_MESSAGES](payload: GroupMessage[]) {
      if (payload && payload.length) {
        this.groupGather[payload[0].groupId].messages = payload
      }
    },
    // 新增一条私聊消息
    [ADD_FRIEND_MESSAGE](payload: FriendMessage) {
      const appstate = useAppStore()
      let userId = appstate.user.userId
      if (payload.friendId === userId) {
        if (this.friendGather[payload.userId].messages) {
          this.friendGather[payload.userId].messages!.push(payload)
        } else {
          this.friendGather[payload.userId].messages = [payload]
        }
      } else {
        if (this.friendGather[payload.friendId].messages) {
          this.friendGather[payload.friendId].messages!.push(payload)
        } else {
          this.friendGather[payload.friendId].messages = [payload]
        }
      }
    },
    // 设置私聊记录
    [SET_FRIEND_MESSAGES](payload: FriendMessage[]) {
      const appstate = useAppStore()
      let userId = appstate.user.userId
      if (payload && payload.length) {
        if (payload[0].friendId === userId) {
          this.friendGather[payload[0].userId].messages = payload
        } else {
          this.friendGather[payload[0].friendId].messages = payload
        }
      }
    },
    // 设置当前聊天对象(群或好友)
    [SET_ACTIVE_ROOM](payload: Friend | Group) {
      this.activeRoom = payload
    },
    // 设置所有的群的群详细信息(头像,群名字等)
    [SET_GROUP_GATHER](payload: Group) {
      this.groupGather[payload.groupId] = payload
    },
    // 设置所有的用户的用户详细信息(头像,昵称等)
    [SET_USER_GATHER](payload: Friend) {
      this.userGather[payload.userId] = payload
    },
    // 设置所有的好友的用户详细信息(头像,昵称等)
    [SET_FRIEND_GATHER](payload: Friend) {
      this.friendGather[payload.userId] = payload
    },
    // 退群
    [DEL_GROUP](payload: GroupMap) {
      delete this.groupGather[payload.groupId]
    },
    // 删好友
    [DEL_FRIEND](payload: UserMap) {
      delete this.friendGather[payload.friendId]
    },
    // 给某个聊天组添加未读消息
    [SET_UNREAD_GATHER](payload: string) {
      if (!this.unReadGather[payload]) {
        this.unReadGather.payload = 1
      } else {
        ++this.unReadGather[payload]
      }
    },

    // 给某个聊天组清空未读消息
    [LOSE_UNREAD_GATHER](payload: string) {
      this.unReadGather.payload = 0
    },
    async connectSocket() {
      const appstate = useAppStore()
      const userId = appstate.user.userId
      const socket: Socket = io('http://localhost:3001', {
        autoConnect: false, //关闭自动连接
        reconnection: true,
        query: {
          userId
        }
      })
      socket.connect()
      socket.on('connect', async () => {
        console.log('连接成功')

        // 获取聊天室所需所有信息
        socket.emit('chatData', appstate.user)
        this.set_socket(socket)
      })
      socket.emit('socketTest', { test: '测试数据' }, (data: any) => {
        console.log(data) // { msg1: '测试1', msg2: '测试2' }
      })
      // 初始化事件监听
      socket.on('chatData', (res: ServerRes<any>) => {
        if (res.code) {
          return window.$message.error(res.msg)
        }
        this.handleChatData(res.data)
        this.set_dropped(false)
      })
      socket.on('activeGroupUser', (data: any) => {
        console.log('activeGroupUser', data)
        this.set_active_group_user(data.data)
      })
      socket.on('addGroup', (res: ServerRes<any>) => {
        console.log('on addGroup', res)
        if (res.code) {
          return window.$message.error(res.msg)
        }
        window.$message.success(res.msg)
        this.set_group_gather(res.data)
      })
      socket.on('joinGroup', async (res: ServerRes<any>) => {
        console.log('on joinGroup', res)
        if (res.code) {
          return window.$message.error(res.msg)
        }
        let newUser = res.data.user
        let group = res.data.group
        if (newUser.userId != appstate.user.userId) {
          this.set_user_gather(newUser)
          return window.$message.info(
            `${newUser.username}加入群${group.groupName}`
          )
        } else {
          // 是用户自己 则加入到某个群
          if (!this.groupGather[group.groupId]) {
            this.set_group_gather(group)
            // 获取群里面所有用户的用户信息
            socket.emit('chatData', appstate.user)
          }
          window.$message.info(`成功加入群${group.groupName}`)
          this.set_active_room(this.groupGather[group.groupId])
        }
      })
      socket.on('joinGroupSocket', (res: ServerRes<any>) => {
        if (res.code) {
          return window.$message.error(res.msg)
        }
        let newUser: Friend = res.data.user
        let group: Group = res.data.group
        let friendGather = this.friendGather
        if (newUser.userId != appstate.user.userId) {
          this.set_user_gather(newUser)
          if (friendGather[newUser.userId]) {
            // 当用户的好友更新了用户信息
            if (friendGather[newUser.userId].messages) {
              this.set_friend_messages(
                friendGather[newUser.userId].messages as FriendMessage[]
              )
            }
            this.set_friend_gather(newUser)
          }
          window.$message.info(`${newUser.username}加入群${group.groupName}`)
        } else {
          if (!this.groupGather[group.groupId]) {
            this.set_group_gather(group)
          }
        }
      })
      socket.on('groupMessage', (res: ServerRes<any>) => {
        console.log('on groupMessage', res)
        if (!res.code) {
          this.add_group_message(res.data)
          let activeRoom = this.activeRoom
          if (
            activeRoom &&
            (activeRoom as Group).groupId !== res.data.groupId
          ) {
            this.set_unread_gather(res.data.groupId)
          }
        } else {
          window.$message.error(res.msg)
        }
      })
      socket.on('addFriend', (res: ServerRes<any>) => {
        console.log('on addFriend', res)
        if (!res.code) {
          this.set_friend_gather(res.data)
          this.set_user_gather(res.data)
          window.$message.info(res.msg)
          socket.emit('joinFriendSocket', {
            userId: appstate.user.userId,
            friendId: res.data.userId
          })
        } else {
          window.$message.error(res.msg)
        }
      })
      socket.on('joinFriendSocket', (res: ServerRes<any>) => {
        console.log('on joinFriendSocket', res)
        if (!res.code) {
          console.log('成功加入私聊房间')
        }
      })
      socket.on('friendMessage', (res: ServerRes<any>) => {
        console.log('on friendMessage', res)
        if (!res.code) {
          if (
            res.data.friendId === appstate.user.userId ||
            res.data.userId === appstate.user.userId
          ) {
            console.log('ADD_FRIEND_MESSAGE', res.data)
            this.add_friend_message(res.data)
            let activeRoom = this.activeRoom
            if (
              activeRoom &&
              activeRoom.userId !== res.data.userId &&
              activeRoom.userId !== res.data.friendId
            ) {
              this.set_unread_gather(res.data.userId)
            }
          }
        } else {
          window.$message.error(res.msg)
        }
      })
      socket.on('exitGroup', (res: ServerRes<any>) => {
        if (!res.code) {
          this.del_group(res.data)
          this.set_active_room(this.groupGather[DEFAULT_GROUP])
          window.$message.success(res.msg)
        } else {
          window.$message.error(res.msg)
        }
      })

      socket.on('exitFriend', (res: ServerRes<any>) => {
        if (!res.code) {
          this.del_friend(res.data)
          this.set_active_room(this.groupGather[DEFAULT_GROUP])
          window.$message.success(res.msg)
        } else {
          window.$message.error(res.msg)
        }
      })
    },
    async handleChatData(payload: any) {
      const appstate = useAppStore()
      const user = appstate.user
      const socket = this.socket
      const groupArr = payload.groupData
      const friendArr = payload.friendData
      const userArr = payload.userData
      if (groupArr.length) {
        for (let group of groupArr) {
          if (!group) return
          socket!.emit('joinGroupSocket', {
            groupId: group.groupId,
            userId: user.userId
          })
          console.log('111', group)
          this.set_group_gather(group)
        }
      }
      if (friendArr.length) {
        for (let friend of friendArr) {
          if (!friend) return
          socket!.emit('joinFriendSocket', {
            userId: user.userId,
            friendId: friend.userId
          })
          this.set_friend_gather(friend)
        }
      }
      if (userArr.length) {
        for (let user of userArr) {
          this.set_user_gather(user)
        }
      }
      const activeroom = this.activeRoom
      const groupGather2 = this.groupGather
      const friendGather2 = this.friendGather
      if (!activeroom)
        return this.set_active_room(this.groupGather[DEFAULT_GROUP])
    }
  }
})
