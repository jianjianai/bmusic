<script lang="ts" setup>
import MusicPlayerContr from './MusicPlayerContr.vue';
import MusicPlayers from './musicPlayers/MusicPlayers.vue'
import { musicPlayer, musicPlayerSize } from '../states/musicPlayerStates';
import DownSvg from './svg/Down.vue';
import PlayerButton from './allSmall/PlayerButton.vue';
import AddMusicCollectionSvg from './svg/AddMusicCollection.vue';
import Volume0Svg from './svg/Volume0.vue';
import Volume1Svg from './svg/Volume1.vue';
import Volume2Svg from './svg/Volume2.vue';
import Volume3Svg from './svg/Volume3.vue';



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
            <!-- 左边 -->
            <div class="left-control player-control-grep">
                <div class="player-music-info">
                    <div class="music-info">
                        <span class="music-name">{{ musicPlayer.currentMusic.musicName || "未知" }}</span>
                        <span class="music-line"> - </span>
                        <span class="music-singer">{{ musicPlayer.currentMusic.musicAuthor || "未知歌手" }}</span>
                    </div>
                    <div class="user-button-greap">
                        <AddMusicCollectionSvg class="user-button"></AddMusicCollectionSvg>
                        <AddMusicCollectionSvg class="user-button"></AddMusicCollectionSvg>
                        <AddMusicCollectionSvg class="user-button"></AddMusicCollectionSvg>
                    </div>
                </div>
            </div>
            <!-- 中间播放控制器 -->
            <MusicPlayerContr class="player-control-grep"></MusicPlayerContr>
            <!-- 右边 -->
            <div class="right-control player-control-grep">
                <AddMusicCollectionSvg class="right-button"></AddMusicCollectionSvg>
                <!-- 音量按钮 -->
                <div class="right-button volume">
                    <Volume0Svg class="volume-icon" v-if="musicPlayer.volume<=0"></volume0Svg>
                    <Volume1Svg class="volume-icon" v-else-if="musicPlayer.volume<=25"></volume1Svg>
                    <Volume2Svg class="volume-icon" v-else-if="musicPlayer.volume<=50"></volume2Svg>
                    <Volume3Svg class="volume-icon" v-else-if="musicPlayer.volume<=75"></volume3Svg>
                    <!-- 音量拖动条 -->
                    <div class="volume-line-box">

                    </div>
                </div>
                <AddMusicCollectionSvg class="right-button"></AddMusicCollectionSvg>
                <AddMusicCollectionSvg class="right-button"></AddMusicCollectionSvg>
            </div>
        </div>
    </div>
</template>
<style scoped>
.volume-line-box{
    left: 50%;
    transform: translateX(-50%);
    top: -8.5rem;
    position: absolute;
    height: 8rem;
    width: 2rem;
    background-color: var(--color-music-player-volume-line-box);
    box-shadow: 0 0 0.5rem 0.1rem var(--color-music-player-volume-line-box-shadow);
    border-radius: 0.5rem;
}
.right-button.volume{
    position: relative;
    cursor: default;
}
.volume-icon{
    width: 100%;
    height: 100%;
    cursor: pointer;
}

.right-button:hover{
    color: var(--color-music-player-right-button-hover);
}
.right-button{
    width: 1.5rem;
    height: 1.5rem;
    color: var(--color-music-player-right-button);
    cursor: pointer;
}
.right-control{
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    gap: 1rem;
    padding-right: 1.5rem;
}

.user-button{
    width: 1.2rem;
    height: 1.2rem;
    color: var(--color-music-player-user-button);
    cursor: pointer;
}
.user-button:hover{
    color: var(--color-music-player-user-button-hover);
}

.user-button-greap{
    height: 1.2rem;
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

.music-singer {
    color: var(--color-music-player-music-singer);
    font-size: 0.9rem;
}

.music-line {
    color: var(--color-music-player-music-line);
    font-size: 1rem;
}

.music-name {
    font-size: 1rem;
    color: var(--color-music-player-music-name);
    font-weight: bolder;
}

.music-info {
    overflow: hidden;
    white-space: nowrap;
    width: 100%;
    text-overflow: ellipsis;
}

.player-music-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-around;
    padding-left: 0.5rem;
    flex: 1;
    width: 0;
}

.music-player.player-min .left-control::before {
    width: 9rem;
}

.left-control::before {
    content: "";
    width: 0.5rem;
    transition: width 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
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
