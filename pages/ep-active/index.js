// pages/ep-active/index.js
var network = require("../../utils/network.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    network.GET({
      url: "epSales",
      params: {},
      success: (res) => {
        console.log(res)
        if (res.data.code == 200) {
          if (res.data.data.length>0){
            this.setData({
              epSalesList: res.data.data
            })
            this.setTimeoutCountDown();
          }
        }
      }
    })
  },
  
 

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },
  countDown: function(n) {
    let newTime = new Date().getTime();
    let endTime = n.endTime;
    let startTime = n.startTime;
    let erSatus = n.erSatus;
    let obj = null;
    if (erSatus==1){
      let time = (startTime - newTime) / 1000;
      // 获取天、时、分、秒
      let day = parseInt(time / (60 * 60 * 24), 10);
      let hou = parseInt(time % (60 * 60 * 24) / 3600, 10);
      let min = parseInt(time % (60 * 60 * 24) % 3600 / 60, 10);
      let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60, 10);
      obj = {
        day: this.timeFormat(day),
        hou: this.timeFormat(hou),
        min: this.timeFormat(min),
        sec: this.timeFormat(sec),
        statusText: "即将开始"
      }
    } else if (erSatus == 2) {
      let time = (endTime - newTime) / 1000;
      // 获取天、时、分、秒
      let day = parseInt(time / (60 * 60 * 24), 10);
      let hou = parseInt(time % (60 * 60 * 24) / 3600, 10);
      let min = parseInt(time % (60 * 60 * 24) % 3600 / 60, 10);
      let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60, 10);
      
      obj = {
        day: this.timeFormat(day),
        hou: this.timeFormat(hou),
        min: this.timeFormat(min),
        sec: this.timeFormat(sec),
        statusText:"拍卖中"
      }
    } else {//活动已结束，全部设置为'00'
      obj = {
        day: '00',
        hou: '00',
        min: '00',
        sec: '00',
        statusText: "已结束"
      }
    }
    n.obj=obj;
    return n;
  },
  timeFormat: function (param) {
    return param < 10 ? '0' + param : param;
  },
  setTimeoutCountDown:function(){
    var epSalesList = this.data.epSalesList.map(this.countDown)
    this.setData({
      epSalesList: epSalesList
    })
    setTimeout(this.setTimeoutCountDown, 1000);
  }

})