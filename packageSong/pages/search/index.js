import regeneratorRuntime from 'regenerator-runtime'
const util = require('../../../utils/util');
const api = require('../../../router/api');
const music = require('../../../utils/musicplay');
const fire = require('../../../utils/onfire');
const globalData = getApp().globalData

Page({

  data: {
    menuButtonBoundingClientRect: {
      bottom: wx.getMenuButtonBoundingClientRect().bottom || 56,
      height: wx.getMenuButtonBoundingClientRect().height || 32,
      left: wx.getMenuButtonBoundingClientRect().left || 317,
      right: wx.getMenuButtonBoundingClientRect().right || 404,
      top: wx.getMenuButtonBoundingClientRect().top || 24,
      width: wx.getMenuButtonBoundingClientRect().width || 87
    },
    show_action:false,
    currentKey:'',
    currentIndex:0,
    keyResource:'',
    key_song:[],
    key_mv:[]
  },
  onLoad: function (options) {
    this.getHotkey();
  },
  onShow: function () {
    let temp = this.selectComponent('#music');
    if(globalData.index && globalData.songlist){
      fire.fire('showMusicTab',{
        index: globalData.index,
        songlist: globalData.songlist,
        played: music.getCurrentMusicState()
      });
      wx.nextTick(() => {
        temp.showglobal();
      })
    }
  },
  onPullDownRefresh: function () {
    // let temp = '';
    // switch (this.data.currentIndex){
    //   case 0: temp = this.selectComponent('#kSong'); break;
    //   case 1: temp = this.selectComponent('#kmv'); break;
    // }
    // if(!temp){
    //   return;
    // }
    // temp.onPullDownRefresh();
    this.selectComponent('#kSong').onPullDownRefresh();
  },
  onReachBottom: function(){
    // let temp = '';
    // switch (this.data.currentIndex){
    //   case 0: temp = this.selectComponent('#kSong'); break;
    //   case 1: temp = this.selectComponent('#kmv'); break;
    // }
    // if(!temp){
    //   return;
    // }
    // temp.onReachBottom();
    this.selectComponent('#kSong').onReachBottom();
  },
  onInput(e){
    this.setData({
      currentKey:e.detail
    },() => {
      let temp = this.data.currentKey ? true : false
      this.setData({
        show_action:temp
      })
    })
  },
  onSearch(){
    this.getKeyResource();
  },
  onCancel(){
    console.log("onCancel");
  },
  async getHotkey(){
    let result = await util.request(`${api.getHotkey}`,{},"get");
    console.log('getHotkey:',result.data.response.data);
    this.setData({
      hotkey: result.data.response.data.hotkey,
      show_action:false
    })
  },
  onClickItem(e){
    this.setData({
      currentKey:e.currentTarget.dataset.item
    },() => {
      this.getKeyResource();
    })
  },
  async getKeyResource(){
    let result = await util.request(`${api.getSearchByKey}?key=${this.data.currentKey}`,{},"get");
    this.setData({
      keyResource: result.data.response.data,
    })
    console.log('getKeyResource:',result);
  },
  // onChange(e){
  //   this.setData({
  //     currentIndex:e.detail.index
  //   })
  // }
})