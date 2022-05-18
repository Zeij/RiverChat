<script setup lang="ts">
import { ref } from 'vue'
import { NPopover, NTabs, NTabPane, NUpload, NInput, useMessage } from 'naive-ui';
import RiverEmoji from './RiverEmoji.vue';
import { useChatStore } from '@/stores/chat';
import { useAppStore } from '@/stores/app';
const inputText = ref<string>('')
const inputRef = ref()
const lastTime=ref<number>(0)
const message = useMessage()
const chatstate = useChatStore()
const appstate = useAppStore()
function addEmoji(emoji: string) {
        console.log(inputRef.value!)
    if (inputRef.value!.selectionStart || inputRef.value!.selectionStart === '0') {
      // 得到光标前的位置
      const startPos = inputRef.value!.selectionStart;

      // 得到光标后的位置
      const endPos = inputRef.value!.selectionEnd;
      // 在加入数据之前获得滚动条的高度
      const restoreTop = inputRef.value!.scrollTop;
      // emoji表情插入至当前光标指定位置
      inputText.value = inputText.value.substring(0, startPos) + emoji + inputText.value.substring(endPos, inputText.value.length);
      // 如果滚动条高度大于0
      if (restoreTop > 0) {
        // 返回
        inputRef.value!.scrollTop = restoreTop;
      }
      inputRef.value!.focus();
      // 设置光标位置至emoji表情后一位
      const position = startPos + emoji.length;
      if (inputRef.value!.setSelectionRange) {
        inputRef.value!.focus();
        setTimeout(() => {
          inputRef.value!.setSelectionRange(position, position);
        }, 10);
      } else if (inputRef.value!.createTextRange) {
        const range = inputRef.value!.createTextRange();
        range.collapse(true);
        range.moveEnd('character', position);
        range.moveStart('character', position);
        range.select();
      }
    } else {
     inputText.value += emoji;
      inputRef.value!.focus();
    }
}
function beforeImgUpload() {
  console.log('beforeImgUpload')
}
//消息节流
function throttle(fn: Function, file?: File) {
    let nowTime = +new Date();
    if (nowTime - lastTime.value < 500) {
      return message.error('消息发送太频繁！');
    }
    fn(file);
    lastTime.value = nowTime;
  }
function preSendMessage() {
  console.log('beforeImgUpload')
  if (!inputText.value.trim()) {
    return message.error('消息不能为空')
  }
  if (inputText.value.length > 220) {
    return message.error('消息太长')
  }
  if (((chatstate.activeRoom) as Group).groupId) {
    sendMessage({ type: 'group', message: inputText.value, messageType: 'text' });
  } else {
    sendMessage({ type: 'friend', message: inputText.value, messageType: 'text' });
  }
  inputText.value = ''
}
function sendMessage(data: SendMessage) {
  if (data.type === 'group') {
    chatstate.socket!.emit('groupMessage', {
      userId: appstate.user.userId,
      groupId: (chatstate.activeRoom as Group).groupId,
      content: data.message,
      width: data.width,
      height: data.height,
      messageType: data.messageType,
    });
  } else {
    chatstate.socket!.emit('friendMessage', {
      userId: appstate.user.userId,
      friendId: (chatstate.activeRoom as Friend).userId,
      content: data.message,
      width: data.width,
      height: data.height,
      messageType: data.messageType,
    });
  }
}

</script>
<template>
  <div class="message-input">
    <n-popover trigger="click">
      <template #trigger>
        <div class="messagte-tool-icon">😃</div>
      </template>
      <n-tabs default-value="emoji" justify-content="space-evenly" type="line">
        <n-tab-pane name="emoji" tab="Emoji">
          <river-emoji @addEmoji="addEmoji"></river-emoji>
        </n-tab-pane>
        <n-tab-pane name="tool" tab="工具">
          <div class="message-tool-item">
            <n-upload :show-upload-list="false" :before-upload="beforeImgUpload">
              <div class="message-tool-contant">
                <img src="~@/assets/photo.png" class="message-tool-item-img" alt="" />
                <div class="message-tool-item-text">图片</div>
              </div>
            </n-upload>
          </div>
        </n-tab-pane>
      </n-tabs>
    </n-popover>
    <n-input class="n-input" v-model:value="inputText" type="text" placeholder='说些什么吧' style="color:#000;"
      ref="inputRef" @keyup.enter="preSendMessage" />
    <img class="message-input-button" @click="throttle(preSendMessage)" src="~@/assets/send.png" alt="" />
  </div>
</template>

<style lang="scss" scoped>
.message-input {
  display: flex;
  flex-wrap: nowrap;
  position: absolute;
  width: 100%;
  bottom: 0px;

  .n-input {
    text-align: left;
    width: 100%;
    padding-left: 30px;
  }

  .message-input-button {
    width: 30px;
    cursor: pointer;
    position: absolute;
    right: 10px;
    top: 4px;
  }
}

.messagte-tool-icon {
  position: absolute;
  left: -5px;
  top: 0;
  width: 50px;
  height: 40px;
  text-align: center;
  line-height: 37px;
  font-size: 16px;
  cursor: pointer;
  z-index: 99;
}


.message-tool-item {
  width: 250px;
  height: 256px;
  cursor: pointer;

  .message-tool-contant {
    text-align: center;
    width: 50px;
    padding: 5px;
    border-radius: 5px;
    transition: all linear 0.2s;

    .message-tool-item-img {
      width: 40px;
    }

    .message-tool-item-text {
      font-size: 10px;
    }

    &:hover {
      background: rgba(135, 206, 235, 0.6);
    }
  }
}
</style>
