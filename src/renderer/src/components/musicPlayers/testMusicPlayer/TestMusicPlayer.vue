<script setup lang="ts">
import { PlayerProps } from '../PlayerProps';
import { currentMusic } from '../../../states/musicPlayerStates'
import { onMounted, ref } from 'vue'

const props = defineProps<PlayerProps>();

props.musicController.setDuration(20000);
props.musicController.onRequestPlay(() => {
    props.musicController.setPlaying(true);
});
props.musicController.onRequestPause(() => {
    props.musicController.setPlaying(false);
});
props.musicController.onRequestCurrentTime((currentTime: number) => {
    props.musicController.setCurrentTime(currentTime);
});

function test(){
  currentMusic.value = {
    musicName: "测试音乐",
    musicAuthor: "测试作者",
    playerName: "BilibiliMusicPlayer",
    playerData: "test"
  }
}

const count = ref(3);

onMounted(async () => {
    console.log('TestMusicPlayer mounted');
    for (; count.value > 1; count.value--) {
        await new Promise((resolve) => {setTimeout(() => {resolve(0);}, 1000);});
    }
    test();
});

</script>
<template>
    <div>
        <button @click="test">{{ count }}</button>
    </div>
</template>
<style scoped>

</style>
