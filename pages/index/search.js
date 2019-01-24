// pages/search/index.js
var network = require("../../utils/network.js")
var init_city = null;
var provinceData = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    featherIndex:0,
    tagIndex: 0,
    yysIndex: 0,
    multiIndex: [0, 0],
    selectaddr: "请选择",
    // numInputs: [false, false, false, false, false, false, false, false],
    numInputs: [{ value: "", focus: false }, { value: "", focus: false }, { value: "", focus: false }, { value: "", focus: false }, { value: "", focus: false }, { value: "", focus: false }, { value: "", focus: false }, { value: "", focus: false },],
    featherlist:[],
    taglist:[],
    yyslist:[],
    limit: 10,
    pageNum: 1,
    numList:[],
    nodata:false
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
    init_city = [provinceData, provinceData[0].cityList];
    this.setData({
      objectMultiArray: init_city,
      provinceData: provinceData
    })
    this.getparamet();
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
    this.setData({
      multiIndex:[0, 0],
      selectaddr: "请选择",
      province: "",
      provinceId: "",
      city: "",
      cityId: "",
      objectMultiArray: [this.data.provinceData, this.data. provinceData[0].cityList],
      featherIndex: 0,
      tagIndex: 0,
      yysIndex: 0,
      nodata:false
    })
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
  featherChange:function(e){
    this.setData({
      featherIndex: e.detail.value
    })
  },
  tagChange: function (e) {
    this.setData({
      tagIndex: e.detail.value
    })
  },
  yysChange: function (e) {
    this.setData({
      yysIndex: e.detail.value
    })
  },
  formSubmit(e) {
    this.setData({
      pageNum:1
    })
    var formData= e.detail.value
    if (this.data.featherlist[this.data.featherIndex].id!=-1){
      formData.feature = this.data.featherlist[this.data.featherIndex].keyValue
    } 
    if (this.data.taglist[this.data.tagIndex].id != -1) {
      formData.numTags = this.data.taglist[this.data.tagIndex].keyId
    }
    if (this.data.yyslist[this.data.yysIndex].id != -1) {
      formData.netType = this.data.yyslist[this.data.yysIndex].keyValue
    }
    var num="___"
    this.data.numInputs.forEach(function(item){
      if(item.value){
        num += item.value
      }else{
        num += "_"
      }
    })
    if (num!="___________"){
      formData.num = num
    }
    if (formData.priceS && formData.priceE){
      formData.priceS=parseFloat(formData.priceS)
      formData.priceE=parseFloat(formData.priceE)
      if (formData.priceS > formData.priceE){
        let temp=formData.priceS
        formData.priceS = formData.priceE
        formData.priceE = temp
      }
    }
    if (this.data.cityId){
      formData.cityCode = this.data.cityId
    }
    if (this.data.provinceId) {
      formData.provinceCode = this.data.provinceId
    }
    this.formData = formData
    this.searchNumber()

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
  // test:function(e){
  //   if (e.detail.value){
  //     if (e.currentTarget.dataset.index < this.data.numInputs.length-1){
  //       var list=this.data.numInputs.map(function(item){
  //          return item=false
  //       })
  //       list[e.currentTarget.dataset.index+1]=true
  //       // this.data.numInputs[e.currentTarget.dataset.index + 1] = true
  //       // this.data.numInputs[e.currentTarget.dataset.index ] = false
  //       // var list = this.data.numInputs
  //       this.setData({
  //         numInputs:list
  //       })
  //     }
  //   }else{
  //     console.log(1)
  //   }
  // },
  test: function (e) {
    if (e.detail.value) {
      var list = this.data.numInputs.map(function (item) {
        item.focus = false
        return item
      })
      if (e.currentTarget.dataset.index < this.data.numInputs.length - 1) {
        list[e.currentTarget.dataset.index + 1].focus = true
      }
      list[e.currentTarget.dataset.index].value = e.detail.value
      this.setData({
        numInputs: list
      })
    } else {
      var list = this.data.numInputs
      list[e.currentTarget.dataset.index].value = ""
      this.setData({
        numInputs: list
      })
    }
  },
  test1: function (e){
    var list = this.data.numInputs
    list[e.currentTarget.dataset.index].focus = true
    this.setData({
      numInputs: list
    })
  },
  test2: function (e) {
    var list = this.data.numInputs
    list[e.currentTarget.dataset.index].focus = false
    this.setData({
      numInputs: list
    })
  },
  getparamet: function (e) {
    network.GET({
      url: "find-all",
      params: {},
      success: (res) => {
        if (res.data.code == 200) {
          res.data.data.featherlist.unshift({ id: -1, keyValue: "请选择" }),
          res.data.data.taglist.unshift({ id: -1, keyValue: "请选择" }),
          res.data.data.yyslist.unshift({ id: -1, keyValue: "请选择" }),
          this.setData({
            featherlist: res.data.data.featherlist,
            taglist: res.data.data.taglist,
            yyslist: res.data.data.yyslist
          })
        }
      }
    })
  },
  searchNumber:function(){
    this.formData.pageNum = this.data.pageNum,
    this.formData.limit = this.data.limit,
      wx.showLoading({
        title: '加载中',
      })
    network.GET({
      url: "search-number",
      params: this.formData,
      success: (res) => {
        if (res.data.code == 200) {
          var nodata=false
          if (res.data.data.list.length==0){
              nodata=true
          }
          wx.hideLoading()
          this.setData({
            total: res.data.data.total,
            numList: res.data.data.list,
            nodata: nodata
          })
        }
      }
    })
  },
  exchange: function () {
    if (this.data.pageNum * this.data.limit >= this.data.total) {
      this.setData({
        pageNum: 1
      })
    } else {
      this.setData({
        pageNum: ++this.data.pageNum
      })
    }
    this.searchNumber()
  }
})