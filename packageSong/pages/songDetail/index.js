import regeneratorRuntime from 'regenerator-runtime'
const api = require('../../../router/api');
const util = require('../../../utils/util')

Page({
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    let that = this
    this.setData({
      songmid:e.id
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
  async getSongInfo(){
    let temp = await util.request(`${api.getSongInfo}?songmid=${this.data.songmid}`,{},"get");
    console.log('getSongInfo',temp.data.response.songinfo)
  },
  async getMusicPlay(){
    let temp = await util.request(`${api.getMusicPlay}?songmid=${this.data.songmid}&justPlayUrl=all`,{},"get");
    console.log('getMusicPlay',temp.data.data.playUrl)
  },
  async getLyric(){
    let temp = await util.request(`${api.getLyric}?songmid=${this.data.songmid}`,{},"get");
    console.log('getLyric',temp.data.response.lyric)
  },
  async getImageUrl(){
    let temp = await util.request(`${api.getImageUrl}?id=${this.data.songmid}`,{},"get");
    console.log('getImageUrl',temp.data.response.data.imageUrl);
    this.setData({
      imageUrl:temp.data.response.data.imageUrl
    })
  }
})