import { ipcMain } from "electron";
import { join } from "path";

ipcMain.handle('BilibiliMusicPlayer__filePath', () => join(__dirname,"../preload/BilibiliMusicPlayer.js"));