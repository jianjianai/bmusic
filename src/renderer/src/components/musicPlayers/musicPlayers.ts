import { type Component, DefineSetupFnComponent, markRaw } from "vue";
import TestMusicPlayer from "./testMusicPlayer/TestMusicPlayer.vue";
import NotExist from "./notExist/NotExist.vue"
import BilibiliMusicPlayer from './bilibiliMusicPlayer/BilibiliMusicPlayer.vue'
import { type musicPlayerLink } from "@renderer/states/musicPlayerStates";
import BilibiliMusicEditor from "./bilibiliMusicPlayer/BilibiliMusicEditor.vue";


export type MusicPlayerLink = typeof musicPlayerLink;
type MusicPlayerComponent = DefineSetupFnComponent<any, any, any, { musicPlayerLink: typeof musicPlayerLink }, any>;
type MusicEditorComponent = DefineSetupFnComponent<any, { 'update:playerData': (value: string) => any; }, any, { "playerData": string }, any>;

type MusicPlayer = {
    player: MusicPlayerComponent,
    editor?: MusicEditorComponent,
    colour?: string,
};

const NotExistRaw = markRaw(NotExist);

/**
 * 播放器组件
 */
const musicPlayers: { [key: string]: MusicPlayer } = {
    "Test": {
        player: markRaw(TestMusicPlayer),
    },
    "Bilibili": {
        player: markRaw(BilibiliMusicPlayer),
        editor: markRaw(BilibiliMusicEditor),
        colour: "#fb7299",
    }
}

/**
 * 获取歌曲播放器组件
 */
export const getMusicPlayer = (name?: string): Component => {
    if (name === undefined) { return NotExistRaw; }
    const player = musicPlayers[name];
    if (!player) { return NotExistRaw; }
    return player.player;
}

/**
 * 获取音乐编辑器组件
 */
export const getMusicEditor = (name?: string): Component | undefined => {
    if (name === undefined) { return undefined; }
    const player = musicPlayers[name];
    if (!player) { return undefined; }
    return player.editor;
}

/**
 * 获取播放器颜色
 */
export const getMusicPlayerColour = (name?: string): string | undefined => {
    if (name === undefined) { return undefined; }
    return musicPlayers[name]?.colour;
}
