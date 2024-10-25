import { DefineComponent, readonly, ref, shallowRef } from "vue";
import Recommend from "../components/contents/Recommend.vue";

/** 显示组件 */
const display = shallowRef<DefineComponent<any,any,any>>(Recommend);
/** 内容数据 */
const data = ref<unknown>(null);

/**
 * 内容状态
 */
export const contentState = readonly({
    display: display,
    data: data,
    setDisplay(newDisplay:DefineComponent<any,any,any>,newData:any = null){
        display.value = newDisplay;
        data.value = newData;
    }
});