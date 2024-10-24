<script lang="ts" setup>
import { playListOpen } from '@renderer/states/playListState';

</script>
<template>
    <div class="play-list" :class="{open:playListOpen}">

    </div>
</template>
<style scoped>
.play-list.open{
    right: 0;
}
.play-list{
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