const fire = require('./onfire')
let innerAudioContext = wx.createInnerAudioContext();
innerAudioContext.autoplay = true; 
innerAudioContext.loop = false; // 默认不单曲循环
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
       console.log('loop',innerAudioContext.loop);
       if(!innerAudioContext.loop){
          fire.fire('endMusic');
       }
    })
  })
  pause();

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
    console.log('暂停了')
  })
  innerAudioContext.pause();
};

function seek(number){
  innerAudioContext.seek(number);
}
function setLoop(){
  innerAudioContext.loop = !innerAudioContext.loop;
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