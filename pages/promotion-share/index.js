// pages/promotion-share/index.js
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
    shareList: [],
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
      shareList: []
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
  toDel: function (e) {
    wx.showModal({
      title: '提示',
      content: '确定删除该条分享记录？',
      success: (res) => {
        if (res.confirm) {
          network.POST({
            url: "partner/share-del",
            params: { share_id: e.currentTarget.dataset.shareid },
            success: (res) => {
              if (res.data.code == 200) {
                wx.showToast({
                  title: res.data.data,
                  icon: 'success',
                  duration: 2000
                })
                this.setData({
                  pageNum: 0,
                  shareList: [],
                  hasMore: true
                })
                this.loadMore()
              } else {
                util.showToast(res.data.data)
              }
            }
          })
        }
      }
    })
  },
  toPromotionDel: function () {
    wx.navigateTo({
      url: '/pages/promotion-detail/index'
    })
  },
  torem: function (e) {
    wx.navigateTo({
      url: '/pages/promotion-num/index?numid=' + e.currentTarget.dataset.sharenumid
    })
  },
  loadMore: function () {
    // 2.2如果没有更多数据，就直接返回
    if (!this.data.hasMore) return;
    network.GET({
      url: "partner/share",
      params: {
        pageNum: ++this.data.pageNum,
        limit: this.data.limit
      },
      success: (res) => {
        res.data.list.forEach(function (item) {
          item.share_num = item.share_num.substring(0, 3) + '-' + item.share_num.substring(3, 7) + '-' + item.share_num.substring(7, 11)
          // if (item.valid_date){
          //   item.valid_date = util.formatDate(new Date(item.valid_date))
          // }
          // item.share_date = util.formatDate(new Date(item.share_date))
        })
        var shareList = this.data.shareList.concat(res.data.list);
        var count = parseInt(res.data.total);
        var flag = this.data.pageNum * this.data.limit < count;
        this.setData({
          shareList: shareList,
          hasMore: flag,
        })
      }

    })
  }
})