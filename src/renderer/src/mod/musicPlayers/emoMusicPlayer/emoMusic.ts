export type EmoMusicData = {
    id: string|number;
    album: string;
}

export function paresEmoMusicData(data: string): EmoMusicData {
    return JSON.parse(data);
}

export function paresEmoMusicDataToString(data: EmoMusicData): string {
    return JSON.stringify(data);
}       