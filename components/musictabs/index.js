import regeneratorRuntime from 'regenerator-runtime'
const util = require('../../../utils/util');
const api = require('../../../router/api');
const music = require('../../../utils/musicplay');

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    songmid:{
      type:String,
      value:''
    },
    albummid:{
      type:String,
      value:''
    },
    show:{
      type:Boolean,
      value: false
    },
    songinfo:{
      type:Object,
      value:{}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    playUrl:'',
    imageUrl:''
  },
  lifetimes:{
    ready(){
      this.getMusicPlay();
      this.getImageUrl();
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    async getMusicPlay(){
      let temp = await util.request(`${api.getMusicPlay}?songmid=${this.data.songmid}&justPlayUrl=all`,{},"get");
      this.setData({
        playUrl:temp.data.data.playUrl[`${this.data.songmid}`].url
      },() => {
        if(!this.data.playUrl){
          util.pxshowErrorToast('抱歉，暂无该歌曲资源',1000);
          return ;
        }
        music.init(this.data.playUrl);
        music.play();
      })
    },
    async getImageUrl(){
      let temp = await util.request(`${api.getImageUrl}?id=${this.data.albummid}`,{},"get");
      console.log('getImageUrl',temp.data.response.data.imageUrl);
      this.setData({
        imageUrl:temp.data.response.data.imageUrl
      })
    }
  }
})  
