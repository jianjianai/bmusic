import { readonly, ref } from 'vue'


export type Music = {
  /** 音乐名 */
  musicName?: string,
  /** 音乐作者 */
  musicAuthor?: string,
  /** 播放器 */
  playerName: string
  /** 数据 */
  playerData: string
}

const currentMusic = ref<Music>({
  musicName: "测试音乐",
  musicAuthor: "测试作者",
  playerName: "TestMusicPlayer",
  playerData: ""
});

  /** 音乐长度，单位毫秒 */
const duration = ref(0);``

/** 音乐当前播放位置，单位毫秒 */
const currentTime = ref(0);

/** 音乐播放状态,正在播放或者暂停 */
const playing = ref(false);

/** 音量,0~1之间的小数 */
const volume = ref(1);

/* 加载中 */
export const loading = ref(true);

/** 播放器尺寸 */
export const musicPlayerSize = ref<"buttom" | "max">("buttom");

type EventListens = {
  onRequestPlay: () => void,
  onRequestPause: () => void,
  onRequestVolume: (volume:number) => void,
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

let eventListens: EventListens = createEventListens();

/** 音乐播放器链接，用于个各种播放器进行连接 MusicPlayer 需要使用 MusicPlayerLink 和真实的播放器交互 */
export const musicPlayerLink = readonly({
  onRequestPlay: (listen: () => void) => eventListens.onRequestPlay = listen,
  onRequestPause: (listen: () => void) => eventListens.onRequestPause = listen,
  onRequestVolume: (listen: (volume: number) => void) => eventListens.onRequestVolume = listen,
  onRequestCurrentTime: (listen: (currentTime: number) => void) => eventListens.onRequestCurrentTime = listen,
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
  
  /** 当前音量,初始化时需要使用 */
  volume: volume,
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

  /** 正在播放的音乐 */
  currentMusic: currentMusic,

  /** 播放器尺寸 */
  musicPlayerSize: musicPlayerSize,

  /**设置正在播放的音乐 */
  setCurrentMusic(music: Music) {
    // 重置音乐播放器链接
    eventListens = createEventListens();
    loading.value = true;
    duration.value = 0;
    currentTime.value = 0;
    playing.value = true;
    // 设置音乐
    currentMusic.value = music;
  },
  /** 请求播放 */
  requestPlay() {
    eventListens.onRequestPlay();
  },
  /** 请求暂停 */
  requestPause() {
    eventListens.onRequestPause();
  },
  /** 请求音量 */
  requestVolume(volume: number) {
    eventListens.onRequestVolume(volume);
  },
  /** 请求当前播放位置 */
  requestCurrentTime(currentTime: number) {
    eventListens.onRequestCurrentTime(currentTime);
  },
});

// @ts-ignore 测试用，方便调试，正式发布时删除
window.musicPlayer = musicPlayer;
















