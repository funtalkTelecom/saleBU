// pages/auction/pay-bail.js
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
    //console.log(options)
    network.BarTitle("保证金支付")
    this.setData({
      skuId: options.skuId,
      numId: options.numId,
      num: options.num,
      gId: options.gId,
      gName: options.gName,
      price: options.price,
      gDeposit: options.gDeposit,
      erIsPack: options.erIsPack
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
  paybail: function () {
    var skuId, numId, num
    if (this.data.erIsPack == 1) {
      skuId = 0
      numId = 0
      num = ""
    } else {
      skuId = this.data.skuId
      numId = this.data.numId
      num = this.data.num
    }
    network.POST({
      url: "epSaleGoodsAuciton",
      params: {
        skuId: skuId,
        numId: numId,
        num: num,
        gId: this.data.gId,
        gName: this.data.gName,
        price: this.data.price,
        erISPack: this.data.erIsPack
      },
      success: (res) => {
        if (res.data.code == 604) {
          wx.requestPayment({
            'timeStamp': res.data.data.timeStamp,
            'nonceStr': res.data.data.nonceStr,
            'package': res.data.data.package,
            'signType': res.data.data.signType,
            'paySign': res.data.data.paySign,
            'success': function (res) {
              wx.navigateBack({
                delta: 1
              })
            },
            'fail': function (res) {
              console.log("尚未付款成功");
            }
          })
        } else if (res.data.data) {
          wx.showToast({
            title: res.data.data,
            icon: 'none',
            duration: 3000
          })
        } else {
          wx.showToast({
            title: "出价失败",
            icon: 'none',
            duration: 3000
          })
        }
      }
    })
  }
})