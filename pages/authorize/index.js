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
    // this.login();
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
  bindGetUserInfo: function (e) {
    if (!e.detail.userInfo) {
      console.log(2)
      return;
    }
    var userInfo = e.detail.userInfo;
    wx.setStorageSync('userInfo', userInfo);
    network.PUT({
      url: "Consumer",
      params: {
       
        'loginName': "",
        'livePhone': "",
        'nickName': userInfo.nickName,
        'sex': userInfo.gender,
        'img': userInfo.avatarUrl,
        'province': userInfo.province,
        'city': userInfo.city
      },
      success: (res) => {
        console.log(res);
        if (res.data.code == 200) {
          console.log(1);
          wx.switchTab({
            url: "/pages/index/index"
          })

        }

      },
      fail: () => {
        //失败后的逻辑

      },
    })
    // this.login();
  },
  login: function () {
    let that = this;
    let token = wx.getStorageSync('token');
    if (token) {
      // wx.request({
      //   url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/check-token',
      //   data: {
      //     token: token
      //   },
      //   success: function (res) {
      //     if (res.data.code != 0) {
      //       wx.removeStorageSync('token')
      //       that.login();
      //     } else {
      //       // 回到原来的地方放
      //       wx.navigateBack();
      //     }
      //   }
      // })
      // return;
    }
    wx.login({
      success: function (res) {
        network.GET({
          url: "get_open_id",
          params: { getcode: res.code },
          success: (res) => {
            console.log(res);
            if (res.data.code == 200) {
              wx.setStorageSync('token', res.data.data.token)
              getApp().globalData.header.Cookie = 'JSESSIONID=' + wx.getStorageSync("token");
            }
          },
          fail: () => {
            //失败后的逻辑

          },
        })
      }
    })
  },
})