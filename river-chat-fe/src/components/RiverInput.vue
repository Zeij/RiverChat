<script setup lang="ts">
import { ref } from 'vue'
import { NPopover, NTabs, NTabPane, NUpload, NInput, useMessage, InputInst, UploadFileInfo } from 'naive-ui';
import RiverEmoji from './RiverEmoji.vue';
import { useChatStore } from '@/stores/chat';
import { useAppStore } from '@/stores/app';
const inputText = ref<string>('')
const inputRef = ref<InputInst | null>(null)
const lastTime = ref<number>(0)
const message = useMessage()
const chatstate = useChatStore()
const appstate = useAppStore()
function addEmoji(emoji: string) {
  if (inputRef.value!.inputElRef?.selectionStart || inputRef.value!.inputElRef?.selectionStart === 0) {
    // 得到光标前的位置
    const startPos = inputRef.value!.inputElRef.selectionStart;

    // 得到光标后的位置
    const endPos = inputRef.value!.inputElRef!.selectionEnd;
    // 在加入数据之前获得滚动条的高度
    const restoreTop = inputRef.value!.inputElRef?.scrollTop;
    // emoji表情插入至当前光标指定位置
    inputText.value = inputText.value.substring(0, startPos) + emoji + inputText.value.substring(endPos as number, inputText.value.length);
    // 如果滚动条高度大于0
    if (restoreTop > 0) {
      // 返回
      inputRef.value!.inputElRef.scrollTop = restoreTop;
    }
    inputRef.value!.inputElRef?.focus();
    // 设置光标位置至emoji表情后一位
    const position = startPos + emoji.length;
    inputRef.value!.inputElRef?.focus();
    setTimeout(() => {
      inputRef.value!.inputElRef?.setSelectionRange(position, position);
    }, 10);
  } else {
    inputText.value += emoji;
    inputRef.value!.inputElRef?.focus();
  }
}
async function handleImgUpload(data: {
  file: UploadFileInfo,
  fileList: UploadFileInfo[]
}) {
  if (data.file.file?.type !== 'image/jpeg' && data.file.file?.type !== 'image/jpg' && data.file.file?.type !== 'image/png' && data.file.file?.type !== 'image/gif') {
    message.error('只能上传jpeg/jpg/png/gif格式的图片文件，请重新上传')
    return false
  }
  const isLt1M = data.file.file?.size / 1024 / 1024 < 0.5;
  if (!isLt1M) {
    return message.error('图片必须小于500K!');
  }
  let image = new Image();
  let url = window.URL || window.webkitURL;
  image.src = url.createObjectURL(data.file.file);
  image.onload = () => {
    let imageSize: ImageSize = getImageSize({ width: image.width, height: image.height });
    sendMessage({
      type: (chatstate.activeRoom! as Group).groupId ? 'group' : 'friend',
      message: data.file.file!,
      width: imageSize.width,
      height: imageSize.height,
      messageType: 'image',
    });
  };
}
function getImageSize(data: ImageSize) {
  let { width, height } = data;
  if (width > 335 || height > 335) {
    if (width > height) {
      height = 335 * (height / width);
      width = 335;
    } else {
      width = 335 * (width / height);
      height = 335;
    }
  }
  return {
    width,
    height,
  };
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
            <n-upload :show-upload-list="false" @before-upload="handleImgUpload">
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
