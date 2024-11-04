<!-- 播放器显示小标签 -->
<script setup lang="ts">
import { computed } from 'vue';

function getMusicPlayerInfo(name: string) {
    const playerInfo = {
        "Bilibili": {
            colour: "#fb7299",
            displayName: "B站",
        }
    };
    return playerInfo[name];
}

const props = defineProps<{ playerName: string }>();
const info = computed(() => getMusicPlayerInfo(props.playerName));
</script>
<template>
    <div class="item-paly">
        <span class="item-paly-text">{{ info?.displayName || props.playerName }}</span>
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
    color: v-bind("info?.colour || '#7b7b7b'");
    border: 0.05em solid v-bind("info?.colour || '#7b7b7b'");
    height: 0.9em;
    border-radius: 0.3em;
    padding: 0 0.2em;
    font-weight: bolder;
}
</style>