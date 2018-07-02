// pages/case-deposit/index.js
var network = require("../../utils/network.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasMore: true,
    pageNum: 0,
    limit: 15,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadMoreOrder()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
  // 触底加载更多
  onReachBottom: function () {
    this.loadMoreOrder();
  },
  loadMoreOrder: function (e) {
    if (!this.data.hasMore) return;
    network.GET({
      url: "epSaleAuctionDeposits",
      params: { pageNum: ++this.data.pageNum, limit: this.data.limit},
      success: (res) => {
        console.log(res)
        if (res.data.code == 200) {
          var auctionDepositList = res.data.data.auctionDepositList.list
          // var total = "totalList[" + e + "].total"
          var count = parseInt(res.data.data.auctionDepositList.total);
          var flag = this.data.pageNum * this.data.limit < count;
          this.setData({
            auctionDepositList: auctionDepositList,
            hasMore: flag,
          })
        }
      }
    })
  }

})