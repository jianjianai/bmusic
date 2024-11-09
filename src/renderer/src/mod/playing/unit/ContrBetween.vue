<!-- 一个音乐播放控制组件，控制音乐播放暂停进度条，上一首下一首，播放模式，等.. -->
<script lang="ts" setup>
import { musicPlayer } from '../playing'
import ControllerSVG from '@renderer/components/svg/Controller.vue'
import PauseSVG from '@renderer/components/svg/Pause.vue'
import PlaySVG from '@renderer/components/svg/Play.vue'
import LoadingSvg from '@renderer/components/svg/Loading.vue';
import RepeatAllSvg from '@renderer/components/svg/RepeatAll.vue'
import RepeatOneSvg from '@renderer/components/svg/RepeatOne.vue'
import SequentialPlaySvg from '@renderer/components/svg/SequentialPlay.vue'
import ShufflePlaySvg from '@renderer/components/svg/ShufflePlay.vue'
import { playList } from '@renderer/mod/playingList/playingList'
import FavoriteButton from '@renderer/components/FavoriteButton.vue';
import ControlLine from './ControlLine.vue';

const props = defineProps<{
    /** 隐藏进度条 */
    hideControlLine?: boolean,
}>();

/** 将毫秒为时间的单位转换为 mm:ss 的形式 */
function formatTime(time: number) {
    const min = Math.floor(time / 60000);
    const sec = Math.floor(time / 1000) % 60;
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
}

</script>
<template>
    <div class="control-main" :class="{ 'hide-control-line': props.hideControlLine }">
        <!-- 控制按钮 -->
        <div class="control-top">
            <!-- 添加到我喜欢的按钮 -->
            <FavoriteButton :music="musicPlayer.currentMusic!" class="likeed-button" title="喜欢" />
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
        <Transition name="control-line">
            <div class="control-line" v-if="!props.hideControlLine">
                <!-- 左边的时间 -->
                <div class="line-current">{{ formatTime(musicPlayer.currentTime) }}</div>
                <ControlLine class="line-inner"></ControlLine>
                <!-- 右边的时间 -->
                <div class="line-duration">{{ formatTime(musicPlayer.duration) }}</div>
            </div>
        </Transition>
    </div>
</template>
<style scoped>
.line-inner {
    margin: 0 0.5rem;
    width: 20rem;
    height: 0.25rem;
}

.play-mode-btn {
    width: 1.5rem;
    height: 1.5rem;
    cursor: pointer;
    color: var(--color-contr-play-mode-btn);
}

.play-mode-btn:hover {
    color: var(--color-contr-play-mode-btn-hover);
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

.control-line {
    display: flex;
    align-items: center;
    margin-top: 3rem;
    height: 1rem;
}

.control-line-enter-active,
.control-line-leave-active {
    transition: all 0.25s;
}

.control-line-enter-from,
.control-line-leave-to {
    opacity: 0;
    transform: translateY(100%);
}

.control-top {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    position: absolute;
    width: 15rem;
    height: 3rem;
    left: calc(50% - 7.5rem);
    top: calc(50% - 1.5rem - 0.5rem);
    transition: top 0.25s;
}

.control-main.hide-control-line .control-top {
    top: calc(50% - 1.5rem);
}

.control-main {
    position: relative;
    user-select: none;
    display: flex;
    align-items: center;
}
</style>
