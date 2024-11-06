/** 处理弹出组件 */

import { type DefineSetupFnComponent, markRaw, reactive } from "vue";
type ShowComponent<P> = DefineSetupFnComponent<any, any, any, P, any>;
type ComponentProps<T> = T extends ShowComponent<infer P> ? P : never;

let keyCount = Math.floor(Math.random() * 10000);

// 弹出组件
export const popUpComponents = reactive<{ component: ShowComponent<any>, data: any, popUpComponentKey: number }[]>([]);

/**
 * 弹出一个组件
 * @param component  组件
 * @param data  数据
 */
export function openPopUpComponent<T extends ShowComponent<any>>(component: T, data: Omit<ComponentProps<T>, 'closePopUpSelf'>): number {
    keyCount++;
    popUpComponents.push({ component: markRaw(component), data: data, popUpComponentKey: keyCount });
    return keyCount;
}

/**
 * 移除一个组件
 * @param key  组件的key
 */
export function closePopUpComponent(key: number) {
    const index = popUpComponents.findIndex(a => a.popUpComponentKey === key);
    if (index >= 0) {
        popUpComponents.splice(index, 1);
    }
}