var network = require("../../utils/network.js")
const app = getApp();
// pages/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    maskFlag: false,
    imgFlag:false,
    scene: "id=1019859932071067648",
    page: "pages/index/index"
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
  createNewImg: function () {
    var context = wx.createCanvasContext('myCanvas');
    // var obj = { "r": "255", "g": "48", "b": "48"};
    // wx.downloadFile({
    //   url: "https://www.egt365.com/zjc/lff/api/getQrcode?scene=" + this.data.scene + "&page=" + this.data.page + "&is_hyaline=" + true, //仅为示例，并非真实的资源
    //   success: (res) => {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        // if (res.statusCode === 200) {
          var path = "../../imgs/share.jpg";
          context.drawImage(path, 0, 0, 256, 364);
          // context.drawImage(res.tempFilePath, 0, 0, 250, 250);
          context.draw(false,  () =>{
            wx.canvasToTempFilePath({
              canvasId: 'myCanvas',
              success: (res) => {
                var tempFilePath = res.tempFilePath;
                console.log(tempFilePath);
                this.setData({
                  imagePath: tempFilePath,
                  maskFlag: true,
                  imgFlag:true
                });
              },
              complete: function () {
        wx.hideLoading()
      }
            })
          });
    //     }
    //   },
    //   fail: (res) => {
    //     wx.showLoading({
    //       mask: true,
    //       title: '二维码生成失败'
    //     })
    //   },
    //   complete: function () {
    //     wx.hideLoading()
    //   }
    // })
  },
  share: function () {
    if (!this.data.imgFlag){
      wx.showLoading({
        mask: true,
        title: '二维码生成中'
      })
      this.createNewImg();
    }else{
      this.setData({
        maskFlag: true
      })
    }
   
  },
  save: function () {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.imagePath,
      success: (res) => {
        this.hideMask();
      },
      fail: (res) => {
        // if (res.errMsg == "saveImageToPhotosAlbum:fail auth deny" || res.errMsg == "saveImageToPhotosAlbum:fail:auth denied"){
        wx.showModal({
          content: '保存图片需要您的授权',
          confirmText: "去开启",
          success: function (res) {
            if (res.confirm) {
              wx.openSetting({
                success: (res) => {
                  // console.log(res.authSetting['scope.writePhotosAlbum'])
                }
              })
            }
          }
        })
        // } else if (res.errMsg =="saveImageToPhotosAlbum:fail cancel"){
        //   wx.showToast({
        //     title: '取消保存',
        //     icon: 'none'
        //   })
        // }

      }
    })
  },
  hideMask: function () {
    this.setData({
      maskFlag: false
    })
  },
  toweb:function(){
    wx.navigateTo({
      url: '/pages/instalments/index?src=https://mp.weixin.qq.com',
    })
  }
})