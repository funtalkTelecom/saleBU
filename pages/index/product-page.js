// pages/index/product-page.js
var network = require("../../utils/network.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shoucang:false,
    pageNum: 0,
    limit: 10,
    hasMore: true,
    order: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadMoreOrder()
  },
  // 触底加载更多
  onReachBottom: function () {
    this.loadMoreOrder();
  },
  onShareAppMessage: function () {
    return network.share();
  },
  loadMoreOrder: function (e) {
    if (!this.data.hasMore) return;
    network.GET({
      url: "goods",
      params: { pageNum: ++this.data.pageNum, limit: this.data.limit },
      success: (res) => {
        if (res.data.code == 200) {
          var count = parseInt(res.data.data.total);
          var flag = this.data.pageNum * this.data.limit < count;
          this.setData({
            goodList: res.data.data.list,
            hasMore: flag,
          })
        }
      }
    })
  },
  collection:function(){
    let flag = !this.data.shoucang;
    this.setData({
      shoucang: flag
    })
  }
})