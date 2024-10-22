<script lang="ts" setup>
import MusicPlayerContr from './MusicPlayerContr.vue';
import MusicPlayers from './musicPlayers/MusicPlayers.vue'
import { musicPlayerSize } from '../states/musicPlayerStates';
import DownSvg from './svg/Down.vue';
import PlayerButton from './allSmall/playerButton.vue';




</script>
<template>
    <div class="music-player" :class="{ 'player-min': musicPlayerSize === 'buttom' }">
        <!-- 播放器主体 -->
        <div class="player">
            <MusicPlayers></MusicPlayers>
            <!-- 缩小状态遮罩 -->
            <div class="player-min-mask" @click="() => { musicPlayerSize = 'max' }" v-if="musicPlayerSize === 'buttom'"
                title="放大"></div>
            <!-- 缩小按钮 -->
            <PlayerButton v-if="musicPlayerSize === 'max'" @click="musicPlayerSize = 'buttom'" title="缩小"
                style="left: 2rem;top: 1rem;" :icon="DownSvg"></PlayerButton>
        </div>
        <!-- 下方控制栏 -->
        <div class="player-bottom-control">
            <MusicPlayerContr class="player-control-grep"></MusicPlayerContr>
        </div>
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

.player-control-grep {
    height: 100%;
}



.player-bottom-control {
    height: 4rem;
    border-top: 0.1rem solid var(--color-music-player-border);
    padding: 0.5rem 0;
}


.player {
    background-color: aqua;
    position: absolute;
    left: 0;
    bottom: 5rem;
    width: 100vw;
    height: calc(100vh - 5rem);
    transition: width 0.25s ease-in-out, height 0.25s ease-in-out, bottom 0.5s cubic-bezier(0, 1.1, 0, 1.13);
}

.music-player.player-min .player {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 9rem;
    height: 5rem;
    transition: width 0.25s ease-in-out, height 0.25s ease-in-out, bottom 0.5s cubic-bezier(1, -0.37, 0, 1.38);
}

.music-player {
    background-color: var(--color-music-player-bg);
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    height: 5rem;
    flex-direction: column;
}
</style>
