<script lang="ts" setup>
import Search from './svg/Search.vue'

</script>
<template>
    <div class="nav">

        <div class="nav-item">
            <Search class="icon"></Search>
            <div class="title">搜索</div>
        </div>

        <div class="nav-item">
            <Search class="icon"></Search>
            <div class="title">发现音乐</div>
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