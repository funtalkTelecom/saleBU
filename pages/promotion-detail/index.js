// pages/promotion/index.js
var network = require("../../utils/network.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    partnerObj: {},
    hasMore: true,
    pageNum: 0,
    limit: 20,
    shareBrowseList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPartner();
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
      shareBrowseList: []
    })
    this.loadMore()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.loadMore();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getPartner: function () {
    network.GET({
      url: "partner/user-info",
      params: {},
      success: (res) => {
        if (res.data.code == 200) {
          this.setData({
            partnerObj: res.data.data
          })
        }
      }
    })
  },
  loadMore: function () {
    // 2.2如果没有更多数据，就直接返回
    if (!this.data.hasMore) return;
    network.GET({
      url: "share-browse",
      params: {
        pageNum: ++this.data.pageNum,
        limit: this.data.limit
      },
      success: (res) => {
        var shareBrowseList = this.data.shareBrowseList.concat(res.data.list);
        var count = parseInt(res.data.total);
        var flag = this.data.pageNum * this.data.limit < count;
        this.setData({
          shareBrowseList: shareBrowseList,
          hasMore: flag,
        })
      }

    })
  }
})