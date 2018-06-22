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
    console.log(options)
    this.setData({
      skuId: options.skuId,
      numId: options.numId,
      num: options.num,
      gId: options.gId,
      gName: options.gName,
      price: options.price,
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
    network.POST({
      url: "epSaleGoodsAuciton",
      params: {
        skuId: this.data.skuId,
        numId: this.data.numId,
        num: this.data.num,
        gId: this.data.gId,
        gName: this.data.gName,
        price: this.data.price
      },
      success: (res) => {
        console.log(res)
        if (res.data.code == 200) {
          // wx.showToast({
          //   title: "本次出价成功",
          //   icon: 'success',
          //   duration: 3000
          // })
          // var goodsAuctionList = res.data.data.goodsAuctionList.map(this.substring)
          // this.setData({
          //   goodsAuctionList: goodsAuctionList
          // })

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