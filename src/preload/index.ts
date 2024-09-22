import { electronAPI } from '@electron-toolkit/preload'
import { BilibiliMusicPlayerInit } from './players/BilibiliMusicPlayer/BilibiliMusicPlayer'

// Custom APIs for renderer
const api = {}

// @ts-ignore (define in dts)
window.electron = electronAPI
// @ts-ignore (define in dts)
window.api = api

BilibiliMusicPlayerInit();
