import regeneratorRuntime from 'regenerator-runtime'
const util = require('../../../utils/util')
const api = require('../../../router/api')



Page({

  data: {
    limit:20,
    page:1,
    songlist:[],
    total:0,
    loading:false,
    finished:false
  },
  onLoad: function (options) {
    this.setData({
      topId:options.topId
    },() => {
      this.getTopListDetail(false);
    })
  },

  onPullDownRefresh: function () {
    if(!this.data.topId){
      return ;
    }
    this.getKeyResource(false);
  },

  onReachBottom: function () {
    let that = this;
    if(this.data.songlist.length >= this.data.total){
      this.setData({
        finished:true
      })
      return ;
    };
    this.setData({
      page : this.data.page + 1
    },() => {
      that.getTopListDetail(true);
    }) 
  },
  async getTopListDetail(loadmore){
    this.setData({
      loading:true
    })
    let temp = await util.request(`${api.getRanks}?topId=${this.data.topId}`,{},"get");
    console.log(temp);
    this.setData({
      songlist : loadmore ? this.data.songlist.concat(temp.data.response.detail.data.data.song) : temp.data.response.detail.data.data.song,
      total:temp.data.response.detail.data.data.totalNum,
      loading:false
    })
  },
  onClickItem(e){
    let that = this;
    let temp = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/packageSong/pages/songDetail/index?mid=${temp.item.albumMid}&index=${temp.index}&resource=bangdan`,
      success: function(res){
        res.eventChannel.emit('tosongDetail',that.data.songlist)
      }
    })
  }
})