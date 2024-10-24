import {
  autoCloseCaptcha,
  fullScreen,
  pause, play, regBpxStateBuff, regOnPlaybackLengthChange,
  regOnPlaybackProgressChange,
  regOnPlaybackStateChange,
  regOnVolumeChange,
  setPlaybackProgress,
  setVolume
} from './Control'
import { ipcRenderer } from 'electron';

async function onLoaded() {
  let length = 0;
  let ended = false;
  regOnPlaybackLengthChange((_length) => {
    length = _length;
    ipcRenderer.sendToHost("onPlaybackLengthChange", length);
  });
  regOnPlaybackProgressChange((progress) => {
    ipcRenderer.sendToHost('onPlaybackProgressChange', progress);
    if (progress >= length) {
      ended = true;
      ipcRenderer.sendToHost('onPlaybackEnded', true);
      setPlaybackProgress(0);
    } else if (ended) {
      pause();
    } else {
      ipcRenderer.sendToHost('onPlaybackEnded', false);
    }
  });
  regOnPlaybackStateChange((playing) => {
    ipcRenderer.sendToHost('onPlaybackStateChange', playing);
  });
  regBpxStateBuff((buff) => {
    ipcRenderer.sendToHost('onBpxStateBuff', buff);
  });
  regOnVolumeChange((volume) => {
    ipcRenderer.sendToHost('onVolumeChange', volume);
  });
  ipcRenderer.on("setVolume", (_event, ...args: any[]) => {
    setVolume(args[0]);
  });
  ipcRenderer.on("setPlaybackProgress", (_event, ...args: any[]) => {
    ended = false;
    setPlaybackProgress(args[0]);
  });
  ipcRenderer.on("pause", (_event, ..._args: any[]) => {
    pause();
  });
  ipcRenderer.on("play", (_event, ..._args: any[]) => {
    ended = false;
    play();
    fullScreen();
  });
  ipcRenderer.on("fullScreen", (_event, ..._args: any[]) => {
    fullScreen();
  });
  //初始化音量
  ipcRenderer.sendToHost("reqInitVolume");
  fullScreen();  //自动网页全屏
  autoCloseCaptcha();  //自动关闭验证码
}


window.addEventListener('DOMContentLoaded', () => {
  function findPlayer() {
    console.log('findPlayer')
    const player = document.querySelector('.bpx-player-ctrl-time-label');
    if (!player) {
      setTimeout(findPlayer, 10);
      return;
    }
    onLoaded();
  }
  setTimeout(findPlayer, 10);
});










