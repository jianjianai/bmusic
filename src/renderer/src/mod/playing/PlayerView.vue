<!-- 播放器主体 -->
<script lang="ts" setup>
import { musicPlayerSize, musicPlayerButtomWidth, musicPlayerContrMaxDisplay } from '@renderer/mod/playing/playing';
import MusicPlayers from '@renderer/mod/musicPlayers/MusicPlayers.vue';
import { ref, watch } from 'vue';
import PlayerViewTopBar from './PlayerViewTopBar.vue';

/** 过渡动画仅改变状态时开启 */
const transitOpen = ref(false);
watch(musicPlayerSize, () => {
    transitOpen.value = true;
})

</script>
<template>
    <div class="player" :class="[musicPlayerSize, { 'transit-open': transitOpen }, musicPlayerContrMaxDisplay.type]"
        @transitionend="transitOpen = false">
        <MusicPlayers />
        <!-- 缩小状态遮罩 -->
        <div class="player-min-mask" @click="() => { musicPlayerSize = 'max' }" v-if="musicPlayerSize === 'buttom'"
            title="放大"></div>
        <!-- TopBar -->
        <PlayerViewTopBar v-if="musicPlayerSize == 'max'" />
    </div>
</template>
<style scoped>
.player-min-mask {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    cursor: pointer;
}

.player {
    position: fixed;
    left: 0;
    bottom: var(--button-player-height);
    width: 100vw;
    height: calc(100vh - var(--button-player-height));
    /* transition: width 0.25s ease-in-out, height 0.25s ease-in-out, bottom 0.5s cubic-bezier(0, 1.1, 0, 1.13); */
}

/* 播放控制器在 fixe 和 none 时直接全屏 */
.player.max.fixe,
.player.max.none {
    width: 100vw;
    bottom: 0;
    height: 100vh;
}

.player.transit-open {
    transition: width 0.25s ease-in-out, height 0.25s ease-in-out, bottom 0.5s cubic-bezier(0, 1.1, 0, 1.13);
}

.player.buttom {
    position: absolute;
    left: 0;
    bottom: 0;
    /* width: 9rem; */
    width: v-bind("musicPlayerButtomWidth");
    height: var(--button-player-height);
    z-index: 1;
    /* transition: width
            0.25s ease-in-out, height 0.25s ease-in-out, bottom 0.5s cubic-bezier(1, -0.37, 0, 1.38); */
}

.player.buttom.transit-open {
    transition: width 0.25s ease-in-out, height 0.25s ease-in-out, bottom 0.5s cubic-bezier(1, -0.37, 0, 1.38);
}
</style>
