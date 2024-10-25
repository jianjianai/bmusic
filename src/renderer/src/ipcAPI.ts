const electron = window.electron;

export const ipcBilibiliApi = {
    /** 获取Bilibili音乐播放器的Preload js文件路径 */
    getPreloadJsFilePath(): Promise<string> {
        return electron.ipcRenderer.invoke('ipcBilibiliApi__getPreloadJsFilePath');
    }
}

type PlayList = {
    /** 歌单名称 */
    name: string,
    /** 歌单排序 */
    index: number,
    /** 文件名称(前端不用管) */
    fileName: string,
}

export const ipcPlayListsApi = {
    /** 获取歌单列表 */
    getPlaylist(): Promise<PlayList[]> {
        return electron.ipcRenderer.invoke('ipcPlayListsApi__getPlaylist');
    },
    /** 修改歌单index */
    setPlaylistIndex(name: string, index: number): Promise<boolean> {
        return electron.ipcRenderer.invoke('ipcPlayListsApi__setPlaylistIndex', { name, index });
    },
    /** 重命名歌单 */
    renamePlaylist(oldName: string, newName: string): Promise<boolean> {
        return electron.ipcRenderer.invoke('ipcPlayListsApi__renamePlaylist', { oldName, newName });
    },
    /** 保存歌单数据 */
    savePlaylistData(name: string, data: any): Promise<boolean> {
        return electron.ipcRenderer.invoke('ipcPlayListsApi__savePlaylistData', { name, data });
    },
    /** 读取歌单数据 */
    readPlaylistData(name: string): Promise<any> {
        return electron.ipcRenderer.invoke('ipcPlayListsApi__readPlaylistData', name);
    },
    /** 删除歌单 */
    deletePlaylist(name: string): Promise<boolean> {
        return electron.ipcRenderer.invoke('ipcPlayListsApi__deletePlaylist', name);
    }
}

// @ts-ignore TODO: 调试方便，到时候删除 fix this
window.ipcPlayListsApi = ipcPlayListsApi;