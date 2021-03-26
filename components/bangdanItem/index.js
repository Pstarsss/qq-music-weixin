Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item : {
      type : Object,
      value : {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  lifetimes:{
    ready(){
      
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onClickItem(){
      wx.navigateTo({
        url: `/packageSong/pages/hotSong/index?topId=${this.data.item.topId}`,
      })
    }
  }
})
