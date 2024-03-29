// pages/apply-copartner/index.js
var network = require("../../utils/network.js");
var util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showBottomPopup: false,//申请弹窗,
    showContractPopup: false,//协议弹窗,
    time: 61,
    smsFlag:false,
    img1: "",
    img2:"",
    imgpath1:"",
    imgpath2:"",
    phone:"",
    name:"",
    idcard:"",
    partnerObj:{},
    partner_check:0,
    contract:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPartner()
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
  onShareAppMessage: function () {
    return {
      title:  "有个创业项目想邀请您一起参与~ 低门槛，高收益，零风险，0投资。",
      path: "pages/apply-copartner/index?userid=" + wx.getStorageSync('consumer_id')
    }
  }, 
  checkboxChange:function(e){
    this.setData({
      contract: !this.data.contract
    })
  },
  getPartner: function () {
    network.GET({
      url: "partner/user-info",
      params: {},
      success: (res) => {
        if (res.data.code == 200) {
          var partnerObj = res.data.data
          if (partnerObj.idcard && partnerObj.name && partnerObj.phone){
            this.setData({
              partnerObj: partnerObj,
              name: partnerObj.name,
              idcard: partnerObj.idcard,
              phone: partnerObj.phone,
              img1: partnerObj.idcard_face,
              img2: partnerObj.idcard_back,
              partner_check: partnerObj.partner_check,
              imgpath1: partnerObj.idcard_face.substr(partnerObj.idcard_face.lastIndexOf("/") + 1),
              imgpath2: partnerObj.idcard_back.substr(partnerObj.idcard_back.lastIndexOf("/") + 1),
            })
          }
        }
      }
    })
  },
  toggleBottomPopup() {
    this.setData({
      showBottomPopup: !this.data.showBottomPopup
    });
  }, 
  toggleContractPopup() {
    this.setData({
      showContractPopup: !this.data.showContractPopup,
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
    wx.showLoading({
      mask: true,
      title: '',
    })
    network.POST({
      url: "sms/ack",
      params: { phone: this.data.phone},
      success: (res) => {
        wx.hideLoading()
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
        if(res.tempFiles[0].size>2*1024*1024){
          util.showToast("文件过大，请选择2M以下大小的图片")
        }else{
          wx.showLoading({
            mask: true,
            title: '上传中，请稍等',
          })
          wx.uploadFile({
            url: getApp().globalData.API_URL + "upload/image?sub_path=idcard&__sessid=" + wx.getStorageSync("token"),
            filePath: tempFilePaths,
            name: 'upload',
            header: {
              "Content-Type": "multipart/form-data"
            },
            success: (res) => {
              wx.hideLoading()
              res = JSON.parse(res.data)
              if (res.code == 200) {
                that.setData({
                  [img]: tempFilePaths,
                  [path]: res.data.file_name
                })
              } else {
                util.showToast(res.data)
              }
            }
          })
        }
        
      },
      fail: function (res) {
        util.showToast("选择图片失败")
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
    if (!this.data.contract) {
      util.showToast('请阅读并同意平台合伙人认证服务');
      return
    }
    formData.idcard_face_file_name = this.data.imgpath1
    formData.idcard_back_file_name = this.data.imgpath2
    wx.showLoading({
      mask: true,
      title: '提交申请中',
    })
    network.POST({
      url: "partner/user-info",
      params: formData,
      success: (res) => {
        wx.hideLoading()
        if (res.data.code == 200) {
          wx.setStorageSync('isPartner', "1")
          wx.showToast({
            title: res.data.data,
            icon: 'success',
            duration: 3000,
            success:function(){
              setTimeout(function () {
                wx.navigateTo({
                  url: '/pages/copartner/index'
                })
              }, 3000);
            }
          })
        }else{
          util.showToast(res.data.data);
        }
      }
    })
  }

})