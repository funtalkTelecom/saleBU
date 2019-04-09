// pages/promotion-num/index.js
var network = require("../../utils/network.js")
var util = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    numObj: {},
    path:"",
    maskFlag: false,
    imgFlag: false,
    imagePath:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    this.getNumInfo(options.numid)
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
    var num_resource = this.data.numObj.num_resource;
    num_resource=num_resource.substring(0, 3) + '-' + num_resource.substring(3, 7) + '-' + num_resource.substring(7, 11)
    return {
      title: num_resource+"典藏靓号，靓出好运，购买靓号，就选靓号优选",
      path: this.data.path,
      imageUrl: this.data.numObj.share_image
    }
  },
  getNumInfo:function(id){
    network.POST({
      url: "partner/share-url",
      params: { num_id: id },
      success: (res) => {
        if(res.data.code==200){
          this.setData({
            numObj: res.data.data,
            path: "pages/num-check/index?share_id=" + res.data.data.share_id + "&num_id=" + res.data.data.num_id + "&userId=" + wx.getStorageSync('consumer_id')
          })
        }
      }
    })
  },
  longTap:function(){
    wx.setClipboardData({
      data: this.data.path
    })
  },
  hideMask: function () {
    this.setData({
      maskFlag: false
    })
  },
  formSubmit: function (e){
    var formData = e.detail.value;
    if (!formData.nick_name){
      util.showToast("请输入昵称");
      return
    }
    if (!formData.promotion_tip){
      formData.promotion_tip ="发现典藏靓号想推荐给你~"
    }
    // if (!this.data.imgFlag) {
      wx.showLoading({
        mask: true,
        title: '二维码生成中'
      })
      formData.num_id = this.data.numObj.num_id
      formData.share_page = this.data.path
      network.POST({
        url: "partner/share-card",
        params: formData,
        success: (res) => {
          console.log(res)
          if (res.data.code == 200) {
            this.setData({
              imagePath: res.data.data.share_image,
              maskFlag: true,
              imgFlag: true
            });
          } else {
            util.showToast(res.data.data);
          }
        },
        complete: function () {
          wx.hideLoading()
        }
      })
    // }
  },
  save: function () {
    wx.downloadFile({
      url: this.data.imagePath, // 仅为示例，并非真实的资源
      success:(res)=> {
        if (res.statusCode === 200) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
              success: (res) => {
                this.hideMask();
              },
              fail: (res) => {
                console.log(res)
                wx.showModal({
                  content: '保存图片需要您的授权',
                  confirmText: "去开启",
                  success: function (res) {
                    if (res.confirm) {
                      wx.openSetting({
                        success: (res) => {

                        }
                      })
                    }
                  }
                })
              }
            })
        }else{
          util.showToast(res.errMsg);
        }
      }
    })
  },
})