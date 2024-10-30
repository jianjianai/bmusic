<script setup lang="ts">
import { getMusicEditor } from './musicPlayers'

const model = defineModel<{
    playerData?:string,
    playerName?:string
}>({required: true});
const playerEditor = getMusicEditor(model.value.playerName);

</script>

<template>
    <template v-if="playerEditor">
        <slot></slot>
        <component :is="playerEditor" v-model:playerData="model.playerData"></component>
    </template>
</template>

<style scoped>

</style>
