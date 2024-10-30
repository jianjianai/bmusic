

export type BilibiliMusicData = {
    /** bilibili BV号 */
    bvId: string;
}

export function paresBilibiliMusicData(data: string): BilibiliMusicData {
    return JSON.parse(data);
}

export function paresBilibiliMusicDataToString(data: BilibiliMusicData): string {
    return JSON.stringify(data);
}