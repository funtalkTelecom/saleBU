// pages/withdraw/index.js
var network = require("../../utils/network.js");
var util = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    partnerObj: {},
    amt:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPartner();
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
  getPartner: function () {
    network.GET({
      url: "partner/user-info",
      params: {},
      success: (res) => {
        if (res.data.code == 200) {
          this.setData({
            partnerObj: res.data.data
          })
        }
      }
    })
  },
  amtAll:function(){
    this.setData({
      amt: this.data.partnerObj.balance
    })
  },
  formSubmit:function(e){
    var formData = e.detail.value;
    if (!formData.amt){
      util.showToast("请输入提现金额");
      return
    }
    formData.amt= new Number(formData.amt).toFixed(2)
    this.setData({
      amt: formData.amt
    })
    if (formData.amt > parseFloat(this.data.partnerObj.balance)){
      util.showToast("余额不足");
      return
    } 
    if (formData.amt<0.3){
      util.showToast("提现金额需不低于0.3");
      return
    }
    network.POST({
      url: "partner/finance-withdraw",
      params: formData,
      success: (res) => {
        util.showToast(res.data.data);
        if (res.data.code == 200) {
          var temp = this.data.partnerObj.balance - formData.amt
          this.setData({
            [partnerObj.balance]: temp
          })
        }
      }
    })
  }
})