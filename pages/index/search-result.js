// pages/index/search-result.js
var network = require("../../utils/network.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phones: [
      { phone: 17001150202, price: 2000, desc: 189 },
      { phone: 17001020202, price: 5000, desc: 189 },
      { phone: 17001150202, price: 2000, desc: 189 },
      { phone: 17001020202, price: 5000, desc: 189 },
      { phone: 17001150202, price: 2000, desc: 189 },
      { phone: 17001020202, price: 5000, desc: 189 },
      { phone: 17001150202, price: 2000, desc: 189 },
      { phone: 17001020202, price: 5000, desc: 189 },
      { phone: 17001150202, price: 2000, desc: 189 },
      { phone: 17001020202, price: 5000, desc: 189 }
    ],
    lhType: -1,
    yysType: -1,
    searchPhone: "",
    flag: false,
    more: false,
    array: ['美1111111111国', '中国', '巴西', '日本'],
    index: 0,
    hasMore: true,
    pageNum: 0,
    limit: 20,
    numberTypeList: [],
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      searchPhone: options.searchPhone
    })
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
      numberTypeList: []

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
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  loadMore: function () {
    // 2.2如果没有更多数据，就直接返回
    if (!this.data.hasMore) return;
    network.GET({
      url: "fand-number",
      params: {
        pageNum: ++this.data.pageNum,
        limit: this.data.limit,
        num: this.data.searchPhone
      },
      success: (res) => {
        if (res.data.code == 200) {
          console.log(res)
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