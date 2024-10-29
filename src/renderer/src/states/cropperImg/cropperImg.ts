import { ref } from "vue";

export type CropperImgConfig = {
    /** 编辑完成 */
    editok: (ok: Blob) => void;
    /** 编辑取消 */
    editcancel?: () => void;
    /** 编辑图片 */
    editImg: Blob | string;
}
export const cropperImgInfo = ref<CropperImgConfig>();

export function cropperImg(confg:CropperImgConfig){
    cropperImgInfo.value = confg;
}
