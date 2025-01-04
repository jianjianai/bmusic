<script setup lang="ts">
import { musicPlayerContrMaxDisplay, musicPlayerSize } from './playing';
import ContrBetween from './unit/ContrBetween.vue';
import ContrLeft from './unit/ContrLeft.vue';
import ControlLine from './unit/ControlLine.vue';
import ContrRight from './unit/ContrRight.vue';

</script>
<template>
    <div class="player-bottom-control" :class="[musicPlayerSize, musicPlayerContrMaxDisplay.type]">
        <!-- 左边 -->
        <ContrLeft class="left-control player-control-grep"
            :hideMusicName="musicPlayerSize == 'max' && !musicPlayerContrMaxDisplay.isShwoNusicName" />
        <!-- 中间播放控制器 -->
        <ContrBetween class="player-control-grep"
            :hideControlLine="musicPlayerSize == 'max' && musicPlayerContrMaxDisplay.progressShow != 'center'" />
        <!-- 右边 -->
        <ContrRight class="right-control player-control-grep" :showTime="musicPlayerSize == 'max' && musicPlayerContrMaxDisplay.progressShow == 'top'" />
        <!-- 显示在上面的进度条 -->
        <Transition name="top-control-line">
            <ControlLine class="top-control-line"
                v-if="musicPlayerSize == 'max' && musicPlayerContrMaxDisplay.progressShow == 'top'" />
        </Transition>
    </div>
</template>
<style scoped>
.top-control-line {
    width: 100%;
    position: absolute;
    top: -0.1rem;
    height: 0.2rem;
    z-index: 1;
}

.top-control-line-enter-active,
.top-control-line-leave-active {
    transform-origin: left;
    transition: transform 0.25s;
}

.top-control-line-enter-from,
.top-control-line-leave-to {
    transform: scaleX(0);
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
    position: relative;
    height: calc(var(--button-player-height) - 1rem - 0.1rem);
    border-top: 0.1rem solid var(--color-music-player-border);
    padding: 0.5rem 0;
    display: flex;
    justify-content: space-between;
    background-color: var(--color-music-player-bg);
    z-index: 0;
}

.player-bottom-control.max.fixe {
    border-top: unset;
    position: fixed;
    bottom: 0;
    width: 100vw;
    background-color: var(--color-music-player-bg-fixe);
    z-index: 2;
}
</style>