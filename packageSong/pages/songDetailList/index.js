import regeneratorRuntime from 'regenerator-runtime'
const util = require('../../../utils/util');
const api = require('../../../router/api');
const fire = require('../../../utils/onfire');
const globalData = getApp().globalData

Page({

  data: {
    disstid: 0,
    opacity: 0,
    index:0,
  },
  onLoad: function (options) {
    let that = this;
    this.setData({
      disstid : options.disstid ? options.disstid : 0
    },() => {
      this.getDetailSongList();
    });
    this.endMusic = fire.on('endMusic',() => {
      if((this.data.songlist.length - 1 ) == this.data.index){
        that.setData({
          index : 0,
          info: that.data.songlist[0]
        })
      } else {
        this.setData({
          index: this.data.index + 1,
          info: that.data.songlist[this.data.index + 1]
        })
      }
    })
  },
  onUnload: function(){
    fire.un(this.endMusic)
  },
  onShow: function () {
    wx.nextTick(() => {
      let temp = this.selectComponent('#music');
      console.log('temp',temp);
      temp.showglobal();
    })
  },
  async getDetailSongList(){
      let that = this;
      let temp = await util.request(`${api.getSongListDetail}?disstid=${that.data.disstid}`,{},'get');
      let result = temp.data.response.cdlist[0];
      result.visitnum = util.getwang(result.visitnum);
      this.setData({
        info: result,
        songlist: result.songlist
      })
  },
  onPullDownRefresh: function () {
    this.getDetailSongList();
  },

  onReachBottom: function () {

  },
  onClickItem(e){
    let that = this;
    let temp = e.currentTarget.dataset.item;
    let index =  e.currentTarget.dataset.index;
    wx.navigateTo({
      url: `/packageSong/pages/songDetail/index?id=${temp.mid}&mid=${temp.album.mid}&index=${index}`,
      success: function(res){
        res.eventChannel.emit('tosongDetail',that.data.songlist)
      }
    })
  },
  playMusic(e){
    let temp = e.currentTarget.dataset.item;
    let index = e.currentTarget.dataset.item;

    this.setData({
      songmid: temp.mid,
      albummid: temp.album.mid,
      songinfo: temp,
      showMusicbar: true,
      index
    },() => {
      this.selectComponent('#music').init();
      this.setData({
        opacity:1
      })
    })
  },
  // async getMusicPlay(){
  //   if(this.data.songmid == globalData.song){
  //     return ;
  //   }
  //   let temp = await util.request(`${api.getMusicPlay}?songmid=${this.data.songmid}&justPlayUrl=all`,{},"get");
  //   this.setData({
  //     playUrl:temp.data.data.playUrl[`${this.data.songmid}`].url
  //   },() => {
  //     music.init();
  //     if(!this.data.playUrl){
  //       util.pxshowErrorToast('??????????????????????????????',1000);
  //       return ;
  //     }
  //   })
  // },
  // async getImageUrl(){
  //   let temp = await util.request(`${api.getImageUrl}?id=${this.data.albummid}`,{},"get");
  //   console.log('getImageUrl',temp.data.response.data.imageUrl);
  //   this.setData({
  //     imageUrl:temp.data.response.data.imageUrl
  //   })
  // },
})