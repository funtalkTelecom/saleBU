// pages/product-num-detail/index.js
var network = require("../../utils/network.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasMore: true,
    pageNum: 0,
    limit:20,
    numberTypeList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    this.setData({
      hasMore: true,
      pageNum: 0,
      numberTypeList:[]

    })
    this.loadMore()
  },
  onReachBottom: function () {
    this.loadMore();
  },
  tonumcheck: function (e) {
    if (e.currentTarget.dataset.isagent == "1") {
      wx.navigateTo({
        url: "/pages/num-check/index?id=" + e.currentTarget.dataset.id
      })
    }
  },
  loadMore: function () {
    // 2.2如果没有更多数据，就直接返回
    if (!this.data.hasMore) return;
    network.GET({
      url: "numberTypeList",
      params: {
        pageNum:++this.data.pageNum,
        limit: this.data.limit,
        skuGoodsType:3
      },
      success: (res) => {
        if (res.data.code == 200) {
          var numberTypeList = this.data.numberTypeList.concat(res.data.data.list);
          var count = parseInt(res.data.data.total);
          var flag = this.data.pageNum * this.data.limit < count;
          this.setData({
            numberTypeList: numberTypeList,
            hasMore: flag,
          })
        }
      }
    })
  }
})