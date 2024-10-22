<script lang="ts" setup>
import MusicPlayerContr from './MusicPlayerContr.vue';
import MusicPlayers from './musicPlayers/MusicPlayers.vue'
import { musicPlayerSize } from '../states/musicPlayerStates';
import DownSvg from './svg/Down.vue';
import PlayerButton from './allSmall/PlayerButton.vue';




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
            <div class="left-control player-control-grep">
                <div class="player-music-info">
                    <div class="music-info">
                        <span class="music-name">歌曲名</span>
                        <span class="music-line"> - </span>
                        <span class="music-singer">歌手啊大苏打大苏打阿三大苏打飒飒的撒旦</span>
                    </div>
                    <div class="user-buttons">
                        adasdasd
                    </div>
                </div>
            </div>
            <MusicPlayerContr class="player-control-grep"></MusicPlayerContr>
            <div class="right-control player-control-grep">

            </div>
        </div>
    </div>
</template>
<style scoped>
.music-singer{
    color: var(--color-music-player-music-singer);
    font-size: 0.9rem;
}
.music-line{
    color: var(--color-music-player-music-line);
    font-size: 1rem;
}
.music-name{
    font-size: 1rem;
    color: var(--color-music-player-music-name);
    font-weight: bolder;
}
.music-info{

}
.player-music-info{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding-left: 0.5rem;
    flex: 1;
}
.music-player.player-min .left-control::before {
    width: 9rem;
}

.left-control::before {
    content: "";
    width: 0;
}

.left-control {
    display: flex;
}

.left-control,
.right-control {
    flex: 1;
    width: 0;
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
    display: flex;
    justify-content: space-between;
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
