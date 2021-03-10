import regeneratorRuntime from 'regenerator-runtime'
const api = require('../../../router/api')
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
  onLoad: function (options) {
    if(options.id){
      this.getSongListDetail(options.id)
    }
    this.setData({
      id : options.id ? options.id : 0
    })
  },
  async getSongListDetail(id){
    let temp = await util.request(`${api.getRanks}?topId=${id}`,{},"get");
    this.setData({
      list: temp.data.response.detail.data.data.song
    },() => {
      console.log(this.data.list)
    })
  },
  clickSong(e){
    wx.navigateTo({
      url: `/packageSong/pages/songDetail/index?albumMid=${e.currentTarget.dataset.item.albumMid}`,
      events: {
        songDetail: function(data){
          console.log(data)
        }
      },
      success: function(res){
        res.eventChannel.emit('songDetail',{ data: e.currentTarget.dataset.item})
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

})