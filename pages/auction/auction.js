var network = require("../../utils/network.js");
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    remindStart: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initActive(options.id);

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
  //我要参与
  gojoin: function (e) {
    // console.log(e)
    wx.navigateTo({
      url: 'auction-detail?gId=' + e.currentTarget.dataset.gid + "&&numId=" + e.currentTarget.dataset.numid
      });
  },
  //设置提醒
  remind: function () {
    let flag = !this.data.remindStart;
    this.setData({
      remindStart: flag
    })
  },
  countDown: function () {
    this.data.activeObj=util.activeObjFormatTime(this.data.activeObj);
    this.setData({
      activeObj: this.data.activeObj
    })
    setTimeout(this.countDown, 1000);
  },
  initActive: function (id) {
    network.GET({
      url: "epSaleGoodss/" + id,
      params: {},
      success: (res) => {
        if (res.data.code == 200) {
          this.setData({
            activeObj: res.data.data[0],
            goodsList: res.data.data[0].goodsList
          })
          this.countDown();
        }
      }
    })
  }
})