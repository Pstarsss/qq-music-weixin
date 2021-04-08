import regeneratorRuntime from 'regenerator-runtime'
const util = require('../../utils/util');
const api = require('../../router/api');
const music = require('../../utils/musicplay');
const fire = require('../../utils/onfire')
const globalData = getApp().globalData

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    songmid:{
      type:String,
      value: ''
    },
    albummid:{
      type:String,
      value: ''
    },
    opacity:{
      type:Number,
      value: 0
    },
    songinfo:{
      type:Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    playUrl:'',
    imageUrl:'',
    step:0,
    played:true
  },
  lifetimes:{
    // ready(){
    //   this.playingTime = fire.on('playingTime',(res) => {
    //     this.setData({
    //       currentTime_copy:res,
    //       duration:util.timeformat(res.duration),
    //       currentTime: util.timeformat(res.currentTime),
    //       step:((res.currentTime).toFixed(0) / res.duration.toFixed(0)) * 100,
    //       max: res.duration.toFixed(0)
    //     })
    //   }) 
    // }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    init(){
      this.getMusicPlay();
      this.getImageUrl();
    },
    async getMusicPlay(){
      if(this.data.songmid == globalData.song){
        return ;
      }
      let temp = await util.request(`${api.getMusicPlay}?songmid=${this.data.songmid}&justPlayUrl=all`,{},"get");
      this.setData({
        playUrl:temp.data.data.playUrl[`${this.data.songmid}`].url
      },() => {
        if(!this.data.playUrl){
          util.pxshowErrorToast('抱歉，暂无该歌曲资源',1000);
          return ;
        }
        globalData.song = this.data.songmid;
        music.init(this.data.playUrl);
      })
    },
    async getImageUrl(){
      let temp = await util.request(`${api.getImageUrl}?id=${this.data.albummid}`,{},"get");
      console.log('getImageUrl',temp.data.response.data.imageUrl);
      this.setData({
        imageUrl:temp.data.response.data.imageUrl
      })
    },
    onChangeStatus(){
      this.setData({
        played: !this.data.played
      })
    },
    onClickItem(e){
      wx.navigateTo({
        url: `/packageSong/pages/songDetail/index?id=${this.data.songmid}&mid=${this.data.albummid}`,
      })
    },
  }
})  
