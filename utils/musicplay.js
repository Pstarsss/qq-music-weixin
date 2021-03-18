const fire = require('./onfire')
let globalData = getApp().globalData
let innerAudioContext;

function init(src){
  if(globalData.src && globalData.src != src){
    destroy();
  }
  innerAudioContext = wx.createInnerAudioContext() ;
  innerAudioContext.autoplay = true;
  innerAudioContext.loop = true;
  innerAudioContext.volume = 0.5;
  innerAudioContext.src = src || '';
  globalData.src = src || '';
  globalData.innerAudioContext = innerAudioContext;
  innerAudioContext.onCanplay(() => {
    console.log('currentTime:',innerAudioContext.currentTime);
    console.log('duration:',innerAudioContext.duration);
    innerAudioContext.onTimeUpdate(() => {
      fire.fire('playingTime',{
        currentTime:innerAudioContext.currentTime,
        duration:innerAudioContext.duration
      })
    })
  })
  pause();

}
function play(){
  innerAudioContext.play();
  innerAudioContext.onPlay(() => {
    
  })
  
  innerAudioContext.onError((res) => {
    console.log(res.errMsg)
    console.log(res.errCode)
  })
}
function pause(){
  innerAudioContext.onPause(() => {
    console.log('开始播放')
  })
  innerAudioContext.pause();
};

function destroy(){
  innerAudioContext.destroy();
}


module.exports = {
  init,
  play,
  pause
}