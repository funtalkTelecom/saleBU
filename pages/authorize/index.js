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
  bindGetUserInfo: function (e) {
    if(!e.detail.userInfo) {
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
        if(res.data.code == 200) {
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
    if(token) {
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
            if(res.data.code == 200) {
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
  }
})