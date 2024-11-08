<!-- 进度条组件 -->
<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps<{
    /** 当前音乐播放到的时间 */
    currentTime: number,
    /** 音乐总时长 */
    duration: number,
    /** 请求更新当前时间 */
    requestCurrentTime: (time: number) => void,
}>();

/**当前音乐播放到的百分比 0~1 之间的数字用于显示 仅当拖动进度条时用于预览显示 */
const dragCurrentPercentage = ref(0.2);
/** 真实播放进度百分比 */
const currentPercentage = computed(() => props.currentTime / Math.max(1, props.duration));
const lineCilckEl = ref();
/** 拖动进度条 */
const isMosueDown = ref(false);
/** 用于当前显示的进度条百分比 */
const shwoCurrentPercentage = computed(() => isMosueDown.value ? dragCurrentPercentage.value : currentPercentage.value);

/**
 * 计算出应该跳转到的时间并更新
 * */
function updateCurrentTime() {
    props.requestCurrentTime(props.duration * dragCurrentPercentage.value);
}

function mosueDown(event: MouseEvent) {
    isMosueDown.value = true;
    function updateCurrentPercentage(event1: MouseEvent) {
        const rect = (lineCilckEl.value as HTMLElement).getBoundingClientRect();
        const x = event1.clientX - rect.left;
        const width = rect.width;
        dragCurrentPercentage.value = Math.min(1, Math.max(0, x / width));
    }
    function mosueMove(event1: MouseEvent) {
        updateCurrentPercentage(event1);
    }
    function mosueUp(event1: MouseEvent) {
        isMosueDown.value = false;
        window.removeEventListener('mousemove', mosueMove);
        window.removeEventListener('mouseup', mosueUp);
        updateCurrentPercentage(event1);
        updateCurrentTime();
    }
    window.addEventListener('mousemove', mosueMove);
    window.addEventListener('mouseup', mosueUp);
    updateCurrentPercentage(event);
}

</script>
<template>
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
</template>
<style scoped>
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

.line-cilck {
    height: 0.5rem;
    /* margin: 0 0.5rem; */
    display: flex;
    align-items: center;
    cursor: pointer;
}

.line-box {
    width: 100%;
    height: 0.25rem;
    position: relative;
}
</style>