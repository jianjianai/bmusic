import { DefineComponent, reactive,markRaw } from "vue";
import Recommend from "../components/contents/Recommend.vue";

/**
 * 内容状态
 */
export const contentState = reactive<{
    /**
     * 内容显示组件
     */
    displayComponent:DefineComponent<any,any,any>
}>({
    displayComponent:markRaw(Recommend)
});