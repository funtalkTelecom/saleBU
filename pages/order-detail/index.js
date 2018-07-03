// pages/order-detail/index.js
var network = require("../../utils/network.js");
const util = require('../../utils/util.js')
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
    this.initOrderDetail(options.id);
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
  initOrderDetail:function(id){
    network.GET({
      url: "order/"+id,
      params: {},
      success: (res) => {
        console.log(res.data.data)
        if (res.data.code == 200) {
          // console.log(this.formatTime(res.data.data.order))
         this.setData({
           order: this.formatTime(res.data.data.order),
           orderItem: res.data.data.orderItem.map(this.formatName)
         })
        }
      }
    })
  },
  // 时间和订单状态格式化
  formatTime: function (element) {
    // element.addDate = util.formatTime(new Date(element.addDate))
    // element.payDate = util.formatTime(new Date(element.payDate))
    element.orderText = util.orderText(element.status)
    return element
  },
  formatName:function(item){
    if (item.skuGoodsType == 1||item.skuGoodsType==2){
      item.productName = item.itemName
    } else if (item.skuGoodsType == 3 || item.skuGoodsType == 4){
      item.productName = item.num
    }
    return item
  }
})