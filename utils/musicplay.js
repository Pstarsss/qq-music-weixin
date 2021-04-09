const fire = require('./onfire')

let innerAudioContext = wx.createInnerAudioContext();
innerAudioContext.autoplay = true; 
innerAudioContext.loop = false; // 默认不单曲循环
innerAudioContext.volume = 0.5;


function init(src){
  innerAudioContext.src = src || '';

  innerAudioContext.onCanplay(() => {
    console.log('currentTime:',innerAudioContext.currentTime);
    console.log('duration:',innerAudioContext.duration);
    watchCurrentmusicProgress();
    watchCurrentmusicIsEnd();
  })
  // pause();
  // return  innerAudioContext;
}

// 获取当前的歌曲播放状态
function getCurrentMusicState(){
  return innerAudioContext.paused;
}

//  播放
function play(){
  innerAudioContext.play();
  innerAudioContext.onPlay(() => {
  })
  innerAudioContext.onError((res) => {
    console.log('onError:',res.errMsg)
    console.log('onError:',res.errCode)
  })
}

// 暂停
function pause(){
  innerAudioContext.onPause(() => {
  })
  innerAudioContext.pause();
};

// 指定进度条  跳转
function seek(number){
  innerAudioContext.seek(number);
}

// 歌曲是否循环
function setLoop(){
  innerAudioContext.loop = !innerAudioContext.loop;
}

// 设置音量
function setVolume(value){
  innerAudioContext.volume = value;
}
// 获取歌曲播放总长时间
function getMusicDuration() {
  return innerAudioContext.duration;
}

// 监听当前歌曲是否结束
function watchCurrentmusicIsEnd(){
  innerAudioContext.onEnded(() => {
    console.log('onEnded');
    console.log('loop',innerAudioContext.loop);
    if(!innerAudioContext.loop){
       fire.fire('endMusic');
    }
 })
}

// 监听当前歌曲播放的进度 获取当前播放时间
function watchCurrentmusicProgress(){
  innerAudioContext.onTimeUpdate(() => {
    fire.fire('playingTime',{
      currentTime:innerAudioContext.currentTime,
      duration:innerAudioContext.duration,
    })
  });
}

// 销毁当前歌曲对象
function destroy(){
  innerAudioContext.destroy();
}



module.exports = {
  init,
  play,
  pause,
  seek,
  setLoop,
  setVolume,
  getMusicDuration,
  getCurrentMusicState
}