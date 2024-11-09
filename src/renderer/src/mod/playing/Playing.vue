<script lang="ts" setup>
import MusicPlayerView from './PlayerView.vue';
import PlayingControl from './PlayingControl.vue';

</script>
<template>
    <div class="music-player">
        <!-- 播放器主体 -->
        <MusicPlayerView></MusicPlayerView>
        <!-- 下方控制栏 -->
        <PlayingControl></PlayingControl>
    </div>
</template>
<style scoped></style>
