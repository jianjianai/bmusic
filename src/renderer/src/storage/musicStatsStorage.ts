import { musicKey, type Music } from "../mod/playing/playing";
import { readonly, ref } from "vue";

/** 音乐统计数据 */
export type MusicStats = {
  /** 播放次数 */
  playCount: number,
  /** 最后播放时间 */
  lastPlayedAt: number,
  /** 首次播放时间 */
  firstPlayedAt: number,
  /** 音乐信息 (存储快照以便显示) */
  music: Music
}

/** 音乐统计数据存储 */
const musicStatsMap = ref<Map<string, MusicStats>>(new Map());

/** 从localStorage加载统计数据 */
function loadMusicStats(): Map<string, MusicStats> {
  try {
    const stored = localStorage.getItem('musicStats');
    if (stored) {
      const data = JSON.parse(stored);
      const map = new Map<string, MusicStats>();
      Object.entries(data).forEach(([key, value]) => {
        map.set(key, value as MusicStats);
      });
      return map;
    }
  } catch (error) {
    console.error('Failed to load music stats:', error);
  }
  return new Map();
}

/** 保存统计数据到localStorage */
function saveMusicStats(stats: Map<string, MusicStats>) {
  try {
    const data = Object.fromEntries(stats);
    localStorage.setItem('musicStats', JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save music stats:', error);
  }
}

// 初始化加载数据
musicStatsMap.value = loadMusicStats();

export const musicStatsStorage = readonly({
  /** 获取所有统计数据 */
  getAllStats: () => musicStatsMap.value,
  
  /** 获取指定音乐的统计数据 */
  getStats(music: Music): MusicStats | undefined {
    const key = musicKey(music);
    return musicStatsMap.value.get(key);
  },
  
  /** 记录音乐播放 */
  recordPlay(music: Music) {
    const key = musicKey(music);
    const now = Date.now();
    const existing = musicStatsMap.value.get(key);
    
    if (existing) {
      existing.playCount++;
      existing.lastPlayedAt = now;
      existing.music = music; // 更新音乐信息快照
    } else {
      musicStatsMap.value.set(key, {
        playCount: 1,
        lastPlayedAt: now,
        firstPlayedAt: now,
        music: music
      });
    }
    
    // 保存到localStorage
    saveMusicStats(musicStatsMap.value);
  },
  
  /** 获取最常播放的音乐 */
  getTopPlayedMusic(limit: number = 10): MusicStats[] {
    return Array.from(musicStatsMap.value.values())
      .sort((a, b) => b.playCount - a.playCount)
      .slice(0, limit);
  },
  
  /** 获取最近播放的音乐 */
  getRecentlyPlayedMusic(limit: number = 10): MusicStats[] {
    return Array.from(musicStatsMap.value.values())
      .sort((a, b) => b.lastPlayedAt - a.lastPlayedAt)
      .slice(0, limit);
  },
  
  /** 清除所有统计数据 */
  clearAllStats() {
    musicStatsMap.value.clear();
    localStorage.removeItem('musicStats');
  }
});