<!-- 音乐统计/最常播放 -->
<script lang="ts" setup>
import { computed, ref } from 'vue';
import { musicStatsStorage, type MusicStats } from '@renderer/storage/musicStatsStorage';
import { musicPlayer } from '@renderer/mod/playing/playing';
import { playList } from '@renderer/mod/playingList/playingList';
import ImgDiv from '@renderer/components/ImgDiv.vue';
import PlaySvg from '@renderer/components/svg/Play.vue';
import UniversalButton from '@renderer/components/UniversalButton.vue';

// 显示模式：top（最常播放）或 recent（最近播放）
const displayMode = ref<'top' | 'recent'>('top');

// 计算要显示的音乐统计数据
const musicStats = computed(() => {
  if (displayMode.value === 'top') {
    return musicStatsStorage.getTopPlayedMusic(20);
  } else {
    return musicStatsStorage.getRecentlyPlayedMusic(20);
  }
});

// 计算音乐列表
const musicList = computed(() => {
  return musicStats.value.map(stats => stats.music);
});

// 播放指定音乐
function playMusic(music: any) {
  musicPlayer.setCurrentMusic(music);
}

// 播放整个列表
function playAll() {
  if (musicList.value.length > 0) {
    playList.setPlayList(musicList.value, 0);
  }
}

// 格式化播放次数
function formatPlayCount(count: number): string {
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K';
  }
  return count.toString();
}

// 格式化时间
function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return '今天';
  } else if (diffDays === 1) {
    return '昨天';
  } else if (diffDays < 7) {
    return `${diffDays}天前`;
  } else {
    return date.toLocaleDateString();
  }
}

// 获取最常播放的音乐（用于显示标题）
const topMusic = computed(() => {
  const top = musicStatsStorage.getTopPlayedMusic(1);
  return top.length > 0 ? top[0] : null;
});
</script>

<template>
  <div class="top-music-container">
    <!-- 标题区域 -->
    <div class="header">
      <div class="title-section">
        <h1 class="main-title">音乐统计</h1>
        <p class="subtitle" v-if="topMusic">
          你最喜欢的音乐是 "{{ topMusic.music.musicName }}" 
          <span class="play-count">(播放了 {{ formatPlayCount(topMusic.playCount) }} 次)</span>
        </p>
        <p class="subtitle" v-else>
          开始听音乐来查看你的统计数据
        </p>
      </div>
      
      <!-- 控制按钮 -->
      <div class="controls">
        <UniversalButton 
          :class="{ active: displayMode === 'top' }"
          @click="displayMode = 'top'"
        >
          最常播放
        </UniversalButton>
        <UniversalButton 
          :class="{ active: displayMode === 'recent' }"
          @click="displayMode = 'recent'"
        >
          最近播放
        </UniversalButton>
        <UniversalButton 
          v-if="musicList.length > 0"
          @click="playAll"
          class="play-all-btn"
        >
          <PlaySvg class="play-icon" />
          播放全部
        </UniversalButton>
      </div>
    </div>

    <!-- 统计列表 -->
    <div class="stats-content" v-if="musicStats.length > 0">
      <div class="stats-header">
        <div class="rank-header">#</div>
        <div class="music-header">音乐</div>
        <div class="stats-info-header">
          {{ displayMode === 'top' ? '播放次数' : '最后播放' }}
        </div>
      </div>
      
      <div class="stats-list">
        <div 
          v-for="(stats, index) in musicStats" 
          :key="`${stats.music.playerName}_${stats.music.playerData}`"
          class="stats-item"
          @click="playMusic(stats.music)"
        >
          <div class="rank">{{ index + 1 }}</div>
          
          <div class="music-info">
            <ImgDiv class="music-icon" :src="stats.music.iconUrl" />
            <div class="music-details">
              <div class="music-name">{{ stats.music.musicName || '未知音乐' }}</div>
              <div class="music-author">{{ stats.music.musicAuthor || '未知艺术家' }}</div>
            </div>
          </div>
          
          <div class="stats-info">
            <div v-if="displayMode === 'top'" class="play-count-display">
              {{ formatPlayCount(stats.playCount) }}次
            </div>
            <div v-else class="last-played">
              {{ formatDate(stats.lastPlayedAt) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <div class="empty-icon">🎵</div>
      <h3>暂无数据</h3>
      <p>开始播放音乐来查看你的统计信息</p>
    </div>
  </div>
</template>

<style scoped>
.top-music-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 2rem;
}

.title-section {
  flex: 1;
}

.main-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: var(--color-text-primary, #333);
}

.subtitle {
  font-size: 1.1rem;
  color: var(--color-text-secondary, #666);
  margin: 0;
}

.play-count {
  color: var(--color-accent, #fb7299);
  font-weight: 600;
}

.controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.controls .active {
  background-color: var(--color-accent, #fb7299);
  color: white;
}

.play-all-btn {
  background-color: var(--color-primary, #007bff);
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.play-icon {
  width: 1rem;
  height: 1rem;
}

.stats-content {
  background: var(--color-surface, #fff);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.stats-header {
  display: grid;
  grid-template-columns: 3rem 1fr 10rem;
  padding: 1rem 1.5rem;
  background: var(--color-surface-variant, #f5f5f5);
  font-weight: 600;
  color: var(--color-text-secondary, #666);
  border-bottom: 1px solid var(--color-border, #eee);
}

.stats-list {
  max-height: 600px;
  overflow-y: auto;
}

.stats-item {
  display: grid;
  grid-template-columns: 3rem 1fr 10rem;
  padding: 1rem 1.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid var(--color-border, #eee);
}

.stats-item:hover {
  background: var(--color-surface-hover, #f9f9f9);
}

.stats-item:last-child {
  border-bottom: none;
}

.rank {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: var(--color-text-secondary, #666);
}

.music-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: 0;
}

.music-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  flex-shrink: 0;
  background: var(--color-surface-variant, #f5f5f5);
}

.music-details {
  min-width: 0;
  flex: 1;
}

.music-name {
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--color-text-primary, #333);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.music-author {
  color: var(--color-text-secondary, #666);
  font-size: 0.9rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.stats-info {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  text-align: right;
}

.play-count-display {
  font-weight: 600;
  color: var(--color-accent, #fb7299);
}

.last-played {
  color: var(--color-text-secondary, #666);
  font-size: 0.9rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--color-text-secondary, #666);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
}

.empty-state p {
  margin: 0;
  font-size: 1rem;
}
</style>