/***
 * 控制播放器进度
 * @param progress 当前播放到的时间，单位毫秒
 */
export function setPlaybackProgress(progress: number){
  const line = document.querySelector('.bpx-player-progress-wrap');
  const lineLength = document.querySelector('.bpx-player-control-entity');
  if(lineLength){
    // 屏幕太小会隐藏进度条导致无法设置进度，强行显示进度条
    lineLength.style.display = 'block';
  }
  const xAdd = line.getBoundingClientRect().left;
  const width = line.getBoundingClientRect().width;
  const pr =  width*Math.max(0, Math.min(1, progress/getMusicLength()));
  const x = pr + xAdd;

  line.dispatchEvent(new MouseEvent('mousedown', {
    view: window,
    bubbles: true,
    cancelable: true,
    clientX: x,
    clientY: 0
  }));

  window.dispatchEvent(new MouseEvent('mouseup', {
    view: window,
    bubbles: true,
    cancelable: true,
    clientX: x,
    clientY: 0
  }));
}

/**将 mm:ss 转换为毫秒 */
function timeToMillisecond(time:string):number{
  const t = time.split(':');
  return (parseInt(t[0])*60 + parseInt(t[1]))*1000;
}

/****
 * 当播放进度发生改变时
 */
export function regOnPlaybackProgressChange(func: (progress: number)=>void){
  const current = document.querySelector('.bpx-player-ctrl-time-current');
  func(timeToMillisecond(current.innerText));
  new MutationObserver(()=>{
    func(timeToMillisecond(current.innerText));
  }).observe(current, {childList: true, subtree: false,attributes: false});
}

/**
 * 当暂停或播放时
 * */
export function regOnPlaybackStateChange(func: (playing: boolean)=>void){
  const playBtn = document.querySelector('.bpx-player-container');
  func(!playBtn.classList.contains('bpx-state-paused'));
  new MutationObserver(()=>{
    func(!playBtn.classList.contains('bpx-state-paused'));
  }).observe(playBtn, {childList: false, subtree: false,attributes: true});
}

/**
 * 获取音乐播放暂停状态
 */
export function getPlaybackState():boolean{
  const playBtn = document.querySelector('.bpx-player-container');
  return !playBtn.classList.contains('bpx-state-paused');
}

/**
 * 当音乐长度发生改变时
 * */
export function regOnPlaybackLengthChange(func: (length: number)=>void){
  const total = document.querySelector('.bpx-player-ctrl-time-duration');
  func(timeToMillisecond(total.innerText));
  new MutationObserver(()=>{
    func(timeToMillisecond(total.innerText));
  }).observe(total, {childList: true, subtree: false,attributes: false});
}

/**
 * 获取音乐长度
 * */
export function getMusicLength():number{
  const total = document.querySelector('.bpx-player-ctrl-time-duration');
  return timeToMillisecond(total.innerText);
}

/**
 * 暂停
 * */
export function pause(){
  if (!getPlaybackState()) {
    return;
  }
  const playBtn = document.querySelector('.bpx-player-ctrl-btn.bpx-player-ctrl-play');
  playBtn.dispatchEvent(new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true
  }));
}

/**
 * 播放
 * */
export function play(){
  if (getPlaybackState()) {
    return;
  }
  const playBtn = document.querySelector('.bpx-player-ctrl-btn.bpx-player-ctrl-play');
  playBtn.dispatchEvent(new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true
  }));
}

/**
 * 网页全屏
 * */
export function fullScreen(){
  const fullScreenBtn = document.querySelector('.bpx-player-ctrl-btn.bpx-player-ctrl-web');
  fullScreenBtn.dispatchEvent(new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true
  }));
}

/**
 * 验证码出现时关闭验证码
 * */
export function autoCloseCaptcha(){
  new MutationObserver((c)=>{
    console.log("find captcha");
    for (let mutationRecord of c) {
      if(
        mutationRecord.previousSibling?.classList?.contains("geetest_panel") &&
        mutationRecord.previousSibling?.classList?.contains("geetest_wind")
      ){
        let div = document.createElement('div');
        div.appendChild(mutationRecord.previousSibling);
      }
    }
  }).observe(document.body, {childList: true, subtree: false,attributes: false});
}
