let globalData = getApp().globalData
let innerAudioContext = wx.createInnerAudioContext() ;

function init(src){
  innerAudioContext.autoplay = true;
  innerAudioContext.loop = true;
  innerAudioContext.volume = 0.5;
  innerAudioContext.src = src || '';
  globalData.src = src || '';
  innerAudioContext.pause();
}
function play(){
  innerAudioContext.play();
  innerAudioContext.onPlay(() => {
    console.log('开始播放')
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