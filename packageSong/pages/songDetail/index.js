import regeneratorRuntime from 'regenerator-runtime'
const api = require('../../../router/api');
const util = require('../../../utils/util');
const music = require('../../../utils/musicplay');
const fire = require('../../../utils/onfire');
const globalData = getApp().globalData
Page({
  data: {
    currentIndex: 0,
    height: 1200,
    currentTime:'00:00',
    step:0,
    max:100,
    songlist:[],
    index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    let that = this
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('tosongDetail', function(data) {
      that.setData({
        songlist:data
      })
    })
    this.setData({
      songmid: e.id,
      mid: e.mid,
      index: e.index
    },() => {
      that.getSongInfo();
      that.getLyric();
      that.getMusicPlay();
      that.getImageUrl();
    });
    this.playingTime = fire.on('playingTime',(res) => {
      // 返回的res数据没问题  这个timeformat可能有问题
      this.setData({
        currentTime_copy:res,
        duration:util.timeformat(res.duration),
        currentTime: util.timeformat(res.currentTime),
        step:(res.currentTime).toFixed(0),
        max: res.duration.toFixed(0)
      })
    });
    this.endMusic = fire.on('endMusic',() => {
      console.log('index:',that.data.index);
      console.log('songlist',that.data.songlist);
      if((that.data.songlist.length - 1 ) === that.data.index){
        that.setData({
          info: that.data.songlist[0],
          songmid: that.data.songlist[0].mid,
          mid: that.data.songlist[0].album.mid,
          index : 0,
        }, () => {
          that.getSongInfo();
          that.getLyric();
          that.getMusicPlay();
          that.getImageUrl();
        })
      } else {
        that.setData({
          info: that.data.songlist[that.data.index + 1],
          songmid: that.data.songlist[that.data.index + 1].mid,
          mid: that.data.songlist[that.data.index + 1].album.mid,
          index: that.data.index + 1,
        }, () => {
          that.getSongInfo();
          that.getLyric();
          that.getMusicPlay();
          that.getImageUrl();
        })
      }
    })
  },
  onUnload: function () {
    fire.un(this.endMusic);
    fire.un(this.playingTime);
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
  async getMusicPlay(more){
    if(this.data.songmid == globalData.song){
      return false;
    }
    let temp = await util.request(`${api.getMusicPlay}?songmid=${this.data.songmid}&justPlayUrl=all`,{},"get");
    console.log('getMusicPlay',temp.data.data.playUrl);
    this.setData({
      playUrl:temp.data.data.playUrl[`${this.data.songmid}`].url,
      [`songlist[${this.data.index}]['url']`]:temp.data.data.playUrl[`${this.data.songmid}`].url
    },() => {
      if(this.data.playUrl){
        globalData.song = this.data.songmid;
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
      imageUrl:temp.data.response.data.imageUrl,
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
    wx.createSelectorQuery().in(this).select('._lyric-body').boundingClientRect(function(res){
      that.setData({
        height:res.height + 60
      })
    }).exec();
  },
  sliderchange(e){
    music.seek(e.detail.value);
    this.setData({
      currentTime: util.timeformat(e.detail.value)
    })
  },
  sliderchanging(e){
    music.seek(e.detail.value);
    this.setData({
      currentTime: util.timeformat(e.detail.value)
    })
  }
})