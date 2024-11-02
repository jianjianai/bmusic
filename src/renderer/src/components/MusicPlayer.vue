<script lang="ts" setup>
import MusicPlayerContr from './MusicPlayerContr.vue';
import { musicPlayer, musicPlayerSize, playerLeftCustomButtons, playerRightCustomButtons } from '../states/musicPlayerStates';
import AddMusicCollectionSvg from '@renderer/svg/AddMusicCollection.vue';
import Volume0Svg from '@renderer/svg/Volume0.vue';
import Volume1Svg from '@renderer/svg/Volume1.vue';
import Volume2Svg from '@renderer/svg/Volume2.vue';
import Volume3Svg from '@renderer/svg/Volume3.vue';
import { ref } from 'vue';
import PlayListLineSvg from '@renderer/svg/PlayListLine.vue';
import { playListOpen } from '@renderer/states/playListState';
import { addToPlayList } from '@renderer/states/addToPlayList/addToPlayList';
import MusicPlayerView from './MusicPlayerView.vue';

// 音量拖动条
const lineCilckEl = ref();
function updateVolumeLevel(event: MouseEvent) {
    const rect = (lineCilckEl.value as HTMLElement).getBoundingClientRect();
    const y = event.clientY - rect.top;
    const height = rect.height;
    musicPlayer.requestVolume(Math.min(1, Math.max(0, 1 - y / height)));
}
function mosueMove(event: MouseEvent) {
    updateVolumeLevel(event);
}
function mosueUp(event: MouseEvent) {
    window.removeEventListener('mousemove', mosueMove);
    window.removeEventListener('mouseup', mosueUp);
    updateVolumeLevel(event);
}
function mosueDown(event: MouseEvent) {
    window.addEventListener('mousemove', mosueMove);
    window.addEventListener('mouseup', mosueUp);
    updateVolumeLevel(event);
}
// 关闭开启声音
const lastVolume = ref(1);
function clickVolume() {
    if (musicPlayer.volume > 0) {
        lastVolume.value = musicPlayer.volume;
        musicPlayer.requestVolume(0);
    } else {
        musicPlayer.requestVolume(lastVolume.value);
    }
}

</script>
<template>
    <div class="music-player" :class="musicPlayerSize">
        <!-- 播放器主体 -->
        <MusicPlayerView></MusicPlayerView>
        <!-- 下方控制栏 -->
        <div class="player-bottom-control">
            <!-- 左边 -->
            <div class="left-control player-control-grep">
                <div class="player-music-info">
                    <div class="music-info"
                        :title="(musicPlayer.currentMusic!.musicName || '未知') + ' - ' + (musicPlayer.currentMusic!.musicAuthor || '未知歌手')">
                        <span class="music-name">{{ musicPlayer.currentMusic!.musicName || "未知" }}</span>
                        <span class="music-line"> - </span>
                        <span class="music-singer">{{ musicPlayer.currentMusic!.musicAuthor || "未知歌手" }}</span>
                    </div>
                    <div class="user-button-greap">
                        <!-- 收藏到歌单 -->
                        <div class="user-button" title="收藏到歌单" @click="addToPlayList(musicPlayer.currentMusic!)">
                            <AddMusicCollectionSvg style="width: 100%; height: 100%;" />
                        </div>
                        <!-- 左下角按钮自定义按钮 -->
                        <div class="user-button" v-for="button of playerLeftCustomButtons" :title="button.title"
                            @click="button.onClick?.($event, musicPlayer.currentMusic!.playerData)">
                            <component :is="button.icon" style="width: 100%; height: 100%;"
                                :style="['width: 100%; height: 100%;', button.style]" />
                        </div>
                    </div>
                </div>
            </div>
            <!-- 中间播放控制器 -->
            <MusicPlayerContr class="player-control-grep"></MusicPlayerContr>
            <!-- 右边 -->
            <div class="right-control player-control-grep">
                <!-- 播放列表 -->
                <div class="right-button" @click="playListOpen = !playListOpen" title="播放列表">
                    <PlayListLineSvg style="width: 100%;height: 100%;" />
                </div>
                <!-- 音量按钮 -->
                <div class="right-button volume">
                    <!-- 放到后面防止鼠标移动出去一点点就消失 -->
                    <div class="volume-bc"></div>
                    <!-- 图标 -->
                    <div class="volume-icon-box" @click="clickVolume" title="音量">
                        <Volume3Svg class="volume-icon" v-if="musicPlayer.volume > 0.8"></volume3Svg>
                        <Volume2Svg class="volume-icon" v-else-if="musicPlayer.volume > 0.4"></volume2Svg>
                        <Volume1Svg class="volume-icon" v-else-if="musicPlayer.volume > 0"></volume1Svg>
                        <Volume0Svg class="volume-icon" v-else></volume0Svg>
                    </div>
                    <!-- 音量拖动条 -->
                    <div class="volume-line-box" @mousedown="mosueDown">
                        <!-- 音量显示 -->
                        <div class="volume-num">{{ Math.floor(musicPlayer.volume * 100) }}</div>
                        <!-- 拖动条 -->
                        <div class="volume-line" ref="lineCilckEl">
                            <!-- 完整条 -->
                            <div class="volume-line-all"></div>
                            <!-- 填充条 -->
                            <div class="volume-line-full"></div>
                            <!-- 拖动按钮 -->
                            <div class="volume-line-drag-button"></div>
                        </div>
                    </div>
                </div>
                <!-- 右下角自定义按钮 -->
                <div class="right-button" v-for="button of playerRightCustomButtons"
                    @click="button.onClick?.($event, musicPlayer.currentMusic!.playerData)" :title="button.title">
                    <component :is="button.icon" :style="['width: 100%; height: 100%;', button.style]" />
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.volume-line-drag-button {
    width: 0.6rem;
    height: 0.6rem;
    background-color: var(--color-music-player-volume-line-drag-button);
    border-radius: 50%;
    position: absolute;
    left: 50%;
    transform: translate(-50%, 50%);
    box-shadow: 0 0 0.1rem 0.1rem var(--color-music-player-volume-line-drag-button-shadow);
    bottom: v-bind("`${musicPlayer.volume * 100}%`");
}

