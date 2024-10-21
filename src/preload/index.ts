import { electronAPI } from '@electron-toolkit/preload'
import { ipcAPI } from './ipcAPI';

// Custom APIs for renderer
const api = {
    ipcAPI:ipcAPI
}

export type API = typeof api;

// @ts-ignore (define in dts)
window.electron = electronAPI
// @ts-ignore (define in dts)
window.api = api
