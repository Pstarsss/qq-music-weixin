import regeneratorRuntime from 'regenerator-runtime'
const util = require('../../../utils/util')
const api = require('../../../router/api')
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

})