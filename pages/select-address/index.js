var network = require("../../utils/network.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
    this.initAddressList();
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
  initAddressList: function () {
    network.GET({
      url: "deliveryAddresss",
      params: {},
      success: (res) => {
        if (res.data.code == 200) {
          this.setData({
            addressList: res.data.data
          })
        }
      }
    })
  },
  remove: function (e) {
    wx.showModal({
      title: '提示',
      content: '确定删除该地址',
      success:  (res)=> {
        if (res.confirm) {
          network.DELETE({
            url: "deliveryAddress/" + e.currentTarget.dataset.id+"?__sessid="+wx.getStorageSync("token"),
            params: {},
            success: (res) => {
              if (res.data.code == 200) {
                this.data.addressList.splice(e.currentTarget.dataset.index, 1);
                this.setData({
                  addressList: this.data.addressList
                })
                wx.showToast({
                  title: '操作成功',
                  icon: 'success',
                  duration: 2000
                })
              }
            }
          })
        } 
      }
    })
  },
  radioChange: function (e) {
    network.GET({
      url: "deliveryAddressDefault/" + e.detail.value,
      params: {},
      success: (res) => {
        if (res.data.code == 200) {
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 1000
          })
        }
      }
    })
  },
  editaddr:function(e){
    wx.navigateTo({
      url: '/pages/address-add/index?id=' + e.currentTarget.dataset.id
    })
    this.setData({
      addressList:[]
    })
  }
})