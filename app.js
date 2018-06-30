App({
  onLaunch: function () {
    var that = this;
    // 登录
    wx.login({
      success: res => {
        if (res.code) {
          console.log(res.code)
          wx.request({
            url: this.globalData.API_URL+'get_open_id',
            data: { getcode: res.code },
            // header: {},
            method: 'GET',
            dataType: 'json',
            // responseType: 'text',
            success: function(res) {
              console.log(res);
              wx.setStorageSync('token', res.data.data.__sessid)
              wx.setStorageSync('consumer_id', res.data.data.consumer_id)
              that.globalData.header.Cookie = 'JSESSIONID=' + wx.getStorageSync("token");
            },
            fail: function(res) {},
            complete: function(res) {},
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
     // 异步加载省市区json数据
    wx.request({
      url: this.globalData.API_URL+'citys',
      // header: {},
      method: 'GET',
      success: function(res) {
        if (res.data.code == 200) {
          wx.setStorageSync('provinceData', res.data.data)
        }
      }
    })

   
  },
  globalData: {
    userInfo: null,
    header: {'content-type':'application/json','Cookie':''},
    API_URL:'https://www.egt365.com/zjc/zqf/api/'
    // API_URL: 'http://192.168.1.60:12891/api/'
  },
})