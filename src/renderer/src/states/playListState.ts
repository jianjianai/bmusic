import { computed, readonly, Ref, ref, watch } from "vue";
import { Music, musicPlayer } from "./musicPlayerStates";

export const playListOpen = ref(false);
// 播放模式 RepeatOne: 单曲循环 RepeatAll: 列表循环 SequentialPlay: 顺序播放 ShufflePlay: 随机播放
export type PlayMode = "RepeatOne"|"RepeatAll"|"SequentialPlay"|"ShufflePlay";
const playMode = ref<PlayMode>("RepeatAll");

// 当前播放音乐
const currentIndex = ref(-1);

// 播放列表
const list: Ref<Music[]> = ref([]);

const currentMusic = computed(() => list.value[currentIndex.value]);

//如果播放器的当前音乐不是播放列表里的当前音乐，这设置当前index为-1
watch(() => musicPlayer.currentMusic, () => {
    if (musicPlayer.currentMusic !== currentMusic.value) {
        currentIndex.value = -1;
    }
});

//如果当前列表音乐变化则更新musicPlayer
watch(currentMusic, () => {
    if (currentMusic.value) {
        musicPlayer.setCurrentMusic(currentMusic.value);
    }
});

export const playList = readonly({
    open: playListOpen,
    list: list,
    currentIndex: currentIndex,
    currentMusic: currentMusic,
    playMode: playMode,
    setCurrentIndex(index: number) {
        currentIndex.value = index;
    },
    setList(musicList: Music[]) {
        currentIndex.value = -1;
        list.value = musicList;
    },
    setPlayMode(mode: PlayMode) {
        playMode.value = mode;
    }
});

// @ts-ignorev TODO 测试用到时候删除
window.playList = playList;