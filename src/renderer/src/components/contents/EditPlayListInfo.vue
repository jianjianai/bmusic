<script lang="ts" setup>
import { MYLIKEED_PLAYLIST_NAME, playListStorage, useMusicPlayList } from '@renderer/states/playListStorage';
import { ref, shallowRef, toRef, watch } from 'vue';
import ImgDiv from '../allSmall/ImgDiv.vue';
import { putNotification } from '@renderer/states/notification/notification';
import { setContent } from '@renderer/states/contentState';
import PlayListContents from './PlayListContents.vue';
import 'vue-cropper/dist/index.css'
import { cropperImg } from '@renderer/states/cropperImg/cropperImg';
import UniversalButton from '../allSmall/UniversalButton.vue';
import UniversalInput from '../allSmall/UniversalInput.vue';
import UniversalTextarea from '../allSmall/UniversalTextarea.vue';

const props = defineProps<{
    musicListName: string
}>();
const musicPlayList = useMusicPlayList(toRef(props, 'musicListName'));
function getInitEditData() {
    return {
        name: musicPlayList.value?.name,
        description: musicPlayList.value?.musicList?.description,
        author: musicPlayList.value?.musicList?.author,
        authorIconUrl: musicPlayList.value?.musicList?.authorIconUrl
    }
}

// 编辑后的musicListIncon
const musicListInconBlob = shallowRef<Blob>();
const musicListInconBlobUrl = ref<string>();
watch(musicListInconBlob, async (newVal) => {
    if (newVal) {
        musicListInconBlobUrl.value = URL.createObjectURL(newVal);
    } else {
        musicListInconBlobUrl.value = '';
    }
});

const edits = ref(getInitEditData());
watch(musicPlayList, () => {
    edits.value = getInitEditData();
});

const saveing = ref(false);
async function save() {
    saveing.value = true;
    if (!edits.value.name) {
        putNotification({ type: 'error', message: "歌单名不能为空" });
        saveing.value = false;
        return;
    }
    const invalidChars = /[<>:"/\\|?*\x00-\x1F]/;
    if (invalidChars.test(edits.value.name)) {
        putNotification({ type: 'error', message: "歌单名中不能含有特殊字符" });
        saveing.value = false;
        return;
    }
    if (edits.value.name != props.musicListName && playListStorage.playLists.includes(edits.value.name)) {
        putNotification({ type: 'error', message: "歌单名称已存在" });
        saveing.value = false;
        return;
    }
    if (edits.value.name != props.musicListName && props.musicListName == MYLIKEED_PLAYLIST_NAME) {
        putNotification({ type: 'error', message: "不能修改我喜欢的歌单名称" });
        saveing.value = false;
        return;
    }
    musicPlayList.value!.musicList!.description = edits.value.description;
    musicPlayList.value!.musicList!.author = edits.value.author;
    musicPlayList.value!.musicList!.authorIconUrl = edits.value.authorIconUrl;
    if (musicListInconBlob.value) {
        musicPlayList.value!.setIcon(new Uint8Array(await musicListInconBlob.value.arrayBuffer()));
    }
    await musicPlayList.value!.save();
    if (edits.value.name != props.musicListName) {
        await musicPlayList.value?.rename(edits.value.name);
    }
    setContent(PlayListContents, { musicListName: edits.value.name });
    saveing.value = false;
}

// 取消
function cancel() {
    setContent(PlayListContents, { musicListName: props.musicListName });
}

//图片编辑
function uploadPlayListIcon(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }
    cropperImg({
        editImg: file,
        editok: (blob) => {
            musicListInconBlob.value = blob;
        }
    });
}
function uploadAuthorIcon(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }
    cropperImg({
        editImg: file,
        editok: (blob) => {
            const reader = new FileReader();
            reader.onload = () => {
                edits.value.authorIconUrl = reader.result as string;
            };
            reader.readAsDataURL(blob);
        }
    });
}


