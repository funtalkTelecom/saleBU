// pages/search/index.js

var init_city = null;
var provinceData = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array:[{id:-1,value:"请选择"},{id:1,value:"aabb"},{id:2,value:"abab"},{id:3,value:"aaaa"}],
    index:0,
    multiIndex: [0, 0],
    selectaddr: "请选择",
    numInputs: [false, false, false, false, false, false, false, false]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    provinceData = wx.getStorageSync('provinceData');
    provinceData.forEach(function (item) {
      if (item.cityList.length>1){
        var obj = {};
        obj.districtList = [];
        obj.id = -1;
        obj.name = "全部";
        obj.pid = item.cityList[0].pid;
        item.cityList.unshift(obj)
      }
    })
    if (!provinceData) return
    init_city = [provinceData, provinceData[0].cityList,];
    this.setData({
      objectMultiArray: init_city,
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
  numTypeChange:function(e){
    this.setData({
      index: e.detail.value
    })
  },
  // 确定选择该地址
  bindMultiPickerChange: function (e) {
    var addrArrIndex = e.detail.value;
    this.setDBSelectAddress(addrArrIndex);

  },
  // 选择地址时联动
  bindMultiPickerColumnChange: function (e) {
    var curr_column = e.detail.column;
    var curr_value = e.detail.value;
    var data = {
      objectMultiArray: this.data.objectMultiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (curr_column) {
      case 0:  //取1和2
        data.objectMultiArray[1] = provinceData[curr_value].cityList;
        data.multiIndex[1] = 0;
        break;
      case 1:
        break;
    }
    this.setData(data)

  },
  // 选择省市区时设置省市区id,传索引
  setDBSelectAddress: function (e) {
    var provinceObj = provinceData[e[0]];
    var cityObj = provinceObj.cityList[e[1]];
    this.setData({
      province: provinceObj.name,
      provinceId: provinceObj.id,
      city: cityObj.name,
      cityId: cityObj.id,
      selectaddr: provinceObj.name + "," + cityObj.name 
    })
  },
  test:function(e){
    if (e.detail.value){
      if (e.currentTarget.dataset.index < this.data.numInputs.length-1){
        var list=this.data.numInputs.map(function(item){
           return item=false
        })
        list[e.currentTarget.dataset.index+1]=true
        // this.data.numInputs[e.currentTarget.dataset.index + 1] = true
        // this.data.numInputs[e.currentTarget.dataset.index ] = false
        // var list = this.data.numInputs
        this.setData({
          numInputs:list
        })
      }
    }else{
      console.log(1)
    }
  }
})