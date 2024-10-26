<script lang="ts" setup>
import { playListOpen, playList } from '@renderer/states/playListState';
import PlaySvg from './svg/Play.vue';
import PauseSvg from './svg/Pause.vue';
import { musicPlayer } from '@renderer/states/musicPlayerStates';
import FavoriteButton from './allSmall/FavoriteButton.vue';
import { LOGO_URL } from '@renderer/imageUrls';

function clickItemIcon(index: number) {
    // 如果点击的不是当前的音乐，就切换音乐
    if (playList.currentIndex != index) {
        playList.setCurrentIndex(index);
        return;
    }
    // 如果是当前音乐则播放或者暂停
    if (musicPlayer.playing) {
        musicPlayer.requestPause();
    } else {
        musicPlayer.requestPlay();
    }
}

</script>
<template>
    <div>
        <!-- 后面的遮罩，点击关闭 -->
        <div class="play-list-bc" v-show="playListOpen" @click="playListOpen = false"></div>
        <!-- 播放列表主体 -->
        <div class="play-list-box" :class="{ open: playListOpen }">
            <!-- 标题 -->
            <div class="title">
                <div class="title-left">播放列表</div>
                <div class="title-right"></div>
            </div>
            <!-- 列表 -->
            <div class="list">
                <!-- 列表中的每个项 -->
                <div class="item-box" :class="{ paying: index == playList.currentIndex }"
                    v-for="music, index of playList.list" :key="music.playerData">
                    <!-- 图标 -->
                    <div class="icon" @click="clickItemIcon(index)">
                        <!-- TODO 图片显示 -->
                        <div class="icon-img" :style="`background-image: url(${music.iconUrl || LOGO_URL});`"></div>
                        <!-- hover -->
                        <div class="item-icon-hover"></div>
                        <!-- 暂停图标 -->
                        <PauseSvg class="item-icon-svg" v-if="index == playList.currentIndex && musicPlayer.playing">
                        </PauseSvg>
                        <!-- 播放图标 -->
                        <PlaySvg class="item-icon-svg" v-else></PlaySvg>
                    </div>
                    <div class="name-and-author">
                        <div class="name">{{ music.musicName }}</div>
                        <div class="author">
                            <div class="author-player">{{ music.playerName }}</div>
                            <div class="author-author">{{ music.musicAuthor }}</div>
                        </div>
                    </div>
                    <!-- 喜欢 -->
                    <FavoriteButton class="like" :music="music"/>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.icon-img {
    height: 100%;
    width: 100%;
    background-position: center;
    background-size: cover;
}

.item-box.paying .item-icon-hover,
.item-box.paying .item-icon-svg,
.item-box:hover .item-icon-hover,
.item-box:hover .item-icon-svg {
    display: block;
}

.item-icon-svg {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 1.5rem;
    height: 1.5rem;
    color: var(--color-play-list-item-icon-svg);
    display: none;
}

.item-icon-hover {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: var(--color-play-list-item-icon-hover);
    opacity: 0.5;
    display: none;
}

.icon {
    width: 3rem;
    height: 3rem;
    background-color: var(--color-play-list-item-icon);
    margin-right: 0.5rem;
    border-radius: 0.5rem;
    overflow: hidden;
    position: relative;
    cursor: pointer;
}

.like {
    margin-left: 0.5rem;
    position: relative;
    cursor: pointer;
    width: 1rem;
}



.author-player {
    color: var(--color-pay-list-line-content-info-item-paly-font);
    border: 0.05rem solid var(--color-pay-list-line-content-info-item-paly-font);
    border-radius: 0.2rem;
    height: 0.9rem;
    font-size: 0.6rem;
    padding: 0 0.1rem;
    line-height: 0.9rem;
    font-weight: bolder;
}

.author-author {
    color: var(--color-play-list-item-author);
    font-size: 0.8rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
    width: 0;
}

.author {
    display: flex;
    align-items: center;
    gap: 0.2rem;
    flex: 1;
    height: 0;
}

.item-box.paying .name {
    color: var(--color-play-list-item-name-paying);
}

.name {
    color: var(--color-play-list-item-name);
    font-size: 1rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.name-and-author {
    flex: 1;
    width: 0;
    display: flex;
    flex-direction: column;
    height: 3rem;
}

.item-box:hover {
    background-color: var(--color-play-list-item-hover);
}

.item-box {
    display: flex;
    align-items: center;
    padding: 0.5rem 0.5rem 0.5rem 1rem;
}

.list {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 0;
    overflow-y: scroll;
    overflow-x: hidden;
    scrollbar-width: thin;
    /* gap: 0.5rem; */
}

.title-left {
    font-size: 1.2rem;
    font-weight: bolder;
}

.title {
    padding: 0 1rem;
    width: 100%;
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    user-select: none;
}

.play-list-bc {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
}

.play-list-box.open {
    right: 0;
}

.play-list-box {
    display: flex;
    flex-direction: column;
    position: fixed;
    right: -30rem;
    width: 23rem;
    top: 2rem;
    height: calc(100vh - 8rem);
    background-color: var(--color-play-list-window-bg);
    border-radius: 1rem 0 0 1rem;
    box-shadow: 0 0 1rem var(--color-play-list-window-shadow);
    transition: right 0.2s;
}
</style>