import { reactive } from "vue";

export const MusicPlayerState = reactive<{
    /** 播放器尺寸 */
    size:"buttom" | "max",
    /** 音乐长度，单位毫秒 */
    duration:number,
    /** 音乐当前播放位置，单位毫秒 */
    currentTime:number,
    /** 音乐播放状态,正在播放或者暂停 */
    playing:boolean,
    /** 音量 */
    volume:number,
}>({
    size:"buttom",
    duration:0,
    currentTime:0,
    playing:false,
    volume:0.5
});