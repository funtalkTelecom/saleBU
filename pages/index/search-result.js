// pages/index/search-result.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phones: [
      { phone: 17001150202, price: 2000, desc: 189 },
      { phone: 17001020202, price: 5000, desc: 189 },
      { phone: 17001150202, price: 2000, desc: 189 },
      { phone: 17001020202, price: 5000, desc: 189 },
      { phone: 17001150202, price: 2000, desc: 189 },
      { phone: 17001020202, price: 5000, desc: 189 },
      { phone: 17001150202, price: 2000, desc: 189 },
      { phone: 17001020202, price: 5000, desc: 189 },
      { phone: 17001150202, price: 2000, desc: 189 },
      { phone: 17001020202, price: 5000, desc: 189 }
    ],
    lhType: -1,
    yysType: -1,
    searchPhone: "",
    flag: false,
    more: false,
    array: ['美1111111111国', '中国', '巴西', '日本'],
    index: 0,
  
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
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
})