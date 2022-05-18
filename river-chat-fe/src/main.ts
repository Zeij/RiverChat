import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import dayjs from 'dayjs'
import 'viewerjs/dist/viewer.css'
import VueViewer from 'v-viewer'
const app = createApp(App)
// 创建 Pinia 实例
const pinia = createPinia()
app.use(router).use(pinia).use(VueViewer).mount('#app')
