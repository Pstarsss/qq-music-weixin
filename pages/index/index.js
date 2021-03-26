import regeneratorRuntime from 'regenerator-runtime'
const util = require('../../utils/util')
const api = require('../../router/api')

Page({
  data: {
    toplist:[],
    recomPlaylist:[],
    topId:26, // 默认热歌榜
  },
  
  onLoad: function () {
    this.getRecommend();
    this.getTopListDetail();
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
    let recomPlaylist = temp.data.response.recomPlaylist.data.v_hot.map(i => {
      i.listen_num = util.getwang(i.listen_num);
      return i;
    }); //热门歌单
    let officiallistid = 3317;
    let toplist = temp.data.response.toplist.data.group[0].toplist.splice(0,3);
    this.setData({
      toplist,
      recomPlaylist
    });
  },
  async getTopListDetail(){
    let that = this;
    let temp = await util.request(`${api.getRanks}?topId=${this.data.topId}`,{},"get");
    this.setData({
      songRecommend : temp.data.response.detail.data.data.song.splice(0,6)
    },() => {
     let seen = new Map();
     let songRecommend = this.data.songRecommend.map((i,j) => {
        if(!i.cover){
          seen.set(j,util.request(`${api.getImageUrl}?id=${i.albumMid}`,{},"get"))
        }
        return i;
      })
      Promise.all(seen.values()).then((res) => {
        let arr = res.map(i => {
          return i.data.response.data.imageUrl;
        });
        songRecommend.map((i) => {
          if(!i.cover){
            i.cover = arr.splice(0,1);
          }
          return i;
        }) 
        that.setData({
          songRecommend
        },() => {
          seen = null
        })
      })

    })
  },
  scroll(){
    // console.log('12313');
  },
  onItemClick(e){
    wx.navigateTo({
      url: `/packageSong/pages/songDetailList/index?disstid=${e.currentTarget.dataset.item.content_id}`,
    })
  },
  toSearch(){
    wx.navigateTo({
      url: '/packageSong/pages/search/index',
    })
  },
  toMore(){
    wx.navigateTo({
      url: `/packageSong/pages/hotSong/index?topId=${this.data.topId}`,
    })
  }
})
