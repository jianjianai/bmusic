import { DefineComponent, toRaw } from "vue";
import { PlayerProps } from "./PlayerProps";
import TestMusicPlayer from "./testMusicPlayer/TestMusicPlayer.vue";
import NotExist from "./notExist/NotExist.vue"

const NotExistRaw = toRaw(NotExist);

type DefinePlayerComponent = DefineComponent<PlayerProps, any, any>;

/**
 * 播放器组件
 */
export const musicPlayers: { [key: string]: DefinePlayerComponent } = {
    "TestMusicPlayer": toRaw(TestMusicPlayer),
}

export const getMusicPlayer = (name?: string): DefinePlayerComponent => {
    if (name===undefined) { return NotExistRaw; }
    const player = musicPlayers[name];
    if(!player){ return NotExistRaw; }
    return player;
}
