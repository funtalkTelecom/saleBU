// pages/check-out/index.js
var network = require("../../utils/network.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showBottomPopup: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      numcount: options.numcount
    })
    this.initGoods(options.skuid)
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
  initGoods: function (skuid) {
    network.GET({
      url: "goods/" + skuid,
      params: {},
      success: (res) => {
        if (res.data.code == 200) {
          this.setData({
            goodObj: res.data.data,
          })
        }
      }
    })
  },
  selectpay:function(){
    if (!this.data.curAddressObj) {
      // wx.hideLoading();
      wx.showModal({
        content: '请先设置您的收货地址！',
        showCancel: false
      })
      return;
    }
    var params = new Object();
    params.type = 1;
    params.addrid = this.data.curAddressObj.id;
    params.skuid = this.data.goodObj.sku.skuId;
    params.numcount = this.data.numcount;
    network.POST({
      url: "order",
      params: params,
      success: (res) => {
        console.log(res)
        if (res.data.code == 200) {
          wx.navigateTo({
            url: '/pages/product-pay/index?orderid=' + res.data.code
          })
        } else if (res.data.data) {
          wx.showToast({
            title: res.data.data,
            icon: 'none',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: "创建订单失败",
            icon: 'none',
            duration: 2000
          })
        }
      }
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