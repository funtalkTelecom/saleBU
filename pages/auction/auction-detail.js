// pages/auction/auction-detail.js
var network = require("../../utils/network.js");
var WxParse = require('../../wxParse/wxParse.js');
const util = require('../../utils/util.js')
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
    stepper: {},
    goodsAuctionListFlag: true,  //状态一变成状态二时开始请求出价数据
    clearTimeoutCountDown: '',  //倒计时定时器的值
    // clearTimeoutgoodsAuctionList: '', //数据请求定时器的值
    getFocus: false, //input框是否有焦点,
    websocketFlag:false,
    collectionStart: false,// 收藏


  },
  onLoad: function (options) {
    // console.log(options)
    if (options.erIsPack == 1) { options.numId = 0 }
    this.setData({
      gId: options.gId,
      numId: options.numId,
      erIsPack: options.erIsPack
    })
    this.goodsInfo(options.gId);
    this.getGoodsFocus(options.numId, options.gId, options.erIsPack)
  },

  onShow: function () {
    this.setData({
      goodsAuctionListFlag: true
    })
    //初始化数据
    this.initGood(this.data.gId, this.data.numId, this.data.erIsPack)

  },
  onUnload: function () {
    clearTimeout(this.data.clearTimeoutCountDown)
    // clearTimeout(this.data.clearTimeoutgoodsAuctionList)
    if (this.data.websocketFlag) {
      this.closeSocket()
    }

  },
  onHide: function () {
    clearTimeout(this.data.clearTimeoutCountDown)
    // clearTimeout(this.data.clearTimeoutgoodsAuctionList)
    if (this.data.websocketFlag) {
      this.closeSocket()
    }
  },
  onShareAppMessage: function () {
    return network.share("gId=" + this.data.gId + "&&numId=" + this.data.numId);
  },
  handleTabChange: function (e) {
    this.setData({
      selectedId: e.detail
    })
  },
  //收藏
  // collection: function () {
  //   let flag = !this.data.collectionStart;
  //   this.setData({
  //     collectionStart: flag
  //   })
  // },
  // 查询收藏
  getGoodsFocus: function (numId, gId, erIsPack) {
    network.GET({
      url: "goodsFocus/" + numId + "/" + gId + "/" + erIsPack,
      params: {},
      success: (res) => {
        if (res.data.code == 200) {
          // console.log(res)
          if (res.data.data.length > 0) {
            this.setData({
              collectionStart:true
            })
          } else {
            this.setData({
              collectionStart: false
            })
          }
        }
      }
    })
  },
  // 收藏功能
  collection: function () {
    network.POST({
      url: "goodsFocus",
      params: {
        skuId: this.data.epSaleGoods.skuId,
        numId: this.data.epSaleGoods.numId,
        num: this.data.epSaleGoods.num,
        gId: this.data.epSaleGoods.gId,
        gName: this.data.epSaleGoods.gName,
        price: this.data.stepper.stepper,
        erISPack: this.data.epSaleGoods.erIsPack
      },
      success: (res) => {
        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.data,
            icon: 'success',
            duration: 2000
          })
          this.setData({
            collectionStart: !this.data.collectionStart
          })
        } else {
          wx.showToast({
            title: res.data.data,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
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
  showModal: function () {
    // if (this.data.epSaleGoods.gSatus == 3) {
    wx.showModal({
      content: '您有一个竞拍订单等待支付尾款，是否继续支付',
      success: (res) => {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/auction/auction-pay?orderId=' + this.data.goodsAuctionList[0].orderId,
          })
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
    // }

  },
  //去支付保证金
  paybail: function () {
    var price = (parseFloat(this.data.epSaleGoods.gPriceUp) + parseFloat(this.data.epSaleGoods.currentPrice)) || parseFloat(this.data.epSaleGoods.gStartPrice)
    wx.navigateTo({
      url: '/pages/auction/pay-bail?skuId=' + this.data.epSaleGoods.skuId + "&&numId=" + this.data.epSaleGoods.numId + "&&num=" + this.data.epSaleGoods.num + "&&gId=" + this.data.epSaleGoods.gId + "&&gName=" + this.data.epSaleGoods.gName + "&&price=" + price + "&&gDeposit=" + this.data.epSaleGoods.gDeposit + "&&erIsPack=" + this.data.epSaleGoods.erIsPack
    });
  },
  //根据id查数据
  initGood: function (gId, numId, erIsPack) {
    var goodsAuctionList = null;
    network.GET({
      url: "epSaleGoods/" + numId + "/" + gId + "/" + erIsPack,
      params: {},
      success: (res) => {

        if (res.data.code == 200) {
          var epSaleGoods = res.data.data
          if (epSaleGoods.erIsPack==1){
            epSaleGoods.skuId = 0
            epSaleGoods.numId = 0
            epSaleGoods.num == ''
            wx.setNavigationBarTitle({
              title: epSaleGoods.gName + "--竞拍"
            })
          }
          else{
            wx.setNavigationBarTitle({
              title: epSaleGoods.num + "--竞拍"
            })
          }
          //判断是否有出价记录数据
          if (epSaleGoods.goodsAuctionList) {
            goodsAuctionList = epSaleGoods.goodsAuctionList.map(this.substring)
          } else {
            goodsAuctionList = []
          }
          //判断状态2和已支付时设置计数器的数值
          // if (epSaleGoods.idDeposit == 1 && epSaleGoods.gSatus == 2) {
          this.data.stepper.stepper = goodsAuctionList[0] ? parseFloat((parseFloat(goodsAuctionList[0].price) + parseFloat(epSaleGoods.gPriceUp)).toFixed(2)) : epSaleGoods.gStartPrice
          this.data.stepper.step = epSaleGoods.gPriceUp;
          this.data.stepper.min = goodsAuctionList[0] ? parseFloat((parseFloat(goodsAuctionList[0].price) + parseFloat(epSaleGoods.gPriceUp)).toFixed(2)) : epSaleGoods.gStartPrice
          // }
          this.setData({
            epSaleGoods: epSaleGoods,
            goodsAuctionList: goodsAuctionList,
            stepper: this.data.stepper
          })
          // 执行倒计时定时器
          this.countDown();
          // 弹窗
          if (epSaleGoods.gSatus == 3 && goodsAuctionList[0].consumerId == wx.getStorageSync("consumer_id") && goodsAuctionList[0].orderStatus == 1) {
            this.showModal();
          }
        }
      }
    })
  },
  //截取id后6位
  substring: function (element) {
    if (element.consumerId == wx.getStorageSync("consumer_id")) {
      element.text = "本人"
    } else {
      element.text = element.consumerId.substr(element.consumerId.length - 6, element.consumerId.length);
    }

    return element;
  },
  // 时间定时器
  countDown: function () {
    //时间格式转换
    this.data.epSaleGoods = util.epSaleGoodFormatTime(this.data.epSaleGoods);
    this.setData({
      epSaleGoods: this.data.epSaleGoods
    })

    //状态从一变二时开始查询出价记录，仅一次
    if (this.data.goodsAuctionListFlag && this.data.epSaleGoods.gSatus == 2) {
      this.getLatestGoodsAuctionList();
    }
    //状态1，2都要倒计时定时器
    if (this.data.epSaleGoods.gSatus != 3) {
      this.data.clearTimeoutCountDown = setTimeout(this.countDown, 1000);
    }

  },

  // //修改价格
  handleZanStepperChange({
      detail: stepper,
      target: {
          dataset: {
              componentId
          }
      }
  }) {
    this.setData({
      [`${componentId}.stepper`]: parseFloat(stepper.toFixed(2))
    });
  },
  //获取获取和失去焦点
  handleZanStepperFocus: function (e) {
    this.setData({
      getFocus: e.detail
    })
  },
  //修改价格 直接输入的方式
  handleZanStepperInput: function (e) {
    this.setData({
      'stepper.stepper': parseFloat(e.detail)
    })
  },
  // 提交出价
  bid: function () {
    network.POST({
      url: "epSaleGoodsAuciton",
      params: {
        skuId: this.data.epSaleGoods.skuId,
        numId: this.data.epSaleGoods. numId,
        num: this.data.epSaleGoods.num,
        gId: this.data.epSaleGoods.gId,
        gName: this.data.epSaleGoods.gName,
        price: this.data.stepper.stepper,
        erISPack: this.data.epSaleGoods.erIsPack
      },
      success: (res) => {
        if (res.data.code == 200) {
          wx.showToast({
            title: "本次出价成功",
            icon: 'success',
            duration: 3000
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
            duration: 3000
          })
        }
      }
    })
  },
  //websocket查出价数据
  getLatestGoodsAuctionList: function () {

    this.setData({
      goodsAuctionListFlag: false,
      websocketFlag:true
    })
    this.connectSocket();

    // this.onSocketOpen();
    //监听WebSocket接受到服务器的消息事件。
    this.onSocketMessage();
    this.onSocketClose();

  },
  currentIdDeposit: function (e) {
    return e.consumer_id == wx.getStorageSync("consumer_id")
  },
  //创建一个 WebSocket 连接
  connectSocket: function () {

    // console.log(util.formatTime(new Date()))
    wx.connectSocket({
      url: getApp().globalData.SOCKET_URL + this.data.numId + "/" + this.data.gId + "/" + this.data.erIsPack,
      // url: "wss://192.168.1.131/zjc/zqf/websocket/" + this.data.numId + "/" + this.data.gId,
    })
  },
  //监听WebSocket连接打开事件。
  onSocketOpen: function () {
    wx.onSocketOpen((res) => {
      //通过 WebSocket 连接发送数据
      wx.sendSocketMessage({
        data: 1
      })
    })
  },
  onSocketMessage: function () {
    wx.onSocketMessage((res) => {
      var goodsAuctionList = null;
      var response = JSON.parse(res.data)

      if (response.code == 200) {
        if (response.data[0].goodsAuctionList) {
          goodsAuctionList = response.data[0].goodsAuctionList.map(this.substring)
          this.data.epSaleGoods.gEndTime = goodsAuctionList[0].endTime.time//设置最新的结束时间
          var stepperValue = (parseFloat(goodsAuctionList[0].price) + parseFloat(this.data.epSaleGoods.gPriceUp))
          if (!this.data.getFocus && parseFloat(this.data.stepper.stepper) < parseFloat(stepperValue)) {
            this.data.stepper.stepper = parseFloat(stepperValue.toFixed(2))
          }
          this.data.stepper.min = parseFloat((parseFloat(goodsAuctionList[0].price) + parseFloat(this.data.epSaleGoods.gPriceUp)).toFixed(2))
          this.data.epSaleGoods.currentPrice = goodsAuctionList[0].price
          if (response.data[0].goodsAuctionDepositList.some(this.currentIdDeposit)) {
            this.data.epSaleGoods.idDeposit = 1
          } else {
            this.data.epSaleGoods.idDeposit = 0
          }
        } else {
          goodsAuctionList = []
        }
        this.data.epSaleGoods.priceCount = response.data[0].priceCount || 0  //出价次数

        this.setData({
          epSaleGoods: this.data.epSaleGoods,
          goodsAuctionList: goodsAuctionList,
          stepper: this.data.stepper,
          goodsAuctionListFlag: false
        })
        if (goodsAuctionList[0].orderId) {
          if (goodsAuctionList[0].consumerId == wx.getStorageSync("consumer_id") && goodsAuctionList[0].orderStatus == 1) {
            this.showModal();
          }
        }
      }
    })
  },
  onSocketClose: function () {
    wx.onSocketClose( () =>{
      this.setData({
        websocketFlag:false
      })
    })
  },
  closeSocket: function () {
    wx.closeSocket()
  }
})