.volume-line-all {
    background-color: var(--color-music-player-volume-line-all);
    height: 100%;
}

.volume-line-full {
    background-color: var(--color-music-player-volume-line-full);
    height: v-bind("`${musicPlayer.volume * 100}%`");
}

.volume-line-all,
.volume-line-full {
    left: 50%;
    transform: translateX(-50%);
    bottom: 0;
    width: 0.3rem;
    position: absolute;
    border-radius: 1rem;
}

.volume-line {
    flex: 1;
    height: 0rem;
    position: relative;
    margin-bottom: 0.5rem;
}

.volume-num {
    color: var(--color-music-player-volume-num);
    font-size: 0.7rem;
    margin: 0.5rem 0;
}

.volume-bc {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 4rem;
    height: 11rem;
    display: none;
}

.volume:hover .volume-bc {
    display: block;
}

.volume:hover .volume-line-box {
    display: flex;
}

.volume-line-box {
    left: 50%;
    transform: translateX(-50%);
    top: -8.5rem;
    position: absolute;
    height: 8rem;
    width: 2rem;
    background-color: var(--color-music-player-volume-line-box);
    box-shadow: 0 0 0.5rem 0.1rem var(--color-music-player-volume-line-box-shadow);
    border-radius: 0.5rem;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    display: none;
}

.right-button.volume {
    position: relative;
    cursor: default;
    user-select: none;
}

.volume-icon-box {
    width: 100%;
    height: 100%;
    cursor: pointer;
    position: relative;
}

.volume-icon {
    width: 100%;
    height: 100%;
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

.user-button {
    width: 1.2rem;
    height: 1.2rem;
    color: var(--color-music-player-user-button);
    cursor: pointer;
}

.user-button:hover {
    color: var(--color-music-player-user-button-hover);
}

.user-button-greap {
    height: 1.2rem;
    display: flex;
    gap: 0.8rem;
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
    /* font-weight: bolder; */
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
    padding-left: 0.8rem;
    flex: 1;
    width: 0;
}

.music-player.buttom .left-control::before {
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

.player-control-grep {
    height: 100%;
}

.player-bottom-control {
    height: calc(var(--button-player-height) - 1rem);
    border-top: 0.1rem solid var(--color-music-player-border);
    padding: 0.5rem 0;
    display: flex;
    justify-content: space-between;
}

.music-player {
    background-color: var(--color-music-player-bg);
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    height: var(--button-player-height);
    flex-direction: column;
}
</style>
