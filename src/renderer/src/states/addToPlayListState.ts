import { ref } from "vue";
import { type Music } from "./musicPlayerStates";

export const addToPlayListMusic = ref<Music>();

export function addToPlayList(music: Music) {
    addToPlayListMusic.value = music;
}