<!-- 播放器显示小标签 -->
<script setup lang="ts">
import { getMusicPlayerColour } from '../musicPlayers/musicPlayers';

defineProps<{ playerName: string }>();
</script>
<template>
    <div class="item-paly">
        <span class="item-paly-text">{{ playerName }}</span>
    </div>
</template>
<style scoped>
.item-paly-text {
    display: block;
    font-size: 0.7em;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
}

.item-paly {
    position: relative;
    color: v-bind("getMusicPlayerColour(playerName) || '#7b7b7b'");
    border: 0.05em solid v-bind("getMusicPlayerColour(playerName) || '#7b7b7b'");
    height: 0.9em;
    border-radius: 0.3em;
    padding: 0 0.2em;
    font-weight: bolder;
}
</style>