import { ipcMain } from "electron";
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, unlinkSync, writeFileSync } from "fs";
import { join } from "path";

// ipcBilibiliApi bilibili 音乐播放器的API
(() => {
    ipcMain.handle('ipcBilibiliApi__getPreloadJsFilePath', () => join(__dirname, "../preload/BilibiliMusicPlayer.js"));
})();



// ipcPlayListsApi 歌单
(() => {
    const playListPath = "./PlayLists";
    // 如果文件夹不存在就创建
    if (!existsSync(playListPath)) mkdirSync(playListPath);
    type PlayList = {
        /** 歌单名称 */
        name: string,
        /** 歌单排序 */
        index: number,
        /** 文件名称 */
        fileName: string,
    };
    const playLists: PlayList[] = readdirSync(playListPath)
        .filter(n => n.endsWith(".json"))
        .map(n => {
            const sp  = n.substring(0, n.length - 5).split(".");
            return {
                fileName: n,
                name: sp[0],
                index: sp[1] ? (parseInt(sp[1]) || 0) : 0
            }
        });

    // 获取歌单列表
    ipcMain.handle('ipcPlayListsApi__getPlaylist', async (_event, _arg) => {
        return playLists;
    });
    // 修改歌单index
    ipcMain.handle('ipcPlayListsApi__setPlaylistIndex', async (_event, arg: { name: string, index: number }) => {
        const index = playLists.findIndex(n => n.name === arg.name);
        if (index === -1) return false;
        const thePlayList = playLists[index];
        const newFileName = `${thePlayList.name}.${arg.index}.json`;
        renameSync(join(playListPath, thePlayList.fileName),join(playListPath, newFileName));
        thePlayList.index = arg.index;
        thePlayList.fileName = newFileName;
        return true;
    });
    // 重命名歌单
    ipcMain.handle('ipcPlayListsApi__renamePlaylist', async (_event, arg: { oldName: string, newName: string }) => {
        const index = playLists.findIndex(n => n.name === arg.oldName);
        if (index === -1) return false;
        const thePlayList = playLists[index];
        const newFileName = `${arg.newName}.${thePlayList.index}.json`;
        renameSync(join(playListPath, thePlayList.fileName),join(playListPath, newFileName));
        thePlayList.name = arg.newName;
        thePlayList.fileName = newFileName;
        return true;
    });
    // 保存歌单数据,如果歌单不存在则创建一个
    ipcMain.handle('ipcPlayListsApi__savePlaylistData', async (_event, arg: { name: string, data: string }) => {
        const index = playLists.findIndex(n => n.name === arg.name);
        let thePlayList:PlayList;
        if(index === -1){
            const newFileName = `${arg.name}.${playLists.length}.json`;
            thePlayList = {
                name: arg.name,
                index: playLists.length,
                fileName: newFileName
            };
            playLists.push(thePlayList);
        }else{
            thePlayList = playLists[index];
        }
        const filePath = join(playListPath, thePlayList.fileName);
        writeFileSync(filePath, arg.data);
        return true;
    });
    // 读取歌单数据
    ipcMain.handle('ipcPlayListsApi__readPlaylistData', async (_event, arg: string) => {
        const index = playLists.findIndex(n => n.name === arg);
        if (index === -1) return null;
        const thePlayList = playLists[index];
        const filePath = join(playListPath, thePlayList.fileName);
        return readFileSync(filePath).toString();
    });
    // 删除歌单
    ipcMain.handle('ipcPlayListsApi__deletePlaylist', async (_event, arg: string) => {
        const index = playLists.findIndex(n => n.name === arg);
        if (index === -1) return false;
        const thePlayList = playLists[index];
        const filePath = join(playListPath, thePlayList.fileName);
        playLists.splice(index, 1);
        unlinkSync(filePath);
        return true;
    });
})();
