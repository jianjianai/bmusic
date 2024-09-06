<script lang="ts" setup>
import { MusicPlayerState } from '@renderer/states/MusicPlayerState';

</script>
<template>
    <div :class="{
        'bottom-music-player': MusicPlayerState.size === 'buttom',
        'max-music-player': MusicPlayerState.size === 'max'
    }">

        <div class="player-max-header" v-if="MusicPlayerState.size==='max'">
            <button @click="MusicPlayerState.size = 'buttom'">min</button>
        </div>
        <button v-if="MusicPlayerState.size==='buttom'"  @click="MusicPlayerState.size = 'max'">max</button>
        <div class="player">
            播放器mini
        </div>
        
        <div class="player-bottom-control">
            控制器
        </div>
    </div>
</template>
<style scoped>
.bottom-music-player .player-bottom-control{
    flex: 1;
}
.player-bottom-control{
    height: 5rem;
    border-top: 0.1rem solid var(--color-music-player-border);
}
.max-music-player .player{
    flex: 1;
}
.player{
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