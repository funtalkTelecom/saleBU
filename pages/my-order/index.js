// pages/my-order/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: {
      list: [{
        id: 0,
        title: '全部'
      }, {
        id: 1,
        title: '代付款'
      }, {
        id: 2,
        title: '代发货'
      }, {
        id: 3,
        title: '代收货'
      }, {
        id: 4,
        title: '已完成'
      }]
    },
    selectedId: 0,
    showBottomPopup: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      selectedId: options.tabtype
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
  handleTabChange: function (e) {
    this.setData({
      selectedId: e.detail
    })
    console.log(e.detail)
    if (e.detail == 1) {
      console.log("a")
    } else if (e.detail == 2) {
      console.log("b")
    }
  },
})