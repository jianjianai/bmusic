<!-- 标题栏 -->
<script lang="ts" setup>
import { LOGO_URL } from '@renderer/imageUrls';
import ImgDiv from './allSmall/ImgDiv.vue';

</script>
<template>
    <div class="top-bar">
        <div class="top-bar-title">
            <ImgDiv class="logo" :src="LOGO_URL"></ImgDiv>
            <div class="logo-title">Bmusic</div>
        </div>
        <div class="top-bar-btns">

        </div>
    </div>
</template>
<style scoped>
.top-bar-btns{
    flex: 1;
    width: 0;
    margin-right: 9rem;
}
.logo-title {
    font-size: 1rem;
    margin-left: 0.5rem;
    color: var(--top-bar-title-color);
    font-weight: bolder;
}

.logo {
    width: 1.5rem;
    height: 1.5rem;
    overflow: hidden;
    margin-left: 1.5rem;
    border-radius: 50%;
}

.top-bar-title {
    width: var(--left-vav-width);
    display: flex;
    align-items: center;
    font-size: 1.5rem;
    margin-top: 0.5rem;
}

.top-bar {
    position: fixed;
    display: flex;
    height: var(--top-bar-height);
    width: 100vw;
    left: 0;
    top: 0;
    -webkit-app-region: drag;
    /* background-color: rgba(183, 148, 218, 0.134); */
}
</style>