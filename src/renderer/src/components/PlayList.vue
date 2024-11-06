<script lang="ts" setup>
import { playListOpen, playList } from '@renderer/states/playListState';
import PlaySvg from '@renderer/svg/Play.vue';
import PauseSvg from '@renderer/svg/Pause.vue';
import { musicKey, musicPlayer } from '@renderer/states/musicPlayerStates';
import FavoriteButton from './allSmall/FavoriteButton.vue';
import AddMusicCollectionSvg from '@renderer/svg/AddMusicCollection.vue';
import ImgDiv from './allSmall/ImgDiv.vue';
import PlayerInfoTag from './allSmall/PlayerInfoTag.vue';
import AddToPlayList from './popUps/AddToPlayList.vue';
import { openPopUpComponent } from '@renderer/states/popUpComponent/popUpComponent';

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
        <div class="play-list-bc" v-if="playListOpen" @click="playListOpen = false"></div>
        <!-- 播放列表主体 -->
        <Transition>
            <div class="play-list-box" v-if="playListOpen">
                <!-- 标题 -->
                <div class="title">
                    <div class="title-left">播放列表</div>
                    <div class="title-right"></div>
                </div>
                <!-- 列表 -->
                <div class="list">
                    <!-- 列表中的每个项 -->
                    <div class="item-box" :class="{ paying: index == playList.currentIndex }"
                        v-for="music, index of playList.list" :key="musicKey(music)">
                        <!-- 图标 -->
                        <div class="icon" @click="clickItemIcon(index)">
                            <!-- TODO 图片显示 -->
                            <ImgDiv class="icon-img" :src="music.iconUrl"></ImgDiv>
                            <!-- hover -->
                            <div class="item-icon-hover"></div>
                            <!-- 暂停图标 -->
                            <PauseSvg class="item-icon-svg"
                                v-if="index == playList.currentIndex && musicPlayer.playing">
                            </PauseSvg>
                            <!-- 播放图标 -->
                            <PlaySvg class="item-icon-svg" v-else></PlaySvg>
                        </div>
                        <!-- 音乐名称啥的 -->
                        <div class="name-and-author">
                            <div class="name">{{ music.musicName }}</div>
                            <div class="author">
                                <!-- 播放器 -->
                                <PlayerInfoTag class="author-player" :playerName="music.playerName" />
                                <div class="author-author">{{ music.musicAuthor }}</div>
                            </div>
                        </div>
                        <!-- 按钮组 -->
                        <div class="button-grep">
                            <div class="button-grep-button" title="收藏到歌单" @click="openPopUpComponent(AddToPlayList,{music:music})">
                                <AddMusicCollectionSvg style="width: 100%; height: 100%;" />
                            </div>
                        </div>
                        <!-- 喜欢 -->
                        <FavoriteButton class="like" :music="music" style="width: 1.2rem;height: 1.2rem;" />
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>
<style scoped>
.button-grep-button:hover {
    color: var(--color-play-list-item-button-grep-button-hover);
}

.button-grep-button {
    width: 1.2rem;
    height: 1.2rem;
    cursor: pointer;
    color: var(--color-play-list-item-button-grep-button);
}

.item-box:hover .button-grep {
    display: flex;
}

.button-grep {
    display: none;
    gap: 0.5rem;
    align-items: center;
}

.icon-img {
    height: 100%;
    width: 100%;
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

.author-player{
    font-size: 0.8rem;
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
    user-select: none;
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


.v-enter-active.play-list-box,
.v-leave-active.play-list-box {
    transition: right 0.2s;
}

.v-enter-from.play-list-box,
.v-leave-to.play-list-box {
    right: -30rem;
}

.play-list-box {
    display: flex;
    flex-direction: column;
    position: fixed;
    right: 0;
    width: 23rem;
    top: calc(var(--top-bar-height) + 1rem);
    height: calc(100vh - var(--button-player-height) - var(--top-bar-height) - 2rem);
    background-color: var(--color-play-list-window-bg);
    border-radius: 1rem 0 0 1rem;
    box-shadow: 0 0 1rem var(--color-play-list-window-shadow);
}
</style>