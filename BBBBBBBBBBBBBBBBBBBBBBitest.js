

/***
 * 控制播放器进度 0~1 之间的小数
 */
function setPlaybackProgress(progress){
    const line = document.querySelector('.bpx-player-progress-wrap');

    const xAdd = line.getBoundingClientRect().left;
    const width = line.getBoundingClientRect().width;
    const pr =  width*progress;
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

/****
 * 当播放进度发生改变时
 */
function regOnPlaybackProgressChange(){
    const current = document.querySelector('.bpx-player-ctrl-time-current');
    new MutationObserver((mutationsList)=>{
        console.log(current.innerHTML);
    }).observe(current, {childList: true, subtree: false,attributes: false});
}






