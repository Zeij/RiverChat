<script setup lang="ts">
import { useChatStore } from '@/stores/chat';
import { computed, reactive, ref, watch } from 'vue'
import { NBadge } from 'naive-ui';
import { DEFAULT_GROUP } from '@/const';
const chatstate = useChatStore()
let chatArr = ref<Array<Group | Friend>>([])
function sortChat() {
  const groups = Object.values(chatstate.groupGather)
  const friends = Object.values(chatstate.friendGather);
  chatArr.value = [...groups, ...friends]
  chatArr.value.sort((a: Group | Friend, b: Group | Friend) => {
    if (a.messages && b.messages) return b.messages[b.messages.length - 1].time - a.messages[a.messages.length - 1].time;
    if (a.messages) {
      return -1;
    }
    return 1;
  })
}
function changeActiveRoom(activeRoom: User | Group) {
  chatstate.set_active_room(activeRoom)
}
sortChat()
watch(() => chatstate.groupGather, () => {
  sortChat()
}, { deep: true })
watch(() => chatstate.friendGather, () => {
  sortChat()
}, { deep: true })
const activeUserGather = computed(() => chatstate.activeGroupUser[DEFAULT_GROUP] || {})
</script>
<template>
  <div class="room" v-if="chatArr.length">
    <div v-for="(chat, index) in chatArr" :key="((chat as Friend).userId || (chat as Group).groupId!)"
      :class="{ active: chatstate.activeRoom && (chatstate.activeRoom as Group).groupId === (chat as Group).groupId }">
      <div class="room-card" v-if="(chat as Group).groupId" @click="changeActiveRoom(chat as Group)">
        <n-badge class="room-card-badge" :value="chatstate.unReadGather[(chat as Group).groupId]" />
        <img class="room-card-type" src="~@/assets/group.png" alt="" />
        <div class="room-card-message">
          <div class="room-card-name">{{ (chat as Group).groupName }}</div>
          <div class="room-card-new" v-if="chat.messages">
            <div class="text" v-text="chat.messages[chat.messages.length - 1].content"
              v-if="chat.messages[chat.messages.length - 1].messageType === 'text'"></div>
            <div class="image" v-if="chat.messages[chat.messages.length - 1].messageType === 'image'">[图片]</div>
          </div>
        </div>
      </div>
      <div v-else class="room-card"
        :class="{ active: chatstate.activeRoom && (chatstate.activeRoom as Friend).userId === (chat as Friend).userId }"
        @click="changeActiveRoom(chat as User)">
        <n-badge class="room-card-badge" :value="chatstate.unReadGather[(chat as Friend).userId]" />
        <img class="room-card-type" :src="chatstate.friendGather[chat.userId].avatar"
          :class="{ offLine: !activeUserGather.hasOwnProperty(chat.userId) }" alt="" />
        <div class="room-card-message">
          <div class="room-card-name">{{ (chat as Friend).username }}</div>
          <div class="room-card-new" v-if="chat.messages">
            <div class="text" v-text="chat.messages[chat.messages.length - 1].content"
              v-if="chat.messages[chat.messages.length - 1].messageType === 'text'"></div>
            <div class="image" v-if="chat.messages[chat.messages.length - 1].messageType === 'image'">[图片]</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@mixin button($bcolor, $url, $x1, $y1, $bor, $col) {
  background: $bcolor;
  //图片遮罩
  -webkit-mask: url($url);
  mask: url($url);
  -webkit-mask-size: $x1 $y1;
  mask-size: $x1 $y1;
  border: $bor;
  color: $col;
}

.room {
  height: calc(100% - 60px);
  overflow: auto;

  .room-card {
    position: relative;
    min-height: 70px;
    display: flex;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.2);
    padding: 5px 10px;
    text-align: left;
    transition: all 0.2s linear;
    cursor: pointer;

    &:hover {
      background-color: rgb(0, 0, 0, 0.4);
    }



    .room-card-badge {
      position: absolute;
      right: 10px;
      top: 10px;
    }

    .room-card-type {
      width: 35px;
      height: 35px;
      margin-right: 5px;
      border-radius: 50%;
      object-fit: cover;

      &.offLine {
        filter: grayscale(90%);
      }
    }

    .room-card-message {
      flex: 1;
      display: flex;
      width: 75%;
      flex-direction: column;

      .room-card-name {
        overflow: hidden; //超出的文本隐藏
        text-overflow: ellipsis; //溢出用省略号显示
        white-space: nowrap; //溢出不换行
      }

      .room-card-new {
        >* {
          display: block;
          overflow: hidden; //超出的文本隐藏
          text-overflow: ellipsis; //溢出用省略号显示
          white-space: nowrap; //溢出不换行
        }

        color: rgb(255, 255, 255, 0.6);
        font-size: 14px;
      }
    }
  }

  .active {
    background-color: rgb(0, 0, 0, 0.5);
    /* @include button(rgb(0, 0, 0, 0.5), '~@/assets/animate.png', 3000%, 100%, none, #fff); */
    -webkit-animation: ani 2s steps(29) forwards;
    animation: ani 0.5s steps(29) forwards;
  }
}
</style>
