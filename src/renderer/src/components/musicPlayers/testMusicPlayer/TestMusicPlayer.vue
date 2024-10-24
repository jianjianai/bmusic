<script setup lang="ts">
import { musicPlayerLink } from '../../../states/musicPlayerStates'
import { ref } from 'vue';
import { musicPlayer } from '@renderer/states/musicPlayerStates'
import { playList } from '@renderer/states/playListState';


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

const count = ref(0);

// 测试播放一首
function testPayOne() {
    musicPlayer.setCurrentMusic({
        musicName: "测试音乐",
        musicAuthor: "测试作者",
        playerName: "BilibiliMusicPlayer",
        playerData: `{"bvId":"BV19G411H7DY"}`
    });
}

// 测试播放列表
function testPayList() {
    // 设置播放列表
    playList.setList([
        {
            musicName: "bilibili测试音乐1",
            musicAuthor: "测试作者",
            playerName: "BilibiliMusicPlayer",
            playerData: `{"bvId":"BV19G411H7DY"}`
        },
        {
            musicName: "bilibili测试音乐2",
            musicAuthor: "测试作者",
            playerName: "BilibiliMusicPlayer",
            playerData: `{"bvId":"BV1eU4y1X7uA"}`
        }
    ]);
    playList.setCurrentIndex(0); // 设置当前播放的音乐索引
}


</script>
<template>
    <div>
        <button @click="count++">{{ count }}</button>
        <button @click="testPayOne">播放一首</button>
        <button @click="testPayList">播放列表</button>
    </div>
</template>
<style scoped></style>
