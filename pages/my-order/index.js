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
    textareaFlag: false,
    dialogpos: '',//遮罩获得焦点的样式
    textareaValue: '',
    checked: "checked",
    rodioList: [{ value: 0, checked: "checked", textarea: "1、操作错误(商品、地址选错)"},
      { value: 1, checked: false, textarea: "2、其他渠道有更低的价格" },
      { value: 2, checked: false, textarea: "3、暂时不想买了" },
      { value: 3, checked: false, textarea: "4、重复下单或者误下单" },
      { value: 4, checked: false, textarea: "5、其他原因" }],
  },
  /**
   *  点击返回清除计时器
   */
  onUnload:function(){
    this.qingchu()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      selectedId: options.tabtype
    })
    // this.loadMoreOrder(options.tabtype, "up")
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.loadMoreOrder(this.data.selectedId, "up")
  },
  /**
   *  打开新页面清除计时器
   */
  onHide: function () {
    this.setData({
      pageNum: 0,
      order: [],
      hasMore: true
    })
    this.qingchu()
  },
  /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
  onPullDownRefresh: function () {
    this.qingchu()
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
    this.loadMoreOrder(this.data.selectedId, "up");
  },
  handleTabChange: function (e) {
    this.qingchu()
    this.setData({
      selectedId: e.detail,
      pageNum: 0,
      order: [],
      hasMore: true
    })
    this.loadMoreOrder(e.detail, "up")
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
          this.order = orders
          this.setData({
            order: orders,
            hasMore: flag,
          })
          for (var i = 0; i < this.order.length; i++) {
            if (this.order[i].djs > 0) {
              this.Countdown(i, this.order[i].djs)
            }
          }
        }
      },
      complete: (res) => {
        if (touchType == "down") {
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
    element.djs = ((element.add_date + 3600000) - (Date.now())) / 1000
    var djs = ((element.add_date + 3600000) - (Date.now())) / 1000
    if (djs > 0) {                                 // 倒计时时间是否大于0
      element.endDate = util.parseIntDayTime(djs)
    } else {
      element.endDate = ['00', '00', '00']
    }
    return element
  },
  // 倒计时
  Countdown:function(i,num){
    var that = this
    // console.log(num)
    this.data['timer'+i] = setTimeout(function () {
        if(num>0){
          that.Countdown(i,(num-1))
          that.order[i].djs = num-1
          that.order[i].endDate = util.parseIntDayTime(num-1)
          that.setData({
            order: that.order
          })
        }
      }, 1000);
  },
  // 清除倒计时计时器
  qingchu: function(){
    for (var i = 0; i < this.order.length; i++) {
      if (this.order[i].djs > 0) {
        clearTimeout(this.data['timer' + i])
      }
    }
  },
  // 去订单详情
  orderdetail: function (e) {
    wx.navigateTo({
      url: '/pages/order-detail/index?id=' + e.currentTarget.dataset.id
    });
  },
  // 去支付
  topay: function (e) {
    if (e.currentTarget.dataset.ordertype == 3) {
      wx.navigateTo({
        url: '/pages/auction/auction-pay?orderId=' + e.currentTarget.dataset.id,
      })
    } else {
      wx.navigateTo({
        url: '/pages/product-pay/index?orderid=' + e.currentTarget.dataset.id
      });
    }
  },
  tologistics: function (e){
    wx.navigateTo({
      url: '/pages/logistics/index?orderid=' + e.currentTarget.dataset.id
    });
  },
  //签收
  sureharvest: function (e) {
    // e.currentTarget.dataset.id
    // e.currentTarget.dataset.index
    wx.showModal({
      content: '您确认签收此订单吗？',
      success: (res) => {
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
                this.loadMoreOrder(this.data.selectedId, "up")
              } else {
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
  cancelOrder: function (e) {//显示遮罩
    this.setData({
      maskFlag: true,
      cancelOrderId: e.currentTarget.dataset.id
    })
  },
  radioChange: function (e) {//显示textarea
    if (e.detail.value == this.data.rodioList[this.data.rodioList.length-1].value) {
      this.setData({
        textareaFlag: true,
        // radioValue: e.detail.value
      })
    } else {
      this.setData({
        textareaFlag: false,
        // radioValue: e.detail.value
      })
    }
  },
  hideMask: function () {//隐藏遮罩
    var arr=this.data.rodioList.map(function(item){
      item.checked=false
      return item
    })
    arr[0].checked = "checked"
    this.setData({
      maskFlag: false,
      textareaValue: '',
      textareaFlag: false,
      checked: "checked",
      cancelOrderId: null,
      rodioList: arr
      // radioValue:1
    })
  },
  focusHandle: function () {//获得焦点
    this.setData({
      dialogpos: 'dialogpos'
    })
  },
  blurHandle: function () {//失去焦点
    this.setData({
      dialogpos: ''
    })
  },
  formSubmit: function (e) {//取消订单请求
    var radiovalue=e.detail.value.radio
    var rodioList = this.data.rodioList
    var textarea = rodioList[radiovalue].textarea
    var index=textarea.indexOf("、")
    var reason=textarea.substring(index+1)
    if (radiovalue == rodioList[rodioList.length - 1].value){
      if(e.detail.value.textarea){
        reason = e.detail.value.textarea
      }else{
        wx.showToast({
          icon:'none',
          title: '请填写其他原因',
        })
        return
      }
    }
    network.GET({
      url: "cancel-order",
      params: { orderId: this.data.cancelOrderId, reason: reason },
      success: (res) => {
        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.data,
            icon: 'success',
            duration: 2000
          })
          this.hideMask();
          this.setData({
            pageNum: 0,
            order: [],
            hasMore: true
          })
          this.loadMoreOrder(this.data.selectedId, "up")
        } else {
          wx.showToast({
            title: res.data.data,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  }
})