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

const props = defineProps<{
    musicName: string
}>();
const musicPlayList = useMusicPlayList(toRef(props, 'musicName'));
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
    if (edits.value.name != props.musicName && playListStorage.playLists.includes(edits.value.name)) {
        putNotification({ type: 'error', message: "歌单名称已存在" });
        saveing.value = false;
        return;
    }
    if (edits.value.name != props.musicName && props.musicName == MYLIKEED_PLAYLIST_NAME) {
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
    if (edits.value.name != props.musicName) {
        await musicPlayList.value?.rename(edits.value.name);
    }
    setContent(PlayListContents, { musicName: edits.value.name });
    saveing.value = false;
}

// 取消
function cancel() {
    setContent(PlayListContents, { musicName: props.musicName });
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
    <div class="edit-play-list-lnfo-main-box">
        <div class="edit-play-list-lnfo-title">编辑歌单信息</div>
        <div class="edit-play-list-lnfo">
            <!-- 标题简介 -->
            <div class="from">
                <div class="from-line">
                    <div class="from-line-title">名称:</div>
                    <label class="from-line-content-input name" for="name-input">
                        <input class="name-input" id="name-input" type="text" v-model="edits.name" />
                    </label>
                </div>
                <div class="from-line">
                    <div class="from-line-title">简介:</div>
                    <label class="from-line-content-input description" for="description-input">
                        <textarea class="description-input" id="description-input"
                            v-model="edits.description"></textarea>
                    </label>
                </div>
            </div>
            <!-- 图片 -->
            <ImgDiv class="play-list-icon" :src="musicListInconBlobUrl || musicPlayList?.musicListInconUrl">
                <label class="icon-input" for="play-list-icon-input">
                    <input type="file" accept="image/*" @change="uploadPlayListIcon" id="play-list-icon-input"
                        style="display: none;" />
                    <div class="icon-input-text">修改图片</div>
                </label>
            </ImgDiv>
        </div>
        <div class="line-line"></div>

        <!-- 作者信息 -->
        <div class="edit-play-list-lnfo-title">编辑作者信息</div>
        <div class="edit-play-list-lnfo">
            <!-- 标题简介 -->
            <div class="from">
                <div class="from-line">
                    <div class="from-line-title">昵称:</div>
                    <label class="from-line-content-input name" for="name-input">
                        <input class="name-input" id="name-input" type="text" v-model="edits.author" />
                    </label>
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

.line-line {
    width: min(100% - 2rem, 54rem);
    border-bottom: 0.1rem solid var(--edit-play-list-lnfo-line-color);
    margin-top: 2rem;
    margin-bottom: 1rem;

}

.name-input,
.description-input {
    flex: 1;
    color: var(--from-line-content-input-color);
    background-color: rgba(0, 0, 0, 0);
    border: 0;
    resize: none;
    outline: none;
    font-size: 0.9rem;
    font-family: auto;
}

.from-line-content-input.description {
    height: 10rem;
}

.from-line-content-input.name {
    height: 2rem;
}

.from-line-content-input {
    flex: 1;
    width: 0;
    display: flex;
    align-items: stretch;
    padding: 0 0.5rem;
    border: 0.1rem solid var(--from-line-content-input-border-color);
    border-radius: 0.5rem;
    background-color: var(--from-line-content-input-bg-color);
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

.play-list-icon {
    width: 10rem;
    height: 10rem;
    border-radius: 1rem;
    margin-left: 1rem;
}

.edit-play-list-lnfo {
    display: flex;
    margin-top: 1rem;
}

.edit-play-list-lnfo-title {
    font-size: 1.5rem;
    font-weight: bolder;
    color: var(--edit-play-list-lnfo-title-color);
}

.edit-play-list-lnfo-main-box {
    padding: 1rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
}
</style>