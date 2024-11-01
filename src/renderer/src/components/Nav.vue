<script lang="ts" setup>
import { setContent, contentDisplay, contentData } from '../states/contentState';
import SearchIcon from '@renderer/svg/Search.vue'
import Recommend from './contents/Recommend.vue';
import Search from './contents/Search.vue';
import { reactive, watch } from 'vue';
import { playListStorage, MYLIKEED_PLAYLIST_NAME } from '@renderer/states/playListStorage';
import PlayListContents from './contents/PlayListContents.vue';
import IcFavoriteSvg from '@renderer/svg/IcFavorite.vue';
import ImgDiv from './allSmall/ImgDiv.vue';


const iconMap = reactive(new Map<string, string>);
watch(() => playListStorage.playLists, async () => {
  iconMap.clear();
  for (const name of playListStorage.playLists) {
    iconMap.set(name, await playListStorage.readPlayListIconUrl(name));
  }
}, { immediate: true });


</script>
<template>
  <div class="nav">
    <!-- 发现音乐 -->
    <div class="nav-item" :class="{ selected: contentDisplay === Recommend }" @click="setContent(Recommend, {})">
      <SearchIcon class="icon"></SearchIcon>
      <div class="title">发现音乐</div>
    </div>
    <!-- 搜索 -->
    <div class="nav-item" :class="{ selected: contentDisplay === Search }" @click="setContent(Search, {})">
      <SearchIcon class="icon"></SearchIcon>
      <div class="title">搜索</div>
    </div>

    <!-- 分割线 -->
    <div class="dividing-line"></div>
    <div class="line-title">我的</div>
    <!-- 发现音乐 -->
    <div class="nav-item"
      :class="{ selected: contentDisplay === PlayListContents && contentData?.musicName == MYLIKEED_PLAYLIST_NAME }"
      @click="setContent(PlayListContents, { musicListName: MYLIKEED_PLAYLIST_NAME })">
      <IcFavoriteSvg class="icon"></IcFavoriteSvg>
      <div class="title">我喜欢的</div>
    </div>

    <!-- 分割线 -->
    <div class="dividing-line"></div>
    <div class="line-title">歌单</div>
    <div class="paylist-item" v-for="name of playListStorage.playLists.filter(n => n !== MYLIKEED_PLAYLIST_NAME)"
      :class="{ selected: contentDisplay === PlayListContents && contentData?.musicName == name }"
      @click="setContent(PlayListContents, { musicListName: name })">
      <ImgDiv class="icon" :src="iconMap.get(name)"></ImgDiv>
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
  border-radius: 0.3rem;
}


.line-title {
  font-size: 0.8rem;
  color: var(--color-nav-line-title);
  margin: 0.5rem 0.7rem 0.5rem 1.2rem;
  font-weight: bolder;
}

.dividing-line {
  border-bottom: 0.1rem solid var(--color-nav-dividing-line);
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

.paylist-item:hover,
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