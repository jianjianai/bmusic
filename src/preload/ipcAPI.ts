import { electronAPI } from '@electron-toolkit/preload'

export const ipcAPI = {
    BilibiliMusicPlayer__filePath(): Promise<string> {
        return electronAPI.ipcRenderer.invoke('BilibiliMusicPlayer__filePath');
    }
}