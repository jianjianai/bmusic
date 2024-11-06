<!-- 音乐列表表单 -->
<script setup lang="ts">
import { compareMusic, musicPlayer, type Music } from '@renderer/states/musicPlayerStates';
import { playList } from '@renderer/states/playListState';
import PlaySvg from '@renderer/svg/Play.vue';
import PauseSvg from '@renderer/svg/Pause.vue';
import AddMusicCollectionSvg from '@renderer/svg/AddMusicCollection.vue';
import FavoriteButton from './FavoriteButton.vue';
import PlayerInfoTag from './PlayerInfoTag.vue';
import ImgDiv from './ImgDiv.vue';
import { addToPlayList } from '@renderer/states/addToPlayList/addToPlayList';
import { ref, type CSSProperties, type Component } from 'vue';

const props = defineProps<{
    // 音乐列表
    list: Music[],
    // 播放音乐是否将播放列表替换为当前列表
    replacePlayList?: boolean,
    // 自定义按钮
    customButtons?: {
        icon: Component,
        title?: string,
        style?: false | null | string | CSSProperties,
        onClick?: (index: number) => void
    }[],
    // 是否可拖动排序
    dragSort?: boolean,
    // 当音乐顺序被拖拽改变时
    onMusicOrderChange?: (newList: Music[]) => void,
}>();


// 点击播放按钮,播放音乐
function chickMusicIcon(music: Music, index: number) {
    if (compareMusic(musicPlayer.currentMusic, music)) {
        if (musicPlayer.playing) {
            musicPlayer.requestPause();
        } else {
            musicPlayer.requestPlay();
        }
    } else if (props.replacePlayList) {
        playList.setList(props.list);
        playList.setCurrentIndex(index);
    } else {
        musicPlayer.setCurrentMusic(music);
    }
}


//用于拖动排序
//拖拽功能
let drag = ref<{
    x: number,
    y: number,
    music: Music,
    mouseUp: (event: MouseEvent, index: number) => void,
    mouseMove: (event: MouseEvent, index: number) => void,
    mouseLeave: (event: MouseEvent, index: number) => void,
}>();
function mouseDown(_mouseDownEvent: MouseEvent, music: Music, mouseDownIndex: number) {
    if (!props.dragSort) {
        return;
    }
    //判断是移动到上面还是下面 true 上面 false 下面
    function moveUpOrDown(event: MouseEvent): boolean {
        const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
        return event.clientY - rect.top < rect.height / 2;
    }

    const onMousemove = (event2: MouseEvent) => {
        if (!drag.value) {
            drag.value = {
                x: 0,
                y: 0,
                music: music,
                mouseMove: (mouseOverEvent: MouseEvent, _index1: number) => {
                    const target = mouseOverEvent.currentTarget as HTMLElement;
                    target.classList.remove('drag-item-to-left');
                    target.classList.remove('drag-item-to-next');
                    if (moveUpOrDown(mouseOverEvent)) {
                        target.classList.add('drag-item-to-left');
                    } else {
                        target.classList.add('drag-item-to-next');
                    }
                },
                mouseLeave: (mouseLeaveEvent: MouseEvent, _index1: number) => {
                    const target = mouseLeaveEvent.currentTarget as HTMLElement;
                    target.classList.remove('drag-item-to-left');
                    target.classList.remove('drag-item-to-next');
                },
                mouseUp: (mouseUpEvent: MouseEvent, index1: number) => {
                    const target = mouseUpEvent.currentTarget as HTMLElement;
                    target.classList.remove('drag-item-to-left');
                    target.classList.remove('drag-item-to-next');
                    const up = moveUpOrDown(mouseUpEvent);
                    if (index1 != mouseDownIndex && index1 != mouseDownIndex + (up ? 1 : -1)) {
                        props.list.splice(mouseDownIndex, 1);
                        props.list.splice(index1 + (index1 < mouseDownIndex ? 1 : 0) - (up ? 1 : 0), 0, music);
                        props.onMusicOrderChange?.(props.list);
                    }
                },
            }
        }
        drag.value!.x = event2.clientX;
        drag.value!.y = event2.clientY;
    };
    document.addEventListener('mousemove', onMousemove);
    //鼠标松开事件
    document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', onMousemove);
        drag.value = undefined;
    });
}

</script>
<template>
    <div class="pay-list">
        <div class="line line-title">
            <div class="index">#</div>
            <div class="info">歌曲</div>
            <div class="like">喜欢</div>
        </div>
        <div class="line line-content" :class="{ playing: compareMusic(musicPlayer.currentMusic, music) }"
            v-for="music, index of props.list" @mousedown="mouseDown($event, music, index)"
            @mouseup="drag?.mouseUp($event, index)" @mousemove="drag?.mouseMove($event, index)"
            @mouseleave="drag?.mouseLeave($event, index)">
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
                        <PlayerInfoTag class="item-player" :playerName="music.playerName" />
                        <!-- 作者 -->
                        <div class="item-author">{{ music.musicAuthor }}</div>
                    </div>
                </div>
                <!-- 按钮组 -->
                <div class="button-grep">
                    <div class="button-grep-button" :title="button.title" @click="button.onClick?.(index)"
                        v-for="button of props.customButtons">
                        <component :is="button.icon" :style="['width: 100%; height: 100%;', button.style]" />
                    </div>
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
        <!-- 拖动中的元素 -->
        <div v-if="drag" class="drag-item">
            <ImgDiv class="info-icon" :src="drag.music.iconUrl" />
            <div class="info-content">
                <!-- 名称 -->
                <div class="info-name">{{ drag.music.musicName }}</div>
                <!-- 名称下面一排 -->
                <div class="info-author">
                    <!-- 播放器 -->
                    <PlayerInfoTag class="item-player" :playerName="drag.music.playerName" />
                    <!-- 作者 -->
                    <div class="item-author">{{ drag.music.musicAuthor }}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.pay-list .line.line-content.drag-item-to-left {
    border-top: 0.1rem solid var(--color-pay-list-drag-item-border-line);
    border-radius: 0;
    background-color: unset;
}

.pay-list .line.line-content.drag-item-to-next {
    border-bottom: 0.1rem solid var(--color-pay-list-drag-item-border-line);
    border-radius: 0;
    background-color: unset;
}

.drag-item {
    padding: 0.5rem;
    border-radius: 0.5rem;
    background-color: var(--color-pay-list-drag-item-bg);
    border: 0.1rem solid var(--color-pay-list-drag-item-border);
    width: 15rem;
    position: fixed;
    top: calc(v-bind("`${drag?.y}px`") - 1.5rem);
    left: calc(v-bind("`${drag?.x}px`") + 0.5rem);
    display: flex;
    gap: 0.5rem;
}

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

.drag-item .item-player,
.pay-list .line-content .info-author .item-player {
    font-size: 0.7rem;
}

.drag-item .item-author,
.pay-list .line-content .info-author .item-author {
    word-break: keep-all;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    width: 0;
}

.drag-item .info-author,
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

.drag-item .info-name,
.pay-list .line-content .info-name {
    font-size: 0.9rem;
    color: var(--color-pay-list-line-content-info-name-font);
    word-break: keep-all;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.drag-item .info-content,
.pay-list .line-content .info-content {
    flex: 1;
    width: 0;
    height: 2.5rem;
    display: flex;
    flex-direction: column;
}

.drag-item .info-icon,
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
    height: 3.5rem;
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
</style>