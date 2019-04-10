// pages/index/product-detail.js
var network = require("../../utils/network.js");
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // amount:1,
    tab: {
      list: [{
        id: 1,
        title: '商品详情'
      }, {
        id: 2,
        title: '包装售后'
      }]
    },
    selectedId: 1,
    stepper: {
      min:1
    }
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
      gId: options.gId
    })
    this.initGoods(options.id)
    this.goodsInfo(options.gId);
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
  onShareAppMessage: function () {
    return network.share("id=" + this.data.id + "&gId=" + this.data.gId);
  },
  goodsInfo: function (gid) {
    network.GET({
      url: "goods-info/" + gid,
      params: {},
      success: (res) => {
        if (res.data.code == 200) {
          WxParse.wxParse('article', 'html', res.data.data, this, 5)
        }
      }
    })
  },
  initGoods:function(id){
    network.GET({
      url: "goods/" + id,
      params: {},
      success: (res) => {
        if (res.data.code == 200) {
          var skuNum=res.data.data.sku.skuNum
          if (skuNum==0){
            this.data.stepper.stepper=0
          }else{
            this.data.stepper.stepper = 1
          }
          this.data.stepper.max = skuNum
          this.setData({
            goodObj: res.data.data,
            stepper: this.data.stepper
          })
        }
      }
    })
  },
  // jia: function () { //加
  //   this.setData({
  //     amount: ++this.data.amount
  //   })
  // },
  // jian: function () { //减
  //   let amount = this.data.amount;
  //   if (amount > 1) {
  //     amount--
  //   }
  //   this.setData({
  //     amount: amount
  //   })

  // },
  handleTabChange: function (e) {
    this.setData({
      selectedId: e.detail
    })
  },
  buynow:function(e){
    if (this.data.stepper.max){
      wx.navigateTo({
        url: "/pages/check-out/index?skuid=" + this.data.goodObj.sku.skuId + "&&numcount=" + this.data.stepper.stepper
      })
    }
  },
  // inputNum: function (e) { //输入框选数量
  //   let amount = e.detail.value;
  //   this.setData({
  //     amount: amount
  //   })
  // },
  handleZanStepperChange({
    detail: stepper,
    target: {
      dataset: {
        componentId
      }
    }
  }) {
    this.setData({
      [`${componentId}.stepper`]: stepper
    });
  }
})