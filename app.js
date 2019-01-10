App({
  onLaunch: function (options) {
    // console.log(options)
    // console.log(options.scene)
    // var scene = decodeURIComponent(options.scene)

    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            })
          })
        }
      })
    }

    // console.log(scene)
    // if (options.scene == 1007 && options.scene == 1008){
    //   //推荐有奖
    // }
    var that = this;
    // 登录
    wx.login({
      success: res => {
        console.log("success")
        console.log(res)
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
              // if (res.statusCode==404){
                console.log(res)
              // }else{
                wx.setStorageSync('token', res.data.data.__sessid)
                wx.setStorageSync('consumer_id', res.data.data.consumer_id)
                that.globalData.header.Cookie = 'JSESSIONID=' + wx.getStorageSync("token");
              // }
              
            },
            fail: function(res) {
              // console.log("fail");
              // wx.navigateBack({
              //   delta: 1
              // })
            },
            complete: function(res) {},
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      },
      fail:res=>{
        console.log("fail")
        console.log(res)
      },
      complete:res=>{
        console.log("complete")
        console.log(res)
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
    API_URL:'https://www.egt365.com/zjc/lff/api/',
    SOCKET_URL:"wss://www.egt365.com/zjc/lff/websocket/"
    // API_URL: 'http://192.168.1.60:12891/api/'
  },
})