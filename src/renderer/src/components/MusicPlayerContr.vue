<!-- 一个音乐播放控制组件，控制音乐播放暂停进度条，上一首下一首，播放模式，等.. -->
<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { MusicPlayerState } from '../states/MusicPlayerState';
import ControllerSVG from './svg/Controller.vue';
import PauseSVG from './svg/Pause.vue';
import PlaySVG from './svg/Play.vue';

/**当前音乐播放到的百分比 0~1 之间的数字用于显示 */
const currentPercentage = ref(0.2);
const lineCilckEl = ref();

/** 拖动进度条 */
const isMosueDown = ref(false);
function updateCurrentPercentage(event: MouseEvent){
    const rect = (lineCilckEl.value as HTMLElement).getBoundingClientRect();
    const x = event.clientX - rect.left;
    const width = rect.width;
    currentPercentage.value = Math.min(1, Math.max(0, x / width));
}
function mosueDown(event: MouseEvent) {
    isMosueDown.value = true;
    updateCurrentPercentage(event);
}
function mosueMove(event: MouseEvent) {
    if (!isMosueDown.value) return;
    updateCurrentPercentage(event);
}
function mosueUp(event: MouseEvent) {
    if (!isMosueDown.value) return;
    isMosueDown.value = false;
    updateCurrentPercentage(event);
}

onMounted(() => {
    window.addEventListener('mousemove', mosueMove);
    window.addEventListener('mouseup', mosueUp);
});
onUnmounted(() => {
    window.removeEventListener('mousemove', mosueMove);
    window.removeEventListener('mouseup', mosueUp);
});


</script>
<template>
    <div class="control-main">
        <div class="control-top">
            <ControllerSVG class="previous-btn"></ControllerSVG>
            <div class="playback-btn">
                <!-- <PauseSVG class="btn"></PauseSVG> -->
                <PlaySVG class="btn"></PlaySVG>
            </div>
            <ControllerSVG class="controller-btn"></ControllerSVG>
        </div>
        <div class="control-line">
            <!-- 进度条 -->
            <div class="line-current">{{ MusicPlayerState.currentTime }}</div>
            <div class="line-cilck" :class="{mosueuse:isMosueDown}" @mousedown="mosueDown" ref="lineCilckEl">
                <div class="line-box">
                    <!-- 完整进度条 -->
                    <div class="line-box-duration"></div>
                    <!-- 播放到的 -->
                    <div class="line-box-current"></div>
                    <!-- 中间的按钮 -->
                    <div class="line-box-button"></div>
                </div>
            </div>
            <div class="line-duration">{{ MusicPlayerState.duration }}</div>
        </div>
    </div>
</template>
<style scoped>
.previous-btn {
    transform: rotate(180deg);
}

.previous-btn:hover,
.controller-btn:hover {
    color: var(--color-contr-prev-next-btn-hover);
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

.playback-btn:hover{
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
.line-cilck.mosueuse  .line-box-button{
    opacity: 1;
}

.line-box-button {
    opacity: 0;
    position: absolute;
    left: v-bind("`${currentPercentage*100}%`");
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
    width: v-bind("`${currentPercentage*100}%`");
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
.line-cilck{
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