// pages/num-check/index.js
var network = require("../../utils/network.js")
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showBottomPopup: false,//地址弹窗
    wxpay: 'true',
    mealArr:[],
    mealObj:{},//套餐数据
    numberObj:{},//号码数据
    addrindex:0,
    selectMealIndex:0,
    intervalId:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    network.BarTitle("靓号订购")
    this.initNumber(options.id);
    this.initMeal(options.id);
    
  },
  onUnload: function () {
    if (this.data.intervalId){
      clearInterval(that.data.intervalId)
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.initAddress();
  },
  setInterval:function(){
    var that=this;
    
    this.data.intervalId = setInterval(function () {
      that.data.numberObj.newDate = that.data.numberObj.newDate + 1000
      if (that.data.numberObj.activitySdate - that.data.numberObj.newDate >= 0) {
        
      }else if (that.data.numberObj.activityEdate - that.data.numberObj.newDate>= 0) {
            that.setData({
              enddatetext: util.parseIntDayTime((that.data.numberObj.activityEdate - that.data.numberObj.newDate) / 1000),
              status: 2
          })
        }else if (that.data.numberObj.activityEdate - that.data.numberObj.newDate < 0){
          clearInterval(that.data.intervalId)
        that.setData({
          enddatetext: util.parseIntDayTime((that.data.numberObj.activityEdate - that.data.numberObj.newDate) / 1000),
          status: 3
        })
        }

      }, 1000)
   
    
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
    var that=this;
    network.GET({
      url: "number/" + id,
      params: {},
      success: (res) => {
        if (res.data.code == 200) {
          var status =3;
          // this.setData({
          //   numberObj: res.data.data
          // })
          // var begindate = res.data.data.activitySdate;
          // var enddate = res.data.data.activityEdate;
          // var currdate = res.data.data.newDate;
          if (res.data.data.activityType && res.data.data.activityType==1){
            if (res.data.data.activitySdate - res.data.data.newDate > 0) {
              status = 1
            }
            else if (res.data.data.activityEdate - res.data.data.newDate > 0) {
              status = 2
            }
            // if (res.data.data.activityEdate - res.data.data.newDate <= 0) {
            //   status = 3
            // }
            
          }

          this.setData({
            numberObj: res.data.data,
            begindatetext: util.formatminute(new Date(res.data.data.activitySdate)),
            enddatetext: util.parseIntDayTime((res.data.data.activityEdate - res.data.data.newDate) / 1000),
            status: status
            // begindate: begindate,
            // enddate: enddate,
            // currdate: currdate,
          })
          if (status!=3){
            this.setInterval();
          }
         
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
            mealArr: res.data.data,
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
              curAddressObj: res.data.data[this.data.addrindex],
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
  selectMeal(e){
    const index = e.currentTarget.dataset.index;
    this.setData({
      selectMealIndex:index,
      mealObj: this.data.mealArr[index]

    })
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
      curAddressObj: this.data.addressList[index],
      addrindex:index
    })
    this.toggleBottomPopup(); 
  }
})