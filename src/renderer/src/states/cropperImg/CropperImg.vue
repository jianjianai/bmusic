<script lang="ts" setup>
import { computed, ref } from 'vue';
import { cropperImgInfo } from './cropperImg';
import { VueCropper } from "vue-cropper";

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
            <div class="ok-button" @click="ok">确定</div>
            <div class="cancel-button" @click="close">取消</div>
        </div>
    </div>
</template>
<style scoped>
.edit-img-buttons {
    display: flex;
    gap: 1rem;
}

.cancel-button {
    background-color: var(--edit-img-cancel-bg-color);
    color: var(--edit-img-cancel-color);
}

.ok-button {
    background-color: var(--edit-img-ok-bg-color);
    color: var(--edit-img-ok-color);
}

.ok-button,
.cancel-button {
    cursor: pointer;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
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