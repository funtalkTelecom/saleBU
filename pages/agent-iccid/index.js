// pages/agent-num/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: {
      list: [{
        id: 1,
        title: '未绑定'
      }, {
        id: 2,
        title: '已绑定'
      }]
    },
    selectedId: 1,
    showBottomPopup: false
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
  toggleBottomPopup() {
    this.setData({
      showBottomPopup: !this.data.showBottomPopup
    });
  },
})