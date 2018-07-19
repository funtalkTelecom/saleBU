// pages/ep-active/index.js
var network = require("../../utils/network.js");
const util = require('../../utils/util.js')
Page({
  data: {
    clearTimeoutCountDown: '',  //倒计时定时器的值
  },
  onLoad: function (options) {
    network.BarTitle("竞拍活动")
  },
  
  onShow: function () {
    this.initEpSales();
  },
  onUnload: function () {
    clearTimeout(this.data.clearTimeoutCountDown)
  },
  onHide: function () {
    clearTimeout(this.data.clearTimeoutCountDown)
  },
  // 竟拍活动列表
  initEpSales:function(){
    network.GET({
      url: "epSales",
      params: {},
      success: (res) => {
        if (res.data.code == 200) {
          if (res.data.data.length > 0) {
            this.setData({
              epSalesList: res.data.data
            })
            // this.setTimeoutCountDown();
            this.countDown();
          }
          //TODO--如果没有活动的情况下
        }
      }
    })
  },
  countDown: function() {
    var epSalesList = this.data.epSalesList.map(util.epSalesItemFormatTime);
    this.setData({
      epSalesList: epSalesList
    })
    //状态1，2都要倒计时定时器
    // if (this.data.epSalesList.gSatus != 3) {
    //   this.data.clearTimeoutCountDown = setTimeout(this.countDown, 1000);
    // }
    for (var i=0;i<epSalesList.length;i++){
      // console.log(epSalesList[i].erSatus)
      if (epSalesList[i].erSatus != 3){
        this.data.clearTimeoutCountDown = setTimeout(this.countDown, 1000);
        break;
      }
    }
  },
 
  // setTimeoutCountDown:function(){
  //   var epSalesList = this.data.epSalesList.map(this.countDown)
  //   this.setData({
  //     epSalesList: epSalesList
  //   })
  //   setTimeout(this.setTimeoutCountDown, 1000);
  // }

})