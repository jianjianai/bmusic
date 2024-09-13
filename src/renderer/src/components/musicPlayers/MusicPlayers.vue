<script setup lang="ts">
import { getMusicPlayer } from './musicPlayers'
import { currentMusic , musicPlayerState , musicPlayerController } from '../../states/musicPlayerStates'

import { MusicController } from './PlayerProps'
import { ref, watch } from 'vue'


const musicController:MusicController = {
  onRequestPlay(c:()=>void){musicPlayerController.value.requestPlay = c;},
  onRequestPause(c:()=>void){musicPlayerController.value.requestPause = c;},
  onRequestVolume(c:(volume:number)=>void){musicPlayerController.value.requestVolume = c;},
  onRequestCurrentTime(c:(currentTime:number)=>void){musicPlayerController.value.requestCurrentTime = c;},
  /**设置音乐时长*/
  setDuration(duration:number){
    musicPlayerState.duration = duration;
  },
  /**设置音乐当前播放位置 */
  setCurrentTime(currentTime:number){
    musicPlayerState.currentTime = currentTime;
  },
  /**设置音乐音量 */
  setVolume(volume:number){
    musicPlayerState.volume = volume;
  },
  /**设置音乐播放状态 */
  setPlaying(playing:boolean){
    musicPlayerState.playing = playing;
  },
}

const musicPlayerComponentKey = ref<string>();
watch(
  ()=>currentMusic.value.playerData,
  ()=>{
    musicPlayerState.duration = 0;
    musicPlayerState.currentTime = 0;
    musicPlayerState.playing = false;
    musicPlayerComponentKey.value = currentMusic.value.playerData;
  }
);

</script>

<template>
  <component :is="getMusicPlayer(currentMusic.playerName)"
             :key="currentMusic.playerData"
             :data="currentMusic.playerData"
             :musicController="musicController"
  ></component>
</template>

<style scoped>

</style>
