<!-- 标题栏 -->
<script lang="ts" setup>
import { LOGO_URL } from '@renderer/imageUrls';
import ImgDiv from './allSmall/ImgDiv.vue';
import SearcnSvg from '@renderer/svg/Search.vue';
import GearSvg from '@renderer/svg/Gear.vue';
import { ref } from 'vue';
import { setContent } from '@renderer/states/contentState';
import SearchContents from './contents/SearchContents.vue';
import SyncSvg from '@renderer/svg/Sync.vue';
import CloudCheckSvg from '@renderer/svg/CloudCheck.vue';
import CloudSlashSvg from '@renderer/svg/CloudSlash.vue';
import ExclamationCrcleSvg from '@renderer/svg/ExclamationCrcle.vue';

const searchValue = ref('');
function search() {
    setContent(SearchContents, { keyword: searchValue.value || '音乐' });
}

</script>
<template>
    <div class="top-bar">
        <div class="top-bar-title">
            <ImgDiv class="logo" :src="LOGO_URL"></ImgDiv>
            <div class="logo-title">Bmusic</div>
        </div>
        <div class="top-bar-btns">
            <!-- 搜索 -->
            <label class="search-box" for="top-bar-search-input">
                <input id="top-bar-search-input" class="search-input" type="text" placeholder="搜索" v-model="searchValue"
                    @keyup.enter="search" />
                <div class="search-icon" title="搜索" @click="search">
                    <SearcnSvg style="width: 100%; height: 100%;" />
                </div>
            </label>
            <!-- 占空用 -->
            <div style="width: 0;flex: 1;"></div>
            <div class="right-button-grep">
                <!-- 同步 -->
                <div class="top-bar-button-and-text" title="同步">
                    <SyncSvg class="top-bar-button-icon" />
                    <CloudCheckSvg class="top-bar-button-icon" />
                    <CloudSlashSvg class="top-bar-button-icon" />
                    <ExclamationCrcleSvg class="top-bar-button-icon" />
                    <div class="top-bar-button-text">同步</div>
                </div>
                <!-- 设置 -->
                <div class="top-bar-button" title="设置">
                    <GearSvg class="top-bar-button-icon" />
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.right-button-grep {
    display: flex;
    align-items: center;
    gap: 0.2rem;
}

.top-bar-button-and-text:hover {
    color: var(--top-bar-button-hover-color);
    background-color: var(--top-bar-button-hover-bg-color);
}

.top-bar-button-and-text {
    position: relative;
    height: 2rem;
    cursor: pointer;
    color: var(--top-bar-button-color);
    -webkit-app-region: no-drag;
    display: flex;
    align-items: center;
    gap: 0.2rem;
    padding: 0 0.5rem;
}

.top-bar-button-and-text .top-bar-button-icon {
    width: 1rem;
    height: 1rem;
}

.top-bar-button-and-text .top-bar-button-text {
    font-size: 0.8rem;
}


.top-bar-button .top-bar-button-icon {
    width: 50%;
    height: 50%;
    position: absolute;
    left: 25%;
    top: 25%;
}

.top-bar-button {
    position: relative;
    width: 2rem;
    height: 2rem;
    cursor: pointer;
    color: var(--top-bar-button-color);
    -webkit-app-region: no-drag;
}

.top-bar-button:hover {
    color: var(--top-bar-button-hover-color);
    background-color: var(--top-bar-button-hover-bg-color);
}

.search-box:has(.search-input:focus) {
    border-color: var(--top-bar-search-box-border-color-focus);
}

.search-input {
    flex: 1;
    width: 0;
    background-color: transparent;
    border: none;
    outline: none;
    color: var(--top-bar-search-input-color);
    font-size: 0.8rem;
    height: 2rem;
}

.search-icon:hover {
    color: var(--top-bar-search-icon-hover-color);
}

.search-icon {
    width: 1.2rem;
    height: 1.2rem;
    cursor: pointer;
    color: var(--top-bar-search-icon-color);
}

.search-box {
    display: flex;
    align-items: center;
    width: 20rem;
    height: 2rem;
    background-color: var(--top-bar-search-box-bg-color);
    border: 0.1rem solid var(--top-bar-search-box-border-color);
    border-radius: 0.5rem;
    margin-right: 1rem;
    cursor: text;
    -webkit-app-region: no-drag;
    padding: 0 0.5rem;
}


.top-bar-btns {
    flex: 1;
    width: 0;
    margin-right: 9rem;
    margin-left: 1rem;
    display: flex;
    align-items: center;
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