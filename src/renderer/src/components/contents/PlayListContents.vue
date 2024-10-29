<script lang="ts" setup>
import { setContent } from '@renderer/states/contentState';
import { useMusicPlayList } from '@renderer/states/playListStorage';
import { toRef } from 'vue';
import PlaySvg from '../svg/Play.vue';
import SearchSvg from '../svg/Search.vue';
import PauseSvg from '../svg/Pause.vue';
import { musicPlayer, compareMusic, type Music } from '@renderer/states/musicPlayerStates';
import { playList } from '@renderer/states/playListState';
import FavoriteButton from '../allSmall/FavoriteButton.vue';
import { addToPlayList } from '@renderer/states/addToPlayListState';
import AddMusicCollectionSvg from '../svg/AddMusicCollection.vue';
import EditSvg from '../svg/Edit.vue';
import EditPlayListInfo from './EditPlayListInfo.vue';
import ImgDiv from '../allSmall/ImgDiv.vue';

const props = defineProps<{
    musicName: string
}>();

const musicPlayList = useMusicPlayList(toRef(props, 'musicName'));

// 点击播放按钮,播放音乐
function chickMusicIcon(music: Music, index: number) {
    if (compareMusic(musicPlayer.currentMusic, music)) {
        if (musicPlayer.playing) {
            musicPlayer.requestPause();
        } else {
            musicPlayer.requestPlay();
        }
    } else {
        playList.setList(musicPlayList.value!.musicList!.list);
        playList.setCurrentIndex(index);
    }
}

// 点击播放全部按钮
function playAll() {
    playList.setList(musicPlayList.value!.musicList!.list);
    playList.setCurrentIndex(0);
}

//去编辑歌单信息
function toEdit() {
    setContent(EditPlayListInfo, { musicName: props.musicName });
}

</script>
<template>
    <div class="pay-list-box">
        <div class="pay-list-box-sell">
            <!-- 头部内容 -->
            <div class="header">
                <!-- 内容，歌单名称简介等 -->
                <div class="content">
                    <!-- 图片 -->
                    <ImgDiv class="content-img"
                        :src="musicPlayList!.musicListInconUrl || musicPlayList!.musicList?.list[0]?.iconUrl">
                    </ImgDiv>
                    <!-- 右边内容 -->
                    <div class="content-main">
                        <!-- 文本内容 -->
                        <div class="content-main-c">
                            <div class="title-line">
                                <div class="title">{{ musicPlayList!.name }}</div>
                                <div class="edit-button" title="编辑歌单信息" @click="toEdit">
                                    <EditSvg style="width: 100%;height: 100%;" />
                                </div>
                            </div>
                            <div class="description">{{ musicPlayList!.musicList?.description || "没有简介" }}</div>
                            <div class="author">
                                <ImgDiv class="author-img" :src="musicPlayList!.musicList?.authorIconUrl">
                                </ImgDiv>
                                <div class="author-name">{{ musicPlayList!.musicList?.author || "没有作者" }}</div>
                            </div>
                        </div>
                        <!-- 按钮组 -->
                        <div class="content-button-grep">
                            <div class="content-button play-button" @click="playAll()">
                                <PlaySvg class="icon" />
                                <div class="text">播放全部</div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 下面tab行 -->
                <div class="tab-line">
                    <!-- 左边tab -->
                    <div class="tabs">
                        <div class="tab">歌曲列表</div>
                    </div>
                    <!-- 右边搜索框 -->
                    <label class="search" for="pay-list-search-imput">
                        <SearchSvg class="icon"></SearchSvg>
                        <input id="pay-list-search-imput" class="imput" type="text" placeholder="搜索" />
                    </label>
                </div>
            </div>
            <!-- 歌曲列表 -->
            <div class="pay-list">
                <div class="line line-title">
                    <div class="index">#</div>
                    <div class="info">歌曲</div>
                    <div class="like">喜欢</div>
                </div>
                <div class="line line-content" :class="{ playing: compareMusic(musicPlayer.currentMusic, music) }"
                    v-for="music, index of musicPlayList!.musicList?.list">
                    <!-- 序号 -->
                    <div class="index">{{ index }}</div>
                    <!-- 音乐信息 -->
                    <div class="info">
                        <!-- 图标 -->
                        <ImgDiv class="info-icon" @click="chickMusicIcon(music, index)" :src="music.iconUrl">
                            <!-- 遮罩 -->
                            <div class="info-icon-mask">
                                <!-- 播放暂停按钮 -->
                                <PauseSvg class="icon"
                                    v-if="compareMusic(musicPlayer.currentMusic, music) && musicPlayer.playing" />
                                <PlaySvg class="icon" v-else />
                            </div>
                        </ImgDiv>
                        <!-- 内容 -->
                        <div class="info-content">
                            <!-- 名称 -->
                            <div class="info-name">{{ music.musicName }}</div>
                            <!-- 名称下面一排 -->
                            <div class="info-author">
                                <!-- 播放器 -->
                                <div class="item-paly">{{ music.playerName }}</div>
                                <!-- 作者 -->
                                <div class="item-author">{{ music.musicAuthor }}</div>
                            </div>
                        </div>
                        <!-- 按钮组 -->
                        <div class="button-grep">
                            <div class="button-grep-button" title="收藏到歌单" @click="addToPlayList(music)">
                                <AddMusicCollectionSvg style="width: 100%; height: 100%;" />
                            </div>
                        </div>
                    </div>
                    <!-- 喜欢 -->
                    <div class="like">
                        <FavoriteButton :music="music" style="width: 1.2rem;height: 1.2rem;" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.pay-list .line-content .button-grep-button:hover {
    color: var(--color-play-list-item-button-grep-button-hover);
}

