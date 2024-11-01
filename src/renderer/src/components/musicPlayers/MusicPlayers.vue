<script setup lang="ts">
import { getMusicPlayer } from './musicPlayers'
import { musicPlayer, musicPlayerLink } from '../../states/musicPlayerStates'


</script>

<template>
  <component :is="getMusicPlayer(musicPlayer.currentMusic?.playerName)" :musicPlayerLink="musicPlayerLink" :key="musicPlayer.currentMusic"></component>
</template>

<style scoped></style>
