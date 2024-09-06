import { DefineComponent, reactive } from "vue";
import Recommend from "../components/contents/Recommend.vue";

/**
 * 内容状态
 */
export const ContentState = reactive<{
    /**
     * 内容显示组件
     */
    displayComponent:DefineComponent<any,any,any>
}>({
    displayComponent:Recommend
});