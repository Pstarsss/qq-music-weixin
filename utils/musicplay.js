const fire = require('./onfire')
let globalData = getApp().globalData
let innerAudioContext = wx.createInnerAudioContext();
innerAudioContext.autoplay = true;
innerAudioContext.loop = false;
innerAudioContext.volume = 0.2;

function init(src){
  innerAudioContext.src = src || '';

  innerAudioContext.onCanplay(() => {
    console.log('currentTime:',innerAudioContext.currentTime);
    console.log('duration:',innerAudioContext.duration);
    innerAudioContext.onTimeUpdate(() => {
      fire.fire('playingTime',{
        currentTime:innerAudioContext.currentTime,
        duration:innerAudioContext.duration
      })
    });
    innerAudioContext.onEnded(() => {
       console.log('onEnded');
       if(!innerAudioContext.loop){
          innerAudioContext.offTimeUpdate(() => {
            console.log('offTimeUpdate');
            fire.fire('endMusic');
          })
       }
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

function seek(number){
  innerAudioContext.seek(number);
}
function setLoop(){
  innerAudioContext.loop = true;
}

function destroy(){
  innerAudioContext.destroy();
}



module.exports = {
  init,
  play,
  pause,
  seek,
  setLoop
}