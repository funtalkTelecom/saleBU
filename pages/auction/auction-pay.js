// pages/auction/auction-pay.js
var network = require("../../utils/network.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxpay:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderId: options.orderId
    })
    this.initOrderDetail(options.orderId)
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
  },
  initOrderDetail:function(id){
    network.GET({
      url: "order/" + id,
      params: {},
      success: (res) => {
        console.log(res)
        if (res.data.code == 200) {
          this.setData({
            order: res.data.data.order,
            orderItem: res.data.data.orderItem,
            goods: res.data.data.goods
          })
        }
      }
    })
  },
  surePay:function(){
    if (!this.data.curAddressObj) {
      // wx.hideLoading();
      wx.showModal({
        content: '请先设置您的收货地址！',
        showCancel: false
      })
      return;
    }
    var params = new Object();
    params.payMenthodId = this.data.wxpay;
    params.addressId = this.data.curAddressObj.id;
    params.orderId = this.data.orderId;
    network.POST({
      url: "pay-balance",
      params: params,
      success: (res) => {
        console.log(res);
        if (res.data.code == 200) {
          if (this.data.wxpay==1){
            wx.requestPayment({
              'timeStamp': res.data.data.timeStamp,
              'nonceStr': res.data.data.nonceStr,
              'package': res.data.data.package,
              'signType': 'MD5',
              'paySign': res.data.data.paySign,
              'success': function (res) {
                wx.redirectTo({
                  url: "/pages/my-order/index?tabtype=0"
                })
              },
              'fail': function (res) {
                console.log(res);
                wx.showToast({
                  title: "取消支付",
                  icon: 'none',
                  duration: 3000
                })
              }
            })
          } else {
            wx.showToast({
              title: "登记成功，请您及时付款",
              icon: 'none',
              duration: 3000
            })
          }
        }else{
          wx.showToast({
            title: res.data.data,
            icon: 'none',
            duration: 3000
          })
        }
      }
    })



  }
})