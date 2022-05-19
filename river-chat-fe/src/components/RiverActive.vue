<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { NIcon, NDrawer, DrawerPlacement, NButton, NPopconfirm } from 'naive-ui'
import { TeamOutlined, UserDeleteOutlined } from '@vicons/antd'
import { useChatStore } from '@/stores/chat';
import RiverAvatar from './RiverAvatar.vue';
import { useAppStore } from '@/stores/app';
const props = withDefaults(defineProps<{
  type: string,
}>(), {
  type: 'group'
})
const chatstate = useChatStore()
const appstate = useAppStore()
const showGroupUser = ref<boolean>(false)
const placement = ref<DrawerPlacement>('right')
const activeNum = computed(() => {
  return Object.keys(chatstate.activeGroupUser[(chatstate.activeRoom as Group).groupId]).length
})
watch(() => props.type, () => {
  showGroupUser.value = false
}, { deep: true })
function toggleGroupUser(place: DrawerPlacement) {
  showGroupUser.value = !showGroupUser.value
}
function exitGroup() {
  chatstate.socket!.emit('exitGroup', {
    userId: appstate.user.userId,
    groupId: (chatstate.activeRoom! as Group).groupId,
  });
}
function exitFriend() {
  chatstate.socket!.emit('exitFriend', {
    userId: appstate.user.userId,
    friendId: (chatstate.activeRoom! as Friend).userId,
  });
}
function getArea() {
  return document.getElementsByClassName('message')[0]
}
</script>
<template>
  <div class="active">
    <div v-if="type == 'group'">
      <n-icon size="24" @click="toggleGroupUser('right')" class="active-button" :component="TeamOutlined" />
      <n-drawer v-model:show="showGroupUser" :placement="placement" :trap-focus="false" :block-scroll="false">
        <div class="active-content" v-if="chatstate.activeGroupUser[(chatstate.activeRoom as Group).groupId]"
          :style="{ overflow: 'scroll' }">
          <div class="actiev-content-title">群聊管理</div>
          <div class="active-content-sum">在线人数: {{ activeNum }}</div>
          <div class="active-content-users">
            <div class="active-content-user"
              v-for="data in chatstate.activeGroupUser[(chatstate.activeRoom as Group).groupId]" :key="data.userId">
              <river-avatar :data="data" :showTime="false" />
            </div>
          </div>
          <n-button type="error" class="active-content-out" @click="exitGroup">退出</n-button>
        </div>
      </n-drawer>
    </div>
    <div v-else>
      <n-popconfirm @positive-click="exitFriend" positive-text="确定" negative-text="取消">
        <template #trigger>
          <n-icon size="24" class="active-button" :component="UserDeleteOutlined" />
        </template>
        确定要删除该好友吗？
      </n-popconfirm>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.active {
  position: absolute;
  width: 170px;
  right: 0;
  z-index: 100;
  border-radius: 0 0 5px 5px;

  .active-button {
    position: absolute;
    z-index: 999;
    top: -43px;
    right: 20px;
    font-size: 25px;
    cursor: pointer;

    &:active {
      color: skyblue;
    }
  }

  .active-button.heightLight {
    color: skyblue;
  }
}

::-webkit-scrollbar {
  display: none !important;
}
</style>
