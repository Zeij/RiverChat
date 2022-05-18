<script setup lang="ts">
import { deleteUser } from '@/apis/api/modules/user';
import { useAppStore } from '@/stores/app';
import { useChatStore } from '@/stores/chat';
import { processReturn } from '@/utils/common';
import { NPopover, NAvatar, NButton } from 'naive-ui';
import { ref } from 'vue'
import { formatTime } from '@/utils/common';
const appstate = useAppStore()
const chatstate = useChatStore()
withDefaults(defineProps<{
  data: GroupMessage | FriendMessage
  showTime?: boolean
}>(), {
  showTime: true
})
async function webDeleteUser(userId: string) {
  const res = await deleteUser({
    uid: appstate.user.userId,
    psw: appstate.user.password,
    did: userId,
  })
  const returnData = processReturn(res)
}
function addFriend(friendId: string) {
  chatstate.socket!.emit('addFriend', {
    userId: appstate.user.userId,
    friendId: friendId,
    createTime: new Date().valueOf(),
  })
}
</script>
<template>
  <div class="avatar" v-if="chatstate.userGather[data.userId]">
    <n-popover :disabled="data.userId == appstate.user.userId" trigger="click">
      <template #trigger>
        <n-avatar class="avatar-img" round size="small" :src="chatstate.userGather[data.userId].avatar" />
      </template>
      <div class="avatar-card">
        <n-avatar round :size="60" :src="chatstate.userGather[data.userId].avatar" />
        <div>{{ chatstate.userGather[data.userId].username }}</div>
        <n-button v-if="appstate.user.role === 'admin'" style="margin-bottom: 5px;" @click="webDeleteUser(data.userId)"
          type="info">
          删除用户
        </n-button>
        <n-button v-if="chatstate.friendGather[data.userId]" type="info"
          @click="chatstate.set_active_room(chatstate.friendGather[data.userId])">
          进入私聊
        </n-button>
        <n-button v-else type="info" @click="addFriend(data.userId)">
          添加好友
        </n-button>
      </div>
    </n-popover>
    <div>
      <span class="avatar-name">{{ chatstate.userGather[data.userId].username }}</span>
      <span class="avatar-time" v-if="showTime">{{ formatTime(data.time) }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.avatar {
  display: flex;
  align-items: center;
  height: 37px;

  .avatar-img {
    cursor: pointer;
    width: 35px;
    height: 35px;
  }

  .avatar-name {
    margin-left: 5px;
  }

  .avatar-time {
    font-size: 12px;
    color: rgb(255, 255, 255, 0.75);
    margin-left: 3px;
  }
}

.avatar-card {
  display: flex;
  font-size: 15px;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;

  >div {
    margin: 4px;
  }
}
</style>
