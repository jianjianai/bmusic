import {
  fullScreen,
  pause, play, regOnPlaybackLengthChange,
  regOnPlaybackProgressChange,
  regOnPlaybackStateChange,
  setPlaybackProgress
} from './Control'
export function BilibiliMusicPlayerInit(){
    if (window.location.hostname !== 'www.bilibili.com') {
        return;
    }
    window.addEventListener('load', ()=>{
      function findPlayer(){
        console.log('findPlayer')
        const player = document.querySelector('.bpx-player-ctrl-time-label');
        if(!player){
          setTimeout(findPlayer, 500);
          return;
        }
        onLoaded();
      }
      setTimeout(findPlayer, 500);
    });
}
function onLoaded() {
  regOnPlaybackLengthChange((length) => {
    window.parent.postMessage({type: 'onPlaybackLengthChange', value: length}, '*');
  });
  regOnPlaybackProgressChange((progress) => {
    window.parent.postMessage({type: 'onPlaybackProgressChange', value: progress}, '*');
  });
  regOnPlaybackStateChange((playing) => {
    console.log(playing)
    window.parent.postMessage({type: 'onPlaybackStateChange', value: playing}, '*');
  });
  window.addEventListener('message', (event) => {
    const data = event.data;
    if (data.type === 'setPlaybackProgress') {
      setPlaybackProgress(data.value);
    }else if (data.type === 'pause') {
      pause();
    }else if (data.type === 'play') {
      play();
    }
  });
  fullScreen();  //自动网页全屏
}













