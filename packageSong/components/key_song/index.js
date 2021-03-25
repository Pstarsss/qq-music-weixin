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
    songlist:[],
    total:0,
    loading:false,
    finished:false
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
      if(this.data.songlist.length >= this.data.total){
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
      this.setData({
        loading:true
      })
      let result = await util.request(`${api.getSearchByKey}?key=${this.data.currentKey}`,{},"get");
      if(parseInt(result.statusCode) >= 400){
        this.setData({
          loading:false
        })
        return false;
      }
      this.setData({
        songlist: loadmore ? this.data.songlist.concat(result.data.response.data.song.list) : result.data.response.data.song.list,
        total:result.data.response.data.song.totalnum,
        loading:false
      })
    },
    onClickItem(e){
      let that = this;
      let temp = e.currentTarget.dataset.item;
      let index = e.currentTarget.dataset.index;
      console.log(e);
      wx.navigateTo({
        url: `/packageSong/pages/songDetail/index?id=${temp.mid}&mid=${temp.album.mid}&index=${index}`,
        success: function(res){
          res.eventChannel.emit('tosongDetail',that.data.songlist)
        }
      })
    }
  }
})
