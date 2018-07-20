// pages/auction/auction-pay.js
var network = require("../../utils/network.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxpay:1,
    tempFilePaths: [null, null, null],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    network.BarTitle("订单支付")
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
  initMeal: function (id) {
    network.GET({
      url: "meal/n" + id,
      params: {},
      success: (res) => {
        if (res.data.code == 200) {
          this.setData({
            mealObj: res.data.data[0]
          })
        }
      }
    })
  },
  usewxpay:function(e){
    this.setData({
      wxpay: e.currentTarget.dataset.wxpay
    })
    // wx.createSelectorQuery().select('.paymode').boundingClientRect(function (rect) {
    //   console.log(rect)
    //   // 使页面滚动到底部
    //   wx.pageScrollTo({
    //     scrollTop: rect.bottom,
    //     duration: 800
    //   })
    // }).exec()
    // wx.pageScrollTo({
    //     scrollTop: 100,

    //   })
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
        if (res.data.code == 200) {
          this.initMeal(res.data.data.orderItem[0].numId)
          this.setData({
            order: res.data.data.order,
            orderItem: res.data.data.orderItem,
            goods: res.data.data.goods,
            money: (res.data.data.order.total - res.data.data.goods.gDeposit).toFixed(2)
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
    params.mealId = this.data.mealObj.mid;
    network.POST({
      url: "pay-balance",
      params: params,
      success: (res) => {
        if (res.data.code == 200) {
          if (this.data.wxpay==1){
            if (res.data.data.paySuccess) {
              wx.showToast({
                title: "成功",
                icon: 'success',
                duration: 3000
              })
              wx.redirectTo({
                url: "/pages/my-order/index?tabtype=0"
              })
            }else{
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
                  wx.showToast({
                    title: "取消支付",
                    icon: 'none',
                    duration: 3000
                  })
                }
              })
            }
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
  },
  selectIdcardImg: function (e) {
    var index = e.currentTarget.dataset.index;
    var that = this;
    wx.chooseImage({
      // 设置最多可以选择的图片张数，默认9,如果我们设置了多张,那么接收时//就不在是单个变量了,
      count: 1,
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: (res) => {
        this.data.tempFilePaths.splice(index, 1, res.tempFilePaths[0])
        that.setData({
          tempFilePaths: this.data.tempFilePaths,
          // idcardBehind: res.tempFilePaths[0]
        })
      }
    })
  },
  delimg: function (e) {
    var index = e.currentTarget.dataset.index;
    this.data.tempFilePaths.splice(index, 1, null);
    this.setData({
      tempFilePaths: this.data.tempFilePaths
    })
  },
  previewImage: function (e) {
    var index = e.currentTarget.dataset.index;
    var url = this.data.tempFilePaths[index]
    wx.previewImage({
      urls: [url] // 需要预览的图片http链接列表
    })
  }

})