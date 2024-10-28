<script lang="ts" setup>
import { contentData as musicName } from '@renderer/states/contentState';
import { useMusicPlayList } from '@renderer/states/playListStorage';
import { type Ref } from 'vue';


const musicPlayList = useMusicPlayList(musicName as Ref<string>);


</script>
<template>
    <div class="edit-play-list-lnfo-main-box">
        <div class="edit-play-list-lnfo-title">编辑歌单信息</div>
        <div class=""></div>
    </div>
</template>
<style scoped>
.edit-play-list-lnfo-title{
    font-size: 1.2rem;
    font-weight: bolder;
}

.edit-play-list-lnfo-main-box{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}
</style>