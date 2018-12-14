// pages/product-pay/index.js
var network = require("../../utils/network.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    paytext: "微信支付",
    defaultValue: 1,
    pay: [{ text: "微信支付", value: 1, classStyle: "wx" },
      { text: "线下支付", value: 2, classStyle: "balance" }
      // ,{ text: "分期付款", value: 4, classStyle: "instalment" }
      ],
    // fenqiFlag:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    network.BarTitle("订单支付")
    this.setData({
      orderid:options.orderid
    })
    this.initOrderDetail(options.orderid);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  }, 
  initOrderDetail: function (id) {
    network.GET({
      url: "order/" + id,
      params: {},
      success: (res) => {
        if (res.data.code == 200) {
          // if (res.data.data.order.total>=200){
          //   this.setData({
          //     fenqiFlag:true
          //   })
          // }
          var orderItem=res.data.data.orderItem;
          for (var i=0;i<orderItem.length;i++){
            if (orderItem[i].skuGoodsType==3){
              this.setData({
                skuGoodsType: 3
              })
              break
            }
          }
        }
      }
    })
  },
  pay:function(){
    var that =this;
    network.POST({
      url: "pay-order",
      params: {
        orderId: that.data.orderid,
        payMenthodId: that.data.defaultValue
      },
      success: (res) => {
        console.log(res)
        if (res.data.code == 200) {
          if (that.data.defaultValue==1){//微信
            wx.requestPayment({
              'timeStamp': res.data.data.timeStamp,
              'nonceStr': res.data.data.nonceStr,
              'package': res.data.data.package,
              'signType': res.data.data.signType,
              'paySign': res.data.data.paySign,
              'success': function (res) {
                if (that.data.skuGoodsType == 3) {
                  wx.redirectTo({
                    url: "/pages/agent-num/index"
                  })
                } else {
                  wx.redirectTo({
                    url: "/pages/my-order/index?tabtype=0"
                  })
                }
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
          // else if (that.data.defaultValue == 4){//分期
          //   wx.navigateTo({
          //     url: '/pages/instalments/index?src=' + encodeURIComponent(res.data.data.trade_qrcode),
          //   })
          // }
        } else if (res.data.data) {
          wx.showToast({
            title: res.data.data,
            icon: 'none',
            duration: 3000
          })
        } else {
          wx.showToast({
            title: "支付失败",
            icon: 'none',
            duration: 3000
          })
        }
      }
    })
  },
  usewxpay: function (e) {
    var paytext = "";
    var wxpay = e.currentTarget.dataset.wxpay;
    if (wxpay == 1) {
      paytext = "微信支付"
    } else if (wxpay == 2) { paytext = "线下支付" }
    // else if (wxpay == 4) { paytext = "分期付款" }
    this.setData({
      defaultValue: wxpay,
      paytext: paytext
    })
  }
})