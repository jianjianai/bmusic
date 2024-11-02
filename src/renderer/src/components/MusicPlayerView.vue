<!-- 播放器主体 -->
<script lang="ts" setup>
import { musicPlayerSize } from '@renderer/states/musicPlayerStates';
import DownSvg from '@renderer/svg/Down.vue';
import MusicPlayers from './musicPlayers/MusicPlayers.vue';
import PlayerButton from './allSmall/PlayerButton.vue';

</script>
<template>
    <div class="player" :class="musicPlayerSize">
        <MusicPlayers></MusicPlayers>
        <!-- 缩小状态遮罩 -->
        <div class="player-min-mask" @click="() => { musicPlayerSize = 'max' }" v-if="musicPlayerSize === 'buttom'"
            title="放大"></div>
        <!-- 缩小按钮 -->
        <PlayerButton v-if="musicPlayerSize === 'max'" @click="musicPlayerSize = 'buttom'" title="缩小"
            style="left: 2rem;top: 1rem;" :icon="DownSvg"></PlayerButton>
    </div>
</template>
<style scoped>

/* 缩小状态遮罩 */
.player-min-mask:hover {
    background-color: rgba(0, 0, 0, 0.036);
}

.player-min-mask {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    cursor: pointer;
}

.player {
    position: fixed;
    left: 0;
    bottom: var(--button-player-height);
    width: 100vw;
    height: calc(100vh - var(--button-player-height));
    transition: width 0.25s ease-in-out, height 0.25s ease-in-out, bottom 0.5s cubic-bezier(0, 1.1, 0, 1.13);
}

.player.buttom {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 9rem;
    height: var(--button-player-height);
    transition: width 0.25s ease-in-out, height 0.25s ease-in-out, bottom 0.5s cubic-bezier(1, -0.37, 0, 1.38);
}
</style>
