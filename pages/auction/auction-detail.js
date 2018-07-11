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
    clearTimeoutgoodsAuctionList: '', //数据请求定时器的值
    lastRequest: true,//状态2变3最后请求一次数据
    getFocus: false //input框是否有焦点


  },
  onLoad: function (options) {
    this.setData({
      gId: options.gId,
      numId: options.numId
    })
    this.goodsInfo(options.gId);
  },

  onShow: function () {
    this.setData({
      goodsAuctionListFlag: true
    })
    //初始化数据
    this.initGood(this.data.gId, this.data.numId)

  },
  onUnload: function () {
    clearTimeout(this.data.clearTimeoutCountDown)
    clearTimeout(this.data.clearTimeoutgoodsAuctionList)
  },
  onHide: function () {
    clearTimeout(this.data.clearTimeoutCountDown)
    clearTimeout(this.data.clearTimeoutgoodsAuctionList)
  },
  handleTabChange: function (e) {
    this.setData({
      selectedId: e.detail
    })
  },
  goodsInfo:function(gid){
    network.GET({
      url: "goods-info/" + gid,
      params: {},
      success: (res) => {
        console.log(res);
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
  //去出价
  paybail: function () {
    var price = (parseFloat(this.data.epSaleGoods.gPriceUp) + parseFloat(this.data.epSaleGoods.currentPrice)) || parseFloat(this.data.epSaleGoods.gStartPrice)
    wx.navigateTo({
      url: 'pay-bail?skuId=' + this.data.epSaleGoods.skuId + "&&numId=" + this.data.epSaleGoods.numId + "&&num=" + this.data.epSaleGoods.num + "&&gId=" + this.data.epSaleGoods.gId + "&&gName=" + this.data.epSaleGoods.gName + "&&price=" + price + "&&gDeposit=" + this.data.epSaleGoods.gDeposit
    });
  },
  //根据id查数据
  initGood: function (gId, numId) {
    var goodsAuctionList = null;
    network.GET({
      url: "epSaleGoods/" + numId + "/" + gId,
      params: {},
      success: (res) => {
        console.log(res.data.data)
        if (res.data.code == 200) {
          var epSaleGoods = res.data.data
          wx.setNavigationBarTitle({
            title: epSaleGoods.num + "--竞拍"
          })
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
    console.log(stepper)
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
          this.data.epSaleGoods.gEndTime = goodsAuctionList[0].endTime.time,//设置最新的结束时间
            this.data.stepper.stepper = parseFloat((parseFloat(goodsAuctionList[0].price) + parseFloat(this.data.epSaleGoods.gPriceUp)).toFixed(2))//计数器加值
          this.data.stepper.min = parseFloat((parseFloat(goodsAuctionList[0].price) + parseFloat(this.data.epSaleGoods.gPriceUp)).toFixed(2))//计数器最小值
          this.data.epSaleGoods.currentPrice = goodsAuctionList[0].price,  //最高价
            // this.data.epSaleGoods.priceCount = this.data.epSaleGoods.priceCount + 1 //次数加1
            this.data.epSaleGoods.priceCount = res.data.data.priceCount,
            // this.data.epSaleGoods.serviceTime = res.data.data.serviceTime,//待定
            this.setData({
              stepper: this.data.stepper,
              epSaleGoods: this.data.epSaleGoods,
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
            duration: 3000
          })
        }
      }
    })
  },
  //定时器查出价数据
  getLatestGoodsAuctionList: function () {
    var goodsAuctionList = null;
    if (this.data.epSaleGoods.gSatus == 2 || this.data.lastRequest) {
      network.GET({
        url: "epSaleAuctions/" + this.data.numId + "/" + this.data.gId,
        params: {},
        success: (res) => {
          console.log(res)
          if (res.data.code == 200) {
            //判断是否有出价记录数据
            if (res.data.data.goodsAuctionList) {
              goodsAuctionList = res.data.data.goodsAuctionList.map(this.substring)
              this.data.epSaleGoods.gEndTime = goodsAuctionList[0].endTime//设置最新的结束时间
              var stepperValue = (parseFloat(goodsAuctionList[0].price) + parseFloat(this.data.epSaleGoods.gPriceUp))
              if (!this.data.getFocus && parseFloat(this.data.stepper.stepper) < parseFloat(stepperValue)) {
                this.data.stepper.stepper = parseFloat(stepperValue.toFixed(2))
              }
              this.data.stepper.min = parseFloat((parseFloat(goodsAuctionList[0].price) + parseFloat(this.data.epSaleGoods.gPriceUp)).toFixed(2))
              this.data.epSaleGoods.currentPrice = goodsAuctionList[0].price
            } else {
              goodsAuctionList = []
            }
            this.data.epSaleGoods.priceCount = res.data.data.priceCount || 0  //出价次数
            this.data.epSaleGoods.idDeposit = res.data.data.idDeposit       //是否支付保证金
            // this.data.epSaleGoods.serviceTime = res.data.data.serviceTime,//待定
            this.setData({
              epSaleGoods: this.data.epSaleGoods,
              goodsAuctionList: goodsAuctionList,
              stepper: this.data.stepper,
              goodsAuctionListFlag: false
            })
            if (this.data.epSaleGoods.gSatus == 3 && goodsAuctionList[0].orderId) {
              this.data.lastRequest = false;
              if (goodsAuctionList[0].consumerId == wx.getStorageSync("consumer_id") && goodsAuctionList[0].orderStatus == 1) {
                this.showModal();
              }
            }
            this.data.clearTimeoutgoodsAuctionList = setTimeout(this.getLatestGoodsAuctionList, 5000);

          }
        }
      })
    }

  }


})