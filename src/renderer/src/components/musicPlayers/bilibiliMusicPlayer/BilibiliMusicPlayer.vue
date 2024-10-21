<script setup lang="ts">
import { WebviewTag } from 'electron';
import { PlayerProps } from '../PlayerProps';
import { ref, watch } from 'vue';

const props = defineProps<PlayerProps>();
const iframeRef = ref<WebviewTag | null>(null);

props.musicController.onRequestPlay(() => {
  iframeRef.value?.send("play");
});
props.musicController.onRequestPause(() => {
  iframeRef.value?.send("pause");
});

props.musicController.onRequestCurrentTime((currentTime: number) => {
  iframeRef.value?.send("setPlaybackProgress",currentTime);
});

function onMessage(msg:string,...args:any[]) {
  if (msg == "onPlaybackProgressChange") {
    props.musicController.setCurrentTime(args[0]);
  } else if (msg == "onPlaybackLengthChange") {
    props.musicController.setDuration(args[0]);
  } else if (msg == "onPlaybackStateChange") {
    props.musicController.setPlaying(args[0]);
  }
}

watch(() => iframeRef.value, () => {
  iframeRef.value?.addEventListener("dom-ready", () => {
    iframeRef.value?.openDevTools();
    iframeRef.value?.addEventListener("ipc-message",(event)=>{
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
  <webview v-if="bilibiliMusicPlayer__filePath" ref="iframeRef" class="b-iframe" src="https://www.bilibili.com/video/BV1sy4y187Vu"
    :preload="bilibiliMusicPlayer__filePath" allowpopups nodeintegration></webview>
</template>
<style scoped>
.b-iframe {
  width: 100%;
  height: 100%;
}
</style>
