import { computed, readonly, Ref, ref, watch } from "vue";
import { Music, musicPlayer } from "./musicPlayerStates";

export const playListOpen = ref(false);

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
    setCurrentIndex(index: number) {
        currentIndex.value = index;
    },
    setList(musicList: Music[]) {
        currentIndex.value = -1;
        list.value = musicList;
    }
});

// @ts-ignorev TODO 测试用到时候删除
window.playList = playList;