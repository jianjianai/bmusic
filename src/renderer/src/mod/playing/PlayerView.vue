<!-- 播放器主体 -->
<script lang="ts" setup>
import { musicPlayer, musicPlayerSize, topBarCustomButtons,musicPlayerButtomWidth, musicPlayerContrMaxDisplay } from '@renderer/mod/playing/playing';
import DownSvg from '@renderer/components/svg/Down.vue';
import MusicPlayers from '@renderer/mod/musicPlayers/MusicPlayers.vue';
import { ref, watch } from 'vue';

/** 过渡动画仅改变状态时开启 */
const transitOpen = ref(false);
watch(musicPlayerSize, () => {
    transitOpen.value = true;
})

</script>
<template>
    <div class="player" :class="[musicPlayerSize, { 'transit-open': transitOpen },musicPlayerContrMaxDisplay.type]" @transitionend="transitOpen = false" >
        <MusicPlayers></MusicPlayers>
        <!-- 缩小状态遮罩 -->
        <div class="player-min-mask" @click="() => { musicPlayerSize = 'max' }" v-if="musicPlayerSize === 'buttom'"
            title="放大"></div>
        <!-- TopBar -->
        <div class="top-bar" v-show="musicPlayerSize == 'max'">
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
    </div>
</template>
<style scoped>
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
    width: 100%;
    /* background-color: aqua; */
    -webkit-app-region: drag;
    padding-left: 1rem;
    padding-right: 8rem;
    gap: 1rem;
}

/* 缩小状态遮罩 */
/* .player-min-mask:hover {
    background-color: rgba(0, 0, 0, 0.036);
} */

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
.player.max.none{
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
    /* transition: width 0.25s ease-in-out, height 0.25s ease-in-out, bottom 0.5s cubic-bezier(1, -0.37, 0, 1.38); */
}

.player.buttom.transit-open {
    transition: width 0.25s ease-in-out, height 0.25s ease-in-out, bottom 0.5s cubic-bezier(1, -0.37, 0, 1.38);
}
</style>
