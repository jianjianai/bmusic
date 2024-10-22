<script lang="ts" setup>
import MusicPlayerContr from './MusicPlayerContr.vue';
import MusicPlayers from './musicPlayers/MusicPlayers.vue'
import { musicPlayerSize } from '../states/musicPlayerStates';
import DownSvg from './svg/Down.vue';
import CloseSvg from './svg/Close.vue';
import { ref } from 'vue';

const playerinMaxMaskOpen = ref(true);


</script>
<template>
    <div class="music-player" :class="{'player-min':musicPlayerSize === 'buttom'}">
        <!-- 播放器主体 -->
        <div class="player">
            <MusicPlayers></MusicPlayers>
            <!-- 放大状态遮罩 -->
            <div class="player-max-mask" v-if="musicPlayerSize === 'max' && playerinMaxMaskOpen"></div>
            <!-- 缩小状态遮罩 -->
            <div class="player-min-mask" @click="() => { musicPlayerSize = 'max'; playerinMaxMaskOpen = true }"
                v-if="musicPlayerSize === 'buttom'" title="放大"></div>
            <!-- 缩小按钮 -->
            <div v-if="musicPlayerSize === 'max'" style="left: 2rem;top: 1rem;" class="player-but player-but-tomin"
                @click="musicPlayerSize = 'buttom'" title="缩小">
                <DownSvg class="player-but-icon"></DownSvg>
            </div>
            <!-- 关闭遮罩按钮 -->
            <div v-if="musicPlayerSize === 'max' && playerinMaxMaskOpen" style="right: 2rem;top: 1rem;"
                class="player-but" @click="playerinMaxMaskOpen = false" title="关闭遮罩">
                <CloseSvg class="player-but-icon"></CloseSvg>
            </div>
        </div>
        <!-- 下方控制栏 -->
        <div class="player-bottom-control">
            <MusicPlayerContr class="player-control-grep"></MusicPlayerContr>
        </div>
    </div>
</template>
<style scoped>
/* 放大状态遮罩 */
.player-max-mask {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
}


/* 按钮里面的图标 */
.player-but-icon {
    position: absolute;
    color: var(--color-contr-top-btn-text);
    width: 60%;
    height: 60%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}

/* 按钮 */
.player-but:hover {
    background-color: var(--color-contr-top-btn-bgc-hover);
}

.player-but {
    position: absolute;
    background-color: var(--color-contr-top-btn-bgc);
    border-radius: 0.5rem;
    width: 2.5rem;
    height: 2.5rem;
    border: 0.1rem solid var(--color-contr-top-btn-border);
    cursor: pointer;
}

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

.music-player.player-min .player{
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
