<script setup lang="ts">
import { musicPlayer,musicPlayerLink } from '../../../states/musicPlayerStates'
import { onMounted, ref } from 'vue';

musicPlayerLink.updateDuration(20000);
musicPlayerLink.onRequestPlay(() => {
    musicPlayerLink.updatePlaying(true);
});
musicPlayerLink.onRequestPause(() => {
    musicPlayerLink.updatePlaying(false);
});
musicPlayerLink.onRequestCurrentTime((currentTime: number) => {
    musicPlayerLink.updateCurrentTime(currentTime);
});

function test() {
    musicPlayer.setCurrentMusic({
        musicName: "测试音乐",
        musicAuthor: "测试作者",
        playerName: "BilibiliMusicPlayer",
        playerData: `{"bvId":"BV19G411H7DY"}`
    });
}

const count = ref(3);

onMounted(async () => {
    console.log('TestMusicPlayer mounted');
    for (; count.value > 1; count.value--) {
        await new Promise((resolve) => { setTimeout(() => { resolve(0); }, 1000); });
    }
    test();
});

</script>
<template>
    <div>
        <button @click="test">{{ count }}</button>
    </div>
</template>
<style scoped></style>
