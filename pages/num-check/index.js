// pages/num-check/index.js
var network = require("../../utils/network.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showBottomPopup: false,//地址弹窗
    wxpay: 'true',
    mealObj:{},//套餐数据
    numberObj:{},//号码数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    this.initNumber(options.id);
    this.initMeal(options.id);
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.initAddress();
  },



  

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return network.share("id=" + this.data.id );
  },
  // usewxpay: function (e) {
  //   console.log(e.currentTarget.dataset.wxpay);
  //   this.setData({
  //     wxpay: e.currentTarget.dataset.wxpay
  //   })
  // },
  initNumber:function(id){
    network.GET({
      url: "number/" + id,
      params: {},
      success: (res) => {
        if (res.data.code == 200) {
          this.setData({
            numberObj: res.data.data
          })
        }
      }
    })
  },
  initMeal:function(id){
    network.GET({
      url: "meal/n" + id,
      params: {},
      success: (res) => {
        if (res.data.code == 200) {
          this.setData({
            mealObj: res.data.data[0]
          })
        }
      }
    })
  },
  initAddress:function(){
    network.GET({
      url: "deliveryAddresss",
      params: {},
      success: (res) => {
        if (res.data.code == 200) {
          if (res.data.data.length>0){
            this.setData({
              curAddressObj: res.data.data[0],
              addressList: res.data.data
            })
          }else{
            this.setData({
              curAddressObj: null
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
  createOrder:function(e){
    if (!this.data.curAddressObj) {
      // wx.hideLoading();
      wx.showModal({
        content: '请先设置您的收货地址！',
        showCancel: false
      })
      return;
    }
    var params=new Object();
    params.type=2;
    params.addrid = this.data.curAddressObj.id;
    params.numid = this.data.numberObj.id;
    params.skuid = this.data.numberObj.skuId;
    params.mealid = this.data.mealObj.mid;

    network.POST({
      url: "order",
      params: params,
      success: (res) => {
        if (res.data.code == 200) {
          wx.navigateTo({
            url: '/pages/product-pay/index?orderid=' + res.data.data
          })
        } else if (res.data.data){
          wx.showToast({
            title: res.data.data,
            icon: 'none',
            duration: 2000
          })
        }else{
          wx.showToast({
            title:"创建订单失败",
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
    

  },
  selectAddr:function(e){
    const index = e.currentTarget.dataset.index;
    this.setData({
      curAddressObj: this.data.addressList[index]
    })
    this.toggleBottomPopup(); 
  }
})