
Page({

  /**
   * 页面的初始数据
   */
  data: {
    paytext:"微信支付",
    defaultValue:1,
    pay: [{ text: "微信支付", value: 1, color: "#09bb07" },
      { text: "线下支付", value: 2, color: "orange"  }, 
      { text: "支付宝支付", value: 3, color: "#00aaee" }]
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
  radioChange: function (e) {
    var paytext="";
    if (e.detail.value==1){
      paytext ="微信支付"
    } else if (e.detail.value == 2) { paytext = "线下支付"}
    else if (e.detail.value == 3) { paytext = "支付宝支付" }
    this.setData({
      defaultValue: e.detail.value,
      paytext: paytext
    })
  }
})