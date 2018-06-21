// pages/index/product-page.js
var network = require("../../utils/network.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shoucang:false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    network.GET({
      url: "goods",
      params: { },
      success: (res) => {
        if (res.data.code == 200) {
          this.setData({
            goodList: res.data.data.list
          })
        }
      }
    })
  },
  collection:function(){
    let flag = !this.data.shoucang;
    this.setData({
      shoucang: flag
    })
  },
  todetail:function(){
    wx.navigateTo({ url: 'product-detail' });
  }
})