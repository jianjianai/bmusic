<script lang="ts" setup>
import MusicPlayerContr from './MusicPlayerContr.vue';
import MusicPlayers from './musicPlayers/MusicPlayers.vue'
import { musicPlayer, musicPlayerSize } from '../states/musicPlayerStates';
import DownSvg from './svg/Down.vue';
import PlayerButton from './allSmall/PlayerButton.vue';
import AddMusicCollectionSvg from './svg/AddMusicCollection.vue';



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

            </div>
        </div>
    </div>
</template>
<style scoped>
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
