var network = require("../../utils/network.js");
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    remindStart: false,// 设置提醒
    clearTimeoutCountDown: '',  //倒计时定时器的值
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      epSalesId: options.id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
   
  },
  onShareAppMessage: function () {
    return network.share("id=" + this.data.epSalesId);
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.initActive(this.data.epSalesId);
  },
  onUnload: function () {
    clearTimeout(this.data.clearTimeoutCountDown)
  },
  onHide: function () {
    clearTimeout(this.data.clearTimeoutCountDown)
  },
  //我要参与
  gojoin: function (e) {
    // console.log(e)
    wx.navigateTo({
      url: 'auction-detail?gId=' + e.currentTarget.dataset.gid + "&&numId=" + e.currentTarget.dataset.numid
      });
    // wx.navigateTo({
    //   url: '/pages/auction-text/index?gId=' + e.currentTarget.dataset.gid + "&&numId=" + e.currentTarget.dataset.numid
    //   });
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
    //状态1，2都要倒计时定时器
    if (this.data.activeObj.erSatus != 3) {
      this.data.clearTimeoutCountDown = setTimeout(this.countDown, 1000);
    }
  
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
          network.BarTitle(res.data.data[0].title)
          // WxParse.wxParse('article', 'html', res.data.data[0].erRule, this, 5)
          this.countDown();
        }
      }
    })
  }
})