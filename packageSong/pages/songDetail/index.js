import regeneratorRuntime from 'regenerator-runtime'
const api = require('../../../router/api');
const util = require('../../../utils/util');
const music = require('../../../utils/musicplay');
const app = getApp();
const globalData = app.globalData
Page({
  data: {
    currentIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    let that = this
    this.setData({
      songmid:e.id,
      mid:e.mid
    },() => {
      that.getSongInfo();
      that.getLyric();
      that.getMusicPlay();
      that.getImageUrl();
      that.getAlbumInfo();
    })
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('songDetail',(res) => {
      that.setData({
        topListinfo: res.data
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
  bofang(){
    music.init(this.data.playUrl);
    // music.play();
  },
  async getSongInfo(){
    let temp = await util.request(`${api.getSongInfo}?songmid=${this.data.songmid}`,{},"get");
    this.setData({
      songotherinfo:temp.data.response.songinfo.data.info,
      songinfo:temp.data.response.songinfo.data.track_info
    });
  },
  async getMusicPlay(){
    let temp = await util.request(`${api.getMusicPlay}?songmid=${this.data.songmid}&justPlayUrl=all`,{},"get");
    console.log('getMusicPlay',temp.data.data.playUrl);
    this.setData({
      playUrl:temp.data.data.playUrl[`${this.data.songmid}`].url
    },() => {
      if(this.data.playUrl){
        this.bofang();
      } else {
        util.pxshowErrorToast('抱歉，暂无该歌曲资源',1000);
      }
    })
  },
  async getLyric(){
    let temp = await util.request(`${api.getLyric}?songmid=${this.data.songmid}`,{},"get");
    console.log('getLyric',temp.data.response.lyric);
    let songlyric = temp.data.response.lyric.replace(new RegExp(/\[(\S*)\]/g),'').trim();
    console.log('songlyric0:',songlyric)
    songlyric = songlyric.replace(/<[^<>]+>/g, '');
    // console.log('songlyric1:',songlyric)
    songlyric = songlyric.replace(/&nbsp;/ig, '').replace(/(\n[\s\t]*\r*\n)/g, '\n').replace(/^[\n\r\n\t]*|[\n\r\n\t]*$/g, '');
    console.log('songlyric2:',songlyric)
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
  async getAlbumInfo(){
    let temp = await util.request(`${api.getAlbumInfo}?albummid=${this.data.mid}`,{},"get");
    this.setData({
      albuminfo:temp.data.response.data
    })
  },
  changeIndex(e){
    this.setData({
      currentIndex: e.target.dataset.index
    })
  },
  changeSwiper(e){
    this.setData({
      currentIndex: e.detail.current
    },() => {
      this.getSwiperHieght()
    })
  },
  getSwiperHieght(){
    let that = this;
    let temp;
    const query = wx.createSelectorQuery().in(this);
    switch (this.data.currentIndex){
      case 0 : temp = query.select('#song').boundingClientRect(function(res){
        that.setData({
          height: res.height
        })
      }).exec() 
      break ;
      case 1 : temp = query.select('#lyric').boundingClientRect(function(res){
        that.setData({
          height: res.height
        })
      }).exec() 
      break ;
    }
  }
})