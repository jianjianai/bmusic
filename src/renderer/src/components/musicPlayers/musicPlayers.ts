import { DefineComponent, toRaw } from "vue";
import TestMusicPlayer from "./testMusicPlayer/TestMusicPlayer.vue";
import NotExist from "./notExist/NotExist.vue"
import BilibiliMusicPlayer from './bilibiliMusicPlayer/BilibiliMusicPlayer.vue'


const NotExistRaw = toRaw(NotExist);

type DefinePlayerComponent = DefineComponent<any, any, any>;

/**
 * 播放器组件
 */
export const musicPlayers: { [key: string]: DefinePlayerComponent } = {
    "TestMusicPlayer": toRaw(TestMusicPlayer),
    "BilibiliMusicPlayer" :toRaw(BilibiliMusicPlayer)
}

export const getMusicPlayer = (name?: string): DefinePlayerComponent => {
    if (name===undefined) { return NotExistRaw; }
    const player = musicPlayers[name];
    if(!player){ return NotExistRaw; }
    return player;
}
