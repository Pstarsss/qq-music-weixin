import regeneratorRuntime from 'regenerator-runtime'
const util = require('../../../utils/util')
const api = require('../../../router/api')
Page({
  data: {
    page: 1,
    limit: 20,
    sortList:[2,3,4], // 最新 最热 评分
    songList:[],
  },
  onLoad: function (options) {
    this.setData({
      categoryId:options.categoryId == void 0 ? 10000000 :options.categoryId,
      categoryName: options.categoryName
    },() => {
      this.getSongLists(false);
    })
  },  
  onShow: function () {
    wx.nextTick(() => {
      let temp = this.selectComponent('#music');
      temp.showglobal();
    })
  },
  async getSongLists(loadmore){
    let temp = await util.request(`${api.getSongLists}?categoryId=${this.data.categoryId}&page=${this.data.page}&limit=${this.data.limit}&sortId=2`,{},"get");
    temp.data.response.data.list = temp.data.response.data.list.map(i => {
      i.listennum = util.getwang(i.listennum);
      return i;
    })
    this.setData({
      songList : loadmore ? this.data.songList.concat(temp.data.response.data.list) : temp.data.response.data.list,
      totalNum : temp.data.response.data.sum
    })
  },
  onItemClick(e){
    wx.navigateTo({
      url: `/packageSong/pages/songDetailList/index?disstid=${e.currentTarget.dataset.item.dissid}`,
    })
  },
  onPullDownRefresh: function () {
    this.setData({
      page : 0
    },() => {
      this.getSongLists(false)
    })
  },
  onReachBottom: function () {
    if(this.totalNum >= this.data.songList.length){
      this.setData({
        finished : true 
      });
      return false
    }else{
      this.setData({
        page : this.data.page + 1
      },() => {
        this.getSongLists(true)
      })
    }
  }
})