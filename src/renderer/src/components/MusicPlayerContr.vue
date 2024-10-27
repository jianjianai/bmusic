<!-- 一个音乐播放控制组件，控制音乐播放暂停进度条，上一首下一首，播放模式，等.. -->
<script lang="ts" setup>
import { computed, ref } from 'vue'
import { musicPlayer } from '../states/musicPlayerStates'
import ControllerSVG from './svg/Controller.vue'
import PauseSVG from './svg/Pause.vue'
import PlaySVG from './svg/Play.vue'
import LoadingSvg from './svg/Loading.vue';
import RepeatAllSvg from './svg/RepeatAll.vue'
import RepeatOneSvg from './svg/RepeatOne.vue'
import SequentialPlaySvg from './svg/SequentialPlay.vue'
import ShufflePlaySvg from './svg/ShufflePlay.vue'
import { playList } from '@renderer/states/playListState'
import FavoriteButton from './allSmall/FavoriteButton.vue'

/**当前音乐播放到的百分比 0~1 之间的数字用于显示 仅当拖动进度条时用于预览显示 */
const dragCurrentPercentage = ref(0.2);
/** 真实播放进度百分比 */
const currentPercentage = computed(() => musicPlayer.currentTime / Math.max(1, musicPlayer.duration));
const lineCilckEl = ref();

/** 拖动进度条 */
const isMosueDown = ref(false);
/** 用于当前显示的进度条百分比 */
const shwoCurrentPercentage = computed(() => isMosueDown.value ? dragCurrentPercentage.value : currentPercentage.value);

/**
 * 计算出应该跳转到的时间并更新
 * */
function updateCurrentTime() {
    musicPlayer.requestCurrentTime(musicPlayer.duration * dragCurrentPercentage.value);
}

function updateCurrentPercentage(event: MouseEvent) {
    const rect = (lineCilckEl.value as HTMLElement).getBoundingClientRect();
    const x = event.clientX - rect.left;
    const width = rect.width;
    dragCurrentPercentage.value = Math.min(1, Math.max(0, x / width));
}
function mosueMove(event: MouseEvent) {
    updateCurrentPercentage(event);
}
function mosueUp(event: MouseEvent) {
    isMosueDown.value = false;
    window.removeEventListener('mousemove', mosueMove);
    window.removeEventListener('mouseup', mosueUp);
    updateCurrentPercentage(event);
    updateCurrentTime();
}
function mosueDown(event: MouseEvent) {
    isMosueDown.value = true;
    window.addEventListener('mousemove', mosueMove);
    window.addEventListener('mouseup', mosueUp);
    updateCurrentPercentage(event);
}


/** 将毫秒为时间的单位转换为 mm:ss 的形式 */
function formatTime(time: number) {
    const min = Math.floor(time / 60000);
    const sec = Math.floor(time / 1000) % 60;
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
}

