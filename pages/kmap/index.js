const util = require('../../utils/util')
const api = require('../../router/api')
const key = '	GOIBZ-2SARI-TO5G2-53IUQ-Y4ANV-LOBUS'
Page({
  data: {
    longitude:'',
    latitude:'',
    radius:800,
    markers:[{
      id:0,
      latitude:39.9219,
      longitude:116.44355,
      iconPath:'/static/image/location.png',
      width: 32,
      height: 32
    }]
  },

  onLoad: function (options) {
    let that = this
    wx.getLocation({
      success: function(res){
        console.log(res)
        that.setData({
          latitude:res.latitude,
          longitude:res.longitude,
          'markers[0].latitude':res.latitude,
          'markers[0].longitude':res.longitude
        })
      }
    })
  },
  onReady: function(){
    this.myMap = wx.createMapContext('myMap');
    console.log('地图对象',this.myMap)
  },
  getSelfLocation(){
    this.myMap.getCenterLocation({
      success: function(res){
        this.setData({
          latitude:res.latitude,
          longitude:res.longitude
        })
      }
    })
  },
  clickmap(event){
    let that = this
    const { latitude,longitude} = event.detail

    // that.setData({
    //   longitude:longitude,
    //   latitude:latitude,
    //   'markers[0].latitude':latitude,
    //   'markers[0].longitude':longitude
    // })
    // wx.chooseLocation({
    //   latitude,
    //   longitude,
    //   success(res){
    //     that.setData({
    //       longitude:res.longitude,
    //       latitude:res.latitude,
    //       'markers[0].latitude':res.latitude,
    //       'markers[0].longitude':res.longitude
    //     })
    //   },
    //   fail(err){
    //     console.log(err)
    //   }
    // })
  },
  // 查询位置
  search_input(event){
    if(!event.detail.value){
      return '';
    }
    this.setData({
      location:event.detail.value
    });
  },
  forsure(){
    if(this.data.location){
      util.request(`${api.searchLocation}?key=${key}&keyword=${this.data.location}&boundary=nearby(${this.data.latitude},${this.data.longitude},${this.data.radius})`,{},"GET")
      .then(res => {
        console.log(res)
        res.data.data = res.data.data.map(i => {
          i.latitude = i.location.lat
          i.longitude = i.location.lng
          i.iconPath = '/static/image/location.png'
          i.width = 32 
          i.height = 32
          return i
        })
        if(this.data.markers){
          this.setData({
            markers:[...this.data.markers,...res.data.data]
          })
        }else{
          this.setData({
            markers:res.data.data
          })
        }
      })
    }
   
  }
})