import regeneratorRuntime from 'regenerator-runtime'
import musicplay from '../../../utils/musicplay';
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
    index: 0,
    state:true, //播放状态
    loop: false, // 单曲循环状态
    volume: 0.2, // 默认的音量
    btn_state: true, // 当前点击下一曲 否则点击上一曲
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    let that = this
    const eventChannel = this.getOpenerEventChannel()
    Object.keys(eventChannel).length > 0 && eventChannel.on('tosongDetail', function(data) {
      that.setData({
        songlist:data
      })
    })
    this.setData({
      songmid: e.id,
      mid: e.mid,
      index: e.index
    },() => {
      that._update();
    });
    this.playingTime = fire.on('playingTime',(res) => {
      // 歌曲总时间只需算一次；需要优化
      this.setData({
        currentTime_copy:res,
        duration:util.timeformat(res.duration),
        currentTime: util.timeformat(res.currentTime),
        step:(res.currentTime).toFixed(0),
        max: res.duration.toFixed(0)
      })
    });
    this.endMusic = fire.on('endMusic',() => {
      that.change_next();
    })
  },
  onUnload: function () {
    fire.un(this.endMusic);
    fire.un(this.playingTime);
  },
  onPullDownRefresh: function () {
    this._update();
    this.get_lyricheight();
  },
  _update(){
    this.getSongInfo();
    this.getLyric();
    this.getMusicPlay();
    this.getImageUrl();
  },
  _update_index(index){
    let that = this;
    that.setData({
      info: that.data.songlist[index],
      songmid: that.data.songlist[index].mid,
      mid: that.data.songlist[index].album.mid,
      index: index,
    }, () => {
      that._update();
    })
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
    let that = this;
    if(that.data.songmid == globalData.song){
      return false;
    }
    let save_url = that.data.songlist[that.data.index].url
    if(save_url && save_url !== void 0){
      this.setData({
        playUrl:save_url
      });
      return false;
    }
    let temp = await util.request(`${api.getMusicPlay}?songmid=${that.data.songmid}&justPlayUrl=all`,{},"get");
    console.log('getMusicPlay',temp.data.data.playUrl);
    let result_url = temp.data.data.playUrl;
    if(result_url){
      that.setData({
        playUrl:temp.data.data.playUrl[`${that.data.songmid}`].url,
        [`songlist[${this.data.index}].url`]:temp.data.data.playUrl[`${this.data.songmid}`].url
      },() => {
        globalData.song = that.data.songmid;
        that.bofang();
      })
    } else {
      util.pxshowErrorToast('抱歉，暂无该歌曲资源',1000);
      that.data.btn_state ? that.change_next() : that.change_pre();
    }
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
  },
  change_volume(){
    console.log('change_volume')
  },
  change_next(){
    let index = this.data.index;
    if(this.data.songlist){
      this._update_index(index >= this.data.songlist.length - 1 ? 0 : parseInt(index + 1))
      this.setData({
        btn_state:true
      })
    }
  },
  change_state(){
    this.setData({
      state: !this.data.state
    },() => {
      this.data.state ? musicplay.play() :  musicplay.pause()
    })
  },
  change_pre(){
    let index = this.data.index;
    if(this.data.songlist){
      this._update_index(index <= 0 ? this.data.songlist.length - 1 : index - 1);
      this.setData({
        btn_state:false
      })
    }
  },
  change_loop(){
    this.setData({
      loop: !this.data.loop
    },() => {
      musicplay.setLoop();
    })
  }
})