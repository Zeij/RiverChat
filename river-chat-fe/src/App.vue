<script setup lang="ts">
import { NMessageProvider, NDialogProvider } from 'naive-ui'
import RiverChat from './view/RiverChat.vue'
import { DEFAULT_BACKGROUND } from '@/const'
import { useAppStore } from '@/stores/app'
import { nextTick, onMounted, provide, ref } from 'vue';
import { storeToRefs } from 'pinia'
const appstate = useAppStore()
const { background } = storeToRefs(appstate)
appstate.set_background(DEFAULT_BACKGROUND)

//利用provide和inject实现页面自刷新
const isRouterActive = ref(true)
const reload = (): void => {
  isRouterActive.value = false
  nextTick(() => {
    isRouterActive.value = true
  })
}
provide('reload', reload)

</script>

<template>
  <n-message-provider>
    <n-dialog-provider>
      <RiverChat v-if="isRouterActive" />
      <img class="background" :src="background" />
    </n-dialog-provider>
  </n-message-provider>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-size: cover;
  color: rgba(255, 255, 255, 0.85);
  background-color: #fff;

  .background {
    position: absolute;
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
}

html,
body {
  width: 100%;
  height: 100%;
  margin: 0;
}
</style>
