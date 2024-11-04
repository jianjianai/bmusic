import { ref } from "vue";
import { type Music } from "../musicPlayerStates";
import { MusicPlayListOnLoc } from "../playListStorage";

export const createNewPlayListMusic = ref<Music>();
export const createNewPlayListMusicOnLoc = ref<MusicPlayListOnLoc>();
export const createNewPlayListAndOpen = ref(false);

export function createPlayList(music: Music,open?:boolean) {
    createNewPlayListMusic.value = music;
    createNewPlayListAndOpen.value = open || false;
}

export function createPlayListByLoc(music: MusicPlayListOnLoc,open?:boolean) {
    createNewPlayListMusicOnLoc.value = music;
    createNewPlayListAndOpen.value = open || false;
}