<script lang="ts" setup>
import MusicPlayerContr from './MusicPlayerContr.vue';
import MusicPlayers from './musicPlayers/MusicPlayers.vue'
import { musicPlayerSize } from '../states/musicPlayerStates';



</script>
<template>
    <div :class="{
        'bottom-music-player': musicPlayerSize === 'buttom',
        'max-music-player': musicPlayerSize === 'max'
    }">

        <div class="player-max-header" v-if="musicPlayerSize === 'max'">
            <button @click="musicPlayerSize = 'buttom'">min</button>
        </div>
        <div class="player">
            <div class="player-min-mask" @click="musicPlayerSize = 'max'" v-if="musicPlayerSize === 'buttom'"></div>
            <MusicPlayers></MusicPlayers>
        </div>
        <div class="player-bottom-control">
            <MusicPlayerContr class="player-control-grep"></MusicPlayerContr>
        </div>
    </div>
</template>
<style scoped>
.player-min-mask:hover {
    background-color: rgba(0, 0, 0, 0.036);
}

.player-min-mask {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    cursor: pointer;
}

.bottom-music-player .player {
    position: relative;
    width: 5rem;
}

.player-control-grep {
    height: 100%;
}

.bottom-music-player .player-bottom-control {
    flex: 1;
}

.player-bottom-control {
    height: 4rem;
    border-top: 0.1rem solid var(--color-music-player-border);
    padding: 0.5rem 0;
}

.max-music-player .player {
    flex: 1;
}

.player {
    background-color: aqua;
}

.bottom-music-player,
.max-music-player {
    background-color: var(--color-music-player-bg);
    display: flex;
}

.bottom-music-player {
    height: 5rem;
}

.max-music-player {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    flex-direction: column;
}
</style>
