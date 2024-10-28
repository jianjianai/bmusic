import { computed, DefineComponent, shallowRef } from "vue";
import Recommend from "../components/contents/Recommend.vue";

/**
 * 显示组件
 */
const displayAndData = shallowRef<{
    display: DefineComponent<any, any, any>,
    data: unknown
}>({
    /** 显示组件 */
    display: Recommend,
    /** 内容数据 */
    data: null
});

/**
 * 内容数据
 */
export const contentData = computed(() => displayAndData.value.data);

/**
 * 内容显示组件
 */
export const contentDisplay = computed(() => displayAndData.value.display);

/**
 * 设置内容
 * @param newDisplay 新的显示组件
 * @param newData 新的数据
 */
export function setContent(newDisplay: DefineComponent<any, any, any>, newData: unknown = null) {
    displayAndData.value = {
        display: newDisplay,
        data: newData
    };
}