</script>
<template>
    <div class="edit-music-lnfo-main-box">
        <div class="edit-music-lnfo-title">编辑歌单信息</div>
        <div class="edit-music-lnfo-title-small">歌单信息</div>
        <div class="edit-music-lnfo">
            <!-- 标题简介 -->
            <div class="from">
                <div class="from-line">
                    <div class="from-line-title">名称:</div>
                    <UniversalInput v-model="edits.name" placeholder="歌单名称"  class="from-line-content-input name"/>
                </div>
                <div class="from-line">
                    <div class="from-line-title">简介:</div>
                    <UniversalTextarea v-model="edits.description" placeholder="歌单简介" class="from-line-content-input description"/>
                </div>
            </div>
            <!-- 图片 -->
            <ImgDiv class="music-icon" :src="musicListInconBlobUrl || musicPlayList?.musicListInconUrl">
                <label class="icon-input" for="play-list-icon-input">
                    <input type="file" accept="image/*" @change="uploadPlayListIcon" id="play-list-icon-input"
                        style="display: none;" />
                    <div class="icon-input-text">修改图片</div>
                </label>
            </ImgDiv>
        </div>

        <!-- 作者信息 -->
        <div class="edit-music-lnfo-title-small">作者信息</div>
        <div class="edit-music-lnfo">
            <!-- 标题简介 -->
            <div class="from">
                <div class="from-line">
                    <div class="from-line-title">昵称:</div>
                    <UniversalInput v-model="edits.author" placeholder="作者昵称" class="from-line-content-input name"/>
                </div>
            </div>
            <!-- 图片 -->
            <ImgDiv class="author-icon" :src="edits.authorIconUrl || musicPlayList?.musicList?.authorIconUrl">
                <label class="icon-input" for="author-icon-input">
                    <input type="file" accept="image/*" @change="uploadAuthorIcon" id="author-icon-input"
                        style="display: none;" />
                    <div class="icon-input-text">修改图片</div>
                </label>
            </ImgDiv> 
        </div>

        <!-- 按钮组 -->
        <div class="edit-play-list-button-greap">
            <UniversalButton type="ok" text="保存" @click="save" v-if="!saveing" />
            <UniversalButton type="other" text="保存中..." v-else />
            <UniversalButton type="other" text="取消" @click="cancel" />
        </div>
    </div>
</template>
<style scoped>
.icon-input:hover {
    background-color: var(--edit-play-list-icon-input-bg-hover-color);
}

.icon-input:hover .icon-input-text {
    display: block;
}

.icon-input-text {
    color: var(--edit-play-list-icon-input-text-color);
    font-size: 1rem;
    text-align: center;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: none;
}

.icon-input {
    width: 100%;
    height: 100%;
    display: block;
    position: relative;
    cursor: pointer;
}

.edit-play-list-button-greap {
    display: flex;
    gap: 1rem;
}

.author-icon {
    width: 5rem;
    height: 5rem;
    margin-left: 2rem;
    border-radius: 3rem;
}



.from-line-content-input.description {
    height: 10rem;
}

.from-line-content-input.name {
    height: 2rem;
}

.from-line {
    display: flex;
    gap: 1rem;
}

.from-line-title {
    line-height: 2rem;
}

.from {
    display: flex;
    flex-direction: column;
    width: min(100% - 11rem, 45rem);
    gap: 1rem;
}

.music-icon {
    width: 10rem;
    height: 10rem;
    border-radius: 1rem;
    margin-left: 1rem;
}

.edit-music-lnfo {
    display: flex;
    margin-top: 1rem;
}

.edit-music-lnfo-title-small{
    margin-top: 1.5rem;
    font-size: 1rem;
    font-weight: bolder;
    color: var(--edit-play-list-lnfo-title-smell-color);
}

.edit-music-lnfo-title {
    font-size: 1.5rem;
    font-weight: bolder;
    color: var(--edit-play-list-lnfo-title-color);
}

.edit-music-lnfo-main-box {
    padding: 1rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
}
</style>