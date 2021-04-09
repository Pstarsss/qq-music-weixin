import regeneratorRuntime from 'regenerator-runtime'
const util = require('../../utils/util');
const api = require('../../router/api');
const music = require('../../utils/musicplay');
const fire = require('../../utils/onfire');
const globalData = getApp().globalData

Page({

  data: {

  },
  onLoad: function () {
    this.getTopList()
  },

  onShow: function() {
    let temp = this.selectComponent('#music');
    if(globalData.index && globalData.songlist){
      fire.fire('showMusicTab',{
        index: globalData.index,
        songlist: globalData.songlist,
        played: music.getCurrentMusicState()
      });
      wx.nextTick(() => {
        temp.showglobal();
      })
    }
  },

  onHide: function() {
    const that = this;
    let temp = this.selectComponent('#music');
  },

  async getTopList(){
    let temp = await util.request(api.getSongListCategories,{},"get")
    temp.data.response.data.categories = temp.data.response.data.
    categories.map((i,j)=> {
      i.id == j
      return i;
    })
    console.log('temp,',temp)
    this.setData({
      categoryList : temp.data.response.data.categories
    },() => {
    })
  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
})