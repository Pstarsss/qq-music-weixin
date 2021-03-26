const fire = require('./onfire')
let innerAudioContext = wx.createInnerAudioContext();
innerAudioContext.autoplay = true; 
innerAudioContext.loop = false; // 默认不单曲循环
innerAudioContext.volume = 0.2;

function init(src){
  innerAudioContext.src = src || '';
  console.log('innerAudioContext:',innerAudioContext.duration);
  innerAudioContext.onCanplay(() => {
    console.log('currentTime:',innerAudioContext.currentTime);
    wx.nextTick(() => {

    })
    console.log('duration:',innerAudioContext.duration);
    innerAudioContext.onTimeUpdate(() => {
      fire.fire('playingTime',{
        currentTime:innerAudioContext.currentTime,
        duration:innerAudioContext.duration,
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
  // pause();
  // return  innerAudioContext;
}
function play(){
  innerAudioContext.play();
  innerAudioContext.onPlay(() => {
    // console.log('开始播放')
  })
  

  innerAudioContext.onError((res) => {
    console.log('onError:',res.errMsg)
    console.log('onError:',res.errCode)
  })
}
function pause(){
  innerAudioContext.onPause(() => {
    // console.log('暂停了')
  })
  innerAudioContext.pause();
};

function seek(number){
  innerAudioContext.seek(number);
}
function setLoop(){
  innerAudioContext.loop = !innerAudioContext.loop;
}

function setVolume(value){
  innerAudioContext.volume = value;
}

function getMusicDuration() {
  return innerAudioContext.duration;
}


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
  getMusicDuration
}