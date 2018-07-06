// pages/agent-num/index.js
var network = require("../../utils/network.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: {
      list: [{
        id: 0,
        title: '未绑定'
      }, {
        id: 1,
        title: '已绑定'
      }]
    },
    selectedId:0,
    showBottomPopup: false,
    pageNum: 0,
    limit: 15,
    hasMore: true,
    iccidValue:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadMoreOrder(this.data.selectedId);
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
  
  },
  // 触底加载更多
  onReachBottom: function () {
    this.loadMoreOrder(this.data.selectedId);
  },
  loadMoreOrder: function (e) {
    if (!this.data.hasMore) return;
    network.GET({
      url: "numBoundList/"+e,
      params: { pageNum: ++this.data.pageNum, limit: this.data.limit },
      success: (res) => {
        console.log(res)
        if (res.data.code == 200) {
          var count = parseInt(res.data.data.total);
          var flag = this.data.pageNum * this.data.limit < count;
          this.setData({
            numberCard: res.data.data.list,
            hasMore: flag,
          })
        }
      }
    })
  },
  handleTabChange:function(e){
    this.setData({
      selectedId: e.detail,
      pageNum: 0,
      numberCard: [],
      hasMore: true
    })
    this.loadMoreOrder(e.detail)
  },
  binding:function(e){
    this.setData({
      index: e.currentTarget.dataset.index,
      numid: e.currentTarget.dataset.id
    })
    this.initNumber(e.currentTarget.dataset.id)
    this.initMeal(e.currentTarget.dataset.id)
    this.toggleBottomPopup()
  },
  initNumber: function (id) {
    network.GET({
      url: "number/" + id,
      params: {},
      success: (res) => {
        if (res.data.code == 200) {
          this.setData({
            numberObj: res.data.data
          })
        }
      }
    })
  },
  initMeal: function (id) {
    network.GET({
      url: "meal/n" + id,
      params: {},
      success: (res) => {
        if (res.data.code == 200) {
          this.setData({
            mealObj: res.data.data[0]
          })
        }
      }
    })
  },
  toggleBottomPopup() {
    if (!this.data.showBottomPopup){
      this.setData({
        iccidValue:''
      })
    }
    this.setData({
      showBottomPopup: !this.data.showBottomPopup
    });
  },
  // form表单提交事件
  formSubmit: function (e) {
    var formData = e.detail.value;
    if (!formData.iccid) {
      wx.showToast({
        title: '请输入绑定的ICCID',
        icon: 'none',
        duration: 2000
      })
      return
    }
    formData.id = this.data.numid;
    formData.mealMid = this.data.mealObj.mid;
    network.POST({
      url: "boundNum",
      params: formData,
      success: (res) => {
        console.log(res)
        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.data,
            icon: 'success',
            duration: 2000,
          })
          this.data.numberCard.splice(this.data.index, 1);
          this.setData({
            numberCard: this.data.numberCard
          })
          this.toggleBottomPopup();
          //刷新页面
        }else{
          wx.showToast({
            title: res.data.data,
            icon: 'none',
            duration: 2000,
          })
        }
      }
    })
  }
})