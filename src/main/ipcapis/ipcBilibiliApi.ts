import { ipcMain } from "electron";
import { join } from "path";

// ipcBilibiliApi bilibili 音乐播放器的API
ipcMain.handle('ipcBilibiliApi__getPreloadJsFilePath_BilibiliMusicPlayer', () => join(__dirname, "../preload/BilibiliMusicPlayer.js"));
ipcMain.handle('ipcBilibiliApi__getPreloadJsFilePath_BilibiliMusicSearch', () => join(__dirname, "../preload/BilibiliMusicSearch.js"));