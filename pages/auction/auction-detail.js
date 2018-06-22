// pages/auction/auction-detail.js
var network = require("../../utils/network.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
      // stepper: 10,
      // min: 1,
      // step: 2
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.setData({
    //   goodsid: options.id
    // })
    this.initGood(options.id)
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
  handleTabChange: function (e) {
    this.setData({
      selectedId: e.detail
    })
  },

  paybail :function (){
    var price = parseFloat(this.data.epSaleGoods.gPriceUp) + parseFloat(this.data.epSaleGoods.currentPrice)
    wx.navigateTo({ 
      url: 'pay-bail?skuId=' + this.data.epSaleGoods.skuId + "&&numId=" + this.data.epSaleGoods.numId + "&&num=" + this.data.epSaleGoods.num + "&&gId=" + this.data.epSaleGoods.gId + "&&gName=" + this.data.epSaleGoods.gName + "&&price=" + price
      });
  },
  temp:function (){
    wx.navigateTo({ url: 'auction-pay' });
  },
  initGood:function(id){
    network.GET({
      url: "epSaleGoods/" + id,
      params: {},
      success: (res) => {
        if (res.data.code == 200) {
          var epSaleGoods = res.data.data
          var goodsAuctionList = epSaleGoods.goodsAuctionList.map(this.substring)
          this.data.stepper.stepper = goodsAuctionList[0].price ? parseFloat(goodsAuctionList[0].price) + parseFloat(epSaleGoods.gPriceUp):epSaleGoods.gStartPrice
          this.data.stepper.step = epSaleGoods.gPriceUp;
          this.data.stepper.min = goodsAuctionList[0].price ? parseFloat(goodsAuctionList[0].price) + parseFloat(epSaleGoods.gPriceUp) : epSaleGoods.gStartPrice
          this.setData({
            epSaleGoods: res.data.data,
            goodsAuctionList: goodsAuctionList,
            stepper: this.data.stepper
          })
          this.countDown();
          this.getLatestGoodsAuctionList();
        }
      }
    })
  },
  substring: function (element){
    element.id= element.id.substr(element.id.length - 6, element.id.length);
    return element;
  },
  countDown: function () {
    let newTime = new Date().getTime();
    let endTime = this.data.epSaleGoods.gEndTime;
    let startTime = this.data.epSaleGoods.gStartTime;
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
    this.data.epSaleGoods.date = date
    this.setData({
      epSaleGoods: this.data.epSaleGoods
    })
    setTimeout(this.countDown, 1000);
  },
  timeFormat: function (param) {
    return param < 10 ? '0' + param : param;
  },
  //修改价格
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
  },
  // 提交出价
  bid:function(){
    network.POST({
      url: "epSaleGoodsAuciton",
      params: {
        skuId: this.data.epSaleGoods.skuId,
        numId: this.data.epSaleGoods.numId,
        num: this.data.epSaleGoods.num,
        gId: this.data.epSaleGoods.gId,
        gName: this.data.epSaleGoods.gName,
        price: this.data.stepper.stepper
      },
      success: (res) => {
        console.log(res)
        if (res.data.code == 200) {
          wx.showToast({
            title: "本次出价成功",
            icon: 'success',
            duration: 3000
          })
          var goodsAuctionList = res.data.data.goodsAuctionList.map(this.substring)
          this.setData({
            goodsAuctionList: goodsAuctionList
          })

        } else if (res.data.data) {
          wx.showToast({
            title: res.data.data,
            icon: 'none',
            duration: 3000
          })
        } else {
          wx.showToast({
            title: "出价失败",
            icon: 'none',
            duration:3000
          })
        }
      }
    })
  },
  getLatestGoodsAuctionList:function(){
    network.GET({
      url: "epSaleAuctions/" + this.data.epSaleGoods.numId,
      params: {},
      success: (res) => {
        if (res.data.code == 200) {
          this.setData({
            goodsAuctionList: res.data.data.goodsAuctionList.map(this.substring)
          })
          setTimeout(this.getLatestGoodsAuctionList, 5000);
        }
      }
    })
  }

  
})