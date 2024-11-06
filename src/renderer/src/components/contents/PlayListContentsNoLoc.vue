<script lang="ts" setup>
import { type MusicPlayListOnLoc } from '@renderer/states/playListStorage';
import PlaySvg from '@renderer/svg/Play.vue';
import SearchSvg from '@renderer/svg/Search.vue';
import { playList } from '@renderer/states/playListState';
import ImgDiv from '../allSmall/ImgDiv.vue';
import UniversalButton from '../allSmall/UniversalButton.vue';
import MusicList from '../allSmall/MusicList.vue';
import AddMusicCollectionSvg from '@renderer/svg/AddMusicCollection.vue';
import { openPopUpComponent } from '@renderer/states/popUpComponent/popUpComponent';
import CreatePlayList from '../popUps/CreatePlayList.vue';

const props = defineProps<{
    musicPlayList: MusicPlayListOnLoc
}>();


// 点击播放全部按钮
function playAll() {
    playList.setList(props.musicPlayList!.list);
    playList.setCurrentIndex(0);
}


</script>
<template>
    <div class="pay-list-box">
        <div class="pay-list-box-sell">
            <!-- 头部内容 -->
            <div class="header">
                <!-- 内容，歌单名称简介等 -->
                <div class="content">
                    <!-- 图片 -->
                    <ImgDiv class="content-img"
                        :src="props.musicPlayList.iconUrl || props.musicPlayList.list[0]?.iconUrl">
                    </ImgDiv>
                    <!-- 右边内容 -->
                    <div class="content-main">
                        <!-- 文本内容 -->
                        <div class="content-main-c">
                            <div class="title-line">
                                <div class="title">{{ musicPlayList.name }}</div>
                            </div>
                            <div class="description">{{ props.musicPlayList.description || "没有简介" }}</div>
                            <div class="author">
                                <ImgDiv class="author-img" :src="props.musicPlayList.authorIconUrl">
                                </ImgDiv>
                                <div class="author-name">{{ props.musicPlayList.author || "没有作者" }}</div>
                            </div>
                        </div>
                        <!-- 按钮组 -->
                        <div class="content-button-grep">
                            <UniversalButton text="播放全部" type="ok" :icon="PlaySvg" @click="playAll()"></UniversalButton>
                            <UniversalButton text="保存到歌单" type='other' :icon="AddMusicCollectionSvg" @click="openPopUpComponent(CreatePlayList,{playListMusicOnLoc:props.musicPlayList,okAndOpen:true})"></UniversalButton>
                        </div>
                    </div>
                </div>
                <!-- 下面tab行 -->
                <div class="tab-line">
                    <!-- 左边tab -->
                    <div class="tabs">
                        <div class="tab">歌曲列表</div>
                    </div>
                    <!-- 右边搜索框 -->
                    <label class="search" for="pay-list-search-imput">
                        <SearchSvg class="icon"></SearchSvg>
                        <input id="pay-list-search-imput" class="imput" type="text" placeholder="搜索" />
                    </label>
                </div>
            </div>
            <!-- 歌曲列表 -->
            <MusicList :list="props.musicPlayList.list || []" :replacePlayList="true"></MusicList>
        </div>
    </div>
</template>
<style scoped>
.search .imput {
    flex: 1;
    width: 0;
    height: 100%;
    border: none;
    outline: none;
    background-color: rgba(255, 255, 255, 0);
}

.search .icon {
    width: 1rem;
    height: 1rem;
}

.search:has(.imput:focus) {
    width: 8rem;
    border-color: var(--color-pay-list-search-border-focus);
}

.search {
    width: 4rem;
    height: 1.5rem;
    padding: 0 0.5rem;
    display: flex;
    align-items: center;
    background-color: var(--color-pay-list-search-bg);
    border: 0.1rem solid var(--color-pay-list-search-border);
    border-radius: 1rem;
    cursor: text;
    transition: width 0.2s ease-in-out;
    margin: 0 0.5rem 0 0;
}

.author-img {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    margin-right: 0.5rem;
    background-position: center;
    background-size: cover;
}

.author-name {
    font-size: 0.9rem;
    color: var(--color-pay-list-header-author-font);
    flex: 1;
    width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.author {
    display: flex;
    align-items: center;
    flex: none;
}


.content-button-grep {
    display: flex;
    align-items: center;
    margin-top: 0.5rem;
    gap: 0.5rem;
}

.content-main-c {
    height: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.description {
    margin: 0.5rem 0;
    font-size: 0.9rem;
    color: var(--color-pay-list-header-description-font);
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    display: -webkit-box;
}

.title-line {
    display: flex;
    align-items: center;
}

.title {
    font-size: 1.3rem;
    font-weight: bolder;
    color: var(--color-pay-list-header-title-font);
    flex: 1;
    width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.content-main {
    flex: 1;
    width: 0;
    height: 10rem;
    display: flex;
    flex-direction: column;
}

.content-img {
    width: 10rem;
    height: 10rem;
    border-radius: 1rem;
    margin: 0 1rem;
}

.content {
    display: flex;
    align-items: center;
}

.tab {
    font-size: 1rem;
    font-weight: bolder;
}

.tabs {
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 1rem;
}

.tab-line {
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.content {
    width: 100%;
    height: 0;
    flex: 1;
}

.header {
    display: flex;
    flex-direction: column;
}

.header {
    width: 100%;
    height: 15rem;
}

.pay-list-box-sell {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    scrollbar-width: thin;
}

.pay-list-box {
    width: 100%;
    height: 100%;
}
</style>