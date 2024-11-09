<script lang="ts" setup>
import { setContent, contentDisplay, contentData } from '@renderer/mod/content/content';
import SearchIcon from '@renderer/components/svg/Search.vue'
import Recommend from '../content/contents/Recommend.vue';
import { h, reactive, ref, watch } from 'vue';
import { playListStorage, MYLIKEED_PLAYLIST_NAME } from '@renderer/storage/playListStorage';
import PlayListContents from '../content/contents/PlayListContents.vue';
import IcFavoriteSvg from '@renderer/components/svg/IcFavorite.vue';
import ImgDiv from '@renderer/components/ImgDiv.vue';
import ContextMenu from '@imengyu/vue3-context-menu'
import TrashSvg from '@renderer/components/svg/Trash.vue';
import { closePopUpComponent, openPopUpComponent } from '@renderer/mod/popUp/popUp';
import Confirm from '../popUp/popUps/Confirm.vue';


const iconMap = reactive(new Map<string, string>);
const shwoPlayLists = ref<string[]>([]);
watch(() => playListStorage.playLists, async () => {
  shwoPlayLists.value = playListStorage.playLists.filter(n => n !== MYLIKEED_PLAYLIST_NAME);
  iconMap.clear();
  for (const name of shwoPlayLists.value) {
    iconMap.set(name, await playListStorage.readPlayListIconUrl(name));
  }
}, { immediate: true });

//用于拖动排序
//拖拽功能
let drag = ref<{
  x: number,
  y: number,
  musicList: string,
  mouseUp: (event: MouseEvent, index: number) => void,
  mouseMove: (event: MouseEvent, index: number) => void,
  mouseLeave: (event: MouseEvent, index: number) => void,
}>();
function mouseDown(_mouseDownEvent: MouseEvent, musicList: string, mouseDownIndex: number) {
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
        musicList: musicList,
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
            shwoPlayLists.value.splice(mouseDownIndex, 1);
            shwoPlayLists.value.splice(index1 + (index1 < mouseDownIndex ? 1 : 0) - (up ? 1 : 0), 0, musicList);
            //保存排序结果
            playListStorage.sortPlayList(shwoPlayLists.value);
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

// 邮件菜单
function onContextMenu(e: MouseEvent, name: string) {
  e.preventDefault();
  ContextMenu.showContextMenu({
    x: e.x,
    y: e.y,
    minWidth: 200,
    items: [
      {
        label: "查看",
        divided: true,
        icon: h(SearchIcon, { style: "color: black; width: 1rem; height: 1rem;" }),
        onClick: () => setContent(PlayListContents, { musicListName: name })
      },
      {
        label: "删除歌单",
        icon: h(TrashSvg, { style: "color: black; width: 1rem; height: 1rem;" }),
        onClick: () => {
          const popUpId = openPopUpComponent(Confirm, {
            title: '删除歌单',
            content: '确定删除这个歌单吗？',
            confirm: async () => {
              await playListStorage.deletePlayList(name);
              closePopUpComponent(popUpId);
            },
            cancel: () => {
              closePopUpComponent(popUpId);
            }
          })
        }
      }
    ]
  });
}



</script>
<template>
  <div class="nav">
    <!-- 发现音乐 -->
    <div class="nav-item" :class="{ selected: contentDisplay === Recommend }" @click="setContent(Recommend, {})">
      <SearchIcon class="icon"></SearchIcon>
      <div class="title">发现音乐</div>
    </div>
    <!-- 搜索 -->
    <!-- <div class="nav-item" :class="{ selected: contentDisplay === Search }" @click="setContent(Search, {})">
      <SearchIcon class="icon"></SearchIcon>
      <div class="title">搜索</div>
    </div> -->

    <!-- 分割线 -->
    <div class="dividing-line"></div>
    <div class="line-title">我的</div>
    <!-- 我喜欢的 -->
    <div class="nav-item"
      :class="{ selected: contentDisplay === PlayListContents && contentData?.musicListName == MYLIKEED_PLAYLIST_NAME }"
      @click="setContent(PlayListContents, { musicListName: MYLIKEED_PLAYLIST_NAME })">
      <IcFavoriteSvg class="icon"></IcFavoriteSvg>
      <div class="title">我喜欢的</div>
    </div>

    <!-- 分割线 -->
    <div class="dividing-line"></div>
    <div class="line-title">歌单</div>
    <div class="paylist-item" v-for="name, index of shwoPlayLists"
      :class="{ selected: contentDisplay === PlayListContents && contentData?.musicListName == name && !drag }"
      @click="setContent(PlayListContents, { musicListName: name })" @mousedown="mouseDown($event, name, index)"
      @mousemove="drag?.mouseMove($event, index)" @mouseup="drag?.mouseUp($event, index)"
      @mouseleave="drag?.mouseLeave($event, index)" @contextmenu="onContextMenu($event, name)">
      <ImgDiv class="icon" :src="iconMap.get(name)"></ImgDiv>
      <div class="title">{{ name }}</div>
    </div>
    <!-- 拖动中的歌单 -->
    <div class="paylist-item-drag" v-if="drag">
      <ImgDiv class="icon" :src="iconMap.get(drag.musicList)"></ImgDiv>
      <div class="title">{{ drag.musicList }}</div>
    </div>
  </div>
</template>
<style scoped>
.paylist-item-drag {
  position: fixed;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: nowrap;
  gap: 0.3rem;
  border-radius: 0.5rem;
  padding: 0.2rem 0.4rem;
  top: calc(v-bind("`${drag?.y}px`") - 1rem);
  left: calc(v-bind("`${drag?.x}px`") + 0.5rem);
  color: var(--color-nav-paylist-font);
  width: 9rem;
  background-color: var(--color-nav-item-drag-bg);
}

.paylist-item.drag-item-to-next:hover,
.paylist-item.drag-item-to-next {
  border-bottom: 0.1rem solid var(--color-nav-item-drag-border-line);
  border-radius: 0;
  background-color: unset;
}

.paylist-item.drag-item-to-left:hover,
.paylist-item.drag-item-to-left {
  border-top: 0.1rem solid var(--color-nav-item-drag-border-line);
  border-radius: 0;
  background-color: unset;
}

.paylist-item.selected:hover,
.paylist-item.selected {
  background-color: var(--color-nav-item-selected-bg);
  color: var(--color-nav-item-selected-font);
}

.paylist-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: nowrap;
  gap: 0.3rem;
  margin: 0.1rem 0.7rem 0.1rem 1.2rem;
  border-radius: 0.5rem;
  padding: 0.2rem 0.4rem;
  color: var(--color-nav-paylist-font);
  cursor: pointer;
  user-select: none;
}

