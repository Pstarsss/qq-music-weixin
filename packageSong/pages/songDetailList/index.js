import regeneratorRuntime from 'regenerator-runtime'
const util = require('../../../utils/util');
const api = require('../../../router/api');
const music = require('../../../utils/musicplay');
Page({

  data: {
    disstid: 0,

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
    this.getMusicPlay(temp.mid);
  },
  async getMusicPlay(songmid){
    let temp = await util.request(`${api.getMusicPlay}?songmid=${songmid}&justPlayUrl=all`,{},"get");
    this.setData({
      playUrl:temp.data.data.playUrl[`${songmid}`].url
    },() => {
      if(!this.data.playUrl){
        util.pxshowErrorToast('抱歉，暂无该歌曲资源',1000);
        return ;
      }
      music.init(this.data.playUrl);
      music.play();
    })
  },
})