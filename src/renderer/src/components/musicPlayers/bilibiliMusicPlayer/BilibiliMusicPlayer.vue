<script setup lang="ts">
import { WebviewTag } from 'electron';
import { computed, h, markRaw, reactive, Ref, ref, watch } from 'vue';
import { musicPlayerSize, PlayerCustomButton } from '@renderer/states/musicPlayerStates';
import ContextMenu from '@imengyu/vue3-context-menu'
import BxlDevToSvg from '@renderer/svg/BxlDevTo.vue';
import MousePointerSvg from '@renderer/svg/MousePointer.vue';
import CopyOutlineSvg from '@renderer/svg/CopyOutline.vue';
import { ipcBilibiliApi } from '@renderer/ipcAPI';
import { MusicPlayerLink } from '../musicPlayers';
import { BilibiliMusicData, paresBilibiliMusicData } from './bilibiliMusic';
import { putNotification } from '@renderer/states/notification/notification';
import BilibiliLikeSvg from './svg/BilibiliLikeSvg.vue';
import CoinOperatedSvg from './svg/CoinOperatedSvg.vue';

const props = defineProps<{
  musicPlayerLink: MusicPlayerLink,
}>();
const musicPlayerLink = props.musicPlayerLink;

// 播放器数据
const musicData: Ref<BilibiliMusicData> = computed(() => paresBilibiliMusicData(musicPlayerLink.currentMusicData));
const like = ref<boolean>(false);//是否点赞
const coinOperated = ref<boolean>(false);//是否投币

// https://www.bilibili.com/video/BV19G411H7DY/?share_source=copy_web&vd_source=8ec9a462acb529345bef8d4422990df9&t=17

const bilibiliUrl = ref<string>(`https://www.bilibili.com/video/${musicData.value.bvId}/?t=0.01`);

// 复制链接
function copyLink() {
  navigator.clipboard.writeText(bilibiliUrl.value);
  putNotification({ type: "success", message: "已复制bilibili网页链接" });
}

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
musicPlayerLink.onRequestVolume((volume: number) => {
  iframeRef.value?.send("setVolume", volume);
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
  } else if (msg == "onBpxStateBuff") {
    musicPlayerLink.updateLoading(args[0]);
  } else if (msg == "onPlaybackEnded") {
    musicPlayerLink.updateEnded(args[0]);
  } else if (msg == "onVolumeChange") {
    musicPlayerLink.updateVolume(args[0]);
  } else if (msg == "reqInitVolume") {
    iframeRef.value?.send("setVolume", musicPlayerLink.volume);
  } else if (msg == "onLikeChange") {
    like.value = args[0];
  } else if (msg == "onCoinChange") {
    coinOperated.value = args[0];
  }
}

watch(iframeRef, () => {
  iframeRef.value?.addEventListener("dom-ready", () => {
    iframeRef.value?.addEventListener("ipc-message", (event) => {
      onMessage(event.channel, ...event.args);
    });
  });
});


// 自定义按钮
{
  // 复制链接
  const copyButton = reactive<PlayerCustomButton>({
    title: "复制bilibili网页链接",
    icon: markRaw(CopyOutlineSvg),
    onClick: copyLink,
  });
  // 点赞按钮
  const likeButton = reactive<PlayerCustomButton>({
    title: "给bilibili视频点赞",
    icon: markRaw(BilibiliLikeSvg),
    style: computed(() => like.value ? "color: #00aeec" : "") as any,
    onClick: () => {
      if (like.value) {
        iframeRef.value?.send("cancelLike");
      } else {
        iframeRef.value?.send("clickLike");
      }
    },
  });
  // 投币按钮
  const coinButton = reactive<PlayerCustomButton>({
    title: "给bilibili视频投币",
    icon: markRaw(CoinOperatedSvg),
    style: computed(() => coinOperated.value ? "color: #00aeec" : "") as any,
    onClick: () => {
      iframeRef.value?.send("clickCoin");
    },
  });
  // 操控网页
  const controlButton = reactive<PlayerCustomButton>({
    title: "超控网页",
    icon: markRaw(MousePointerSvg),
    style: computed(() => playerinMaxMaskOpen.value ? "" : "color: #00aeec") as any,
    onClick: () => {
      playerinMaxMaskOpen.value = !playerinMaxMaskOpen.value;
    },
  });
  // 打开开发者工具
  const openDevToolsButton = reactive<PlayerCustomButton>({
    title: "打开开发者工具",
    icon: markRaw(BxlDevToSvg),
    onClick: () => {
      iframeRef.value?.openDevTools();
    },
  });

  //左边自定义按钮
  musicPlayerLink.updatePlayerLeftCustomButtons(reactive([likeButton, coinButton, copyButton]));
  //顶部自定义按钮
  musicPlayerLink.updateTopBarCustomButtons(reactive([likeButton,coinButton,copyButton,controlButton,openDevToolsButton]));
}




//获取preload文件路径
const bilibiliMusicPlayer__filePath = ref<string>();
ipcBilibiliApi.getPreloadJsFilePath().then((res: string) => {
  bilibiliMusicPlayer__filePath.value = res;
});


// 遮罩逻辑
const playerinMaxMaskOpen = ref(true);//是否开启遮罩
watch(musicPlayerSize, () => {
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
        icon: h(CopyOutlineSvg, { style: "color: black; width: 1rem; height: 1rem;" }),
        onClick: copyLink
      },
      {
        label: "超控网页",
        icon: h(MousePointerSvg, { style: "color: black; width: 1rem; height: 1rem;" }),
        onClick: () => {
          playerinMaxMaskOpen.value = false;
        },
        divided: true
      },
      {
        label: "打开开发者工具",
        icon: h(BxlDevToSvg, { style: "color: black; width: 1rem; height: 1rem;" }),
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
    <webview v-if="bilibiliMusicPlayer__filePath" ref="iframeRef" class="b-iframe" :src="bilibiliUrl"
      :preload="bilibiliMusicPlayer__filePath" allowpopups nodeintegration></webview>
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
  background-color: black;
}

.b-iframe,
.b-player {
  width: 100%;
  height: 100%;
}
</style>
