import { ipcMain } from "electron";
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, unlinkSync, writeFileSync } from "fs";
import { join } from "path";
import { pathToFileURL } from "url";

// ipcPlayListsApi 歌单
// 文件夹路径
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
    /** 图标文件名 null 文件不存在 */
    iconFileName: string | null
};
// 歌单列表
const playLists: PlayList[] = readPlayList();


function buildFileNameFelx(name: string, index: number) {
    return `${index}.${name}`;
}
/** 构建文件名 */
function buildFileName(name: string, index: number) {
    return `${buildFileNameFelx(name, index)}.json`;
}
/** 构建图标文件名 */
function buildIconFileName(name: string, index: number) {
    return `${buildFileNameFelx(name, index)}.webp`;
}

/** 从文件名解name称和index */
function parseFileName(fileName: string) {
    const lastdIndex = fileName.lastIndexOf(".");
    const sp = fileName.substring(0, lastdIndex);
    const falstdIndex = sp.indexOf(".");
    const iconFileName = sp + ".webp";
    const isIconFileExists = existsSync(join(playListPath, iconFileName));
    if (falstdIndex === -1) {
        return {
            name: sp,
            index: 0,
            iconFileName: isIconFileExists ? iconFileName : null
        };
    }
    const index = parseInt(sp.substring(0, falstdIndex));
    if (isNaN(index)) {
        return {
            name: sp,
            index: 0,
            iconFileName: isIconFileExists ? iconFileName : null
        };
    }
    return {
        name: sp.substring(falstdIndex + 1),
        index: index,
        iconFileName: isIconFileExists ? iconFileName : null
    };
}

// 读取播放列表
function readPlayList() {
    return readdirSync(playListPath)
        .filter(n => n.endsWith(".json"))
        .map(n => {
            return {
                ...parseFileName(n),
                fileName: n
            }
        });
}


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
    if (thePlayList.iconFileName) {
        const newIconFileName = buildIconFileName(thePlayList.name, arg.index);
        renameSync(join(playListPath, thePlayList.iconFileName), join(playListPath, newIconFileName!));
        thePlayList.iconFileName = newIconFileName;
    }
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
    if (thePlayList.iconFileName) {
        const newIconFileName = buildIconFileName(arg.newName, thePlayList.index);
        renameSync(join(playListPath, thePlayList.iconFileName), join(playListPath, newIconFileName!));
        thePlayList.iconFileName = newIconFileName;
    }
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
            fileName: newFileName,
            iconFileName: null
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
    if (thePlayList.iconFileName) {
        const iconFilePath = join(playListPath, thePlayList.iconFileName);
        unlinkSync(iconFilePath);
    }
    return true;
});
// 读取播放列表图标
ipcMain.handle('ipcPlayListsApi__readPlaylistIconUrl', async (_event, arg: string) => {
    const index = playLists.findIndex(n => n.name === arg);
    if (index === -1) return null;
    const thePlayList = playLists[index];
    if (thePlayList.iconFileName === null) return null;
    const iconFilePath = join(playListPath, thePlayList.iconFileName);
    const url = pathToFileURL(iconFilePath);
    url.search = `?${new Date().getTime()}`;// 防止缓存
    const fileUrl = url.toString();
    return fileUrl;
});
// 保存播放列表图标
ipcMain.handle('ipcPlayListsApi__savePlaylistIcon', async (_event, arg: { name: string, data: Uint8Array }) => {
    const index = playLists.findIndex(n => n.name === arg.name);
    if (index === -1) return false;
    const thePlayList = playLists[index];
    const iconFileName = thePlayList.iconFileName || buildIconFileName(thePlayList.name, thePlayList.index);
    const iconFilePath = join(playListPath, iconFileName);
    writeFileSync(iconFilePath, arg.data);
    thePlayList.iconFileName = iconFileName;
    return true;
});