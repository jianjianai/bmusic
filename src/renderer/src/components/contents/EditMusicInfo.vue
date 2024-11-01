<script setup lang="ts">
import { useMusicPlayList } from '@renderer/states/playListStorage';
import { computed, ref, toRef, watch } from 'vue';
import ImgDiv from '../allSmall/ImgDiv.vue';
import UniversalInput from '../allSmall/UniversalInput.vue';
import { cropperImg } from '@renderer/states/cropperImg/cropperImg';
import { setContent } from '@renderer/states/contentState';
import PlayListContents from './PlayListContents.vue';
import UniversalButton from '../allSmall/UniversalButton.vue';
import MusicEditers from '../musicPlayers/MusicEditers.vue';

const props = defineProps<{
    /** 编辑哪个歌单 */
    musicListName: string,
    /** 第几个音乐 */
    editIndex: number
}>();
const musicPlayList = useMusicPlayList(toRef(props, 'musicListName'));
const eitMusic = computed(() => musicPlayList.value?.musicList?.list?.[props.editIndex]);
const editInfo = ref<{
    musicName?: string,
    musicAuthor?: string,
    iconUrl?: string,
    playerData?: string
    playerName?: string
}>({});
watch(eitMusic, (newVle) => {
    editInfo.value = {
        musicName: newVle?.musicName,
        musicAuthor: newVle?.musicAuthor,
        iconUrl: newVle?.iconUrl,
        playerData: newVle?.playerData,
        playerName: newVle?.playerName
    }
}, { immediate: true });

//图片编辑
function uploadPlayListIcon(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }
    cropperImg({
        editImg: file,
        editok: (blob) => {
            const reader = new FileReader();
            reader.onload = () => {
                editInfo.value.iconUrl = reader.result as string;
            };
            reader.readAsDataURL(blob);
        }
    });
}

function cancel() {
    setContent(PlayListContents, { musicListName: props.musicListName });
}

const saveing = ref(false);
function save() {
    saveing.value = true;
    eitMusic.value!.musicName = editInfo.value.musicName!;
    eitMusic.value!.musicAuthor = editInfo.value.musicAuthor!;
    eitMusic.value!.iconUrl = editInfo.value.iconUrl!;
    eitMusic.value!.playerData = editInfo.value.playerData!;
    musicPlayList.value?.save();
    setContent(PlayListContents, { musicListName: props.musicListName });
}

</script>
<template>
    <div class="edit-music-lnfo-main-box" v-if="!saveing">
        <div class="edit-music-lnfo-title">编辑音乐信息</div>
        <div class="edit-music-lnfo-title-small">基本信息</div>
        <div class="edit-music-lnfo">
            <!-- 标题简介 -->
            <div class="from">
                <div class="from-line">
                    <div class="from-line-title">名称:</div>
                    <UniversalInput v-model="editInfo.musicName" placeholder="音乐名称" class="from-line-content-input" />
                </div>
                <div class="from-line">
                    <div class="from-line-title">作者:</div>
                    <UniversalInput v-model="editInfo.musicAuthor" placeholder="音乐作者" class="from-line-content-input" />
                </div>
            </div>
            <!-- 图片 -->
            <ImgDiv class="music-icon" :src="editInfo.iconUrl">
                <label class="icon-input" for="play-list-icon-input">
                    <input type="file" accept="image/*" @change="uploadPlayListIcon" id="play-list-icon-input"
                        style="display: none;" />
                    <div class="icon-input-text">修改图片</div>
                </label>
            </ImgDiv>
        </div>
        <!-- 播放器编辑器 -->
        <MusicEditers v-model="editInfo" :key="eitMusic?.playerData">
            <div class="edit-music-lnfo-title-small">{{ eitMusic?.playerName }}</div>
        </MusicEditers>
        <!-- 按钮组 -->
        <div class="edit-play-list-button-greap">
            <UniversalButton type="ok" text="保存" @click="save" />
            <UniversalButton type="other" text="取消" @click="cancel" />
        </div>
    </div>
    <div class="edit-music-lnfo-main-box" v-else>
        <div class="edit-music-lnfo-title">保存中...</div>
    </div>
</template>
<style scoped>
.edit-play-list-button-greap {
    margin: 1rem 0;
    display: flex;
    gap: 1rem;
}

.icon-input:hover {
    background-color: var(--edit-music-icon-input-bg-hover-color);
}

.icon-input:hover .icon-input-text {
    display: block;
}

.icon-input-text {
    color: var(--edit-music-icon-input-text-color);
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

.music-icon {
    width: 6rem;
    height: 6rem;
    border-radius: 1rem;
    margin-left: 1rem;
}

.from-line-content-input {
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

.edit-music-lnfo {
    display: flex;
    align-items: center;
}

.edit-music-lnfo-title-small {
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
    font-size: 1rem;
    font-weight: bolder;
    color: var(--edit-music-lnfo-title-smell-color);
}

.edit-music-lnfo-title {
    font-size: 1.5rem;
    font-weight: bolder;
    color: var(--edit-music-lnfo-title-color);
}

.edit-music-lnfo-main-box {
    padding: 1rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
}
</style>