<script setup lang="ts">
import ContrBetween from './unit/ContrBetween.vue';
import ContrLeft from './unit/ContrLeft.vue';
import ContrRight from './unit/ContrRight.vue';

</script>
<template>
    <div class="player-bottom-control">
        <!-- 左边 -->
        <ContrLeft class="left-control player-control-grep" />
        <!-- 中间播放控制器 -->
        <ContrBetween class="player-control-grep" />
        <!-- 右边 -->
        <ContrRight class="right-control player-control-grep" />
    </div>
</template>
<style scoped>
.left-control,
.right-control {
    flex: 1;
    width: 0;
}

.player-control-grep {
    height: 100%;
}

.player-bottom-control {
    height: calc(var(--button-player-height) - 1rem - 0.1rem);
    border-top: 0.1rem solid var(--color-music-player-border);
    padding: 0.5rem 0;
    display: flex;
    justify-content: space-between;
    background-color: var(--color-music-player-bg);
}
</style>