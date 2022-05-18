<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { useAppStore } from '@/stores/app'
import { ref } from 'vue'
import { useChatStore } from "@/stores/chat";
import RiverTool from '@/components/RiverTool.vue'
import RiverLogin from '@/components/RiverLogin.vue'
import RiverSearch from '@/components/RiverSearch.vue';
import RiverRoom from '@/components/RiverRoom.vue';
import RiverMessage from '@/components/RiverMessage.vue';
const chatstate = useChatStore()
const appstate = useAppStore()
const showLoginModal = ref(false)
window.$message = useMessage()
if (!appstate.user.userId) showLoginModal.value = true;
else handleJoin()
async function handleRegister(user: Partial<User>) {
  let res = await appstate.register(user)
  if (res) handleJoin()
}
//初始化
async function handleLogin(user: Partial<User>) {
  let res = await appstate.login(user)
  if (res) handleJoin()
}
async function handleJoin() {
  showLoginModal.value = false;
  chatstate.connectSocket()
}
function logout() {
  appstate.clear_user();
}
</script>

<template>
  <div class="chat">
    <div class="chat-part1">
      <RiverTool @logout="logout" />
    </div>
    <div class="chat-part2">
      <RiverSearch />
      <RiverRoom />
    </div>
    <div class="chat-part3">
      <RiverMessage />
    </div>
    <RiverLogin @handleRegister="handleRegister" @handleLogin="handleLogin" :showLoginModal="showLoginModal" />
  </div>
</template>

<style lang="scss" scoped>
.chat {
  font-size: 16px;
  z-index: 999;
  max-width: 1000px;
  min-width: 300px;
  width: 100%;
  height: 80%;
  max-height: 900px;
  min-height: 470px;
  position: relative;
  margin: auto 20px;
  box-shadow: 10px 20px 80px rgba(0, 0, 0, 0.8);
  display: flex;
  border-radius: 5px;
  overflow: hidden;

  .chat-part1 {
    width: 74px;
    height: 100%;
    background-color: rgb(0, 0, 0, 0.7);
  }

  .chat-part2 {
    width: 230px;
    height: 100%;
    background-color: rgb(0, 0, 0, 0.3);
  }

  .chat-part3 {
    flex: 1;
    height: 100%;
    background-color: rgb(0, 0, 0, 0.2);
    overflow-y: hidden;
    position: relative;

    .chat-group {
      height: 53px;
      border-bottom: 1px solid #ccc;
      line-height: 50px;
      font-weight: bold;
    }
  }
}

.chat::after {
  content: "";
  background: var(--bg-image) 0 / cover fixed;
  position: absolute;
  object-fit: cover;
  width: 100%;
  height: 100%;
  filter: blur(10px);
  transform: scale(1.08);
  z-index: -1;
}
</style>
