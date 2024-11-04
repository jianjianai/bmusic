import { readonly, ref, toRaw } from "vue";

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

// 不是保存在本地的播放列表，也就是临时播放列表
export type MusicPlayListOnLoc = {
    name: string,
    iconUrl?: string,
    /** 简介 */
    description?: string,
    /** 作者 */
    author?: string,
    /** 作者头像 */
    authorIconUrl?: string,
    /** 列表 */
    list: Music[]
};

/** 当前正在播放的音乐 */
const currentMusicValue = ref<Music>();
const musicPlaying = ref(false);

export const currentMusic = readonly(currentMusicValue);
export const isMusicPlaying = readonly(musicPlaying);

function sendMessage(type: string, data: any) {
    window.parent.postMessage({ type, data }, '*');
}

function message(event: MessageEvent) {
    const type = event.data.type;
    const data = event.data.data;
    if (type === 'currentMusicUpdate') {
        currentMusicValue.value = data;
    }else if (type === 'playingUpdate') {
        musicPlaying.value = data;
    }
}
addEventListener('message', message);
sendMessage('load', null);


// 播放某首音乐
export function playMusic(music: Music) {
    sendMessage('play', toRaw(music));
}

// 打开某个音乐列表
export function openMusicList(list: MusicPlayListOnLoc) {
    sendMessage('openMusicList', toRaw(list));
}

//暂停
export function pauseMusic() {
    sendMessage('pause', null);
}

//继续播放
export function resumeMusic() {
    sendMessage('resume', null);
}

/** 比较两个音乐是否是同一首 */
export function compareMusic(music1?: Music, music2?: Music) {
    return (
        music1?.playerName === music2?.playerName &&
        music1?.playerData === music2?.playerData
    )
}

/** 计算一首音乐的key */
export function musicKey(music?: Music) {
    return `${music?.playerName}_${music?.playerData}`;
}