.pay-list .line-content .button-grep-button {
    width: 1.2rem;
    height: 1.2rem;
    cursor: pointer;
    color: var(--color-play-list-item-button-grep-button);
}

.pay-list .line-content:hover .button-grep {
    display: flex;
}

.pay-list .line-content .button-grep {
    display: none;
    gap: 0.5rem;
    align-items: center;
}

.pay-list .line-content.playing .info-icon-mask .icon,
.pay-list .line-content:hover .info-icon-mask .icon {
    display: block;
}

.pay-list .line-content .info-icon-mask .icon {
    width: 1.5rem;
    height: 1.5rem;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: var(--color-pay-list-line-content-info-icon-mask-icon);
    display: none;
}

.pay-list .line-content.playing .info-icon-mask,
.pay-list .line-content:hover .info-icon-mask {
    display: block;
}

.pay-list .line-content .info-icon-mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: var(--color-pay-list-line-content-info-icon-mask-bg);
    display: none;
}

.pay-list .line-content:hover {
    background-color: var(--color-pay-list-line-content-hover-bg);
}

.pay-list .line-content .info-author .item-paly {
    color: var(--color-pay-list-line-content-info-item-paly-font);
    border: 0.05rem solid var(--color-pay-list-line-content-info-item-paly-font);
    border-radius: 0.2rem;
    height: 0.8rem;
    font-size: 0.6rem;
    padding: 0 0.1rem;
    line-height: 0.8rem;
    font-weight: bolder;
}

.pay-list .line-content .info-author .item-author {
    word-break: keep-all;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    width: 0;
}

.pay-list .line-content .info-author {
    font-size: 0.7rem;
    color: var(--color-pay-list-line-content-info-author-font);
    display: flex;
    align-items: center;
    flex: 1;
    height: 0;
    gap: 0.2rem;
}

.pay-list .line-content.playing .info-name {
    color: var(--color-pay-list-line-content-info-name-font-playing);
}

.pay-list .line-content .info-name {
    font-size: 0.9rem;
    color: var(--color-pay-list-line-content-info-name-font);
    word-break: keep-all;
    overflow: hidden;
    text-overflow: ellipsis;
}

.pay-list .line-content .info-content {
    flex: 1;
    width: 0;
    height: 2.5rem;
    display: flex;
    flex-direction: column;
}

