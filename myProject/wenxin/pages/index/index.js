//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: '直到世界尽头',
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
     url: '../logs/logs'
    })
  },
  tapName: function(event) {
    wx.navigateTo({
     url: '../../swiper/swiper'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  }
})


