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
      console.log(this.data.item);
      wx.navigateTo({
        url: `/packageSong/pages/one/index?id=${this.data.item.id}`,
      })
    }
  }
})
