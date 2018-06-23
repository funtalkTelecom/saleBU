// pages/auction/auction-pay.js
var network = require("../../utils/network.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxpay:'true',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
    this.initAddress();
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
  usewxpay:function(e){
    console.log(e.currentTarget.dataset.wxpay);
    this.setData({
      wxpay: e.currentTarget.dataset.wxpay
    })
  },
  toggleBottomPopup() {
    this.setData({
      showBottomPopup: !this.data.showBottomPopup
    });
  },
  initAddress: function () {
    network.GET({
      url: "deliveryAddresss",
      params: {},
      success: (res) => {
        console.log(res);
        if (res.data.code == 200) {
          if (res.data.data.length > 0) {
            this.setData({
              curAddressObj: res.data.data[0],
              addressList: res.data.data
            })
          } else {
            this.setData({
              curAddressObj: null
            })
          }
        }
      }
    })
  },
  selectAddr: function (e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      curAddressObj: this.data.addressList[index]
    })
    this.toggleBottomPopup();
  }
})