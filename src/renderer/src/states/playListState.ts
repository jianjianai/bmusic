import { computed, readonly, Ref, ref, watch } from "vue";
import { Music, musicPlayer } from "./musicPlayerStates";

export const playListOpen = ref(false);
// 播放模式 RepeatOne: 单曲循环 RepeatAll: 列表循环 SequentialPlay: 顺序播放 ShufflePlay: 随机播放
export type PlayMode = "RepeatOne" | "RepeatAll" | "SequentialPlay" | "ShufflePlay";
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



// 如果音乐播放完毕则播放下一首
watch(() => musicPlayer.ended, (ended) => {
    if (ended && currentIndex.value >= 0) {
        if (playMode.value === "RepeatOne") {
            musicPlayer.requestPlay();
        } else if (playMode.value === "RepeatAll") {
            currentIndex.value = (currentIndex.value + 1) % list.value.length;
            musicPlayer.requestPlay();
        } else if (playMode.value === "SequentialPlay") {
            if (currentIndex.value < list.value.length - 1) {
                currentIndex.value++;
                musicPlayer.requestPlay();
            }
        } else if (playMode.value === "ShufflePlay") {
            currentIndex.value = Math.floor(Math.random() * list.value.length);
            musicPlayer.requestPlay();
        }
    }
});


export const playList = readonly({
    open: playListOpen,
    list: list,
    currentIndex: currentIndex,
    currentMusic: currentMusic,
    playMode: playMode,
    /** 设置当前播放音乐 */
    setCurrentIndex(index: number) {
        currentIndex.value = index;
    },
    /** 设置播放列表 */
    setList(musicList: Music[]) {
        currentIndex.value = -1;
        list.value = musicList;
    },
    /** 设置播放模式 */
    setPlayMode(mode: PlayMode) {
        playMode.value = mode;
    },
    /**  下一曲,如果到最后一首则从第一首开始 */
    next() {
        if (currentIndex.value < list.value.length - 1) {
            currentIndex.value++;
            musicPlayer.requestPlay();
        } else {
            currentIndex.value = 0;
            musicPlayer.requestPlay();
        }
    },
    /** 上一曲,如果到最前则中最后一首开始 */
    prev() {
        if (currentIndex.value > 0) {
            currentIndex.value--;
            musicPlayer.requestPlay();
        } else {
            currentIndex.value = list.value.length - 1;
            musicPlayer.requestPlay();
        }
    },
});

// @ts-ignorev TODO 测试用到时候删除
window.playList = playList;