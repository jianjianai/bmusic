<script lang="ts" setup>
import { setContent } from '@renderer/mod/content/content';
import { useMusicPlayList } from '@renderer/storage/playListStorage';
import { toRef } from 'vue';
import PlaySvg from '@renderer/components/svg/Play.vue';
import SearchSvg from '@renderer/components/svg/Search.vue';
import { playList } from '@renderer/mod/playingList/playingList';
import EditSvg from '@renderer/components/svg/Edit.vue';
import EditPlayListInfo from './EditPlayListInfo.vue';
import ImgDiv from '@renderer/components/ImgDiv.vue';
import UniversalButton from '@renderer/components/UniversalButton.vue';
import EditMusicInfo from './EditMusicInfo.vue';
import MusicList from '@renderer/components/MusicList.vue';
import { type Music } from '@renderer/mod/playing/playing';
import { closePopUpComponent, openPopUpComponent } from '@renderer/mod/popUp/popUp';
import Confirm from '@renderer/mod/popUp/popUps/Confirm.vue';
import TrashSvg from '@renderer/components/svg/Trash.vue';

const props = defineProps<{
    musicListName: string
}>();

const musicPlayList = useMusicPlayList(toRef(props, 'musicListName'));


// 点击播放全部按钮
function playAll() {
    playList.setList(musicPlayList.value!.musicList!.list);
    playList.setCurrentIndex(0);
}

//去编辑歌单信息
function toEdit() {
    setContent(EditPlayListInfo, { musicListName: props.musicListName });
}

//去编辑歌曲信息
function toEditMusicInfo(index: number) {
    setContent(EditMusicInfo, { editIndex: index, musicListName: props.musicListName });
}

function onMusicOrderChange(newList: Music[]) {
    musicPlayList.value!.musicList!.list = newList;
    musicPlayList.value?.save();
}

//删除歌曲
function deleteMusic(index: number) {
    const popUpId = openPopUpComponent(Confirm, {
        title: '删除歌曲',
        content: '确定删除这首歌曲吗？',
        confirm: () => {
            musicPlayList.value!.musicList!.list.splice(index, 1);
            musicPlayList.value?.save();
            closePopUpComponent(popUpId);
        },
        cancel: () => {
            closePopUpComponent(popUpId);
        },
    });
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
                            <UniversalButton text="播放全部" type="ok" :icon="PlaySvg" @click="playAll()"></UniversalButton>
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
            <MusicList :list="musicPlayList?.musicList?.list || []" :replacePlayList="true" :dragSort="true"
                :onMusicOrderChange="onMusicOrderChange" :customButtons="[
                    {
                        title: '编辑歌曲信息',
                        icon: EditSvg,
                        onClick: toEditMusicInfo
                    },
                    {
                        title: '删除歌曲',
                        icon: TrashSvg,
                        onClick: deleteMusic
                    },
                ]"></MusicList>
        </div>
    </div>
</template>
<style scoped>
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
    border-color: var(--color-pay-list-search-border-focus);
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
    flex: 1;
    width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.author {
    display: flex;
    align-items: center;
    flex: none;
}


.content-button-grep {
    display: flex;
    align-items: center;
    margin-top: 0.5rem;
    gap: 0.5rem;
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
    margin-right: 1rem;
    cursor: pointer;
}

.title {
    font-size: 1.3rem;
    font-weight: bolder;
    color: var(--color-pay-list-header-title-font);
    flex: 1;
    width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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