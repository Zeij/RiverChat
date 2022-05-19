<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useChatStore } from '@/stores/chat';
import { NSpin } from 'naive-ui';
import { isUrl } from '@/utils/common';
import { useAppStore } from '@/stores/app';
import 'viewerjs/dist/viewer.css'
import { component as Viewer } from "v-viewer"
import RiverAvatar from './RiverAvatar.vue';
import RiverInput from './RiverInput.vue';
import RiverActive from './RiverActive.vue';
const chatstate = useChatStore()
const appstate = useAppStore()
const spinning = ref<boolean>(false)
const isNoData = ref<boolean>(false)
const messageOpacity = ref<number>(1)
const needScrollToBottom = ref<boolean>(true)
const messageRef = ref<HTMLElement>()
const messageContentRef = ref<HTMLElement>()
const headerRef = ref<HTMLElement>()
const ifAciveShow = ref<boolean>()
const chatName = computed(() => {
  if (!chatstate.activeRoom) return ''
  if (chatstate.groupGather[(chatstate.activeRoom as Group).groupId]) {
    return chatstate.groupGather[(chatstate.activeRoom! as Group).groupId].groupName;
  } else {
    return chatstate.userGather[(chatstate.activeRoom! as Friend).userId].username;
  }
})


watch(() => chatstate.activeRoom, () => {
  messageOpacity.value = 0;
  isNoData.value = false;
  if (headerRef) {
    headerRef.value?.classList.add('transition')
    setTimeout(() => {
      headerRef.value?.classList.remove('transition');
    }, 400);
  }
  scrollToBottom();
}, { deep: true })
// watch(() => chatstate.activeRoom?.messages, () => {
//   if (needScrollToBottom) {
//     addMessage()
//   }
//   needScrollToBottom.value = true
// })
function getImageStyle(src: string) {
  let arr = src.split('$');
  let width = Number(arr[2]);
  let height = Number(arr[3]);
  if (appstate.mobile) {
    if (width > 138) {
      height = (height * 138) / width;
      width = 138;
      return {
        width: `${width + 12}px`,
        height: `${height + 12}px`,
      };
    }
  }
  return {
    width: `${width + 12}px`,
    height: `${height + 12}px`,
  };
}
// function addMessage() {
//   if (chatstate.activeRoom?.messages) {
//     const messages = chatstate.activeRoom?.messages;
//     //只有当自己发言或本身就在底部才会触发scrollbottom
//     if ((messages[messages.length - 1].userId === appstate.user.userId)
//       ||
//       (messageRef && messageRef.value!.offsetHeight + 100 > messageContentRef.value!.scrollHeight)) {
//       scrollToBottom()
//     }
//   }
// }
async function scrollToBottom() {
  nextTick(() => {
    messageRef.value!.scrollTop = messageRef.value!.scrollHeight
    messageOpacity.value = 1;
  })
}

onMounted(() => {
  scrollToBottom()
})
</script>
<template>
  <!-- <viewer :images="images" class="images clearfix">
    <img v-for="src in images" :key="src" :src="src" class="image">
  </viewer> -->
  <div class="message">
    <div class="message-header">
      <div class="message-header-box">
        <span class="message-header-text" ref="headRef">{{ chatName }}</span>
        <n-spin class="message-loading-icon" size="small" v-if="chatstate.dropped" />
        <river-active v-if="chatstate.groupGather[(chatstate.activeRoom as Group)?.groupId]" type="group" />
        <river-active v-else type="friend" />
      </div>
    </div>
    <transition name="loading">
      <div class="message-loading" v-if="spinning && !isNoData">
        <n-spin class="message-loading-icon" size="small" />
      </div>
    </transition>
    <div class="message-main" :style="{ opacity: messageOpacity }" ref="messageRef">
      <div class="message-content">
        <transition name="noData">
          <div class="message-content-noData" v-if="isNoData">没有更多消息了~</div>
        </transition>
        <template v-if="chatstate.activeRoom">
          <div v-for="item in chatstate.activeRoom.messages">
            <div class="message-content-message" :key="item.userId + item.time" ref='messageContenref'
              :class="{ 'text-right': item.userId === appstate.user.userId }">
              <river-avatar :data="item" />
              <div>
                <a class="message-content-text" v-if="isUrl(item.content)" :href="item.content" target="_blank">{{
                    item.content
                }}</a>
                <div class="message-content-text" v-text="item.content" v-else-if="item.messageType === 'text'"></div>
                <div class="message-content-image" v-if="item.messageType === 'image'"
                  :style="getImageStyle(item.content)">
                  <viewer style="display:flex;align-items:center;">
                    <img :src="'api/static/' + item.content" alt="" />
                  </viewer>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <river-input />
  </div>
</template>

<style lang="scss" scoped>
.message {
  overflow: hidden;
  height: 100%;
  position: relative;

  .message-header {
    height: 60px;
    line-height: 60px;
    z-index: 100;
    background-color: rgb(0, 0, 0, 0.6);

    .message-header-text {
      color: #fff;
    }

    .message-header-icon {
      margin-left: 5px;
    }
  }

  .message-loading {
    position: absolute;
    left: calc(50% - 18px);
    top: 50px;
    z-index: 99;

    .message-loading-icon {
      margin: 10px auto;
      font-size: 20px;
      padding: 8px;
      border-radius: 50%;
      background-color: rgb(0, 0, 0, 0.8);
    }
  }

  .message-main {
    height: calc(100% - 100px);
    overflow: scroll;
    position: relative;

    .message-content {
      .message-content-noData {
        line-height: 50px;
      }

      .message-content-message {
        text-align: left;
        margin: 10px 20px;

        .message-content-text,
        .message-content-image {
          max-width: 600px;
          display: inline-block;
          overflow: hidden;
          margin-top: 4px;
          padding: 6px;
          background-color: rgba(0, 0, 0, 0.4);
          font-size: 16px;
          border-radius: 5px;
          text-align: left;
          word-break: break-word;
        }

        .message-content-image {
          max-height: 350px;
          max-width: 350px;

          img {
            cursor: pointer;
            max-width: 335px;
            max-height: 335px;
          }
        }
      }

      .text-right {
        text-align: right !important;

        .avatar {
          justify-content: flex-end;
        }
      }
    }
  }
}

.loading-enter-active {
  transition: all 0.3s ease;
}

.loading-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.loading-enter,
.loading-leave-to {
  transform: translateY(-30px);
  opacity: 0;
}

.noData-enter-active,
.noData-leave-active {
  transition: opacity 1s;
}

.noData-enter,
.noData-leave-to {
  opacity: 0;
}

.transition {
  display: inline-block;
  animation: transition 0.4s ease;
}
</style>
