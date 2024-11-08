<script lang="ts" setup>
import { MusicPlayListOnLoc, playListStorage, useMusicPlayList } from '@renderer/mod/playListStorage';
import { ref, watch } from 'vue';
import { putNotification } from '@renderer/mod/notification/notification';
import UniversalButton from '@renderer/components/UniversalButton.vue';
import UniversalTextarea from '@renderer/components/UniversalTextarea.vue';
import { setContent } from '@renderer/mod/content/content';
import PlayListContents from '@renderer/mod/content/contents/PlayListContents.vue';
import { Music } from '@renderer/mod/playing/playing';



const props = defineProps<{
    music?: Music,
    playListMusicOnLoc?: MusicPlayListOnLoc
    okAndOpen?: boolean,
    closePopUpSelf: () => void;
}>();
const refAddToList = ref<string>()
const musicPlayList = useMusicPlayList(refAddToList);

let loading = false;
watch(musicPlayList, async (newVal) => {
    if (newVal) {
        loading = true;
        if (props.playListMusicOnLoc) {
            await newVal.onLoaded;
            newVal.musicList!.description = props.playListMusicOnLoc.description;
            newVal.musicList!.author = props.playListMusicOnLoc.author;
            newVal.musicList!.authorIconUrl = props.playListMusicOnLoc.authorIconUrl;
            newVal.musicList!.list = props.playListMusicOnLoc.list;
            await newVal.save();
            if (props.playListMusicOnLoc.iconUrl) {
                const response = await fetch(props.playListMusicOnLoc.iconUrl);
                const blob = await response.blob();
                const arrayBuffer = await blob.arrayBuffer();
                const uint8Array = new Uint8Array(arrayBuffer);
                await newVal.setIcon(uint8Array);
            }
            props.closePopUpSelf();
            loading = false;
            if (props.okAndOpen) {
                setContent(PlayListContents, { musicListName: newVal.name });
            }
        } else if (props.music) {
            await newVal.onLoaded;
            newVal.addMusic(props.music);
            await newVal.save();
            props.closePopUpSelf();
            loading = false;
            if (props.okAndOpen) {
                setContent(PlayListContents, { musicListName: newVal.name });
            }
        }
    }
});

const newPlayeListName = ref<string>(('playListMusicOnLoc' in props && props.playListMusicOnLoc?.name) || '');
function ok() {
    if (loading) {
        return;
    }
    if (!newPlayeListName.value) {
        putNotification({ type: 'error', message: '歌单名不能为空' });
        return;
    }
    const invalidChars = /[<>:"/\\|?*\x00-\x1F]/;
    if (invalidChars.test(newPlayeListName.value)) {
        putNotification({ type: 'error', message: "歌单名中不能含有特殊字符" });
        return;
    }
    if (playListStorage.playLists.includes(newPlayeListName.value)) {
        putNotification({ type: 'error', message: "歌单名称已存在" });
        return;
    }
    refAddToList.value = newPlayeListName.value;
}

function close() {
    if (loading) {
        return;
    }
    props.closePopUpSelf();
}

</script>
<template>
    <div style="position: fixed;">
        <div class="main-box-mask" @click="close()"></div>
        <div class="new-player-list-list-box">
            <!-- 输入歌单名称 -->
            <template v-if="!refAddToList">
                <div class="title">创建新歌单</div>
                <div>
                    <UniversalTextarea class="input-name" v-model="newPlayeListName" placeholder="输入歌单名称" />
                </div>
                <div class="button-grep">
                    <UniversalButton @click="ok" text="确定" type="ok" />
                    <UniversalButton @click="close" text="取消" type="other" />
                </div>
            </template>
            <!-- 创建中.. -->
            <template v-else>
                <div class="loading">
                    <div class="loading-text">{{ refAddToList }}</div>
                    <div class="loading-text">创建中...</div>
                </div>
            </template>
        </div>
    </div>
</template>
<style scoped>
.button-grep {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 1rem;
}

.input-name {
    width: 20rem;
    height: 5rem;
    margin: auto;
}

.new-player-list-list-box .title {
    text-align: center;
    margin-top: 1rem;
    font-size: 1.3rem;
    font-weight: bolder;
}

.main-box-mask {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vw;
    width: 100vw;
    height: 100vh;
}

.new-player-list-list-box {
    width: 30rem;
    background-color: var(--color-add-to-play-list-box-bg);
    box-shadow: 0 0 1rem 0.1rem var(--color-add-to-play-list-box-shadow);
    position: fixed;
    left: 50%;
    top: calc(50% - 2rem);
    transform: translate(-50%, -50%);
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    gap: 1.5rem;
}

.loading-text {
    font-size: 1rem;
    color: var(--color-add-to-play-list-box-loading-text);
    text-align: center;
    margin-top: 1rem;
}


.loading {
    flex: 1;
    height: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>