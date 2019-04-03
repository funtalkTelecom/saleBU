// pages/apply-copartner/index.js
var network = require("../../utils/network.js");
var util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showBottomPopup: false,//申请弹窗,
    time: 61,
    smsFlag:false,
    img1: "",
    img2:"",
    imgpath1:"",
    imgpath2:"",
    phone:""
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
  toggleBottomPopup() {
    this.setData({
      showBottomPopup: !this.data.showBottomPopup
    });
  },
  getcode:function(){
    if (!this.data.phone) {
      util.showToast("请输入手机号码")
      return
    }
    if (!(/^1[3456789]\d{9}$/.test(this.data.phone))) {
      util.showToast('联系号码格式有误');
      return
    }
    network.POST({
      url: "sms/ack",
      params: { phone: this.data.phone},
      success: (res) => {
        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.data,
            icon: 'success',
            duration: 2000
          })
          this.setTimeoutCode()
        }
      }
    })

  },
  setphone:function(e){
    this.setData({
      phone: e.detail.value
    })
  },
  setTimeoutCode:function(){
    if (this.data.time == 1) {
      this.setData({
        smsFlag: false,
        time: 61
      })
      return;
    } else {
      var time = this.data.time - 1
      this.setData({
        smsFlag: true,
        time: time
      })
    }
    setTimeout(() => { this.setTimeoutCode() }, 1000)
  },
  uploadImg:function(e){
    var type = e.currentTarget.dataset.type;
    var that = this;
    var path = "imgpath" + type
    var img="img"+type
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], 
      sourceType: ['album', 'camera'], 
      success: function (res) {
        var tempFilePaths = res.tempFilePaths[0]
        wx.uploadFile({
          url: getApp().globalData.API_URL + "upload/image?sub_path=icdard&__sessid=" + wx.getStorageSync("token"),
          filePath: tempFilePaths,
          name: 'upload',
          header: {
            "Content-Type": "multipart/form-data"
          },
          success: (res) => {
            res=JSON.parse(res.data)
            that.setData({
              [img]: tempFilePaths,
              [path]: res.data.file_name
            })
          }
        })
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  },
  formSubmit: function (e) {
    var formData = e.detail.value;
    if (!formData.name) {
      util.showToast("请输入姓名")
      return
    }
    if (!formData.phone) {
      util.showToast("请输入手机号码")
      return
    }
    if (!(/^1[3456789]\d{9}$/.test(formData.phone))) {
      util.showToast('联系号码格式有误');
      return
    }
    if (!formData.idcard) {
      util.showToast("请输入身份证")
      return
    }
    if (!this.data.imgpath1){
      util.showToast("请上传身份证正面")
      return
    }
    if (!this.data.imgpath2) {
      util.showToast("请上传身份证反面")
      return
    }
    if (!formData.check_code) {
      util.showToast('请输入验证码');
      return
    }
    formData.idcard_face_file_name = this.data.imgpath1
    formData.idcard_back_file_name = this.data.imgpath2
    network.POST({
      url: "partner/user-info",
      params: formData,
      success: (res) => {
        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.data,
            icon: 'success',
            duration: 2000,
            success:function(){
              wx.navigateTo({
                url: '/pages/copartner/index'
              })
            }
          })
        }else{
          util.showToast(res.data.data);
        }
      }
    })
  }

})