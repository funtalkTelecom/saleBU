var network = require("../../utils/network.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    remindStart: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initActive(options.id);

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
  //我要参与
  gojoin: function (e) {
    console.log(e)
    wx.navigateTo({
      url: 'auction-detail?id=' + e.currentTarget.dataset.id
      });
  },
  //设置提醒
  remind: function () {
    let flag = !this.data.remindStart;
    this.setData({
      remindStart: flag
    })
  },
  // leftTimer: function (year, month, day, hour, minute, second){
  //   var leftTime = (new Date(year, month - 1, day, hour, minute, second)) - (new Date()); //计算剩余的毫秒数 
  //   var days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10); //计算剩余的天数 
  //   var hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10); //计算剩余的小时 
  //   var minutes = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟 
  //   var seconds = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数 
  //   days = checkTime(days);
  //   hours = checkTime(hours);
  //   minutes = checkTime(minutes);
  //   seconds = checkTime(seconds);
  // },
  countDown: function () {
    let newTime = new Date().getTime();
    let endTime = this.data.activeObj.endTime;
    let startTime = this.data.activeObj.startTime;
    let date = null;
    if (startTime - newTime > 0) {
      let time = (startTime - newTime) / 1000;
      // 获取天、时、分、秒
      let day = parseInt(time / (60 * 60 * 24), 10);
      let hou = parseInt(time % (60 * 60 * 24) / 3600, 10);
      let min = parseInt(time % (60 * 60 * 24) % 3600 / 60, 10);
      let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60, 10);
      date = {
        day: this.timeFormat(day),
        hou: this.timeFormat(hou),
        min: this.timeFormat(min),
        sec: this.timeFormat(sec),
        statusText: "即将开始"
      }
    } else if (endTime - newTime > 0) {
      let time = (endTime - newTime) / 1000;
      // 获取天、时、分、秒
      let day = parseInt(time / (60 * 60 * 24), 10);
      let hou = parseInt(time % (60 * 60 * 24) / 3600, 10);
      let min = parseInt(time % (60 * 60 * 24) % 3600 / 60, 10);
      let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60, 10);

      date = {
        day: this.timeFormat(day),
        hou: this.timeFormat(hou),
        min: this.timeFormat(min),
        sec: this.timeFormat(sec),
        statusText: "拍卖中"
      }
    } else {//活动已结束，全部设置为'00'
      date = {
        day: '00',
        hou: '00',
        min: '00',
        sec: '00',
        statusText: "已结束"
      }
    }
    this.data.activeObj.date = date
    this.setData({
      activeObj: this.data.activeObj
    })
    setTimeout(this.countDown, 1000);
  },
  timeFormat: function (param) {
    return param < 10 ? '0' + param : param;
  },
  initActive: function (id) {
    network.GET({
      url: "epSaleGoodss/" + id,
      params: {},
      success: (res) => {
        if (res.data.code == 200) {
          console.log(res)
          this.setData({
            activeObj: res.data.data[0],
            goodsList: res.data.data[0].goodsList
          })
          this.countDown();
        }
      }
    })
  }
})