.pay-list .line-content .info-icon {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 0.25rem;
    position: relative;
    overflow: hidden;
    cursor: pointer;
}

.pay-list .line-content .info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    height: 2.3rem;
}

.pay-list .line-content {
    height: 3rem;
    border-radius: 0.5rem;
    user-select: none;
}

.pay-list .line-content .index {
    text-align: center;
    font-size: 0.8rem;
    color: var(--color-pay-list-line-content-index-font);
}


.pay-list .line-title .info {
    text-align: left;
}

.pay-list .line.line-title {
    text-align: center;
    font-size: 0.8rem;
    border-bottom: 0.1rem solid var(--color-pay-list-line-title-border);
    padding: 0.5rem 0;
    margin-bottom: 0.3rem;
}

.pay-list .line .length {
    width: 4rem;
}

.pay-list .line .like {
    width: 2rem;
    display: flex;
    justify-content: center;
}

.pay-list .line .info {
    flex: 1;
    width: 0;
}

.pay-list .line .index {
    width: 2rem;
}

.pay-list .line {
    display: flex;
    gap: 0.5rem;
    margin: 0 0.5rem;
    align-items: center;
}

.search .imput {
    flex: 1;
    width: 0;
    height: 100%;
    border: none;
    outline: none;
    background-color: rgba(255, 255, 255, 0);
}

.search .icon {
    width: 1rem;
    height: 1rem;
}

.search:has(.imput:focus) {
    width: 8rem;
}

.search {
    width: 4rem;
    height: 1.5rem;
    padding: 0 0.5rem;
    display: flex;
    align-items: center;
    background-color: var(--color-pay-list-search-bg);
    border: 0.1rem solid var(--color-pay-list-search-border);
    border-radius: 1rem;
    cursor: text;
    transition: width 0.2s ease-in-out;
    margin: 0 0.5rem 0 0;
}

.content-button .text {
    font-size: 0.9rem;
}

.content-button .icon {
    width: 1.5rem;
    height: 1.5rem;
}

.play-button {
    background-color: var(--color-play-button-bg);
    color: var(--color-play-button-font);
}

.play-button:hover {
    background-color: var(--color-play-button-hover-bg);
}

.author-img {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    margin-right: 0.5rem;
    background-position: center;
    background-size: cover;
}

.author-name {
    font-size: 0.9rem;
    color: var(--color-pay-list-header-author-font);
}

.author {
    display: flex;
    align-items: center;
    flex: none;
}

.content-button {
    height: 2.3rem;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    padding: 0 0.5rem;
    cursor: pointer;
}

.content-button-grep {
    display: flex;
    align-items: center;
    margin-top: 0.5rem;
}

.content-main-c {
    height: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.description {
    margin: 0.5rem 0;
    font-size: 0.9rem;
    color: var(--color-pay-list-header-description-font);
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    display: -webkit-box;
}

.title-line {
    display: flex;
    align-items: center;
}

.edit-button:hover {
    color: var(--color-play-edit-button-hover);
}

.edit-button {
    height: 1rem;
    width: 1rem;
    color: var(--color-play-edit-button);
    margin-left: 1rem;
    cursor: pointer;
}

.title {
    font-size: 1.3rem;
    font-weight: bolder;
    color: var(--color-pay-list-header-title-font);
}

.content-main {
    flex: 1;
    width: 0;
    height: 10rem;
    display: flex;
    flex-direction: column;
}

.content-img {
    width: 10rem;
    height: 10rem;
    border-radius: 1rem;
    margin: 0 1rem;
}

.content {
    display: flex;
    align-items: center;
}

.tab {
    font-size: 1rem;
    font-weight: bolder;
}

.tabs {
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 1rem;
}

.tab-line {
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.content {
    width: 100%;
    height: 0;
    flex: 1;
}

.header {
    display: flex;
    flex-direction: column;
}

.header {
    width: 100%;
    height: 15rem;
}

.pay-list-box-sell {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    scrollbar-width: thin;
}

.pay-list-box {
    width: 100%;
    height: 100%;
}
</style>