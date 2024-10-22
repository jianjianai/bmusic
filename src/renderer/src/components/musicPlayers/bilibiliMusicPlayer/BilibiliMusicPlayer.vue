<script setup lang="ts">
import { WebviewTag } from 'electron';
import { ref, watch } from 'vue';
import { musicPlayerSize } from '@renderer/states/musicPlayerStates';
import { musicPlayerLink } from '@renderer/states/musicPlayerStates';


const iframeRef = ref<WebviewTag | null>(null);


musicPlayerLink.onRequestPlay(() => {
  iframeRef.value?.send("play");
});
musicPlayerLink.onRequestPause(() => {
  iframeRef.value?.send("pause");
});

musicPlayerLink.onRequestCurrentTime((currentTime: number) => {
  iframeRef.value?.send("setPlaybackProgress", currentTime);
})

watch(musicPlayerSize, () => {
  iframeRef.value?.send("fullScreen", musicPlayerSize.value);
});

function onMessage(msg: string, ...args: any[]) {
  if (msg == "onPlaybackProgressChange") {
    musicPlayerLink.updateCurrentTime(args[0]);
  } else if (msg == "onPlaybackLengthChange") {
    musicPlayerLink.updateDuration(args[0]);
  } else if (msg == "onPlaybackStateChange") {
    musicPlayerLink.updatePlaying(args[0]);
    musicPlayerLink.updateLoading(false);
  }
}

watch(iframeRef, () => {
  iframeRef.value?.addEventListener("dom-ready", () => {
    iframeRef.value?.openDevTools();
    iframeRef.value?.addEventListener("ipc-message", (event) => {
      onMessage(event.channel, ...event.args);
    });
  });
});


//获取preload文件路径
const bilibiliMusicPlayer__filePath = ref<string>();
window.api.ipcAPI.BilibiliMusicPlayer__filePath().then((res: string) => {
  bilibiliMusicPlayer__filePath.value = res;
});


</script>
<template>
  <webview v-if="bilibiliMusicPlayer__filePath" ref="iframeRef" class="b-iframe"
    src="https://www.bilibili.com/video/BV1sy4y187Vu" :preload="bilibiliMusicPlayer__filePath" allowpopups
    nodeintegration></webview>
</template>
<style scoped>
.b-iframe {
  width: 100%;
  height: 100%;
}
</style>
