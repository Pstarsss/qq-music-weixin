import regeneratorRuntime from 'regenerator-runtime'
const util = require('../../../utils/util');
const api = require('../../../router/api');

Page({

  data: {
    disstid: 0,
    opacity: 0
  },
  onLoad: function (options) {
    this.setData({
      disstid : options.disstid ? options.disstid : 0
    },() => {
      this.getDetailSongList();
    });
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

  },

  onReachBottom: function () {

  },
  onClickItem(e){
    let temp = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/packageSong/pages/songDetail/index?id=${temp.mid}&mid=${temp.album.mid}`,
    })
  },
  playMusic(e){
    let temp = e.currentTarget.dataset.item;
    this.setData({
      songmid: temp.mid,
      albummid: temp.album.mid,
      songinfo: temp,
      showMusicbar: true
    },() => {
      this.selectComponent('#music').init();
      this.setData({
        opacity:1
      })
    })
  },
  async getMusicPlay(){
    let temp = await util.request(`${api.getMusicPlay}?songmid=${this.data.songmid}&justPlayUrl=all`,{},"get");
    this.setData({
      playUrl:temp.data.data.playUrl[`${this.data.songmid}`].url
    },() => {
      if(!this.data.playUrl){
        util.pxshowErrorToast('抱歉，暂无该歌曲资源',1000);
        return ;
      }
      // music.init(this.data.playUrl);
      // music.play();
    })
  },
  async getImageUrl(){
    let temp = await util.request(`${api.getImageUrl}?id=${this.data.albummid}`,{},"get");
    console.log('getImageUrl',temp.data.response.data.imageUrl);
    this.setData({
      imageUrl:temp.data.response.data.imageUrl
    })
  },
})