<script setup lang="ts">
import MusicList from '@renderer/components/allSmall/MusicList.vue';
import { ipcBilibiliApi } from '@renderer/ipcAPI';
import { type Music } from '@renderer/states/musicPlayerStates';
import LoadingSvg from '@renderer/svg/Loading.vue';
import { type WebviewTag } from 'electron';
import { computed, ref, watch } from 'vue';
import { paresBilibiliMusicDataToString } from './bilibiliMusic';


const props = defineProps<{
    keyword: string
}>();

const bilibilisearchUrl = ref(`https://search.bilibili.com/video?keyword=${encodeURI(props.keyword)}`);
const result = ref<{ bv: string, imgUrl?: string, name?: string, author?: string }[]>();
const musicList = computed<Music[] | undefined>(()=>result.value?.map((item) => ({
    iconUrl: item.imgUrl,
    musicName: item.name,
    musicAuthor: item.author,
    playerName: "Bilibili",
    playerData: paresBilibiliMusicDataToString({bvId: item.bv}),
})));
const searchWebview = ref<WebviewTag | null>();

function onMessage(msg: string, ...args: any[]) {
    if (msg == "searchResult") {
        result.value = args[0];
        console.log(args[0]);
    }
}
watch(searchWebview, () => {
    searchWebview.value?.addEventListener("dom-ready", () => {
        searchWebview.value?.addEventListener("ipc-message", (event) => {
            onMessage(event.channel, ...event.args);
        });
    });
});

//获取preload文件路径
const bilibiliMusicPlayer__filePath = ref<string>();
ipcBilibiliApi.getPreloadJsFilePath_BilibiliMusicSearch().then((res: string) => {
    bilibiliMusicPlayer__filePath.value = res;
});

</script>
<template>
    <div class="bilibili-search">
        <!-- 展示的列表 -->
        <div class="ilibili-search-result" v-if="musicList">
            <MusicList :list="musicList"></MusicList>
        </div>
        <!-- 用于获取信息的webview -->
        <div class="ilibili-search-webview-box" v-else>
            <webview class="ilibili-search-webview" ref="searchWebview" :src="bilibilisearchUrl" allowpopups
                nodeintegration v-if="bilibiliMusicPlayer__filePath" :preload="bilibiliMusicPlayer__filePath"></webview>
            <div class="ilibili-search-loading">
                <LoadingSvg class="playback-btn-Loading"></LoadingSvg>
            </div>
        </div>
    </div>
</template>
<style scoped>
@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.playback-btn-Loading {
    animation: spin 1s linear infinite;
    left: 40%;
    top: 40%;
    height: 20%;
    width: 20%;
    position: absolute;
    color: rgb(255, 255, 255);
}

.ilibili-search-loading {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(80, 80, 80, 0.526);
}

.ilibili-search-webview {
    width: 100%;
    height: 100%;
}

.ilibili-search-webview-box {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
}

.bilibili-search {
    position: relative;
    min-height: 100%;
}
</style>