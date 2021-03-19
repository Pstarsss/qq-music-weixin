import regeneratorRuntime from 'regenerator-runtime'
const api = require('../../../router/api');
const util = require('../../../utils/util');
const music = require('../../../utils/musicplay');
const fire = require('../../../utils/onfire');
const app = getApp();
const globalData = app.globalData
Page({
  data: {
    currentIndex: 0,
    height: 1200,
    currentTime:0,
    step:0,
    max:100,
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
    });
    this.playingTime = fire.on('playingTime',(res) => {
      this.setData({
        currentTime_copy:res,
        duration:util.timeformat(res.duration),
        currentTime: util.timeformat(res.currentTime),
        step:(res.currentTime).toFixed(0),
        max: res.duration.toFixed(0)
      })
    })
  },
  onUnload: function () {
    
  },
  onPullDownRefresh: function () {
    this.getSongInfo();
    this.getLyric();
    this.getMusicPlay();
    this.getImageUrl();
    this.get_lyricheight();
  },
  onShareAppMessage: function () {

  },
  bofang(){
    let result = music.init(this.data.playUrl);
    this.setData({
      song:result
    });
    music.play();
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

    let songlyric = temp.data.response.lyric.replace(new RegExp(/\[(\S*)\]/g),'').trim();
    songlyric = songlyric.replace(/<[^<>]+>/g, '');
    songlyric = songlyric.replace(/&nbsp;/ig, '').replace(/(\n[\s\t]*\r*\n)/g, '\n').replace(/^[\n\r\n\t]*|[\n\r\n\t]*$/g, '');
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
  
  changeIndex(e){
    this.setData({
      currentIndex: e.target.dataset.index
    },() => {
      if(this.data.currentIndex === 1){
        wx.nextTick(() => {
          this.get_lyricheight();
        })
      }
    })
  },
  changeSwiper(e){
    this.setData({
      currentIndex: e.detail.current
    })
  },
  get_lyricheight(){
    let that = this;
    let temp;
    const query = wx.createSelectorQuery().in(this);
    query.select('._lyric-body').boundingClientRect(function(res){
      that.setData({
        height:res.height + 60
      })
    }).exec();
  },
  sliderchange(e){
    music.seek(e.detail.value);
  },
  sliderchanging(e){
    music.seek(e.detail.value);
  }
})