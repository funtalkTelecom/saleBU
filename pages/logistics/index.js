// pages/logistics/index.js
var network = require("../../utils/network.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    logistics:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getLogistics(options.orderid);
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getLogistics:function(id){
    network.GET({
      url: "order-express?order_id=" + id  ,
      params: {},
      success: (res) => {
        if (res.data.code == 200) {
          console.log(res.data)
          this.setData({
           logistics: res.data.data
         })
        }else{
          wx.showToast({
            title: res.data.data,
            duration: 2000,
            image: "../../imgs/personal/error.png",
            // complete: function () {
            //   wx.navigateBack({
            //     delta: 1
            //   })
            // }
          })
        }
      }
    })
  //   var res = { "code": 200, "data": { "number": "465518261654", "type": "SFEXPRESS", "deliverystatus": "已签收", "expName": "顺丰快递", "expSite": "www.sf-express.com ", "expPhone": "95338", "list": [{ "time": "2018-12-24 09:11:00", "status": "[呼和浩特市]代签收(金城菜鸟驿站 ),感谢使用顺丰,期待再次为您服务" }, { "time": "2018-12-24 07:55:00", "status": "[呼和浩特市]快件交给袁雪意，正在派送途中（联系电话：15044044144）" }, { "time": "2018-12-24 07:41:00", "status": "[呼和浩特市]正在派送途中,请您准备签收(派件人:袁雪意，电话:15044044144)" }, { "time": "2018-12-24 07:33:00", "status": "[呼和浩特市]快件到达 【呼和浩特赛罕区美地家园速运营业点】" }, { "time": "2018-12-24 06:19:00", "status": "[呼和浩特市]快件已发车" }, { "time": "2018-12-23 23:24:00", "status": "[呼和浩特市]快件在【呼和浩特新城集散中心】已装车,准备发往下一站" }, { "time": "2018-12-23 21:17:00", "status": "[呼和浩特市]快件到达 【呼和浩特新城集散中心】" }, { "time": "2018-12-23 17:53:00", "status": "[呼和浩特市]快件已发车" }, { "time": "2018-12-23 15:56:00", "status": "[呼和浩特市]快件到达 【呼和浩特总集散中心】" }, { "time": "2018-12-23 15:56:00", "status": "[呼和浩特市]快件在【呼和浩特总集散中心】已装车,准备发往 【呼和浩特新城集散中心】" }, { "time": "2018-12-23 03:53:00", "status": "[福州市]快件在【福州总集散中心】已装车,准备发往 【呼和浩特总集散中心】" }, { "time": "2018-12-23 01:58:00", "status": "[福州市]快件到达 【福州总集散中心】" }, { "time": "2018-12-23 01:04:00", "status": "[福州市]快件已发车" }, { "time": "2018-12-23 00:48:00", "status": "[福州市]快件在【福州尚干集散中心】已装车,准备发往 【福州总集散中心】" }, { "time": "2018-12-22 22:45:00", "status": "[福州市]快件到达 【福州尚干集散中心】" }, { "time": "2018-12-22 22:08:00", "status": "[福州市]快件已发车" }, { "time": "2018-12-22 20:30:00", "status": "[福州市]快件在【福州仓山机场路下濂营业点】已装车,准备发往 【福州尚干集散中心】" }, { "time": "2018-12-22 19:22:00", "status": "[福州市]顺丰速运 已收取快件" }, { "time": "2018-12-22 19:08:00", "status": "[福州市]顺丰速运 已收取快件" }] } };
            
  }
})