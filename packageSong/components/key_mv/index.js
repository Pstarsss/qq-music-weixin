import regeneratorRuntime from 'regenerator-runtime'
const util = require('../../../utils/util')
const api = require('../../../router/api')

Component({
  properties: {
    currentKey: {
      type:String,
      value:''
    }
  },

  data: {
    limit:20,
    page:1,
    list:[],
    total:0,
  },
  lifetimes:{
    ready(){
      this.getKeyResource(false);
    }
  },
  methods: {
    onPullDownRefresh(){
        if(!this.data.currentKey){
          return ;
        }
        this.getKeyResource(false);
    },
    onReachBottom(){
      let that = this;
      if(this.data.list.length >= this.data.total){
        this.setData({
          finished:true
        })
        return ;
      };
      this.setData({
        page : this.data.page + 1
      },() => {
        that.getKeyResource(true);
      })
    },
    async getKeyResource(loadmore){
      let result = await util.request(`${api.getSearchByKey}?key=${this.data.currentKey}`,{},"get");
      this.setData({
        list:loadmore ? this.data.list.concat(result.data.response.data.song.list) : result.data.response.data.song.list,
        total:result.data.response.data.song.totalnum,
      })
    },
  }
})
