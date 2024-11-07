<script setup lang="ts">
import { ref } from 'vue';
import { search, lyric, cloudsearch } from './emoApi'
import { Music } from '@renderer/states/musicPlayerStates';
import { paresEmoMusicDataToString } from './emoMusic';
import MusicList from '@renderer/components/allSmall/MusicList.vue';

const props = defineProps<{
    keyword: string
}>();

const searchResult = ref<Music[]>([]);
cloudsearch({ keywords: props.keyword, limit: 40 }).then((res) => {
    let musicList: Music[] = [];
    let songs = res.body.result.songs;
    for (let i = 0; i < songs.length; i++) {
        musicList.push({
            iconUrl: songs[i].al.picUrl,
            musicName: songs[i].name,
            musicAuthor: songs[i].ar[0].name,
            playerName: "EmoMusic",
            playerData: paresEmoMusicDataToString({id:songs[i].id}),
        });
    }
    searchResult.value = musicList;
});
</script>
<template>
    <div>
        <MusicList :list="searchResult"></MusicList>
    </div>
</template>
<style scoped></style>