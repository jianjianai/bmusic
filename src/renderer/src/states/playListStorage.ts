import { ipcPlayListsApi } from "@renderer/ipcAPI"
import { computed, onUnmounted, reactive, readonly, Ref, ref, watch } from "vue";
import { musicKey, type Music } from "./musicPlayerStates";

/** 加载播放列表 */
async function loadPlayList(): Promise<string[]> {
    return (await ipcPlayListsApi.getPlaylist()).sort((a, b) => a.index - b.index).map(n => n.name);
}

/** 播放列表列表 */
const playLists: Ref<string[]> = ref([]);
// 初次加载播放列表
loadPlayList().then(n => playLists.value = n);

/** 保存播放列表排序 */
async function savePlayListIndex(index: string[]) {
    for (const i in index) {
        await ipcPlayListsApi.setPlaylistIndex(index[i], parseInt(i));
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
    list: Music[]
}

// 不是保存在本地的播放列表，也就是临时播放列表
export type MusicPlayListOnLoc = {
    name: string,
    iconUrl?: string,
} & MusicPlayList

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
            if (!Array.isArray(data.list)) {
                data.list = [];
            }
            return data;
        } catch (e) {
            console.error(e);
            return { list: [] };
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
        await savePlayListIndex(value);
        playLists.value = await loadPlayList();
    },
    /** 读取播放列表图标 */
    async readPlayListIconUrl(name: string) {
        return await ipcPlayListsApi.readPlaylistIconUrl(name);
    },
    /** 保存播放列表图标 */
    async savePlayListIconUrl(name: string, data: Uint8Array) {
        await ipcPlayListsApi.savePlaylistIcon(name, data);
        playLists.value = await loadPlayList();
    },
    /** 按照指定列表顺序重新排序，列表中不存在的歌单排最前面，列表存在但歌单中不存在的则不管 */
    async sortPlayList(nameList: string[]) {
        const value = playLists.value;
        const newList = nameList.filter(n => value.includes(n));
        const noList = value.filter(n => !newList.includes(n));
        const newindex = [...noList, ...newList];
        await savePlayListIndex(newindex);
        playLists.value = await loadPlayList();
    },
});


function newMusicPlayList(fromName: string) {
    const name = ref(fromName);
    let loaded = ref(false);
    let musicList = ref<MusicPlayList>();
    let deleteed = ref(false);
    let musicListInconUrl = ref<string>();

    /** 保存修改 */
    async function save() {
        if (!loaded) {
            return;
        }
        await playListStorage.savePlayList(name.value, musicList.value!);
    }

    async function load() {
        musicList.value = await playListStorage.readPlayList(name.value);
        musicListInconUrl.value = await playListStorage.readPlayListIconUrl(name.value);
        loaded.value = true;
    }


    /** 重命名歌单 */
    async function rename(newName: string) {
        await playListStorage.renamePlayList(name.value, newName);
        name.value = newName;
    }

    /** 修改歌单图标 */
    async function setIcon(data: Uint8Array) {
        await playListStorage.savePlayListIconUrl(name.value, data);
        musicListInconUrl.value = await playListStorage.readPlayListIconUrl(name.value);
    }

    /** 删除歌单 */
    async function deleteThis() {
        await playListStorage.deletePlayList(name.value);
        deleteed.value = true;
    }

    //key音乐key,value音乐在列表中的索引
    const musicMap = computed<Map<string, number>>(() => {
        const map = new Map<string, number>();
        musicList.value?.list.forEach((n, i) => {
            map.set(musicKey(n), i);
        });
        return map;
    });

    // 判断音乐是否已经存在
    function hasMusic(music: Music): boolean {
        return musicMap.value.has(musicKey(music));
    }

    // 查找音乐索引
    function findMusicIndex(music: Music) {
        return musicMap.value.get(musicKey(music));
    }

    // 添加音乐到列表
    function addMusic(music: Music) {
        if (findMusicIndex(music) != undefined || !loaded.value) {
            return;
        }
        musicList.value!.list!.unshift(music);
        // musicMap.set(musicKey(music), likeed.musicList!.list!.length - 1);
        // save();
    }

    // 批量添加音乐到列表
    function addMusics(musics: Music[]) {
        if (!loaded.value) {
            return;
        }
        musicList.value!.list!.unshift(...musics);
    }

    // 从列表删除
    function removeMusic(music: Music) {
        const index = findMusicIndex(music);
        if (index === undefined || !loaded.value) {
            return;
        }
        musicList.value!.list!.splice(index, 1);
        // save();
    }

    return reactive({
        name: readonly(name),
        loaded: readonly(loaded),
        onLoaded: load(),
        musicListInconUrl: readonly(musicListInconUrl),
        musicList,
        deleteed: readonly(deleteed),
        save,
        rename,
        deleteThis,
        hasMusic,
        findMusicIndex,
        addMusic,
        removeMusic,
        setIcon,
        addMusics
    });
}

type Quote<T> = {
    quote: number,
    t: T,
    clearTimeoutID?: NodeJS.Timeout
}
/** 播放列表缓存,优化性能 */
const musicPlayLists: Quote<ReturnType<typeof newMusicPlayList>>[] = [];
/** 播放列表管理,优化性能，没有引用就卸载 */
export function useMusicPlayList(fromName: Ref<string | undefined>): Ref<ReturnType<typeof newMusicPlayList> | undefined> {
    function findOrNew(name: string) {
        let has = musicPlayLists.find(a => a.t.name === name);
        if (has) {
            has.quote++;
            clearTimeout(has.clearTimeoutID);
            return has;
        }
        const newOne = newMusicPlayList(name);
        const quote = { quote: 1, t: newOne };
        musicPlayLists.push(quote);
        return quote;
    }
    function reduceCitations(quote: Quote<ReturnType<typeof newMusicPlayList>>) {
        quote.quote--;
        if (quote.quote < 1) {
            //10秒后卸载
            clearTimeout(quote.clearTimeoutID);
            quote.clearTimeoutID = setTimeout(() => {
                const index = musicPlayLists.findIndex(a => a.t.name === quote.t.name);
                if (index >= 0) {
                    musicPlayLists.splice(index, 1);
                }
            }, 10000);
        }
    }
    const rRef = ref(fromName.value ? findOrNew(fromName.value) : null);
    watch(fromName, (n) => {
        if (rRef.value) {
            reduceCitations(rRef.value);
        }
        if (n) {
            rRef.value = findOrNew(n);
        } else {
            rRef.value = null;
        }
    });
    onUnmounted(() => {
        if (rRef.value) {
            reduceCitations(rRef.value);
        }
    });
    return computed(() => rRef.value?.t);
}

export const MYLIKEED_PLAYLIST_NAME = "我喜欢的";


/** 我喜欢的音乐 */
export function useLikeedPlayList() {
    const likeed = useMusicPlayList(ref(MYLIKEED_PLAYLIST_NAME));
    likeed.value!.onLoaded.then(() => {
        if (!likeed.value!.musicList!.description) {
            likeed.value!.musicList!.description = "我喜欢的音乐";
        }
        if (!likeed.value!.musicList!.author) {
            likeed.value!.musicList!.author = "我";
        }
    });
    return likeed;
}


// @ts-ignore TODO: 调试方便，到时候删除 fix this
window.playListStorage = playListStorage;
