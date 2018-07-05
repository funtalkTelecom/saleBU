// pages/ep-rule/index.js
var WxParse = require('../../wxParse/wxParse.js');
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
    this.initActive(options.id)
  },

  initActive: function (id) {
    network.GET({
      url: "epSaleGoodss/" + id,
      params: {},
      success: (res) => {
        if (res.data.code == 200) {
          WxParse.wxParse('article', 'html', res.data.data[0].erRule, this, 5)
        }
      }
    })
  }
})