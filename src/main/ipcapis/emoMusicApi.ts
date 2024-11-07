import { ipcMain } from 'electron';
import { login_cellphone,search,song_url_v1,lyric,cloudsearch} from 'NeteaseCloudMusicApi';




ipcMain.handle("NeteaseCloudMusic_login",async (_event, arg: { phone: string, password: string })=>{
    return await login_cellphone(arg);
})

ipcMain.handle("NeteaseCloudMusic_search",async (_event, arg: any)=>{
    return await search(arg);
})

ipcMain.handle("NeteaseCloudMusic_song_url_v1",async (_event, arg: any)=>{
    return await song_url_v1(arg);
})

ipcMain.handle("NeteaseCloudMusic_lyric",async (_event, arg: any)=>{
    return await lyric(arg);
})
ipcMain.handle("NeteaseCloudMusic_cloudSearch",async (_event, arg: any)=>{
    return await cloudsearch(arg);
})

