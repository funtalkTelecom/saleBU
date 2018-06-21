// pages/product-pay/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    paytext: "微信支付",
    defaultValue: 1,
    pay: [{ text: "微信支付", value: 1, classStyle: "wx" },
      { text: "余额支付", value: 2, classStyle: "balance" }]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var orderid = options.orderid;
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
  usewxpay: function (e) {
    var paytext = "";
    var wxpay = e.currentTarget.dataset.wxpay;
    if (wxpay == 1) {
      paytext = "微信支付"
    } else if (wxpay == 2) { paytext = "余额支付" }
    this.setData({
      defaultValue: wxpay,
      paytext: paytext
    })
  },
})