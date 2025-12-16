import { ipcMain } from "electron";
import { playlistsDb } from "../db/sqlite";

type PlayList = {
    /** 歌单名称 */
    name: string,
    /** 歌单排序 */
    index: number,
    /** 文件名称(保留字段，前端不使用) */
    fileName: string,
};


// 获取歌单列表
ipcMain.handle('ipcPlayListsApi__getPlaylist', async (_event, _arg) => {
    // 从数据库读取并适配前端类型
    const rows = await playlistsDb.all();
    const list: PlayList[] = rows.map(r => ({ name: r.name, index: r.index, fileName: `${r.index}.${r.name}.json` }));
    return list;
});
// 修改歌单index
ipcMain.handle('ipcPlayListsApi__setPlaylistIndex', async (_event, arg: { name: string, index: number }) => {
    return await playlistsDb.setIndex(arg.name, arg.index);
});
// 重命名歌单
ipcMain.handle('ipcPlayListsApi__renamePlaylist', async (_event, arg: { oldName: string, newName: string }) => {
    return await playlistsDb.rename(arg.oldName, arg.newName);
});
// 保存歌单数据,如果歌单不存在则创建一个（解析 JSON -> 关系表）
ipcMain.handle('ipcPlayListsApi__savePlaylistData', async (_event, arg: { name: string, data: string }) => {
    await playlistsDb.upsertPlaylistFromJson(arg.name, arg.data);
    return true;
});
// 读取歌单数据
ipcMain.handle('ipcPlayListsApi__readPlaylistData', async (_event, arg: string) => {
    return await playlistsDb.readPlaylistAsJson(arg);
});
// 删除歌单
ipcMain.handle('ipcPlayListsApi__deletePlaylist', async (_event, arg: string) => {
    return await playlistsDb.delete(arg);
});
// 读取播放列表图标
ipcMain.handle('ipcPlayListsApi__readPlaylistIconUrl', async (_event, arg: string) => {
    return await playlistsDb.readIconUrl(arg);
});
// 保存播放列表图标
ipcMain.handle('ipcPlayListsApi__savePlaylistIcon', async (_event, arg: { name: string, data: Uint8Array }) => {
    return await playlistsDb.saveIcon(arg.name, arg.data);
});