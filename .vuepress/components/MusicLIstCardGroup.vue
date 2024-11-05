<script setup lang="ts">
import { MusicPlayListOnLoc } from '../findMain';
import MusicListCard from './MusicListCard.vue';

const prop = defineProps<{ title: string, list: MusicPlayListOnLoc[] }>();

</script>
<template>
    <div>
        <div class="title">{{ prop.title }}</div>
        <div class="grrep">
            <MusicListCard v-for="item in prop.list" :key="item.name" :musicList="item"></MusicListCard>
        </div>
    </div>
</template>
<style scoped>
.title {
    font-size: 1.5rem;
    font-weight: bolder;
    margin: 1rem 0;
}

.grrep {
    display: flex;
    gap: 0.5rem;
    flex-wrap: nowrap;
    justify-content: space-around;
    flex-direction: row;
    width: 100%;
    overflow-x: auto;
    scrollbar-width: none;
}
</style>