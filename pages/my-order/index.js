// pages/my-order/index.js
var network = require("../../utils/network.js");
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
        title: '代付款'
      }, {
        id: 2,
        title: '代发货'
      }, {
        id: 3,
        title: '代收货'
      }, {
        id: 4,
        title: '已完成'
      }]
    },
    selectedId: 0,
    showBottomPopup: false,
    pageNumList: [{ pageNum: 1 }, { pageNum: 1 }, { pageNum: 1 }, { pageNum: 1 }, { pageNum: 1 }],
    totalList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      selectedId: options.tabtype
    })
    this.initOrder()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  handleTabChange: function (e) {
    this.setData({
      selectedId: e.detail
    })
    console.log(e.detail)
    if (e.detail == 1) {
      console.log("a")
    } else if (e.detail == 2) {
      console.log("b")
    }
  },
  initOrder:function(){
    network.GET({
      url: "order?pageNum=1&limit=15",
      params: {},
      success: (res) => {
        if (res.data.code == 200) {
         console.log(res)

        }
      }
    })
  }
})