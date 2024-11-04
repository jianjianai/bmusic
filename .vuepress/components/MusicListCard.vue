<script setup lang="ts">
import { MusicPlayListOnLoc, openMusicList } from '../findMain';
import ImgDiv from './ImgDiv.vue';

const props = defineProps<{ musicList: MusicPlayListOnLoc }>();


</script>
<template>
    <div class="music-list-card-box" @click="openMusicList(props.musicList)">
        <ImgDiv class="card-img" :src="props.musicList.iconUrl"></ImgDiv>
        <div class="card-con">
            <ImgDiv class="card-con-bg" :src="props.musicList.iconUrl"></ImgDiv>
            <div class="card-in">
                <div class="card-name">{{ props.musicList.name }}</div>
                <div class="music-name" v-for="music,index of props.musicList.list.slice(0, 5)" >{{ index+1 }}.{{ music.musicName }}</div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.music-name{
    font-size: 0.8rem;
    color: rgb(255, 255, 255);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 0.1rem;
}
.card-name{
    font-size: 1rem;
    color: rgb(255, 255, 255);
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 0.5rem;
    font-weight: bolder;
}

.card-in{
    margin: 0.5rem 0.5rem;
}

.card-con-bg {
    position: absolute;
    left: -50%;
    top: -50%;
    width: 200%;
    height: 200%;
    filter: blur(5rem);
    z-index: -1;
}

.card-con {
    position: absolute;
    left: 0;
    top: 9rem;
    width: 9rem;
    height: 9rem;
    overflow: hidden;
    transition: top 0.3s;
    background-color: rgb(153, 153, 153);
    z-index: -1;
}
.music-list-card-box:hover .card-con {
    top: 3rem;
}

.card-img {
    position: absolute;
    left: 0;
    top: 0;
    width: 9rem;
    height: 9rem;
    z-index: -1;
}

.music-list-card-box {
    position: relative;
    width: 9rem;
    height: 11.5rem;
    border-radius: 0.5rem;
    overflow: hidden;
    cursor: pointer;
}
</style>