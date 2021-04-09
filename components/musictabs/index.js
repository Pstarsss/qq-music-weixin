import regeneratorRuntime from 'regenerator-runtime'
const util = require('../../utils/util');
const api = require('../../router/api');
const music = require('../../utils/musicplay');
const fire = require('../../utils/onfire')
const globalData = getApp().globalData

Component({

  data: {
    playUrl: '',
    imageUrl: '',
    step: 0,
    played: true,
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
    created() {
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
          globalData.index = this.data.index;
          globalData.songlist = this.data.songlist
          that.init();
        })
      })
      this.endMusic = fire.on('endMusic',() => {
        that.change_next();
      })
    },
    moved: function() {
      fire.un(this.showMusicTab);
    },
    detached: function() {
      fire.un(this.showMusicTab);
    },

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
    change_next(){

      if(this.data.songlist){
        let next_index = this.data.index >= this.data.songlist.length - 1 ? 0 : parseInt(this.data.index) + 1
        this.setData({
          index:next_index,
          mid: this.data.songlist[next_index].albumMid,
          songmid: this.data.songlist[next_index].songmid,
        },() => {
          this.init();
        })
      }
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
      let save_url = that.data.songlist[that.data.index].url
      if(save_url && save_url !== void 0){
        this.setData({
          playUrl:save_url
        },() => {
          globalData.song = that.data.songmid;
          music.init(this.data.playUrl);
        });
        return false;
      }
      let temp = await util.request(`${api.getMusicPlay}?songmid=${this.data.songmid}&justPlayUrl=all`,{},"get");
      let result_url = temp.data.data.playUrl[`${this.data.songmid}`].url;
      this.setData({
        playUrl:result_url,
        [`songlist[${this.data.index}].url`]:result_url
      },() => {
        if(!this.data.playUrl){
          util.pxshowErrorToast('抱歉，暂无该歌曲资源',1000);
          return ;
        }
        globalData.song = this.data.songmid;
        globalData.songlist = this.data.songlist;
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
        globalData.index = this.data.index;
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
    setGlobal(){
    },
    showglobal() {
      if(this.data.songlist.length > 0){
        this.setData({
          opacity: 1
        })
      }
    }
  }
})  
