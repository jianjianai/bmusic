<script setup lang="ts">
import { ref } from 'vue';
import { musicPlayer } from '@renderer/mod/playing/playing'
import { playList } from '@renderer/mod/playingList/playingList';
import { type MusicPlayerLink } from '../musicPlayers';

const props = defineProps<{
    musicPlayerLink: MusicPlayerLink,
}>();
const musicPlayerLink = props.musicPlayerLink;

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
musicPlayerLink.onRequestVolume((volume: number) => {
    musicPlayerLink.updateVolume(volume);
});

const count = ref(0);

// 测试播放一首
function testPayOne() {
    musicPlayer.setCurrentMusic({
        musicName: "测试音乐",
        musicAuthor: "测试作者",
        playerName: "Bilibili",
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
            playerName: "Bilibili",
            playerData: `{"bvId":"BV19G411H7DY"}`,
            iconUrl: "file:///C:/Users/28018/Pictures/20181127140215_hvhdh.jpg"
        },
        {
            musicName: "bilibili测试音乐2",
            musicAuthor: "测试作者",
            playerName: "Bilibili",
            playerData: `{"bvId":"BV1eU4y1X7uA"}`,
            iconUrl: "file:///C:/Users/28018/Pictures/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20240317073626.jpg"
        },
        {
            musicName: "Test",
            musicAuthor: "测试作者",
            playerName: "Test",
            playerData: ``,
            iconUrl: "file:///C:/Users/28018/Pictures/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20240317073626.jpg"
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
