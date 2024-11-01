
/**
 * 设置音量
 * @param volume 音量 0~1
 */
export function setVolume(volume: number) {
  const lineLength = document.querySelector('.bpx-player-control-entity') as HTMLElement;
  const lineLengthShwo = lineLength.style.display != 'none';

  if (!lineLengthShwo) {
    // 屏幕太小会隐藏进度条导致无法设置进度，强行显示进度条
    lineLength.style.display = 'block';
  }

  const volumeBar = document.querySelector('.bpx-player-ctrl-volume-box') as HTMLElement;
  const volumeLine = document.querySelector('.bpx-player-ctrl-volume-box .bui-area') as HTMLElement;

  volumeBar.style.display = 'block';

  const xAdd = volumeLine.getBoundingClientRect().bottom;
  const height = volumeLine.getBoundingClientRect().height;
  const pr = height * Math.max(0, Math.min(1, volume));
  const y = xAdd - pr;

  volumeLine.dispatchEvent(new MouseEvent('mousedown', {
    view: window,
    bubbles: true,
    cancelable: true,
    clientX: 0,
    clientY: y
  }));

  volumeLine.dispatchEvent(new MouseEvent('mouseup', {
    view: window,
    bubbles: true,
    cancelable: true,
    clientX: 0,
    clientY: y
  }));

  volumeBar.style.display = "";

  if (!lineLengthShwo) {
    // 如果强行显示了进度条，那么隐藏进度条
    lineLength.style.display = 'none';
  }
}

/***
 * 当音量发生改变时
 */
export function regOnVolumeChange(func: (volume: number) => void) {
  const volumeNum = document.querySelector('.bpx-player-ctrl-volume-box .bpx-player-ctrl-volume-number') as HTMLElement;
  new MutationObserver(() => {
    func(parseFloat(volumeNum.innerText) / 100);
  }).observe(volumeNum, { childList: true, subtree: false, attributes: false });
}


/***
 * 控制播放器进度
 * @param progress 当前播放到的时间，单位毫秒
 */
export function setPlaybackProgress(progress: number) {
  const line = document.querySelector('.bpx-player-progress-wrap') as HTMLElement;
  const lineLength = document.querySelector('.bpx-player-control-entity') as HTMLElement;
  const lineLengthShwo = lineLength.style.display != 'none';

  if (!lineLengthShwo) {
    // 屏幕太小会隐藏进度条导致无法设置进度，强行显示进度条
    lineLength.style.display = 'block';
  }

  const xAdd = line.getBoundingClientRect().left;
  const width = line.getBoundingClientRect().width;
  const pr = width * Math.max(0, Math.min(1, progress / getMusicLength()));
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

  if (!lineLengthShwo) {
    // 如果强行显示了进度条，那么隐藏进度条
    lineLength.style.display = 'none';
  }
}

/**将 mm:ss 转换为毫秒 */
function timeToMillisecond(time: string): number {
  const t = time.split(':');
  return (parseInt(t[0]) * 60 + parseInt(t[1])) * 1000;
}

/***
 * 注册状态缓冲改变时
 */
export function regBpxStateBuff(func: (buff: boolean) => void) {
  const playBtn = document.querySelector('.bpx-player-container')!;
  func(playBtn.classList.contains('bpx-state-buff'));
  new MutationObserver(() => {
    func(playBtn.classList.contains('bpx-state-buff'));
  }).observe(playBtn, { childList: false, subtree: false, attributes: true });
}

/****
 * 当播放进度发生改变时
 */
export function regOnPlaybackProgressChange(func: (progress: number) => void) {
  const current = document.querySelector('.bpx-player-ctrl-time-current') as HTMLElement;
  func(timeToMillisecond(current.innerText));
  new MutationObserver(() => {
    func(timeToMillisecond(current.innerText));
  }).observe(current, { childList: true, subtree: false, attributes: false });
}

/**
 * 当暂停或播放时
 * */
export function regOnPlaybackStateChange(func: (playing: boolean) => void) {
  const playBtn = document.querySelector('.bpx-player-container')!;
  func(!playBtn.classList.contains('bpx-state-paused'));
  new MutationObserver(() => {
    func(!playBtn.classList.contains('bpx-state-paused'));
  }).observe(playBtn, { childList: false, subtree: false, attributes: true });
}

/**
 * 获取音乐播放暂停状态
 */
export function getPlaybackState(): boolean {
  const playBtn = document.querySelector('.bpx-player-container')!;
  return !playBtn.classList.contains('bpx-state-paused');
}

/**
 * 当音乐长度发生改变时
 * */
