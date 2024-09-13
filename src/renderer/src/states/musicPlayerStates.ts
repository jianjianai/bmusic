import { reactive, ref } from 'vue'

export type Music = {
  /** 音乐名 */
  musicName?: string,
  /** 音乐作者 */
  musicAuthor?: string,
  /** 播放器 */
  playerName?: string
  /** 数据 */
  playerData?: string
}

export type MusicPlayer = {
  /** 音乐长度，单位毫秒 */
  duration: number,
  /** 音乐当前播放位置，单位毫秒 */
  currentTime: number,
  /** 音乐播放状态,正在播放或者暂停 */
  playing: boolean,
  /** 音量 */
  volume: number,
}

/** 播放器尺寸 */
export const musicPlayerSize = ref<"buttom" | "max">("buttom");

/** 正在播放的音乐 */
export const currentMusic = ref<Music>({
    musicName: "测试音乐",
    musicAuthor: "测试作者",
    playerName: "TestMusicPlayer",
    playerData: ""
});

/** 音乐播放器状态 */
export const musicPlayerState = reactive<MusicPlayer>({
  duration: 0,
  currentTime: 0,
  playing: false,
  volume: 0.5,
});

export type MusicController = {
  /** 当音乐播放时 */
  requestPlay:()=>void,
  /** 当音乐暂停时 */
  requestPause:()=>void,
  /** 当音乐音量改变时 */
  requestVolume:(volume:number)=>void,
  /** 当音乐播放位置改变时 */
  requestCurrentTime:(currentTime:number)=>void,
}

export function newDefaultMusicControllerObj():MusicController{
  return {
    requestPlay : ()=>console.log('onRequestPlay no register'),
    requestPause : ()=>console.log('onRequestPause no register'),
    requestVolume : ()=>console.log('onRequestVolume no register'),
    requestCurrentTime : ()=>console.log('onRequestCurrentTime no register'),
  }
}

/** 音乐播放控制 */
export const musicPlayerController = ref<MusicController>(newDefaultMusicControllerObj());



