<script setup lang="ts">
import { PlayerProps } from '../PlayerProps';
import { currentMusic } from '../../../states/musicPlayerStates'
import { onMounted } from 'vue'

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
    playerName: "TestMusicPlayer1",
    playerData: "ertert"+Math.random()
  }
}

onMounted(() => {
    console.log('TestMusicPlayer mounted');
});

</script>
<template>
    <div>
        <button @click="test">test</button>
    </div>
</template>
<style scoped>

</style>
