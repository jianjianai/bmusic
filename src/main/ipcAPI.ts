import { ipcMain } from "electron";
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, unlinkSync, writeFileSync } from "fs";
import { join } from "path";

// ipcBilibiliApi bilibili 音乐播放器的API
(() => {
    ipcMain.handle('ipcBilibiliApi__getPreloadJsFilePath', () => join(__dirname, "../preload/BilibiliMusicPlayer.js"));
})();



// ipcPlayListsApi 歌单
(() => {
    /** 构建文件名 */
    function buildFileName(name: string, index: number) {
        return `${index}.${name}.json`;
    }
    /** 从文件名解name称和index */
    function parseFileName(fileName: string) {
        const lastdIndex = fileName.lastIndexOf(".");
        const sp = fileName.substring(0, lastdIndex);
        const falstdIndex = sp.indexOf(".");
        if (falstdIndex === -1) {
            return {
                name: sp,
                index: 0
            };
        }
        const index = parseInt(sp.substring(0, falstdIndex));
        if (isNaN(index)) {
            return {
                name: sp,
                index: 0
            };
        }
        return {
            name: sp.substring(falstdIndex + 1),
            index: index
        };
    }

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
    
    // 读取歌单列表
    const playLists: PlayList[] = readdirSync(playListPath)
        .filter(n => n.endsWith(".json"))
        .map(n => {
            return {
                ...parseFileName(n),
                fileName: n
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
        const newFileName = buildFileName(thePlayList.name, arg.index);
        renameSync(join(playListPath, thePlayList.fileName), join(playListPath, newFileName));
        thePlayList.index = arg.index;
        thePlayList.fileName = newFileName;
        return true;
    });
    // 重命名歌单
    ipcMain.handle('ipcPlayListsApi__renamePlaylist', async (_event, arg: { oldName: string, newName: string }) => {
        const index = playLists.findIndex(n => n.name === arg.oldName);
        if (index === -1) return false;
        const thePlayList = playLists[index];
        const newFileName = buildFileName(arg.newName, thePlayList.index);
        renameSync(join(playListPath, thePlayList.fileName), join(playListPath, newFileName));
        thePlayList.name = arg.newName;
        thePlayList.fileName = newFileName;
        return true;
    });
    // 保存歌单数据,如果歌单不存在则创建一个
    ipcMain.handle('ipcPlayListsApi__savePlaylistData', async (_event, arg: { name: string, data: string }) => {
        const index = playLists.findIndex(n => n.name === arg.name);
        let thePlayList: PlayList;
        if (index === -1) {
            const newFileName = buildFileName(arg.name, playLists.length);
            thePlayList = {
                name: arg.name,
                index: playLists.length,
                fileName: newFileName
            };
            playLists.push(thePlayList);
        } else {
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
