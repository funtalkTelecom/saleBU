// pages/num-iccard/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempFilePaths: [null, null, null],
    defaultValue: 1,
    pay: [{ text: "微信支付", value: 1, classStyle: "wx" },
    { text: "线下支付", value: 2, classStyle: "balance" }]
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
  selectIdcardImg:function(e){
    var index=e.currentTarget.dataset.index;
    var that = this;
    wx.chooseImage({
      // 设置最多可以选择的图片张数，默认9,如果我们设置了多张,那么接收时//就不在是单个变量了,
      count: 1,
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success:  (res)=> {
        console.log(res)
        this.data.tempFilePaths.splice(index,1,res.tempFilePaths[0])
        that.setData({
          tempFilePaths: this.data.tempFilePaths,
          // idcardBehind: res.tempFilePaths[0]
        })
        console.log(this.data.tempFilePaths)
      }
    })
  },
  delimg:function(e){
    var index = e.currentTarget.dataset.index;
    this.data.tempFilePaths.splice(index, 1, null);
    this.setData({
      tempFilePaths: this.data.tempFilePaths
    })
    console.log(this.data.tempFilePaths)
  },
  previewImage: function (e) {
    var index = e.currentTarget.dataset.index;
    var url = this.data.tempFilePaths[index]
    wx.previewImage({
      urls: [url] // 需要预览的图片http链接列表
    })
  },
  usewxpay: function (e) {
    var paytext = "";
    var wxpay = e.currentTarget.dataset.wxpay;
    if (wxpay == 1) {
      paytext = "微信支付"
    } else if (wxpay == 2) { paytext = "线下支付" }
    this.setData({
      defaultValue: wxpay,
      paytext: paytext
    })
  }
})