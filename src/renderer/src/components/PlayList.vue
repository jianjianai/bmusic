<script lang="ts" setup>
import { playListOpen } from '@renderer/states/playListState';

</script>
<template>
    <div>
        <div class="play-list-bc" v-show="playListOpen" @click="playListOpen=false"></div>
        <div class="play-list-box" :class="{ open: playListOpen }">

        </div>
    </div>
</template>
<style scoped>
.play-list-bc{
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
}

.play-list-box.open {
    right: 0;
}

.play-list-box {
    position: fixed;
    right: -30rem;
    top: 2rem;
    width: 25rem;
    height: calc(100vh - 8rem);
    background-color: var(--color-play-list-window-bg);
    border-radius: 1rem 0 0 1rem;
    box-shadow: 0 0 1rem var(--color-play-list-window-shadow);
    transition: right 0.2s;
}
</style>