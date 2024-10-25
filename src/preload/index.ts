import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {

}

export type API = typeof api;

// @ts-ignore (define in dts)
window.electron = electronAPI
// @ts-ignore (define in dts)
window.api = api
