import { reactive } from "vue";
import CircleCheckSvg from "@renderer/components/svg/CircleCheckSvg.vue";
import CircleCloseOSvg from "@renderer/components/svg/CircleCloseOSvg.vue";

export class IconComponents {
    success = CircleCheckSvg;
    error = CircleCloseOSvg
}
export type NotificationType = keyof IconComponents;
export type NotificationInfo = {
    type: NotificationType;
    message: string;
    time?: number
}
export const notifications = reactive<{
    [key: number]: {
        notification: NotificationInfo;
        setTimeoutId: number;
    }
}>({});
export const iconComponents = new IconComponents();

let putNotificationId: number = 1;

/**弹出提示框*/
export function putNotification(notification: NotificationInfo) {
    const thePutNotificationId = putNotificationId++;
    notifications[thePutNotificationId] = {
        notification: notification,
        setTimeoutId: setTimeout(() => {
            delete notifications[thePutNotificationId];
        }, notification.time || 3000) as any
    };
    return putNotificationId;
}

/**关闭提示框*/
export function closeNotification(putNotificationId: number) {
    let the = notifications[putNotificationId];
    if (!the) {
        return;
    }
    clearTimeout(the.setTimeoutId);
    delete notifications[putNotificationId];
}