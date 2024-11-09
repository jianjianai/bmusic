<!-- 右边 -->
<script setup lang="ts">
import { playListOpen } from '@renderer/mod/playingList/playingList';
import { musicPlayer, playerRightCustomButtons } from '../playing';
import PlayListLineSvg from '@renderer/components/svg/PlayListLine.vue';
import VolumeButton from './VolumeButton.vue';

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
    </div>
</template>
<style scoped>
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