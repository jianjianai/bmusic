<script setup lang="ts">
import ContrBetween from './unit/ContrBetween.vue';
import { musicPlayer, playerRightCustomButtons } from './playing';
import PlayListLineSvg from '@renderer/components/svg/PlayListLine.vue';
import { playListOpen } from '@renderer/mod/playingList/playingList';
import VolumeButton from './unit/volumeButton.vue';
import ContrLeft from './unit/ContrLeft.vue';

</script>
<template>
    <div class="player-bottom-control">
        <!-- 左边 -->
        <ContrLeft class="left-control player-control-grep" />
        <!-- 中间播放控制器 -->
        <ContrBetween class="player-control-grep" />
        <!-- 右边 -->
        <div class="right-control player-control-grep">
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

.left-control,
.right-control {
    flex: 1;
    width: 0;
}

.player-control-grep {
    height: 100%;
}

.player-bottom-control {
    height: calc(var(--button-player-height) - 1rem - 0.1rem);
    border-top: 0.1rem solid var(--color-music-player-border);
    padding: 0.5rem 0;
    display: flex;
    justify-content: space-between;
    background-color: var(--color-music-player-bg);
}
</style>