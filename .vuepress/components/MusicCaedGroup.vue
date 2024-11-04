<script setup lang="ts">
import { Music } from '../findMain';
import MusicListCard from './MusicCard.vue';

const prop = defineProps<{ title: string, list: Music[] }>();

</script>
<template>
    <div>
        <div class="title">{{ prop.title }}</div>
        <div class="grrep">
            <MusicListCard class="card" v-for="item in prop.list" :key="item.musicName" :music="item"></MusicListCard>
        </div>
    </div>
</template>
<style scoped>

.title{
    font-size: 1.5rem;
    font-weight: bolder;
    margin: 1rem 0;
}

.card{
    min-width: 18rem;
    flex: 1;
    max-width: 24rem;
}
.grrep{
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}
</style>