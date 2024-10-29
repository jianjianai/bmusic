<script lang="ts" setup>
import { computed, ref } from 'vue';
import { cropperImgInfo } from './cropperImg';
import { VueCropper } from "vue-cropper";
import UniversalButton from '@renderer/components/allSmall/UniversalButton.vue';

const cropper = ref();
const editImgBlobUrl = computed(() => {
    const editImg = cropperImgInfo.value?.editImg;
    if (editImg instanceof Blob) {
        return URL.createObjectURL(editImg);
    }
    return editImg;
});
function close() {
    const info = cropperImgInfo.value;
    cropperImgInfo.value = undefined;
    info?.editcancel?.();
}

function ok() {
    cropper.value.getCropBlob(data => {
        const info = cropperImgInfo.value;
        cropperImgInfo.value = undefined;
        info?.editok?.(data);
    });
}

</script>
<template>
    <div class="edit-img">
        <div class="eidt-img-title">调整图片</div>
        <div class="edit-img-cropper">
            <VueCropper ref="cropper" :img="editImgBlobUrl" :outputSize="0.5" :outputType="'webp'" :fixed="true"
                :fixedNumber="[1, 1]" :centerBox="true" :autoCrop="true" :fixedBox="true" :canMoveBox="false" :infoTrue="true">
            </VueCropper>
        </div>
        <div class="edit-img-buttons">
            <UniversalButton type="ok" text="确定" @click="ok" />
            <UniversalButton type="other" text="取消" @click="close" />
        </div>
    </div>
</template>
<style scoped>
.edit-img-buttons {
    display: flex;
    gap: 1rem;
}

.eidt-img-title {
    font-size: 1.2rem;
    font-weight: bolder;
    color: var(--edit-img-title-color);
}

.edit-img-cropper {
    width: 25rem;
    height: 20rem;
    border-radius: 1rem;
    overflow: hidden;
}

.edit-img {
    position: fixed;
    width: 30rem;
    background-color: var(--edit-img-bg-color);
    box-shadow: 0 0 1rem var(--edit-img-shadow-color);
    border-radius: 1rem;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem 0;
}
</style>