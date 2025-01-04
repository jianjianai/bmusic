export const electron = window.electron;


export const ipcBilibiliApi = {
    /** 获取Bilibili音乐播放器的Preload js文件路径 */
    getPreloadJsFilePath_BilibiliMusicPlayer(): Promise<string> {
        return electron.ipcRenderer.invoke('ipcBilibiliApi__getPreloadJsFilePath_BilibiliMusicPlayer');
    },
    /** 获取Bilibili音乐搜索的Preload js文件路径 */
    getPreloadJsFilePath_BilibiliMusicSearch(): Promise<string> {
        return electron.ipcRenderer.invoke('ipcBilibiliApi__getPreloadJsFilePath_BilibiliMusicSearch');
    }
};
