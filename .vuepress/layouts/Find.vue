<script setup lang="ts">
import { reactive } from 'vue';
import MusicListCard from '../components/MusicCard.vue';
import MusicCaedGroup from '../components/MusicCaedGroup.vue';
import { Music } from '../type';

const music = reactive<Music>({
        /** 图标 */
        iconUrl: 'file:///C:/Users/28018/Pictures/20181127140215_hvhdh.jpg',
        /** 音乐名 */
        musicName: "测试音乐adsasdasdasdasdasdasdasdas",
        /** 音乐作者 */
        musicAuthor: "测试作者asdasdasdasdasdasdasdasdsa",
        /** 播放器 */
        playerName: "Bilibili",
        /** 数据 */
        playerData: "测试数据",
    });

</script>
<template>
    <MusicListCard :music="music"></MusicListCard>
    <MusicCaedGroup title="测试标题" :list="[music,music,music,music,music,music,music,music,music]"></MusicCaedGroup>
</template>
<style scoped>

</style>