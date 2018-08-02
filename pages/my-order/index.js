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
    limit: 10,
    hasMore: true,
    order: [],
    textareaFlag:false,
    dialogpos:'',//遮罩获得焦点的样式
    textareaValue:'',
    checked:"checked"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      selectedId: options.tabtype
    })
    this.loadMoreOrder(options.tabtype,"up")
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    this.setData({
      pageNum: 0,
      order: [],
      hasMore: true
    })
    this.loadMoreOrder(this.data.selectedId, "down")
  },
  // 触底加载更多
  onReachBottom: function () {
    this.loadMoreOrder(this.data.selectedId,"up");
  },
  handleTabChange: function (e) {
    this.setData({
      selectedId: e.detail,
      pageNum: 0,
      order: [],
      hasMore: true
    })
    this.loadMoreOrder(e.detail,"up")
  },
  loadMoreOrder: function (e, touchType) {
    if (!this.data.hasMore) return;
    network.GET({
      url: "order",
      params: { pageNum: ++this.data.pageNum, limit: this.data.limit, status: e },
      success: (res) => {
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
      },
      complete:(res)=>{
        if (touchType=="down"){
          wx.hideNavigationBarLoading(); 
          wx.stopPullDownRefresh();
        }
      }
    })
  },
  // 时间和订单状态格式化
  formatTime: function (element) {
    element.addDate = util.formatTime(new Date(element.add_date))
    element.money = (element.total - element.gDeposit).toFixed(2)
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
  },
  //签收
  sureharvest:function(e){
    // e.currentTarget.dataset.id
    // e.currentTarget.dataset.index
    wx.showModal({
      content: '您确认签收此订单吗？',
      success:  (res) =>{
        if (res.confirm) {
          network.POST({
            url: "orderSign",
            params: { orderId: e.currentTarget.dataset.id },
            success: (res) => {
              if (res.data.code == 200) {
                wx.showToast({
                  title: '操作成功',
                  icon: 'success',
                  duration: 2000
                })
                this.setData({
                  pageNum: 0,
                  order: [],
                  hasMore: true
                })
                this.loadMoreOrder(this.data.selectedId,"up")
              }else{
                wx.showToast({
                  title: res.data.data,
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          })
        } 
      }
    })
  },
  cancelOrder:function(){//显示遮罩
    this.setData({
      maskFlag: true
    })
  },
  radioChange: function (e) {//显示textarea
    if(e.detail.value==4){
      this.setData({
        textareaFlag:true,
        // radioValue: e.detail.value
      })
    }else{
      this.setData({
        textareaFlag: false,
        // radioValue: e.detail.value
      })
    }
  },
  hideMask: function () {//隐藏遮罩
    this.setData({
      maskFlag: false,
      textareaValue:'',
      textareaFlag: false,
      checked:"checked"
      // radioValue:1
    })
  },
  focusHandle:function(){//获得焦点
    this.setData({
      dialogpos:'dialogpos'
    })
  },
  blurHandle:function(){//失去焦点
    this.setData({
      dialogpos: ''
    })
  },
  formSubmit:function(e){//取消订单
    console.log(e)
  }
})