<script setup lang="ts">
import { ref } from 'vue'
import { NModal, NForm, NTabs, NCard, NButton, NFormItemRow, NTabPane, NInput, NCheckbox, FormRules, useMessage, FormInst } from 'naive-ui'
import { nameVerify, passwordVerify } from '@/utils/common'
import { useAppStore } from '@/stores/app'
const props = defineProps<{ showLoginModal: boolean }>()
const emit = defineEmits<{
  (e: 'handleRegister', data: Partial<User>): void
  (e: 'handleLogin', data: Partial<User>): void
}>()
const message = useMessage()
interface FormType {
  username?: string,
  password?: string,
  createTime?: string
}
const registerformRef = ref<FormInst | null>(null)
const loginformRef = ref<FormInst | null>(null)
const formValue = ref<FormType>({
  username: '',
  password: ''
})
const ifRemember = ref(false)
// 表单校验
const rules: FormRules = {
  username: [
    {
      required: true,
      validator: nameVerify,
      trigger: ['input', 'blur']
    }
  ],
  password: [{
    required: true,
    validator: passwordVerify,
    trigger: ['input', 'blur']
  }]
}
function Register(e: MouseEvent) {
  e.preventDefault()
  registerformRef.value?.validate((errors) => {
    if (!errors) {
      console.log(formValue.value.username)
      emit('handleRegister', {
        username: formValue.value.username,
        password: formValue.value.password,
      })

    } else {
      message.error('请按提示完成登陆信息')
    }
  })
}
function Login(e: MouseEvent) {
  e.preventDefault()
  loginformRef.value?.validate((errors) => {
    if (!errors) {
      emit('handleLogin', {
        username: formValue.value.username,
        password: formValue.value.password,
        createTime: new Date().valueOf()
      })
    } else {
      message.error('请按提示完成注册信息')
    }
  })
}
</script>
<template>
  <div class="login">
    <n-modal v-model:show="showLoginModal" :mask-closable="false" style="width: 500px">
      <n-card>
        <n-tabs class="card-tabs" default-value="signin" size="large" animated style="margin: 0 -4px"
          pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;">
          <n-tab-pane name="signin" tab="登录">
            <n-form ref="loginformRef" :model="formValue" :rules="rules" :show-require-mark=false>
              <n-form-item-row path="username" label="用户名">
                <n-input v-model:value="formValue.username" placeholder="请输入账号" @keydown.enter.prevent />
              </n-form-item-row>
              <n-form-item-row path="password" label="密码">
                <n-input v-model:value="formValue.password" type="password" placeholder="请输入密码"
                  @keydown.enter.prevent />
              </n-form-item-row>
            </n-form>
            <!-- <n-checkbox v-model:checked="ifRemember" style="margin: 5px -4px" size="small" label="记住密码" /> -->
            <n-button style="margin:20px -4px" @click="Login" type="primary" block secondary strong>
              登录
            </n-button>
          </n-tab-pane>
          <n-tab-pane name="signup" tab="注册">
            <n-form ref="registerformRef" :model="formValue" :rules="rules" :show-require-mark=false>
              <n-form-item-row path="username" label="用户名">
                <n-input v-model:value="formValue.username" placeholder="请输入账号" @keydown.enter.prevent />
              </n-form-item-row>
              <n-form-item-row path="password" label="密码">
                <n-input v-model:value="formValue.password" type="password" placeholder="请输入密码"
                  @keydown.enter.prevent />
              </n-form-item-row>
            </n-form>
            <n-button style="margin:20px -4px" @click="Register" type="primary" block secondary strong>
              注册
            </n-button>
          </n-tab-pane>
        </n-tabs>
      </n-card>
    </n-modal>
  </div>
</template>

<style lang="scss" scoped>
</style>
