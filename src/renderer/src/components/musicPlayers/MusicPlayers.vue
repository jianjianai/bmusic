<script setup lang="ts">
import { getMusicPlayer } from './musicPlayers'
import { musicPlayer } from '../../states/musicPlayerStates'


</script>

<template>
  <component :is="getMusicPlayer(musicPlayer.currentMusic?.playerName)" :key="musicPlayer.currentMusic"></component>
</template>

<style scoped></style>
