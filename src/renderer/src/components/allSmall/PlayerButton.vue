<script setup lang="ts">
import type { Component } from 'vue';

const props = defineProps<{icon:Component}>()

</script>
<template>
    <div class="player-but player-but-tomin">
        <component :is="props.icon" class="player-but-icon"></component>
    </div>
</template>
<style scoped>
/* 按钮 */
.player-but:hover {
    background-color: var(--color-contr-top-btn-bgc-hover);
}

.player-but {
    position: absolute;
    background-color: var(--color-contr-top-btn-bgc);
    border-radius: 0.5rem;
    width: 2.5rem;
    height: 2.5rem;
    border: 0.1rem solid var(--color-contr-top-btn-border);
    cursor: pointer;
}

/* 按钮里面的图标 */
.player-but-icon {
    position: absolute;
    color: var(--color-contr-top-btn-text);
    width: 60%;
    height: 60%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
</style>