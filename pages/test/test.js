var network = require("../../utils/network.js")
const app = getApp();
// pages/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("ceshi...onload")
    // console.log(network.formatTime(new Date()))
    var params={
      "pageNum": 1,
      "pageSize": 5,
    }
    // network.POST(
    //   {
    //     url:"cps",
    //     params: params,
    //     success: function (res) {
    //       console.log(res)
    //       //拿到解密后的数据，进行代码逻辑

    //     },
    //     fail: function () {
    //       //失败后的逻辑

    //     },
    //   })
   

    // network.GET(
    //   {
    //     url: "cps",
    //     params: '',
    //     success: function (res) {
    //       console.log(res)
    //       //拿到解密后的数据，进行代码逻辑

    //     },
    //     fail: function () {
    //       //失败后的逻辑

    //     },
    //   })


  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("ceshi...onShow")
    // setInterval(this.console,1000)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("ceshi...onHide")
  },

console:function(){
console.log('log')
},
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("ceshi...onUnload")
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  abc:function(){
    wx.showModal({
      title: '',
      content: '<view>1<view>',
    })
  }
})