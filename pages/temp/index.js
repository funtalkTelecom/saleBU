// pages/temp/index.js
var network = require("../../utils/network.js");
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
    this.initOrderDetail(options.sourceId);
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
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },
  initOrderDetail: function (id) {
    network.GET({
      url: "order/" + id,
      params: {},
      success: (res) => {
        if (res.data.code == 200) {
          var orderItem = res.data.data.orderItem;
          for (var i = 0; i < orderItem.length; i++) {
            if (orderItem[i].skuGoodsType == 3) {
              wx.redirectTo({
                url: "/pages/agent-num/index"
              })
              break
            }
          }
          wx.redirectTo({
            url: "/pages/my-order/index?tabtype=0"
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
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
  
  }
})