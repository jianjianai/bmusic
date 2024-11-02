<script setup lang="ts">
import Nav from './components/Nav.vue'
import Content from './components/Content.vue'
import MusicPlayer from './components/MusicPlayer.vue';
import PlayList from './components/PlayList.vue';
import AddToPlayList from './states/addToPlayList/AddToPlayList.vue';
import { addToPlayListMusic } from './states/addToPlayList/addToPlayList';
import { musicPlayer, musicPlayerSize } from './states/musicPlayerStates';
import Notification from './states/notification/Notification.vue';
import { defineAsyncComponent } from 'vue';
import { cropperImgInfo } from './states/cropperImg/cropperImg';
import CreatePlayList from './states/addToPlayList/CreatePlayList.vue';
import { createNewPlayListMusic } from './states/addToPlayList/createPlayList';
import TopBar from './components/TopBar.vue';
const CropperImg = defineAsyncComponent(() => import('./states/cropperImg/CropperImg.vue'));

</script>

<template>
  <div class="main">
    <!-- 音乐页面 -->
    <div class="main-box">
      <Nav class="nav"></Nav>
      <Content class="content"></Content>
      <TopBar v-if="musicPlayerSize == 'buttom'" />
    </div>
    <!-- 下方播放器主体 -->
    <MusicPlayer v-if="musicPlayer.currentMusic" class="main-music-player" />
    <!-- 右侧播放列表 -->
    <PlayList />

    <!-- 下面全是弹出组件 -->

    <!-- 添加到播放列表 -->
    <AddToPlayList v-if="addToPlayListMusic" />
    <!-- 创建新歌单 -->
    <CreatePlayList v-if="createNewPlayListMusic" />
    <!-- 图片编辑 -->
    <CropperImg v-if="cropperImgInfo" />


    <!-- 消息弹出框 -->
    <Notification />

  </div>
</template>

<style scoped>
.content {
  flex: 1;
  width: 0;
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

.main:has(.main-music-player) .main-box {
  height: calc(100vh - var(--button-player-height));
}
</style>
