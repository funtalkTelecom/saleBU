var network = require("../../utils/network.js");
const Toptips = require('../../dist/toptips/index');
var init_city=null;
var provinceData =null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    multiIndex: [0, 0, 0],
    selectaddr: "请选择",
    // objectMultiArray: init_city,
    province: '',
    city: '',
    district: '',
    provinceId: '',
    cityId: '',
    districtId: '',
    provinceObj: {},
    cityObj: {},
    districtObj: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    provinceData = wx.getStorageSync('provinceData');
    if (!provinceData) return
    init_city = [provinceData, provinceData[0].cityList, provinceData[0].cityList[0].districtList];
    this.setData({
      objectMultiArray: init_city,
    })
    if (options.id) {
      // 有id时获取地址对象
      network.GET({
        url: "deliveryAddress/" + options.id,
        params: {},
        success: (res) => {
          if (res.data.code == 200) {
            this.setDBSaveAddressId(res.data.data[0]);
            var init_city = [provinceData, provinceData[this.data.selProvinceIndex].cityList, provinceData[this.data.selProvinceIndex].cityList[this.data.selCityIndex].districtList];
            var multiIndex = [this.data.selProvinceIndex, this.data.selCityIndex, this.data.selDistrictIndex];
            this.setDBSelectAddress(multiIndex);
            this.setData({
              objectMultiArray: init_city,
              multiIndex: multiIndex,
              addressObj: res.data.data[0]
            })

          }
        }
      })
    }
  },
  // form表单提交事件
  formSubmit: function (e) {
    var formData = e.detail.value;
    if (!formData.personName) {
      Toptips('请输入收货人姓名');
      return
    }
    if (!formData.personTel) {
      Toptips('请输入联系方式');
      return
    }
    if (!this.data.provinceId) {
      Toptips('请选择省份');
      return
    }
    if (!this.data.cityId) {
      Toptips('请选择城市');
      return
    }
    if (!this.data.districtId) {
      Toptips('请选择地区');
      return
    }
    if (!formData.address) {
      Toptips('请输入详细地址');
      return
    }
    formData.provinceId = this.data.provinceId;
    formData.cityId = this.data.cityId;
    formData.districtId = this.data.districtId;
    if (this.data.addressObj) {
      formData.id = this.data.addressObj.id;
    }
    network.POST({
      url: "deliveryAddress",
      params: formData,
      success: (res) => {
        if (res.data.code == 200) {
          wx.showToast({
            title: '操作成功',
            icon: 'success',
            duration: 2000,
            success: function (res) {
              wx.navigateBack();
            }
          })
        }
      }
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
  // 修改地址时获得省市区的索引，传当前地址对象
  setDBSaveAddressId: function (data) {
    for (var i = 0; i < provinceData.length; i++) {
      if (data.provinceId == provinceData[i].id) {
        this.data.selProvinceIndex = i;
        for (var j = 0; j < provinceData[i].cityList.length; j++) {
          if (data.cityId == provinceData[i].cityList[j].id) {
            this.data.selCityIndex = j;
            for (var k = 0; k < provinceData[i].cityList[j].districtList.length; k++) {
              if (data.districtId == provinceData[i].cityList[j].districtList[k].id) {
                this.data.selDistrictIndex = k;
              }
            }
          }
        }
      }
    }
  },
  // 选择省市区时设置省市区id,传索引
  setDBSelectAddress: function (e) {
    var provinceObj = provinceData[e[0]];
    var cityObj = provinceObj.cityList[e[1]];
    var districtObj = cityObj.districtList[e[2]];
    this.setData({
      province: provinceObj.name,
      provinceId: provinceObj.id,
      city: cityObj.name,
      cityId: cityObj.id,
      district: districtObj.name,
      districtId: districtObj.id,
      selectaddr: provinceObj.name + "," + cityObj.name + "," + districtObj.name
    })
  }
})