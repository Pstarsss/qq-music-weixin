Component({

  properties: {
    item:{
      type:Object,
      value:{},
    }
  },

  data: {

  },
  lifetimes:{
    ready(){
      console.log(this.data.item);
    }
  },
  methods: {

  }
})
