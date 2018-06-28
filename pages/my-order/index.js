// pages/my-order/index.js
var network = require("../../utils/network.js");
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: {
      list: [{
        id: 0,
        title: '全部'
      }, {
        id: 1,
        title: '待付款'
      }, {
        id: 2,
        title: '待发货'
      }, {
        id: 3,
        title: '待收货'
      }, {
        id: 4,
        title: '已完成'
      }]
    },
    selectedId: 0,
    showBottomPopup: false,
    pageNum: 0,
    limit: 5,
    hasMore: true,
    order: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      selectedId: options.tabtype
    })
    this.loadMoreOrder(options.tabtype)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  // 触底加载更多
  onReachBottom: function () {
    this.loadMoreOrder(this.data.selectedId);
  },
  handleTabChange: function (e) {
    this.setData({
      selectedId: e.detail,
      pageNum: 0,
      order: [],
      hasMore: true
    })
    this.loadMoreOrder(e.detail)
  },
  loadMoreOrder: function (e) {
    if (!this.data.hasMore) return;
    network.GET({
      url: "order",
      params: { pageNum: ++this.data.pageNum, limit: this.data.limit, status: e },
      success: (res) => {
        console.log(res)
        if (res.data.code == 200) {
          var orders = this.data.order.concat(res.data.data.list.map(this.formatTime))
          // var total = "totalList[" + e + "].total"
          var count = parseInt(res.data.data.total);
          var flag = this.data.pageNum * this.data.limit < count;
          this.setData({
            order: orders,
            hasMore: flag,
          })
        }
      }
    })
  },
  // 时间和订单状态格式化
  formatTime: function (element) {
    element.addDate = util.formatTime(new Date(element.add_date))
    element.orderText = util.orderText(element.status)
    return element
  },
  // 去订单详情
  orderdetail: function (e) {
    wx.navigateTo({
      url: '/pages/order-detail/index?id=' + e.currentTarget.dataset.id
    });
  },
  // 去支付
  topay: function (e) {
    if (e.currentTarget.dataset.ordertype==3){
      wx.navigateTo({
        url: '/pages/auction/auction-pay?orderId=' + e.currentTarget.dataset.id,
      })
    }else{
      wx.navigateTo({
        url: '/pages/product-pay/index?orderid=' + e.currentTarget.dataset.id
      });
    }
  }
})