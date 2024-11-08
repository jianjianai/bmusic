<script lang="ts" setup>
import { computed, ref } from 'vue';
import { musicPlayers, type MusicSearchComponent } from '@renderer/musicPlayers/musicPlayers';

const props = defineProps<{ keyword: string }>();
const searchPlayers = computed(() => {
    const players: { key: string, displayName?: string, search: MusicSearchComponent }[] = [];
    for (const index in musicPlayers) {
        const value = musicPlayers[index];
        if (value.search) {
            players.push({
                key: index,
                displayName: value.displayName,
                search: value.search
            });
        }
    }
    return players;
});
const currentPlayer = ref<{ key: string, displayName?: string, search: MusicSearchComponent } | undefined>(searchPlayers.value[0]);


</script>
<template>
    <div class="search-contents-main-box">
        <div class="search-title">{{ props.keyword }} 搜索结果:</div>

        <div class="search-c">
            <div class="player-search-greps">
                <div class="player-search" v-for="player of searchPlayers" @click="currentPlayer = player"
                    :class="{ on: player.key == currentPlayer?.key }">
                    {{ player.displayName || player.key }}
                </div>
            </div>
            <component :is="currentPlayer!.search" :keyword="props.keyword" :key="props.keyword"></component>
        </div>
    </div>
</template>
<style scoped>
.search-c {
    height: 0;
    flex: 1;
    overflow-y: auto;
    scrollbar-width: thin;
}

.player-search.on {
    color: var(--universal-search-item-text-color-on);
    border-bottom: 0.3rem solid var(--universal-search-item-text-border-bottom-color-on);
}

.player-search {
    cursor: pointer;
    font-size: 1rem;
    color: var(--universal-search-item-text-color);
    font-weight: bolder;
    transition: border-bottom 0.2s, color 0.2s;
}

.player-search-greps {
    height: 2rem;
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 1rem 0;
    margin: 0 1rem;
}

.search-title {
    font-size: 1rem;
    font-weight: bolder;
    padding-bottom: 1rem;
    border-bottom: 0.1rem solid var(--universal-input-border-color);
    margin: 1rem 1rem 0 1rem;
}

.search-contents-main-box {
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
}
</style>