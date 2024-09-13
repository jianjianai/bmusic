<script lang="ts" setup>
import { contentState } from '../states/contentState';
import SearchIcon  from './svg/Search.vue'
import Recommend from './contents/Recommend.vue';
import Search from './contents/Search.vue';
import { markRaw } from 'vue';

const navItems = [
    {
        title: '搜索',
        component: markRaw(Search),
        icon: markRaw(SearchIcon)
    },
    {
        title: '发现音乐',
        component: markRaw(Recommend),
        icon: markRaw(SearchIcon)
    }
]

</script>
<template>
    <div class="nav">
        <div 
        v-for="item in navItems" 
        :key="item.title" 
        class="nav-item" 
        :class="{selected:contentState.displayComponent===item.component}"
        @click="contentState.displayComponent=item.component"
        >
            <component :is="item.icon" class="icon"></component>
            <div class="title">{{ item.title }}</div>
        </div>
    </div>
</template>
<style scoped>

.nav-item .title {
  font-size: 1rem;
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

.nav-item:hover {
  background-color: var(--color-nav-item-hover-bg);
}

.nav {
  background-color: var(--color-lav-bg);
  width: 12rem;
  padding: 0.5rem 0;
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