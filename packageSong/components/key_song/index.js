Component({

  properties: {
    item:{
      type:Object,
      value:{},
    }
  },

  data: {
    curnum:0,
    curpage:1,
    list:[],
    totalnum:0
  },
  lifetimes:{
    ready(){
      console.log(this.data.item)
      this.setData({
        ...this.data.item
      })
    }
  },
  methods: {
    
  }
})
