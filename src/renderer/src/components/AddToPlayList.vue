<script lang="ts" setup>
import { LOGO_URL } from '@renderer/imageUrls';
import { addToPlayListMusic } from '@renderer/states/addToPlayListState';
import { playListStorage, useMusicPlayList } from '@renderer/states/playListStorage';
import { reactive, ref, watch } from 'vue';
import CloseSvg from './svg/Close.vue';
import ImgDiv from './allSmall/ImgDiv.vue';

const refAddToList = ref<string>()
const musicPlayList = useMusicPlayList(refAddToList);
const iconMap = reactive(new Map<string, string>);
let loading = false;
watch(() => playListStorage.playLists, async () => {
    iconMap.clear();
    for (const name of playListStorage.playLists) {
        iconMap.set(name, await playListStorage.readPlayListIconUrl(name));
    }
}, { immediate: true });

watch(musicPlayList, async (newVal) => {
    if (newVal) {
        loading = true;
        await newVal.onLoaded;
        newVal.addMusic(addToPlayListMusic.value!);
        addToPlayListMusic.value = undefined;
        loading = false;
    }
});

function close() {
    if (loading) {
        return;
    }
    addToPlayListMusic.value = undefined;
}

</script>
<template>
    <div style="position: fixed;">
        <div class="main-box-mask" @click="close()"></div>
        <div class="add-to-pay-list-box">
            <!-- 选择歌单 -->
            <template v-if="!refAddToList">
                <div class="add-to-pay-list-box-title">收藏到歌单</div>
                <div class="add-to-pay-list-box-lists">
                    <!-- 每个歌单 -->
                    <div class="add-to-pay-list-box-list" v-for="name of playListStorage.playLists"
                        @click="refAddToList = name">
                        <ImgDiv class="add-to-pay-list-box-list-icon" :src="iconMap.get(name)"></ImgDiv>
                        <div class="add-to-pay-list-box-list-name">{{ name }}</div>
                    </div>
                </div>
                <!-- 关闭按钮 -->
                <div class="add-to-pay-list-box-list-close" @click="close()">
                    <CloseSvg style="width: 100%;height: 100%;" />
                </div>
            </template>
            <!-- 收藏中.. -->
            <template v-else>
                <div class="loading">
                    <ImgDiv class="loading-icon" :src="iconMap.get(refAddToList)"></ImgDiv>
                    <div class="loading-text">{{ refAddToList }}</div>
                    <div class="loading-text">收藏中...</div>
                </div>
            </template>
        </div>
    </div>
</template>
<style scoped>
.add-to-pay-list-box-list-close {
    position: absolute;
    right: 1rem;
    top: 1rem;
    width: 1rem;
    height: 1rem;
    cursor: pointer;
    color: var(--color-add-to-play-list-box-list-close);
}

.loading-text {
    font-size: 1rem;
    color: var(--color-add-to-play-list-box-loading-text);
    text-align: center;
    margin-top: 1rem;
}

.loading-icon {
    width: 3rem;
    height: 3rem;
    border-radius: 0.5rem;
    overflow: hidden;
}

.loading {
    flex: 1;
    height: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.add-to-pay-list-box-list-icon {
    width: 3rem;
    height: 3rem;
    background-color: rgb(252, 189, 244);
    border-radius: 0.5rem;
    margin-left: 1rem;
    overflow: hidden;
}

.add-to-pay-list-box-list-name {
    font-size: 1rem;
    color: var(--color-add-to-play-list-box-list-name);
    flex: 1;
    width: 0;
    text-overflow: ellipsis;
    overflow: hidden;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    display: -webkit-box;
    user-select: none;
    margin-right: 1rem;
}

.add-to-pay-list-box-list:hover {
    background-color: var(--color-add-to-play-list-box-list-hover-bg);
}

.add-to-pay-list-box-list {
    display: flex;
    align-items: center;
    height: 4rem;
    gap: 0.5rem;
    cursor: pointer;
}

.add-to-pay-list-box-lists {
    height: 0;
    flex: 1;
    margin: 1rem 0;
    overflow-y: scroll;
    scrollbar-width: thin;
}

.add-to-pay-list-box-title {
    font-size: 1.3rem;
    color: var(--color-add-to-play-list-box-title);
    text-align: center;
    font-weight: bolder;
    margin-top: 1rem;
}

.main-box-mask {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vw;
    width: 100vw;
    height: 100vh;
}

.add-to-pay-list-box {
    width: 30rem;
    height: 30rem;
    background-color: var(--color-add-to-play-list-box-bg);
    box-shadow: 0 0 1rem 0.1rem var(--color-add-to-play-list-box-shadow);
    position: fixed;
    left: 50%;
    top: calc(50% - 2rem);
    transform: translate(-50%, -50%);
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
</style>