<script setup lang="ts">
import { getMusicPlayer } from './musicPlayers'
import { musicKey, musicPlayer, musicPlayerLink } from '@renderer/mod/playing/playing'


</script>

<template>
  <component :is="getMusicPlayer(musicPlayer.currentMusic?.playerName)" :musicPlayerLink="musicPlayerLink" :key="musicKey(musicPlayer.currentMusic)"></component>
</template>

<style scoped></style>
