<script lang="ts" setup>
import { contentState } from '../states/contentState';
import SearchIcon from './svg/Search.vue'
import Recommend from './contents/Recommend.vue';
import Search from './contents/Search.vue';
import { toRef } from 'vue';
import { playListStorage } from '@renderer/states/playListStorage';
import Likeed from './contents/Likeed.vue';
import PlayListContents from './contents/PlayListContents.vue';
import IcFavoriteSvg from './svg/IcFavorite.vue';

const display = toRef(contentState, 'display');
const data = toRef(contentState, 'data');
const setDisplay = contentState.setDisplay;

</script>
<template>
  <div class="nav">
    <!-- 发现音乐 -->
    <div class="nav-item" :class="{ selected: display === Recommend }" @click="setDisplay(Recommend)">
      <SearchIcon class="icon"></SearchIcon>
      <div class="title">发现音乐</div>
    </div>
    <!-- 搜索 -->
    <div class="nav-item" :class="{ selected: display === Search }" @click="setDisplay(Search)">
      <SearchIcon class="icon"></SearchIcon>
      <div class="title">搜索</div>
    </div>

    <!-- 分割线 -->
    <div class="dividing-line"></div>
    <div class="line-title">我的</div>
    <!-- 发现音乐 -->
    <div class="nav-item" :class="{ selected: display === Likeed }" @click="setDisplay(Likeed)">
      <IcFavoriteSvg class="icon"></IcFavoriteSvg>
      <div class="title">我喜欢的</div>
    </div>

    <!-- 分割线 -->
    <div class="dividing-line"></div>
    <div class="line-title">歌单</div>
    <div class="paylist-item" v-for="name of playListStorage.playLists"
      :class="{ selected: display === PlayListContents && data == name }" @click="setDisplay(PlayListContents, name)">
      <div class="icon"></div>
      <div class="title">{{ name }}</div>
    </div>

  </div>
</template>
<style scoped>
.paylist-item.selected:hover,
.paylist-item.selected {
  background-color: var(--color-nav-item-selected-bg);
  color: var(--color-nav-item-selected-font);
}

.paylist-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: nowrap;
  gap: 0.3rem;
  margin: 0.1rem 0.7rem 0.1rem 1.2rem;
  border-radius: 0.5rem;
  padding: 0.2rem 0.4rem;
  color: var(--color-nav-paylist-font);
  cursor: pointer;
}

.paylist-item .title {
  flex: 1;
  width: 0;
  font-size: 0.8rem;
  text-overflow: ellipsis;
  overflow: hidden;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  display: -webkit-box;
  user-select: none;
}

.paylist-item .icon {
  width: 2rem;
  height: 2rem;
  background-color: rgb(255, 214, 222);
  border-radius: 0.3rem;
}


.line-title {
  font-size: 0.8rem;
  color: var(--color-nav-line-title);
  margin: 0.5rem 0.7rem 0.5rem 1.2rem;
  font-weight: bolder;
}

.dividing-line {
  height: 0.1rem;
  background-color: var(--color-nav-dividing-line);
  margin: 0.5rem 0.7rem 0.5rem 1.2rem;
}

.nav-item.selected:hover,
.nav-item.selected {
  background-color: var(--color-nav-item-selected-bg);
  color: var(--color-nav-item-selected-font);
}

.nav-item .title {
  font-size: 0.9rem;
}

.nav-item .icon {
  width: 1.3rem;
  height: 1.3rem;
}

.nav-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: nowrap;
  gap: 0.5rem;
  margin: 0.3rem 0.7rem 0.3rem 1.2rem;
  border-radius: 0.5rem;
  padding: 0.4rem;
  color: var(--color-nav-font);
  cursor: pointer;
}

.nav-item:hover {
  background-color: var(--color-nav-item-hover-bg);
}

.nav {
  background-color: var(--color-lav-bg);
  width: 12rem;
  padding: 0.5rem 0;
  overflow-y: scroll;
}

/*滚动条整体样式*/
.nav::-webkit-scrollbar {
  width: 0.4rem;
}

/*滚动条里面小方块*/
.nav:hover::-webkit-scrollbar-thumb {
  border-radius: 0.2rem;
  background-color: var(--color-nav-scrollbar-thumb);
}
</style>