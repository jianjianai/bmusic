<!-- 左边 -->
<script setup lang="ts">
import { openPopUpComponent } from '@renderer/mod/popUp/popUp';
import { musicPlayer, musicPlayerButtomWidth, musicPlayerSize, playerLeftCustomButtons } from '../playing';
import AddToPlayList from '@renderer/mod/popUp/popUps/AddToPlayList.vue';
import AddMusicCollectionSvg from '@renderer/components/svg/AddMusicCollection.vue';

const props = defineProps<{
    /** 隐藏音乐名称 */
    hideMusicName?: boolean,
}>();

</script>
<template>
    <div class="left-control" :class="musicPlayerSize">
        <div class="player-music-info">
            <TransitionGroup name="music-info-list">
                <div :key="1" class="music-info" v-if="!props.hideMusicName"
                    :title="(musicPlayer.currentMusic!.musicName || '未知') + ' - ' + (musicPlayer.currentMusic!.musicAuthor || '未知歌手')">
                    <span class="music-name">{{ musicPlayer.currentMusic!.musicName || "未知" }}</span>
                    <span class="music-line"> - </span>
                    <span class="music-singer">{{ musicPlayer.currentMusic!.musicAuthor || "未知歌手" }}</span>
                </div>
                <div :key="2" class="user-button-greap" :class="{ 'hide-music-name': hideMusicName }">
                    <!-- 收藏到歌单 -->
                    <div class="user-button" title="收藏到歌单"
                        @click="openPopUpComponent(AddToPlayList, { music: musicPlayer.currentMusic! })">
                        <AddMusicCollectionSvg style="width: 100%; height: 100%;" />
                    </div>
                    <!-- 左下角按钮自定义按钮 -->
                    <div class="user-button" v-for="button of playerLeftCustomButtons" :title="button.title"
                        @click="button.onClick?.($event, musicPlayer.currentMusic!.playerData)">
                        <component :is="button.icon" style="width: 100%; height: 100%;"
                            :style="['width: 100%; height: 100%;', button.style]" />
                    </div>
                </div>
            </TransitionGroup>
        </div>
    </div>
</template>
<style scoped>
.left-control.buttom::before {
    /* width: 9rem; */
    width: v-bind("musicPlayerButtomWidth");
}

.left-control::before {
    content: "";
    width: 0.5rem;
    transition: width 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.left-control {
    display: flex;
}

.player-music-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-around;
    padding-left: 0.8rem;
    flex: 1;
    width: 0;
}

.music-info {
    overflow: hidden;
    white-space: nowrap;
    width: 100%;
    text-overflow: ellipsis;
}

.music-name {
    font-size: 1rem;
    color: var(--color-music-player-music-name);
    /* font-weight: bolder; */
}

.music-singer {
    color: var(--color-music-player-music-singer);
    font-size: 0.9rem;
}

.music-line {
    color: var(--color-music-player-music-line);
    font-size: 1rem;
}

.user-button:hover {
    color: var(--color-music-player-user-button-hover);
}

.user-button-greap {
    height: 1.2rem;
    display: flex;
    gap: 0.8rem;
    align-items: center;
    transition: gap 0.25s;
}

.user-button-greap.hide-music-name {
    gap: 1rem;
}

.user-button {
    width: 1.2rem;
    height: 1.2rem;
    color: var(--color-music-player-user-button);
    cursor: pointer;
    transition: width 0.25s, height 0.25s;
}

.user-button-greap.hide-music-name .user-button {
    width: 1.5rem;
    height: 1.5rem;
}

/* 对移动中的元素应用的过渡 */
.music-info-list-move,
.music-info-list-enter-active,
.music-info-list-leave-active {
    transition: all 0.25s ease;
}

.music-info-list-enter-from,
.music-info-list-leave-to {
    opacity: 0;
    transform: translateY(-100%);
}

/* 确保将离开的元素从布局流中删除
  以便能够正确地计算移动的动画。 */
.music-info-list-leave-active {
    position: absolute;
}
</style>