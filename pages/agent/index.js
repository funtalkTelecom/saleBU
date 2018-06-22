// pages/agent/index.js
var network = require("../../utils/network.js")
const Toptips = require('../../dist/toptips/index');
var init_city = null;
var provinceData = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    multiIndex: [0, 0, 0],
    selectaddr: "请选择",
    // objectMultiArray: init_city,
    avatarUrl: null,
    showBottomPopup: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    provinceData = wx.getStorageSync('provinceData');
    console.log(provinceData)
    if (!provinceData) return
     init_city = [provinceData, provinceData[0].cityList, provinceData[0].cityList[0].districtList];
     this.setData({
       objectMultiArray: init_city,
     })
    network.GET({
      url: "query-agent_by_consumerid" ,
      params: {},
      success: (res) => {
        if(res.data.code == 200) {
          if(res.data.data.isAgent=="true"){
            this.setData({
              agentObj: res.data.data,
              selectaddr: res.data.data.provinceName + "," + res.data.data.cityName + "," + res.data.data.districtName,
              avatarUrl: res.data.data.tradingImgUrl
            })
          }
        }
      }
    })
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  selectimg: function () {
    var that = this;
    wx.chooseImage({
      // 设置最多可以选择的图片张数，默认9,如果我们设置了多张,那么接收时//就不在是单个变量了,
      count: 1,
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        console.log(res)
        // 获取成功,将获取到的地址赋值给临时变量
        // var tempFilePaths = res.tempFilePaths;
        that.setData({
          tempFilePaths:res.tempFilePaths,
          //将临时变量赋值给已经在data中定义好的变量
          avatarUrl: res.tempFilePaths[0]
        })
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  },
  formSubmit: function (e) {
    var formData = e.detail.value;
    if (!formData.commpayName) {
      Toptips('请输入公司名称');
      return
    }
    if (!formData.person) {
      Toptips('请输入法人姓名');
      return
    }
    if (!formData.phone) {
      Toptips('请输入联系方式');
      return
    }
    if (!this.data.province) {
      Toptips('请选择省份');
      return
    }
    if (!this.data.city) {
      Toptips('请选择城市');
      return
    }
    if (!this.data.district) {
      Toptips('请选择地区');
      return
    }
    if (!formData.address) {
      Toptips('请输入详细地址');
      return
    }
    formData.province = this.data.province;
    formData.city = this.data.city;
    formData.district = this.data.district;
    wx.uploadFile({
      url: getApp().globalData.API_URL + "save-or-update-agent?__sessid=" + wx.getStorageSync("token"),
      filePath: this.data.tempFilePaths[0],
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data"
      },
      formData: formData,
      success: function (res) {
        console.log(res)
      }
    })

  },
  correlation: function (e) {
    var formData = e.detail.value;
    if (!formData.loginName) {
      Toptips('请输入乐语账号');
      return
    }
    if (!formData.pwd) {
      Toptips('请输入乐语密码');
      return
    }
    network.PUT({
      url: "save-agent-leyu",
      params: formData,
      success: (res) => {
        console.log(res);
        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.data,
            icon: 'success',
            duration: 2000,
            success:  (res)=> {
              this.setData({
                showBottomPopup: !this.data.showBottomPopup
              });
            }
          })
        }else{
          this.setData({
            showBottomPopup: !this.data.showBottomPopup
          });
          Toptips(res.data.data);
        }
      },
    })

  },
  toggleBottomPopup() {
    this.setData({
      showBottomPopup: !this.data.showBottomPopup
    });
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
      case 0://取1和2
        data.objectMultiArray[1] = provinceData[curr_value].cityList;
        data.objectMultiArray[2] = provinceData[curr_value].cityList[0].districtList;
        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        break;
      case 1://2
        data.objectMultiArray[2] = data.objectMultiArray[1][curr_value].districtList;
        data.multiIndex[2] = 0;
        break;
      case 2://不处理任何事务
        break;
    }
    this.setData(data)
  },
  // 选择省市区时设置省市区id,传索引
  setDBSelectAddress: function (e) {
    var provinceObj = provinceData[e[0]];
    var cityObj = provinceObj.cityList[e[1]];
    var districtObj = cityObj.districtList[e[2]];
    this.setData({
      province: provinceObj.id,
      city: cityObj.id,
      district: districtObj.id,
      selectaddr: provinceObj.name + "," + cityObj.name + "," + districtObj.name
    })
  }
})