var network = require("../../utils/network.js")
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: {
      list: [{
        id: 1,
        title: '正在疯抢'
      }, {
        id: 2,
        title: '下期预告'
      }]
    },
    selectedId: 1,
    limit: 10,
    pageNum: 0,
    text:["抢购中","距离结束"],
    hasMore: true,
    date:{},
    numList:[],
    interval:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  handleTabChange: function (e) {
    clearInterval(this.data.interval)
    var arr
    if (e.detail === 1) {
      arr = ["抢购中", "距离结束"]
    } else if (e.detail === 2) {
      arr = ["即将开始", "距离开始"]
    }
    this.data.pageNum= 0,
    this.data.numList = [],
    this.data.hasMore =true
    this.setData({
      selectedId: e.detail,
      text:arr
    }) 
    this.loadMoreList();
    this.getActiveDate()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.loadMoreList()
    this.getActiveDate()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.interval);
    this.data.hasMore=true;
    this.data.pageNum= 0;
    this.data.numList= [];

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
    this.loadMoreList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  loadMoreList: function (e) {
    if (!this.data.hasMore) return;
    network.GET({
      url: "numberSeckillList",
      params: { pageNum: ++this.data.pageNum, limit: this.data.limit, falg: this.data.selectedId},
      success: (res) => {
        if (res.data.code == 200) {
          var numList = this.data.numList.concat(res.data.data.list)
          var count = parseInt(res.data.data.total);
          var flag = this.data.pageNum * this.data.limit < count;
          this.setData({
            numList: numList,
            hasMore: flag,
          })
        }
      }
    })
  },
  getActiveDate:function(){
    var that=this;
    network.GET({
      url: "seckillListTime",
      params: { falg: this.data.selectedId },
      success: (res) => {
        if (res.data.code == 200) {
          var date={}
          var enddatetext
          date.beginDate = new Date(res.data.data.beginDate).getTime()
          date.endDate = new Date(res.data.data.endDate).getTime()
          date.newDate = new Date(res.data.data.newDate).getTime()
          if (that.data.selectedId===1){
            enddatetext = util.parseIntDayTime((date.endDate - date.newDate) / 1000)
          } else if (that.data.selectedId === 2){
            enddatetext = util.parseIntDayTime((date.beginDate - date.newDate) / 1000)
          }
          that.setData({ date, enddatetext})
          that.setInterval()
        }
      }
    })
  },
  setInterval: function () {
    var that = this;
    this.data.interval = setInterval(function () {
      that.data.date.newDate = that.data.date.newDate + 1000
      if (that.data.selectedId === 1) {
        if (that.data.date.endDate - that.data.date.newDate >= 0) {
          that.setData({
            enddatetext: util.parseIntDayTime((that.data.date.endDate - that.data.date.newDate) / 1000),  
          })
        }
        if (that.data.date.endDate - that.data.date.newDate < 0) {
        //请求新数据,如果还有就显示新数据，如果没有就显示没有数据了
          that.setData({
            pageNum: 0,
            numList: [],
            hasMore: true
          })
          clearInterval(that.data.interval)
          that.loadMoreList()
          that.getActiveDate()
        }
      } else if(that.data.selectedId === 2){
        if (that.data.date.beginDate - that.data.date.newDate >= 0) {
          that.setData({
            enddatetext: util.parseIntDayTime((that.data.date.beginDate - that.data.date.newDate) / 1000)
          })
        }
        if (that.data.date.beginDate - that.data.date.newDate<0) {
          //请求新数据,如果还有就显示新数据，如果没有就显示没有数据了
          that.setData({
            pageNum: 0,
            numList: [],
            hasMore: true
          })
          clearInterval(that.data.interval)
          that.loadMoreList()
          that.getActiveDate()
          
        }
      }

    }, 1000)
  }
})