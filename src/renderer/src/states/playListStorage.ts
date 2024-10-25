import { ipcPlayListsApi } from "@renderer/ipcAPI"
import { reactive, readonly, Ref, ref, toRefs } from "vue";
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
    for (const i in value) {
        await ipcPlayListsApi.setPlaylistIndex(value[i], parseInt(i));
    }
}

type MusicPlayList = {
    /** 简介 */
    description?: string,
    /** 作者 */
    author?: string,
    /** 作者头像 */
    authorIconUrl?: string,
    /** 列表 */
    list?: Music[],
    /** 列表图标url */
    iconUrl?: string,
}

export const playListStorage = readonly({
    playLists: playLists,
    /** 保存一个播放列表 */
    async savePlayList(name: string, musicList: MusicPlayList) {
        await ipcPlayListsApi.savePlaylistData(name, JSON.stringify(musicList));
        playLists.value = await loadPlayList();
    },
    /** 读取一个播放列表 */
    async readPlayList(name: string): Promise<MusicPlayList> {
        try {
            return JSON.parse(await ipcPlayListsApi.readPlaylistData(name) || "{}")
        } catch (e) {
            console.error(e);
            return {};
        }
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


function newMusicPlayList(fromName: string) {
    const name = ref(fromName);
    let loaded = ref(false);
    let musicList = ref<MusicPlayList>({});

    /** 保存修改 */
    async function save() {
        if (!loaded) {
            return;
        }
        await playListStorage.savePlayList(name.value, musicList.value);
    }

    async function load() {
        musicList.value = await playListStorage.readPlayList(name.value);
        loaded.value = true;
    }
    load();

    return reactive({
        name: readonly(name),
        loaded: readonly(loaded),
        musicList,
        save,
    });
}

/** 播放列表缓存 */
const musicPlayLists: ReturnType<typeof newMusicPlayList>[] = [];
/** 播放列表管理 */
export function useMusicPlayList(fromName: string):ReturnType<typeof newMusicPlayList> {
    let has = musicPlayLists.find(a => a.name === fromName);
    if (has) {
        return has;
    }
    const newOne = newMusicPlayList(fromName);
    musicPlayLists.push(newOne);
    return newOne;
}


// @ts-ignore TODO: 调试方便，到时候删除 fix this
window.playListStorage = playListStorage;
