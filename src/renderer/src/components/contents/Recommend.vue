<script lang="ts" setup>
import { onMounted, onUnmounted, ref, toRaw, watch } from 'vue';
import LoadingSvg from '@renderer/svg/Loading.vue';
import { musicPlayer } from '@renderer/states/musicPlayerStates';
import { setContent } from '@renderer/states/contentState';
import PlayListContentsNoLoc from './PlayListContentsNoLoc.vue';

const iframeLoading = ref(true);
const iframeRef = ref<HTMLIFrameElement | null>(null);
function sendMessage(type: string, data: any) {
    iframeRef.value?.contentWindow?.postMessage({ type, data }, '*');
}
function message(event: MessageEvent) {
    const type = event.data.type;
    const data = event.data.data;
    if (type === 'play') {
        musicPlayer.setCurrentMusic(data);
    } else if (type === 'openMusicList') {
        setContent(PlayListContentsNoLoc, { musicPlayList: data });
    } else if (type === 'load') {
        load();
    } else if (type === 'pause') { // 暂停
        musicPlayer.requestPause();
    } else if (type === 'resume') { // 恢复
        musicPlayer.requestPlay();
    }
}

onMounted(() => {
    window.addEventListener('message', message);
});
onUnmounted(() => {
    window.removeEventListener('message', message);
});

function load() {
    iframeLoading.value = false
    sendMessage('currentMusicUpdate', toRaw(musicPlayer.currentMusic));
    sendMessage('playingUpdate', musicPlayer.playing);
}
watch(() => musicPlayer.currentMusic, () => {
    sendMessage('currentMusicUpdate', toRaw(musicPlayer.currentMusic));
});
watch(() => musicPlayer.playing, () => {
    sendMessage('playingUpdate', musicPlayer.playing);
});

</script>
<template>
    <div class="recommend">
        <div v-if="iframeLoading" class="loading">
            <LoadingSvg class="loading-icon" />
        </div>
        <iframe class="recommend-iframe" frameborder="no" src="http://localhost:8080/find/" ref="iframeRef"></iframe>
    </div>
</template>
<style scoped>
.loading-icon {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    position: absolute;
    width: 5rem;
    height: 5rem;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: translate(-50%, -50%) rotate(0deg);
    }

    100% {
        transform: translate(-50%, -50%) rotate(360deg);
    }
}

.loading {
    position: relative;
    flex: 9;
}

.recommend-iframe {
    flex: 1;
    height: 0;
}

.recommend {
    height: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
}
</style>