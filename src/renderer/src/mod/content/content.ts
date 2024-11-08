//内容，播放器的内容显示组件

import { computed, type DefineSetupFnComponent, shallowRef } from "vue";
import Recommend from "./contents/Recommend.vue";

type ShowComponent<P> = DefineSetupFnComponent<any, any, any, P, any>;
/**
 * 显示组件
 */
const displayAndData = shallowRef<{
    display: ShowComponent<any>,
    data: any
}>({
    /** 显示组件 */
    display: Recommend,
    /** 内容数据 */
    data: {}
});

/**
 * 内容数据
 */
export const contentData = computed(() => displayAndData.value.data);

/**
 * 内容显示组件
 */
export const contentDisplay = computed(() => displayAndData.value.display);

type ComponentProps<T> = T extends ShowComponent<infer P> ? P : never;
/**
 * 设置内容
 * @param newDisplay 新的显示组件
 * @param newData 新的数据
 */
export function setContent<T extends ShowComponent<any>>(newDisplay: T, newData: ComponentProps<T>) {
    displayAndData.value = {
        display: newDisplay as any,
        data: newData
    };
};