</script>
<template>
    <div class="control-main">
        <div class="control-top">
            <!-- 添加到我喜欢的按钮 -->
            <FavoriteButton :music="musicPlayer.currentMusic" class="likeed-button" title="喜欢" />
            <!-- 上一曲 -->
            <div class="previous-btn" title="上一曲" @click="playList.prev()">
                <ControllerSVG class="previous-icon" />
            </div>
            <!-- 播放和暂停 -->
            <div class="playback-btn" v-if="musicPlayer.playing && musicPlayer.loading"
                @click="musicPlayer.requestPause()" title="加载中">
                <LoadingSvg class="btn playback-btn-Loading"></LoadingSvg>
            </div>
            <div class="playback-btn" v-else-if="musicPlayer.playing" @click="musicPlayer.requestPause()" title="播放暂停">
                <PauseSVG class="btn"></PauseSVG>
            </div>
            <div class="playback-btn" v-else @click="musicPlayer.requestPlay()" title="播放暂停">
                <PlaySVG class="btn"></PlaySVG>
            </div>
            <!-- 下一曲 -->
            <div class="controller-btn" title="下一曲" @click="playList.next()">
                <ControllerSVG class="controller-icon" />
            </div>
            <!-- 歌曲播放顺序设置按钮 -->
            <div v-if="playList.playMode == 'RepeatAll'" @click="playList.setPlayMode('RepeatOne')"
                class="play-mode-btn" title="列表循环">
                <RepeatAllSvg class="play-mode-icon"></RepeatAllSvg>
            </div>
            <div v-if="playList.playMode == 'RepeatOne'" @click="playList.setPlayMode('SequentialPlay')"
                class="play-mode-btn" title="单曲循环">
                <RepeatOneSvg class="play-mode-icon"></RepeatOneSvg>
            </div>
            <div v-if="playList.playMode == 'SequentialPlay'" @click="playList.setPlayMode('ShufflePlay')"
                class="play-mode-btn" title="顺序播放">
                <SequentialPlaySvg class="play-mode-icon"></SequentialPlaySvg>
            </div>
            <div v-if="playList.playMode == 'ShufflePlay'" @click="playList.setPlayMode('RepeatAll')"
                class="play-mode-btn" title="随机播放">
                <ShufflePlaySvg class="play-mode-icon"></ShufflePlaySvg>
            </div>
        </div>
        <!-- 进度条 -->
        <div class="control-line">
            <!-- 左边的时间 -->
            <div class="line-current">{{ formatTime(musicPlayer.currentTime) }}</div>
            <div class="line-cilck" :class="{ mosueuse: isMosueDown }" @mousedown="mosueDown" ref="lineCilckEl">
                <div class="line-box">
                    <!-- 完整进度条 -->
                    <div class="line-box-duration"></div>
                    <!-- 播放到的 -->
                    <div class="line-box-current"></div>
                    <!-- 中间的按钮 -->
                    <div class="line-box-button"></div>
                </div>
            </div>
            <!-- 右边的时间 -->
            <div class="line-duration">{{ formatTime(musicPlayer.duration) }}</div>
        </div>
    </div>
</template>
<style scoped>
.play-mode-btn {
    width: 1.5rem;
    height: 1.5rem;
    cursor: pointer;
}

.play-mode-icon {
    width: 100%;
    height: 100%;
}

.like-button {
    color: var(--color-contr-like-btn);
}

.likeed-button {
    color: var(--color-contr-likeed-btn);
}

.like-button,
.likeed-button {
    width: 1.5rem;
    height: 1.5rem;
    cursor: pointer;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.playback-btn-Loading {
    animation: spin 1s linear infinite;
}

.previous-btn {
    transform: rotate(180deg);
}

.previous-btn:hover,
.controller-btn:hover {
    color: var(--color-contr-prev-next-btn-hover);
}

.previous-icon,
.controller-icon,
.like-icon,
.likeed-icon {
    width: 100%;
    height: 100%;
}

.previous-btn,
.controller-btn {
    width: 1.8rem;
    height: 1.8rem;
    color: var(--color-contr-prev-next-btn);
    cursor: pointer;
}

.playback-btn .btn {
    width: 1.8rem;
    height: 1.8rem;
    color: var(--color-contr-play-btn-text);
}

.playback-btn:hover {
    transform: scale(1.05);
    background-color: var(--color-contr-play-btn-hover);
}

.playback-btn {
    width: 2.6rem;
    height: 2.6rem;
    background-color: var(--color-contr-play-btn);
    border-radius: 2.6rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.line-current,
.line-duration {
    font-size: 0.6rem;
    color: var(--color-contr-line-text);
}

.line-cilck:hover .line-box-button,
.line-cilck.mosueuse .line-box-button {
    opacity: 1;
}

.line-box-button {
    opacity: 0;
    position: absolute;
    left: v-bind("`${shwoCurrentPercentage * 100}%`");
    top: 50%;
    transform: translate(-50%, -50%);
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 0.8rem;
    background-color: var(--color-contr-line-btn-bg);
    box-shadow: 0rem 0.1rem 0.3rem var(--color-contr-line-btn-shadow)
}

.line-box-current {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: v-bind("`${shwoCurrentPercentage * 100}%`");
    background-color: var(--color-contr-line-current-bg);
    border-radius: 1rem;
}

.line-box-duration {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    background-color: var(--color-contr-line-bg);
    border-radius: 1rem;
}

.line-box {
    width: 20rem;
    height: 0.25rem;
    position: relative;
}

.line-cilck {
    height: 0.5rem;
    margin: 0 0.5rem;
    display: flex;
    align-items: center;
    cursor: pointer;
}

.control-line {
    display: flex;
    align-items: center;
}

.control-top {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 1rem;
}

.control-main {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    user-select: none;
}
</style>
