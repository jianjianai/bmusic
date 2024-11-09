<script lang="ts" setup>
import MusicPlayerView from './PlayerView.vue';
import { musicPlayerContrMaxDisplay, musicPlayerSize } from './playing';
import PlayingControl from './PlayingControl.vue';

</script>
<template>
    <div class="music-player">
        <!-- 播放器主体 -->
        <MusicPlayerView />
        <!-- 下方控制栏 -->
        <Transition name="control">
            <PlayingControl v-if="musicPlayerContrMaxDisplay.type != 'none' || musicPlayerSize != 'max'" />
        </Transition>
    </div>
</template>
<style scoped>
.control-enter-active,
.control-leave-active {
    transition: transform 0.1s;
}

.control-enter-from,
.control-leave-to {
    transform: translateY(100%);
}
</style>
