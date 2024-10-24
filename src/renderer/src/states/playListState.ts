import { readonly, Ref, ref } from "vue";
import { Music } from "./musicPlayerStates";

export const playListOpen = ref(false);

// 当前播放音乐
const current = ref(0);

// 播放列表
const list:Ref<Music[]> = ref([
    {
        musicName: "测试音乐",
        musicAuthor: "测试作者",
        iconUrl: "file:///C:/Users/Administrator/Pictures/14545e2b51971e71530c558e8463d867.png",
        playerName: "TestMusicPlayer",
        playerData: ""
    }
]);

export const playList = readonly({
    open: playListOpen,
    list: list,
    current: current,
});