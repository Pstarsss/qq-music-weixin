// components/nav-bar/index.js
Component({
  properties: {
    leftArrow: {
      type: Boolean,
      value: false,
    },
  },
  /**
   * 页面的初始数据
   */
  data: {

  },
  lifetimes: {
    ready: function () {
      let that = this
    }
  },
  methods: {
    onBack() {
      wx.navigateBack()
    },
    /**
     * 回首页
     */
    onHome(event) {
      wx.switchTab({
        url: '/pages/index/index',
      })
    },
  }
})