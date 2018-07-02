// pages/personal/personal.js
var network = require("../../utils/network.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
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
    this.queryAgent()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
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
  
  },
  queryAgent: function () {
    var toBingding = false;
    network.GET({
      url: "query-agent_by_consumerid",
      params: {},
      success: (res) => {
        console.log(1)
        if (res.data.code == 200) {
          var agentObj = res.data.data
          if (agentObj.isAgent == "true") {
            if (agentObj.status == 2) {
              toBingding=true
            }
          }
          this.setData({
            toBingding: toBingding
          })
        }
      }
      
    })
  }
})