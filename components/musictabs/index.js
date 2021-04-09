import regeneratorRuntime from 'regenerator-runtime'
const util = require('../../utils/util');
const api = require('../../router/api');
const music = require('../../utils/musicplay');
const fire = require('../../utils/onfire')
const globalData = getApp().globalData

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    playUrl: '',
    imageUrl: '',
    step: 0,
    played: true,
    currentMusic: {},
    songlist: [],
    opacity: 0,
    index: 0,
    mid: '',
    songmid: '',
    songinfo: '',
    played: true,
    show: false,
  },
  lifetimes:{
    // ready(){
    //   this.playingTime = fire.on('playingTime',(res) => {
    //     this.setData({
    //       currentTime_copy:res,
    //       duration:util.timeformat(res.duration),
    //       currentTime: util.timeformat(res.currentTime),
    //       step:((res.currentTime).toFixed(0) / res.duration.toFixed(0)) * 100,
    //       max: res.duration.toFixed(0)
    //     })
    //   }) 
    // }
    created() {
      console.log('created');
      const that = this;
      this.showMusicTab = fire.on('showMusicTab',(res) => {
        console.log('res',res);
        this.setData({
          mid: res.songlist[res.index].albumMid,
          songmid: res.songlist[res.index].songmid,
          songlist: res.songlist,
          opacity: 1,
          index: res.index,
          played: res.played
        },() => {
          that.init();
        })
      })
    },
    moved: function() {
      console.log('moved');
    },
    lifetimes : {
      detached: function() {
        console.log('detached');
        fire.un(this.showMusicTab);
      },
    },
    pageLifetimes: {
      hide: function() {
        console.log('hide');
      }
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    init(){
      this.getMusicPlay();
      this.getImageUrl();
      this.getSongInfo();
    },
    async getAlbumInfo(){
      let that = this;
      let temp = await util.request(`${api.getAlbumInfo}?albummid=${this.data.mid}`,{},"get");
      console.log('专辑资源',temp);
      if(!temp.data.response.data.list[0].songmid){
        util.pxshowErrorToast('抱歉，暂无该歌曲资源',1000);
        return false;
      }
      this.setData({
        songmid:temp.data.response.data.list[0].songmid,
        [`songlist[${that.data.index}].songmid`]: temp.data.response.data.list[0].songmid
      },() => {
        that.init();
      })
    },
    async getSongInfo(){
      if(!this.data.songmid){
        return false;
      }
      let temp = await util.request(`${api.getSongInfo}?songmid=${this.data.songmid}`,{},"get");
      this.setData({
        songotherinfo:temp.data.response.songinfo.data.info,
        songinfo:temp.data.response.songinfo.data.track_info
      });
    },
    async getMusicPlay(){
      const that = this;
      if(!this.data.songmid && this.data.mid){
        that.getAlbumInfo();
        return false;
      }
      if(this.data.songmid == globalData.song){
        return ;
      }
      let temp = await util.request(`${api.getMusicPlay}?songmid=${this.data.songmid}&justPlayUrl=all`,{},"get");
      this.setData({
        playUrl:temp.data.data.playUrl[`${this.data.songmid}`].url
      },() => {
        if(!this.data.playUrl){
          util.pxshowErrorToast('抱歉，暂无该歌曲资源',1000);
          return ;
        }
        globalData.song = this.data.songmid;
        music.init(this.data.playUrl);
      })
    },
    async getImageUrl(){
      if(!this.data.songmid){
        return false;
      }
      let temp = await util.request(`${api.getImageUrl}?id=${this.data.mid}`,{},"get");
      console.log('getImageUrl',temp.data.response.data.imageUrl);
      this.setData({
        imageUrl:temp.data.response.data.imageUrl
      })
    },
    playMusic(){
      this.data.played ? music.pause() : music.play();
      this.setData({
        played: !this.data.played
      })
    },

    onChangeStatus(){
      this.setData({
        played: !this.data.played
      })
    },
    onClickItem(e) {
      const that = this;
      wx.navigateTo({
        url: `/packageSong/pages/songDetail/index?id=${this.data.songmid}&mid=${this.data.mid}&index=${this.data.index}`,
        success: function(res){
          res.eventChannel.emit('tosongDetail',that.data.songlist)
        }
      })
    },
    pop_clickItem(e) {
      const that = this;
      let index = e.currentTarget.dataset.index;
      if(this.data.index == index){
        return false
      } else {
        that.setData({
          mid: that.data.songlist[index].albumMid,
          songmid: that.data.songlist[index].songmid,
          index: index,
          played: true
        },() => {
          that.init();
        })
      }
    },
    showSonglist() {
      this.setData({
        show: true
      })
    },
    onClose() {
      this.setData({
        show: false
      })
    },
    showglobal() {
      console.log('songlist',this.data.songlist);
      if(this.data.songlist.length > 0){
        this.setData({
          opacity: 1
        })
      }
    }
  }
})  
