<script setup lang="ts">
import { ref, inject } from 'vue'
import { NTooltip, NIcon, NModal, NInput, NAvatar, NUpload, NButton, UploadFileInfo, useMessage } from 'naive-ui'
import { AlertFilled, SkinOutlined, LogoutOutlined, UploadOutlined, EyeInvisibleFilled } from '@vicons/antd'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores/app'
import { changenameVerify, changepasswordVerify, processReturn } from '@/utils/common'
import { patchPassword, patchUserName, setUserAvatar } from '@/apis/api'
import { DEFAULT_GROUP } from '@/const'
import { SET_USER_GATHER } from '@/stores/chat/type'
import { useChatStore } from '@/stores/chat'




const emit = defineEmits<{
  (e: 'logout'): void
}>()
const reload = inject('reload') as any
const appstate = useAppStore()
const chatstate = useChatStore()
const { user } = storeToRefs(appstate)
const showUserModal = ref(false)
const showUpload = ref(false)
const username = ref('')
const password = ref('')
const message = useMessage()
let avatar: any = ''
// 检验上传文件
async function beforeUpload(data: {
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
  avatar = data.file.file
  handleUpload();
  return false;
}
async function handleUpload() {
  const formData = new FormData()
  formData.append('userId', appstate.user.userId)
  formData.append('password', appstate.user.password)
  formData.append('avatar', avatar);
  console.log(formData.get('avatar'))
  let data: User = processReturn(await setUserAvatar(formData));
  if (data) {
    appstate.set_user(data)
    chatstate.set_user_gather(data)
    // 通知其他用户个人信息改变
    chatstate.socket!.emit('joinGroupSocket', {
      groupId: DEFAULT_GROUP,
      userId: data.userId,
    });
  }
}
async function changeUserName() {
  if (!changenameVerify(username.value)) {
    return message.error('用户名格式错误');
  }
  console.log(user)
  let newuser: User = JSON.parse(JSON.stringify(user));
  console.log(newuser)
  newuser.username = username.value;
  console.log(newuser)
  let res = await patchUserName(newuser);

  let data: User = processReturn(res);
  if (data) {
    appstate.set_user(data);
    chatstate.set_user_gather(data)
    chatstate.socket!.emit('joinGroupSocket', {
      groupId: DEFAULT_GROUP,
      userId: data.userId,
    });
  }
}

async function changePassword() {
  if (!changepasswordVerify(password.value)) {
    return;
  }
  let newuser: User = JSON.parse(JSON.stringify(user));
  let res = await patchPassword(newuser, password.value);
  let data: User = processReturn(res);
  if (data) {
    appstate.set_user(data);
    chatstate.set_user_gather(data)
    // 通知其他用户个人信息改变
    chatstate.socket!.emit('joinGroupSocket', {
      groupId: DEFAULT_GROUP,
      userId: data.userId,
    });
  }
}
function logout() {
  emit('logout');
  reload()
}
</script>

<template>
  <div class="tool">
    <div class="tool-avatar" @click="showUserModal = !showUserModal">
      <div class="tool-avatar-img">
        <img :src="user.avatar" />
      </div>
      <div class="tool-avatar-name">{{ user.username }}</div>
    </div>
    <n-tooltip trigger="hover">
      <template #trigger>
        <n-icon size="40" class="tool-tip icon" :component="AlertFilled" />
      </template>
      文明用语哦
    </n-tooltip>
    <n-icon size="40" class="tool-skin icon" :component="SkinOutlined" />
    <n-icon size="40" class="tool-out icon" @click="logout" :component="LogoutOutlined" />

    <n-modal v-model:show="showUserModal" class="custom-card" preset="card" style="width: 600px" title="用户信息"
      size="huge" :bordered="false" :segmented="{ content: true }">
      <div class="tool-user">
        <div @mouseover="showUpload = true" @mouseleave="showUpload = false" class="tool-user-avatar"
          :class="{ active: showUpload }">
          <n-avatar round :src="user.avatar" class="img" :size="120" />
          <n-upload v-if="showUpload" class="tool-user-upload" @before-upload="beforeUpload">
            <div class="text">
              <n-icon style="margin-right: 4px;" :component="UploadOutlined" />
              <span>更换头像</span>
            </div>
          </n-upload>
        </div>
        <div class="tool-user-info">
          <div class="tool-user-title">更改用户名</div>
          <n-input class="tool-user-input" v-model:value="username" placeholder="请输入用户名" />
          <n-button @click="changeUserName" type="primary">确认</n-button>
        </div>
        <div class="tool-user-info">
          <div class="tool-user-title">更改密码</div>
          <n-input type="password" show-password-on="click" class="tool-user-input" v-model:value="password"
            placeholder="请输入密码" :maxlength="10">
            <template #password-visible-icon>
              <n-icon :size="16" :component="EyeInvisibleFilled" />
            </template>
          </n-input>
          <n-button type="primary" @click="changePassword">确认</n-button>
        </div>
      </div>
    </n-modal>
  </div>
</template>

<style lang="scss" scoped>
.tool {
  padding: 10px 5px;
  height: 98%;
  position: relative;

  .tool-avatar {
    margin-top: 3px;

    .tool-avatar-img {
      margin: 0 auto;
      width: 55px;
      height: 55px;
      border-radius: 50%;
      overflow: hidden;
      cursor: pointer;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .tool-avatar-name {
      color: #fff;
      overflow: hidden; //超出的文本隐藏
      text-overflow: ellipsis; //溢出用省略号显示
      white-space: nowrap; //溢出不换行
      margin-top: 2px;
    }
  }

  .tool-tip {
    bottom: 140px;
  }

  .tool-skin {
    bottom: 80px;
  }

  .tool-out {
    bottom: 20px;
  }

  .icon {
    display: flex;
    flex-direction: column;
    position: absolute;
    transform: translate(-50%);
    font-size: 25px;
    cursor: pointer;
    z-index: 100;
    left: 50%;

    &:hover {
      color: skyblue;
    }
  }
}

.tool-user {
  text-align: center;
  font-size: 16px;

  .tool-user-avatar {
    position: relative;
    width: 120px;
    overflow: hidden;
    margin: 0 auto 24px;
    border-radius: 50%;
    cursor: pointer;

    .tool-user-upload {
      .text {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        line-height: 120px;
        font-weight: bold;
      }
    }

    .img {
      transition: 0.2s all linear;
    }

    &.active {
      .img {
        filter: blur(3px);
      }
    }
  }
}

.tool-user-info {
  display: flex;
  justify-content: left;
  align-items: center;

  .tool-user-input {
    flex: 1;
    margin-right: 5px;
  }

  .tool-user-title {
    display: flex;
    align-items: center;
    width: 90px;
    text-align: left;
    font-weight: bold;
    word-break: keep-all;
    margin-right: 15px;
  }

  &:nth-child(2) {
    margin-bottom: 15px;
  }
}
</style>
