<script setup lang="ts">
import { WebviewTag } from 'electron';
import { computed, h, Ref, ref, watch } from 'vue';
import { musicPlayer, musicPlayerSize } from '@renderer/states/musicPlayerStates';
import { musicPlayerLink } from '@renderer/states/musicPlayerStates';
import ContextMenu from '@imengyu/vue3-context-menu'
import BxlDevToSvg from '@renderer/components/svg/BxlDevTo.vue';
import MousePointerSvg from '@renderer/components/svg/MousePointer.vue';
import CopyOutlineSvg from '@renderer/components/svg/CopyOutline.vue';

type BilibiliMusicData = {
  bvId: string;
}

// 播放器数据
const musicData: Ref<BilibiliMusicData> = computed(() => JSON.parse(musicPlayer.currentMusic.playerData));

// https://www.bilibili.com/video/BV19G411H7DY/?share_source=copy_web&vd_source=8ec9a462acb529345bef8d4422990df9&t=17

const bilibiliUrl = ref<string>(`https://www.bilibili.com/video/${musicData.value.bvId}/?t=0.01`);



// 播放器交互逻辑 
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
  iframeRef.value?.send("fullScreen");
});

function onMessage(msg: string, ...args: any[]) {
  if (msg == "onPlaybackProgressChange") {
    musicPlayerLink.updateCurrentTime(args[0]);
  } else if (msg == "onPlaybackLengthChange") {
    musicPlayerLink.updateDuration(args[0]);
  } else if (msg == "onPlaybackStateChange") {
    musicPlayerLink.updatePlaying(args[0]);
    musicPlayerLink.updateLoading(false);
  } else if (msg == "onBpxStateBuff"){
    musicPlayerLink.updateLoading(args[0]);
  } else if (msg == "onPlaybackEnded"){
    musicPlayerLink.updateEnded(args[0]);
  } else if (msg == "onVolumeChange"){
    musicPlayerLink.updateVolume(args[0]);
  }
}

watch(iframeRef, () => {
  iframeRef.value?.addEventListener("dom-ready", () => {
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


// 遮罩逻辑
const playerinMaxMaskOpen = ref(true);//是否开启遮罩
watch(musicPlayerSize,()=>{
  playerinMaxMaskOpen.value = musicPlayerSize.value === 'max';
});

// 遮罩邮件菜单
function onContextMenu(e: MouseEvent) {
  e.preventDefault();
  ContextMenu.showContextMenu({
    x: e.x,
    y: e.y,
    minWidth: 200,
    items: [
      {
        label: "复制网页链接",
        icon: h(CopyOutlineSvg,{style:"color: black; width: 1rem; height: 1rem;"}),
      },
      {
        label: "超控网页",
        icon: h(MousePointerSvg,{style:"color: black; width: 1rem; height: 1rem;"}),
        onClick: () => {
          playerinMaxMaskOpen.value = false;
        },
        divided:true
      },
      {
        label: "打开开发者工具",
        icon: h(BxlDevToSvg,{style:"color: black; width: 1rem; height: 1rem;"}),
        onClick: () => {
          iframeRef.value?.openDevTools();
        }
      }
    ]
  });
}
</script>
<template>
  <div class="b-player">
    <webview v-if="bilibiliMusicPlayer__filePath" ref="iframeRef" class="b-iframe"
      :src="bilibiliUrl" :preload="bilibiliMusicPlayer__filePath" allowpopups
      nodeintegration></webview>
    <!-- 放大状态遮罩 -->
    <div class="player-max-mask" v-if="musicPlayerSize === 'max' && playerinMaxMaskOpen" @contextmenu="onContextMenu">
    </div>
  </div>
</template>
<style scoped>
/* 放大状态遮罩 */
.player-max-mask {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}

.b-player {
  position: relative;
}

.b-iframe,
.b-player {
  width: 100%;
  height: 100%;
}
</style>
