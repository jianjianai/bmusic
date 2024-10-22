import {
  autoCloseCaptcha,
  fullScreen,
  pause, play, regBpxStateBuff, regOnPlaybackLengthChange,
  regOnPlaybackProgressChange,
  regOnPlaybackStateChange,
  setPlaybackProgress
} from './Control'
import { ipcRenderer } from 'electron'


async function onLoaded() {
  regOnPlaybackLengthChange((length) => {
    ipcRenderer.sendToHost("onPlaybackLengthChange",length);
  });
  regOnPlaybackProgressChange((progress) => {
    ipcRenderer.sendToHost('onPlaybackProgressChange', progress);
  });
  regOnPlaybackStateChange((playing) => {
    ipcRenderer.sendToHost('onPlaybackStateChange', playing);
  });
  regBpxStateBuff((buff)=>{
    ipcRenderer.sendToHost('onBpxStateBuff', buff);
  });
  ipcRenderer.on("setPlaybackProgress",(_event,...args:any[])=>{
    setPlaybackProgress(args[0]);
  });
  ipcRenderer.on("pause",(_event,..._args:any[])=>{
    pause();
  });
  ipcRenderer.on("play",(_event,..._args:any[])=>{
    play();
    fullScreen(); 
  });
  ipcRenderer.on("fullScreen",(_event,..._args:any[])=>{
    fullScreen();
  });
  fullScreen();  //自动网页全屏
  autoCloseCaptcha();  //自动关闭验证码
}


window.addEventListener('load', () => {
  function findPlayer() {
    console.log('findPlayer')
    const player = document.querySelector('.bpx-player-ctrl-time-label');
    if (!player) {
      setTimeout(findPlayer, 500);
      return;
    }
    onLoaded();
  }
  setTimeout(findPlayer, 500);
});










