<script setup lang="ts">
import Nav from './components/Nav.vue'
import Content from './components/Content.vue'
import MusicPlayer from './components/MusicPlayer.vue';
import PlayList from './components/PlayList.vue';
</script>

<template>
  <div class="main">
    <!-- 音乐页面 -->
    <div class="main-box">
      <Nav class="nav"></Nav>
      <Content class="content"></Content>
    </div>
    <!-- 下方播放器主体 -->
    <MusicPlayer></MusicPlayer>
    <!-- 右侧播放列表 -->
    <PlayList></PlayList>
  </div>
</template>

<style scoped>
.content {
  flex: 1;
}

.nav,
.content {
  display: flex;
  flex-direction: column;
}

.main {
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: var(--color-window-bg);
}

.main-box {
  display: flex;
  flex-direction: row;
  height: 100vh;
  align-items: stretch;
}

.main:has(.music-player) .main-box {
  height: calc(100vh - 5rem);
}
</style>
