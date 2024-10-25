import { ipcPlayListsApi } from "@renderer/ipcAPI"
import { readonly, Ref, ref } from "vue";
import { type Music } from "./musicPlayerStates";

/** 加载播放列表 */
async function loadPlayList(): Promise<string[]> {
    return (await ipcPlayListsApi.getPlaylist()).sort((a, b) => a.index - b.index).map(n => n.name);
}

/** 播放列表列表 */
const playLists: Ref<string[]> = ref([]);
// 初次加载播放列表
loadPlayList().then(n => playLists.value = n);

/** 保存播放列表排序 */
async function savePlayListIndex() {
    const value = playLists.value;
    for(const i in value){
        await ipcPlayListsApi.setPlaylistIndex(value[i], parseInt(i));
    }
}


export const playListStorage = readonly({
    playLists: playLists,
    /** 保存一个播放列表 */
    async savePlayList(name: string, musicList: Music[]) {
        await ipcPlayListsApi.savePlaylistData(name, JSON.stringify(musicList));
        playLists.value = await loadPlayList();
    },
    /** 读取一个播放列表 */
    async readPlayList(name: string): Promise<Music[]> {
        return JSON.parse(await ipcPlayListsApi.readPlaylistData(name) || "[]");
    },
    /** 删除一个播放列表 */
    async deletePlayList(name: string) {
        await ipcPlayListsApi.deletePlaylist(name);
        playLists.value = await loadPlayList();
    },
    /** 重命名一个播放列表 */
    async renamePlayList(oldName: string, newName: string) {
        await ipcPlayListsApi.renamePlaylist(oldName, newName);
        playLists.value = await loadPlayList();
    },
    /** 将指定索引的播放列表移动到指定索引 */
    async movePlayList(from: number, to: number) {
        const value = playLists.value;
        const item = value.splice(from, 1)[0];
        value.splice(to, 0, item);
        playLists.value = value;
        await savePlayListIndex();
    }
});


// @ts-ignore TODO: 调试方便，到时候删除 fix this
window.playListStorage = playListStorage;
