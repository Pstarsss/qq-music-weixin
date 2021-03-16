Component({
  options: {
      addGlobalClass: true,
      pureDataPattern: /^_/,
      multipleSlots: true
  },
  properties: {
      tabs: {
          type: Array,
          value: []
      },
      tabClass: {
          type: String,
          value: ''
      },
      swiperClass: {
          type: String,
          value: ''
      },
      activeClass: {
          type: String,
          value: ''
      },
      tabActiveTextColor: {
          type: String,
          value: '#000000'
      },
      tabInactiveTextColor: {
          type: String,
          value: '#000000'
      },
      tabBackgroundColor: {
          type: String,
          value: ''
      },
      activeTab: {
          type: Number,
          value: 0
      },
      duration: {
          type: Number,
          value: 500
      }
  },
  data: {
      currentView: 0,
      swiper_height: 300,
      isFixed: false,
      menuButtonBoundingClientRect: {
          bottom: wx.getMenuButtonBoundingClientRect().bottom || 56,
          height: wx.getMenuButtonBoundingClientRect().height || 32,
          left: wx.getMenuButtonBoundingClientRect().left || 317,
          right: wx.getMenuButtonBoundingClientRect().right || 404,
          top: wx.getMenuButtonBoundingClientRect().top || 24,
          width: wx.getMenuButtonBoundingClientRect().width || 87
        },
  },
  observers: {
      activeTab: function activeTab(_activeTab) {
          var len = this.data.tabs.length;
          if (len === 0) return;
          var currentView = _activeTab - 1;
          if (currentView < 0) currentView = 0;
          if (currentView > len - 1) currentView = len - 1;
          this.setData({
              currentView: currentView
          });
      }
  },
  lifetimes: {
      ready: function ready() {
         
      }
  },
  methods: {
      handleScroll(event) {
          this.setData({
              isFixed: event.detail.isFixed
          })
      },
      handleTabClick: function handleTabClick(e) {
          var index = e.currentTarget.dataset.index;
          this.setData({
              activeTab: index
          });
          this.triggerEvent('tabclick', {
              index: index
          });
      },
      handleSwiperChange: function handleSwiperChange(e) {
          var index = e.detail.current;
          this.setData({
              activeTab: index
          });
          this.triggerEvent('change', {
              index: index
          });
      },
      handleAnimationFinish: function handleAnimationFinish(e) {
          this.triggerEvent('animationFinish', {});
      },
      reloadSwiperHeight() {
          this.createSelectorQuery().select(`.tab-content_box-${this.data.activeTab}`).boundingClientRect((rect) => {
              this.setData({
                  swiper_height: rect.height
              });
          }).exec()
      }
  }
});