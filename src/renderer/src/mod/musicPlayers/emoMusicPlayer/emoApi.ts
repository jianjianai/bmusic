export const enum SoundQualityType {
    standard = 'standard',
    exhigh = 'exhigh',
    lossless = 'lossless',
    hires = 'hires',
    jyeffect = 'jyeffect',
    jymaster = 'jymaster',
    sky = 'sky',
}

const electron = window.electron;


export async function search(params: {
    keywords: string
    limit?: string | number
}) {
    return electron.ipcRenderer.invoke("NeteaseCloudMusic_search", params);
}


export async function song_url_v1(params: { id: string | number; level: SoundQualityType }) {
    return electron.ipcRenderer.invoke("NeteaseCloudMusic_song_url_v1", params);
}

export async function lyric(params: { id: string | number }) {
    return electron.ipcRenderer.invoke("NeteaseCloudMusic_lyric", params);
}

export async function cloudsearch(params: {
    keywords: string
    limit?: string | number
}) {
    return electron.ipcRenderer.invoke("NeteaseCloudMusic_cloudSearch", params);
}