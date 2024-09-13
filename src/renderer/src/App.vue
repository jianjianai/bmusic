<script setup lang="ts">
import Nav from './components/Nav.vue'
import Content from './components/Content.vue'
import MusicPlayerBar from './components/MusicPlayerBar.vue';

</script>

<template>
  <div class="main">
    <div class="main-box">
      <Nav class="nav"></Nav>
      <Content class="content"></Content>
    </div>
    <MusicPlayerBar></MusicPlayerBar>
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

.main:has(.bottom-music-player) .main-box {
  height: calc(100vh - 5rem - 0.1rem);
}
</style>
