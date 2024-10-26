import { ipcPlayListsApi } from "@renderer/ipcAPI"
import { computed, reactive, readonly, Ref, ref, toRefs, watch } from "vue";
import { musicKey, type Music } from "./musicPlayerStates";

/** 加载播放列表 */
async function loadPlayList(): Promise<string[]> {
    return (await ipcPlayListsApi.getPlaylist()).filter((a)=>a.name !== MYLIKEED_PLAYLIST_NAME).sort((a, b) => a.index - b.index).map(n => n.name);
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
    list: Music[],
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
            const data = JSON.parse(await ipcPlayListsApi.readPlaylistData(name) || "{}");
            if(!Array.isArray(data.list)){
                data.list = [];
            }
            return data;
        } catch (e) {
            console.error(e);
            return {list:[]};
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
    let musicList = ref<MusicPlayList>();
    let deleteed = ref(false);

    /** 保存修改 */
    async function save() {
        if (!loaded) {
            return;
        }
        await playListStorage.savePlayList(name.value, musicList.value!);
    }

    async function load() {
        musicList.value = await playListStorage.readPlayList(name.value);
        loaded.value = true;
    }


    /** 重命名歌单 */
    async function rename(newName: string) {
        await playListStorage.renamePlayList(name.value, newName);
        name.value = newName;
    }

    /** 删除歌单 */
    async function deleteThis() {
        await playListStorage.deletePlayList(name.value);
        deleteed.value = true;
    }

    return reactive({
        name: readonly(name),
        loaded: readonly(loaded),
        onLoaded: load(),
        musicList,
        deleteed: readonly(deleteed),
        save,
        rename,
        deleteThis,
    });
}

/** 播放列表缓存 */
const musicPlayLists: ReturnType<typeof newMusicPlayList>[] = [];
/** 播放列表管理 */
export function useMusicPlayList(fromName: string): ReturnType<typeof newMusicPlayList> {
    let has = musicPlayLists.find(a => a.name === fromName);
    if (has) {
        return has;
    }
    const newOne = newMusicPlayList(fromName);
    musicPlayLists.push(newOne);
    return newOne;
}

export const MYLIKEED_PLAYLIST_NAME = "我喜欢的";

let likeedPlayList: ReturnType<typeof newLikeedPlayList> | null = null;

function newLikeedPlayList() {
    const likeed = useMusicPlayList(MYLIKEED_PLAYLIST_NAME);
    //key音乐key,value音乐在列表中的索引
    const musicMap = computed<Map<string, number>>(()=>{
        const map = new Map<string, number>();
        likeed.musicList?.list?.forEach((n, i) => {
            map.set(musicKey(n), i);
        });
        return map;
    });
    likeed.onLoaded.then(() => {
        if (!likeed.musicList!.description) {
            likeed.musicList!.description = "我喜欢的音乐";
        }
        if (!likeed.musicList!.author) {
            likeed.musicList!.author = "我";
        }
    });
    
    // 判断音乐是否已经喜欢
    function isLikeed(music: Music):boolean {
        return musicMap.value.has(musicKey(music));
    }

    // 查找音乐索引
    function findIndex(music: Music) {
        return musicMap.value.get(musicKey(music));
    }

    // 添加音乐到喜欢列表
    function addLikeed(music: Music) {
        if (findIndex(music)!=undefined || !likeed.loaded) {
            return;
        }
        likeed.musicList!.list!.push(music);
        // musicMap.set(musicKey(music), likeed.musicList!.list!.length - 1);
        likeed.save();
    }

    // 从喜欢列表删除
    function removeLikeed(music: Music) {
        const index = findIndex(music);
        if (index === undefined || !likeed.loaded) {
            return;
        }
        likeed.musicList!.list!.splice(index, 1);
        likeed.save();
    }

    return reactive({
        ...toRefs(likeed),
        isLikeed,
        findIndex,
        addLikeed,
        removeLikeed,
    });
}

/** 我喜欢的音乐 */
export function useLikeedPlayList() {
    if (likeedPlayList) {
        return likeedPlayList;
    }
    likeedPlayList = newLikeedPlayList();
    return likeedPlayList;
}


// @ts-ignore TODO: 调试方便，到时候删除 fix this
window.playListStorage = playListStorage;
