<script lang="ts" setup>
import { contentState } from '@renderer/states/contentState';
import { useMusicPlayList } from '@renderer/states/playListStorage';
import { shallowRef, toRef, watch } from 'vue';
import PlaySvg from '../svg/Play.vue';

const musicName = toRef(contentState, 'data');
const musicPlayList = shallowRef<ReturnType<typeof useMusicPlayList>>(useMusicPlayList(musicName.value as string));
watch(musicName, (newVal) => {
    musicPlayList.value = useMusicPlayList(newVal as string);
});


</script>
<template>
    <div class="pay-list-box">
        <div class="pay-list-box-sell">
            <!-- 头部内容 -->
            <div class="header">
                <!-- 内容，歌单名称简介等 -->
                <div class="content">
                    <!-- 图片 -->
                    <div class="content-img" :style="`background-image: url(${musicPlayList.musicList.iconUrl});`">
                    </div>
                    <!-- 右边内容 -->
                    <div class="content-main">
                        <!-- 文本内容 -->
                        <div class="content-main-c">
                            <div class="title">{{ musicPlayList.name }}</div>
                            <div class="description">{{ musicPlayList.musicList.description || "没有简介" }}</div>
                            <div class="author">
                                <div class="author-img"
                                    :style="`background-image: url(${musicPlayList.musicList.authorIconUrl});`"></div>
                                <div class="author-name">{{ musicPlayList.musicList.author || "没有作者" }}</div>
                            </div>
                        </div>
                        <!-- 按钮组 -->
                        <div class="content-button-grep">
                            <div class="content-button play-button">
                                <PlaySvg class="icon" />
                                <div class="text">播放全部</div>
                            </div>
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
                    <div class="search">
                        搜索框
                    </div>
                </div>
            </div>
            <!-- 歌曲列表 -->
            <div></div>
        </div>
    </div>
</template>
<style scoped>
.content-button .text{
    font-size: 0.9rem;
}
.content-button .icon{
    width: 1.5rem;
    height: 1.5rem;
}
.play-button{
    background-color: var(--color-play-button-bg);
    color: var(--color-play-button-font);
}
.author-img {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background-color: rgb(255, 206, 231);
    margin-right: 0.5rem;
    background-position: center;
    background-size: cover;
}

.author-name {
    font-size: 0.9rem;
    color: var(--color-pay-list-header-author-font);
}

.author {
    display: flex;
    align-items: center;
    flex: none;
}

.content-button {
    height: 2.3rem;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    padding: 0 0.5rem;
    cursor: pointer;
}

.content-button-grep {
    display: flex;
    align-items: center;
    margin-top: 0.5rem;
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

.title {
    flex: none;
    font-size: 1.3rem;
    font-weight: bolder;
    color: var(--color-pay-list-header-title-font);
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
    background-color: rgb(255, 206, 231);
    margin: 0 1rem;
    background-position: center;
    background-size: cover;
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
    /* background-color: antiquewhite; */
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