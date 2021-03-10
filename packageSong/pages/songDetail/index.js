import regeneratorRuntime from 'regenerator-runtime'
const api = require('../../../router/api');
const util = require('../../../utils/util')

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    let that = this
    this.setData({
      albumMid:e.albumMid
    },() => {
      that.getAlbumInfo()
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
  async getAlbumInfo(){
    let temp = await util.request(`${api.getAlbumInfo}?albummid=${this.data.albumMid}`,{},"get")
    
  }

})