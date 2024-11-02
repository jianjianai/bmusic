import { type Component, computed, type CSSProperties, type Reactive, readonly, type Ref, ref } from 'vue'


export type Music = {
  /** 图标 */
  iconUrl?: string,
  /** 音乐名 */
  musicName?: string,
  /** 音乐作者 */
  musicAuthor?: string,
  /** 播放器 */
  playerName: string
  /** 数据 */
  playerData: string
}

/** 比较两个音乐是否是同一首 */
export function compareMusic(music1?: Music, music2?: Music) {
  return (
    music1?.playerName === music2?.playerName &&
    music1?.playerData === music2?.playerData
  )
}

/** 计算一首音乐的key */
export function musicKey(music: Music) {
  return `${music.playerName}_${music.playerData}`;
}

const currentMusic = ref<Music>();

/** 音乐长度，单位毫秒 */
const duration = ref(0);

/** 音乐当前播放位置，单位毫秒 */
const currentTime = ref(0);

/** 音乐播放状态,正在播放或者暂停 */
const playing = ref(false);

/** 音量,0~1之间的小数 */
const volume = ref(1);

/* 加载中 */
const loading = ref(true);

/** 播放器尺寸 */
export const musicPlayerSize = ref<"buttom" | "max">("buttom");

/** 是否播放完毕 */
const ended = ref(false);

type EventListens = {
  onRequestPlay: () => void,
  onRequestPause: () => void,
  onRequestVolume: (volume: number) => void,
  onRequestCurrentTime: (currentTime: number) => void,
}

function createEventListens(): EventListens {
  return {
    onRequestPlay: () => console.log('onRequestPlay no register'),
    onRequestPause: () => console.log('onRequestPause no register'),
    onRequestVolume: () => console.log('onRequestVolume no register'),
    onRequestCurrentTime: () => console.log('onRequestCurrentTime no register'),
  }
}

/** 请求事件监听 */
let onRequestEventListens: EventListens = createEventListens();



export type PlayerCustomButton = {
  /** title */
  title?: string,
  /** 按钮图标 */
  icon: Component,
  /** 当被点击时 */
  onClick?: (event: MouseEvent, playerData: string) => void,
  /** 按钮样式 */
  style?: false | null | string | CSSProperties,
};
/** 播放器左下角自定义按钮 */
export const playerLeftCustomButtons: Ref<PlayerCustomButton[]> = ref([]);
/** 播放器右下角自定义按钮 */
export const playerRightCustomButtons: Ref<PlayerCustomButton[]> = ref([]);
/** 窗口标题栏自定义按钮 */
export const topBarCustomButtons: Ref<PlayerCustomButton[]> = ref([]);

/** 音乐播放器链接，用于个各种播放器进行连接 MusicPlayer 需要使用 MusicPlayerLink 和真实的播放器交互 */
export const musicPlayerLink = readonly({
  onRequestPlay: (listen: () => void) => onRequestEventListens.onRequestPlay = listen,
  onRequestPause: (listen: () => void) => onRequestEventListens.onRequestPause = listen,
  onRequestVolume: (listen: (volume: number) => void) => onRequestEventListens.onRequestVolume = listen,
  onRequestCurrentTime: (listen: (currentTime: number) => void) => onRequestEventListens.onRequestCurrentTime = listen,
  /** 更新当前播放位置 */
  updateCurrentTime(thecurrentTime: number) {
    currentTime.value = thecurrentTime;
  },
  /** 更新播放状态 */
  updatePlaying(theplaying: boolean) {
    playing.value = theplaying;
  },
  /** 更新音量 */
  updateVolume(thevolume: number) {
    volume.value = thevolume;
  },
  /** 更新音乐长度 */
  updateDuration(theduration: number) {
    duration.value = theduration;
  },
  /** 更新加载状态 */
  updateLoading(theloading: boolean) {
    loading.value = theloading;
  },
  /** 更新播放完毕状态 */
  updateEnded(isEnded: boolean) {
    ended.value = isEnded;
  },
  /** 当前音量,初始化时需要使用 */
  volume: volume,
  /** 当前音乐数据 */
  currentMusicData: computed(() => currentMusic.value!.playerData),
  /** 更新播放器左下角自定义按钮 */
  updatePlayerLeftCustomButtons(buttons: PlayerCustomButton[] | Reactive<PlayerCustomButton[]>) {
    playerLeftCustomButtons.value = buttons;
  },
  /** 更新播放器右下角自定义按钮 */
  updatePlayerRightCustomButtons(buttons: PlayerCustomButton[] | Reactive<PlayerCustomButton[]>) {
    playerRightCustomButtons.value = buttons;
  },
  /** 更新窗口标题栏自定义按钮 */
  updateTopBarCustomButtons(buttons: PlayerCustomButton[] | Reactive<PlayerCustomButton[]>) {
    topBarCustomButtons.value = buttons;
  },
});


/** 音乐播放器,所有音乐操作都通过这个 */
export const musicPlayer = readonly({
  /** 音乐当前播放位置，单位毫秒 */
  currentTime: currentTime,
  /** 音乐播放状态,正在播放或者暂停 */
  playing: playing,
  /** 音量 */
  volume: volume,
  /** 音乐长度 */
  duration: duration,
  /** 加载中 */
  loading: loading,
  /** 是否播放完毕 */
  ended: ended,
  /** 正在播放的音乐 */
  currentMusic: currentMusic,

  /** 播放器尺寸 */
  musicPlayerSize: musicPlayerSize,

  /**设置正在播放的音乐 */
  setCurrentMusic(music: Music) {
    // 重置音乐播放器链接
    onRequestEventListens = createEventListens();
    loading.value = true;
    duration.value = 0;
    currentTime.value = 0;
    playing.value = true;
    ended.value = false;
    playerLeftCustomButtons.value = [];
    playerRightCustomButtons.value = [];
    topBarCustomButtons.value = [];
    // 设置音乐
    currentMusic.value = music;
  },
  /** 请求播放 */
  requestPlay() {
    onRequestEventListens.onRequestPlay();
  },
  /** 请求暂停 */
  requestPause() {
    onRequestEventListens.onRequestPause();
  },
  /** 请求音量 */
  requestVolume(volume: number) {
    onRequestEventListens.onRequestVolume(volume);
  },
  /** 请求当前播放位置 */
  requestCurrentTime(currentTime: number) {
    onRequestEventListens.onRequestCurrentTime(currentTime);
  }
});

// @ts-ignore TODO 测试用，方便调试，正式发布时删除
window.musicPlayer = musicPlayer;
















