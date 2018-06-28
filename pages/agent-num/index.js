// pages/agent-num/index.js
var network = require("../../utils/network.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: {
      list: [{
        id: 1,
        title: '未绑定'
      }, {
        id: 2,
        title: '已绑定'
      }]
    },
    selectedId:1,
    showBottomPopup: false,
    pageNum: 0,
    limit: 5,
    hasMore: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadMoreOrder();
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

  loadMoreOrder: function (e) {
    if (!this.data.hasMore) return;
    network.GET({
      url: "numUnBoundList",
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
      selectedId: e.detail
    })
  },
  binding:function(e){
    this.initNumber(e.currentTarget.dataset.id)
    this.initMeal(e.currentTarget.dataset.id)
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
    this.setData({
      showBottomPopup: !this.data.showBottomPopup
    });
  },
  // form表单提交事件
  formSubmit: function (e) {
    var formData = e.detail.value;
    if (!formData.iccidId) {
      wx.showToast({
        title: '请输入绑定的ICCID',
        icon: 'none',
        duration: 2000
      })
      return
    }
    
    // formData.provinceId = this.data.provinceId;
    // formData.cityId = this.data.cityId;
    // formData.districtId = this.data.districtId;
    
    // network.POST({
    //   url: "deliveryAddress",
    //   params: formData,
    //   success: (res) => {
    //     if (res.data.code == 200) {
    //       wx.showToast({
    //         title: '操作成功',
    //         icon: 'success',
    //         duration: 2000,
    //         success: function (res) {
    //           wx.navigateBack();
    //         }
    //       })
    //     }
    //   }
    // })
  }
})