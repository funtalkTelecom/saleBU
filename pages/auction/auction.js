var network = require("../../utils/network.js");
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // remindStart: false,// 设置提醒
    clearTimeoutCountDown: '',  //倒计时定时器的值
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      epSalesId: options.id
    })
    this.getEpSaleNotice(options.id);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
   
  },
  onShareAppMessage: function () {
    return network.share("id=" + this.data.epSalesId);
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.initActive(this.data.epSalesId);
  },
  onUnload: function () {
    clearTimeout(this.data.clearTimeoutCountDown)
  },
  onHide: function () {
    clearTimeout(this.data.clearTimeoutCountDown)
  },
  //我要参与
  gojoin: function (e) {
    // console.log(e)
    wx.navigateTo({
      url: 'auction-detail?gId=' + e.currentTarget.dataset.gid + "&&numId=" + e.currentTarget.dataset.numid + "&&erIsPack=" + e.currentTarget.dataset.erispack 
      });
    // wx.navigateTo({
    //   url: '/pages/auction-text/index?gId=' + e.currentTarget.dataset.gid + "&&numId=" + e.currentTarget.dataset.numid
    //   });
  },
  // 提醒功能
  epSaleNotice:function(){
    network.POST({
      url: "epSaleNotice",
      params: { epSaleId: this.data.epSalesId,phone:this.data.phone},
      success: (res) => {
        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.data,
            icon: 'success',
            duration: 2000
          })
          this.setData({
            isNotice: this.data.isNotice==1?0:1
          })
        }else{
          wx.showToast({
            title: res.data.data,
            icon: 'none',
            duration: 2000
          })
        }
      },
      complete:(res)=>{
        this.hideMask()
      }
    })
  },
  formSubmit: function (e) {//弹窗确定按钮
    var phone = e.detail.value.phone
    if (!phone) {
      wx.showToast({
        icon: 'none',
        title: '请输入电话号码',
      })
      return
    }
    if (!(/^1[3456789]\d{9}$/.test(phone))) {
      wx.showToast({
        icon: 'none',
        title: '号码格式有误',
      })
      return
    }
    this.setData({
      phone:phone
    })
    this.epSaleNotice();
  },
  // 查询提醒
  getEpSaleNotice: function (id) {
    network.GET({
      url: "epSaleNotice/" + id,
      params: {},
      success: (res) => {
        if (res.data.code == 200) {
          if (res.data.data.length>0){
            this.setData({
              phone: res.data.data[0].phone,
              isNotice: res.data.data[0].isNotice,
            })
          }else{
            this.setData({
              phone: '',
              isNotice: 0,
            })
          }
        }
      }
    })
  },
  //设置提醒弹窗
  remindpop:function(){
    if (this.data.isNotice==0){
      this.setData({
        maskFlag: true
      })
    }else{
      this.epSaleNotice()
    }
    
  },
  hideMask: function () {//隐藏遮罩
    this.setData({
      maskFlag: false,
      // radioValue:1
    })
  },
  focusHandle: function () {//获得焦点
    this.setData({
      dialogpos: 'dialogpos'
    })
  },
  blurHandle: function () {//失去焦点
    this.setData({
      dialogpos: ''
    })
  },
  //设置提醒
  // remind: function () {
  //   let flag = !this.data.remindStart;
  //   this.setData({
  //     remindStart: flag
  //   })
  // },
  countDown: function () {
    this.data.activeObj=util.activeObjFormatTime(this.data.activeObj);
    this.setData({
      activeObj: this.data.activeObj
    })
    //状态1，2都要倒计时定时器
    if (this.data.activeObj.erSatus != 3) {
      this.data.clearTimeoutCountDown = setTimeout(this.countDown, 1000);
    }
  
  },
  initActive: function (id) {
    network.GET({
      url: "epSaleGoodss/" + id,
      params: {},
      success: (res) => {
        if (res.data.code == 200) {
          this.setData({
            activeObj: res.data.data[0],
            goodsList: res.data.data[0].goodsList
          })
          network.BarTitle(res.data.data[0].title)
          // WxParse.wxParse('article', 'html', res.data.data[0].erRule, this, 5)
          this.countDown();
        }
      }
    })
  }
})