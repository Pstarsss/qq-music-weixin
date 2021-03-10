import regeneratorRuntime from 'regenerator-runtime'
const util = require('../../utils/util')
const api = require('../../router/api')

Page({
  data: {
    toplist:[]
  },
  
  onLoad: function () {
    this.getTopList()
  },
  async getTopList(){
    let temp = await util.request(api.getSongListCategories,{},"get")
    console.log(temp);
    this.setData({
      toplist : temp.data.response.data.topList
    },() => {
    })
  }
})