.paylist-item-drag .title,
.paylist-item .title {
  flex: 1;
  width: 0;
  font-size: 0.8rem;
  text-overflow: ellipsis;
  overflow: hidden;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  display: -webkit-box;
  user-select: none;
}

.paylist-item-drag .icon,
.paylist-item .icon {
  width: 2rem;
  height: 2rem;
  border-radius: 0.3rem;
}


.line-title {
  font-size: 0.8rem;
  color: var(--color-nav-line-title);
  margin: 0.5rem 0.7rem 0.5rem 1.2rem;
  font-weight: bolder;
}

.dividing-line {
  border-bottom: 0.1rem solid var(--color-nav-dividing-line);
  margin: 0.5rem 0.7rem 0.5rem 1.2rem;
}

.nav-item.selected:hover,
.nav-item.selected {
  background-color: var(--color-nav-item-selected-bg);
  color: var(--color-nav-item-selected-font);
}

.nav-item .title {
  font-size: 0.9rem;
}

.nav-item .icon {
  width: 1.3rem;
  height: 1.3rem;
}

.nav-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: nowrap;
  gap: 0.5rem;
  margin: 0.3rem 0.7rem 0.3rem 1.2rem;
  border-radius: 0.5rem;
  padding: 0.4rem;
  color: var(--color-nav-font);
  cursor: pointer;
}

.paylist-item:hover,
.nav-item:hover {
  background-color: var(--color-nav-item-hover-bg);
}

.nav {
  background-color: var(--color-lav-bg);
  width: var(--left-vav-width);
  padding: calc(var(--top-bar-height) + 0.5rem) 0 0.5rem 0;
  overflow-y: scroll;
}

/*滚动条整体样式*/
.nav::-webkit-scrollbar {
  width: 0.4rem;
}

/*滚动条里面小方块*/
.nav:hover::-webkit-scrollbar-thumb {
  border-radius: 0.2rem;
  background-color: var(--color-nav-scrollbar-thumb);
}
</style>