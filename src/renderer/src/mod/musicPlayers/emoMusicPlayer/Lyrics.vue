<script setup lang="ts">
import { type parseYrc } from '@lrc-player/parse';
import { onMounted, ref } from 'vue';


const props = defineProps<{
    lyrics: ReturnType<typeof parseYrc>
}>();

const activeIndex = ref(0);

const findActiveIndex = (currentTime) => {
    return props.lyrics?.findIndex(line => currentTime >= line.time);
};

onMounted(() => {
  window.addEventListener('timeupdate', (event) => {
    activeIndex.value = findActiveIndex((event as any).detail);
  });
});


</script>


<template>
    <div class="lyrics-container">
        <div v-for="(line, index) in lyrics" :key="index" :class="{ active: index === activeIndex }">
            {{ line.text }}  
        </div>
    </div>
</template>

<style scoped>
.lyrics-container .active {
  color: red;
}
</style>