<!-- 右边 -->
<script setup lang="ts">
import { playListOpen } from '@renderer/mod/playingList/playingList';
import { musicPlayer, playerRightCustomButtons } from '../playing';
import PlayListLineSvg from '@renderer/components/svg/PlayListLine.vue';
import VolumeButton from './VolumeButton.vue';

const props = defineProps<{
    /** 是否显示时间 */
    showTime?: boolean,
}>();

/** 将毫秒为时间的单位转换为 mm:ss 的形式 */
function formatTime(time: number) {
    const min = Math.floor(time / 60000);
    const sec = Math.floor(time / 1000) % 60;
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
}
</script>
<template>
    <div class="right-control">
        <!-- 播放列表 -->
        <div class="right-button" @click="playListOpen = !playListOpen" title="播放列表">
            <PlayListLineSvg style="width: 100%;height: 100%;" />
        </div>
        <!-- 音量按钮 -->
        <VolumeButton class="right-button" />
        <!-- 右下角自定义按钮 -->
        <div class="right-button" v-for="button of playerRightCustomButtons"
            @click="button.onClick?.($event, musicPlayer.currentMusic!.playerData)" :title="button.title">
            <component :is="button.icon" :style="['width: 100%; height: 100%;', button.style]" />
        </div>
        <!-- 进度条显示在上方则显示时间 -->
        <Transition name="time">
            <div class="time" v-if="props.showTime">
                {{ formatTime(musicPlayer.currentTime) }} / {{ formatTime(musicPlayer.duration) }}
            </div>
        </Transition>
    </div>
</template>
<style scoped>
.time {
    color: var(--color-music-player-right-time);
    font-size: 0.8rem;
}

.time-enter-active,
.time-leave-active {
    transition: all 0.25s;
}

.time-enter-from,
.time-leave-to {
    opacity: 0;
    transform: scale(0.5);
}

.right-button:hover {
    color: var(--color-music-player-right-button-hover);
}

.right-button {
    width: 1.5rem;
    height: 1.5rem;
    color: var(--color-music-player-right-button);
    cursor: pointer;
}

.right-control {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    gap: 1rem;
    padding-right: 1.5rem;
}
</style>