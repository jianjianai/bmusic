<script setup lang="ts">
import { ref } from 'vue';
import { musicPlayer } from '../playing';
import Volume0Svg from '@renderer/components/svg/Volume0.vue';
import Volume1Svg from '@renderer/components/svg/Volume1.vue';
import Volume2Svg from '@renderer/components/svg/Volume2.vue';
import Volume3Svg from '@renderer/components/svg/Volume3.vue';

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

</script>
<template>
    <div class="volume">
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

.volume {
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
</style>