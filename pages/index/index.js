import regeneratorRuntime from 'regenerator-runtime'
const util = require('../../utils/util')
const api = require('../../router/api')

Page({
  data: {
    toplist:[]
  },
  
  onLoad: function () {
    this.getTopList()
    this.getRecommend();
  },
  async getTopList(){
    let temp = await util.request(api.getSongListCategories,{},"get")
    console.log(temp);
    this.setData({
      toplist : temp.data.response.data.topList
    },() => {
    })
  },
  async getRecommend(){
    let temp = await util.request(api.getRecommend,{},"get")
    console.log(temp);
    this.setData({
      ...temp.data.response
    })
  },
  toSearch(){
    wx.navigateTo({
      url: '/packageSong/pages/search/index',
    })
  }
})
