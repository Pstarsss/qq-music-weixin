import regeneratorRuntime from 'regenerator-runtime'
const api = require('../../../router/api');
const util = require('../../../utils/util')
const app = getApp();
const globalData = app.globalData
Page({
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    console.log(globalData)
    let that = this
    this.setData({
      songmid:e.id,
      mid:e.mid
    },() => {
      that.getSongInfo();
      that.getLyric();
      that.getMusicPlay();
      that.getImageUrl();
    })
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('songDetail',(res) => {
      that.setData({
        topListinfo: res.data
      },() => {
        // that.getAlbumInfo();
      })
    })
  },
  onUnload: function () {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.off('songDetail');
  },
  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  },
  play(){
    const innerAudioContext = wx.createInnerAudioContext();
    globalData.song = this.data.mid;
    innerAudioContext.autoplay = true
    innerAudioContext.src = `${this.data.playUrl}`
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },
  async getSongInfo(){
    let temp = await util.request(`${api.getSongInfo}?songmid=${this.data.songmid}`,{},"get");
    console.log('getSongInfo',temp.data.response.songinfo);
    this.setData({
      songinfo:temp.data.response.songinfo
    });
  },
  async getMusicPlay(){
    let temp = await util.request(`${api.getMusicPlay}?songmid=${this.data.songmid}&justPlayUrl=all`,{},"get");
    console.log('getMusicPlay',temp.data.data.playUrl);
    this.setData({
      playUrl:temp.data.data.playUrl[`${this.data.songmid}`].url
    },() => {
      if(this.data.playUrl){
        this.play();
      } else {
        util.pxshowErrorToast('抱歉，暂无该歌曲资源',1000);
      }
    })
  },
  async getLyric(){
    let temp = await util.request(`${api.getLyric}?songmid=${this.data.songmid}`,{},"get");
    console.log('getLyric',temp.data.response.lyric);
    let songlyric = temp.data.response.lyric.replace(new RegExp(/\[(\S*)\]/g),'');
    let songTime = temp.data.response.lyric.match(new RegExp(/\[(\S*)\]/g));
    songTime.splice(0,4)
    this.setData({
      lyric:songlyric,
      songTime:songTime
    })
  },
  async getImageUrl(){
    let temp = await util.request(`${api.getImageUrl}?id=${this.data.mid}`,{},"get");
    console.log('getImageUrl',temp.data.response.data.imageUrl);
    this.setData({
      imageUrl:temp.data.response.data.imageUrl
    })
  },
  
})