import regeneratorRuntime from 'regenerator-runtime'
const util = require('../../utils/util')
const api = require('../../router/api')
Page({

  data: {

  },
  onLoad: function () {
    this.getTopList()
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