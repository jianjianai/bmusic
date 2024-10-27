import { ipcPlayListsApi } from "@renderer/ipcAPI"
import { computed, onUnmounted, reactive, readonly, Ref, ref, toRefs, watch } from "vue";
import { musicKey, type Music } from "./musicPlayerStates";

/** 加载播放列表 */
async function loadPlayList(): Promise<string[]> {
    return (await ipcPlayListsApi.getPlaylist()).filter((a) => a.name !== MYLIKEED_PLAYLIST_NAME).sort((a, b) => a.index - b.index).map(n => n.name);
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

    //key音乐key,value音乐在列表中的索引
    const musicMap = computed<Map<string, number>>(() => {
        const map = new Map<string, number>();
        musicList.value?.list.forEach((n, i) => {
            map.set(musicKey(n), i);
        });
        return map;
    });

    // 判断音乐是否已经喜欢
    function hasMusic(music: Music): boolean {
        return musicMap.value.has(musicKey(music));
    }

    // 查找音乐索引
    function findMusicIndex(music: Music) {
        return musicMap.value.get(musicKey(music));
    }

    // 添加音乐到喜欢列表
    function addMusic(music: Music) {
        if (findMusicIndex(music) != undefined || !loaded.value) {
            return;
        }
        musicList.value!.list!.push(music);
        // musicMap.set(musicKey(music), likeed.musicList!.list!.length - 1);
        save();
    }

    // 从喜欢列表删除
    function removeMusic(music: Music) {
        const index = findMusicIndex(music);
        if (index === undefined || !loaded.value) {
            return;
        }
        musicList.value!.list!.splice(index, 1);
        save();
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
        hasMusic,
        findMusicIndex,
        addMusic,
        removeMusic,
    });
}

type Quote<T> = {
    quote: number,
    t: T,
}
/** 播放列表缓存,优化性能 */
const musicPlayLists: Quote<ReturnType<typeof newMusicPlayList>>[] = [];
/** 播放列表管理,优化性能，没有引用就卸载 */
export function useMusicPlayList(fromName: Ref<string>): Ref<ReturnType<typeof newMusicPlayList>> {
    function findOrNew(name: string) {
        let has = musicPlayLists.find(a => a.t.name === name);
        if (has) {
            has.quote++;
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
            const index = musicPlayLists.findIndex(a => a.t.name === quote.t.name);
            if (index >= 0) {
                musicPlayLists.splice(index, 1);
            }
        }
    }
    const rRef = ref(findOrNew(fromName.value));
    watch(fromName, (n) => {
        reduceCitations(rRef.value);
        rRef.value = findOrNew(n);
    });
    onUnmounted(() => {
        reduceCitations(rRef.value);
    });
    return computed(() => rRef.value.t);
}

export const MYLIKEED_PLAYLIST_NAME = "我喜欢的";


/** 我喜欢的音乐 */
export function useLikeedPlayList() {
    const likeed = useMusicPlayList(ref(MYLIKEED_PLAYLIST_NAME));
    likeed.value.onLoaded.then(() => {
        if (!likeed.value.musicList!.description) {
            likeed.value.musicList!.description = "我喜欢的音乐";
        }
        if (!likeed.value.musicList!.author) {
            likeed.value.musicList!.author = "我";
        }
    });
    return likeed;
}


// @ts-ignore TODO: 调试方便，到时候删除 fix this
window.playListStorage = playListStorage;
