import { computed, readonly, ref } from 'vue'


export type Music = {
  /** 音乐长度，单位毫秒 */
  duration: number,
  /** 音乐名 */
  musicName?: string,
  /** 音乐作者 */
  musicAuthor?: string,
  /** 播放器 */
  playerName?: string
  /** 数据 */
  playerData?: string
}

const currentMusic = ref<Music>({
  duration: 0,
  musicName: "测试音乐",
  musicAuthor: "测试作者",
  playerName: "TestMusicPlayer",
  playerData: ""
});

/** 音乐当前播放位置，单位毫秒 */
const currentTime = ref(0);

/** 音乐播放状态,正在播放或者暂停 */
const playing = ref(false);

/** 音量,0~1之间的小数 */
const volume = ref(1);

/** 播放器尺寸 */
export const musicPlayerSize = ref<"buttom" | "max">("buttom");

export type MusicPlayerLink = {
  /** 当音乐播放时 */
  onRequestPlay: () => void,
  /** 当音乐暂停时 */
  onRequestPause: () => void,
  /** 当音乐音量改变时 */
  onRequestVolume: (volume: number) => void,
  /** 当音乐播放位置改变时 */
  onRequestCurrentTime: (currentTime: number) => void,

  get setCurrentTime():(currentTime:number)=>void
  get setPlaying():(playing:boolean)=>void
  get setVolume():(volume:number)=>void
}

const setCurrentTime:(currentTime:number)=>void = (thecurrentTime:number)=>{
  currentTime.value = thecurrentTime;
};

const setPlaying:(playing:boolean)=>void = (theplaying:boolean)=>{
  playing.value = theplaying;
};

const setVolume:(volume:number)=>void = (thevolume:number)=>{
  volume.value = thevolume;
};  

function newDefaultMusicPlayerLinkObj(): MusicPlayerLink {
  return {
    onRequestPlay: () => console.log('onRequestPlay no register'),
    onRequestPause: () => console.log('onRequestPause no register'),
    onRequestVolume: () => console.log('onRequestVolume no register'),
    onRequestCurrentTime: () => console.log('onRequestCurrentTime no register'),
    get setCurrentTime(){return setCurrentTime},
    get setPlaying(){return setPlaying},
    get setVolume(){return setVolume}
  }
}

/** 音乐播放器链接，用于个各种播放器进行连接 MusicPlayer 需要使用 MusicPlayerLink 和真实的播放器交互 */
export const musicPlayerLink = ref<MusicPlayerLink>(newDefaultMusicPlayerLinkObj());


/** 音乐播放器,所有音乐操作都通过这个 */
export const musicPlayer = readonly({
  /** 音乐当前播放位置，单位毫秒 */
  currentTime: readonly(currentTime),
  /** 音乐播放状态,正在播放或者暂停 */
  playing: readonly(playing),
  /** 音量 */
  volume: readonly(volume),

  /** 正在播放的音乐 */
  currentMusic: computed(() => currentMusic.value),

  /** 播放器尺寸 */
  musicPlayerSize: musicPlayerSize,

  /**设置正在播放的音乐 */
  setCurrentMusic(music: Music) {
    // 重置音乐播放器链接
    musicPlayerLink.value = newDefaultMusicPlayerLinkObj();
    // 设置音乐
    currentMusic.value = music;
  },
})

