export function regOnPlaybackLengthChange(func: (length: number) => void) {
  const total = document.querySelector('.bpx-player-ctrl-time-duration') as HTMLElement;
  func(timeToMillisecond(total.innerText));
  new MutationObserver(() => {
    func(timeToMillisecond(total.innerText));
  }).observe(total, { childList: true, subtree: false, attributes: false });
}

/**
 * 获取音乐长度
 * */
export function getMusicLength(): number {
  const total = document.querySelector('.bpx-player-ctrl-time-duration') as HTMLElement;
  return timeToMillisecond(total.innerText);
}

/**
 * 点击播放暂停按钮
 */
export function clickPlay() {
  const playBtn = document.querySelector('.bpx-player-ctrl-btn.bpx-player-ctrl-play')!;
  playBtn.dispatchEvent(new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true
  }));
}

/**
 * 暂停
 * */
export function pause() {
  if (!getPlaybackState()) {
    return;
  }
  clickPlay();
}

/**
 * 播放
 * */
export function play() {
  if (getPlaybackState()) {
    return;
  }
  clickPlay();
}


/**
 * 点击网页全屏按钮
 * */
export function clickFullScreen() {
  const fullScreenBtn = document.querySelector('.bpx-player-ctrl-btn.bpx-player-ctrl-web')!;
  fullScreenBtn.dispatchEvent(new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true
  }));
}

/**
 * 是否网页全屏
 * */
export function isFullScreen(): boolean {
  const fullScreenBtn = document.querySelector('.bpx-player-ctrl-btn.bpx-player-ctrl-web')!;
  return fullScreenBtn.classList.contains('bpx-state-entered');
}

/**
 * 网页全屏
 * */
export function fullScreen() {
  if (isFullScreen()) {
    return;
  }
  clickFullScreen();
}

/**
 * 取消网页全屏
 * */
export function cancelFullScreen() {
  if (!isFullScreen()) {
    return;
  }
  clickFullScreen();
}


/**
 * 验证码出现时关闭验证码
 * */
// export function autoCloseCaptcha() {
//   new MutationObserver((c) => {
//     console.log("find captcha");
//     for (let mutationRecord of c) {
//       if (
//         (mutationRecord.previousSibling as HTMLElement)?.classList?.contains("geetest_panel") &&
//         (mutationRecord.previousSibling as HTMLElement)?.classList?.contains("geetest_wind")
//       ) {
//         let div = document.createElement('div');
//         div.appendChild((mutationRecord.previousSibling as HTMLElement));
//       }
//     }
//   }).observe(document.body, { childList: true, subtree: false, attributes: false });
// }

/**
 * 点赞
 */
export function clickLike() {
  const likeButtoin = document.querySelector(".video-like.video-toolbar-left-item");
  if (likeButtoin!.classList.contains("on")) {
    return;
  }
  likeButtoin!.dispatchEvent(new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true
  }));
}

/**
 * 取消点赞
 */
export function cancelLike() {
  const likeButtoin = document.querySelector(".video-like.video-toolbar-left-item");
  if (!likeButtoin!.classList.contains("on")) {
    return;
  }
  likeButtoin!.dispatchEvent(new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true
  }));
}

/**
 * 当点赞状态发生变化时
 */
export function regOnLikeChange(func: (like: boolean) => void) {
  const likeButtoin = document.querySelector(".video-like.video-toolbar-left-item");
  func(likeButtoin!.classList.contains("on"));
  new MutationObserver(() => {
    func(likeButtoin!.classList.contains("on"));
  }).observe(likeButtoin!, { childList: false, subtree: false, attributes: true });
}

/** 投币状态发生变化时 */
export function regOnCoinChange(func: (coin: boolean) => void) {
  const coinButtoin = document.querySelector(".video-coin.video-toolbar-left-item");
  func(coinButtoin!.classList.contains("on"));
  new MutationObserver(() => {
    func(coinButtoin!.classList.contains("on"));
  }).observe(coinButtoin!, { childList: false, subtree: false, attributes: true });
}

/** 投币 */
export async function clickCoin() {
  const coinButtoin = document.querySelector(".video-coin.video-toolbar-left-item");
  if (coinButtoin!.classList.contains("on")) {
    return;
  }
  coinButtoin!.dispatchEvent(new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true
  }));
  for (let i = 0; i < 10; i++) {
    const coinButtoin2 = document.querySelector(".coin-bottom .bi-btn");
    if(!coinButtoin2){
      await new Promise((resolve) => setTimeout(resolve, 200));
      continue;
    }
    coinButtoin2.dispatchEvent(new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true
    }));
  }
}

