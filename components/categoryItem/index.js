Component({
  properties: {
    item : {
      type: Object,
      value : {}
    }
  },
  data: {
  },
  lifetimes : {
    ready(){
      
    }
  },
  methods: {
    onItemClick(e){
      wx.navigateTo({
        url: `/packageSong/pages/categorySongList/index?categoryId=${e.currentTarget.dataset.item.categoryId}&categoryName=${e.currentTarget.dataset.item.categoryName}`
      })
    }
  }
})
