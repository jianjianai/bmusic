<script setup lang="ts">
import { musicPlayer, musicPlayerSize, musicPlayerTopBarDisplay, topBarCustomButtons } from './playing';
import DownSvg from '@renderer/components/svg/Down.vue';

</script>
<template>
    <Transition name="top-bar">
        <div class="top-bar transition" :class="musicPlayerTopBarDisplay.extraClass"
            v-if="musicPlayerSize == 'max' && musicPlayerTopBarDisplay.type !== 'none'">
            <!-- 缩小按钮 -->
            <div class="player-but top-bar-button" @click="musicPlayerSize = 'buttom'" title="缩小">
                <DownSvg class="player-but-icon"></DownSvg>
            </div>
            <!-- 其他自定义按钮 -->
            <div v-for="button of topBarCustomButtons" class="player-but top-bar-button"
                @click="button.onClick?.($event, musicPlayer.currentMusic!.playerData)" :title="button.title">
                <component :is="button.icon" class="player-but-icon" :style="button.style"></component>
            </div>
        </div>
        <!-- 隐藏了topbar但是还是要有一个站上面的位置，否则无法拖动 -->
        <div class="top-bar" v-else></div>
    </Transition>
</template>
<style scoped>
.top-bar-enter-active.transition,
.top-bar-leave-active.transition {
    transition: transform 0.25s;
}

.top-bar-enter-from.transition,
.top-bar-leave-to.transition {
    transform: translateY(-100%);
}

/* 按钮 */
.player-but:hover {
    background-color: var(--color-contr-top-btn-bgc-hover);
}

.player-but {
    position: relative;
    background-color: var(--color-contr-top-btn-bgc);
    border-radius: 0.5rem;
    width: 2rem;
    height: 2rem;
    border: 0.1rem solid var(--color-contr-top-btn-border);
    cursor: pointer;
}

/* 按钮里面的图标 */
.player-but-icon {
    position: absolute;
    color: var(--color-contr-top-btn-text);
    width: 60%;
    height: 60%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}

.top-bar-button {
    -webkit-app-region: no-drag;
}

.top-bar {
    position: absolute;
    display: flex;
    align-items: center;
    height: var(--top-bar-height);
    left: 0;
    top: 0;
    width: calc(100% - 9rem);
    /* background-color: aqua; */
    -webkit-app-region: drag;
    padding-left: 1rem;
    padding-right: 8rem;
    gap: 1rem;
}
</style>