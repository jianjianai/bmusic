
export type PlayerProps = {
    /** 音乐数据 */
    data: string;
    /** 音乐控制器 */
    musicController:MusicController
}

/** 音乐控制器对象 */
export type MusicController = {
    /** 当被请求音乐开始播放 */
    onRequestPlay:(c:()=>void)=>void,
    /** 当被请求音乐暂停播放 */
    onRequestPause:(c:()=>void)=>void,
    /** 请求修改音乐音量,volume:0~1之间的小数 */
    onRequestVolume:(c:(volume:number)=>void)=>void,
    /** 请求设置音乐当前播放位置 */
    onRequestCurrentTime:(c:(currentTime:number)=>void)=>void,

    /**设置音乐时长*/
    setDuration:(duration:number)=>void,
    /**设置音乐当前播放位置 */
    setCurrentTime:(currentTime:number)=>void,
    /**设置音乐音量 */
    setVolume:(volume:number)=>void,
    /**设置音乐播放状态 */
    setPlaying:(playing:boolean)=>void,
}
