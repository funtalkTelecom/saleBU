//index.js
//获取应用实例
const app = getApp()
var network = require("../../utils/network.js")

Page({
  data: {
    region: ['全国', '全国', '全国'],
    toView: '',
    posterList:[],//海报数据
    number0: [],
    number1: [],
    number2: [],
    number3: [],
    number4: [],
    limit:10,
    pageNumList: [{ pageNum: 1 }, { pageNum: 1 }, { pageNum: 1 }, { pageNum: 1 }, { pageNum: 1 }],
    totalList: []
  },

  onLoad: function (options) {
    let that = this
    let userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      wx.navigateTo({
        url: "/pages/authorize/index"
      })
    }
  },
  onShow: function () {
    this.setData({
      isPartner: wx.getStorageSync('isPartner')
    })
    network.GET({
      url: "poster",
      params: { pageNum: 1, limit: 999 },
      success: (res) => {
        if (res.data.code == 200) {
          this.setData({
            posterList: res.data.data.list
          })
        }
      }
    })
    this.getnumber(0);
    this.getnumber(1);
    this.getnumber(2);
    // this.getnumber(3);
    this.getnumber(4);

  },
  onShareAppMessage: function () {
    return network.share();
  },
  tapSearch: function () {
    // wx.navigateTo({ url: 'search' });
    wx.switchTab({
      url: 'search'
    })
  },
  
  //选择地区
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
    //重新拉取数据
  },
  //获取当前的位置信息，即经纬度
  loadLocation: function () {
    var page = this;
    wx.getLocation({
      type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function (res) {

        // success
        var latitude = res.latitude;
        var longitude = res.longitude;

        //获取城市
        page.loadCity(latitude, longitude);
      }
    })
  },
  //通过经纬度获取城市
  loadCity: function (latitude, longitude) {
    var page = this;
    //这个key是自己在http://apistore.baidu.com上申请的
    var key = "XSWBZ-EVQ3V-UMLPA-U4TP6-6MQFZ-UUFSL";
    var url = "https://apis.map.qq.com/ws/geocoder/v1/?location=" + latitude + "," + longitude + "&key=" + key + "&get_poi=1";
    wx.request({
      url: url,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        var location = res.data.result.address_component
        page.setData({
          region: [location.province, location.city, location.district],
        })
      }
    })
  },
  scrollToViewFn: function (e) {
    // console.log(e.currentTarget.dataset.id)
    let id = e.currentTarget.dataset.id;
    this.setData({
      toView: id
    })
  },
  tapBanner: function (e) {
    wx.navigateTo({ url: 'product-page' });
  },
  getnumber:function(e){
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    network.GET({
      url: "number",
      params: { pageNum: this.data.pageNumList[e].pageNum, limit: this.data.limit,tags:e==0?"":e },
      success: (res) => {
        if (res.data.code == 200) {
          var num="number"+e
          var total = "totalList[" + e + "].total"
          this.setData({
            [num]: res.data.data.list,
            [total]: res.data.data.total
          })
        }
      },
      complete: function () {
        wx.hideLoading()
      }
    })
  },
  exchange:function(e){
    var tag = e.currentTarget.dataset.tag
    var str = "pageNumList[" + tag + "].pageNum"
    if (this.data.pageNumList[tag].pageNum * this.data.limit >= this.data.totalList[tag].total){
      this.setData({
        [str]: 1
      })
    }else{
      this.setData({
        [str]: ++this.data.pageNumList[tag].pageNum
      })
    }
    
    this.getnumber(e.currentTarget.dataset.tag)
  }
})
