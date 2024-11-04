<script setup lang="ts">
import { reactive } from 'vue';
import ImgDiv from './ImgDiv.vue';
import PlayerInfoTag from './PlayerInfoTag.vue';
import { Music } from '../type';
import PlaySvg from './svg/Play.vue';

// const props = defineProps<{music:Music}>();

const props = reactive<{ music: Music }>({
    music: {
        /** 图标 */
        iconUrl: 'file:///C:/Users/Administrator/Pictures/2e0e47571d612323fdd1991a01d5e4fefa4dd8ad.webp@96w_96h_1c_1s_!web-avatar.avif',
        /** 音乐名 */
        musicName: "测试音乐adsasdasdasdasdasdasdasdas",
        /** 音乐作者 */
        musicAuthor: "测试作者asdasdasdasdasdasdasdasdsa",
        /** 播放器 */
        playerName: "Bilibili",
        /** 数据 */
        playerData: "测试数据",
    }
});

</script>
<template>
    <div class="music-list-card-box">
        <ImgDiv class="card-img" :src="props.music.iconUrl">
            <div class="card-img-misk">
                <PlaySvg class="card-img-misk-icon"></PlaySvg>
            </div>
        </ImgDiv>
        <div class="music-list-card">
            <div class="card-name">{{ props.music.musicName }}</div>
            <div class="card-down-line">
                <PlayerInfoTag :playerName="props.music.playerName" />
                <div class="card-author">{{ props.music.musicAuthor }}</div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.card-img-misk-icon{
    width: 50%;
    height: 50%;
    position: absolute;
    top: 25%;
    left: 25%;
    color: white;
}

.card-img:hover .card-img-misk-icon{
    transform: scale(1.1);
}

.card-img-misk{
    background-color: rgba(0, 0, 0, 0.5);
    width: 100%;
    height: 100%;
    position: absolute;
    border-radius: 1rem;
    display: none;
}

.music-list-card-box:hover .card-img-misk{
    display: block;
}

.card-down-line {
    display: flex;
    gap: 0.2rem;
    font-size: 1rem;
}

.card-author {
    font-size: 0.8rem;
    color: rgb(88, 88, 88);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    width: 0;
}

.card-name {
    font-size: 1rem;
    font-weight: bolder;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.music-list-card {
    width: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.5rem;
}

.card-img {
    width: 4rem;
    height: 4rem;
    border-radius: 0.7rem;
    position: relative;
    cursor: pointer;
}

.music-list-card-box {
    padding: 0.5rem;
    width: 20rem;
    /* background-color: antiquewhite; */
    display: flex;
    gap: 0.5rem;
    border-radius: 1rem;
    user-select: none;
}

.music-list-card-box:hover {
    background-color: rgba(232, 232, 232, 0.494);
}
</style>