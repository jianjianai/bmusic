<script setup lang="ts">
import { PlayerProps } from '../PlayerProps';
import { onMounted, onUnmounted, ref } from 'vue'

const props = defineProps<PlayerProps>();
const iframeRef = ref<HTMLIFrameElement | null>(null);

props.musicController.onRequestPlay(() => {
  iframeRef.value?.contentWindow?.postMessage({type:"play"}, "*");
});
props.musicController.onRequestPause(() => {
  iframeRef.value?.contentWindow?.postMessage({type:"pause"}, "*");
});

props.musicController.onRequestCurrentTime((currentTime: number) => {
  iframeRef.value?.contentWindow?.postMessage({type:"setPlaybackProgress", value: currentTime}, "*");
});

function onMessage(event: MessageEvent) {
  const data = event.data;
  if(data.type=="onPlaybackProgressChange"){
    props.musicController.setCurrentTime(data.value);
  }else if(data.type=="onPlaybackLengthChange"){
    props.musicController.setDuration(data.value);
  }else if (data.type=="onPlaybackStateChange"){
    props.musicController.setPlaying(data.value);
  }
}

onMounted(()=>{
  window.addEventListener('message', onMessage);
});

onUnmounted(()=>{
  window.removeEventListener('message', onMessage);
});




</script>
<template>
  <iframe ref="iframeRef" class="b-iframe" src="https://www.bilibili.com/video/BV1sy4y187Vu" sandbox="allow-scripts allow-same-origin" ></iframe>
</template>
<style scoped>
.b-iframe{
  width: 100%;
  height: 100%;
}
</style>
