<script lang="ts" setup>
import { useMusicPlayList } from '@renderer/states/playListStorage';
import { ref, toRef, watch } from 'vue';

const props = defineProps<{
    musicName: string
}>();
const musicPlayList = useMusicPlayList(toRef(props, 'musicName'));
function getInitEditData() {
    return {
        name: musicPlayList.value?.name,
        musicListInconUrl: musicPlayList.value?.musicListInconUrl,
        description: musicPlayList.value?.musicList?.description,
        author: musicPlayList.value?.musicList?.author,
        authorIconUrl: musicPlayList.value?.musicList?.authorIconUrl
    }
}
const edits = ref(getInitEditData());
watch(musicPlayList, () => {
    edits.value = getInitEditData();
});


</script>
<template>
    <div class="edit-play-list-lnfo-main-box">
        <div class="edit-play-list-lnfo-title">编辑歌单信息</div>
        <div class="edit-play-list-lnfo">
            <!-- 标题简介 -->
            <div class="from">
                <div class="from-line">
                    <div class="from-line-title">歌单名称{{ edits }}</div>
                    <div class="from-line-content">
                        <input type="text"  />
                    </div>
                </div>
            </div>
            <!-- 图片 -->
        </div>
        <div class="edit-play-list-button-greap">

        </div>
    </div>
</template>
<style scoped>
.edit-play-list-lnfo-title {
    font-size: 1.5rem;
    font-weight: bolder;
    color: var(--edit-play-list-lnfo-title-color);
}

.edit-play-list-lnfo-main-box {
    padding: 1rem;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}
</style>