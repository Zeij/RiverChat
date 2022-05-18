<script setup lang="ts">
const emit = defineEmits<{
  (e: 'addEmoji', data: string): void
}>()
function addEmoji(emoji: string) {
  emit('addEmoji', emoji)
}
</script>
<template>
  <div class="emoji-content">
    <div class="emoji-content-item">
      <span @click="addEmoji('😃')">😃</span>
      <span @click="addEmoji('😁')">😁</span>
      <span @click="addEmoji('😂')">😂</span>
      <span @click="addEmoji('😄')">😄</span>
      <span @click="addEmoji('😅')">😅</span>
      <span @click="addEmoji('😆')">😆</span>
      <span @click="addEmoji('😇')">😇</span>
      <span @click="addEmoji('😈')">😈</span>
      <span @click="addEmoji('😉')">😉</span>
    </div>
    <div class="emoji-content-item">
      <span @click="addEmoji('😊')">😊</span>
      <span @click="addEmoji('😋')">😋</span>
      <span @click="addEmoji('😌')">😌</span>
      <span @click="addEmoji('😍')">😍</span>
      <span @click="addEmoji('😎')">😎</span>
      <span @click="addEmoji('😏')">😏</span>
      <span @click="addEmoji('😐')">😐</span>
      <span @click="addEmoji('😒')">😒</span>
      <span @click="addEmoji('😓')">😓</span>
    </div>
    <div class="emoji-content-item">
      <span @click="addEmoji('❓')">❓</span>
      <span @click="addEmoji('😕')">😕</span>
      <span @click="addEmoji('😖')">😖</span>
      <span @click="addEmoji('😗')">😗</span>
      <span @click="addEmoji('😘')">😘</span>
      <span @click="addEmoji('😙')">😙</span>
      <span @click="addEmoji('😚')">😚</span>
      <span @click="addEmoji('😜')">😜</span>
      <span @click="addEmoji('😝')">😝</span>
    </div>
    <div class="emoji-content-item">
      <span @click="addEmoji('😞')">😞</span>
      <span @click="addEmoji('😟')">😟</span>
      <span @click="addEmoji('😠')">😠</span>
      <span @click="addEmoji('😡')">😡</span>
      <span @click="addEmoji('😢')">😢</span>
      <span @click="addEmoji('😣')">😣</span>
      <span @click="addEmoji('😤')">😤</span>
      <span @click="addEmoji('😥')">😥</span>
      <span @click="addEmoji('😦')">😦</span>
    </div>
    <div class="emoji-content-item">
      <span @click="addEmoji('😨')">😨</span>
      <span @click="addEmoji('😩')">😩</span>
      <span @click="addEmoji('😪')">😪</span>
      <span @click="addEmoji('😫')">😫</span>
      <span @click="addEmoji('😬')">😬</span>
      <span @click="addEmoji('😭')">😭</span>
      <span @click="addEmoji('😮')">😮</span>
      <span @click="addEmoji('😯')">😯</span>
      <span @click="addEmoji('😰')">😰</span>
    </div>
    <div class="emoji-content-item">
      <span @click="addEmoji('😲')">😲</span>
      <span @click="addEmoji('😳')">😳</span>
      <span @click="addEmoji('😴')">😴</span>
      <span @click="addEmoji('😵')">😵</span>
      <span @click="addEmoji('🧐')">🧐</span>
      <span @click="addEmoji('😷')">😷</span>
      <span @click="addEmoji('🙁')">🙁</span>
      <span @click="addEmoji('🙂')">🙂</span>
      <span @click="addEmoji('🙃')">🙃</span>
    </div>
    <div class="emoji-content-item">
      <span @click="addEmoji('🤐')">🤐</span>
      <span @click="addEmoji('🤑')">🤑</span>
      <span @click="addEmoji('🤒')">🤒</span>
      <span @click="addEmoji('🤓')">🤓</span>
      <span @click="addEmoji('🤔')">🤔</span>
      <span @click="addEmoji('🤕')">🤕</span>
      <span @click="addEmoji('🤠')">🤠</span>
      <span @click="addEmoji('🤡')">🤡</span>
      <span @click="addEmoji('🤢')">🤢</span>
    </div>
    <div class="emoji-content-item">
      <span @click="addEmoji('🤤')">🤤</span>
      <span @click="addEmoji('🤥')">🤥</span>
      <span @click="addEmoji('🤧')">🤧</span>
      <span @click="addEmoji('🤨')">🤨</span>
      <span @click="addEmoji('🤩')">🤩</span>
      <span @click="addEmoji('🤪')">🤪</span>
      <span @click="addEmoji('🤫')">🤫</span>
      <span @click="addEmoji('🤬')">🤬</span>
      <span @click="addEmoji('🤭')">🤭</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.emoji-content {
  color: #000;
  font-size: 20px;
  width: 250px;
  // 禁止文字被鼠标选中
  -moz-user-select: none;
  -o-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;

  .emoji-content-item {
    display: flex;
    justify-content: space-evenly;
    flex-wrap: nowrap;

    span {
      cursor: pointer;
    }
  }
}
</style>
